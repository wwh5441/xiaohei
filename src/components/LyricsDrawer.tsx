import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { LYRIC_LINES, MV_CHAPTERS, SONG_META } from '../mv/mvData';
import { formatTimecode } from '../mv/mvTimeline';

interface LyricsDrawerProps {
  open: boolean;
  activeLyricId: string;
  onSeekToLine: (timeSec: number) => void;
  onClose: () => void;
}

export function LyricsDrawer({
  open,
  activeLyricId,
  onSeekToLine,
  onClose,
}: LyricsDrawerProps) {
  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [open, activeLyricId]);

  if (!open) return null;

  return (
    <aside
      aria-label="全曲歌词与分镜剧本"
      className="fixed top-16 right-4 bottom-28 z-30 w-[min(410px,92vw)] rounded-2xl border border-zinc-800 bg-zinc-950/96 shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-zinc-800">
        <div className="min-w-0">
          <h2 className="font-display text-base font-bold text-zinc-100 truncate">
            逐句分镜剧本（66 镜零重复）
          </h2>
          <p className="text-xs text-zinc-400 truncate">
            {SONG_META.artist} ·《{SONG_META.title}》· S01–S66 逐句独立切镜
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭歌词分镜面板"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {MV_CHAPTERS.map((chapter) => {
          const lines = LYRIC_LINES.filter((l) => l.chapterId === chapter.id);
          return (
            <section key={chapter.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-2">
                <span className="font-semibold text-amber-400">
                  {chapter.indexLabel}. {chapter.title}
                </span>
                <span className="font-mono-num">{formatTimecode(chapter.startTime)}</span>
              </div>

              <div className="space-y-1">
                {lines.map((line) => {
                  const isActive = line.id === activeLyricId;
                  return (
                    <button
                      key={line.id}
                      ref={isActive ? activeItemRef : null}
                      type="button"
                      onClick={() => onSeekToLine(line.startTime)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex flex-col gap-0.5 cursor-pointer ${
                        isActive
                          ? 'bg-amber-400/15 text-amber-300'
                          : 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3 w-full">
                        <span className={`text-sm leading-snug ${isActive ? 'font-bold' : ''}`}>
                          {line.text}
                          {line.echoText ? (
                            <span className="ml-1.5 text-xs font-normal text-amber-300/80">
                              {line.echoText}
                            </span>
                          ) : null}
                        </span>
                        <span className="font-mono-num text-xs text-zinc-500 shrink-0">
                          {formatTimecode(line.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <span className="font-mono-num font-bold text-amber-400/90">
                          [{line.shotCode}]
                        </span>
                        <span className="truncate">{line.shotLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
