import {
  LYRIC_LINES,
  MV_CHAPTERS,
  SHOT_SPECS,
  SONG_META,
  type CameraMode,
  type LyricLine,
  type LyricSpatialZone,
  type MVChapter,
  type ShotCode,
  type ShotSpec,
  type ShotType,
} from './mvData';

export type { LyricSpatialZone };

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
  shotCode: ShotCode;
  spec: ShotSpec;
  label: string;
  cutTransition: number; // 0..1 exponential decay right after a camera cut
  lineProgress: number; // 0..1 progress within active lyric line
}

export interface LyricStagePlacement {
  zone: LyricSpatialZone;
  align: 'left' | 'center' | 'right';
  orientation: 'horizontal' | 'vertical';
  tiltDeg: number;
  showNextPreview: boolean;
}

export interface TwoBoneIKResult {
  elbowX: number;
  elbowY: number;
  handX: number;
  handY: number;
}

export interface LegStrideSample {
  ankleOffsetX: number;
  ankleLiftY: number;
  footPitch: number;
  heelOff: number;
  isGrounded: boolean;
}

export interface HumanStridePose {
  nearLeg: LegStrideSample;
  farLeg: LegStrideSample;
  pelvisBobY: number;
  spineLean: number;
  torsoTwist: number;
  farArmSwingX: number;
  farArmLiftY: number;
  headNod: number;
}

export interface ParsedId3Cover {
  mimeType: string;
  imageBytes: Uint8Array;
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function solveTwoBoneIK(
  rootX: number,
  rootY: number,
  targetX: number,
  targetY: number,
  len1: number,
  len2: number,
  bendSign: 1 | -1 = 1
): TwoBoneIKResult {
  const dx = targetX - rootX;
  const dy = targetY - rootY;
  const rawDist = Math.hypot(dx, dy);
  const minDist = Math.abs(len1 - len2) + 1e-3;
  const maxDist = len1 + len2 - 1e-3;

  if (rawDist < 1e-5) {
    return {
      elbowX: rootX + len1,
      elbowY: rootY,
      handX: rootX + len1 - len2,
      handY: rootY,
    };
  }

  const clampedDist = Math.max(minDist, Math.min(maxDist, rawDist));
  const ux = dx / rawDist;
  const uy = dy / rawDist;

  const cosA = Math.max(
    -1,
    Math.min(1, (len1 * len1 + clampedDist * clampedDist - len2 * len2) / (2 * len1 * clampedDist))
  );
  const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA)) * bendSign;

  const dirX = ux * cosA - uy * sinA;
  const dirY = ux * sinA + uy * cosA;

  const elbowX = rootX + dirX * len1;
  const elbowY = rootY + dirY * len1;
  const handX = rawDist <= maxDist ? targetX : rootX + ux * maxDist;
  const handY = rawDist <= maxDist ? targetY : rootY + uy * maxDist;

  return { elbowX, elbowY, handX, handY };
}

export function solveGravityArmIK(
  shoulderX: number,
  shoulderY: number,
  wristX: number,
  wristY: number,
  upperLen: number,
  foreLen: number,
  preferElbowOffsetX = 0
): TwoBoneIKResult {
  const pos = solveTwoBoneIK(shoulderX, shoulderY, wristX, wristY, upperLen, foreLen, 1);
  const neg = solveTwoBoneIK(shoulderX, shoulderY, wristX, wristY, upperLen, foreLen, -1);

  if (Math.abs(pos.elbowY - neg.elbowY) > 0.5) {
    return pos.elbowY >= neg.elbowY ? pos : neg;
  }
  if (preferElbowOffsetX !== 0) {
    const posScore = (pos.elbowX - shoulderX) * Math.sign(preferElbowOffsetX);
    const negScore = (neg.elbowX - shoulderX) * Math.sign(preferElbowOffsetX);
    return posScore >= negScore ? pos : neg;
  }
  return pos;
}

function sampleSingleLegStride(phase01: number, strideRadiusU: number): LegStrideSample {
  const s = ((phase01 % 1) + 1) % 1;
  const stanceSplit = 0.58;

  if (s < stanceSplit) {
    const uStance = s / stanceSplit;
    const ankleOffsetX = (1 - 2 * uStance) * strideRadiusU;

    if (uStance < 0.15) {
      const k = 1 - uStance / 0.15;
      return {
        ankleOffsetX,
        ankleLiftY: 0.9 * k,
        footPitch: -0.2 * k,
        heelOff: 0,
        isGrounded: true,
      };
    }

    if (uStance < 0.68) {
      return {
        ankleOffsetX,
        ankleLiftY: 0,
        footPitch: 0,
        heelOff: 0,
        isGrounded: true,
      };
    }

    const peel = (uStance - 0.68) / 0.32;
    return {
      ankleOffsetX,
      ankleLiftY: 4.2 * peel * peel,
      footPitch: 0.3 * peel,
      heelOff: peel,
      isGrounded: true,
    };
  }

  const uSwing = (s - stanceSplit) / (1 - stanceSplit);
  const swingEase = 0.5 - 0.5 * Math.cos(Math.PI * uSwing);
  const ankleOffsetX = (-1 + 2 * swingEase) * strideRadiusU;
  const ankleLiftY =
    Math.sin(Math.PI * Math.pow(uSwing, 0.85)) * 14.2 +
    4.2 * Math.pow(1 - uSwing, 2.2);
  const footPitch = 0.28 * Math.pow(1 - uSwing, 1.9) - 0.2 * Math.pow(uSwing, 1.55);

  return {
    ankleOffsetX,
    ankleLiftY,
    footPitch,
    heelOff: 0,
    isGrounded: false,
  };
}

export function computeHumanStridePose(
  walkPhaseRad: number,
  strideRadiusU = 19.5
): HumanStridePose {
  const cycle01 = ((walkPhaseRad / (Math.PI * 2)) % 1 + 1) % 1;
  const nearLeg = sampleSingleLegStride(cycle01, strideRadiusU);
  const farLeg = sampleSingleLegStride(cycle01 + 0.5, strideRadiusU);

  const pelvisBobY = -Math.cos((cycle01 * 2 - 0.08) * Math.PI * 2) * 1.45;
  const torsoTwist = -Math.cos(cycle01 * Math.PI * 2);
  const farArmSwingX = -nearLeg.ankleOffsetX * 0.62;
  const farArmLiftY = Math.max(0, farArmSwingX) * 0.16 + Math.abs(farArmSwingX) * 0.06;
  const spineLean = 0.038 + Math.sin(cycle01 * Math.PI * 4) * 0.005;
  const headNod = 0.012 - pelvisBobY * 0.003;

  return {
    nearLeg,
    farLeg,
    pelvisBobY,
    spineLean,
    torsoTwist,
    farArmSwingX,
    farArmLiftY,
    headNod,
  };
}

export function resolveLyricStagePlacement(
  _line: LyricLine,
  shot: ShotType,
  _cameraMode: CameraMode = 'auto'
): LyricStagePlacement {
  const spec = SHOT_SPECS[shot] ?? SHOT_SPECS.s01_soundhole_rosette;
  const zone = spec.lyricZone;
  const isVertical = zone === 'poetic_vertical_left' || zone === 'poetic_vertical_right';
  const align: 'left' | 'center' | 'right' =
    zone === 'monolith_bottom_center' || zone === 'horizon_upper_center'
      ? 'center'
      : zone.endsWith('right')
      ? 'right'
      : 'left';

  const tiltDeg =
    zone === 'chorus_impact_left'
      ? -2.2
      : zone === 'chorus_impact_right'
      ? -1.8
      : spec.dutchDeg * 0.35;

  const showNextPreview =
    !isVertical &&
    !spec.instantSlam &&
    zone !== 'monolith_bottom_center' &&
    zone !== 'chorus_impact_left' &&
    zone !== 'chorus_impact_right';

  return {
    zone,
    align,
    orientation: isVertical ? 'vertical' : 'horizontal',
    tiltDeg,
    showNextPreview,
  };
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

export function getShotSeekTimeByIndex(index: number): number {
  const clampedIdx = Math.max(0, Math.min(LYRIC_LINES.length - 1, Math.trunc(index)));
  if (clampedIdx === 0) return 0;
  const line = LYRIC_LINES[clampedIdx];
  return Math.min(line.startTime + 0.06, (line.startTime + line.endTime) * 0.5);
}

export function getAdjacentShotSeekTime(currentTimeSec: number, step: -1 | 1): number {
  const currentIdx = getActiveLyricIndex(currentTimeSec);
  return getShotSeekTimeByIndex(currentIdx + step);
}

export function resolveShotSeekTimeByParam(rawParam: string | null): number | null {
  if (!rawParam) return null;
  const trimmed = rawParam.trim().toUpperCase();
  if (!trimmed) return null;
  const match = /^S?(\d{1,2})$/.exec(trimmed);
  if (!match) return null;
  const num = Number(match[1]);
  if (!Number.isInteger(num) || num < 1 || num > LYRIC_LINES.length) return null;
  return getShotSeekTimeByIndex(num - 1);
}

const LOW_TRACK_CYCLE: ShotType[] = [
  's05_boulevard_odometer_low',
  's16_overpass_sunburst_low',
  's28_tarmac_puddle_reflection_low',
  's39_hydroplane_wheel_spray',
  's58_sparkling_runway_wheels',
];

const MACRO_CYCLE: ShotType[] = [
  's06_anodized_shell_grazing',
  's07_sunset_palm_grip',
  's08_fanned_priority_tags',
  's26_solari_fids_delayed_macro',
  's47_halted_wheel_autumn_leaf',
  's51_cognac_nametag_foil',
];

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
    const picked =
      line.shot === 's47_halted_wheel_autumn_leaf'
        ? 's47_halted_wheel_autumn_leaf'
        : LOW_TRACK_CYCLE[beat.barIndex % LOW_TRACK_CYCLE.length];
    const spec = SHOT_SPECS[picked];
    return {
      shot: picked,
      shotCode: spec.code,
      spec,
      label: `${spec.code} · ${spec.label}`,
      cutTransition: Math.exp(-beat.barPhase * 12) * 0.4,
      lineProgress,
    };
  }

  if (cameraMode === 'macro') {
    const picked =
      line.shot === 's47_halted_wheel_autumn_leaf'
        ? 's47_halted_wheel_autumn_leaf'
        : MACRO_CYCLE[beat.barIndex % MACRO_CYCLE.length];
    const spec = SHOT_SPECS[picked];
    return {
      shot: picked,
      shotCode: spec.code,
      spec,
      label: `${spec.code} · ${spec.label}`,
      cutTransition: Math.exp(-beat.barPhase * 12) * 0.4,
      lineProgress,
    };
  }

  if (cameraMode === 'cinema_wide') {
    const wideShot: ShotType =
      line.chapterId === 'verse2'
        ? 's34_empty_corridor_solitude'
        : line.chapterId === 'whistle'
        ? 's45_kamakura_whistle_coast'
        : line.chapterId === 'bridge'
        ? 's53_polaroid_twine_wall_crescendo'
        : line.shot === 's66_uyuni_mirror_outro'
        ? 's66_uyuni_mirror_outro'
        : line.chapterId === 'finale'
        ? 's62_aerial_causeway_duo'
        : 's04_viaduct_sunset_wide';
    const spec = SHOT_SPECS[wideShot];
    return {
      shot: wideShot,
      shotCode: spec.code,
      spec,
      label: `${spec.code} · ${spec.label}`,
      cutTransition: sinceLineStart < 0.35 ? Math.exp(-sinceLineStart * 9) : 0,
      lineProgress,
    };
  }

  // Default 'auto': 66 globally unique storyboard shots — every LRC cut triggers a fresh montage cut!
  const spec = SHOT_SPECS[line.shot];
  const prevLine = idx > 0 ? LYRIC_LINES[idx - 1] : null;
  const didShotChange = !prevLine || prevLine.shot !== line.shot;
  const cutTransition =
    didShotChange && sinceLineStart < 0.38 ? Math.exp(-sinceLineStart * 8.5) : 0;

  return {
    shot: line.shot,
    shotCode: line.shotCode,
    spec,
    label: `${line.shotCode} · ${line.shotLabel}`,
    cutTransition,
    lineProgress,
  };
}

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
