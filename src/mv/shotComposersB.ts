import { TRAVEL_STICKERS } from './mvData';
import { renderMidgroundDiegeticLyrics } from './diegeticLyrics';
import {
  drawCoupledTravelerAndRimowa,
  drawRealisticHandOnRimowaHandle,
  drawSeatedAirportTravelerWithRimowa,
} from './humanRimowaRig';
import {
  drawAnamorphicFlare,
  drawCinemaBokeh,
  drawDetailedXiaohei,
  drawDistantCitySkyline,
  drawStarfieldAndClouds,
  drawTyndallGodRays,
  hash01,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * 12. turntable_carousel: Precision Audiophile Vinyl Turntable × Airport Baggage Claim Carousel (96 BPM)
 */
export function renderTurntableCarouselShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  // Brushed dark-gunmetal audiophile turntable plinth
  const plinth = ctx.createRadialGradient(w * 0.5, h * 0.54, 40, w * 0.5, h * 0.54, w * 0.7);
  plinth.addColorStop(0, '#141e2e');
  plinth.addColorStop(0.6, '#0b111b');
  plinth.addColorStop(1, '#05080e');
  ctx.fillStyle = plinth;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.48;
  const cy = h * 0.54;
  const outerR = Math.min(w, h) * 0.37;

  // Outer machined aluminum platter rim & illuminated 96-BPM stroboscopic dots
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR + 9, 0, Math.PI * 2);
  ctx.stroke();

  for (let s = 0; s < 72; s++) {
    const a = (s / 72) * Math.PI * 2 + timeSec * 1.45;
    ctx.fillStyle = s % 2 === 0 ? chapter.accentHex : 'rgba(226, 232, 240, 0.45)';
    ctx.beginPath();
    ctx.arc(
      cx + Math.cos(a) * (outerR + 9),
      cy + Math.sin(a) * (outerR + 9),
      1.7,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Spinning Vinyl Platter × Baggage Carousel Track
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(timeSec * 1.45);

  ctx.fillStyle = '#0c121c';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dual diagonal satin vinyl light-reflection cones
  for (const baseA of [-0.65, Math.PI - 0.65]) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, outerR * 0.98, baseA - 0.24, baseA + 0.24);
    ctx.closePath();
    ctx.fill();
  }

  // Concentric micro-grooves + carousel rubber slat joints
  for (let g = 1; g <= 9; g++) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, outerR * (0.34 + g * 0.068), 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.28)' : 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * outerR * 0.36, Math.sin(a) * outerR * 0.36);
    ctx.lineTo(Math.cos(a) * outerR * 0.96, Math.sin(a) * outerR * 0.96);
    ctx.stroke();
  }

  // Detailed 3D Top-Down Suitcases Riding Around the Carousel (k === 0 is grooved Xiaohei!)
  for (let k = 0; k < 4; k++) {
    const ka = (k / 4) * Math.PI * 2;
    ctx.save();
    ctx.rotate(ka);
    ctx.translate(outerR * 0.68, 0);

    // Drop shadow on carousel
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    roundRectPath(ctx, -28, -40, 62, 86, 11);
    ctx.fill();

    ctx.fillStyle = k === 0 ? '#181820' : k === 2 ? '#334155' : '#1e293b';
    ctx.strokeStyle = k === 0 ? '#fde047' : '#94a3b8';
    ctx.lineWidth = k === 0 ? 2.6 : 1.5;
    roundRectPath(ctx, -30, -43, 60, 86, 11);
    ctx.fill();
    ctx.stroke();

    // Grooves & corner caps on Xiaohei (k === 0)
    if (k === 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1;
      for (let r = -2; r <= 2; r++) {
        ctx.beginPath();
        ctx.moveTo(r * 9, -36);
        ctx.lineTo(r * 9, 36);
        ctx.stroke();
      }
      ctx.fillStyle = TRAVEL_STICKERS[0].bg;
      roundRectPath(ctx, -14, -12, 28, 12, 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = '800 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('20"', 0, 18);
    }
    ctx.restore();
  }

  // Center Gold Vinyl Label ("96 BPM · HEY XIAOHEI")
  const lblGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, outerR * 0.31);
  lblGrad.addColorStop(0, '#fef08a');
  lblGrad.addColorStop(0.65, chapter.accentHex);
  lblGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = lblGrad;
  ctx.beginPath();
  ctx.arc(0, 0, outerR * 0.3 + beat.kickPulse * 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  ctx.font = '800 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('96 BPM · STEREO', 0, -outerR * 0.14);
  ctx.fillText('HEY! XIAOHEI', 0, outerR * 0.18);

  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // S-Shaped Brushed Chrome Audiophile Tonearm & Cartridge Assembly on Right
  const pivotX = cx + outerR + 74;
  const pivotY = cy - outerR * 0.62;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // S-curved tonearm tube tracking outer groove
  const stylusX = cx + outerR * 0.72;
  const stylusY = cy + outerR * 0.38;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY - 22);
  ctx.bezierCurveTo(pivotX + 8, cy - 30, pivotX - 28, cy + 40, stylusX, stylusY);
  ctx.stroke();

  // Headshell + warm glowing needle contact point
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.save();
  ctx.translate(stylusX, stylusY);
  ctx.rotate(0.52);
  roundRectPath(ctx, -18, -8, 28, 16, 4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawAnamorphicFlare(ctx, stylusX - 8, stylusY + 4, 140, 10, '#fbbf24', 0.72);
  ctx.restore();
  drawCinemaBokeh(sc, 14, chapter.accentHex, '#fbbf24', 0.9);
}

/**
 * 13. airport_delay_rain: World-Class Rainy Midnight Terminal Concourse, Apron Lights, Jetbridge, Droplets & Warm Coffee
 * Matches exact lyric: "[01:18.905] 等暴雨 这班机 延误了 / 你听过我 长叹息声"
 */
export function renderAirportDelayRainShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const floorY = h * 0.72;

  // 1. Stormy midnight sky + sculpted thunderhead clouds outside terminal glass
  const stormSky = ctx.createLinearGradient(0, 0, 0, floorY);
  stormSky.addColorStop(0, '#030711');
  stormSky.addColorStop(0.52, '#0a182e');
  stormSky.addColorStop(0.86, '#142c47');
  stormSky.addColorStop(1, '#1c364f');
  ctx.fillStyle = stormSky;
  ctx.fillRect(0, 0, w, floorY);

  drawStarfieldAndClouds(sc, floorY * 0.52, {
    starCount: 6,
    cloudShadowHex: 'rgba(6, 15, 29, 0.85)',
    cloudMidHex: 'rgba(16, 35, 61, 0.72)',
    cloudRimHex: 'rgba(125, 211, 252, 0.28)',
    driftSpeed: 10,
  });

  // Distant thunder-sheet flash on snare
  if (beat.snarePulse > 0.58) {
    ctx.fillStyle = `rgba(186, 230, 253, ${((beat.snarePulse - 0.58) * 0.22).toFixed(3)})`;
    ctx.fillRect(0, 0, w, floorY);
  }

  // 2. Distant Control Tower, Apron Floodlight Masts & Shimmering Wet Tarmac Taxiway Lights!
  const tarmacY = floorY - h * 0.1;
  const tarmacGrad = ctx.createLinearGradient(0, tarmacY, 0, floorY);
  tarmacGrad.addColorStop(0, '#091526');
  tarmacGrad.addColorStop(1, '#050c17');
  ctx.fillStyle = tarmacGrad;
  ctx.fillRect(0, tarmacY, w, floorY - tarmacY);

  // Distant Airport Control Tower silhouette on far left
  const twX = w * 0.09;
  ctx.fillStyle = '#07101d';
  ctx.fillRect(twX - 7, tarmacY - 128, 14, 128);
  ctx.beginPath();
  ctx.moveTo(twX - 20, tarmacY - 128);
  ctx.lineTo(twX + 20, tarmacY - 128);
  ctx.lineTo(twX + 13, tarmacY - 108);
  ctx.lineTo(twX - 13, tarmacY - 108);
  ctx.closePath();
  ctx.fill();
  drawAnamorphicFlare(ctx, twX, tarmacY - 134, 70, 6, '#34d399', 0.45 + 0.35 * Math.sin(timeSec * 3));

  // Tall amber apron floodlight masts with misty light cones
  for (const fx of [w * 0.22, w * 0.54, w * 0.86]) {
    ctx.strokeStyle = '#0c1a2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, tarmacY);
    ctx.lineTo(fx, tarmacY - 115);
    ctx.stroke();
    drawTyndallGodRays(ctx, fx, tarmacY - 115, 3, Math.PI * 0.5, 0.45, 130, '251, 191, 36', 0.13);
    drawAnamorphicFlare(ctx, fx, tarmacY - 115, 95, 7, '#fde68a', 0.52);
  }

  // Emerald & cobalt runway/taxiway edge lights reflecting vertically on rain-drenched tarmac
  for (let tx = 30; tx < w; tx += 52) {
    const col = tx % 104 === 0 ? '#34d399' : '#38bdf8';
    const ty = tarmacY + 12 + (tx % 3) * 14;
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.arc(tx, ty, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.22;
    ctx.fillRect(tx - 1, ty + 2, 2, 22);
  }
  ctx.globalAlpha = 1;

  // 3. Detailed Grounded Wide-Body Airliner + Illuminated Passenger Jetbridge
  const planeX = w * 0.32;
  const planeY = tarmacY - 14;

  // Accordion Jetbridge linking terminal left to forward aircraft door
  ctx.fillStyle = '#0c1b2e';
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.28)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, planeY - 26);
  ctx.lineTo(planeX + 86, planeY - 8);
  ctx.lineTo(planeX + 86, planeY + 8);
  ctx.lineTo(0, planeY - 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sculpted wide-body aircraft nose, fuselage, tail fin & underwing turbofan engine
  ctx.fillStyle = '#081322';
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.34)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(planeX - 165, planeY - 16);
  ctx.lineTo(planeX + 125, planeY - 16);
  // Aerodynamic cockpit nose cone
  ctx.bezierCurveTo(planeX + 162, planeY - 15, planeX + 184, planeY - 2, planeX + 186, planeY + 8);
  ctx.quadraticCurveTo(planeX + 178, planeY + 18, planeX + 135, planeY + 18);
  ctx.lineTo(planeX - 155, planeY + 16);
  ctx.quadraticCurveTo(planeX - 175, planeY + 6, planeX - 165, planeY - 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Warm illuminated cabin windows + cockpit windshield glow
  ctx.fillStyle = 'rgba(254, 240, 138, 0.68)';
  ctx.fillRect(planeX + 148, planeY - 7, 14, 5);
  for (let wx = planeX - 118; wx <= planeX + 118; wx += 13) {
    ctx.fillRect(wx, planeY - 4, 5.5, 4.5);
  }

  // Swept wing + turbofan engine nacelle
  ctx.fillStyle = '#0d1e36';
  ctx.beginPath();
  ctx.moveTo(planeX + 16, planeY + 8);
  ctx.lineTo(planeX - 78, planeY + 32);
  ctx.lineTo(planeX + 52, planeY + 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#132a4a';
  roundRectPath(ctx, planeX - 12, planeY + 16, 36, 15, 6);
  ctx.fill();

  // Swept vertical tail stabilizer + blinking red anti-collision beacon
  ctx.fillStyle = '#081322';
  ctx.beginPath();
  ctx.moveTo(planeX - 142, planeY - 15);
  ctx.lineTo(planeX - 184, planeY - 86);
  ctx.lineTo(planeX - 164, planeY - 86);
  ctx.lineTo(planeX - 108, planeY - 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  if (Math.floor(timeSec * 2.5) % 2 === 0) {
    drawAnamorphicFlare(ctx, planeX - 172, planeY - 86, 85, 7, '#ef4444', 0.85);
  }

  // 4. Floor-to-Ceiling Architectural Glass Curtain Wall + Rain Streaks + Glistening Window Droplets!
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.34)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let i = 0; i < 95; i++) {
    const rx = ((i * 103 + timeSec * 360) % (w + 160)) - 80;
    const ry = ((i * 157 + timeSec * 1080) % floorY);
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 15, ry + 40);
  }
  ctx.stroke();

  // Glistening close-up raindrops & trickling condensation beads on the glass panes
  ctx.save();
  for (let d = 0; d < 46; d++) {
    const dx = hash01(d * 9.3 + 2) * w;
    const dy = ((hash01(d * 15.7 + 7) * floorY + timeSec * (8 + (d % 4) * 5)) % floorY);
    const dr = 1.6 + (d % 3) * 1.1;
    ctx.fillStyle = d % 4 === 0 ? 'rgba(253, 224, 71, 0.42)' : 'rgba(186, 230, 253, 0.48)';
    ctx.beginPath();
    ctx.ellipse(dx, dy, dr * 0.85, dr * 1.35, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Sloped structural steel curtain-wall mullions & transom bar
  ctx.strokeStyle = '#070b14';
  ctx.lineWidth = 11;
  for (let gx = w * 0.12; gx < w; gx += w * 0.22) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx - 24, floorY);
    ctx.stroke();
  }
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.42);
  ctx.lineTo(w, h * 0.42);
  ctx.stroke();

  // Warm recessed interior concourse ceiling light glow at top
  const ceilingGlow = ctx.createLinearGradient(0, 0, 0, h * 0.14);
  ceilingGlow.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
  ceilingGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = ceilingGlow;
  ctx.fillRect(0, 0, w, h * 0.14);

  // 5. Ceiling-suspended Solari Split-Flap FIDS board is rendered as a unified live lyric component in diegeticLyrics.ts

  // 6. Polished Terrazzo Concourse Floor with Mirror Window-Light Reflections
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#0d1b30');
  floorGrad.addColorStop(0.45, '#07101d');
  floorGrad.addColorStop(1, '#04070d');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  // Reflected mullion shadows & warm handle reflection on polished concourse floor
  const handleRef = ctx.createRadialGradient(w * 0.34 + 98, floorY + 28, 4, w * 0.34 + 98, floorY + 28, 120);
  handleRef.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
  handleRef.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = handleRef;
  ctx.fillRect(w * 0.2, floorY, w * 0.35, h - floorY);

  // 7. Realistic Seated Traveler sighing on terminal bench with palm resting on 20" RIMOWA Cabin
  const benchX = w * 0.34;
  const figScaleH = h * 0.41;
  drawSeatedAirportTravelerWithRimowa(sc, benchX, floorY + 12, figScaleH);

  // Warm paper travel coffee cup + gentle rising steam + tucked boarding pass on left bench seat!
  const u = figScaleH / 260;
  const cupX = benchX - 66 * u;
  const seatTopY = floorY + 12 - 46 * u;
  ctx.save();
  // Boarding pass stub beside cup
  ctx.fillStyle = '#fef3c7';
  roundRectPath(ctx, cupX - 24 * u, seatTopY - 3 * u, 18 * u, 4 * u, 1 * u);
  ctx.fill();
  // Takeaway coffee cup + kraft sleeve + white lid
  ctx.fillStyle = '#e7e5e4';
  ctx.beginPath();
  ctx.moveTo(cupX - 5.5 * u, seatTopY - 16 * u);
  ctx.lineTo(cupX + 5.5 * u, seatTopY - 16 * u);
  ctx.lineTo(cupX + 4.2 * u, seatTopY);
  ctx.lineTo(cupX - 4.2 * u, seatTopY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cupX - 4.9 * u, seatTopY - 11 * u, 9.8 * u, 6 * u);
  ctx.fillStyle = '#ffffff';
  roundRectPath(ctx, cupX - 6.2 * u, seatTopY - 18.2 * u, 12.4 * u, 2.8 * u, 1 * u);
  ctx.fill();
  // Delicate rising steam curl
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  const steamShift = Math.sin(timeSec * 2.6) * 3 * u;
  ctx.moveTo(cupX, seatTopY - 20 * u);
  ctx.quadraticCurveTo(cupX - 4 * u + steamShift, seatTopY - 28 * u, cupX + 2 * u, seatTopY - 36 * u);
  ctx.stroke();
  ctx.restore();
}

/**
 * 14. handle_warmth_macro: 85mm Prime Lens Macro of Sculpted Human Hand Clasping RIMOWA T-Bar against Rain-Bokeh Night
 */
export function renderHandleWarmthMacroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  const bg = ctx.createRadialGradient(w * 0.52, h * 0.5, 20, w * 0.52, h * 0.5, w * 0.72);
  bg.addColorStop(0, '#301e0e');
  bg.addColorStop(0.5, '#0c182b');
  bg.addColorStop(1, '#04070f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Rich multi-hue rain-window night bokeh (amber, sapphire, emerald & ruby)
  drawCinemaBokeh(sc, 16, '#fbbf24', '#38bdf8', 1.65);
  drawCinemaBokeh(sc, 10, '#34d399', '#fb7185', 1.1);

  // Subtle out-of-focus rain streaks in deep background
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 34; i++) {
    const rx = hash01(i * 11.7) * w;
    const ry = ((hash01(i * 19.3) * h + timeSec * 240) % h);
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 8, ry + 32);
  }
  ctx.stroke();

  drawRealisticHandOnRimowaHandle(sc);
  drawAnamorphicFlare(ctx, w * 0.52 - 110, h * 0.64, 210, 11, '#fde68a', 0.45);
}

/**
 * 15. concourse_parting: Grand Vaulted Glass-Arch Concourse Hall with Rushing Commuters vs Anchored Traveler & RIMOWA
 */
export function renderConcoursePartingShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter } = sc;
  const floorY = h * 0.72;

  const hallBg = ctx.createLinearGradient(0, 0, 0, floorY);
  hallBg.addColorStop(0, '#050a14');
  hallBg.addColorStop(0.55, '#0b1628');
  hallBg.addColorStop(1, '#122238');
  ctx.fillStyle = hallBg;
  ctx.fillRect(0, 0, w, floorY);

  // Grand Vaulted Steel-and-Glass Terminal Arches Receding in Perspective
  ctx.save();
  for (let a = 0; a < 5; a++) {
    const spanW = w * (0.42 + a * 0.19);
    const archTop = h * (0.34 - a * 0.075);
    ctx.strokeStyle = `rgba(125, 211, 252, ${(0.1 + a * 0.035).toFixed(3)})`;
    ctx.lineWidth = 2 + a * 0.8;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - spanW * 0.5, floorY);
    ctx.quadraticCurveTo(w * 0.5, archTop, w * 0.5 + spanW * 0.5, floorY);
    ctx.stroke();
  }
  // Overhead concourse skylight Tyndall shafts
  drawTyndallGodRays(ctx, w * 0.5, -50, 7, Math.PI * 0.5, 0.72, floorY + 60, '186, 230, 253', 0.11);
  ctx.restore();

  // Classic illuminated station/terminal suspended clock in upper-center arch
  const clkX = w * 0.5;
  const clkY = h * 0.18;
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.48)';
  ctx.fillStyle = 'rgba(9, 14, 24, 0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(clkX, clkY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(clkX, clkY);
  ctx.lineTo(clkX + Math.cos(timeSec * 0.5) * 14, clkY + Math.sin(timeSec * 0.5) * 14);
  ctx.moveTo(clkX, clkY);
  ctx.lineTo(clkX + Math.cos(timeSec * 0.08) * 10, clkY + Math.sin(timeSec * 0.08) * 10);
  ctx.stroke();

  // Long-exposure shutter-streaked 1:7.5 commuter silhouettes rushing past in opposite directions ("见证聚散")
  for (let p = 0; p < 8; p++) {
    const dir = p % 2 === 0 ? 1 : -1;
    const px = (((p * 210 + timeSec * 135 * dir) % (w + 240)) + (w + 240)) % (w + 240) - 120;
    if (Math.abs(px - w * 0.5) < 108) continue;
    const ph = 186 + (p % 3) * 14;
    const u = ph / 252;
    const stride = Math.sin(timeSec * 5.2 + p * 1.7) * 16 * u;
    const tone = p % 3 === 0 ? '#38bdf8' : '#94a3b8';

    ctx.save();
    ctx.translate(px, floorY);
    ctx.scale(dir, 1);

    // Subtle 1/8s shutter-drag ghost copies
    for (let ghost = 0; ghost < 2; ghost++) {
      const gx = -ghost * 14 * u;
      ctx.save();
      ctx.translate(gx, 0);
      ctx.globalAlpha = ghost === 0 ? 0.16 : 0.07;
      ctx.fillStyle = tone;

      // Sculpted 1:7.5 cranial silhouette + collar
      ctx.beginPath();
      ctx.moveTo(-8 * u, -242 * u);
      ctx.bezierCurveTo(-11 * u, -252 * u, 6 * u, -254 * u, 11 * u, -244 * u);
      ctx.bezierCurveTo(13 * u, -236 * u, 11 * u, -226 * u, 6 * u, -222 * u);
      ctx.lineTo(4 * u, -212 * u);
      ctx.lineTo(-5 * u, -212 * u);
      ctx.closePath();
      ctx.fill();

      // Tailored hip-length architectural coat (zero knee-length triangle!)
      ctx.beginPath();
      ctx.moveTo(-12 * u, -210 * u);
      ctx.quadraticCurveTo(2 * u, -214 * u, 14 * u, -206 * u);
      ctx.lineTo(16 * u + stride * 0.16, -118 * u);
      ctx.quadraticCurveTo(0, -114 * u, -15 * u - stride * 0.12, -120 * u);
      ctx.closePath();
      ctx.fill();

      // Upright tapered stride legs (thigh -> knee -> ankle, zero round stick lines)
      for (const legS of [stride, -stride * 0.85]) {
        ctx.beginPath();
        ctx.moveTo(-6 * u, -122 * u);
        ctx.lineTo(8 * u, -122 * u);
        ctx.lineTo(legS + 5 * u, -6 * u);
        ctx.lineTo(legS - 4 * u, -6 * u);
        ctx.closePath();
        ctx.fill();
      }

      // Rolling carry-on silhouette towed behind every other commuter
      if (p % 2 === 0 && ghost === 0) {
        roundRectPath(ctx, -50 * u, -78 * u, 28 * u, 68 * u, 5 * u);
        ctx.fill();
        ctx.strokeStyle = tone;
        ctx.lineWidth = 1.6 * u;
        ctx.beginPath();
        ctx.moveTo(-34 * u, -78 * u);
        ctx.lineTo(-14 * u, -122 * u);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Horizontal motion-blur slipstream streak
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = tone;
    roundRectPath(ctx, -64 * u, -176 * u, 96 * u, 10 * u, 5 * u);
    ctx.fill();
    ctx.restore();
  }

  // Polished mirror terrazzo concourse floor with perspective tile lines
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#0f1d33');
  floorGrad.addColorStop(0.5, '#091120');
  floorGrad.addColorStop(1, '#050811');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.08)';
  ctx.lineWidth = 1;
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + i * 130, floorY);
    ctx.lineTo(w * 0.5 + i * 240, h);
    ctx.stroke();
  }

  ctx.fillStyle = chapter.accentHex;
  ctx.fillRect(0, floorY, w, 2);

  // Warm Golden Sanctuary Spotlight Anchoring Traveler + 20" RIMOWA ("依然就是托住我")
  const spot = ctx.createRadialGradient(w * 0.49, floorY - 90, 10, w * 0.49, floorY - 90, 275);
  spot.addColorStop(0, 'rgba(251, 191, 36, 0.32)');
  spot.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = spot;
  ctx.beginPath();
  ctx.arc(w * 0.49, floorY - 90, 275, 0, Math.PI * 2);
  ctx.fill();

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.51,
    groundY: floorY + 18,
    travelerHeightPx: h * 0.43,
    walkPhase: 0,
    pose: 'concourse_calm',
    rimColor: '#fbbf24',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.2,
  });

  drawCinemaBokeh(sc, 14, '#fbbf24', '#38bdf8', 1.05);
}

/**
 * 16. tree_hollow_poetic: Studio Ghibli / Shinkai Enchanted Moonlight Forest Sanctuary, Puddle Reflection & Fireflies
 */
export function renderTreeHollowPoeticShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  // 1. Enchanted deep midnight-emerald & sapphire forest sky
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#040913');
  sky.addColorStop(0.55, '#091b2b');
  sky.addColorStop(0.85, '#0c2424');
  sky.addColorStop(1, '#060e0d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.46;
  const groundY = h * 0.76;

  // Layered misty background woodland cedar/pine silhouettes for atmospheric forest depth!
  for (let layer = 0; layer < 2; layer++) {
    ctx.fillStyle = layer === 0 ? 'rgba(9, 28, 42, 0.75)' : 'rgba(7, 20, 30, 0.88)';
    for (let tx = 30; tx < w; tx += layer === 0 ? 86 : 112) {
      if (Math.abs(tx - cx) < 185) continue;
      const th = h * (layer === 0 ? 0.48 : 0.6) * (0.7 + hash01(tx + layer * 19) * 0.45);
      const tw = layer === 0 ? 16 : 24;
      ctx.fillRect(tx - tw * 0.5, groundY - th, tw, th + 20);
      // Soft pine bough tiers
      for (let b = 0; b < 3; b++) {
        const by = groundY - th + b * 48;
        ctx.beginPath();
        ctx.ellipse(tx, by, 44 + b * 12, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Silver-cyan moonlight Tyndall shafts filtering through forest canopy
  drawTyndallGodRays(ctx, w * 0.18, -40, 5, Math.PI * 0.36, 0.5, h * 0.95, '125, 211, 252', 0.11);

  // 2. Mossy Woodland Hillock + Tranquil Rain Puddle at Hollow Base
  const moundGrad = ctx.createLinearGradient(0, groundY - 24, 0, h);
  moundGrad.addColorStop(0, '#10241f');
  moundGrad.addColorStop(0.45, '#081312');
  moundGrad.addColorStop(1, '#040808');
  ctx.fillStyle = moundGrad;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 38);
  ctx.quadraticCurveTo(cx, groundY - 26, w, groundY + 42);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Deep background twilight canopy aura
  const backCanopy = [
    { dx: -270, y: h * 0.08, rx: 225, ry: 112, c: '#071722' },
    { dx: 260, y: h * 0.09, rx: 220, ry: 108, c: '#071722' },
    { dx: 0, y: h * 0.06, rx: 295, ry: 122, c: '#091f28' },
  ];
  for (const cl of backCanopy) {
    ctx.fillStyle = cl.c;
    ctx.beginPath();
    ctx.ellipse(cx + cl.dx, cl.y, cl.rx, cl.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Organic Ancient Gnarled Tree Trunk, Spreading Roots & Sweeping Boughs
  const barkGrad = ctx.createLinearGradient(cx - 220, 0, cx + 220, groundY);
  barkGrad.addColorStop(0, '#120f0f');
  barkGrad.addColorStop(0.5, '#211813');
  barkGrad.addColorStop(1, '#0d0a09');
  ctx.fillStyle = barkGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 305, groundY + 32);
  ctx.quadraticCurveTo(cx - 205, groundY + 6, cx - 168, groundY - 62);
  ctx.bezierCurveTo(cx - 142, h * 0.52, cx - 150, h * 0.3, cx - 225, h * 0.14);
  ctx.quadraticCurveTo(cx - 280, h * 0.05, cx - 355, -24);
  ctx.lineTo(cx - 235, -24);
  ctx.quadraticCurveTo(cx - 160, h * 0.1, cx - 108, h * 0.2);
  ctx.quadraticCurveTo(cx - 58, h * 0.09, cx - 84, -24);
  ctx.lineTo(cx + 76, -24);
  ctx.quadraticCurveTo(cx + 52, h * 0.1, cx + 104, h * 0.2);
  ctx.quadraticCurveTo(cx + 165, h * 0.1, cx + 245, -24);
  ctx.lineTo(cx + 350, -24);
  ctx.quadraticCurveTo(cx + 270, h * 0.06, cx + 212, h * 0.16);
  ctx.bezierCurveTo(cx + 144, h * 0.32, cx + 146, h * 0.54, cx + 176, groundY - 54);
  ctx.quadraticCurveTo(cx + 214, groundY + 8, cx + 298, groundY + 30);
  ctx.quadraticCurveTo(cx + 140, groundY + 14, cx + 68, groundY + 22);
  ctx.quadraticCurveTo(cx, groundY + 12, cx - 72, groundY + 24);
  ctx.quadraticCurveTo(cx - 150, groundY + 14, cx - 305, groundY + 32);
  ctx.closePath();
  ctx.fill();

  // Foreground overhanging twilight foliage clusters with subtle teal rim-lit leaves
  const frontCanopy = [
    { dx: -265, y: h * 0.03, rx: 170, ry: 72, c: 'rgba(10, 30, 38, 0.94)' },
    { dx: -95, y: h * 0.01, rx: 160, ry: 68, c: 'rgba(13, 38, 46, 0.92)' },
    { dx: 95, y: h * 0.01, rx: 160, ry: 68, c: 'rgba(13, 38, 46, 0.92)' },
    { dx: 260, y: h * 0.03, rx: 170, ry: 72, c: 'rgba(10, 30, 38, 0.94)' },
  ];
  for (const cl of frontCanopy) {
    ctx.fillStyle = cl.c;
    ctx.beginPath();
    ctx.ellipse(cx + cl.dx, cl.y, cl.rx, cl.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Organic vertical bark grain & warm rim-lit bark ridges flanking the hollow
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.lineWidth = 1.8;
  for (const bx of [-146, -122, -102, 102, 124, 148]) {
    ctx.beginPath();
    ctx.moveTo(cx + bx * 1.18, groundY + 10);
    ctx.bezierCurveTo(
      cx + bx * 0.92,
      h * 0.55,
      cx + bx * 0.96,
      h * 0.36,
      cx + bx * 1.25,
      h * 0.18
    );
    ctx.stroke();
  }

  // 4. Deep Recessed Organic Archway of the Tree Hollow Sanctuary + Golden Glow
  const hollowTopY = h * 0.33;
  ctx.fillStyle = '#090605';
  ctx.beginPath();
  ctx.moveTo(cx - 96, groundY + 4);
  ctx.bezierCurveTo(cx - 100, h * 0.54, cx - 68, hollowTopY, cx, hollowTopY - 8);
  ctx.bezierCurveTo(cx + 68, hollowTopY, cx + 100, h * 0.54, cx + 96, groundY + 4);
  ctx.closePath();
  ctx.fill();

  const hollowY = h * 0.54;
  const hollowGlow = ctx.createRadialGradient(cx, hollowY, 10, cx, hollowY, 148);
  hollowGlow.addColorStop(0, 'rgba(254, 249, 195, 0.94)');
  hollowGlow.addColorStop(0.45, 'rgba(245, 158, 11, 0.52)');
  hollowGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = hollowGlow;
  ctx.beginPath();
  ctx.ellipse(cx, hollowY, 88 + beat.kickPulse * 6, 122 + beat.kickPulse * 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.58)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(cx - 96, groundY + 2);
  ctx.bezierCurveTo(cx - 100, h * 0.54, cx - 68, hollowTopY, cx, hollowTopY - 8);
  ctx.bezierCurveTo(cx + 68, hollowTopY, cx + 100, h * 0.54, cx + 96, groundY + 2);
  ctx.stroke();

  // Tranquil woodland rain-puddle in front of hollow reflecting golden light!
  const puddleGrad = ctx.createRadialGradient(cx, groundY + 26, 4, cx, groundY + 26, 135);
  puddleGrad.addColorStop(0, 'rgba(253, 224, 71, 0.36)');
  puddleGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.14)');
  puddleGrad.addColorStop(1, 'rgba(13, 35, 43, 0)');
  ctx.fillStyle = puddleGrad;
  ctx.beginPath();
  ctx.ellipse(cx, groundY + 28, 138, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Woodland moss cushions & tiny glowing star-blossoms flanking tree roots
  for (const fx of [-175, -135, -112, 114, 142, 182]) {
    const fy = groundY + 8 + (Math.abs(fx) % 3) * 5;
    ctx.fillStyle = '#134e4a';
    ctx.beginPath();
    ctx.ellipse(cx + fx, fy, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(cx + fx, fy - 4, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. 20" RIMOWA ("小黑") nestled safely inside the glowing tree hollow sanctuary
  drawDetailedXiaohei(sc, {
    cx,
    bottomY: groundY + 2,
    scale: 0.72,
    handleRatio: 0.22,
    warmHandleGlow: true,
  });

  // 6. Blue rain-tears drifting down -> Luminous haloed golden fireflies rising upward!
  for (let i = 0; i < 28; i++) {
    if (i % 2 === 0) {
      const fx = cx + Math.sin(timeSec * 1.3 + i) * (95 + i * 9.5);
      const fy = groundY - ((timeSec * 44 + i * 29) % (h * 0.62));
      const fGlow = ctx.createRadialGradient(fx, fy, 0.5, fx, fy, 11);
      fGlow.addColorStop(0, '#ffffff');
      fGlow.addColorStop(0.35, 'rgba(253, 224, 71, 0.85)');
      fGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = fGlow;
      ctx.beginPath();
      ctx.arc(fx, fy, 11, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const rx = cx + Math.cos(i * 2.3) * 280;
      const ry = ((timeSec * 220 + i * 47) % (h * 0.52));
      ctx.fillStyle = 'rgba(125, 211, 252, 0.42)';
      ctx.fillRect(rx, ry, 1.8, 15);
    }
  }
}

/**
 * 17. whistle_coastal: Kamakura / Amalfi Sunlit Turquoise Coastal Highway with Cumulus Clouds, Lighthouse & Surf
 */
export function renderWhistleCoastalShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec, bands, beat } = sc;
  const seaY = h * 0.58;
  const roadY = h * 0.73;

  // 1. Vibrant summer azure-to-aquamarine coastal sky + sunlit cumulus clouds
  const sky = ctx.createLinearGradient(0, 0, 0, seaY);
  sky.addColorStop(0, '#062c43');
  sky.addColorStop(0.5, '#0c6980');
  sky.addColorStop(0.88, '#2dd4bf');
  sky.addColorStop(1, '#99f6e4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, seaY);

  drawStarfieldAndClouds(sc, seaY, {
    starCount: 0,
    cloudShadowHex: '#cbd5e1',
    cloudMidHex: '#f8fafc',
    cloudRimHex: '#fef9c3',
    driftSpeed: 14,
  });

  // Distant coastal cape peninsula + white lighthouse on left horizon
  ctx.fillStyle = '#0f3d4c';
  ctx.beginPath();
  ctx.moveTo(0, seaY);
  ctx.quadraticCurveTo(w * 0.14, seaY - 42, w * 0.28, seaY - 14);
  ctx.lineTo(w * 0.34, seaY);
  ctx.closePath();
  ctx.fill();
  // White lighthouse tower
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(w * 0.26, seaY - 34, 6, 22);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(w * 0.26, seaY - 26, 6, 5);

  // 2. Multi-Layered Sparkling Turquoise & Sapphire Ocean + White Surf Foam!
  const oceanGrad = ctx.createLinearGradient(0, seaY, 0, roadY);
  oceanGrad.addColorStop(0, '#0d4f63');
  oceanGrad.addColorStop(0.55, '#0f766e');
  oceanGrad.addColorStop(1, '#14b8a6');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, seaY, w, roadY - seaY);

  // Sparkling diamond sun-glints & gentle whitecap surf lines
  for (let s = 0; s < 36; s++) {
    const sx = ((s * 61 + timeSec * 45) % w);
    const sy = seaY + 6 + (s % 5) * ((roadY - seaY - 14) / 5);
    ctx.fillStyle = s % 3 === 0 ? '#ffffff' : 'rgba(254, 249, 195, 0.68)';
    ctx.fillRect(sx, sy, 14 + (s % 3) * 8, 2.2);
  }

  // White surf foam along shoreline edge
  ctx.strokeStyle = 'rgba(240, 253, 250, 0.72)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 24) {
    const wy = roadY - 5 + Math.sin(x * 0.03 + timeSec * 3.5) * 2.5;
    if (x === 0) ctx.moveTo(x, wy);
    else ctx.lineTo(x, wy);
  }
  ctx.stroke();

  // 3. Three Dancing Golden Whistle Melody Staves + Gliding Seagulls across Sky
  for (let r = 0; r < 3; r++) {
    const baseY = h * (0.26 + r * 0.075);
    ctx.strokeStyle = r === 0 ? '#fde047' : r === 1 ? '#5eead4' : 'rgba(255,255,255,0.45)';
    ctx.lineWidth = r === 0 ? 4 : 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 22) {
      const amp = (18 + bands.high * 42 + beat.snarePulse * 22) * Math.sin((x / w) * Math.PI);
      const y = baseY + Math.sin(x * 0.015 - timeSec * 9.5 + r * 1.2) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (let g = 0; g < 5; g++) {
    const gx = ((timeSec * (112 + g * 26) + g * 290) % (w + 140)) - 70;
    const gy = h * (0.2 + g * 0.055) + Math.sin(timeSec * 3.5 + g) * 12;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    const flap = Math.sin(timeSec * 8 + g * 2) * 7;
    ctx.beginPath();
    ctx.moveTo(gx - 13, gy + flap);
    ctx.quadraticCurveTo(gx - 5, gy - 6, gx, gy);
    ctx.quadraticCurveTo(gx + 5, gy - 6, gx + 13, gy + flap);
    ctx.stroke();
  }

  // Midground Acoustic Wave-Spine Lyric (occluded by passing seaside utility poles & wires!)
  renderMidgroundDiegeticLyrics(sc, 'whistle_coastal');

  // 4. Kamakura-Style Seaside Utility Poles, Swaying Overhead Wires & White Coastal Guardrail
  const poleSpan = 460;
  const pOff = (scrollDist * 0.58) % poleSpan;
  for (let px = -pOff - poleSpan; px < w + poleSpan; px += poleSpan) {
    const poleTop = h * 0.18;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px - 4, poleTop, 8, roadY - poleTop);
    ctx.fillRect(px - 20, poleTop + 18, 40, 4);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(px, poleTop + 20);
    ctx.quadraticCurveTo(px + poleSpan * 0.5, poleTop + 54, px + poleSpan, poleTop + 20);
    ctx.stroke();
  }

  // White coastal highway W-beam guardrail
  const railOff = (scrollDist * 0.95) % 64;
  ctx.fillStyle = '#cbd5e1';
  for (let rx = -railOff; rx < w + 64; rx += 64) {
    ctx.fillRect(rx, roadY - 18, 5, 18);
  }
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, roadY - 16, w, 7);

  // Sunlit seaside asphalt road & breezy Traveler + 20" RIMOWA
  const roadGrad = ctx.createLinearGradient(0, roadY, 0, h);
  roadGrad.addColorStop(0, '#162733');
  roadGrad.addColorStop(1, '#09131a');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, roadY, w, h - roadY);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(0, roadY + 2, w, 2.5);

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.62,
    groundY: roadY + 42,
    travelerHeightPx: h * 0.41,
    walkPhase: timeSec * 5.8,
    pose: 'tow_stride',
    rimColor: '#99f6e4',
  });
}

/**
 * 18. timelapse_nostalgia: Wong Kar-Wai Step-Printed City Time-Lapse ("万物都在速朽") vs Golden 35mm Sanctuary ("唯有你念旧")
 */
export function renderTimelapseNostalgiaShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  ctx.fillStyle = '#07070c';
  ctx.fillRect(0, 0, w, h);

  // Distant dark city skyline behind fast-decaying neon trails
  drawDistantCitySkyline(sc, h * 0.72, {
    parallaxPx: timeSec * 220,
    maxTowerHeight: h * 0.45,
    silhouetteHex: '#0d0e18',
    secondarySilhouetteHex: '#131524',
    windowPrimaryHex: '#38bdf8',
    windowSecondaryHex: '#f43f5e',
  });

  // Outer frame: Hyper-speed horizontal long-exposure neon light-trails ("万物都在速朽")
  const colors = ['#38bdf8', '#fb7185', '#c084fc', '#2dd4bf', '#f59e0b'];
  for (let i = 0; i < 42; i++) {
    const sy = (i / 42) * h;
    const speed = 1350 + (i % 5) * 440;
    const sx = ((timeSec * speed + i * 190) % (w + 420)) - 210;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.24;
    roundRectPath(ctx, sx, sy, 230 + (i % 3) * 95, 3.5, 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Center Calm Warm Nostalgic 35mm Brass-Ringed Sanctuary ("唯有你念旧")
  const cx = w * 0.5;
  const cy = h * 0.54;
  const r = Math.min(w, h) * 0.32;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const warmBg = ctx.createRadialGradient(cx, cy - r * 0.2, 10, cx, cy, r);
  warmBg.addColorStop(0, '#523418');
  warmBg.addColorStop(0.62, '#291a0e');
  warmBg.addColorStop(1, '#120c08');
  ctx.fillStyle = warmBg;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Rotating astronomical / vintage timepiece dial marks inside sanctuary
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-timeSec * 0.15);
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
  ctx.stroke();
  for (let m = 0; m < 24; m++) {
    const ma = (m / 24) * Math.PI * 2;
    const inner = m % 2 === 0 ? r * 0.8 : r * 0.83;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ma) * inner, Math.sin(ma) * inner);
    ctx.lineTo(Math.cos(ma) * r * 0.86, Math.sin(ma) * r * 0.86);
    ctx.stroke();
  }
  ctx.restore();

  // Warm cobblestone floor inside sanctuary circle
  const cobbleY = cy + r * 0.58;
  ctx.fillStyle = '#1c130c';
  ctx.fillRect(cx - r, cobbleY, r * 2, r);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)';
  ctx.beginPath();
  ctx.moveTo(cx - r, cobbleY);
  ctx.lineTo(cx + r, cobbleY);
  ctx.stroke();

  drawDetailedXiaohei(sc, {
    cx,
    bottomY: cobbleY + 8,
    scale: 0.9,
    showScuffs: true,
    warmHandleGlow: true,
  });
  ctx.restore();

  // Double brushed-gold optical bezel ring + subtle anamorphic crown glint
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8 + beat.kickPulse * 4, 0, Math.PI * 2);
  ctx.stroke();

  drawAnamorphicFlare(ctx, cx, cy - r, 210, 12, '#fde047', 0.62);
}

/**
 * 19. home_doorway_sun: Sun-Drenched Home Entryway, Walnut Door with Transom Glass, Potted Plant & Polaroids
 */
export function renderHomeDoorwaySunShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const floorY = h * 0.7;

  // 1. Warm afternoon plaster wall + architectural wainscot molding & baseboard
  const wall = ctx.createLinearGradient(0, 0, w, floorY);
  wall.addColorStop(0, '#1f160f');
  wall.addColorStop(0.55, '#332316');
  wall.addColorStop(1, '#24180f');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, floorY);

  // Wainscot chair-rail & timber baseboard
  const railY = floorY - h * 0.18;
  ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
  ctx.fillRect(0, railY, w, 3);
  ctx.fillStyle = '#170f09';
  ctx.fillRect(0, floorY - 12, w, 12);

  // Sunlit walnut-framed linen lyric print on the plaster wall is rendered in diegeticLyrics.ts

  // 2. Paneled Solid-Walnut Front Door + Sunlit Frosted Transom Window on Left
  const doorX = w * 0.19;
  const doorTopY = h * 0.2;
  const doorW = Math.min(188, w * 0.165);
  ctx.fillStyle = '#24160d';
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 3.5;
  roundRectPath(ctx, doorX, doorTopY, doorW, floorY - doorTopY, 6);
  ctx.fill();
  ctx.stroke();

  // Glowing golden frosted transom window at top of door
  const glassGrad = ctx.createLinearGradient(doorX, doorTopY + 14, doorX + doorW, doorTopY + 72);
  glassGrad.addColorStop(0, '#fef08a');
  glassGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = glassGrad;
  roundRectPath(ctx, doorX + 18, doorTopY + 16, doorW - 36, 56, 4);
  ctx.fill();

  // Recessed walnut panels + warm brass handle
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, doorX + 18, doorTopY + 88, doorW - 36, (floorY - doorTopY) * 0.32, 4);
  ctx.stroke();
  roundRectPath(ctx, doorX + 18, doorTopY + (floorY - doorTopY) * 0.58, doorW - 36, (floorY - doorTopY) * 0.32, 4);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(doorX + doorW - 22, doorTopY + (floorY - doorTopY) * 0.53, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Lush Potted Olive / Monstera Houseplant in Terracotta Pot beside Doorway!
  const potX = doorX - 48;
  ctx.fillStyle = '#9a3412';
  ctx.beginPath();
  ctx.moveTo(potX - 24, floorY - 46);
  ctx.lineTo(potX + 24, floorY - 46);
  ctx.lineTo(potX + 17, floorY + 6);
  ctx.lineTo(potX - 17, floorY + 6);
  ctx.closePath();
  ctx.fill();
  for (const [lx, ly, lr, ang] of [
    [-22, -78, 24, -0.5],
    [16, -86, 26, 0.45],
    [-4, -104, 28, -0.1],
    [24, -62, 20, 0.7],
  ]) {
    ctx.save();
    ctx.translate(potX + lx, floorY + ly);
    ctx.rotate(ang + Math.sin(timeSec * 1.4 + lx) * 0.03);
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, lr, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 4. Warm Oak Parquet Floorboards + Woven Jute Welcome Rug + Sunny Floor Patches
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#291a0f');
  floorGrad.addColorStop(1, '#120b06');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.14)';
  ctx.lineWidth = 1.4;
  for (let py = floorY + 18; py < h; py += 26) {
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }

  // Woven oatmeal jute entryway rug
  ctx.fillStyle = 'rgba(214, 190, 150, 0.18)';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
  roundRectPath(ctx, doorX - 10, floorY + 10, doorW + 195, 36, 12);
  ctx.fill();
  ctx.stroke();

  // Golden Slanted Afternoon Window Sunbeams streaming across doorway & Xiaohei
  drawTyndallGodRays(ctx, doorX + doorW * 0.5, doorTopY + 36, 5, Math.PI * 0.34, 0.38, h * 0.95, '253, 224, 71', 0.22);

  // 5. Xiaohei Resting Peacefully Beside the Front Door (handle retracted low!)
  drawDetailedXiaohei(sc, {
    cx: doorX + doorW + 96,
    bottomY: floorY + 24,
    scale: 0.88,
    handleRatio: 0.1,
    showScuffs: true,
    warmHandleGlow: true,
  });

  // 6. Floating Polaroid Snapshots of Past Journeys ("那些旧日风景 全都不忘")
  const polaroidPalettes = [
    { sky: '#f59e0b', land: '#1c1917', cap: 'BRIDGE · 2019' },
    { sky: '#38bdf8', land: '#0f172a', cap: 'AIRPORT · 2021' },
    { sky: '#2dd4bf', land: '#134e4a', cap: 'COAST · 2023' },
    { sky: '#fb7185', land: '#31102f', cap: 'SUNSET · 2025' },
  ];
  for (let m = 0; m < 4; m++) {
    const px = w * (0.51 + (m % 2) * 0.13) + Math.sin(timeSec * 1.1 + m) * 9;
    const py = h * (0.39 + Math.floor(m / 2) * 0.2) + Math.cos(timeSec * 0.9 + m) * 7;
    const pal = polaroidPalettes[m];
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((m % 2 === 0 ? -0.11 : 0.13) + Math.sin(timeSec + m) * 0.035);
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    roundRectPath(ctx, -38, -44, 82, 96, 4);
    ctx.fill();
    ctx.fillStyle = '#fefce8';
    roundRectPath(ctx, -41, -48, 82, 96, 4);
    ctx.fill();
    ctx.fillStyle = pal.sky;
    ctx.fillRect(-34, -40, 68, 58);
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(14, -22, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.land;
    ctx.beginPath();
    ctx.moveTo(-34, 18);
    ctx.lineTo(-12, -5);
    ctx.lineTo(10, 7);
    ctx.lineTo(25, -4);
    ctx.lineTo(34, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#44403c';
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(pal.cap, 0, 34);
    ctx.restore();
  }

  drawCinemaBokeh(sc, 16, '#fde047', '#f59e0b', 1.25);
}

/**
 * 20. nametag_dream_macro: Luxury Saddle-Stitched Cognac Bridle-Leather Luggage Tag over Blurred Grooved RIMOWA
 */
export function renderNametagDreamMacroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  // Warm dark mahogany-amber studio bokeh backdrop
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.52, 40, w * 0.5, h * 0.52, w * 0.72);
  bg.addColorStop(0, '#2e1b0e');
  bg.addColorStop(0.58, '#120c09');
  bg.addColorStop(1, '#060505');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Out-of-focus matte-black grooved RIMOWA top shell + chrome handle lug at top
  ctx.fillStyle = '#14141a';
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.25)';
  ctx.lineWidth = 2;
  roundRectPath(ctx, w * 0.16, -40, w * 0.68, h * 0.34, 34);
  ctx.fill();
  ctx.stroke();

  drawCinemaBokeh(sc, 24, '#fbbf24', '#fb7185', 1.55);

  const cx = w * 0.5;
  const cy = h * 0.54;
  const swing = Math.sin(timeSec * 1.8) * 0.055;

  // Brushed chrome D-ring anchor at top
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 6;
  roundRectPath(ctx, cx - 26, cy - 235, 52, 24, 10);
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy - 155);
  ctx.rotate(swing);

  // Stitched Cognac Leather Strap Loop
  const strapGrad = ctx.createLinearGradient(-10, -80, 10, 50);
  strapGrad.addColorStop(0, '#7c2d12');
  strapGrad.addColorStop(0.5, '#9a3412');
  strapGrad.addColorStop(1, '#451a03');
  ctx.strokeStyle = strapGrad;
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -76);
  ctx.lineTo(0, 52);
  ctx.stroke();

  // Saddle-Stitched Cognac Bridle-Leather Name Tag Body (sized to frame live 24K gold embossed lyric window)
  const tagW = 396;
  const tagH = 204;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  roundRectPath(ctx, -tagW * 0.5 + 8, 48, tagW, tagH, 20);
  ctx.fill();

  const leatherGrad = ctx.createLinearGradient(-tagW * 0.5, 40, tagW * 0.5, 40 + tagH);
  leatherGrad.addColorStop(0, '#6c2b0e');
  leatherGrad.addColorStop(0.5, '#451a03');
  leatherGrad.addColorStop(1, '#290f02');
  ctx.fillStyle = leatherGrad;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.6;
  roundRectPath(ctx, -tagW * 0.5, 40, tagW, tagH, 20);
  ctx.fill();
  ctx.stroke();

  // Cream-gold wax-thread saddle stitching
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.6;
  roundRectPath(ctx, -tagW * 0.5 + 11, 51, tagW - 22, tagH - 22, 13);
  ctx.stroke();
  ctx.setLineDash([]);

  // Polished brass rivet + grommet
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, 65, 9 + beat.kickPulse * 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(0, 65, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Dark-Ebony Name Card Window (center line at y = 152 receives the live 24K gold foil lyric from diegeticLyrics.ts)
  ctx.fillStyle = '#141110';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.48)';
  ctx.lineWidth = 1.4;
  roundRectPath(ctx, -tagW * 0.5 + 24, 88, tagW - 48, 108, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('20" ORIGINAL CABIN · COMPANION', 0, 110);

  ctx.fillStyle = 'rgba(214, 211, 209, 0.78)';
  ctx.font = '600 10px "Outfit", sans-serif';
  ctx.fillText('CARRYING MY NAME & OLD DREAMS', 0, 184);

  drawAnamorphicFlare(ctx, 32, 88, 180, 10, '#fde047', 0.65);
  ctx.restore();
}

/**
 * 21. sunset_horizon_outro: Salar de Uyuni Mirror-Sky Twilight Finale with Evening Stars, Backlit Clouds & Ripples
 */
export function renderSunsetHorizonOutroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const horizonY = h * 0.64;

  // 1. Breathtaking cosmos-indigo -> violet -> rose-crimson -> molten gold horizon sky
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#050712');
  sky.addColorStop(0.32, '#1d1532');
  sky.addColorStop(0.64, '#591c2f');
  sky.addColorStop(0.86, '#b44218');
  sky.addColorStop(1, '#fde047');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  drawStarfieldAndClouds(sc, horizonY, {
    starCount: 52,
    cloudShadowHex: '#251733',
    cloudMidHex: '#6e252c',
    cloudRimHex: '#fef08a',
    driftSpeed: 6,
  });

  // Molten setting sun half-disc + crepuscular rays + golden anamorphic flare on horizon
  const sunR = Math.min(w, h) * 0.135;
  drawTyndallGodRays(ctx, w * 0.5, horizonY, 7, -Math.PI * 0.5, 1.1, h * 0.65, '254, 240, 138', 0.16);

  const sunGrad = ctx.createRadialGradient(w * 0.5, horizonY, sunR * 0.1, w * 0.5, horizonY, sunR * 1.4);
  sunGrad.addColorStop(0, '#ffffff');
  sunGrad.addColorStop(0.55, '#fef08a');
  sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(w * 0.5, horizonY, sunR * 1.4, Math.PI, Math.PI * 2);
  ctx.fill();

  // 2. Salar de Uyuni Mirror Salt-Flat Reflection Below Horizon
  const mirror = ctx.createLinearGradient(0, horizonY, 0, h);
  mirror.addColorStop(0, '#782d12');
  mirror.addColorStop(0.28, '#361624');
  mirror.addColorStop(0.68, '#140e1f');
  mirror.addColorStop(1, '#06060c');
  ctx.fillStyle = mirror;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Shimmering molten sun reflection column + gentle horizontal water ripples
  const sunPath = ctx.createLinearGradient(0, horizonY, 0, h);
  sunPath.addColorStop(0, 'rgba(254, 240, 138, 0.52)');
  sunPath.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
  sunPath.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = sunPath;
  ctx.beginPath();
  ctx.moveTo(w * 0.5 - sunR * 0.85, horizonY);
  ctx.lineTo(w * 0.5 + sunR * 0.85, horizonY);
  ctx.lineTo(w * 0.5 + sunR * 0.25, h);
  ctx.lineTo(w * 0.5 - sunR * 0.25, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(254, 240, 138, 0.22)';
  ctx.lineWidth = 1.2;
  for (let r = 1; r <= 8; r++) {
    const ry = horizonY + r * r * 3.6;
    if (ry > h) break;
    const rw = sunR * (1.2 - r * 0.08) + Math.sin(timeSec * 2 + r) * 14;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - rw, ry);
    ctx.lineTo(w * 0.5 + rw, ry);
    ctx.stroke();
  }

  drawAnamorphicFlare(ctx, w * 0.5, horizonY, w * 0.68, sunR * 0.45, '#fde047', 0.85);

  // 3. Coupled Traveler & 20" RIMOWA Walking Peacefully Into the Golden Dusk with Mirror Salt-Flat Reflection!
  const outroProg = Math.min(1, Math.max(0, (timeSec - 197.5) / 14.5));
  const distScale = 0.95 - outroProg * 0.24;
  const figY = horizonY + 36 - outroProg * 16;

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.53,
    groundY: figY,
    travelerHeightPx: h * 0.36 * distScale,
    walkPhase: timeSec * 4.2,
    pose: 'tow_stride',
    rimColor: '#fef08a',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.36,
  });

  drawCinemaBokeh(sc, 16, '#fde047', '#fb7185', 0.95);
}
