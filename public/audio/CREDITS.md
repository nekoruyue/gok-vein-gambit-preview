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
