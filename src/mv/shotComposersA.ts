import { TRAVEL_STICKERS } from './mvData';
import { clamp01 } from './mvTimeline';
import { renderMidgroundDiegeticLyrics } from './diegeticLyrics';
import {
  drawCoupledTravelerAndRimowa,
  drawFirstPersonPovHandOnHandle,
  drawLowTrackingBootsAndRimowa,
  drawTerraceShoulderCompanion,
} from './humanRimowaRig';
import {
  drawAnamorphicFlare,
  drawCinemaBokeh,
  drawDetailedXiaohei,
  drawDistantCitySkyline,
  drawPriorityCard,
  drawStarfieldAndClouds,
  drawTyndallGodRays,
  hash01,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * 01. guitar_macro: Luthier-grade cedarwood acoustic guitar soundboard, abalone rosette, inner label & vibrating strings
 */
export function renderGuitarMacroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat, bands } = sc;

  // 1. Rich sunburst cedar/mahogany soundboard with warm lacquer vignette
  const bg = ctx.createRadialGradient(w * 0.46, h * 0.54, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
  bg.addColorStop(0, '#4a2511');
  bg.addColorStop(0.42, '#2b1409');
  bg.addColorStop(0.78, '#130906');
  bg.addColorStop(1, '#070505');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Fine horizontal bookmatched cedar wood-grain fibers
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 208, 148, 0.045)';
  ctx.lineWidth = 1;
  for (let y = 8; y < h; y += 7) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.05) * 2);
    ctx.lineTo(w, y + Math.cos(y * 0.04) * 2);
    ctx.stroke();
  }
  // Diagonal nitrocellulose lacquer studio sheen
  const sheen = ctx.createLinearGradient(w * 0.15, 0, w * 0.65, h);
  sheen.addColorStop(0, 'rgba(255, 240, 200, 0.07)');
  sheen.addColorStop(0.45, 'rgba(255, 240, 200, 0)');
  sheen.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  const holeX = w * 0.44;
  const holeY = h * 0.56;
  const holeR = Math.min(w, h) * (0.21 + beat.kickPulse * 0.012);

  // Tortoiseshell teardrop pickguard below soundhole
  ctx.save();
  const guardGrad = ctx.createLinearGradient(holeX - holeR, holeY + holeR * 0.4, holeX + holeR, holeY + holeR * 1.6);
  guardGrad.addColorStop(0, '#2a0e07');
  guardGrad.addColorStop(0.5, '#591c0e');
  guardGrad.addColorStop(1, '#170704');
  ctx.fillStyle = guardGrad;
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(holeX - holeR * 0.35, holeY + holeR * 0.92);
  ctx.bezierCurveTo(
    holeX + holeR * 0.55,
    holeY + holeR * 0.85,
    holeX + holeR * 1.45,
    holeY + holeR * 1.35,
    holeX + holeR * 0.95,
    holeY + holeR * 1.82
  );
  ctx.bezierCurveTo(
    holeX + holeR * 0.35,
    holeY + holeR * 2.0,
    holeX - holeR * 0.45,
    holeY + holeR * 1.55,
    holeX - holeR * 0.35,
    holeY + holeR * 0.92
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 2. Deep Soundhole Cavity with Inner Spruce Bracing & Vintage Luthier Paper Label
  ctx.save();
  ctx.beginPath();
  ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
  ctx.fillStyle = '#070403';
  ctx.fill();
  ctx.clip();

  // Vintage cream luthier label glued inside guitar back
  ctx.fillStyle = 'rgba(245, 232, 204, 0.16)';
  roundRectPath(ctx, holeX - holeR * 0.56, holeY - holeR * 0.34, holeR * 1.12, holeR * 0.68, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)';
  ctx.lineWidth = 1;
  roundRectPath(ctx, holeX - holeR * 0.5, holeY - holeR * 0.28, holeR * 1.0, holeR * 0.56, 5);
  ctx.stroke();
  ctx.fillStyle = 'rgba(254, 243, 199, 0.32)';
  ctx.font = '700 11px "Outfit", "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Ham ·《嘿！小黑》', holeX, holeY - 4);
  ctx.font = '600 10px "Noto Sans SC", sans-serif';
  ctx.fillText('《To 我的好朋友》', holeX, holeY + 14);

  // Inner shadow bevel of soundboard rim
  ctx.strokeStyle = '#29150a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(holeX + 2, holeY + 3, holeR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Intricate Abalone / Mother-of-Pearl & Gold Mosaic Rosette
  for (let i = 1; i <= 5; i++) {
    ctx.strokeStyle =
      i === 3
        ? 'rgba(94, 234, 212, 0.42)'
        : i % 2 === 0
        ? 'rgba(245, 158, 11, 0.62)'
        : 'rgba(244, 244, 245, 0.24)';
    ctx.lineWidth = i === 3 ? 4.5 : i === 2 ? 2.5 : 1.2;
    if (i === 3) ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeR + i * 8.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 4. Sculpted East-Indian Rosewood Bridge + Compensated Bone Saddle on Right
  const bridgeX = w * 0.74;
  const bridgeH = holeR * 1.84;
  const bridgeGrad = ctx.createLinearGradient(bridgeX, holeY - bridgeH * 0.5, bridgeX + 52, holeY + bridgeH * 0.5);
  bridgeGrad.addColorStop(0, '#24140d');
  bridgeGrad.addColorStop(0.5, '#120906');
  bridgeGrad.addColorStop(1, '#080403');
  ctx.fillStyle = bridgeGrad;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.58)';
  ctx.lineWidth = 1.8;
  roundRectPath(ctx, bridgeX, holeY - bridgeH * 0.5, 48, bridgeH, 10);
  ctx.fill();
  ctx.stroke();

  // Slanted cream bone saddle bar
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bridgeX + 11, holeY - bridgeH * 0.37);
  ctx.lineTo(bridgeX + 14, holeY + bridgeH * 0.37);
  ctx.stroke();

  // 5. Six Phosphor-Bronze Wound & Plain Steel Strings with Harmonic Overtones
  for (let s = 0; s < 6; s++) {
    const sy = holeY - holeR * 0.62 + (s / 5) * holeR * 1.24;
    const pluckAmp =
      (timeSec > 3.1 ? 1 : 0.24) *
      (beat.kickPulse * 22 + beat.snarePulse * 16 + bands.mid * 15) *
      (s < 3 ? 1.18 : 0.78);

    // Subtle string shadow across soundboard
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 3.2 - s * 0.32;
    ctx.beginPath();
    ctx.moveTo(0, sy - 12);
    ctx.lineTo(bridgeX + 12, sy + 5);
    ctx.stroke();

    // Primary vibrating metallic string
    ctx.strokeStyle = s < 4 ? '#fbbf24' : '#f4f4f5';
    ctx.lineWidth = 3.5 - s * 0.38;
    ctx.beginPath();
    const endX = bridgeX + 12;
    ctx.moveTo(0, sy - 18);
    for (let x = 0; x <= endX; x += 24) {
      const t = x / endX;
      const env = Math.sin(t * Math.PI);
      const dy =
        Math.sin(x * 0.032 + timeSec * 34 + s * 1.2) * pluckAmp * env +
        Math.sin(x * 0.075 - timeSec * 52 + s) * pluckAmp * 0.25 * env;
      ctx.lineTo(x, sy - 18 * (1 - t) + dy);
    }
    ctx.stroke();

    // Slotted ivory bridge pin with abalone dot
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(bridgeX + 29, sy, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(bridgeX + 29, sy, 1.9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Warm tungsten studio god-rays & acoustic resonance halo
  drawTyndallGodRays(ctx, w * 0.08, -30, 5, Math.PI * 0.3, 0.42, w * 0.85, '251, 191, 36', 0.12);
  if (beat.kickPulse > 0.22) {
    drawAnamorphicFlare(ctx, bridgeX + 12, holeY, 260, 18, '#fbbf24', beat.kickPulse * 0.55);
  }
  drawCinemaBokeh(sc, 18, '#f59e0b', '#fef08a', 1.35);
}

/**
 * 02. traveler_wide: Makoto Shinkai Golden-Hour Bay Viaduct with City Skyline, Clouds, Suspender Cables & Reflections
 */
export function renderTravelerWideShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec, chapter, beat } = sc;
  const horizonY = h * 0.65;

  // 1. Multi-stop cosmos-indigo -> amethyst -> crimson -> molten amber sunset sky
  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#070b17');
  sky.addColorStop(0.32, '#1d1936');
  sky.addColorStop(0.62, '#5c2028');
  sky.addColorStop(0.86, '#be4b16');
  sky.addColorStop(1, '#fcd34d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Golden high-altitude jet contrail slicing the twilight sky
  ctx.save();
  const contrail = ctx.createLinearGradient(w * 0.18, h * 0.12, w * 0.52, h * 0.27);
  contrail.addColorStop(0, 'rgba(254, 240, 138, 0)');
  contrail.addColorStop(0.7, 'rgba(254, 215, 170, 0.35)');
  contrail.addColorStop(1, 'rgba(255, 251, 235, 0.85)');
  ctx.strokeStyle = contrail;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(w * 0.18, h * 0.12);
  ctx.lineTo(w * 0.52, h * 0.27);
  ctx.stroke();
  ctx.restore();

  // Twinkling twilight stars + sculpted backlit cumulonimbus clouds
  drawStarfieldAndClouds(sc, horizonY, {
    starCount: 38,
    cloudShadowHex: '#271a33',
    cloudMidHex: '#6b2928',
    cloudRimHex: '#fde047',
    driftSpeed: 12,
  });

  // 2. Blazing Sunset Sun + Crepuscular God-Rays + Panavision Anamorphic Flare
  const sunX = w * 0.73;
  const sunY = horizonY - h * 0.13;
  const sunR = Math.min(w, h) * 0.095;
  drawTyndallGodRays(ctx, sunX, sunY, 7, -Math.PI * 0.62, 0.9, w * 0.65, '253, 224, 71', 0.14);
  drawAnamorphicFlare(ctx, sunX, sunY, w * 0.48, sunR * 0.85, '#fbbf24', 0.88 + beat.kickPulse * 0.12);

  // 3. Layered Misty Mountains & Shimmering Distant Harbor Skyline
  ctx.fillStyle = '#1b162a';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  for (let x = 0; x <= w + 60; x += 60) {
    const wx = x + scrollDist * 0.09;
    const mh = (Math.sin(wx * 0.0035) * 0.42 + Math.cos(wx * 0.008) * 0.28 + 0.85) * h * 0.15;
    ctx.lineTo(x, horizonY - mh);
  }
  ctx.lineTo(w, horizonY);
  ctx.closePath();
  ctx.fill();

  drawDistantCitySkyline(sc, horizonY, {
    parallaxPx: scrollDist * 0.18,
    maxTowerHeight: h * 0.11,
    silhouetteHex: '#121220',
    secondarySilhouetteHex: '#1c182c',
    windowPrimaryHex: '#fde68a',
    windowSecondaryHex: '#fb923c',
  });

  // Midground Sky Monument Lyric (physically occluded by suspension bridge towers, cables & Traveler!)
  renderMidgroundDiegeticLyrics(sc, 'traveler_wide');

  // 4. Grand Suspension Bridge Towers, Catenary Main Cables & Vertical Suspender Hangers
  const spanW = 560;
  const bOff = (scrollDist * 0.38) % spanW;
  for (let tx = -bOff - spanW; tx < w + spanW; tx += spanW) {
    const towerTopY = horizonY - h * 0.38;
    // Steel H-Tower pylon with cross-bracing & red aviation beacon
    ctx.fillStyle = '#151624';
    ctx.fillRect(tx - 11, towerTopY, 22, h * 0.38);
    ctx.fillRect(tx - 18, towerTopY + h * 0.11, 36, 6);
    ctx.fillRect(tx - 18, towerTopY + h * 0.23, 36, 6);
    if (Math.floor(timeSec * 2) % 2 === 0) {
      drawAnamorphicFlare(ctx, tx, towerTopY - 2, 46, 4, '#ef4444', 0.65);
    }

    // Main catenary cable + vertical steel hanger cables
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.34)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(tx, towerTopY + 8);
    ctx.quadraticCurveTo(tx + spanW * 0.5, horizonY - h * 0.03, tx + spanW, towerTopY + 8);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
    ctx.lineWidth = 1;
    for (let s = 1; s < 14; s++) {
      const f = s / 14;
      const hx = tx + f * spanW;
      if (hx < -20 || hx > w + 20) continue;
      // Quadratic Bezier y at parameter f
      const oneMinus = 1 - f;
      const cableY =
        oneMinus * oneMinus * (towerTopY + 8) +
        2 * oneMinus * f * (horizonY - h * 0.03) +
        f * f * (towerTopY + 8);
      ctx.beginPath();
      ctx.moveTo(hx, cableY);
      ctx.lineTo(hx, horizonY);
      ctx.stroke();
    }
  }

  // Distant flock of silhouettes gliding across sunset
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.7)';
  ctx.lineWidth = 1.6;
  for (let b = 0; b < 6; b++) {
    const bx = ((w * 0.2 + b * 32 + timeSec * 26) % (w * 0.82)) + w * 0.08;
    const by = h * 0.25 + Math.sin(b * 1.9 + timeSec * 4) * 9;
    const wing = Math.sin(timeSec * 9 + b) * 5;
    ctx.beginPath();
    ctx.moveTo(bx - 7, by + wing);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + 7, by + wing);
    ctx.stroke();
  }

  // 5. Rain-Kissed Viaduct Asphalt Deck, Streetlamps & Golden Reflections
  const deckGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  deckGrad.addColorStop(0, '#171624');
  deckGrad.addColorStop(0.4, '#0f101a');
  deckGrad.addColorStop(1, '#07080d');
  ctx.fillStyle = deckGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Sunset reflection sheen across wet asphalt
  const roadGlow = ctx.createRadialGradient(sunX, horizonY + 12, 10, sunX, horizonY + 40, w * 0.42);
  roadGlow.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
  roadGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = roadGlow;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Warm viaduct streetlamps passing in midground
  const lampSpan = 340;
  const lOff = (scrollDist * 0.72) % lampSpan;
  for (let lx = -lOff; lx < w + lampSpan; lx += lampSpan) {
    const poleTop = horizonY - h * 0.19;
    ctx.strokeStyle = '#232436';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(lx, horizonY + 4);
    ctx.lineTo(lx, poleTop);
    ctx.quadraticCurveTo(lx, poleTop - 12, lx + 18, poleTop - 12);
    ctx.stroke();
    drawAnamorphicFlare(ctx, lx + 20, poleTop - 11, 95, 7, '#fde68a', 0.62);
  }

  ctx.fillStyle = chapter.accentHex;
  ctx.fillRect(0, horizonY, w, 2);

  // Dashed highway lane markings in perspective
  const dashStep = 96;
  const dashOff = (scrollDist * 1.05) % dashStep;
  ctx.fillStyle = 'rgba(253, 224, 71, 0.26)';
  for (let dx = -dashOff; dx < w + dashStep; dx += dashStep) {
    ctx.fillRect(dx, horizonY + (h - horizonY) * 0.22, 42, 2.5);
  }

  // 6. Handsome Scarf-Draped Traveler & 20" RIMOWA Cabin with subtle wet-deck reflection!
  const walkY = horizonY + (h - horizonY) * 0.38;
  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.55,
    groundY: walkY,
    travelerHeightPx: h * 0.42,
    walkPhase: timeSec * 5.6,
    pose: 'tow_stride',
    rimColor: '#fde047',
    mirrorReflectionAlpha: 0.18,
  });

  // Foreground bridge railing posts rushing past (cinematic depth parallax)
  const railSpan = 250;
  const rOff = (scrollDist * 1.48) % railSpan;
  ctx.fillStyle = 'rgba(7, 7, 11, 0.76)';
  ctx.fillRect(0, h * 0.85, w, 7);
  for (let rx = -rOff; rx < w + railSpan; rx += railSpan) {
    ctx.fillRect(rx, h * 0.8, 11, h * 0.2);
  }
  drawCinemaBokeh(sc, 12, '#fbbf24', '#fb923c', 0.9);
}

/**
 * 03. boots_wheels_low: Twilight City Boulevard Low-Angle Tracking with Glowing Cafes, Wet Reflections & Ginkgo Leaves
 */
export function renderBootsWheelsLowShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec, chapter } = sc;
  const roadTop = h * 0.51;
  const isVerse2 = chapter.id === 'verse2';

  // 1. Rich twilight boulevard backdrop (no empty blank gradient!)
  const sky = ctx.createLinearGradient(0, 0, 0, roadTop);
  sky.addColorStop(0, '#060811');
  sky.addColorStop(0.55, isVerse2 ? '#0c1f38' : '#1f1421');
  sky.addColorStop(1, isVerse2 ? '#163859' : '#4a2414');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, roadTop);

  // Blurred distant boulevard buildings, glowing warm storefront windows & streetlamps
  drawDistantCitySkyline(sc, roadTop, {
    parallaxPx: scrollDist * 0.35,
    maxTowerHeight: h * 0.36,
    silhouetteHex: '#0d101a',
    secondarySilhouetteHex: '#131726',
    windowPrimaryHex: '#fde68a',
    windowSecondaryHex: isVerse2 ? '#38bdf8' : '#fb923c',
  });

  // Passing blurred café awnings, warm shopfronts & car taillight bokeh ribbons along curb
  const shopSpan = 310;
  const sOff = (scrollDist * 0.68) % shopSpan;
  for (let sx = -sOff - shopSpan; sx < w + shopSpan; sx += shopSpan) {
    const winW = 135;
    const winH = 68;
    const winY = roadTop - winH - 14;
    const shopGlow = ctx.createLinearGradient(sx, winY, sx, roadTop);
    shopGlow.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
    shopGlow.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
    ctx.fillStyle = shopGlow;
    roundRectPath(ctx, sx, winY, winW, winH, 6);
    ctx.fill();
    drawAnamorphicFlare(ctx, sx + winW * 0.5, winY + 12, 130, 9, '#fbbf24', 0.48);
  }

  // 2. Rain-slicked dark asphalt road + architectural granite curbstone
  const road = ctx.createLinearGradient(0, roadTop, 0, h);
  road.addColorStop(0, '#161925');
  road.addColorStop(0.45, '#0e1018');
  road.addColorStop(1, '#06070b');
  ctx.fillStyle = road;
  ctx.fillRect(0, roadTop, w, h - roadTop);

  // Curbstone bevel
  ctx.fillStyle = '#232738';
  ctx.fillRect(0, roadTop - 5, w, 6);
  ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
  ctx.fillRect(0, roadTop - 5, w, 1.5);

  // Shimmering wet-asphalt vertical streetlamp reflections
  for (let sx = -sOff; sx < w + shopSpan; sx += shopSpan) {
    const refGrad = ctx.createLinearGradient(0, roadTop, 0, h);
    refGrad.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
    refGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = refGrad;
    ctx.fillRect(sx + 40, roadTop + 2, 54, h - roadTop);
  }

  // 3. Glowing Golden Odometer / Ruler Scale etched along the boulevard ("丈量从前")
  const rulerY = roadTop + (h - roadTop) * 0.23;
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.78;
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

  // 4. Physically coupled full-body Traveler + tilted 20" RIMOWA Cabin & Multiwheels
  drawLowTrackingBootsAndRimowa(sc, rulerY);

  // 5. Crisp OpenFilm-style atmospheric wind/speed hairlines in the wake of the wheels
  ctx.save();
  ctx.strokeStyle = 'rgba(244, 239, 230, 0.14)';
  ctx.lineWidth = 1.0;
  for (let lf = 0; lf < 8; lf++) {
    const lx = w - (((scrollDist * (1.1 + (lf % 3) * 0.28) + lf * 210) % (w + 180)) - 90);
    const ly = roadTop + 26 + ((lf * 37) % Math.max(40, Math.round((h - roadTop) * 0.58)));
    const len = 18 + (lf % 4) * 14;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx - len, ly);
    ctx.stroke();
  }
  ctx.restore();
  drawCinemaBokeh(sc, 14, chapter.accentHex, '#fde68a', 1.1);
}

/**
 * 04. scuffed_shell_closeup: Chiaroscuro Luxury Studio Macro of Anodized Matte-Black RIMOWA Grooves, Riveted Armor & TSA 007 Lock
 */
export function renderScuffedShellCloseup(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  const bg = ctx.createRadialGradient(w * 0.5, h * 0.48, 40, w * 0.5, h * 0.5, w * 0.72);
  bg.addColorStop(0, '#1c1a24');
  bg.addColorStop(0.6, '#0b0b10');
  bg.addColorStop(1, '#050507');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawTyndallGodRays(ctx, w * 0.5, -60, 6, Math.PI * 0.5, 0.65, h * 1.1, '251, 191, 36', 0.1);

  ctx.save();
  ctx.translate(w * 0.5, h * 0.55);
  ctx.rotate(-0.09);

  const plateW = w * 0.8;
  const plateH = h * 0.52;
  const grad = ctx.createLinearGradient(-plateW * 0.5, -plateH * 0.5, plateW * 0.5, plateH * 0.5);
  grad.addColorStop(0, '#353542');
  grad.addColorStop(0.32, '#1a1a22');
  grad.addColorStop(0.65, '#24242f');
  grad.addColorStop(1, '#0a0a0e');
  ctx.fillStyle = grad;
  ctx.strokeStyle = 'rgba(228, 228, 231, 0.45)';
  ctx.lineWidth = 2.5;
  roundRectPath(ctx, -plateW * 0.5, -plateH * 0.5, plateW, plateH, 36);
  ctx.fill();
  ctx.stroke();

  // 3D Sculpted Parallel Anodized Aluminum RIMOWA Grooves
  for (let i = -4; i <= 4; i++) {
    const rx = i * (plateW / 10);
    const ribGrad = ctx.createLinearGradient(rx - 18, 0, rx + 18, 0);
    ribGrad.addColorStop(0, 'rgba(0,0,0,0.65)');
    ribGrad.addColorStop(0.5, 'rgba(255,255,255,0.09)');
    ribGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = ribGrad;
    roundRectPath(ctx, rx - 16, -plateH * 0.43, 32, plateH * 0.86, 12);
    ctx.fill();
  }

  // Heavy Brushed-Aluminum Corner Bumpers with Hex Rivets on Upper Left & Right
  for (const sign of [-1, 1]) {
    const cx = sign === -1 ? -plateW * 0.5 : plateW * 0.5 - 118;
    const cy = -plateH * 0.5;
    const capGrad = ctx.createLinearGradient(cx, cy, cx + 118, cy + 96);
    capGrad.addColorStop(0, '#71717a');
    capGrad.addColorStop(0.5, '#3f3f46');
    capGrad.addColorStop(1, '#27272a');
    ctx.fillStyle = capGrad;
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 1.6;
    roundRectPath(ctx, cx, cy, 118, 96, 30);
    ctx.fill();
    ctx.stroke();

    for (const [ox, oy] of [
      [28, 26],
      [86, 26],
      [28, 68],
      [86, 68],
    ]) {
      ctx.fillStyle = '#e4e4e7';
      ctx.beginPath();
      ctx.arc(cx + ox, cy + oy, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.arc(cx + ox, cy + oy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Partially weathered vintage airline routing sticker remnant on lower-left shell
  ctx.save();
  ctx.translate(-plateW * 0.26, plateH * 0.22);
  ctx.rotate(0.08);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.82)';
  roundRectPath(ctx, -64, -22, 128, 44, 5);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.font = '800 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PEK → CDG · 20"', -52, 4);
  ctx.restore();

  // Sweeping golden grazing light beam revealing silver-aluminum patina scratches ("旧勋章的痕 / 褪去的颜")
  const sweepX = ((timeSec * 0.26) % 1.4 - 0.7) * plateW;
  const lightGrad = ctx.createLinearGradient(sweepX - 180, 0, sweepX + 180, 0);
  lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
  lightGrad.addColorStop(0.5, `rgba(253, 224, 71, ${(0.24 + beat.kickPulse * 0.18).toFixed(3)})`);
  lightGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = lightGrad;
  roundRectPath(ctx, -plateW * 0.5, -plateH * 0.5, plateW, plateH, 36);
  ctx.fill();

  const scratches = [
    [-240, -76, -105, -36],
    [-48, 28, 132, -16],
    [88, 84, 248, 50],
    [-195, 72, -55, 102],
    [28, -94, 190, -60],
    [-120, -12, -25, 14],
  ];
  ctx.strokeStyle = 'rgba(254, 249, 195, 0.68)';
  ctx.lineCap = 'round';
  ctx.lineWidth = 2;
  for (const [x1, y1, x2, y2] of scratches) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Detailed Flush TSA 007 Combination Lock Housing + 3 Number Wheels on Upper Valence
  ctx.fillStyle = '#111115';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2.2;
  roundRectPath(ctx, -128, -plateH * 0.5 - 16, 256, 44, 10);
  ctx.fill();
  ctx.stroke();

  // Red TSA Diamond emblem
  ctx.save();
  ctx.translate(-92, -plateH * 0.5 + 6);
  ctx.rotate(Math.PI * 0.25);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  // 3 metallic combination dials ("0 · 9 · 6")
  const digits = ['2', '0', '6'];
  for (let d = 0; d < 3; d++) {
    const dx = -38 + d * 34;
    const dy = -plateH * 0.5 - 5;
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    roundRectPath(ctx, dx - 11, dy, 22, 22, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(digits[d], dx, dy + 15);
  }

  // Brushed chrome latch button on right of TSA housing
  ctx.fillStyle = '#52525b';
  roundRectPath(ctx, 64, -plateH * 0.5 - 6, 46, 24, 5);
  ctx.fill();

  drawAnamorphicFlare(ctx, sweepX * 0.4, -plateH * 0.5 + 4, 240, 14, '#fde047', 0.58);
  ctx.restore();
  drawCinemaBokeh(sc, 14, '#fbbf24', '#a1a1aa', 0.95);
}

/**
 * 05. priority_tags_macro: Layered Airline PRIORITY Baggage Tags, Braided Cords & Passport Postmarks over Grooved RIMOWA Shell
 */
export function renderPriorityTagsMacro(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  // Matte-black grooved RIMOWA shell surface filling macro background
  const shellBg = ctx.createLinearGradient(0, 0, w, h);
  shellBg.addColorStop(0, '#1e1e26');
  shellBg.addColorStop(0.5, '#111116');
  shellBg.addColorStop(1, '#08080b');
  ctx.fillStyle = shellBg;
  ctx.fillRect(0, 0, w, h);

  for (let x = 48; x < w; x += 88) {
    ctx.strokeStyle = 'rgba(0,0,0,0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 2, 0);
    ctx.lineTo(x - 2, h);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, 0);
    ctx.lineTo(x + 2, h);
    ctx.stroke();
  }

  // Vintage circular & rectangular customs postmarks faintly stamped in background aura
  const stamps = [
    { x: w * 0.18, y: h * 0.25, city: 'TOKYO · HANEDA', date: '14 OCT' },
    { x: w * 0.82, y: h * 0.24, city: 'PARIS · CDG', date: '03 MAY' },
    { x: w * 0.2, y: h * 0.78, city: 'REYKJAVIK · KEF', date: '21 DEC' },
    { x: w * 0.81, y: h * 0.77, city: 'SHANGHAI · SHA', date: '09 SEP' },
  ];
  for (const st of stamps) {
    ctx.save();
    ctx.translate(st.x, st.y);
    ctx.rotate(-0.18);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.24)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 47, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(st.city, 0, -6);
    ctx.fillText(st.date, 0, 12);
    ctx.restore();
  }

  // Top chrome handle lug anchor + braided crimson/gold luggage tag cords
  const anchorX = w * 0.5;
  const anchorY = h * 0.14;
  ctx.fillStyle = '#3f3f46';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, anchorX - 64, anchorY - 18, 128, 34, 12);
  ctx.fill();
  ctx.stroke();

  const cardPositions = [
    { rx: 0.28, ry: 0.38, rot: -0.22 },
    { rx: 0.72, ry: 0.37, rot: 0.18 },
    { rx: 0.31, ry: 0.65, rot: 0.12 },
    { rx: 0.69, ry: 0.66, rot: -0.15 },
    { rx: 0.5, ry: 0.51, rot: -0.05 },
  ];

  // Draw braided tag strings connecting from handle anchor to each tag's left eyelet
  for (let idx = 0; idx < cardPositions.length; idx++) {
    const pos = cardPositions[idx];
    const endX = idx === 4 ? w * 0.5 - 280 : w * pos.rx - 108;
    const endY = idx === 4 ? h * 0.52 : h * pos.ry;
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(245, 158, 11, 0.55)' : 'rgba(251, 113, 133, 0.5)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY + 12);
    ctx.quadraticCurveTo(w * 0.5, endY - 45, endX, endY);
    ctx.stroke();
  }

  // Draw the 4 surrounding satellite tags; center slot (idx === 4) is owned by the live diegetic PRIORITY lyric tag
  cardPositions.forEach((pos, idx) => {
    if (idx === 4) return;
    const spec = TRAVEL_STICKERS[idx % TRAVEL_STICKERS.length];
    const flutter = Math.sin(timeSec * 3.2 + idx) * 0.025;
    drawPriorityCard(
      ctx,
      w * pos.rx,
      h * pos.ry,
      276,
      110,
      pos.rot + flutter,
      spec.code,
      spec.label,
      spec.year,
      spec.bg,
      spec.fg
    );
  });

  // Warm golden spotlight & optical bokeh
  drawAnamorphicFlare(ctx, w * 0.5, h * 0.51, 320, 22, chapter.accentHex, 0.28 + beat.kickPulse * 0.25);
  drawCinemaBokeh(sc, 16, '#fbbf24', '#fb7185', 1.15);
}

/**
 * 06. open_suitcase: Warm Walnut Parquet Flat-Lay of Unzipped RIMOWA Filled with Curated Life Artifacts & Memories
 */
export function renderOpenSuitcaseShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  // 1. Warm herringbone walnut floor & subtle woven cream rug border
  const floorGrad = ctx.createRadialGradient(w * 0.5, h * 0.54, 60, w * 0.5, h * 0.54, w * 0.72);
  floorGrad.addColorStop(0, '#2b1b12');
  floorGrad.addColorStop(0.65, '#170f0a');
  floorGrad.addColorStop(1, '#090706');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.06)';
  ctx.lineWidth = 1.2;
  for (let x = 0; x < w; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  const halfW = Math.min(w * 0.37, 376);
  const boxH = Math.min(h * 0.58, 446);
  const cy = h * 0.55;
  const gap = 18;

  // Soft suitcase drop-shadow onto walnut floor
  ctx.fillStyle = 'rgba(0,0,0,0.58)';
  roundRectPath(ctx, w * 0.5 - gap - halfW - 8, cy - boxH * 0.5 + 14, (halfW + gap) * 2 + 16, boxH, 28);
  ctx.fill();

  // Brushed aluminum center spine hinge + dual chrome hinge blocks
  ctx.fillStyle = '#3f3f46';
  roundRectPath(ctx, w * 0.5 - 11, cy - boxH * 0.46, 22, boxH * 0.92, 6);
  ctx.fill();
  for (const hy of [cy - boxH * 0.28, cy + boxH * 0.24]) {
    ctx.fillStyle = '#a1a1aa';
    roundRectPath(ctx, w * 0.5 - 14, hy - 14, 28, 28, 4);
    ctx.fill();
  }

  // --- LEFT SHELL HALF: RIMOWA Flex-Divider Mesh, Letters, Vinyl 7" & Boarding Passes ---
  const leftX = w * 0.5 - gap - halfW;
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 3.2;
  roundRectPath(ctx, leftX, cy - boxH * 0.5, halfW, boxH, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#23202b';
  roundRectPath(ctx, leftX + 14, cy - boxH * 0.5 + 14, halfW - 28, boxH - 28, 18);
  ctx.fill();

  // Vintage 7-inch vinyl record peeking inside left pocket
  const vx = leftX + halfW * 0.68;
  const vy = cy - boxH * 0.22;
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(vx, vy, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(vx, vy, 18, 0, Math.PI * 2);
  ctx.fill();

  // Upper-left compartment slot is owned by the live wax-sealed archival lyric letter in diegeticLyrics.ts

  drawPriorityCard(
    ctx,
    leftX + halfW * 0.48,
    cy + boxH * 0.04,
    halfW * 0.7,
    72,
    -0.06,
    'BOARDING',
    '半生旅途车票与信笺',
    '2018-26',
    '#fef3c7',
    '#18181b'
  );
  drawPriorityCard(
    ctx,
    leftX + halfW * 0.54,
    cy + boxH * 0.28,
    halfW * 0.66,
    68,
    0.07,
    'MEMORIES',
    '未寄出的明信片',
    'OLD DAYS',
    '#f59e0b',
    '#09090b'
  );

  // Translucent RIMOWA Flex-Divider mesh & perimeter frame
  ctx.strokeStyle = 'rgba(255,255,255,0.11)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let d = 26; d < halfW - 26; d += 22) {
    ctx.moveTo(leftX + d, cy - boxH * 0.5 + 22);
    ctx.lineTo(leftX + d, cy + boxH * 0.5 - 22);
  }
  for (let y = -boxH * 0.5 + 30; y < boxH * 0.5 - 24; y += 22) {
    ctx.moveTo(leftX + 22, cy + y);
    ctx.lineTo(leftX + halfW - 22, cy + y);
  }
  ctx.stroke();

  // --- RIGHT SHELL HALF: Folded Knitwear, Classic Leica Rangefinder Camera, Journal, Compass & Straps ---
  const rightX = w * 0.5 + gap;
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 3.2;
  roundRectPath(ctx, rightX, cy - boxH * 0.5, halfW, boxH, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#23202b';
  roundRectPath(ctx, rightX + 14, cy - boxH * 0.5 + 14, halfW - 28, boxH - 28, 18);
  ctx.fill();

  // Folded warm oatmeal & terracotta knitwear stacks with rib texture
  ctx.fillStyle = '#573d2b';
  roundRectPath(ctx, rightX + 28, cy - boxH * 0.42, halfW * 0.54, boxH * 0.34, 12);
  ctx.fill();
  ctx.fillStyle = '#2b394a';
  roundRectPath(ctx, rightX + 34 + halfW * 0.52, cy - boxH * 0.42, halfW * 0.32, boxH * 0.34, 12);
  ctx.fill();

  // Classic Silver-Top Rangefinder Film Camera with Multi-Coated Lens Reflection
  const camX = rightX + halfW * 0.36;
  const camY = cy + boxH * 0.16;
  ctx.fillStyle = '#141418';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, camX - 52, camY - 32, 104, 64, 9);
  ctx.fill();
  ctx.stroke();
  // Brushed silver top plate & viewfinder windows
  ctx.fillStyle = '#d4d4d8';
  roundRectPath(ctx, camX - 51, camY - 31, 102, 18, 7);
  ctx.fill();
  ctx.fillStyle = '#18181b';
  ctx.fillRect(camX - 36, camY - 26, 16, 8);
  ctx.fillRect(camX + 18, camY - 26, 12, 8);
  // Multi-coated optical lens barrel
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(camX + 4, camY + 6, 22 + beat.kickPulse * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  const lensCoat = ctx.createRadialGradient(camX, camY + 2, 2, camX + 4, camY + 6, 18);
  lensCoat.addColorStop(0, 'rgba(52, 211, 153, 0.65)');
  lensCoat.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
  lensCoat.addColorStop(1, '#09090b');
  ctx.fillStyle = lensCoat;
  ctx.beginPath();
  ctx.arc(camX + 4, camY + 6, 15, 0, Math.PI * 2);
  ctx.fill();

  // Stitched Cognac Travel Journal + Brass Compass on right
  ctx.fillStyle = '#7c2d12';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.4;
  roundRectPath(ctx, rightX + halfW * 0.63, cy + boxH * 0.02, 78, 106, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(rightX + halfW * 0.63 + 54, cy + boxH * 0.02, 6, 106);

  // Brass compass beside camera
  ctx.fillStyle = '#d97706';
  ctx.strokeStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(rightX + halfW * 0.34, cy + boxH * 0.37, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Elastic X-Compression Straps + Brushed Buckle
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
  roundRectPath(ctx, rightX + halfW * 0.5 - 22, cy - 15, 44, 30, 6);
  ctx.fill();
  ctx.stroke();

  // Warm afternoon sunbeams & rising golden memory dust motes
  drawTyndallGodRays(ctx, w * 0.2, -40, 5, Math.PI * 0.38, 0.45, h * 1.15, '253, 224, 71', 0.12);
  drawCinemaBokeh(sc, 20, '#fbbf24', '#fb7185', 1.45 + Math.sin(timeSec * 2) * 0.2);
}

/**
 * 07. crossroads_pov: Wong Kar-Wai Rainy Dusk Expressway POV with Skyscraper Canyons, Wet Neon Reflections & First-Person Hand
 */
export function renderCrossroadsPovShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, timeSec, chapter, beat } = sc;
  const vx = w * 0.5;
  const vy = h * 0.48;

  // 1. Moody twilight storm-violet sky + misty skyscraper canyons flanking the highway
  const sky = ctx.createLinearGradient(0, 0, 0, vy);
  sky.addColorStop(0, '#05070f');
  sky.addColorStop(0.55, '#16162b');
  sky.addColorStop(1, '#2f243a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, vy);

  drawStarfieldAndClouds(sc, vy, {
    starCount: 24,
    cloudShadowHex: '#121324',
    cloudMidHex: '#25213b',
    cloudRimHex: '#f59e0b',
    driftSpeed: 16,
  });

  drawDistantCitySkyline(sc, vy, {
    parallaxPx: 0,
    maxTowerHeight: h * 0.26,
    silhouetteHex: '#0c0e18',
    secondarySilhouetteHex: '#151828',
    windowPrimaryHex: '#fde68a',
    windowSecondaryHex: '#38bdf8',
  });

  // 2. Rain-drenched mirror expressway asphalt
  const roadGrad = ctx.createLinearGradient(0, vy, 0, h);
  roadGrad.addColorStop(0, '#181928');
  roadGrad.addColorStop(0.45, '#0d0f18');
  roadGrad.addColorStop(1, '#06070c');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, vy, w, h - vy);

  // Shimmering emerald & amber wet-asphalt reflection pools
  const wetGlow = ctx.createRadialGradient(vx, vy + 40, 10, vx, vy + 140, w * 0.45);
  wetGlow.addColorStop(0, 'rgba(52, 211, 153, 0.18)');
  wetGlow.addColorStop(0.55, 'rgba(245, 158, 11, 0.12)');
  wetGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = wetGlow;
  ctx.fillRect(0, vy, w, h - vy);

  // Converging multi-lane highway markings + ruby/amber tail-light streaks rushing toward horizon
  ctx.strokeStyle = chapter.accentHex;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 2.4;
  for (const laneAngle of [-0.68, -0.24, 0.24, 0.68]) {
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + laneAngle * w, h);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  for (let tl = 0; tl < 10; tl++) {
    const p = ((tl / 10 + (scrollDist * 0.0024) % 1) % 1);
    const side = tl % 2 === 0 ? -1 : 1;
    const lx = vx + side * (18 + p * p * w * 0.42);
    const ly = vy + p * p * (h - vy) * 0.85;
    drawAnamorphicFlare(
      ctx,
      lx,
      ly,
      40 + p * 90,
      4 + p * 8,
      side < 0 ? '#fb7185' : '#fbbf24',
      0.35 + p * 0.45
    );
  }

  // 3. Zooming Overhead Highway Directional Portals (non-competing route chevrons; Hero gantry carries the live lyric)
  const labels = ['↖  ↑  ↗', '↑  ROUTE 20  ↗', '↖  EXPRESS  ↑', '↖  ↑  ↗'];
  for (let i = 0; i < 4; i++) {
    const prog = ((i / 4 + (scrollDist * 0.0016) % 1) % 1);
    const p = prog * prog;
    if (p < 0.04 || p > 0.62) continue;
    const gw = w * (0.16 + p * 1.05);
    const gy = vy - h * (0.06 + p * 0.38);
    const alpha = clamp01(prog * 1.3) * 0.56;

    ctx.strokeStyle = `rgba(161, 161, 170, ${(alpha * 0.48).toFixed(3)})`;
    ctx.lineWidth = 1.6 + p * 4;
    ctx.beginPath();
    ctx.moveTo(vx - gw * 0.5, vy + p * (h - vy));
    ctx.lineTo(vx - gw * 0.5, gy);
    ctx.lineTo(vx + gw * 0.5, gy);
    ctx.lineTo(vx + gw * 0.5, vy + p * (h - vy));
    ctx.stroke();

    const signW = gw * 0.42;
    const signH = Math.max(16, 44 * p);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#063d2f';
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.65)';
    ctx.lineWidth = 1.4;
    roundRectPath(ctx, vx - signW * 0.5, gy - signH * 0.2, signW, signH, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(236, 253, 245, 0.85)';
    ctx.font = `700 ${Math.max(8, Math.round(14 * p))}px "JetBrains Mono", "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i % labels.length], vx, gy + signH * 0.3);
    ctx.restore();
  }

  // Fine misty rain streaks converging from vanishing point
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.2)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let r = 0; r < 42; r++) {
    const rx = hash01(r * 7.1) * w;
    const ry = ((hash01(r * 13.3) * h + timeSec * 680) % h);
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 8, ry + 26);
  }
  ctx.stroke();

  // 4. First-Person Foreground: Sculptural Chiaroscuro Dorsal Hand & RIMOWA T-Bar
  const fgY = h * 0.79 - beat.kickPulse * 5;
  drawFirstPersonPovHandOnHandle(sc, vx, fgY);
}

/**
 * 08. chorus_hero_low: Monumental Low-Angle Rooftop Overpass Climax with Parted Storm-Gold Clouds, Solar Corona & Panorama
 */
export function renderChorusHeroLowShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;
  const ledgeY = h * 0.71;
  const isChorus2 = chapter.id === 'chorus2';

  // 1. Dramatic blazing sky
  const sky = ctx.createLinearGradient(0, 0, 0, ledgeY);
  sky.addColorStop(0, '#090710');
  sky.addColorStop(0.38, isChorus2 ? '#0e294b' : '#4c1d24');
  sky.addColorStop(0.75, isChorus2 ? '#b45309' : '#c2410c');
  sky.addColorStop(1, '#fef08a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, ledgeY);

  // Giant Blazing Solar Corona + Volumetric God-Rays + Anamorphic Flare
  const sunR = Math.min(w, h) * (0.24 + beat.kickPulse * 0.035);
  const sunX = w * 0.5;
  const sunY = ledgeY - sunR * 0.42;

  drawTyndallGodRays(ctx, sunX, sunY, 9, -Math.PI * 0.5, 1.35, Math.max(w, h) * 0.85, '254, 240, 138', 0.18);

  const sunHalo = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 1.65);
  sunHalo.addColorStop(0, '#ffffff');
  sunHalo.addColorStop(0.45, 'rgba(254, 240, 138, 0.95)');
  sunHalo.addColorStop(0.78, 'rgba(245, 158, 11, 0.38)');
  sunHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = sunHalo;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 1.65, 0, Math.PI * 2);
  ctx.fill();

  drawStarfieldAndClouds(sc, ledgeY, {
    starCount: 26,
    cloudShadowHex: isChorus2 ? '#10223b' : '#2e1521',
    cloudMidHex: '#7c2d12',
    cloudRimHex: '#fef08a',
    driftSpeed: 18,
  });

  drawDistantCitySkyline(sc, ledgeY + 6, {
    parallaxPx: timeSec * 14,
    maxTowerHeight: h * 0.12,
    silhouetteHex: '#130e14',
    secondarySilhouetteHex: '#24171d',
    windowPrimaryHex: '#fef08a',
    windowSecondaryHex: '#fb923c',
  });

  drawAnamorphicFlare(ctx, sunX, sunY, w * 0.72, sunR * 0.55, '#fde047', 0.92);

  // Midground 3D-Extruded Sun-Corona Block Lyric (physically behind overpass guardrail & heroic Traveler!)
  renderMidgroundDiegeticLyrics(sc, 'chorus_hero_low');

  // 2. Architectural Slanted Concrete Overpass Parapet & Guardrail
  const parapetGrad = ctx.createLinearGradient(0, ledgeY - 24, 0, h);
  parapetGrad.addColorStop(0, '#181620');
  parapetGrad.addColorStop(0.3, '#0d0c12');
  parapetGrad.addColorStop(1, '#060609');
  ctx.fillStyle = parapetGrad;
  ctx.beginPath();
  ctx.moveTo(0, ledgeY + 26);
  ctx.lineTo(w, ledgeY - 22);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Steel safety handrail running parallel behind protagonist
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.38)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, ledgeY - 22);
  ctx.lineTo(w, ledgeY - 70);
  ctx.stroke();
  for (let gx = 60; gx < w; gx += 110) {
    const t = gx / w;
    const base = ledgeY + 26 * (1 - t) - 22 * t;
    ctx.beginPath();
    ctx.moveTo(gx, base);
    ctx.lineTo(gx, base - 48);
    ctx.stroke();
  }

  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, ledgeY + 26);
  ctx.lineTo(w, ledgeY - 22);
  ctx.stroke();

  // 3. Heroic Traveler standing tall with palm resting directly on upright 20" RIMOWA Cabin!
  drawCoupledTravelerAndRimowa(sc, {
    travelerX: w * 0.53,
    groundY: ledgeY + 2,
    travelerHeightPx: h * 0.46,
    walkPhase: timeSec * 7.2,
    pose: 'hero_beside',
    rimColor: '#fef08a',
    warmHandleGlow: true,
    mirrorReflectionAlpha: 0.15,
  });

  drawCinemaBokeh(sc, 18, '#fef08a', '#fb923c', 1.3);
}

/**
 * 09. split_triptych: High-Fashion 3-Panel Diagonal Cinema Montage ("替我装 · 替我扛 · 破风闯")
 */
export function renderSplitTriptychShot(sc: ShotContext): void {
  const { ctx, w, h, wheelAngle, timeSec, chapter, beat } = sc;

  ctx.fillStyle = '#070709';
  ctx.fillRect(0, 0, w, h);

  const slant = w * 0.045;
  const x1 = w * 0.34;
  const x2 = w * 0.67;
  const activePanel = beat.beatInBar % 3;

  // --- PANEL 1 (LEFT): "替我装" (Open RIMOWA Compartment + Packed Memories & Straps) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x1 + slant, 0);
  ctx.lineTo(x1 - slant, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.clip();

  const p1Bg = ctx.createRadialGradient(x1 * 0.48, h * 0.48, 20, x1 * 0.48, h * 0.48, h * 0.6);
  p1Bg.addColorStop(0, activePanel === 0 ? '#2e1f12' : '#1b1614');
  p1Bg.addColorStop(1, '#09080b');
  ctx.fillStyle = p1Bg;
  ctx.fillRect(0, 0, x1 + slant, h);

  const cinch = 1 - beat.kickPulse * 0.045;
  ctx.save();
  ctx.translate(x1 * 0.48, h * 0.48);
  ctx.scale(cinch, cinch);
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2.5;
  roundRectPath(ctx, -114, -156, 228, 312, 24);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#23212b';
  roundRectPath(ctx, -100, -142, 200, 284, 16);
  ctx.fill();

  ctx.fillStyle = '#4a3525';
  roundRectPath(ctx, -86, -126, 172, 110, 10);
  ctx.fill();
  ctx.fillStyle = '#2b3548';
  roundRectPath(ctx, -86, -4, 104, 128, 10);
  ctx.fill();
  drawPriorityCard(ctx, 36, 54, 94, 56, -0.14, 'PRIO', '旧梦与行囊', '2026', '#f59e0b', '#09090b');

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 7.5;
  ctx.beginPath();
  ctx.moveTo(-90, -128);
  ctx.lineTo(90, 128);
  ctx.moveTo(90, -128);
  ctx.lineTo(-90, 128);
  ctx.stroke();
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2;
  roundRectPath(ctx, -26, -17, 52, 34, 6);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.restore();

  // --- PANEL 2 (CENTER): "替我扛" (Xiaohei Standing Unbowed Under Driving Storm & Golden Bastion Halo) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1 + slant + 8, 0);
  ctx.lineTo(x2 + slant, 0);
  ctx.lineTo(x2 - slant, h);
  ctx.lineTo(x1 - slant + 8, h);
  ctx.closePath();
  ctx.clip();

  const midX = (x1 + x2) * 0.5;
  const p2Bg = ctx.createLinearGradient(0, 0, 0, h);
  p2Bg.addColorStop(0, activePanel === 1 ? '#1e2438' : '#101420');
  p2Bg.addColorStop(0.7, activePanel === 1 ? '#2e1610' : '#181218');
  p2Bg.addColorStop(1, '#08080c');
  ctx.fillStyle = p2Bg;
  ctx.fillRect(x1 - slant, 0, x2 - x1 + slant * 2, h);

  // Driving diagonal storm rain deflected by Xiaohei's warm amber shield arc
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.34)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let r = 0; r < 28; r++) {
    const rx = x1 + ((r * 31 + timeSec * 190) % (x2 - x1));
    const ry = ((r * 57 + timeSec * 560) % (h * 0.45));
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 10, ry + 28);
  }
  ctx.stroke();

  drawTyndallGodRays(ctx, midX, h * 0.44, 5, -Math.PI * 0.5, 0.9, 260, '251, 191, 36', 0.22);

  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(midX, h * 0.56, 134 + beat.kickPulse * 14, Math.PI * 1.12, Math.PI * 1.88);
  ctx.stroke();

  drawDetailedXiaohei(sc, {
    cx: midX,
    bottomY: h * 0.74,
    scale: 0.88,
    tilt: 0,
    handleRatio: 0.22,
    warmHandleGlow: true,
    showScuffs: true,
  });
  ctx.restore();

  // --- PANEL 3 (RIGHT): "破风闯" (Macro RIMOWA Multiwheel® Skimming Neon-Wet Asphalt) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x2 + slant + 8, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(x2 - slant + 8, h);
  ctx.closePath();
  ctx.clip();

  const p3x = x2 + (w - x2) * 0.52;
  const roadY3 = h * 0.66;
  const p3Sky = ctx.createLinearGradient(0, 0, 0, roadY3);
  p3Sky.addColorStop(0, '#09131f');
  p3Sky.addColorStop(1, activePanel === 2 ? '#1e3545' : '#13202e');
  ctx.fillStyle = p3Sky;
  ctx.fillRect(x2 - slant, 0, w - x2 + slant, roadY3);

  // Blurred streetlamp & brake-light bokeh in Panel 3 background
  drawAnamorphicFlare(ctx, p3x + 40, roadY3 - 190, 180, 16, '#fb7185', 0.55);
  drawAnamorphicFlare(ctx, p3x - 50, roadY3 - 150, 160, 14, '#38bdf8', 0.5);

  ctx.fillStyle = '#090c12';
  ctx.fillRect(x2 - slant, roadY3, w - x2 + slant, h - roadY3);
  ctx.fillStyle = chapter.accentHex;
  ctx.fillRect(x2 - slant, roadY3, w - x2 + slant, 2.5);

  // Lower corner of grooved RIMOWA shell + riveted aluminum corner cap above Multiwheel
  ctx.fillStyle = '#181820';
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2;
  roundRectPath(ctx, p3x - 95, roadY3 - 242, 190, 150, 22);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#3f3f46';
  ctx.strokeStyle = '#d4d4d8';
  roundRectPath(ctx, p3x - 95, roadY3 - 138, 50, 48, 14);
  ctx.fill();
  ctx.stroke();

  // Caster fork housing + Macro Multiwheel® dual-spoked spinner tire
  ctx.fillStyle = '#27272e';
  roundRectPath(ctx, p3x - 36, roadY3 - 98, 72, 34, 10);
  ctx.fill();

  const wheelY3 = roadY3 - 48;
  ctx.save();
  ctx.translate(p3x, wheelY3);
  ctx.rotate(wheelAngle * 1.8);
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 4;
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 33, Math.sin(a) * 33);
    ctx.stroke();
  }
  ctx.fillStyle = chapter.accentHex;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Golden water-spray & speed streaks kicking off wet asphalt
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.2;
  for (let s = 0; s < 8; s++) {
    const sy = roadY3 - 6 - s * 13;
    const sx = x2 + ((timeSec * 420 + s * 65) % 240);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 52, sy - 4);
    ctx.stroke();
  }
  ctx.restore();

  // Crisp Glowing Editorial Panel Dividers
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
 * 10. shoulder_companion: World-Class Twilight Metropolis Overlook Terrace ("尔似 在我肩")
 */
export function renderShoulderCompanionShot(sc: ShotContext): void {
  const { ctx, w, h, scrollDist, chapter } = sc;
  const floorY = h * 0.86;
  const harborY = h * 0.62;

  // 1. Deep cosmos-indigo -> twilight plum -> warm amber horizon sky
  const bg = ctx.createLinearGradient(0, 0, 0, harborY);
  bg.addColorStop(0, '#060913');
  bg.addColorStop(0.45, '#19152c');
  bg.addColorStop(0.8, '#3d1e2e');
  bg.addColorStop(1, '#85381c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, harborY);

  // Twinkling stars, delicate crescent moon on upper-right & backlit twilight clouds!
  drawStarfieldAndClouds(sc, harborY, {
    starCount: 46,
    cloudShadowHex: '#18142b',
    cloudMidHex: '#432033',
    cloudRimHex: '#fbbf24',
    driftSpeed: 7,
    moonPos: { x: w * 0.83, y: h * 0.16, r: 19 },
  });

  // 2. Dark Harbor Bay Water +Panoramic Glittering Metropolis Skyline & Water Reflections!
  const bayGrad = ctx.createLinearGradient(0, harborY, 0, floorY);
  bayGrad.addColorStop(0, '#141324');
  bayGrad.addColorStop(0.5, '#0c0d18');
  bayGrad.addColorStop(1, '#080910');
  ctx.fillStyle = bayGrad;
  ctx.fillRect(0, harborY, w, floorY - harborY);

  drawDistantCitySkyline(sc, harborY, {
    parallaxPx: scrollDist * 0.06,
    maxTowerHeight: h * 0.22,
    silhouetteHex: '#0d0e1a',
    secondarySilhouetteHex: '#19172b',
    windowPrimaryHex: '#fde68a',
    windowSecondaryHex: '#38bdf8',
    waterReflectionHeight: (floorY - harborY) * 0.85,
  });

  // Winding golden & ruby bay-bridge traffic ribbon across the lower harbor
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, harborY + 38);
  ctx.bezierCurveTo(w * 0.32, harborY + 14, w * 0.68, harborY + 66, w, harborY + 28);
  ctx.stroke();
  for (let i = 0; i < 18; i++) {
    const t = ((i / 18 + scrollDist * 0.00025) % 1);
    const lx = t * w;
    const ly =
      Math.pow(1 - t, 3) * (harborY + 38) +
      3 * Math.pow(1 - t, 2) * t * (harborY + 14) +
      3 * (1 - t) * t * t * (harborY + 66) +
      t * t * t * (harborY + 28);
    ctx.fillStyle = i % 3 === 0 ? '#fb7185' : '#fef08a';
    ctx.beginPath();
    ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Midground Harbor-Sky Constellation Lyric & Water Shimmer (occluded by streetlamp & Traveler!)
  renderMidgroundDiegeticLyrics(sc, 'shoulder_companion');

  // 3. Vintage Cast-Iron Overlook Streetlamp on Far Right with Soft Atmospheric Sodium Pool
  const lampX = w * 0.86;
  const lampTopY = h * 0.31;
  ctx.save();
  ctx.strokeStyle = '#1b1927';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(lampX, floorY);
  ctx.lineTo(lampX, lampTopY + 12);
  ctx.quadraticCurveTo(lampX, lampTopY - 8, lampX - 18, lampTopY - 8);
  ctx.stroke();

  // Tapered wrought-iron hexagonal lantern cage
  const bulbX = lampX - 18;
  const bulbY = lampTopY - 2;
  ctx.fillStyle = '#1f1c2b';
  ctx.beginPath();
  ctx.moveTo(bulbX - 10, lampTopY - 12);
  ctx.lineTo(bulbX + 10, lampTopY - 12);
  ctx.lineTo(bulbX + 7, bulbY + 10);
  ctx.lineTo(bulbX - 7, bulbY + 10);
  ctx.closePath();
  ctx.fill();

  // Soft volumetric radial sodium scatter (replaces hard polygonal cones!)
  ctx.globalCompositeOperation = 'screen';
  const haloR = (floorY - bulbY) * 0.85;
  const halo = ctx.createRadialGradient(bulbX, bulbY, 4, bulbX, bulbY + haloR * 0.25, haloR);
  halo.addColorStop(0, 'rgba(254, 240, 138, 0.36)');
  halo.addColorStop(0.28, 'rgba(251, 191, 36, 0.14)');
  halo.addColorStop(0.65, 'rgba(245, 158, 11, 0.04)');
  halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(bulbX, bulbY + haloR * 0.25, haloR, 0, Math.PI * 2);
  ctx.fill();

  const pool = ctx.createRadialGradient(bulbX - 16, floorY + 8, 8, bulbX - 16, floorY + 8, 220);
  pool.addColorStop(0, 'rgba(253, 224, 71, 0.16)');
  pool.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = pool;
  ctx.beginPath();
  ctx.ellipse(bulbX - 16, floorY + 10, 220, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawAnamorphicFlare(ctx, bulbX, bulbY, 175, 12, '#fde68a', 0.72);

  // 4. Grounded Overlook Terrace Promenade, Balustrade & Traveler with Arm on 20" RIMOWA
  drawTerraceShoulderCompanion(sc);

  // Subtle stone terrace perspective tile joints
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.5 + i * 145, floorY);
    ctx.lineTo(w * 0.5 + i * 235, h);
    ctx.stroke();
  }
  ctx.restore();
  drawCinemaBokeh(sc, 14, chapter.accentHex, '#38bdf8', 0.85);
}

/**
 * 11. fortress_monolith: Architectural Cathedral-of-Light Sanctuary & Mirror Obsidian Astrolabe ("你最是 安稳堡垒啊")
 */
export function renderFortressMonolithShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;
  const floorY = h * 0.74;
  const cx = w * 0.5;
  const cy = h * 0.52;

  // 1. Deep sacred amber-obsidian cathedral atmosphere
  const bg = ctx.createRadialGradient(cx, cy, 30, cx, cy, w * 0.68);
  bg.addColorStop(0, '#36210c');
  bg.addColorStop(0.52, '#140e0b');
  bg.addColorStop(1, '#060608');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Monumental Basalt Colonnade Pillars receding in symmetry on Left & Right
  const cols = [-0.4, -0.28, 0.28, 0.4];
  for (const frac of cols) {
    const px = cx + frac * w;
    const pw = Math.abs(frac) > 0.34 ? 54 : 36;
    const colGrad = ctx.createLinearGradient(px - pw * 0.5, 0, px + pw * 0.5, 0);
    colGrad.addColorStop(0, '#08080b');
    colGrad.addColorStop(0.5, '#191516');
    colGrad.addColorStop(1, '#08080b');
    ctx.fillStyle = colGrad;
    ctx.fillRect(px - pw * 0.5, 0, pw, floorY);
    // Warm golden inner rim highlight facing Xiaohei
    ctx.fillStyle = 'rgba(251, 191, 36, 0.24)';
    ctx.fillRect(frac < 0 ? px + pw * 0.5 - 2 : px - pw * 0.5, 0, 2, floorY);
  }

  // Converging Overhead Cathedral God-Rays onto Xiaohei
  drawTyndallGodRays(ctx, cx, -80, 7, Math.PI * 0.5, 0.55, h * 0.95, '253, 224, 71', 0.2);

  // 2. Rotating Sacred-Geometry Hexagonal Bastion Halo Behind Xiaohei
  for (let ring = 1; ring <= 3; ring++) {
    const rad = Math.min(w, h) * (0.17 + ring * 0.088) + beat.kickPulse * 10;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(timeSec * (ring % 2 === 0 ? -0.22 : 0.22) + ring);
    ctx.strokeStyle = ring === 1 ? '#fde047' : chapter.accentHex;
    ctx.globalAlpha = 0.62 - ring * 0.14;
    ctx.lineWidth = 3.2 - ring * 0.6;
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

  // 3. Mirror Obsidian Sanctuary Floor + Foreshortened Golden Ground Seal
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#1a130d');
  floorGrad.addColorStop(0.5, '#0c0908');
  floorGrad.addColorStop(1, '#050507');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  ctx.save();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
  ctx.lineWidth = 2;
  for (const rx of [130, 220, 310]) {
    ctx.beginPath();
    ctx.ellipse(cx, floorY + 6, rx + beat.kickPulse * 8, rx * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Mirror floor reflection of Xiaohei
  ctx.save();
  ctx.translate(0, floorY * 2);
  ctx.scale(1, -0.38);
  ctx.globalAlpha = 0.2;
  drawDetailedXiaohei(sc, {
    cx,
    bottomY: floorY,
    scale: 1.08,
    tilt: 0,
    warmHandleGlow: false,
  });
  ctx.restore();

  // 4. Xiaohei Anchored Dead-Center as an Unshakable Monolith + Anamorphic Crown Flare
  drawDetailedXiaohei(sc, {
    cx,
    bottomY: floorY,
    scale: 1.08,
    tilt: 0,
    warmHandleGlow: true,
    showScuffs: true,
  });

  drawAnamorphicFlare(ctx, cx, floorY - 248, 340, 20, '#fde047', 0.65 + beat.kickPulse * 0.25);
  drawCinemaBokeh(sc, 22, '#facc15', '#fb923c', 1.35);
}
