import { SHOT_SPECS, type LyricLine, type ShotType } from './mvData';
import { clamp01 } from './mvTimeline';
import { hash01, roundRectPath, type ShotContext } from './shotPrimitives';

/**
 * Restrained Cinema Palette:
 * Deep Ink, Warm Archival Bone, Brushed Graphite, Signal Ember, and 24K Gold.
 */
export const DIEGETIC_PALETTE = {
  ink: '#0A0A0C',
  inkPanel: 'rgba(12, 12, 16, 0.84)',
  graphite: '#68645E',
  ash: '#A39E93',
  bone: '#F4EFE6',
  signal: '#FF6B2C',
  gold: '#FACC15',
  ember: '#FFF7ED',
} as const;

export type DiegeticLayerMode = 'midground_occluded' | 'surface_coupled';

export interface GlyphThermoState {
  state: 'ghost' | 'strike' | 'cooled';
  heat: number; // 0..1
  scalePop: number; // 1..1.14
  alpha: number; // 0.24..1
  onsetSec: number;
}

export function resolveDiegeticModeForShot(shot: ShotType): DiegeticLayerMode {
  return SHOT_SPECS[shot]?.diegeticMode ?? 'surface_coupled';
}

/**
 * Deterministic per-glyph thermodynamic state (`frame(t)` pure function).
 * Short quick-cut lines (< 1.85s) ignite almost instantaneously so the full phrase is legible
 * before the camera cuts, while >= 1.85s lines sweep progressively syllable-by-syllable.
 */
export function computeGlyphThermodynamics(
  glyphIndex: number,
  totalGlyphs: number,
  lineStartTime: number,
  lineEndTime: number,
  timeSec: number,
  instantSlam = false
): GlyphThermoState {
  const safeTotal = Math.max(1, totalGlyphs);
  const duration = Math.max(0.1, lineEndTime - lineStartTime);
  const sungSpan = instantSlam
    ? Math.min(0.16, duration * 0.18)
    : duration < 1.85
    ? Math.min(0.22, duration * 0.26)
    : Math.max(0.24, duration * 0.82);

  const onsetSec = lineStartTime + (glyphIndex / safeTotal) * sungSpan;

  if (timeSec < onsetSec) {
    const preRoll = clamp01(1 - (onsetSec - timeSec) / 0.45);
    return {
      state: 'ghost',
      heat: 0,
      scalePop: 1,
      alpha: 0.24 + preRoll * 0.14,
      onsetSec,
    };
  }

  const age = timeSec - onsetSec;
  const heat = Math.exp(-age * 7.2);
  const scalePop = 1 + 0.14 * Math.exp(-age * 11.5);

  return {
    state: heat > 0.18 ? 'strike' : 'cooled',
    heat: clamp01(heat),
    scalePop,
    alpha: 1,
    onsetSec,
  };
}

function interpolateHeatColor(heat: number, isEmphasis: boolean, accentHex: string): string {
  if (heat > 0.72) return '#FFF7ED';
  if (heat > 0.42) return '#FF9A4D';
  if (heat > 0.18) return '#FF5A1F';
  return isEmphasis ? accentHex : DIEGETIC_PALETTE.bone;
}

function isIndexInEmphasis(line: LyricLine, chars: string[], idx: number): boolean {
  if (!line.emphasis) return false;
  const start = line.text.indexOf(line.emphasis);
  if (start < 0) return false;
  const empLen = Array.from(line.emphasis).length;
  const prefixCpLen = Array.from(line.text.slice(0, start)).length;
  return idx >= prefixCpLen && idx < prefixCpLen + empLen && chars[idx] !== ' ';
}

/**
 * Deterministic Caret Spark Head + Sputtering Gravity Streaks.
 * Strictly gated by `!sc.shotSpec.suppressSparks` at call sites!
 */
export function drawCaretSpark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeSec: number,
  scale = 1,
  intensity = 1
): void {
  if (intensity <= 0.02) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const flick = 0.86 + 0.14 * Math.sin(timeSec * 61.3) * Math.cos(timeSec * 37.9);
  const power = intensity * flick;

  const halo = ctx.createRadialGradient(x, y, 0, x, y, 20 * scale);
  halo.addColorStop(0, `rgba(255, 247, 237, ${Math.min(1, 0.9 * power).toFixed(3)})`);
  halo.addColorStop(0.3, `rgba(255, 107, 44, ${(0.6 * power).toFixed(3)})`);
  halo.addColorStop(1, 'rgba(255, 107, 44, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
  ctx.fill();

  const rate = 20;
  const maxLife = 0.3;
  const n0 = Math.floor((timeSec - maxLife) * rate);
  const n1 = Math.floor(timeSec * rate);
  for (let n = n0; n <= n1; n++) {
    const tb = n / rate;
    const age = timeSec - tb;
    const life = maxLife * (0.4 + 0.6 * hash01(n * 3.1 + 2));
    if (age < 0 || age > life) continue;

    const ang = hash01(n * 7.7 + 1) * Math.PI * 2;
    const spd = (45 + hash01(n * 13.3 + 5) * 110) * scale;
    const vx = Math.cos(ang) * spd;
    const vy = Math.sin(ang) * spd - 30 * scale;
    const g = 260 * scale;

    const px = x + vx * age;
    const py = y + vy * age + 0.5 * g * age * age;
    const agePrev = Math.max(0, age - 0.02);
    const px0 = x + vx * agePrev;
    const py0 = y + vy * agePrev + 0.5 * g * agePrev * agePrev;

    const k = 1 - age / life;
    ctx.strokeStyle =
      k > 0.6
        ? `rgba(255, 247, 237, ${(k * power).toFixed(3)})`
        : `rgba(255, 138, 60, ${(k * 0.8 * power).toFixed(3)})`;
    ctx.lineWidth = Math.max(0.85, 1.4 * k * scale);
    ctx.beginPath();
    ctx.moveTo(px0, py0);
    ctx.lineTo(px, py);
    ctx.stroke();
  }

  ctx.restore();
}

interface ThermoRunResult {
  sparkX: number;
  sparkY: number;
  totalWidth: number;
  effectiveFontPx: number;
  hasActiveSpark: boolean;
}

function maybeSpark(sc: ShotContext, x: number, y: number, scale: number, intensity: number): void {
  if (sc.shotSpec.suppressSparks || sc.reducedMotion) return;
  drawCaretSpark(sc.ctx, x, y, sc.timeSec, scale, intensity);
}

export function drawThermodynamicRun(
  ctx: CanvasRenderingContext2D,
  sc: ShotContext,
  line: LyricLine,
  anchorX: number,
  baselineY: number,
  fontPx: number,
  align: 'left' | 'center' | 'right',
  opts?: {
    textOverride?: string;
    maxWidthPx?: number;
    accentHex?: string;
    ghostColor?: string;
    cooledColor?: string;
    shadowColor?: string;
    letterSpacingPx?: number;
    darkCoreStroke?: boolean;
    extrude3D?: { vanishX: number; vanishY: number; depthPx: number; shadeHex: string };
    splitFlapTiles?: boolean;
  }
): ThermoRunResult {
  const rawText = opts?.textOverride ?? line.text;
  const chars = Array.from(rawText);
  const accent = opts?.accentHex ?? sc.chapter.accentHex;
  const instant = Boolean(sc.shotSpec.instantSlam);

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  let effFont = fontPx;
  let spacing = opts?.letterSpacingPx ?? Math.round(effFont * 0.04);
  ctx.font = `900 ${Math.round(effFont)}px "Outfit", "Noto Sans SC", sans-serif`;

  let widths = chars.map((ch) =>
    ch === ' ' ? effFont * 0.34 : ctx.measureText(ch).width + spacing
  );
  let totalWidth = widths.reduce((acc, v) => acc + v, 0) - (chars.length > 0 ? spacing : 0);

  if (opts?.maxWidthPx && totalWidth > opts.maxWidthPx && totalWidth > 1) {
    const shrink = Math.max(0.44, opts.maxWidthPx / totalWidth);
    effFont = fontPx * shrink;
    spacing = (opts.letterSpacingPx ?? Math.round(fontPx * 0.04)) * shrink;
    ctx.font = `900 ${Math.round(effFont)}px "Outfit", "Noto Sans SC", sans-serif`;
    widths = chars.map((ch) =>
      ch === ' ' ? effFont * 0.34 : ctx.measureText(ch).width + spacing
    );
    totalWidth = widths.reduce((acc, v) => acc + v, 0) - (chars.length > 0 ? spacing : 0);
  }

  let startX = anchorX;
  if (align === 'center') startX = anchorX - totalWidth * 0.5;
  else if (align === 'right') startX = anchorX - totalWidth;

  if (opts?.extrude3D) {
    const { vanishX, vanishY, depthPx, shadeHex } = opts.extrude3D;
    const layers = 8;
    for (let layer = layers; layer >= 1; layer--) {
      const f = layer / layers;
      ctx.fillStyle = shadeHex;
      ctx.globalAlpha = 0.24 + (1 - f) * 0.46;
      let cx = startX;
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch !== ' ') {
          const thermo = computeGlyphThermodynamics(
            i,
            chars.length,
            line.startTime,
            line.endTime,
            sc.timeSec,
            instant
          );
          if (thermo.state !== 'ghost') {
            const dx = (vanishX - (cx + widths[i] * 0.5)) * 0.07 * f + f * depthPx * 0.2;
            const dy = (vanishY - baselineY) * 0.07 * f + f * depthPx;
            ctx.fillText(ch, cx + dx, baselineY + dy);
          }
        }
        cx += widths[i];
      }
    }
    ctx.globalAlpha = 1;
  }

  let cursorX = startX;
  let sparkX = startX;
  let sparkY = baselineY - effFont * 0.32;
  let hasActiveSpark = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const wChar = widths[i];
    if (ch === ' ') {
      cursorX += wChar;
      continue;
    }

    const thermo = computeGlyphThermodynamics(
      i,
      chars.length,
      line.startTime,
      line.endTime,
      sc.timeSec,
      instant
    );
    const inEmp = opts?.textOverride ? true : isIndexInEmphasis(line, chars, i);

    if (thermo.state !== 'ghost') {
      sparkX = cursorX + wChar * 0.52;
      sparkY = baselineY - effFont * 0.28;
      if (thermo.heat > 0.14) hasActiveSpark = true;
    }

    if (opts?.splitFlapTiles) {
      const tileW = Math.max(effFont * 0.9, wChar - 2);
      const tileH = effFont * 1.24;
      const tileX = cursorX - 1;
      const tileY = baselineY - effFont * 0.96;

      ctx.fillStyle = thermo.heat > 0.3 ? 'rgba(245, 158, 11, 0.32)' : '#090d16';
      ctx.strokeStyle =
        thermo.state === 'ghost' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(125, 211, 252, 0.48)';
      ctx.lineWidth = 1;
      roundRectPath(ctx, tileX, tileY, tileW, tileH, 3.5);
      ctx.fill();
      ctx.stroke();
    }

    ctx.save();
    const cx = cursorX + (wChar - spacing) * 0.5;
    const cy = baselineY - effFont * 0.34;
    ctx.translate(cx, cy);
    const pop = sc.reducedMotion ? 1 : thermo.scalePop * (inEmp ? 1.04 : 1);
    if (opts?.splitFlapTiles && thermo.heat > 0.25 && !sc.reducedMotion) {
      ctx.scale(1, Math.max(0.35, 1 - thermo.heat * 0.55));
    } else {
      ctx.scale(pop, pop);
    }

    if (thermo.state === 'ghost') {
      if (opts?.ghostColor) {
        ctx.fillStyle = opts.ghostColor;
        ctx.fillText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
      } else {
        ctx.fillStyle = 'rgba(244, 239, 230, 0.16)';
        ctx.fillText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
        ctx.strokeStyle = 'rgba(244, 239, 230, 0.44)';
        ctx.lineWidth = Math.max(0.9, effFont * 0.02);
        ctx.strokeText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
      }
    } else {
      const fill =
        thermo.heat <= 0.18 && !inEmp && opts?.cooledColor
          ? opts.cooledColor
          : interpolateHeatColor(thermo.heat, inEmp, accent);

      if (opts?.darkCoreStroke) {
        // High-contrast obsidian core outline + gold highlight so sky monuments never wash out in solar glare!
        ctx.strokeStyle = 'rgba(9, 9, 13, 0.92)';
        ctx.lineWidth = Math.max(2.5, effFont * 0.09);
        ctx.lineJoin = 'round';
        ctx.strokeText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
      }

      ctx.shadowColor =
        thermo.heat > 0.28
          ? 'rgba(255, 90, 31, 0.72)'
          : (opts?.shadowColor ?? 'rgba(6, 6, 10, 0.86)');
      ctx.shadowBlur = thermo.heat > 0.28 ? 14 : 9;
      ctx.shadowOffsetY = thermo.heat > 0.28 ? 0 : 2;

      ctx.fillStyle = fill;
      ctx.fillText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
    }
    ctx.restore();

    if (opts?.splitFlapTiles) {
      const tileW = Math.max(effFont * 0.9, wChar - 2);
      const hingeY = baselineY - effFont * 0.35;
      ctx.fillStyle = 'rgba(2, 5, 11, 0.92)';
      ctx.fillRect(cursorX - 1, hingeY, tileW, 1.8);
    }

    cursorX += wChar;
  }

  ctx.restore();
  return { sparkX, sparkY, totalWidth, effectiveFontPx: effFont, hasActiveSpark };
}

function drawVerticalPoeticColumn(
  sc: ShotContext,
  line: LyricLine,
  colX: number,
  topY: number,
  fontPx: number,
  accentHex: string
): void {
  const { ctx, timeSec } = sc;
  const chars = Array.from(line.text.replace(/\s+/g, ' · '));
  const stepY = fontPx * 1.18;

  ctx.save();
  ctx.font = `700 ${Math.round(fontPx)}px "Noto Sans SC", "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Delicate vertical poetic guide rule
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.24)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(colX + fontPx * 0.78, topY - 12);
  ctx.lineTo(colX + fontPx * 0.78, topY + chars.length * stepY);
  ctx.stroke();

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const gy = topY + i * stepY;
    const thermo = computeGlyphThermodynamics(
      i,
      chars.length,
      line.startTime,
      line.endTime,
      timeSec,
      Boolean(sc.shotSpec.instantSlam)
    );
    const inEmp = isIndexInEmphasis(line, Array.from(line.text), i);

    ctx.save();
    ctx.translate(colX, gy);
    ctx.scale(thermo.scalePop, thermo.scalePop);
    if (thermo.state === 'ghost') {
      ctx.fillStyle = 'rgba(244, 239, 230, 0.25)';
      ctx.fillText(ch, 0, 0);
    } else {
      ctx.shadowColor = 'rgba(4, 12, 10, 0.9)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = interpolateHeatColor(thermo.heat, inEmp, accentHex);
      ctx.fillText(ch, 0, 0);
    }
    ctx.restore();
  }
  ctx.restore();
}

/**
 * LAYER 1: Midground World-Embedded Lyrics (Occluded by Foreground Bridge Cables, silhouettes, or poles)
 */
export function renderMidgroundDiegeticLyrics(sc: ShotContext, shot: ShotType): void {
  const line = sc.activeLine;
  if (!line || resolveDiegeticModeForShot(shot) !== 'midground_occluded') return;

  const { ctx, w, h, beat } = sc;
  const u = Math.max(0.68, Math.min(1.25, w / 1440));
  const fullDiegetic = sc.subtitleMode === 'diegetic';

  switch (shot) {
    // Explosive Sky-Monument Hero Shots (activated in `diegetic` mode so `cinema` mode never duplicates text!)
    case 's16_overpass_sunburst_low':
    case 's22_crest_leap_silhouette':
    case 's37_stormbreak_lightning_hero':
    case 's43_sunrise_halo_silhouette':
    case 's54_finale_solar_zenith_burst':
    case 's60_sky_lantern_ember_crest': {
      if (!fullDiegetic) break;
      const fontPx = 78 * u * (1 + beat.kickPulse * 0.04);
      const baseY = h * 0.29;
      const run = drawThermodynamicRun(ctx, sc, line, w * 0.5, baseY, fontPx, 'center', {
        maxWidthPx: w * 0.84,
        accentHex: '#FEF08A',
        darkCoreStroke: true,
        extrude3D: {
          vanishX: w * 0.5,
          vanishY: h * 0.6,
          depthPx: 14 * u,
          shadeHex: shot === 's37_stormbreak_lightning_hero' ? '#0C4A6E' : '#7C2D12',
        },
      });
      if (line.echoText) {
        ctx.save();
        ctx.font = `800 ${Math.round(14 * u)}px "Outfit", "JetBrains Mono", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
        ctx.fillText(line.echoText, w * 0.5, baseY + 26 * u);
        ctx.restore();
      }
      maybeSpark(sc, run.sparkX, run.sparkY, 1.15 * u, run.hasActiveSpark ? 1.0 : 0.35);
      break;
    }

    case 's45_kamakura_whistle_coast': {
      // Whistle Solo: Musical glyphs & notes dancing along the top golden coastal stave
      const displayStr = fullDiegetic ? line.text : '♪  ♫  COASTAL WHISTLE SOLO  ♪  ♫';
      const chars = Array.from(displayStr);
      const fontPx = (fullDiegetic ? 38 : 26) * u;
      const startX = w * 0.12;
      const spanW = w * 0.76;
      const stepX = spanW / Math.max(1, chars.length);

      ctx.save();
      ctx.font = `800 ${Math.round(fontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch === ' ') continue;
        const gx = startX + (i + 0.5) * stepX;
        const env = Math.sin((gx / w) * Math.PI);
        const amp = (16 + sc.bands.high * 38 + beat.snarePulse * 18) * env;
        const waveArg = gx * 0.015 - sc.timeSec * 8.5;
        const gy = h * 0.25 + Math.sin(waveArg) * amp - 16 * u;
        ctx.fillStyle = ch === '♪' || ch === '♫' ? '#FEF08A' : 'rgba(240, 253, 250, 0.92)';
        ctx.shadowColor = 'rgba(6, 44, 67, 0.75)';
        ctx.shadowBlur = 8;
        ctx.fillText(ch, gx, gy);
      }
      ctx.restore();
      break;
    }

    default: {
      // S04, S10, S19, S40, S57, S62, S65: Clean sky typography when user selects `diegetic` mode
      // (NO yellow CAD sky ruler in S04!)
      if (!fullDiegetic) break;
      const align = sc.shotSpec.lyricZone.endsWith('right')
        ? 'right'
        : sc.shotSpec.lyricZone.includes('center')
        ? 'center'
        : 'left';
      const anchorX =
        align === 'center' ? w * 0.5 : align === 'right' ? w * 0.91 : w * 0.09;
      const baseY = h * 0.28;
      drawThermodynamicRun(ctx, sc, line, anchorX, baseY, 54 * u, align, {
        maxWidthPx: w * 0.62,
        accentHex: '#FDE047',
        darkCoreStroke: true,
      });
      break;
    }
  }
}

/**
 * LAYER 2: Surface-Coupled Diegetic Typography inside Physical Props & Architectural Surfaces
 */
export function renderSurfaceDiegeticLyrics(sc: ShotContext, shot: ShotType): void {
  const line = sc.activeLine;
  if (!line || resolveDiegeticModeForShot(shot) !== 'surface_coupled') return;

  const { ctx, w, h, beat } = sc;
  const u = Math.max(0.68, Math.min(1.25, w / 1440));
  const fullDiegetic = sc.subtitleMode === 'diegetic';

  switch (shot) {
    case 's13_misty_gantry_fork_pov': {
      // Overhead Expressway Y-Fork Gantry Signboard (kept high in safe frame `y = 0.075h`!)
      const gw = Math.min(w * 0.68, 760 * u);
      const gh = 98 * u;
      const gx = (w - gw) * 0.5;
      const gy = h * 0.068;

      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5 * u;
      ctx.beginPath();
      ctx.moveTo(gx + 48 * u, 0);
      ctx.lineTo(gx + 48 * u, gy);
      ctx.moveTo(gx + gw - 48 * u, 0);
      ctx.lineTo(gx + gw - 48 * u, gy);
      ctx.stroke();

      const signGrad = ctx.createLinearGradient(gx, gy, gx, gy + gh);
      signGrad.addColorStop(0, '#063729');
      signGrad.addColorStop(1, '#04221a');
      ctx.fillStyle = signGrad;
      ctx.strokeStyle = '#6EE7B7';
      ctx.lineWidth = 2.2;
      roundRectPath(ctx, gx, gy, gw, gh, 8 * u);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#A7F3D0';
      ctx.font = `800 ${Math.round(12 * u)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('↖ EXIT A · 未知海岸', gx + 20 * u, gy + 26 * u);
      ctx.textAlign = 'right';
      ctx.fillText('漫长远方 · EXIT B ↗', gx + gw - 20 * u, gy + 26 * u);

      drawThermodynamicRun(ctx, sc, line, gx + gw * 0.5, gy + 74 * u, 36 * u, 'center', {
        maxWidthPx: gw - 48 * u,
        accentHex: '#FDE047',
      });
      ctx.restore();
      break;
    }

    case 's17_diptych_pack_and_carry': {
      // 2-Panel Diagonal Diptych Stamps (`替我装` | `替我扛`) — ZERO fabricated `"破风闯"`!
      const phrases = ['替我装', '替我扛'];
      const centers = [w * 0.26, w * 0.74];
      const activeIdx = sc.lineProgress < 0.5 ? 0 : 1;

      for (let p = 0; p < 2; p++) {
        const isLit = p <= activeIdx;
        const badgeW = Math.min(w * 0.34, 340 * u);
        const badgeH = 74 * u;
        ctx.save();
        ctx.translate(centers[p], h * 0.68);
        const pop = p === activeIdx && !sc.reducedMotion ? 1 + beat.kickPulse * 0.05 : 1;
        ctx.scale(pop, pop);

        ctx.fillStyle = p === activeIdx ? 'rgba(20, 14, 8, 0.88)' : 'rgba(10, 10, 14, 0.74)';
        ctx.strokeStyle = p === activeIdx ? '#FACC15' : 'rgba(244, 239, 230, 0.28)';
        ctx.lineWidth = p === activeIdx ? 2.2 : 1.2;
        roundRectPath(ctx, -badgeW * 0.5, -badgeH * 0.5, badgeW, badgeH, 8 * u);
        ctx.fill();
        ctx.stroke();

        const run = drawThermodynamicRun(ctx, sc, line, 0, 13 * u, 38 * u, 'center', {
          textOverride: phrases[p],
          maxWidthPx: badgeW - 32 * u,
          accentHex: '#FEF08A',
          cooledColor: isLit ? '#F4EFE6' : 'rgba(244, 239, 230, 0.45)',
        });
        if (p === activeIdx) {
          maybeSpark(sc, run.sparkX, run.sparkY, 0.9 * u, 0.85);
        }
        ctx.restore();
      }
      break;
    }

    case 's38_storm_triptych_montage':
    case 's55_memory_era_triptych': {
      // 3-Panel Montage Stamps with authentic era/storm labels (never fabricating lyrics!)
      const labels =
        shot === 's38_storm_triptych_montage'
          ? ['01 · 密封阻雨', '02 · 替我装', '03 · 替我扛']
          : ['2018 · 暮色启程', '2021 · 暴雨同行', '2026 · 替我装扛'];
      const centers = [w * 0.17, w * 0.5, w * 0.83];
      const activeIdx = Math.min(2, Math.floor(sc.lineProgress * 3));

      for (let p = 0; p < 3; p++) {
        const badgeW = Math.min(w * 0.27, 290 * u);
        const badgeH = 64 * u;
        ctx.save();
        ctx.translate(centers[p], h * 0.7);
        ctx.fillStyle = p === activeIdx ? 'rgba(18, 14, 10, 0.88)' : 'rgba(9, 10, 15, 0.76)';
        ctx.strokeStyle = p === activeIdx ? '#FACC15' : 'rgba(244, 239, 230, 0.24)';
        ctx.lineWidth = p === activeIdx ? 2 : 1.1;
        roundRectPath(ctx, -badgeW * 0.5, -badgeH * 0.5, badgeW, badgeH, 7 * u);
        ctx.fill();
        ctx.stroke();

        drawThermodynamicRun(ctx, sc, line, 0, 11 * u, 28 * u, 'center', {
          textOverride: labels[p],
          maxWidthPx: badgeW - 24 * u,
          accentHex: '#FEF08A',
        });
        ctx.restore();
      }
      break;
    }

    case 's23_brutalist_light_fortress':
    case 's44_teal_gold_sanctuary_dome':
    case 's61_golden_cathedral_bastion': {
      // Carved Architectural Sanctuary Lintel + Mirror Floor Reflection
      const lintelW = w * 0.54;
      const lintelH = 74 * u;
      const lintelX = (w - lintelW) * 0.5;
      const lintelY = h * 0.1;

      ctx.save();
      ctx.fillStyle = 'rgba(16, 15, 18, 0.86)';
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.48)';
      ctx.lineWidth = 1.8;
      roundRectPath(ctx, lintelX, lintelY, lintelW, lintelH, 6 * u);
      ctx.fill();
      ctx.stroke();

      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        w * 0.5,
        lintelY + lintelH * 0.68,
        42 * u,
        'center',
        {
          maxWidthPx: lintelW - 44 * u,
          accentHex: '#FEF08A',
        }
      );
      ctx.restore();

      ctx.save();
      ctx.translate(w * 0.5, h * 0.89);
      ctx.scale(1, -0.45);
      ctx.globalAlpha = 0.2;
      ctx.font = `900 ${Math.round(run.effectiveFontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FACC15';
      ctx.fillText(line.text, 0, 0);
      ctx.restore();
      break;
    }

    case 's26_solari_fids_delayed_macro': {
      // S26: Full-Frame 135mm Macro Italian Solari Mechanical Split-Flap FIDS Row!
      const boardW = Math.min(w * 0.82, 980 * u);
      const bx = (w - boardW) * 0.5;
      const heroRowY = h * 0.52;

      drawThermodynamicRun(
        ctx,
        sc,
        line,
        bx + 36 * u,
        heroRowY,
        46 * u,
        'left',
        {
          maxWidthPx: boardW - 72 * u,
          accentHex: '#38BDF8',
          splitFlapTiles: true,
          letterSpacingPx: Math.round(7 * u),
        }
      );
      break;
    }

    case 's35_ancient_hollow_rain_intake':
    case 's36_hollow_fireflies_ascend': {
      // Poetic Vertical-RL Classical Typography beside the glowing ancient tree hollow
      const colX = shot === 's35_ancient_hollow_rain_intake' ? w * 0.83 : w * 0.17;
      drawVerticalPoeticColumn(sc, line, colX, h * 0.18, 34 * u, '#FDE68A');
      break;
    }

    case 's66_uyuni_mirror_outro': {
      // S66 Closing Dedication Card (`206.2s -> 212.04s`) — positioned high in upper twilight sky clear of silhouette
      if (sc.timeSec >= 206.2) {
        const fade = clamp01((sc.timeSec - 206.2) / 1.8);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.fillStyle = 'rgba(7, 7, 10, 0.36)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(9, 7, 14, 0.85)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#FDE68A';
        ctx.font = `900 ${Math.round(44 * u)}px "Noto Sans SC", "Outfit", sans-serif`;
        ctx.fillText('To 我的好朋友 · 二十寸小黑', w * 0.5, h * 0.28);

        ctx.fillStyle = '#F4EFE6';
        ctx.font = `600 ${Math.round(18 * u)}px "Outfit", "Noto Sans SC", sans-serif`;
        ctx.fillText('Ham ·《嘿！小黑》· 陪伴半生山海的安稳堡垒', w * 0.5, h * 0.35);
        ctx.restore();
      } else if (fullDiegetic) {
        drawThermodynamicRun(ctx, sc, line, w * 0.5, h * 0.25, 48 * u, 'center', {
          maxWidthPx: w * 0.72,
          accentHex: '#FDE68A',
          darkCoreStroke: true,
        });
      }
      break;
    }

    default: {
      if (!fullDiegetic) break;
      // Clean scene-embedded typography for any surface_coupled shot when user selects `diegetic` mode
      const isVert =
        sc.shotSpec.lyricZone === 'poetic_vertical_left' ||
        sc.shotSpec.lyricZone === 'poetic_vertical_right';
      if (isVert) {
        const colX = sc.shotSpec.lyricZone === 'poetic_vertical_left' ? w * 0.12 : w * 0.88;
        drawVerticalPoeticColumn(sc, line, colX, h * 0.18, 34 * u, sc.chapter.accentHex);
      } else {
        const align = sc.shotSpec.lyricZone.endsWith('right')
          ? 'right'
          : sc.shotSpec.lyricZone.includes('center')
          ? 'center'
          : 'left';
        const anchorX =
          align === 'center' ? w * 0.5 : align === 'right' ? w * 0.91 : w * 0.09;
        const isLower = sc.shotSpec.lyricZone.startsWith('stage_lower');
        const baseY = isLower ? h * 0.74 : h * 0.24;
        const run = drawThermodynamicRun(ctx, sc, line, anchorX, baseY, 46 * u, align, {
          maxWidthPx: w * 0.64,
          accentHex: sc.chapter.accentHex,
          darkCoreStroke: true,
        });
        maybeSpark(sc, run.sparkX, run.sparkY, 0.95 * u, run.hasActiveSpark ? 0.85 : 0.25);
      }
      break;
    }
  }
}
