import {
  Camera,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Pause,
  Play,
  RotateCcw,
  Tag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  MV_CHAPTERS,
  SONG_META,
  type CameraMode,
  type MVChapter,
} from '../mv/mvData';
import { clamp01, formatTimecode } from '../mv/mvTimeline';

interface DirectorDockProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeChapter: MVChapter;
  activeShotLabel: string;
  cameraMode: CameraMode;
  isMuted: boolean;
  dockCollapsed: boolean;
  lyricsOpen: boolean;
  onTogglePlay: () => void;
  onSeek: (timeSec: number) => void;
  onRestart: () => void;
  onChangeCameraMode: (mode: CameraMode) => void;
  onToggleMute: () => void;
  onTriggerSticker: () => void;
  onToggleDock: () => void;
  onToggleLyrics: () => void;
}

const CAMERA_OPTIONS: { id: CameraMode; label: string }[] = [
  { id: 'auto', label: '智能切镜' },
  { id: 'low_track', label: '低角跟拍' },
  { id: 'macro', label: '细节微距' },
  { id: 'cinema_wide', label: '宽银幕全景' },
];

export function DirectorDock({
  isPlaying,
  currentTime,
  duration,
  activeChapter,
  activeShotLabel,
  cameraMode,
  isMuted,
  dockCollapsed,
  lyricsOpen,
  onTogglePlay,
  onSeek,
  onRestart,
  onChangeCameraMode,
  onToggleMute,
  onTriggerSticker,
  onToggleDock,
  onToggleLyrics,
}: DirectorDockProps) {
  const safeDuration = duration > 0 ? duration : SONG_META.durationSec;
  const progressPermille = Math.round(clamp01(currentTime / safeDuration) * 1000);

  return (
    <div className="fixed inset-x-0 bottom-3 z-30 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto mb-1.5">
        <button
          type="button"
          onClick={onToggleDock}
          aria-expanded={!dockCollapsed}
          aria-label={dockCollapsed ? '展开控制栏' : '收起控制栏'}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/90 px-3 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>展开控制栏 (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
              <span>纯净观影 (H)</span>
            </>
          )}
        </button>
      </div>

      {!dockCollapsed && (
        <div
          role="region"
          aria-label="MV 导演控制面板"
          className="pointer-events-auto w-full max-w-5xl rounded-2xl border border-zinc-800/95 bg-zinc-950/94 px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xl space-y-2.5"
        >
          {/* Timeline Header with Live Active Camera Shot Readout */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono-num font-bold text-amber-400 shrink-0">
                  {activeChapter.indexLabel}
                </span>
                <span className="font-semibold text-zinc-100 shrink-0">
                  {activeChapter.title}
                </span>
                <span className="text-zinc-600 shrink-0" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 text-amber-300/95 font-medium truncate">
                  <Camera className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{activeShotLabel}</span>
                </span>
              </div>

              <div className="font-mono-num text-zinc-300 shrink-0 whitespace-nowrap">
                <span>{formatTimecode(currentTime)}</span>
                <span className="mx-1 text-zinc-600">/</span>
                <span className="text-zinc-400">{formatTimecode(safeDuration)}</span>
              </div>
            </div>

            <div className="relative flex items-center h-5">
              <svg
                viewBox="0 0 1000 6"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-1.5 w-full rounded-full overflow-hidden"
              >
                <rect x="0" y="0" width="1000" height="6" className="fill-zinc-800" />
                <rect
                  x="0"
                  y="0"
                  width={progressPermille}
                  height="6"
                  className="fill-amber-400"
                />
                {MV_CHAPTERS.slice(1).map((ch) => {
                  const markerX = Math.round((ch.startTime / safeDuration) * 1000);
                  return (
                    <rect
                      key={ch.id}
                      x={markerX - 1}
                      y="0"
                      width="2"
                      height="6"
                      className="fill-zinc-950/90"
                    />
                  );
                })}
              </svg>

              <label htmlFor="mv-timeline-range" className="sr-only">
                MV 播放进度跳转
              </label>
              <input
                id="mv-timeline-range"
                type="range"
                min={0}
                max={safeDuration}
                step={0.05}
                value={Math.min(currentTime, safeDuration)}
                onChange={(e) => onSeek(Number(e.target.value))}
                aria-label="MV 播放进度跳转"
                className="mv-slider relative z-10 w-full h-5"
              />
            </div>

            {/* Compact Storyboard Chapter Selector Strip */}
            <div
              role="group"
              aria-label="分镜章节直达"
              className="hidden sm:flex items-center gap-1 overflow-x-auto pb-0.5"
            >
              {MV_CHAPTERS.map((ch) => {
                const isCurrent = ch.id === activeChapter.id;
                const shortName = ch.title.split('·')[1]?.trim() ?? ch.title;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => onSeek(ch.startTime)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                    }`}
                  >
                    {ch.indexLabel} {shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Transport & Multi-Camera Director Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={isPlaying ? '暂停 MV' : '播放 MV'}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-zinc-950" aria-hidden="true" />
                    <span>暂停</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-zinc-950" aria-hidden="true" />
                    <span>播放</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onRestart}
                aria-label="重播 MV"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                aria-label={isMuted ? '取消静音' : '静音'}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                  isMuted
                    ? 'border-amber-400/60 bg-amber-400/15 text-amber-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div
              role="group"
              aria-label="导播镜头模式切换"
              className="flex items-center gap-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800/90"
            >
              {CAMERA_OPTIONS.map((opt) => {
                const active = cameraMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeCameraMode(opt.id)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-zinc-100 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onTriggerSticker}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>贴优先卡 (B)</span>
              </button>

              <button
                type="button"
                onClick={onToggleLyrics}
                aria-expanded={lyricsOpen}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lyricsOpen
                    ? 'border-zinc-100 bg-zinc-100 text-zinc-950'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" aria-hidden="true" />
                <span>歌词分镜</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
