export type SceneId =
  | 'intro'
  | 'verse1'
  | 'prechorus1'
  | 'chorus1'
  | 'interlude1'
  | 'verse2'
  | 'chorus2'
  | 'whistle'
  | 'bridge'
  | 'finale';

export type ShotCode =
  | 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06' | 'S07' | 'S08' | 'S09' | 'S10' | 'S11'
  | 'S12' | 'S13' | 'S14' | 'S15' | 'S16' | 'S17' | 'S18' | 'S19' | 'S20' | 'S21' | 'S22'
  | 'S23' | 'S24' | 'S25' | 'S26' | 'S27' | 'S28' | 'S29' | 'S30' | 'S31' | 'S32' | 'S33'
  | 'S34' | 'S35' | 'S36' | 'S37' | 'S38' | 'S39' | 'S40' | 'S41' | 'S42' | 'S43' | 'S44'
  | 'S45' | 'S46' | 'S47' | 'S48' | 'S49' | 'S50' | 'S51' | 'S52' | 'S53' | 'S54' | 'S55'
  | 'S56' | 'S57' | 'S58' | 'S59' | 'S60' | 'S61' | 'S62' | 'S63' | 'S64' | 'S65' | 'S66';

export type ShotType =
  // 01. Intro (S01 - S03)
  | 's01_soundhole_rosette'
  | 's02_bridge_percussive_slap'
  | 's03_hallway_wheels_wakeup'
  // 02. Verse 1 (S04 - S11)
  | 's04_viaduct_sunset_wide'
  | 's05_boulevard_odometer_low'
  | 's06_anodized_shell_grazing'
  | 's07_sunset_palm_grip'
  | 's08_fanned_priority_tags'
  | 's09_customs_medal_postmark'
  | 's10_bluehour_stranger_skyline'
  | 's11_escalator_side_support'
  // 03. Pre-Chorus 1 (S12 - S15)
  | 's12_overhead_packed_halves'
  | 's13_misty_gantry_fork_pov'
  | 's14_corner_rivet_patina'
  | 's15_cobblestone_silent_wheels'
  // 04. Chorus 1 (S16 - S23)
  | 's16_overpass_sunburst_low'
  | 's17_diptych_pack_and_carry'
  | 's18_slipstream_tag_whip'
  | 's19_ots_shoulder_horizon'
  | 's20_heavy_load_compression'
  | 's21_tunnel_flare_rush_pov'
  | 's22_crest_leap_silhouette'
  | 's23_brutalist_light_fortress'
  // 05. Interlude 1 (S24)
  | 's24_vinyl_baggage_turntable'
  // 06. Verse 2 (S25 - S36)
  | 's25_terminal_sigh_bench'
  | 's26_solari_fids_delayed_macro'
  | 's27_rain_chilled_hand_warmth'
  | 's28_tarmac_puddle_reflection_low'
  | 's29_neon_rain_wet_tags'
  | 's30_tsa_lock_raindrop_glint'
  | 's31_concourse_crowd_shutter'
  | 's32_gate_pillar_lean_companion'
  | 's33_hotel_night_unsent_letter'
  | 's34_empty_corridor_solitude'
  | 's35_ancient_hollow_rain_intake'
  | 's36_hollow_fireflies_ascend'
  // 07. Chorus 2 (S37 - S44)
  | 's37_stormbreak_lightning_hero'
  | 's38_storm_triptych_montage'
  | 's39_hydroplane_wheel_spray'
  | 's40_dawn_bridge_side_profile'
  | 's41_uphill_step_lift'
  | 's42_cloud_pierce_viaduct_pov'
  | 's43_sunrise_halo_silhouette'
  | 's44_teal_gold_sanctuary_dome'
  // 08. Whistle Solo (S45)
  | 's45_kamakura_whistle_coast'
  // 09. Bridge (S46 - S53)
  | 's46_street_timelapse_sanctuary'
  | 's47_halted_wheel_autumn_leaf'
  | 's48_entryway_place_by_door'
  | 's49_sunbeam_plant_companionship'
  | 's50_golden_keepsake_trunk'
  | 's51_cognac_nametag_foil'
  | 's52_cradling_hands_on_shell'
  | 's53_polaroid_twine_wall_crescendo'
  // 10. Finale & Outro (S54 - S66)
  | 's54_finale_solar_zenith_burst'
  | 's55_memory_era_triptych'
  | 's56_airborne_stickers_celebration'
  | 's57_golden_promenade_ots'
  | 's58_sparkling_runway_wheels'
  | 's59_horizon_lightgate_breakthrough'
  | 's60_sky_lantern_ember_crest'
  | 's61_golden_cathedral_bastion'
  | 's62_aerial_causeway_duo'
  | 's63_sticker_mosaic_shell_pan'
  | 's64_sunset_tag_backlit_glow'
  | 's65_twilight_pier_stillness'
  | 's66_uyuni_mirror_outro';

export type CameraMode = 'auto' | 'low_track' | 'macro' | 'cinema_wide';
export type SubtitleMode = 'cinema' | 'diegetic';
export type LyricPunch = 'groove' | 'slam' | 'rain' | 'whistle' | 'warm' | 'finale';

export type LyricSpatialZone =
  | 'sky_upper_left'
  | 'sky_upper_right'
  | 'stage_lower_left'
  | 'stage_lower_right'
  | 'poetic_vertical_right'
  | 'poetic_vertical_left'
  | 'chorus_impact_left'
  | 'chorus_impact_right'
  | 'monolith_bottom_center'
  | 'horizon_upper_center';

export interface ShotSpec {
  code: ShotCode;
  shot: ShotType;
  label: string;
  lensMm: number;
  zoomStart: number;
  zoomEnd: number;
  panStartX: number;
  panEndX: number;
  panStartY: number;
  panEndY: number;
  dutchDeg: number;
  diegeticMode: 'midground_occluded' | 'surface_coupled';
  lyricZone: LyricSpatialZone;
  freezeWheel?: boolean;
  suppressSparks?: boolean;
  instantSlam?: boolean;
}

export interface MVChapter {
  id: SceneId;
  indexLabel: string;
  title: string;
  subtitle: string;
  startTime: number;
  endTime: number;
  energyBase: number;
  accentHex: string;
  secondaryHex: string;
  bgHex: string;
}

export interface LyricLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  echoText?: string;
  emphasis?: string;
  punch: LyricPunch;
  chapterId: SceneId;
  shotCode: ShotCode;
  shot: ShotType;
  shotLabel: string;
}

export interface TravelStickerSpec {
  code: string;
  label: string;
  year: string;
  bg: string;
  fg: string;
}

export const AUDIO_SRC = '/assets/aistudio/Ham_-______3c70d5e7.mp3';
/** The studio MP3 file contains 2.95s of -260dB digital silence padding at 0.00s..2.95s before the first guitar note. */
export const AUDIO_INTRO_SOUND_START_SEC = 2.92;

export const SONG_META = {
  title: '嘿！小黑',
  artist: 'Ham',
  album: 'To 我的好朋友',
  bpm: 96,
  beatIntervalSec: 60 / 96, // 0.625s per beat
  barIntervalSec: (60 / 96) * 4, // 2.50s per 4/4 bar
  beatOffsetSec: 3.25,
  durationSec: 212.04,
} as const;

export const TRAVEL_STICKERS: TravelStickerSpec[] = [
  { code: 'PRIORITY', label: '优先行李 · FIRST CLASS', year: '2018', bg: '#f59e0b', fg: '#09090b' },
  { code: 'PEK · T3', label: '首都机场 · 优先卡', year: '2019', bg: '#ea580c', fg: '#ffffff' },
  { code: 'SHA · 01', label: '虹桥出发 · 勋章', year: '2020', bg: '#facc15', fg: '#09090b' },
  { code: 'CTU · NIGHT', label: '双流夜航 · 延误签', year: '2021', bg: '#38bdf8', fg: '#082f49' },
  { code: 'CAN · VIP', label: '白云中转 · PRIORITY', year: '2022', bg: '#fb7185', fg: '#4c0519' },
  { code: 'HGH · 20"', label: '二十寸随行堡垒', year: '2023', bg: '#10b981', fg: '#052e16' },
  { code: 'XMN · SEA', label: '高崎海风 · 优先贴', year: '2024', bg: '#a3e635', fg: '#1a2e05' },
  { code: 'HOME · 归', label: '旧日风景 · 珍藏', year: '2026', bg: '#fde047', fg: '#09090b' },
];

export const MV_CHAPTERS: MVChapter[] = [
  {
    id: 'intro',
    indexLabel: '01',
    title: '前奏 · 弦动启程',
    subtitle: '木吉他音孔微距击弦，晨光玄关滚轮轻转启程',
    startTime: 0,
    endTime: 14.124,
    energyBase: 0.36,
    accentHex: '#f59e0b',
    secondaryHex: '#fbbf24',
    bgHex: '#09090b',
  },
  {
    id: 'verse1',
    indexLabel: '02',
    title: '主歌 · 丈量从前',
    subtitle: '小小滚轮丈量岁月，斑驳优先卡攒下旅途勋章',
    startTime: 14.124,
    endTime: 35.253,
    energyBase: 0.54,
    accentHex: '#f59e0b',
    secondaryHex: '#38bdf8',
    bgHex: '#0b0e15',
  },
  {
    id: 'prechorus1',
    indexLabel: '03',
    title: '蓄势 · 半生俗世',
    subtitle: '装满半生俗世沉重过往，被颠沛时也悄无声响',
    startTime: 35.253,
    endTime: 45.986,
    energyBase: 0.68,
    accentHex: '#fb923c',
    secondaryHex: '#f43f5e',
    bgHex: '#120d14',
  },
  {
    id: 'chorus1',
    indexLabel: '04',
    title: '副歌 · 安稳堡垒',
    subtitle: '替我装、替我扛，尔似在我肩的安稳堡垒',
    startTime: 45.986,
    endTime: 67.5,
    energyBase: 0.94,
    accentHex: '#facc15',
    secondaryHex: '#ef4444',
    bgHex: '#140b09',
  },
  {
    id: 'interlude1',
    indexLabel: '05',
    title: '间奏 · 行李转盘',
    subtitle: '96 BPM Funk 切分鼓点与黑胶行李转盘共振',
    startTime: 67.5,
    endTime: 76.793,
    energyBase: 0.82,
    accentHex: '#fbbf24',
    secondaryHex: '#06b6d4',
    bgHex: '#091017',
  },
  {
    id: 'verse2',
    indexLabel: '06',
    title: '航站 · 暴雨延误',
    subtitle: '等暴雨这班机延误了，把拉杆温度全记得，像树洞咽下悲欢',
    startTime: 76.793,
    endTime: 107.754,
    energyBase: 0.62,
    accentHex: '#38bdf8',
    secondaryHex: '#f59e0b',
    bgHex: '#060d18',
  },
  {
    id: 'chorus2',
    indexLabel: '07',
    title: '副歌 · 破雨同行',
    subtitle: '哪怕生活添上重量，前路跌撞迷茫，你最是安稳堡垒',
    startTime: 107.754,
    endTime: 128.0,
    energyBase: 0.95,
    accentHex: '#f59e0b',
    secondaryHex: '#06b6d4',
    bgHex: '#0c0b18',
  },
  {
    id: 'whistle',
    indexLabel: '08',
    title: '独奏 · 自由口哨',
    subtitle: '雨过天晴海岸悬崖，自由口哨声波携白鸥滑翔',
    startTime: 128.0,
    endTime: 137.341,
    energyBase: 0.86,
    accentHex: '#2dd4bf',
    secondaryHex: '#facc15',
    bgHex: '#07161b',
  },
  {
    id: 'bridge',
    indexLabel: '09',
    title: '桥段 · 唯你念旧',
    subtitle: '万物都在速朽唯有你念旧，放在家门口边陪着我姓名',
    startTime: 137.341,
    endTime: 165.468,
    energyBase: 0.48,
    accentHex: '#fbbf24',
    secondaryHex: '#fb7185',
    bgHex: '#14100b',
  },
  {
    id: 'finale',
    indexLabel: '10',
    title: '终章 · 尔似在肩',
    subtitle: '十三连独立高光蒙太奇，乌尤尼镜面背影致我的好朋友',
    startTime: 165.468,
    endTime: 212.04,
    energyBase: 1.0,
    accentHex: '#facc15',
    secondaryHex: '#ef4444',
    bgHex: '#120907',
  },
];

function mkShot(
  code: ShotCode,
  shot: ShotType,
  label: string,
  lensMm: number,
  lyricZone: LyricSpatialZone,
  diegeticMode: 'midground_occluded' | 'surface_coupled',
  opts?: Partial<
    Pick<
      ShotSpec,
      | 'zoomStart'
      | 'zoomEnd'
      | 'panStartX'
      | 'panEndX'
      | 'panStartY'
      | 'panEndY'
      | 'dutchDeg'
      | 'freezeWheel'
      | 'suppressSparks'
      | 'instantSlam'
    >
  >
): ShotSpec {
  return {
    code,
    shot,
    label,
    lensMm,
    zoomStart: opts?.zoomStart ?? 1.0,
    zoomEnd: opts?.zoomEnd ?? 1.04,
    panStartX: opts?.panStartX ?? 0,
    panEndX: opts?.panEndX ?? 0,
    panStartY: opts?.panStartY ?? 0,
    panEndY: opts?.panEndY ?? 0,
    dutchDeg: opts?.dutchDeg ?? 0,
    diegeticMode,
    lyricZone,
    freezeWheel: opts?.freezeWheel ?? false,
    suppressSparks: opts?.suppressSparks ?? true,
    instantSlam: opts?.instantSlam ?? false,
  };
}

export const SHOT_SPECS: Record<ShotType, ShotSpec> = {
  // 01. Intro (S01 - S03)
  s01_soundhole_rosette: mkShot('S01', 's01_soundhole_rosette', '85mm 音孔内标垂直微距推镜', 85, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.12,
    freezeWheel: true,
  }),
  s02_bridge_percussive_slap: mkShot('S02', 's02_bridge_percussive_slap', '45° 玫瑰木琴码切分击弦特写', 50, 'stage_lower_left', 'surface_coupled', {
    zoomStart: 1.02,
    zoomEnd: 1.08,
    dutchDeg: -2.2,
    freezeWheel: true,
  }),
  s03_hallway_wheels_wakeup: mkShot('S03', 's03_hallway_wheels_wakeup', '晨光玄关木地板 · 拉杆升起启程', 35, 'sky_upper_right', 'surface_coupled', {
    panStartX: -0.02,
    panEndX: 0.02,
  }),

  // 02. Verse 1 (S04 - S11)
  s04_viaduct_sunset_wide: mkShot('S04', 's04_viaduct_sunset_wide', '24mm 落日跨海悬索桥大远景', 24, 'sky_upper_left', 'midground_occluded', {
    panStartX: -0.015,
    panEndX: 0.015,
  }),
  s05_boulevard_odometer_low: mkShot('S05', 's05_boulevard_odometer_low', '35mm 贴地滚轮与皮靴里程微距', 35, 'sky_upper_right', 'surface_coupled', {
    zoomStart: 1.02,
    zoomEnd: 1.07,
  }),
  s06_anodized_shell_grazing: mkShot('S06', 's06_anodized_shell_grazing', '100mm 铝镁沟槽掠射光与096锁微距', 100, 'poetic_vertical_right', 'surface_coupled', {
    panStartX: -0.02,
    panEndX: 0.02,
    freezeWheel: true,
  }),
  s07_sunset_palm_grip: mkShot('S07', 's07_sunset_palm_grip', '85mm 暮色暖金散景手握拉杆特写', 85, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),
  s08_fanned_priority_tags: mkShot('S08', 's08_fanned_priority_tags', '提手层叠 PRIORITY 优先卡翻飞微距', 85, 'stage_lower_left', 'surface_coupled', {
    freezeWheel: true,
  }),
  s09_customs_medal_postmark: mkShot('S09', 's09_customs_medal_postmark', '超微距航司金色邮戳勋章定格', 105, 'stage_lower_right', 'surface_coupled', {
    zoomStart: 1.04,
    zoomEnd: 1.12,
    freezeWheel: true,
  }),
  s10_bluehour_stranger_skyline: mkShot('S10', 's10_bluehour_stranger_skyline', '蓝调时刻异乡江岸霓虹远景', 50, 'sky_upper_left', 'midground_occluded', {
    panStartX: 0.015,
    panEndX: -0.015,
  }),
  s11_escalator_side_support: mkShot('S11', 's11_escalator_side_support', '车站自动扶梯斜向托住行囊中景', 50, 'sky_upper_left', 'surface_coupled', {
    panStartY: 0.018,
    panEndY: -0.018,
    freezeWheel: true,
  }),

  // 03. Pre-Chorus 1 (S12 - S15)
  s12_overhead_packed_halves: mkShot('S12', 's12_overhead_packed_halves', '垂直俯拍胡桃木开箱旧物平铺', 35, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),
  s13_misty_gantry_fork_pov: mkShot('S13', 's13_misty_gantry_fork_pov', '主观推箱走向迷雾 Y 字高架分岔口', 28, 'stage_lower_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.09,
  }),
  s14_corner_rivet_patina: mkShot('S14', 's14_corner_rivet_patina', '街角钠灯下铝镁护角铆钉撞痕微距', 100, 'poetic_vertical_left', 'surface_coupled', {
    freezeWheel: true,
  }),
  s15_cobblestone_silent_wheels: mkShot('S15', 's15_cobblestone_silent_wheels', '老城青石板路静音万向轮减震微距', 50, 'sky_upper_right', 'surface_coupled', {
    zoomStart: 1.01,
    zoomEnd: 1.06,
  }),

  // 04. Chorus 1 (S16 - S23)
  s16_overpass_sunburst_low: mkShot('S16', 's16_overpass_sunburst_low', '18mm 天桥超低仰角烈日破云主镜', 18, 'chorus_impact_left', 'midground_occluded', {
    zoomStart: 1.02,
    zoomEnd: 1.1,
    suppressSparks: false,
  }),
  s17_diptych_pack_and_carry: mkShot('S17', 's17_diptych_pack_and_carry', '斜切双联动态蒙太奇 · 替我装替我扛', 35, 'stage_lower_left', 'surface_coupled', {
    suppressSparks: false,
  }),
  s18_slipstream_tag_whip: mkShot('S18', 's18_slipstream_tag_whip', '疾驰气流橙红优先签横飞特写', 85, 'chorus_impact_right', 'surface_coupled', {
    dutchDeg: -2.5,
    suppressSparks: false,
    instantSlam: true,
  }),
  s19_ots_shoulder_horizon: mkShot('S19', 's19_ots_shoulder_horizon', '85mm 越肩近景 · 拉杆与肩平齐望海港', 85, 'sky_upper_left', 'midground_occluded', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
  }),
  s20_heavy_load_compression: mkShot('S20', 's20_heavy_load_compression', '箱顶承重缓冲回弹力场特写', 50, 'stage_lower_right', 'surface_coupled', {
    instantSlam: true,
    suppressSparks: false,
  }),
  s21_tunnel_flare_rush_pov: mkShot('S21', 's21_tunnel_flare_rush_pov', '城市弧形钠灯隧道主观冲刺镜头', 24, 'stage_lower_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.12,
    dutchDeg: 1.8,
    suppressSparks: false,
  }),
  s22_crest_leap_silhouette: mkShot('S22', 's22_crest_leap_silhouette', '-4° 荷兰斜角钢拱风衣跃动剪影', 28, 'chorus_impact_left', 'midground_occluded', {
    dutchDeg: -4,
    suppressSparks: false,
    instantSlam: true,
  }),
  s23_brutalist_light_fortress: mkShot('S23', 's23_brutalist_light_fortress', '粗野主义混凝土光之柱廊堡垒', 24, 'monolith_bottom_center', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.07,
    freezeWheel: true,
  }),

  // 05. Interlude 1 (S24)
  s24_vinyl_baggage_turntable: mkShot('S24', 's24_vinyl_baggage_turntable', '96 BPM 发烧黑胶 × 机场行李转盘俯拍', 35, 'stage_lower_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.05,
    freezeWheel: true,
  }),

  // 06. Verse 2 (S25 - S36)
  s25_terminal_sigh_bench: mkShot('S25', 's25_terminal_sigh_bench', '深夜暴雨候机厅落地窗旁轻叹中景', 50, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.05,
    freezeWheel: true,
  }),
  s26_solari_fids_delayed_macro: mkShot('S26', 's26_solari_fids_delayed_macro', '135mm 意大利机械翻页延误屏正面特写', 135, 'stage_lower_right', 'surface_coupled', {
    zoomStart: 1.02,
    zoomEnd: 1.08,
    freezeWheel: true,
  }),
  s27_rain_chilled_hand_warmth: mkShot('S27', 's27_rain_chilled_hand_warmth', '暴雨窗蓝绿散景下掌心拉杆余温微距', 85, 'sky_upper_left', 'surface_coupled', {
    freezeWheel: true,
  }),
  s28_tarmac_puddle_reflection_low: mkShot('S28', 's28_tarmac_puddle_reflection_low', '航站外积水路面红蓝霓虹倒影跟拍', 35, 'sky_upper_right', 'surface_coupled', {
    panStartX: -0.015,
    panEndX: 0.015,
  }),
  s29_neon_rain_wet_tags: mkShot('S29', 's29_neon_rain_wet_tags', '冷雨霓虹水珠挂满双流延误签微距', 90, 'stage_lower_left', 'surface_coupled', {
    freezeWheel: true,
  }),
  s30_tsa_lock_raindrop_glint: mkShot('S30', 's30_tsa_lock_raindrop_glint', '冷蓝风暴光下箱脊银色划痕与水珠微距', 100, 'poetic_vertical_right', 'surface_coupled', {
    dutchDeg: -2,
    freezeWheel: true,
  }),
  s31_concourse_crowd_shutter: mkShot('S31', 's31_concourse_crowd_shutter', '航站穹顶大厅慢门人潮聚散长焦', 85, 'sky_upper_right', 'surface_coupled', {
    freezeWheel: true,
  }),
  s32_gate_pillar_lean_companion: mkShot('S32', 's32_gate_pillar_lean_companion', '深夜登机口雨窗立柱旁暖光倚靠近景', 50, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),
  s33_hotel_night_unsent_letter: mkShot('S33', 's33_hotel_night_unsent_letter', '中转旅馆单盏暖台灯半开箱未寄信笺', 50, 'sky_upper_right', 'surface_coupled', {
    freezeWheel: true,
  }),
  s34_empty_corridor_solitude: mkShot('S34', 's34_empty_corridor_solitude', '凌晨两点空无一人航站长廊孤影全景', 24, 'horizon_upper_center', 'surface_coupled', {
    zoomStart: 1.04,
    zoomEnd: 0.99,
    freezeWheel: true,
  }),
  s35_ancient_hollow_rain_intake: mkShot('S35', 's35_ancient_hollow_rain_intake', '迷雾冷杉林与微光古树洞纳雨中远景', 50, 'poetic_vertical_right', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),
  s36_hollow_fireflies_ascend: mkShot('S36', 's36_hollow_fireflies_ascend', '古树洞拱门内景 · 雨止化流萤升空特写', 85, 'poetic_vertical_left', 'surface_coupled', {
    zoomStart: 1.04,
    zoomEnd: 1.12,
    freezeWheel: true,
  }),

  // 07. Chorus 2 (S37 - S44)
  s37_stormbreak_lightning_hero: mkShot('S37', 's37_stormbreak_lightning_hero', '破雨裂云强拍瞬时定格仰拍', 18, 'chorus_impact_right', 'midground_occluded', {
    zoomStart: 1.04,
    zoomEnd: 1.12,
    suppressSparks: false,
    instantSlam: true,
  }),
  s38_storm_triptych_montage: mkShot('S38', 's38_storm_triptych_montage', '破雨突围三拍快切蒙太奇', 35, 'stage_lower_left', 'surface_coupled', {
    suppressSparks: false,
  }),
  s39_hydroplane_wheel_spray: mkShot('S39', 's39_hydroplane_wheel_spray', '超高速贴地万向轮破水羽翼特写', 50, 'chorus_impact_left', 'surface_coupled', {
    dutchDeg: -2.5,
    suppressSparks: false,
    instantSlam: true,
  }),
  s40_dawn_bridge_side_profile: mkShot('S40', 's40_dawn_bridge_side_profile', '雨后初霁跨海步道并肩疾行半身跟拍', 50, 'sky_upper_left', 'midground_occluded', {
    panStartX: -0.02,
    panEndX: 0.02,
  }),
  s41_uphill_step_lift: mkShot('S41', 's41_uphill_step_lift', '雨后湿石阶手提顶把迈步登高特写', 35, 'stage_lower_right', 'surface_coupled', {
    panStartY: 0.02,
    panEndY: -0.02,
    instantSlam: true,
    freezeWheel: true,
  }),
  s42_cloud_pierce_viaduct_pov: mkShot('S42', 's42_cloud_pierce_viaduct_pov', '穿云跨海高架冲出晨雾见碧海主观镜', 24, 'stage_lower_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.11,
  }),
  s43_sunrise_halo_silhouette: mkShot('S43', 's43_sunrise_halo_silhouette', '海崖观景台正逆光朝阳日环剪影', 35, 'chorus_impact_right', 'midground_occluded', {
    instantSlam: true,
  }),
  s44_teal_gold_sanctuary_dome: mkShot('S44', 's44_teal_gold_sanctuary_dome', '面朝晴空碧海的敞廊青金光之圣殿', 24, 'monolith_bottom_center', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),

  // 08. Whistle Solo (S45)
  s45_kamakura_whistle_coast: mkShot('S45', 's45_kamakura_whistle_coast', '晴空碧海公路航拍 × 高频金色音符丝带', 28, 'stage_lower_left', 'midground_occluded', {
    panStartX: -0.02,
    panEndX: 0.02,
  }),

  // 09. Bridge (S46 - S53)
  s46_street_timelapse_sanctuary: mkShot('S46', 's46_street_timelapse_sanctuary', '王家卫式抽帧延时街景 · 街灯光池静驻', 35, 'poetic_vertical_left', 'surface_coupled', {
    freezeWheel: true,
  }),
  s47_halted_wheel_autumn_leaf: mkShot('S47', 's47_halted_wheel_autumn_leaf', '静止沧桑旧转轮与飘落银杏叶微距', 100, 'stage_lower_right', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
    suppressSparks: true,
  }),
  s48_entryway_place_by_door: mkShot('S48', 's48_entryway_place_by_door', '归家玄关斜阳中景 · 安放木门口边', 35, 'sky_upper_right', 'surface_coupled', {
    freezeWheel: true,
  }),
  s49_sunbeam_plant_companionship: mkShot('S49', 's49_sunbeam_plant_companionship', '退役化作玄关边桌 · 黄铜钥匙盘与绿植', 65, 'poetic_vertical_right', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),
  s50_golden_keepsake_trunk: mkShot('S50', 's50_golden_keepsake_trunk', '斜阳金尘下的旧梦珍藏信札票根特写', 50, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.07,
    freezeWheel: true,
  }),
  s51_cognac_nametag_foil: mkShot('S51', 's51_cognac_nametag_foil', '自适应干邑马鞍皮吊牌 24K 烫金微距', 100, 'stage_lower_left', 'surface_coupled', {
    freezeWheel: true,
  }),
  s52_cradling_hands_on_shell: mkShot('S52', 's52_cradling_hands_on_shell', '暖阳下双手温柔轻抚箱顶护角特写', 85, 'sky_upper_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.06,
    freezeWheel: true,
  }),
  s53_polaroid_twine_wall_crescendo: mkShot('S53', 's53_polaroid_twine_wall_crescendo', '麻绳木夹六幅拍立得记忆墙 9.7 秒慢推', 50, 'horizon_upper_center', 'surface_coupled', {
    zoomStart: 0.98,
    zoomEnd: 1.18,
    freezeWheel: true,
  }),

  // 10. Finale & Outro (S54 - S66)
  s54_finale_solar_zenith_burst: mkShot('S54', 's54_finale_solar_zenith_burst', '终章天顶金日全开爆发仰拍', 18, 'chorus_impact_left', 'midground_occluded', {
    zoomStart: 1.04,
    zoomEnd: 1.14,
    suppressSparks: false,
    instantSlam: true,
  }),
  s55_memory_era_triptych: mkShot('S55', 's55_memory_era_triptych', '跨年代三幕记忆回闪三联画蒙太奇', 35, 'stage_lower_left', 'surface_coupled', {
    suppressSparks: false,
  }),
  s56_airborne_stickers_celebration: mkShot('S56', 's56_airborne_stickers_celebration', '漫天八城优先卡与勋章鎏金旋舞特写', 50, 'chorus_impact_right', 'surface_coupled', {
    suppressSparks: false,
    instantSlam: true,
  }),
  s57_golden_promenade_ots: mkShot('S57', 's57_golden_promenade_ots', '鎏金暮光海滨长廊越肩伴行近景', 85, 'sky_upper_left', 'midground_occluded', {
    panStartX: -0.015,
    panEndX: 0.015,
  }),
  s58_sparkling_runway_wheels: mkShot('S58', 's58_sparkling_runway_wheels', '金色大道中心线四轮疾驰光轨微距', 35, 'horizon_upper_center', 'surface_coupled', {
    suppressSparks: false,
    instantSlam: true,
  }),
  s59_horizon_lightgate_breakthrough: mkShot('S59', 's59_horizon_lightgate_breakthrough', '冲破晨昏云门见辽阔金海主观大镜头', 24, 'stage_lower_left', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.12,
  }),
  s60_sky_lantern_ember_crest: mkShot('S60', 's60_sky_lantern_ember_crest', '漫天流金星火升腾的崖顶英雄剪影', 28, 'chorus_impact_left', 'midground_occluded', {
    suppressSparks: false,
    instantSlam: true,
  }),
  s61_golden_cathedral_bastion: mkShot('S61', 's61_golden_cathedral_bastion', '终极熔金晚霞天光圣殿全景', 24, 'monolith_bottom_center', 'surface_coupled', {
    zoomStart: 1.0,
    zoomEnd: 1.07,
    freezeWheel: true,
  }),
  s62_aerial_causeway_duo: mkShot('S62', 's62_aerial_causeway_duo', '高空摇臂俯瞰跨海金光长堤双长影', 35, 'sky_upper_right', 'midground_occluded', {
    zoomStart: 1.06,
    zoomEnd: 0.98,
    instantSlam: true,
  }),
  s63_sticker_mosaic_shell_pan: mkShot('S63', 's63_sticker_mosaic_shell_pan', '贴满全套旅途勋章的箱壳横摇巡礼特写', 85, 'stage_lower_left', 'surface_coupled', {
    panStartX: -0.03,
    panEndX: 0.03,
    freezeWheel: true,
  }),
  s64_sunset_tag_backlit_glow: mkShot('S64', 's64_sunset_tag_backlit_glow', '室外落日熔金逆光下的皮质吊牌剪影微距', 100, 'stage_lower_right', 'surface_coupled', {
    freezeWheel: true,
    instantSlam: true,
  }),
  s65_twilight_pier_stillness: mkShot('S65', 's65_twilight_pier_stillness', '暮色木栈道尽头晚星初亮并肩定格', 50, 'horizon_upper_center', 'midground_occluded', {
    zoomStart: 1.03,
    zoomEnd: 1.0,
    freezeWheel: true,
  }),
  s66_uyuni_mirror_outro: mkShot('S66', 's66_uyuni_mirror_outro', '乌尤尼天空之镜背影纵深远行与致谢落版', 35, 'horizon_upper_center', 'surface_coupled', {
    zoomStart: 1.02,
    zoomEnd: 0.97,
  }),
};

export const SHOT_LABELS: Record<ShotType, string> = Object.fromEntries(
  Object.values(SHOT_SPECS).map((spec) => [spec.shot, `${spec.code} · ${spec.label}`])
) as Record<ShotType, string>;

export const LYRIC_LINES: LyricLine[] = [
  // 01. Intro (00:00 -> 00:14.124)
  {
    id: 'l-01',
    startTime: 0.0,
    endTime: 5.75,
    text: 'Ham ·《嘿！小黑》',
    echoText: 'To 我的好朋友 · 电影级分镜 MV',
    emphasis: '嘿！小黑',
    punch: 'groove',
    chapterId: 'intro',
    shotCode: 'S01',
    shot: 's01_soundhole_rosette',
    shotLabel: SHOT_SPECS.s01_soundhole_rosette.label,
  },
  {
    id: 'l-02',
    startTime: 5.75,
    endTime: 9.6,
    text: '♪ 木吉他切分击弦 · 旅途启幕 ♪',
    echoText: 'ACOUSTIC PERCUSSIVE INTRO',
    punch: 'groove',
    chapterId: 'intro',
    shotCode: 'S02',
    shot: 's02_bridge_percussive_slap',
    shotLabel: SHOT_SPECS.s02_bridge_percussive_slap.label,
  },
  {
    id: 'l-03',
    startTime: 9.6,
    endTime: 14.124,
    text: 'Hmm ~ 老伙计，又该出发了',
    punch: 'groove',
    chapterId: 'intro',
    shotCode: 'S03',
    shot: 's03_hallway_wheels_wakeup',
    shotLabel: SHOT_SPECS.s03_hallway_wheels_wakeup.label,
  },

  // 02. Verse 1
  {
    id: 'l-04',
    startTime: 14.124,
    endTime: 16.667,
    text: '嘿 伙计 同行好多年',
    emphasis: '同行好多年',
    punch: 'groove',
    chapterId: 'verse1',
    shotCode: 'S04',
    shot: 's04_viaduct_sunset_wide',
    shotLabel: SHOT_SPECS.s04_viaduct_sunset_wide.label,
  },
  {
    id: 'l-05',
    startTime: 16.667,
    endTime: 19.164,
    text: '小小的滚轮 丈量从前',
    emphasis: '小小的滚轮',
    punch: 'groove',
    chapterId: 'verse1',
    shotCode: 'S05',
    shot: 's05_boulevard_odometer_low',
    shotLabel: SHOT_SPECS.s05_boulevard_odometer_low.label,
  },
  {
    id: 'l-06',
    startTime: 19.164,
    endTime: 21.211,
    text: '告别 褪去的颜',
    emphasis: '褪去的颜',
    punch: 'warm',
    chapterId: 'verse1',
    shotCode: 'S06',
    shot: 's06_anodized_shell_grazing',
    shotLabel: SHOT_SPECS.s06_anodized_shell_grazing.label,
  },
  {
    id: 'l-07',
    startTime: 21.211,
    endTime: 25.036,
    text: '却更懂我 妥协 疲倦 那几年',
    emphasis: '懂我妥协',
    punch: 'warm',
    chapterId: 'verse1',
    shotCode: 'S07',
    shot: 's07_sunset_palm_grip',
    shotLabel: SHOT_SPECS.s07_sunset_palm_grip.label,
  },
  {
    id: 'l-08',
    startTime: 25.036,
    endTime: 28.095,
    text: '看斑驳堆叠 那些优先卡',
    emphasis: '优先卡',
    punch: 'groove',
    chapterId: 'verse1',
    shotCode: 'S08',
    shot: 's08_fanned_priority_tags',
    shotLabel: SHOT_SPECS.s08_fanned_priority_tags.label,
  },
  {
    id: 'l-09',
    startTime: 28.095,
    endTime: 30.098,
    text: '像你陪伴我，攒下勋章',
    emphasis: '攒下勋章',
    punch: 'groove',
    chapterId: 'verse1',
    shotCode: 'S09',
    shot: 's09_customs_medal_postmark',
    shotLabel: SHOT_SPECS.s09_customs_medal_postmark.label,
  },
  {
    id: 'l-10',
    startTime: 30.098,
    endTime: 32.888,
    text: '陌生的远方 有熟悉的陪伴',
    emphasis: '熟悉的陪伴',
    punch: 'groove',
    chapterId: 'verse1',
    shotCode: 'S10',
    shot: 's10_bluehour_stranger_skyline',
    shotLabel: SHOT_SPECS.s10_bluehour_stranger_skyline.label,
  },
  {
    id: 'l-11',
    startTime: 32.888,
    endTime: 35.253,
    text: '依然 稳托住我 行囊',
    emphasis: '稳托住我',
    punch: 'groove',
    chapterId: 'verse1',
    shotCode: 'S11',
    shot: 's11_escalator_side_support',
    shotLabel: SHOT_SPECS.s11_escalator_side_support.label,
  },

  // 03. Pre-Chorus 1
  {
    id: 'l-12',
    startTime: 35.253,
    endTime: 37.795,
    text: '装满半生俗世 这沉重的过往',
    emphasis: '半生俗世',
    punch: 'warm',
    chapterId: 'prechorus1',
    shotCode: 'S12',
    shot: 's12_overhead_packed_halves',
    shotLabel: SHOT_SPECS.s12_overhead_packed_halves.label,
  },
  {
    id: 'l-13',
    startTime: 37.795,
    endTime: 40.179,
    text: '不曾问，未来的去向 何方',
    emphasis: '去向何方',
    punch: 'warm',
    chapterId: 'prechorus1',
    shotCode: 'S13',
    shot: 's13_misty_gantry_fork_pov',
    shotLabel: SHOT_SPECS.s13_misty_gantry_fork_pov.label,
  },
  {
    id: 'l-14',
    startTime: 40.179,
    endTime: 42.766,
    text: '像老友懂我 咽下的沧桑',
    emphasis: '咽下的沧桑',
    punch: 'warm',
    chapterId: 'prechorus1',
    shotCode: 'S14',
    shot: 's14_corner_rivet_patina',
    shotLabel: SHOT_SPECS.s14_corner_rivet_patina.label,
  },
  {
    id: 'l-15',
    startTime: 42.766,
    endTime: 45.986,
    text: '就算是，被颠沛时 也没有声响',
    emphasis: '没有声响',
    punch: 'warm',
    chapterId: 'prechorus1',
    shotCode: 'S15',
    shot: 's15_cobblestone_silent_wheels',
    shotLabel: SHOT_SPECS.s15_cobblestone_silent_wheels.label,
  },

  // 04. Chorus 1
  {
    id: 'l-16',
    startTime: 45.986,
    endTime: 48.571,
    text: '嘿呀 还是你呀',
    echoText: 'HEY! STILL YOU!',
    emphasis: '还是你呀',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S16',
    shot: 's16_overpass_sunburst_low',
    shotLabel: SHOT_SPECS.s16_overpass_sunburst_low.label,
  },
  {
    id: 'l-17',
    startTime: 48.571,
    endTime: 51.655,
    text: '替我装，替我扛',
    echoText: 'PACK IT ALL · CARRY THE WEIGHT',
    emphasis: '替我装，替我扛',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S17',
    shot: 's17_diptych_pack_and_carry',
    shotLabel: SHOT_SPECS.s17_diptych_pack_and_carry.label,
  },
  {
    id: 'l-18',
    startTime: 51.655,
    endTime: 53.296,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S18',
    shot: 's18_slipstream_tag_whip',
    shotLabel: SHOT_SPECS.s18_slipstream_tag_whip.label,
  },
  {
    id: 'l-19',
    startTime: 53.296,
    endTime: 56.762,
    text: '尔似 在我肩',
    echoText: 'SIDE BY SIDE UPON MY SHOULDER',
    emphasis: '尔似 在我肩',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S19',
    shot: 's19_ots_shoulder_horizon',
    shotLabel: SHOT_SPECS.s19_ots_shoulder_horizon.label,
  },
  {
    id: 'l-20',
    startTime: 56.762,
    endTime: 58.29,
    text: '哪怕 生活 添上重量',
    emphasis: '添上重量',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S20',
    shot: 's20_heavy_load_compression',
    shotLabel: SHOT_SPECS.s20_heavy_load_compression.label,
  },
  {
    id: 'l-21',
    startTime: 58.29,
    endTime: 61.398,
    text: '哪怕那前路 跌撞迷茫',
    emphasis: '跌撞迷茫',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S21',
    shot: 's21_tunnel_flare_rush_pov',
    shotLabel: SHOT_SPECS.s21_tunnel_flare_rush_pov.label,
  },
  {
    id: 'l-22',
    startTime: 61.398,
    endTime: 63.107,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S22',
    shot: 's22_crest_leap_silhouette',
    shotLabel: SHOT_SPECS.s22_crest_leap_silhouette.label,
  },
  {
    id: 'l-23',
    startTime: 63.107,
    endTime: 67.5,
    text: '你最是 安稳堡垒啊',
    echoText: 'MY UNSHAKABLE FORTRESS',
    emphasis: '安稳堡垒啊',
    punch: 'slam',
    chapterId: 'chorus1',
    shotCode: 'S23',
    shot: 's23_brutalist_light_fortress',
    shotLabel: SHOT_SPECS.s23_brutalist_light_fortress.label,
  },

  // 05. Interlude 1
  {
    id: 'l-24',
    startTime: 67.5,
    endTime: 76.793,
    text: '♪ 律动间奏 · 航站黑胶行李转盘 ♪',
    echoText: '96 BPM FUNK GROOVE',
    punch: 'groove',
    chapterId: 'interlude1',
    shotCode: 'S24',
    shot: 's24_vinyl_baggage_turntable',
    shotLabel: SHOT_SPECS.s24_vinyl_baggage_turntable.label,
  },

  // 06. Verse 2
  {
    id: 'l-25',
    startTime: 76.793,
    endTime: 78.905,
    text: '你听过我 长叹息声',
    emphasis: '长叹息声',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S25',
    shot: 's25_terminal_sigh_bench',
    shotLabel: SHOT_SPECS.s25_terminal_sigh_bench.label,
  },
  {
    id: 'l-26',
    startTime: 78.905,
    endTime: 81.11,
    text: '等暴雨 这班机 延误了',
    echoText: 'FLIGHT DELAYED · THUNDERSTORM',
    emphasis: '班机 延误了',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S26',
    shot: 's26_solari_fids_delayed_macro',
    shotLabel: SHOT_SPECS.s26_solari_fids_delayed_macro.label,
  },
  {
    id: 'l-27',
    startTime: 81.11,
    endTime: 83.226,
    text: '把拉杆 温度 全记得',
    emphasis: '拉杆 温度',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S27',
    shot: 's27_rain_chilled_hand_warmth',
    shotLabel: SHOT_SPECS.s27_rain_chilled_hand_warmth.label,
  },
  {
    id: 'l-28',
    startTime: 83.226,
    endTime: 85.814,
    text: '半生 奔波的旅途中',
    emphasis: '奔波的旅途',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S28',
    shot: 's28_tarmac_puddle_reflection_low',
    shotLabel: SHOT_SPECS.s28_tarmac_puddle_reflection_low.label,
  },
  {
    id: 'l-29',
    startTime: 85.814,
    endTime: 88.696,
    text: '看斑驳 贴满 优先卡片',
    emphasis: '优先卡片',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S29',
    shot: 's29_neon_rain_wet_tags',
    shotLabel: SHOT_SPECS.s29_neon_rain_wet_tags.label,
  },
  {
    id: 'l-30',
    startTime: 88.696,
    endTime: 91.305,
    text: '像你替我攒 旧勋章的痕',
    emphasis: '旧勋章的痕',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S30',
    shot: 's30_tsa_lock_raindrop_glint',
    shotLabel: SHOT_SPECS.s30_tsa_lock_raindrop_glint.label,
  },
  {
    id: 'l-31',
    startTime: 91.305,
    endTime: 93.688,
    text: '你见证 聚散啊',
    emphasis: '见证 聚散',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S31',
    shot: 's31_concourse_crowd_shutter',
    shotLabel: SHOT_SPECS.s31_concourse_crowd_shutter.label,
  },
  {
    id: 'l-32',
    startTime: 93.688,
    endTime: 96.951,
    text: '依然就是 托住我',
    emphasis: '托住我',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S32',
    shot: 's32_gate_pillar_lean_companion',
    shotLabel: SHOT_SPECS.s32_gate_pillar_lean_companion.label,
  },
  {
    id: 'l-33',
    startTime: 96.951,
    endTime: 100.033,
    text: '分担这旅途里 无声的遗憾',
    emphasis: '无声的遗憾',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S33',
    shot: 's33_hotel_night_unsent_letter',
    shotLabel: SHOT_SPECS.s33_hotel_night_unsent_letter.label,
  },
  {
    id: 'l-34',
    startTime: 100.033,
    endTime: 102.576,
    text: '见证那岁月里 最深的孤单',
    emphasis: '最深的孤单',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S34',
    shot: 's34_empty_corridor_solitude',
    shotLabel: SHOT_SPECS.s34_empty_corridor_solitude.label,
  },
  {
    id: 'l-35',
    startTime: 102.576,
    endTime: 104.785,
    text: '你像树洞 咽下悲欢',
    emphasis: '像树洞',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S35',
    shot: 's35_ancient_hollow_rain_intake',
    shotLabel: SHOT_SPECS.s35_ancient_hollow_rain_intake.label,
  },
  {
    id: 'l-36',
    startTime: 104.785,
    endTime: 107.754,
    text: '却把委屈 全隐瞒',
    emphasis: '全隐瞒',
    punch: 'rain',
    chapterId: 'verse2',
    shotCode: 'S36',
    shot: 's36_hollow_fireflies_ascend',
    shotLabel: SHOT_SPECS.s36_hollow_fireflies_ascend.label,
  },

  // 07. Chorus 2
  {
    id: 'l-37',
    startTime: 107.754,
    endTime: 108.81,
    text: '嘿呀 还是你呀',
    echoText: 'BREAKING THROUGH THE STORM!',
    emphasis: '还是你呀',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S37',
    shot: 's37_stormbreak_lightning_hero',
    shotLabel: SHOT_SPECS.s37_stormbreak_lightning_hero.label,
  },
  {
    id: 'l-38',
    startTime: 108.81,
    endTime: 111.959,
    text: '替我装，替我扛',
    emphasis: '替我装，替我扛',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S38',
    shot: 's38_storm_triptych_montage',
    shotLabel: SHOT_SPECS.s38_storm_triptych_montage.label,
  },
  {
    id: 'l-39',
    startTime: 111.959,
    endTime: 113.557,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S39',
    shot: 's39_hydroplane_wheel_spray',
    shotLabel: SHOT_SPECS.s39_hydroplane_wheel_spray.label,
  },
  {
    id: 'l-40',
    startTime: 113.557,
    endTime: 117.025,
    text: '尔似 在我肩',
    emphasis: '尔似 在我肩',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S40',
    shot: 's40_dawn_bridge_side_profile',
    shotLabel: SHOT_SPECS.s40_dawn_bridge_side_profile.label,
  },
  {
    id: 'l-41',
    startTime: 117.025,
    endTime: 118.913,
    text: '哪怕 生活 添上重量',
    emphasis: '添上重量',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S41',
    shot: 's41_uphill_step_lift',
    shotLabel: SHOT_SPECS.s41_uphill_step_lift.label,
  },
  {
    id: 'l-42',
    startTime: 118.913,
    endTime: 121.432,
    text: '哪怕那前路 跌撞迷茫',
    emphasis: '跌撞迷茫',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S42',
    shot: 's42_cloud_pierce_viaduct_pov',
    shotLabel: SHOT_SPECS.s42_cloud_pierce_viaduct_pov.label,
  },
  {
    id: 'l-43',
    startTime: 121.432,
    endTime: 123.546,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S43',
    shot: 's43_sunrise_halo_silhouette',
    shotLabel: SHOT_SPECS.s43_sunrise_halo_silhouette.label,
  },
  {
    id: 'l-44',
    startTime: 123.546,
    endTime: 128.0,
    text: '你最是 安稳堡垒啊',
    emphasis: '安稳堡垒啊',
    punch: 'slam',
    chapterId: 'chorus2',
    shotCode: 'S44',
    shot: 's44_teal_gold_sanctuary_dome',
    shotLabel: SHOT_SPECS.s44_teal_gold_sanctuary_dome.label,
  },

  // 08. Whistle Solo
  {
    id: 'l-45',
    startTime: 128.0,
    endTime: 137.341,
    text: '♪ 自由口哨独奏 · 晴空海岸迎风远航 ♪',
    echoText: 'COASTAL BREEZE WHISTLE SOLO',
    emphasis: '自由口哨',
    punch: 'whistle',
    chapterId: 'whistle',
    shotCode: 'S45',
    shot: 's45_kamakura_whistle_coast',
    shotLabel: SHOT_SPECS.s45_kamakura_whistle_coast.label,
  },

  // 09. Bridge
  {
    id: 'l-46',
    startTime: 137.341,
    endTime: 140.378,
    text: '万物都在速朽 唯有你念旧',
    emphasis: '唯有你念旧',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S46',
    shot: 's46_street_timelapse_sanctuary',
    shotLabel: SHOT_SPECS.s46_street_timelapse_sanctuary.label,
  },
  {
    id: 'l-47',
    startTime: 140.378,
    endTime: 143.054,
    text: '如果 转轮 不再自由',
    emphasis: '转轮 不再自由',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S47',
    shot: 's47_halted_wheel_autumn_leaf',
    shotLabel: SHOT_SPECS.s47_halted_wheel_autumn_leaf.label,
  },
  {
    id: 'l-48',
    startTime: 143.054,
    endTime: 145.619,
    text: '我要把你放在 家里的门口边',
    emphasis: '家里的门口边',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S48',
    shot: 's48_entryway_place_by_door',
    shotLabel: SHOT_SPECS.s48_entryway_place_by_door.label,
  },
  {
    id: 'l-49',
    startTime: 145.619,
    endTime: 148.2,
    text: '换另一种 方式相守',
    emphasis: '方式相守',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S49',
    shot: 's49_sunbeam_plant_companionship',
    shotLabel: SHOT_SPECS.s49_sunbeam_plant_companionship.label,
  },
  {
    id: 'l-50',
    startTime: 148.2,
    endTime: 150.659,
    text: '装满这旧梦',
    emphasis: '旧梦',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S50',
    shot: 's50_golden_keepsake_trunk',
    shotLabel: SHOT_SPECS.s50_golden_keepsake_trunk.label,
  },
  {
    id: 'l-51',
    startTime: 150.659,
    endTime: 153.404,
    text: '陪着我 姓名',
    emphasis: '陪着我 姓名',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S51',
    shot: 's51_cognac_nametag_foil',
    shotLabel: SHOT_SPECS.s51_cognac_nametag_foil.label,
  },
  {
    id: 'l-52',
    startTime: 153.404,
    endTime: 155.735,
    text: '护住这个 小小箱',
    emphasis: '小小箱',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S52',
    shot: 's52_cradling_hands_on_shell',
    shotLabel: SHOT_SPECS.s52_cradling_hands_on_shell.label,
  },
  {
    id: 'l-53',
    startTime: 155.735,
    endTime: 165.468,
    text: '那些旧日风景 全都不忘',
    echoText: 'EVERY MEMORY PRESERVED FOREVER',
    emphasis: '全都不忘',
    punch: 'warm',
    chapterId: 'bridge',
    shotCode: 'S53',
    shot: 's53_polaroid_twine_wall_crescendo',
    shotLabel: SHOT_SPECS.s53_polaroid_twine_wall_crescendo.label,
  },

  // 10. Finale & Outro
  {
    id: 'l-54',
    startTime: 165.468,
    endTime: 166.819,
    text: '嘿呀 还是你呀',
    echoText: 'FINAL CLIMAX · 终章全开！',
    emphasis: '还是你呀',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S54',
    shot: 's54_finale_solar_zenith_burst',
    shotLabel: SHOT_SPECS.s54_finale_solar_zenith_burst.label,
  },
  {
    id: 'l-55',
    startTime: 166.819,
    endTime: 170.416,
    text: '替我装，替我扛',
    echoText: '（替我装！替我扛！）',
    emphasis: '替我装，替我扛',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S55',
    shot: 's55_memory_era_triptych',
    shotLabel: SHOT_SPECS.s55_memory_era_triptych.label,
  },
  {
    id: 'l-56',
    startTime: 170.416,
    endTime: 172.216,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S56',
    shot: 's56_airborne_stickers_celebration',
    shotLabel: SHOT_SPECS.s56_airborne_stickers_celebration.label,
  },
  {
    id: 'l-57',
    startTime: 172.216,
    endTime: 175.634,
    text: '尔似 在我肩',
    echoText: 'ALWAYS UPON MY SHOULDER',
    emphasis: '尔似 在我肩',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S57',
    shot: 's57_golden_promenade_ots',
    shotLabel: SHOT_SPECS.s57_golden_promenade_ots.label,
  },
  {
    id: 'l-58',
    startTime: 175.634,
    endTime: 177.187,
    text: '哪怕 生活 添上重量',
    emphasis: '添上重量',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S58',
    shot: 's58_sparkling_runway_wheels',
    shotLabel: SHOT_SPECS.s58_sparkling_runway_wheels.label,
  },
  {
    id: 'l-59',
    startTime: 177.187,
    endTime: 180.562,
    text: '哪怕那前路 跌撞迷茫',
    emphasis: '跌撞迷茫',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S59',
    shot: 's59_horizon_lightgate_breakthrough',
    shotLabel: SHOT_SPECS.s59_horizon_lightgate_breakthrough.label,
  },
  {
    id: 'l-60',
    startTime: 180.562,
    endTime: 182.41,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S60',
    shot: 's60_sky_lantern_ember_crest',
    shotLabel: SHOT_SPECS.s60_sky_lantern_ember_crest.label,
  },
  {
    id: 'l-61',
    startTime: 182.41,
    endTime: 186.483,
    text: '你最是 安稳堡垒啊',
    echoText: '最安稳的堡垒！',
    emphasis: '安稳堡垒啊',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S61',
    shot: 's61_golden_cathedral_bastion',
    shotLabel: SHOT_SPECS.s61_golden_cathedral_bastion.label,
  },
  {
    id: 'l-62',
    startTime: 186.483,
    endTime: 188.057,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S62',
    shot: 's62_aerial_causeway_duo',
    shotLabel: SHOT_SPECS.s62_aerial_causeway_duo.label,
  },
  {
    id: 'l-63',
    startTime: 188.057,
    endTime: 190.619,
    text: '替我装，替我扛',
    echoText: '（一路相伴 · 替我扛！）',
    emphasis: '替我装，替我扛',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S63',
    shot: 's63_sticker_mosaic_shell_pan',
    shotLabel: SHOT_SPECS.s63_sticker_mosaic_shell_pan.label,
  },
  {
    id: 'l-64',
    startTime: 190.619,
    endTime: 192.353,
    text: '嘿呀 还是你呀',
    emphasis: '还是你呀',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S64',
    shot: 's64_sunset_tag_backlit_glow',
    shotLabel: SHOT_SPECS.s64_sunset_tag_backlit_glow.label,
  },
  {
    id: 'l-65',
    startTime: 192.353,
    endTime: 197.5,
    text: '尔似 在我肩',
    emphasis: '尔似 在我肩',
    punch: 'finale',
    chapterId: 'finale',
    shotCode: 'S65',
    shot: 's65_twilight_pier_stillness',
    shotLabel: SHOT_SPECS.s65_twilight_pier_stillness.label,
  },
  {
    id: 'l-66',
    startTime: 197.5,
    endTime: 212.04,
    text: 'Hey! · Hmm ~ 致好朋友，二十寸小黑',
    echoText: 'Ham ·《To 我的好朋友》',
    emphasis: '小黑',
    punch: 'warm',
    chapterId: 'finale',
    shotCode: 'S66',
    shot: 's66_uyuni_mirror_outro',
    shotLabel: SHOT_SPECS.s66_uyuni_mirror_outro.label,
  },
];
