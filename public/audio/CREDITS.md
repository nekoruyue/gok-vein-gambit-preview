# 音频来源与许可

本项目新增的音效来自 Kenney 的 CC0 素材包，已裁剪、转为 44.1kHz 单声道 WAV，并做响度归一化。

- Interface Sounds: https://kenney.nl/assets/interface-sounds
- Impact Sounds: https://kenney.nl/assets/impact-sounds
- RPG Audio: https://kenney.nl/assets/rpg-audio
- Music Jingles: https://kenney.nl/assets/music-jingles

License: Creative Commons Zero (CC0) — https://creativecommons.org/publicdomain/zero/1.0/

新增文件：damage、hero_hit、death、deathrattle、heal、draw、armor、freeze、summon、spell、buff、discover、hero_power、turn_start、relic、shield、poison、victory_jingle、defeat_jingle。

原有 bgm_title.ogg、bgm_game.ogg 与既有基础 SFX 保留。

## 阵营主题音乐

新增六首阵营专属背景音乐：

- `bgm_faction_pus.ogg`
- `bgm_faction_academy.ogg`
- `bgm_faction_xizhao.ogg`
- `bgm_faction_republic.ogg`
- `bgm_faction_empire.ogg`
- `bgm_faction_greyharbor.ogg`

均为本项目内程序化生成的原创器乐循环，不依赖外部素材；用于各阵营备战、经典对局与战棋模式。切换时使用 760ms 交叉淡入淡出。

## e51 BGM
- 2026-10-21: 旧 BGM 替换为本地生成的暗色环境循环（tools/make_bgm.py）。旧曲备份在 tests/audio-old。

## 2026-10-22 实验版 BGM
豆包音乐生成页要求登录，未登录会话无法下载音频。本版暂用本地程序化生成的暗色环境音乐替换 bgm_title / bgm_game / 八首阵营 BGM；旧文件备份在 public/audio/backup。登录豆包后可再替换为豆包生成版本。


## 2026-10-22 豆包生成 BGM
豆包音乐生成《秘雪暗鸣》（48 秒，账号：小猫月月）已下载并转为 OGG，替换 bgm_title、bgm_game 与八首阵营 BGM。源文件保存在 tests/doubao-music.m4a，转换文件 tests/doubao-music.ogg；旧本地临时版备份在 public/audio/backup-local。



## 2026-10-22 阵营/街机/娱乐 BGM 更新
本轮以豆包已生成的《秘雪暗鸣》母版制作了 12 个不同的编曲/音色循环：主菜单、通用对局、八阵营、街机模式、娱乐模式。由于当前会话无法登录豆包生成新曲，所有变体均为本地滤镜/编曲处理；源母版与旧文件均保留在 tests 与备份目录。
- 新增 bgm_arcade.ogg、bgm_entertainment.ogg
- 八阵营 BGM 已全部替换为不同版本
- BGM_ASSET_VERSION 提升到 20261022amb3

## 2026-10-22 豆包六首阵营 BGM（第二批）
账号：小猫月月。通过豆包「音乐生成」实际生成并下载，转 OGG 后替换以下阵营曲：
- 学院《秘卷浮光》
- 西昭《血祭余响》
- 共和国《铁律回响》
- 帝国《铁潮压境》
- 灰港同盟《雾夜暗潮》
- 普卫岛沿用首曲《秘雪暗鸣》

对局只使用阵营专属曲；设置中的「通用音乐」已移除。
主页与街机模式改用《戈克纪元》主主题 `bgm_title.ogg`，街机不再使用独立曲。
源文件保留在 `tests/doubao-academy2.m4a`、`doubao-xizhao.m4a`、`doubao-republic.m4a`、`doubao-empire.m4a`、`doubao-greyharbor.m4a`。
旧文件备份在 `public/audio/backup-pre-doubao3/`。

## 2026-10-22 BGM 最终取舍
豆包第二批六首阵营曲试听后，仅保留灰港同盟《雾夜暗潮》作为所有对局的战斗 BGM。
学院、西昭、共和国、帝国恢复 `backup-pre-doubao3` 原曲；主菜单与街机恢复使用原版主主题 `bgm_title.ogg`。
设置页不再提供音乐模式切换，固定为主菜单原版主题 + 灰港战斗曲。

## 2026-10-22 使用《戈克纪元》原始 BGM
从 `C:\Users\ASUS\Desktop\戈克纪元\assets\bgm` 取用两首原始曲：
- `bgm_title.ogg` → `public/audio/bgm_gok_title.ogg`（主菜单、街机、非对局页面）
- `bgm_game.ogg` → `public/audio/bgm_gok_game.ogg`（所有对局/备战）

灰港《雾夜暗潮》文件保留，但不再作为默认对局曲。
缓存版本提升到 `20261022amb8`。

## 2026-10-22 BGM 场景分配（最终）
- 主菜单 / 模式入口 / 设置 / 排位：`bgm_gok_title.ogg`（戈克纪元主菜单曲）
- 推演准备 / 在线匹配准备 / 房间准备：`bgm_faction_greyharbor.ogg`（灰港《雾夜暗潮》）
- 战斗对局：`bgm_gok_game.ogg`（戈克纪元战斗曲）
- 卡牌图鉴 / 构筑卡组 / 推演记录：`bgm_title.ogg`（原有主页音乐）
- 街机模式复用戈克纪元主菜单曲
