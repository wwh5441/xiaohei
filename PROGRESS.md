# 《嘿！小黑》互动音乐 MV — 工程进度与 66 镜逐帧质检账本（PROGRESS.md）

> **更新日期**：2026-11-18  
> **关联文档**：`STORYBOARD_MV.md`（分镜设计定稿与批评清单）  
> **当前实事求是状态**：**架构与 66 镜代码骨架（V1）已接通且编译/单测通过；但全片视觉美术质感与一幕一幕逐镜质检（Visual QA）仅完成极少数抽检，当前版本画面存在严重矢量塑料感与构图穿帮，尚不可交付。**

---

## 一、全局进度总览（诚实核对）

| 阶段 / 模块 | 目标描述 | 当前状态 | 真实完成度 / 存在问题说明 |
| :--- | :--- | :--- | :--- |
| **1. 工程批评与分镜规格书** | 输出工程批评与 `S01`–`S66` 零重复分镜文档 | ✅ 已完成 | 已沉淀于 `STORYBOARD_MV.md`（含 10 章节与 66 镜时间轴切点）。 |
| **2. 66 镜数据结构与零重复路由** | 每句 LRC 对应唯一 `ShotCode` / `ShotType` / `shotLabel` | ✅ 已完成 | `mvData.ts` + `mvTimeline.ts` 已落地，单测强制校验 66 镜 1:1 唯一映射。 |
| **3. 逻辑与物理单元测试** | 时间轴、章节无缝、LRC 对齐、`S47` 停转、IK 数学 | ✅ 已完成（10/10） | `npx --yes tsx --test src/mv/mvTimeline.test.ts` 全部通过；构建 `compile_applet` + `tsc --noEmit` 通过。 |
| **4. 播放态 / 暂停态控制与字幕系统** | `?poster=0&t=` 深链直达、双模字幕开关（`C` 键）、抽屉跳转 | ⚠️ 需大修 | 功能链路已通，但暂停态底栏显隐按钮与**电影字幕圆角黑框直接压盖前景主体**（见下文实拍复盘）。 |
| **5. 66 镜美术渲染精度与防穿帮** | 真实景深光影、无断肢/悬浮/硬边三角形矢量假感、差异化构图 | ❌ 不达标（主痛点） | 依赖少数公用绘制函数，导致大面积“几何扁平盒子 + 硬切条纹光 + 断腿悬浮”；视觉质感远未达到 MV 电影级要求。 |
| **6. 全片 66 镜一幕一幕逐帧视觉质检** | 使用无头浏览器逐镜截出全部 66 镜画面并逐一评审/返修 | ❌ 未完成（仅 5/66） | **此前仅抽检了 `S01 / S16 / S26 / S47 / S66` 共 5 镜，剩余 61 镜均未逐帧看图验收！** |

---

## 二、最新实拍打回问题复盘（用户截图直击 `S03`）

> 证据截图：`public/assets/aistudio/__2026-11-18_16.42.18_d046c508.png`（约 `00:09.60 – 00:14.12`，对应 `S03 · s03_hallway_wheels_wakeup`）

通过实拍截图可明确确认以下 **5 项高优先级视觉/UI 缺陷**，且均为底层公用函数导致的多镜头连带病灶：

1. **【High · 穿帮】前景人腿顶部齐根截断，像漂浮断肢**
   - **代码定位**：`src/mv/humanRimowaRig.ts` 中 `drawTrueMacroWheelAndBoot()`（第 2845–2856 行）。
   - **问题原因**：裤腿向上只画到 `-190 * u`，顶边横平一刀截断在画幅中下部的空墙面上，既没延伸出屏幕顶边缘、上方也没有风衣下摆衔接。
   - **连带影响镜头**：**5 镜**（`S03`、`S05`、`S15`、`S39`、`S58`）。

2. **【High · UI 遮挡】电影字幕黑底圆角药丸 + 控制按钮压盖箱体与滚轮**
   - **代码定位**：`src/components/KineticLyricsOverlay.tsx` 与 `src/components/DirectorDock.tsx`。
   - **问题原因**：
     - 电影字幕采用厚重的 `rounded-xl bg-zinc-950/72 border` 实体黑框卡片，在底栏展开或过渡时被顶到画面正中偏下（`bottom-52 sm:bottom-56`），直接糊在前景行李箱与轮子上方。
     - `隐藏底栏 (H)` 居中浮动按钮与底部滚轮边缘发生重叠打架。
   - **连带影响镜头**：**全片 66 镜**（尤其低机位/贴地特写镜头）。

3. **【High · 美术塑料感】硬边三角形伪“丁达尔光束”与日光四边形生硬斜切**
   - **代码定位**：`src/mv/shotPrimitives.ts` 中 `drawTyndallGodRays()`（第 156–198 行），以及 `shotComposersA.ts` `S03` 门框斜光块（第 293–301 行）。
   - **问题原因**：`drawTyndallGodRays` 用闭合尖角三角形填充半透明纯色，两侧边缘完全没有羽化衰减，画面上像贴了几根锐利的多边形色条；`S03` 门框阳光也是硬边梯形。
   - **连带影响镜头**：**14 镜**（`S01, S03, S11, S16, S23, S32, S37, S42, S47, S48, S49, S52, S54, S61`）。

4. **【High · 构图敷衍/同质化】“微距箱角+两只大圆轮”像漂浮扁方盒子，且与 `S47` 等 6 镜雷同**
   - **代码定位**：`drawTrueMacroWheelAndBoot()`（第 2631–2775 行）与 `renderS03HallwayWheelsWakeup()`（第 280–329 行）。
   - **问题原因**：
     - 箱体高度写死 `220 * u` 截断在画面中央，侧面无厚度纵深、防撞角和铆钉像扁平圆角矩形+白点，整体视觉上就是一个小方盒顶着两个大圆圈。
     - `S03` 分镜描述写的是“晨光实木门框、门槛、玄关地垫、箱体出发”，画面里却**没有任何门框、门槛和家具，只有背景两层渐变+几条斜线**。
     - `S03 / S05 / S15 / S39 / S47 / S58` 全部调用同一个 `drawTrueMacroWheelAndBoot`，换汤不换药，违背了“真零重复分镜”的质检标准。

5. **【High · 流程失职】缺乏逐镜全量出图核验闭环**
   - **问题原因**：V1 阶段仅看图抽查了 `S01 / S16 / S26 / S47 / S66`，未把 `S01`–`S66` 全部渲染出来一幕一幕审视，导致 `S03` 这样开场第 3 镜的明显丑态漏过。

---

## 三、全片 66 镜一幕一幕质检追踪表（`S01` – `S66`）

> 状态图例：  
> - `⏳ 待视觉检视`：代码路由已存在，但**尚未用真实浏览器截图看图验收**  
> - `⚠️ 实拍打回`：已看过实拍图或已定位同源公用缺陷，**明确存在穿帮/质感问题，必须返修**  
> - `🔍 已抽检（仍需复核）`：V1 曾截过图，但需结合统一光影/字幕改造重新核验

### 第一章：前奏 · 弦动启程（`S01 – S03`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S01` | `renderS01SoundholeRosette` | 🔍 已抽检（需提质） | 琴弦压字已修，但木纹是垂直细线+平涂渐变，缺少真实云杉面板质感、琴品微距纵深与柔焦虚实。 |
| `S02` | `renderS02BridgePercussiveSlap` | ⏳ 待视觉检视 | 需截图确认斜侧琴码立体感与 `3.25s` 击弦声波表现，避免只是色块+折线。 |
| `S03` | `renderS03HallwayWheelsWakeup` | **⚠️ 实拍打回** | **严重问题**：断腿悬空、门框/门槛实景缺失、硬边斜光条、箱体截断扁平、字幕药丸压住箱子。需彻底重绘为带真实门框/门槛/推箱出镜的长焦晨光实景。 |

### 第二章：主歌 · 丈量从前（`S04 – S11`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S04` | `renderS04ViaductSunsetWide` | ⏳ 待视觉检视 | 需核验跨海大桥斜拉索、飞鸟与人物轮廓比例，确保非简单剪影火柴人。 |
| `S05` | `renderS05BoulevardOdometerLow` | ⚠️ 连带待修 | 与 `S03` 共用 `drawTrueMacroWheelAndBoot`，同样存在**断腿悬浮**与箱体截断扁平问题，且需与 `S03` 拉开视角（如地面贴地跟拍透视而非正侧面平视图）。 |
| `S06` | `renderS06AnodizedShellGrazing` | ⏳ 待视觉检视 | 需截图检查磨砂箱壳细纹与 TSA `0·9·6` 金属质感是否像真实特写而非矢量方框。 |
| `S07` | `renderS07SunsetPalmGrip` | ⏳ 待视觉检视 | 需核验人物手部解剖结构与暖光散景，防止出现僵硬手指多边形。 |
| `S08` | `renderS08FannedPriorityTags` | ⏳ 待视觉检视 | 需截图验收扇形优先卡叠加层次、纸张/绳扣细节，避免像几张扁平彩色长方形。 |
| `S09` | `renderS09CustomsMedalPostmark` | ⏳ 待视觉检视 | 需截图确认金色邮戳盖印与条码微距清晰度，不与 `S08` 雷同。 |
| `S10` | `renderS10BluehourStrangerSkyline` | ⏳ 待视觉检视 | 需核验蓝调时刻异乡天际线城市质感与人物关系，避免背景全是纯黑矩形楼房。 |
| `S11` | `renderS11EscalatorSideSupport` | ⚠️ 连带待修 | 含 `drawTyndallGodRays` 硬边光条，需截图检查自动扶梯透视阶梯与箱顶帆布包贴合度。 |

### 第三章：蓄势 · 半生俗世（`S12 – S15`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S12` | `renderS12OverheadPackedHalves` | ⏳ 待视觉检视 | 需截图核验俯拍开箱内的旁轴相机、手札、信笺细节与 X 型束衣带层级。 |
| `S13` | `renderS13MistyGantryForkPov` | ⏳ 待视觉检视 | 需核验 Y 型高架分岔透视、迷雾纵深及龙门架路牌可读性。 |
| `S14` | `renderS14CornerRivetPatina` | ⏳ 待视觉检视 | 需截图确认铝镁护角铆钉光影是否真实立体，不致沦为灰圆角方块+白点。 |
| `S15` | `renderS15CobblestoneSilentWheels` | ⚠️ 连带待修 | 共用 `drawTrueMacroWheelAndBoot`（**断腿悬浮**），需改用纯粹地面低角度青石板路透视+局部皮靴落地，彻底消除悬空断腿。 |

### 第四章：副歌 · 安稳堡垒（`S16 – S23`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S16` | `renderS16OverpassSunburstLow` | 🔍 已抽检（需微调） | `cinema` 模式双重文字已修；仍包含 `drawTyndallGodRays` 硬边三角光条，且烈日背景下人物五官/头发过渡偏硬，需柔化光束羽化。 |
| `S17` | `renderS17DiptychPackAndCarry` | ⏳ 待视觉检视 | **高风险**：需截图确认双联斜切分割线、`替我装/替我扛` 画幅比例与内容丰富度。 |
| `S18` | `renderS18SlipstreamTagWhip` | ⏳ 待视觉检视 | 需截图核验气流飞扬的橙色优先卡动势与拉丝钛银双杆质感。 |
| `S19` | `renderS19OtsShoulderHorizon` | ⏳ 待视觉检视 | 需重点审视 `drawOverTheShoulderCompanion` 的旅人肩颈、围巾与高架拉杆的透视比例是否像真实人体。 |
| `S20` | `renderS20HeavyLoadCompression` | ⏳ 待视觉检视 | 需截图检查帆布包压箱下沉回弹视觉传达。 |
| `S21` | `renderS21TunnelFlareRushPov` | ⏳ 待视觉检视 | 需截图检查弧形钠灯隧道的纵向透视速度感与前景手握拉杆自然度。 |
| `S22` | `renderS22CrestLeapSilhouette` | ⏳ 待视觉检视 | 需确认 `-4°` 荷兰斜角构图与 `S16` 的明显视觉区分度。 |
| `S23` | `renderS23BrutalistLightFortress` | ⚠️ 连带待修 | 含 `drawTyndallGodRays` 硬边光条，需截图核验清水混凝土柱廊与黑曜石倒影融合度。 |

### 第五章：间奏 · 行李转盘（`S24`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S24` | `renderS24VinylBaggageTurntable` | ⏳ 待视觉检视 | 长达 `9.29s` 的重拍间奏主秀场，必须截图核验黑胶唱片光泽纹理、唱臂造型与小黑俯视透视。 |

### 第六章：航站 · 暴雨延误（`S25 – S36`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S25` | `renderS25TerminalSighBench` | ⏳ 待视觉检视 | 需核验深夜候机座椅人物低头叹息姿态、热咖啡白雾与窗外暴雨氛围，避免人物僵硬。 |
| `S26` | `renderS26SolariFidsDelayedMacro` | 🔍 已抽检（可做基准） | 翻页机械屏整体观感较好，但需微调底部字幕药丸与屏幕下沿重叠压迫问题。 |
| `S27` | `renderS27RainChilledHandWarmth` | ⏳ 待视觉检视 | 需重点检视人手特写与玻璃水珠细节，防止手掌呈“火柴棒/橡皮手套”质感。 |
| `S28` | `renderS28TarmacPuddleReflectionLow` | ⏳ 待视觉检视 | 需确认地面雨水霓虹倒影、旅人与小黑在地面水洼中的贴合度。 |
| `S29` | `renderS29NeonRainWetTags` | ⏳ 待视觉检视 | 需确认卡面水珠折射与湿润反光质感，防止沦为几张普通色卡。 |
| `S30` | `renderS30TsaLockRaindropGlint` | ⏳ 待视觉检视 | 需截图确认斜向箱脊划痕与锁扣微距立体度，区分于 `S06 / S14`。 |
| `S31` | `renderS31ConcourseCrowdShutter` | ⏳ 待视觉检视 | 需截图验证远景/前景双层虚化人潮慢门拖影效果。 |
| `S32` | `renderS32GatePillarLeanCompanion` | ⚠️ 连带待修 | 需重点截图审视新写的 `drawGatePillarLeanCompanion` 倚靠人体结构（大概率有斜靠矩形躯干/生硬肘关节问题）及 `drawTyndallGodRays` 硬边光。 |
| `S33` | `renderS33HotelNightUnsentLetter` | ⏳ 待视觉检视 | 需核验深夜旅馆百叶窗雨影、暖台灯与明信片构图。 |
| `S34` | `renderS34EmptyCorridorSolitude` | ⏳ 待视觉检视 | 需确认凌晨空旷长廊灭灯孤寂氛围与长影透视。 |
| `S35` | `renderS35AncientHollowRainIntake` | ⏳ 待视觉检视 | 需重点检查雾林剪影（`drawOrganicMistForest`）与树洞纳雨是否摆脱“儿童简笔画”感。 |
| `S36` | `renderS36HollowFirefliesAscend` | ⏳ 待视觉检视 | 需截图核验树洞拱门内景特写及萤火升空光晕层次。 |

### 第七章：副歌 · 破雨同行（`S37 – S44`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S37` | `renderS37StormbreakLightningHero` | ⚠️ 连带待修 | 含大面积硬边 `drawTyndallGodRays`，需核验破云闪电光比与 `1.06s` 短句压迫感。 |
| `S38` | `renderS38StormTriptychMontage` | ⚠️ 连带待修 | 右联调用了 `drawTrueMacroWheelAndBoot`，需核验三联画内部画面裁切与边框协调。 |
| `S39` | `renderS39HydroplaneWheelSpray` | ⚠️ 连带待修 | 调用 `drawTrueMacroWheelAndBoot`（**断腿悬浮 + 扁盒感**），水花羽翼须配真实侧向透视与地面水雾。 |
| `S40` | `renderS40DawnBridgeSideProfile` | ⏳ 待视觉检视 | 需截图确认破晓桥面侧跟拍的步伐姿态与色彩过渡。 |
| `S41` | `renderS41UphillStepLift` | ⏳ 待视觉检视 | 需截图检查石阶抬箱动作手部/躯干衔接是否真实不悬空。 |
| `S42` | `renderS42CloudPierceViaductPov` | ⚠️ 连带待修 | 含 `drawTyndallGodRays` 硬边三角光，需核验穿云瞬间视效。 |
| `S43` | `renderS43SunriseHaloSilhouette` | ⏳ 待视觉检视 | 需确保日环剪影与 `S16 / S22 / S37` 在构图、景别、太阳位置上形成明显反差。 |
| `S44` | `renderS44TealGoldSanctuaryDome` | ⏳ 待视觉检视 | 需截图检查海滨敞廊石柱透视与青金海平线衔接。 |

### 第八章：独奏 · 自由口哨（`S45`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S45` | `renderS45KamakuraWhistleCoast` | ⏳ 待视觉检视 | `9.34s` 海崖长镜头，需核验海浪护栏、白色灯塔、电线杆与五线谱音符丝带美感。 |

### 第九章：桥段 · 唯你念旧（`S46 – S53`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S46` | `renderS46StreetTimelapseSanctuary` | ⏳ 待视觉检视 | 需核验街头长曝光车流拖影与路灯暖光池空间融合度，避免像几道彩色直棍飞过。 |
| `S47` | `renderS47HaltedWheelAutumnLeaf` | ⚠️ **需返修** | V1 虽锁死停转并去掉了断腿，但与 `S03` 共用“平切小黑盒+孤零零两只圆轮”，构图略单调空旷且含硬边 `drawTyndallGodRays` 光条，需补足木地板纹理深度、踢脚线背景与更精细的银杏叶/轮毂光影。 |
| `S48` | `renderS48EntrywayPlaceByDoor` | ⚠️ 连带待修 | 含 `drawTyndallGodRays` 硬边光条，需截图确认胡桃木入户门与黄麻地毯比例写实度。 |
| `S49` | `renderS49SunbeamPlantCompanionship` | ⚠️ 连带待修 | 含 `drawTyndallGodRays` 硬边光条，需重点检视黄铜钥匙盘与橄榄枝盆栽细节（避免简笔画叶片）。 |
| `S50` | `renderS50GoldenKeepsakeTrunk` | ⏳ 待视觉检视 | 需截图确认敞口箱体斜俯视透视内的票根、胶卷、干花细节。 |
| `S51` | `renderS51CognacNametagFoil` | ⏳ 待视觉检视 | 需截图验证干邑皮牌缝线、黄铜铆钉孔带穿插结构与烫金字光感。 |
| `S52` | `renderS52CradlingHandsOnShell` | ⚠️ 连带待修 | 手部近景高风险（容易僵硬像积木手）+ `drawTyndallGodRays` 硬边光，必须逐帧检视。 |
| `S53` | `renderS53PolaroidTwineWallCrescendo` | ⏳ 待视觉检视 | `9.73s` 记忆高潮墙，需截图核验 6 张拍立得照片内容清晰度、麻绳自然下垂弧度与木夹光影。 |

### 第十章：终章 · 尔似在肩（`S54 – S66`）
| 镜号 | 代码函数 | 实拍质检状态 | 已知问题 / 下一步精准返修点 |
| :--- | :--- | :--- | :--- |
| `S54` | `renderS54FinaleSolarZenithBurst` | ⚠️ 连带待修 | 含 11 道硬边 `drawTyndallGodRays` 三角辐射光，易显廉价锯齿射线。 |
| `S55` | `renderS55MemoryEraTriptych` | ⏳ 待视觉检视 | 需截图核验三年代画面配色区隔与印章压字比例。 |
| `S56` | `renderS56AirborneStickersCelebration` | ⏳ 待视觉检视 | 需截图确认 8 张绕飞优先卡的立体透视与不挡主角主体。 |
| `S57` | `renderS57GoldenPromenadeOts` | ⏳ 待视觉检视 | 与 `S19` 共用 `drawOverTheShoulderCompanion`，需核验鎏金海滨越肩姿态自然度。 |
| `S58` | `renderS58SparklingRunwayWheels` | ⚠️ 连带待修 | 与 `S03` 共用 `drawTrueMacroWheelAndBoot`（**断腿悬浮**），需改用独立跑道中线四轮后追视角。 |
| `S59` | `renderS59HorizonLightgateBreakthrough` | ⏳ 待视觉检视 | 需确认散雾退去露出金海的画面层次。 |
| `S60` | `renderS60SkyLanternEmberCrest` | ⏳ 待视觉检视 | 需核验漫天星火粒子规模与崖顶剪影对比度。 |
| `S61` | `renderS61GoldenCathedralBastion` | ⚠️ 连带待修 | 含 `drawTyndallGodRays` 硬边逆光射线，需重构柔和体积光。 |
| `S62` | `renderS62AerialCausewayDuo` | ⏳ 待视觉检视 | 需核验高空俯瞰跨海长堤长影透视，避免俯拍人物沦为小黑点。 |
| `S63` | `renderS63StickerMosaicShellPan` | ⏳ 待视觉检视 | 需核验横摇特写满壳贴纸组合排版与金属斜角反光。 |
| `S64` | `renderS64SunsetTagBacklitGlow` | ⏳ 待视觉检视 | 需核验室外熔金落日下的吊牌半逆光透亮质感。 |
| `S65` | `renderS65TwilightPierStillness` | ⏳ 待视觉检视 | 需核验木栈道尽头黄昏静驻构图与第一颗晚星氛围。 |
| `S66` | `renderS66UyuniMirrorOutro` | 🔍 已抽检（已修倒影） | 倒影矩阵偏移与落版上移已修复；仍需确认 `197.5s – 206.2s` 远行前段的背影行走步态自然度。 |

---

## 四、下一阶段工程改造与逐镜闭环计划（按优先级顺序）

### Phase A：立刻根除跨镜公用病灶（消灭批量穿帮与廉价感）
1. **重构电影字幕 UI（`KineticLyricsOverlay.tsx` + `DirectorDock.tsx`）**：
   - 取消生硬的半透明黑色圆角卡片框（`bg-zinc-950/72 border`），改为电影标准**底部无框高对比度文字 + 双层柔焦文本阴影（Drop Shadow）+ 极淡底边暗角渐变衬底**，贴近视口下沿安全区（隐藏底栏时 `bottom-5`），绝不再挡箱体/轮子。
   - 收纳“隐藏底栏 (H)”触发区，暂停时不再悬停出一颗单独按钮压在画面正下方轮子上。
2. **彻底重写柔和体积光（`drawTyndallGodRays`）**：
   - 将硬边多边形填充替换为**横向正交渐隐径向/线性混合软光束 + `filter: blur` 或多层羽化叠加**，消除所有锐利锯齿斜线。
3. **拆解并重构 `drawTrueMacroWheelAndBoot` 家族**：
   - 删除右半侧突兀平切的“悬浮半截裤管”！改用真正贴地透视（鞋底与地面接触、向上柔和暗角虚化收口或延伸至画外顶端）。
   - 不再让 6 个镜头共用同一个“平放方形箱底+双轮”画法：为 `S03`（真·玄关推门门槛半截箱身+门垫景深）、`S05`（公路柏油里程碑追焦斜俯）、`S15`（凹凸青石板雨后特写）、`S39`（积水横切破水特写）、`S47`（静止老轮与银杏叶微距细节质感升级）、`S58`（跑道金色双黄线纵深透视）建立各自真正的专属几何构图。

### Phase B：自动化全量 66 镜出图流水线
- 编写一次性本地无头浏览器采样脚本，按 `LYRIC_LINES[0..65]` 每镜中点时间 `(startTime + endTime) * 0.5` 自动访问 `?poster=0&t=<mid>` 并禁用干扰 HUD，在 `.playwright-cli/audit66/` 下完整输出 **`S01.png` 到 `S66.png` 全部 66 张实拍画面**。

### Phase C：分章节“一幕一幕”逐帧审图与返修（10 轮章节验收）
- 按章分组（每批 6–8 镜）逐张查看真实渲染 PNG 截图，针对每一镜的构图饱满度、人体比例、材质光影与词意契合度打分改造，**未在真实截图里验过眼的镜头一律不得标为完成**，直到 66 镜全部达到电影级视效通过。
