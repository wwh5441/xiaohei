import type { LyricLine } from '../mv/mvData';
import type { LyricStagePlacement } from '../mv/mvTimeline';

interface KineticLyricsOverlayProps {
  activeLine: LyricLine;
  nextLine: LyricLine | null;
  placement: LyricStagePlacement;
}

/**
 * Screen-reader-only accessibility live region for the active MV lyric.
 * All visual lyrics are rendered as dynamic, scene-integrated kinetic typography
 * directly inside the 2.5D Canvas stage (`diegeticLyrics.ts`) — zero bottom subtitles.
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
      {activeLine.echoText ? <p>{activeLine.echoText}</p> : null}
      {nextLine ? <p>{nextLine.text}</p> : null}
    </div>
  );
}
