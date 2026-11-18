import {
  LYRIC_LINES,
  TRAVEL_STICKERS,
  type CameraMode,
  type MVChapter,
  type SceneId,
} from './mvData';
import {
  clamp01,
  getActiveLyricIndex,
  resolveActiveShot,
  type ActiveShotInfo,
  type AudioBands,
  type BeatState,
} from './mvTimeline';
import { renderSurfaceDiegeticLyrics } from './diegeticLyrics';
import {
  renderBootsWheelsLowShot,
  renderChorusHeroLowShot,
  renderCrossroadsPovShot,
  renderFortressMonolithShot,
  renderGuitarMacroShot,
  renderOpenSuitcaseShot,
  renderPriorityTagsMacro,
  renderScuffedShellCloseup,
  renderShoulderCompanionShot,
  renderSplitTriptychShot,
  renderTravelerWideShot,
} from './shotComposersA';
import {
  renderAirportDelayRainShot,
  renderConcoursePartingShot,
  renderHandleWarmthMacroShot,
  renderHomeDoorwaySunShot,
  renderNametagDreamMacroShot,
  renderSunsetHorizonOutroShot,
  renderTimelapseNostalgiaShot,
  renderTreeHollowPoeticShot,
  renderTurntableCarouselShot,
  renderWhistleCoastalShot,
} from './shotComposersB';
import { roundRectPath, type ShotContext } from './shotPrimitives';

interface SparkParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  rot: number;
  vRot: number;
  isConfetti: boolean;
}

interface FlyingSticker {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scale: number;
  life: number;
  maxLife: number;
  specIdx: number;
}

export interface RenderFrameInput {
  timeSec: number;
  dt: number;
  isPlaying: boolean;
  chapter: MVChapter;
  beat: BeatState;
  bands: AudioBands;
  cameraMode: CameraMode;
  reducedMotion: boolean;
}

export class MVCanvasRenderer {
  private sparks: SparkParticle[] = [];
  private flyingStickers: FlyingSticker[] = [];
  private lastBeatIndex = -1;
  private lastChapterId: SceneId | null = null;
  private scrollDist = 0;
  private wheelAngle = 0;
  private camTilt = 0;
  private camZoom = 1;
  private bonusStickerCount = 0;

  constructor() {
    for (let i = 0; i < 120; i++) {
      this.sparks.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 4,
        life: 0,
        maxLife: 1,
        color: '#fbbf24',
        rot: 0,
        vRot: 0,
        isConfetti: false,
      });
    }
    for (let i = 0; i < 28; i++) {
      this.flyingStickers.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rot: 0,
        vRot: 0,
        scale: 1,
        life: 0,
        maxLife: 1.5,
        specIdx: i % TRAVEL_STICKERS.length,
      });
    }
  }

  public triggerStickerBurst(normX = 0.5, normY = 0.52): void {
    this.bonusStickerCount = Math.min(8, this.bonusStickerCount + 1);
    for (let i = 0; i < 5; i++) {
      const slot = this.flyingStickers.find((s) => !s.active);
      if (!slot) break;
      const angle = -Math.PI * 0.85 + (i / 4) * Math.PI * 0.7 + (Math.random() - 0.5) * 0.25;
      const speed = 220 + Math.random() * 200;
      slot.active = true;
      slot.x = normX;
      slot.y = normY;
      slot.vx = Math.cos(angle) * speed;
      slot.vy = Math.sin(angle) * speed - 90;
      slot.rot = (Math.random() - 0.5) * 0.6;
      slot.vRot = (Math.random() - 0.5) * 4.5;
      slot.scale = 0.85 + Math.random() * 0.35;
      slot.life = 0;
      slot.maxLife = 1.25 + Math.random() * 0.45;
      slot.specIdx = Math.floor(Math.random() * TRAVEL_STICKERS.length);
    }

    this.emitSparks(normX, normY, 10, '#facc15', '#fde68a', false);
  }

  private emitSparks(
    normX: number,
    normY: number,
    count: number,
    primaryColor: string,
    secondaryColor: string,
    confetti = false
  ): void {
    let spawned = 0;
    for (let i = 0; i < this.sparks.length && spawned < count; i++) {
      const p = this.sparks[i];
      if (p.active) continue;
      const angle = Math.random() * Math.PI * 2;
      const speed = (confetti ? 150 : 95) + Math.random() * 290;
      p.active = true;
      p.x = normX;
      p.y = normY;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - (confetti ? 140 : 45);
      p.size = confetti ? 6 + Math.random() * 6 : 2.5 + Math.random() * 4.5;
      p.life = 0;
      p.maxLife = 0.55 + Math.random() * 0.75;
      p.color = spawned % 2 === 0 ? primaryColor : secondaryColor;
      p.rot = Math.random() * Math.PI;
      p.vRot = (Math.random() - 0.5) * 9;
      p.isConfetti = confetti;
      spawned++;
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    input: RenderFrameInput
  ): ActiveShotInfo {
    const { timeSec, dt, isPlaying, chapter, beat, bands, cameraMode, reducedMotion } = input;
    const safeDt = Math.min(0.05, Math.max(0.001, dt));

    const shotInfo = resolveActiveShot(timeSec, cameraMode, beat);

    const isStillBridge =
      shotInfo.shot === 'home_doorway_sun' || shotInfo.shot === 'nametag_dream_macro';
    const speedFactor = isStillBridge
      ? 0.08
      : (isPlaying ? 1 : 0.16) * (0.42 + chapter.energyBase * 1.4 + beat.kickPulse * 0.48);
    this.scrollDist += safeDt * 390 * speedFactor;
    this.wheelAngle += safeDt * 12.5 * speedFactor;

    // Keep automatic playback free of rectangular confetti clutter; track beat/chapter state cleanly
    this.lastBeatIndex = beat.beatIndex;
    this.lastChapterId = chapter.id;

    // Dynamic camera punch + whip-cut transition kinematics
    const cutZoomBoost = reducedMotion ? 0 : shotInfo.cutTransition * 0.075;
    const punchZoom = reducedMotion
      ? 0
      : beat.kickPulse * 0.048 + beat.sectionFlash * 0.08 + cutZoomBoost;
    const targetZoom = 1.02 + punchZoom;

    const isHighEnergy =
      chapter.id === 'chorus1' || chapter.id === 'chorus2' || chapter.id === 'finale';
    const targetTilt =
      reducedMotion || cameraMode === 'cinema_wide'
        ? 0
        : isHighEnergy
        ? (beat.beatIndex % 2 === 0 ? 1 : -1) * 0.018 * (0.35 + beat.kickPulse)
        : Math.sin(timeSec * 1.2) * 0.004;

    const damp = 1 - Math.exp(-14 * safeDt);
    this.camZoom += (targetZoom - this.camZoom) * damp;
    this.camTilt += (targetTilt - this.camTilt) * damp;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = chapter.bgHex;
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.52;
    const whipOffsetX = reducedMotion ? 0 : shotInfo.cutTransition * 26;

    ctx.translate(cx + whipOffsetX, cy);
    ctx.scale(this.camZoom, this.camZoom);
    ctx.rotate(this.camTilt);
    ctx.translate(-cx, -cy);

    const lyricIdx = getActiveLyricIndex(timeSec);
    const activeLine = LYRIC_LINES[lyricIdx] ?? LYRIC_LINES[0];
    const nextLine =
      lyricIdx + 1 < LYRIC_LINES.length ? LYRIC_LINES[lyricIdx + 1] : null;

    const shotCtx: ShotContext = {
      ctx,
      w: width,
      h: height,
      timeSec,
      scrollDist: this.scrollDist,
      wheelAngle: this.wheelAngle,
      lineProgress: shotInfo.lineProgress,
      activeLine,
      nextLine,
      chapter,
      beat,
      bands,
      bonusStickers: this.bonusStickerCount,
      reducedMotion,
    };

    // 1. Dispatch to the exact lyric-matched cinematic Shot Composer (includes midground-occluded sky lyrics)!
    this.dispatchShot(shotInfo, shotCtx);

    // 1b. Render surface-coupled diegetic lyrics inside the active camera world!
    renderSurfaceDiegeticLyrics(shotCtx, shotInfo.shot);

    // 2. Subtle audio spectrum pulse along lower frame
    this.drawSubtleSpectrum(ctx, width, height, chapter, beat, bands);

    // 3. Foreground particles & interactive Priority luggage tags
    this.updateAndDrawParticles(ctx, width, height, safeDt, reducedMotion);

    // 4. Peripheral anamorphic light streaks ONLY on explosive hero / triptych chorus shots
    const wantsImpactStreaks =
      shotInfo.shot === 'chorus_hero_low' || shotInfo.shot === 'split_triptych';
    if (!reducedMotion && isHighEnergy && wantsImpactStreaks) {
      this.drawSpeedLines(ctx, width, height, chapter, beat);
    }

    ctx.restore();

    // 5. Post-camera editorial framing, vignette scrim & film-cut shutter flash
    this.drawPostFraming(
      ctx,
      width,
      height,
      chapter,
      beat,
      shotInfo,
      cameraMode,
      reducedMotion
    );

    return shotInfo;
  }

  private dispatchShot(shotInfo: ActiveShotInfo, sc: ShotContext): void {
    switch (shotInfo.shot) {
      case 'guitar_macro':
        renderGuitarMacroShot(sc);
        break;
      case 'traveler_wide':
        renderTravelerWideShot(sc);
        break;
      case 'boots_wheels_low':
        renderBootsWheelsLowShot(sc);
        break;
      case 'scuffed_shell_closeup':
        renderScuffedShellCloseup(sc);
        break;
      case 'priority_tags_macro':
        renderPriorityTagsMacro(sc);
        break;
      case 'open_suitcase':
        renderOpenSuitcaseShot(sc);
        break;
      case 'crossroads_pov':
        renderCrossroadsPovShot(sc);
        break;
      case 'chorus_hero_low':
        renderChorusHeroLowShot(sc);
        break;
      case 'split_triptych':
        renderSplitTriptychShot(sc);
        break;
      case 'shoulder_companion':
        renderShoulderCompanionShot(sc);
        break;
      case 'fortress_monolith':
        renderFortressMonolithShot(sc);
        break;
      case 'turntable_carousel':
        renderTurntableCarouselShot(sc);
        break;
      case 'airport_delay_rain':
        renderAirportDelayRainShot(sc);
        break;
      case 'handle_warmth_macro':
        renderHandleWarmthMacroShot(sc);
        break;
      case 'concourse_parting':
        renderConcoursePartingShot(sc);
        break;
      case 'tree_hollow_poetic':
        renderTreeHollowPoeticShot(sc);
        break;
      case 'whistle_coastal':
        renderWhistleCoastalShot(sc);
        break;
      case 'timelapse_nostalgia':
        renderTimelapseNostalgiaShot(sc);
        break;
      case 'home_doorway_sun':
        renderHomeDoorwaySunShot(sc);
        break;
      case 'nametag_dream_macro':
        renderNametagDreamMacroShot(sc);
        break;
      case 'sunset_horizon_outro':
        renderSunsetHorizonOutroShot(sc);
        break;
    }
  }

  private drawSubtleSpectrum(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    chapter: MVChapter,
    beat: BeatState,
    bands: AudioBands
  ): void {
    const amp = beat.kickPulse * 11 + beat.snarePulse * 7 + bands.overall * 10;
    if (amp < 1.2) return;

    ctx.save();
    ctx.strokeStyle = chapter.accentHex;
    ctx.globalAlpha = 0.16;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const span = w * 0.68;
    const x0 = (w - span) * 0.5;
    for (let i = 0; i <= 56; i++) {
      const t = i / 56;
      const env = Math.sin(t * Math.PI);
      const x = x0 + t * span;
      const y =
        h -
        4 -
        Math.abs(Math.sin(i * 0.42 + this.scrollDist * 0.014)) * amp * env;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private updateAndDrawParticles(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    dt: number,
    reducedMotion: boolean
  ): void {
    for (let i = 0; i < this.sparks.length; i++) {
      const p = this.sparks[i];
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }
      if (!reducedMotion) {
        p.vy += (p.isConfetti ? 230 : 340) * dt;
        p.x += (p.vx * dt) / w;
        p.y += (p.vy * dt) / h;
        p.rot += p.vRot * dt;
      }
      const alpha = clamp01(1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x * w, p.y * h);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.isConfetti) {
        ctx.fillRect(-p.size * 0.6, -p.size * 0.35, p.size * 1.2, p.size * 0.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    for (let i = 0; i < this.flyingStickers.length; i++) {
      const s = this.flyingStickers[i];
      if (!s.active) continue;
      s.life += dt;
      if (s.life >= s.maxLife) {
        s.active = false;
        continue;
      }
      s.vy += 320 * dt;
      s.x += (s.vx * dt) / w;
      s.y += (s.vy * dt) / h;
      s.rot += s.vRot * dt;

      const spec = TRAVEL_STICKERS[s.specIdx];
      const alpha = clamp01(1 - Math.pow(s.life / s.maxLife, 2));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(s.x * w, s.y * h);
      ctx.rotate(s.rot);
      ctx.scale(s.scale, s.scale);

      ctx.fillStyle = spec.bg;
      roundRectPath(ctx, -38, -16, 76, 32, 5);
      ctx.fill();
      ctx.fillStyle = spec.fg;
      ctx.font = '800 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spec.code, 0, -3);
      ctx.font = '600 8px "Noto Sans SC", sans-serif';
      ctx.fillText(spec.year, 0, 8.5);
      ctx.restore();
    }
  }

  private drawSpeedLines(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    chapter: MVChapter,
    beat: BeatState
  ): void {
    const cx = w * 0.5;
    const cy = h * 0.52;
    const outerR = Math.hypot(w, h) * 0.62;
    const innerR = Math.min(w, h) * (0.44 - beat.kickPulse * 0.04);
    const count = 18;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = chapter.accentHex;
    ctx.globalAlpha = 0.07 + beat.kickPulse * 0.16;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + beat.barIndex * 0.31;
      const jitter = ((i * 7) % 5) * 16;
      ctx.moveTo(
        cx + Math.cos(angle) * (innerR + jitter),
        cy + Math.sin(angle) * (innerR + jitter)
      );
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawPostFraming(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    chapter: MVChapter,
    beat: BeatState,
    shotInfo: ActiveShotInfo,
    cameraMode: CameraMode,
    reducedMotion: boolean
  ): void {
    // Soft Kodak Vision3 warm upper-corner halation + balanced cinema perimeter vignette
    const outerR = Math.hypot(w * 0.5, h * 0.5);
    const vignette = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      outerR * 0.46,
      w * 0.5,
      h * 0.5,
      outerR * 1.04
    );
    vignette.addColorStop(0, 'rgba(9, 9, 11, 0)');
    vignette.addColorStop(0.72, 'rgba(9, 9, 11, 0.18)');
    vignette.addColorStop(1, 'rgba(6, 6, 9, 0.64)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Subtle film-cut shutter flash on shot transitions & chorus drops
    const flash = Math.max(beat.sectionFlash * 0.26, shotInfo.cutTransition * 0.12);
    if (!reducedMotion && flash > 0.015) {
      ctx.fillStyle = chapter.accentHex;
      ctx.globalAlpha = flash;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Cinema 2.39:1 scope bars in cinema_wide mode
    if (cameraMode === 'cinema_wide') {
      const barH = Math.round(h * 0.075);
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, barH);
      ctx.fillRect(0, h - barH, w, barH);
    }
  }
}
