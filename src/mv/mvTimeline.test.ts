import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LYRIC_LINES, MV_CHAPTERS, SONG_META } from './mvData';
import {
  computeBeatState,
  formatTimecode,
  getActiveChapter,
  getActiveLyricIndex,
  getLyricProgress,
  parseId3CoverArt,
  resolveActiveShot,
} from './mvTimeline';

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
