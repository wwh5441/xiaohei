import {
  type LyricLine,
  type MVChapter,
  type ShotSpec,
  type SubtitleMode,
} from './mvData';
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
  shotSpec: ShotSpec;
  subtitleMode: SubtitleMode;
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
  wheelAngleOverride?: number;
}

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
    wheelAngleOverride: opts.wheelAngleOverride,
  });
}

export function hash01(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

/**
 * Restrained 85mm f/1.4 Prime Lens Depth-of-Field Bokeh Orbs:
 * Creamy radial falloff without harsh artificial cartoon ring outlines.
 */
export function drawCinemaBokeh(
  sc: ShotContext,
  count: number,
  primaryHex: string,
  secondaryHex: string,
  opacityScale = 1
): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const effCount = Math.min(count, 16);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < effCount; i++) {
    const h1 = hash01(i * 3.17 + 1);
    const h2 = hash01(i * 7.91 + 2);
    const nx = ((h1 * 1.18 + timeSec * (0.01 + (i % 4) * 0.005)) % 1.24) - 0.12;
    const ny = h2 * 0.86 + Math.sin(timeSec * 0.55 + i * 1.3) * 0.024;
    const radius = (16 + (i % 5) * 16) * (1 + beat.kickPulse * 0.1);
    const alpha = clamp01((0.028 + (i % 4) * 0.018) * opacityScale);
    const color = i % 2 === 0 ? primaryHex : secondaryHex;
    const cx = nx * w;
    const cy = ny * h;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(0.55, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalAlpha = alpha;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

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

  const halo = ctx.createRadialGradient(x, y, 1, x, y, coreRadius * 2.6);
  halo.addColorStop(0, '#ffffff');
  halo.addColorStop(0.22, colorHex);
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = clamp01(intensity * 0.8);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius * 2.6, 0, Math.PI * 2);
  ctx.fill();

  const streak = ctx.createLinearGradient(x - streakWidth * 0.5, y, x + streakWidth * 0.5, y);
  streak.addColorStop(0, 'rgba(0,0,0,0)');
  streak.addColorStop(0.35, colorHex);
  streak.addColorStop(0.5, '#ffffff');
  streak.addColorStop(0.65, colorHex);
  streak.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = clamp01(intensity * 0.5);
  ctx.fillStyle = streak;
  ctx.beginPath();
  ctx.ellipse(x, y, streakWidth * 0.5, Math.max(1.5, coreRadius * 0.14), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawTyndallGodRays(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  rayCount: number,
  baseAngleRad: number,
  spreadRad: number,
  length: number,
  rgbCsv: string,
  maxAlpha = 0.14
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

    ctx.fillStyle = 'rgba(254, 249, 195, 0.055)';
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();

    const a0 = -Math.PI * 0.36;
    const a1 = Math.PI * 0.62;
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

  for (let i = -2; i < totalSpan; i++) {
    const idx = baseIdx + i;
    const hSeed = hash01(idx * 13.37 + 41);
    const bh = opts.maxTowerHeight * (0.24 + hSeed * 0.68);
    const bw = 30 + hash01(idx * 7.21 + 11) * 24;
    const bx = i * blockStep - offsetPx + 12;
    const topY = horizonY - bh;

    ctx.fillStyle = opts.silhouetteHex;
    ctx.fillRect(bx, topY, bw, bh + 1);

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

  ctx.fillStyle = 'rgba(0,0,0,0.48)';
  roundRectPath(ctx, -w * 0.5 + 5, -h * 0.5 + 8, w, h, 8);
  ctx.fill();

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

  ctx.strokeStyle = fgHex;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.8;
  roundRectPath(ctx, -w * 0.5 + 6, -h * 0.5 + 6, w - 12, h - 12, 5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(-w * 0.5 + 18, 0, 7.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(-w * 0.5 + 18, 0, 4.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fgHex;
  ctx.font = `900 ${Math.round(h * 0.34)}px "Outfit", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(code, -w * 0.5 + 34, -h * 0.11);

  ctx.font = `600 ${Math.round(h * 0.16)}px "Noto Sans SC", "Outfit", sans-serif`;
  ctx.fillText(subtitle, -w * 0.5 + 34, h * 0.22);

  const barRight = w * 0.5 - 14;
  for (let b = 0; b < 9; b++) {
    const bw = b % 3 === 0 ? 3 : 1.5;
    ctx.fillRect(barRight - b * 4.8, -h * 0.3, bw, h * 0.6);
  }

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

/**
 * Layered Organic Cedar & Cypress Forest Silhouettes with Valley Mist
 * (replaces cartoon 3-ellipse lollipop pines in S35 & S36!).
 */
export function drawOrganicMistForest(
  sc: ShotContext,
  groundY: number,
  opts: {
    farTreeHex: string;
    nearTreeHex: string;
    mistRgba: string;
  }
): void {
  const { ctx, w, h, timeSec } = sc;
  ctx.save();

  const drawCedarSilhouette = (
    tx: number,
    baseY: number,
    treeH: number,
    boughW: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    // Tapered trunk
    ctx.beginPath();
    ctx.moveTo(tx - boughW * 0.08, baseY);
    ctx.lineTo(tx - boughW * 0.03, baseY - treeH);
    ctx.lineTo(tx + boughW * 0.03, baseY - treeH);
    ctx.lineTo(tx + boughW * 0.08, baseY);
    ctx.closePath();
    ctx.fill();

    // Layered drooping cedar boughs (natural asymmetrical conifer silhouette)
    const tiers = 7;
    for (let t = 0; t < tiers; t++) {
      const f = t / tiers;
      const topY = baseY - treeH * (0.98 - f * 0.72);
      const span = boughW * (0.18 + f * 0.82);
      const droop = treeH * (0.09 + f * 0.05);
      const asym = (hash01(tx * 0.13 + t * 7.1) - 0.5) * span * 0.16;

      ctx.beginPath();
      ctx.moveTo(tx, topY);
      ctx.quadraticCurveTo(tx - span * 0.45, topY + droop * 0.55, tx - span + asym, topY + droop);
      ctx.quadraticCurveTo(tx - span * 0.4, topY + droop * 0.85, tx, topY + droop * 0.62);
      ctx.quadraticCurveTo(tx + span * 0.4, topY + droop * 0.85, tx + span + asym, topY + droop);
      ctx.quadraticCurveTo(tx + span * 0.45, topY + droop * 0.55, tx, topY);
      ctx.closePath();
      ctx.fill();
    }
  };

  // Far ridge cedars
  for (let i = 0; i < 14; i++) {
    const tx = (i / 13) * w + (hash01(i * 5.3) - 0.5) * 60;
    if (Math.abs(tx - w * 0.46) < w * 0.15) continue;
    const th = h * (0.38 + hash01(i * 9.1) * 0.24);
    drawCedarSilhouette(tx, groundY, th, th * 0.22, opts.farTreeHex);
  }

  // Drifting woodland mist ribbon between depth layers
  const mistDrift = Math.sin(timeSec * 0.4) * 35;
  const mistGrad = ctx.createLinearGradient(0, groundY - h * 0.28, 0, groundY + 20);
  mistGrad.addColorStop(0, 'rgba(0,0,0,0)');
  mistGrad.addColorStop(0.55, opts.mistRgba);
  mistGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = mistGrad;
  ctx.fillRect(-40 + mistDrift, groundY - h * 0.28, w + 80, h * 0.3);

  // Framing foreground cedars at left and right edges
  for (const [fx, scale] of [
    [w * 0.08, 0.72],
    [w * 0.19, 0.58],
    [w * 0.82, 0.62],
    [w * 0.93, 0.76],
  ]) {
    const th = h * scale;
    drawCedarSilhouette(fx, groundY + 18, th, th * 0.24, opts.nearTreeHex);
  }

  ctx.restore();
}
