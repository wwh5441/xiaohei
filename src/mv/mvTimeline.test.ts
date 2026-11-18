import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LYRIC_LINES, MV_CHAPTERS, SONG_META } from './mvData';
import {
  computeBeatState,
  computeHumanStridePose,
  formatTimecode,
  getActiveChapter,
  getActiveLyricIndex,
  getLyricProgress,
  parseId3CoverArt,
  resolveActiveShot,
  resolveLyricStagePlacement,
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

test('exact LRC lyric timestamps and poetic shot mappings align line by line', () => {
  assert.ok(LYRIC_LINES.length >= 65);
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

  // Verify user's exact LRC moments and matched poetic camera shots!
  const priorityIdx = getActiveLyricIndex(25.5);
  assert.ok(LYRIC_LINES[priorityIdx].text.includes('优先卡'));
  assert.equal(
    resolveActiveShot(25.5, 'auto', computeBeatState(25.5)).shot,
    'priority_tags_macro'
  );

  const flightDelayIdx = getActiveLyricIndex(79.5);
  assert.ok(LYRIC_LINES[flightDelayIdx].text.includes('班机 延误了'));
  assert.equal(
    resolveActiveShot(79.5, 'auto', computeBeatState(79.5)).shot,
    'airport_delay_rain'
  );

  const treeHollowIdx = getActiveLyricIndex(103.2);
  assert.ok(LYRIC_LINES[treeHollowIdx].text.includes('像树洞'));
  assert.equal(
    resolveActiveShot(103.2, 'auto', computeBeatState(103.2)).shot,
    'tree_hollow_poetic'
  );

  const timelapseIdx = getActiveLyricIndex(138.0);
  assert.ok(LYRIC_LINES[timelapseIdx].text.includes('万物都在速朽'));
  assert.equal(
    resolveActiveShot(138.0, 'auto', computeBeatState(138.0)).shot,
    'timelapse_nostalgia'
  );

  const nameTagIdx = getActiveLyricIndex(151.2);
  assert.ok(LYRIC_LINES[nameTagIdx].text.includes('陪着我 姓名'));
  assert.equal(
    resolveActiveShot(151.2, 'auto', computeBeatState(151.2)).shot,
    'nametag_dream_macro'
  );

  // Ensure all 21 distinct camera ShotTypes are exercised across the MV
  const distinctShots = new Set(LYRIC_LINES.map((l) => l.shot));
  assert.equal(distinctShots.size, 21);

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
  // Reachable RIMOWA handle behind walking shoulder
  const arm = solveTwoBoneIK(200, 120, 168, 178, 40, 38, 1);
  const dUpper = Math.hypot(arm.elbowX - 200, arm.elbowY - 120);
  const dFore = Math.hypot(arm.handX - arm.elbowX, arm.handY - arm.elbowY);
  assert.ok(Math.abs(dUpper - 40) < 1e-4);
  assert.ok(Math.abs(dFore - 38) < 1e-4);
  assert.ok(Math.abs(arm.handX - 168) < 1e-4);
  assert.ok(Math.abs(arm.handY - 178) < 1e-4);

  // Standing leg with bendSign = -1 bends knee forward (+X)
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

  // Poetic tree hollow shot uses vertical-rl Chinese poetic typography
  const treeLine = LYRIC_LINES.find((l) => l.shot === 'tree_hollow_poetic')!;
  assert.equal(resolveLyricStagePlacement(treeLine, treeLine.shot).orientation, 'vertical');
});

test('diegetic lyric thermodynamics transitions deterministically from ghost -> strike -> cooled', () => {
  // Line from 10.0s to 15.0s with 5 glyphs -> sungSpan = 4.1s, glyph 2 onset = 10 + (2/5)*4.1 = 11.64s
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

  assert.equal(resolveDiegeticModeForShot('chorus_hero_low'), 'midground_occluded');
  assert.equal(resolveDiegeticModeForShot('traveler_wide'), 'midground_occluded');
  assert.equal(resolveDiegeticModeForShot('boots_wheels_low'), 'surface_coupled');
  assert.equal(resolveDiegeticModeForShot('airport_delay_rain'), 'surface_coupled');
});

test('1:7.5 human stride pose and gravity arm IK maintain upright stance and natural downward elbows', () => {
  // Mid-stance (cycle01 = 0.29 => ankleOffsetX ~ 0): leg span must be ~99% of 110u thigh+calf (zero squatting!)
  const midStance = computeHumanStridePose(0.29 * Math.PI * 2);
  assert.equal(midStance.nearLeg.isGrounded, true);
  assert.ok(Math.abs(midStance.nearLeg.ankleOffsetX) < 1.5);
  assert.equal(midStance.nearLeg.ankleLiftY, 0);

  const hipToAnkleMidU = (119.3 + midStance.pelvisBobY) - 11;
  const legSumU = 55.5 + 54.5; // 110u
  assert.ok(
    hipToAnkleMidU / legSumU > 0.99 && hipToAnkleMidU / legSumU < 1.0,
    `Mid-stance leg extension ratio (${(hipToAnkleMidU / legSumU).toFixed(3)}) must be tall and upright`
  );

  // Mid-swing (cycle01 = 0.79) must clear the ground cleanly while opposite leg stays grounded
  const midSwing = computeHumanStridePose(0.79 * Math.PI * 2);
  assert.equal(midSwing.nearLeg.isGrounded, false);
  assert.equal(midSwing.farLeg.isGrounded, true);
  assert.ok(midSwing.nearLeg.ankleLiftY > 11);

  // Gravity arm IK always picks the lower (+Y) natural elbow rather than an inverted bird-wing elbow
  const armLeft = solveGravityArmIK(320, 140, 260, 178, 38, 37, -1);
  assert.ok(armLeft.elbowY > 140);
  const armRight = solveGravityArmIK(320, 140, 382, 175, 38, 37, 1);
  assert.ok(armRight.elbowY > 140);

  // Terrace balustrade outward right-arm reach extends elbow gently outward & downward clear of torso
  const terraceReach = solveTwoBoneIK(18, -188.2, 35.5, -136.0, 30.5, 29.5, -1);
  assert.ok(terraceReach.handX > 34 && terraceReach.elbowX > 18 && terraceReach.elbowX < 40);
  assert.ok(terraceReach.elbowY > -188.2);

  // Walking tow-pull near arm keeps pulling elbow naturally behind shoulder (-X), never poking forward
  const towPull = solveTwoBoneIK(0, 0, -32, 58, 39, 37, 1);
  assert.ok(towPull.elbowX < 0 && towPull.elbowY > 0);
});
