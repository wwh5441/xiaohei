import { TRAVEL_STICKERS, type ShotType } from './mvData';
import { renderMidgroundDiegeticLyrics } from './diegeticLyrics';
import {
  drawCoupledTravelerAndRimowa,
  drawFirstPersonPovHandOnHandle,
  drawGatePillarLeanCompanion,
  drawRealisticHandOnRimowaHandle,
  drawRimowaCabin,
  drawSeatedAirportTravelerWithRimowa,
  drawTrueMacroWheelAndBoot,
} from './humanRimowaRig';
import {
  drawAnamorphicFlare,
  drawCinemaBokeh,
  drawOrganicMistForest,
  drawPriorityCard,
  drawTyndallGodRays,
  hash01,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * Renders Storyboard Shots S24 through S45 (Interlude 1, Verse 2, Chorus 2, Whistle Solo).
 * Every shot has a distinct camera focal length, lighting atmosphere, and narrative composition.
 */
export function renderShotGroupB(sc: ShotContext, shot: ShotType): boolean {
  switch (shot) {
    case 's24_vinyl_baggage_turntable':
      renderS24VinylBaggageTurntable(sc);
      return true;
    case 's25_terminal_sigh_bench':
      renderS25TerminalSighBench(sc);
      return true;
    case 's26_solari_fids_delayed_macro':
      renderS26SolariFidsDelayedMacro(sc);
      return true;
    case 's27_rain_chilled_hand_warmth':
      renderS27RainChilledHandWarmth(sc);
      return true;
    case 's28_tarmac_puddle_reflection_low':
      renderS28TarmacPuddleReflectionLow(sc);
      return true;
    case 's29_neon_rain_wet_tags':
      renderS29NeonRainWetTags(sc);
      return true;
    case 's30_tsa_lock_raindrop_glint':
      renderS30TsaLockRaindropGlint(sc);
      return true;
    case 's31_concourse_crowd_shutter':
      renderS31ConcourseCrowdShutter(sc);
      return true;
    case 's32_gate_pillar_lean_companion':
      renderS32GatePillarLeanCompanion(sc);
      return true;
    case 's33_hotel_night_unsent_letter':
      renderS33HotelNightUnsentLetter(sc);
      return true;
    case 's34_empty_corridor_solitude':
      renderS34EmptyCorridorSolitude(sc);
      return true;
    case 's35_ancient_hollow_rain_intake':
      renderS35AncientHollowRainIntake(sc);
      return true;
    case 's36_hollow_fireflies_ascend':
      renderS36HollowFirefliesAscend(sc);
      return true;
    case 's37_stormbreak_lightning_hero':
      renderS37StormbreakLightningHero(sc);
      return true;
    case 's38_storm_triptych_montage':
      renderS38StormTriptychMontage(sc);
      return true;
    case 's39_hydroplane_wheel_spray':
      renderS39HydroplaneWheelSpray(sc);
      return true;
    case 's40_dawn_bridge_side_profile':
      renderS40DawnBridgeSideProfile(sc);
      return true;
    case 's41_uphill_step_lift':
      renderS41UphillStepLift(sc);
      return true;
    case 's42_cloud_pierce_viaduct_pov':
      renderS42CloudPierceViaductPov(sc);
      return true;
    case 's43_sunrise_halo_silhouette':
      renderS43SunriseHaloSilhouette(sc);
      return true;
    case 's44_teal_gold_sanctuary_dome':
      renderS44TealGoldSanctuaryDome(sc);
      return true;
    case 's45_kamakura_whistle_coast':
      renderS45KamakuraWhistleCoast(sc);
      return true;
    default:
      return false;
  }
}

function drawRainGlassOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  timeSec: number,
  count = 42,
  alpha = 0.24
): void {
  ctx.save();
  ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < count; i++) {
    const rx = ((hash01(i * 13.7) * w + timeSec * 45) % (w + 120)) - 60;
    const ry = ((hash01(i * 29.1) * h + timeSec * (460 + (i % 5) * 70)) % (h + 140)) - 70;
    const len = 24 + (i % 4) * 14;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 8, ry + len);
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// 05. INTERLUDE 1 (S24)
// ============================================================================

function renderS24VinylBaggageTurntable(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const cx = w * 0.48;
  const cy = h * 0.52;
  const outerR = Math.min(w, h) * 0.41;

  // Brushed gunmetal audiophile plinth × airport baggage carousel overhead shot
  const plinth = ctx.createRadialGradient(cx, cy, outerR * 0.2, cx, cy, w * 0.72);
  plinth.addColorStop(0, '#111a27');
  plinth.addColorStop(1, '#060910');
  ctx.fillStyle = plinth;
  ctx.fillRect(0, 0, w, h);

  // Stroboscopic 96-BPM platter bezel dots
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(timeSec * 1.15);

  ctx.fillStyle = '#090b10';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Concentric airport baggage-slat × vinyl micro-grooves
  for (let r = outerR * 0.34; r < outerR * 0.94; r += 11) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Orbiting overhead 20" Xiaohei & priority cards riding the carousel platter!
  ctx.save();
  ctx.translate(outerR * 0.62, 0);
  ctx.rotate(Math.PI * 0.5);
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  roundRectPath(ctx, -44, -64, 88, 128, 14);
  ctx.fill();
  ctx.stroke();
  for (let g = -28; g <= 28; g += 14) {
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath();
    ctx.moveTo(g, -52);
    ctx.lineTo(g, 52);
    ctx.stroke();
  }
  ctx.restore();

  // Center warm 24K gold vinyl record label (clean, legible, zero messy rim sparks!)
  const labelR = outerR * 0.27 * (1 + beat.kickPulse * 0.04);
  const lblGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, labelR);
  lblGrad.addColorStop(0, '#fef08a');
  lblGrad.addColorStop(0.65, '#f59e0b');
  lblGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = lblGrad;
  ctx.beginPath();
  ctx.arc(0, 0, labelR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  ctx.textAlign = 'center';
  ctx.font = `900 ${Math.round(labelR * 0.2)}px "Noto Sans SC", "Outfit", sans-serif`;
  ctx.fillText('嘿！小黑', 0, -labelR * 0.28);
  ctx.font = `700 ${Math.round(labelR * 0.13)}px "JetBrains Mono", monospace`;
  ctx.fillText('96 BPM · FUNK', 0, labelR * 0.38);

  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // S-shaped chrome audiophile tonearm on right pulsing on snare
  const pivotX = w * 0.82;
  const pivotY = h * 0.22;
  const stylusX = cx + outerR * 0.56;
  const stylusY = cy + outerR * 0.26;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.bezierCurveTo(pivotX - 30, pivotY + 140, stylusX + 90, stylusY - 50, stylusX, stylusY);
  ctx.stroke();

  // Beat-synced acoustic cyan/gold ripple at stylus contact point
  ctx.strokeStyle = `rgba(34, 211, 238, ${(0.35 + beat.snarePulse * 0.55).toFixed(3)})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(stylusX, stylusY, 14 + beat.beatPhase * 42, 0, Math.PI * 2);
  ctx.stroke();
}

// ============================================================================
// 06. VERSE 2 — RAINY TERMINAL & TREE HOLLOW (S25 – S36)
// ============================================================================

function renderS25TerminalSighBench(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const floorY = h * 0.82;

  // Midnight rain-streaked floor-to-ceiling terminal glass wall (NO competing giant FIDS board!)
  const glass = ctx.createLinearGradient(0, 0, 0, floorY);
  glass.addColorStop(0, '#040914');
  glass.addColorStop(0.58, '#0b192c');
  glass.addColorStop(1, '#08111f');
  ctx.fillStyle = glass;
  ctx.fillRect(0, 0, w, floorY);

  // Blurred distant tarmac red/amber runway lights outside rain window
  drawCinemaBokeh(sc, 12, '#38bdf8', '#ef4444', 0.85);
  drawRainGlassOverlay(ctx, w, floorY, timeSec, 48, 0.28);

  // Structural curtain-wall mullions
  ctx.fillStyle = '#070b13';
  for (const mx of [w * 0.22, w * 0.56, w * 0.86]) {
    ctx.fillRect(mx - 6, 0, 12, floorY);
  }

  // Wet terrazzo concourse floor
  const floor = ctx.createLinearGradient(0, floorY, 0, h);
  floor.addColorStop(0, '#0d1524');
  floor.addColorStop(1, '#05080f');
  ctx.fillStyle = floor;
  ctx.fillRect(0, floorY, w, h - floorY);

  drawSeatedAirportTravelerWithRimowa(sc, w * 0.44, floorY, h * 0.58);

  // Warm paper coffee cup on side seat + delicate rising sigh/steam wisp ("你听过我 长叹息声")
  const cupX = w * 0.31;
  const cupY = floorY - h * 0.115;
  ctx.fillStyle = '#e2e8f0';
  roundRectPath(ctx, cupX - 8, cupY - 22, 16, 22, 3);
  ctx.fill();
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cupX - 8, cupY - 15, 16, 7);

  ctx.strokeStyle = 'rgba(226, 232, 240, 0.25)';
  ctx.lineWidth = 1.4;
  for (let s = 0; s < 2; s++) {
    const prog = (timeSec * 0.45 + s * 0.5) % 1;
    ctx.beginPath();
    ctx.moveTo(cupX + s * 3, cupY - 26 - prog * 28);
    ctx.quadraticCurveTo(cupX - 8, cupY - 40 - prog * 34, cupX + 4, cupY - 54 - prog * 40);
    ctx.stroke();
  }
}

function renderS26SolariFidsDelayedMacro(sc: ShotContext): void {
  const { ctx, w, h, timeSec, lineProgress } = sc;
  const u = Math.max(0.7, Math.min(1.25, w / 1440));

  // 135mm Full-Frame Front Macro of Matte-Black Italian Solari Mechanical Split-Flap FIDS Board!
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.7);
  bg.addColorStop(0, '#0c1628');
  bg.addColorStop(1, '#04070e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle distant lightning sheet flash reflected across glass bezel
  const lightning = lineProgress > 0.25 && lineProgress < 0.42 ? 0.16 : 0;
  if (lightning > 0) {
    ctx.fillStyle = `rgba(186, 230, 253, ${lightning})`;
    ctx.fillRect(0, 0, w, h);
  }

  const bw = Math.min(w * 0.82, 980 * u);
  const bh = Math.min(h * 0.64, 430 * u);
  const bx = (w - bw) * 0.5;
  const by = (h - bh) * 0.46;

  // Ceiling steel suspension struts
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bx + 70 * u, 0, 14 * u, by);
  ctx.fillRect(bx + bw - 84 * u, 0, 14 * u, by);

  // Solari cabinet chassis
  ctx.fillStyle = '#080c14';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.6;
  roundRectPath(ctx, bx, by, bw, bh, 16 * u);
  ctx.fill();
  ctx.stroke();

  // Header bar
  ctx.fillStyle = '#0f172a';
  roundRectPath(ctx, bx + 4, by + 4, bw - 8, 56 * u, 12 * u);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.font = `800 ${Math.round(18 * u)}px "Outfit", "Noto Sans SC", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('DEPARTURES · 国际/国内出发航班公告', bx + 28 * u, by + 39 * u);
  ctx.textAlign = 'right';
  ctx.font = `700 ${Math.round(16 * u)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('23:45', bx + bw - 28 * u, by + 38 * u);

  // Row 1: MU 2020 DELAYED
  const drawRow = (ry: number, flight: string, gate: string, status: string, statusBg: string) => {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.beginPath();
    ctx.moveTo(bx + 24 * u, ry + 48 * u);
    ctx.lineTo(bx + bw - 24 * u, ry + 48 * u);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = `700 ${Math.round(20 * u)}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(flight, bx + 34 * u, ry + 30 * u);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(gate, bx + 290 * u, ry + 30 * u);

    ctx.fillStyle = statusBg;
    roundRectPath(ctx, bx + bw - 210 * u, ry + 6 * u, 176 * u, 34 * u, 6 * u);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(15 * u)}px "Noto Sans SC", "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(status, bx + bw - 122 * u, ry + 29 * u);
  };

  drawRow(by + 74 * u, 'MU 2020   SHANGHAI', 'GATE B20', '暴雨延误 DELAYED', '#dc2626');
  // Middle Hero Split-Flap Row (`h * 0.52`) is rendered live by `renderSurfaceDiegeticLyrics` (`s26_solari_fids_delayed_macro`)!
  if (sc.subtitleMode === 'cinema') {
    // When in cinema subtitle mode, `s26` ALSO flips live mechanical tiles on the physical FIDS board!
    // (Handled unconditionally in `diegeticLyrics.ts` case `s26_solari_fids_delayed_macro`)
  }
  drawRow(by + bh - 118 * u, 'CA 1809   CHENGDU', 'GATE B22', '气象管制 WEATHER', '#b45309');
  drawRow(by + bh - 62 * u, 'CZ 3542   XIAMEN', 'GATE A08', '等待通知 HOLD', '#334155');

  drawRainGlassOverlay(ctx, w, h, timeSec, 22, 0.12);
}

function renderS27RainChilledHandWarmth(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  // Cold cyan-blue rain-glass bokeh contrasting with warm amber palm aura ("把拉杆 温度 全记得")
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#040b17');
  bg.addColorStop(0.55, '#082038');
  bg.addColorStop(1, '#090d16');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawCinemaBokeh(sc, 14, '#38bdf8', '#f59e0b', 1.15);
  drawRainGlassOverlay(ctx, w, h, timeSec, 34, 0.22);
  drawRealisticHandOnRimowaHandle(sc);
}

function renderS28TarmacPuddleReflectionLow(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const puddleY = h * 0.72;

  // Midnight wet terminal curb & red/cyan neon reflections ("半生 奔波的旅途中")
  const sky = ctx.createLinearGradient(0, 0, 0, puddleY);
  sky.addColorStop(0, '#040812');
  sky.addColorStop(0.65, '#0c192c');
  sky.addColorStop(1, '#13243b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, puddleY);

  drawCinemaBokeh(sc, 12, '#06b6d4', '#f43f5e', 1.1);
  drawRainGlassOverlay(ctx, w, puddleY, timeSec, 44, 0.25);

  // Mirror-wet tarmac surface reflecting neon ribbons
  const tarmac = ctx.createLinearGradient(0, puddleY, 0, h);
  tarmac.addColorStop(0, '#0c1829');
  tarmac.addColorStop(0.5, '#08101d');
  tarmac.addColorStop(1, '#04070d');
  ctx.fillStyle = tarmac;
  ctx.fillRect(0, puddleY, w, h - puddleY);

  // Rippling neon puddle reflections + expanding raindrop circles
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 6; i++) {
    const rx = w * (0.14 + i * 0.15);
    const col = i % 2 === 0 ? 'rgba(6, 182, 212, 0.22)' : 'rgba(244, 63, 94, 0.2)';
    ctx.fillStyle = col;
    ctx.fillRect(rx - 36, puddleY + 4, 72, h - puddleY);
  }
  ctx.restore();

  for (let r = 0; r < 5; r++) {
    const phase = (timeSec * 0.9 + r * 0.2) % 1;
    const rx = w * (0.2 + r * 0.16);
    const ry = puddleY + 26 + (r % 2) * 28;
    ctx.strokeStyle = `rgba(186, 230, 253, ${((1 - phase) * 0.42).toFixed(3)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 12 + phase * 58, 3 + phase * 11, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.56,
    groundY: puddleY + 4,
    travelerHeightPx: h * 0.52,
    walkPhase: timeSec * 5.0,
    pose: 'tow_stride',
    rimColor: '#38bdf8',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.38,
  });
}

function renderS29NeonRainWetTags(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  // 90mm Rain-Beaded Macro of `CTU · NIGHT` Blue Delay Tag & Weathered Priority Card ("看斑驳 贴满 优先卡片")
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#050c18');
  bg.addColorStop(1, '#0b1322');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Wet matte-black grooved shell filling frame
  ctx.fillStyle = '#111520';
  roundRectPath(ctx, w * 0.08, h * 0.12, w * 0.84, h * 0.84, 34);
  ctx.fill();

  const s1 = TRAVEL_STICKERS[0];
  const s3 = TRAVEL_STICKERS[3]; // CTU · NIGHT
  drawPriorityCard(ctx, w * 0.44, h * 0.42, 340, 118, -0.11, s1.code, s1.label, s1.year, s1.bg, s1.fg);
  drawPriorityCard(ctx, w * 0.56, h * 0.58, 360, 124, 0.08, s3.code, s3.label, s3.year, s3.bg, s3.fg);

  // Glistening cyan & amber neon raindrop beads clinging to shell and cards!
  for (let d = 0; d < 28; d++) {
    const dx = w * (0.16 + hash01(d * 7.1) * 0.68);
    const dy = h * (0.2 + hash01(d * 13.9) * 0.62) + Math.sin(timeSec * 0.8 + d) * 2;
    const dr = 3 + (d % 4) * 2.2;
    ctx.fillStyle = 'rgba(12, 24, 42, 0.65)';
    ctx.beginPath();
    ctx.arc(dx + 1.5, dy + 2, dr, 0, Math.PI * 2);
    ctx.fill();

    const dropGrad = ctx.createRadialGradient(dx - dr * 0.3, dy - dr * 0.3, 0.5, dx, dy, dr);
    dropGrad.addColorStop(0, '#ffffff');
    dropGrad.addColorStop(0.45, d % 3 === 0 ? '#fde047' : '#7dd3fc');
    dropGrad.addColorStop(1, 'rgba(14, 116, 144, 0.15)');
    ctx.fillStyle = dropGrad;
    ctx.beginPath();
    ctx.arc(dx, dy, dr, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderS30TsaLockRaindropGlint(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;

  // 100mm Storm-Lit Diagonal Clasp Spine & Silver Scratch Medals ("像你替我攒 旧勋章的痕")
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-0.24);

  // Left & right grooved shell halves meeting at brushed-aluminum central clasp frame
  ctx.fillStyle = '#141926';
  ctx.fillRect(-w, -h, w * 2, h * 2);

  // Brushed aluminum center frame channel
  const chGrad = ctx.createLinearGradient(-34, 0, 34, 0);
  chGrad.addColorStop(0, '#1e293b');
  chGrad.addColorStop(0.5, '#94a3b8');
  chGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = chGrad;
  ctx.fillRect(-34, -h, 68, h * 2);

  // Heavy TSA latch housing at center
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2.4;
  roundRectPath(ctx, -48, -110, 96, 220, 14);
  ctx.fill();
  ctx.stroke();

  // Sweeping cold-blue storm glint across silver scratch scars
  const glintY = -220 + lineProgress * 440;
  const glint = ctx.createRadialGradient(0, glintY, 8, 0, glintY, 220);
  glint.addColorStop(0, 'rgba(186, 230, 253, 0.45)');
  glint.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glint;
  ctx.fillRect(-w, -h, w * 2, h * 2);

  // Silver battle-scar scratches beside clasp
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.78)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(74, -80);
  ctx.lineTo(240, -32);
  ctx.moveTo(88, -24);
  ctx.lineTo(210, 18);
  ctx.moveTo(-230, 44);
  ctx.lineTo(-82, 86);
  ctx.stroke();
  ctx.restore();
}

function renderS31ConcourseCrowdShutter(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const floorY = h * 0.8;

  // Grand Vaulted Terminal Concourse Slow-Shutter Crowd Parting ("你见证 聚散啊")
  // Fixes the 108px invisible-wall teleport bug: commuters stream continuously across background & foreground!
  const bg = ctx.createLinearGradient(0, 0, 0, floorY);
  bg.addColorStop(0, '#070c18');
  bg.addColorStop(0.55, '#111d33');
  bg.addColorStop(1, '#192842');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, floorY);

  // Soaring steel-and-glass terminal roof arches
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 3;
  for (let a = 0; a < 5; a++) {
    const ax = (w * (a + 0.5)) / 5;
    ctx.beginPath();
    ctx.moveTo(ax - 180, floorY);
    ctx.quadraticCurveTo(ax, h * 0.04, ax + 180, floorY);
    ctx.stroke();
  }

  ctx.fillStyle = '#090f1c';
  ctx.fillRect(0, floorY, w, h - floorY);

  // Continuous slow-shutter motion-blurred commuter ghosts behind our stationary hero duo
  ctx.save();
  for (let g = 0; g < 14; g++) {
    const dir = g % 2 === 0 ? 1 : -1;
    const speed = 160 + (g % 4) * 55;
    const gx = (((hash01(g * 19.3) * (w + 260) + dir * timeSec * speed) % (w + 260)) + (w + 260)) % (w + 260) - 130;
    const gy = floorY - 6;
    const gh = h * (0.28 + (g % 3) * 0.05);

    const blurGrad = ctx.createLinearGradient(gx - 42, 0, gx + 42, 0);
    blurGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    blurGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.22)');
    blurGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = blurGrad;
    roundRectPath(ctx, gx - 38, gy - gh, 76, gh, 24);
    ctx.fill();
  }
  ctx.restore();

  // Sharp, rock-steady Traveler & Xiaohei anchored in warm pool at center concourse
  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.52,
    groundY: floorY + 2,
    travelerHeightPx: h * 0.48,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#fde047',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.26,
  });
}

function renderS32GatePillarLeanCompanion(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const floorY = h * 0.82;

  // Rainy Indoor Boarding-Gate Glass Column Lean ("依然就是 托住我" — preserves Verse 2 indoor rain continuity!)
  const bg = ctx.createLinearGradient(0, 0, 0, floorY);
  bg.addColorStop(0, '#050914');
  bg.addColorStop(0.65, '#0c182b');
  bg.addColorStop(1, '#09111f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, floorY);

  drawCinemaBokeh(sc, 10, '#38bdf8', '#fbbf24', 0.85);
  drawRainGlassOverlay(ctx, w * 0.64, floorY, timeSec, 36, 0.26);

  // Warm overhead boarding-gate downlight cone illuminating Xiaohei & leaning traveler
  drawTyndallGodRays(ctx, w * 0.52, 0, 4, Math.PI * 0.5, 0.42, floorY, '251, 191, 36', 0.16);

  ctx.fillStyle = '#080c16';
  ctx.fillRect(0, floorY, w, h - floorY);

  drawGatePillarLeanCompanion(sc, floorY);
}

function renderS33HotelNightUnsentLetter(sc: ShotContext): void {
  const { ctx, w, h } = sc;
  const floorY = h * 0.78;

  // Quiet Transit-Hotel Night Room with Venetian-Blind Rain Shadows & Single Warm Desk Lamp ("分担这旅途里 无声的遗憾")
  ctx.fillStyle = '#070910';
  ctx.fillRect(0, 0, w, h);

  // Slanted blue-grey Venetian-blind window slats on left wall
  ctx.save();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.09)';
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * 0.12 + i * 34);
    ctx.lineTo(w * 0.42, h * 0.18 + i * 34);
    ctx.lineTo(w * 0.42, h * 0.18 + i * 34 + 14);
    ctx.lineTo(w * 0.08, h * 0.12 + i * 34 + 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Warm tungsten bedside/desk lamp glow on right illuminating half-open Xiaohei on luggage rack
  const lampGlow = ctx.createRadialGradient(w * 0.64, h * 0.34, 16, w * 0.58, h * 0.58, w * 0.48);
  lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.42)');
  lampGlow.addColorStop(0.45, 'rgba(217, 119, 6, 0.14)');
  lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lampGlow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#120d0a';
  ctx.fillRect(0, floorY, w, h - floorY);

  // Folding hotel wooden luggage rack + open 20" Xiaohei holding unsent postcards & boarding pass
  const rackX = w * 0.54;
  const rackY = floorY - 92;
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(rackX - 130, floorY);
  ctx.lineTo(rackX + 110, rackY);
  ctx.moveTo(rackX + 130, floorY);
  ctx.lineTo(rackX - 110, rackY);
  ctx.stroke();

  // Lower RIMOWA shell half resting horizontally on rack + propped lid
  ctx.fillStyle = '#181822';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2.2;
  roundRectPath(ctx, rackX - 165, rackY - 46, 330, 52, 12);
  ctx.fill();
  ctx.stroke();

  // Propped open lid at 105 degrees
  ctx.save();
  ctx.translate(rackX - 160, rackY - 46);
  ctx.rotate(-1.25);
  ctx.fillStyle = '#14141d';
  roundRectPath(ctx, 0, -34, 250, 34, 10);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Unsent cream postcards & torn boarding pass peeking warmly from inside Xiaohei
  ctx.save();
  ctx.translate(rackX + 10, rackY - 56);
  ctx.rotate(0.08);
  ctx.fillStyle = '#fef3c7';
  roundRectPath(ctx, -68, -28, 136, 44, 4);
  ctx.fill();
  ctx.fillStyle = '#92400e';
  ctx.font = '600 11px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('未寄出的明信片 · GATE B20', 0, -4);
  ctx.restore();
}

function renderS34EmptyCorridorSolitude(sc: ShotContext): void {
  const { ctx, w, h } = sc;
  const vx = w * 0.5;
  const vy = h * 0.48;
  const floorY = h * 0.78;

  // 2:00 AM Completely Deserted One-Point Perspective Airport Corridor ("见证那岁月里 最深的孤单" — ZERO commuters!)
  ctx.fillStyle = '#050811';
  ctx.fillRect(0, 0, w, h);

  // Perspective corridor walls & ceiling light strips converging to `(vx, vy)`
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
  ctx.lineWidth = 1.4;
  for (const [cx, cy] of [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(vx, vy);
    ctx.stroke();
  }

  // Dimmed recessed ceiling light bars in perspective
  for (let i = 1; i <= 6; i++) {
    const f = i / 7;
    const y = vy * (1 - f) + 18 * f;
    const span = 40 + f * w * 0.42;
    ctx.strokeStyle = `rgba(186, 230, 253, ${(0.12 + f * 0.24).toFixed(3)})`;
    ctx.lineWidth = 2 + f * 3;
    ctx.beginPath();
    ctx.moveTo(vx - span, y);
    ctx.lineTo(vx + span, y);
    ctx.stroke();
  }

  const floor = ctx.createLinearGradient(0, vy + 40, 0, h);
  floor.addColorStop(0, '#09101e');
  floor.addColorStop(1, '#04060c');
  ctx.fillStyle = floor;
  ctx.fillRect(0, vy + 40, w, h - vy - 40);

  // Long solitary twin shadows stretching forward across empty polished floor
  ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, floorY + 26, 78, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.515,
    groundY: floorY,
    travelerHeightPx: h * 0.34,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#7dd3fc',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.34,
  });
}

function renderS35AncientHollowRainIntake(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const groundY = h * 0.82;

  // Poetic Misted Cedar Woodland & Glowing Ancient Tree Hollow ("你像树洞 咽下悲欢")
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, '#040d12');
  sky.addColorStop(0.55, '#0a2229');
  sky.addColorStop(1, '#0d2e2b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, groundY);

  // Natural layered drooping cedar silhouettes (NO 3-ellipse cartoon lollipops!)
  drawOrganicMistForest(sc, groundY, {
    farTreeHex: '#07191e',
    nearTreeHex: '#040e12',
    mistRgba: 'rgba(153, 246, 228, 0.14)',
  });

  // Ancient mossy cedar trunk & warm amber tree-hollow sanctuary at center-left (`w * 0.45`)
  const treeX = w * 0.45;
  ctx.fillStyle = '#0b0f10';
  ctx.beginPath();
  ctx.moveTo(treeX - 165, groundY + 12);
  ctx.quadraticCurveTo(treeX - 115, h * 0.45, treeX - 130, 0);
  ctx.lineTo(treeX + 130, 0);
  ctx.quadraticCurveTo(treeX + 115, h * 0.45, treeX + 170, groundY + 12);
  ctx.closePath();
  ctx.fill();

  // Warm golden sanctuary glow inside the ancient hollow
  const hollowY = groundY - h * 0.24;
  const hGlow = ctx.createRadialGradient(treeX, hollowY, 8, treeX, hollowY, 130);
  hGlow.addColorStop(0, '#fef08a');
  hGlow.addColorStop(0.45, 'rgba(245, 158, 11, 0.58)');
  hGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = hGlow;
  ctx.beginPath();
  ctx.ellipse(treeX, hollowY, 64, 96, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mossy ground & Xiaohei standing quietly beside the hollow absorbing silver rain threads
  ctx.fillStyle = '#06100e';
  ctx.fillRect(0, groundY, w, h - groundY);

  drawRimowaCabin(sc, {
    cx: treeX + 118,
    bottomY: groundY + 4,
    scale: 0.92,
    tilt: 0,
    handleRatio: 0.28,
    warmHandleGlow: true,
    wheelAngleOverride: 0,
  });

  drawRainGlassOverlay(ctx, w, groundY, timeSec, 38, 0.22);
}

function renderS36HollowFirefliesAscend(sc: ShotContext): void {
  const { ctx, w, h, timeSec, lineProgress } = sc;

  // Pushed Inside the Mossy Tree-Hollow Arch: Rain Has Ceased, Warm Fireflies Ascend ("却把委屈 全隐瞒")
  const inner = ctx.createRadialGradient(w * 0.5, h * 0.62, 20, w * 0.5, h * 0.5, w * 0.65);
  inner.addColorStop(0, '#451a03');
  inner.addColorStop(0.5, '#0c2424');
  inner.addColorStop(1, '#03080a');
  ctx.fillStyle = inner;
  ctx.fillRect(0, 0, w, h);

  // Quiet mirror pool at base of hollow + Xiaohei silhouette nestled safely within
  const poolY = h * 0.8;
  const poolGrad = ctx.createLinearGradient(0, poolY, 0, h);
  poolGrad.addColorStop(0, '#133330');
  poolGrad.addColorStop(1, '#040a0b');
  ctx.fillStyle = poolGrad;
  ctx.fillRect(0, poolY, w, h - poolY);

  drawRimowaCabin(sc, {
    cx: w * 0.5,
    bottomY: poolY + 4,
    scale: 1.08,
    tilt: 0,
    handleRatio: 0.2,
    warmHandleGlow: true,
    wheelAngleOverride: 0,
  });

  // 32 warm golden fireflies rising gently out of the hollow!
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let f = 0; f < 32; f++) {
    const prog = (hash01(f * 11.7) + timeSec * 0.16 + lineProgress * 0.25) % 1;
    const fx = w * (0.24 + hash01(f * 5.3) * 0.52) + Math.sin(timeSec * 1.8 + f) * 24;
    const fy = poolY - prog * h * 0.72;
    const r = 3.5 + (f % 3) * 2.5;
    const fg = ctx.createRadialGradient(fx, fy, 0.5, fx, fy, r * 3);
    fg.addColorStop(0, '#fef9c3');
    fg.addColorStop(0.4, 'rgba(250, 204, 21, 0.68)');
    fg.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(fx, fy, r * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Framing gnarled bark arch vignette on left, top, and right edges
  ctx.fillStyle = '#050809';
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.ellipse(w * 0.5, h * 0.56, w * 0.34, h * 0.44, 0, 0, Math.PI * 2, true);
  ctx.fill();
}

// ============================================================================
// 07. CHORUS 2 — BREAKING THROUGH THE STORM (S37 – S44)
// ============================================================================

function renderS37StormbreakLightningHero(sc: ShotContext): void {
  const { ctx, w, h, beat } = sc;
  const deckY = h * 0.8;

  // Dramatic Teal-Indigo Storm Clouds Split Open by a Blinding Golden Sunbeam!
  const sky = ctx.createLinearGradient(0, 0, 0, deckY);
  sky.addColorStop(0, '#050b18');
  sky.addColorStop(0.45, '#0c2d48');
  sky.addColorStop(0.8, '#0e7490');
  sky.addColorStop(1, '#facc15');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, deckY);

  drawTyndallGodRays(ctx, w * 0.5, h * 0.14, 8, Math.PI * 0.5, 1.1, h * 0.95, '254, 240, 138', 0.25);
  renderMidgroundDiegeticLyrics(sc, 's37_stormbreak_lightning_hero');

  ctx.fillStyle = '#070b12';
  ctx.fillRect(0, deckY, w, h - deckY);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.5,
    groundY: deckY + 10,
    travelerHeightPx: h * 0.52,
    walkPhase: 0,
    pose: 'hero_beside',
    rimColor: '#38bdf8',
    warmHandleGlow: true,
  });

  drawAnamorphicFlare(ctx, w * 0.5, h * 0.24, w * 0.9, 32, '#38bdf8', 0.6 + beat.kickPulse * 0.35);
}

function renderS38StormTriptychMontage(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const x1 = w * 0.333;
  const x2 = w * 0.666;

  // 3-Beat Storm Breakout Montage: [1] Waterproof Seal Lock | [2] Shell Splitting Rain | [3] Dual Wheels Slicing Puddle
  // Panel 1
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, x1, h);
  ctx.clip();
  ctx.fillStyle = '#091322';
  ctx.fillRect(0, 0, x1, h);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x1 * 0.42, 0, 36, h);
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, x1 * 0.42 - 14, h * 0.36, 64, 140, 10);
  ctx.fill();
  ctx.stroke();
  drawRainGlassOverlay(ctx, x1, h, timeSec, 18, 0.3);
  ctx.restore();

  // Panel 2
  ctx.save();
  ctx.beginPath();
  ctx.rect(x1, 0, x2 - x1, h);
  ctx.clip();
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(x1, 0, x2 - x1, h);
  drawRimowaCabin(sc, {
    cx: (x1 + x2) * 0.5,
    bottomY: h * 0.78,
    scale: 1.18,
    tilt: 0.1,
    handleRatio: 0.42,
    warmHandleGlow: true,
  });
  ctx.restore();

  // Panel 3
  ctx.save();
  ctx.beginPath();
  ctx.rect(x2, 0, w - x2, h);
  ctx.clip();
  ctx.fillStyle = '#08121e';
  ctx.fillRect(x2, 0, w - x2, h);
  ctx.translate(x2 - w * 0.22, 0);
  drawTrueMacroWheelAndBoot(sc, h * 0.76, {
    wheelRadiusPx: 44,
    roosterSpray: true,
    showBoot: false,
  });
  ctx.restore();

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, 0);
  ctx.lineTo(x1, h);
  ctx.moveTo(x2, 0);
  ctx.lineTo(x2, h);
  ctx.stroke();
}

function renderS39HydroplaneWheelSpray(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const roadY = h * 0.76;

  // High-speed post-storm wet asphalt macro with cyan-gold rooster-tail water spray!
  const sky = ctx.createLinearGradient(0, 0, 0, roadY);
  sky.addColorStop(0, '#06101e');
  sky.addColorStop(0.6, '#0e3452');
  sky.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, roadY);

  ctx.fillStyle = '#08101a';
  ctx.fillRect(0, roadY, w, h - roadY);
  drawRainGlassOverlay(ctx, w, roadY, timeSec, 20, 0.18);

  drawTrueMacroWheelAndBoot(sc, roadY + 6, {
    wheelRadiusPx: 56,
    roosterSpray: true,
    showBoot: true,
  });
}

function renderS40DawnBridgeSideProfile(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const horizonY = h * 0.6;
  const deckY = h * 0.8;

  // Fresh Post-Rain Dawn Teal-Gold Coastal Bridge Tracking Shot ("尔似 在我肩")
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#082f49');
  sky.addColorStop(0.55, '#0d9488');
  sky.addColorStop(1, '#fde68a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  const sea = ctx.createLinearGradient(0, horizonY, 0, deckY);
  sea.addColorStop(0, '#0f766e');
  sea.addColorStop(1, '#082f49');
  ctx.fillStyle = sea;
  ctx.fillRect(0, horizonY, w, deckY - horizonY);

  renderMidgroundDiegeticLyrics(sc, 's40_dawn_bridge_side_profile');

  ctx.fillStyle = '#09111a';
  ctx.fillRect(0, deckY, w, h - deckY);
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, deckY - 40);
  ctx.lineTo(w, deckY - 40);
  ctx.stroke();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.55,
    groundY: deckY + 12,
    travelerHeightPx: h * 0.5,
    walkPhase: timeSec * 5.8,
    pose: 'tow_stride',
    rimColor: '#fde68a',
    warmHandleGlow: true,
  });
}

function renderS41UphillStepLift(sc: ShotContext): void {
  const { ctx, w, h, lineProgress } = sc;

  // Low-Angle Wet Stone Staircase Carry-Handle Lift ("哪怕 生活 添上重量")
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0c2438');
  bg.addColorStop(1, '#1e293b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Ascending wet granite steps from bottom-left to upper-right
  for (let s = 0; s < 6; s++) {
    const sx = s * (w * 0.16);
    const sy = h * 0.88 - s * 56;
    ctx.fillStyle = '#131c2b';
    ctx.fillRect(sx, sy, w - sx, h - sy);
    ctx.fillStyle = 'rgba(253, 224, 71, 0.32)';
    ctx.fillRect(sx, sy, w - sx, 3);
  }

  // Xiaohei lifted cleanly into the air above the steps by its top carry handle!
  const liftY = h * 0.72 - Math.sin(Math.min(1, lineProgress * 1.4) * Math.PI * 0.5) * 86;
  const liftX = w * 0.46 + lineProgress * 64;

  const anchors = drawRimowaCabin(sc, {
    cx: liftX,
    bottomY: liftY,
    scale: 1.18,
    tilt: -0.06,
    handleRatio: 0.02,
    warmHandleGlow: true,
    showScuffs: true,
    wheelAngleOverride: 0.2,
  });

  // Traveler's muscular forearm & hand lifting Xiaohei's top carry handle upward!
  ctx.strokeStyle = '#191f2e';
  ctx.lineCap = 'round';
  ctx.lineWidth = 28;
  ctx.beginPath();
  ctx.moveTo(liftX + 86, -20);
  ctx.lineTo(anchors.topCenterX, anchors.topCenterY - 8);
  ctx.stroke();

  ctx.fillStyle = '#c88d6c';
  roundRectPath(ctx, anchors.topCenterX - 18, anchors.topCenterY - 18, 36, 22, 8);
  ctx.fill();
}

function renderS42CloudPierceViaductPov(sc: ShotContext): void {
  const { ctx, w, h, lineProgress, scrollDist } = sc;
  const horizonY = h * 0.52;

  // First-Person Viaduct POV Bursting Out of Thick Sea Fog into Sparkling Turquoise Ocean & Sunbeams!
  const clear01 = Math.max(0, Math.min(1, (lineProgress - 0.18) / 0.62));

  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#0284c7');
  sky.addColorStop(0.65, '#38bdf8');
  sky.addColorStop(1, '#fef08a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Sparkling turquoise sea below viaduct
  const sea = ctx.createLinearGradient(0, horizonY, 0, h);
  sea.addColorStop(0, '#0d9488');
  sea.addColorStop(1, '#0f172a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Perspective coastal viaduct highway deck
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(w * 0.44, horizonY);
  ctx.lineTo(w * 0.56, horizonY);
  ctx.lineTo(w * 0.92, h);
  ctx.lineTo(w * 0.08, h);
  ctx.closePath();
  ctx.fill();

  const dashShift = (scrollDist * 0.9) % 70;
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 4;
  for (let y = horizonY + 20; y < h; y += 70) {
    const yy = y + dashShift * ((y - horizonY) / (h - horizonY));
    ctx.beginPath();
    ctx.moveTo(w * 0.5, yy);
    ctx.lineTo(w * 0.5, yy + 28);
    ctx.stroke();
  }

  // Parting white sea-fog curtains sliding left & right as Xiaohei pierces the cloud bank!
  if (clear01 < 0.98) {
    const fogAlpha = (1 - clear01) * 0.88;
    ctx.fillStyle = `rgba(241, 245, 249, ${fogAlpha.toFixed(3)})`;
    ctx.fillRect(0, 0, w * (0.55 - clear01 * 0.55), h);
    ctx.fillRect(w * (0.45 + clear01 * 0.55), 0, w * 0.6, h);
  }

  drawTyndallGodRays(ctx, w * 0.5, h * 0.18, 6, Math.PI * 0.5, 0.85, h * 0.85, '254, 249, 195', 0.22 * clear01);
  drawFirstPersonPovHandOnHandle(sc, w * 0.5, h * 0.82);
}

function renderS43SunriseHaloSilhouette(sc: ShotContext): void {
  const { ctx, w, h, beat } = sc;
  const cliffY = h * 0.78;

  // Coastal Cliffside Sunrise Solar-Ring Eclipse Silhouette ("嘿呀 还是你呀")
  const sky = ctx.createRadialGradient(w * 0.5, cliffY - h * 0.22, 16, w * 0.5, h * 0.5, w * 0.7);
  sky.addColorStop(0, '#ffffff');
  sky.addColorStop(0.18, '#fef08a');
  sky.addColorStop(0.45, '#14b8a6');
  sky.addColorStop(1, '#082f49');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, cliffY);

  // Brilliant solar corona ring framed right behind Traveler & Xiaohei
  ctx.strokeStyle = 'rgba(255, 251, 235, 0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(w * 0.5, cliffY - h * 0.22, h * 0.17, 0, Math.PI * 2);
  ctx.stroke();

  renderMidgroundDiegeticLyrics(sc, 's43_sunrise_halo_silhouette');

  ctx.fillStyle = '#071318';
  ctx.fillRect(0, cliffY, w, h - cliffY);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.52,
    groundY: cliffY + 8,
    travelerHeightPx: h * 0.5,
    walkPhase: 0,
    pose: 'hero_beside',
    rimColor: '#fef08a',
    warmHandleGlow: true,
  });

  drawAnamorphicFlare(ctx, w * 0.5, cliffY - h * 0.22, w * 0.88, 30, '#fef08a', 0.58 + beat.kickPulse * 0.3);
}

function renderS44TealGoldSanctuaryDome(sc: ShotContext): void {
  const { ctx, w, h } = sc;
  const floorY = h * 0.8;

  // Open-Air Coastal Colonnade Sanctuary Facing Clear Turquoise Sea & Sunlit Horizon ("你最是 安稳堡垒啊")
  const sky = ctx.createLinearGradient(0, 0, 0, floorY);
  sky.addColorStop(0, '#0c4a6e');
  sky.addColorStop(0.55, '#0d9488');
  sky.addColorStop(0.82, '#fde68a');
  sky.addColorStop(1, '#0f766e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, floorY);

  // Whitewashed Mediterranean/coastal concrete colonnade arches framing the ocean
  ctx.fillStyle = '#132a36';
  for (const pxFrac of [0.1, 0.26, 0.74, 0.9]) {
    ctx.fillRect(w * pxFrac - 34, 0, 68, floorY);
  }

  ctx.fillStyle = '#08171e';
  ctx.fillRect(0, floorY, w, h - floorY);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.53,
    groundY: floorY + 2,
    travelerHeightPx: h * 0.46,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#fde68a',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.34,
  });
}

// ============================================================================
// 08. WHISTLE SOLO (S45)
// ============================================================================

function renderS45KamakuraWhistleCoast(sc: ShotContext): void {
  const { ctx, w, h, timeSec, scrollDist, bands, beat } = sc;
  const seaY = h * 0.58;
  const roadY = h * 0.78;

  // Bright Sun-Drenched Kamakura Coastal Highway + White Lighthouse + Golden Whistle Staves!
  const sky = ctx.createLinearGradient(0, 0, 0, seaY);
  sky.addColorStop(0, '#0369a1');
  sky.addColorStop(0.6, '#38bdf8');
  sky.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, seaY);

  // Distant peninsula headland & white coastal lighthouse
  ctx.fillStyle = '#0f4c5c';
  ctx.beginPath();
  ctx.moveTo(w * 0.62, seaY);
  ctx.quadraticCurveTo(w * 0.78, seaY - 56, w, seaY - 22);
  ctx.lineTo(w, seaY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(w * 0.77, seaY - 78, 12, 42);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(w * 0.768, seaY - 84, 16, 8);

  // Sparkling turquoise ocean + sun diamonds
  const ocean = ctx.createLinearGradient(0, seaY, 0, roadY);
  ocean.addColorStop(0, '#0284c7');
  ocean.addColorStop(0.5, '#0d9488');
  ocean.addColorStop(1, '#115e59');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, seaY, w, roadY - seaY);

  ctx.fillStyle = 'rgba(254, 249, 195, 0.65)';
  for (let s = 0; s < 26; s++) {
    const sx = ((hash01(s * 9.3) * w - scrollDist * 0.25) % w + w) % w;
    const sy = seaY + 8 + hash01(s * 17.1) * (roadY - seaY - 18);
    ctx.fillRect(sx, sy, 8 + (s % 3) * 6, 2);
  }

  // Three `bands.high`-reactive golden acoustic whistle staves ribbons across sky!
  ctx.save();
  for (let st = 0; st < 3; st++) {
    ctx.strokeStyle = st === 0 ? 'rgba(254, 240, 138, 0.72)' : 'rgba(167, 243, 208, 0.42)';
    ctx.lineWidth = st === 0 ? 2.4 : 1.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 24) {
      const env = Math.sin((x / w) * Math.PI);
      const amp = (16 + bands.high * 38 + beat.snarePulse * 18) * env;
      const y = h * (0.25 + st * 0.032) + Math.sin(x * 0.015 - timeSec * 8.5 + st * 0.6) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Soaring white seagulls gliding with whistle breeze
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  for (let g = 0; g < 5; g++) {
    const gx = w * 0.18 + g * 145 + Math.sin(timeSec + g) * 18;
    const gy = h * 0.18 + (g % 2) * 32;
    const flap = Math.sin(timeSec * 6 + g * 1.4) * 6;
    ctx.beginPath();
    ctx.moveTo(gx - 11, gy + flap);
    ctx.quadraticCurveTo(gx - 4, gy - 5, gx, gy);
    ctx.quadraticCurveTo(gx + 4, gy - 5, gx + 11, gy + flap);
    ctx.stroke();
  }

  renderMidgroundDiegeticLyrics(sc, 's45_kamakura_whistle_coast');

  // Seaside seawall & asphalt coastal road
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, roadY - 26, w, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, roadY, w, h - roadY);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.54,
    groundY: roadY + 12,
    travelerHeightPx: h * 0.46,
    walkPhase: timeSec * 5.4,
    pose: 'tow_stride',
    rimColor: '#fef08a',
    warmHandleGlow: true,
  });

  // Foreground seaside utility pole parallaxing past camera (occluding sky staves for true 2.5D depth!)
  const poleX = w - ((scrollDist * 0.65) % (w * 1.4)) + w * 0.2;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(poleX, 0, 12, h);
}
