import type { LyricLine, SubtitleMode } from '../mv/mvData';
import type { LyricStagePlacement } from '../mv/mvTimeline';

interface KineticLyricsOverlayProps {
  activeLine: LyricLine;
  nextLine: LyricLine | null;
  lineProgress: number;
  placement: LyricStagePlacement;
  dockVisible: boolean;
  subtitleMode: SubtitleMode;
  currentTime: number;
}

function renderHighlightedText(text: string, emphasis?: string) {
  if (!emphasis) return text;
  const idx = text.indexOf(emphasis);
  if (idx < 0) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + emphasis.length);
  const after = text.slice(idx + emphasis.length);
  return (
    <>
      {before}
      <span className="text-amber-300">{match}</span>
      {after}
    </>
  );
}

/**
 * Dual-mode Lyric Presentation Layer:
 * - `'cinema'` (default): Clean, high-contrast 35mm cinema subtitle bar at bottom-center with
 *   emphasis highlighting and backing-vocal (`echoText`) sub-line, while hero physical props
 *   (Solari FIDS board, Diptych/Triptych frames, Sanctuary Lintel) remain integrated in Canvas.
 * - `'diegetic'`: Hides floating subtitles (`sr-only` preserved for screen readers) so all 66
 *   shots render spatial, occluded, or surface-coupled typography directly inside the 2.5D world.
 */
export function KineticLyricsOverlay({
  activeLine,
  nextLine,
  placement,
  dockVisible,
  subtitleMode,
  currentTime,
}: KineticLyricsOverlayProps) {
  const hideVisualOverlay = subtitleMode === 'diegetic' || currentTime >= 206.2;

  if (hideVisualOverlay) {
    return (
      <div
        aria-live="polite"
        data-testid="kinetic-lyric-stage"
        data-lyric-zone={placement.zone}
        data-lyric-orientation={placement.orientation}
        className="sr-only"
      >
        <p data-testid="active-lyric">{activeLine.text}</p>
        {activeLine.echoText ? <p>{activeLine.echoText}</p> : null}
        {nextLine ? <p>{nextLine.text}</p> : null}
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      data-testid="kinetic-lyric-stage"
      data-lyric-zone={placement.zone}
      data-lyric-orientation={placement.orientation}
      className={`pointer-events-none fixed inset-x-0 z-20 flex flex-col items-center px-6 text-center transition-all duration-200 ${
        dockVisible ? 'bottom-52 sm:bottom-56' : 'bottom-8 sm:bottom-11'
      }`}
    >
      <div className="inline-flex max-w-2xl flex-col items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/72 px-4 py-2 shadow-2xl backdrop-blur-[2px]">
        <p
          data-testid="active-lyric"
          className="font-sans text-base sm:text-xl md:text-2xl font-bold tracking-wide text-zinc-50 leading-snug"
        >
          {renderHighlightedText(activeLine.text, activeLine.emphasis)}
        </p>
        {activeLine.echoText ? (
          <p className="font-mono-num text-[11px] sm:text-xs font-semibold tracking-widest text-amber-200/90">
            {activeLine.echoText}
          </p>
        ) : null}
      </div>
      {nextLine ? <p className="sr-only">{nextLine.text}</p> : null}
    </div>
  );
}
