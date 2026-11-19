import { TRAVEL_STICKERS, type ShotType } from './mvData';
import { renderMidgroundDiegeticLyrics } from './diegeticLyrics';
import {
  drawCoupledTravelerAndRimowa,
  drawFirstPersonPovHandOnHandle,
  drawOverTheShoulderCompanion,
  drawRealisticHandOnRimowaHandle,
  drawRimowaCabin,
  drawTrueMacroWheelAndBoot,
} from './humanRimowaRig';
import {
  drawAnamorphicFlare,
  drawCinemaBokeh,
  drawDistantCitySkyline,
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

  // 6 still phosphor-bronze strings crossing horizontally in shallow DOF foreground
  for (let s = 0; s < 6; s++) {
    const sy = cy - holeR * 0.64 + (s / 5) * holeR * 1.28;
    const thick = 1.3 + (5 - s) * 0.48;
    ctx.strokeStyle = s < 3 ? '#d97706' : '#fef3c7';
    ctx.globalAlpha = 0.82;
    ctx.lineWidth = thick;
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(w, sy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  drawTyndallGodRays(ctx, w * 0.15, -40, 5, 0.95, 0.45, h * 1.2, '253, 224, 71', 0.12);
  drawCinemaBokeh(sc, 10, '#f59e0b', '#fde68a', 0.75);
  void timeSec;
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

function renderS03HallwayWheelsWakeup(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;
  const floorY = h * 0.76;

  // Warm sunlit morning entryway wall & open oak doorframe shaft
  const wall = ctx.createLinearGradient(0, 0, w, floorY);
  wall.addColorStop(0, '#1c1613');
  wall.addColorStop(0.62, '#34261d');
  wall.addColorStop(1, '#573d28');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, floorY);

  // Diagonal morning sunlight rectangle cast through open front door
  ctx.save();
  ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
  ctx.beginPath();
  ctx.moveTo(w * 0.58, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, floorY);
  ctx.lineTo(w * 0.32, floorY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Warm honey-oak floor planks
  const oak = ctx.createLinearGradient(0, floorY, 0, h);
  oak.addColorStop(0, '#4a2c16');
  oak.addColorStop(0.5, '#2d1a0d');
  oak.addColorStop(1, '#140b06');
  ctx.fillStyle = oak;
  ctx.fillRect(0, floorY, w, h - floorY);

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.16)';
  ctx.lineWidth = 1.2;
  for (let i = -2; i < 12; i++) {
    const px = ((i * 155 - sc.scrollDist * 0.45) % (w + 300) + (w + 300)) % (w + 300) - 150;
    ctx.beginPath();
    ctx.moveTo(px, floorY);
    ctx.lineTo(px - 110, h);
    ctx.stroke();
  }

  // Ground-level macro wakeup of Xiaohei's precision Multiwheel & traveler's boot stepping toward threshold
  drawTrueMacroWheelAndBoot(sc, floorY + 8, {
    wheelRadiusPx: 48,
    showBoot: true,
  });

  drawTyndallGodRays(ctx, w * 0.88, 0, 5, 2.25, 0.38, h * 1.1, '254, 240, 138', 0.14 + lineProgress * 0.08);
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
    const bx = w * 0.24 + b * 26 + timeSec * 18;
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

  // Foreground suspension bridge H-tower & catenary cables
  const towerX = w * 0.28 - ((scrollDist * 0.14) % (w * 0.9));
  ctx.strokeStyle = '#140e14';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(towerX, h * 0.08);
  ctx.lineTo(towerX, deckY);
  ctx.stroke();

  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.26);
  ctx.quadraticCurveTo(w * 0.5, deckY - 38, w, h * 0.18);
  ctx.stroke();

  ctx.lineWidth = 1.1;
  ctx.strokeStyle = 'rgba(24, 16, 20, 0.65)';
  for (let x = 40; x < w; x += 64) {
    const t = x / w;
    const cy = (1 - t) * (1 - t) * (h * 0.26) + 2 * (1 - t) * t * (deckY - 38) + t * t * (h * 0.18);
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
    travelerX: w * 0.54,
    groundY: deckY + 14,
    travelerHeightPx: h * 0.44,
    walkPhase: timeSec * 5.0,
    pose: 'tow_stride',
    rimColor: '#fde047',
    warmHandleGlow: true,
  });
}

function renderS05BoulevardOdometerLow(sc: ShotContext): void {
  const { ctx, w, h, scrollDist } = sc;
  const roadY = h * 0.75;

  // Warm dusk urban boulevard out-of-focus background (ZERO vertical yellow fence bars!)
  const sky = ctx.createLinearGradient(0, 0, 0, roadY);
  sky.addColorStop(0, '#090b12');
  sky.addColorStop(0.6, '#1a1621');
  sky.addColorStop(1, '#362318');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, roadY);

  drawCinemaBokeh(sc, 14, '#f59e0b', '#38bdf8', 1.15);

  // Textured dark asphalt road plane
  const road = ctx.createLinearGradient(0, roadY, 0, h);
  road.addColorStop(0, '#18181f');
  road.addColorStop(0.45, '#101015');
  road.addColorStop(1, '#07070a');
  ctx.fillStyle = road;
  ctx.fillRect(0, roadY, w, h - roadY);

  // Subtle painted yellow boulevard lane dashes + thermoplastic mileage counter
  const dashSpan = 220;
  const shift = (scrollDist * 1.25) % dashSpan;
  ctx.fillStyle = 'rgba(250, 204, 21, 0.62)';
  for (let x = -dashSpan; x < w + dashSpan; x += dashSpan) {
    ctx.fillRect(x - shift, roadY + 26, 92, 5);
  }

  const km = (12840 + scrollDist * 0.012).toFixed(1);
  ctx.save();
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(253, 224, 71, 0.52)';
  ctx.textAlign = 'left';
  ctx.fillText(`ODOMETER · ${km} KM`, w * 0.06, roadY - 14);
  ctx.restore();

  // True 35mm macro of rolling RIMOWA Multiwheel & striding leather Chelsea boot!
  drawTrueMacroWheelAndBoot(sc, roadY + 8, {
    wheelRadiusPx: 54,
    showBoot: true,
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
  const { ctx, w, h } = sc;

  // Warm amber-rose golden-hour sunset out-of-focus backdrop (ZERO rain streaks, ZERO CAD callout lines!)
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1e1014');
  bg.addColorStop(0.5, '#4a2016');
  bg.addColorStop(1, '#160d0b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawCinemaBokeh(sc, 16, '#fbbf24', '#fb923c', 1.3);
  drawRealisticHandOnRimowaHandle(sc);
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

  // Riverfront stone promenade & wrought-iron railing
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, walkY, w, h - walkY);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, walkY - 42);
  ctx.lineTo(w, walkY - 42);
  ctx.stroke();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.48,
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

  // Drifting sea-fog veil softening the distant Y-fork horizon
  const fog = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 80);
  fog.addColorStop(0, 'rgba(226, 232, 240, 0)');
  fog.addColorStop(0.5, 'rgba(226, 232, 240, 0.58)');
  fog.addColorStop(1, 'rgba(226, 232, 240, 0)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, horizonY - 40, w, 120);

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
  const stoneY = h * 0.74;

  // Quiet misty old-town alley dusk backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, stoneY);
  bg.addColorStop(0, '#0c0d14');
  bg.addColorStop(0.65, '#1d1c27');
  bg.addColorStop(1, '#2b2523');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, stoneY);

  drawCinemaBokeh(sc, 8, '#fb923c', '#93c5fd', 0.75);

  // Rounded wet bluestone cobblestone pavement ("被颠沛时 也没有声响" — zero sparks!)
  ctx.fillStyle = '#12131a';
  ctx.fillRect(0, stoneY, w, h - stoneY);

  const stoneW = 92;
  const shift = (scrollDist * 0.95) % stoneW;
  for (let row = 0; row < 3; row++) {
    const ry = stoneY + row * 46;
    const rowOff = (row % 2) * (stoneW * 0.5);
    for (let x = -stoneW * 2; x < w + stoneW * 2; x += stoneW) {
      const sx = x - shift + rowOff;
      const stGrad = ctx.createLinearGradient(sx, ry, sx, ry + 40);
      stGrad.addColorStop(0, '#2a2e3d');
      stGrad.addColorStop(1, '#151720');
      ctx.fillStyle = stGrad;
      roundRectPath(ctx, sx + 3, ry + 3, stoneW - 6, 40, 10);
      ctx.fill();
    }
  }

  // Quiet puddle ripple ring where wheel glides silently
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.28)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(w * 0.39, stoneY + 14, 52 + Math.sin(timeSec * 4) * 10, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  drawTrueMacroWheelAndBoot(sc, stoneY + 8, {
    wheelRadiusPx: 50,
    cobblestoneCushion: true,
    showBoot: true,
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
