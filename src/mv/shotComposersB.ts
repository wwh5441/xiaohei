import {
  drawCinemaBokeh,
  drawDetailedXiaohei,
  drawTravelerSilhouette,
  roundRectPath,
  type ShotContext,
} from './shotPrimitives';

/**
 * 12. turntable_carousel: Overhead Airport Baggage Carousel × 96 BPM Vinyl LP Record
 */
export function renderTurntableCarouselShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter, beat } = sc;

  ctx.fillStyle = '#080e16';
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.54;
  const outerR = Math.min(w, h) * 0.36;

  // Spinning Vinyl Carousel Track
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(timeSec * 1.45);

  ctx.fillStyle = '#111824';
  ctx.strokeStyle = chapter.accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Carousel rubber slat lines & spectrum wedges
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * outerR * 0.42, Math.sin(a) * outerR * 0.42);
    ctx.lineTo(Math.cos(a) * outerR * 0.96, Math.sin(a) * outerR * 0.96);
    ctx.stroke();
  }

  // Suitcases riding around the carousel!
  for (let k = 0; k < 4; k++) {
    const ka = (k / 4) * Math.PI * 2;
    ctx.save();
    ctx.rotate(ka);
    ctx.translate(outerR * 0.7, 0);
    ctx.fillStyle = k === 0 ? '#18181b' : '#1e293b';
    ctx.strokeStyle = k === 0 ? '#facc15' : '#64748b';
    ctx.lineWidth = k === 0 ? 3 : 1.5;
    roundRectPath(ctx, -28, -40, 56, 80, 10);
    ctx.fill();
    ctx.stroke();
    if (k === 0) {
      ctx.fillStyle = '#facc15';
      ctx.font = '800 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('20"', 0, 3);
    }
    ctx.restore();
  }

  // Center Gold Vinyl Label ("96 BPM · HEY XIAOHEI")
  ctx.fillStyle = chapter.accentHex;
  ctx.beginPath();
  ctx.arc(0, 0, outerR * 0.3 + beat.kickPulse * 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 13. airport_delay_rain: Rain-soaked Airport Terminal Glass Curtain Wall, Grounded Airliner & Split-Flap "DELAYED" Board
 * Matches exact lyric: "[01:18.905] 等暴雨 这班机 延误了"
 */
export function renderAirportDelayRainShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;
  const floorY = h * 0.72;

  // Stormy midnight sky outside terminal glass
  const stormSky = ctx.createLinearGradient(0, 0, 0, floorY);
  stormSky.addColorStop(0, '#040914');
  stormSky.addColorStop(0.6, '#0b192e');
  stormSky.addColorStop(1, '#132942');
  ctx.fillStyle = stormSky;
  ctx.fillRect(0, 0, w, floorY);

  // Subtle distant sheet lightning flash on snare/thunder
  if (beat.snarePulse > 0.6) {
    ctx.fillStyle = `rgba(186, 230, 253, ${((beat.snarePulse - 0.6) * 0.25).toFixed(3)})`;
    ctx.fillRect(0, 0, w, floorY);
  }

  // Grounded Wide-body Airliner Silhouette on wet tarmac outside!
  const planeX = w * 0.31;
  const planeY = floorY - h * 0.13;
  ctx.fillStyle = '#07111f';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  // Fuselage
  roundRectPath(ctx, planeX - 160, planeY - 18, 320, 36, 18);
  ctx.fill();
  ctx.stroke();
  // Illuminated cabin windows row
  ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
  for (let wx = planeX - 110; wx <= planeX + 115; wx += 15) {
    ctx.fillRect(wx, planeY - 5, 6, 5);
  }
  // Swept wing & engine nacelle
  ctx.fillStyle = '#0a182b';
  ctx.beginPath();
  ctx.moveTo(planeX - 20, planeY + 8);
  ctx.lineTo(planeX - 88, planeY + 34);
  ctx.lineTo(planeX + 36, planeY + 14);
  ctx.closePath();
  ctx.fill();
  // Tail fin
  ctx.fillStyle = '#07111f';
  ctx.beginPath();
  ctx.moveTo(planeX - 142, planeY - 14);
  ctx.lineTo(planeX - 178, planeY - 82);
  ctx.lineTo(planeX - 112, planeY - 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Blinking red anti-collision beacon on tail
  const beaconOn = Math.floor(timeSec * 2.5) % 2 === 0;
  if (beaconOn) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(planeX - 172, planeY - 80, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floor-to-ceiling Architectural Glass Curtain Wall Mullions
  ctx.strokeStyle = '#090e17';
  ctx.lineWidth = 10;
  for (let gx = w * 0.12; gx < w; gx += w * 0.22) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx - 24, floorY);
    ctx.stroke();
  }
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.42);
  ctx.lineTo(w, h * 0.42);
  ctx.stroke();

  // Driving Thunderstorm Rain Streaks on Glass
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.36)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 90; i++) {
    const rx = ((i * 103 + timeSec * 360) % (w + 160)) - 80;
    const ry = ((i * 157 + timeSec * 1080) % floorY);
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 16, ry + 42);
  }
  ctx.stroke();

  // Split-Flap Flight Information Board ("FLIGHT DELAYED · 暴雨延误") positioned safely below lyrics
  const boardW = Math.min(352, w * 0.32);
  const boardX = w * 0.61;
  const boardY = h * 0.27;
  ctx.fillStyle = '#09090b';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  roundRectPath(ctx, boardX, boardY, boardW, 92, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('FLIGHT      GATE    STATUS', boardX + 18, boardY + 24);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('MU 2020     B20', boardX + 18, boardY + 52);

  ctx.fillStyle = '#ef4444';
  roundRectPath(ctx, boardX + boardW - 118, boardY + 36, 100, 24, 4);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 12px "Noto Sans SC", "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('暴雨延误', boardX + boardW - 68, boardY + 51);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HEAVY RAIN · DEPARTURE HOLD', boardX + 18, boardY + 76);

  // Polished Terminal Concourse Floor with Reflection
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  floorGrad.addColorStop(0, '#091322');
  floorGrad.addColorStop(1, '#04070d');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, h - floorY);

  // Seated Traveler on Airport Bench + Loyal Xiaohei right beside them!
  const benchX = w * 0.36;
  ctx.fillStyle = '#162032';
  roundRectPath(ctx, benchX - 90, floorY - 36, 180, 12, 4);
  ctx.fill();
  // Seated sighing silhouette
  ctx.fillStyle = '#0d1320';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(benchX - 10, floorY - 122, 18, 0, Math.PI * 2); // bowed head
  ctx.fill();
  ctx.stroke();
  roundRectPath(ctx, benchX - 38, floorY - 100, 52, 66, 16); // torso leaning forward
  ctx.fill();

  drawDetailedXiaohei(sc, {
    cx: benchX + 86,
    bottomY: floorY + 12,
    scale: 0.76,
    warmHandleGlow: true,
  });
}

/**
 * 14. handle_warmth_macro: Intimate macro of a hand gripping Xiaohei's telescopic handle with amber thermal rings ("把拉杆温度 全记得")
 */
export function renderHandleWarmthMacroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  const bg = ctx.createRadialGradient(w * 0.5, h * 0.54, 20, w * 0.5, h * 0.54, w * 0.7);
  bg.addColorStop(0, '#291a0c');
  bg.addColorStop(0.55, '#0b1626');
  bg.addColorStop(1, '#050811');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawCinemaBokeh(sc, 20, '#38bdf8', '#f59e0b', 1.5);

  const cx = w * 0.5;
  const gripY = h * 0.52;

  // Expanding Amber Thermal Ripples ("掌心余温 36.8°C")
  for (let r = 0; r < 4; r++) {
    const prog = ((timeSec * 0.65 + r * 0.25) % 1);
    const rad = 45 + prog * 230;
    ctx.strokeStyle = `rgba(251, 191, 36, ${((1 - prog) * 0.52).toFixed(3)})`;
    ctx.lineWidth = 3 - prog * 2;
    ctx.beginPath();
    ctx.arc(cx, gripY, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Twin Chrome Telescopic Rods rising from bottom
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(cx - 120, h);
  ctx.lineTo(cx - 120, gripY + 14);
  ctx.moveTo(cx + 120, h);
  ctx.lineTo(cx + 120, gripY + 14);
  ctx.stroke();

  // Warm Glowing Handle Bar
  const barGrad = ctx.createLinearGradient(cx - 150, gripY, cx + 150, gripY);
  barGrad.addColorStop(0, '#27272a');
  barGrad.addColorStop(0.5, '#f59e0b');
  barGrad.addColorStop(1, '#27272a');
  ctx.fillStyle = barGrad;
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 3;
  roundRectPath(ctx, cx - 155, gripY - 22, 310, 44, 20);
  ctx.fill();
  ctx.stroke();

  // Stylized Human Hand gently wrapped around center of handle grip!
  const pulse = beat.kickPulse * 4;
  ctx.fillStyle = '#1c1917';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  for (let f = -1.5; f <= 1.5; f += 1) {
    roundRectPath(ctx, cx + f * 26 - 11, gripY - 30 - pulse, 22, 60 + pulse, 10);
    ctx.fill();
    ctx.stroke();
  }
  // Wrist / Coat sleeve entering from upper right
  ctx.beginPath();
  ctx.moveTo(cx + 35, gripY - 24);
  ctx.lineTo(w * 0.78, h * 0.22);
  ctx.lineTo(w * 0.86, h * 0.34);
  ctx.lineTo(cx + 55, gripY + 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * 15. concourse_parting: Long-lens concourse with blurred rushing crowd vs steady Xiaohei ("你见证 聚散啊 / 依然就是托住我")
 */
export function renderConcoursePartingShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, chapter } = sc;
  const floorY = h * 0.7;

  ctx.fillStyle = '#070d17';
  ctx.fillRect(0, 0, w, h);

  // Motion-blurred ghostly silhouettes walking away in opposite directions ("见证聚散")
  for (let p = 0; p < 8; p++) {
    const dir = p % 2 === 0 ? 1 : -1;
    const px = ((p * 210 + timeSec * 130 * dir) % (w + 240) + (w + 240)) % (w + 240) - 120;
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = p % 3 === 0 ? '#38bdf8' : '#94a3b8';
    roundRectPath(ctx, px - 28, floorY - 170 - (p % 3) * 18, 56, 170, 24);
    ctx.fill();
    // Motion blur streak
    ctx.fillRect(px - 65, floorY - 120, 130, 16);
    ctx.restore();
  }

  // Floor horizon
  ctx.fillStyle = '#0b1424';
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = chapter.accentHex;
  ctx.fillRect(0, floorY, w, 2);

  // Crisp anchored Traveler + Xiaohei in center spotlight ("依然就是托住我")
  const spot = ctx.createRadialGradient(w * 0.5, floorY - 80, 10, w * 0.5, floorY - 80, 240);
  spot.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
  spot.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = spot;
  ctx.beginPath();
  ctx.arc(w * 0.5, floorY - 80, 240, 0, Math.PI * 2);
  ctx.fill();

  drawDetailedXiaohei(sc, {
    cx: w * 0.46,
    bottomY: floorY + 18,
    scale: 0.9,
    warmHandleGlow: true,
  });
  drawTravelerSilhouette(ctx, w * 0.56, floorY + 18, h * 0.32, 0.2, '#fbbf24');
}

/**
 * 16. tree_hollow_poetic: Surreal glowing Ancient Tree Hollow transforming blue rain-tears into golden fireflies ("你像树洞 咽下悲欢")
 */
export function renderTreeHollowPoeticShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#050b14');
  sky.addColorStop(0.65, '#0b1926');
  sky.addColorStop(1, '#09120e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const groundY = h * 0.74;

  // Monumental Ancient Tree Trunk Silhouette framing center below lyric zone
  ctx.fillStyle = '#0c0a09';
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 210, groundY + 40);
  ctx.quadraticCurveTo(cx - 140, h * 0.5, cx - 175, h * 0.24);
  ctx.lineTo(cx + 175, h * 0.24);
  ctx.quadraticCurveTo(cx + 140, h * 0.5, cx + 210, groundY + 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Golden Tree Hollow Portal in the trunk!
  const hollowY = h * 0.5;
  const hollowGlow = ctx.createRadialGradient(cx, hollowY, 12, cx, hollowY, 145);
  hollowGlow.addColorStop(0, '#fef08a');
  hollowGlow.addColorStop(0.45, 'rgba(245, 158, 11, 0.55)');
  hollowGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = hollowGlow;
  ctx.beginPath();
  ctx.ellipse(cx, hollowY, 92 + beat.kickPulse * 8, 125 + beat.kickPulse * 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Xiaohei nestled right inside the glowing tree hollow sanctuary!
  drawDetailedXiaohei(sc, {
    cx,
    bottomY: groundY,
    scale: 0.78,
    warmHandleGlow: true,
  });

  // Blue raindrops drifting in from top -> Golden fireflies floating upward!
  for (let i = 0; i < 24; i++) {
    const isFirefly = i % 2 === 0;
    if (isFirefly) {
      const fx = cx + Math.sin(timeSec * 1.4 + i) * (110 + i * 9);
      const fy = groundY - ((timeSec * 48 + i * 31) % (h * 0.58));
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const rx = cx + Math.cos(i * 2.3) * 260;
      const ry = ((timeSec * 220 + i * 47) % (h * 0.5));
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.fillRect(rx, ry, 2, 14);
    }
  }
}

/**
 * 17. whistle_coastal: Sunlit turquoise coastal cliff road with dancing whistle melody staves & seagulls
 */
export function renderWhistleCoastalShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, bands, beat } = sc;
  const seaY = h * 0.62;
  const roadY = h * 0.72;

  const sky = ctx.createLinearGradient(0, 0, 0, seaY);
  sky.addColorStop(0, '#072a3a');
  sky.addColorStop(0.55, '#0e5a6d');
  sky.addColorStop(1, '#2dd4bf');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, seaY);

  // Sparkling Turquoise Ocean Band
  ctx.fillStyle = '#0b3b49';
  ctx.fillRect(0, seaY, w, roadY - seaY);
  ctx.fillStyle = 'rgba(254, 240, 138, 0.48)';
  for (let s = 0; s < 28; s++) {
    const sx = ((s * 67 + timeSec * 40) % w);
    const sy = seaY + 8 + (s % 4) * ((roadY - seaY - 16) / 4);
    ctx.fillRect(sx, sy, 18, 2.5);
  }

  // Three Dancing Golden Whistle Soundwave Ribbons across the Sky!
  for (let r = 0; r < 3; r++) {
    const baseY = h * (0.28 + r * 0.08);
    ctx.strokeStyle = r === 0 ? '#facc15' : r === 1 ? '#5eead4' : 'rgba(255,255,255,0.45)';
    ctx.lineWidth = r === 0 ? 4.5 : 2.2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 22) {
      const amp = (20 + bands.high * 45 + beat.snarePulse * 24) * Math.sin((x / w) * Math.PI);
      const y = baseY + Math.sin(x * 0.015 - timeSec * 9.5 + r * 1.2) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Gliding White Seagulls & Paper Airplanes
  for (let g = 0; g < 4; g++) {
    const gx = ((timeSec * (115 + g * 28) + g * 310) % (w + 140)) - 70;
    const gy = h * (0.24 + g * 0.06) + Math.sin(timeSec * 3.5 + g) * 14;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    const flap = Math.sin(timeSec * 8 + g * 2) * 8;
    ctx.beginPath();
    ctx.moveTo(gx - 14, gy + flap);
    ctx.quadraticCurveTo(gx - 5, gy - 6, gx, gy);
    ctx.quadraticCurveTo(gx + 5, gy - 6, gx + 14, gy + flap);
    ctx.stroke();
  }

  // Coastal Cliff Road & Breezy Duo
  ctx.fillStyle = '#0d1b22';
  ctx.fillRect(0, roadY, w, h - roadY);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(0, roadY, w, 3);

  drawDetailedXiaohei(sc, {
    cx: w * 0.45,
    bottomY: roadY + 26,
    scale: 0.82,
    tilt: 0.1,
  });
  drawTravelerSilhouette(ctx, w * 0.56, roadY + 26, h * 0.3, timeSec * 7.2, '#5eead4');
}

/**
 * 18. timelapse_nostalgia: Hyper-speed city neon blur ("万物都在速朽") vs calm golden vignette ("唯有你念旧")
 */
export function renderTimelapseNostalgiaShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;

  ctx.fillStyle = '#08080c';
  ctx.fillRect(0, 0, w, h);

  // Outer frame: Hyper-speed horizontal neon light-trails ("万物都在速朽")
  const colors = ['#38bdf8', '#f43f5e', '#a855f7', '#2dd4bf'];
  for (let i = 0; i < 36; i++) {
    const sy = (i / 36) * h;
    const speed = 1400 + (i % 5) * 420;
    const sx = ((timeSec * speed + i * 190) % (w + 400)) - 200;
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.26;
    ctx.fillRect(sx, sy, 220 + (i % 3) * 90, 4);
  }
  ctx.globalAlpha = 1;

  // Center Calm Warm Nostalgic Sanctuary Circle ("唯有你念旧")
  const cx = w * 0.5;
  const cy = h * 0.54;
  const r = Math.min(w, h) * 0.31;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  const warmBg = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
  warmBg.addColorStop(0, '#3b2614');
  warmBg.addColorStop(1, '#17110b');
  ctx.fillStyle = warmBg;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Subtle slow clock hands turning gently in background
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2);
  ctx.stroke();

  drawDetailedXiaohei(sc, {
    cx,
    bottomY: cy + r * 0.62,
    scale: 0.9,
    showScuffs: true,
    warmHandleGlow: true,
  });
  ctx.restore();

  // Crisp golden ring separating fast-decaying world from nostalgic center
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * 19. home_doorway_sun: Sunlit home entryway, wooden door, houseplant & floating Polaroids ("放在家里的门口边 / 旧日风景全都不忘")
 */
export function renderHomeDoorwaySunShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const floorY = h * 0.69;

  // Warm domestic wall
  const wall = ctx.createLinearGradient(0, 0, 0, floorY);
  wall.addColorStop(0, '#19120c');
  wall.addColorStop(1, '#2b1e13');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, w, floorY);

  // Paneled Wooden Front Door on Left ("家里的门口边") safely below top lyrics
  const doorX = w * 0.22;
  const doorTopY = h * 0.25;
  const doorW = Math.min(180, w * 0.16);
  ctx.fillStyle = '#23170e';
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 3;
  roundRectPath(ctx, doorX, doorTopY, doorW, floorY - doorTopY, 6);
  ctx.fill();
  ctx.stroke();
  // Recessed wooden door panels
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, doorX + 18, doorTopY + 20, doorW - 36, (floorY - doorTopY) * 0.4, 4);
  ctx.stroke();
  roundRectPath(ctx, doorX + 18, doorTopY + (floorY - doorTopY) * 0.5, doorW - 36, (floorY - doorTopY) * 0.4, 4);
  ctx.stroke();
  // Brass doorknob
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(doorX + doorW - 22, doorTopY + (floorY - doorTopY) * 0.52, 6.5, 0, Math.PI * 2);
  ctx.fill();

  // Warm Oak Floorboards
  ctx.fillStyle = '#1f140c';
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.16)';
  ctx.lineWidth = 1.5;
  for (let py = floorY; py < h; py += 24) {
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();
  }

  // Golden Slanted Window Sunbeams streaming across doorway & Xiaohei
  for (let b = 0; b < 3; b++) {
    const bx = w * (0.28 + b * 0.16);
    const beam = ctx.createLinearGradient(bx, 0, bx + w * 0.22, h * 0.85);
    beam.addColorStop(0, 'rgba(253, 224, 71, 0.24)');
    beam.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(bx, 0);
    ctx.lineTo(bx + w * 0.08, 0);
    ctx.lineTo(bx + w * 0.3, h);
    ctx.lineTo(bx + w * 0.18, h);
    ctx.closePath();
    ctx.fill();
  }

  // Xiaohei resting peacefully beside the front door (handle retracted low!)
  drawDetailedXiaohei(sc, {
    cx: doorX + doorW + 96,
    bottomY: floorY + 20,
    scale: 0.88,
    handleRatio: 0.1,
    showScuffs: true,
  });

  // Floating Polaroid Snapshots of Past Journeys ("那些旧日风景 全都不忘")
  const polaroidScenes = ['#f59e0b', '#38bdf8', '#2dd4bf', '#fb7185'];
  for (let m = 0; m < 4; m++) {
    const px = w * (0.54 + (m % 2) * 0.16) + Math.sin(timeSec * 1.1 + m) * 12;
    const py = h * (0.34 + Math.floor(m / 2) * 0.2) + Math.cos(timeSec * 0.9 + m) * 10;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((m % 2 === 0 ? -0.12 : 0.14) + Math.sin(timeSec + m) * 0.04);
    ctx.fillStyle = '#fefce8';
    roundRectPath(ctx, -38, -44, 76, 88, 4);
    ctx.fill();
    ctx.fillStyle = polaroidScenes[m];
    ctx.fillRect(-31, -37, 62, 54);
    // Mini mountain/horizon silhouette inside polaroid!
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-31, 17);
    ctx.lineTo(-10, -6);
    ctx.lineTo(12, 8);
    ctx.lineTo(24, -4);
    ctx.lineTo(31, 17);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 20. nametag_dream_macro: Stitched Cognac-Leather Luggage Name Tag in gold foil ("陪着我 姓名 / 护住这个小小箱")
 */
export function renderNametagDreamMacroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec, beat } = sc;

  ctx.fillStyle = '#0d0a08';
  ctx.fillRect(0, 0, w, h);

  drawCinemaBokeh(sc, 22, '#fbbf24', '#fb7185', 1.5);

  const cx = w * 0.5;
  const cy = h * 0.54;
  const swing = Math.sin(timeSec * 1.8) * 0.06;

  ctx.save();
  ctx.translate(cx, cy - 150);
  ctx.rotate(swing);

  // Leather strap loop attached to top handle
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(0, -80);
  ctx.lineTo(0, 50);
  ctx.stroke();

  // Stitched Cognac-Leather Name Tag Body
  const tagW = 290;
  const tagH = 176;
  ctx.fillStyle = '#451a03';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  roundRectPath(ctx, -tagW * 0.5, 40, tagW, tagH, 18);
  ctx.fill();
  ctx.stroke();

  // Dashed saddle stitching
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.6;
  roundRectPath(ctx, -tagW * 0.5 + 10, 50, tagW - 20, tagH - 20, 12);
  ctx.stroke();
  ctx.setLineDash([]);

  // Brass buckle rivet
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, 64, 8 + beat.kickPulse * 2, 0, Math.PI * 2);
  ctx.fill();

  // Gold-Foil Embossed Name Card Window ("陪着我 姓名")
  ctx.fillStyle = '#1c1917';
  roundRectPath(ctx, -tagW * 0.5 + 26, 86, tagW - 52, 102, 8);
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('COMPANION · LUGGAGE TAG', 0, 112);

  ctx.fillStyle = '#fef3c7';
  ctx.font = '800 22px "Noto Sans SC", "Outfit", sans-serif';
  ctx.fillText('致好朋友 · 小黑', 0, 144);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 11px "Outfit", sans-serif';
  ctx.fillText('CARRYING MY NAME & OLD DREAMS', 0, 170);

  ctx.restore();
}

/**
 * 21. sunset_horizon_outro: Mirror twilight horizon as Traveler & Xiaohei walk into the glowing dusk
 */
export function renderSunsetHorizonOutroShot(sc: ShotContext): void {
  const { ctx, w, h, timeSec } = sc;
  const horizonY = h * 0.64;

  const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
  sky.addColorStop(0, '#09070c');
  sky.addColorStop(0.45, '#3b1526');
  sky.addColorStop(0.82, '#9a3412');
  sky.addColorStop(1, '#fbbf24');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizonY);

  // Molten setting sun half-disc on horizon
  const sunR = Math.min(w, h) * 0.15;
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(w * 0.5, horizonY, sunR, Math.PI, Math.PI * 2);
  ctx.fill();

  // Mirror salt-flat twilight reflection below horizon
  const mirror = ctx.createLinearGradient(0, horizonY, 0, h);
  mirror.addColorStop(0, '#451a0a');
  mirror.addColorStop(0.4, '#1c0d14');
  mirror.addColorStop(1, '#070609');
  ctx.fillStyle = mirror;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Shimmering sun reflection path leading to horizon
  ctx.fillStyle = 'rgba(253, 224, 71, 0.25)';
  ctx.beginPath();
  ctx.moveTo(w * 0.5 - sunR * 0.7, horizonY);
  ctx.lineTo(w * 0.5 + sunR * 0.7, horizonY);
  ctx.lineTo(w * 0.5 + sunR * 0.22, h);
  ctx.lineTo(w * 0.5 - sunR * 0.22, h);
  ctx.closePath();
  ctx.fill();

  // Distant smaller scale silhouette walking peacefully toward the sunset!
  const outroProg = Math.min(1, Math.max(0, (timeSec - 197.5) / 14.5));
  const distScale = 0.62 - outroProg * 0.18;
  const figY = horizonY + 26 - outroProg * 14;

  drawDetailedXiaohei(sc, {
    cx: w * 0.465,
    bottomY: figY,
    scale: distScale,
    tilt: 0.06,
  });
  drawTravelerSilhouette(
    ctx,
    w * 0.525,
    figY,
    240 * distScale,
    timeSec * 4.2,
    '#fde047'
  );

  drawCinemaBokeh(sc, 16, '#fbbf24', '#fb7185', 1.1);
}
