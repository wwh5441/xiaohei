import { TRAVEL_STICKERS } from './mvData';
import {
  computeHumanStridePose,
  solveGravityArmIK,
  solveTwoBoneIK,
} from './mvTimeline';
import { roundRectPath, type ShotContext } from './shotPrimitives';

export interface RimowaDrawOptions {
  cx: number;
  bottomY: number;
  scale?: number;
  caseHeightPx?: number;
  tilt?: number;
  handleRatio?: number;
  warmHandleGlow?: boolean;
  showScuffs?: boolean;
  stickerCount?: number;
  restingOnRearWheels?: boolean;
  wheelAngleOverride?: number;
}

export interface RimowaAnchorPoints {
  gripX: number;
  gripY: number;
  topCornerRightX: number;
  topCornerRightY: number;
  topCenterX: number;
  topCenterY: number;
}

interface HumanLightingPalette {
  skinCore: string;
  skinMid: string;
  skinRim: string;
  hairBase: string;
  hairMid: string;
  hairRim: string;
  cuffBone: string;
  jacketCore: string;
  jacketMid: string;
  jacketLight: string;
  scarfMid: string;
  scarfShadow: string;
  trouserNear: string;
  trouserFar: string;
  bootLeather: string;
  bootSole: string;
}

/**
 * Cinema Contre-Jour Chiaroscuro Character Grading:
 * Figures against sunset, harbor, concourse, or rain-glass vistas live in rich tonal shadow
 * with delicate subsurface skin & wool rim catchlights — zero flat bright paper-cutout faces
 * and zero cartoon wireframe strokes.
 */
function getHumanPalette(coolRainScene: boolean): HumanLightingPalette {
  if (coolRainScene) {
    return {
      skinCore: '#1c161b',
      skinMid: '#4c3532',
      skinRim: '#cfa896',
      hairBase: '#0b0c12',
      hairMid: '#171924',
      hairRim: '#4a5568',
      cuffBone: '#cbd5e1',
      jacketCore: '#0b0f19',
      jacketMid: '#151e2e',
      jacketLight: '#25354d',
      scarfMid: '#7c4a2d',
      scarfShadow: '#3b2114',
      trouserNear: '#101724',
      trouserFar: '#090d16',
      bootLeather: '#0d1017',
      bootSole: '#292220',
    };
  }
  return {
    skinCore: '#211513',
    skinMid: '#5c382b',
    skinRim: '#e6b18a',
    hairBase: '#0d0b0e',
    hairMid: '#1c171d',
    hairRim: '#57413a',
    cuffBone: '#d9d2c5',
    jacketCore: '#0e0f16',
    jacketMid: '#1a1c28',
    jacketLight: '#2d3042',
    scarfMid: '#8f4f27',
    scarfShadow: '#452310',
    trouserNear: '#141520',
    trouserFar: '#0b0c13',
    bootLeather: '#120f12',
    bootSole: '#33241d',
  };
}

function localToWorld(
  originX: number,
  originY: number,
  tilt: number,
  lx: number,
  ly: number
): { x: number; y: number } {
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  return {
    x: originX + lx * c - ly * s,
    y: originY + lx * s + ly * c,
  };
}

/**
 * Tailored slim-straight wool trouser leg with natural thigh-to-ankle taper and soft cylindrical shading
 * (zero cartoon yellow border strokes).
 */
function drawTailoredTrouserLeg(
  ctx: CanvasRenderingContext2D,
  hipX: number,
  hipY: number,
  kneeX: number,
  kneeY: number,
  ankleX: number,
  ankleY: number,
  rHip: number,
  rKnee: number,
  rAnkle: number,
  fillCore: string,
  fillEdge: string,
  rimHighlightRgba?: string
): void {
  const dx1 = kneeX - hipX;
  const dy1 = kneeY - hipY;
  const l1 = Math.hypot(dx1, dy1) || 1;
  const fx1 = dy1 / l1;
  const fy1 = -dx1 / l1;

  const dx2 = ankleX - kneeX;
  const dy2 = ankleY - kneeY;
  const l2 = Math.hypot(dx2, dy2) || 1;
  const fx2 = dy2 / l2;
  const fy2 = -dx2 / l2;

  let kfx = fx1 + fx2;
  let kfy = fy1 + fy2;
  const kl = Math.hypot(kfx, kfy) || 1;
  kfx /= kl;
  kfy /= kl;

  const hipFrontX = hipX + fx1 * rHip;
  const hipFrontY = hipY + fy1 * rHip;
  const hipBackX = hipX - fx1 * rHip;
  const hipBackY = hipY - fy1 * rHip;

  const kneeFrontX = kneeX + kfx * rKnee;
  const kneeFrontY = kneeY + kfy * rKnee;
  const kneeBackX = kneeX - kfx * (rKnee * 0.92);
  const kneeBackY = kneeY - kfy * (rKnee * 0.92);

  const ankleFrontX = ankleX + fx2 * rAnkle;
  const ankleFrontY = ankleY + fy2 * rAnkle;
  const ankleBackX = ankleX - fx2 * rAnkle * 0.95;
  const ankleBackY = ankleY - fy2 * rAnkle * 0.95;

  // 100% opaque wool fabric cylinder gradient (never semi-transparent rgba stops!)
  const cylGrad = ctx.createLinearGradient(
    kneeBackX,
    kneeBackY,
    kneeFrontX,
    kneeFrontY
  );
  cylGrad.addColorStop(0, fillCore);
  cylGrad.addColorStop(0.7, fillEdge);
  cylGrad.addColorStop(1, '#202433');

  ctx.fillStyle = cylGrad;
  ctx.beginPath();
  ctx.moveTo(hipBackX, hipBackY);
  ctx.quadraticCurveTo(
    (hipBackX + kneeBackX) * 0.5,
    (hipBackY + kneeBackY) * 0.5,
    kneeBackX,
    kneeBackY
  );
  // Subtle natural calf curve into clean hem
  ctx.quadraticCurveTo(
    (kneeBackX + ankleBackX) * 0.5 - fx2 * rAnkle * 0.24,
    (kneeBackY + ankleBackY) * 0.5 - fy2 * rAnkle * 0.24,
    ankleBackX,
    ankleBackY
  );
  ctx.lineTo(ankleFrontX, ankleFrontY);
  ctx.quadraticCurveTo(
    (ankleFrontX + kneeFrontX) * 0.5,
    (ankleFrontY + kneeFrontY) * 0.5,
    kneeFrontX,
    kneeFrontY
  );
  ctx.quadraticCurveTo(
    (kneeFrontX + hipFrontX) * 0.5 + fx1 * rKnee * 0.08,
    (kneeFrontY + hipFrontY) * 0.5 + fy1 * rKnee * 0.08,
    hipFrontX,
    hipFrontY
  );
  ctx.closePath();
  ctx.fill();

  // Subtle tonal cloth sheen on outer contour (no yellow border stripe)
  if (rimHighlightRgba) {
    ctx.save();
    ctx.strokeStyle = rimHighlightRgba;
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(hipFrontX, hipFrontY);
    ctx.quadraticCurveTo(
      (hipFrontX + kneeFrontX) * 0.5 + fx1 * rKnee * 0.08,
      (hipFrontY + kneeFrontY) * 0.5 + fy1 * rKnee * 0.08,
      kneeFrontX,
      kneeFrontY
    );
    ctx.quadraticCurveTo(
      (kneeFrontX + ankleFrontX) * 0.5,
      (kneeFrontY + ankleFrontY) * 0.5,
      ankleFrontX,
      ankleFrontY
    );
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Sleek dark leather Chelsea boot with grounded heel/forefoot articulation and subtle tonal sheen
 * (zero yellow outline strokes).
 */
function drawGroundedChelseaBoot(
  ctx: CanvasRenderingContext2D,
  ankleX: number,
  ankleY: number,
  groundY: number,
  u: number,
  footPitch: number,
  palette: HumanLightingPalette,
  opacity = 1,
  heelOff = 0
): void {
  const soleLocalY = 11 * u;
  const pitch = footPitch * 0.72;

  const toeWorldY = ankleY + Math.sin(pitch) * 20.5 * u + Math.cos(pitch) * soleLocalY;
  const heelWorldY = ankleY + Math.sin(pitch) * -9.0 * u + Math.cos(pitch) * soleLocalY;
  const maxY = Math.max(toeWorldY, heelWorldY);
  const clampedAnkleY = maxY > groundY ? ankleY - (maxY - groundY) : ankleY;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(ankleX, clampedAnkleY);
  ctx.rotate(pitch);

  const toeBend = -heelOff * 0.24;
  const bootGrad = ctx.createLinearGradient(-8 * u, -5 * u, 19 * u, 9 * u);
  bootGrad.addColorStop(0, '#1e1a20');
  bootGrad.addColorStop(0.55, palette.bootLeather);
  bootGrad.addColorStop(1, '#08070a');
  ctx.fillStyle = bootGrad;

  const toeTipY = 5.8 * u + Math.sin(toeBend) * 2.8 * u;
  const toeSoleY = 9.4 * u + Math.sin(toeBend) * 2.4 * u;

  ctx.beginPath();
  ctx.moveTo(-6.6 * u, -5.2 * u);
  ctx.lineTo(5.4 * u, -5.0 * u);
  ctx.bezierCurveTo(9.2 * u, 0.4 * u, 15.6 * u, 3.2 * u, 19.8 * u, toeTipY);
  ctx.quadraticCurveTo(21.4 * u, (toeTipY + toeSoleY) * 0.5, 20.0 * u, toeSoleY);
  ctx.lineTo(5.5 * u, 9.5 * u);
  ctx.lineTo(-8.8 * u, 9.5 * u);
  ctx.quadraticCurveTo(-9.6 * u, 2.8 * u, -6.6 * u, -5.2 * u);
  ctx.closePath();
  ctx.fill();

  // Subtle dark welt & stacked heel block
  ctx.fillStyle = palette.bootSole;
  ctx.beginPath();
  ctx.moveTo(-9.0 * u, 9.2 * u);
  ctx.lineTo(5.8 * u, 9.2 * u);
  ctx.lineTo(20.2 * u, toeSoleY - 0.2 * u);
  ctx.lineTo(19.8 * u, toeSoleY + 1.3 * u);
  ctx.lineTo(4.8 * u, 10.9 * u);
  ctx.lineTo(2.6 * u, 9.9 * u);
  ctx.lineTo(-1.8 * u, 9.9 * u);
  ctx.lineTo(-2.2 * u, 10.9 * u);
  ctx.lineTo(-9.0 * u, 10.9 * u);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Continuous cubic-Bezier jacket sleeve + understated bone cuff + unified chiaroscuro hand.
 * Zero protruding ball-joint shoulder circles, zero yellow outline strokes, zero detached capsule fingers.
 */
function drawSculptedJacketArm(
  ctx: CanvasRenderingContext2D,
  shoulderX: number,
  shoulderY: number,
  elbowX: number,
  elbowY: number,
  wristX: number,
  wristY: number,
  rShoulder: number,
  rElbow: number,
  rWrist: number,
  u: number,
  palette: HumanLightingPalette,
  gripMode: 'grip_bar' | 'relaxed' | 'rail_rest' | 'hip_rest',
  rimHighlightRgba = 'rgba(253, 224, 71, 0.22)'
): void {
  const dx1 = elbowX - shoulderX;
  const dy1 = elbowY - shoulderY;
  const l1 = Math.hypot(dx1, dy1) || 1;
  const nx1 = dy1 / l1;
  const ny1 = -dx1 / l1;

  const dx2 = wristX - elbowX;
  const dy2 = wristY - elbowY;
  const l2 = Math.hypot(dx2, dy2) || 1;
  const nx2 = dy2 / l2;
  const ny2 = -dx2 / l2;

  let enx = nx1 + nx2;
  let eny = ny1 + ny2;
  const el = Math.hypot(enx, eny) || 1;
  enx /= el;
  eny /= el;

  const ux2 = dx2 / l2;
  const uy2 = dy2 / l2;
  const cuffPull = gripMode === 'hip_rest' ? 1.5 * u : 3.6 * u;
  const cuffEndX = wristX - ux2 * cuffPull;
  const cuffEndY = wristY - uy2 * cuffPull;

  if (gripMode !== 'hip_rest') {
    // Tonal wrist bridge + understated bone cuff edge (subtle, never a bright white sticker)
    ctx.strokeStyle = palette.skinMid;
    ctx.lineCap = 'round';
    ctx.lineWidth = rWrist * 1.1;
    ctx.beginPath();
    ctx.moveTo(cuffEndX, cuffEndY);
    ctx.lineTo(wristX, wristY);
    ctx.stroke();

    ctx.save();
    ctx.translate(cuffEndX, cuffEndY);
    ctx.rotate(Math.atan2(dy2, dx2));
    ctx.fillStyle = '#c8c0b2';
    ctx.globalAlpha = 0.72;
    roundRectPath(ctx, -0.3 * u, -rWrist * 0.74, 1.9 * u, rWrist * 1.48, 0.7 * u);
    ctx.fill();
    ctx.restore();
  }

  const sFrontX = shoulderX + nx1 * rShoulder;
  const sFrontY = shoulderY + ny1 * rShoulder;
  const sBackX = shoulderX - nx1 * rShoulder * 0.92;
  const sBackY = shoulderY - ny1 * rShoulder * 0.92;

  const eFrontX = elbowX + enx * rElbow;
  const eFrontY = elbowY + eny * rElbow;
  const eBackX = elbowX - enx * rElbow * 0.94;
  const eBackY = elbowY - eny * rElbow * 0.94;

  const cFrontX = cuffEndX + nx2 * rWrist;
  const cFrontY = cuffEndY + ny2 * rWrist;
  const cBackX = cuffEndX - nx2 * rWrist;
  const cBackY = cuffEndY - ny2 * rWrist;

  // 100% opaque dark wool sleeve gradient (never semi-transparent rgba stops!)
  const sleeveGrad = ctx.createLinearGradient(eBackX, elbowY, eFrontX, elbowY);
  sleeveGrad.addColorStop(0, palette.jacketCore);
  sleeveGrad.addColorStop(0.68, palette.jacketMid);
  sleeveGrad.addColorStop(1, palette.jacketLight);

  const uMidFrontX = sFrontX * 0.28 + eFrontX * 0.72;
  const uMidFrontY = sFrontY * 0.28 + eFrontY * 0.72;
  const fMidFrontX = eFrontX * 0.72 + cFrontX * 0.28;
  const fMidFrontY = eFrontY * 0.72 + cFrontY * 0.28;
  const uMidBackX = sBackX * 0.28 + eBackX * 0.72;
  const uMidBackY = sBackY * 0.28 + eBackY * 0.72;
  const fMidBackX = eBackX * 0.72 + cBackX * 0.28;
  const fMidBackY = eBackY * 0.72 + cBackY * 0.28;

  ctx.fillStyle = sleeveGrad;
  ctx.beginPath();
  ctx.moveTo(sBackX, sBackY);
  // Smooth organic shoulder-cap dome without protruding ball circle
  ctx.quadraticCurveTo(
    shoulderX - (dx1 / l1) * rShoulder * 0.55,
    shoulderY - (dy1 / l1) * rShoulder * 0.55,
    sFrontX,
    sFrontY
  );
  ctx.lineTo(uMidFrontX, uMidFrontY);
  ctx.quadraticCurveTo(eFrontX, eFrontY, fMidFrontX, fMidFrontY);
  ctx.lineTo(cFrontX, cFrontY);
  ctx.lineTo(cBackX, cBackY);
  ctx.lineTo(fMidBackX, fMidBackY);
  ctx.quadraticCurveTo(eBackX, eBackY, uMidBackX, uMidBackY);
  ctx.closePath();
  ctx.fill();

  // Crisp hair-thin rim catchlight strictly along the lit sleeve edge
  ctx.save();
  ctx.strokeStyle = rimHighlightRgba;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(sFrontX, sFrontY);
  ctx.lineTo(uMidFrontX, uMidFrontY);
  ctx.quadraticCurveTo(eFrontX, eFrontY, fMidFrontX, fMidFrontY);
  ctx.lineTo(cFrontX, cFrontY);
  ctx.stroke();
  ctx.restore();

  if (gripMode === 'hip_rest') {
    return;
  }

  // Unified sculptural chiaroscuro hand (no separate bright pink capsules)
  const handAngle = Math.atan2(dy2, dx2);
  ctx.save();
  ctx.translate(wristX, wristY);

  if (gripMode === 'grip_bar' || gripMode === 'rail_rest') {
    const hGrad = ctx.createLinearGradient(-4.5 * u, -3.5 * u, 4.5 * u, 4.5 * u);
    hGrad.addColorStop(0, palette.skinRim);
    hGrad.addColorStop(0.45, palette.skinMid);
    hGrad.addColorStop(1, palette.skinCore);
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.moveTo(-3.6 * u, -2.4 * u);
    ctx.quadraticCurveTo(0.4 * u, -3.8 * u, 4.2 * u, -1.6 * u);
    ctx.bezierCurveTo(5.0 * u, 0.8 * u, 3.8 * u, 3.8 * u, 0.8 * u, 4.0 * u);
    ctx.quadraticCurveTo(-2.8 * u, 3.8 * u, -4.0 * u, 1.2 * u);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.rotate(handAngle);
    const rGrad = ctx.createLinearGradient(-2 * u, -2.5 * u, 5.5 * u, 2.5 * u);
    rGrad.addColorStop(0, palette.skinRim);
    rGrad.addColorStop(0.5, palette.skinMid);
    rGrad.addColorStop(1, palette.skinCore);
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.moveTo(-2.2 * u, -2.2 * u);
    ctx.quadraticCurveTo(3.2 * u, -2.5 * u, 5.8 * u, -0.3 * u);
    ctx.quadraticCurveTo(5.2 * u, 2.2 * u, 1.0 * u, 2.3 * u);
    ctx.quadraticCurveTo(-2.0 * u, 1.9 * u, -2.2 * u, -2.2 * u);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 1:7.5 Classical Adult Proportioned Contre-Jour Profile Head (for side-stride & seated terminal shots).
 * Deep tonal chiaroscuro shadow face with delicate rim catchlight along brow/nose/jaw and natural layered
 * dark hair volume — ZERO bright white-peach mask, ZERO black Sharpie eye, ZERO yellow hair stripe.
 */
function drawBacklitStrideHead(
  ctx: CanvasRenderingContext2D,
  neckBaseX: number,
  neckBaseY: number,
  u: number,
  headTilt: number,
  breezePhase: number,
  palette: HumanLightingPalette,
  rimColor: string,
  isSeatedSigh = false
): void {
  const hairSway = Math.sin(breezePhase) * 1.4 * u;

  ctx.save();
  ctx.translate(neckBaseX, neckBaseY);
  ctx.rotate(headTilt);

  // 1. Anatomical sternocleidomastoid neck seated naturally into collar (no giraffe elongation)
  const neckGrad = ctx.createLinearGradient(-5.5 * u, -10 * u, 6.5 * u, 2 * u);
  neckGrad.addColorStop(0, '#2a1a17');
  neckGrad.addColorStop(0.65, '#683f31');
  neckGrad.addColorStop(1, '#c98f70');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(-5.4 * u, 3.0 * u);
  ctx.quadraticCurveTo(-4.6 * u, -5.5 * u, -4.0 * u, -12.5 * u);
  ctx.lineTo(5.2 * u, -10.8 * u);
  ctx.quadraticCurveTo(4.6 * u, -4.0 * u, 5.4 * u, 3.0 * u);
  ctx.closePath();
  ctx.fill();

  // Jaw cast shadow onto upper neck
  ctx.fillStyle = 'rgba(10, 7, 9, 0.52)';
  ctx.beginPath();
  ctx.moveTo(-1.2 * u, -11.4 * u);
  ctx.lineTo(5.6 * u, -9.2 * u);
  ctx.lineTo(4.0 * u, -4.8 * u);
  ctx.closePath();
  ctx.fill();

  // 2. Classical 1:7.5 Cranium & Masculine Contre-Jour Profile Silhouette
  const faceGrad = ctx.createLinearGradient(-8 * u, -24 * u, 14.5 * u, -19 * u);
  faceGrad.addColorStop(0, '#2d1c18');
  faceGrad.addColorStop(0.45, '#6e4233');
  faceGrad.addColorStop(0.84, '#d99e7d');
  faceGrad.addColorStop(1, '#f3cca9');

  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.moveTo(-6.6 * u, -11.4 * u);
  ctx.bezierCurveTo(-13.2 * u, -18 * u, -12.6 * u, -34 * u, -1.6 * u, -37.8 * u);
  // Forehead -> supraorbital brow -> straight nose bridge -> refined nasal tip
  ctx.bezierCurveTo(6.4 * u, -38.4 * u, 11.4 * u, -33.2 * u, 11.7 * u, -26.4 * u);
  ctx.quadraticCurveTo(11.3 * u, -24.8 * u, 12.6 * u, -23.0 * u);
  ctx.lineTo(14.6 * u, -19.0 * u);
  ctx.quadraticCurveTo(14.8 * u, -18.0 * u, 13.0 * u, -17.5 * u);
  // Philtrum, subtle closed lips & defined masculine jawline
  ctx.lineTo(12.9 * u, -15.6 * u);
  ctx.quadraticCurveTo(12.2 * u, -14.8 * u, 12.6 * u, -13.8 * u);
  ctx.quadraticCurveTo(11.8 * u, -12.4 * u, 11.8 * u, -10.5 * u);
  ctx.quadraticCurveTo(11.1 * u, -8.4 * u, 7.6 * u, -8.4 * u);
  ctx.quadraticCurveTo(1.6 * u, -9.2 * u, -2.8 * u, -12.4 * u);
  ctx.closePath();
  ctx.fill();

  // Soft orbital hollow shadow & subtle natural brow (delicate chiaroscuro, never a dark smudge!)
  const orbitGrad = ctx.createRadialGradient(8.9 * u, -23.6 * u, 0.4 * u, 8.9 * u, -23.6 * u, 3.2 * u);
  orbitGrad.addColorStop(0, 'rgba(18, 11, 12, 0.26)');
  orbitGrad.addColorStop(1, 'rgba(18, 11, 12, 0)');
  ctx.fillStyle = orbitGrad;
  ctx.beginPath();
  ctx.arc(8.9 * u, -23.6 * u, 3.2 * u, 0, Math.PI * 2);
  ctx.fill();

  if (isSeatedSigh) {
    ctx.strokeStyle = 'rgba(15, 10, 12, 0.65)';
    ctx.lineWidth = Math.max(0.8, 1.0 * u);
    ctx.beginPath();
    ctx.moveTo(7.2 * u, -23.2 * u);
    ctx.quadraticCurveTo(9.0 * u, -22.4 * u, 10.6 * u, -23.0 * u);
    ctx.stroke();
  }

  // Subtle sunlit warm rim strictly along brow/nose edge
  ctx.save();
  ctx.strokeStyle = rimColor;
  ctx.globalAlpha = 0.34;
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(0.75, 0.9 * u);
  ctx.beginPath();
  ctx.moveTo(11.6 * u, -27.2 * u);
  ctx.quadraticCurveTo(11.3 * u, -24.8 * u, 12.5 * u, -23.0 * u);
  ctx.lineTo(14.4 * u, -19.1 * u);
  ctx.stroke();
  ctx.restore();

  // 3. Natural Sculpted Menswear Haircut (clean tapered nape curving gently without sharp spikes)
  const hairGrad = ctx.createLinearGradient(-15 * u, -41 * u, 13 * u, -10 * u);
  hairGrad.addColorStop(0, '#1e1b22');
  hairGrad.addColorStop(0.65, palette.hairBase);
  hairGrad.addColorStop(1, '#070609');
  ctx.fillStyle = hairGrad;

  ctx.beginPath();
  ctx.moveTo(12.6 * u + hairSway * 0.16, -28.6 * u);
  ctx.bezierCurveTo(
    14.4 * u + hairSway * 0.2,
    -35.2 * u,
    7.8 * u,
    -41.2 * u,
    -2.0 * u,
    -41.0 * u
  );
  ctx.bezierCurveTo(
    -12.4 * u,
    -40.8 * u,
    -16.2 * u - hairSway * 0.3,
    -32.8 * u,
    -14.6 * u - hairSway * 0.35,
    -22.2 * u
  );
  ctx.bezierCurveTo(
    -13.2 * u - hairSway * 0.25,
    -15.8 * u,
    -9.8 * u,
    -11.6 * u,
    -6.4 * u,
    -10.4 * u
  );
  ctx.quadraticCurveTo(-4.8 * u, -15.6 * u, -2.8 * u, -20.8 * u);
  ctx.lineTo(-0.6 * u, -18.0 * u);
  ctx.quadraticCurveTo(1.0 * u, -23.8 * u, 4.4 * u, -27.2 * u);
  ctx.quadraticCurveTo(8.6 * u, -29.4 * u, 12.6 * u + hairSway * 0.16, -28.6 * u);
  ctx.closePath();
  ctx.fill();

  // Subtle chiaroscuro ear nestled behind sideburn (never a bright floating spot)
  ctx.fillStyle = '#4e3026';
  ctx.beginPath();
  ctx.ellipse(-2.6 * u, -19.0 * u, 1.9 * u, 3.2 * u, -0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 3/4 Rear-View Contre-Jour Head (*Rückenfigur*):
 * Grounded natural neck height, balanced 1:7.5 skull crown, subtle temple contour, and deep shadow ear.
 */
function drawThreeQuarterRearHead(
  ctx: CanvasRenderingContext2D,
  neckBaseX: number,
  neckBaseY: number,
  u: number,
  lookDirSign: 1 | -1,
  breezePhase: number,
  palette: HumanLightingPalette,
  _rimColor: string
): void {
  const sway = Math.sin(breezePhase) * 0.9 * u;

  ctx.save();
  ctx.translate(neckBaseX, neckBaseY);
  ctx.scale(lookDirSign, 1);

  // Proportional grounded neck (natural ~9.5u height above collar, never giraffe-long)
  const neckGrad = ctx.createLinearGradient(-5.6 * u, -6 * u, 5.6 * u, -6 * u);
  neckGrad.addColorStop(0, '#231614');
  neckGrad.addColorStop(0.7, '#58372c');
  neckGrad.addColorStop(1, '#8c5a46');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(-5.8 * u, 3.6 * u);
  ctx.quadraticCurveTo(-5.2 * u, -4.5 * u, -4.8 * u, -10.5 * u);
  ctx.lineTo(4.8 * u, -10.2 * u);
  ctx.quadraticCurveTo(5.2 * u, -4.5 * u, 5.8 * u, 3.6 * u);
  ctx.closePath();
  ctx.fill();

  // Subtle 3/4 cheek/jawline silhouette turning into vista
  const jawGrad = ctx.createLinearGradient(1 * u, -22 * u, 9.2 * u, -10 * u);
  jawGrad.addColorStop(0, '#261715');
  jawGrad.addColorStop(0.65, '#684032');
  jawGrad.addColorStop(1, '#c99374');
  ctx.fillStyle = jawGrad;
  ctx.beginPath();
  ctx.moveTo(3.4 * u, -24.8 * u);
  ctx.quadraticCurveTo(9.0 * u, -21.2 * u, 8.6 * u, -15.6 * u);
  ctx.quadraticCurveTo(7.8 * u, -10.2 * u, 4.0 * u, -8.2 * u);
  ctx.lineTo(0.8 * u, -10.2 * u);
  ctx.closePath();
  ctx.fill();

  // Sculpted 3D cranial hair crown seated cleanly at -7.5u..-38u (balanced 1:7.5 proportion)
  const hairGrad = ctx.createRadialGradient(-2 * u, -26 * u, 3 * u, -1 * u, -23 * u, 19 * u);
  hairGrad.addColorStop(0, '#201c24');
  hairGrad.addColorStop(0.68, palette.hairBase);
  hairGrad.addColorStop(1, '#07070a');
  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.moveTo(8.5 * u + sway * 0.14, -24.5 * u);
  ctx.bezierCurveTo(10.2 * u, -34.2 * u, 4.2 * u, -39.6 * u, -2.6 * u, -39.4 * u);
  ctx.bezierCurveTo(-11.8 * u, -39.0 * u, -14.8 * u - sway * 0.22, -30.4 * u, -13.0 * u - sway * 0.16, -20.0 * u);
  ctx.bezierCurveTo(-11.2 * u, -13.0 * u, -7.6 * u, -8.5 * u, -4.4 * u, -7.2 * u);
  ctx.quadraticCurveTo(0.4 * u, -6.8 * u, 4.2 * u, -9.8 * u);
  ctx.quadraticCurveTo(5.0 * u, -15.4 * u, 6.0 * u, -20.2 * u);
  ctx.quadraticCurveTo(7.4 * u, -22.8 * u, 8.5 * u + sway * 0.14, -24.5 * u);
  ctx.closePath();
  ctx.fill();

  // Subtle recessed chiaroscuro ear (dark warm sienna blending smoothly, zero bright dot!)
  ctx.fillStyle = '#472b22';
  ctx.beginPath();
  ctx.ellipse(5.2 * u, -16.4 * u, 1.5 * u, 2.7 * u, 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Authentic 2.5D Industrial Illustration of the 20" Matte-Black RIMOWA Original Cabin ("小黑").
 */
export function drawRimowaCabin(
  sc: ShotContext,
  opts: RimowaDrawOptions
): RimowaAnchorPoints {
  const { ctx, chapter, beat, wheelAngle } = sc;
  const caseH = opts.caseHeightPx ?? 206 * (opts.scale ?? 1);
  const s = caseH / 206;
  const caseW = 146 * s;
  const depthW = 32 * s;
  const tilt = opts.tilt ?? 0;

  const wheelClearance = 16 * s;
  const shellLeft = -caseW * 0.44;
  const shellTop = -caseH - wheelClearance;
  const shellBottom = -wheelClearance;
  const radius = 14 * s;

  const hRatio = opts.handleRatio ?? 0.48;
  const handleExt = caseH * hRatio;
  const rodL = shellLeft + caseW * 0.27;
  const rodR = shellLeft + caseW * 0.71;
  const gripLocalX = (rodL + rodR) * 0.5;
  const gripLocalY = shellTop - handleExt;

  ctx.save();
  ctx.translate(opts.cx, opts.bottomY);

  // Soft horizontal ground contact shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(
    tilt > 0.08 ? caseW * 0.24 : -depthW * 0.12,
    2.5 * s,
    caseW * (tilt > 0.08 ? 0.48 : 0.66),
    8 * s,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  const pivotX = tilt !== 0 && opts.restingOnRearWheels ? shellLeft + caseW * 0.82 : 0;
  const pivotY = tilt !== 0 && opts.restingOnRearWheels ? -7 * s : 0;
  if (tilt !== 0) {
    ctx.translate(pivotX, pivotY);
    ctx.rotate(tilt);
    ctx.translate(-pivotX, -pivotY);
  }

  const effWheelAngle = opts.wheelAngleOverride ?? wheelAngle;
  const drawMultiwheel = (wx: number, wy: number, wr: number, dimFactor: number) => {
    ctx.save();
    ctx.fillStyle = dimFactor < 0.9 ? '#18181c' : '#27272e';
    roundRectPath(ctx, wx - wr * 0.78, shellBottom - 2 * s, wr * 1.56, 8.5 * s, 3 * s);
    ctx.fill();

    ctx.translate(wx, wy);
    ctx.rotate(effWheelAngle);
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = dimFactor < 0.9 ? '#3f3f46' : '#71717a';
    ctx.lineWidth = Math.max(1.1, 2 * s);
    ctx.beginPath();
    ctx.arc(0, 0, wr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = dimFactor < 0.9 ? '#52525b' : '#a1a1aa';
    ctx.lineWidth = Math.max(0.8, 1.3 * s);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * wr * 0.72, Math.sin(a) * wr * 0.72);
      ctx.stroke();
    }
    ctx.fillStyle = chapter.accentHex;
    ctx.globalAlpha = dimFactor;
    ctx.beginPath();
    ctx.arc(0, 0, wr * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawMultiwheel(shellLeft - depthW * 0.56, -8.8 * s, 8.2 * s, 0.65);
  drawMultiwheel(shellLeft + caseW * 0.82 - 7 * s, -8.2 * s, 8.2 * s, 0.55);

  if (opts.warmHandleGlow) {
    const glow = ctx.createRadialGradient(
      gripLocalX,
      gripLocalY,
      3 * s,
      gripLocalX,
      gripLocalY,
      82 * s
    );
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.42)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(gripLocalX, gripLocalY, 82 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  if (hRatio > 0.04) {
    // Always brushed titanium telescopic rods — never yellow plastic sticks!
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = Math.max(1.8, 4 * s);
    ctx.beginPath();
    ctx.moveTo(rodL, shellTop + 6 * s);
    ctx.lineTo(rodL, gripLocalY);
    ctx.moveTo(rodR, shellTop + 6 * s);
    ctx.lineTo(rodR, gripLocalY);
    ctx.stroke();

    ctx.fillStyle = opts.warmHandleGlow ? '#2b1b12' : '#18181b';
    ctx.strokeStyle = opts.warmHandleGlow ? 'rgba(253, 224, 71, 0.65)' : '#71717a';
    ctx.lineWidth = Math.max(1.1, 1.7 * s);
    roundRectPath(
      ctx,
      rodL - 7.5 * s,
      gripLocalY - 7.5 * s,
      rodR - rodL + 15 * s,
      11 * s,
      5 * s
    );
    ctx.fill();
    ctx.stroke();
  }

  // Flush top leather carry handle
  ctx.fillStyle = '#18181b';
  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = Math.max(1, 1.3 * s);
  roundRectPath(ctx, gripLocalX - 22 * s, shellTop - 5 * s, 44 * s, 5.5 * s, 2.8 * s);
  ctx.fill();
  ctx.stroke();

  // Fluttering orange PRIORITY baggage tag
  ctx.save();
  ctx.translate(rodR + 2 * s, hRatio > 0.15 ? gripLocalY + 13 * s : shellTop + 4 * s);
  ctx.rotate(0.22 + Math.sin(sc.timeSec * 5.2) * 0.1 - tilt * 0.5);
  ctx.fillStyle = '#f59e0b';
  roundRectPath(ctx, 0, -4.5 * s, 32 * s, 11.5 * s, 2 * s);
  ctx.fill();
  if (s > 0.34) {
    ctx.fillStyle = '#09090b';
    ctx.font = `800 ${Math.max(5, Math.round(6.4 * s))}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PRIO', 16 * s, 1.2 * s);
  }
  ctx.restore();

  // Left 2.5D Gusset & Anodized Aluminum Clasp Frame + Dual TSA Locks
  const gussetGrad = ctx.createLinearGradient(shellLeft - depthW, shellTop, shellLeft, shellTop);
  gussetGrad.addColorStop(0, '#0e0e12');
  gussetGrad.addColorStop(0.5, '#1d1d24');
  gussetGrad.addColorStop(1, '#121217');
  ctx.fillStyle = gussetGrad;
  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = Math.max(1, 1.4 * s);
  ctx.beginPath();
  ctx.moveTo(shellLeft + 7 * s, shellTop);
  ctx.lineTo(shellLeft - depthW, shellTop + 9 * s);
  ctx.lineTo(shellLeft - depthW, shellBottom - 7 * s);
  ctx.lineTo(shellLeft + 7 * s, shellBottom);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const frameX = shellLeft - depthW * 0.46;
  ctx.strokeStyle = '#71717a';
  ctx.lineWidth = Math.max(1.1, 2 * s);
  ctx.beginPath();
  ctx.moveTo(frameX, shellTop + 7 * s);
  ctx.lineTo(frameX, shellBottom - 5 * s);
  ctx.stroke();

  for (const lockFrac of [0.28, 0.72]) {
    const ly = shellTop + caseH * lockFrac;
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = Math.max(0.8, 1.1 * s);
    roundRectPath(ctx, frameX - 4.2 * s, ly - 9.5 * s, 8.4 * s, 19 * s, 2 * s);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(frameX - 1.1 * s, ly - 1.1 * s, 2.2 * s, 2.2 * s);
  }

  // Matte-Black Anodized Grooved RIMOWA Shell
  const bodyGrad = ctx.createLinearGradient(shellLeft, shellTop, shellLeft + caseW, shellBottom);
  bodyGrad.addColorStop(0, '#363642');
  bodyGrad.addColorStop(0.28, '#1f1f28');
  bodyGrad.addColorStop(0.54, '#2a2a35');
  bodyGrad.addColorStop(0.8, '#111117');
  bodyGrad.addColorStop(1, '#08080c');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = 'rgba(228, 228, 231, 0.36)';
  ctx.lineWidth = Math.max(1, 1.7 * s);
  roundRectPath(ctx, shellLeft, shellTop, caseW, caseH, radius);
  ctx.fill();
  ctx.stroke();

  // Cognac leather luggage name-tag hanging from top handle
  ctx.save();
  ctx.translate(gripLocalX - 14 * s, shellTop + 3 * s);
  ctx.rotate(-0.16 + Math.sin(sc.timeSec * 3.4) * 0.05);
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = Math.max(0.6, 0.9 * s);
  roundRectPath(ctx, -4.5 * s, 0, 9 * s, 15 * s, 2 * s);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Signature RIMOWA 9 Parallel Vertical Grooves
  const ribCount = 9;
  const ribMarginX = 14 * s;
  const ribSpan = caseW - ribMarginX * 2;
  for (let r = 0; r < ribCount; r++) {
    const rx = shellLeft + ribMarginX + (ribSpan * r) / (ribCount - 1);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.lineWidth = Math.max(0.9, 2.2 * s);
    ctx.beginPath();
    ctx.moveTo(rx - 1 * s, shellTop + 13 * s);
    ctx.lineTo(rx - 1 * s, shellBottom - 13 * s);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 244, 245, 0.16)';
    ctx.lineWidth = Math.max(0.7, 1.2 * s);
    ctx.beginPath();
    ctx.moveTo(rx + 1 * s, shellTop + 13 * s);
    ctx.lineTo(rx + 1 * s, shellBottom - 13 * s);
    ctx.stroke();
  }

  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.22 + beat.kickPulse * 0.36;
  ctx.lineWidth = Math.max(0.9, 1.6 * s);
  roundRectPath(
    ctx,
    shellLeft + 1.5 * s,
    shellTop + 1.5 * s,
    caseW - 3 * s,
    caseH - 3 * s,
    Math.max(2, radius - 1.5 * s)
  );
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Riveted Brushed-Aluminum Corner Bumpers
  const cornerW = 22 * s;
  const cornerH = 22 * s;
  for (const c of [
    { x: shellLeft, y: shellTop },
    { x: shellLeft + caseW - cornerW, y: shellTop },
    { x: shellLeft, y: shellBottom - cornerH },
    { x: shellLeft + caseW - cornerW, y: shellBottom - cornerH },
  ]) {
    ctx.fillStyle = '#3f3f46';
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = Math.max(0.8, 1.1 * s);
    roundRectPath(ctx, c.x, c.y, cornerW, cornerH, 8 * s);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e4e4e7';
    for (const [ox, oy] of [
      [0.3, 0.3],
      [0.7, 0.3],
      [0.3, 0.7],
    ]) {
      ctx.beginPath();
      ctx.arc(c.x + cornerW * ox, c.y + cornerH * oy, Math.max(0.7, 1.1 * s), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (opts.showScuffs) {
    ctx.strokeStyle = 'rgba(228, 228, 231, 0.34)';
    ctx.lineWidth = Math.max(0.8, 1.3 * s);
    ctx.beginPath();
    ctx.moveTo(shellLeft + caseW * 0.16, shellTop + caseH * 0.27);
    ctx.lineTo(shellLeft + caseW * 0.38, shellTop + caseH * 0.33);
    ctx.moveTo(shellLeft + caseW * 0.56, shellTop + caseH * 0.64);
    ctx.lineTo(shellLeft + caseW * 0.82, shellTop + caseH * 0.58);
    ctx.stroke();
  }

  // Recessed RIMOWA monogram cartouche
  const badgeW = Math.max(44 * s, caseW * 0.42);
  const badgeH = 12 * s;
  ctx.fillStyle = '#141418';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = Math.max(0.7, 1 * s);
  roundRectPath(
    ctx,
    shellLeft + (caseW - badgeW) * 0.5,
    shellTop + 15 * s,
    badgeW,
    badgeH,
    2.8 * s
  );
  ctx.fill();
  ctx.stroke();
  if (s > 0.44) {
    ctx.fillStyle = '#e4e4e7';
    ctx.font = `700 ${Math.max(6, Math.round(6.8 * s))}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('XIAOHEI · 20"', shellLeft + caseW * 0.5, shellTop + 21 * s);
  }

  // Accumulated Priority & Airport Stickers
  const count =
    opts.stickerCount ??
    Math.min(
      TRAVEL_STICKERS.length,
      1 + Math.floor((sc.timeSec / 170) * (TRAVEL_STICKERS.length - 1)) + sc.bonusStickers
    );
  const slots = [
    { rx: 0.28, ry: 0.4, rot: -0.14 },
    { rx: 0.7, ry: 0.48, rot: 0.12 },
    { rx: 0.32, ry: 0.67, rot: 0.09 },
    { rx: 0.68, ry: 0.75, rot: -0.11 },
    { rx: 0.5, ry: 0.55, rot: -0.04 },
  ];
  for (let idx = 0; idx < Math.min(count, slots.length); idx++) {
    const spec = TRAVEL_STICKERS[idx % TRAVEL_STICKERS.length];
    const pos = slots[idx];
    ctx.save();
    ctx.translate(shellLeft + caseW * pos.rx, shellTop + caseH * pos.ry);
    ctx.rotate(pos.rot);
    ctx.fillStyle = spec.bg;
    roundRectPath(ctx, -17 * s, -7.5 * s, 34 * s, 15 * s, 2.2 * s);
    ctx.fill();
    if (s > 0.38) {
      ctx.fillStyle = spec.fg;
      ctx.font = `800 ${Math.max(5, Math.round(6 * s))}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spec.code.slice(0, 6), 0, 0.5 * s);
    }
    ctx.restore();
  }

  drawMultiwheel(shellLeft + caseW * 0.18, -6.5 * s, 9.4 * s, 1);
  drawMultiwheel(shellLeft + caseW * 0.82, -6.5 * s, 9.4 * s, 1);

  ctx.restore();

  const toWorld = (lx: number, ly: number) =>
    localToWorld(opts.cx + pivotX, opts.bottomY + pivotY, tilt, lx - pivotX, ly - pivotY);

  const gripWorld = toWorld(gripLocalX, hRatio > 0.04 ? gripLocalY : shellTop - 4 * s);
  const topRightWorld = toWorld(shellLeft + caseW - 8 * s, shellTop);
  const topCenterWorld = toWorld(shellLeft + caseW * 0.5, shellTop);

  return {
    gripX: gripWorld.x,
    gripY: gripWorld.y,
    topCornerRightX: topRightWorld.x,
    topCornerRightY: topRightWorld.y,
    topCenterX: topCenterWorld.x,
    topCenterY: topCenterWorld.y,
  };
}

export type TravelerRimowaPose = 'tow_stride' | 'hero_beside' | 'concourse_calm';

export interface CoupledTravelerOpts {
  travelerX: number;
  groundY: number;
  travelerHeightPx: number;
  walkPhase: number;
  pose: TravelerRimowaPose;
  rimColor: string;
  warmHandleGlow?: boolean;
  mirrorReflectionAlpha?: number;
}

/**
 * Renders a classically proportioned 1:7.5 adult Traveler coupled via gravity-true 2-bone IK
 * and upright human stride biomechanics to the 20" RIMOWA Original Cabin ("小黑").
 * - `hero_beside` / `concourse_calm`: 3/4 rear-view *Rückenfigur* gazing into the vista with straight stance legs.
 * - `tow_stride`: Upright contre-jour chiaroscuro stride (~99.5% straight stance leg, natural swing knee lift).
 */
export function drawCoupledTravelerAndRimowa(
  sc: ShotContext,
  opts: CoupledTravelerOpts
): void {
  const { ctx } = sc;
  const H = opts.travelerHeightPx;
  const u = H / 252;
  const coolRainScene = sc.chapter.id === 'verse2' && opts.pose !== 'concourse_calm';
  const palette = getHumanPalette(coolRainScene);

  if (opts.mirrorReflectionAlpha && opts.mirrorReflectionAlpha > 0.01) {
    ctx.save();
    ctx.translate(0, opts.groundY);
    ctx.scale(1, -0.42);
    ctx.translate(0, -opts.groundY);
    ctx.globalAlpha = opts.mirrorReflectionAlpha;
    drawCoupledBodyInternal(sc, opts, u, palette, true);
    ctx.restore();
  }

  drawCoupledBodyInternal(sc, opts, u, palette, false);
}

function drawCoupledBodyInternal(
  sc: ShotContext,
  opts: CoupledTravelerOpts,
  u: number,
  palette: HumanLightingPalette,
  isReflection: boolean
): void {
  const { ctx } = sc;
  const tx = opts.travelerX;
  const gy = opts.groundY;

  if (opts.pose !== 'tow_stride') {
    // =========================================================================
    // MODE A: 3/4 Rear-View Contre-Jour *Rückenfigur* (`hero_beside` & `concourse_calm`)
    // Upright 1:7.5 figure gazing forward into the solar corona / concourse arch,
    // tailored hip-length jacket, left hand resting downward on upright 20" RIMOWA.
    // =========================================================================
    const isHero = opts.pose === 'hero_beside';
    const breathe = Math.sin(sc.timeSec * 2.0) * 0.9 * u;

    if (!isReflection) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.46)';
      ctx.beginPath();
      ctx.ellipse(tx - 6 * u, gy + 2 * u, 32 * u, 5.2 * u, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Upright 20" RIMOWA Cabin standing faithfully beside left leg
    const rimowaAnchors = drawRimowaCabin(sc, {
      cx: tx - 39 * u,
      bottomY: gy + 0.8 * u,
      caseHeightPx: 78 * u,
      tilt: 0,
      handleRatio: 0.56,
      warmHandleGlow: opts.warmHandleGlow,
      showScuffs: true,
    });

    // Standing hip height (120.2u) vs leg length (55.5u + 54.5u = 110u, ankle at gy-11u -> 109.2u span)
    // = 99.3% upright straight human legs — zero squatting!
    const hipY = gy - 120.2 * u + breathe;
    const shoulderY = hipY - 76 * u;
    const neckBaseX = tx + 0.5 * u;
    const neckBaseY = shoulderY - 2.2 * u;
    const thighLen = 55.5 * u;
    const calfLen = 54.5 * u;

    // Left (RIMOWA-side) stance leg & Chelsea boot
    const leftHipX = tx - 7.2 * u;
    const leftAnkleX = tx - 9.2 * u;
    const leftAnkleY = gy - 11 * u;
    const leftLeg = solveTwoBoneIK(leftHipX, hipY, leftAnkleX, leftAnkleY, thighLen, calfLen, -1);
    drawTailoredTrouserLeg(
      ctx,
      leftHipX,
      hipY,
      leftLeg.elbowX,
      leftLeg.elbowY,
      leftAnkleX,
      leftAnkleY,
      9.4 * u,
      6.8 * u,
      4.8 * u,
      palette.trouserFar,
      palette.trouserNear
    );
    drawGroundedChelseaBoot(ctx, leftAnkleX, leftAnkleY, gy, u, -0.02, palette, 0.94);

    // Right relaxed contrapposto leg & Chelsea boot
    const rightHipX = tx + 7.4 * u;
    const rightAnkleX = tx + (isHero ? 11.2 : 9.4) * u;
    const rightAnkleY = gy - 11 * u;
    const rightLeg = solveTwoBoneIK(
      rightHipX,
      hipY,
      rightAnkleX,
      rightAnkleY,
      thighLen,
      calfLen,
      -1
    );
    drawTailoredTrouserLeg(
      ctx,
      rightHipX,
      hipY,
      rightLeg.elbowX,
      rightLeg.elbowY,
      rightAnkleX,
      rightAnkleY,
      9.6 * u,
      6.9 * u,
      4.9 * u,
      palette.trouserFar,
      palette.trouserNear,
      'rgba(226, 232, 240, 0.14)'
    );
    drawGroundedChelseaBoot(ctx, rightAnkleX, rightAnkleY, gy, u, 0.02, palette, 1);

    // 3/4 Rear-View Head gazing into the vista
    drawThreeQuarterRearHead(
      ctx,
      neckBaseX,
      neckBaseY,
      u,
      1,
      sc.timeSec * (isHero ? 4.4 : 2.6),
      palette,
      opts.rimColor
    );

    // Right arm hanging naturally in relaxed poise beside right thigh
    const rightShoulderX = tx + 17.5 * u;
    const rightShoulderY = shoulderY + 7.5 * u;
    const rightWristX = tx + (isHero ? 20.5 : 18.8) * u;
    const rightWristY = hipY + 12 * u;
    const rightArm = solveGravityArmIK(
      rightShoulderX,
      rightShoulderY,
      rightWristX,
      rightWristY,
      38 * u,
      36 * u,
      -1
    );
    drawSculptedJacketArm(
      ctx,
      rightShoulderX,
      rightShoulderY,
      rightArm.elbowX,
      rightArm.elbowY,
      rightArm.handX,
      rightArm.handY,
      6.8 * u,
      5.5 * u,
      4.1 * u,
      u,
      palette,
      'relaxed',
      'rgba(226, 232, 240, 0.14)'
    );

    // Tailored Hip-Length Architectural Field Jacket (V-tapered masculine back, zero triangle skirt!)
    const hemY = hipY + 9.4 * u;
    const windSway = isHero ? 3.2 * u + Math.sin(sc.timeSec * 4.2) * 1.8 * u : 0.8 * u;
    const jGrad = ctx.createLinearGradient(tx - 22 * u, shoulderY, tx + 22 * u, hemY);
    jGrad.addColorStop(0, palette.jacketCore);
    jGrad.addColorStop(0.68, palette.jacketMid);
    jGrad.addColorStop(1, palette.jacketLight);
    ctx.fillStyle = jGrad;
    ctx.beginPath();
    ctx.moveTo(neckBaseX - 8.2 * u, neckBaseY + 1.5 * u);
    ctx.quadraticCurveTo(tx - 15 * u, shoulderY + 1.5 * u, tx - 19.6 * u, shoulderY + 9.5 * u);
    ctx.bezierCurveTo(
      tx - 18.2 * u,
      shoulderY + 34 * u,
      tx - 14.5 * u,
      hipY - 12 * u,
      tx - 15.2 * u - windSway * 0.3,
      hemY
    );
    ctx.quadraticCurveTo(tx, hemY + 2.4 * u, tx + 15.6 * u + windSway * 0.4, hemY - 0.5 * u);
    ctx.bezierCurveTo(
      tx + 14.8 * u,
      hipY - 12 * u,
      tx + 18.4 * u,
      shoulderY + 34 * u,
      tx + 19.6 * u,
      shoulderY + 9.5 * u
    );
    ctx.quadraticCurveTo(tx + 15 * u, shoulderY + 1.5 * u, neckBaseX + 8.2 * u, neckBaseY + 1.5 * u);
    ctx.closePath();
    ctx.fill();

    // Subtle center-back tailoring seam & shoulder yoke crease
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = Math.max(0.8, 1.0 * u);
    ctx.beginPath();
    ctx.moveTo(tx, neckBaseY + 4 * u);
    ctx.lineTo(tx, hemY);
    ctx.moveTo(tx - 17 * u, shoulderY + 16 * u);
    ctx.quadraticCurveTo(tx, shoulderY + 19 * u, tx + 17 * u, shoulderY + 16 * u);
    ctx.stroke();

    // Curved anatomical cashmere scarf drape (soft crescent collar, zero rigid rectangle bar)
    const scarfSway = Math.sin(sc.timeSec * 3.4) * 2.5 * u + (isHero ? 6 * u : 1.5 * u);
    const scarfGrad = ctx.createLinearGradient(
      neckBaseX - 10 * u,
      neckBaseY,
      neckBaseX + 12 * u,
      neckBaseY + 24 * u
    );
    scarfGrad.addColorStop(0, palette.scarfMid);
    scarfGrad.addColorStop(1, palette.scarfShadow);
    ctx.fillStyle = scarfGrad;
    ctx.beginPath();
    ctx.moveTo(neckBaseX - 8.8 * u, neckBaseY - 0.5 * u);
    ctx.quadraticCurveTo(neckBaseX, neckBaseY + 2.8 * u, neckBaseX + 8.8 * u, neckBaseY - 0.5 * u);
    ctx.quadraticCurveTo(neckBaseX + 9.4 * u, neckBaseY + 3.8 * u, neckBaseX, neckBaseY + 6.2 * u);
    ctx.quadraticCurveTo(neckBaseX - 9.4 * u, neckBaseY + 3.8 * u, neckBaseX - 8.8 * u, neckBaseY - 0.5 * u);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(neckBaseX + 1.5 * u, neckBaseY + 4 * u);
    ctx.bezierCurveTo(
      neckBaseX + 6 * u + scarfSway * 0.4,
      neckBaseY + 11 * u,
      neckBaseX + 8 * u + scarfSway * 0.8,
      neckBaseY + 19 * u,
      neckBaseX + 6 * u + scarfSway,
      neckBaseY + 26 * u
    );
    ctx.lineTo(neckBaseX + 1.2 * u + scarfSway * 0.7, neckBaseY + 25 * u);
    ctx.quadraticCurveTo(neckBaseX + 2 * u, neckBaseY + 14 * u, neckBaseX - 2 * u, neckBaseY + 4.5 * u);
    ctx.closePath();
    ctx.fill();

    // Left companion arm hanging downward with natural gravity elbow onto RIMOWA handle
    const leftShoulderX = tx - 17.5 * u;
    const leftShoulderY = shoulderY + 7.8 * u;
    const leftArm = solveGravityArmIK(
      leftShoulderX,
      leftShoulderY,
      rimowaAnchors.gripX + 1.5 * u,
      rimowaAnchors.gripY,
      39 * u,
      37 * u,
      1
    );
    drawSculptedJacketArm(
      ctx,
      leftShoulderX,
      leftShoulderY,
      leftArm.elbowX,
      leftArm.elbowY,
      leftArm.handX,
      leftArm.handY,
      7.0 * u,
      5.6 * u,
      4.2 * u,
      u,
      palette,
      'grip_bar',
      'rgba(253, 224, 71, 0.20)'
    );
    return;
  }

  // ===========================================================================
  // MODE B: Upright Classical 1:7.5 Contre-Jour Stride (`tow_stride`)
  // ~99.5% straight stance leg at mid-stance, natural swing knee flexion,
  // tailored hip-length jacket (zero knee-length triangle skirt!), deep chiaroscuro profile.
  // ===========================================================================
  const stride = computeHumanStridePose(opts.walkPhase, 19.5);

  if (!isReflection) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.46)';
    ctx.beginPath();
    ctx.ellipse(tx + 1 * u, gy + 2 * u, 28 * u, 4.8 * u, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const hipX = tx;
  const hipY = gy - 119.3 * u - stride.pelvisBobY * u;
  const spineLean = stride.spineLean;
  const shoulderX = hipX + Math.sin(spineLean) * 76 * u;
  const shoulderY = hipY - Math.cos(spineLean) * 76 * u;
  const neckBaseX = shoulderX + 2.0 * u;
  const neckBaseY = shoulderY - 2.4 * u;

  const thighLen = 55.5 * u;
  const calfLen = 54.5 * u;

  const solveStrideLeg = (
    offsetX_U: number,
    liftY_U: number,
    footPitch: number,
    heelOff: number,
    hipShiftX_U: number
  ) => {
    const rootX = hipX + hipShiftX_U * u;
    const ankleX = hipX + offsetX_U * u;
    const ankleY = gy - 11 * u - liftY_U * u;
    const ik = solveTwoBoneIK(rootX, hipY, ankleX, ankleY, thighLen, calfLen, -1);
    return { ...ik, rootX, footPitch, heelOff };
  };

  const farLeg = solveStrideLeg(
    stride.farLeg.ankleOffsetX,
    stride.farLeg.ankleLiftY,
    stride.farLeg.footPitch,
    stride.farLeg.heelOff,
    -1.8
  );
  const nearLeg = solveStrideLeg(
    stride.nearLeg.ankleOffsetX,
    stride.nearLeg.ankleLiftY,
    stride.nearLeg.footPitch,
    stride.nearLeg.heelOff,
    1.2
  );

  // 1. Far Leg & Chelsea Boot
  drawTailoredTrouserLeg(
    ctx,
    farLeg.rootX,
    hipY,
    farLeg.elbowX,
    farLeg.elbowY,
    farLeg.handX,
    farLeg.handY,
    9.4 * u,
    6.8 * u,
    4.7 * u,
    '#08090e',
    palette.trouserFar
  );
  drawGroundedChelseaBoot(
    ctx,
    farLeg.handX,
    farLeg.handY,
    gy,
    u,
    farLeg.footPitch,
    palette,
    0.88,
    farLeg.heelOff
  );

  // 2. Far Arm counter-swinging naturally beside torso
  const farShoulderX = shoulderX + 2.4 * u;
  const farShoulderY = shoulderY + 6.8 * u;
  const farWristX = shoulderX + 4.2 * u + stride.farArmSwingX * 0.52 * u;
  const farWristY = shoulderY + 66 * u - stride.farArmLiftY * 0.55 * u;
  const farArmIK = solveGravityArmIK(
    farShoulderX,
    farShoulderY,
    farWristX,
    farWristY,
    38 * u,
    36 * u,
    -1
  );
  drawSculptedJacketArm(
    ctx,
    farShoulderX,
    farShoulderY,
    farArmIK.elbowX,
    farArmIK.elbowY,
    farArmIK.handX,
    farArmIK.handY,
    6.6 * u,
    5.2 * u,
    3.9 * u,
    u,
    palette,
    'relaxed',
    'rgba(226, 232, 240, 0.12)'
  );

  // 3. Tilted 20" RIMOWA Original Cabin rolling effortlessly behind the Traveler
  const rimowaAnchors = drawRimowaCabin(sc, {
    cx: tx - 58 * u,
    bottomY: gy,
    caseHeightPx: 78 * u,
    tilt: 0.34,
    handleRatio: 0.6,
    restingOnRearWheels: true,
    warmHandleGlow: opts.warmHandleGlow,
  });

  // 4. Near Leg & Chelsea Boot
  drawTailoredTrouserLeg(
    ctx,
    nearLeg.rootX,
    hipY,
    nearLeg.elbowX,
    nearLeg.elbowY,
    nearLeg.handX,
    nearLeg.handY,
    9.8 * u,
    7.1 * u,
    4.9 * u,
    palette.trouserFar,
    palette.trouserNear,
    'rgba(226, 232, 240, 0.14)'
  );
  drawGroundedChelseaBoot(
    ctx,
    nearLeg.handX,
    nearLeg.handY,
    gy,
    u,
    nearLeg.footPitch,
    palette,
    1,
    nearLeg.heelOff
  );

  // 5. Classical 1:7.5 Contre-Jour Chiaroscuro Profile Head
  drawBacklitStrideHead(
    ctx,
    neckBaseX,
    neckBaseY,
    u,
    stride.headNod,
    sc.timeSec * 4.0,
    palette,
    opts.rimColor
  );

  // 6. Tailored Hip-Length Architectural Wool Jacket (clean dark wool tailoring — zero white flap!)
  const hemY = hipY + 9.5 * u;
  const strideSway = stride.nearLeg.ankleOffsetX * 0.12 * u;
  const backVent = 2.6 * u + Math.sin(opts.walkPhase * 2) * 1.4 * u;

  const jacketGrad = ctx.createLinearGradient(
    shoulderX - 16 * u,
    shoulderY,
    shoulderX + 16 * u,
    hemY
  );
  jacketGrad.addColorStop(0, palette.jacketCore);
  jacketGrad.addColorStop(0.66, palette.jacketMid);
  jacketGrad.addColorStop(1, palette.jacketLight);
  ctx.fillStyle = jacketGrad;
  ctx.beginPath();
  ctx.moveTo(neckBaseX - 8.6 * u, neckBaseY - 2.4 * u);
  ctx.quadraticCurveTo(neckBaseX - 0.5 * u, neckBaseY - 1.2 * u, neckBaseX + 6.8 * u, neckBaseY + 1.8 * u);
  // Structured masculine chestplane tapering naturally to waist/hip
  ctx.bezierCurveTo(
    shoulderX + 14.2 * u,
    shoulderY + 18 * u,
    hipX + 12.6 * u,
    hipY - 14 * u,
    hipX + 13.0 * u + strideSway,
    hemY
  );
  ctx.quadraticCurveTo(hipX, hemY + 2.2 * u, hipX - 13.8 * u - backVent, hemY - 1.0 * u);
  ctx.bezierCurveTo(
    hipX - 12.6 * u - backVent * 0.4,
    hipY - 16 * u,
    shoulderX - 13.8 * u,
    shoulderY + 18 * u,
    neckBaseX - 8.6 * u,
    neckBaseY - 2.4 * u
  );
  ctx.closePath();
  ctx.fill();

  // Subtle stand collar & warm cashmere scarf wrap (understated, dark-amber chiaroscuro)
  const scarfWave = 4.2 * u + Math.sin(sc.timeSec * 3.8) * 2.4 * u;
  const scarfGrad = ctx.createLinearGradient(
    neckBaseX - 18 * u,
    neckBaseY - 4 * u,
    neckBaseX + 8 * u,
    neckBaseY + 18 * u
  );
  scarfGrad.addColorStop(0, palette.scarfMid);
  scarfGrad.addColorStop(1, palette.scarfShadow);
  ctx.fillStyle = scarfGrad;
  ctx.beginPath();
  ctx.moveTo(neckBaseX - 4.5 * u, neckBaseY + 1.5 * u);
  ctx.bezierCurveTo(
    neckBaseX - 10 * u - scarfWave * 0.35,
    neckBaseY + 6 * u,
    neckBaseX - 12 * u - scarfWave * 0.7,
    neckBaseY + 13 * u,
    neckBaseX - 15 * u - scarfWave,
    neckBaseY + 19 * u
  );
  ctx.lineTo(neckBaseX - 11 * u - scarfWave * 0.85, neckBaseY + 21 * u);
  ctx.quadraticCurveTo(neckBaseX - 7 * u, neckBaseY + 11 * u, neckBaseX - 1.5 * u, neckBaseY + 4 * u);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(neckBaseX - 6.8 * u, neckBaseY - 1.2 * u);
  ctx.quadraticCurveTo(neckBaseX + 0.5 * u, neckBaseY + 1.8 * u, neckBaseX + 7.2 * u, neckBaseY - 0.8 * u);
  ctx.quadraticCurveTo(neckBaseX + 7.6 * u, neckBaseY + 3.4 * u, neckBaseX + 0.2 * u, neckBaseY + 5.0 * u);
  ctx.quadraticCurveTo(neckBaseX - 7.4 * u, neckBaseY + 3.2 * u, neckBaseX - 6.8 * u, neckBaseY - 1.2 * u);
  ctx.closePath();
  ctx.fill();

  // Delicate tonal chest rim kiss (subtle 0.18 alpha — zero cartoon yellow stripe!)
  ctx.save();
  ctx.strokeStyle = 'rgba(244, 239, 230, 0.18)';
  ctx.lineWidth = Math.max(0.75, 0.9 * u);
  ctx.beginPath();
  ctx.moveTo(neckBaseX + 6.8 * u, neckBaseY + 1.8 * u);
  ctx.bezierCurveTo(
    shoulderX + 14.2 * u,
    shoulderY + 18 * u,
    hipX + 12.6 * u,
    hipY - 14 * u,
    hipX + 13.0 * u + strideSway,
    hemY
  );
  ctx.stroke();
  ctx.restore();

  // 7. Near Arm using posterior Two-Bone IK (bendSign = +1 keeps pulling elbow naturally behind shoulder, never poking forward!)
  const armRootX = shoulderX - 1.8 * u;
  const armRootY = shoulderY + 7.8 * u;
  const nearArmIK = solveTwoBoneIK(
    armRootX,
    armRootY,
    rimowaAnchors.gripX,
    rimowaAnchors.gripY,
    39 * u,
    37 * u,
    1
  );
  drawSculptedJacketArm(
    ctx,
    armRootX,
    armRootY,
    nearArmIK.elbowX,
    nearArmIK.elbowY,
    nearArmIK.handX,
    nearArmIK.handY,
    7.2 * u,
    5.8 * u,
    4.2 * u,
    u,
    palette,
    'grip_bar',
    'rgba(226, 232, 240, 0.16)'
  );
}

/**
 * Seated Airport Terminal Companion Scene (Shot 13 `airport_delay_rain`):
 * Natural 1:7.5 seated human posture on terminal beam seat, contre-jour rain-window lighting,
 * quiet inclined head, left forearm resting on thigh, right hand resting on 20" RIMOWA.
 */
export function drawSeatedAirportTravelerWithRimowa(
  sc: ShotContext,
  benchCenterX: number,
  floorY: number,
  scaleH: number
): void {
  const { ctx } = sc;
  const u = scaleH / 252;
  const breath = Math.sin(sc.timeSec * 1.8) * 1.0 * u;
  const palette = getHumanPalette(true);

  const seatY = floorY - 46 * u;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.beginPath();
  ctx.ellipse(benchCenterX + 8 * u, floorY + 2 * u, 114 * u, 6.5 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cast-aluminum tandem terminal beam bench
  ctx.fillStyle = '#0e1626';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
  ctx.lineWidth = Math.max(1, 1.3 * u);
  ctx.fillRect(benchCenterX - 78 * u, seatY + 8 * u, 6 * u, 38 * u);
  ctx.fillRect(benchCenterX + 44 * u, seatY + 8 * u, 6 * u, 38 * u);
  roundRectPath(ctx, benchCenterX - 92 * u, seatY - 46 * u, 110 * u, 36 * u, 7 * u);
  ctx.fill();
  ctx.stroke();
  roundRectPath(ctx, benchCenterX - 96 * u, seatY, 160 * u, 8.5 * u, 4 * u);
  ctx.fill();
  ctx.stroke();

  // Loyal 20" RIMOWA Cabin standing upright beside the seated traveler's knee
  const rimowa = drawRimowaCabin(sc, {
    cx: benchCenterX + 64 * u,
    bottomY: floorY + 1 * u,
    caseHeightPx: 78 * u,
    tilt: 0,
    handleRatio: 0.16,
    warmHandleGlow: true,
  });

  const hipX = benchCenterX - 22 * u;
  const hipY = seatY - 4 * u;
  const kneeX = benchCenterX + 18 * u;
  const kneeY = seatY - 2.5 * u;

  // Far seated leg
  drawTailoredTrouserLeg(
    ctx,
    hipX + 4 * u,
    hipY,
    kneeX + 8 * u,
    kneeY + 1.5 * u,
    kneeX + 15 * u,
    floorY - 11 * u,
    9.4 * u,
    7.0 * u,
    4.7 * u,
    '#070b13',
    palette.trouserFar
  );
  drawGroundedChelseaBoot(ctx, kneeX + 15 * u, floorY - 11 * u, floorY, u, 0, palette, 0.86);

  // Near seated leg
  drawTailoredTrouserLeg(
    ctx,
    hipX,
    hipY,
    kneeX,
    kneeY,
    kneeX + 4 * u,
    floorY - 11 * u,
    9.8 * u,
    7.3 * u,
    4.9 * u,
    palette.trouserFar,
    palette.trouserNear,
    'rgba(125, 211, 252, 0.22)'
  );
  drawGroundedChelseaBoot(ctx, kneeX + 4 * u, floorY - 11 * u, floorY, u, 0, palette, 1);

  // Quietly inclined contre-jour head ("你听过我 长叹息声")
  const shoulderX = hipX + 14 * u;
  const shoulderY = hipY - 68 * u + breath;
  drawBacklitStrideHead(
    ctx,
    shoulderX + 4.0 * u,
    shoulderY - 3.5 * u,
    u,
    0.16,
    sc.timeSec * 1.4,
    palette,
    '#7dd3fc',
    true
  );

  // Tailored seated wool jacket draping cleanly to hip
  const jGrad = ctx.createLinearGradient(hipX - 18 * u, shoulderY, kneeX - 4 * u, hipY + 10 * u);
  jGrad.addColorStop(0, palette.jacketCore);
  jGrad.addColorStop(0.65, palette.jacketMid);
  jGrad.addColorStop(1, palette.jacketLight);
  ctx.fillStyle = jGrad;
  ctx.beginPath();
  ctx.moveTo(hipX - 15 * u, hipY + 7 * u);
  ctx.bezierCurveTo(
    hipX - 18 * u,
    hipY - 32 * u,
    shoulderX - 15 * u,
    shoulderY + 8 * u,
    shoulderX - 5.5 * u,
    shoulderY - 5.5 * u
  );
  ctx.lineTo(shoulderX + 8.5 * u, shoulderY - 0.5 * u);
  ctx.bezierCurveTo(
    shoulderX + 15 * u,
    shoulderY + 22 * u,
    hipX + 18 * u,
    hipY - 10 * u,
    hipX + 14 * u,
    hipY + 8 * u
  );
  ctx.quadraticCurveTo(hipX - 2 * u, hipY + 11 * u, hipX - 15 * u, hipY + 7 * u);
  ctx.closePath();
  ctx.fill();

  // Warm muted scarf collar
  ctx.fillStyle = palette.scarfMid;
  roundRectPath(ctx, shoulderX - 4.5 * u, shoulderY - 7.2 * u, 14.2 * u, 6.0 * u, 2.8 * u);
  ctx.fill();

  // Left forearm resting calmly on thigh
  const lapArmIK = solveGravityArmIK(
    shoulderX + 4 * u,
    shoulderY + 8 * u,
    kneeX - 3 * u,
    kneeY - 5 * u,
    36 * u,
    34 * u,
    -1
  );
  drawSculptedJacketArm(
    ctx,
    shoulderX + 4 * u,
    shoulderY + 8 * u,
    lapArmIK.elbowX,
    lapArmIK.elbowY,
    lapArmIK.handX,
    lapArmIK.handY,
    6.6 * u,
    5.2 * u,
    3.9 * u,
    u,
    palette,
    'relaxed',
    'rgba(125, 211, 252, 0.18)'
  );

  // Right arm reaching naturally with downward gravity elbow onto RIMOWA's glowing handle
  const reachIK = solveGravityArmIK(
    shoulderX + 1.5 * u,
    shoulderY + 8.5 * u,
    rimowa.gripX,
    rimowa.gripY,
    42 * u,
    40 * u,
    -1
  );
  drawSculptedJacketArm(
    ctx,
    shoulderX + 1.5 * u,
    shoulderY + 8.5 * u,
    reachIK.elbowX,
    reachIK.elbowY,
    reachIK.handX,
    reachIK.handY,
    7.0 * u,
    5.6 * u,
    4.1 * u,
    u,
    palette,
    'grip_bar',
    'rgba(251, 191, 36, 0.24)'
  );
}

/**
 * Overlook Terrace Shoulder-to-Shoulder Companion Shot (Shot 10 `shoulder_companion`: "尔似 在我肩"):
 * Cinematic 3/4 Rear-View *Rückenfigur* standing tall and upright (99.3% straight stance legs)
 * at the harbor balustrade, gazing out over the glittering bay skyline, right hand resting naturally
 * on the architectural railing, left hand resting affectionately on Xiaohei's glowing handle.
 */
export function drawTerraceShoulderCompanion(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;
  const floorY = h * 0.86;
  const figH = h * 0.58;
  const u = figH / 252;
  const breathe = Math.sin(timeSec * 2.0) * 0.9 * u;
  const palette = getHumanPalette(false);

  // 1. Evening Overlook Terrace Promenade Floor & Waist/Rib-Height Architectural Balustrade
  const railTopY = floorY - 134 * u;
  ctx.save();
  ctx.strokeStyle = 'rgba(244, 239, 230, 0.11)';
  ctx.lineWidth = Math.max(1.0, 1.3 * u);
  for (let bx = 42; bx < w; bx += 72) {
    ctx.beginPath();
    ctx.moveTo(bx, railTopY);
    ctx.lineTo(bx, floorY);
    ctx.stroke();
  }
  ctx.fillStyle = '#181622';
  ctx.fillRect(0, railTopY - 3.5 * u, w, 5.5 * u);
  ctx.fillStyle = 'rgba(250, 204, 21, 0.34)';
  ctx.fillRect(0, railTopY - 3.5 * u, w, 1.2);
  ctx.restore();

  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#14121d');
  floorGrad.addColorStop(0.4, '#0c0b12');
  floorGrad.addColorStop(1, '#060609');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  ctx.fillStyle = 'rgba(250, 204, 21, 0.26)';
  ctx.fillRect(0, floorY, w, 1.2);

  // 2. 20" RIMOWA Original Cabin standing faithfully beside the Traveler
  const tx = w * 0.58;
  const rimowaX = tx - 44 * u;
  const rimowa = drawRimowaCabin(sc, {
    cx: rimowaX,
    bottomY: floorY - beat.kickPulse * 1.5,
    caseHeightPx: 80 * u,
    tilt: 0,
    handleRatio: 0.53,
    warmHandleGlow: true,
    showScuffs: true,
  });

  ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
  ctx.beginPath();
  ctx.ellipse(tx, floorY + 2 * u, 28 * u, 5.0 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Tall Upright 1:7.5 3/4 Rear-View *Rückenfigur* gazing toward the harbor skyline
  const hipY = floorY - 120.2 * u + breathe;
  const shoulderY = hipY - 76 * u;
  const neckBaseX = tx - 0.5 * u;
  const neckBaseY = shoulderY - 2.0 * u;
  const thighLen = 55.5 * u;
  const calfLen = 54.5 * u;

  // Left (Xiaohei-side) straight standing leg
  const leftHipX = tx - 7.8 * u;
  const leftAnkleX = tx - 9.8 * u;
  const leftAnkleY = floorY - 11 * u;
  const leftLegIK = solveTwoBoneIK(
    leftHipX,
    hipY,
    leftAnkleX,
    leftAnkleY,
    thighLen,
    calfLen,
    -1
  );
  drawTailoredTrouserLeg(
    ctx,
    leftHipX,
    hipY,
    leftLegIK.elbowX,
    leftLegIK.elbowY,
    leftAnkleX,
    leftAnkleY,
    9.5 * u,
    6.9 * u,
    4.8 * u,
    palette.trouserFar,
    palette.trouserNear
  );
  drawGroundedChelseaBoot(ctx, leftAnkleX, leftAnkleY, floorY, u, -0.02, palette, 0.95);

  // Right relaxed contrapposto standing leg
  const rightHipX = tx + 8.0 * u;
  const rightAnkleX = tx + 12.2 * u;
  const rightAnkleY = floorY - 11 * u;
  const rightLegIK = solveTwoBoneIK(
    rightHipX,
    hipY,
    rightAnkleX,
    rightAnkleY,
    thighLen,
    calfLen,
    -1
  );
  drawTailoredTrouserLeg(
    ctx,
    rightHipX,
    hipY,
    rightLegIK.elbowX,
    rightLegIK.elbowY,
    rightAnkleX,
    rightAnkleY,
    9.8 * u,
    7.0 * u,
    4.9 * u,
    palette.trouserFar,
    palette.trouserNear,
    'rgba(226, 232, 240, 0.12)'
  );
  drawGroundedChelseaBoot(ctx, rightAnkleX, rightAnkleY, floorY, u, 0.03, palette, 1);

  // Right arm resting naturally with gentle anatomical bend onto the harbor balustrade rail
  const rightShoulderX = tx + 18.0 * u;
  const rightShoulderY = shoulderY + 8.0 * u;
  const railHandX = tx + 35.5 * u;
  const railHandY = railTopY - 2.0 * u;
  const rightRailIK = solveTwoBoneIK(
    rightShoulderX,
    rightShoulderY,
    railHandX,
    railHandY,
    30.5 * u,
    29.5 * u,
    -1
  );
  drawSculptedJacketArm(
    ctx,
    rightShoulderX,
    rightShoulderY,
    rightRailIK.elbowX,
    rightRailIK.elbowY,
    rightRailIK.handX,
    rightRailIK.handY,
    7.0 * u,
    5.6 * u,
    4.2 * u,
    u,
    palette,
    'rail_rest',
    'rgba(226, 232, 240, 0.16)'
  );

  // 3/4 Rear-View Head gazing fondly toward the harbor & skyline sign (-X look direction)
  drawThreeQuarterRearHead(
    ctx,
    neckBaseX,
    neckBaseY,
    u,
    -1,
    timeSec * 2.8,
    palette,
    chapter.accentHex
  );

  // Tailored Hip-Length Architectural Wool Jacket (V-tapered back, clean tonal contours)
  const hemY = hipY + 9.6 * u;
  const jacketGrad = ctx.createLinearGradient(tx - 22 * u, shoulderY, tx + 22 * u, hemY);
  jacketGrad.addColorStop(0, palette.jacketCore);
  jacketGrad.addColorStop(0.65, palette.jacketMid);
  jacketGrad.addColorStop(1, palette.jacketLight);
  ctx.fillStyle = jacketGrad;
  ctx.beginPath();
  ctx.moveTo(neckBaseX - 8.4 * u, neckBaseY + 1.5 * u);
  ctx.quadraticCurveTo(tx - 15.2 * u, shoulderY + 1.5 * u, tx - 19.8 * u, shoulderY + 9.5 * u);
  ctx.bezierCurveTo(
    tx - 18.4 * u,
    shoulderY + 34 * u,
    tx - 14.8 * u,
    hipY - 12 * u,
    tx - 15.5 * u,
    hemY
  );
  ctx.quadraticCurveTo(tx, hemY + 2.5 * u, tx + 15.8 * u, hemY - 0.5 * u);
  ctx.bezierCurveTo(
    tx + 15.0 * u,
    hipY - 12 * u,
    tx + 18.6 * u,
    shoulderY + 34 * u,
    tx + 19.8 * u,
    shoulderY + 9.5 * u
  );
  ctx.quadraticCurveTo(tx + 15.2 * u, shoulderY + 1.5 * u, neckBaseX + 8.4 * u, neckBaseY + 1.5 * u);
  ctx.closePath();
  ctx.fill();

  // Subtle architectural back yoke & center seam
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = Math.max(0.8, 1.0 * u);
  ctx.beginPath();
  ctx.moveTo(tx, neckBaseY + 4 * u);
  ctx.lineTo(tx, hemY);
  ctx.moveTo(tx - 17 * u, shoulderY + 16 * u);
  ctx.quadraticCurveTo(tx, shoulderY + 19 * u, tx + 17 * u, shoulderY + 16 * u);
  ctx.stroke();

  // Curved anatomical cashmere scarf drape snugly seated at collar base
  const scarfSway = Math.sin(timeSec * 2.6) * 2.0 * u;
  const scarfGrad = ctx.createLinearGradient(
    neckBaseX - 10 * u,
    neckBaseY - 2 * u,
    neckBaseX + 10 * u,
    neckBaseY + 26 * u
  );
  scarfGrad.addColorStop(0, palette.scarfMid);
  scarfGrad.addColorStop(1, palette.scarfShadow);
  ctx.fillStyle = scarfGrad;
  ctx.beginPath();
  ctx.moveTo(neckBaseX - 9.0 * u, neckBaseY - 2.2 * u);
  ctx.quadraticCurveTo(neckBaseX, neckBaseY + 1.4 * u, neckBaseX + 9.0 * u, neckBaseY - 2.2 * u);
  ctx.quadraticCurveTo(neckBaseX + 9.8 * u, neckBaseY + 3.2 * u, neckBaseX, neckBaseY + 6.4 * u);
  ctx.quadraticCurveTo(neckBaseX - 9.8 * u, neckBaseY + 3.2 * u, neckBaseX - 9.0 * u, neckBaseY - 2.2 * u);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(neckBaseX - 2 * u, neckBaseY + 4.2 * u);
  ctx.bezierCurveTo(
    neckBaseX - 5 * u + scarfSway * 0.4,
    neckBaseY + 12 * u,
    neckBaseX - 6 * u + scarfSway * 0.8,
    neckBaseY + 20 * u,
    neckBaseX - 4 * u + scarfSway,
    neckBaseY + 27 * u
  );
  ctx.lineTo(neckBaseX + 1 * u + scarfSway * 0.7, neckBaseY + 26 * u);
  ctx.quadraticCurveTo(neckBaseX + 1 * u, neckBaseY + 14 * u, neckBaseX + 2.5 * u, neckBaseY + 4.2 * u);
  ctx.closePath();
  ctx.fill();

  // 4. Companion Left Arm hanging naturally downward (`solveGravityArmIK`) onto Xiaohei's handle!
  const leftShoulderX = tx - 17.8 * u;
  const leftShoulderY = shoulderY + 8.2 * u;
  const leftArmIK = solveGravityArmIK(
    leftShoulderX,
    leftShoulderY,
    rimowa.gripX + 2 * u,
    rimowa.gripY + 0.5 * u,
    39 * u,
    37 * u,
    1
  );
  drawSculptedJacketArm(
    ctx,
    leftShoulderX,
    leftShoulderY,
    leftArmIK.elbowX,
    leftArmIK.elbowY,
    leftArmIK.handX,
    leftArmIK.handY,
    7.2 * u,
    5.8 * u,
    4.3 * u,
    u,
    palette,
    'grip_bar',
    'rgba(226, 232, 240, 0.16)'
  );
}

/**
 * First-Person POV Unified Chiaroscuro Right Hand Clasping RIMOWA T-Bar (Shot 07 `crossroads_pov`):
 * Unified sculptural dorsal metacarpal & 4-knuckle wave curling cleanly around the T-bar
 * (zero separate pink capsule sausages, zero cartoon yellow-dot watch).
 */
export function drawFirstPersonPovHandOnHandle(
  sc: ShotContext,
  vx: number,
  fgY: number
): void {
  const { ctx, h, beat } = sc;
  const squeeze = beat.kickPulse * 1.4;

  // Twin brushed titanium telescopic tubes descending into bottom frame
  for (const sign of [-1, 1]) {
    const rx = vx + sign * 68;
    const rodGrad = ctx.createLinearGradient(rx - 5.5, 0, rx + 5.5, 0);
    rodGrad.addColorStop(0, '#3f3f46');
    rodGrad.addColorStop(0.45, '#e4e4e7');
    rodGrad.addColorStop(1, '#18181b');
    ctx.fillStyle = rodGrad;
    ctx.fillRect(rx - 5, fgY + 4, 10, h - fgY + 16);
  }

  // Anodized matte-ebony RIMOWA T-bar handle with subtle palm warmth
  const barGrad = ctx.createLinearGradient(vx - 92, fgY - 12, vx + 92, fgY + 12);
  barGrad.addColorStop(0, '#121216');
  barGrad.addColorStop(0.38, '#221d1a');
  barGrad.addColorStop(0.5, '#6b3410');
  barGrad.addColorStop(0.62, '#221d1a');
  barGrad.addColorStop(1, '#121216');
  ctx.fillStyle = barGrad;
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.34)';
  ctx.lineWidth = 1.4;
  roundRectPath(ctx, vx - 92, fgY - 12, 184, 24, 11);
  ctx.fill();
  ctx.stroke();

  // Deep shadow thumb opposition tucked underneath left side of bar
  ctx.fillStyle = '#3d2219';
  ctx.beginPath();
  ctx.moveTo(vx - 36, fgY + 4);
  ctx.quadraticCurveTo(vx - 40, fgY + 16, vx - 22, fgY + 17);
  ctx.quadraticCurveTo(vx - 12, fgY + 15, vx - 14, fgY + 6);
  ctx.closePath();
  ctx.fill();

  // Unified sculptural chiaroscuro dorsal hand & 4-knuckle crest curling over front of bar
  const handGrad = ctx.createLinearGradient(vx - 34, fgY - 18, vx + 42, fgY + 26);
  handGrad.addColorStop(0, '#e2b492');
  handGrad.addColorStop(0.42, '#9c5e44');
  handGrad.addColorStop(0.82, '#4d2b1f');
  handGrad.addColorStop(1, '#261510');
  ctx.fillStyle = handGrad;
  ctx.beginPath();
  // 4-knuckle anatomical wave crest across front of bar
  ctx.moveTo(vx - 33, fgY - 7 - squeeze * 0.3);
  ctx.quadraticCurveTo(vx - 24, fgY - 16 - squeeze * 0.3, vx - 15, fgY - 13 - squeeze * 0.3);
  ctx.quadraticCurveTo(vx - 6, fgY - 18 - squeeze * 0.3, vx + 3, fgY - 13 - squeeze * 0.3);
  ctx.quadraticCurveTo(vx + 12, fgY - 16 - squeeze * 0.3, vx + 20, fgY - 11 - squeeze * 0.3);
  ctx.quadraticCurveTo(vx + 28, fgY - 13 - squeeze * 0.3, vx + 34, fgY - 5);
  // Sweeping ulnar wrist plane down into cuff
  ctx.bezierCurveTo(vx + 40, fgY + 5, vx + 41, fgY + 16, vx + 36, fgY + 26);
  ctx.lineTo(vx - 13, fgY + 27);
  ctx.bezierCurveTo(vx - 24, fgY + 18, vx - 35, fgY + 6, vx - 33, fgY - 7 - squeeze * 0.3);
  ctx.closePath();
  ctx.fill();

  // Three subtle interdigital shadow valleys along front knuckle curl
  ctx.fillStyle = 'rgba(18, 9, 8, 0.52)';
  for (const vxOff of [-15, 3, 19]) {
    ctx.beginPath();
    ctx.moveTo(vx + vxOff - 1.4, fgY - 13);
    ctx.lineTo(vx + vxOff + 1.4, fgY - 13);
    ctx.lineTo(vx + vxOff + 0.4, fgY - 2);
    ctx.closePath();
    ctx.fill();
  }

  // Understated dark titanium watch lug peeking under muted bone cuff
  ctx.fillStyle = '#18181c';
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.45)';
  ctx.lineWidth = 1;
  roundRectPath(ctx, vx - 12, fgY + 21, 48, 7, 3);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#d6cfc2';
  ctx.beginPath();
  ctx.moveTo(vx - 15, fgY + 26);
  ctx.quadraticCurveTo(vx + 12, fgY + 22, vx + 40, fgY + 24);
  ctx.lineTo(vx + 48, fgY + 36);
  ctx.lineTo(vx - 12, fgY + 38);
  ctx.closePath();
  ctx.fill();

  const sleeveGrad = ctx.createLinearGradient(vx - 14, fgY + 34, vx + 95, h);
  sleeveGrad.addColorStop(0, '#222636');
  sleeveGrad.addColorStop(1, '#0c0e15');
  ctx.fillStyle = sleeveGrad;
  ctx.beginPath();
  ctx.moveTo(vx - 15, fgY + 34);
  ctx.quadraticCurveTo(vx + 18, fgY + 30, vx + 50, fgY + 32);
  ctx.lineTo(vx + 104, h + 12);
  ctx.lineTo(vx - 6, h + 12);
  ctx.closePath();
  ctx.fill();
}

/**
 * Cinema 85mm Macro of a Unified Chiaroscuro Human Hand Clasping the RIMOWA Telescopic T-Bar Handle
 * (Shot 14 `handle_warmth_macro`: "把拉杆 温度 全记得").
 * Sculpted as one cohesive anatomical dorsal hand & 4-knuckle wave curling organically over the bar
 * and tucking into deep shadow underneath — ZERO detached pink sausage capsules, ZERO floating arcs,
 * ZERO smiley strokes, ZERO cartoon white stripes or yellow-dot watch.
 */
export function drawRealisticHandOnRimowaHandle(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const cx = w * 0.56;
  const gripY = h * 0.52;
  const shellTopY = h * 0.83;
  const squeeze = beat.kickPulse * 1.6;

  // True 85mm cinema macro focal magnification centered on the hand-handle contact zone
  ctx.save();
  ctx.translate(cx, gripY);
  ctx.scale(1.36, 1.36);
  ctx.translate(-cx, -gripY);

  // 1. Subtle volumetric amber palm-warmth aura + rising fine memory embers
  const auraR = 215 + beat.kickPulse * 16;
  const aura = ctx.createRadialGradient(cx - 8, gripY + 4, 12, cx - 8, gripY + 4, auraR);
  aura.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
  aura.addColorStop(0.48, 'rgba(217, 119, 6, 0.09)');
  aura.addColorStop(1, 'rgba(217, 119, 6, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx - 8, gripY + 4, auraR, 0, Math.PI * 2);
  ctx.fill();

  for (let m = 0; m < 8; m++) {
    const prog = (timeSec * 0.28 + m * 0.125) % 1;
    const mx = cx - 10 + Math.sin(m * 2.3 + timeSec * 1.2) * (36 + m * 13);
    const my = gripY + 16 - prog * 135;
    ctx.fillStyle = `rgba(253, 224, 71, ${((1 - prog) * 0.42).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(mx, my, 1.6 + (m % 2) * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Top Valence of the Matte-Black Anodized Grooved RIMOWA Original Cabin Shell
  const caseW = Math.min(w * 0.56, 540);
  const shellLeft = cx - caseW * 0.5;
  const shellGrad = ctx.createLinearGradient(shellLeft, shellTopY, shellLeft + caseW, h);
  shellGrad.addColorStop(0, '#23232c');
  shellGrad.addColorStop(0.5, '#131319');
  shellGrad.addColorStop(1, '#09090d');
  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.30)';
  ctx.lineWidth = 1.6;
  roundRectPath(ctx, shellLeft, shellTopY, caseW, h - shellTopY + 40, 24);
  ctx.fill();
  ctx.stroke();

  // Riveted brushed-aluminum corner bumpers on macro shell
  for (const cornerX of [shellLeft, shellLeft + caseW - 56]) {
    ctx.fillStyle = '#36363d';
    ctx.strokeStyle = 'rgba(161, 161, 170, 0.55)';
    ctx.lineWidth = 1.2;
    roundRectPath(ctx, cornerX, shellTopY, 56, 46, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d4d4d8';
    for (const [ox, oy] of [
      [15, 14],
      [39, 14],
      [15, 32],
    ]) {
      ctx.beginPath();
      ctx.arc(cornerX + ox, shellTopY + oy, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Signature RIMOWA recessed vertical grooves
  for (let g = 1; g <= 7; g++) {
    const gx = shellLeft + (caseW * g) / 8;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(gx - 1.4, shellTopY + 14);
    ctx.lineTo(gx - 1.4, h);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 239, 230, 0.09)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(gx + 1.4, shellTopY + 14);
    ctx.lineTo(gx + 1.4, h);
    ctx.stroke();
  }

  // 3. Brushed Titanium Twin Telescopic Tubes & Matte-Ebony Ergonomic Handle Bar
  const rodSpan = 114;
  for (const sign of [-1, 1]) {
    const rx = cx + sign * rodSpan;
    // Recessed chrome bezel escutcheon on top of RIMOWA shell
    ctx.fillStyle = '#27272e';
    ctx.strokeStyle = 'rgba(161, 161, 170, 0.5)';
    ctx.lineWidth = 1;
    roundRectPath(ctx, rx - 13, shellTopY - 4, 26, 7, 3);
    ctx.fill();
    ctx.stroke();

    const rodGrad = ctx.createLinearGradient(rx - 8, 0, rx + 8, 0);
    rodGrad.addColorStop(0, '#3f3f46');
    rodGrad.addColorStop(0.38, '#f4efe6');
    rodGrad.addColorStop(0.65, '#71717a');
    rodGrad.addColorStop(1, '#18181b');
    ctx.fillStyle = rodGrad;
    ctx.fillRect(rx - 7.5, gripY + 11, 15, shellTopY - gripY - 13);
  }

  // Matte-ebony anodized handle bar with subtle warm conducted amber glow at center contact zone
  const barW = rodSpan * 2 + 48;
  const barH = 28;
  const barTop = gripY - barH * 0.5;
  const barBottom = gripY + barH * 0.5;

  const barGrad = ctx.createLinearGradient(cx - barW * 0.5, barTop, cx + barW * 0.5, barBottom);
  barGrad.addColorStop(0, '#121216');
  barGrad.addColorStop(0.3, '#1e1a18');
  barGrad.addColorStop(0.48, '#78350f');
  barGrad.addColorStop(0.66, '#1e1a18');
  barGrad.addColorStop(1, '#101014');
  ctx.fillStyle = barGrad;
  roundRectPath(ctx, cx - barW * 0.5, barTop, barW, barH, 13);
  ctx.fill();

  // Specular top bevel hairline along anodized handle bar (subtle metallic realism, zero yellow cartoon border!)
  const bevelGrad = ctx.createLinearGradient(cx - barW * 0.5, 0, cx + barW * 0.5, 0);
  bevelGrad.addColorStop(0, 'rgba(244, 239, 230, 0.14)');
  bevelGrad.addColorStop(0.46, 'rgba(253, 224, 71, 0.52)');
  bevelGrad.addColorStop(1, 'rgba(244, 239, 230, 0.14)');
  ctx.strokeStyle = bevelGrad;
  ctx.lineWidth = 1.3;
  roundRectPath(ctx, cx - barW * 0.5 + 0.5, barTop + 0.5, barW - 1, barH - 1, 12.5);
  ctx.stroke();

  // 4. Deep Shadow Thumb Opposition Wrapping Behind & Underneath the Handle Bar
  const thumbGrad = ctx.createLinearGradient(cx - 50, gripY + 4, cx - 14, barBottom + 9);
  thumbGrad.addColorStop(0, '#8c5038');
  thumbGrad.addColorStop(0.55, '#4f2a1d');
  thumbGrad.addColorStop(1, '#24120e');
  ctx.fillStyle = thumbGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 46, barTop + 6);
  ctx.bezierCurveTo(
    cx - 52,
    barBottom + 2,
    cx - 38,
    barBottom + 8.5 - squeeze * 0.3,
    cx - 20,
    barBottom + 6.5 - squeeze * 0.3
  );
  ctx.quadraticCurveTo(cx - 12, barBottom + 4.5, cx - 14, barBottom - 1);
  ctx.lineTo(cx - 42, barBottom - 2);
  ctx.closePath();
  ctx.fill();

  // Contact occlusion shadow cast by curled fingers onto the handle bar face
  ctx.fillStyle = 'rgba(6, 5, 8, 0.56)';
  roundRectPath(ctx, cx - 44, barTop + 3, 86, barH - 4, 8);
  ctx.fill();

  // 5. UNIFIED SCULPTURAL CHIAROSCURO DORSAL HAND & CURLED FINGER MASS
  // Sweeps seamlessly from wrist -> metacarpal dorsum -> 4-knuckle MCP wave -> angled proximal phalanges
  // curling *underneath* right along `barBottom + 2.5` (zero pink Vienna-sausage capsules!)
  const handGrad = ctx.createLinearGradient(cx - 38, gripY - 54, cx + 44, barBottom + 6);
  handGrad.addColorStop(0, '#ecc5a4');
  handGrad.addColorStop(0.34, '#bd7c5c');
  handGrad.addColorStop(0.72, '#6e3f2d');
  handGrad.addColorStop(1, '#2b1611');
  ctx.fillStyle = handGrad;

  const kLift = squeeze * 0.4;
  const tuckY = barBottom + 2.4 - squeeze * 0.25;

  ctx.beginPath();
  // Radial wrist entry from upper-right cuff
  ctx.moveTo(cx + 62, gripY - 52);
  // Smooth anatomical radial-thumb web curve down to Index MCP knuckle crest
  ctx.bezierCurveTo(
    cx + 28,
    gripY - 44,
    cx - 14,
    gripY - 34,
    cx - 36,
    barTop - 5.5 - kLift
  );
  // Index radial edge angling gently inward (-X/+Y) as it wraps around the front of the bar
  ctx.bezierCurveTo(
    cx - 43,
    barTop + 3,
    cx - 44,
    barBottom - 5,
    cx - 39,
    tuckY - 1.5
  );
  // Four curled finger-pad undersides tucking tightly along `barBottom` into shadow:
  // Index curl -> Middle curl -> Ring curl -> Little finger curl
  ctx.quadraticCurveTo(cx - 31, tuckY + 2.2, cx - 23, tuckY - 0.8);
  ctx.quadraticCurveTo(cx - 13, tuckY + 3.0, cx - 4, tuckY - 0.6);
  ctx.quadraticCurveTo(cx + 5, tuckY + 2.4, cx + 14, tuckY - 1.0);
  ctx.quadraticCurveTo(cx + 22, tuckY + 1.4, cx + 29, barBottom - 2.0);
  // Ulnar edge of little finger & hypothenar border sweeping smoothly back up into wrist/cuff!
  ctx.bezierCurveTo(
    cx + 35,
    barTop + 9,
    cx + 48,
    gripY - 6,
    cx + 80,
    gripY - 15
  );
  ctx.closePath();
  ctx.fill();

  // Warm rim-light catch along the upper radial metacarpal ridge & 4-knuckle MCP wave
  ctx.save();
  ctx.strokeStyle = 'rgba(254, 240, 215, 0.45)';
  ctx.lineCap = 'round';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 54, gripY - 49);
  ctx.bezierCurveTo(
    cx + 22,
    gripY - 41,
    cx - 14,
    gripY - 33,
    cx - 35,
    barTop - 5.0 - kLift
  );
  ctx.stroke();

  // Soft sculptural 3D knuckle-ridge catchlight across the 4 MCP domes (organic wave, NOT semi-circle outlines!)
  const knuckleGlow = ctx.createLinearGradient(cx - 36, barTop - 6, cx + 28, barTop + 2);
  knuckleGlow.addColorStop(0, 'rgba(255, 237, 213, 0.34)');
  knuckleGlow.addColorStop(0.6, 'rgba(253, 224, 171, 0.22)');
  knuckleGlow.addColorStop(1, 'rgba(253, 224, 171, 0)');
  ctx.strokeStyle = knuckleGlow;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(cx - 35, barTop - 2.5 - kLift);
  ctx.quadraticCurveTo(cx - 28, barTop - 6.5 - kLift, cx - 20, barTop - 3.2 - kLift);
  ctx.quadraticCurveTo(cx - 11, barTop - 7.5 - kLift, cx - 2, barTop - 3.2 - kLift);
  ctx.quadraticCurveTo(cx + 6, barTop - 6.0 - kLift, cx + 14, barTop - 2.2 - kLift);
  ctx.quadraticCurveTo(cx + 21, barTop - 4.2 - kLift, cx + 27, barTop + 0.5 - kLift);
  ctx.stroke();
  ctx.restore();

  // Three soft, tapered interdigital shadow valleys sculpting the 4 curled fingers naturally
  const valleys = [
    { topX: cx - 20, botX: cx - 23, topY: barTop - 1.5, botY: tuckY - 0.8 },
    { topX: cx - 2, botX: cx - 4, topY: barTop - 1.8, botY: tuckY - 0.6 },
    { topX: cx + 14.5, botX: cx + 13.5, topY: barTop - 0.5, botY: tuckY - 1.0 },
  ];
  for (const v of valleys) {
    const vGrad = ctx.createLinearGradient(v.topX, v.topY, v.botX, v.botY);
    vGrad.addColorStop(0, 'rgba(38, 18, 14, 0.08)');
    vGrad.addColorStop(0.45, 'rgba(24, 11, 9, 0.58)');
    vGrad.addColorStop(1, 'rgba(12, 6, 6, 0.78)');
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.moveTo(v.topX - 1.2, v.topY);
    ctx.lineTo(v.topX + 1.2, v.topY);
    ctx.lineTo(v.botX + 2.0, v.botY);
    ctx.lineTo(v.botX - 2.0, v.botY);
    ctx.closePath();
    ctx.fill();
  }

  // Subtle underside core shadow along the proximal-to-middle phalanx curl into the bar bottom
  const curlShadow = ctx.createLinearGradient(0, gripY + 2, 0, tuckY + 3);
  curlShadow.addColorStop(0, 'rgba(18, 9, 8, 0)');
  curlShadow.addColorStop(1, 'rgba(15, 7, 7, 0.64)');
  ctx.fillStyle = curlShadow;
  ctx.fillRect(cx - 42, gripY + 2, 74, tuckY - gripY + 2);

  // 6. Minimalist Brushed Dark-Titanium Watch Case Edge + Crisp Bone Cuff + Tailored Charcoal Sleeve
  ctx.save();
  ctx.translate(cx + 66, gripY - 34);
  ctx.rotate(-0.43);
  ctx.fillStyle = '#14151a';
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.42)';
  ctx.lineWidth = 1.1;
  roundRectPath(ctx, -4.5, -18, 9, 36, 3);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Muted archival-bone shirt cuff emerging cleanly from jacket sleeve
  const cuffGrad = ctx.createLinearGradient(cx + 60, gripY - 56, cx + 88, gripY - 14);
  cuffGrad.addColorStop(0, '#e7e0d3');
  cuffGrad.addColorStop(0.65, '#beb6a8');
  cuffGrad.addColorStop(1, '#7c756b');
  ctx.fillStyle = cuffGrad;
  ctx.beginPath();
  ctx.moveTo(cx + 58, gripY - 53);
  ctx.quadraticCurveTo(cx + 68, gripY - 58, cx + 77, gripY - 60);
  ctx.lineTo(cx + 95, gripY - 17);
  ctx.quadraticCurveTo(cx + 85, gripY - 13, cx + 75, gripY - 13);
  ctx.closePath();
  ctx.fill();

  // Tailored charcoal-navy wool sleeve sweeping off upper-right frame (subtle tonal rim, zero cartoon yellow border!)
  const sleeveGrad = ctx.createLinearGradient(cx + 72, gripY - 70, cx + 135, gripY + 14);
  sleeveGrad.addColorStop(0, '#252938');
  sleeveGrad.addColorStop(0.55, '#151822');
  sleeveGrad.addColorStop(1, '#090a10');
  ctx.fillStyle = sleeveGrad;
  ctx.beginPath();
  ctx.moveTo(cx + 72, gripY - 62);
  ctx.bezierCurveTo(cx + 185, gripY - 114, w * 0.82, h * 0.21, w + 30, h * 0.11);
  ctx.lineTo(w + 30, h * 0.36);
  ctx.bezierCurveTo(w * 0.84, h * 0.41, cx + 205, gripY - 28, cx + 90, gripY - 13);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.24)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(cx + 72, gripY - 62);
  ctx.bezierCurveTo(cx + 185, gripY - 114, w * 0.82, h * 0.21, w + 30, h * 0.11);
  ctx.stroke();

  ctx.restore();
}

/**
 * Low-Angle Ground-Tracking Rig (Shot 03 `boots_wheels_low`: "小小的滚轮 丈量从前"):
 * Full-body 1:7.5 upright Traveler + tilted 20" RIMOWA Cabin with natural biomechanical stride.
 */
export function drawLowTrackingBootsAndRimowa(
  sc: ShotContext,
  rulerY: number
): void {
  const { ctx, w, h, timeSec, chapter } = sc;
  const figH = h * 0.58;
  const u = figH / 252;
  const tx = w * 0.56;

  drawCoupledTravelerAndRimowa(sc, {
    travelerX: tx,
    groundY: rulerY,
    travelerHeightPx: figH,
    walkPhase: timeSec * 5.4,
    pose: 'tow_stride',
    rimColor: chapter.accentHex,
    warmHandleGlow: true,
  });

  // Subtle golden mileage sparks ONLY when shotSpec explicitly permits sparks
  if (!sc.shotSpec.suppressSparks && !sc.shotSpec.freezeWheel) {
    ctx.save();
    ctx.strokeStyle = chapter.accentHex;
    ctx.globalAlpha = 0.58;
    ctx.lineWidth = 1.4;
    for (let sp = 0; sp < 5; sp++) {
      const sx = tx - 54 * u - ((timeSec * 280 + sp * 34) % 110);
      const sy = rulerY - 4 - sp * 3.4;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 16, sy - 2.0);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/**
 * True Ground-Level Macro of RIMOWA Dual-Spoke Multiwheel & Striding Leather Chelsea Boot
 * Used in S03 (hallway wakeup), S05 (odometer macro), S15 (silent cobblestone cushion),
 * S39 (hydroplane rooster-tail spray), S47 (completely halted wheel + fallen ginkgo leaf),
 * and S58 (golden runway light trails).
 */
export function drawTrueMacroWheelAndBoot(
  sc: ShotContext,
  groundY: number,
  opts: {
    wheelRadiusPx?: number;
    haltedLeaf?: boolean;
    cobblestoneCushion?: boolean;
    roosterSpray?: boolean;
    goldenTrails?: boolean;
    showBoot?: boolean;
  }
): void {
  const { ctx, w, timeSec, wheelAngle, beat, chapter } = sc;
  const u = Math.max(0.72, Math.min(1.25, w / 1440));
  const wr = (opts.wheelRadiusPx ?? 52) * u;
  const wheelCx = opts.showBoot === false ? w * 0.48 : w * 0.39;
  const cushionY = opts.cobblestoneCushion
    ? Math.abs(Math.sin(timeSec * 9.5)) * 6.5 * u
    : opts.haltedLeaf
    ? 0
    : beat.kickPulse * 2.2 * u;
  const wheelCy = groundY - wr - 2 * u + cushionY * 0.35;
  const shellBottomY = wheelCy - wr * 0.78 - cushionY * 0.65;

  ctx.save();

  // 1. Optional golden runway four-wheel light trails (S58)
  if (opts.goldenTrails) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let tr = 0; tr < 3; tr++) {
      const ty = groundY - 4 * u - tr * 10 * u;
      const tGrad = ctx.createLinearGradient(wheelCx - 420 * u, ty, wheelCx, ty);
      tGrad.addColorStop(0, 'rgba(250, 204, 21, 0)');
      tGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.36)');
      tGrad.addColorStop(1, 'rgba(254, 240, 138, 0.88)');
      ctx.strokeStyle = tGrad;
      ctx.lineWidth = (5.5 - tr * 1.2) * u;
      ctx.beginPath();
      ctx.moveTo(wheelCx - 420 * u, ty);
      ctx.lineTo(wheelCx + 10 * u, ty);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Ground contact shadow under macro wheel & boot
  ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
  ctx.beginPath();
  ctx.ellipse(wheelCx, groundY + 2 * u, wr * 1.45, 9 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Lower Corner of Matte-Black Grooved RIMOWA Shell + Riveted Brushed-Aluminum Corner Cap
  const caseW = 310 * u;
  const caseH = 220 * u;
  const caseLeft = wheelCx - caseW * 0.34;
  const caseTop = shellBottomY - caseH;

  const bodyGrad = ctx.createLinearGradient(caseLeft, caseTop, caseLeft + caseW, shellBottomY);
  bodyGrad.addColorStop(0, '#2d2d38');
  bodyGrad.addColorStop(0.5, '#17171f');
  bodyGrad.addColorStop(1, '#0b0b10');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = 'rgba(212, 212, 216, 0.35)';
  ctx.lineWidth = 1.8 * u;
  roundRectPath(ctx, caseLeft, caseTop, caseW, caseH, 20 * u);
  ctx.fill();
  ctx.stroke();

  // Signature vertical grooves on lower shell
  for (let g = 1; g <= 5; g++) {
    const gx = caseLeft + (caseW * g) / 6;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.68)';
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(gx - 1.5 * u, caseTop + 14 * u);
    ctx.lineTo(gx - 1.5 * u, shellBottomY - 14 * u);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(244, 244, 245, 0.14)';
    ctx.lineWidth = 1.3 * u;
    ctx.beginPath();
    ctx.moveTo(gx + 1.5 * u, caseTop + 14 * u);
    ctx.lineTo(gx + 1.5 * u, shellBottomY - 14 * u);
    ctx.stroke();
  }

  // Riveted aluminum bottom-left & bottom-right corner bumpers
  for (const cxCap of [caseLeft, caseLeft + caseW - 58 * u]) {
    ctx.fillStyle = '#3f3f48';
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 1.3 * u;
    roundRectPath(ctx, cxCap, shellBottomY - 52 * u, 58 * u, 52 * u, 16 * u);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e4e4e7';
    for (const [rx, ry] of [
      [16, 16],
      [40, 16],
      [16, 36],
    ]) {
      ctx.beginPath();
      ctx.arc(cxCap + rx * u, shellBottomY - 52 * u + ry * u, 2.4 * u, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Rear secondary Multiwheel in soft background depth
  const rearWx = caseLeft + caseW * 0.78;
  const rearWr = wr * 0.84;
  const effAng = opts.haltedLeaf ? 0.42 : wheelAngle;
  ctx.save();
  ctx.globalAlpha = 0.78;
  ctx.translate(rearWx, groundY - rearWr - 2 * u);
  ctx.rotate(effAng);
  ctx.fillStyle = '#0c0c10';
  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = 5 * u;
  ctx.beginPath();
  ctx.arc(0, 0, rearWr, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Hero Foreground RIMOWA Multiwheel Housing, Suspension Fork & Precision Dual-Spoke Wheel
  ctx.fillStyle = '#24242c';
  ctx.strokeStyle = '#71717a';
  ctx.lineWidth = 1.5 * u;
  roundRectPath(ctx, wheelCx - wr * 0.72, shellBottomY - 8 * u, wr * 1.44, wr * 0.62, 10 * u);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(wheelCx, wheelCy);
  ctx.rotate(effAng);

  // High-elasticity matte rubber tire tread
  ctx.fillStyle = '#0b0b0f';
  ctx.strokeStyle = opts.haltedLeaf ? '#78716c' : '#52525b';
  ctx.lineWidth = 8.5 * u;
  ctx.beginPath();
  ctx.arc(0, 0, wr - 4 * u, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Machined inner rim & 5 twin-beam spokes
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2.2 * u;
  ctx.beginPath();
  ctx.arc(0, 0, wr * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 3.4 * u;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.1) * wr * 0.2, Math.sin(a - 0.1) * wr * 0.2);
    ctx.lineTo(Math.cos(a - 0.05) * wr * 0.7, Math.sin(a - 0.05) * wr * 0.7);
    ctx.stroke();
  }

  // Subtle patina scuffs on halted aged wheel (S47)
  if (opts.haltedLeaf) {
    ctx.strokeStyle = 'rgba(214, 211, 209, 0.35)';
    ctx.lineWidth = 1.4 * u;
    ctx.beginPath();
    ctx.arc(0, 0, wr * 0.86, 0.3, 1.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, wr * 0.83, 2.4, 3.2);
    ctx.stroke();
  }

  // Center precision ball-bearing hub cap
  ctx.fillStyle = '#18181b';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 2.2 * u;
  ctx.beginPath();
  ctx.arc(0, 0, wr * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Swan-neck suspension fork arm linking housing down to center axle
  ctx.fillStyle = '#2e2e38';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 1.4 * u;
  roundRectPath(
    ctx,
    wheelCx - 9 * u,
    shellBottomY + 8 * u,
    18 * u,
    wheelCy - shellBottomY - 2 * u,
    8 * u
  );
  ctx.fill();
  ctx.stroke();

  // 5. Rooster-tail hydroplane water spray fan (S39)
  if (opts.roosterSpray) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let d = 0; d < 22; d++) {
      const f = d / 21;
      const ang = Math.PI + 0.18 + f * 0.78;
      const dist = (wr * 1.05 + ((timeSec * 290 + d * 29) % (170 * u)));
      const sx = wheelCx + Math.cos(ang) * dist;
      const sy = groundY - 6 * u + Math.sin(ang) * dist * 0.62;
      ctx.strokeStyle = d % 2 === 0 ? 'rgba(56, 189, 248, 0.72)' : 'rgba(253, 224, 71, 0.75)';
      ctx.lineWidth = (2.6 - f * 1.4) * u;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - Math.cos(ang) * 22 * u, sy - Math.sin(ang) * 14 * u);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 6. Fallen golden ginkgo leaf gently coming to rest against the stationary wheel (S47)
  if (opts.haltedLeaf) {
    const settle = Math.min(1, sc.lineProgress * 1.45);
    const leafX = wheelCx + wr * 1.08 + (1 - settle) * 55 * u + Math.sin(settle * Math.PI * 2) * (1 - settle) * 16 * u;
    const leafY = groundY - 8 * u - (1 - settle) * 95 * u;
    const leafRot = -0.35 + (1 - settle) * 0.85;

    ctx.save();
    ctx.translate(leafX, leafY);
    ctx.rotate(leafRot);
    const leafGrad = ctx.createLinearGradient(-18 * u, -20 * u, 22 * u, 14 * u);
    leafGrad.addColorStop(0, '#fef08a');
    leafGrad.addColorStop(0.6, '#f59e0b');
    leafGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = leafGrad;
    ctx.beginPath();
    ctx.moveTo(-18 * u, 8 * u);
    ctx.quadraticCurveTo(-4 * u, -24 * u, 22 * u, -14 * u);
    ctx.quadraticCurveTo(14 * u, -2 * u, 24 * u, 8 * u);
    ctx.quadraticCurveTo(2 * u, 16 * u, -18 * u, 8 * u);
    ctx.closePath();
    ctx.fill();
    // Stem
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.8 * u;
    ctx.beginPath();
    ctx.moveTo(-18 * u, 8 * u);
    ctx.lineTo(-30 * u, 14 * u);
    ctx.stroke();
    ctx.restore();
  }

  // 7. Foreground Stepping Leather Chelsea Boot & Wool Trouser Cuff on Right
  if (opts.showBoot !== false && !opts.haltedLeaf) {
    const stride = computeHumanStridePose(timeSec * 5.2, 22);
    const bootX = w * 0.68 + stride.nearLeg.ankleOffsetX * 2.2 * u;
    const bootY = groundY - stride.nearLeg.ankleLiftY * 1.9 * u;
    const pitch = stride.nearLeg.footPitch * 0.65;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
    ctx.beginPath();
    ctx.ellipse(bootX + 24 * u, groundY + 3 * u, 76 * u, 8 * u, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(bootX, bootY - 38 * u);
    ctx.rotate(pitch);

    // Lower wool trouser cuff
    const trouserGrad = ctx.createLinearGradient(-36 * u, -160 * u, 36 * u, -10 * u);
    trouserGrad.addColorStop(0, '#0f111a');
    trouserGrad.addColorStop(1, '#1e2233');
    ctx.fillStyle = trouserGrad;
    ctx.beginPath();
    ctx.moveTo(-38 * u, -190 * u);
    ctx.lineTo(28 * u, -190 * u);
    ctx.lineTo(24 * u, -12 * u);
    ctx.lineTo(-30 * u, -10 * u);
    ctx.closePath();
    ctx.fill();

    // Sculpted full-grain dark leather Chelsea boot
    const bGrad = ctx.createLinearGradient(-32 * u, -12 * u, 88 * u, 36 * u);
    bGrad.addColorStop(0, '#272024');
    bGrad.addColorStop(0.5, '#131015');
    bGrad.addColorStop(1, '#070609');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.moveTo(-26 * u, -16 * u);
    ctx.lineTo(22 * u, -16 * u);
    ctx.bezierCurveTo(38 * u, 6 * u, 64 * u, 16 * u, 84 * u, 24 * u);
    ctx.quadraticCurveTo(92 * u, 30 * u, 85 * u, 36 * u);
    ctx.lineTo(-34 * u, 36 * u);
    ctx.quadraticCurveTo(-38 * u, 10 * u, -26 * u, -16 * u);
    ctx.closePath();
    ctx.fill();

    // Goodyear welt & stacked heel
    ctx.fillStyle = '#3b281e';
    ctx.fillRect(-35 * u, 33 * u, 121 * u, 5 * u);
    ctx.fillRect(-35 * u, 37 * u, 36 * u, 5 * u);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * True 85mm Over-The-Shoulder (OTS) Medium Close-Up (`S19`, `S57` — "尔似 在我肩"):
 * Frames the Traveler's back/shoulder & wind-swept cashmere scarf in foreground left-center,
 * with Xiaohei's extended brushed-titanium telescopic handle & top corner right at shoulder level!
 */
export function drawOverTheShoulderCompanion(
  sc: ShotContext,
  opts: { goldenPromenade?: boolean }
): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const u = Math.max(0.72, Math.min(1.25, w / 1440));
  const palette = getHumanPalette(false);
  const breathe = Math.sin(timeSec * 2.2) * 2.2 * u;
  const wind = Math.sin(timeSec * 3.8) * 8 * u;

  // 1. Xiaohei's Top Shell & Extended Telescopic Handle rising right beside the Traveler's shoulder!
  const caseCx = w * 0.64;
  const shellTopY = h * 0.68 + breathe * 0.5;
  const gripY = h * 0.43 + breathe * 0.4;
  const caseW = 290 * u;
  const rodSpan = 74 * u;

  ctx.save();
  // Brushed titanium twin rods
  for (const sign of [-1, 1]) {
    const rx = caseCx + sign * rodSpan;
    const rodGrad = ctx.createLinearGradient(rx - 6 * u, 0, rx + 6 * u, 0);
    rodGrad.addColorStop(0, '#3f3f46');
    rodGrad.addColorStop(0.45, '#f4f4f5');
    rodGrad.addColorStop(1, '#18181b');
    ctx.fillStyle = rodGrad;
    ctx.fillRect(rx - 5.5 * u, gripY, 11 * u, shellTopY - gripY + 8 * u);
  }

  // Warm glowing T-bar handle aligned right with Traveler's shoulder line (`y ~ 0.43h`)!
  const glow = ctx.createRadialGradient(caseCx, gripY, 6 * u, caseCx, gripY, 96 * u);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.36)');
  glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(caseCx, gripY, 96 * u, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#18181f';
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.68)';
  ctx.lineWidth = 1.8 * u;
  roundRectPath(ctx, caseCx - rodSpan - 18 * u, gripY - 11 * u, rodSpan * 2 + 36 * u, 22 * u, 10 * u);
  ctx.fill();
  ctx.stroke();

  // Fluttering orange PRIORITY tag at shoulder level
  ctx.save();
  ctx.translate(caseCx + rodSpan + 6 * u, gripY + 18 * u);
  ctx.rotate(-0.22 + Math.sin(timeSec * 5.6) * 0.12);
  ctx.fillStyle = '#f59e0b';
  roundRectPath(ctx, 0, -10 * u, 74 * u, 24 * u, 4 * u);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.font = `900 ${Math.round(11 * u)}px "Outfit", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('PRIORITY', 37 * u, 5 * u);
  ctx.restore();

  // Upper matte-black grooved RIMOWA shell & riveted corner bumper
  const shellLeft = caseCx - caseW * 0.5;
  const sGrad = ctx.createLinearGradient(shellLeft, shellTopY, shellLeft + caseW, h);
  sGrad.addColorStop(0, '#2c2c38');
  sGrad.addColorStop(0.55, '#15151d');
  sGrad.addColorStop(1, '#09090d');
  ctx.fillStyle = sGrad;
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.42)';
  ctx.lineWidth = 1.8 * u;
  roundRectPath(ctx, shellLeft, shellTopY, caseW, h - shellTopY + 30 * u, 20 * u);
  ctx.fill();
  ctx.stroke();

  for (let g = 1; g <= 6; g++) {
    const gx = shellLeft + (caseW * g) / 7;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.lineWidth = 2.6 * u;
    ctx.beginPath();
    ctx.moveTo(gx, shellTopY + 14 * u);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }

  // 2. Traveler's 3/4 Rear-View Head, Cashmere Scarf & Tailored Wool Shoulder in OTS Foreground (`x ~ 0.36w`)
  const tx = opts.goldenPromenade ? w * 0.38 : w * 0.35;
  const shoulderY = h * 0.46 + breathe;
  const bigU = 2.35 * u;

  drawThreeQuarterRearHead(
    ctx,
    tx,
    shoulderY - 8 * u,
    bigU,
    1,
    timeSec * 3.4,
    palette,
    '#fde047'
  );

  // Broad tailored wool coat shoulders & back
  const coatGrad = ctx.createLinearGradient(tx - 150 * u, shoulderY, tx + 150 * u, h);
  coatGrad.addColorStop(0, '#0b0c12');
  coatGrad.addColorStop(0.65, '#191c29');
  coatGrad.addColorStop(1, '#2c3146');
  ctx.fillStyle = coatGrad;
  ctx.beginPath();
  ctx.moveTo(tx - 34 * u, shoulderY - 4 * u);
  ctx.quadraticCurveTo(tx - 118 * u, shoulderY + 12 * u, tx - 148 * u, shoulderY + 68 * u);
  ctx.lineTo(tx - 164 * u, h + 10);
  ctx.lineTo(tx + 142 * u, h + 10);
  ctx.lineTo(tx + 132 * u, shoulderY + 56 * u);
  ctx.quadraticCurveTo(tx + 96 * u, shoulderY + 10 * u, tx + 34 * u, shoulderY - 4 * u);
  ctx.closePath();
  ctx.fill();

  // Golden sunset rim catchlight along right shoulder & sleeve reaching toward Xiaohei's handle!
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.52)';
  ctx.lineWidth = 2.2 * u;
  ctx.beginPath();
  ctx.moveTo(tx + 34 * u, shoulderY - 4 * u);
  ctx.quadraticCurveTo(tx + 102 * u, shoulderY + 12 * u, caseCx - rodSpan * 0.45, gripY + 4 * u);
  ctx.stroke();

  // Wind-swept warm amber cashmere scarf streaming from Traveler's neck toward Xiaohei's handle!
  const scarfGrad = ctx.createLinearGradient(tx - 30 * u, shoulderY, caseCx, shoulderY + 45 * u);
  scarfGrad.addColorStop(0, '#b45309');
  scarfGrad.addColorStop(0.6, '#d97706');
  scarfGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = scarfGrad;
  ctx.beginPath();
  ctx.moveTo(tx - 36 * u, shoulderY - 6 * u);
  ctx.quadraticCurveTo(tx, shoulderY + 12 * u, tx + 38 * u, shoulderY - 4 * u);
  ctx.bezierCurveTo(
    tx + 92 * u,
    shoulderY + 8 * u - beat.kickPulse * 4 * u,
    tx + 148 * u + wind,
    shoulderY + 2 * u,
    tx + 195 * u + wind * 1.4,
    shoulderY + 22 * u
  );
  ctx.lineTo(tx + 182 * u + wind * 1.2, shoulderY + 44 * u);
  ctx.quadraticCurveTo(tx + 95 * u, shoulderY + 28 * u, tx - 34 * u, shoulderY + 14 * u);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Rainy Midnight Indoor Boarding-Gate Glass Pillar Lean (`S32` — "依然就是 托住我"):
 * Eliminates the jarring starry outdoor harbor teleport in Verse 2!
 * Traveler leans against an indoor terminal column beside rain-streaked glass, resting weight on Xiaohei.
 */
export function drawGatePillarLeanCompanion(sc: ShotContext, floorY: number): void {
  const { ctx, w, h, timeSec } = sc;
  const figH = h * 0.62;
  const u = figH / 252;
  const palette = getHumanPalette(true);
  const breath = Math.sin(timeSec * 1.6) * 0.9 * u;

  // Architectural brushed-steel terminal column at right-center (`x = 0.64w`)
  const pillarX = w * 0.64;
  const pillarW = 68 * u;
  const pGrad = ctx.createLinearGradient(pillarX, 0, pillarX + pillarW, 0);
  pGrad.addColorStop(0, '#0d1524');
  pGrad.addColorStop(0.35, '#1e293b');
  pGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = pGrad;
  ctx.fillRect(pillarX, 0, pillarW, floorY);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(pillarX, 0);
  ctx.lineTo(pillarX, floorY);
  ctx.stroke();

  // Upright Xiaohei standing rock-steady at `x = 0.48w`, supporting the leaning Traveler!
  const caseX = w * 0.47;
  const rimowa = drawRimowaCabin(sc, {
    cx: caseX,
    bottomY: floorY,
    caseHeightPx: 86 * u,
    tilt: 0,
    handleRatio: 0.28,
    warmHandleGlow: true,
    showScuffs: true,
    wheelAngleOverride: 0,
  });

  // Leaning Traveler between Xiaohei and the terminal column (`tx = 0.58w`)
  const tx = w * 0.575;
  const hipY = floorY - 118 * u + breath;
  const shoulderX = tx + 5 * u;
  const shoulderY = hipY - 74 * u;

  // Crossed relaxed standing legs
  const leftLeg = solveTwoBoneIK(tx - 4 * u, hipY, tx - 14 * u, floorY - 11 * u, 55.5 * u, 54.5 * u, -1);
  drawTailoredTrouserLeg(
    ctx,
    tx - 4 * u,
    hipY,
    leftLeg.elbowX,
    leftLeg.elbowY,
    tx - 14 * u,
    floorY - 11 * u,
    9.5 * u,
    6.9 * u,
    4.8 * u,
    palette.trouserFar,
    palette.trouserNear
  );
  drawGroundedChelseaBoot(ctx, tx - 14 * u, floorY - 11 * u, floorY, u, 0, palette, 0.94);

  const rightLeg = solveTwoBoneIK(tx + 5 * u, hipY, tx + 8 * u, floorY - 11 * u, 55.5 * u, 54.5 * u, -1);
  drawTailoredTrouserLeg(
    ctx,
    tx + 5 * u,
    hipY,
    rightLeg.elbowX,
    rightLeg.elbowY,
    tx + 8 * u,
    floorY - 11 * u,
    9.6 * u,
    7.0 * u,
    4.9 * u,
    palette.trouserFar,
    palette.trouserNear,
    'rgba(251, 191, 36, 0.18)'
  );
  drawGroundedChelseaBoot(ctx, tx + 8 * u, floorY - 11 * u, floorY, u, 0.04, palette, 1);

  drawThreeQuarterRearHead(
    ctx,
    shoulderX - 2 * u,
    shoulderY - 2.5 * u,
    u,
    -1,
    timeSec * 1.5,
    palette,
    '#fbbf24'
  );

  // Leaning wool jacket against pillar
  const hemY = hipY + 9 * u;
  ctx.fillStyle = palette.jacketMid;
  ctx.beginPath();
  ctx.moveTo(shoulderX - 18 * u, shoulderY + 6 * u);
  ctx.lineTo(shoulderX + 18 * u, shoulderY + 4 * u);
  ctx.lineTo(tx + 16 * u, hemY);
  ctx.lineTo(tx - 16 * u, hemY);
  ctx.closePath();
  ctx.fill();

  // Left arm resting affectionately down onto Xiaohei's top handle/shell ("依然就是 托住我")
  const leanArm = solveGravityArmIK(
    shoulderX - 15 * u,
    shoulderY + 8 * u,
    rimowa.gripX + 4 * u,
    rimowa.gripY + 4 * u,
    40 * u,
    38 * u,
    1
  );
  drawSculptedJacketArm(
    ctx,
    shoulderX - 15 * u,
    shoulderY + 8 * u,
    leanArm.elbowX,
    leanArm.elbowY,
    leanArm.handX,
    leanArm.handY,
    7 * u,
    5.6 * u,
    4.2 * u,
    u,
    palette,
    'grip_bar',
    'rgba(251, 191, 36, 0.28)'
  );
}

/**
 * Pure Rear-View *Rückenfigur* Walking Into Depth Toward the Uyuni Sunset Horizon (`S66`):
 * Replaces the sideways shrinking-in-place bug with genuine perspective depth progression!
 */
export function drawRearWalkingHorizonDuo(
  sc: ShotContext,
  horizonY: number,
  progress01: number
): void {
  const { ctx, w, h, timeSec } = sc;
  const walkDepth = Math.min(1, Math.max(0, progress01));
  const groundY = horizonY + (h * 0.24) * (1 - walkDepth * 0.72);
  const figH = Math.max(46, h * (0.31 - walkDepth * 0.17));
  const u = figH / 252;
  const tx = w * 0.515;
  const stepCycle = timeSec * 3.8;
  const leftLift = Math.max(0, Math.sin(stepCycle)) * 6.5 * u;
  const rightLift = Math.max(0, -Math.sin(stepCycle)) * 6.5 * u;
  const bob = Math.abs(Math.cos(stepCycle)) * 1.4 * u;

  const drawPass = (isMirror: boolean) => {
    ctx.save();
    if (isMirror) {
      ctx.translate(0, groundY);
      ctx.scale(1, -0.58);
      ctx.translate(0, -groundY);
      ctx.globalAlpha = 0.36;
    }

    // Companion 20" Xiaohei rolling faithfully on left side into the horizon
    const caseX = tx - 38 * u;
    const rimowa = drawRimowaCabin(sc, {
      cx: caseX,
      bottomY: groundY,
      caseHeightPx: 78 * u,
      tilt: 0.08,
      handleRatio: 0.54,
      warmHandleGlow: true,
    });

    const hipY = groundY - 119 * u - bob;
    const shoulderY = hipY - 75 * u;

    // Pure rear bilateral walking legs (alternating perspective heel-lift, never sideways!)
    for (const [side, lift] of [
      [-1, leftLift],
      [1, rightLift],
    ] as const) {
      const lx = tx + side * 8.2 * u;
      ctx.fillStyle = '#0d0d14';
      roundRectPath(ctx, lx - 5.4 * u, hipY, 10.8 * u, 108 * u - lift, 4.5 * u);
      ctx.fill();
      // Rear heel of boot
      ctx.fillStyle = '#1f1614';
      roundRectPath(ctx, lx - 5.6 * u, groundY - 12 * u - lift, 11.2 * u, 12 * u, 3 * u);
      ctx.fill();
    }

    // Pure rear head & warm golden rim halo
    ctx.fillStyle = '#120e12';
    ctx.beginPath();
    ctx.ellipse(tx, shoulderY - 21 * u, 11.5 * u, 14 * u, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pure rear V-tapered coat & cashmere scarf
    ctx.fillStyle = '#13141f';
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.36)';
    ctx.lineWidth = Math.max(0.8, 1.2 * u);
    ctx.beginPath();
    ctx.moveTo(tx - 19 * u, shoulderY + 6 * u);
    ctx.quadraticCurveTo(tx, shoulderY - 2 * u, tx + 19 * u, shoulderY + 6 * u);
    ctx.lineTo(tx + 15 * u, hipY + 9 * u);
    ctx.lineTo(tx - 15 * u, hipY + 9 * u);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Scarf
    ctx.fillStyle = '#92400e';
    roundRectPath(ctx, tx - 11 * u, shoulderY - 3 * u, 22 * u, 7 * u, 3 * u);
    ctx.fill();

    // Left arm reaching down to Xiaohei's handle
    ctx.strokeStyle = '#171926';
    ctx.lineCap = 'round';
    ctx.lineWidth = 8.5 * u;
    ctx.beginPath();
    ctx.moveTo(tx - 17 * u, shoulderY + 9 * u);
    ctx.quadraticCurveTo(tx - 26 * u, shoulderY + 38 * u, rimowa.gripX, rimowa.gripY);
    ctx.stroke();

    // Right arm gentle counter-swing
    ctx.beginPath();
    ctx.moveTo(tx + 17 * u, shoulderY + 9 * u);
    ctx.lineTo(tx + 20 * u, hipY + 8 * u - rightLift * 0.4);
    ctx.stroke();

    ctx.restore();
  };

  // Paired concentric water ripples expanding on the mirror salt-flat around footsteps & wheels!
  for (let r = 0; r < 3; r++) {
    const phase = (timeSec * 0.65 + r * 0.33) % 1;
    ctx.save();
    ctx.strokeStyle = `rgba(254, 240, 138, ${((1 - phase) * 0.38).toFixed(3)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(tx - 16 * u, groundY + 2, (24 + phase * 68) * u, (3.5 + phase * 9) * u, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawPass(true);
  drawPass(false);
}

