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
