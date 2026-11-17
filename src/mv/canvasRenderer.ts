import {
  TRAVEL_STICKERS,
  type CameraMode,
  type MVChapter,
  type SceneId,
} from './mvData';
import {
  clamp01,
  resolveActiveShot,
  type ActiveShotInfo,
  type AudioBands,
  type BeatState,
} from './mvTimeline';
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

    this.emitSparks(normX, normY, 24, '#facc15', '#fb7185', true);
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

    // Beat-synced confetti & sparks
    if (beat.beatIndex !== this.lastBeatIndex && isPlaying && !reducedMotion) {
      this.lastBeatIndex = beat.beatIndex;
      const isChorusOrFinale =
        chapter.id === 'chorus1' ||
        chapter.id === 'chorus2' ||
        chapter.id === 'finale';
      if (isChorusOrFinale && (beat.beatInBar === 0 || beat.beatInBar === 2)) {
        this.emitSparks(
          0.5,
          0.6,
          chapter.id === 'finale' ? 20 : 12,
          chapter.accentHex,
          chapter.secondaryHex,
          chapter.id === 'finale'
        );
      }
    }

    if (chapter.id !== this.lastChapterId) {
      if (this.lastChapterId !== null && !reducedMotion) {
        this.emitSparks(0.5, 0.5, 22, chapter.accentHex, chapter.secondaryHex, true);
      }
      this.lastChapterId = chapter.id;
    }

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

    const shotCtx: ShotContext = {
      ctx,
      w: width,
      h: height,
      timeSec,
      scrollDist: this.scrollDist,
      wheelAngle: this.wheelAngle,
      lineProgress: shotInfo.lineProgress,
      chapter,
      beat,
      bands,
      bonusStickers: this.bonusStickerCount,
      reducedMotion,
    };

    // 1. Dispatch to the exact lyric-matched cinematic Shot Composer!
    this.dispatchShot(shotInfo, shotCtx);

    // 2. Subtle audio spectrum pulse along lower frame
    this.drawSubtleSpectrum(ctx, width, height, chapter, beat, bands);

    // 3. Foreground particles & interactive Priority luggage tags
    this.updateAndDrawParticles(ctx, width, height, safeDt, reducedMotion);

    // 4. Radial speed lines during explosive Chorus / Finale drops
    if (!reducedMotion && isHighEnergy && shotInfo.shot !== 'sunset_horizon_outro') {
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
    const barCount = 48;
    const totalW = Math.min(w * 0.86, 1040);
    const startX = (w - totalW) * 0.5;
    const step = totalW / barCount;
    const baseY = h * 0.77;

    ctx.fillStyle = chapter.accentHex;
    for (let i = 0; i < barCount; i++) {
      const mirrorDist = Math.abs(i - (barCount - 1) * 0.5) / (barCount * 0.5);
      const wave = Math.abs(Math.sin(i * 0.55 + this.scrollDist * 0.018));
      const bh = Math.max(
        2,
        (1 - mirrorDist * 0.55) *
          (beat.kickPulse * 28 + beat.snarePulse * 18 + bands.overall * 24 + chapter.energyBase * 8) *
          (0.35 + wave * 0.65)
      );
      ctx.globalAlpha = 0.16 + (1 - mirrorDist) * 0.24;
      ctx.fillRect(startX + i * step + 2, baseY - bh, Math.max(2.5, step - 5), bh);
    }
    ctx.globalAlpha = 1;
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
        p.vy += (p.isConfetti ? 260 : 380) * dt;
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
        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
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
    const outerR = Math.hypot(w, h) * 0.58;
    const innerR = Math.min(w, h) * (0.38 - beat.kickPulse * 0.05);
    const count = 26;

    ctx.strokeStyle = chapter.accentHex;
    ctx.globalAlpha = 0.12 + beat.kickPulse * 0.24;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + beat.barIndex * 0.37;
      const jitter = ((i * 7) % 5) * 18;
      ctx.moveTo(
        cx + Math.cos(angle) * (innerR + jitter),
        cy + Math.sin(angle) * (innerR + jitter)
      );
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
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
    // Measured top & bottom editorial scrim ensuring >= 7:1 contrast for kinetic lyrics
    const scrim = ctx.createLinearGradient(0, 0, 0, h);
    scrim.addColorStop(0, 'rgba(9, 9, 11, 0.82)');
    scrim.addColorStop(0.24, 'rgba(9, 9, 11, 0.34)');
    scrim.addColorStop(0.42, 'rgba(9, 9, 11, 0.02)');
    scrim.addColorStop(0.75, 'rgba(9, 9, 11, 0.18)');
    scrim.addColorStop(1, 'rgba(9, 9, 11, 0.9)');
    ctx.fillStyle = scrim;
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
