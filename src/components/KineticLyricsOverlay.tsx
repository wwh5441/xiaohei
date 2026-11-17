import type { LyricLine, SceneId } from '../mv/mvData';

interface KineticLyricsOverlayProps {
  activeLine: LyricLine;
  nextLine: LyricLine | null;
  dockCollapsed: boolean;
}

const ACCENT_TEXT_BY_SCENE: Record<SceneId, string> = {
  intro: 'text-amber-400',
  verse1: 'text-amber-400',
  prechorus1: 'text-orange-400',
  chorus1: 'text-yellow-300',
  interlude1: 'text-cyan-400',
  verse2: 'text-sky-400',
  chorus2: 'text-cyan-300',
  whistle: 'text-teal-300',
  bridge: 'text-amber-300',
  finale: 'text-yellow-300',
};

export function KineticLyricsOverlay({
  activeLine,
  nextLine,
  dockCollapsed,
}: KineticLyricsOverlayProps) {
  const isExplosive = activeLine.punch === 'slam' || activeLine.punch === 'finale';
  const accentClass = ACCENT_TEXT_BY_SCENE[activeLine.chapterId] ?? 'text-amber-400';

  const renderHighlightedText = (line: LyricLine) => {
    if (!line.emphasis || !line.text.includes(line.emphasis)) {
      return <span>{line.text}</span>;
    }
    const idx = line.text.indexOf(line.emphasis);
    const before = line.text.slice(0, idx);
    const after = line.text.slice(idx + line.emphasis.length);
    return (
      <>
        <span>{before}</span>
        <span className={`${accentClass} drop-shadow-[0_2px_18px_rgba(250,204,21,0.42)]`}>
          {line.emphasis}
        </span>
        <span>{after}</span>
      </>
    );
  };

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 z-20 flex flex-col items-center px-6 text-center transition-transform duration-300 ${
        dockCollapsed ? 'top-10 sm:top-12' : 'top-14 sm:top-16'
      }`}
    >
      <div
        key={activeLine.id}
        className={`max-w-4xl ${isExplosive ? 'animate-lyric-slam' : 'animate-lyric-glide'}`}
      >
        {activeLine.echoText && (
          <p
            className={`mb-1.5 text-xs sm:text-sm font-extrabold tracking-widest ${accentClass} drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}
          >
            {activeLine.echoText}
          </p>
        )}

        <p
          data-testid="active-lyric"
          className={`font-display tracking-tight text-white drop-shadow-[0_4px_26px_rgba(0,0,0,0.95)] [text-wrap:balance] ${
            isExplosive
              ? 'text-3xl sm:text-5xl md:text-[3.5rem] font-black leading-tight'
              : 'text-2xl sm:text-4xl md:text-[2.6rem] font-extrabold leading-tight'
          }`}
        >
          {renderHighlightedText(activeLine)}
        </p>

        {nextLine && (
          <p className="mt-2 text-xs sm:text-sm font-medium text-zinc-300/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.92)]">
            {nextLine.text}
          </p>
        )}
      </div>
    </div>
  );
}
