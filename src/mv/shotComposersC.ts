import { TRAVEL_STICKERS, type ShotType } from './mvData';
import { renderMidgroundDiegeticLyrics } from './diegeticLyrics';
import {
  drawCoupledTravelerAndRimowa,
  drawFirstPersonPovHandOnHandle,
  drawOverTheShoulderCompanion,
  drawRearWalkingHorizonDuo,
  drawRimowaCabin,
} from './humanRimowaRig';
import {
  drawAnamorphicFlare,
  drawCinemaBokeh,
  drawPrecisionRimowaWheel,
  drawPriorityCard,
  drawTyndallGodRays,
  hash01,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * Renders Storyboard Shots S46 through S66 (Bridge, Finale, and Uyuni Mirror Outro).
 * Zero duplicate shots — every lyric cut has its own dedicated visual narrative staging.
 */
export function renderShotGroupC(sc: ShotContext, shot: ShotType): boolean {
  switch (shot) {
    case 's46_street_timelapse_sanctuary':
      renderS46StreetTimelapseSanctuary(sc);
      return true;
    case 's47_halted_wheel_autumn_leaf':
      renderS47HaltedWheelAutumnLeaf(sc);
      return true;
    case 's48_entryway_place_by_door':
      renderS48EntrywayPlaceByDoor(sc);
      return true;
    case 's49_sunbeam_plant_companionship':
      renderS49SunbeamPlantCompanionship(sc);
      return true;
    case 's50_golden_keepsake_trunk':
      renderS50GoldenKeepsakeTrunk(sc);
      return true;
    case 's51_cognac_nametag_foil':
      renderS51CognacNametagFoil(sc);
      return true;
    case 's52_cradling_hands_on_shell':
      renderS52CradlingHandsOnShell(sc);
      return true;
    case 's53_polaroid_twine_wall_crescendo':
      renderS53PolaroidTwineWallCrescendo(sc);
      return true;
    case 's54_finale_solar_zenith_burst':
      renderS54FinaleSolarZenithBurst(sc);
      return true;
    case 's55_memory_era_triptych':
      renderS55MemoryEraTriptych(sc);
      return true;
    case 's56_airborne_stickers_celebration':
      renderS56AirborneStickersCelebration(sc);
      return true;
    case 's57_golden_promenade_ots':
      renderS57GoldenPromenadeOts(sc);
      return true;
    case 's58_sparkling_runway_wheels':
      renderS58SparklingRunwayWheels(sc);
      return true;
    case 's59_horizon_lightgate_breakthrough':
      renderS59HorizonLightgateBreakthrough(sc);
      return true;
    case 's60_sky_lantern_ember_crest':
      renderS60SkyLanternEmberCrest(sc);
      return true;
    case 's61_golden_cathedral_bastion':
      renderS61GoldenCathedralBastion(sc);
      return true;
    case 's62_aerial_causeway_duo':
      renderS62AerialCausewayDuo(sc);
      return true;
    case 's63_sticker_mosaic_shell_pan':
      renderS63StickerMosaicShellPan(sc);
      return true;
    case 's64_sunset_tag_backlit_glow':
      renderS64SunsetTagBacklitGlow(sc);
      return true;
    case 's65_twilight_pier_stillness':
      renderS65TwilightPierStillness(sc);
      return true;
    case 's66_uyuni_mirror_outro':
      renderS66UyuniMirrorOutro(sc);
      return true;
    default:
      return false;
  }
}

// ============================================================================
// 09. BRIDGE — NOSTALGIA & HOMEWARD SANCTUARY (S46 – S53)
// ============================================================================

function renderS46StreetTimelapseSanctuary(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const curbY = h * 0.78;

  // Wong Kar-wai Unified Street-Corner Step-Printed Timelapse ("万物都在速朽 唯有你念旧")
  // ZERO artificial hard circle cutout! Background traffic & clouds streak rapidly while foreground streetlamp pool stays calm!
  const sky = ctx.createLinearGradient(0, 0, 0, curbY);
  sky.addColorStop(0, '#070b14');
  sky.addColorStop(0.55, '#131d2e');
  sky.addColorStop(1, '#1e2430');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, curbY);

  // Fast-rushing city clouds & blurred urban neon towers in background
  ctx.fillStyle = '#0c121e';
  for (let b = 0; b < 12; b++) {
    const bx = b * (w / 11);
    const bh = h * (0.28 + hash01(b * 7.7) * 0.28);
    ctx.fillRect(bx, curbY - 120 - bh, w / 12, bh + 120);
  }

  // High-speed crimson taillight & cyan headlight long-exposure timelapse ribbons streaking across background avenue!
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let tr = 0; tr < 18; tr++) {
    const dir = tr % 2 === 0 ? 1 : -1;
    const ty = curbY - 96 + (tr % 6) * 14;
    const len = 240 + (tr % 4) * 110;
    const speed = 920 + (tr % 5) * 240;
    const tx = (((hash01(tr * 13.1) * (w + 500) + dir * timeSec * speed) % (w + 500)) + (w + 500)) % (w + 500) - 250;
    const grad = ctx.createLinearGradient(tx, ty, tx + len, ty);
    const rgb = dir > 0 ? '244, 63, 94' : '56, 189, 248';
    grad.addColorStop(0, `rgba(${rgb}, 0)`);
    grad.addColorStop(0.5, `rgba(${rgb}, 0.62)`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + len, ty);
    ctx.stroke();
  }
  ctx.restore();

  // Foreground cobblestone sidewalk & vintage cast-iron warm sodium streetlamp at `x = 0.62w`
  ctx.fillStyle = '#14110f';
  ctx.fillRect(0, curbY, w, h - curbY);
  ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
  ctx.fillRect(0, curbY, w, 2);

  const lampX = w * 0.64;
  ctx.fillStyle = '#18181b';
  ctx.fillRect(lampX - 5, h * 0.14, 10, curbY - h * 0.14);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(lampX - 24, h * 0.15, 12, 0, Math.PI * 2);
  ctx.fill();

  // Soft warm amber streetlamp cone enveloping rock-steady Xiaohei!
  const warmCone = ctx.createRadialGradient(lampX - 40, curbY - 90, 20, lampX - 50, curbY - 60, 320);
  warmCone.addColorStop(0, 'rgba(251, 191, 36, 0.34)');
  warmCone.addColorStop(0.55, 'rgba(217, 119, 6, 0.12)');
  warmCone.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = warmCone;
  ctx.fillRect(0, 0, w, h);

  drawRimowaCabin(sc, {
    cx: w * 0.56,
    bottomY: curbY + 8,
    scale: 1.08,
    tilt: 0,
    handleRatio: 0.32,
    warmHandleGlow: true,
    showScuffs: true,
    wheelAngleOverride: 0,
  });
}

function renderS47HaltedWheelAutumnLeaf(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;
  const u = Math.max(0.72, Math.min(1.25, w / 1440));
  const floorY = h * 0.77;

  // Sunlit Parquet Corner Still-Life Macro ("如果 转轮 不再自由" — Stationary Patina Wheel + Settling Golden Ginkgo Leaves)
  const wall = ctx.createLinearGradient(0, 0, w, floorY);
  wall.addColorStop(0, '#21160f');
  wall.addColorStop(0.58, '#3b281a');
  wall.addColorStop(1, '#543822');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, floorY);

  // Cream architectural baseboard molding along home wall
  const baseH = 44 * u;
  const baseGrad = ctx.createLinearGradient(0, floorY - baseH, 0, floorY);
  baseGrad.addColorStop(0, '#e7dcc8');
  baseGrad.addColorStop(0.25, '#d6c5a9');
  baseGrad.addColorStop(1, '#9c8669');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, floorY - baseH, w, baseH);
  ctx.strokeStyle = 'rgba(255, 251, 235, 0.45)';
  ctx.lineWidth = 1.5 * u;
  ctx.beginPath();
  ctx.moveTo(0, floorY - baseH + 8 * u);
  ctx.lineTo(w, floorY - baseH + 8 * u);
  ctx.stroke();

  // Warm oak floorboards with subtle grain & plank seams
  const floor = ctx.createLinearGradient(0, floorY, 0, h);
  floor.addColorStop(0, '#4a2e19');
  floor.addColorStop(0.55, '#331e0f');
  floor.addColorStop(1, '#180d06');
  ctx.fillStyle = floor;
  ctx.fillRect(0, floorY, w, h - floorY);

  ctx.strokeStyle = 'rgba(20, 10, 4, 0.45)';
  ctx.lineWidth = 1.6 * u;
  for (let p = 1; p <= 4; p++) {
    const py = floorY + ((h - floorY) * p) / 4.5;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }

  // Soft afternoon window sunbeam diagonal from upper-right
  drawTyndallGodRays(ctx, w * 0.88, -20, 5, 2.32, 0.38, h * 1.15, '254, 240, 138', 0.17);

  // Full-bleed lower-right corner of Xiaohei extending naturally off top-left viewport edge (never a chopped squat box!)
  const wheelCx = w * 0.38;
  const wheelR = 98 * u;
  const wheelCy = floorY + 12 * u - wheelR;
  const shellRightX = wheelCx + 155 * u;
  const shellBotY = wheelCy - wheelR * 0.72;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
  ctx.beginPath();
  ctx.ellipse(wheelCx - 40 * u, floorY + 16 * u, 210 * u, 16 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  const shellGrad = ctx.createLinearGradient(0, 0, shellRightX, shellBotY);
  shellGrad.addColorStop(0, '#2c2930');
  shellGrad.addColorStop(0.6, '#18161c');
  shellGrad.addColorStop(1, '#0d0c10');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.32)';
  ctx.lineWidth = 2.2 * u;
  roundRectPath(ctx, -120, -120, shellRightX + 120, shellBotY + 120, 34 * u);
  ctx.fill();
  ctx.stroke();

  // Vertical RIMOWA ribs & riveted brushed-aluminum corner cap
  for (let gx = 48 * u; gx < shellRightX - 68 * u; gx += 62 * u) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.lineWidth = 4 * u;
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, shellBotY - 18 * u);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.14)';
    ctx.lineWidth = 1.5 * u;
    ctx.beginPath();
    ctx.moveTo(gx + 3 * u, 0);
    ctx.lineTo(gx + 3 * u, shellBotY - 18 * u);
    ctx.stroke();
  }

  const capW = 92 * u;
  const capH = 82 * u;
  const capX = shellRightX - capW;
  const capY = shellBotY - capH;
  ctx.fillStyle = '#44403c';
  ctx.strokeStyle = '#d6d3d1';
  ctx.lineWidth = 1.8 * u;
  roundRectPath(ctx, capX, capY, capW, capH, 24 * u);
  ctx.fill();
  ctx.stroke();

  for (const [rx, ry] of [
    [22, 22],
    [54, 20],
    [72, 40],
    [22, 58],
    [58, 60],
  ]) {
    ctx.fillStyle = '#e7e5e4';
    ctx.beginPath();
    ctx.arc(capX + rx * u, capY + ry * u, 3.2 * u, 0, Math.PI * 2);
    ctx.fill();
  }

  // Completely motionless weathered wheel locked at fixed angle `0.42`
  drawPrecisionRimowaWheel(ctx, {
    cx: wheelCx,
    cy: wheelCy,
    radius: wheelR,
    angleRad: 0.42,
    accentHex: '#f59e0b',
    weathered: true,
  });

  // Helper to paint a botanical fan-shaped golden ginkgo leaf with stem & veins
  const drawGinkgoLeaf = (lx: number, ly: number, rot: number, scLeaf: number) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(rot);
    ctx.scale(scLeaf, scLeaf);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(4 * u, 10 * u, 32 * u, 10 * u, 0, 0, Math.PI * 2);
    ctx.fill();

    const lg = ctx.createLinearGradient(-28 * u, -26 * u, 34 * u, 18 * u);
    lg.addColorStop(0, '#fef08a');
    lg.addColorStop(0.58, '#f59e0b');
    lg.addColorStop(1, '#b45309');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(-26 * u, 10 * u);
    ctx.quadraticCurveTo(-8 * u, -30 * u, 28 * u, -20 * u);
    ctx.quadraticCurveTo(18 * u, -3 * u, 32 * u, 10 * u);
    ctx.quadraticCurveTo(4 * u, 22 * u, -26 * u, 10 * u);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(146, 64, 14, 0.45)';
    ctx.lineWidth = 1.1 * u;
    for (const va of [-0.32, -0.1, 0.12]) {
      ctx.beginPath();
      ctx.moveTo(-22 * u, 8 * u);
      ctx.lineTo(Math.cos(va) * 24 * u, Math.sin(va) * 22 * u - 4 * u);
      ctx.stroke();
    }

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.2 * u;
    ctx.beginPath();
    ctx.moveTo(-26 * u, 10 * u);
    ctx.lineTo(-42 * u, 17 * u);
    ctx.stroke();
    ctx.restore();
  };

  // Already-fallen autumn ginkgo leaf resting quietly in sunbeam on right
  drawGinkgoLeaf(w * 0.72, floorY + 34 * u, 0.24, 0.92);

  // Primary golden ginkgo leaf drifting down and coming to rest against the stationary wheel
  const settle = Math.min(1, lineProgress * 1.4);
  const leafX = wheelCx + wheelR * 1.06 + (1 - settle) * 72 * u + Math.sin(settle * Math.PI * 2) * (1 - settle) * 18 * u;
  const leafY = floorY + 12 * u - (1 - settle) * 125 * u;
  const leafRot = -0.28 + (1 - settle) * 0.75;
  drawGinkgoLeaf(leafX, leafY, leafRot, 1.12);
}

function renderS48EntrywayPlaceByDoor(sc: ShotContext): void {
  const { ctx, w, h } = sc;
  const floorY = h * 0.78;

  // Sunlit Walnut Home Entryway Medium Shot ("我要把你放在 家里的门口边")
  const wall = ctx.createLinearGradient(0, 0, w, floorY);
  wall.addColorStop(0, '#1f1814');
  wall.addColorStop(0.7, '#382a20');
  wall.addColorStop(1, '#261c15');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, floorY);

  // Warm wooden front door & brass handle on right (`w * 0.64 .. 0.88`)
  const doorX = w * 0.64;
  const doorW = w * 0.22;
  ctx.fillStyle = '#3b2314';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 4;
  ctx.fillRect(doorX, h * 0.08, doorW, floorY - h * 0.08);
  ctx.strokeRect(doorX, h * 0.08, doorW, floorY - h * 0.08);

  // Frosted sunlit transom window panel casting warm afternoon shaft
  ctx.fillStyle = 'rgba(254, 243, 199, 0.75)';
  roundRectPath(ctx, doorX + 26, h * 0.14, doorW - 52, h * 0.22, 6);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(doorX + 28, h * 0.48, 7, 0, Math.PI * 2);
  ctx.fill();

  drawTyndallGodRays(ctx, doorX + doorW * 0.5, h * 0.24, 5, 2.35, 0.42, h * 0.9, '254, 240, 138', 0.18);

  // Walnut floor + woven natural jute entryway rug
  ctx.fillStyle = '#24160e';
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = '#a16207';
  ctx.globalAlpha = 0.42;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, floorY + 18, 220, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Retired Xiaohei resting peacefully with handle fully retracted right beside the front door!
  drawRimowaCabin(sc, {
    cx: w * 0.48,
    bottomY: floorY + 10,
    scale: 1.08,
    tilt: 0,
    handleRatio: 0.0,
    warmHandleGlow: false,
    showScuffs: true,
    wheelAngleOverride: 0,
  });
}

function renderS49SunbeamPlantCompanionship(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const floorY = h * 0.84;

  // Close-Up of Xiaohei Repurposed as a Warm Entryway Side Table with Brass Key Tray & Potted Olive Plant ("换另一种 方式相守")
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#291d16');
  bg.addColorStop(0.6, '#443022');
  bg.addColorStop(1, '#1c130d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawTyndallGodRays(ctx, w * 0.2, 0, 5, 0.95, 0.36, h * 1.1, '254, 243, 199', 0.16);

  ctx.fillStyle = '#1d120b';
  ctx.fillRect(0, floorY, w, h - floorY);

  // Terracotta pot + swaying green olive leaves standing warmly beside Xiaohei
  const potX = w * 0.66;
  ctx.fillStyle = '#9a3412';
  ctx.beginPath();
  ctx.moveTo(potX - 48, floorY - 96);
  ctx.lineTo(potX + 48, floorY - 96);
  ctx.lineTo(potX + 36, floorY);
  ctx.lineTo(potX - 36, floorY);
  ctx.closePath();
  ctx.fill();

  const sway = Math.sin(timeSec * 1.8) * 5;
  ctx.strokeStyle = '#3f6212';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(potX, floorY - 96);
  ctx.quadraticCurveTo(potX + sway, floorY - 190, potX + 18 + sway, floorY - 260);
  ctx.stroke();

  ctx.fillStyle = '#65a30d';
  for (let lf = 0; lf < 7; lf++) {
    const ly = floorY - 130 - lf * 20;
    const lx = potX + (lf % 2 === 0 ? -18 : 22) + sway * (lf / 7);
    ctx.beginPath();
    ctx.ellipse(lx, ly, 18, 7, lf % 2 === 0 ? -0.4 : 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Xiaohei with brushed-brass key tray & house keys resting on its top shell!
  const anchors = drawRimowaCabin(sc, {
    cx: w * 0.43,
    bottomY: floorY + 4,
    scale: 1.32,
    tilt: 0,
    handleRatio: 0.0,
    showScuffs: true,
    wheelAngleOverride: 0,
  });

  ctx.fillStyle = '#d97706';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.6;
  roundRectPath(ctx, anchors.topCenterX - 52, anchors.topCenterY - 11, 104, 11, 4);
  ctx.fill();
  ctx.stroke();
}

function renderS50GoldenKeepsakeTrunk(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  // Angled Afternoon Sunbeam Keepsake Trunk Close-Up ("装满这旧梦")
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 50, w * 0.5, h * 0.5, w * 0.72);
  bg.addColorStop(0, '#3e2718');
  bg.addColorStop(1, '#120b07');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Open RIMOWA keepsake chest filled with tied letters, concert tickets, 35mm film canisters & dried flowers
  const boxW = Math.min(w * 0.68, 740);
  const boxH = Math.min(h * 0.56, 410);
  const bx = (w - boxW) * 0.5;
  const by = (h - boxH) * 0.52;

  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 5;
  roundRectPath(ctx, bx, by, boxW, boxH, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#242026';
  roundRectPath(ctx, bx + 18, by + 18, boxW - 36, boxH - 36, 18);
  ctx.fill();

  // Twine-bound stack of vintage letters
  ctx.save();
  ctx.translate(bx + boxW * 0.3, by + boxH * 0.46);
  ctx.rotate(-0.08);
  ctx.fillStyle = '#f5ebd6';
  roundRectPath(ctx, -105, -70, 210, 140, 6);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-105, 0);
  ctx.lineTo(105, 0);
  ctx.moveTo(0, -70);
  ctx.lineTo(0, 70);
  ctx.stroke();
  ctx.restore();

  // Old boarding stubs & concert tickets + 35mm film rolls on right
  for (let t = 0; t < 3; t++) {
    const spec = TRAVEL_STICKERS[t * 2];
    drawPriorityCard(
      ctx,
      bx + boxW * 0.68,
      by + boxH * (0.3 + t * 0.22),
      220,
      74,
      -0.06 + t * 0.08,
      spec.code,
      spec.label,
      spec.year,
      spec.bg,
      spec.fg
    );
  }

  // Rising golden dust motes in afternoon sunbeam
  drawCinemaBokeh(sc, 14, '#fde047', '#f59e0b', 0.95);
  void timeSec;
}

function renderS51CognacNametagFoil(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;
  const u = Math.max(0.65, Math.min(1.2, w / 1440));

  // Viewport-Responsive 100mm Macro of Saddle-Stitched Cognac Leather Luggage Tag + 24K Foil ("陪着我 姓名")
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, '#2c1c14');
  bg.addColorStop(1, '#0c0908');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Realistic folded cognac leather strap loop & brushed brass buckle descending from top handle lug!
  const cx = w * 0.5;
  const tagW = Math.min(w * 0.62, 540 * u);
  const tagH = Math.min(h * 0.42, 260 * u);
  const cy = h * 0.54;

  // Leather strap loop from top lug (`y = 0`) through brass buckle into tag grommet
  ctx.fillStyle = '#5c280e';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  roundRectPath(ctx, cx - 22 * u, -20, 44 * u, cy - tagH * 0.5 + 48 * u, 12 * u);
  ctx.fill();
  ctx.stroke();

  // Brushed brass buckle clasp
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  roundRectPath(ctx, cx - 30 * u, cy - tagH * 0.5 - 38 * u, 60 * u, 26 * u, 6 * u);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.03);

  // Deep shadow + full-grain Italian cognac saddle leather body
  ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
  roundRectPath(ctx, -tagW * 0.5 + 8 * u, -tagH * 0.5 + 12 * u, tagW, tagH, 22 * u);
  ctx.fill();

  const leather = ctx.createLinearGradient(-tagW * 0.5, -tagH * 0.5, tagW * 0.5, tagH * 0.5);
  leather.addColorStop(0, '#9a4416');
  leather.addColorStop(0.5, '#7c3210');
  leather.addColorStop(1, '#481b07');
  ctx.fillStyle = leather;
  roundRectPath(ctx, -tagW * 0.5, -tagH * 0.5, tagW, tagH, 22 * u);
  ctx.fill();

  // Cream wax-thread saddle stitching around perimeter
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2.2 * u;
  ctx.setLineDash([9 * u, 6 * u]);
  roundRectPath(ctx, -tagW * 0.5 + 14 * u, -tagH * 0.5 + 14 * u, tagW - 28 * u, tagH - 28 * u, 15 * u);
  ctx.stroke();
  ctx.setLineDash([]);

  // 24K Hot-Stamped Gold Foil Inscription (`* u` & `TO MY DEAR FRIEND · 20"`)
  const sheenX = (-0.6 + lineProgress * 1.2) * tagW;
  const foilGrad = ctx.createLinearGradient(sheenX - 90 * u, 0, sheenX + 90 * u, 0);
  foilGrad.addColorStop(0, '#d97706');
  foilGrad.addColorStop(0.5, '#fffbeb');
  foilGrad.addColorStop(1, '#f59e0b');

  ctx.fillStyle = foilGrad;
  ctx.textAlign = 'center';
  ctx.font = `900 ${Math.round(54 * u)}px "Outfit", sans-serif`;
  ctx.fillText('★  HAM · 小黑  ★', 0, -8 * u);
  ctx.font = `700 ${Math.round(16 * u)}px "JetBrains Mono", "Noto Sans SC", sans-serif`;
  ctx.fillStyle = 'rgba(254, 243, 199, 0.82)';
  ctx.fillText('COMPANION OF TIME · 伴我姓名', 0, 44 * u);

  ctx.restore();
}

function renderS52CradlingHandsOnShell(sc: ShotContext): void {
  const { ctx, w, h } = sc;

  // Warm Afternoon Sunlight Close-Up of Two Gentle Hands Resting on Xiaohei's Top Corners ("陪着我 走过的 光阴")
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#2a1b12');
  bg.addColorStop(0.5, '#4c301c');
  bg.addColorStop(1, '#170f0a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawTyndallGodRays(ctx, w * 0.5, -20, 6, Math.PI * 0.5, 0.65, h, '254, 240, 138', 0.18);

  // Upper half of Xiaohei centered warmly in frame
  const caseW = Math.min(w * 0.56, 560);
  const caseLeft = (w - caseW) * 0.5;
  const shellTop = h * 0.46;

  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2.4;
  roundRectPath(ctx, caseLeft, shellTop, caseW, h * 0.6, 28);
  ctx.fill();
  ctx.stroke();

  // Riveted aluminum corners
  for (const cxCap of [caseLeft, caseLeft + caseW - 76]) {
    ctx.fillStyle = '#52525b';
    roundRectPath(ctx, cxCap, shellTop, 76, 62, 22);
    ctx.fill();
  }

  // Two gentle chiaroscuro hands resting affectionately over left & right corners of Xiaohei!
  for (const side of [-1, 1] as const) {
    const hx = w * 0.5 + side * (caseW * 0.36);
    ctx.save();
    ctx.translate(hx, shellTop + 8);
    ctx.scale(side, 1);

    // Wool coat sleeve descending gently from upper corners
    ctx.fillStyle = '#1e2230';
    ctx.beginPath();
    ctx.moveTo(20, -180);
    ctx.lineTo(120, -180);
    ctx.lineTo(56, -12);
    ctx.lineTo(-10, -18);
    ctx.closePath();
    ctx.fill();

    // Warm sunlit hand cradling aluminum corner
    const hGrad = ctx.createLinearGradient(-40, -24, 48, 36);
    hGrad.addColorStop(0, '#f3cca9');
    hGrad.addColorStop(0.55, '#b87656');
    hGrad.addColorStop(1, '#5c3322');
    ctx.fillStyle = hGrad;
    roundRectPath(ctx, -38, -20, 88, 52, 22);
    ctx.fill();
    ctx.restore();
  }
}

function renderS53PolaroidTwineWallCrescendo(sc: ShotContext): void {
  const { ctx, w, h, lineProgress, timeSec } = sc;
  const u = Math.max(0.68, Math.min(1.22, w / 1440));

  // 9.73s Emotional Crescendo: Hemp Twine & Wooden Clothespins Holding 6 Dated Travel Polaroids ("陪着旧日的风景")!
  const wall = ctx.createRadialGradient(w * 0.5, h * 0.45, 60, w * 0.5, h * 0.5, w * 0.75);
  wall.addColorStop(0, '#443022');
  wall.addColorStop(0.6, '#261a13');
  wall.addColorStop(1, '#110b08');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, h);

  const photos = [
    { year: '2018 · 初遇启程', sky: '#fb923c', sea: '#7c2d12', row: 0, col: 0 },
    { year: '2019 · 落日长桥', sky: '#facc15', sea: '#9a3412', row: 0, col: 1 },
    { year: '2021 · 暴雨候机', sky: '#0284c7', sea: '#0f172a', row: 0, col: 2 },
    { year: '2023 · 古树微光', sky: '#14b8a6', sea: '#064e3b', row: 1, col: 0 },
    { year: '2024 · 高崎海风', sky: '#38bdf8', sea: '#0d9488', row: 1, col: 1 },
    { year: '2026 · 家门相守', sky: '#fde047', sea: '#78350f', row: 1, col: 2 },
  ];

  // Two curved hemp twine strings across the sunlit plaster wall
  for (const rowY of [h * 0.22, h * 0.56]) {
    ctx.strokeStyle = '#d6b384';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(w * 0.08, rowY - 14);
    ctx.quadraticCurveTo(w * 0.5, rowY + 22, w * 0.92, rowY - 14);
    ctx.stroke();
  }

  const cardW = 196 * u;
  const cardH = 224 * u;

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const cx = w * (0.24 + p.col * 0.26);
    const pinY = (p.row === 0 ? h * 0.22 : h * 0.56) + (p.col === 1 ? 8 : -2);
    const sway = Math.sin(timeSec * 1.6 + i * 1.1) * 0.025;

    ctx.save();
    ctx.translate(cx, pinY);
    ctx.rotate((i % 2 === 0 ? -0.04 : 0.045) + sway);

    // Polaroid shadow & classic white instant-film frame
    ctx.fillStyle = 'rgba(0, 0, 0, 0.46)';
    roundRectPath(ctx, -cardW * 0.5 + 5, 6, cardW, cardH, 4);
    ctx.fill();

    ctx.fillStyle = '#faf7f0';
    roundRectPath(ctx, -cardW * 0.5, 0, cardW, cardH, 3);
    ctx.fill();

    // Miniature painted landscape + tiny silhouette of Xiaohei inside each Polaroid!
    const imgW = cardW - 24 * u;
    const imgH = cardH - 64 * u;
    const imgGrad = ctx.createLinearGradient(0, 12 * u, 0, 12 * u + imgH);
    imgGrad.addColorStop(0, p.sky);
    imgGrad.addColorStop(1, p.sea);
    ctx.fillStyle = imgGrad;
    ctx.fillRect(-imgW * 0.5, 12 * u, imgW, imgH);

    // Tiny iconic Xiaohei silhouette inside every memory photo
    ctx.fillStyle = '#09090b';
    roundRectPath(ctx, -12 * u, 12 * u + imgH - 36 * u, 24 * u, 30 * u, 3);
    ctx.fill();

    // Handwritten Polaroid caption on bottom white margin
    ctx.fillStyle = '#292524';
    ctx.font = `700 ${Math.round(13 * u)}px "Noto Sans SC", "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(p.year, 0, cardH - 20 * u);

    // Wooden mini-clothespin clipping Polaroid to twine
    ctx.fillStyle = '#d97706';
    roundRectPath(ctx, -5 * u, -14 * u, 10 * u, 26 * u, 2);
    ctx.fill();
    ctx.restore();
  }

  // Final 1.5s drum-roll crescendo golden bloom leading directly into Finale S54!
  if (lineProgress > 0.82) {
    const bloom = (lineProgress - 0.82) / 0.18;
    ctx.fillStyle = `rgba(254, 249, 195, ${(bloom * 0.68).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
}

// ============================================================================
// 10. FINALE & UYUNI MIRROR OUTRO (S54 – S66)
// ============================================================================

function renderS54FinaleSolarZenithBurst(sc: ShotContext): void {
  const { ctx, w, h, beat } = sc;
  const deckY = h * 0.8;

  // Blinding Zenith Molten-Gold Solar Burst ("嘿呀 还是你呀")
  const sky = ctx.createRadialGradient(w * 0.5, h * 0.22, 24, w * 0.5, h * 0.45, w * 0.8);
  sky.addColorStop(0, '#ffffff');
  sky.addColorStop(0.25, '#fef08a');
  sky.addColorStop(0.62, '#ea580c');
  sky.addColorStop(1, '#1c0a06');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, deckY);

  drawTyndallGodRays(ctx, w * 0.5, h * 0.22, 11, Math.PI * 0.5, 1.5, h, '255, 251, 235', 0.28);
  renderMidgroundDiegeticLyrics(sc, 's54_finale_solar_zenith_burst');

  ctx.fillStyle = '#0c0706';
  ctx.fillRect(0, deckY, w, h - deckY);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.52,
    groundY: deckY + 10,
    travelerHeightPx: h * 0.54,
    walkPhase: 0,
    pose: 'hero_beside',
    rimColor: '#ffffff',
    warmHandleGlow: true,
  });

  drawAnamorphicFlare(ctx, w * 0.5, h * 0.22, w * 0.95, 42, '#fde047', 0.72 + beat.kickPulse * 0.28);
}

function renderS55MemoryEraTriptych(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const x1 = w * 0.333;
  const x2 = w * 0.666;

  // Cross-Era 3-Panel Memory Triptych: [2018 Sunset Departure] | [2021 Rainy Storm] | [2026 Golden Coast]
  const eras = [
    { x0: 0, xw: x1, top: '#7c2d12', bot: '#fbbf24', tilt: 0.08 },
    { x0: x1, xw: x2 - x1, top: '#082f49', bot: '#38bdf8', tilt: 0 },
    { x0: x2, xw: w - x2, top: '#b45309', bot: '#fef08a', tilt: -0.06 },
  ];

  for (const e of eras) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(e.x0, 0, e.xw, h);
    ctx.clip();

    const g = ctx.createLinearGradient(0, 0, 0, h * 0.78);
    g.addColorStop(0, e.top);
    g.addColorStop(1, e.bot);
    ctx.fillStyle = g;
    ctx.fillRect(e.x0, 0, e.xw, h);
    ctx.fillStyle = '#0b0a0e';
    ctx.fillRect(e.x0, h * 0.78, e.xw, h * 0.22);

    drawRimowaCabin(sc, {
      cx: e.x0 + e.xw * 0.5,
      bottomY: h * 0.8,
      scale: 1.12,
      tilt: e.tilt,
      handleRatio: 0.45,
      warmHandleGlow: true,
    });
    ctx.restore();
  }

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(x1, 0);
  ctx.lineTo(x1, h);
  ctx.moveTo(x2, 0);
  ctx.lineTo(x2, h);
  ctx.stroke();
  void timeSec;
}

function renderS56AirborneStickersCelebration(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  // Celebratory Golden Vortex of All 8 `TRAVEL_STICKERS` Swirling in 3D Orbit Around Xiaohei!
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.72);
  bg.addColorStop(0, '#451a03');
  bg.addColorStop(0.55, '#1c0c08');
  bg.addColorStop(1, '#09070a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawRimowaCabin(sc, {
    cx: w * 0.5,
    bottomY: h * 0.82,
    scale: 1.28,
    tilt: 0,
    handleRatio: 0.48,
    warmHandleGlow: true,
    stickerCount: 8,
  });

  // 8 Orbiting Priority Cards & Airport Stickers in celebratory golden spiral
  for (let i = 0; i < TRAVEL_STICKERS.length; i++) {
    const spec = TRAVEL_STICKERS[i];
    const ang = timeSec * 1.9 + (i / TRAVEL_STICKERS.length) * Math.PI * 2;
    const rx = w * 0.34;
    const ry = h * 0.24;
    const sx = w * 0.5 + Math.cos(ang) * rx;
    const sy = h * 0.48 + Math.sin(ang) * ry;
    const depthScale = 0.78 + (Math.sin(ang) + 1) * 0.24 + beat.kickPulse * 0.05;

    drawPriorityCard(
      ctx,
      sx,
      sy,
      200 * depthScale,
      72 * depthScale,
      Math.cos(ang) * 0.22,
      spec.code,
      spec.label,
      spec.year,
      spec.bg,
      spec.fg
    );
  }
}

function renderS57GoldenPromenadeOts(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const u = Math.max(0.72, Math.min(1.25, w / 1440));
  const horizonY = h * 0.5;
  const deckY = h * 0.79;

  // Carved Seaside Stone Balustrade Golden Promenade Medium-Wide ("尔似 在我肩" — Distinct Coastal Architecture vs S19!)
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#3b1306');
  sky.addColorStop(0.52, '#d97706');
  sky.addColorStop(1, '#fef08a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Glittering molten-gold sea & sun-path on the left third
  const sea = ctx.createLinearGradient(0, horizonY, 0, deckY);
  sea.addColorStop(0, '#fde047');
  sea.addColorStop(0.42, '#d97706');
  sea.addColorStop(1, '#451a03');
  ctx.fillStyle = sea;
  ctx.fillRect(0, horizonY, w, deckY - horizonY);

  // Shimmering sun-path ripples across golden ocean
  const sunX = w * 0.28;
  ctx.fillStyle = 'rgba(255, 251, 235, 0.65)';
  for (let r = 0; r < 14; r++) {
    const ry = horizonY + 8 * u + r * 13 * u;
    const rw = (28 + r * 14 + Math.sin(timeSec * 3.2 + r) * 10) * u;
    ctx.fillRect(sunX - rw * 0.5, ry, rw, 3 * u);
  }

  // Soaring coastal seabirds silhouetted in golden sky
  ctx.strokeStyle = 'rgba(69, 26, 3, 0.72)';
  ctx.lineWidth = 2 * u;
  for (let b = 0; b < 4; b++) {
    const bx = w * (0.16 + b * 0.09) + Math.sin(timeSec * 1.4 + b) * 14 * u;
    const by = h * (0.18 + (b % 2) * 0.06) + Math.cos(timeSec * 2.1 + b) * 6 * u;
    const flap = Math.sin(timeSec * 5.5 + b * 1.3) * 5 * u;
    ctx.beginPath();
    ctx.moveTo(bx - 12 * u, by + flap);
    ctx.quadraticCurveTo(bx - 5 * u, by - 5 * u, bx, by);
    ctx.quadraticCurveTo(bx + 5 * u, by - 5 * u, bx + 12 * u, by + flap);
    ctx.stroke();
  }

  renderMidgroundDiegeticLyrics(sc, 's57_golden_promenade_ots');

  // Classical carved sandstone seaside balustrade & vintage amber globe promenade lamps
  const railTopY = deckY - 68 * u;
  ctx.fillStyle = '#291509';
  ctx.fillRect(0, deckY, w, h - deckY);
  ctx.fillStyle = '#43200d';
  ctx.fillRect(0, railTopY, w, 12 * u);
  ctx.fillRect(0, deckY - 12 * u, w, 12 * u);

  const postSpacing = 54 * u;
  for (let px = -((sc.scrollDist * 0.55) % postSpacing); px < w + postSpacing; px += postSpacing) {
    ctx.fillStyle = '#36190a';
    roundRectPath(ctx, px - 6 * u, railTopY + 12 * u, 12 * u, 44 * u, 5 * u);
    ctx.fill();
  }

  for (const lx of [w * 0.14, w * 0.84]) {
    ctx.fillStyle = '#1c1008';
    ctx.fillRect(lx - 4 * u, h * 0.24, 8 * u, railTopY - h * 0.24);
    const lGlow = ctx.createRadialGradient(lx, h * 0.23, 4 * u, lx, h * 0.23, 52 * u);
    lGlow.addColorStop(0, '#fffbeb');
    lGlow.addColorStop(0.35, 'rgba(253, 224, 71, 0.55)');
    lGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = lGlow;
    ctx.beginPath();
    ctx.arc(lx, h * 0.23, 52 * u, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mirrored Sculpted 85mm OTS Companion: Xiaohei on LEFT (`0.36w`), Anatomically Sculpted 3/4 Rear Traveler on RIGHT (`0.62w`)!
  drawOverTheShoulderCompanion(sc, {
    goldenPromenade: true,
    mirrorHorizontal: true,
  });
}

function renderS58SparklingRunwayWheels(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const u = Math.max(0.72, Math.min(1.25, w / 1440));
  const vx = w * 0.5;
  const horizonY = h * 0.48;

  // 1-Point Perspective Blazing Sunset Highway Centerline Rear Twin-Axle Track ("哪怕 生活 添上重量")
  const sky = ctx.createRadialGradient(vx, horizonY, 18 * u, vx, horizonY, w * 0.72);
  sky.addColorStop(0, '#ffffff');
  sky.addColorStop(0.22, '#fef08a');
  sky.addColorStop(0.58, '#ea580c');
  sky.addColorStop(1, '#1c0a06');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  drawTyndallGodRays(ctx, vx, horizonY, 9, -Math.PI * 0.5, 1.35, h * 0.55, '254, 240, 138', 0.22);

  // Distant atmospheric sunset mountain ridges flanking the blazing horizon sun
  ctx.fillStyle = 'rgba(69, 26, 3, 0.52)';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w * 0.14, horizonY - 46 * u);
  ctx.lineTo(w * 0.28, horizonY - 22 * u);
  ctx.lineTo(w * 0.41, horizonY - 8 * u);
  ctx.lineTo(w * 0.59, horizonY - 10 * u);
  ctx.lineTo(w * 0.74, horizonY - 38 * u);
  ctx.lineTo(w * 0.88, horizonY - 54 * u);
  ctx.lineTo(w, horizonY - 24 * u);
  ctx.lineTo(w, horizonY);
  ctx.closePath();
  ctx.fill();

  // Receding perspective asphalt highway deck converging to blazing sun at `(vx, horizonY)`
  const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  roadGrad.addColorStop(0, '#291811');
  roadGrad.addColorStop(0.35, '#161113');
  roadGrad.addColorStop(1, '#09080b');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Highway shoulder edge lines in perspective
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 2.6 * u;
  ctx.beginPath();
  ctx.moveTo(vx - 36 * u, horizonY);
  ctx.lineTo(w * 0.04, h);
  ctx.moveTo(vx + 36 * u, horizonY);
  ctx.lineTo(w * 0.96, h);
  ctx.stroke();

  // Perspective double-yellow highway centerline straddled symmetrically by Xiaohei!
  for (const sign of [-1, 1]) {
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(vx + sign * 3 * u, horizonY);
    ctx.lineTo(vx + sign * 6 * u, horizonY);
    ctx.lineTo(vx + sign * 26 * u, h);
    ctx.lineTo(vx + sign * 14 * u, h);
    ctx.closePath();
    ctx.fill();
  }

  // Streaming golden light-trail ribbons rushing past both sides in 1-point perspective
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let tr = 0; tr < 12; tr++) {
    const side = tr % 2 === 0 ? -1 : 1;
    const laneSpread = 0.22 + (tr % 6) * 0.12;
    const prog = ((timeSec * 1.45 + tr * 0.17) % 1);
    const p0 = prog * prog;
    const p1 = Math.min(1, (prog + 0.22) * (prog + 0.22));
    const x0 = vx + side * w * laneSpread * p0;
    const y0 = horizonY + (h - horizonY) * p0;
    const x1 = vx + side * w * laneSpread * p1;
    const y1 = horizonY + (h - horizonY) * p1;

    const lGrad = ctx.createLinearGradient(x0, y0, x1, y1);
    lGrad.addColorStop(0, 'rgba(250, 204, 21, 0)');
    lGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.55)');
    lGrad.addColorStop(1, 'rgba(255, 251, 235, 0.9)');
    ctx.strokeStyle = lGrad;
    ctx.lineWidth = (1.5 + p1 * 4.5) * u;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  ctx.restore();

  // Symmetrical Low-Angle Rear Hero View of 20" Xiaohei Rolling Straight Toward the Horizon Sun!
  const groundY = h * 0.86;
  const caseW = 290 * u;
  const caseH = 320 * u;
  const wheelR = 42 * u;
  const shellBotY = groundY - wheelR * 1.55 + beat.kickPulse * 2.5 * u;
  const shellTopY = shellBotY - caseH;

  // Long forward sunset shadow cast toward camera
  const shGrad = ctx.createLinearGradient(vx, groundY - 8 * u, vx, h);
  shGrad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  shGrad.addColorStop(1, 'rgba(0, 0, 0, 0.18)');
  ctx.fillStyle = shGrad;
  ctx.beginPath();
  ctx.moveTo(vx - caseW * 0.46, groundY - 4 * u);
  ctx.lineTo(vx + caseW * 0.46, groundY - 4 * u);
  ctx.lineTo(vx + caseW * 0.78, h);
  ctx.lineTo(vx - caseW * 0.78, h);
  ctx.closePath();
  ctx.fill();

  // Left & Right Rear Twin-Caster Assemblies straddling the double-yellow line
  for (const sign of [-1, 1]) {
    const wCx = vx + sign * (caseW * 0.36);
    drawPrecisionRimowaWheel(ctx, {
      cx: wCx,
      cy: groundY - wheelR,
      radius: wheelR,
      angleRad: sc.wheelAngle,
      accentHex: '#fde047',
      twinDepthOffset: { dx: sign * 10 * u, dy: -4 * u },
    });
  }

  // Extended brushed-titanium telescopic handle silhouetted against the horizon sun
  const rodSpan = 64 * u;
  const gripY = shellTopY - 92 * u;
  for (const sign of [-1, 1]) {
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(vx + sign * rodSpan - 5 * u, gripY, 10 * u, shellTopY - gripY + 8 * u);
  }
  ctx.fillStyle = '#18181f';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.2 * u;
  roundRectPath(ctx, vx - rodSpan - 16 * u, gripY - 10 * u, rodSpan * 2 + 32 * u, 20 * u, 9 * u);
  ctx.fill();
  ctx.stroke();

  // Symmetrical grooved anodized rear shell of Xiaohei rim-lit by blazing gold sunlight
  const bodyGrad = ctx.createLinearGradient(vx - caseW * 0.5, shellTopY, vx + caseW * 0.5, shellBotY);
  bodyGrad.addColorStop(0, '#27242d');
  bodyGrad.addColorStop(0.5, '#14131a');
  bodyGrad.addColorStop(1, '#27242d');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.6 * u;
  roundRectPath(ctx, vx - caseW * 0.5, shellTopY, caseW, caseH, 24 * u);
  ctx.fill();
  ctx.stroke();

  for (let g = 1; g <= 6; g++) {
    const gx = vx - caseW * 0.5 + (caseW * g) / 7;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(gx, shellTopY + 18 * u);
    ctx.lineTo(gx, shellBotY - 18 * u);
    ctx.stroke();
  }

  // 4 Riveted corner caps + rear priority sticker badge
  for (const [cxCap, cyCap] of [
    [vx - caseW * 0.5, shellTopY],
    [vx + caseW * 0.5 - 58 * u, shellTopY],
    [vx - caseW * 0.5, shellBotY - 52 * u],
    [vx + caseW * 0.5 - 58 * u, shellBotY - 52 * u],
  ]) {
    ctx.fillStyle = '#52525b';
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 1.3 * u;
    roundRectPath(ctx, cxCap, cyCap, 58 * u, 52 * u, 16 * u);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e4e4e7';
    for (const [rx, ry] of [
      [16, 16],
      [42, 16],
      [16, 36],
    ]) {
      ctx.beginPath();
      ctx.arc(cxCap + rx * u, cyCap + ry * u, 2.2 * u, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPriorityCard(
    ctx,
    vx + 36 * u,
    shellTopY + caseH * 0.44,
    136 * u,
    46 * u,
    0.06,
    TRAVEL_STICKERS[2].code,
    TRAVEL_STICKERS[2].label,
    TRAVEL_STICKERS[2].year,
    TRAVEL_STICKERS[2].bg,
    TRAVEL_STICKERS[2].fg
  );

  drawAnamorphicFlare(ctx, vx, horizonY, w * 0.85, 28 * u, '#fde047', 0.55 + beat.kickPulse * 0.25);
}

function renderS59HorizonLightgateBreakthrough(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;
  const horizonY = h * 0.54;

  // Cresting Bridge Apex POV Parting Golden Sunset Clouds to Reveal Boundless Golden Sea ("哪怕那前路 跌撞迷茫")
  const sky = ctx.createRadialGradient(w * 0.5, horizonY, 20, w * 0.5, horizonY, w * 0.72);
  sky.addColorStop(0, '#ffffff');
  sky.addColorStop(0.28, '#fef08a');
  sky.addColorStop(0.68, '#ea580c');
  sky.addColorStop(1, '#3b0764');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  const sea = ctx.createLinearGradient(0, horizonY, 0, h);
  sea.addColorStop(0, '#fde047');
  sea.addColorStop(0.45, '#b45309');
  sea.addColorStop(1, '#18181b');
  ctx.fillStyle = sea;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Highway crest deck converging cleanly to horizon light-gate
  ctx.fillStyle = '#121016';
  ctx.beginPath();
  ctx.moveTo(w * 0.42, horizonY);
  ctx.lineTo(w * 0.58, horizonY);
  ctx.lineTo(w * 0.94, h);
  ctx.lineTo(w * 0.06, h);
  ctx.closePath();
  ctx.fill();

  // Golden clouds parting left & right
  const open = lineProgress * w * 0.24;
  ctx.fillStyle = 'rgba(251, 146, 60, 0.36)';
  ctx.beginPath();
  ctx.arc(w * 0.26 - open, horizonY - 40, 180, 0, Math.PI * 2);
  ctx.arc(w * 0.74 + open, horizonY - 40, 180, 0, Math.PI * 2);
  ctx.fill();

  drawFirstPersonPovHandOnHandle(sc, w * 0.5, h * 0.82);
}

function renderS60SkyLanternEmberCrest(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const crestY = h * 0.78;

  // Cliff Crest Hero Silhouette with Dozens of Rising Golden Sky-Lantern Embers ("嘿呀 还是你呀")
  const sky = ctx.createLinearGradient(0, 0, 0, crestY);
  sky.addColorStop(0, '#1e1028');
  sky.addColorStop(0.5, '#7c2d12');
  sky.addColorStop(1, '#facc15');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, crestY);

  // Rising warm sky-lantern embers across entire twilight sky
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let e = 0; e < 42; e++) {
    const prog = (hash01(e * 9.7) + timeSec * (0.12 + (e % 4) * 0.04)) % 1;
    const ex = hash01(e * 17.3) * w + Math.sin(timeSec * 1.5 + e) * 20;
    const ey = crestY - prog * crestY * 0.95;
    const r = 3 + (e % 4) * 2.5;
    const g = ctx.createRadialGradient(ex, ey, 0.5, ex, ey, r * 2.8);
    g.addColorStop(0, '#fffbeb');
    g.addColorStop(0.45, 'rgba(251, 191, 36, 0.75)');
    g.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ex, ey, r * 2.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  renderMidgroundDiegeticLyrics(sc, 's60_sky_lantern_ember_crest');

  ctx.fillStyle = '#09070b';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, crestY + 24);
  ctx.quadraticCurveTo(w * 0.5, crestY - 16, w, crestY + 24);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.52,
    groundY: crestY + 4,
    travelerHeightPx: h * 0.5,
    walkPhase: 0,
    pose: 'hero_beside',
    rimColor: '#fef08a',
    warmHandleGlow: true,
  });
}

function renderS61GoldenCathedralBastion(sc: ShotContext): void {
  const { ctx, w, h } = sc;
  const floorY = h * 0.8;

  // Ultimate Molten-Sunset Open-Sky Golden Colonnade Bastion ("你最是 安稳堡垒啊")
  const sky = ctx.createLinearGradient(0, 0, 0, floorY);
  sky.addColorStop(0, '#2e1018');
  sky.addColorStop(0.5, '#b45309');
  sky.addColorStop(1, '#fef08a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, floorY);

  drawTyndallGodRays(ctx, w * 0.5, floorY - 40, 9, -Math.PI * 0.5, 1.2, h * 0.9, '254, 243, 199', 0.24);

  for (const pxFrac of [0.09, 0.23, 0.77, 0.91]) {
    ctx.fillStyle = '#180f0d';
    ctx.fillRect(w * pxFrac - 38, h * 0.06, 76, floorY - h * 0.06);
  }

  ctx.fillStyle = '#120b09';
  ctx.fillRect(0, floorY, w, h - floorY);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.53,
    groundY: floorY + 2,
    travelerHeightPx: h * 0.48,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#fef08a',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.42,
  });
}

function renderS62AerialCausewayDuo(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  // High Crane / Drone Bird's-Eye View of Narrow Stone Causeway Across Shimmering Golden Sea
  // Casting Two Long Parallel Sunset Shadows!
  const sea = ctx.createLinearGradient(0, 0, w, h);
  sea.addColorStop(0, '#78350f');
  sea.addColorStop(0.5, '#d97706');
  sea.addColorStop(1, '#451a03');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, w, h);

  // Shimmering ocean wave ripples from high crane perspective
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.26)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 36; i++) {
    const wx = hash01(i * 11.1) * w;
    const wy = hash01(i * 23.7) * h;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + 42, wy + Math.sin(timeSec * 2 + i) * 4);
    ctx.stroke();
  }

  // Diagonal stone causeway cutting across golden bay from bottom-left to upper-right
  ctx.save();
  ctx.translate(w * 0.5, h * 0.52);
  ctx.rotate(-0.34);

  ctx.fillStyle = '#1e1b18';
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.fillRect(-w, -58, w * 2, 116);
  ctx.strokeRect(-w, -58, w * 2, 116);

  // Two dramatic elongated parallel sunset shadows cast by Traveler & 20" Xiaohei!
  ctx.fillStyle = 'rgba(9, 7, 6, 0.72)';
  ctx.beginPath();
  ctx.ellipse(20, 62, 14, 78, -0.35, 0, Math.PI * 2);
  ctx.ellipse(-28, 52, 12, 56, -0.35, 0, Math.PI * 2);
  ctx.fill();

  // Top-down / high-angle Traveler & Xiaohei walking side-by-side along causeway
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.8;
  roundRectPath(ctx, -44, -18, 28, 36, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  renderMidgroundDiegeticLyrics(sc, 's62_aerial_causeway_duo');
}

function renderS63StickerMosaicShellPan(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;

  // Horizontal Panning 85mm Macro Across Xiaohei's Matte-Black Shell Covered in All 8 Travel Stickers & Medals!
  ctx.fillStyle = '#121218';
  ctx.fillRect(0, 0, w, h);

  const panX = (0.5 - lineProgress) * 140;
  ctx.save();
  ctx.translate(panX, 0);

  for (let g = 0; g < 12; g++) {
    const gx = (w * g) / 10;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
    ctx.fillRect(gx - 8, 0, 8, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(gx, 0, 3, h);
  }

  for (let i = 0; i < TRAVEL_STICKERS.length; i++) {
    const spec = TRAVEL_STICKERS[i];
    const col = i % 4;
    const row = Math.floor(i / 4);
    const sx = w * (0.18 + col * 0.22);
    const sy = h * (0.34 + row * 0.3);
    const rot = ((i % 3) - 1) * 0.14;
    drawPriorityCard(ctx, sx, sy, 255, 92, rot, spec.code, spec.label, spec.year, spec.bg, spec.fg);
  }
  ctx.restore();
}

function renderS64SunsetTagBacklitGlow(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  // Outdoor Molten-Crimson Sunset Backlit Silhouette of the Swinging Cognac Leather Tag ("嘿呀 还是你呀")
  const sky = ctx.createRadialGradient(w * 0.48, h * 0.48, 24, w * 0.5, h * 0.5, w * 0.72);
  sky.addColorStop(0, '#fffbeb');
  sky.addColorStop(0.24, '#fde047');
  sky.addColorStop(0.6, '#dc2626');
  sky.addColorStop(1, '#18080e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const swing = Math.sin(timeSec * 3.2) * 0.09;
  ctx.save();
  ctx.translate(w * 0.5, h * 0.14);
  ctx.rotate(swing);

  // Silhouetted leather strap & backlit translucent amber-rimmed cognac tag
  ctx.fillStyle = '#1c0c08';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  roundRectPath(ctx, -16, 0, 32, h * 0.24, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#240e08';
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 3.5;
  roundRectPath(ctx, -180, h * 0.22, 360, 210, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.font = '900 36px "Outfit", sans-serif';
  ctx.fillText('TO MY FRIEND', 0, h * 0.22 + 106);
  ctx.font = '700 18px "Noto Sans SC", sans-serif';
  ctx.fillText('二十寸小黑 · 伴行半生', 0, h * 0.22 + 148);
  ctx.restore();

  drawAnamorphicFlare(ctx, w * 0.5 - 165, h * 0.42, w * 0.75, 24, '#fef08a', 0.65);
}

function renderS65TwilightPierStillness(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const waterY = h * 0.62;
  const pierY = h * 0.78;

  // Quiet Twilight Wooden Pier End + First Evening Star ("尔似 在我肩" — acoustic guitar outro!)
  const sky = ctx.createLinearGradient(0, 0, 0, waterY);
  sky.addColorStop(0, '#0f0c24');
  sky.addColorStop(0.55, '#4c1d4b');
  sky.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, waterY);

  // Bright evening star (Venus) twinkling gently in upper violet sky
  const starX = w * 0.68;
  const starY = h * 0.18;
  const twinkle = 0.75 + 0.25 * Math.sin(timeSec * 2.4);
  ctx.fillStyle = '#fef9c3';
  ctx.globalAlpha = twinkle;
  ctx.beginPath();
  ctx.arc(starX, starY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef9c3';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(starX - 14, starY);
  ctx.lineTo(starX + 14, starY);
  ctx.moveTo(starX, starY - 14);
  ctx.lineTo(starX, starY + 14);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Calm violet-gold twilight lake/bay water
  const water = ctx.createLinearGradient(0, waterY, 0, h);
  water.addColorStop(0, '#7c2d12');
  water.addColorStop(0.5, '#2e1036');
  water.addColorStop(1, '#090710');
  ctx.fillStyle = water;
  ctx.fillRect(0, waterY, w, h - waterY);

  renderMidgroundDiegeticLyrics(sc, 's65_twilight_pier_stillness');

  // Timber pier extending from left to `w * 0.66`, ending peacefully over calm water
  const pierEnd = w * 0.66;
  ctx.fillStyle = '#181112';
  ctx.fillRect(0, pierY - 14, pierEnd, 18);
  for (let px = 60; px < pierEnd; px += 110) {
    ctx.fillRect(px, pierY + 4, 16, h - pierY);
  }

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: pierEnd - 64,
    groundY: pierY - 12,
    travelerHeightPx: h * 0.44,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#fde68a',
    warmHandleGlow: true,
  });
}

function renderS66UyuniMirrorOutro(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;
  const horizonY = h * 0.56;

  // Salar de Uyuni Sky-Mirror Sunset Horizon + Pure Rear-View Depth Walk ("To 我的好朋友")
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#140c1f');
  sky.addColorStop(0.45, '#6b1d2f');
  sky.addColorStop(0.82, '#ea580c');
  sky.addColorStop(1, '#fef08a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Perfect mirror salt-flat water reflection of the sunset sky
  const mirror = ctx.createLinearGradient(0, horizonY, 0, h);
  mirror.addColorStop(0, '#fef08a');
  mirror.addColorStop(0.22, '#ea580c');
  mirror.addColorStop(0.62, '#4c1624');
  mirror.addColorStop(1, '#0c0812');
  ctx.fillStyle = mirror;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Seamless glowing horizon line
  ctx.fillStyle = 'rgba(255, 251, 235, 0.72)';
  ctx.fillRect(0, horizonY - 1, w, 2);

  // Pure rear-view Traveler & Xiaohei walking deeper toward the sunset horizon with concentric ripples!
  drawRearWalkingHorizonDuo(sc, horizonY, lineProgress);
}
