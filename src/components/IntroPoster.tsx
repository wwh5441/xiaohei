import { Disc3, Play, Sparkles } from 'lucide-react';
import { MV_CHAPTERS, SONG_META } from '../mv/mvData';
import { formatTimecode } from '../mv/mvTimeline';

interface IntroPosterProps {
  coverUrl: string | null;
  onStartMV: (startAtSec?: number) => void;
}

export function IntroPoster({ coverUrl, onStartMV }: IntroPosterProps) {
  const featuredChapters = [
    MV_CHAPTERS[0],
    MV_CHAPTERS[3],
    MV_CHAPTERS[5],
    MV_CHAPTERS[7],
    MV_CHAPTERS[9],
  ];

  return (
    <div
      data-testid="intro-poster"
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/88 px-6 py-8 overflow-y-auto"
    >
      <div className="w-full max-w-5xl rounded-2xl border border-zinc-800/90 bg-zinc-950/95 p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Editorial Typography & Primary Action */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-400">
                <span className="text-amber-400 font-semibold">{SONG_META.artist}</span>
                <span aria-hidden="true">·</span>
                <span>专辑《{SONG_META.album}》</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{SONG_META.bpm} BPM</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{formatTimecode(SONG_META.durationSec)}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-zinc-50 [text-wrap:balance]">
                嘿！小黑
              </h1>

              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-zinc-300">
                致陪伴半生奔波的二十寸黑色拉杆箱——从斑驳堆叠的优先卡、暴雨延误的深夜候机屏、掌心拉杆余温、咽下悲欢的微光树洞，到家门口斜阳与烫金姓名牌。全曲 21 组电影机位逐句切镜，与老伙计再度启程。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onStartMV(0)}
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-400 px-6 py-3.5 text-sm sm:text-base font-bold text-zinc-950 hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-zinc-950" aria-hidden="true" />
                <span>播放动感 MV</span>
              </button>

              <button
                type="button"
                onClick={() => onStartMV(45.986)}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>直达高燃副歌 (00:46)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Official Embedded MP3 Album Cover / Vinyl Sleeve */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[300px] aspect-square rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-xl">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Ham《嘿！小黑》专辑封面"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/40 p-6 text-center">
                  <Disc3 className="w-16 h-16 text-amber-400" aria-hidden="true" />
                  <span className="font-display text-xl font-bold text-zinc-100">
                    嘿！小黑 · 20&quot;
                  </span>
                  <span className="text-xs text-zinc-400">
                    {SONG_META.artist} ·《{SONG_META.album}》
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4">
                <p className="text-xs font-medium text-zinc-200">
                  十幕实时音画同步 · 点击画面或按 B 键可贴上旅行邮签
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Storyboard Chapter Preview Strip Below Split */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {featuredChapters.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => onStartMV(ch.startTime)}
                className="group text-left rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3 hover:border-amber-400/50 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span className="font-mono-num text-amber-400">{ch.indexLabel}</span>
                  <span className="font-mono-num">{formatTimecode(ch.startTime)}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                  {ch.title.replace(/^\d+\.\s*/, '')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
