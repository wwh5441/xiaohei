/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DirectorDock } from './components/DirectorDock';
import { IntroPoster } from './components/IntroPoster';
import { KineticLyricsOverlay } from './components/KineticLyricsOverlay';
import { LyricsDrawer } from './components/LyricsDrawer';
import { MVAudioAnalyzer, loadEmbeddedCoverUrl } from './mv/audioEngine';
import { MVCanvasRenderer } from './mv/canvasRenderer';
import {
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
  getLyricProgress,
  resolveActiveShot,
  resolveLyricStagePlacement,
} from './mv/mvTimeline';

const HEADER_SCENE_LINKS = [
  { label: '弦动启程', time: 0 },
  { label: '安稳堡垒', time: 45.986 },
  { label: '暴雨延误', time: 78.905 },
  { label: '唯你念旧', time: 137.341 },
  { label: '尔似在肩', time: 165.468 },
] as const;

export default function App() {
  const { initialAutostart, initialHidePoster, initialSeekSec } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { initialAutostart: false, initialHidePoster: false, initialSeekSec: 0 };
    }
    const params = new URLSearchParams(window.location.search);
    const rawT = Number(params.get('t'));
    const validT =
      Number.isFinite(rawT) && rawT >= 0
        ? Math.min(SONG_META.durationSec, rawT)
        : 0;
    return {
      initialAutostart: params.get('autostart') === '1',
      initialHidePoster: params.get('poster') === '0',
      initialSeekSec: validT,
    };
  }, []);

  const [showPoster, setShowPoster] = useState(!(initialAutostart || initialHidePoster));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialSeekSec);
  const [duration, setDuration] = useState<number>(SONG_META.durationSec);
  const [cameraMode, setCameraMode] = useState<CameraMode>('auto');
  const [subtitleMode, setSubtitleMode] = useState<SubtitleMode>('cinema');
  const [isMuted, setIsMuted] = useState(false);
  const [dockRevealedWhilePlaying, setDockRevealedWhilePlaying] = useState(false);
  const [dockForceHidden, setDockForceHidden] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyzerRef = useRef<MVAudioAnalyzer | null>(null);
  const rendererRef = useRef<MVCanvasRenderer | null>(null);
  const hideDockTimerRef = useRef<number>(0);
  const hoveringDockRef = useRef<boolean>(false);

  const liveStateRef = useRef({
    isPlaying: false,
    virtualTime: initialSeekSec,
    usingVirtualClock: false,
    cameraMode: 'auto' as CameraMode,
    subtitleMode: 'cinema' as SubtitleMode,
    reducedMotion: false,
  });

  // During playback, bottom dock auto-hides unless hovered/revealed or LyricsDrawer is open.
  // When paused, bottom dock stays visible unless manually force-hidden via H.
  const dockVisible = isPlaying
    ? dockRevealedWhilePlaying || lyricsOpen
    : !dockForceHidden || lyricsOpen;

  const clearHideDockTimer = useCallback(() => {
    if (hideDockTimerRef.current) {
      window.clearTimeout(hideDockTimerRef.current);
      hideDockTimerRef.current = 0;
    }
  }, []);

  const scheduleAutoHideDock = useCallback(
    (delayMs = 2400) => {
      clearHideDockTimer();
      hideDockTimerRef.current = window.setTimeout(() => {
        if (!hoveringDockRef.current && liveStateRef.current.isPlaying) {
          setDockRevealedWhilePlaying(false);
        }
      }, delayMs);
    },
    [clearHideDockTimer]
  );

  const revealDockTemporarily = useCallback(
    (delayMs = 2600) => {
      setDockForceHidden(false);
      setDockRevealedWhilePlaying(true);
      if (liveStateRef.current.isPlaying && !hoveringDockRef.current) {
        scheduleAutoHideDock(delayMs);
      }
    },
    [scheduleAutoHideDock]
  );

  const hideDockNow = useCallback(() => {
    clearHideDockTimer();
    hoveringDockRef.current = false;
    setDockRevealedWhilePlaying(false);
    if (!liveStateRef.current.isPlaying) {
      setDockForceHidden(true);
    }
  }, [clearHideDockTimer]);

  const toggleDockVisibility = useCallback(() => {
    if (dockVisible) {
      hideDockNow();
    } else {
      revealDockTemporarily(4200);
    }
  }, [dockVisible, hideDockNow, revealDockTemporarily]);

  useEffect(() => {
    return () => clearHideDockTimer();
  }, [clearHideDockTimer]);

  useEffect(() => {
    liveStateRef.current.cameraMode = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    liveStateRef.current.subtitleMode = subtitleMode;
  }, [subtitleMode]);

  const toggleSubtitleMode = useCallback(() => {
    setSubtitleMode((prev) => (prev === 'cinema' ? 'diegetic' : 'cinema'));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    liveStateRef.current.reducedMotion = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      liveStateRef.current.reducedMotion = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;

    void loadEmbeddedCoverUrl(controller.signal).then((url) => {
      if (url) {
        objectUrl = url;
        setCoverUrl(url);
      }
    });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const startPlayback = useCallback(
    async (seekSec?: number, hideBottomImmediately = true) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (typeof seekSec === 'number') {
        audio.currentTime = seekSec;
        liveStateRef.current.virtualTime = seekSec;
        setCurrentTime(seekSec);
      } else if (Math.abs(audio.currentTime - liveStateRef.current.virtualTime) > 0.15) {
        audio.currentTime = liveStateRef.current.virtualTime;
      }

      setShowPoster(false);
      setDockForceHidden(false);
      if (hideBottomImmediately) {
        clearHideDockTimer();
        setDockRevealedWhilePlaying(false);
      } else {
        scheduleAutoHideDock(2000);
      }

      const hasActivation =
        typeof navigator !== 'undefined' &&
        Boolean(
          navigator.userActivation?.isActive || navigator.userActivation?.hasBeenActive
        );

      if (hasActivation) {
        if (!analyzerRef.current) {
          analyzerRef.current = new MVAudioAnalyzer();
        }
        analyzerRef.current.attach(audio);
      }

      try {
        audio.muted = false;
        setIsMuted(false);
        await audio.play();
        liveStateRef.current.usingVirtualClock = false;
        liveStateRef.current.isPlaying = true;
        setIsPlaying(true);
      } catch {
        try {
          audio.muted = true;
          setIsMuted(true);
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
    },
    [clearHideDockTimer, scheduleAutoHideDock]
  );

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    liveStateRef.current.isPlaying = false;
    setIsPlaying(false);
    setDockForceHidden(false);
    clearHideDockTimer();
  }, [clearHideDockTimer]);

  const togglePlay = useCallback(() => {
    if (liveStateRef.current.isPlaying) {
      pausePlayback();
    } else {
      void startPlayback(undefined, !hoveringDockRef.current);
    }
  }, [pausePlayback, startPlayback]);

  const seekTo = useCallback(
    (targetSec: number) => {
      const clamped = Math.max(0, Math.min(duration, targetSec));
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = clamped;
      }
      liveStateRef.current.virtualTime = clamped;
      setCurrentTime(clamped);
    },
    [duration]
  );

  const handleRestart = useCallback(() => {
    void startPlayback(0, true);
  }, [startPlayback]);

  const handleToggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && liveStateRef.current.usingVirtualClock) {
      void startPlayback(liveStateRef.current.virtualTime, !hoveringDockRef.current);
    }
  }, [startPlayback]);

  const triggerCenterSticker = useCallback(() => {
    rendererRef.current?.triggerStickerBurst(0.5, 0.48);
  }, []);

  useEffect(() => {
    const unlockAudioAnalyzer = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (!analyzerRef.current) {
        analyzerRef.current = new MVAudioAnalyzer();
      }
      analyzerRef.current.attach(audio);
    };
    window.addEventListener('pointerdown', unlockAudioAnalyzer, { once: true });
    window.addEventListener('keydown', unlockAudioAnalyzer, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudioAnalyzer);
      window.removeEventListener('keydown', unlockAudioAnalyzer);
    };
  }, []);

  useEffect(() => {
    if (initialAutostart) {
      void startPlayback(initialSeekSec, true);
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
      if (isSoftwareRenderer) {
        const delayMs = liveStateRef.current.isPlaying ? 45 : 160;
        timerId = window.setTimeout(() => {
          if (!disposed) rafId = requestAnimationFrame(loop);
        }, delayMs);
      } else {
        rafId = requestAnimationFrame(loop);
      }
    };

    const loop = (now: number) => {
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

    rafId = requestAnimationFrame(loop);

    return () => {
      disposed = true;
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

      if (e.code === 'Space' && tagName !== 'BUTTON') {
        e.preventDefault();
        if (showPoster) {
          void startPlayback(0, true);
        } else {
          togglePlay();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekTo(liveStateRef.current.virtualTime + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekTo(liveStateRef.current.virtualTime - 5);
      } else if (e.code === 'KeyB') {
        triggerCenterSticker();
      } else if (e.code === 'KeyC') {
        toggleSubtitleMode();
      } else if (e.code === 'KeyH') {
        toggleDockVisibility();
      } else if (e.code === 'KeyL') {
        setLyricsOpen((prev) => !prev);
      } else if (e.code === 'Escape' && lyricsOpen) {
        setLyricsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    lyricsOpen,
    seekTo,
    showPoster,
    startPlayback,
    toggleDockVisibility,
    togglePlay,
    toggleSubtitleMode,
    triggerCenterSticker,
  ]);

  const activeChapter = useMemo(() => getActiveChapter(currentTime), [currentTime]);
  const activeLyricIndex = useMemo(() => getActiveLyricIndex(currentTime), [currentTime]);
  const activeLine = LYRIC_LINES[activeLyricIndex] ?? LYRIC_LINES[0];
  const nextLine =
    activeLyricIndex + 1 < LYRIC_LINES.length ? LYRIC_LINES[activeLyricIndex + 1] : null;
  const activeLineProgress = useMemo(
    () => getLyricProgress(activeLine, currentTime),
    [activeLine, currentTime]
  );
  const activeShotInfo = useMemo(
    () => resolveActiveShot(currentTime, cameraMode, computeBeatState(currentTime)),
    [cameraMode, currentTime]
  );
  const activePlacement = useMemo(
    () => resolveLyricStagePlacement(activeLine, activeShotInfo.shot, cameraMode),
    [activeLine, activeShotInfo.shot, cameraMode]
  );

  useEffect(() => {
    document.body.dataset.state = showPoster
      ? 'poster'
      : isPlaying
      ? 'playing'
      : 'paused';
    document.body.dataset.chapter = activeChapter.id;
    document.body.dataset.shot = activeShotInfo.shot;
    document.body.dataset.shotCode = activeShotInfo.shotCode;
    document.body.dataset.subtitleMode = subtitleMode;
    document.body.dataset.dock = dockVisible ? 'visible' : 'hidden';
    document.body.dataset.lyricZone = activePlacement.zone;
  }, [
    activeChapter.id,
    activePlacement.zone,
    activeShotInfo.shot,
    activeShotInfo.shotCode,
    dockVisible,
    isPlaying,
    showPoster,
    subtitleMode,
  ]);

  return (
    <div
      onPointerMove={(e) => {
        if (showPoster) return;
        const nearBottom = e.clientY >= window.innerHeight - 92;
        const nearTop = e.clientY <= 52;
        if (nearBottom || nearTop) {
          revealDockTemporarily(2600);
        }
      }}
      className="relative w-screen h-screen overflow-hidden bg-zinc-950 select-none"
    >
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
          if (Number.isFinite(t)) {
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

      {!showPoster && dockVisible && (
        <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-gradient-to-b from-zinc-950/90 to-transparent">
          <button
            type="button"
            onClick={() => setShowPoster(true)}
            className="font-display text-lg font-extrabold tracking-tight text-zinc-100 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            嘿！小黑
          </button>

          <nav
            aria-label="高光段落直达"
            className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-zinc-300"
          >
            {HEADER_SCENE_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                aria-label={`高光直达：${item.label}`}
                onClick={() => {
                  seekTo(item.time);
                  if (!isPlaying) void startPlayback(item.time, true);
                }}
                className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center shrink-0">
            {isMuted ? (
              <button
                type="button"
                onClick={handleToggleMute}
                className="rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                开启声音
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPoster(true)}
                className="rounded-lg border border-zinc-700/90 bg-zinc-900/85 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                歌曲海报
              </button>
            )}
          </div>
        </header>
      )}

      {/* Keep unmute CTA accessible even in pure auto-hidden cinema playback if browser muted autoplay */}
      {!showPoster && !dockVisible && isMuted && (
        <div className="fixed top-4 right-4 z-30">
          <button
            type="button"
            onClick={handleToggleMute}
            className="rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            开启声音
          </button>
        </div>
      )}

      <main className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          data-testid="mv-canvas"
          onClick={(e) => {
            if (showPoster) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
            const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
            rendererRef.current?.triggerStickerBurst(nx, ny);
          }}
          className="block w-full h-full cursor-crosshair"
        />

        {!showPoster && (
          <KineticLyricsOverlay
            activeLine={activeLine}
            nextLine={nextLine}
            lineProgress={activeLineProgress}
            placement={activePlacement}
            dockVisible={dockVisible}
            subtitleMode={subtitleMode}
            currentTime={currentTime}
          />
        )}
      </main>

      {!showPoster && (
        <LyricsDrawer
          open={lyricsOpen}
          activeLyricId={activeLine.id}
          onSeekToLine={(timeSec) => {
            seekTo(timeSec);
            if (!isPlaying) void startPlayback(timeSec, false);
          }}
          onClose={() => setLyricsOpen(false)}
        />
      )}

      {!showPoster && (
        <DirectorDock
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          activeChapter={activeChapter}
          activeShotLabel={activeShotInfo.label}
          cameraMode={cameraMode}
          subtitleMode={subtitleMode}
          isMuted={isMuted}
          dockVisible={dockVisible}
          lyricsOpen={lyricsOpen}
          onTogglePlay={togglePlay}
          onSeek={(sec) => {
            seekTo(sec);
            revealDockTemporarily(2800);
          }}
          onRestart={handleRestart}
          onChangeCameraMode={(mode) => {
            setCameraMode(mode);
            revealDockTemporarily(2600);
          }}
          onToggleSubtitleMode={() => {
            toggleSubtitleMode();
            revealDockTemporarily(2600);
          }}
          onToggleMute={handleToggleMute}
          onTriggerSticker={triggerCenterSticker}
          onShowDock={() => revealDockTemporarily(4200)}
          onHideDock={hideDockNow}
          onDockPointerEnter={() => {
            hoveringDockRef.current = true;
            clearHideDockTimer();
          }}
          onDockPointerLeave={() => {
            hoveringDockRef.current = false;
            if (liveStateRef.current.isPlaying) {
              scheduleAutoHideDock(2000);
            }
          }}
          onToggleLyrics={() => setLyricsOpen((prev) => !prev)}
        />
      )}

      {showPoster && (
        <IntroPoster
          coverUrl={coverUrl}
          onStartMV={(sec) => {
            void startPlayback(sec ?? 0, true);
          }}
        />
      )}
    </div>
  );
}
