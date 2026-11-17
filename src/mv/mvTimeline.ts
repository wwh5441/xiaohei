import {
  LYRIC_LINES,
  MV_CHAPTERS,
  SHOT_LABELS,
  SONG_META,
  type CameraMode,
  type LyricLine,
  type MVChapter,
  type ShotType,
} from './mvData';

export interface AudioBands {
  bass: number; // 0..1
  mid: number; // 0..1
  high: number; // 0..1
  overall: number; // 0..1
  liveActive: boolean;
}

export interface BeatState {
  beatIndex: number;
  barIndex: number;
  beatInBar: number; // 0, 1, 2, 3
  beatPhase: number; // 0..1 within current beat
  barPhase: number; // 0..1 within current 4/4 bar
  kickPulse: number; // 0..1 sharp punch on beats 0 & 2 + live bass
  snarePulse: number; // 0..1 sharp snap on beats 1 & 3 + live mid/high
  energy: number; // 0..1 composite scene + audio energy
  sectionFlash: number; // 0..1 burst right after a chapter transition
}

export interface ActiveShotInfo {
  shot: ShotType;
  label: string;
  cutTransition: number; // 0..1 exponential decay right after a camera cut
  lineProgress: number; // 0..1 progress within active lyric line
}

export interface ParsedId3Cover {
  mimeType: string;
  imageBytes: Uint8Array;
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function formatTimecode(seconds: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getActiveChapter(timeSec: number): MVChapter {
  const t = Math.max(0, timeSec);
  for (let i = MV_CHAPTERS.length - 1; i >= 0; i--) {
    if (t >= MV_CHAPTERS[i].startTime) {
      return MV_CHAPTERS[i];
    }
  }
  return MV_CHAPTERS[0];
}

export function getActiveLyricIndex(timeSec: number): number {
  const t = Math.max(0, timeSec);
  let lo = 0;
  let hi = LYRIC_LINES.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const line = LYRIC_LINES[mid];
    if (t < line.startTime) {
      hi = mid - 1;
    } else if (t >= line.endTime) {
      lo = mid + 1;
    } else {
      return mid;
    }
  }
  return Math.min(LYRIC_LINES.length - 1, Math.max(0, lo - 1));
}

export function getLyricProgress(line: LyricLine, timeSec: number): number {
  const span = Math.max(0.05, line.endTime - line.startTime);
  return clamp01((timeSec - line.startTime) / span);
}

/**
 * Resolves the active camera shot synchronized to the current lyric line
 * (or user's manual camera lens override) and computes film-cut transition impulse.
 */
export function resolveActiveShot(
  timeSec: number,
  cameraMode: CameraMode,
  beat: BeatState
): ActiveShotInfo {
  const idx = getActiveLyricIndex(timeSec);
  const line = LYRIC_LINES[idx] ?? LYRIC_LINES[0];
  const lineProgress = getLyricProgress(line, timeSec);
  const sinceLineStart = Math.max(0, timeSec - line.startTime);

  if (cameraMode === 'low_track') {
    const alt: ShotType =
      beat.barIndex % 2 === 0 ? 'boots_wheels_low' : 'chorus_hero_low';
    return {
      shot: alt,
      label: SHOT_LABELS[alt],
      cutTransition: Math.exp(-beat.barPhase * 12) * 0.4,
      lineProgress,
    };
  }

  if (cameraMode === 'macro') {
    const macroCycle: ShotType[] = [
      'priority_tags_macro',
      'handle_warmth_macro',
      'open_suitcase',
      'nametag_dream_macro',
    ];
    const picked = macroCycle[beat.barIndex % macroCycle.length];
    return {
      shot: picked,
      label: SHOT_LABELS[picked],
      cutTransition: Math.exp(-beat.barPhase * 12) * 0.4,
      lineProgress,
    };
  }

  if (cameraMode === 'cinema_wide') {
    const wideShot: ShotType =
      line.chapterId === 'verse2'
        ? 'airport_delay_rain'
        : line.chapterId === 'whistle'
        ? 'whistle_coastal'
        : line.chapterId === 'bridge'
        ? 'home_doorway_sun'
        : line.shot === 'sunset_horizon_outro'
        ? 'sunset_horizon_outro'
        : 'traveler_wide';
    return {
      shot: wideShot,
      label: SHOT_LABELS[wideShot],
      cutTransition: sinceLineStart < 0.35 ? Math.exp(-sinceLineStart * 9) : 0,
      lineProgress,
    };
  }

  // Default 'auto': intelligent line-by-line lyric-matched multi-camera editing!
  const prevLine = idx > 0 ? LYRIC_LINES[idx - 1] : null;
  const didShotChange = !prevLine || prevLine.shot !== line.shot;
  const cutTransition =
    didShotChange && sinceLineStart < 0.38 ? Math.exp(-sinceLineStart * 8.5) : 0;

  return {
    shot: line.shot,
    label: line.shotLabel,
    cutTransition,
    lineProgress,
  };
}

/**
 * Blends the deterministic 96 BPM rhythmic grid with real-time Web Audio FFT bands
 * so every kick, slap-guitar hit, and chorus drop lands with frame-accurate punch.
 */
export function computeBeatState(timeSec: number, bands?: AudioBands): BeatState {
  const chapter = getActiveChapter(timeSec);
  const tRel = timeSec - SONG_META.beatOffsetSec;

  if (timeSec < SONG_META.beatOffsetSec || timeSec > 209.5) {
    const gentle = clamp01(bands?.overall ?? 0.15);
    return {
      beatIndex: 0,
      barIndex: 0,
      beatInBar: 0,
      beatPhase: 0,
      barPhase: 0,
      kickPulse: gentle * 0.25,
      snarePulse: 0,
      energy: 0.2 + gentle * 0.3,
      sectionFlash: 0,
    };
  }

  const rawBeat = tRel / SONG_META.beatIntervalSec;
  const beatIndex = Math.max(0, Math.floor(rawBeat));
  const beatPhase = rawBeat - Math.floor(rawBeat);
  const barIndex = Math.floor(beatIndex / 4);
  const beatInBar = ((beatIndex % 4) + 4) % 4;
  const barPhase = (beatInBar + beatPhase) / 4;

  const gridImpulse = Math.exp(-beatPhase * 5.8);
  const ghostImpulse =
    beatPhase > 0.48 && beatPhase < 0.72
      ? Math.exp(-(beatPhase - 0.5) * 9.0) * 0.45
      : 0;

  const isKickBeat = beatInBar === 0 || beatInBar === 2;
  const isSnareBeat = beatInBar === 1 || beatInBar === 3;

  const gridKick = (isKickBeat ? gridImpulse : ghostImpulse * 0.6) * chapter.energyBase;
  const gridSnare = (isSnareBeat ? gridImpulse : 0) * chapter.energyBase;

  const liveWeight = bands?.liveActive ? 0.58 : 0;
  const liveKick = bands?.liveActive ? clamp01((bands.bass - 0.22) * 1.45) : 0;
  const liveSnare = bands?.liveActive
    ? clamp01((bands.mid * 0.55 + bands.high * 0.65 - 0.18) * 1.4)
    : 0;

  const kickPulse = clamp01(gridKick * (1 - liveWeight * 0.45) + liveKick * liveWeight);
  const snarePulse = clamp01(gridSnare * (1 - liveWeight * 0.4) + liveSnare * liveWeight);

  const sinceChapterStart = Math.max(0, timeSec - chapter.startTime);
  const isHighImpactChapter =
    chapter.id === 'chorus1' ||
    chapter.id === 'chorus2' ||
    chapter.id === 'whistle' ||
    chapter.id === 'finale';
  const sectionFlash =
    chapter.startTime > 1 && sinceChapterStart < 1.1
      ? Math.exp(-sinceChapterStart * (isHighImpactChapter ? 3.2 : 5.0)) *
        (isHighImpactChapter ? 1.0 : 0.55)
      : 0;

  const liveOverall = bands?.liveActive ? bands.overall : chapter.energyBase * 0.75;
  const energy = clamp01(
    chapter.energyBase * 0.55 + liveOverall * 0.35 + kickPulse * 0.18
  );

  return {
    beatIndex,
    barIndex,
    beatInBar,
    beatPhase,
    barPhase,
    kickPulse,
    snarePulse,
    energy,
    sectionFlash,
  };
}

/**
 * Pure binary ID3v2.3 / ID3v2.4 parser to extract embedded APIC album artwork
 * directly from the user's MP3 ArrayBuffer with zero external dependencies.
 */
export function parseId3CoverArt(buffer: ArrayBuffer): ParsedId3Cover | null {
  const bytes = new Uint8Array(buffer);
  if (
    bytes.length < 14 ||
    bytes[0] !== 0x49 ||
    bytes[1] !== 0x44 ||
    bytes[2] !== 0x33
  ) {
    return null;
  }

  const version = bytes[3];
  const tagSize =
    ((bytes[6] & 0x7f) << 21) |
    ((bytes[7] & 0x7f) << 14) |
    ((bytes[8] & 0x7f) << 7) |
    (bytes[9] & 0x7f);

  const limit = Math.min(bytes.length, 10 + tagSize);
  let pos = 10;

  while (pos + 10 <= limit) {
    const id = String.fromCharCode(
      bytes[pos],
      bytes[pos + 1],
      bytes[pos + 2],
      bytes[pos + 3]
    );
    if (!/^[A-Z0-9]{4}$/.test(id)) {
      break;
    }

    const frameSize =
      version === 4
        ? ((bytes[pos + 4] & 0x7f) << 21) |
          ((bytes[pos + 5] & 0x7f) << 14) |
          ((bytes[pos + 6] & 0x7f) << 7) |
          (bytes[pos + 7] & 0x7f)
        : ((bytes[pos + 4] << 24) >>> 0) +
          (bytes[pos + 5] << 16) +
          (bytes[pos + 6] << 8) +
          bytes[pos + 7];

    if (frameSize <= 0 || pos + 10 + frameSize > limit) {
      break;
    }

    if (id === 'APIC') {
      const start = pos + 10;
      const end = start + frameSize;
      const encoding = bytes[start];
      let cursor = start + 1;

      let mimeType = '';
      while (cursor < end && bytes[cursor] !== 0) {
        mimeType += String.fromCharCode(bytes[cursor]);
        cursor++;
      }
      cursor++;
      cursor++;

      if (encoding === 1 || encoding === 2) {
        while (cursor + 1 < end && !(bytes[cursor] === 0 && bytes[cursor + 1] === 0)) {
          cursor += 2;
        }
        cursor += 2;
      } else {
        while (cursor < end && bytes[cursor] !== 0) {
          cursor++;
        }
        cursor++;
      }

      if (cursor < end) {
        const normalizedMime =
          !mimeType || mimeType.toLowerCase() === 'image/jpg'
            ? 'image/jpeg'
            : mimeType.toLowerCase();
        return {
          mimeType: normalizedMime,
          imageBytes: bytes.slice(cursor, end),
        };
      }
    }

    pos += 10 + frameSize;
  }

  return null;
}
