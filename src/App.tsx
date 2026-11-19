/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KineticLyricsOverlay } from './components/KineticLyricsOverlay';
import { MVAudioAnalyzer } from './mv/audioEngine';
import { MVCanvasRenderer } from './mv/canvasRenderer';
import {
  AUDIO_INTRO_SOUND_START_SEC,
  AUDIO_SRC,
  LYRIC_LINES,
  SONG_META,
  type CameraMode,
  type SubtitleMode,
} from './mv/mvData';
import {
  computeBeatState,
  getActiveChapter,
  getActiveLyricIndex,
  getAdjacentShotSeekTime,
  resolveActiveShot,
  resolveLyricStagePlacement,
  resolveShotSeekTimeByParam,
} from './mv/mvTimeline';

export default function App() {
  const { initialAutostart, initialSeekSec } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { initialAutostart: false, initialSeekSec: 0 };
    }
    const params = new URLSearchParams(window.location.search);
    const shotSeek = resolveShotSeekTimeByParam(params.get('s') ?? params.get('shot'));
    const rawT = params.get('t');
    const parsedT = rawT !== null ? Number(rawT) : NaN;
    const validT =
      shotSeek !== null
        ? shotSeek
        : Number.isFinite(parsedT) && parsedT >= 0
        ? Math.min(SONG_META.durationSec, parsedT)
        : 0;
    return {
      initialAutostart: params.get('autostart') === '1',
      initialSeekSec: validT,
    };
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialSeekSec);
  const [duration, setDuration] = useState<number>(SONG_META.durationSec);
  const [cameraMode] = useState<CameraMode>('auto');
  const subtitleMode: SubtitleMode = 'diegetic';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyzerRef = useRef<MVAudioAnalyzer | null>(null);
  const rendererRef = useRef<MVCanvasRenderer | null>(null);
  const wakeRenderRef = useRef<(() => void) | null>(null);

  const liveStateRef = useRef({
    isPlaying: false,
    virtualTime: initialSeekSec,
    usingVirtualClock: false,
    autoplayMutedFallback: false,
    cameraMode: 'auto' as CameraMode,
    subtitleMode: 'diegetic' as SubtitleMode,
    reducedMotion: false,
  });

  useEffect(() => {
    liveStateRef.current.cameraMode = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    liveStateRef.current.reducedMotion = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      liveStateRef.current.reducedMotion = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const startPlayback = useCallback(async (seekSec?: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    let targetTime =
      typeof seekSec === 'number' ? seekSec : liveStateRef.current.virtualTime;
    // Skip the MP3 studio master's 0.00s..2.92s silent pre-roll when starting from the beginning
    // so the opening acoustic guitar chord plays immediately inside S01!
    if (targetTime < AUDIO_INTRO_SOUND_START_SEC) {
      targetTime = AUDIO_INTRO_SOUND_START_SEC;
    }

    if (
      typeof seekSec === 'number' ||
      Math.abs(audio.currentTime - targetTime) > 0.08
    ) {
      audio.currentTime = targetTime;
    }
    liveStateRef.current.virtualTime = targetTime;
    setCurrentTime(targetTime);

    audio.volume = 1;
    audio.muted = false;
    liveStateRef.current.autoplayMutedFallback = false;

    try {
      await audio.play();
      liveStateRef.current.usingVirtualClock = false;
      liveStateRef.current.isPlaying = true;
      setIsPlaying(true);

      if (!analyzerRef.current) {
        analyzerRef.current = new MVAudioAnalyzer();
      }
      void analyzerRef.current.attach(audio);
    } catch {
      try {
        audio.muted = true;
        liveStateRef.current.autoplayMutedFallback = true;
        await audio.play();
        liveStateRef.current.usingVirtualClock = false;
        liveStateRef.current.isPlaying = true;
        setIsPlaying(true);
      } catch {
        liveStateRef.current.usingVirtualClock = true;
        liveStateRef.current.isPlaying = true;
        setIsPlaying(true);
      }
    }
    wakeRenderRef.current?.();
  }, []);

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    liveStateRef.current.isPlaying = false;
    setIsPlaying(false);
    wakeRenderRef.current?.();
  }, []);

  const togglePlay = useCallback(() => {
    if (liveStateRef.current.isPlaying) {
      pausePlayback();
    } else {
      void startPlayback();
    }
  }, [pausePlayback, startPlayback]);

  const seekTo = useCallback(
    (targetSec: number) => {
      const clamped = Math.max(0, Math.min(duration, targetSec));
      liveStateRef.current.virtualTime = clamped;
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = clamped;
      }
      setCurrentTime(clamped);
      wakeRenderRef.current?.();
    },
    [duration]
  );

  const triggerCenterSticker = useCallback(() => {
    rendererRef.current?.triggerStickerBurst(0.5, 0.48);
    wakeRenderRef.current?.();
  }, []);

  useEffect(() => {
    const unlockMutedFallbackOnGesture = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
        return;
      }
      const audio = audioRef.current;
      if (!audio) return;
      if (liveStateRef.current.autoplayMutedFallback) {
        audio.muted = false;
        audio.volume = 1;
        liveStateRef.current.autoplayMutedFallback = false;
        if (!analyzerRef.current) {
          analyzerRef.current = new MVAudioAnalyzer();
        }
        void analyzerRef.current.attach(audio);
      }
    };
    window.addEventListener('pointerdown', unlockMutedFallbackOnGesture);
    window.addEventListener('keydown', unlockMutedFallbackOnGesture);
    return () => {
      window.removeEventListener('pointerdown', unlockMutedFallbackOnGesture);
      window.removeEventListener('keydown', unlockMutedFallbackOnGesture);
    };
  }, []);

  useEffect(() => {
    if (initialAutostart) {
      void startPlayback(initialSeekSec);
    }
  }, [initialAutostart, initialSeekSec, startPlayback]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mvRenderer = new MVCanvasRenderer();
    rendererRef.current = mvRenderer;

    const isSoftwareRenderer = (() => {
      try {
        if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const gpu = String(
          probe.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER)
        );
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    let width = window.innerWidth;
    let height = window.innerHeight;
    const syncSize = () => {
      const dpr = isSoftwareRenderer ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wakeRenderRef.current?.();
    };
    syncSize();
    window.addEventListener('resize', syncSize);

    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let prevNow = performance.now();
    let lastUiSyncNow = 0;

    const scheduleNext = () => {
      if (disposed) return;
      const needsContinuous = liveStateRef.current.isPlaying || mvRenderer.hasActiveBursts();
      if (!needsContinuous) {
        return;
      }
      if (isSoftwareRenderer) {
        timerId = window.setTimeout(() => {
          timerId = 0;
          if (!disposed) rafId = requestAnimationFrame(loop);
        }, 42);
      } else {
        rafId = requestAnimationFrame(loop);
      }
    };

    const loop = (now: number) => {
      rafId = 0;
      if (disposed) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - prevNow) / 1000));
      prevNow = now;

      const audio = audioRef.current;
      let t = liveStateRef.current.virtualTime;

      if (
        audio &&
        liveStateRef.current.isPlaying &&
        !liveStateRef.current.usingVirtualClock &&
        !audio.paused
      ) {
        t = audio.currentTime;
        liveStateRef.current.virtualTime = t;
      } else if (liveStateRef.current.isPlaying) {
        t = Math.min(SONG_META.durationSec, t + dt);
        liveStateRef.current.virtualTime = t;
        if (t >= SONG_META.durationSec) {
          liveStateRef.current.isPlaying = false;
          setIsPlaying(false);
        }
      }

      const uiIntervalMs = isSoftwareRenderer ? 140 : 60;
      if (now - lastUiSyncNow > uiIntervalMs) {
        lastUiSyncNow = now;
        setCurrentTime(t);
      }

      const bands = analyzerRef.current?.sampleBands() ?? {
        bass: 0,
        mid: 0,
        high: 0,
        overall: 0,
        liveActive: false,
      };
      const chapter = getActiveChapter(t);
      const beat = computeBeatState(t, bands);

      mvRenderer.render(ctx, width, height, {
        timeSec: t,
        dt,
        isPlaying: liveStateRef.current.isPlaying,
        chapter,
        beat,
        bands,
        cameraMode: liveStateRef.current.cameraMode,
        subtitleMode: liveStateRef.current.subtitleMode,
        reducedMotion: liveStateRef.current.reducedMotion,
      });

      scheduleNext();
    };

    wakeRenderRef.current = () => {
      if (disposed || rafId !== 0) return;
      if (timerId !== 0) {
        clearTimeout(timerId);
        timerId = 0;
      }
      prevNow = performance.now();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    void document.fonts?.ready?.then(() => {
      wakeRenderRef.current?.();
    });

    return () => {
      disposed = true;
      wakeRenderRef.current = null;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      window.removeEventListener('resize', syncSize);
      analyzerRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName ?? '';
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekTo(getAdjacentShotSeekTime(liveStateRef.current.virtualTime, 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekTo(getAdjacentShotSeekTime(liveStateRef.current.virtualTime, -1));
      } else if (e.code === 'KeyB') {
        triggerCenterSticker();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [seekTo, togglePlay, triggerCenterSticker]);

  const activeChapter = useMemo(() => getActiveChapter(currentTime), [currentTime]);
  const activeLyricIndex = useMemo(() => getActiveLyricIndex(currentTime), [currentTime]);
  const activeLine = LYRIC_LINES[activeLyricIndex] ?? LYRIC_LINES[0];
  const nextLine =
    activeLyricIndex + 1 < LYRIC_LINES.length ? LYRIC_LINES[activeLyricIndex + 1] : null;
  const activeShotInfo = useMemo(
    () => resolveActiveShot(currentTime, cameraMode, computeBeatState(currentTime)),
    [cameraMode, currentTime]
  );
  const activePlacement = useMemo(
    () => resolveLyricStagePlacement(activeLine, activeShotInfo.shot, cameraMode),
    [activeLine, activeShotInfo.shot, cameraMode]
  );

  useEffect(() => {
    document.body.dataset.state = isPlaying ? 'playing' : 'paused';
    document.body.dataset.chapter = activeChapter.id;
    document.body.dataset.shot = activeShotInfo.shot;
    document.body.dataset.shotCode = activeShotInfo.shotCode;
    document.body.dataset.subtitleMode = subtitleMode;
    document.body.dataset.lyricZone = activePlacement.zone;
  }, [
    activeChapter.id,
    activePlacement.zone,
    activeShotInfo.shot,
    activeShotInfo.shotCode,
    isPlaying,
    subtitleMode,
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 select-none">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
          if (!liveStateRef.current.isPlaying && liveStateRef.current.virtualTime > 0) {
            e.currentTarget.currentTime = liveStateRef.current.virtualTime;
          }
        }}
        onSeeking={(e) => {
          const t = e.currentTarget.currentTime;
          if (
            Number.isFinite(t) &&
            Math.abs(t - liveStateRef.current.virtualTime) > 0.08
          ) {
            liveStateRef.current.virtualTime = t;
            setCurrentTime(t);
          }
        }}
        onPlay={() => {
          liveStateRef.current.isPlaying = true;
          setIsPlaying(true);
        }}
        onPause={() => {
          if (!liveStateRef.current.usingVirtualClock) {
            liveStateRef.current.isPlaying = false;
            setIsPlaying(false);
          }
        }}
        onEnded={() => {
          liveStateRef.current.isPlaying = false;
          setIsPlaying(false);
        }}
      />

      <div className="pointer-events-none fixed inset-x-0 top-3 z-30 flex justify-center">
        <span
          data-testid="shot-code-badge"
          aria-label={`当前分镜 ${activeShotInfo.shotCode}`}
          className="rounded border border-white/15 bg-zinc-950/65 px-2.5 py-0.5 font-mono-num text-xs sm:text-sm font-bold tracking-[0.16em] text-amber-300 shadow-md"
        >
          {activeShotInfo.shotCode}
        </span>
      </div>

      <main className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          data-testid="mv-canvas"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
            const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
            rendererRef.current?.triggerStickerBurst(nx, ny);
            wakeRenderRef.current?.();
          }}
          className="block w-full h-full cursor-crosshair"
        />

        <KineticLyricsOverlay
          activeLine={activeLine}
          nextLine={nextLine}
          placement={activePlacement}
        />
      </main>
    </div>
  );
}
