import type { LyricLine } from '../mv/mvData';
import type { LyricStagePlacement } from '../mv/mvTimeline';

interface KineticLyricsOverlayProps {
  activeLine: LyricLine;
  nextLine: LyricLine | null;
  lineProgress: number;
  placement: LyricStagePlacement;
  dockVisible: boolean;
}

/**
 * Accessible Screen-Reader Live Region for Diegetic Canvas Lyrics.
 * All visual lyric typography is physically rendered inside the 2D/2.5D Canvas world
 * (`src/mv/diegeticLyrics.ts`) with foreground occlusion, perspective shear, split-flap tiles,
 * and hot-strike -> bone thermodynamic ignition (inspired by OpenFilm `one-prompt`).
 * Keeping this `sr-only` node preserves full ARIA screen-reader accessibility without
 * visually duplicating floating HUD subtitles over the film frame.
 */
export function KineticLyricsOverlay({
  activeLine,
  nextLine,
  placement,
}: KineticLyricsOverlayProps) {
  return (
    <div
      aria-live="polite"
      data-testid="kinetic-lyric-stage"
      data-lyric-zone={placement.zone}
      data-lyric-orientation={placement.orientation}
      className="sr-only"
    >
      <p data-testid="active-lyric">{activeLine.text}</p>
      {nextLine ? <p>{nextLine.text}</p> : null}
    </div>
  );
}
