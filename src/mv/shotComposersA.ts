import { TRAVEL_STICKERS } from './mvData';
import { clamp01 } from './mvTimeline';
import {
  drawCinemaBokeh,
  drawDetailedXiaohei,
  drawPriorityCard,
  drawTravelerSilhouette,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * 01. guitar_macro: Acoustic guitar rosewood soundboard, mosaic rosette & vibrating strings
 */
export function renderGuitarMacroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat, bands } = sc;

  // Warm studio amber-mahogany vignette
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#090707');
  bg.addColorStop(0.55, '#1f120b');
  bg.addColorStop(1, '#09090b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Soundhole & concentric mosaic rosette
  const holeX = w * 0.44;
  const holeY = h * 0.56;
  const holeR = Math.min(w, h) * (0.21 + beat.kickPulse * 0.015);

  ctx.fillStyle = '#050404';
  ctx.beginPath();
  ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 1; i <= 4; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(245, 158, 11, 0.55)' : 'rgba(212, 212, 216, 0.22)';
    ctx.lineWidth = i === 2 ? 4 : 1.5;
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeR + i * 11, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rosewood bridge on right
  ctx.fillStyle = '#140c08';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  roundRectPath(ctx, w * 0.74, holeY - holeR * 0.88, 38, holeR * 1.76, 8);
  ctx.fill();
  ctx.stroke();

  // 6 Phosphor-Bronze Strings vibrating dynamically
  for (let s = 0; s < 6; s++) {
    const sy = holeY - holeR * 0.62 + (s / 5) * holeR * 1.24;
    const pluckAmp =
      (timeSec > 3.1 ? 1 : 0.2) *
      (beat.kickPulse * 24 + beat.snarePulse * 18 + bands.mid * 16) *
      (s < 3 ? 1.15 : 0.8);

    ctx.strokeStyle = s < 3 ? '#fbbf24' : '#e4e4e7';
    ctx.lineWidth = 3.6 - s * 0.4;
    ctx.beginPath();
    ctx.moveTo(0, sy - 18);
    for (let x = 0; x <= w * 0.75; x += 28) {
      const env = Math.sin((x / (w * 0.75)) * Math.PI);
      const dy = Math.sin(x * 0.03 + timeSec * 34 + s * 1.2) * pluckAmp * env;
      ctx.lineTo(x, sy - 18 * (1 - x / (w * 0.75)) + dy);
    }
    ctx.stroke();

    // Bridge pin
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(w * 0.758, sy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Percussive slap shock-ring on beat
  if (beat.kickPulse > 0.25) {
    ctx.strokeStyle = `rgba(251, 191, 36, ${(beat.kickPulse * 0.55).toFixed(3)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeR * (1.15 + beat.beatPhase * 0.7), 0, Math.PI * 2);
    ctx.stroke();
  }

  drawCinemaBokeh(sc, 14, '#f59e0b', '#fef08a', 1.2);
}

/**
 * 02. traveler_wide: Sweeping golden-hour suspension viaduct with Traveler & Xiaohei walking side-by-side
 */
export function renderTravelerWideShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec, chapter, beat } = sc;
  const horizonY = h * 0.65;

  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#090d16');
  sky.addColorStop(0.48, '#261b2e');
  sky.addColorStop(0.82, '#7c2d12');
  sky.addColorStop(1, '#f59e0b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Glowing sunset orb
  const sunX = w * 0.72;
  const sunY = horizonY - h * 0.14;
  const sunR = Math.min(w, h) * 0.11;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.15, sunX, sunY, sunR * 2.5);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.92)');
  sunGlow.addColorStop(0.45, 'rgba(245, 158, 11, 0.35)');
  sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Layered distant mountains & suspension bridge towers
  ctx.fillStyle = '#121320';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  for (let x = 0; x <= w + 80; x += 80) {
    const wx = x + scrollDist * 0.14;
    const mh = (Math.sin(wx * 0.004) * 0.4 + Math.cos(wx * 0.009) * 0.3 + 0.8) * h * 0.12;
    ctx.lineTo(x, horizonY - mh);
  }
  ctx.lineTo(w, horizonY);
  ctx.closePath();
  ctx.fill();

  // Suspension bridge cables slicing sky
  const spanW = 540;
  const bOff = (scrollDist * 0.38) % spanW;
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)';
  ctx.lineWidth = 2;
  for (let tx = -bOff; tx < w + spanW; tx += spanW) {
    ctx.fillStyle = '#181824';
    ctx.fillRect(tx - 8, horizonY - h * 0.34, 16, h * 0.34);
    ctx.beginPath();
    ctx.moveTo(tx, horizonY - h * 0.33);
    ctx.quadraticCurveTo(tx + spanW * 0.5, horizonY - h * 0.04, tx + spanW, horizonY - h * 0.33);
    ctx.stroke();
  }

  // Distant flock of birds
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.6)';
  ctx.lineWidth = 1.6;
  for (let b = 0; b < 5; b++) {
    const bx = ((w * 0.22 + b * 28 + timeSec * 24) % (w * 0.8)) + w * 0.1;
    const by = h * 0.28 + Math.sin(b * 1.9 + timeSec * 4) * 8;
    const wing = Math.sin(timeSec * 9 + b) * 5;
    ctx.beginPath();
    ctx.moveTo(bx - 7, by + wing);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + 7, by + wing);
    ctx.stroke();
  }

  // Viaduct deck
  ctx.fillStyle = '#0e0f17';
  ctx.fillRect(0, horizonY, w, h - horizonY);
  ctx.fillStyle = chapter.accentHex;
  ctx.fillRect(0, horizonY, w, 2.5);

  // Traveler & Xiaohei walking side-by-side in stride!
  const walkY = horizonY + (h - horizonY) * 0.28;
  const walkPhase = timeSec * 6.4;
  drawDetailedXiaohei(sc, {
    cx: w * 0.43,
    bottomY: walkY - Math.abs(Math.sin(beat.beatPhase * Math.PI)) * 6,
    scale: 0.78,
    tilt: 0.09,
    handleRatio: 0.38,
  });
  drawTravelerSilhouette(ctx, w * 0.54, walkY, h * 0.31, walkPhase, chapter.accentHex);

  // Foreground bridge railing posts rushing past (depth parallax!)
  const railSpan = 240;
  const rOff = (scrollDist * 1.45) % railSpan;
  ctx.fillStyle = 'rgba(9, 9, 11, 0.72)';
  ctx.fillRect(0, h * 0.83, w, 8);
  for (let rx = -rOff; rx < w + railSpan; rx += railSpan) {
    ctx.fillRect(rx, h * 0.78, 12, h * 0.22);
  }
}

/**
 * 03. boots_wheels_low: Extreme ground-level tracking shot of spinning wheels & mileage ruler ("小小的滚轮 丈量从前")
 */
export function renderBootsWheelsLowShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, wheelAngle, timeSec, chapter, beat } = sc;
  const roadTop = h * 0.56;

  // Low-angle dramatic sky
  const sky = ctx.createLinearGradient(0, 0, 0, roadTop);
  sky.addColorStop(0, '#07090f');
  sky.addColorStop(1, chapter.id === 'verse2' ? '#0f2942' : '#3b1d11');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, roadTop);

  // Asphalt road surface
  const road = ctx.createLinearGradient(0, roadTop, 0, h);
  road.addColorStop(0, '#14161f');
  road.addColorStop(1, '#08090d');
  ctx.fillStyle = road;
  ctx.fillRect(0, roadTop, w, h - roadTop);

  // Glowing Golden Odometer / Ruler Scale painted along road ("丈量从前")
  const rulerY = roadTop + (h - roadTop) * 0.46;
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, rulerY);
  ctx.lineTo(w, rulerY);
  ctx.stroke();

  const tickStep = 44;
  const tickShift = (scrollDist * 1.2) % tickStep;
  const baseTickIdx = Math.floor((scrollDist * 1.2) / tickStep);
  ctx.font = '700 11px "JetBrains Mono", monospace';
  ctx.fillStyle = chapter.accentHex;
  ctx.textAlign = 'center';

  for (let i = -1; i <= Math.ceil(w / tickStep) + 1; i++) {
    const tx = i * tickStep - tickShift;
    const idx = baseTickIdx + i;
    const isMajor = idx % 5 === 0;
    const th = isMajor ? 20 : 9;
    ctx.beginPath();
    ctx.moveTo(tx, rulerY);
    ctx.lineTo(tx, rulerY + th);
    ctx.stroke();
    if (isMajor) {
      const kmVal = 1200 + Math.abs(idx) * 10;
      ctx.fillText(`${kmVal} KM`, tx, rulerY + 34);
    }
  }
  ctx.globalAlpha = 1;

  // Giant Close-up Lower Corner of Xiaohei + Two Dual-Caster Wheels!
  const shellTopY = h * 0.28;
  const wheelY = rulerY - 26 - beat.kickPulse * 8;
  const caseBottomY = wheelY - 26;
  const shellX = w * 0.13;
  const shellW = w * 0.36;

  ctx.fillStyle = '#18181c';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  roundRectPath(ctx, shellX, shellTopY, shellW, caseBottomY - shellTopY, 24);
  ctx.fill();
  ctx.stroke();

  // Armored corner bumper guards on lower corners
  ctx.fillStyle = '#27272a';
  roundRectPath(ctx, shellX - 3, caseBottomY - 34, 42, 36, 12);
  ctx.fill();
  roundRectPath(ctx, shellX + shellW - 39, caseBottomY - 34, 42, 36, 12);
  ctx.fill();

  // Vertical ribs on close-up lower shell
  for (let r = 1; r <= 4; r++) {
    const rx = shellX + (shellW * r) / 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.11)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(rx, shellTopY + 20);
    ctx.lineTo(rx, caseBottomY - 14);
    ctx.stroke();
  }

  // Subtle metallic badge plate on lower shell
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, shellX + shellW - 126, shellTopY + 24, 102, 24, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = chapter.accentHex;
  ctx.font = '700 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('20" CABIN PRO', shellX + shellW - 75, shellTopY + 39);

  const wheelXs = [shellX + shellW * 0.22, shellX + shellW * 0.78];
  for (const wx of wheelXs) {
    // Caster fork housing
    ctx.fillStyle = '#27272a';
    roundRectPath(ctx, wx - 18, caseBottomY - 6, 36, 28, 6);
    ctx.fill();

    // Big detailed spinning wheel
    ctx.save();
    ctx.translate(wx, wheelY + 6);
    ctx.rotate(wheelAngle * 1.35);
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = chapter.accentHex;
    ctx.lineWidth = 4;
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 22, Math.sin(a) * 22);
      ctx.stroke();
    }
    ctx.restore();

    // Wheel spark / water-spray trail flying left
    ctx.strokeStyle = chapter.accentHex;
    ctx.lineWidth = 2.2;
    for (let sp = 0; sp < 4; sp++) {
      const sx = wx - 36 - ((timeSec * 280 + sp * 34) % 110);
      const sy = wheelY + 24 - sp * 6;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 22, sy - 4);
      ctx.stroke();
    }
  }

  // Traveler's Full Striding Coat Hem, Legs & Boots on the right side of the frame
  const hipX = w * 0.72;
  const hipY = h * 0.3;
  for (const legIdx of [0, 1]) {
    const phase = timeSec * 6.8 + legIdx * Math.PI;
    const stride = Math.sin(phase);
    const lift = Math.max(0, -Math.cos(phase)) * 26;
    const footX = hipX + stride * 48;
    const footY = rulerY - 6 - lift;

    ctx.save();
    ctx.globalAlpha = legIdx === 0 ? 0.55 : 1;
    // Tailored trouser leg from hip down to ankle
    ctx.strokeStyle = legIdx === 0 ? '#14141d' : '#1e1e2a';
    ctx.lineWidth = 38;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hipX, hipY + 34);
    ctx.quadraticCurveTo(hipX + stride * 18, (hipY + footY) * 0.52, footX - 8, footY - 18);
    ctx.stroke();

    // Boot & glowing sole edge
    ctx.translate(footX, footY);
    ctx.rotate(stride * 0.16);
    ctx.fillStyle = '#121218';
    ctx.strokeStyle = chapter.accentHex;
    ctx.lineWidth = 2.2;
    roundRectPath(ctx, -36, -28, 86, 28, 9);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Flowing trench coat lower hem above legs
  ctx.fillStyle = '#161622';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hipX - 64, hipY - 16);
  ctx.lineTo(hipX + 54, hipY - 16);
  ctx.lineTo(hipX + 68, hipY + 72);
  ctx.lineTo(hipX - 78 - Math.sin(timeSec * 6.8) * 12, hipY + 66);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * 04. scuffed_shell_closeup: Grazing studio rim-light macro across weathered matte-black shell ("告别褪去的颜")
 */
export function renderScuffedShellCloseup(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  ctx.fillStyle = '#09090c';
  ctx.fillRect(0, 0, w, h);

  // Diagonal molded polycarbonate ribs positioned cleanly inside stage safe-zone
  ctx.save();
  ctx.translate(w * 0.5, h * 0.55);
  ctx.rotate(-0.11);

  const plateW = w * 0.78;
  const plateH = h * 0.48;
  const grad = ctx.createLinearGradient(-plateW * 0.5, -plateH * 0.5, plateW * 0.5, plateH * 0.5);
  grad.addColorStop(0, '#2c2c34');
  grad.addColorStop(0.5, '#151519');
  grad.addColorStop(1, '#09090b');
  ctx.fillStyle = grad;
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  roundRectPath(ctx, -plateW * 0.5, -plateH * 0.5, plateW, plateH, 32);
  ctx.fill();
  ctx.stroke();

  // Deep architectural ribs
  for (let i = -3; i <= 3; i++) {
    const rx = i * (plateW / 8);
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    roundRectPath(ctx, rx - 16, -plateH * 0.42, 32, plateH * 0.84, 12);
    ctx.fill();
  }

  // Sweeping golden grazing light beam revealing silver-gold travel scuffs ("旧勋章的痕 / 褪去的颜")
  const sweepX = ((timeSec * 0.28) % 1.4 - 0.7) * plateW;
  const lightGrad = ctx.createLinearGradient(sweepX - 160, 0, sweepX + 160, 0);
  lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
  lightGrad.addColorStop(0.5, `rgba(251, 191, 36, ${(0.22 + beat.kickPulse * 0.18).toFixed(3)})`);
  lightGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = lightGrad;
  roundRectPath(ctx, -plateW * 0.5, -plateH * 0.5, plateW, plateH, 32);
  ctx.fill();

  // Fine weathered travel scratches catching the light
  const scratches = [
    [-220, -80, -110, -40],
    [-40, 28, 120, -14],
    [90, 82, 240, 52],
    [-190, 70, -60, 98],
    [30, -90, 185, -62],
  ];
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.52)';
  ctx.lineWidth = 2;
  for (const [x1, y1, x2, y2] of scratches) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // TSA Combination Dial Lock Macro on upper edge
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2;
  roundRectPath(ctx, -95, -plateH * 0.5 - 12, 190, 36, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = chapter.accentHex;
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TSA · 2 0 2 6', 0, -plateH * 0.5 + 10);

  ctx.restore();
}

/**
 * 05. priority_tags_macro: Stacked weathered Airline PRIORITY baggage tags & medal stamps ("看斑驳堆叠 那些优先卡")
 */
export function renderPriorityTagsMacro(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  ctx.fillStyle = '#0c0c10';
  ctx.fillRect(0, 0, w, h);

  // Subtle ribbed suitcase texture background
  for (let x = 0; x < w; x += 92) {
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    ctx.fillRect(x, 0, 38, h);
  }

  const cardPositions = [
    { rx: 0.28, ry: 0.36, rot: -0.22 },
    { rx: 0.71, ry: 0.35, rot: 0.18 },
    { rx: 0.31, ry: 0.63, rot: 0.12 },
    { rx: 0.69, ry: 0.64, rot: -0.15 },
    { rx: 0.5, ry: 0.5, rot: -0.05 },
  ];

  cardPositions.forEach((pos, idx) => {
    const spec = TRAVEL_STICKERS[idx % TRAVEL_STICKERS.length];
    const pop = idx === 4 ? 1 + beat.kickPulse * 0.08 : 1;
    const flutter = Math.sin(timeSec * 3.2 + idx) * 0.025;
    drawPriorityCard(
      ctx,
      w * pos.rx,
      h * pos.ry,
      270 * pop,
      108 * pop,
      pos.rot + flutter,
      spec.code,
      spec.label,
      spec.year,
      spec.bg,
      spec.fg
    );
  });

  // Glowing Medal Star Seal in center foreground ("攒下勋章")
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.28 + beat.kickPulse * 0.45;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 175 + beat.kickPulse * 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * 06. open_suitcase: Overhead architectural flat-lay of Xiaohei unzipped wide open ("装满半生俗世 / 装满这旧梦")
 */
export function renderOpenSuitcaseShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  ctx.fillStyle = '#0e0c10';
  ctx.fillRect(0, 0, w, h);

  const halfW = Math.min(w * 0.36, 360);
  const boxH = Math.min(h * 0.56, 430);
  const cy = h * 0.54;
  const gap = 18;

  // Center spine hinge
  ctx.fillStyle = '#27272a';
  roundRectPath(ctx, w * 0.5 - 10, cy - boxH * 0.46, 20, boxH * 0.92, 6);
  ctx.fill();

  // Left Shell Half (Zippered Mesh Pocket with Boarding Passes & Letters)
  const leftX = w * 0.5 - gap - halfW;
  ctx.fillStyle = '#18181f';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  roundRectPath(ctx, leftX, cy - boxH * 0.5, halfW, boxH, 24);
  ctx.fill();
  ctx.stroke();

  // Inner lining border
  ctx.fillStyle = '#22202a';
  roundRectPath(ctx, leftX + 16, cy - boxH * 0.5 + 16, halfW - 32, boxH - 32, 16);
  ctx.fill();

  // Tucked Letters, Tickets & Map inside left mesh
  drawPriorityCard(
    ctx,
    leftX + halfW * 0.48,
    cy - boxH * 0.18,
    halfW * 0.68,
    74,
    -0.09,
    'BOARDING',
    '半生旅途车票与信笺',
    '2018-26',
    '#fef3c7',
    '#18181b'
  );
  drawPriorityCard(
    ctx,
    leftX + halfW * 0.54,
    cy + boxH * 0.18,
    halfW * 0.64,
    70,
    0.08,
    'MEMORIES',
    '未寄出的明信片',
    'OLD DAYS',
    '#f59e0b',
    '#09090b'
  );

  // Diagonal mesh grid over left compartment
  ctx.strokeStyle = 'rgba(255,255,255,0.09)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let d = 24; d < halfW - 24; d += 26) {
    ctx.moveTo(leftX + d, cy - boxH * 0.5 + 20);
    ctx.lineTo(leftX + d, cy + boxH * 0.5 - 20);
  }
  ctx.stroke();

  // Right Shell Half (Curated Life Artifacts + Elastic Cross-Straps)
  const rightX = w * 0.5 + gap;
  ctx.fillStyle = '#18181f';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  roundRectPath(ctx, rightX, cy - boxH * 0.5, halfW, boxH, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#22202a';
  roundRectPath(ctx, rightX + 16, cy - boxH * 0.5 + 16, halfW - 32, boxH - 32, 16);
  ctx.fill();

  // Packed folded warm sweater/scarf block
  ctx.fillStyle = '#3f2e21';
  roundRectPath(ctx, rightX + 34, cy - boxH * 0.4, halfW - 68, boxH * 0.34, 12);
  ctx.fill();

  // Vintage Rangefinder Film Camera inside right compartment
  const camX = rightX + halfW * 0.38;
  const camY = cy + boxH * 0.18;
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2.2;
  roundRectPath(ctx, camX - 48, camY - 30, 96, 60, 8);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(camX + 6, camY + 2, 20 + beat.kickPulse * 2, 0, Math.PI * 2);
  ctx.strokeStyle = chapter.accentHex;
  ctx.stroke();

  // Notebook & Keys beside camera
  ctx.fillStyle = '#78350f';
  roundRectPath(ctx, rightX + halfW * 0.66, cy + boxH * 0.04, 68, 92, 6);
  ctx.fill();

  // Elastic X-Compression Straps with Center Buckle
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(rightX + 24, cy - boxH * 0.44);
  ctx.lineTo(rightX + halfW - 24, cy + boxH * 0.44);
  ctx.moveTo(rightX + halfW - 24, cy - boxH * 0.44);
  ctx.lineTo(rightX + 24, cy + boxH * 0.44);
  ctx.stroke();

  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  roundRectPath(ctx, rightX + halfW * 0.5 - 20, cy - 14, 40, 28, 5);
  ctx.fill();
  ctx.stroke();

  // Floating warm golden memory motes rising out of the open suitcase
  drawCinemaBokeh(sc, 16, '#fbbf24', '#fb7185', 1.4 + Math.sin(timeSec * 2) * 0.2);
}

/**
 * 07. crossroads_pov: First-Person POV rushing through misty highway / neon gantry signs ("未来的去向何方 / 前路跌撞迷茫")
 */
export function renderCrossroadsPovShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, chapter, beat } = sc;
  const vx = w * 0.5;
  const vy = h * 0.48;

  const sky = ctx.createLinearGradient(0, 0, 0, vy);
  sky.addColorStop(0, '#07070c');
  sky.addColorStop(1, '#1e1b2e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, vy);

  ctx.fillStyle = '#0d0d14';
  ctx.fillRect(0, vy, w, h - vy);

  // Converging multi-lane highway lines
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2.5;
  for (const laneAngle of [-0.65, -0.25, 0.25, 0.65]) {
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + laneAngle * w, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Zooming Overhead Highway Directional Gantries ("远方 ? · 未知 ↗")
  const labels = ['↖ 未知远方', '未来何方 ↗', '↖ 迷雾前路', '继续向前 ↑'];
  for (let i = 0; i < 4; i++) {
    const prog = ((i / 4 + (scrollDist * 0.0016) % 1) % 1);
    const p = prog * prog;
    if (p < 0.04) continue;
    const gw = w * (0.16 + p * 1.05);
    const gy = vy - h * (0.06 + p * 0.38);
    const alpha = clamp01(prog * 1.4) * 0.85;

    ctx.strokeStyle = `rgba(161, 161, 170, ${(alpha * 0.5).toFixed(3)})`;
    ctx.lineWidth = 2 + p * 5;
    ctx.beginPath();
    ctx.moveTo(vx - gw * 0.5, vy + p * (h - vy));
    ctx.lineTo(vx - gw * 0.5, gy);
    ctx.lineTo(vx + gw * 0.5, gy);
    ctx.lineTo(vx + gw * 0.5, vy + p * (h - vy));
    ctx.stroke();

    // Illuminated green/teal highway sign board
    const signW = gw * 0.46;
    const signH = Math.max(18, 52 * p);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#064e3b';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.8;
    roundRectPath(ctx, vx - signW * 0.5, gy - signH * 0.2, signW, signH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ecfdf5';
    ctx.font = `700 ${Math.max(9, Math.round(20 * p))}px "Noto Sans SC", "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i % labels.length], vx, gy + signH * 0.3);
    ctx.restore();
  }

  // First-person foreground: Xiaohei's top handle & traveler's steady hand at bottom center!
  const fgY = h * 0.78 - beat.kickPulse * 8;
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(vx - 58, h);
  ctx.lineTo(vx - 58, fgY);
  ctx.moveTo(vx + 58, h);
  ctx.lineTo(vx + 58, fgY);
  ctx.stroke();

  ctx.fillStyle = '#18181b';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  roundRectPath(ctx, vx - 76, fgY - 14, 152, 22, 9);
  ctx.fill();
  ctx.stroke();
}

/**
 * 08. chorus_hero_low: Monumental low-angle Dutch-tilt hero silhouette against giant blazing sun
 */
export function renderChorusHeroLowShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;
  const ledgeY = h * 0.7;

  const sky = ctx.createLinearGradient(0, 0, 0, ledgeY);
  sky.addColorStop(0, '#140707');
  sky.addColorStop(0.5, chapter.id === 'chorus2' ? '#0e2a47' : '#7c2d12');
  sky.addColorStop(1, chapter.accentHex);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, ledgeY);

  // Giant Blazing Eclipse Sun Halo directly behind protagonists
  const sunR = Math.min(w, h) * (0.28 + beat.kickPulse * 0.04);
  const sunX = w * 0.5;
  const sunY = ledgeY - sunR * 0.45;

  ctx.fillStyle = 'rgba(254, 240, 138, 0.92)';
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  // Rotating sunburst beams
  ctx.save();
  ctx.translate(sunX, sunY);
  ctx.rotate(timeSec * 0.45);
  for (let r = 0; r < 16; r++) {
    if (r % 2 !== 0) continue;
    ctx.fillStyle = `rgba(250, 204, 21, ${(0.12 + beat.kickPulse * 0.16).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, Math.max(w, h), (r / 16) * Math.PI * 2, ((r + 0.5) / 16) * Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Slanted rooftop overpass silhouette
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.moveTo(0, ledgeY + 28);
  ctx.lineTo(w, ledgeY - 24);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, ledgeY + 28);
  ctx.lineTo(w, ledgeY - 24);
  ctx.stroke();

  // Heroic Duo Silhouette on Overpass Crest
  drawDetailedXiaohei(sc, {
    cx: w * 0.44,
    bottomY: ledgeY + 4 - beat.kickPulse * 12,
    scale: 0.92,
    tilt: 0.08,
    warmHandleGlow: true,
  });
  drawTravelerSilhouette(
    ctx,
    w * 0.57,
    ledgeY - 2,
    h * 0.36,
    timeSec * 8.5,
    '#fef08a'
  );
}

/**
 * 09. split_triptych: 3-Panel Diagonal Editorial Montage ("替我装，替我扛")
 */
export function renderSplitTriptychShot(sc: ShotContext): void {
  const { ctx, w, h, wheelAngle, timeSec, chapter, beat } = sc;

  ctx.fillStyle = '#070709';
  ctx.fillRect(0, 0, w, h);

  const slant = w * 0.045;
  const x1 = w * 0.34;
  const x2 = w * 0.67;

  // Active beat spotlight panel highlight
  const activePanel = beat.beatInBar % 3;

  // --- PANEL 1 (LEFT): "替我装" (Compression Straps Packing Memories) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x1 + slant, 0);
  ctx.lineTo(x1 - slant, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = activePanel === 0 ? '#1f160c' : '#121016';
  ctx.fillRect(0, 0, x1 + slant, h);

  // Cross straps cinching tight
  const cinch = 1 - beat.kickPulse * 0.08;
  ctx.save();
  ctx.translate(x1 * 0.5, h * 0.52);
  ctx.scale(cinch, cinch);
  ctx.fillStyle = '#27272a';
  roundRectPath(ctx, -110, -145, 220, 290, 20);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(-90, -125);
  ctx.lineTo(90, 125);
  ctx.moveTo(90, -125);
  ctx.lineTo(-90, 125);
  ctx.stroke();
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 28px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('装', 0, 10);
  ctx.restore();
  ctx.restore();

  // --- PANEL 2 (CENTER): "替我扛" (Xiaohei Absorbing Heavy Storm/Weight) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1 + slant + 8, 0);
  ctx.lineTo(x2 + slant, 0);
  ctx.lineTo(x2 - slant, h);
  ctx.lineTo(x1 - slant + 8, h);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = activePanel === 1 ? '#23110d' : '#141118';
  ctx.fillRect(x1 - slant, 0, x2 - x1 + slant * 2, h);

  // Downward pressure arrows / heavy rain deflected by golden shield arc
  const midX = (x1 + x2) * 0.5;
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(midX, h * 0.56, 130 + beat.kickPulse * 16, Math.PI * 1.12, Math.PI * 1.88);
  ctx.stroke();

  drawDetailedXiaohei(sc, {
    cx: midX,
    bottomY: h * 0.72,
    scale: 0.82,
    tilt: 0,
    handleRatio: 0.2,
  });
  ctx.restore();

  // --- PANEL 3 (RIGHT): "破风闯" (Spinning Caster Wheel & Sparks) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x2 + slant + 8, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(x2 - slant + 8, h);
  ctx.closePath();
  ctx.clip();

  ctx.fillStyle = activePanel === 2 ? '#122029' : '#0f131c';
  ctx.fillRect(x2 - slant, 0, w - x2 + slant, h);

  const p3x = x2 + (w - x2) * 0.5;
  const p3y = h * 0.54;
  ctx.save();
  ctx.translate(p3x, p3y);
  ctx.rotate(wheelAngle * 1.8);
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, 74, 0, Math.PI * 2);
  ctx.stroke();
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 62, Math.sin(a) * 62);
    ctx.stroke();
  }
  ctx.restore();

  // Speed streaks in Panel 3
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  for (let s = 0; s < 7; s++) {
    const sy = h * (0.28 + s * 0.08);
    const sx = x2 + ((timeSec * 420 + s * 65) % 260);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 55, sy);
    ctx.stroke();
  }
  ctx.restore();

  // Crisp Editorial Panel Dividers
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x1 + slant + 4, 0);
  ctx.lineTo(x1 - slant + 4, h);
  ctx.moveTo(x2 + slant + 4, 0);
  ctx.lineTo(x2 - slant + 4, h);
  ctx.stroke();
}

/**
 * 10. shoulder_companion: Medium-close tracking shot ("尔似 在我肩")
 */
export function renderShoulderCompanionShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec, chapter, beat } = sc;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#090b12');
  bg.addColorStop(0.6, '#1c1624');
  bg.addColorStop(1, '#2d1a10');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Streaking city light bokeh ribbons behind traveler's shoulder
  for (let i = 0; i < 14; i++) {
    const ly = h * (0.22 + (i % 7) * 0.09);
    const lx = w - (((scrollDist * (1.1 + (i % 3) * 0.35) + i * 210) % (w + 300)) - 150);
    ctx.fillStyle = i % 2 === 0 ? chapter.accentHex : chapter.secondaryHex;
    ctx.globalAlpha = 0.2 + (i % 3) * 0.08;
    roundRectPath(ctx, lx, ly, 120 + (i % 4) * 45, 10, 5);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Close-up of Xiaohei rising prominently right beside the traveler's shoulder!
  drawDetailedXiaohei(sc, {
    cx: w * 0.38,
    bottomY: h * 0.92 - beat.kickPulse * 8,
    scale: 1.48,
    tilt: 0.04,
    handleRatio: 0.36,
    warmHandleGlow: true,
  });

  // Traveler's Shoulder, Coat Collar & Silhouette on right half ("尔似在我肩")
  const bob = Math.sin(timeSec * 6.5) * 6;
  ctx.save();
  ctx.translate(w * 0.64, h * 0.56 + bob);
  ctx.fillStyle = '#14141c';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;

  // Head & neck silhouette
  ctx.beginPath();
  ctx.arc(10, -135, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Broad coat shoulders
  roundRectPath(ctx, -115, -75, 250, 320, 48);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * 11. fortress_monolith: Symmetrical architectural bastion & hexagonal force-field ("你最是 安稳堡垒啊")
 */
export function renderFortressMonolithShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  const bg = ctx.createRadialGradient(w * 0.5, h * 0.54, 30, w * 0.5, h * 0.54, w * 0.65);
  bg.addColorStop(0, '#2b1c0c');
  bg.addColorStop(0.55, '#120d0a');
  bg.addColorStop(1, '#070709');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.54;

  // Concentric rotating geometric citadel / hexagonal bastion rings
  for (let ring = 1; ring <= 3; ring++) {
    const rad = Math.min(w, h) * (0.19 + ring * 0.095) + beat.kickPulse * 12;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(timeSec * (ring % 2 === 0 ? -0.25 : 0.25) + ring);
    ctx.strokeStyle = ring === 1 ? '#facc15' : chapter.accentHex;
    ctx.globalAlpha = 0.65 - ring * 0.14;
    ctx.lineWidth = 4 - ring * 0.7;
    ctx.beginPath();
    for (let v = 0; v < 6; v++) {
      const a = (v / 6) * Math.PI * 2;
      const vx = Math.cos(a) * rad;
      const vy = Math.sin(a) * rad;
      if (v === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  // Architectural fortress light pillars behind Xiaohei
  const pillarWidths = [-180, -110, 110, 180];
  for (const dx of pillarWidths) {
    const ph = h * (0.34 + beat.kickPulse * 0.06);
    const pGrad = ctx.createLinearGradient(0, cy - ph * 0.6, 0, cy + ph * 0.5);
    pGrad.addColorStop(0, 'rgba(250, 204, 21, 0)');
    pGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.22)');
    pGrad.addColorStop(1, 'rgba(250, 204, 21, 0.04)');
    ctx.fillStyle = pGrad;
    ctx.fillRect(cx + dx - 18, cy - ph * 0.6, 36, ph);
  }

  // Xiaohei anchored dead-center as an unshakable monolith
  drawDetailedXiaohei(sc, {
    cx,
    bottomY: h * 0.73,
    scale: 1.08,
    tilt: 0,
    warmHandleGlow: true,
  });

  drawCinemaBokeh(sc, 18, '#facc15', '#fb923c', 1.25);
}
