import { SONG_META, type LyricLine, type ShotType } from './mvData';
import { clamp01 } from './mvTimeline';
import { hash01, roundRectPath, type ShotContext } from './shotPrimitives';

/**
 * Restrained Cinema Palette inspired by OpenFilm `one-prompt`:
 * Deep Ink, Warm Archival Bone, Brushed Graphite, Signal Ember, and 24K Gold.
 */
export const DIEGETIC_PALETTE = {
  ink: '#0A0A0C',
  inkPanel: 'rgba(12, 12, 16, 0.82)',
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
  heat: number; // 0..1 (1 = white-hot syllable strike, 0 = cooled to material pigment)
  scalePop: number; // 1..1.14 spring nod on syllable onset
  alpha: number; // 0.24..1
  onsetSec: number;
}

const MIDGROUND_OCCLUDED_SHOTS = new Set<ShotType>([
  'traveler_wide',
  'chorus_hero_low',
  'shoulder_companion',
  'whistle_coastal',
]);

export function resolveDiegeticModeForShot(shot: ShotType): DiegeticLayerMode {
  return MIDGROUND_OCCLUDED_SHOTS.has(shot) ? 'midground_occluded' : 'surface_coupled';
}

/**
 * Deterministic per-glyph thermodynamic state (`frame(t)` pure function, zero frame-history state).
 * Before onset: faint etched/chalk pre-trace on the scene component.
 * At onset: white-hot ember/signal strike + spring nod.
 * After ~0.32s: cools smoothly into the component's physical pigment (bone, ink, LED, or 24K foil).
 */
export function computeGlyphThermodynamics(
  glyphIndex: number,
  totalGlyphs: number,
  lineStartTime: number,
  lineEndTime: number,
  timeSec: number
): GlyphThermoState {
  const safeTotal = Math.max(1, totalGlyphs);
  const sungSpan = Math.max(0.24, (lineEndTime - lineStartTime) * 0.82);
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
  if (heat > 0.72) {
    return '#FFF7ED'; // incandescent white-hot tip
  }
  if (heat > 0.42) {
    return '#FF9A4D'; // openfilm ember
  }
  if (heat > 0.18) {
    return '#FF5A1F'; // openfilm signal caret orange
  }
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
 * Deterministic Caret Spark Head + Sputtering Gravity Streaks (adapted from OpenFilm `motifs.js`)
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

  const halo = ctx.createRadialGradient(x, y, 0, x, y, 22 * scale);
  halo.addColorStop(0, `rgba(255, 247, 237, ${Math.min(1, 0.92 * power).toFixed(3)})`);
  halo.addColorStop(0.3, `rgba(255, 107, 44, ${(0.64 * power).toFixed(3)})`);
  halo.addColorStop(1, 'rgba(255, 107, 44, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, 22 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 247, 237, ${Math.min(1, 0.82 * power).toFixed(3)})`;
  ctx.lineWidth = Math.max(1, 1.3 * scale);
  for (let i = 0; i < 4; i++) {
    const a = i * (Math.PI * 0.5) + timeSec * 2.4 + 0.35;
    const r = (7.5 + 3.8 * hash01(Math.floor(timeSec * 24) + i * 7)) * scale;
    ctx.beginPath();
    ctx.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.stroke();
  }

  const rate = 24;
  const maxLife = 0.34;
  const n0 = Math.floor((timeSec - maxLife) * rate);
  const n1 = Math.floor(timeSec * rate);
  for (let n = n0; n <= n1; n++) {
    const tb = n / rate;
    const age = timeSec - tb;
    const life = maxLife * (0.4 + 0.6 * hash01(n * 3.1 + 2));
    if (age < 0 || age > life) continue;

    const ang = hash01(n * 7.7 + 1) * Math.PI * 2;
    const spd = (50 + hash01(n * 13.3 + 5) * 125) * scale;
    const vx = Math.cos(ang) * spd;
    const vy = Math.sin(ang) * spd - 34 * scale;
    const g = 280 * scale;

    const px = x + vx * age;
    const py = y + vy * age + 0.5 * g * age * age;
    const agePrev = Math.max(0, age - 0.022);
    const px0 = x + vx * agePrev;
    const py0 = y + vy * agePrev + 0.5 * g * agePrev * agePrev;

    const k = 1 - age / life;
    ctx.strokeStyle =
      k > 0.6
        ? `rgba(255, 247, 237, ${(k * power).toFixed(3)})`
        : `rgba(255, 138, 60, ${(k * 0.82 * power).toFixed(3)})`;
    ctx.lineWidth = Math.max(0.85, 1.5 * k * scale);
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

/**
 * Draws a kerning-aware, auto-fitting horizontal run of thermodynamic glyphs directly inside a
 * physical scene component, guaranteeing zero overflow past `maxWidthPx`.
 */
function drawThermodynamicRun(
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
    extrude3D?: { vanishX: number; vanishY: number; depthPx: number; shadeHex: string };
    splitFlapTiles?: boolean;
  }
): ThermoRunResult {
  const rawText = opts?.textOverride ?? line.text;
  const chars = Array.from(rawText);
  const accent = opts?.accentHex ?? sc.chapter.accentHex;

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
    const shrink = Math.max(0.46, opts.maxWidthPx / totalWidth);
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
    const layers = 9;
    for (let layer = layers; layer >= 1; layer--) {
      const f = layer / layers;
      ctx.fillStyle = shadeHex;
      ctx.globalAlpha = 0.2 + (1 - f) * 0.44;
      let cx = startX;
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch !== ' ') {
          const thermo = computeGlyphThermodynamics(
            i,
            chars.length,
            line.startTime,
            line.endTime,
            sc.timeSec
          );
          if (thermo.state !== 'ghost') {
            const dx = (vanishX - (cx + widths[i] * 0.5)) * 0.075 * f + f * depthPx * 0.22;
            const dy = (vanishY - baselineY) * 0.075 * f + f * depthPx;
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
      sc.timeSec
    );
    const inEmp = opts?.textOverride ? true : isIndexInEmphasis(line, chars, i);

    if (thermo.state !== 'ghost') {
      sparkX = cursorX + wChar * 0.52;
      sparkY = baselineY - effFont * 0.28;
      if (thermo.heat > 0.14) {
        hasActiveSpark = true;
      }
    }

    if (opts?.splitFlapTiles) {
      const tileW = Math.max(effFont * 0.9, wChar - 2);
      const tileH = effFont * 1.24;
      const tileX = cursorX - 1;
      const tileY = baselineY - effFont * 0.96;

      ctx.fillStyle = thermo.heat > 0.3 ? 'rgba(245, 158, 11, 0.32)' : '#0b101b';
      ctx.strokeStyle =
        thermo.state === 'ghost' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(125, 211, 252, 0.45)';
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
      // Mechanical Solari vertical flap flip-in compression!
      ctx.scale(1, Math.max(0.35, 1 - thermo.heat * 0.55));
    } else {
      ctx.scale(pop, pop);
    }

    if (thermo.state === 'ghost') {
      if (opts?.ghostColor) {
        ctx.fillStyle = opts.ghostColor;
        ctx.fillText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
      } else {
        // OpenFilm architectural wireframe blueprint pre-trace (always crisp against dark vistas!)
        ctx.fillStyle = 'rgba(244, 239, 230, 0.15)';
        ctx.fillText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
        ctx.strokeStyle = 'rgba(244, 239, 230, 0.46)';
        ctx.lineWidth = Math.max(0.9, effFont * 0.02);
        ctx.strokeText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
      }
    } else {
      const fill =
        thermo.heat <= 0.18 && !inEmp && opts?.cooledColor
          ? opts.cooledColor
          : interpolateHeatColor(thermo.heat, inEmp, accent);

      ctx.shadowColor =
        thermo.heat > 0.28
          ? 'rgba(255, 90, 31, 0.78)'
          : (opts?.shadowColor ?? 'rgba(6, 6, 10, 0.84)');
      ctx.shadowBlur = thermo.heat > 0.28 ? 16 : 9;
      ctx.shadowOffsetY = thermo.heat > 0.28 ? 0 : 2;

      ctx.fillStyle = fill;
      ctx.fillText(ch, -(wChar - spacing) * 0.5, effFont * 0.34);
    }
    ctx.restore();

    if (opts?.splitFlapTiles) {
      const tileW = Math.max(effFont * 0.9, wChar - 2);
      const hingeY = baselineY - effFont * 0.35;
      ctx.fillStyle = 'rgba(2, 5, 11, 0.9)';
      ctx.fillRect(cursorX - 1, hingeY, tileW, 1.8);
    }

    cursorX += wChar;
  }

  ctx.restore();
  return { sparkX, sparkY, totalWidth, effectiveFontPx: effFont, hasActiveSpark };
}

function splitTriptychPhrases(text: string): [string, string, string] {
  const cleaned = text.replace(/[，,]/g, ' ').trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length >= 3) {
    return [tokens[0], tokens[1], tokens.slice(2).join('')];
  }
  if (tokens.length === 2) {
    return [tokens[0], tokens[1], '破风闯'];
  }
  const chars = Array.from(cleaned);
  const n = Math.max(1, Math.ceil(chars.length / 3));
  return [
    chars.slice(0, n).join(''),
    chars.slice(n, n * 2).join('') || '同行',
    chars.slice(n * 2).join('') || '向前',
  ];
}

/**
 * LAYER 1: Midground World-Embedded Lyrics (Occluded by Foreground Bridge Cables, Rooftops, Poles & Characters)
 */
export function renderMidgroundDiegeticLyrics(sc: ShotContext, shot: ShotType): void {
  const line = sc.activeLine;
  if (!line || resolveDiegeticModeForShot(shot) !== 'midground_occluded') return;

  const { ctx, w, h, timeSec, beat } = sc;
  const u = Math.max(0.68, Math.min(1.25, w / 1440));

  switch (shot) {
    case 'traveler_wide': {
      // Shot 02: Twilight Bay Bridge Sky Monument — set behind the steel H-towers and vertical suspender cables!
      const x0 = w * 0.075;
      const baseY = h * 0.32;
      const fontPx = 66 * u;

      const run = drawThermodynamicRun(ctx, sc, line, x0, baseY, fontPx, 'left', {
        maxWidthPx: w * 0.58,
        accentHex: '#FDE047',
      });

      // OpenFilm-style architectural drafting datum wire, calibration ticks & vertical extension hairlines
      ctx.save();
      ctx.strokeStyle = 'rgba(244, 239, 230, 0.34)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x0 - 10 * u, baseY + 14 * u);
      ctx.lineTo(x0 + run.totalWidth + 24 * u, baseY + 14 * u);
      ctx.moveTo(x0, baseY - run.effectiveFontPx * 0.88);
      ctx.lineTo(x0, h * 0.65);
      for (let tx = x0; tx <= x0 + run.totalWidth + 16 * u; tx += 36 * u) {
        ctx.moveTo(tx, baseY + 11 * u);
        ctx.lineTo(tx, baseY + 17 * u);
      }
      ctx.stroke();
      ctx.restore();

      drawCaretSpark(
        ctx,
        run.sparkX,
        baseY + 14 * u,
        timeSec,
        1.05 * u,
        run.hasActiveSpark ? 0.98 : 0.38
      );
      break;
    }

    case 'chorus_hero_low': {
      // Shot 08: Colossal 3D-extruded solar-corona monument rising behind the overpass parapet & Traveler!
      const fontPx = 82 * u * (1 + beat.kickPulse * 0.04);
      const baseY = h * 0.33;

      const run = drawThermodynamicRun(ctx, sc, line, w * 0.5, baseY, fontPx, 'center', {
        maxWidthPx: w * 0.86,
        accentHex: '#FEF08A',
        extrude3D: {
          vanishX: w * 0.5,
          vanishY: h * 0.62,
          depthPx: 16 * u,
          shadeHex: '#9A3412',
        },
      });

      drawCaretSpark(
        ctx,
        run.sparkX,
        run.sparkY,
        timeSec,
        1.25 * u,
        run.hasActiveSpark ? 1.12 : 0.44
      );
      break;
    }

    case 'shoulder_companion': {
      // Shot 10: Harbor-Skyline Architectural Rooftop Sign Structure mounted atop distant waterfront towers
      // + upside-down shimmer reflected in the harbor bay water below!
      const signLeft = w * 0.08;
      const baseY = h * 0.35;
      const fontPx = 58 * u;

      const run = drawThermodynamicRun(ctx, sc, line, signLeft, baseY, fontPx, 'left', {
        maxWidthPx: w * 0.45,
        accentHex: '#FACC15',
      });

      // Architectural steel rooftop sign truss & vertical struts anchored down into the skyline!
      const trussW = Math.max(196 * u, run.totalWidth + 26 * u);
      const beamY = baseY + 13 * u;
      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.38)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(signLeft - 8 * u, beamY);
      ctx.lineTo(signLeft + trussW, beamY);
      ctx.moveTo(signLeft - 8 * u, beamY + 6 * u);
      ctx.lineTo(signLeft + trussW, beamY + 6 * u);
      ctx.stroke();

      // Rooftop support legs connecting into distant harbor buildings
      ctx.strokeStyle = 'rgba(244, 239, 230, 0.22)';
      ctx.lineWidth = 1.05;
      for (const frac of [0.06, 0.35, 0.65, 0.94]) {
        const sx = signLeft + trussW * frac;
        ctx.beginPath();
        ctx.moveTo(sx, beamY + 6 * u);
        ctx.lineTo(sx, h * 0.48);
        ctx.stroke();
      }
      ctx.restore();

      drawCaretSpark(
        ctx,
        run.sparkX,
        beamY,
        timeSec,
        1.0 * u,
        run.hasActiveSpark ? 0.92 : 0.34
      );

      // Shimmering upside-down harbor water reflection in the bay (`h * 0.62 .. 0.84`)
      ctx.save();
      ctx.translate(0, h * 0.71);
      ctx.scale(1, -0.44);
      ctx.globalAlpha = 0.22;
      ctx.font = `900 ${Math.round(run.effectiveFontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.fillStyle = '#FDE68A';
      ctx.fillText(line.text, signLeft, 0);
      ctx.restore();
      break;
    }

    case 'whistle_coastal': {
      // Shot 17: Musical glyphs riding directly along the primary golden whistle stave (`h * 0.26`),
      // occluded by passing Kamakura seaside utility poles!
      const chars = Array.from(line.text);
      const fontPx = 40 * u;
      const startX = w * 0.11;
      const spanW = w * 0.78;
      const stepX = spanW / Math.max(1, chars.length);

      ctx.save();
      ctx.font = `900 ${Math.round(fontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let sparkX = startX;
      let sparkY = h * 0.26;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const gx = startX + (i + 0.5) * stepX;
        const env = Math.sin((gx / w) * Math.PI);
        const amp = (18 + sc.bands.high * 42 + beat.snarePulse * 22) * env;
        const waveArg = gx * 0.015 - timeSec * 9.5;
        const gy = h * 0.26 + Math.sin(waveArg) * amp - 18 * u;
        const slope = Math.atan(Math.cos(waveArg) * 0.015 * amp * 0.55);

        if (ch === ' ') continue;
        const thermo = computeGlyphThermodynamics(
          i,
          chars.length,
          line.startTime,
          line.endTime,
          timeSec
        );
        const inEmp = isIndexInEmphasis(line, chars, i);

        if (thermo.state !== 'ghost') {
          sparkX = gx;
          sparkY = gy;
        }

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(slope);
        ctx.scale(thermo.scalePop, thermo.scalePop);
        if (thermo.state === 'ghost') {
          ctx.fillStyle = 'rgba(224, 242, 254, 0.16)';
          ctx.fillText(ch, 0, 0);
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.52)';
          ctx.lineWidth = 1.05;
          ctx.strokeText(ch, 0, 0);
        } else {
          ctx.shadowColor = thermo.heat > 0.28 ? 'rgba(255, 90, 31, 0.72)' : 'rgba(6, 44, 67, 0.82)';
          ctx.shadowBlur = 11;
          ctx.shadowOffsetY = 3;
          ctx.fillStyle = interpolateHeatColor(thermo.heat, inEmp, '#FEF08A');
          ctx.fillText(ch, 0, 0);
        }
        ctx.restore();
      }
      ctx.restore();

      drawCaretSpark(ctx, sparkX, sparkY, timeSec, 1.0 * u, 0.8);
      break;
    }

    default:
      break;
  }
}

/**
 * LAYER 2: Scene-Component Diegetic Lyrics (Every Shot's Lyric Lives Inside Its Own Hero Physical Object)
 * Zero generic floating HUD boxes, zero `FR 00412 · 24FPS` overlays, zero duplicate competing boards!
 */
export function renderSurfaceDiegeticLyrics(sc: ShotContext, shot: ShotType): void {
  const line = sc.activeLine;
  if (!line || resolveDiegeticModeForShot(shot) !== 'surface_coupled') return;

  const { ctx, w, h, timeSec, chapter, beat, bands } = sc;
  const u = Math.max(0.68, Math.min(1.25, w / 1440));

  switch (shot) {
    case 'guitar_macro': {
      // Shot 01: Acoustic String-Resonance Typography!
      // Glyphs vibrate directly along the upper phosphor-bronze guitar string plane above the rosette,
      // while the vintage paper label glued INSIDE the soundhole carries the song credit!
      const holeY = h * 0.56;
      const holeR = Math.min(w, h) * (0.21 + beat.kickPulse * 0.012);
      const topStringY = holeY - holeR * 0.62;
      const bridgeX = w * 0.74;
      const chars = Array.from(line.text);
      const fontPx = 40 * u;
      const startX = w * 0.1;
      const spanW = bridgeX - startX - 28 * u;
      const stepX = spanW / Math.max(1, chars.length);

      const pluckAmp =
        (timeSec > 3.1 ? 1 : 0.28) *
        (beat.kickPulse * 14 + beat.snarePulse * 10 + bands.mid * 10);

      ctx.save();
      ctx.font = `900 ${Math.round(fontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      let sparkX = startX;
      let sparkY = topStringY - 34 * u;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const gx = startX + (i + 0.5) * stepX;
        const t = gx / (bridgeX + 12);
        const env = Math.sin(t * Math.PI);
        const stringVibY = Math.sin(gx * 0.032 + timeSec * 34) * pluckAmp * env * 0.55;
        const gy = topStringY - 18 * (1 - t) - 26 * u + stringVibY;

        if (ch === ' ') continue;
        const thermo = computeGlyphThermodynamics(
          i,
          chars.length,
          line.startTime,
          line.endTime,
          timeSec
        );
        const inEmp = isIndexInEmphasis(line, chars, i);
        if (thermo.state !== 'ghost') {
          sparkX = gx;
          sparkY = gy - fontPx * 0.3;
        }

        ctx.save();
        ctx.translate(gx, gy);
        ctx.scale(thermo.scalePop, thermo.scalePop);
        if (thermo.state === 'ghost') {
          ctx.fillStyle = 'rgba(244, 239, 230, 0.14)';
          ctx.fillText(ch, 0, 0);
          ctx.strokeStyle = 'rgba(244, 239, 230, 0.44)';
          ctx.lineWidth = 1.0;
          ctx.strokeText(ch, 0, 0);
        } else {
          ctx.shadowColor = thermo.heat > 0.28 ? 'rgba(255, 90, 31, 0.75)' : 'rgba(12, 5, 3, 0.9)';
          ctx.shadowBlur = 12;
          ctx.fillStyle = interpolateHeatColor(thermo.heat, inEmp, '#FACC15');
          ctx.fillText(ch, 0, 0);
        }
        ctx.restore();
      }
      ctx.restore();

      drawCaretSpark(ctx, sparkX, sparkY, timeSec, 0.95 * u, 0.85);
      break;
    }

    case 'boots_wheels_low': {
      // Shot 03: Perspective-sheared Thermoplastic Road-Lane Stencil painted directly on the wet asphalt
      // beneath the rolling Multiwheels and mileage odometer ruler (cleanly above paused DirectorDock!).
      const roadStencilY = h * 0.728;
      const fontPx = 44 * u;

      ctx.save();
      ctx.translate(w * 0.5, roadStencilY);
      ctx.transform(1, 0, -0.24, 0.78, 0, 0);

      // Painted yellow highway lane stencil double bars
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.38)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-w * 0.36, -fontPx * 1.04);
      ctx.lineTo(w * 0.36, -fontPx * 1.04);
      ctx.moveTo(-w * 0.38, 15 * u);
      ctx.lineTo(w * 0.38, 15 * u);
      ctx.stroke();

      const run = drawThermodynamicRun(ctx, sc, line, 0, 0, fontPx, 'center', {
        maxWidthPx: w * 0.68,
        accentHex: '#FACC15',
      });

      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 1.0 * u, run.hasActiveSpark ? 0.95 : 0.36);
      ctx.restore();
      break;
    }

    case 'scuffed_shell_closeup': {
      // Shot 04: Recessed Brushed-Aluminum RIMOWA Central Monogram Plaque bolted at exact shell center
      // (`w * 0.5, h * 0.55`) and exact shell angle (`-0.09 rad`)!
      const plaqueW = Math.min(w * 0.62, 680 * u);
      const plaqueH = 104 * u;

      ctx.save();
      ctx.translate(w * 0.5, h * 0.56);
      ctx.rotate(-0.09);

      // Recessed gunmetal-aluminum RIMOWA plaque with 4 corner hex rivets
      const pGrad = ctx.createLinearGradient(-plaqueW * 0.5, -plaqueH * 0.5, plaqueW * 0.5, plaqueH * 0.5);
      pGrad.addColorStop(0, 'rgba(24, 24, 31, 0.92)');
      pGrad.addColorStop(0.5, 'rgba(39, 39, 48, 0.94)');
      pGrad.addColorStop(1, 'rgba(16, 16, 22, 0.94)');
      ctx.fillStyle = pGrad;
      ctx.strokeStyle = 'rgba(212, 212, 216, 0.55)';
      ctx.lineWidth = 2;
      roundRectPath(ctx, -plaqueW * 0.5, -plaqueH * 0.5, plaqueW, plaqueH, 12 * u);
      ctx.fill();
      ctx.stroke();

      // Inner chamfer hairline + 4 brushed aluminum corner rivets
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.28)';
      ctx.lineWidth = 1;
      roundRectPath(ctx, -plaqueW * 0.5 + 7 * u, -plaqueH * 0.5 + 7 * u, plaqueW - 14 * u, plaqueH - 14 * u, 8 * u);
      ctx.stroke();

      for (const [rx, ry] of [
        [-plaqueW * 0.5 + 18 * u, -plaqueH * 0.5 + 18 * u],
        [plaqueW * 0.5 - 18 * u, -plaqueH * 0.5 + 18 * u],
        [-plaqueW * 0.5 + 18 * u, plaqueH * 0.5 - 18 * u],
        [plaqueW * 0.5 - 18 * u, plaqueH * 0.5 - 18 * u],
      ]) {
        ctx.fillStyle = '#d4d4d8';
        ctx.beginPath();
        ctx.arc(rx, ry, 3.4 * u, 0, Math.PI * 2);
        ctx.fill();
      }

      const fontPx = 44 * u;
      const run = drawThermodynamicRun(ctx, sc, line, 0, fontPx * 0.33, fontPx, 'center', {
        maxWidthPx: plaqueW - 64 * u,
        accentHex: '#FDE047',
      });
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 1.0 * u, run.hasActiveSpark ? 1.0 : 0.38);
      ctx.restore();
      break;
    }

    case 'priority_tags_macro': {
      // Shot 05: The Center Hero Hanging Airline `PRIORITY` Tag (`w * 0.5, h * 0.52`),
      // physically tied by the center braided cord from the top chrome handle lug!
      const tagW = Math.min(w * 0.58, 610 * u) * (1 + beat.kickPulse * 0.04);
      const tagH = 132 * u * (1 + beat.kickPulse * 0.04);
      const flutter = Math.sin(timeSec * 3.2 + 4) * 0.022;

      ctx.save();
      ctx.translate(w * 0.5, h * 0.52);
      ctx.rotate(-0.04 + flutter);

      // Realistic elevation shadow onto grooved RIMOWA shell
      ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
      roundRectPath(ctx, -tagW * 0.5 + 6 * u, -tagH * 0.5 + 10 * u, tagW, tagH, 10 * u);
      ctx.fill();

      // Warm heavy cardstock airline tag body
      ctx.fillStyle = '#F5EFE2';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.4;
      roundRectPath(ctx, -tagW * 0.5, -tagH * 0.5, tagW, tagH, 10 * u);
      ctx.fill();
      ctx.stroke();

      // Left signal-orange PRIORITY stub + brass eyelet grommet where braided cord ties in!
      const stubW = 112 * u;
      ctx.fillStyle = '#EA580C';
      roundRectPath(ctx, -tagW * 0.5 + 8 * u, -tagH * 0.5 + 8 * u, stubW, tagH - 16 * u, 6 * u);
      ctx.fill();

      // Brass cord grommet on left edge
      ctx.fillStyle = '#18181B';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(-tagW * 0.5 + 22 * u, 0, 6.5 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFBEB';
      ctx.font = `900 ${Math.round(14 * u)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('PRIORITY', -tagW * 0.5 + 16 * u + stubW * 0.5, -6 * u);
      ctx.font = `700 ${Math.round(10 * u)}px "JetBrains Mono", monospace`;
      ctx.fillText('20" CABIN', -tagW * 0.5 + 16 * u + stubW * 0.5, 13 * u);

      // Right IATA barcode strip
      const barRight = tagW * 0.5 - 56 * u;
      ctx.fillStyle = '#18181B';
      for (let b = 0; b < 11; b++) {
        const bw = (b % 3 === 0 ? 3.2 : 1.5) * u;
        ctx.fillRect(barRight + b * 4.2 * u, -tagH * 0.5 + 18 * u, bw, tagH - 36 * u);
      }

      // Active Lyric printed in bold airline routing ink across the white/bone ticket field!
      const fieldCenterX = (-tagW * 0.5 + stubW + 14 * u + (barRight - 10 * u)) * 0.5;
      const fieldMaxW = barRight - (-tagW * 0.5 + stubW + 32 * u);
      const fontPx = 40 * u;
      const run = drawThermodynamicRun(ctx, sc, line, fieldCenterX, fontPx * 0.34, fontPx, 'center', {
        maxWidthPx: fieldMaxW,
        accentHex: '#D9480F',
        ghostColor: 'rgba(28, 25, 23, 0.24)',
        cooledColor: '#111115',
        shadowColor: 'rgba(255, 255, 255, 0)',
      });
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.9 * u, run.hasActiveSpark ? 0.9 : 0.25);
      ctx.restore();
      break;
    }

    case 'open_suitcase': {
      // Shot 06: Open Cream Wax-Sealed Archival Letter tucked directly INSIDE the left unzipped RIMOWA compartment!
      const halfW = Math.min(w * 0.37, 376);
      const boxH = Math.min(h * 0.58, 446);
      const cy = h * 0.55;
      const gap = 18;
      const leftX = w * 0.5 - gap - halfW;

      const cardW = halfW - 44;
      const cardH = Math.min(132, boxH * 0.3);
      const cardCenterX = leftX + halfW * 0.5;
      const cardCenterY = cy - boxH * 0.22;

      ctx.save();
      ctx.translate(cardCenterX, cardCenterY);
      ctx.rotate(-0.032);

      // Warm cream archival stationery letter tucked into left compartment
      ctx.shadowColor = 'rgba(0, 0, 0, 0.48)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = '#F6EFE0';
      roundRectPath(ctx, -cardW * 0.5, -cardH * 0.5, cardW, cardH, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Subtle airmail border & crimson wax seal
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.32)';
      ctx.lineWidth = 1.2;
      roundRectPath(ctx, -cardW * 0.5 + 7, -cardH * 0.5 + 7, cardW - 14, cardH - 14, 4);
      ctx.stroke();

      ctx.fillStyle = '#B91C1C';
      ctx.beginPath();
      ctx.arc(cardW * 0.5 - 24, -cardH * 0.5 + 22, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FCA5A5';
      ctx.beginPath();
      ctx.arc(cardW * 0.5 - 26, -cardH * 0.5 + 20, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#785A46';
      ctx.font = '700 10px "JetBrains Mono", "Noto Sans SC", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('致老友 · 旅途手札', -cardW * 0.5 + 16, -cardH * 0.5 + 24);

      // Handwritten-feel warm ink lyric inside the packed letter
      const fontPx = 30 * u;
      const run = drawThermodynamicRun(ctx, sc, line, 0, 18, fontPx, 'center', {
        maxWidthPx: cardW - 34,
        accentHex: '#C2410C',
        ghostColor: 'rgba(87, 65, 50, 0.48)',
        cooledColor: '#1E1612',
        shadowColor: 'rgba(0, 0, 0, 0)',
      });
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.78 * u, run.hasActiveSpark ? 0.85 : 0.2);

      // Faint RIMOWA Flex-Divider mesh lines crossing OVER the letter so it sits physically inside the pocket!
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let mx = -cardW * 0.5 + 18; mx < cardW * 0.5 - 12; mx += 22) {
        ctx.moveTo(mx, -cardH * 0.5);
        ctx.lineTo(mx, cardH * 0.5);
      }
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'crossroads_pov': {
      // Shot 07: Overhead Steel-Truss Illuminated Expressway Gantry Signboard!
      const gw = Math.min(w * 0.7, 800 * u);
      const gh = 114 * u;
      const gx = (w - gw) * 0.5;
      const gy = h * 0.085;

      ctx.save();
      // Steel truss vertical & diagonal gantry hangers anchored to top frame
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6 * u;
      ctx.beginPath();
      ctx.moveTo(gx + 52 * u, 0);
      ctx.lineTo(gx + 52 * u, gy);
      ctx.moveTo(gx + gw - 52 * u, 0);
      ctx.lineTo(gx + gw - 52 * u, gy);
      ctx.stroke();

      // Reflective emerald highway signboard with internal LED matrix glow
      const signGrad = ctx.createLinearGradient(gx, gy, gx, gy + gh);
      signGrad.addColorStop(0, '#063729');
      signGrad.addColorStop(1, '#04221a');
      ctx.fillStyle = signGrad;
      ctx.strokeStyle = '#6EE7B7';
      ctx.lineWidth = 2.6;
      roundRectPath(ctx, gx, gy, gw, gh, 9 * u);
      ctx.fill();
      ctx.stroke();

      // Inner white retro-reflective highway border + exit route shield
      ctx.strokeStyle = 'rgba(236, 253, 245, 0.35)';
      ctx.lineWidth = 1.2;
      roundRectPath(ctx, gx + 6 * u, gy + 6 * u, gw - 12 * u, gh - 12 * u, 6 * u);
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      roundRectPath(ctx, gx + 18 * u, gy + 14 * u, 86 * u, 20 * u, 4 * u);
      ctx.fill();
      ctx.fillStyle = '#022C22';
      ctx.font = `800 ${Math.round(10.5 * u)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('EXIT 20 ↗', gx + 61 * u, gy + 28 * u);

      const fontPx = 42 * u;
      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        gx + gw * 0.5,
        gy + 84 * u,
        fontPx,
        'center',
        {
          maxWidthPx: gw - 56 * u,
          accentHex: '#FDE047',
        }
      );
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.95 * u, run.hasActiveSpark ? 0.95 : 0.3);
      ctx.restore();
      break;
    }

    case 'split_triptych': {
      // Shot 09: 3-Panel Diagonal Montage Stamps — splits the active lyric across Panels 1, 2 & 3
      // and lights each panel in rhythmic lockstep with the 96-BPM beat!
      const [part1, part2, part3] = splitTriptychPhrases(line.text);
      const x1 = w * 0.34;
      const x2 = w * 0.67;
      const centers = [x1 * 0.48, (x1 + x2) * 0.5, x2 + (w - x2) * 0.52];
      const parts = [part1, part2, part3];
      const activePanel = beat.beatInBar % 3;

      for (let p = 0; p < 3; p++) {
        const isLit = p === activePanel || sc.lineProgress > (p + 0.6) / 3;
        const panelCenterY = h * 0.715;
        const badgeW = Math.min(w * 0.25, 290 * u);
        const badgeH = 74 * u;

        ctx.save();
        ctx.translate(centers[p], panelCenterY);
        const pop = p === activePanel && !sc.reducedMotion ? 1 + beat.kickPulse * 0.06 : 1;
        ctx.scale(pop, pop);

        ctx.fillStyle = p === activePanel ? 'rgba(20, 14, 8, 0.88)' : 'rgba(10, 10, 14, 0.76)';
        ctx.strokeStyle = p === activePanel ? '#FACC15' : 'rgba(244, 239, 230, 0.26)';
        ctx.lineWidth = p === activePanel ? 2.2 : 1.2;
        roundRectPath(ctx, -badgeW * 0.5, -badgeH * 0.5, badgeW, badgeH, 8 * u);
        ctx.fill();
        ctx.stroke();

        const fontPx = 38 * u;
        const run = drawThermodynamicRun(ctx, sc, line, 0, fontPx * 0.34, fontPx, 'center', {
          textOverride: parts[p],
          maxWidthPx: badgeW - 28 * u,
          accentHex: p === activePanel ? '#FEF08A' : '#F4EFE6',
          cooledColor: isLit ? '#F4EFE6' : 'rgba(244, 239, 230, 0.52)',
        });

        if (p === activePanel) {
          drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.9 * u, 0.88);
        }
        ctx.restore();
      }
      break;
    }

    case 'fortress_monolith': {
      // Shot 11: Carved Sanctuary Architrave Lintel spanning across the basalt colonnade pillars
      // + upside-down mirror reflection in the obsidian sanctuary floor!
      const lintelW = w * 0.56;
      const lintelH = 82 * u;
      const lintelX = (w - lintelW) * 0.5;
      const lintelY = h * 0.11;

      ctx.save();
      const stoneGrad = ctx.createLinearGradient(lintelX, lintelY, lintelX + lintelW, lintelY + lintelH);
      stoneGrad.addColorStop(0, 'rgba(18, 14, 12, 0.9)');
      stoneGrad.addColorStop(0.5, 'rgba(36, 26, 18, 0.92)');
      stoneGrad.addColorStop(1, 'rgba(18, 14, 12, 0.9)');
      ctx.fillStyle = stoneGrad;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.54)';
      ctx.lineWidth = 2;
      roundRectPath(ctx, lintelX, lintelY, lintelW, lintelH, 6 * u);
      ctx.fill();
      ctx.stroke();

      const fontPx = 48 * u;
      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        w * 0.5,
        lintelY + lintelH * 0.68,
        fontPx,
        'center',
        {
          maxWidthPx: lintelW - 48 * u,
          accentHex: '#FEF08A',
        }
      );
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 1.05 * u, run.hasActiveSpark ? 1.05 : 0.4);
      ctx.restore();

      // Mirror obsidian floor reflection at `y = 0.89h`
      ctx.save();
      ctx.translate(w * 0.5, h * 0.89);
      ctx.scale(1, -0.5);
      ctx.globalAlpha = 0.24;
      ctx.font = `900 ${Math.round(run.effectiveFontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FACC15';
      ctx.fillText(line.text, 0, 0);
      ctx.restore();
      break;
    }

    case 'turntable_carousel': {
      // Shot 12: Circular Curved Platter Rim Typography wrapping directly around the spinning
      // audiophile vinyl / airport baggage-carousel bezel (`cx = w * 0.48, cy = h * 0.54`)!
      const cx = w * 0.48;
      const cy = h * 0.54;
      const textR = Math.min(w, h) * 0.418;
      const chars = Array.from(line.text);
      const fontPx = 30 * u;
      const arcSpan = Math.min(Math.PI * 0.82, chars.length * 0.088);
      // Gentle audiophile platter drift
      const centerAngle = -Math.PI * 0.5 + Math.sin(timeSec * 0.5) * 0.08;
      const startAngle = centerAngle - arcSpan * 0.5;

      ctx.save();
      ctx.font = `900 ${Math.round(fontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let sparkX = cx;
      let sparkY = cy - textR;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const frac = chars.length > 1 ? i / (chars.length - 1) : 0.5;
        const ang = startAngle + frac * arcSpan;
        const gx = cx + Math.cos(ang) * textR;
        const gy = cy + Math.sin(ang) * textR;

        if (ch === ' ') continue;
        const thermo = computeGlyphThermodynamics(
          i,
          chars.length,
          line.startTime,
          line.endTime,
          timeSec
        );
        const inEmp = isIndexInEmphasis(line, chars, i);
        if (thermo.state !== 'ghost') {
          sparkX = gx;
          sparkY = gy;
        }

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(ang + Math.PI * 0.5);
        ctx.scale(thermo.scalePop, thermo.scalePop);
        if (thermo.state === 'ghost') {
          ctx.fillStyle = 'rgba(244, 239, 230, 0.14)';
          ctx.fillText(ch, 0, 0);
          ctx.strokeStyle = 'rgba(244, 239, 230, 0.42)';
          ctx.lineWidth = 0.95;
          ctx.strokeText(ch, 0, 0);
        } else {
          ctx.shadowColor = thermo.heat > 0.28 ? 'rgba(255, 90, 31, 0.72)' : 'rgba(3, 7, 15, 0.9)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = interpolateHeatColor(thermo.heat, inEmp, '#22D3EE');
          ctx.fillText(ch, 0, 0);
        }
        ctx.restore();
      }
      ctx.restore();

      drawCaretSpark(ctx, sparkX, sparkY, timeSec, 0.9 * u, 0.85);
      break;
    }

    case 'airport_delay_rain': {
      // Shot 13: ONE Unified Ceiling-Suspended Solari Mechanical Split-Flap Departure Board (FIDS)!
      // Houses `MU 2020 · B20 · 暴雨延误` on Row 1, the live flipping active lyric on Hero Row 2,
      // and `CA 1809 · WEATHER HOLD` on Row 3 + upside-down reflection on the wet terrazzo floor!
      const bw = Math.min(w * 0.48, 660 * u);
      const bh = 148 * u;
      const bx = w * 0.46;
      const by = h * 0.1;

      ctx.save();
      // Twin brushed-steel ceiling suspension rods hanging from terminal roof
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5 * u;
      ctx.beginPath();
      ctx.moveTo(bx + 44 * u, 0);
      ctx.lineTo(bx + 44 * u, by);
      ctx.moveTo(bx + bw - 44 * u, 0);
      ctx.lineTo(bx + bw - 44 * u, by);
      ctx.stroke();

      // Anodized dark-slate FIDS cabinet chassis
      ctx.fillStyle = 'rgba(7, 11, 20, 0.94)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 2;
      roundRectPath(ctx, bx, by, bw, bh, 10 * u);
      ctx.fill();
      ctx.stroke();

      // Row 1: Flight header + red `暴雨延误` badge
      ctx.fillStyle = '#94A3B8';
      ctx.font = `700 ${Math.round(11 * u)}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('DEPARTURES · MU 2020 · GATE B20', bx + 18 * u, by + 26 * u);

      ctx.fillStyle = '#DC2626';
      roundRectPath(ctx, bx + bw - 106 * u, by + 11 * u, 88 * u, 22 * u, 4 * u);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 ${Math.round(11.5 * u)}px "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('暴雨延误', bx + bw - 62 * u, by + 26 * u);

      // Divider line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + 14 * u, by + 40 * u);
      ctx.lineTo(bx + bw - 14 * u, by + 40 * u);
      ctx.moveTo(bx + 14 * u, by + bh - 30 * u);
      ctx.lineTo(bx + bw - 14 * u, by + bh - 30 * u);
      ctx.stroke();

      // Hero Row 2: Live Mechanical Split-Flap Active Lyric!
      const fontPx = 38 * u;
      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        bx + 20 * u,
        by + 96 * u,
        fontPx,
        'left',
        {
          maxWidthPx: bw - 40 * u,
          accentHex: '#38BDF8',
          splitFlapTiles: true,
          letterSpacingPx: Math.round(6 * u),
        }
      );

      // Row 3: Secondary flight status bar
      ctx.fillStyle = '#F59E0B';
      ctx.font = `600 ${Math.round(10.5 * u)}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('REMARKS: THUNDERSTORM · HOLD AT GATE B20', bx + 18 * u, by + bh - 11 * u);

      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.9 * u, run.hasActiveSpark ? 0.9 : 0.25);
      ctx.restore();

      // Upside-down wet terrazzo concourse floor reflection beneath the FIDS board!
      ctx.save();
      ctx.translate(bx + bw * 0.5, h * 0.87);
      ctx.scale(1, -0.44);
      ctx.globalAlpha = 0.22;
      ctx.font = `900 ${Math.round(run.effectiveFontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7DD3FC';
      ctx.fillText(line.text, 0, 0);
      ctx.restore();
      break;
    }

    case 'handle_warmth_macro': {
      // Shot 14: Architectural 85mm Macro Callout Installation (`openfilm` precision datum style)
      // Anchored in the upper-left rain-bokeh negative space (`x = w * 0.085, y = h * 0.31`)
      // with a hairline thermal callout leader pointing directly to the palm-warmed RIMOWA handle!
      const anchorX = w * 0.085;
      const baseY = h * 0.31;
      const fontPx = 50 * u;

      ctx.save();
      const run = drawThermodynamicRun(ctx, sc, line, anchorX, baseY, fontPx, 'left', {
        maxWidthPx: w * 0.48,
        accentHex: '#FDE047',
      });

      // Architectural datum baseline + 45° precision callout leader into the glowing palm-handle contact point
      const lineEndX = anchorX + run.totalWidth + 14 * u;
      const lineY = baseY + 15 * u;
      const targetX = w * 0.485;
      const targetY = h * 0.495;

      ctx.strokeStyle = 'rgba(253, 224, 71, 0.38)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(anchorX - 8 * u, lineY);
      ctx.lineTo(lineEndX, lineY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // Micro terminal sensor ring at the handle warmth origin
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 3.0 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 7.5 * u, 0, Math.PI * 2);
      ctx.stroke();

      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.96 * u, run.hasActiveSpark ? 0.95 : 0.35);
      ctx.restore();
      break;
    }

    case 'concourse_parting': {
      // Shot 15: Suspended Grand Concourse Arch Destination Board hanging directly beneath
      // the illuminated station clock (`clkX = w * 0.5, clkY = h * 0.18`) + floor reflection!
      const bw = Math.min(w * 0.56, 680 * u);
      const bh = 80 * u;
      const bx = (w - bw) * 0.5;
      const by = h * 0.225;

      ctx.save();
      // Brass hanger struts linking the station clock ring (`h * 0.18 + 24`) to the concourse board
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 98 * u, h * 0.185);
      ctx.lineTo(w * 0.5 - 98 * u, by);
      ctx.moveTo(w * 0.5 + 98 * u, h * 0.185);
      ctx.lineTo(w * 0.5 + 98 * u, by);
      ctx.stroke();

      ctx.fillStyle = 'rgba(8, 15, 28, 0.90)';
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.52)';
      ctx.lineWidth = 1.6;
      roundRectPath(ctx, bx, by, bw, bh, 8 * u);
      ctx.fill();
      ctx.stroke();

      const fontPx = 42 * u;
      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        w * 0.5,
        by + bh * 0.68,
        fontPx,
        'center',
        {
          maxWidthPx: bw - 44 * u,
          accentHex: '#FDE047',
        }
      );
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.98 * u, run.hasActiveSpark ? 0.92 : 0.34);
      ctx.restore();

      // Subtle concourse mirror terrazzo floor reflection
      ctx.save();
      ctx.translate(w * 0.5, h * 0.9);
      ctx.scale(1, -0.44);
      ctx.globalAlpha = 0.18;
      ctx.font = `900 ${Math.round(run.effectiveFontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE68A';
      ctx.fillText(line.text, 0, 0);
      ctx.restore();
      break;
    }

    case 'tree_hollow_poetic': {
      // Shot 16: Sinuous Bioluminescent Firefly Stream rising organically from inside the glowing
      // ancient tree hollow (`cx = w * 0.46, h * 0.42`) into the moonlit forest canopy (`w * 0.78, h * 0.16`)
      // + tranquil woodland rain-puddle reflection at `h * 0.785`!
      const chars = Array.from(line.text);
      const fontPx = 36 * u;
      const hollowCx = w * 0.46;

      ctx.save();
      ctx.font = `800 ${Math.round(fontPx)}px "Noto Sans SC", "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let sparkX = w * 0.68;
      let sparkY = h * 0.24;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const f = chars.length > 1 ? i / (chars.length - 1) : 0.5;
        // Graceful S-curve ascending from above the glowing hollow toward the upper-right forest clearing
        const gx =
          hollowCx +
          98 * u +
          f * (w * 0.34) +
          Math.sin(f * Math.PI * 1.4 + timeSec * 1.5) * 12 * u;
        const gy =
          h * 0.46 -
          f * (h * 0.28) +
          Math.cos(f * Math.PI * 2 + timeSec * 1.8) * 8 * u;

        if (ch === ' ') continue;
        const thermo = computeGlyphThermodynamics(
          i,
          chars.length,
          line.startTime,
          line.endTime,
          timeSec
        );
        const inEmp = isIndexInEmphasis(line, chars, i);
        if (thermo.state !== 'ghost') {
          sparkX = gx;
          sparkY = gy;
        }

        // Soft firefly halo behind each lit character
        if (thermo.state !== 'ghost') {
          const glow = ctx.createRadialGradient(gx, gy, 1, gx, gy, 24 * u);
          glow.addColorStop(0, 'rgba(253, 224, 71, 0.28)');
          glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(gx, gy, 24 * u, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.save();
        ctx.translate(gx, gy);
        ctx.scale(thermo.scalePop, thermo.scalePop);
        if (thermo.state === 'ghost') {
          ctx.fillStyle = 'rgba(244, 239, 230, 0.14)';
          ctx.fillText(ch, 0, 0);
          ctx.strokeStyle = 'rgba(244, 239, 230, 0.44)';
          ctx.lineWidth = 0.95;
          ctx.strokeText(ch, 0, 0);
        } else {
          ctx.shadowColor =
            thermo.heat > 0.28 ? 'rgba(255, 90, 31, 0.85)' : 'rgba(4, 12, 18, 0.9)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = interpolateHeatColor(thermo.heat, inEmp, '#FDE047');
          ctx.fillText(ch, 0, 0);
        }
        ctx.restore();
      }
      ctx.restore();

      // Faint golden reflection shimmering in the woodland puddle at the base of the hollow!
      ctx.save();
      ctx.translate(hollowCx, h * 0.785);
      ctx.scale(0.65, -0.28);
      ctx.globalAlpha = 0.22;
      ctx.font = `800 ${Math.round(fontPx)}px "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.fillText(line.text, 0, 0);
      ctx.restore();

      drawCaretSpark(ctx, sparkX, sparkY, timeSec, 0.92 * u, 0.88);
      break;
    }

    case 'timelapse_nostalgia': {
      // Shot 18: Dual-Speed Contrast Component!
      // If the lyric has two halves ("万物都在速朽 唯有你念旧"), the outer rushing city streaks carry
      // the motion-blurred first half while the calm 35mm brass sanctuary carries the rock-steady second half!
      const cx = w * 0.5;
      const cy = h * 0.54;
      const r = Math.min(w, h) * 0.32;
      const parts = line.text.trim().split(/\s+/);
      const hasSplit = parts.length >= 2;
      const outerPhrase = hasSplit ? parts[0] : line.text;
      const innerPhrase = hasSplit ? parts.slice(1).join(' ') : line.text;

      // 1. Motion-streaked neon outer world phrase above the sanctuary circle ("万物都在速朽")
      ctx.save();
      const outerFont = Math.round(38 * u);
      ctx.font = `900 ${outerFont}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.textAlign = 'center';
      const drift = Math.sin(timeSec * 9.5) * 18 * u;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
      ctx.fillText(outerPhrase, cx + drift + 16 * u, cy - r - 24 * u);
      ctx.fillStyle = 'rgba(251, 113, 133, 0.24)';
      ctx.fillText(outerPhrase, cx - drift - 14 * u, cy - r - 24 * u);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
      ctx.fillText(outerPhrase, cx, cy - r - 24 * u);
      ctx.restore();

      // 2. Brushed-brass 35mm Sanctuary Nameplate mounted onto the lower bezel (`cy + r * 0.78`) ("唯有你念旧")
      const plateW = Math.min(r * 1.65, 420 * u);
      const plateH = 58 * u;
      const plateY = cy + r * 0.76;

      ctx.save();
      ctx.fillStyle = 'rgba(24, 15, 9, 0.94)';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.2;
      roundRectPath(ctx, cx - plateW * 0.5, plateY - plateH * 0.5, plateW, plateH, 10 * u);
      ctx.fill();
      ctx.stroke();

      const fontPx = 36 * u;
      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        cx,
        plateY + fontPx * 0.33,
        fontPx,
        'center',
        {
          textOverride: innerPhrase,
          maxWidthPx: plateW - 36 * u,
          accentHex: '#FEF08A',
        }
      );
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.92 * u, run.hasActiveSpark ? 0.95 : 0.36);
      ctx.restore();
      break;
    }

    case 'home_doorway_sun': {
      // Shot 19: Framed Warm-Linen Entryway Art Print hanging on the sunlit plaster wall
      // (`w * 0.46 .. 0.89, h * 0.11 .. 0.28`) right above the Polaroid journey snapshots!
      const frameW = Math.min(w * 0.42, 540 * u);
      const frameH = 104 * u;
      const frameX = w * 0.46;
      const frameY = h * 0.12;

      ctx.save();
      // Warm walnut picture-frame drop shadow on plaster wall
      ctx.shadowColor = 'rgba(0, 0, 0, 0.44)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#291A10';
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 3;
      roundRectPath(ctx, frameX, frameY, frameW, frameH, 6 * u);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Sun-kissed oatmeal linen mat board inside the walnut frame
      const matGrad = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH);
      matGrad.addColorStop(0, '#FEF7E6');
      matGrad.addColorStop(0.65, '#F5E9CE');
      matGrad.addColorStop(1, '#E7D5B3');
      ctx.fillStyle = matGrad;
      roundRectPath(ctx, frameX + 10 * u, frameY + 10 * u, frameW - 20 * u, frameH - 20 * u, 3 * u);
      ctx.fill();

      // Diagonal afternoon window sunbeam highlight across the framed linen print
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.beginPath();
      ctx.moveTo(frameX + frameW * 0.18, frameY + 10 * u);
      ctx.lineTo(frameX + frameW * 0.48, frameY + 10 * u);
      ctx.lineTo(frameX + frameW * 0.68, frameY + frameH - 10 * u);
      ctx.lineTo(frameX + frameW * 0.38, frameY + frameH - 10 * u);
      ctx.closePath();
      ctx.fill();

      const fontPx = 36 * u;
      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        frameX + frameW * 0.5,
        frameY + frameH * 0.63,
        fontPx,
        'center',
        {
          maxWidthPx: frameW - 48 * u,
          accentHex: '#B45309',
          ghostColor: 'rgba(92, 64, 42, 0.26)',
          cooledColor: '#291A10',
          shadowColor: 'rgba(0, 0, 0, 0)',
        }
      );
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.85 * u, run.hasActiveSpark ? 0.8 : 0.22);
      ctx.restore();
      break;
    }

    case 'nametag_dream_macro': {
      // Shot 20: 24K Gold Hot-Foil Embossing stamped DIRECTLY INSIDE the swinging cognac
      // Bridle-leather luggage tag's dark-ebony name window!
      // Matches the exact pivot `(w * 0.5, h * 0.54 - 155)` and swing `Math.sin(timeSec * 1.8) * 0.055`!
      const cx = w * 0.5;
      const cy = h * 0.54;
      const swing = Math.sin(timeSec * 1.8) * 0.055;
      const tagW = 396;

      ctx.save();
      ctx.translate(cx, cy - 155);
      ctx.rotate(swing);

      const fontPx = 36;
      const run = drawThermodynamicRun(ctx, sc, line, 0, 152, fontPx, 'center', {
        maxWidthPx: tagW - 76,
        accentHex: '#FEF08A',
        cooledColor: '#FDE68A',
      });
      drawCaretSpark(ctx, run.sparkX, run.sparkY, timeSec, 0.92, run.hasActiveSpark ? 1.0 : 0.38);
      ctx.restore();
      break;
    }

    case 'sunset_horizon_outro': {
      // Shot 21: Serene Salar de Uyuni Twilight Horizon Hairline + Salt-Flat Mirror Water Reflection!
      const horizonLineY = h * 0.3;
      const fontPx = 46 * u;

      ctx.save();
      ctx.strokeStyle = 'rgba(244, 239, 230, 0.42)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.18, horizonLineY);
      ctx.lineTo(w * 0.82, horizonLineY);
      ctx.stroke();

      const run = drawThermodynamicRun(
        ctx,
        sc,
        line,
        w * 0.5,
        horizonLineY - 16 * u,
        fontPx,
        'center',
        {
          maxWidthPx: w * 0.72,
          accentHex: '#FEF08A',
        }
      );

      ctx.font = `600 ${Math.round(13 * u)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.fillStyle = 'rgba(254, 240, 138, 0.84)';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${SONG_META.artist} · 《${SONG_META.album}》`,
        w * 0.5,
        horizonLineY + 24 * u
      );

      // Upside-down mirror salt-flat water reflection at `y = 0.84h`!
      ctx.translate(w * 0.5, h * 0.84);
      ctx.scale(1, -0.48);
      ctx.globalAlpha = 0.24;
      ctx.font = `900 ${Math.round(run.effectiveFontPx)}px "Outfit", "Noto Sans SC", sans-serif`;
      ctx.fillStyle = '#FDE047';
      ctx.fillText(line.text, 0, 0);
      ctx.restore();

      drawCaretSpark(
        ctx,
        run.hasActiveSpark ? run.sparkX : w * 0.82,
        horizonLineY,
        timeSec,
        1.05 * u,
        0.92
      );
      break;
    }

    default:
      break;
  }
}
