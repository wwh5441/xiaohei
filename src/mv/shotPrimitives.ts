import { TRAVEL_STICKERS, type MVChapter } from './mvData';
import { clamp01, type AudioBands, type BeatState } from './mvTimeline';

export interface ShotContext {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  timeSec: number;
  scrollDist: number;
  wheelAngle: number;
  lineProgress: number;
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
  const rad = Math.min(r, w * 0.5, h * 0.5);
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
 * High-craft 2.5D procedural illustration of "小黑" (20-inch matte-black polycarbonate suitcase)
 */
export function drawDetailedXiaohei(sc: ShotContext, opts: SuitcaseDrawOpts): void {
  const { ctx, chapter, beat, wheelAngle } = sc;
  const scale = opts.scale ?? 1;
  const caseW = 156 * scale;
  const caseH = 212 * scale;
  const depthW = 34 * scale;

  ctx.save();
  ctx.translate(opts.cx, opts.bottomY);
  if (opts.tilt) ctx.rotate(opts.tilt);

  // Ground contact shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
  ctx.beginPath();
  ctx.ellipse(-depthW * 0.2, 4 * scale, caseW * 0.65, 11 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  const shellLeft = -caseW * 0.45;
  const shellTop = -caseH - 16 * scale;
  const shellBottom = -16 * scale;
  const radius = 16 * scale;

  // 1. Telescopic Handle
  const hRatio = opts.handleRatio ?? 0.34;
  const handleExt = caseH * hRatio;
  const rodL = shellLeft + caseW * 0.27;
  const rodR = shellLeft + caseW * 0.69;
  const gripY = shellTop - handleExt;

  if (opts.warmHandleGlow) {
    const glow = ctx.createRadialGradient(
      (rodL + rodR) * 0.5,
      gripY,
      4 * scale,
      (rodL + rodR) * 0.5,
      gripY,
      95 * scale
    );
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc((rodL + rodR) * 0.5, gripY, 95 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = opts.warmHandleGlow ? '#fbbf24' : '#d4d4d8';
  ctx.lineWidth = Math.max(2, 4.5 * scale);
  ctx.beginPath();
  ctx.moveTo(rodL, shellTop + 8 * scale);
  ctx.lineTo(rodL, gripY);
  ctx.moveTo(rodR, shellTop + 8 * scale);
  ctx.lineTo(rodR, gripY);
  ctx.stroke();

  ctx.fillStyle = opts.warmHandleGlow ? '#f59e0b' : '#27272a';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = Math.max(1.5, 2 * scale);
  roundRectPath(
    ctx,
    rodL - 8 * scale,
    gripY - 9 * scale,
    rodR - rodL + 16 * scale,
    12 * scale,
    5 * scale
  );
  ctx.fill();
  ctx.stroke();

  // Priority Orange Tag fluttering from handle rod
  ctx.save();
  ctx.translate(rodR + 2 * scale, gripY + 14 * scale);
  ctx.rotate(0.28 + Math.sin(sc.timeSec * 5.5) * 0.14);
  ctx.fillStyle = '#f59e0b';
  roundRectPath(ctx, 0, -5 * scale, 34 * scale, 13 * scale, 2 * scale);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.font = `800 ${Math.max(6, Math.round(7 * scale))}px "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PRIO', 17 * scale, 1.5 * scale);
  ctx.restore();

  // 2. Left 2.5D Gusset
  ctx.fillStyle = '#121216';
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = Math.max(1, 1.8 * scale);
  ctx.beginPath();
  ctx.moveTo(shellLeft + 7 * scale, shellTop);
  ctx.lineTo(shellLeft - depthW, shellTop + 11 * scale);
  ctx.lineTo(shellLeft - depthW, shellBottom - 8 * scale);
  ctx.lineTo(shellLeft + 7 * scale, shellBottom);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Zipper line
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = Math.max(1, 1.6 * scale);
  ctx.beginPath();
  ctx.moveTo(shellLeft - depthW * 0.48, shellTop + 8 * scale);
  ctx.lineTo(shellLeft - depthW * 0.48, shellBottom - 5 * scale);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 3. Matte-Black Polycarbonate Shell
  const bodyGrad = ctx.createLinearGradient(shellLeft, shellTop, shellLeft + caseW, shellBottom);
  bodyGrad.addColorStop(0, '#29292e');
  bodyGrad.addColorStop(0.4, '#18181c');
  bodyGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = 'rgba(255,255,255,0.24)';
  ctx.lineWidth = Math.max(1.2, 2 * scale);
  roundRectPath(ctx, shellLeft, shellTop, caseW, caseH, radius);
  ctx.fill();
  ctx.stroke();

  // Rim highlight
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.32 + beat.kickPulse * 0.5;
  ctx.lineWidth = Math.max(1.2, 2.2 * scale);
  roundRectPath(
    ctx,
    shellLeft + 2 * scale,
    shellTop + 2 * scale,
    caseW - 4 * scale,
    caseH - 4 * scale,
    radius - 2 * scale
  );
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Molded vertical ribs
  for (let r = 1; r <= 5; r++) {
    const rx = shellLeft + (caseW / 6) * r;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = Math.max(1, 2.4 * scale);
    ctx.beginPath();
    ctx.moveTo(rx, shellTop + 22 * scale);
    ctx.lineTo(rx, shellBottom - 18 * scale);
    ctx.stroke();
  }

  // Optional weathered scuff marks ("告别褪去的颜")
  if (opts.showScuffs) {
    ctx.strokeStyle = 'rgba(244, 244, 245, 0.22)';
    ctx.lineWidth = 1.4 * scale;
    ctx.beginPath();
    ctx.moveTo(shellLeft + caseW * 0.18, shellTop + caseH * 0.28);
    ctx.lineTo(shellLeft + caseW * 0.42, shellTop + caseH * 0.35);
    ctx.moveTo(shellLeft + caseW * 0.55, shellTop + caseH * 0.62);
    ctx.lineTo(shellLeft + caseW * 0.82, shellTop + caseH * 0.56);
    ctx.stroke();
  }

  // Badge Plate
  const badgeW = Math.max(62 * scale, caseW * 0.48);
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = Math.max(1, 1.3 * scale);
  roundRectPath(
    ctx,
    shellLeft + (caseW - badgeW) * 0.5,
    shellTop + 16 * scale,
    badgeW,
    16 * scale,
    4 * scale
  );
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f4f4f5';
  ctx.font = `700 ${Math.max(7, Math.round(8.5 * scale))}px "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('XIAOHEI · 20"', shellLeft + caseW * 0.5, shellTop + 24.5 * scale);

  // Stickers
  const count =
    opts.stickerCount ??
    Math.min(
      TRAVEL_STICKERS.length,
      1 + Math.floor((sc.timeSec / 170) * (TRAVEL_STICKERS.length - 1)) + sc.bonusStickers
    );
  const slots = [
    { rx: 0.27, ry: 0.36, rot: -0.16 },
    { rx: 0.69, ry: 0.44, rot: 0.14 },
    { rx: 0.32, ry: 0.65, rot: 0.11 },
    { rx: 0.67, ry: 0.73, rot: -0.13 },
    { rx: 0.49, ry: 0.52, rot: -0.05 },
    { rx: 0.26, ry: 0.83, rot: -0.19 },
  ];
  for (let s = 0; s < Math.min(count, slots.length); s++) {
    const spec = TRAVEL_STICKERS[s % TRAVEL_STICKERS.length];
    const pos = slots[s];
    ctx.save();
    ctx.translate(shellLeft + caseW * pos.rx, shellTop + caseH * pos.ry);
    ctx.rotate(pos.rot);
    ctx.fillStyle = spec.bg;
    roundRectPath(ctx, -20 * scale, -9 * scale, 40 * scale, 18 * scale, 3 * scale);
    ctx.fill();
    ctx.fillStyle = spec.fg;
    ctx.font = `800 ${Math.max(6, Math.round(7.5 * scale))}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spec.code.slice(0, 6), 0, 0.5 * scale);
    ctx.restore();
  }

  // Dual-caster 360° Wheels
  const wheels = [
    { x: shellLeft - depthW * 0.6, y: -9 * scale, r: 8.5 * scale },
    { x: shellLeft + caseW * 0.16, y: -5 * scale, r: 10 * scale },
    { x: shellLeft + caseW * 0.84, y: -5 * scale, r: 10 * scale },
  ];
  for (const wh of wheels) {
    ctx.save();
    ctx.translate(wh.x, wh.y);
    ctx.rotate(wheelAngle);
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = Math.max(1.2, 2.2 * scale);
    ctx.beginPath();
    ctx.arc(0, 0, wh.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = chapter.accentHex;
    ctx.lineWidth = Math.max(1, 1.7 * scale);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * -wh.r * 0.65, Math.sin(a) * -wh.r * 0.65);
      ctx.lineTo(Math.cos(a) * wh.r * 0.65, Math.sin(a) * wh.r * 0.65);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Stylized editorial silhouette of the Traveler walking alongside Xiaohei
 */
export function drawTravelerSilhouette(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  heightPx: number,
  walkPhase: number,
  rimColor: string
): void {
  const s = heightPx / 260;
  const bob = Math.abs(Math.sin(walkPhase)) * 6 * s;

  ctx.save();
  ctx.translate(x, groundY - bob);

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, bob + 3 * s, 38 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  const strideA = Math.sin(walkPhase) * 26 * s;
  const strideB = -strideA;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Back leg
  ctx.strokeStyle = '#121217';
  ctx.lineWidth = 15 * s;
  ctx.beginPath();
  ctx.moveTo(-4 * s, -98 * s);
  ctx.lineTo(strideB * 0.5, -48 * s);
  ctx.lineTo(strideB, -4 * s);
  ctx.stroke();

  // Front leg
  ctx.strokeStyle = '#1c1c24';
  ctx.lineWidth = 16 * s;
  ctx.beginPath();
  ctx.moveTo(4 * s, -98 * s);
  ctx.lineTo(strideA * 0.55, -48 * s);
  ctx.lineTo(strideA, -4 * s);
  ctx.stroke();

  // Flowing Trench Coat / Windbreaker Torso
  const coatFlutter = Math.sin(walkPhase * 2) * 8 * s;
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-14 * s, -192 * s);
  ctx.lineTo(18 * s, -190 * s);
  ctx.lineTo(28 * s, -88 * s);
  ctx.lineTo(-34 * s - coatFlutter, -82 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Head & Collar Silhouette
  ctx.fillStyle = '#181820';
  ctx.beginPath();
  ctx.arc(4 * s, -216 * s, 18 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 1.8 * s;
  ctx.beginPath();
  ctx.arc(4 * s, -216 * s, 18 * s, -Math.PI * 0.45, Math.PI * 0.25);
  ctx.stroke();

  // Arm reaching back toward Xiaohei's telescopic handle
  ctx.strokeStyle = '#24242e';
  ctx.lineWidth = 11 * s;
  ctx.beginPath();
  ctx.moveTo(-8 * s, -176 * s);
  ctx.lineTo(-36 * s, -138 * s);
  ctx.lineTo(-64 * s, -118 * s);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws depth-of-field cinema bokeh orbs & subtle anamorphic light flares
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
    const seed = i * 37.7;
    const nx = ((Math.sin(seed) * 0.5 + 0.5) * 1.2 + timeSec * (0.015 + (i % 3) * 0.008)) % 1.2 - 0.1;
    const ny = (Math.cos(seed * 1.3) * 0.5 + 0.5) * 0.85 + Math.sin(timeSec * 0.8 + i) * 0.03;
    const radius = (18 + (i % 5) * 16) * (1 + beat.kickPulse * 0.18);
    const alpha = clamp01((0.04 + (i % 4) * 0.025) * opacityScale);

    ctx.fillStyle = i % 2 === 0 ? primaryHex : secondaryHex;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(nx * w, ny * h, radius, 0, Math.PI * 2);
    ctx.fill();
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

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  roundRectPath(ctx, -w * 0.5 + 5, -h * 0.5 + 7, w, h, 8);
  ctx.fill();

  // Tag card body
  ctx.fillStyle = bgHex;
  roundRectPath(ctx, -w * 0.5, -h * 0.5, w, h, 8);
  ctx.fill();

  // Inner border
  ctx.strokeStyle = fgHex;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  roundRectPath(ctx, -w * 0.5 + 6, -h * 0.5 + 6, w - 12, h - 12, 5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // String hole eyelet on left
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(-w * 0.5 + 18, 0, 5.5, 0, Math.PI * 2);
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
  for (let b = 0; b < 8; b++) {
    const bw = b % 3 === 0 ? 3 : 1.5;
    ctx.fillRect(barRight - b * 5, -h * 0.3, bw, h * 0.6);
  }

  // Circular Postmark Year Stamp ("勋章")
  ctx.save();
  ctx.translate(w * 0.22, -h * 0.16);
  ctx.rotate(-0.22);
  ctx.strokeStyle = fgHex;
  ctx.globalAlpha = 0.65;
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
