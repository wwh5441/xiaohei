import { type LyricLine, type MVChapter } from './mvData';
import { clamp01, type AudioBands, type BeatState } from './mvTimeline';
import { drawRimowaCabin } from './humanRimowaRig';

export interface ShotContext {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  timeSec: number;
  scrollDist: number;
  wheelAngle: number;
  lineProgress: number;
  activeLine?: LyricLine;
  nextLine?: LyricLine | null;
  chapter: MVChapter;
  beat: BeatState;
  bands: AudioBands;
  bonusStickers: number;
  reducedMotion: boolean;
}

export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const rad = Math.max(0, Math.min(r, w * 0.5, h * 0.5));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export interface SuitcaseDrawOpts {
  cx: number;
  bottomY: number;
  scale?: number;
  tilt?: number;
  handleRatio?: number;
  warmHandleGlow?: boolean;
  showScuffs?: boolean;
  stickerCount?: number;
}

/**
 * High-craft 2.5D procedural illustration of "小黑" (20-inch matte-black grooved RIMOWA Cabin)
 */
export function drawDetailedXiaohei(sc: ShotContext, opts: SuitcaseDrawOpts): void {
  drawRimowaCabin(sc, {
    cx: opts.cx,
    bottomY: opts.bottomY,
    scale: opts.scale,
    tilt: opts.tilt,
    handleRatio: opts.handleRatio ?? 0.36,
    warmHandleGlow: opts.warmHandleGlow,
    showScuffs: opts.showScuffs,
    stickerCount: opts.stickerCount,
  });
}

/**
 * Deterministic pseudo-random [0..1) helper so procedural stars, windows & foliage never flicker
 */
export function hash01(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

/**
 * 85mm f/1.4 Prime Lens Depth-of-Field Bokeh Orbs with soft radial core + delicate optical aperture rim
 */
export function drawCinemaBokeh(
  sc: ShotContext,
  count: number,
  primaryHex: string,
  secondaryHex: string,
  opacityScale = 1
): void {
  const { ctx, w, h, timeSec, beat } = sc;
  ctx.save();
  for (let i = 0; i < count; i++) {
    const h1 = hash01(i * 3.17 + 1);
    const h2 = hash01(i * 7.91 + 2);
    const nx = ((h1 * 1.18 + timeSec * (0.012 + (i % 4) * 0.006)) % 1.24) - 0.12;
    const ny = h2 * 0.88 + Math.sin(timeSec * 0.65 + i * 1.3) * 0.028;
    const radius = (14 + (i % 6) * 15) * (1 + beat.kickPulse * 0.14);
    const alpha = clamp01((0.035 + (i % 4) * 0.024) * opacityScale);
    const color = i % 2 === 0 ? primaryHex : secondaryHex;
    const cx = nx * w;
    const cy = ny * h;

    const grad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(0.72, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalAlpha = alpha * 0.72;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle optical lens-iris outer ring
    ctx.globalAlpha = alpha * 1.15;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.8, radius * 0.045);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.88, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Panavision 2.39:1 Anamorphic Horizontal Lens Flare + Optical Core Halo
 */
export function drawAnamorphicFlare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  streakWidth: number,
  coreRadius: number,
  colorHex: string,
  intensity = 0.75
): void {
  if (intensity <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Core soft bloom
  const halo = ctx.createRadialGradient(x, y, 1, x, y, coreRadius * 2.8);
  halo.addColorStop(0, '#ffffff');
  halo.addColorStop(0.22, colorHex);
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = clamp01(intensity * 0.85);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius * 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal anamorphic streak
  const streak = ctx.createLinearGradient(x - streakWidth * 0.5, y, x + streakWidth * 0.5, y);
  streak.addColorStop(0, 'rgba(0,0,0,0)');
  streak.addColorStop(0.35, colorHex);
  streak.addColorStop(0.5, '#ffffff');
  streak.addColorStop(0.65, colorHex);
  streak.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = clamp01(intensity * 0.58);
  ctx.fillStyle = streak;
  ctx.beginPath();
  ctx.ellipse(x, y, streakWidth * 0.5, Math.max(1.6, coreRadius * 0.16), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Volumetric Crepuscular / Tyndall God-Rays filtering across atmospheric scenes
 */
export function drawTyndallGodRays(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  rayCount: number,
  baseAngleRad: number,
  spreadRad: number,
  length: number,
  rgbCsv: string,
  maxAlpha = 0.16
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < rayCount; i++) {
    const t = rayCount === 1 ? 0.5 : i / (rayCount - 1);
    const angle = baseAngleRad - spreadRad * 0.5 + t * spreadRad + Math.sin(i * 2.7) * 0.03;
    const halfSpread = 0.028 + (i % 3) * 0.014;
    const x1 = originX + Math.cos(angle - halfSpread) * length;
    const y1 = originY + Math.sin(angle - halfSpread) * length;
    const x2 = originX + Math.cos(angle + halfSpread) * length;
    const y2 = originY + Math.sin(angle + halfSpread) * length;

    const grad = ctx.createLinearGradient(
      originX,
      originY,
      (x1 + x2) * 0.5,
      (y1 + y2) * 0.5
    );
    const a = maxAlpha * (0.65 + (i % 2) * 0.35);
    grad.addColorStop(0, `rgba(${rgbCsv}, ${a.toFixed(3)})`);
    grad.addColorStop(0.55, `rgba(${rgbCsv}, ${(a * 0.42).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${rgbCsv}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Makoto Shinkai-inspired Twilight Starfield + Sculpted Backlit Cumulonimbus Cloud Banks
 */
export function drawStarfieldAndClouds(
  sc: ShotContext,
  horizonY: number,
  opts: {
    starCount?: number;
    cloudShadowHex: string;
    cloudMidHex: string;
    cloudRimHex: string;
    driftSpeed?: number;
    moonPos?: { x: number; y: number; r: number };
  }
): void {
  const { ctx, w, timeSec } = sc;
  const starCount = opts.starCount ?? 42;

  ctx.save();
  // 1. Pinpoint zenith stars fading naturally toward horizon glow
  for (let i = 0; i < starCount; i++) {
    const sx = hash01(i * 11.3 + 5) * w;
    const sy = Math.pow(hash01(i * 19.7 + 9), 1.45) * horizonY * 0.68;
    const twinkle = 0.45 + 0.55 * Math.sin(timeSec * (1.6 + (i % 4) * 0.7) + i * 2.3);
    const heightFade = clamp01(1 - sy / (horizonY * 0.72));
    const r = i % 9 === 0 ? 1.55 : 0.95;

    ctx.fillStyle = i % 5 === 0 ? '#fef3c7' : '#e0f2fe';
    ctx.globalAlpha = twinkle * heightFade * 0.78;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();

    // Delicate 4-point star cross on brightest zenith stars
    if (i % 14 === 0 && heightFade > 0.45) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(sx - 4.5, sy);
      ctx.lineTo(sx + 4.5, sy);
      ctx.moveTo(sx, sy - 4.5);
      ctx.lineTo(sx, sy + 4.5);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Optional delicate crescent moon (positive geometric crescent + subtle lunar earthshine — never destination-out!)
  if (opts.moonPos) {
    const { x: mx, y: my, r: mr } = opts.moonPos;
    const moonGlow = ctx.createRadialGradient(mx, my, mr * 0.35, mx, my, mr * 3.6);
    moonGlow.addColorStop(0, 'rgba(254, 249, 195, 0.30)');
    moonGlow.addColorStop(0.45, 'rgba(254, 249, 195, 0.09)');
    moonGlow.addColorStop(1, 'rgba(254, 249, 195, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(mx, my, mr * 3.6, 0, Math.PI * 2);
    ctx.fill();

    // Faint lunar earthshine across the dark portion of the moon disc
    ctx.fillStyle = 'rgba(254, 249, 195, 0.055)';
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();

    // Crisp sunlit crescent horn path (tilted waxing/waning crescent)
    const a0 = -Math.PI * 0.36;
    const a1 = Math.PI * 0.62;
    const x1 = mx + Math.cos(a1) * mr;
    const y1 = my + Math.sin(a1) * mr;
    const x0 = mx + Math.cos(a0) * mr;
    const y0 = my + Math.sin(a0) * mr;
    const am = (a0 + a1) * 0.5;

    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(mx, my, mr, a0, a1, false);
    ctx.quadraticCurveTo(
      mx + Math.cos(am) * mr * 0.22,
      my + Math.sin(am) * mr * 0.22,
      x0,
      y0
    );
    ctx.closePath();
    ctx.fill();
  }

  // 2. Swept Atmospheric Stratus Ribbons & Horizon Haze (replaces overlapping cartoon oval puffs!)
  const drift = timeSec * (opts.driftSpeed ?? 9);
  const span = Math.max(680, w * 0.62);
  for (let layer = 0; layer < 3; layer++) {
    const baseY = horizonY - (layer === 0 ? 128 : layer === 1 ? 82 : 44);
    const bandH = layer === 0 ? 48 : layer === 1 ? 36 : 24;
    const shift = (drift * (0.35 + layer * 0.25)) % span;

    const cGrad = ctx.createLinearGradient(0, baseY - bandH * 0.65, 0, baseY + bandH * 0.75);
    cGrad.addColorStop(0, opts.cloudRimHex);
    cGrad.addColorStop(0.28, opts.cloudMidHex);
    cGrad.addColorStop(0.72, opts.cloudShadowHex);
    cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cGrad;
    ctx.globalAlpha = layer === 0 ? 0.26 : layer === 1 ? 0.34 : 0.42;

    for (let cx = -span; cx < w + span; cx += span) {
      const x0 = cx - shift + layer * 170;
      const wBand = span * 0.84;
      ctx.beginPath();
      ctx.moveTo(x0, baseY + bandH * 0.45);
      ctx.bezierCurveTo(
        x0 + wBand * 0.22,
        baseY - bandH * 0.6,
        x0 + wBand * 0.54,
        baseY - bandH * 0.32,
        x0 + wBand * 0.76,
        baseY - bandH * 0.52
      );
      ctx.quadraticCurveTo(x0 + wBand * 0.92, baseY - bandH * 0.12, x0 + wBand, baseY + bandH * 0.45);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * OpenFilm-Grade Architectural Massing Skyline with Structural Wireframe Edge Hairlines & Pinpoint Horizon Lights
 * (eliminates giant cartoon Lego window squares).
 */
export function drawDistantCitySkyline(
  sc: ShotContext,
  horizonY: number,
  opts: {
    parallaxPx?: number;
    maxTowerHeight: number;
    silhouetteHex: string;
    secondarySilhouetteHex: string;
    windowPrimaryHex: string;
    windowSecondaryHex: string;
    waterReflectionHeight?: number;
  }
): void {
  const { ctx, w, timeSec } = sc;
  const parallax = opts.parallaxPx ?? 0;
  const blockStep = 52;
  const totalSpan = Math.ceil(w / blockStep) + 4;
  const baseIdx = Math.floor(parallax / blockStep);
  const offsetPx = parallax % blockStep;

  ctx.save();
  // Layer 1: Far atmospheric architectural massing + setback crowns
  ctx.fillStyle = opts.secondarySilhouetteHex;
  for (let i = -2; i < totalSpan; i++) {
    const idx = baseIdx + i;
    const hSeed = hash01(idx * 5.13 + 17);
    const bh = opts.maxTowerHeight * (0.36 + hSeed * 0.64);
    const bw = 34 + hash01(idx * 9.7 + 3) * 26;
    const bx = i * blockStep - offsetPx;
    ctx.fillRect(bx, horizonY - bh, bw, bh + 1);

    if (hSeed > 0.58) {
      const crownW = bw * 0.58;
      const crownH = bh * 0.16;
      ctx.fillRect(bx + (bw - crownW) * 0.5, horizonY - bh - crownH, crownW, crownH + 1);
    }
    if (hSeed > 0.78) {
      ctx.fillRect(bx + bw * 0.48, horizonY - bh - bh * 0.16 - 16, 1.4, 16);
    }
  }

  // Layer 2: Crisp foreground architectural silhouettes + 0.8px wireframe edge lines + pinpoint horizon lights
  for (let i = -2; i < totalSpan; i++) {
    const idx = baseIdx + i;
    const hSeed = hash01(idx * 13.37 + 41);
    const bh = opts.maxTowerHeight * (0.24 + hSeed * 0.68);
    const bw = 30 + hash01(idx * 7.21 + 11) * 24;
    const bx = i * blockStep - offsetPx + 12;
    const topY = horizonY - bh;

    ctx.fillStyle = opts.silhouetteHex;
    ctx.fillRect(bx, topY, bw, bh + 1);

    // Subtle OpenFilm-style 0.8px structural edge & vertical mullion hairlines
    ctx.strokeStyle = 'rgba(244, 239, 230, 0.10)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(bx, horizonY);
    ctx.lineTo(bx, topY);
    ctx.lineTo(bx + bw, topY);
    if (bw > 40) {
      ctx.moveTo(bx + bw * 0.36, topY);
      ctx.lineTo(bx + bw * 0.36, horizonY);
    }
    ctx.stroke();

    // Sparse, ultra-fine horizontal floor-slit & pinpoint lights (1.2–1.5px, never Lego squares!)
    const cols = Math.max(2, Math.floor((bw - 8) / 5.5));
    const rows = Math.max(3, Math.floor((bh - 8) / 6.2));
    for (let r = 0; r < rows; r++) {
      const rowActive = hash01(idx * 19.3 + r * 5.7) > 0.62;
      if (!rowActive) continue;
      for (let c = 0; c < cols; c++) {
        const wSeed = hash01(idx * 31.7 + r * 7.3 + c * 13.1);
        if (wSeed < 0.72) continue;
        const pulse = 0.55 + 0.45 * Math.sin(timeSec * 1.2 + wSeed * 18);
        ctx.fillStyle = wSeed > 0.88 ? opts.windowSecondaryHex : opts.windowPrimaryHex;
        ctx.globalAlpha = pulse * 0.54;
        ctx.fillRect(bx + 4 + c * 5.2, topY + 5 + r * 6.0, 2.1, 1.2);
      }
    }
    ctx.globalAlpha = 1;
  }

  // Soft horizon atmospheric glow band + delicate water reflection hairlines
  const haze = ctx.createLinearGradient(0, horizonY - 22, 0, horizonY + 12);
  haze.addColorStop(0, 'rgba(251, 191, 36, 0)');
  haze.addColorStop(0.7, 'rgba(251, 191, 36, 0.14)');
  haze.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, horizonY - 22, w, 34);

  if (opts.waterReflectionHeight && opts.waterReflectionHeight > 4) {
    const refH = opts.waterReflectionHeight;
    for (let i = 0; i < 52; i++) {
      const rx = hash01(i * 17.9 + 4) * w;
      const len = (0.18 + hash01(i * 23.1 + 8) * 0.72) * refH;
      ctx.strokeStyle = i % 3 === 0 ? opts.windowSecondaryHex : opts.windowPrimaryHex;
      ctx.globalAlpha = 0.11 + (i % 4) * 0.035;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(rx, horizonY + 2);
      ctx.lineTo(rx, horizonY + len);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/**
 * Draws an authentic serrated airline PRIORITY baggage tag with string eyelet & postmark
 */
export function drawPriorityCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rot: number,
  code: string,
  subtitle: string,
  year: string,
  bgHex: string,
  fgHex: string
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Soft realistic paper elevation shadow
  ctx.fillStyle = 'rgba(0,0,0,0.48)';
  roundRectPath(ctx, -w * 0.5 + 5, -h * 0.5 + 8, w, h, 8);
  ctx.fill();

  // Tag card body with subtle paper sheen gradient
  ctx.fillStyle = bgHex;
  roundRectPath(ctx, -w * 0.5, -h * 0.5, w, h, 8);
  ctx.fill();

  const sheen = ctx.createLinearGradient(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5);
  sheen.addColorStop(0, 'rgba(255,255,255,0.16)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = sheen;
  roundRectPath(ctx, -w * 0.5, -h * 0.5, w, h, 8);
  ctx.fill();

  // Inner border
  ctx.strokeStyle = fgHex;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.8;
  roundRectPath(ctx, -w * 0.5 + 6, -h * 0.5 + 6, w - 12, h - 12, 5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Brass reinforced string hole eyelet on left
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(-w * 0.5 + 18, 0, 7.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(-w * 0.5 + 18, 0, 4.6, 0, Math.PI * 2);
  ctx.fill();

  // Bold Airport / Priority Code
  ctx.fillStyle = fgHex;
  ctx.font = `900 ${Math.round(h * 0.34)}px "Outfit", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(code, -w * 0.5 + 34, -h * 0.11);

  ctx.font = `600 ${Math.round(h * 0.16)}px "Noto Sans SC", "Outfit", sans-serif`;
  ctx.fillText(subtitle, -w * 0.5 + 34, h * 0.22);

  // Barcode stripes on right
  const barRight = w * 0.5 - 14;
  for (let b = 0; b < 9; b++) {
    const bw = b % 3 === 0 ? 3 : 1.5;
    ctx.fillRect(barRight - b * 4.8, -h * 0.3, bw, h * 0.6);
  }

  // Circular Postmark Year Stamp ("勋章")
  ctx.save();
  ctx.translate(w * 0.22, -h * 0.16);
  ctx.rotate(-0.22);
  ctx.strokeStyle = fgHex;
  ctx.globalAlpha = 0.68;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, h * 0.24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `700 ${Math.round(h * 0.14)}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(year, 0, 1);
  ctx.restore();

  ctx.restore();
}
