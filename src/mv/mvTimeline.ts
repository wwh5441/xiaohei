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

export type LyricSpatialZone =
  | 'sky_upper_left'
  | 'sky_upper_right'
  | 'stage_lower_left'
  | 'stage_lower_right'
  | 'poetic_vertical_right'
  | 'poetic_vertical_left'
  | 'chorus_impact_left'
  | 'chorus_impact_right'
  | 'monolith_bottom_center'
  | 'horizon_upper_center';

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
  ankleOffsetX: number; // in normalized character units `u` (+forward, -backward)
  ankleLiftY: number; // >= 0 upward lift above standing ankle height in `u`
  footPitch: number; // radians: negative = heel-strike dorsiflexion, positive = toe-off plantarflexion
  heelOff: number; // 0..1 heel peel-off ratio during late stance push-off
  isGrounded: boolean;
}

export interface HumanStridePose {
  nearLeg: LegStrideSample;
  farLeg: LegStrideSample;
  pelvisBobY: number; // in `u`: positive = upward passing peak, negative = downward weight-acceptance cushion
  spineLean: number; // radians forward lean
  torsoTwist: number; // -1..1 shoulder counter-rotation relative to pelvis
  farArmSwingX: number; // in `u` counter-swing of free arm
  farArmLiftY: number; // in `u` subtle vertical arc of free arm
  headNod: number; // radians subtle natural head stabilization
}

export interface ParsedId3Cover {
  mimeType: string;
  imageBytes: Uint8Array;
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Analytical 2-bone inverse kinematics solver (shoulder/hip -> elbow/knee -> wrist/ankle).
 * Preserves exact bone lengths len1 and len2 when target is within reach, and clamps
 * cleanly along the target vector if stretched beyond (len1 + len2).
 */
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

  // Law of cosines for angle at root joint
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

/**
 * Gravity-true human arm IK solver: evaluates both anatomical elbow solutions and selects
 * the natural downward-hanging elbow (larger screen Y in +Y-down canvas coordinates),
 * preventing inverted "mantis/dislocated" elbows regardless of facing or reach direction.
 */
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
    // Grounded Stance Phase: constant linear ground speed from front (+R) to rear (-R) -> zero foot skating!
    const uStance = s / stanceSplit;
    const ankleOffsetX = (1 - 2 * uStance) * strideRadiusU;

    if (uStance < 0.15) {
      // Crisp heel strike -> foot flat weight acceptance
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
      // Tall, upright mid-stance support
      return {
        ankleOffsetX,
        ankleLiftY: 0,
        footPitch: 0,
        heelOff: 0,
        isGrounded: true,
      };
    }

    // Late stance heel-peel & toe push-off (ball of foot stays planted while heel peels up)
    const peel = (uStance - 0.68) / 0.32;
    return {
      ankleOffsetX,
      ankleLiftY: 4.2 * peel * peel,
      footPitch: 0.3 * peel,
      heelOff: peel,
      isGrounded: true,
    };
  }

  // Swing Phase: natural bent-knee forward recovery from rear (-R) to front (+R)
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

/**
 * Biomechanical 8-phase human walk cycle solver:
 * Calibrated for 1:7.5 upright adult proportions so the stance leg stands tall (~99% extension)
 * while the swinging leg clears the ground with natural forward knee flexion.
 */
export function computeHumanStridePose(
  walkPhaseRad: number,
  strideRadiusU = 19.5
): HumanStridePose {
  const cycle01 = ((walkPhaseRad / (Math.PI * 2)) % 1 + 1) % 1;
  const nearLeg = sampleSingleLegStride(cycle01, strideRadiusU);
  const farLeg = sampleSingleLegStride(cycle01 + 0.5, strideRadiusU);

  // Subtle double-frequency pelvis wave: slight cushion at double-support, tall passing peak at mid-stance
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

/**
 * Maps each lyric line and active camera shot to the compositional negative space
 * of that exact shot so lyrics act as an organic visual element of the frame.
 */
export function resolveLyricStagePlacement(
  line: LyricLine,
  shot: ShotType,
  _cameraMode: CameraMode = 'auto'
): LyricStagePlacement {
  const numericId = Number(line.id.replace(/\D+/g, '')) || 1;
  const isEven = numericId % 2 === 0;

  switch (shot) {
    case 'guitar_macro':
      // Soundhole at (0.44w, 0.56h), bridge on right -> open upper-left amber studio space
      return {
        zone: 'sky_upper_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'traveler_wide':
      // Sunset at right (0.72w), Traveler + RIMOWA walking in lower-mid -> open upper-left sky
      return {
        zone: 'sky_upper_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'boots_wheels_low':
      // Low-angle RIMOWA & striding boots on asphalt -> open upper-right dramatic sky
      return {
        zone: 'sky_upper_right',
        align: 'right',
        orientation: 'horizontal',
        tiltDeg: -1.5,
        showNextPreview: true,
      };

    case 'scuffed_shell_closeup':
      // Diagonal matte-black grooved shell in center -> poetic vertical-rl along right margin
      return {
        zone: 'poetic_vertical_right',
        align: 'right',
        orientation: 'vertical',
        tiltDeg: 0,
        showNextPreview: false,
      };

    case 'priority_tags_macro':
      // Stacked airline tags -> tilted luggage-label lockup in lower-left negative space
      return {
        zone: 'stage_lower_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: -2,
        showNextPreview: false,
      };

    case 'open_suitcase':
      // Overhead unzipped RIMOWA centered -> clean editorial upper-left studio space
      return {
        zone: 'sky_upper_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'crossroads_pov':
      // Converging highway gantries overhead -> kinetic lower-left road shoulder
      return {
        zone: isEven ? 'stage_lower_left' : 'stage_lower_right',
        align: isEven ? 'left' : 'right',
        orientation: 'horizontal',
        tiltDeg: isEven ? -2 : 2,
        showNextPreview: false,
      };

    case 'chorus_hero_low':
      // Heroic Traveler + RIMOWA silhouette on crest -> dynamic alternating diagonal slams
      return {
        zone: isEven ? 'chorus_impact_left' : 'chorus_impact_right',
        align: isEven ? 'left' : 'right',
        orientation: 'horizontal',
        tiltDeg: isEven ? -2.5 : -1.8,
        showNextPreview: false,
      };

    case 'split_triptych':
      // 3-panel diagonal montage -> punchy lower-left kinetic lockup anchoring the cut
      return {
        zone: 'stage_lower_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: -1.5,
        showNextPreview: false,
      };

    case 'shoulder_companion':
      // Traveler & RIMOWA on terrace parapet on center-right -> open upper-left city bokeh
      return {
        zone: 'sky_upper_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'fortress_monolith':
      // Symmetrical geometric bastion centered -> monumental bottom-center architectural title
      return {
        zone: 'monolith_bottom_center',
        align: 'center',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: false,
      };

    case 'turntable_carousel':
      // Overhead spinning baggage vinyl -> lower-left groove caption
      return {
        zone: 'stage_lower_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'airport_delay_rain':
      // Seated traveler at lower-left/mid, DELAYED board at top-right -> alternate upper-left glass & lower-right wet floor reflection!
      return isEven
        ? {
            zone: 'stage_lower_right',
            align: 'right',
            orientation: 'horizontal',
            tiltDeg: 0,
            showNextPreview: true,
          }
        : {
            zone: 'sky_upper_left',
            align: 'left',
            orientation: 'horizontal',
            tiltDeg: 0,
            showNextPreview: true,
          };

    case 'handle_warmth_macro':
      // Hand & sleeve enter from right to center -> warm bokeh negative space at upper-left
      return {
        zone: 'sky_upper_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'concourse_parting':
      // Spotlight duo in center -> calm upper-right concourse void
      return {
        zone: 'sky_upper_right',
        align: 'right',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'tree_hollow_poetic':
      // Glowing tree hollow in center -> vertical Chinese poetry floating beside fireflies on right
      return {
        zone: 'poetic_vertical_right',
        align: 'right',
        orientation: 'vertical',
        tiltDeg: 0,
        showNextPreview: false,
      };

    case 'whistle_coastal':
      // Whistle waves across upper sky -> breezy lower-left coastal cliff foreground
      return {
        zone: 'stage_lower_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: -1,
        showNextPreview: true,
      };

    case 'timelapse_nostalgia':
      // Center nostalgic circle vs horizontal neon blur -> vertical poetic left column
      return {
        zone: 'poetic_vertical_left',
        align: 'left',
        orientation: 'vertical',
        tiltDeg: 0,
        showNextPreview: false,
      };

    case 'home_doorway_sun':
      // Door + resting RIMOWA on left, polaroids mid-right -> alternate upper-right wall & vertical poetic right
      return isEven
        ? {
            zone: 'sky_upper_right',
            align: 'right',
            orientation: 'horizontal',
            tiltDeg: 0,
            showNextPreview: true,
          }
        : {
            zone: 'poetic_vertical_right',
            align: 'right',
            orientation: 'vertical',
            tiltDeg: 0,
            showNextPreview: false,
          };

    case 'nametag_dream_macro':
      // Swinging cognac leather tag in center -> lower-left warm dream space
      return {
        zone: 'stage_lower_left',
        align: 'left',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: true,
      };

    case 'sunset_horizon_outro':
      // Vast sunset horizon -> serene upper-center closing credits
      return {
        zone: 'horizon_upper_center',
        align: 'center',
        orientation: 'horizontal',
        tiltDeg: 0,
        showNextPreview: false,
      };
  }
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
