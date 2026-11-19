import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AUDIO_INTRO_SOUND_START_SEC, LYRIC_LINES, MV_CHAPTERS, SHOT_SPECS, SONG_META } from './mvData';
import { sampleS03ContactLockedFoot } from './shotComposersA';
import {
  computeBeatState,
  computeHumanStridePose,
  formatTimecode,
  getActiveChapter,
  getActiveLyricIndex,
  getAdjacentShotSeekTime,
  getLyricProgress,
  getShotSeekTimeByIndex,
  parseId3CoverArt,
  resolveActiveShot,
  resolveLyricStagePlacement,
  resolveShotSeekTimeByParam,
  solveGravityArmIK,
  solveTwoBoneIK,
} from './mvTimeline';
import {
  computeGlyphThermodynamics,
  resolveDiegeticModeForShot,
} from './diegeticLyrics';

test('MV chapters cover full 212.04s song continuously without gaps', () => {
  assert.equal(MV_CHAPTERS[0].startTime, 0);
  assert.equal(MV_CHAPTERS[MV_CHAPTERS.length - 1].endTime, SONG_META.durationSec);

  for (let i = 1; i < MV_CHAPTERS.length; i++) {
    assert.equal(
      MV_CHAPTERS[i].startTime,
      MV_CHAPTERS[i - 1].endTime,
      `Chapter ${MV_CHAPTERS[i].id} must start where previous chapter ended`
    );
  }

  assert.equal(getActiveChapter(0).id, 'intro');
  assert.equal(getActiveChapter(46.5).id, 'chorus1');
  assert.equal(getActiveChapter(79.5).id, 'verse2');
  assert.equal(getActiveChapter(132.0).id, 'whistle');
  assert.equal(getActiveChapter(175.0).id, 'finale');
});

test('all 66 lyric cuts map 1-to-1 to 66 globally unique shots (zero duplicates)', () => {
  assert.equal(LYRIC_LINES.length, 66);

  for (let i = 1; i < LYRIC_LINES.length; i++) {
    assert.ok(
      LYRIC_LINES[i].startTime >= LYRIC_LINES[i - 1].endTime - 1e-6,
      `Lyric ${LYRIC_LINES[i].id} overlaps previous line`
    );
    assert.ok(
      LYRIC_LINES[i].endTime > LYRIC_LINES[i].startTime,
      `Lyric ${LYRIC_LINES[i].id} must have positive duration`
    );
  }

  const distinctShots = new Set(LYRIC_LINES.map((l) => l.shot));
  const distinctCodes = new Set(LYRIC_LINES.map((l) => l.shotCode));
  const distinctLabels = new Set(LYRIC_LINES.map((l) => l.shotLabel));

  assert.equal(distinctShots.size, 66, 'Every lyric line must have a globally unique ShotType');
  assert.equal(distinctCodes.size, 66, 'Every lyric line must have a globally unique ShotCode (S01..S66)');
  assert.equal(distinctLabels.size, 66, 'Every lyric line must have a globally unique shotLabel');
  assert.equal(Object.keys(SHOT_SPECS).length, 66);
});

test('exact LRC lyric timestamps and revised poetic shot mappings align line by line', () => {
  const priorityIdx = getActiveLyricIndex(25.5);
  assert.ok(LYRIC_LINES[priorityIdx].text.includes('优先卡'));
  assert.equal(
    resolveActiveShot(25.5, 'auto', computeBeatState(25.5)).shot,
    's08_fanned_priority_tags'
  );

  const flightDelayIdx = getActiveLyricIndex(79.5);
  assert.ok(LYRIC_LINES[flightDelayIdx].text.includes('班机 延误了'));
  assert.equal(
    resolveActiveShot(79.5, 'auto', computeBeatState(79.5)).shot,
    's26_solari_fids_delayed_macro'
  );

  const gateLeanIdx = getActiveLyricIndex(94.5);
  assert.ok(LYRIC_LINES[gateLeanIdx].text.includes('托住我'));
  assert.equal(
    resolveActiveShot(94.5, 'auto', computeBeatState(94.5)).shot,
    's32_gate_pillar_lean_companion'
  );

  const treeHollowIdx = getActiveLyricIndex(103.2);
  assert.ok(LYRIC_LINES[treeHollowIdx].text.includes('像树洞'));
  assert.equal(
    resolveActiveShot(103.2, 'auto', computeBeatState(103.2)).shot,
    's35_ancient_hollow_rain_intake'
  );

  const timelapseIdx = getActiveLyricIndex(138.0);
  assert.ok(LYRIC_LINES[timelapseIdx].text.includes('万物都在速朽'));
  assert.equal(
    resolveActiveShot(138.0, 'auto', computeBeatState(138.0)).shot,
    's46_street_timelapse_sanctuary'
  );

  const haltedWheelIdx = getActiveLyricIndex(141.5);
  assert.ok(LYRIC_LINES[haltedWheelIdx].text.includes('转轮 不再自由'));
  const haltedShot = resolveActiveShot(141.5, 'auto', computeBeatState(141.5));
  assert.equal(haltedShot.shot, 's47_halted_wheel_autumn_leaf');
  assert.equal(haltedShot.spec.freezeWheel, true);
  // Even in low_track override mode, S47 preserves halted wheel narrative continuity
  assert.equal(
    resolveActiveShot(141.5, 'low_track', computeBeatState(141.5)).shot,
    's47_halted_wheel_autumn_leaf'
  );

  const nameTagIdx = getActiveLyricIndex(151.2);
  assert.ok(LYRIC_LINES[nameTagIdx].text.includes('陪着我 姓名'));
  assert.equal(
    resolveActiveShot(151.2, 'auto', computeBeatState(151.2)).shot,
    's51_cognac_nametag_foil'
  );

  const outroShot = resolveActiveShot(205.0, 'auto', computeBeatState(205.0));
  assert.equal(outroShot.shot, 's66_uyuni_mirror_outro');

  const progress = getLyricProgress(LYRIC_LINES[flightDelayIdx], 80.0);
  assert.ok(progress > 0 && progress < 1);
});

test('96 BPM beat physics produces sharp kick and snare pulses on chorus downbeats', () => {
  const downbeatTime = SONG_META.beatOffsetSec + SONG_META.barIntervalSec * 18;
  const beat0 = computeBeatState(downbeatTime);
  assert.equal(beat0.beatInBar, 0);
  assert.ok(beat0.kickPulse > 0.75);

  const snareTime = downbeatTime + SONG_META.beatIntervalSec;
  const beat1 = computeBeatState(snareTime);
  assert.equal(beat1.beatInBar, 1);
  assert.ok(beat1.snarePulse > 0.75);
});

test('formatTimecode formats tabular MM:SS cleanly', () => {
  assert.equal(formatTimecode(0), '00:00');
  assert.equal(formatTimecode(45.986), '00:45');
  assert.equal(formatTimecode(212.04), '03:32');
});

test('parseId3CoverArt extracts valid JPEG cover image from attached MP3 file', () => {
  const mp3Buf = fs.readFileSync('public/assets/aistudio/Ham_-______3c70d5e7.mp3');
  const arrayBuffer = mp3Buf.buffer.slice(
    mp3Buf.byteOffset,
    mp3Buf.byteOffset + mp3Buf.byteLength
  );
  const parsed = parseId3CoverArt(arrayBuffer);
  assert.ok(parsed !== null);
  assert.equal(parsed.mimeType, 'image/jpeg');
  assert.equal(parsed.imageBytes[0], 0xff);
  assert.equal(parsed.imageBytes[1], 0xd8);
});

test('solveTwoBoneIK preserves exact limb lengths and connects hand to RIMOWA handle', () => {
  const arm = solveTwoBoneIK(200, 120, 168, 178, 40, 38, 1);
  const dUpper = Math.hypot(arm.elbowX - 200, arm.elbowY - 120);
  const dFore = Math.hypot(arm.handX - arm.elbowX, arm.handY - arm.elbowY);
  assert.ok(Math.abs(dUpper - 40) < 1e-4);
  assert.ok(Math.abs(dFore - 38) < 1e-4);
  assert.ok(Math.abs(arm.handX - 168) < 1e-4);
  assert.ok(Math.abs(arm.handY - 178) < 1e-4);

  const leg = solveTwoBoneIK(300, 200, 300, 320, 64, 61, -1);
  assert.ok(leg.elbowX > 300, 'Human knee must bend forward (+X)');
});

test('resolveLyricStagePlacement distributes lyrics dynamically across spatial zones and orientations', () => {
  const zones = new Set<string>();
  const orientations = new Set<string>();

  for (const line of LYRIC_LINES) {
    const placement = resolveLyricStagePlacement(line, line.shot, 'auto');
    zones.add(placement.zone);
    orientations.add(placement.orientation);
  }

  assert.ok(zones.size >= 8, 'Lyrics should dynamically inhabit at least 8 distinct spatial zones');
  assert.ok(orientations.has('horizontal') && orientations.has('vertical'));

  const treeLine = LYRIC_LINES.find((l) => l.shot === 's35_ancient_hollow_rain_intake')!;
  assert.equal(resolveLyricStagePlacement(treeLine, treeLine.shot).orientation, 'vertical');
});

test('diegetic lyric thermodynamics handles both standard sweeping lines and <1.85s quick cuts', () => {
  // Standard 5.0s line -> progressive sweep
  const before = computeGlyphThermodynamics(2, 5, 10.0, 15.0, 10.8);
  assert.equal(before.state, 'ghost');
  assert.equal(before.heat, 0);

  const strike = computeGlyphThermodynamics(2, 5, 10.0, 15.0, before.onsetSec + 0.02);
  assert.equal(strike.state, 'strike');
  assert.ok(strike.heat > 0.8);
  assert.ok(strike.scalePop > 1.08);

  const cooled = computeGlyphThermodynamics(2, 5, 10.0, 15.0, before.onsetSec + 0.6);
  assert.equal(cooled.state, 'cooled');
  assert.ok(cooled.heat < 0.05);

  // Short 1.5s chorus line (< 1.85s) -> full phrase ignited by +0.3s so rapid cuts never cut off unread characters
  const shortLastGlyph = computeGlyphThermodynamics(5, 6, 46.0, 47.5, 46.3);
  assert.notEqual(shortLastGlyph.state, 'ghost');
  assert.equal(shortLastGlyph.alpha, 1);

  assert.equal(resolveDiegeticModeForShot('s16_overpass_sunburst_low'), 'midground_occluded');
  assert.equal(resolveDiegeticModeForShot('s04_viaduct_sunset_wide'), 'midground_occluded');
  assert.equal(resolveDiegeticModeForShot('s05_boulevard_odometer_low'), 'surface_coupled');
  assert.equal(resolveDiegeticModeForShot('s26_solari_fids_delayed_macro'), 'surface_coupled');
});

test('1:7.5 human stride pose and gravity arm IK maintain upright stance and natural downward elbows', () => {
  const midStance = computeHumanStridePose(0.29 * Math.PI * 2);
  assert.equal(midStance.nearLeg.isGrounded, true);
  assert.ok(Math.abs(midStance.nearLeg.ankleOffsetX) < 1.5);
  assert.equal(midStance.nearLeg.ankleLiftY, 0);

  const hipToAnkleMidU = 119.3 + midStance.pelvisBobY - 11;
  const legSumU = 55.5 + 54.5;
  assert.ok(
    hipToAnkleMidU / legSumU > 0.99 && hipToAnkleMidU / legSumU < 1.0,
    `Mid-stance leg extension ratio (${(hipToAnkleMidU / legSumU).toFixed(3)}) must be tall and upright`
  );

  const midSwing = computeHumanStridePose(0.79 * Math.PI * 2);
  assert.equal(midSwing.nearLeg.isGrounded, false);
  assert.equal(midSwing.farLeg.isGrounded, true);
  assert.ok(midSwing.nearLeg.ankleLiftY > 11);

  const armLeft = solveGravityArmIK(320, 140, 260, 178, 38, 37, -1);
  assert.ok(armLeft.elbowY > 140);
  const armRight = solveGravityArmIK(320, 140, 382, 175, 38, 37, 1);
  assert.ok(armRight.elbowY > 140);
});

test('Left/Right shot stepping traverses S01..S66 cleanly without boundary drift', () => {
  // Stepping left at S01 clamps cleanly to S01
  assert.equal(getAdjacentShotSeekTime(0, -1), 0);
  assert.equal(getActiveLyricIndex(getAdjacentShotSeekTime(0, -1)), 0);

  // Stepping right 65 times visits every single shot S01 -> S66 in exact order
  let t = 0;
  for (let expectedIdx = 1; expectedIdx < LYRIC_LINES.length; expectedIdx++) {
    t = getAdjacentShotSeekTime(t, 1);
    const landedIdx = getActiveLyricIndex(t);
    assert.equal(
      landedIdx,
      expectedIdx,
      `Step right to index ${expectedIdx} landed on ${landedIdx} at t=${t}`
    );
    assert.equal(
      resolveActiveShot(t, 'auto', computeBeatState(t)).shotCode,
      LYRIC_LINES[expectedIdx].shotCode
    );
  }

  // Stepping right at S66 stays clamped on S66
  t = getAdjacentShotSeekTime(t, 1);
  assert.equal(getActiveLyricIndex(t), 65);
  assert.equal(resolveActiveShot(t, 'auto', computeBeatState(t)).shotCode, 'S66');

  // Stepping left back down to S01 visits every shot in reverse without skipping
  for (let expectedIdx = LYRIC_LINES.length - 2; expectedIdx >= 0; expectedIdx--) {
    t = getAdjacentShotSeekTime(t, -1);
    assert.equal(getActiveLyricIndex(t), expectedIdx);
  }

  // URL ?s= / ?shot= param resolver
  assert.equal(resolveShotSeekTimeByParam('S01'), 0);
  assert.equal(resolveShotSeekTimeByParam('s03'), getShotSeekTimeByIndex(2));
  assert.equal(resolveShotSeekTimeByParam('66'), getShotSeekTimeByIndex(65));
  assert.equal(resolveShotSeekTimeByParam('S99'), null);
  assert.equal(resolveShotSeekTimeByParam('invalid'), null);
});

test('S01 audio start skips MP3 dead silence and S03 gait has zero floor slip or IK knee snap', () => {
  // Starting playback skips the 2.92s digital-zero MP3 header while remaining inside S01 for >2.8s
  assert.ok(AUDIO_INTRO_SOUND_START_SEC >= 2.9 && AUDIO_INTRO_SOUND_START_SEC < 3.05);
  assert.equal(
    resolveActiveShot(AUDIO_INTRO_SOUND_START_SEC, 'auto', computeBeatState(AUDIO_INTRO_SOUND_START_SEC)).shotCode,
    'S01'
  );
  assert.ok(LYRIC_LINES[0].endTime - AUDIO_INTRO_SOUND_START_SEC > 2.5);

  // S03 contact-locked foot: zero flat-foot slip, continuous transitions, and supple knee ratio
  const u = 1.8;
  const groundY = 724;
  const stepLen = 58 * u;
  const x0 = 360;
  const x1 = x0 + stepLen;
  const x2 = x0 + 2 * stepLen;

  const flatA = sampleS03ContactLockedFoot(true, 0.2, x0, x0 - stepLen, x1, groundY, u);
  const flatB = sampleS03ContactLockedFoot(true, 0.65, x0, x0 - stepLen, x1, groundY, u);
  assert.equal(flatA.ankleX, flatB.ankleX, 'Planted stance foot must have zero horizontal slip');
  assert.equal(flatA.ankleY, flatB.ankleY, 'Planted stance foot must have zero vertical drift');

  const stanceEnd = sampleS03ContactLockedFoot(true, 1.0, x0, x0 - stepLen, x1, groundY, u);
  const swingStart = sampleS03ContactLockedFoot(false, 0.0, x1, x0, x2, groundY, u);
  assert.ok(Math.abs(stanceEnd.ankleX - swingStart.ankleX) < 1e-6);
  assert.ok(Math.abs(stanceEnd.ankleY - swingStart.ankleY) < 1e-6);

  const swingEnd = sampleS03ContactLockedFoot(false, 1.0, x1, x0, x2, groundY, u);
  const nextStanceStart = sampleS03ContactLockedFoot(true, 0.0, x2, x1, x2 + stepLen, groundY, u);
  assert.ok(Math.abs(swingEnd.ankleX - nextStanceStart.ankleX) < 1e-6);
  assert.ok(Math.abs(swingEnd.ankleY - nextStanceStart.ankleY) < 1e-6);

  const legSum = (55 + 53) * u;
  for (let i = 0; i <= 40; i++) {
    const p = i / 40;
    const stance = sampleS03ContactLockedFoot(true, p, x1, x0, x2, groundY, u);
    const hipX = x0 + (1 + p - 0.47) * stepLen + Math.sin(p * Math.PI * 2) * 0.7 * u;
    const hipY = groundY - 7.5 * u - 101.6 * u - Math.sin((p - 0.12) * Math.PI * 2) * 2.1 * u;
    const ratio = Math.hypot(stance.ankleX - hipX, stance.ankleY - hipY) / legSum;
    assert.ok(ratio > 0.91 && ratio < 0.985, `Upright knee ratio ${ratio.toFixed(3)} must be tall yet snap-free`);
  }
});


