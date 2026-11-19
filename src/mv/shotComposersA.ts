import { TRAVEL_STICKERS, type ShotType } from './mvData';
import { renderMidgroundDiegeticLyrics } from './diegeticLyrics';
import { solveGravityArmIK, solveTwoBoneIK } from './mvTimeline';
import {
  drawCoupledTravelerAndRimowa,
  drawFirstPersonPovHandOnHandle,
  drawOverTheShoulderCompanion,
  drawRimowaCabin,
} from './humanRimowaRig';
import {
  drawAnamorphicFlare,
  drawCinemaBokeh,
  drawDistantCitySkyline,
  drawPrecisionRimowaWheel,
  drawPriorityCard,
  drawStarfieldAndClouds,
  drawTyndallGodRays,
  hash01,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * Renders Storyboard Shots S01 through S23 (Intro, Verse 1, Pre-Chorus 1, Chorus 1).
 * Every single shot has its own globally unique staging, focal length, lighting, and physical action.
 */
export function renderShotGroupA(sc: ShotContext, shot: ShotType): boolean {
  switch (shot) {
    case 's01_soundhole_rosette':
      renderS01SoundholeRosette(sc);
      return true;
    case 's02_bridge_percussive_slap':
      renderS02BridgePercussiveSlap(sc);
      return true;
    case 's03_hallway_wheels_wakeup':
      renderS03HallwayWheelsWakeup(sc);
      return true;
    case 's04_viaduct_sunset_wide':
      renderS04ViaductSunsetWide(sc);
      return true;
    case 's05_boulevard_odometer_low':
      renderS05BoulevardOdometerLow(sc);
      return true;
    case 's06_anodized_shell_grazing':
      renderS06AnodizedShellGrazing(sc);
      return true;
    case 's07_sunset_palm_grip':
      renderS07SunsetPalmGrip(sc);
      return true;
    case 's08_fanned_priority_tags':
      renderS08FannedPriorityTags(sc);
      return true;
    case 's09_customs_medal_postmark':
      renderS09CustomsMedalPostmark(sc);
      return true;
    case 's10_bluehour_stranger_skyline':
      renderS10BluehourStrangerSkyline(sc);
      return true;
    case 's11_escalator_side_support':
      renderS11EscalatorSideSupport(sc);
      return true;
    case 's12_overhead_packed_halves':
      renderS12OverheadPackedHalves(sc);
      return true;
    case 's13_misty_gantry_fork_pov':
      renderS13MistyGantryForkPov(sc);
      return true;
    case 's14_corner_rivet_patina':
      renderS14CornerRivetPatina(sc);
      return true;
    case 's15_cobblestone_silent_wheels':
      renderS15CobblestoneSilentWheels(sc);
      return true;
    case 's16_overpass_sunburst_low':
      renderS16OverpassSunburstLow(sc);
      return true;
    case 's17_diptych_pack_and_carry':
      renderS17DiptychPackAndCarry(sc);
      return true;
    case 's18_slipstream_tag_whip':
      renderS18SlipstreamTagWhip(sc);
      return true;
    case 's19_ots_shoulder_horizon':
      renderS19OtsShoulderHorizon(sc);
      return true;
    case 's20_heavy_load_compression':
      renderS20HeavyLoadCompression(sc);
      return true;
    case 's21_tunnel_flare_rush_pov':
      renderS21TunnelFlareRushPov(sc);
      return true;
    case 's22_crest_leap_silhouette':
      renderS22CrestLeapSilhouette(sc);
      return true;
    case 's23_brutalist_light_fortress':
      renderS23BrutalistLightFortress(sc);
      return true;
    default:
      return false;
  }
}

// ============================================================================
// 01. INTRO (S01 – S03)
// ============================================================================

function renderS01SoundholeRosette(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const cx = w * 0.5;
  const cy = h * 0.52;
  const holeR = Math.min(w, h) * 0.27;

  // Roasted Sitka spruce soundboard with vertical bookmatched wood grain
  const wood = ctx.createRadialGradient(cx, cy - h * 0.1, holeR * 0.2, cx, cy, Math.max(w, h) * 0.75);
  wood.addColorStop(0, '#7c3f16');
  wood.addColorStop(0.52, '#451e09');
  wood.addColorStop(1, '#160904');
  ctx.fillStyle = wood;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = 'rgba(254, 215, 170, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 9) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.restore();

  // Concentric abalone & maple rosette rings
  for (const [mult, stroke, lw] of [
    [1.22, 'rgba(251, 191, 36, 0.42)', 2.5],
    [1.14, 'rgba(45, 212, 191, 0.36)', 4.5],
    [1.07, 'rgba(254, 243, 199, 0.55)', 1.8],
  ] as const) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(cx, cy, holeR * mult, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Deep acoustic soundhole + vintage cream inner luthier paper label
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
  ctx.fillStyle = '#090504';
  ctx.fill();
  ctx.clip();

  const labelW = holeR * 1.48;
  const labelH = holeR * 0.96;
  ctx.fillStyle = '#f5ebd6';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.6;
  roundRectPath(ctx, cx - labelW * 0.5, cy - labelH * 0.46, labelW, labelH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${Math.round(holeR * 0.155)}px "Noto Sans SC", "Outfit", sans-serif`;
  ctx.fillText('嘿！小黑 · 20"', cx, cy - holeR * 0.255);
  ctx.font = `600 ${Math.round(holeR * 0.092)}px "Outfit", "Noto Sans SC", sans-serif`;
  ctx.fillStyle = '#78350f';
  ctx.fillText('Ham ·《To 我的好朋友》', cx, cy);
  ctx.font = `700 ${Math.round(holeR * 0.072)}px "JetBrains Mono", monospace`;
  ctx.fillText('96 BPM · ACOUSTIC EDITION', cx, cy + holeR * 0.255);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();

  // 6 phosphor-bronze strings crossing horizontally — resonating as acoustic guitar enters at ~2.92s
  const acousticLive = timeSec >= 2.88;
  const vibDrive = acousticLive
    ? 1.5 + sc.beat.kickPulse * 4.6 + sc.bands.mid * 5.2 + sc.bands.bass * 3.4
    : 0;
  for (let s = 0; s < 6; s++) {
    const sy = cy - holeR * 0.64 + (s / 5) * holeR * 1.28;
    const thick = 1.3 + (5 - s) * 0.48;
    ctx.strokeStyle = s < 3 ? '#d97706' : '#fef3c7';
    ctx.globalAlpha = 0.84;
    ctx.lineWidth = thick;
    ctx.beginPath();
    if (!acousticLive) {
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
    } else {
      const segs = 28;
      const stringAmp = vibDrive * (0.45 + (5 - s) * 0.11);
      for (let i = 0; i <= segs; i++) {
        const fx = i / segs;
        const px = fx * w;
        const env = Math.sin(fx * Math.PI);
        const dy = Math.sin(timeSec * (38 + s * 6.5) + fx * 6.2 + s) * stringAmp * env;
        if (i === 0) ctx.moveTo(px, sy + dy);
        else ctx.lineTo(px, sy + dy);
      }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  drawTyndallGodRays(ctx, w * 0.15, -40, 5, 0.95, 0.45, h * 1.2, '253, 224, 71', 0.12);
  drawCinemaBokeh(sc, 10, '#f59e0b', '#fde68a', 0.75);
}

function renderS02BridgePercussiveSlap(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat, bands } = sc;

  // Oblique 45-degree dark rosewood & cedar soundboard lighting
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#2a1207');
  bg.addColorStop(0.55, '#59280e');
  bg.addColorStop(1, '#120703');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const bridgeX = w * 0.66;
  const bridgeY = h * 0.54;
  const slapAmp = beat.kickPulse * 18 + beat.snarePulse * 14 + bands.mid * 10;

  // Acoustic percussive pressure wave rings expanding from the rosewood bridge on every beat!
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let r = 0; r < 3; r++) {
    const phase = (beat.beatPhase + r * 0.33) % 1;
    const rad = 60 + phase * Math.min(w, h) * 0.52;
    ctx.strokeStyle = `rgba(251, 191, 36, ${((1 - phase) * 0.38).toFixed(3)})`;
    ctx.lineWidth = 2.2 - phase * 1.4;
    ctx.beginPath();
    ctx.arc(bridgeX - 30, bridgeY, rad, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Carved Indian rosewood guitar bridge block + cream bone saddle + 6 brass pins
  ctx.save();
  ctx.translate(bridgeX, bridgeY);
  ctx.rotate(-0.08);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
  roundRectPath(ctx, -46, -195, 118, 390, 14);
  ctx.fill();

  const rwGrad = ctx.createLinearGradient(-52, -190, 66, 190);
  rwGrad.addColorStop(0, '#29120a');
  rwGrad.addColorStop(0.5, '#3f1d11');
  rwGrad.addColorStop(1, '#170905');
  ctx.fillStyle = rwGrad;
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, -52, -190, 112, 380, 12);
  ctx.fill();
  ctx.stroke();

  // Slanted compensated bone saddle
  ctx.fillStyle = '#fef3c7';
  roundRectPath(ctx, -28, -162, 12, 324, 5);
  ctx.fill();

  // 6 vibrating phosphor-bronze strings anchored into 6 brass bridge pins
  for (let s = 0; s < 6; s++) {
    const sy = -135 + (s / 5) * 270;
    // Brass pin with abalone dot
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(18, sy, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(18, sy, 3.6, 0, Math.PI * 2);
    ctx.fill();

    // Standing-wave plucked string envelope stretching across frame left
    ctx.strokeStyle = s < 3 ? '#f59e0b' : '#fde68a';
    ctx.lineWidth = 1.6 + (5 - s) * 0.55;
    ctx.beginPath();
    const spanLeft = -w * 0.78;
    for (let seg = 0; seg <= 28; seg++) {
      const f = seg / 28;
      const lx = -22 + spanLeft * f;
      const env = Math.sin(f * Math.PI);
      const vib = Math.sin(timeSec * (44 + s * 5) + f * 9) * slapAmp * env * (0.45 + (5 - s) * 0.1);
      if (seg === 0) ctx.moveTo(lx, sy + vib);
      else ctx.lineTo(lx, sy + vib);
    }
    ctx.stroke();
  }
  ctx.restore();

  drawAnamorphicFlare(ctx, bridgeX - 24, bridgeY - 20, w * 0.45, 22, '#fbbf24', 0.35 + beat.snarePulse * 0.45);
}

function hermite1D(p: number, x0: number, v0: number, x1: number, v1: number): number {
  const p2 = p * p;
  const p3 = p2 * p;
  return (
    (2 * p3 - 3 * p2 + 1) * x0 +
    (p3 - 2 * p2 + p) * v0 +
    (-2 * p3 + 3 * p2) * x1 +
    (p3 - p2) * v1
  );
}

interface S03FootState {
  ankleX: number;
  ankleY: number;
  pitch: number;
  heelPeel: number;
  ballPivotX: number;
}

export function sampleS03ContactLockedFoot(
  isStance: boolean,
  p: number,
  stanceFlatX: number,
  swingStartFlatX: number,
  swingEndFlatX: number,
  groundY: number,
  u: number
): S03FootState {
  const heelBack = 6.5 * u;
  const ballFwd = 11.5 * u;
  const soleH = 7.5 * u;

  // Exact boundary pose at end of stance (p = 1.0, ball-pinned heel peel +0.26 rad)
  const pitchToeOff = 0.26;
  const dPitchToeOff = (pitchToeOff * 2) / 0.32; // +1.625 rad/step
  const cosToe = Math.cos(pitchToeOff);
  const sinToe = Math.sin(pitchToeOff);
  const xToeOffOffset = ballFwd - (ballFwd * cosToe - soleH * sinToe);
  const yToeOffHeight = ballFwd * sinToe + soleH * cosToe;
  const vxToeOff = (ballFwd * sinToe + soleH * cosToe) * dPitchToeOff;
  const vyToeOff = -(ballFwd * cosToe - soleH * sinToe) * dPitchToeOff;

  // Exact boundary pose at start of stance (p = 0.0, heel-pinned touchdown -0.20 rad)
  const pitchHeelStrike = -0.2;
  const dPitchHeelStrike = (-pitchHeelStrike * 2) / 0.18; // +2.222 rad/step
  const cosHeel = Math.cos(pitchHeelStrike);
  const sinHeel = Math.sin(pitchHeelStrike);
  const xHeelStrikeOffset = -heelBack - (-heelBack * cosHeel - soleH * sinHeel);
  const yHeelStrikeHeight = -heelBack * sinHeel + soleH * cosHeel;
  const vxHeelStrike = (heelBack * sinHeel + soleH * cosHeel) * dPitchHeelStrike;
  const vyHeelStrike = (heelBack * cosHeel + soleH * sinHeel) * dPitchHeelStrike;

  if (isStance) {
    if (p < 0.18) {
      // Heel rocker: heel stays 100% pinned at (stanceFlatX - heelBack, groundY)
      const q = 1 - p / 0.18;
      const pitch = pitchHeelStrike * q * q;
      const c = Math.cos(pitch);
      const s = Math.sin(pitch);
      const heelWorldX = stanceFlatX - heelBack;
      return {
        ankleX: heelWorldX - (-heelBack * c - soleH * s),
        ankleY: groundY - (-heelBack * s + soleH * c),
        pitch,
        heelPeel: 0,
        ballPivotX: stanceFlatX + ballFwd,
      };
    }
    if (p <= 0.68) {
      // Flat foot support: 100% locked sole on oak floor (zero horizontal or vertical slip)
      return {
        ankleX: stanceFlatX,
        ankleY: groundY - soleH,
        pitch: 0,
        heelPeel: 0,
        ballPivotX: stanceFlatX + ballFwd,
      };
    }
    // Forefoot rocker: ball & toes stay 100% pinned at (stanceFlatX + ballFwd, groundY)
    const r = (p - 0.68) / 0.32;
    const pitch = pitchToeOff * r * r;
    const c = Math.cos(pitch);
    const s = Math.sin(pitch);
    const ballWorldX = stanceFlatX + ballFwd;
    return {
      ankleX: ballWorldX - (ballFwd * c - soleH * s),
      ankleY: groundY - (ballFwd * s + soleH * c),
      pitch,
      heelPeel: r * r,
      ballPivotX: ballWorldX,
    };
  }

  // C1-continuous swing trajectory from swingStartFlatX toe-off to swingEndFlatX heel-strike
  const x0 = swingStartFlatX + xToeOffOffset;
  const y0 = groundY - yToeOffHeight;
  const x1 = swingEndFlatX + xHeelStrikeOffset;
  const y1 = groundY - yHeelStrikeHeight;

  const sinBell = Math.sin(p * Math.PI);
  const clearanceLift = sinBell * sinBell * 6.8 * u;
  const ankleX = hermite1D(p, x0, vxToeOff, x1, vxHeelStrike);
  const ankleY = hermite1D(p, y0, vyToeOff, y1, vyHeelStrike) - clearanceLift;
  const pitch =
    hermite1D(p, pitchToeOff, dPitchToeOff, pitchHeelStrike, dPitchHeelStrike) -
    sinBell * sinBell * 0.16;

  return {
    ankleX,
    ankleY,
    pitch,
    heelPeel: 0,
    ballPivotX: ankleX + ballFwd,
  };
}

function drawS03ContinuousLimb(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r0: number,
  r1: number,
  r2: number,
  colorBack: string,
  colorMid: string,
  colorFront: string,
  rimHighlight?: string
): void {
  const d1x = x1 - x0;
  const d1y = y1 - y0;
  const l1 = Math.hypot(d1x, d1y) || 1;
  const u1x = d1x / l1;
  const u1y = d1y / l1;
  const n1x = u1y;
  const n1y = -u1x;

  const d2x = x2 - x1;
  const d2y = y2 - y1;
  const l2 = Math.hypot(d2x, d2y) || 1;
  const u2x = d2x / l2;
  const u2y = d2y / l2;
  const n2x = u2y;
  const n2y = -u2x;

  let mx = n1x + n2x;
  let my = n1y + n2y;
  const ml = Math.hypot(mx, my) || 1;
  mx /= ml;
  my /= ml;

  const b0x = x0 - n1x * r0;
  const b0y = y0 - n1y * r0;
  const f0x = x0 + n1x * r0;
  const f0y = y0 + n1y * r0;

  const b1x = x1 - mx * r1 * 0.95;
  const b1y = y1 - my * r1 * 0.95;
  const f1x = x1 + mx * r1;
  const f1y = y1 + my * r1;

  const b2x = x2 - n2x * r2;
  const b2y = y2 - n2y * r2;
  const f2x = x2 + n2x * r2;
  const f2y = y2 + n2y * r2;

  // Approach points around middle joint for smooth seamless cloth bend (zero kneecap/elbow circle!)
  const b1PreX = x1 - u1x * r1 * 0.9 - n1x * r1 * 0.96;
  const b1PreY = y1 - u1y * r1 * 0.9 - n1y * r1 * 0.96;
  const b1PostX = x1 + u2x * r1 * 0.9 - n2x * r1 * 0.96;
  const b1PostY = y1 + u2y * r1 * 0.9 - n2y * r1 * 0.96;

  const f1PreX = x1 - u1x * r1 * 0.9 + n1x * r1;
  const f1PreY = y1 - u1y * r1 * 0.9 + n1y * r1;
  const f1PostX = x1 + u2x * r1 * 0.9 + n2x * r1;
  const f1PostY = y1 + u2y * r1 * 0.9 + n2y * r1;

  const grad = ctx.createLinearGradient(b1x, b1y, f1x, f1y);
  grad.addColorStop(0, colorBack);
  grad.addColorStop(0.55, colorMid);
  grad.addColorStop(1, colorFront);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(b0x, b0y);
  ctx.lineTo(b1PreX, b1PreY);
  ctx.quadraticCurveTo(b1x, b1y, b1PostX, b1PostY);
  ctx.lineTo(b2x, b2y);
  ctx.lineTo(f2x, f2y);
  ctx.lineTo(f1PostX, f1PostY);
  ctx.quadraticCurveTo(f1x, f1y, f1PreX, f1PreY);
  ctx.lineTo(f0x, f0y);
  ctx.quadraticCurveTo(x0 - u1x * r0 * 0.65, y0 - u1y * r0 * 0.65, b0x, b0y);
  ctx.closePath();
  ctx.fill();

  if (rimHighlight) {
    ctx.save();
    ctx.strokeStyle = rimHighlight;
    ctx.lineWidth = Math.max(1.0, r2 * 0.24);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(f0x, f0y);
    ctx.lineTo(f1PreX, f1PreY);
    ctx.quadraticCurveTo(f1x, f1y, f1PostX, f1PostY);
    ctx.lineTo(f2x, f2y);
    ctx.stroke();
    ctx.restore();
  }
}

function drawS03ChelseaBoot(
  ctx: CanvasRenderingContext2D,
  foot: S03FootState,
  groundY: number,
  u: number,
  isNear: boolean
): void {
  const leatherDark = isNear ? '#2e1a10' : '#1f120b';
  const leatherLight = isNear ? '#5c3622' : '#3d2417';
  const soleColor = '#140c08';
  const heelBack = 6.5 * u;
  const ballFwd = 11.5 * u;
  const toeFwd = 19.2 * u;
  const soleH = 7.5 * u;

  ctx.save();
  if (foot.heelPeel > 0.001) {
    const bx = foot.ballPivotX;
    const toeLen = toeFwd - ballFwd;

    const toeGrad = ctx.createLinearGradient(bx - 2 * u, groundY - 6 * u, bx + toeLen, groundY);
    toeGrad.addColorStop(0, leatherDark);
    toeGrad.addColorStop(1, leatherLight);
    ctx.fillStyle = toeGrad;
    ctx.beginPath();
    ctx.moveTo(bx - 2.5 * u, groundY - 5.8 * u);
    ctx.quadraticCurveTo(bx + toeLen * 0.72, groundY - 5.4 * u, bx + toeLen, groundY - 2.2 * u);
    ctx.quadraticCurveTo(bx + toeLen + 0.6 * u, groundY - 0.5 * u, bx + toeLen - 0.8 * u, groundY);
    ctx.lineTo(bx - 2.5 * u, groundY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = soleColor;
    ctx.fillRect(bx - 2.2 * u, groundY - 1.7 * u, toeLen + 1.4 * u, 1.7 * u);

    ctx.translate(bx, groundY);
    ctx.rotate(foot.pitch);
    const rearGrad = ctx.createLinearGradient(-ballFwd - heelBack, -soleH - 6 * u, 0, 0);
    rearGrad.addColorStop(0, leatherDark);
    rearGrad.addColorStop(1, leatherLight);
    ctx.fillStyle = rearGrad;
    ctx.beginPath();
    ctx.moveTo(-ballFwd - heelBack + 0.8 * u, -1.8 * u);
    ctx.quadraticCurveTo(-ballFwd - heelBack - 0.6 * u, -soleH, -ballFwd - 4.8 * u, -soleH - 6.5 * u);
    ctx.lineTo(-ballFwd + 4.8 * u, -soleH - 6.2 * u);
    ctx.quadraticCurveTo(-3.5 * u, -7.2 * u, 1.2 * u, -5.5 * u);
    ctx.lineTo(1.2 * u, 0);
    ctx.lineTo(-ballFwd - heelBack + 0.8 * u, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = soleColor;
    ctx.fillRect(-ballFwd - heelBack + 0.8 * u, -2.0 * u, ballFwd + heelBack + 0.4 * u, 2.0 * u);
    ctx.fillRect(-ballFwd - heelBack + 0.8 * u, -3.4 * u, 6.2 * u, 3.4 * u);
  } else {
    ctx.translate(foot.ankleX, foot.ankleY);
    ctx.rotate(foot.pitch);

    const bootGrad = ctx.createLinearGradient(-heelBack, -6 * u, toeFwd, soleH);
    bootGrad.addColorStop(0, leatherDark);
    bootGrad.addColorStop(0.65, leatherLight);
    bootGrad.addColorStop(1, isNear ? '#73452c' : '#4a2c1d');
    ctx.fillStyle = bootGrad;

    ctx.beginPath();
    ctx.moveTo(-heelBack + 0.8 * u, soleH - 1.8 * u);
    ctx.quadraticCurveTo(-heelBack - 0.6 * u, 0, -4.8 * u, -6.5 * u);
    ctx.lineTo(4.8 * u, -6.2 * u);
    ctx.quadraticCurveTo(8.5 * u, 0.2 * u, ballFwd + 1.5 * u, 2.0 * u);
    ctx.quadraticCurveTo(toeFwd * 0.92, 2.5 * u, toeFwd, soleH - 2.2 * u);
    ctx.quadraticCurveTo(toeFwd + 0.5 * u, soleH - 0.4 * u, toeFwd - 0.8 * u, soleH);
    ctx.lineTo(-heelBack + 0.8 * u, soleH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#18110e';
    roundRectPath(ctx, -2.2 * u, -5.6 * u, 4.4 * u, 6.8 * u, 1.4 * u);
    ctx.fill();

    ctx.fillStyle = soleColor;
    ctx.fillRect(-heelBack + 0.8 * u, soleH - 1.9 * u, toeFwd + heelBack - 1.6 * u, 1.9 * u);
    ctx.fillRect(-heelBack + 0.8 * u, soleH - 3.3 * u, 6.4 * u, 3.3 * u);
  }
  ctx.restore();
}

function drawS03SunlitMorningHead(
  ctx: CanvasRenderingContext2D,
  neckX: number,
  neckY: number,
  u: number,
  headTilt: number,
  stepPhase: number
): void {
  const hairMicroBounce = Math.sin(stepPhase * Math.PI * 2) * 0.4 * u;
  ctx.save();
  ctx.translate(neckX, neckY);
  ctx.rotate(headTilt);

  // 1. Natural forward-angled sternocleidomastoid neck seated deeply into collar
  const neckGrad = ctx.createLinearGradient(-5.5 * u, -5 * u, 5.8 * u, -5 * u);
  neckGrad.addColorStop(0, '#965d45');
  neckGrad.addColorStop(0.55, '#c78769');
  neckGrad.addColorStop(1, '#eab99b');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(-5.4 * u, 4.0 * u);
  ctx.quadraticCurveTo(-4.8 * u, -3.5 * u, -3.6 * u, -10.6 * u);
  ctx.lineTo(5.2 * u, -9.2 * u);
  ctx.quadraticCurveTo(4.8 * u, -2.8 * u, 5.0 * u, 4.0 * u);
  ctx.closePath();
  ctx.fill();

  // Warm jaw cast shadow under chin
  ctx.fillStyle = 'rgba(92, 48, 32, 0.38)';
  ctx.beginPath();
  ctx.moveTo(-0.8 * u, -9.8 * u);
  ctx.lineTo(5.2 * u, -8.2 * u);
  ctx.lineTo(4.2 * u, -4.2 * u);
  ctx.closePath();
  ctx.fill();

  // 2. Proportionate adult side-profile face warmly lit from the sunlit doorway (+X)
  const faceGrad = ctx.createLinearGradient(-8 * u, -22 * u, 14.5 * u, -19 * u);
  faceGrad.addColorStop(0, '#a3664b');
  faceGrad.addColorStop(0.42, '#cf8f70');
  faceGrad.addColorStop(0.82, '#efc2a4');
  faceGrad.addColorStop(1, '#fce4cf');
  ctx.fillStyle = faceGrad;

  ctx.beginPath();
  ctx.moveTo(-5.8 * u, -10.0 * u);
  ctx.bezierCurveTo(-12.2 * u, -16.2 * u, -11.6 * u, -32.2 * u, -1.2 * u, -35.8 * u);
  ctx.bezierCurveTo(6.4 * u, -36.4 * u, 11.1 * u, -31.4 * u, 11.4 * u, -25.0 * u);
  ctx.quadraticCurveTo(11.0 * u, -23.5 * u, 12.3 * u, -21.7 * u);
  ctx.lineTo(14.1 * u, -18.0 * u);
  ctx.quadraticCurveTo(14.3 * u, -17.0 * u, 12.6 * u, -16.5 * u);
  ctx.lineTo(12.5 * u, -14.6 * u);
  ctx.quadraticCurveTo(11.9 * u, -13.8 * u, 12.2 * u, -12.9 * u);
  ctx.quadraticCurveTo(11.5 * u, -11.5 * u, 11.4 * u, -9.6 * u);
  ctx.quadraticCurveTo(10.6 * u, -7.8 * u, 7.2 * u, -7.8 * u);
  ctx.quadraticCurveTo(1.4 * u, -8.5 * u, -2.4 * u, -10.8 * u);
  ctx.closePath();
  ctx.fill();

  // Subtle sunlit golden rim along forehead & nose bridge
  ctx.save();
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.55)';
  ctx.lineWidth = Math.max(0.9, 0.85 * u);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(11.2 * u, -26.5 * u);
  ctx.quadraticCurveTo(11.0 * u, -23.6 * u, 12.2 * u, -21.7 * u);
  ctx.lineTo(13.9 * u, -18.1 * u);
  ctx.stroke();
  ctx.restore();

  // Soft orbital shading + natural eyebrow + subtle living eye (never flat white cartoon sclera)
  const orbitShadow = ctx.createRadialGradient(8.8 * u, -22.6 * u, 0.3 * u, 8.8 * u, -22.6 * u, 2.8 * u);
  orbitShadow.addColorStop(0, 'rgba(112, 62, 42, 0.25)');
  orbitShadow.addColorStop(1, 'rgba(112, 62, 42, 0)');
  ctx.fillStyle = orbitShadow;
  ctx.beginPath();
  ctx.arc(8.8 * u, -22.6 * u, 2.8 * u, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#291a14';
  ctx.lineWidth = Math.max(1.1, 1.15 * u);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(6.8 * u, -25.0 * u);
  ctx.quadraticCurveTo(9.0 * u, -25.8 * u, 10.8 * u, -25.1 * u);
  ctx.stroke();

  // Muted warm sclera + dark espresso iris + tiny sunlit catchlight
  ctx.fillStyle = '#e8dcd2';
  ctx.beginPath();
  ctx.ellipse(8.9 * u, -22.5 * u, 1.55 * u, 0.92 * u, -0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#24140e';
  ctx.beginPath();
  ctx.ellipse(9.45 * u, -22.5 * u, 0.88 * u, 0.92 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.arc(9.75 * u, -22.8 * u, 0.34 * u, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1f120d';
  ctx.lineWidth = Math.max(0.95, 0.9 * u);
  ctx.beginPath();
  ctx.moveTo(7.1 * u, -22.4 * u);
  ctx.quadraticCurveTo(9.0 * u, -23.6 * u, 10.5 * u, -22.6 * u);
  ctx.stroke();

  // Relaxed warm mouth line
  ctx.strokeStyle = '#9c5943';
  ctx.lineWidth = Math.max(0.95, 0.9 * u);
  ctx.beginPath();
  ctx.moveTo(9.6 * u, -13.6 * u);
  ctx.quadraticCurveTo(11.1 * u, -13.4 * u, 12.2 * u, -13.8 * u);
  ctx.stroke();

  // 3. Layered espresso menswear haircut
  const hairGrad = ctx.createLinearGradient(-15 * u, -39 * u, 13 * u, -13 * u);
  hairGrad.addColorStop(0, '#17110e');
  hairGrad.addColorStop(0.68, '#281c16');
  hairGrad.addColorStop(1, '#4a3225');
  ctx.fillStyle = hairGrad;

  ctx.beginPath();
  ctx.moveTo(12.2 * u, -27.2 * u + hairMicroBounce * 0.3);
  ctx.bezierCurveTo(
    13.8 * u,
    -33.5 * u,
    7.4 * u,
    -39.2 * u + hairMicroBounce,
    -1.8 * u,
    -39.0 * u + hairMicroBounce
  );
  ctx.bezierCurveTo(-11.8 * u, -38.8 * u, -15.2 * u, -31.2 * u, -13.8 * u, -20.8 * u);
  ctx.bezierCurveTo(-12.4 * u, -14.8 * u, -9.2 * u, -10.6 * u, -5.8 * u, -9.5 * u);
  ctx.quadraticCurveTo(-4.4 * u, -14.4 * u, -2.4 * u, -19.2 * u);
  ctx.lineTo(-0.4 * u, -16.8 * u);
  ctx.quadraticCurveTo(1.1 * u, -22.2 * u, 4.3 * u, -25.6 * u);
  ctx.quadraticCurveTo(8.4 * u, -27.8 * u, 12.2 * u, -27.2 * u + hairMicroBounce * 0.3);
  ctx.closePath();
  ctx.fill();

  // Natural shaded ear nestled behind sideburn
  ctx.fillStyle = '#c9896b';
  ctx.beginPath();
  ctx.ellipse(-2.3 * u, -18.0 * u, 1.85 * u, 3.0 * u, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawS03MorningTravelerAndXiaohei(sc: ShotContext, floorY: number): void {
  const { ctx, w, h, lineProgress } = sc;
  const groundY = floorY + 22;
  const travelerH = h * 0.51;
  const u = travelerH / 256;

  // Natural adult walking stride: stepLen = 58u (~70% of leg length), 5.0 calm steps across the sunlit foyer!
  const stepLen = 58 * u;
  const startFootX = w * 0.25;
  const sTotal = 0.22 + lineProgress * 4.95;
  const k = Math.floor(sTotal);
  const p = sTotal - k;

  const nearIsStance = k % 2 === 0;
  const xPrev = startFootX + (k - 1) * stepLen;
  const xCurr = startFootX + k * stepLen;
  const xNext = startFootX + (k + 1) * stepLen;

  const nearFoot = sampleS03ContactLockedFoot(
    nearIsStance,
    p,
    xCurr,
    xPrev,
    xNext,
    groundY,
    u
  );
  const farFoot = sampleS03ContactLockedFoot(
    !nearIsStance,
    p,
    xCurr,
    xPrev,
    xNext,
    groundY,
    u
  );

  // Tall upright adult pelvis vault: stance leg stays at ~94%..96.5% extension (upright, zero squat, zero IK snap!)
  const soleH = 7.5 * u;
  const ankleRestY = groundY - soleH;
  const thighLen = 55 * u;
  const calfLen = 53 * u;

  const hipX = startFootX + (sTotal - 0.47) * stepLen + Math.sin(p * Math.PI * 2) * 0.7 * u;
  const hipY = ankleRestY - 101.6 * u - Math.sin((p - 0.12) * Math.PI * 2) * 2.1 * u;

  const nearLegIK = solveTwoBoneIK(
    hipX + 0.8 * u,
    hipY,
    nearFoot.ankleX,
    nearFoot.ankleY,
    thighLen,
    calfLen,
    -1
  );
  const farLegIK = solveTwoBoneIK(
    hipX - 0.8 * u,
    hipY,
    farFoot.ankleX,
    farFoot.ankleY,
    thighLen,
    calfLen,
    -1
  );

  // Upright natural walking posture & counter-swinging left (far) arm
  const spineLean = 0.042 + Math.sin(p * Math.PI * 2) * 0.007;
  const shoulderCenterX = hipX + Math.sin(spineLean) * 55 * u;
  const shoulderCenterY = hipY - Math.cos(spineLean) * 55 * u;
  const neckX = shoulderCenterX + 1.8 * u;
  const neckY = shoulderCenterY - 6.8 * u;

  // Counter-phase arm pendulum: anatomical elbow flexion (bendSign = +1) so elbow never pokes behind spine
  const rightFootLead = (nearFoot.ankleX - hipX) / stepLen;
  const farArmSwingX = Math.max(-5 * u, -rightFootLead * 20 * u + 8 * u);
  const farWristTargetX = shoulderCenterX + 4 * u + farArmSwingX;
  const farWristTargetY =
    shoulderCenterY + 60 * u - Math.max(0, farArmSwingX) * 0.22;
  const upperArmLen = 39 * u;
  const foreArmLen = 37 * u;
  const farArmIK = solveTwoBoneIK(
    shoulderCenterX + 2.5 * u,
    shoulderCenterY + 2.5 * u,
    farWristTargetX,
    farWristTargetY,
    upperArmLen,
    foreArmLen,
    1
  );

  // 1. Directional warm cast shadow on honey-oak floor
  ctx.save();
  const shadowGrad = ctx.createRadialGradient(
    hipX - 24 * u,
    groundY + 2 * u,
    6 * u,
    hipX - 32 * u,
    groundY + 3 * u,
    78 * u
  );
  shadowGrad.addColorStop(0, 'rgba(18, 10, 5, 0.44)');
  shadowGrad.addColorStop(0.62, 'rgba(18, 10, 5, 0.2)');
  shadowGrad.addColorStop(1, 'rgba(18, 10, 5, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(hipX - 28 * u, groundY + 2.5 * u, 74 * u, 8.0 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Far (Left) Swinging Arm (continuous sleeve, behind torso)
  ctx.fillStyle = '#cb8c6d';
  ctx.beginPath();
  ctx.ellipse(farArmIK.handX + 1.5 * u, farArmIK.handY + 1.8 * u, 3.5 * u, 2.5 * u, 0.25, 0, Math.PI * 2);
  ctx.fill();
  drawS03ContinuousLimb(
    ctx,
    shoulderCenterX + 1.5 * u,
    shoulderCenterY + 2 * u,
    farArmIK.elbowX,
    farArmIK.elbowY,
    farArmIK.handX,
    farArmIK.handY,
    6.4 * u,
    5.2 * u,
    4.0 * u,
    '#17202e',
    '#233044',
    '#32435e'
  );

  // 3. Far (Left) Leg + Chelsea Boot (darker warm charcoal-taupe, zero knee circle!)
  drawS03ChelseaBoot(ctx, farFoot, groundY, u, false);
  drawS03ContinuousLimb(
    ctx,
    hipX - 0.8 * u,
    hipY,
    farLegIK.elbowX,
    farLegIK.elbowY,
    farLegIK.handX,
    farLegIK.handY + 1.2 * u,
    9.4 * u,
    6.9 * u,
    4.9 * u,
    '#1e2129',
    '#292d38',
    '#383e4c'
  );

  // 4. 20" Matte-Black RIMOWA Xiaohei rolling cleanly behind trailing foot (~82% relaxed diagonal arm reach!)
  const caseH = 84 * u;
  const caseScale = caseH / 206;
  const wheelRadiusPx = 9.4 * caseScale;
  const suitCx = hipX - 94 * u;
  const wheelSpinRad = (suitCx - (startFootX - 94 * u)) / Math.max(1, wheelRadiusPx);
  const rimowaAnchors = drawRimowaCabin(sc, {
    cx: suitCx,
    bottomY: groundY,
    caseHeightPx: caseH,
    tilt: 0.41,
    handleRatio: 0.35,
    restingOnRearWheels: true,
    warmHandleGlow: true,
    stickerCount: 1,
    wheelAngleOverride: wheelSpinRad,
  });

  // 5. Near (Right) Leg + Chelsea Boot (warm sunlit stone-taupe chino, seamless knee contour)
  drawS03ChelseaBoot(ctx, nearFoot, groundY, u, true);
  drawS03ContinuousLimb(
    ctx,
    hipX + 0.8 * u,
    hipY,
    nearLegIK.elbowX,
    nearLegIK.elbowY,
    nearLegIK.handX,
    nearLegIK.handY + 1.2 * u,
    9.8 * u,
    7.2 * u,
    5.1 * u,
    '#313643',
    '#434a5b',
    '#5c657a',
    'rgba(253, 230, 138, 0.25)'
  );

  // 6. Tailored Field Jacket Torso, Ivory Crewneck & Warm Camel Scarf
  ctx.save();
  ctx.translate(hipX, hipY);
  ctx.rotate(spineLean);

  const jGrad = ctx.createLinearGradient(-13 * u, -30 * u, 15 * u, -30 * u);
  jGrad.addColorStop(0, '#192231');
  jGrad.addColorStop(0.55, '#2b3952');
  jGrad.addColorStop(1, '#465a7d');
  ctx.fillStyle = jGrad;

  ctx.beginPath();
  ctx.moveTo(-11.2 * u, 6.5 * u);
  ctx.bezierCurveTo(-13.4 * u, -14 * u, -13.8 * u, -43 * u, -8.4 * u, -58.5 * u);
  ctx.quadraticCurveTo(0, -62.5 * u, 8.8 * u, -58.0 * u);
  ctx.bezierCurveTo(13.8 * u, -42 * u, 13.4 * u, -14 * u, 11.4 * u, 6.0 * u);
  ctx.quadraticCurveTo(0, 8.2 * u, -11.2 * u, 6.5 * u);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(254, 243, 199, 0.34)';
  ctx.lineWidth = Math.max(1.1, 1.25 * u);
  ctx.beginPath();
  ctx.moveTo(9.4 * u, -56.5 * u);
  ctx.quadraticCurveTo(12.8 * u, -26 * u, 11.0 * u, 5.2 * u);
  ctx.stroke();

  ctx.fillStyle = '#f5efe6';
  ctx.beginPath();
  ctx.moveTo(-1.5 * u, -59.5 * u);
  ctx.quadraticCurveTo(4.8 * u, -55.5 * u, 8.6 * u, -57.8 * u);
  ctx.lineTo(6.8 * u, -61.2 * u);
  ctx.closePath();
  ctx.fill();

  const scarfSway = Math.sin(p * Math.PI * 2) * 1.1 * u;
  const scarfGrad = ctx.createLinearGradient(-11 * u, -59 * u, 10 * u, -53 * u);
  scarfGrad.addColorStop(0, '#85491e');
  scarfGrad.addColorStop(0.6, '#be6e2e');
  scarfGrad.addColorStop(1, '#e09448');
  ctx.fillStyle = scarfGrad;
  roundRectPath(ctx, -9.4 * u, -62.0 * u, 18.6 * u, 8.0 * u, 3.8 * u);
  ctx.fill();

  ctx.fillStyle = '#a85e26';
  ctx.beginPath();
  ctx.moveTo(-6.4 * u, -54.8 * u);
  ctx.quadraticCurveTo(-11.0 * u + scarfSway, -42 * u, -9.4 * u + scarfSway, -31.5 * u);
  ctx.lineTo(-4.2 * u + scarfSway * 0.7, -32.2 * u);
  ctx.quadraticCurveTo(-5.2 * u, -43 * u, -1.8 * u, -54.8 * u);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 7. Warm Sunlit Morning Head, Subtle Living Eye & Espresso Hair
  const headNod = -0.015 + Math.cos(p * Math.PI * 2) * 0.01;
  drawS03SunlitMorningHead(ctx, neckX, neckY, u, headNod, p);

  // 8. Near (Right) Diagonal Towing Arm & Hand Gripping Xiaohei's T-Handle
  const nearShoulderX = shoulderCenterX - 1.2 * u;
  const nearShoulderY = shoulderCenterY + 2.8 * u;
  const nearArmIK = solveGravityArmIK(
    nearShoulderX,
    nearShoulderY,
    rimowaAnchors.gripX,
    rimowaAnchors.gripY,
    upperArmLen,
    foreArmLen,
    -1
  );

  // Hand & cuff drawn cleanly around T-handle, seamless continuous sleeve over arm
  const wristAngle = Math.atan2(
    nearArmIK.handY - nearArmIK.elbowY,
    nearArmIK.handX - nearArmIK.elbowX
  );
  ctx.save();
  ctx.translate(nearArmIK.handX, nearArmIK.handY);
  ctx.rotate(wristAngle);
  const handGrad = ctx.createLinearGradient(-1 * u, -3.5 * u, 6 * u, 3.5 * u);
  handGrad.addColorStop(0, '#c28466');
  handGrad.addColorStop(1, '#ecc0a3');
  ctx.fillStyle = handGrad;
  roundRectPath(ctx, -0.8 * u, -3.2 * u, 6.8 * u, 6.2 * u, 2.5 * u);
  ctx.fill();

  ctx.fillStyle = '#f5efe6';
  roundRectPath(ctx, -3.4 * u, -3.5 * u, 3.2 * u, 7.0 * u, 1.1 * u);
  ctx.fill();
  ctx.restore();

  drawS03ContinuousLimb(
    ctx,
    nearShoulderX,
    nearShoulderY,
    nearArmIK.elbowX,
    nearArmIK.elbowY,
    nearArmIK.handX - Math.cos(wristAngle) * 2.2 * u,
    nearArmIK.handY - Math.sin(wristAngle) * 2.2 * u,
    6.9 * u,
    5.5 * u,
    4.2 * u,
    '#202b3d',
    '#2e3e57',
    '#43587a',
    'rgba(253, 230, 138, 0.22)'
  );
}

function renderS03HallwayWheelsWakeup(sc: ShotContext): void {
  const { ctx, w, h, timeSec, lineProgress } = sc;
  const floorY = h * 0.78;

  // 1. Warm interior apartment foyer plaster wall & subtle wainscot molding
  const wall = ctx.createLinearGradient(0, 0, w * 0.68, floorY);
  wall.addColorStop(0, '#1c1512');
  wall.addColorStop(0.55, '#33261d');
  wall.addColorStop(1, '#523b2a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, floorY);

  // Architectural wainscot chair-rail & tall baseboard along foyer wall
  ctx.fillStyle = '#261c15';
  ctx.fillRect(0, floorY - 34, w * 0.64, 34);
  ctx.strokeStyle = 'rgba(254, 215, 170, 0.16)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, floorY - 34);
  ctx.lineTo(w * 0.64, floorY - 34);
  ctx.moveTo(0, h * 0.48);
  ctx.lineTo(w * 0.6, h * 0.48);
  ctx.stroke();

  // Framed travel photograph hanging on foyer wall (left third)
  const frameX = w * 0.12;
  const frameY = h * 0.18;
  const frameW = w * 0.12;
  const frameH = h * 0.2;
  ctx.fillStyle = '#140e0b';
  ctx.strokeStyle = 'rgba(214, 180, 132, 0.42)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, frameX, frameY, frameW, frameH, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#e7dcc8';
  ctx.fillRect(frameX + 12, frameY + 12, frameW - 24, frameH - 24);
  const picGrad = ctx.createLinearGradient(frameX + 18, frameY + 18, frameX + 18, frameY + frameH - 18);
  picGrad.addColorStop(0, '#f59e0b');
  picGrad.addColorStop(0.55, '#b45309');
  picGrad.addColorStop(1, '#291509');
  ctx.fillStyle = picGrad;
  ctx.fillRect(frameX + 18, frameY + 18, frameW - 36, frameH - 36);

  // Minimalist mountain ridge & sun print inside foyer wall frame
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.arc(frameX + frameW * 0.65, frameY + frameH * 0.36, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c120c';
  ctx.beginPath();
  ctx.moveTo(frameX + 18, frameY + frameH - 18);
  ctx.lineTo(frameX + frameW * 0.42, frameY + frameH * 0.52);
  ctx.lineTo(frameX + frameW * 0.66, frameY + frameH * 0.68);
  ctx.lineTo(frameX + frameW - 18, frameY + frameH * 0.48);
  ctx.lineTo(frameX + frameW - 18, frameY + frameH - 18);
  ctx.closePath();
  ctx.fill();

  // Oak entryway console table + ceramic key bowl + potted indoor olive plant on far left
  const tableX = w * 0.04;
  const tableW = w * 0.2;
  const tableTopY = h * 0.55;
  ctx.fillStyle = '#3b2415';
  roundRectPath(ctx, tableX, tableTopY, tableW, 16, 4);
  ctx.fill();
  ctx.fillStyle = '#27170d';
  ctx.fillRect(tableX + 18, tableTopY + 16, 10, floorY - tableTopY - 16);
  ctx.fillRect(tableX + tableW - 28, tableTopY + 16, 10, floorY - tableTopY - 16);

  // Ceramic key tray & terracotta pot with sunlit olive foliage
  ctx.fillStyle = '#d6d3d1';
  roundRectPath(ctx, tableX + 24, tableTopY - 9, 50, 9, 4);
  ctx.fill();
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.moveTo(tableX + tableW - 64, tableTopY - 46);
  ctx.lineTo(tableX + tableW - 22, tableTopY - 46);
  ctx.lineTo(tableX + tableW - 28, tableTopY);
  ctx.lineTo(tableX + tableW - 58, tableTopY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#3f4f34';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(tableX + tableW - 43, tableTopY - 46);
  ctx.quadraticCurveTo(tableX + tableW - 53, tableTopY - 88, tableX + tableW - 30, tableTopY - 118);
  ctx.stroke();
  for (const [lx, ly, rot] of [
    [-54, -74, -0.5],
    [-32, -84, 0.45],
    [-47, -102, -0.35],
    [-26, -112, 0.35],
  ]) {
    ctx.save();
    ctx.translate(tableX + tableW + lx, tableTopY + ly);
    ctx.rotate(rot);
    ctx.fillStyle = '#4d613c';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Tall Unobstructed Open Front Doorway (`0.64w .. 0.92w`) revealing radiant golden morning outside!
  const doorLeft = w * 0.64;
  const doorRight = w * 0.92;
  const doorTop = h * 0.07;

  ctx.save();
  ctx.beginPath();
  ctx.rect(doorLeft, doorTop, doorRight - doorLeft, floorY - doorTop);
  ctx.clip();

  const dw = doorRight - doorLeft;
  const outSky = ctx.createLinearGradient(doorLeft, doorTop, doorLeft, floorY);
  outSky.addColorStop(0, '#bae6fd');
  outSky.addColorStop(0.28, '#fef3c7');
  outSky.addColorStop(0.68, '#fde68a');
  outSky.addColorStop(1, '#f59e0b');
  ctx.fillStyle = outSky;
  ctx.fillRect(doorLeft, doorTop, dw, floorY - doorTop);

  // Morning sun halo shining in from upper-right outside doorway
  const mSun = ctx.createRadialGradient(doorRight - 40, doorTop + 90, 12, doorRight - 40, doorTop + 90, dw * 0.85);
  mSun.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
  mSun.addColorStop(0.35, 'rgba(254, 249, 195, 0.55)');
  mSun.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = mSun;
  ctx.fillRect(doorLeft, doorTop, dw, floorY - doorTop);

  // Soft atmospheric distant apartment eaves & sunlit avenue trees
  ctx.fillStyle = 'rgba(180, 114, 58, 0.34)';
  ctx.fillRect(doorLeft + 18, floorY - 290, dw * 0.44, 190);
  ctx.fillStyle = 'rgba(146, 86, 42, 0.28)';
  ctx.fillRect(doorLeft + dw * 0.52, floorY - 245, dw * 0.46, 150);

  // Sunlit leafy tree boughs extending organically from courtyard
  ctx.strokeStyle = 'rgba(92, 61, 36, 0.45)';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(doorRight + 10, doorTop + 140);
  ctx.quadraticCurveTo(doorLeft + dw * 0.68, doorTop + 115, doorLeft + dw * 0.42, doorTop + 88);
  ctx.moveTo(doorLeft + dw * 0.72, doorTop + 122);
  ctx.quadraticCurveTo(doorLeft + dw * 0.56, doorTop + 152, doorLeft + dw * 0.36, doorTop + 146);
  ctx.stroke();

  ctx.fillStyle = 'rgba(96, 136, 52, 0.38)';
  for (const [cxOff, cyOff, rx, ry, rot] of [
    [0.44, 0.18, 46, 22, -0.22],
    [0.64, 0.15, 54, 24, 0.15],
    [0.82, 0.21, 52, 25, -0.1],
    [0.52, 0.25, 42, 19, 0.24],
  ]) {
    ctx.save();
    ctx.translate(doorLeft + dw * cxOff, doorTop + (floorY - doorTop) * cyOff);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Exterior sunlit sandstone landing & wrought-iron apartment terrace railing
  const railTop = floorY - 126;
  ctx.fillStyle = '#e7cf9e';
  ctx.fillRect(doorLeft, floorY - 42, dw, 42);
  ctx.strokeStyle = 'rgba(68, 44, 24, 0.62)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(doorLeft, railTop);
  ctx.lineTo(doorRight, railTop);
  ctx.moveTo(doorLeft, floorY - 42);
  ctx.lineTo(doorRight, floorY - 42);
  ctx.stroke();

  ctx.lineWidth = 2;
  for (let rx = doorLeft + 18; rx < doorRight; rx += 26) {
    ctx.beginPath();
    ctx.moveTo(rx, railTop);
    ctx.lineTo(rx, floorY - 42);
    ctx.stroke();
  }
  ctx.restore();

  // Solid walnut outer doorframe casing
  ctx.strokeStyle = '#29170d';
  ctx.lineWidth = 14;
  ctx.strokeRect(doorLeft, doorTop, doorRight - doorLeft, floorY - doorTop);

  // Heavy walnut front door swung wide open on the RIGHT jamb (`doorRight - 68 .. doorRight`), leaving threshold clear!
  const leafGrad = ctx.createLinearGradient(doorRight - 70, 0, doorRight, 0);
  leafGrad.addColorStop(0, '#5c361e');
  leafGrad.addColorStop(0.55, '#3f2414');
  leafGrad.addColorStop(1, '#24140b');
  ctx.fillStyle = leafGrad;
  ctx.beginPath();
  ctx.moveTo(doorRight, doorTop);
  ctx.lineTo(doorRight - 68, doorTop + 22);
  ctx.lineTo(doorRight - 68, floorY - 12);
  ctx.lineTo(doorRight, floorY);
  ctx.closePath();
  ctx.fill();

  // Warm brass lever handle catching morning sun on open right-hand door leaf
  ctx.fillStyle = '#fbbf24';
  roundRectPath(ctx, doorRight - 60, h * 0.46, 24, 6, 3);
  ctx.fill();

  // 3. Honey-oak parquet floor + woven sisal welcome mat + brass threshold strip
  const oak = ctx.createLinearGradient(0, floorY, 0, h);
  oak.addColorStop(0, '#59371e');
  oak.addColorStop(0.52, '#362010');
  oak.addColorStop(1, '#170d06');
  ctx.fillStyle = oak;
  ctx.fillRect(0, floorY, w, h - floorY);

  // Subtle horizontal oak board course lines + receding plank seams (clear visual reference for zero-slip steps!)
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.12)';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 11; i++) {
    const px = (i / 10) * w;
    ctx.beginPath();
    ctx.moveTo(px, floorY);
    ctx.lineTo(w * 0.5 + (px - w * 0.5) * 1.42, h);
    ctx.stroke();
  }

  // Soft golden sunlight spill cast across the oak floor from the open doorway
  const floorSun = ctx.createLinearGradient(doorLeft + 80, floorY, w * 0.22, h);
  floorSun.addColorStop(0, 'rgba(254, 243, 199, 0.38)');
  floorSun.addColorStop(0.55, 'rgba(251, 191, 36, 0.16)');
  floorSun.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = floorSun;
  ctx.beginPath();
  ctx.moveTo(doorLeft, floorY);
  ctx.lineTo(doorRight, floorY);
  ctx.lineTo(w * 0.78, h);
  ctx.lineTo(w * 0.18, h);
  ctx.closePath();
  ctx.fill();

  // Woven sisal doormat & gleaming brass doorway threshold bar
  ctx.fillStyle = '#6b4c2a';
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.26)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(doorLeft - 24, floorY + 8);
  ctx.lineTo(doorRight - 14, floorY + 8);
  ctx.lineTo(doorRight + 8, floorY + 34);
  ctx.lineTo(doorLeft - 48, floorY + 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(doorLeft, floorY - 2, doorRight - doorLeft, 4);

  // 4. Soft morning sunbeams & floating golden dust motes behind Traveler
  drawTyndallGodRays(
    ctx,
    (doorLeft + doorRight) * 0.54,
    doorTop + 30,
    5,
    2.38,
    0.42,
    h * 0.95,
    '254, 243, 199',
    0.13 + lineProgress * 0.04
  );

  // 5. Biomechanically Floor-Locked Living Morning Traveler & 20" Xiaohei
  drawS03MorningTravelerAndXiaohei(sc, floorY);

  // Subtle foreground golden dust motes drifting in the sunbeam
  for (let m = 0; m < 14; m++) {
    const mx = w * (0.36 + hash01(m * 5.1) * 0.52);
    const my = h * (0.16 + ((hash01(m * 9.7) - timeSec * 0.022 + 1) % 0.6));
    ctx.fillStyle = 'rgba(254, 249, 195, 0.44)';
    ctx.beginPath();
    ctx.arc(mx, my, 1.1 + (m % 3) * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ============================================================================
// 02. VERSE 1 (S04 – S11)
// ============================================================================

function renderS04ViaductSunsetWide(sc: ShotContext): void {
  const { ctx, w, h, timeSec, scrollDist } = sc;
  const horizonY = h * 0.62;
  const deckY = h * 0.8;

  // Golden-hour crimson-amber sunset gradient
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#140c1c');
  sky.addColorStop(0.42, '#4c1d24');
  sky.addColorStop(0.78, '#c2410c');
  sky.addColorStop(1, '#fbbf24');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Low golden sun disc above bay
  const sunX = w * 0.74;
  const sunY = horizonY - h * 0.14;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, h * 0.34);
  sunGlow.addColorStop(0, '#fffbeb');
  sunGlow.addColorStop(0.22, 'rgba(253, 224, 71, 0.72)');
  sunGlow.addColorStop(1, 'rgba(251, 146, 60, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, h * 0.34, 0, Math.PI * 2);
  ctx.fill();

  drawDistantCitySkyline(sc, horizonY, {
    parallaxPx: scrollDist * 0.08,
    maxTowerHeight: h * 0.18,
    silhouetteHex: '#1c1219',
    secondarySilhouetteHex: '#2b1922',
    windowPrimaryHex: '#fde68a',
    windowSecondaryHex: '#fb923c',
    waterReflectionHeight: deckY - horizonY - 6,
  });

  // Shimmering sunset bay water
  const bay = ctx.createLinearGradient(0, horizonY, 0, deckY);
  bay.addColorStop(0, '#7c2d12');
  bay.addColorStop(0.5, '#3b1518');
  bay.addColorStop(1, '#120b12');
  ctx.fillStyle = bay;
  ctx.fillRect(0, horizonY, w, deckY - horizonY);

  // Flock of 7 migratory birds gliding across golden sky
  ctx.strokeStyle = 'rgba(24, 13, 16, 0.72)';
  ctx.lineWidth = 1.6;
  for (let b = 0; b < 7; b++) {
    const bx = w * 0.28 + b * 26 + timeSec * 18;
    const by = h * 0.22 + Math.sin(b * 1.4) * 18;
    const wing = Math.sin(timeSec * 6.5 + b) * 4.5;
    ctx.beginPath();
    ctx.moveTo(bx - 7, by + wing);
    ctx.quadraticCurveTo(bx - 3, by - 4, bx, by);
    ctx.quadraticCurveTo(bx + 3, by - 4, bx + 7, by + wing);
    ctx.stroke();
  }

  // Midground diegetic layer (cleanly occluded by suspension bridge cables)
  renderMidgroundDiegeticLyrics(sc, 's04_viaduct_sunset_wide');

  // Monumental architectural H-pylon suspension bridge tower extending cleanly above top of frame
  const towerX = w * 0.22 - ((scrollDist * 0.06) % (w * 0.16));
  const legSpread = 28;
  ctx.fillStyle = '#150e15';
  // Left & right tapered pylon legs + concrete bay caisson pier
  ctx.fillRect(towerX - legSpread - 8, -20, 14, deckY + 20);
  ctx.fillRect(towerX + legSpread - 6, -20, 14, deckY + 20);
  // Horizontal portal cross-beams & X-bracing
  ctx.fillRect(towerX - legSpread - 8, h * 0.18, legSpread * 2 + 14, 11);
  ctx.fillRect(towerX - legSpread - 8, h * 0.42, legSpread * 2 + 14, 10);
  ctx.strokeStyle = '#150e15';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(towerX - legSpread, h * 0.19);
  ctx.lineTo(towerX + legSpread, h * 0.42);
  ctx.moveTo(towerX + legSpread, h * 0.19);
  ctx.lineTo(towerX - legSpread, h * 0.42);
  ctx.stroke();

  // Main catenary suspension cable & vertical suspender ropes
  ctx.strokeStyle = '#140e14';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.22);
  ctx.quadraticCurveTo(towerX, h * 0.02, towerX, h * 0.02);
  ctx.quadraticCurveTo(w * 0.62, deckY - 34, w, h * 0.16);
  ctx.stroke();

  ctx.lineWidth = 1.1;
  ctx.strokeStyle = 'rgba(24, 16, 20, 0.62)';
  for (let x = towerX + 44; x < w; x += 58) {
    const uSpan = (x - towerX) / Math.max(1, w - towerX);
    const cy =
      (1 - uSpan) * (1 - uSpan) * (h * 0.02) +
      2 * (1 - uSpan) * uSpan * (deckY - 34) +
      uSpan * uSpan * (h * 0.16);
    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.lineTo(x, deckY);
    ctx.stroke();
  }

  // Bridge walkway deck & balustrade
  ctx.fillStyle = '#0c0a0f';
  ctx.fillRect(0, deckY, w, h - deckY);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.34)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, deckY - 38);
  ctx.lineTo(w, deckY - 38);
  ctx.stroke();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.56,
    groundY: deckY + 14,
    travelerHeightPx: h * 0.44,
    walkPhase: timeSec * 5.0,
    pose: 'tow_stride',
    rimColor: '#fde047',
    warmHandleGlow: true,
  });
}

function renderS05BoulevardOdometerLow(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, wheelAngle, beat } = sc;
  const roadY = h * 0.74;

  // 1. Deep twilight urban boulevard out-of-focus background with warm motion-streaked streetlamp bokeh
  const sky = ctx.createLinearGradient(0, 0, w, roadY);
  sky.addColorStop(0, '#070910');
  sky.addColorStop(0.55, '#171522');
  sky.addColorStop(1, '#3b2416');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, roadY);

  // Horizontal motion-streaked city headlight ribbons on the right half
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let s = 0; s < 9; s++) {
    const sy = roadY - 26 - s * 28;
    const sw = 180 + (s % 3) * 110;
    const sx = w * 0.95 - ((scrollDist * (0.45 + (s % 3) * 0.18) + s * 170) % (w * 0.78));
    const ribbon = ctx.createLinearGradient(sx - sw, sy, sx + sw, sy);
    const col = s % 3 === 0 ? '56, 189, 248' : '251, 191, 36';
    ribbon.addColorStop(0, `rgba(${col}, 0)`);
    ribbon.addColorStop(0.5, `rgba(${col}, 0.22)`);
    ribbon.addColorStop(1, `rgba(${col}, 0)`);
    ctx.fillStyle = ribbon;
    ctx.fillRect(sx - sw, sy - 6, sw * 2, 12);
  }
  ctx.restore();

  drawCinemaBokeh(sc, 14, '#f59e0b', '#38bdf8', 1.15);

  // 2. Coarse textured twilight asphalt boulevard plane
  const road = ctx.createLinearGradient(0, roadY, 0, h);
  road.addColorStop(0, '#191922');
  road.addColorStop(0.45, '#101016');
  road.addColorStop(1, '#060609');
  ctx.fillStyle = road;
  ctx.fillRect(0, roadY, w, h - roadY);

  // Precision Glowing Golden Surveyor Mileage Ruler etched along the boulevard ("小小的滚轮 丈量从前")
  const rulerY = roadY + 46;
  ctx.save();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, rulerY);
  ctx.lineTo(w, rulerY);
  ctx.stroke();

  const majorStep = 180;
  const minorStep = 18;
  const pxShift = (scrollDist * 1.35) % majorStep;
  const baseKm = 12838 + Math.floor((scrollDist * 1.35) / majorStep);

  for (let x = -majorStep; x < w + majorStep; x += minorStep) {
    const rx = x - pxShift;
    const isMajor = Math.abs(((x % majorStep) + majorStep) % majorStep) < 1;
    const isHalf = Math.abs((((x - majorStep * 0.5) % majorStep) + majorStep) % majorStep) < 1;
    const tickH = isMajor ? 22 : isHalf ? 14 : 7;
    ctx.strokeStyle = isMajor ? 'rgba(253, 224, 71, 0.85)' : 'rgba(250, 204, 21, 0.34)';
    ctx.lineWidth = isMajor ? 2.2 : 1.1;
    ctx.beginPath();
    ctx.moveTo(rx, rulerY);
    ctx.lineTo(rx, rulerY + tickH);
    ctx.stroke();

    if (isMajor) {
      const idx = Math.round(x / majorStep);
      const kmVal = (baseKm + idx).toLocaleString('en-US');
      ctx.fillStyle = 'rgba(254, 240, 138, 0.82)';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${kmVal} KM`, rx, rulerY + 38);
    }
  }

  const liveKm = (12840.2 + scrollDist * 0.015).toFixed(1);
  ctx.fillStyle = 'rgba(253, 224, 71, 0.9)';
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${liveKm} KM`, w * 0.94, roadY - 18);
  ctx.restore();

  // 3. True 100mm Extreme Macro of Xiaohei's Lower Sculpted Corner (bleeding off top-left viewport — NEVER a floating box!)
  const wheelR = Math.min(108, h * 0.125);
  const wheelCx = w * 0.33;
  const wheelCy = roadY - wheelR + 4 - beat.kickPulse * 1.8;
  const shellBottomY = wheelCy - wheelR * 1.05;
  const shellRightX = wheelCx + wheelR * 1.65;

  // Ground contact shadow & warm amber rim reflection on asphalt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  ctx.beginPath();
  ctx.ellipse(wheelCx + 12, roadY + 5, wheelR * 1.55, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  // Full-bleed lower anodized shell extending off `x = -80, y = -80`
  const shellGrad = ctx.createLinearGradient(-40, 0, shellRightX, shellBottomY);
  shellGrad.addColorStop(0, '#0d0d13');
  shellGrad.addColorStop(0.55, '#1c1c26');
  shellGrad.addColorStop(1, '#2f2f3d');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = 'rgba(228, 228, 231, 0.42)';
  ctx.lineWidth = 2.2;
  roundRectPath(ctx, -120, -120, shellRightX + 120, shellBottomY + 120, 38);
  ctx.fill();
  ctx.stroke();

  // Deep vertical RIMOWA aluminum ribs running continuously from top of frame
  for (let g = 0; g < 6; g++) {
    const gx = shellRightX - 78 - g * 82;
    if (gx < -20) continue;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(gx - 7, -40, 7, shellBottomY + 22);
    ctx.fillStyle = 'rgba(253, 224, 71, 0.14)';
    ctx.fillRect(gx, -40, 2.5, shellBottomY + 22);
  }

  // Partial weathered `SHA · 01` travel sticker peeking on upper macro shell
  ctx.save();
  ctx.translate(shellRightX - 210, shellBottomY - 195);
  ctx.rotate(-0.07);
  ctx.fillStyle = '#facc15';
  roundRectPath(ctx, -78, -28, 156, 56, 6);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.font = '900 18px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHA · 01', 0, 6);
  ctx.restore();

  // Forged brushed-aluminum bottom-right corner bumper cap with 5 recessed aviation rivets
  const capW = 132;
  const capH = 114;
  const capX = shellRightX - capW;
  const capY = shellBottomY - capH;
  const capGrad = ctx.createLinearGradient(capX, capY, shellRightX, shellBottomY);
  capGrad.addColorStop(0, '#52525b');
  capGrad.addColorStop(0.5, '#3f3f46');
  capGrad.addColorStop(1, '#18181b');
  ctx.fillStyle = capGrad;
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, capX, capY, capW, capH, 34);
  ctx.fill();
  ctx.stroke();

  for (const [rx, ry] of [
    [28, 28],
    [76, 26],
    [104, 52],
    [28, 82],
    [82, 86],
  ]) {
    ctx.fillStyle = '#e4e4e7';
    ctx.beginPath();
    ctx.arc(capX + rx, capY + ry, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(capX + rx, capY + ry, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Hero Giant 100mm Dual-Spoke Precision RIMOWA Multiwheel (ZERO severed leg!)
  drawPrecisionRimowaWheel(ctx, {
    cx: wheelCx,
    cy: wheelCy,
    radius: wheelR,
    angleRad: wheelAngle,
    accentHex: '#f59e0b',
  });
}

function renderS06AnodizedShellGrazing(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;

  // Full-frame 100mm macro across Xiaohei's matte-black anodized grooved shell
  // with grazing warm sunset raking light revealing raw silver aluminum scratches ("告别 褪去的颜")!
  const shellGrad = ctx.createLinearGradient(0, 0, w, h);
  shellGrad.addColorStop(0, '#2a2833');
  shellGrad.addColorStop(0.45, '#15151c');
  shellGrad.addColorStop(1, '#09090d');
  ctx.fillStyle = shellGrad;
  ctx.fillRect(0, 0, w, h);

  // Top recessed brushed-titanium frame rail + `0 · 9 · 6` TSA combination lock
  const railH = h * 0.18;
  const railGrad = ctx.createLinearGradient(0, 0, 0, railH);
  railGrad.addColorStop(0, '#3f3f48');
  railGrad.addColorStop(1, '#1e1e26');
  ctx.fillStyle = railGrad;
  ctx.fillRect(0, 0, w, railH);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
  ctx.fillRect(0, railH, w, 2);

  // TSA 0·9·6 lock housing
  const lockW = 230;
  const lockH = 58;
  const lx = w * 0.5 - lockW * 0.5;
  const ly = railH * 0.5 - lockH * 0.5;
  ctx.fillStyle = '#111116';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 1.8;
  roundRectPath(ctx, lx, ly, lockW, lockH, 8);
  ctx.fill();
  ctx.stroke();

  const digits = ['0', '9', '6'];
  for (let d = 0; d < 3; d++) {
    const dx = lx + 48 + d * 48;
    ctx.fillStyle = '#27272a';
    roundRectPath(ctx, dx - 14, ly + 11, 28, 36, 4);
    ctx.fill();
    ctx.fillStyle = '#fde68a';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(digits[d], dx, ly + 29);
  }
  // Red TSA diamond badge
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(lx + lockW - 34, ly + 19);
  ctx.lineTo(lx + lockW - 22, ly + 29);
  ctx.lineTo(lx + lockW - 34, ly + 39);
  ctx.lineTo(lx + lockW - 46, ly + 29);
  ctx.closePath();
  ctx.fill();

  // Deep parallel RIMOWA vertical grooves across full macro frame
  const grooveCount = 9;
  for (let g = 0; g < grooveCount; g++) {
    const gx = (w * (g + 0.8)) / (grooveCount + 0.6);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.fillRect(gx - 12, railH + 2, 12, h - railH);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
    ctx.fillRect(gx, railH + 2, 4, h - railH);
  }

  // Sweeping sunset grazing light beam revealing raw silver-aluminum patina scratches!
  const sweepX = w * (0.18 + lineProgress * 0.64);
  const raking = ctx.createRadialGradient(sweepX, h * 0.56, 20, sweepX, h * 0.56, w * 0.45);
  raking.addColorStop(0, 'rgba(251, 191, 36, 0.24)');
  raking.addColorStop(0.55, 'rgba(234, 88, 12, 0.08)');
  raking.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = raking;
  ctx.fillRect(0, railH, w, h - railH);

  // Authentic silver aluminum hairline scuffs where black anodizing wore away over years
  ctx.save();
  ctx.lineCap = 'round';
  const scuffs = [
    [0.22, 0.36, 0.39, 0.43, 2.2],
    [0.26, 0.41, 0.35, 0.45, 1.1],
    [0.46, 0.58, 0.68, 0.51, 2.6],
    [0.51, 0.63, 0.64, 0.59, 1.3],
    [0.31, 0.74, 0.53, 0.79, 1.9],
    [0.64, 0.33, 0.79, 0.39, 2.0],
  ];
  for (const [x1, y1, x2, y2, lw] of scuffs) {
    const sGrad = ctx.createLinearGradient(w * x1, h * y1, w * x2, h * y2);
    sGrad.addColorStop(0, 'rgba(228, 228, 231, 0.15)');
    sGrad.addColorStop(0.5, 'rgba(254, 249, 195, 0.82)');
    sGrad.addColorStop(1, 'rgba(212, 212, 216, 0.12)');
    ctx.strokeStyle = sGrad;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(w * x1, h * y1);
    ctx.lineTo(w * x2, h * y2);
    ctx.stroke();
  }
  ctx.restore();
}

function renderS07SunsetPalmGrip(sc: ShotContext): void {
  const { ctx, w, h, timeSec, scrollDist, beat } = sc;
  const platformY = h * 0.81;

  // Golden-Hour Twilight Commuter Station Platform Rest ("却更懂我 妥协 疲倦 那几年")
  // Distinct from S27's rainy midnight T-bar macro: Traveler sits tiredly on a dusk platform bench,
  // resting a weary hand atop upright Xiaohei while blurred golden commuter train windows streak past!
  const sky = ctx.createLinearGradient(0, 0, 0, platformY);
  sky.addColorStop(0, '#160d18');
  sky.addColorStop(0.45, '#4c1d24');
  sky.addColorStop(0.82, '#9a3412');
  sky.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, platformY);

  // Motion-blurred golden commuter express train gliding behind the station platform
  const trainTop = h * 0.32;
  const trainBot = h * 0.68;
  const trainGrad = ctx.createLinearGradient(0, trainTop, 0, trainBot);
  trainGrad.addColorStop(0, '#1e1b28');
  trainGrad.addColorStop(0.5, '#272333');
  trainGrad.addColorStop(1, '#14121b');
  ctx.fillStyle = trainGrad;
  ctx.fillRect(0, trainTop, w, trainBot - trainTop);

  // Warm illuminated train carriage window ribbons streaking horizontally
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const winSpan = 210;
  const winShift = (scrollDist * 2.4) % winSpan;
  for (let x = -winSpan; x < w + winSpan; x += winSpan) {
    const wx = x - winShift;
    const wGrad = ctx.createLinearGradient(wx, 0, wx + 155, 0);
    wGrad.addColorStop(0, 'rgba(253, 224, 71, 0.08)');
    wGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.52)');
    wGrad.addColorStop(1, 'rgba(251, 146, 60, 0.08)');
    ctx.fillStyle = wGrad;
    roundRectPath(ctx, wx, trainTop + 34, 155, 96, 8);
    ctx.fill();
  }
  ctx.restore();

  // Steel station platform canopy overhang & structural I-beam columns
  ctx.fillStyle = '#0d0c12';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h * 0.14);
  ctx.lineTo(0, h * 0.21);
  ctx.closePath();
  ctx.fill();

  for (const colFrac of [0.14, 0.84]) {
    ctx.fillStyle = '#121118';
    ctx.fillRect(w * colFrac - 12, h * 0.12, 24, platformY - h * 0.12);
  }

  // Tactile yellow safety line & dark granite station platform
  ctx.fillStyle = '#0c0b10';
  ctx.fillRect(0, platformY, w, h - platformY);
  ctx.fillStyle = 'rgba(250, 204, 21, 0.48)';
  ctx.fillRect(0, platformY + 6, w, 3);

  drawCinemaBokeh(sc, 10, '#fbbf24', '#fb923c', 0.9);

  // Slatted warm teak-and-iron platform bench (`0.22w .. 0.51w`)
  const benchX = w * 0.22;
  const benchW = w * 0.29;
  const seatY = platformY - 104;
  ctx.fillStyle = '#18181f';
  ctx.fillRect(benchX + 26, seatY + 12, 10, platformY - seatY - 12);
  ctx.fillRect(benchX + benchW - 36, seatY + 12, 10, platformY - seatY - 12);
  ctx.fillRect(benchX + 22, seatY - 88, 8, 100);
  ctx.fillRect(benchX + benchW - 30, seatY - 88, 8, 100);

  ctx.fillStyle = '#5c3419';
  roundRectPath(ctx, benchX + 8, seatY - 80, benchW - 16, 20, 4);
  ctx.fill();
  roundRectPath(ctx, benchX + 8, seatY - 50, benchW - 16, 20, 4);
  ctx.fill();
  roundRectPath(ctx, benchX, seatY, benchW, 15, 5);
  ctx.fill();

  // Upright 20" Cabin RIMOWA Xiaohei at true 55cm human-relative scale right beside the Traveler's knee (`0.555w`)!
  const anchors = drawRimowaCabin(sc, {
    cx: w * 0.555,
    bottomY: platformY + 6,
    scale: 0.78,
    tilt: 0,
    handleRatio: 0.0,
    warmHandleGlow: false,
    showScuffs: true,
    wheelAngleOverride: 0,
  });

  // Anatomically Proportional Seated Traveler (1:7.5 adult scale) leaning slightly forward in quiet fatigue,
  // resting forearm & palm naturally DOWNWARD onto 20" Xiaohei's top shell!
  const breathe = Math.sin(timeSec * 1.8) * 1.6;
  const hipX = benchX + benchW * 0.66;
  const hipY = seatY - 4;
  const shoulderX = hipX + 24;
  const shoulderY = hipY - 146 + breathe;
  const neckTopX = shoulderX + 10;
  const neckTopY = shoulderY - 16 + breathe * 0.6;
  const headX = neckTopX + 6;
  const headY = neckTopY - 22;

  // Ground shadow under bench & traveler boots
  ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
  ctx.beginPath();
  ctx.ellipse(hipX + 46, platformY + 7, 98, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Far & near seated legs + grounded Chelsea boots on platform
  for (const [dx, legCol, bootCol] of [
    [20, '#0b0d15', '#0b090c'],
    [0, '#141724', '#161216'],
  ] as const) {
    const kneeX = hipX + 76 + dx;
    const kneeY = seatY + 4;
    const ankleX = kneeX + 8;
    const ankleY = platformY - 14;

    ctx.strokeStyle = legCol;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 27;
    ctx.beginPath();
    ctx.moveTo(hipX + dx * 0.4, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(ankleX, ankleY);
    ctx.stroke();

    ctx.fillStyle = bootCol;
    ctx.beginPath();
    ctx.moveTo(ankleX - 13, ankleY - 6);
    ctx.lineTo(ankleX + 14, ankleY - 6);
    ctx.quadraticCurveTo(ankleX + 30, ankleY + 6, ankleX + 44, ankleY + 14);
    ctx.lineTo(ankleX + 44, platformY + 6);
    ctx.lineTo(ankleX - 16, platformY + 6);
    ctx.closePath();
    ctx.fill();
  }

  // Warm neck cylinder connecting collar to head (eliminates floating circle gap!)
  ctx.strokeStyle = '#6b4232';
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(shoulderX + 2, shoulderY + 2);
  ctx.lineTo(neckTopX, neckTopY);
  ctx.stroke();

  // Tailored wool overcoat torso leaning slightly forward
  const coatGrad = ctx.createLinearGradient(hipX - 34, shoulderY, shoulderX + 42, hipY + 22);
  coatGrad.addColorStop(0, '#0d0f18');
  coatGrad.addColorStop(0.68, '#1b1f2e');
  coatGrad.addColorStop(1, '#2d3247');
  ctx.fillStyle = coatGrad;
  ctx.beginPath();
  ctx.moveTo(shoulderX - 28, shoulderY + 4);
  ctx.quadraticCurveTo(hipX - 38, (shoulderY + hipY) * 0.5, hipX - 26, hipY + 22);
  ctx.lineTo(hipX + 38, hipY + 22);
  ctx.quadraticCurveTo(shoulderX + 32, (shoulderY + hipY) * 0.52, shoulderX + 24, shoulderY + 6);
  ctx.closePath();
  ctx.fill();

  // Warm amber cashmere scarf draped at collar
  ctx.fillStyle = '#9a5226';
  roundRectPath(ctx, shoulderX - 18, shoulderY - 9, 44, 18, 9);
  ctx.fill();

  // Sculpted contemplative profile head with layered dark hair & golden rim catchlight
  ctx.fillStyle = '#4a2e24';
  ctx.beginPath();
  ctx.arc(headX, headY, 24, 0, Math.PI * 2);
  ctx.fill();
  // Subtle nose & chin profile facing Xiaohei
  ctx.beginPath();
  ctx.moveTo(headX + 21, headY - 4);
  ctx.lineTo(headX + 27, headY + 3);
  ctx.lineTo(headX + 21, headY + 7);
  ctx.closePath();
  ctx.fill();
  // Hair cap
  ctx.fillStyle = '#110e15';
  ctx.beginPath();
  ctx.arc(headX - 3, headY - 3, 25, Math.PI * 0.62, Math.PI * 2.02);
  ctx.fill();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.52)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(headX, headY, 24, -0.35, 0.45);
  ctx.stroke();

  // Warm amber breathing halo where Traveler's palm rests gently on 20" Xiaohei's top shell!
  const handTargetX = anchors.topCenterX - 10;
  const handTargetY = anchors.topCenterY - 2;
  const palmGlow = ctx.createRadialGradient(
    handTargetX,
    handTargetY,
    4,
    handTargetX,
    handTargetY,
    62 + beat.kickPulse * 10
  );
  palmGlow.addColorStop(0, 'rgba(253, 224, 71, 0.42)');
  palmGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.14)');
  palmGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = palmGlow;
  ctx.beginPath();
  ctx.arc(handTargetX, handTargetY, 72, 0, Math.PI * 2);
  ctx.fill();

  // Natural downward-hanging upper arm & bent elbow resting forearm onto Xiaohei's top shell
  const elbowX = shoulderX + 22;
  const elbowY = shoulderY + 68;
  ctx.strokeStyle = '#1d2132';
  ctx.lineWidth = 21;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(shoulderX + 6, shoulderY + 14);
  ctx.lineTo(elbowX, elbowY);
  ctx.lineTo(handTargetX - 14, handTargetY - 4);
  ctx.stroke();

  ctx.fillStyle = '#dcd5c7';
  roundRectPath(ctx, handTargetX - 19, handTargetY - 9, 10, 10, 3);
  ctx.fill();

  ctx.fillStyle = '#c88d6c';
  ctx.beginPath();
  ctx.moveTo(handTargetX - 10, handTargetY - 7);
  ctx.quadraticCurveTo(handTargetX + 9, handTargetY - 9, handTargetX + 22, handTargetY - 1);
  ctx.quadraticCurveTo(handTargetX + 14, handTargetY + 4, handTargetX - 10, handTargetY + 2);
  ctx.closePath();
  ctx.fill();
}

function renderS08FannedPriorityTags(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  // Close-up of Xiaohei's top-right handle lug with asymmetrically fanned airline PRIORITY cards
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#12131c');
  bg.addColorStop(1, '#09090d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Grooved RIMOWA upper shell corner in right-lower frame
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.35)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, w * 0.18, h * 0.32, w * 0.74, h * 0.66, 28);
  ctx.fill();
  ctx.stroke();

  // Chrome handle lug anchor at `(w * 0.34, h * 0.32)`
  const lugX = w * 0.34;
  const lugY = h * 0.32;
  ctx.fillStyle = '#52525b';
  roundRectPath(ctx, lugX - 36, lugY - 18, 72, 32, 10);
  ctx.fill();

  const fanSpecs = [
    { idx: 4, dx: 210, dy: 230, rot: 0.42 },
    { idx: 2, dx: 155, dy: 165, rot: 0.21 },
    { idx: 1, dx: 195, dy: 95, rot: 0.04 },
    { idx: 0, dx: 235, dy: 28, rot: -0.14 },
  ];

  for (const item of fanSpecs) {
    const spec = TRAVEL_STICKERS[item.idx];
    const flutter = Math.sin(timeSec * 4.2 + item.idx * 1.3) * 0.035;
    const tx = lugX + item.dx;
    const ty = lugY + item.dy;

    // Braided cord linking lug to card grommet
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(lugX + 12, lugY);
    ctx.quadraticCurveTo(lugX + item.dx * 0.3, lugY + item.dy * 0.5, tx - 135, ty);
    ctx.stroke();

    drawPriorityCard(
      ctx,
      tx,
      ty,
      310 * (1 + beat.kickPulse * 0.025),
      108,
      item.rot + flutter,
      spec.code,
      spec.label,
      spec.year,
      spec.bg,
      spec.fg
    );
  }
}

function renderS09CustomsMedalPostmark(sc: ShotContext): void {
  const { ctx, w, h, lineProgress, beat } = sc;

  // 105mm Extreme Macro of Circular Gold Customs & Departure Postmark Medals stamped onto anodized shell
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.65);
  bg.addColorStop(0, '#23232d');
  bg.addColorStop(1, '#09090e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Horizontal brushed aluminum grain + vertical RIMOWA ribs
  for (let g = 1; g <= 7; g++) {
    const gx = (w * g) / 8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(gx - 8, 0, 8, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(gx, 0, 3, h);
  }

  const medals = [
    { x: w * 0.27, y: h * 0.52, r: 108, city: 'SHANGHAI · SHA', date: '18 · OCT · 2019', color: '#f59e0b', rot: -0.18, threshold: 0.0 },
    { x: w * 0.73, y: h * 0.44, r: 104, city: 'PARIS · CDG 2E', date: '04 · NOV · 2022', color: '#fb7185', rot: 0.16, threshold: 0.25 },
    { x: w * 0.5, y: h * 0.49, r: 138, city: 'HONGQIAO · MEDAL', date: '20" COMPANION', color: '#fde047', rot: -0.06, threshold: 0.48 },
  ];

  for (const m of medals) {
    const appear = Math.min(1, Math.max(0, (lineProgress - m.threshold) * 4.5));
    if (appear <= 0.01) continue;
    const slamScale = 1 + (1 - appear) * 0.35 + (m.threshold > 0.4 ? beat.kickPulse * 0.04 : 0);

    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.rot);
    ctx.scale(slamScale, slamScale);
    ctx.globalAlpha = appear * 0.92;

    ctx.fillStyle = 'rgba(12, 12, 18, 0.76)';
    ctx.beginPath();
    ctx.arc(0, 0, m.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = m.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, m.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, m.r * 0.82, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = m.color;
    ctx.textAlign = 'center';
    ctx.font = `900 ${Math.round(m.r * 0.17)}px "Outfit", sans-serif`;
    ctx.fillText(m.city, 0, -m.r * 0.14);
    ctx.font = `700 ${Math.round(m.r * 0.13)}px "JetBrains Mono", monospace`;
    ctx.fillText(m.date, 0, m.r * 0.12);
    ctx.font = `700 ${Math.round(m.r * 0.12)}px "Noto Sans SC", sans-serif`;
    ctx.fillText('★ 旅途勋章 ★', 0, m.r * 0.38);
    ctx.restore();
  }
}

function renderS10BluehourStrangerSkyline(sc: ShotContext): void {
  const { ctx, w, h, timeSec, scrollDist } = sc;
  const horizonY = h * 0.58;
  const walkY = h * 0.81;

  // Deep Ultramarine & Electric Cyan Blue-Hour Sky ("陌生的远方 有熟悉的陪伴")
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#030712');
  sky.addColorStop(0.55, '#0c1e3d');
  sky.addColorStop(1, '#155e75');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  drawStarfieldAndClouds(sc, horizonY, {
    starCount: 38,
    cloudShadowHex: '#081426',
    cloudMidHex: '#0e294b',
    cloudRimHex: '#38bdf8',
    moonPos: { x: w * 0.82, y: h * 0.18, r: 22 },
  });

  drawDistantCitySkyline(sc, horizonY, {
    parallaxPx: scrollDist * 0.06,
    maxTowerHeight: h * 0.25,
    silhouetteHex: '#07101f',
    secondarySilhouetteHex: '#0d1b33',
    windowPrimaryHex: '#38bdf8',
    windowSecondaryHex: '#f472b6',
    waterReflectionHeight: walkY - horizonY - 8,
  });

  // Rippling midnight river separating unfamiliar neon skyline from warm stone promenade
  const river = ctx.createLinearGradient(0, horizonY, 0, walkY);
  river.addColorStop(0, '#082f49');
  river.addColorStop(0.6, '#05192d');
  river.addColorStop(1, '#030812');
  ctx.fillStyle = river;
  ctx.fillRect(0, horizonY, w, walkY - horizonY);

  renderMidgroundDiegeticLyrics(sc, 's10_bluehour_stranger_skyline');

  // Ornate riverfront stone balustrade & warm amber globe streetlamps (contrasting S04's high suspension bridge)
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, walkY, w, h - walkY);
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, walkY - 46, w, 6);
  for (let bx = 36; bx < w; bx += 48) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx, walkY - 42, 6, 42);
  }

  for (const lampFrac of [0.18, 0.76]) {
    const lx = w * lampFrac;
    ctx.fillStyle = '#0b111e';
    ctx.fillRect(lx - 4, walkY - 210, 8, 210);
    const lGlow = ctx.createRadialGradient(lx, walkY - 218, 4, lx, walkY - 218, 84);
    lGlow.addColorStop(0, '#fef9c3');
    lGlow.addColorStop(0.32, 'rgba(251, 191, 36, 0.42)');
    lGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = lGlow;
    ctx.beginPath();
    ctx.arc(lx, walkY - 218, 84, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.34,
    groundY: walkY + 14,
    travelerHeightPx: h * 0.46,
    walkPhase: timeSec * 4.8,
    pose: 'tow_stride',
    rimColor: '#38bdf8',
    warmHandleGlow: true,
  });
}

function renderS11EscalatorSideSupport(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  // Architectural glass-and-steel station atrium with diagonal ascending escalator (-22 deg)
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0b101b');
  bg.addColorStop(0.6, '#162032');
  bg.addColorStop(1, '#090c14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Diagonal architectural skylight beams
  drawTyndallGodRays(ctx, w * 0.78, -30, 5, 2.1, 0.4, h * 1.2, '251, 191, 36', 0.12);

  // Diagonal escalator truss & moving grooved steel steps ascending from bottom-left to upper-right
  const slope = -0.36;
  const centerStepX = w * 0.52;
  const centerStepY = h * 0.68;

  ctx.save();
  ctx.translate(centerStepX, centerStepY);
  ctx.rotate(slope);

  // Brushed steel escalator steps
  const stepOffset = (timeSec * 58) % 44;
  for (let i = -10; i <= 10; i++) {
    const sx = i * 44 + stepOffset;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.32)';
    ctx.lineWidth = 1.2;
    ctx.fillRect(sx - 21, 0, 42, 26);
    ctx.strokeRect(sx - 21, 0, 42, 26);
  }

  // Translucent glass balustrade + warm amber LED handrail
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.fillRect(-w, -118, w * 2, 118);
  ctx.fillStyle = '#18181b';
  ctx.fillRect(-w, -126, w * 2, 12);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.65)';
  ctx.fillRect(-w, -114, w * 2, 2.5);
  ctx.restore();

  // Upright Xiaohei standing firmly on an escalator step, supporting a brown canvas duffel bag & folded coat on top!
  const caseX = w * 0.48;
  const caseBottomY = h * 0.7;
  const anchors = drawRimowaCabin(sc, {
    cx: caseX,
    bottomY: caseBottomY,
    scale: 1.05,
    tilt: 0,
    handleRatio: 0.56,
    warmHandleGlow: true,
    showScuffs: true,
    wheelAngleOverride: 0,
  });

  // Heavy waxed-canvas travel duffel + camel trench coat resting securely atop Xiaohei ("依然 稳托住我 行囊")!
  ctx.save();
  ctx.translate(anchors.topCenterX, anchors.topCenterY - 2);
  const bagGrad = ctx.createLinearGradient(-56, -48, 56, 0);
  bagGrad.addColorStop(0, '#92400e');
  bagGrad.addColorStop(0.55, '#78350f');
  bagGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = bagGrad;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.4;
  roundRectPath(ctx, -56, -46, 112, 46, 16);
  ctx.fill();
  ctx.stroke();

  // Leather straps around canvas duffel
  ctx.fillStyle = '#291509';
  ctx.fillRect(-28, -46, 9, 46);
  ctx.fillRect(19, -46, 9, 46);
  ctx.restore();
}

// ============================================================================
// 03. PRE-CHORUS 1 (S12 – S15)
// ============================================================================

function renderS12OverheadPackedHalves(sc: ShotContext): void {
  const { ctx, w, h } = sc;

  // Overhead 90-degree flat-lay on warm dark walnut floorboards
  const walnut = ctx.createRadialGradient(w * 0.5, h * 0.5, 60, w * 0.5, h * 0.5, w * 0.7);
  walnut.addColorStop(0, '#362013');
  walnut.addColorStop(1, '#120a06');
  ctx.fillStyle = walnut;
  ctx.fillRect(0, 0, w, h);

  const halfW = Math.min(w * 0.36, 368);
  const boxH = Math.min(h * 0.62, 460);
  const topY = (h - boxH) * 0.48;
  const gap = 18;
  const leftX = w * 0.5 - gap * 0.5 - halfW;
  const rightX = w * 0.5 + gap * 0.5;

  // Center leather hinge spine
  ctx.fillStyle = '#18181f';
  roundRectPath(ctx, w * 0.5 - gap * 0.5 - 4, topY + 24, gap + 8, boxH - 48, 6);
  ctx.fill();

  for (const bx of [leftX, rightX]) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    roundRectPath(ctx, bx + 8, topY + 12, halfW, boxH, 24);
    ctx.fill();

    ctx.fillStyle = '#181820';
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 4;
    roundRectPath(ctx, bx, topY, halfW, boxH, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#23232e';
    roundRectPath(ctx, bx + 14, topY + 14, halfW - 28, boxH - 28, 14);
    ctx.fill();
  }

  // LEFT HALF: Elastic X-straps drawn UNDERNEATH packed keepsakes (fixing physical layering!)
  ctx.strokeStyle = '#09090d';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(leftX + 24, topY + 28);
  ctx.lineTo(leftX + halfW - 24, topY + boxH - 28);
  ctx.moveTo(leftX + halfW - 24, topY + 28);
  ctx.lineTo(leftX + 24, topY + boxH - 28);
  ctx.stroke();

  // 1) Cream wax-sealed letter ("致老友")
  ctx.save();
  ctx.translate(leftX + halfW * 0.48, topY + boxH * 0.28);
  ctx.rotate(-0.05);
  ctx.fillStyle = '#f6efe0';
  roundRectPath(ctx, -110, -52, 220, 104, 6);
  ctx.fill();
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(76, -24, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#573d28';
  ctx.font = '700 13px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('致老友 · 半生旅途手札', -92, -16);
  ctx.font = '600 11px "Noto Sans SC", sans-serif';
  ctx.fillStyle = '#785a46';
  ctx.fillText('那些没说出口的妥协与远方', -92, 14);
  ctx.restore();

  // 2) Vintage silver-and-black Leica-style rangefinder camera + leather journal
  ctx.save();
  ctx.translate(leftX + halfW * 0.36, topY + boxH * 0.68);
  ctx.rotate(0.08);
  ctx.fillStyle = '#111116';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, -64, -34, 128, 68, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#d4d4d8';
  roundRectPath(ctx, -64, -34, 128, 18, 6);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(8, 6, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Leather notebook beside camera
  ctx.fillStyle = '#78350f';
  roundRectPath(ctx, leftX + halfW * 0.64, topY + boxH * 0.54, 86, 122, 6);
  ctx.fill();

  // RIGHT HALF: Folded charcoal & ochre sweaters + boarding pass stubs under RIMOWA Flex-Divider
  ctx.fillStyle = '#334155';
  roundRectPath(ctx, rightX + 26, topY + 28, halfW - 52, boxH * 0.42, 10);
  ctx.fill();
  ctx.fillStyle = '#b45309';
  roundRectPath(ctx, rightX + 26, topY + boxH * 0.48, halfW - 52, boxH * 0.42, 10);
  ctx.fill();

  // Flex-Divider mesh frame on right compartment
  ctx.strokeStyle = 'rgba(244, 244, 245, 0.22)';
  ctx.lineWidth = 1.2;
  roundRectPath(ctx, rightX + 22, topY + 22, halfW - 44, boxH - 44, 12);
  ctx.stroke();
}

function renderS13MistyGantryForkPov(sc: ShotContext): void {
  const { ctx, w, h, scrollDist } = sc;
  const horizonY = h * 0.52;

  // Cool amber-mist dawn sky ("不曾问，未来的去向 何方")
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#0f172a');
  sky.addColorStop(0.65, '#334155');
  sky.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // True Y-Forking Expressway Viaduct splitting Left (↖) & Right (↗) into sea fog!
  ctx.fillStyle = '#1e293b';
  // Left diverging viaduct branch
  ctx.beginPath();
  ctx.moveTo(w * 0.14, h);
  ctx.quadraticCurveTo(w * 0.34, h * 0.68, w * 0.22, horizonY);
  ctx.lineTo(w * 0.38, horizonY);
  ctx.quadraticCurveTo(w * 0.48, h * 0.68, w * 0.5, h);
  ctx.closePath();
  ctx.fill();

  // Right diverging viaduct branch
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h);
  ctx.quadraticCurveTo(w * 0.52, h * 0.68, w * 0.62, horizonY);
  ctx.lineTo(w * 0.78, horizonY);
  ctx.quadraticCurveTo(w * 0.66, h * 0.68, w * 0.86, h);
  ctx.closePath();
  ctx.fill();

  // Chevron gore markings at the Y-split apex (`w * 0.5, h * 0.66`)
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
  ctx.lineWidth = 3;
  for (let c = 0; c < 4; c++) {
    const cy = h * 0.62 + c * 22 + ((scrollDist * 0.35) % 22);
    ctx.beginPath();
    ctx.moveTo(w * 0.45, cy + 12);
    ctx.lineTo(w * 0.5, cy);
    ctx.lineTo(w * 0.55, cy + 12);
    ctx.stroke();
  }

  // Overhead steel expressway gantry truss & emerald-green reflective directional signboards in sea fog!
  const gantryY = h * 0.24;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(w * 0.12, horizonY + 18);
  ctx.lineTo(w * 0.16, gantryY);
  ctx.lineTo(w * 0.84, gantryY);
  ctx.lineTo(w * 0.88, horizonY + 18);
  ctx.stroke();

  for (const sign of [
    { cx: w * 0.34, title: '↖ 未知', sub: 'UNKNOWN ROUTE' },
    { cx: w * 0.66, title: '远方 ↗', sub: 'DISTANT HORIZON' },
  ]) {
    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    roundRectPath(ctx, sign.cx - 118, gantryY - 36, 236, 68, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.font = '800 20px "Noto Sans SC", "Outfit", sans-serif';
    ctx.fillText(sign.title, sign.cx, gantryY - 4);
    ctx.fillStyle = 'rgba(226, 232, 240, 0.78)';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(sign.sub, sign.cx, gantryY + 18);
  }

  // Drifting sea-fog veil softening the distant Y-fork horizon
  const fog = ctx.createLinearGradient(0, horizonY - 45, 0, horizonY + 85);
  fog.addColorStop(0, 'rgba(226, 232, 240, 0)');
  fog.addColorStop(0.5, 'rgba(226, 232, 240, 0.58)');
  fog.addColorStop(1, 'rgba(226, 232, 240, 0)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, horizonY - 45, w, 130);

  // First-person POV hand pushing Xiaohei forward toward the fork
  drawFirstPersonPovHandOnHandle(sc, w * 0.5, h * 0.8);
}

function renderS14CornerRivetPatina(sc: ShotContext): void {
  const { ctx, w, h } = sc;

  // Warm sodium-vapor streetlamp night bokeh
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#09090f');
  bg.addColorStop(0.6, '#1c1410');
  bg.addColorStop(1, '#09080b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  drawCinemaBokeh(sc, 10, '#f59e0b', '#ea580c', 0.9);

  // 100mm Macro of Xiaohei's Top-Right Riveted Aluminum Corner Bumper ("像老友懂我 咽下的沧桑")
  const shellX = w * 0.14;
  const shellY = h * 0.22;
  const shellW = w * 0.66;
  const shellH = h * 0.78;

  ctx.fillStyle = '#14141c';
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.35)';
  ctx.lineWidth = 2.2;
  roundRectPath(ctx, shellX, shellY, shellW, shellH, 46);
  ctx.fill();
  ctx.stroke();

  // Heavy forged brushed-aluminum corner bumper cap at top-right of shell
  const capW = 280;
  const capH = 240;
  const capX = shellX + shellW - capW;
  const capY = shellY;

  const capGrad = ctx.createLinearGradient(capX, capY, capX + capW, capY + capH);
  capGrad.addColorStop(0, '#71717a');
  capGrad.addColorStop(0.45, '#3f3f46');
  capGrad.addColorStop(1, '#18181b');
  ctx.fillStyle = capGrad;
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2.4;
  roundRectPath(ctx, capX, capY, capW, capH, 44);
  ctx.fill();
  ctx.stroke();

  // 5 machined aviation rivets + authentic battle dents & silver scratch arcs
  for (const [rx, ry] of [
    [52, 48],
    [140, 44],
    [224, 62],
    [232, 152],
    [64, 188],
  ]) {
    ctx.fillStyle = '#e4e4e7';
    ctx.beginPath();
    ctx.arc(capX + rx, capY + ry, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(capX + rx, capY + ry, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Battle dent shading & silver abrasion marks
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.72)';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(capX + 86, capY + 96);
  ctx.lineTo(capX + 188, capY + 128);
  ctx.moveTo(capX + 112, capY + 142);
  ctx.lineTo(capX + 196, capY + 168);
  ctx.stroke();

  // Weathered half-peeled `PEK → CDG` baggage sticker below the corner bumper
  ctx.save();
  ctx.translate(shellX + shellW * 0.42, shellY + shellH * 0.56);
  ctx.rotate(-0.08);
  ctx.fillStyle = '#ea580c';
  roundRectPath(ctx, -120, -42, 240, 84, 8);
  ctx.fill();
  ctx.fillStyle = '#fff7ed';
  ctx.font = '900 26px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PEK → CDG', 0, 8);
  ctx.restore();
}

function renderS15CobblestoneSilentWheels(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec } = sc;
  const stoneY = h * 0.71;

  // 1. Rain-misty historic stone lantern alley ("就算是，被颠沛时 也没有声响" — zero sparks, zero severed leg!)
  const bg = ctx.createLinearGradient(0, 0, w, stoneY);
  bg.addColorStop(0, '#0b0d14');
  bg.addColorStop(0.55, '#191d2b');
  bg.addColorStop(1, '#262b38');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, stoneY);

  // Perspective historic cut-stone alley wall on left receding toward a misty stone archway on right
  ctx.fillStyle = '#141722';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w * 0.62, h * 0.16);
  ctx.lineTo(w * 0.62, stoneY);
  ctx.lineTo(0, stoneY);
  ctx.closePath();
  ctx.fill();

  // Subtle ashlar stone masonry courses on alley wall
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let row = 1; row <= 6; row++) {
    const yL = (stoneY * row) / 7;
    const yR = h * 0.16 + ((stoneY - h * 0.16) * row) / 7;
    ctx.beginPath();
    ctx.moveTo(0, yL);
    ctx.lineTo(w * 0.62, yR);
    ctx.stroke();
  }

  // Distant misty stone archway at end of alley (`0.68w .. 0.88w`) with recessed stone ring & distant warm streetlamp
  ctx.fillStyle = '#0f121b';
  ctx.fillRect(w * 0.62, 0, w * 0.38, stoneY);

  ctx.fillStyle = '#252b3b';
  ctx.beginPath();
  ctx.moveTo(w * 0.675, stoneY);
  ctx.lineTo(w * 0.675, h * 0.42);
  ctx.arc(w * 0.78, h * 0.42, w * 0.105, Math.PI, 0);
  ctx.lineTo(w * 0.885, stoneY);
  ctx.closePath();
  ctx.fill();

  const archGrad = ctx.createLinearGradient(w * 0.78, h * 0.28, w * 0.78, stoneY);
  archGrad.addColorStop(0, '#1e293b');
  archGrad.addColorStop(0.65, '#334155');
  archGrad.addColorStop(1, '#475569');
  ctx.fillStyle = archGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.695, stoneY);
  ctx.lineTo(w * 0.695, h * 0.42);
  ctx.arc(w * 0.78, h * 0.42, w * 0.085, Math.PI, 0);
  ctx.lineTo(w * 0.865, stoneY);
  ctx.closePath();
  ctx.fill();

  const farLamp = ctx.createRadialGradient(w * 0.79, h * 0.48, 3, w * 0.79, h * 0.48, 56);
  farLamp.addColorStop(0, 'rgba(254, 243, 199, 0.72)');
  farLamp.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = farLamp;
  ctx.beginPath();
  ctx.arc(w * 0.79, h * 0.48, 56, 0, Math.PI * 2);
  ctx.fill();

  // Warm amber wrought-iron alley wall lantern with roof cap & cage at `(0.22w, 0.32h)`
  const lx = w * 0.22;
  const ly = h * 0.32;
  ctx.strokeStyle = '#090a0f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.14, ly - 18);
  ctx.lineTo(lx, ly - 18);
  ctx.lineTo(lx, ly - 10);
  ctx.moveTo(w * 0.14, ly + 8);
  ctx.quadraticCurveTo(w * 0.18, ly - 14, lx - 10, ly - 18);
  ctx.stroke();

  const lanternGlow = ctx.createRadialGradient(lx, ly + 10, 4, lx, ly + 10, 170);
  lanternGlow.addColorStop(0, '#fffbeb');
  lanternGlow.addColorStop(0.25, 'rgba(251, 191, 36, 0.5)');
  lanternGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = lanternGlow;
  ctx.beginPath();
  ctx.arc(lx, ly + 10, 170, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#090a0f';
  ctx.beginPath();
  ctx.moveTo(lx - 20, ly - 6);
  ctx.lineTo(lx, ly - 17);
  ctx.lineTo(lx + 20, ly - 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef3c7';
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 2;
  roundRectPath(ctx, lx - 13, ly - 6, 26, 34, 4);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(lx, ly - 6);
  ctx.lineTo(lx, ly + 28);
  ctx.stroke();

  // 2. Rain-glossed 3D perspective bluestone cobbles & lantern puddle reflection
  ctx.fillStyle = '#0d1018';
  ctx.fillRect(0, stoneY, w, h - stoneY);

  for (let row = 0; row < 5; row++) {
    const r0 = row / 5;
    const r1 = (row + 1) / 5;
    const yTop = stoneY + Math.pow(r0, 1.25) * (h - stoneY);
    const yBot = stoneY + Math.pow(r1, 1.25) * (h - stoneY);
    const stoneH = Math.max(12, yBot - yTop - 4);
    const stoneW = 72 + row * 28;
    const shift = (scrollDist * (0.55 + row * 0.22)) % stoneW;
    const rowOff = (row % 2) * stoneW * 0.5;

    for (let x = -stoneW * 2; x < w + stoneW * 2; x += stoneW) {
      const sx = x - shift + rowOff;
      const stGrad = ctx.createLinearGradient(sx, yTop, sx, yTop + stoneH);
      stGrad.addColorStop(0, row < 2 ? '#293042' : '#333c52');
      stGrad.addColorStop(0.35, '#1d2230');
      stGrad.addColorStop(1, '#0e1119');
      ctx.fillStyle = stGrad;
      roundRectPath(ctx, sx + 3, yTop + 2, stoneW - 6, stoneH, 8);
      ctx.fill();

      // Wet rain specular highlight along top bevel of each bluestone
      ctx.strokeStyle =
        Math.abs(sx - lx) < 180
          ? 'rgba(253, 224, 71, 0.24)'
          : 'rgba(186, 230, 253, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + 10, yTop + 3.5);
      ctx.lineTo(sx + stoneW - 12, yTop + 3.5);
      ctx.stroke();
    }
  }

  // Silent concentric water ripples expanding under Xiaohei's cushioned wheels
  for (let r = 0; r < 2; r++) {
    const phase = (timeSec * 0.9 + r * 0.5) % 1;
    ctx.strokeStyle = `rgba(186, 230, 253, ${((1 - phase) * 0.36).toFixed(3)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(w * 0.44, stoneY + 48, 28 + phase * 76, 5 + phase * 11, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Full-Figure Low Alley Tracking of Traveler & Cushioned Xiaohei (`travelerHeightPx: h * 0.61` clears top badge cleanly!)
  const cushionBob = Math.sin(timeSec * 8.5) * 2.2;
  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.58,
    groundY: stoneY + 46 + cushionBob,
    travelerHeightPx: h * 0.61,
    walkPhase: timeSec * 4.6,
    pose: 'tow_stride',
    rimColor: '#fde68a',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.22,
  });
}

// ============================================================================
// 04. CHORUS 1 (S16 – S23)
// ============================================================================

function renderS16OverpassSunburstLow(sc: ShotContext): void {
  const { ctx, w, h, beat } = sc;
  const deckY = h * 0.8;

  // Explosive 18mm ultra-low angle looking up into golden sunburst breaking dark clouds
  const sky = ctx.createRadialGradient(w * 0.5, h * 0.34, 20, w * 0.5, h * 0.4, w * 0.75);
  sky.addColorStop(0, '#fffbeb');
  sky.addColorStop(0.24, '#facc15');
  sky.addColorStop(0.58, '#c2410c');
  sky.addColorStop(1, '#140b09');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, deckY);

  drawTyndallGodRays(ctx, w * 0.5, h * 0.34, 9, Math.PI * 0.5, 1.35, h * 0.9, '254, 240, 138', 0.22);
  renderMidgroundDiegeticLyrics(sc, 's16_overpass_sunburst_low');

  // Steel overpass parapet & asphalt deck
  ctx.fillStyle = '#09080b';
  ctx.fillRect(0, deckY, w, h - deckY);
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, deckY - 36);
  ctx.lineTo(w, deckY - 36);
  ctx.stroke();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.52,
    groundY: deckY + 12,
    travelerHeightPx: h * 0.52,
    walkPhase: 0,
    pose: 'hero_beside',
    rimColor: '#fef08a',
    warmHandleGlow: true,
  });

  drawAnamorphicFlare(ctx, w * 0.5, h * 0.34, w * 0.85, 34, '#fde047', 0.55 + beat.kickPulse * 0.35);
}

function renderS17DiptychPackAndCarry(sc: ShotContext): void {
  const { ctx, w, h, lineProgress, beat } = sc;
  const splitTopX = w * 0.53;
  const splitBotX = w * 0.47;

  // LEFT PANEL ("替我装"): Tightening black X-straps inside open RIMOWA compartment
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(splitTopX, 0);
  ctx.lineTo(splitBotX, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = '#171311';
  ctx.fillRect(0, 0, w * 0.6, h);
  ctx.fillStyle = '#262430';
  roundRectPath(ctx, w * 0.06, h * 0.16, w * 0.4, h * 0.68, 24);
  ctx.fill();

  // Packed camera & folded garments
  ctx.fillStyle = '#92400e';
  roundRectPath(ctx, w * 0.1, h * 0.22, w * 0.32, h * 0.25, 12);
  ctx.fill();
  ctx.fillStyle = '#334155';
  roundRectPath(ctx, w * 0.1, h * 0.51, w * 0.32, h * 0.26, 12);
  ctx.fill();

  // Cinching X-straps snapping taut on beat 1
  const taut = Math.min(1, lineProgress * 2.4);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 14 + taut * 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h * 0.18);
  ctx.lineTo(w * 0.44, h * 0.8);
  ctx.moveTo(w * 0.44, h * 0.18);
  ctx.lineTo(w * 0.08, h * 0.8);
  ctx.stroke();
  // Chrome buckle click at X center
  ctx.fillStyle = '#facc15';
  roundRectPath(ctx, w * 0.26 - 24, h * 0.49 - 16, 48, 32, 6);
  ctx.fill();
  ctx.restore();

  // RIGHT PANEL ("替我扛"): Xiaohei's aluminum spine & corner bumper shielding heavy load & golden sparks
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(splitTopX, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(splitBotX, h);
  ctx.closePath();
  ctx.clip();

  const rBg = ctx.createLinearGradient(w * 0.5, 0, w, h);
  rBg.addColorStop(0, '#29150e');
  rBg.addColorStop(1, '#09080c');
  ctx.fillStyle = rBg;
  ctx.fillRect(w * 0.45, 0, w * 0.6, h);

  drawRimowaCabin(sc, {
    cx: w * 0.74,
    bottomY: h * 0.82 - beat.kickPulse * 3,
    scale: 1.38,
    tilt: 0.12,
    handleRatio: 0.45,
    warmHandleGlow: true,
    showScuffs: true,
  });
  ctx.restore();

  // Crisp glowing diagonal golden split blade separating the two panels
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(splitTopX, 0);
  ctx.lineTo(splitBotX, h);
  ctx.stroke();
}

function renderS18SlipstreamTagWhip(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  // High-speed wind-tunnel golden slipstream close-up
  const bg = ctx.createLinearGradient(0, 0, w, 0);
  bg.addColorStop(0, '#09080c');
  bg.addColorStop(0.55, '#2b130a');
  bg.addColorStop(1, '#451a03');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Horizontal golden slipstream speed lines
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 20; i++) {
    const sy = (i / 20) * h;
    const len = 140 + hash01(i * 7.3) * 260;
    const sx = w - ((timeSec * 980 + i * 190) % (w + 360));
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(250, 204, 21, 0.45)' : 'rgba(251, 146, 60, 0.35)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + len, sy);
    ctx.stroke();
  }
  ctx.restore();

  // Handle rod on left + orange PRIORITY tag whipped horizontal by wind!
  const rodX = w * 0.24;
  ctx.fillStyle = '#e4e4e7';
  ctx.fillRect(rodX - 9, h * 0.18, 18, h * 0.82);

  const whip = Math.sin(timeSec * 22) * 0.04;
  ctx.strokeStyle = '#f4f4f5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rodX + 9, h * 0.44);
  ctx.lineTo(w * 0.36, h * 0.44);
  ctx.stroke();

  drawPriorityCard(
    ctx,
    w * 0.56,
    h * 0.44,
    430 * (1 + beat.kickPulse * 0.04),
    144,
    -0.03 + whip,
    'PRIORITY',
    'STILL YOU · 疾风同行',
    '2026',
    '#f59e0b',
    '#09090b'
  );
}

function renderS19OtsShoulderHorizon(sc: ShotContext): void {
  const { ctx, w, h, scrollDist } = sc;
  const horizonY = h * 0.54;

  // Warm sunset harbor bay vista seen over the traveler's shoulder ("尔似 在我肩")
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#170e1c');
  sky.addColorStop(0.5, '#6b241c');
  sky.addColorStop(1, '#fbbf24');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  drawDistantCitySkyline(sc, horizonY, {
    parallaxPx: scrollDist * 0.05,
    maxTowerHeight: h * 0.16,
    silhouetteHex: '#1b1118',
    secondarySilhouetteHex: '#2b1921',
    windowPrimaryHex: '#fde68a',
    windowSecondaryHex: '#fb923c',
    waterReflectionHeight: h * 0.24,
  });

  const water = ctx.createLinearGradient(0, horizonY, 0, h);
  water.addColorStop(0, '#78350f');
  water.addColorStop(1, '#0c0a0e');
  ctx.fillStyle = water;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  renderMidgroundDiegeticLyrics(sc, 's19_ots_shoulder_horizon');
  drawOverTheShoulderCompanion(sc, { goldenPromenade: false });
}

function renderS20HeavyLoadCompression(sc: ShotContext): void {
  const { ctx, w, h, lineProgress, beat } = sc;
  const groundY = h * 0.82;

  // Dramatic warm industrial concrete stage ("哪怕 生活 添上重量")
  const bg = ctx.createRadialGradient(w * 0.5, groundY - 120, 40, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, '#3b1d11');
  bg.addColorStop(1, '#09080c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, groundY);

  ctx.fillStyle = '#0e0e14';
  ctx.fillRect(0, groundY, w, h - groundY);

  // Impact drop physics: heavy bag drops onto Xiaohei in first 0.22 progress, compressing 8px then rebounding rock-steady!
  const dropT = Math.min(1, lineProgress / 0.22);
  const rebound = lineProgress >= 0.22 ? Math.exp(-(lineProgress - 0.22) * 8) * Math.cos((lineProgress - 0.22) * 28) * 9 : 0;
  const compressPx = lineProgress >= 0.22 ? Math.max(0, rebound) : 0;

  // Golden radial shockwave ring on ground upon impact
  if (lineProgress >= 0.2) {
    const waveP = Math.min(1, (lineProgress - 0.2) * 1.6);
    ctx.save();
    ctx.strokeStyle = `rgba(250, 204, 21, ${((1 - waveP) * 0.75).toFixed(3)})`;
    ctx.lineWidth = 3.5 * (1 - waveP * 0.6);
    ctx.beginPath();
    ctx.ellipse(w * 0.5, groundY + 4, 90 + waveP * 340, 12 + waveP * 38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const anchors = drawRimowaCabin(sc, {
    cx: w * 0.5,
    bottomY: groundY + compressPx * 0.4,
    scale: 1.42,
    tilt: 0,
    handleRatio: 0.24,
    warmHandleGlow: true,
    showScuffs: true,
    wheelAngleOverride: 0,
  });

  // Heavy canvas travel pack + stacked books landing squarely on Xiaohei's top shell!
  const bagDropOffset = (1 - dropT) * -140 + compressPx;
  ctx.save();
  ctx.translate(anchors.topCenterX, anchors.topCenterY + bagDropOffset);
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  roundRectPath(ctx, -84, -68, 168, 68, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  roundRectPath(ctx, -62, -98, 124, 32, 8);
  ctx.fill();
  ctx.restore();
  void beat;
}

function renderS21TunnelFlareRushPov(sc: ShotContext): void {
  const { ctx, w, h, timeSec, scrollDist } = sc;

  // Curved urban sodium-vapor tunnel rushing toward blinding white-gold exit light ("哪怕那前路 跌撞迷茫")
  const vx = w * 0.54 + Math.sin(timeSec * 3.2) * 24;
  const vy = h * 0.46 + Math.cos(timeSec * 4.5) * 10;

  ctx.fillStyle = '#07070b';
  ctx.fillRect(0, 0, w, h);

  // Perspective concrete tunnel arch rings rushing past camera
  for (let i = 0; i < 10; i++) {
    const z = ((i / 10 + (scrollDist * 0.0022) % 1) % 1);
    const scale = Math.pow(z, 2.1);
    const rx = 70 + scale * w * 0.95;
    const ry = 55 + scale * h * 0.85;

    ctx.strokeStyle = `rgba(251, 146, 60, ${(0.12 + scale * 0.48).toFixed(3)})`;
    ctx.lineWidth = 1.5 + scale * 6;
    ctx.beginPath();
    ctx.ellipse(vx, vy, rx, ry, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Twin overhead sodium lamp streaks
    ctx.fillStyle = `rgba(254, 240, 138, ${(0.25 + scale * 0.65).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(vx - rx * 0.48, vy - ry * 0.68, 2 + scale * 9, 0, Math.PI * 2);
    ctx.arc(vx + rx * 0.48, vy - ry * 0.68, 2 + scale * 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wet tunnel asphalt road leading into bright white-gold tunnel portal
  ctx.fillStyle = '#101017';
  ctx.beginPath();
  ctx.moveTo(vx - 65, vy + 28);
  ctx.lineTo(vx + 65, vy + 28);
  ctx.lineTo(w * 1.1, h);
  ctx.lineTo(-w * 0.1, h);
  ctx.closePath();
  ctx.fill();

  const exitGlow = ctx.createRadialGradient(vx, vy, 8, vx, vy, 210);
  exitGlow.addColorStop(0, '#ffffff');
  exitGlow.addColorStop(0.35, 'rgba(254, 240, 138, 0.82)');
  exitGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = exitGlow;
  ctx.beginPath();
  ctx.arc(vx, vy, 210, 0, Math.PI * 2);
  ctx.fill();

  drawFirstPersonPovHandOnHandle(sc, w * 0.5, h * 0.82);
}

function renderS22CrestLeapSilhouette(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  // Crimson-gold twilight sky + curved steel arch crest silhouette (-4 deg Dutch tilt applied by renderer)
  const sky = ctx.createLinearGradient(0, 0, w, h * 0.8);
  sky.addColorStop(0, '#180814');
  sky.addColorStop(0.48, '#7f1d1d');
  sky.addColorStop(0.82, '#ea580c');
  sky.addColorStop(1, '#fde047');
  ctx.fillStyle = sky;
  ctx.fillRect(-40, -40, w + 80, h + 80);

  renderMidgroundDiegeticLyrics(sc, 's22_crest_leap_silhouette');

  // Sweeping parabolic steel bridge arch truss
  ctx.strokeStyle = '#0c080c';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(-40, h * 0.88);
  ctx.quadraticCurveTo(w * 0.5, h * 0.08, w + 40, h * 0.88);
  ctx.stroke();

  const crestY = h * 0.78;
  ctx.fillStyle = '#09070a';
  ctx.beginPath();
  ctx.moveTo(-40, h + 40);
  ctx.lineTo(-40, crestY + 36);
  ctx.quadraticCurveTo(w * 0.5, crestY - 18, w + 40, crestY + 36);
  ctx.lineTo(w + 40, h + 40);
  ctx.closePath();
  ctx.fill();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.52,
    groundY: crestY + 4,
    travelerHeightPx: h * 0.48,
    walkPhase: timeSec * 6.4,
    pose: 'tow_stride',
    rimColor: '#fef08a',
    warmHandleGlow: true,
  });

  drawAnamorphicFlare(ctx, w * 0.66, crestY - 30, w * 0.9, 28, '#fb923c', 0.5 + beat.kickPulse * 0.4);
}

function renderS23BrutalistLightFortress(sc: ShotContext): void {
  const { ctx, w, h } = sc;
  const floorY = h * 0.8;

  // Tadao Ando-inspired Brutalist board-formed concrete sanctuary ("你最是 安稳堡垒啊")
  // ZERO spinning cartoon hexagons! Pure monumental architecture & golden skylight shafts!
  const bg = ctx.createLinearGradient(0, 0, 0, floorY);
  bg.addColorStop(0, '#141316');
  bg.addColorStop(0.55, '#242228');
  bg.addColorStop(1, '#100f13');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, floorY);

  // Dramatic diagonal skylight Tyndall rays pouring between concrete colonnade bays
  drawTyndallGodRays(ctx, w * 0.5, -20, 7, Math.PI * 0.5, 0.72, h * 1.05, '253, 224, 71', 0.2);

  // Symmetrical board-formed concrete pillars with authentic tie-rod holes
  const pillars = [0.08, 0.24, 0.76, 0.92];
  for (const pxFrac of pillars) {
    const pw = w * 0.09;
    const px = w * pxFrac - pw * 0.5;
    const pGrad = ctx.createLinearGradient(px, 0, px + pw, 0);
    pGrad.addColorStop(0, '#1c1b20');
    pGrad.addColorStop(0.7, '#323038');
    pGrad.addColorStop(1, '#121116');
    ctx.fillStyle = pGrad;
    ctx.fillRect(px, 0, pw, floorY);

    // Architectural concrete form tie-rod dots
    ctx.fillStyle = 'rgba(9, 9, 11, 0.65)';
    for (let y = 90; y < floorY - 40; y += 95) {
      ctx.beginPath();
      ctx.arc(px + pw * 0.3, y, 3, 0, Math.PI * 2);
      ctx.arc(px + pw * 0.7, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Polished dark obsidian mirror floor
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#181512');
  floorGrad.addColorStop(1, '#070709');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = 'rgba(250, 204, 21, 0.38)';
  ctx.fillRect(0, floorY, w, 1.5);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.53,
    groundY: floorY + 2,
    travelerHeightPx: h * 0.46,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#fde047',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.32,
  });
}
