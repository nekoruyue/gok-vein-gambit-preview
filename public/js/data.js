/* 《戈克世界：流脉牌局》测试版卡牌数据
 * 仅实现 普卫岛 vs 西昭 两阵营 + 中立。
 * 数据驱动，后续可继续添加学院/共和国/帝国。
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) module.exports = factory();
  else root.GokData = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const FACTIONS = {
    pus: { name: "普卫岛", short: "普卫岛", color: "#5fd3c4", dark: "#123b3a", icon: "盾", emblem: "/assets/emblems/pus.svg", hero: "lain" },
    academy: { name: "学院", short: "学院", color: "#82aee8", dark: "#14263d", icon: "书", emblem: "/assets/emblems/academy.svg", hero: "marta" },
    xizhao: { name: "西昭", short: "西昭", color: "#c0504d", dark: "#3a1215", icon: "血", emblem: "/assets/emblems/xizhao.svg", hero: "karna" },
    republic: { name: "共和国", short: "共和国", color: "#d6b25f", dark: "#2b2518", icon: "律", emblem: "/assets/emblems/republic.svg", hero: "wolfram" },
    empire: { name: "帝国", short: "帝国", color: "#b08a5a", dark: "#2a2118", icon: "冠", emblem: "/assets/emblems/empire.svg", hero: "otto" },
    greyharbor: { name: "灰港同盟", short: "灰港", color: "#7fae8f", dark: "#1b2a23", icon: "匕", emblem: "/assets/emblems/greyharbor.webp", hero: "monarch" },
    losutai: { name: "洛斯汰聚落", short: "洛斯汰", color: "#36b8b0", dark: "#08262b", icon: "潮", emblem: "/assets/emblems/losutai.webp", hero: "balaena" },
    snow: { name: "雪都", short: "雪都", color: "#9bd8ff", dark: "#17283b", icon: "雪", emblem: "/assets/emblems/snow.webp", hero: "sernach" },
    neutral: { name: "中立", short: "中立", color: "#c9a86a", dark: "#2c271f", icon: "旅", emblem: "/assets/emblems/neutral.svg", hero: null }
  };

  const FACTION_IDS = ["pus", "academy", "xizhao", "republic", "empire", "greyharbor", "losutai", "snow"];

  function nextFaction(faction) {
    const i = FACTION_IDS.indexOf(faction);
    return FACTION_IDS[(i + 1) % FACTION_IDS.length];
  }

  const HEROES = {
    lain: {
      id: "lain",
      name: "莱恩·科斯特",
      short: "莱恩",
      faction: "pus",
      hp: 30,
      armor: 10,
      art: "lain",
      quote: "他不是强者。他只是第一个试图理解的人。",
      power: {
        name: "协调",
        cost: 2,
        target: "friendly",
        text: "使一个友方随从获得 +0/+1；若它与另一个友方随从同阵位，改为 +1/+1。"
      },
      passive: { name: "地脉回响", text: "流脉阈值触发时，恢复所有友方单位 4 点生命。" }
    },
    marta: {
      id: "marta",
      name: "玛尔塔·冯·艾森",
      short: "玛尔塔",
      faction: "academy",
      hp: 30,
      armor: 8,
      art: "marta",
      quote: "把问题拆开，答案就会自己露出来。",
      power: {
        name: "演算",
        cost: 2,
        target: "enemy",
        text: "对一个敌方领袖造成 2 点伤害。"
      },
      passive: { name: "演算预载", text: "每回合第一张战术牌的行动力消耗 -2。" }
    },
    otto: {
      id: "otto",
      name: "奥托·汉瑟尔",
      short: "奥托",
      faction: "empire",
      hp: 31,
      armor: 6,
      art: "otto",
      quote: "谈判桌上拿不到的东西，火炮会替我们拿。",
      power: {
        name: "炮击",
        cost: 2,
        target: "enemy",
        text: "对一个敌方随从或敌方领袖造成 1 点伤害。"
      },
      passive: { name: "军工产线", text: "每两回合获得 1 点护甲。" }
    },
    wolfram: {
      id: "wolfram",
      name: "沃尔夫拉姆·冯·施泰因",
      short: "沃尔夫拉姆",
      faction: "republic",
      hp: 35,
      armor: 10,
      art: "wolfram",
      quote: "秩序不是让所有人满意，是让所有人还能坐下。",
      power: {
        name: "筑防",
        cost: 2,
        target: "friendly",
        text: "改写一张手牌：将它变成另一张相同行动力消耗的本阵营或中立卡牌。"
      },
      passive: { name: "铁壁纪律", text: "当一个友方随从获得守备时，它获得 +1/+1。" }
    },
    karna: {
      id: "karna",
      name: "卡尔纳",
      short: "卡尔纳",
      faction: "xizhao",
      hp: 34,
      armor: 9,
      art: "karna",
      quote: "我不是在威胁你。我只是在告诉你，账本上还差多少。",
      power: {
        name: "血祭",
        cost: 2,
        target: "friendly",
        text: "对一个友方随从造成 1 点伤害，抽 1 张牌。"
      },
      passive: { name: "潮汐护体", text: "你的随从不能被冻结；友方随从死亡时，你的领袖恢复 1 点生命。" }
    },
    monarch: {
      id: "monarch",
      name: "莫纳克",
      short: "莫纳克",
      faction: "greyharbor",
      hp: 30,
      armor: 0,
      art: "monarch",
      quote: "守法公民，欠债必还。",
      power: {
        name: "悬赏",
        cost: 2,
        target: "enemy",
        text: "将一个敌方随从列入悬赏名单；它死亡时你抽 1 张牌。"
      },
      passive: { name: "抽成", text: "每当悬赏名单上的随从死亡，你额外获得 1 点护甲。" }
    }
  };

  const CARDS = {
    /* ===== 普卫岛 ===== */
    shextena: {
      id: "shextena", name: "希斯蒂娜", faction: "pus", type: "minion",
      cost: 4, attack: 3, health: 6, rarity: "legendary", art: "shextena",
      keywords: ["battlecry"], target: "friendly",
      text: "登场：恢复一个友方随从 4 点生命；若它原本已受伤，抽 1 张牌。",
      flavor: "温柔是有边界的。",
      battlecry: { type: "healDraw", amount: 4 }
    },
    verious: {
      id: "verious", name: "维里欧斯", faction: "pus", type: "minion",
      cost: 4, attack: 3, health: 5, rarity: "legendary", art: "verious",
      keywords: ["battlecry"], target: "enemy",
      text: "登场：沉默一个敌方随从。",
      flavor: "他教人耐心，也教人怀疑。",
      battlecry: { type: "silence" }
    },
    timon: {
      id: "timon", name: "提蒙", faction: "pus", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "legendary", art: "timon",
      keywords: ["battlecry"], target: "none",
      text: "登场：本回合你打出的下一张牌行动力消耗减少 1。",
      flavor: "晚一秒，在她这里不是小事。",
      battlecry: { type: "nextCost", amount: 1 }
    },
    aidric: {
      id: "aidric", name: "艾德里克", faction: "pus", type: "minion",
      cost: 4, attack: 2, health: 6, rarity: "legendary", art: "aidric",
      keywords: ["taunt"], target: "none",
      text: "守备。每当此随从受到伤害，你获得 1 点护甲。",
      flavor: "克制不是不动，是不失控。",
      passive: { type: "armorOnDamage", amount: 1 }
    },
    orlicas: {
      id: "orlicas", name: "欧莉卡斯", faction: "pus", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "legendary", art: "orlicas",
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌；引脉4：再抽 1 张牌。",
      flavor: "比起相信，她更习惯验证。",
      battlecry: { type: "drawVein", amount: 1, vein: 4, bonus: 1 }
    },
    miyuki: {
      id: "miyuki", name: "深雪", faction: "pus", type: "minion",
      cost: 5, attack: 4, health: 5, rarity: "legendary", art: "miyuki",
      keywords: ["battlecry"], target: "enemyDynamic",
      text: "登场：冻结一个敌方随从；引脉6：改为冻结所有敌方随从。",
      flavor: "吾见过雪落，也见过雪停。",
      battlecry: { type: "freeze", allAtVein: 6 }
    },
    medic_apprentice: {
      id: "medic_apprentice", name: "医疗学徒", faction: "pus", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "friendly",
      text: "登场：恢复一个友方随从 1 点生命。",
      flavor: "医疗部的灯，从来不会只亮一间房。",
      battlecry: { type: "heal", amount: 1 }
    },
    guard: {
      id: "guard", name: "保卫部卫兵", faction: "pus", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "他站在门口，门就有了意义。"
    },
    courier: {
      id: "courier", name: "协调部信使", faction: "pus", type: "minion",
      cost: 1, attack: 1, health: 1, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：本回合你打出的下一张牌行动力消耗减少 1。",
      flavor: "她跑过的路，比地图上画的还多。",
      battlecry: { type: "nextCost", amount: 1 }
    },
    coordination: {
      id: "coordination", name: "协同调度", faction: "pus", type: "spell",
      cost: 1, rarity: "common", art: null, target: "friendly",
      text: "使一个友方随从获得 +1/+1；若它与另一个友方随从同阵位，再恢复 1 点生命。",
      flavor: "把正确的人，放在正确的位置。",
      spell: { type: "buffHeal", attack: 1, health: 1, healIfTogether: 1 }
    },
    emergency: {
      id: "emergency", name: "应急响应", faction: "pus", type: "spell",
      cost: 3, rarity: "common", art: null, target: "friendly",
      text: "恢复一个友方随从 6 点生命；抽 1 张牌。",
      flavor: "窗口只有一次，晚一秒就不是窗口。",
      spell: { type: "healDraw", amount: 6, draw: 1 }
    },
    resonance: {
      id: "resonance", name: "流脉共鸣", faction: "pus", type: "spell",
      cost: 3, rarity: "common", art: null, target: "none", excavate: 1,
      text: "抽 2 张牌；掘脉1。",
      flavor: "灯亮起来的时候，北港的雾会退半尺。",
      spell: { type: "draw", amount: 2 }
    },

    /* ===== 西昭 ===== */
    tiega: {
      id: "tiega", name: "铁牙·阿古", faction: "xizhao", type: "minion",
      cost: 4, attack: 4, health: 4, rarity: "legendary", art: "tiega",
      keywords: ["charge", "battlecry"], target: "none", bloodCost: 2,
      text: "先遣。血祭2：获得 +2 攻击。",
      flavor: "力量就该正面用。",
      battlecry: { type: "bloodAttack", amount: 2 }
    },
    lanxi: {
      id: "lanxi", name: "澜汐", faction: "xizhao", type: "minion",
      cost: 5, attack: 4, health: 4, rarity: "legendary", art: "lanxi",
      keywords: ["battlecry"], target: "none",
      text: "登场：召唤两个 1/1 洛斯汰魔物；引脉5：使这些魔物获得守备。",
      flavor: "我的族人还有多少活着。",
      battlecry: { type: "summonTwo", token: "losutai_imp", attack: 1, health: 1, vein: 5, tauntAtVein: true }
    },
    lize: {
      id: "lize", name: "莉泽", faction: "xizhao", type: "minion",
      cost: 1, attack: 2, health: 2, rarity: "legendary", art: "lize",
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌；若你控制另一个友方随从，对其造成 1 点伤害。",
      flavor: "人质也有自己的账。",
      battlecry: { type: "drawDamageAlly", amount: 1 }
    },
    grayfeather: {
      id: "grayfeather", name: "灰羽·乌恩", faction: "xizhao", type: "minion",
      cost: 4, attack: 4, health: 5, rarity: "legendary", art: "grayfeather",
      keywords: ["battlecry"], target: "friendly",
      text: "登场：使一个友方随从获得 +2/+2；引脉4：再使其获得守备。",
      flavor: "祖先的雪，落在我肩上。",
      battlecry: { type: "buffTaunt", attack: 2, health: 2, vein: 4 }
    },
    lanzhou: {
      id: "lanzhou", name: "澜舟", faction: "xizhao", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "legendary", art: "lanzhou",
      keywords: ["battlecry"], target: "none",
      text: "登场：召唤一个 1/1 洛斯汰魔物。",
      flavor: "还没觉醒，也听得见海。",
      battlecry: { type: "summon", token: "losutai_imp" }
    },
    molan: {
      id: "molan", name: "墨兰", faction: "xizhao", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "legendary", art: "molan",
      keywords: ["battlecry"], target: "friendly",
      text: "登场：使一个友方随从获得隐匿。",
      flavor: "使节先学会闭嘴。",
      battlecry: { type: "stealth" }
    },
    tribal_warrior: {
      id: "tribal_warrior", name: "部落战士", faction: "xizhao", type: "minion",
      cost: 1, attack: 2, health: 3, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none", bloodCost: 1,
      text: "血祭1：获得 +1/+1。",
      flavor: "西昭的孩子先学会握刀，再学会名字。",
      battlecry: { type: "bloodBuff", attack: 1, health: 1 }
    },
    blood_servant: {
      id: "blood_servant", name: "血族仆从", faction: "xizhao", type: "minion",
      cost: 3, attack: 3, health: 4, rarity: "common", art: null,
      keywords: ["deathrattle"], target: "none",
      text: "余响：使一个友方随从获得 +1 攻击。",
      flavor: "他还不懂主人在算什么。",
      deathrattle: { type: "buffRandomAlly", attack: 1 }
    },
    losutai_hunter: {
      id: "losutai_hunter", name: "洛斯汰猎手", faction: "xizhao", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "common", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：对一个敌方随从造成 1 点伤害。",
      flavor: "它不恨谁，只是饿了。",
      battlecry: { type: "damage", amount: 1 }
    },
    blood_ritual: {
      id: "blood_ritual", name: "血祭仪式", faction: "xizhao", type: "spell",
      cost: 2, rarity: "common", art: null, target: "friendly",
      text: "对一个友方随从造成 2 点伤害，抽 1 张牌；若该随从死亡，再抽 1 张牌。",
      flavor: "血是筹码，不是生命。",
      spell: { type: "bloodDraw", damage: 1, draw: 1, extraIfDead: 1 }
    },
    monster_summon: {
      id: "monster_summon", name: "魔物召唤", faction: "xizhao", type: "spell",
      cost: 3, rarity: "common", art: null, target: "none",
      text: "召唤一个 3/3 洛斯汰魔物；引脉4：再召唤一个 1/1 洛斯汰魔物。",
      flavor: "海里有东西应了它。",
      spell: { type: "summonMonster", vein: 4 }
    },
    shadow_raid: {
      id: "shadow_raid", name: "暗影先遣", faction: "xizhao", type: "spell",
      cost: 2, rarity: "common", art: null, target: "friendly",
      text: "使一个友方随从获得 +2 攻击和先遣。",
      flavor: "西昭不敲门。",
      spell: { type: "buffCharge", attack: 2 }
    },

    /* ===== 学院 ===== */
    karl_desmond: {
      id: "karl_desmond", name: "卡尔·德斯蒙德", faction: "academy", type: "minion",
      cost: 4, attack: 6, health: 6, rarity: "legendary", art: "karl_desmond",
      keywords: ["battlecry"], target: "none",
      text: "登场：检索一张战术牌。",
      flavor: "他不相信答案，只相信问题问得够不够好。",
      battlecry: { type: "discover", pool: "spell" }
    },
    justus: {
      id: "justus", name: "尤斯图斯·维尔纳", faction: "academy", type: "minion",
      cost: 3, attack: 4, health: 5, rarity: "legendary", art: "justus",
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌；引脉4：再抽 1 张牌。",
      flavor: "记录不是为了记住，是为了有一天能反驳。",
      battlecry: { type: "drawVein", amount: 1, vein: 4, bonus: 1 }
    },
    cassian: {
      id: "cassian", name: "卡西安·维尔", faction: "academy", type: "minion",
      cost: 4, attack: 6, health: 5, rarity: "legendary", art: "cassian",
      keywords: ["charge"], target: "none",
      text: "先遣。学院不只有辩论，也有把辩论结束的人。",
      flavor: "先动手，再写会议纪要。"
    },
    samuel: {
      id: "samuel", name: "塞缪尔·奎因", faction: "academy", type: "minion",
      cost: 2, attack: 2, health: 4, rarity: "legendary", art: "samuel",
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌。",
      flavor: "他问了七个问题，第六个让对面沉默了。",
      battlecry: { type: "draw", amount: 1 }
    },
    nina: {
      id: "nina", name: "妮娜·索雷尔", faction: "academy", type: "minion",
      cost: 2, attack: 3, health: 4, rarity: "legendary", art: "nina",
      keywords: ["battlecry"], target: "enemy",
      text: "登场：冻结一个敌方随从。",
      flavor: "冷静是一种攻击方式。",
      battlecry: { type: "freeze" }
    },
    doorman: {
      id: "doorman", name: "老门房", faction: "academy", type: "minion",
      cost: 1, attack: 1, health: 5, rarity: "common", art: "doorman",
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "他记得每一张脸，也记得谁没有登记。"
    },
    lecturer: {
      id: "lecturer", name: "学院讲师", faction: "academy", type: "minion",
      cost: 3, attack: 3, health: 4, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌。",
      flavor: "讲义第一页：不要相信讲义。",
      battlecry: { type: "draw", amount: 1 }
    },
    archive_search: {
      id: "archive_search", name: "档案检索", faction: "academy", type: "spell",
      cost: 2, rarity: "common", art: null, target: "none",
      text: "抽 2 张牌。",
      flavor: "索引比答案更值钱。",
      spell: { type: "draw", amount: 2 }
    },
    frost_seal: {
      id: "frost_seal", name: "寒霜封印", faction: "academy", type: "spell",
      cost: 2, rarity: "common", art: null, target: "enemy",
      text: "冻结一个敌方随从；抽 1 张牌。",
      flavor: "把一页纸冻住，它就不会被改写。",
      spell: { type: "freezeDraw", draw: 1 }
    },
    debate: {
      id: "debate", name: "学术辩论", faction: "academy", type: "spell",
      cost: 1, rarity: "common", art: null, target: "enemy",
      text: "对一个敌方随从造成 2 点伤害。",
      flavor: "真理越辩越明，人越辩越少。",
      spell: { type: "damage", amount: 2 }
    },
    insight: {
      id: "insight", name: "洞察", faction: "academy", type: "spell",
      cost: 1, rarity: "common", art: null, target: "none",
      text: "抽 1 张牌；掘脉1。",
      flavor: "看得越深，脚下的脉越响。",
      excavate: 1,
      spell: { type: "draw", amount: 1 }
    },
    prohibition: {
      id: "prohibition", name: "禁制令", faction: "academy", type: "spell",
      cost: 3, rarity: "common", art: null, target: "none",
      text: "冻结所有敌方随从。",
      flavor: "学院最严厉的处分，通常只是一张纸。",
      spell: { type: "freezeAll" }
    },

    /* ===== 共和国 ===== */
    konrad: {
      id: "konrad", name: "康拉德·威廉莱斯", faction: "republic", type: "minion",
      cost: 4, attack: 4, health: 6, rarity: "legendary", art: "konrad",
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：获得 2 点护甲。",
      flavor: "城墙不是石头，是人愿意站在上面。",
      battlecry: { type: "armor", amount: 2 }
    },
    erhardt: {
      id: "erhardt", name: "埃尔哈特·冯·罗森", faction: "republic", type: "minion",
      cost: 4, attack: 4, health: 3, rarity: "legendary", art: "erhardt",
      keywords: ["charge"], target: "none",
      text: "先遣。",
      flavor: "他先到，谈判随后到。"
    },
    beatrix: {
      id: "beatrix", name: "贝娅特丽克丝·冯·艾森胡特", faction: "republic", type: "minion",
      cost: 4, attack: 3, health: 6, rarity: "legendary", art: "beatrix",
      keywords: ["battlecry"], target: "friendly",
      text: "登场：使一个友方随从获得 +1/+2 与守备。",
      flavor: "她让所有人都有座位，也记得谁没有。",
      battlecry: { type: "buffTaunt", attack: 1, health: 2 }
    },
    elena: {
      id: "elena", name: "伊莲娜·索菲", faction: "republic", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "legendary", art: "elena",
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌。",
      flavor: "每一份档案都有第二份，放在她手里。",
      battlecry: { type: "draw", amount: 1 }
    },
    hans: {
      id: "hans", name: "汉斯·冯·霍尔姆", faction: "republic", type: "minion",
      cost: 2, attack: 2, health: 3, rarity: "legendary", art: "hans",
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "他挡不住所有东西，但挡得住第一下。"
    },
    cedric: {
      id: "cedric", name: "塞德里克·威廉莱斯", faction: "republic", type: "minion",
      cost: 5, attack: 4, health: 6, rarity: "legendary", art: "cedric",
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "冠冕是重量，不是光。"
    },
    republic_guard: {
      id: "republic_guard", name: "共和国卫兵", faction: "republic", type: "minion",
      cost: 2, attack: 2, health: 3, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "站好，别让后面的人看见你退。"
    },
    shield_bearer: {
      id: "shield_bearer", name: "持盾侍从", faction: "republic", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "盾比人先学会沉默。"
    },
    fortify: {
      id: "fortify", name: "筑防令", faction: "republic", type: "spell",
      cost: 2, rarity: "common", art: null, target: "friendly",
      text: "使一个友方随从获得 +0/+2 与守备。",
      flavor: "先把门立住，再谈窗。",
      spell: { type: "buffTaunt", attack: 0, health: 2 }
    },
    volley: {
      id: "volley", name: "排枪齐射", faction: "republic", type: "spell",
      cost: 2, rarity: "common", art: null, target: "enemy",
      text: "对一个敌方随从造成 2 点伤害。",
      flavor: "纪律让一排枪变成一件武器。",
      spell: { type: "damage", amount: 2 }
    },
    levy: {
      id: "levy", name: "征募令", faction: "republic", type: "spell",
      cost: 3, rarity: "common", art: null, target: "none",
      text: "抽 2 张牌。",
      flavor: "名单上多一个名字，城墙上多一只手。",
      spell: { type: "draw", amount: 2 }
    },
    martial_law: {
      id: "martial_law", name: "戒严令", faction: "republic", type: "spell",
      cost: 4, rarity: "common", art: null, target: "none",
      text: "冻结所有敌方随从。",
      flavor: "钟声停下之前，谁都不许动。",
      spell: { type: "freezeAll" }
    },

    /* ===== 帝国 ===== */
    gunther: {
      id: "gunther", name: "京特·冯·艾森瓦尔德", faction: "empire", type: "minion",
      cost: 4, attack: 3, health: 5, rarity: "legendary", art: "gunther",
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：获得 3 点护甲。",
      flavor: "帝国的城墙从不在乎谁先流血。",
      battlecry: { type: "armor", amount: 3 }
    },
    klaus: {
      id: "klaus", name: "克劳斯·莱茵哈特", faction: "empire", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "legendary", art: "klaus",
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "他的军靴比他的勋章更旧。"
    },
    mia: {
      id: "mia", name: "米娅·科尔贝", faction: "empire", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "legendary", art: "mia",
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌。",
      flavor: "她送来的信，通常比信里的内容更早决定结局。",
      battlecry: { type: "draw", amount: 1 }
    },
    elsa: {
      id: "elsa", name: "艾尔莎·汉瑟尔", faction: "empire", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "legendary", art: "elsa",
      keywords: ["battlecry"], target: "friendly",
      text: "登场：恢复一个友方随从 2 点生命。",
      flavor: "帝国的炉火不为胜利燃烧，只为活人。",
      battlecry: { type: "heal", amount: 2 }
    },
    karl_schwarz: {
      id: "karl_schwarz", name: "卡尔·冯·施瓦茨", faction: "empire", type: "minion",
      cost: 4, attack: 4, health: 3, rarity: "legendary", art: "karl_schwarz",
      keywords: ["charge"], target: "none",
      text: "先遣。",
      flavor: "他相信速度能解决大多数问题，剩下的用剑。"
    },
    walter: {
      id: "walter", name: "瓦尔特·克鲁格", faction: "empire", type: "minion",
      cost: 5, attack: 4, health: 4, rarity: "legendary", art: "walter",
      keywords: ["battlecry"], target: "enemy",
      text: "登场：对一个敌方随从造成 2 点伤害。",
      flavor: "命令只有一句：推进。",
      battlecry: { type: "damage", amount: 2 }
    },
    empire_guard: {
      id: "empire_guard", name: "帝国卫兵", faction: "empire", type: "minion",
      cost: 2, attack: 2, health: 3, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "他们守的是秩序，不是某个人。"
    },
    ironclad: {
      id: "ironclad", name: "铁甲步兵", faction: "empire", type: "minion",
      cost: 3, attack: 3, health: 4, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "铁会生锈，纪律不会。"
    },
    barrage: {
      id: "barrage", name: "炮火覆盖", faction: "empire", type: "spell",
      cost: 2, rarity: "common", art: null, target: "enemy",
      text: "对一个敌方随从造成 2 点伤害。",
      flavor: "先开炮，再画地图。",
      spell: { type: "damage", amount: 2 }
    },
    mobilize: {
      id: "mobilize", name: "全国动员", faction: "empire", type: "spell",
      cost: 3, rarity: "common", art: null, target: "none",
      text: "抽 2 张牌。",
      flavor: "帝国的车轮一旦转动，就不会为一个人停下。",
      spell: { type: "draw", amount: 2 }
    },
    fortress: {
      id: "fortress", name: "要塞令", faction: "empire", type: "spell",
      cost: 2, rarity: "common", art: null, target: "friendly",
      text: "使一个友方随从获得 +0/+3 与守备。",
      flavor: "把一个人变成一堵墙，只需要一纸命令。",
      spell: { type: "buffTaunt", attack: 0, health: 3 }
    },
    martial_court: {
      id: "martial_court", name: "军事法庭", faction: "empire", type: "spell",
      cost: 4, rarity: "common", art: null, target: "none",
      text: "冻结所有敌方随从。",
      flavor: "在帝国，沉默也是一种判决。",
      spell: { type: "freezeAll" }
    },

    /* ===== 中立 ===== */
    monarch: {
      id: "monarch", name: "莫纳克", faction: "neutral", type: "minion",
      cost: 4, attack: 4, health: 4, rarity: "legendary", art: "monarch",
      keywords: ["battlecry"], target: "none",
      text: "登场：检索一张任意阵营的可收集牌。",
      flavor: "守法公民，欠债必还。",
      battlecry: { type: "discover", pool: "any" }
    },
    gok_digger: {
      id: "gok_digger", name: "戈克掘脉者", faction: "neutral", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none", excavate: 1,
      text: "掘脉1；登场：获得 2 点护甲。",
      flavor: "挖得越深，灯越亮。",
      battlecry: { type: "armor", amount: 2 }
    },
    fog_sailor: {
      id: "fog_sailor", name: "雾港水手", faction: "neutral", type: "minion",
      cost: 1, attack: 2, health: 1, rarity: "common", art: null,
      keywords: [], target: "none",
      text: "",
      flavor: "雾港不缺船，缺的是回程。"
    },
    snow_medic: {
      id: "snow_medic", name: "雪镇医者", faction: "neutral", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "friendly",
      text: "登场：恢复一个友方随从 1 点生命。",
      flavor: "雪镇的药，苦，但管用。",
      battlecry: { type: "heal", amount: 1 }
    },
    sim_assistant: {
      id: "sim_assistant", name: "推演助手", faction: "neutral", type: "minion",
      cost: 2, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌。",
      flavor: "档案处的第七把椅子，永远有人。",
      battlecry: { type: "draw", amount: 1 }
    },
    bard: {
      id: "bard", name: "吟游诗人", faction: "neutral", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌；引脉4：再抽 1 张牌。",
      flavor: "今晚流脉改道，北港的灯又暗了三分。",
      battlecry: { type: "drawVein", amount: 1, vein: 4, bonus: 1 }
    },
    blood_retainer: {
      id: "blood_retainer", name: "血族侍从", faction: "neutral", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none", bloodCost: 1,
      text: "血祭1：获得 +1/+1。",
      flavor: "他还不懂主人在算什么。",
      battlecry: { type: "bloodBuff", attack: 1, health: 1 }
    },
    vein_prospect: {
      id: "vein_prospect", name: "流脉勘探", faction: "neutral", type: "spell",
      cost: 2, rarity: "common", art: null, target: "none", excavate: 1,
      text: "抽 1 张牌；掘脉1。",
      flavor: "先画脉，再下铲。",
      spell: { type: "draw", amount: 1 }
    },
    vein_channel: {
      id: "vein_channel", name: "流脉疏导", faction: "neutral", type: "spell",
      cost: 2, rarity: "common", art: null, target: "none",
      text: "逆脉1：抽 1 张牌。",
      flavor: "会挖的人，也要会放。",
      reflux: 1,
      spell: { type: "draw", amount: 1 }
    },
    mining_permit: {
      id: "mining_permit", name: "掘脉许可", faction: "neutral", type: "spell",
      cost: 0, rarity: "token", art: null, target: "none", token: true,
      text: "本回合获得 2 点行动力。",
      flavor: "许可从来不是免费的。",
      spell: { type: "gainMana", amount: 2 }
    },

    vein_warden: {
      id: "vein_warden", name: "流脉守望者", faction: "neutral", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "他守的不是门，是门后面的东西。"
    },
    mist_hound: {
      id: "mist_hound", name: "雾猎犬", faction: "neutral", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null,
      keywords: ["charge"], target: "none",
      text: "先遣。",
      flavor: "雾里有东西先动了。"
    },
    archive_scribe: {
      id: "archive_scribe", name: "档案抄写员", faction: "neutral", type: "minion",
      cost: 2, attack: 1, health: 3, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌。",
      flavor: "副本比原稿更安全。",
      battlecry: { type: "draw", amount: 1 }
    },
    field_medic: {
      id: "field_medic", name: "战地医者", faction: "neutral", type: "minion",
      cost: 2, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "friendly",
      text: "登场：恢复一个友方随从 1 点生命。",
      flavor: "先止血，再问名字。",
      battlecry: { type: "heal", amount: 1 }
    },
    old_ledger: {
      id: "old_ledger", name: "旧账本", faction: "neutral", type: "spell",
      cost: 2, rarity: "common", art: null, target: "none", excavate: 1,
      text: "抽 1 张牌；掘脉1。",
      flavor: "有些账，翻页就会响。",
      spell: { type: "draw", amount: 1 }
    },
    vein_prism: {
      id: "vein_prism", name: "流脉棱镜", faction: "neutral", type: "spell",
      cost: 3, rarity: "common", art: null, target: "none",
      text: "抽 1 张牌；引脉4：再抽 1 张牌。",
      flavor: "光穿过它时，会先问一句值不值。",
      spell: { type: "drawVein", amount: 1, vein: 4, bonus: 1 }
    },

    mist_scout: {
      id: "mist_scout", name: "雾境斥候", faction: "neutral", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null,
      keywords: ["charge"], target: "none",
      text: "先遣。",
      flavor: "他先看见你，你才看见雾。"
    },
    archive_guard: {
      id: "archive_guard", name: "档案守卫", faction: "neutral", type: "minion",
      cost: 2, attack: 2, health: 3, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "档案室的门比城墙难进。"
    },
    vein_medic: {
      id: "vein_medic", name: "流脉医师", faction: "neutral", type: "minion",
      cost: 2, attack: 1, health: 3, rarity: "common", art: null,
      keywords: ["battlecry"], target: "friendly",
      text: "登场：恢复一个友方随从 2 点生命。",
      flavor: "她治伤，也顺手记录脉动。",
      battlecry: { type: "heal", amount: 2 }
    },
    field_engineer: {
      id: "field_engineer", name: "战地工程师", faction: "neutral", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：获得 2 点护甲。",
      flavor: "先搭掩体，再谈勇气。",
      battlecry: { type: "armor", amount: 2 }
    },
    caravan_guard: {
      id: "caravan_guard", name: "商队护卫", faction: "neutral", type: "minion",
      cost: 4, attack: 3, health: 5, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "货可以少，人得回去。"
    },
    mercenary: {
      id: "mercenary", name: "自由佣兵", faction: "neutral", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "common", art: null,
      keywords: [], target: "none",
      text: "没有阵营，只有价钱。",
      flavor: "他为一枚旧硬币而来。"
    },
    bounty_hunter: {
      id: "bounty_hunter", name: "赏金猎人", faction: "neutral", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "common", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：对一个敌方随从造成 1 点伤害。",
      flavor: "赏金不是钱，是别人愿意付多少。",
      battlecry: { type: "damage", amount: 1 }
    },
    supply_cache: {
      id: "supply_cache", name: "补给箱", faction: "neutral", type: "spell",
      cost: 2, rarity: "common", art: null, target: "none",
      text: "抽 1 张牌。",
      flavor: "打开之前，谁都不知道里面是什么。",
      spell: { type: "draw", amount: 1 }
    },
    smoke_screen: {
      id: "smoke_screen", name: "烟雾弹", faction: "neutral", type: "spell",
      cost: 2, rarity: "common", art: null, target: "enemy",
      text: "冻结一个敌方随从；抽 1 张牌。",
      flavor: "等雾散的时候，位置已经换了。",
      spell: { type: "freezeDraw", draw: 1 }
    },
    recon: {
      id: "recon", name: "战前侦察", faction: "neutral", type: "spell",
      cost: 1, rarity: "common", art: null, target: "none", excavate: 1,
      text: "抽 1 张牌；掘脉1。",
      flavor: "地图上多画一笔，少死一个人。",
      spell: { type: "draw", amount: 1 }
    },

    /* ===== 阵营新高费 ===== */
    vein_oracle: {
      id: "vein_oracle", name: "引脉先知", faction: "pus", type: "minion",
      cost: 5, attack: 4, health: 4, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +1；引脉8：抽 1 张牌。",
      flavor: "她闭着眼，却比测量员更清楚井下的走向。",
      battlecry: { type: "veinDraw", amount: 1, vein: 8, draw: 1 }
    },
    spell_echo: {
      id: "spell_echo", name: "法术回响", faction: "academy", type: "minion",
      cost: 6, attack: 3, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：检索一张战术牌。",
      flavor: "同一句咒文，念第二遍时总会长出新的意思。",
      battlecry: { type: "discover", pool: "spell" }
    },
    losutai_matriarch: {
      id: "losutai_matriarch", name: "洛斯汰母兽", faction: "xizhao", type: "minion",
      cost: 6, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["deathrattle"], target: "none",
      text: "余响：召唤两个 1/1 的洛斯汰魔物。",
      flavor: "潮水退去时，她已经把巢筑在船舱下面。",
      deathrattle: { type: "summon", token: "losutai_imp", count: 2 }
    },
    shield_marshal: {
      id: "shield_marshal", name: "持盾元帅", faction: "republic", type: "minion",
      cost: 6, attack: 4, health: 6, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "friendly",
      text: "守备。登场：使一个友方随从获得守备。",
      flavor: "她从不站在队伍后面，只把队伍挡在身后。",
      battlecry: { type: "buffTaunt", attack: 0, health: 0 }
    },
    siege_train: {
      id: "siege_train", name: "攻城列车", faction: "empire", type: "minion",
      cost: 7, attack: 5, health: 7, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：对所有敌方随从造成 2 点伤害。",
      flavor: "帝国的铁轨铺到哪里，哪里就会先听见风声。",
      battlecry: { type: "damageAllEnemies", amount: 2 }
    },
    void_titan: {
      id: "void_titan", name: "虚空泰坦", faction: "neutral", type: "minion",
      cost: 10, attack: 8, health: 8, rarity: "legendary", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：消灭一个敌方随从。",
      flavor: "它没有影子，因为影子先被它吞掉了。",
      battlecry: { type: "destroy" }
    },

    /* ===== 流脉双向 ===== */
    borrow_vein: {
      id: "borrow_vein", name: "借脉", faction: "academy", type: "spell",
      cost: 1, rarity: "rare", art: null, target: "none",
      text: "本回合获得 2 行动力；你的回合结束时流脉 +2。",
      flavor: "先借明天的蓝，再还昨天的债。",
      spell: { type: "borrowVein", mana: 2, debt: 2 }
    },
    reflux: {
      id: "reflux", name: "逆脉", faction: "xizhao", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害；恢复你的领袖 3 点生命。",
      flavor: "潮水退回去时，也会把伤口一起带走。",
      pressure: 3,
      spell: { type: "healHero", amount: 3 }
    },
    stabilize: {
      id: "stabilize", name: "镇脉", faction: "republic", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "逆脉2：获得 2 点护甲。",
      flavor: "秩序的工作，就是让河流按堤坝走。",
      reflux: 2,
      spell: { type: "armor", amount: 2 }
    },
    pressure_vein: {
      id: "pressure_vein", name: "压脉", faction: "empire", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害。",
      flavor: "把地脉压进炮膛，然后扣下扳机。",
      pressure: 3,
      spell: { type: "none" }
    },
    return_tide: {
      id: "return_tide", name: "回潮", faction: "pus", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "逆脉2：恢复你的领袖 2 点生命；抽 1 张牌。",
      flavor: "退潮不是结束，是把力量收回身体里。",
      reflux: 2,
      spell: { type: "healHeroDraw", amount: 2, draw: 1 }
    },

    /* ===== 阵型 ===== */
    formation_vein: {
      id: "formation_vein", name: "地脉阵线", faction: "pus", type: "formation",
      cost: 3, rarity: "rare", art: null, target: "none",
      text: "阵型：该阵位友方随从获得 +0/+1。",
      flavor: "让地脉从脚下经过，而不是从头顶。",
      formation: { attack: 0, health: 1 }
    },
    formation_script: {
      id: "formation_script", name: "演算阵线", faction: "academy", type: "formation",
      cost: 3, rarity: "rare", art: null, target: "none",
      text: "阵型：该阵位友方随从获得 +1/+0。",
      flavor: "先画线，再让人站进去。",
      formation: { attack: 1, health: 0 }
    },
    formation_tide: {
      id: "formation_tide", name: "潮痕阵线", faction: "xizhao", type: "formation",
      cost: 3, rarity: "rare", art: null, target: "none",
      text: "阵型：该阵位友方随从获得 +1/+0。",
      flavor: "潮水退去后，留下的痕迹就是战壕。",
      formation: { attack: 1, health: 0 }
    },
    formation_wall: {
      id: "formation_wall", name: "盾墙阵线", faction: "republic", type: "formation",
      cost: 3, rarity: "rare", art: null, target: "none",
      text: "阵型：该阵位友方随从获得 +0/+2。",
      flavor: "阵线不是一条线，是一排不会退的人。",
      formation: { attack: 0, health: 2 }
    },
    formation_cannon: {
      id: "formation_cannon", name: "炮列阵线", faction: "empire", type: "formation",
      cost: 4, rarity: "rare", art: null, target: "none",
      text: "阵型：该阵位友方随从获得 +1/+1。",
      flavor: "把炮摆成一条线，敌人就只剩一个方向。",
      formation: { attack: 1, health: 1 }
    },

    /* ===== 装备 / 阵位机制 ===== */
    vein_heart: {
      id: "vein_heart", name: "地脉之心", faction: "pus", type: "relic",
      cost: 3, rarity: "legendary", art: null, target: "none",
      text: "装备：每当流脉增加时，获得 1 点护甲。",
      flavor: "它跳动的节奏，和城下的地脉一模一样。"
    },
    spell_codex: {
      id: "spell_codex", name: "留存法典", faction: "academy", type: "relic",
      cost: 3, rarity: "legendary", art: null, target: "none",
      text: "装备：每个你的回合，第一张战术牌的行动力消耗 -1。",
      flavor: "法术释放之后，公式会留在书页上。"
    },
    blood_scythe: {
      id: "blood_scythe", name: "血潮镰", faction: "xizhao", type: "relic",
      cost: 3, rarity: "legendary", art: null, target: "none",
      text: "装备：友方随从死亡时，你的领袖恢复 2 点生命。",
      flavor: "每一道潮痕都是收割过的名字。"
    },
    iron_banner: {
      id: "iron_banner", name: "铁壁军旗", faction: "republic", type: "relic",
      cost: 3, rarity: "legendary", art: null, target: "none",
      text: "装备：你召唤的守备随从获得 +0/+1。",
      flavor: "旗子插在哪里，哪里就是阵线。"
    },
    powder_engine: {
      id: "powder_engine", name: "火药引擎", faction: "empire", type: "relic",
      cost: 4, rarity: "legendary", art: null, target: "none",
      text: "装备：你的回合开始时若敌方领袖没有护甲，造成 1 点伤害。",
      flavor: "它不需要瞄准，只需要一直转。"
    },
    zone_keeper: {
      id: "zone_keeper", name: "同阵守望者", faction: "pus", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "rare", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：若同阵位有另一个友方随从，获得 +2/+2。",
      flavor: "阵位不是格子，是彼此能看见的距离。",
      battlecry: { type: "zoneSelfBuff", attack: 2, health: 2 }
    },
    zone_archivist: {
      id: "zone_archivist", name: "三阵记录员", faction: "academy", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "rare", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：若三个友方阵位都有随从，抽 1 张牌。",
      flavor: "三个阵位都在场，答案才有地方落笔。",
      battlecry: { type: "drawIfZones", draw: 1 }
    },
    zone_reaper: {
      id: "zone_reaper", name: "断阵收割者", faction: "xizhao", type: "minion",
      cost: 4, attack: 3, health: 3, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：消灭目标所在阵位的所有敌方随从。",
      flavor: "它不追人，只切断人站在一起的那条线。",
      battlecry: { type: "destroyZone" }
    },
    zone_banner: {
      id: "zone_banner", name: "阵线旗手", faction: "republic", type: "minion",
      cost: 4, attack: 3, health: 6, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：同阵位所有具有守备的友方随从获得 +0/+1。",
      flavor: "旗手站的位置，就是所有人最后退到的地方。",
      battlecry: { type: "buffTauntZone", health: 1 }
    },
    zone_barrage: {
      id: "zone_barrage", name: "阵位齐射", faction: "empire", type: "spell",
      cost: 4, rarity: "epic", art: null, target: "enemy",
      text: "对一个敌方随从所在阵位的所有敌方随从造成 2 点伤害。",
      flavor: "帝国的炮火从不瞄准一个人。",
      spell: { type: "damageZone", amount: 2 }
    },

    /* ===== 关键词扩展 ===== */
    vein_bulwark: {
      id: "vein_bulwark", name: "引脉壁垒", faction: "pus", type: "minion",
      cost: 4, attack: 3, health: 5, rarity: "epic", art: null,
      keywords: ["divineShield", "lifesteal"], target: "none",
      text: "格挡，血偿。",
      flavor: "他把自己变成了一堵会流血的墙。",
    },
    overload_ritual: {
      id: "overload_ritual", name: "泄流仪式", faction: "pus", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "enemy", overload: 2,
      text: "对一个敌方随从造成 4 点伤害；反噬 2。",
      flavor: "借来的力量，明天要还。",
      spell: { type: "damage", amount: 4 }
    },
    aegis_guard: {
      id: "aegis_guard", name: "格挡守卫", faction: "republic", type: "minion",
      cost: 5, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["divineShield", "taunt"], target: "none",
      text: "格挡，守备。",
      flavor: "第一下打不穿，第二下才有资格谈条件。",
    },
    wind_cannon: {
      id: "wind_cannon", name: "风压炮", faction: "empire", type: "minion",
      cost: 5, attack: 4, health: 4, rarity: "epic", art: null,
      keywords: ["windfury"], target: "none",
      text: "连携。",
      flavor: "第一炮是警告，第二炮才是回答。",
    },
    venom_fang: {
      id: "venom_fang", name: "毒潮獠牙", faction: "xizhao", type: "minion",
      cost: 3, attack: 2, health: 2, rarity: "rare", art: null,
      keywords: ["poisonous"], target: "none",
      text: "蚀毒。",
      flavor: "被它咬中的东西，最后都会沉进潮里。",
    },
    rebirth_serpent: {
      id: "rebirth_serpent", name: "回潮潮蛇", faction: "xizhao", type: "minion",
      cost: 5, attack: 4, health: 4, rarity: "epic", art: null,
      keywords: ["reborn"], target: "none",
      text: "回潮。",
      flavor: "潮水退一次，它就换一层皮。",
    },
    rush_lancer: {
      id: "rush_lancer", name: "先遣枪骑", faction: "empire", type: "minion",
      cost: 3, attack: 3, health: 2, rarity: "rare", art: null,
      keywords: ["rush"], target: "none",
      text: "先遣。",
      flavor: "他只负责第一下，第二下交给后面的人。",
    },
    combo_spark: {
      id: "combo_spark", name: "顺势火花", faction: "academy", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "enemy",
      text: "对一个敌方随从造成 1 点伤害；顺势：改为 3 点。",
      flavor: "第一下是引子，第二下才是句子。",
      spell: { type: "comboDamage", amount: 3, otherwise: 1 }
    },

    /* ===== 一费与蓄能：阵营扩展 ===== */
    vein_scout: {
      id: "vein_scout", name: "引脉斥候", faction: "pus", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +1。",
      flavor: "他跑得比地脉还快，至少他自己这么认为。",
      battlecry: { type: "veinOnly", amount: 1 }
    },
    vein_channeler: {
      id: "vein_channeler", name: "引脉导流者", faction: "pus", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "rare", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：本回合获得 1 行动力；流脉 +1。",
      flavor: "她把地脉接进自己的手臂，只借一回合。",
      battlecry: { type: "rampMana", amount: 1, vein: 1 }
    },
    excavation_titan: {
      id: "excavation_titan", name: "掘脉泰坦", faction: "pus", type: "minion",
      cost: 7, attack: 5, health: 7, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +1；引脉8：获得 +2/+2 和守备。",
      flavor: "它挖穿的不是岩层，是世界的血管。",
      battlecry: { type: "veinBuff", amount: 1, vein: 8, attack: 2, health: 2 }
    },
    spell_novice: {
      id: "spell_novice", name: "法术学徒", faction: "academy", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：本回合你的下一张法术行动力消耗 -1。",
      flavor: "她只学会了一个咒语，但学会了怎么省着用。",
      battlecry: { type: "discountSpell", amount: 1 }
    },
    mana_surge: {
      id: "mana_surge", name: "奥能涌动", faction: "academy", type: "spell",
      cost: 1, rarity: "rare", art: null, target: "none",
      text: "本回合获得 2 行动力。",
      flavor: "把明天的力气今天用完。",
      spell: { type: "rampSpell", amount: 2 }
    },
    arcane_conduit: {
      id: "arcane_conduit", name: "奥术导管", faction: "academy", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "rare", art: null,
      keywords: ["passive"], target: "none",
      text: "被动：每当你施放一张战术牌，获得 1 点护甲。",
      flavor: "她把每次施法都接进了学院的护盾回路。",
      passive: { type: "spellArmor", amount: 1 }
    },
    blood_imp: {
      id: "blood_imp", name: "血潮小鬼", faction: "xizhao", type: "minion",
      cost: 1, attack: 2, health: 1, rarity: "common", art: null,
      keywords: ["deathrattle"], target: "none",
      text: "余响：召唤一个 1/1 的洛斯汰魔物。",
      flavor: "它死的时候，潮水会替它叫一声。",
      deathrattle: { type: "summon", token: "losutai_imp" }
    },
    blood_pact: {
      id: "blood_pact", name: "血契", faction: "xizhao", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "支付 2 点生命，召唤两个 1/1 的洛斯汰魔物。",
      flavor: "签名的地方不是纸，是手腕。",
      spell: { type: "bloodSummon", health: 2, token: "losutai_imp", count: 2 }
    },
    blood_priestess: {
      id: "blood_priestess", name: "血潮祭司", faction: "xizhao", type: "minion",
      cost: 5, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。",
      flavor: "潮水退去时，她总会留下最饱的那一个。",
      battlecry: { type: "devour" }
    },
    shield_recruit: {
      id: "shield_recruit", name: "盾墙新兵", faction: "republic", type: "minion",
      cost: 1, attack: 1, health: 3, rarity: "common", art: null,
      keywords: ["taunt"], target: "none",
      text: "守备。",
      flavor: "盾比人高，胆子还在长。",
    },
    drill_sergeant: {
      id: "drill_sergeant", name: "操练军士", faction: "republic", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "rare", art: null,
      keywords: ["battlecry"], target: "friendly",
      text: "登场：使一个友方随从获得守备和 +0/+1。",
      flavor: "他不需要你理解命令，只需要你站到位置上。",
      battlecry: { type: "buffTaunt", health: 1 }
    },
    iron_phalanx: {
      id: "iron_phalanx", name: "铁壁方阵", faction: "republic", type: "minion",
      cost: 5, attack: 3, health: 8, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：每有一个友方守备随从，获得 1 点护甲。",
      flavor: "方阵不是一排人，是一堵会呼吸的墙。",
      battlecry: { type: "armorPerTaunt", amount: 1 }
    },
    powder_boy: {
      id: "powder_boy", name: "火药小工", faction: "empire", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：获得 1 点护甲。",
      flavor: "他负责搬火药，也负责跑得比火药快。",
      battlecry: { type: "armor", amount: 1 }
    },
    iron_engineer: {
      id: "iron_engineer", name: "铁流工兵", faction: "empire", type: "minion",
      cost: 2, attack: 2, health: 3, rarity: "rare", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：获得 2 点护甲。",
      flavor: "他的工具箱里没有锤子，只有备用装甲。",
      battlecry: { type: "armor", amount: 2 }
    },
    siege_captain: {
      id: "siege_captain", name: "攻城队长", faction: "empire", type: "minion",
      cost: 5, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：对所有敌方随从造成 1 点伤害。",
      flavor: "他管这叫校准，不叫开火。",
      battlecry: { type: "damageAllEnemies", amount: 1 }
    },

    /* ===== 阵营扩展 ===== */
    vein_surveyor: {
      id: "vein_surveyor", name: "引脉勘测员", faction: "pus", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +2；引脉8：获得 +2/+2 和守备。",
      flavor: "她画的地图会自己长出新矿脉。",
      battlecry: { type: "veinBuff", amount: 2, vein: 8, attack: 2, health: 2 }
    },
    siphon_guard: {
      id: "siphon_guard", name: "虹吸守卫", faction: "pus", type: "minion",
      cost: 5, attack: 3, health: 6, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：恢复你的领袖 3 点生命；流脉 +1。",
      flavor: "他守住的每一滴血，最后都会回到地脉里。",
      battlecry: { type: "healVein", heal: 3, vein: 1 }
    },
    arcane_theorist: {
      id: "arcane_theorist", name: "奥术理论家", faction: "academy", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：若本回合你施放过战术牌，检索一张战术牌。",
      flavor: "他证明了一切，除了自己为什么还没毕业。",
      battlecry: { type: "spellDiscover", pool: "spell" }
    },
    frost_professor: {
      id: "frost_professor", name: "霜系教授", faction: "academy", type: "minion",
      cost: 5, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：冻结一个敌方随从。",
      flavor: "他的课堂很安静，因为没人敢动。",
      battlecry: { type: "freeze" }
    },
    blood_altar: {
      id: "blood_altar", name: "血祭祭坛", faction: "xizhao", type: "spell",
      cost: 2, rarity: "epic", art: null, target: "none",
      text: "消灭一个攻击力最低的友方随从，召唤两个 1/1 的洛斯汰魔物。",
      flavor: "潮水从不浪费祭品。",
      spell: { type: "sacrificeSummon", token: "losutai_imp", count: 2 }
    },
    tide_colossus: {
      id: "tide_colossus", name: "潮骸巨像", faction: "xizhao", type: "minion",
      cost: 7, attack: 6, health: 6, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。",
      flavor: "它把整片浅海穿在身上。",
      battlecry: { type: "devour" }
    },
    shield_sergeant: {
      id: "shield_sergeant", name: "盾墙军士", faction: "republic", type: "minion",
      cost: 4, attack: 3, health: 5, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：所有友方守备随从获得 +0/+1。",
      flavor: "军士的盾比他的命令更早到前线。",
      battlecry: { type: "buffAllTaunt", health: 1 }
    },
    iron_wall: {
      id: "iron_wall", name: "铁壁令", faction: "republic", type: "spell",
      cost: 4, rarity: "epic", art: null, target: "none",
      text: "所有友方守备随从获得 +0/+2。",
      flavor: "共和国最坚固的墙，是一条命令。",
      spell: { type: "buffAllTaunt", health: 2 }
    },
    armor_volley: {
      id: "armor_volley", name: "装甲齐射", faction: "empire", type: "spell",
      cost: 4, rarity: "epic", art: null, target: "none",
      text: "对所有敌方随从造成等同于你护甲的伤害。",
      flavor: "每增加一层装甲，炮口就多一分底气。",
      spell: { type: "armorAoe" }
    },
    powder_marshal: {
      id: "powder_marshal", name: "火药元帅", faction: "empire", type: "minion",
      cost: 5, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：获得 3 点护甲。",
      flavor: "他闻火药的味道，就像别人闻花香。",
      battlecry: { type: "armor", amount: 3 }
    },

    /* ===== 阵营机制补全 ===== */
    vein_siphon: {
      id: "vein_siphon", name: "引脉虹吸", faction: "pus", type: "spell",
      cost: 3, rarity: "epic", art: null, target: "none",
      text: "恢复你的领袖 3 点生命；流脉 +2。",
      flavor: "她把手按进裂隙，听见地底在呼吸。",
      spell: { type: "healVein", heal: 3, vein: 2 }
    },
    arcane_surge: {
      id: "arcane_surge", name: "奥术涌流", faction: "academy", type: "spell",
      cost: 5, rarity: "epic", art: null, target: "none",
      text: "对所有敌方随从造成 1 点伤害；本回合你每施放一张战术牌，再造成 1 点。",
      flavor: "第一声是提醒，第二声是答案，第三声是屋顶。",
      spell: { type: "damageAllPerSpell", amount: 1 }
    },
    devourer: {
      id: "devourer", name: "噬潮者", faction: "xizhao", type: "minion",
      cost: 4, attack: 4, health: 4, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。",
      flavor: "潮水退去后，它会把没来得及走的同伴一起带走。",
      battlecry: { type: "devour" }
    },
    phalanx_warden: {
      id: "phalanx_warden", name: "方阵守望", faction: "republic", type: "minion",
      cost: 4, attack: 2, health: 7, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：所有友方守备随从获得 +0/+1。",
      flavor: "她守的不是城门，是城门后面还在睡觉的人。",
      battlecry: { type: "buffAllTaunt", health: 1 }
    },
    iron_artillery: {
      id: "iron_artillery", name: "铁流炮台", faction: "empire", type: "minion",
      cost: 6, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：对一个敌方随从造成等同于你护甲的伤害。",
      flavor: "炮台不需要瞄准，它只需要敌人站得足够久。",
      battlecry: { type: "armorDamage" }
    },
    vein_leviathan: {
      id: "vein_leviathan", name: "流脉利维坦", faction: "neutral", type: "minion",
      cost: 9, attack: 7, health: 7, rarity: "legendary", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +1；引脉10：获得 +2/+2 和守备。",
      flavor: "它不是从海里来的，是从世界底下的血管里浮上来的。",
      battlecry: { type: "veinBuff", amount: 1, vein: 10, attack: 2, health: 2 }
    },

    /* ===== 机制新卡 ===== */
    spellstorm: {
      id: "spellstorm", name: "法术风暴", faction: "academy", type: "spell",
      cost: 6, rarity: "epic", art: null, target: "none",
      text: "对敌方领袖造成 2×本回合已施放法术数量的伤害。",
      flavor: "她数到第三声回响时，屋顶已经开始下雨。",
      spell: { type: "damagePerSpell", amount: 2 }
    },
    echo_adept: {
      id: "echo_adept", name: "回响学徒", faction: "academy", type: "minion",
      cost: 4, attack: 3, health: 3, rarity: "epic", art: null,
      keywords: ["passive"], target: "none",
      text: "被动：每当你施放一张战术牌，获得 +1/+1。",
      flavor: "同一个咒语念三遍，第三遍会自己回答。",
      passive: { type: "spellGrowth", attack: 1, health: 1 }
    },
    vein_engineer: {
      id: "vein_engineer", name: "引脉工程师", faction: "pus", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +2；引脉6：获得 +1/+1。",
      flavor: "她不是在设计机器，是在给地脉接血管。",
      battlecry: { type: "veinBuff", amount: 2, vein: 6, attack: 1, health: 1 }
    },
    brood_matron: {
      id: "brood_matron", name: "育巢母兽", faction: "xizhao", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：召唤一个 1/1 的洛斯汰魔物；若你控制另一个随从，它获得 +1/+1。",
      flavor: "潮水退去时，她把整座巢一起带上岸。",
      battlecry: { type: "summonTokenBuff", token: "losutai_imp", attack: 1, health: 1 }
    },
    bastion_captain: {
      id: "bastion_captain", name: "堡垒队长", faction: "republic", type: "minion",
      cost: 5, attack: 3, health: 6, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：使所有友方随从获得守备和 +0/+1。",
      flavor: "她守过的每一道墙，最后都变成了人。",
      battlecry: { type: "buffAllTaunt", health: 1 }
    },
    powder_keg: {
      id: "powder_keg", name: "火药桶", faction: "empire", type: "minion",
      cost: 3, attack: 1, health: 4, rarity: "epic", art: null,
      keywords: ["deathrattle"], target: "none",
      text: "余响：对所有敌方随从造成 3 点伤害。",
      flavor: "帝国工兵手册第一条：不要写第二条。",
      deathrattle: { type: "damageAllEnemies", amount: 3 }
    },
    chrono_scholar: {
      id: "chrono_scholar", name: "时序学者", faction: "neutral", type: "minion",
      cost: 6, attack: 4, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：若本回合你施放过战术牌，抽 1 张牌。",
      flavor: "他研究时间，是为了把学费拖到下周。",
      battlecry: { type: "spellDraw", draw: 1 }
    },

    /* ===== 高费中立 ===== */
    obsidian_colossus: {
      id: "obsidian_colossus", name: "黑曜巨像", faction: "neutral", type: "minion",
      cost: 9, attack: 7, health: 8, rarity: "legendary", art: null,
      keywords: ["taunt", "deathrattle"], target: "none",
      text: "守备。余响：召唤一个 3/3 的黑曜碎片。",
      flavor: "它从地底站起来时，整座矿脉都跟着呼吸。",
      deathrattle: { type: "summon", token: "obsidian_spawn" }
    },
    world_serpent: {
      id: "world_serpent", name: "世界之蛇", faction: "neutral", type: "minion",
      cost: 10, attack: 8, health: 8, rarity: "legendary", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：对所有敌方随从造成 4 点伤害；引脉7：再抽 1 张牌。",
      flavor: "它绕世界一圈，只是为了咬住自己的尾巴。",
      battlecry: { type: "damageAllEnemiesDraw", amount: 4, vein: 7, draw: 1 }
    },
    faceless_king: {
      id: "faceless_king", name: "无面君王", faction: "neutral", type: "minion",
      cost: 9, attack: 6, health: 6, rarity: "legendary", art: null,
      keywords: ["battlecry"], target: "friendly",
      text: "登场：复制一个友方随从。",
      flavor: "王座之上没有脸，只有另一个人的影子。",
      battlecry: { type: "copyFriendly" }
    },
    chrono_archivist: {
      id: "chrono_archivist", name: "时序档案官", faction: "neutral", type: "minion",
      cost: 8, attack: 6, health: 7, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：将一个敌方随从移回其手牌。",
      flavor: "每一页都写着同一天，只是墨迹不同。",
      battlecry: { type: "returnToHand" }
    },
    frost_leviathan: {
      id: "frost_leviathan", name: "霜潮利维坦", faction: "neutral", type: "minion",
      cost: 8, attack: 6, health: 7, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：冻结所有敌方随从。",
      flavor: "港口的人说，那不是浪，是它在翻身。",
      battlecry: { type: "freezeAllEnemies" }
    },
    vein_behemoth: {
      id: "vein_behemoth", name: "流脉巨兽", faction: "neutral", type: "minion",
      cost: 8, attack: 6, health: 8, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：流脉 +2；引脉7：获得 +2/+2 和守备。",
      flavor: "它把流脉当作血管，把矿洞当作胸腔。",
      battlecry: { type: "veinBuff", amount: 2, vein: 7, attack: 2, health: 2 }
    },
    twin_weaver: {
      id: "twin_weaver", name: "双生织命者", faction: "neutral", type: "minion",
      cost: 7, attack: 5, health: 5, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：召唤一个自身的复制。",
      flavor: "她们从不吵架，因为意见总是同一个。",
      battlecry: { type: "summonSelfCopy" }
    },
    archive_devourer: {
      id: "archive_devourer", name: "档案吞噬者", faction: "neutral", type: "minion",
      cost: 7, attack: 5, health: 6, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：沉默一个敌方随从；抽 1 张牌。",
      flavor: "它吃掉的不是纸，是纸上写着的名字。",
      battlecry: { type: "silenceDraw", draw: 1 }
    },
    astral_colossus: {
      id: "astral_colossus", name: "星界巨像", faction: "neutral", type: "minion",
      cost: 6, attack: 4, health: 7, rarity: "epic", art: null,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：获得 4 点护甲。",
      flavor: "它体内装着一整片没有名字的星空。",
      battlecry: { type: "armor", amount: 4 }
    },
    grave_titan: {
      id: "grave_titan", name: "墓钟泰坦", faction: "neutral", type: "minion",
      cost: 9, attack: 7, health: 7, rarity: "legendary", art: null,
      keywords: ["deathrattle"], target: "none",
      text: "余响：召唤一个 5/5 的墓钟守卫。",
      flavor: "钟声每响一次，就有一个名字从石头上醒来。",
      deathrattle: { type: "summon", token: "grave_guard" }
    },
    moonfall: {
      id: "moonfall", name: "群星坠落", faction: "neutral", type: "spell",
      cost: 8, rarity: "epic", art: null, target: "none",
      text: "对所有敌方随从造成 4 点伤害；抽 1 张牌。",
      flavor: "那一夜，天空把所有的灯都扔了下来。",
      spell: { type: "damageAllEnemiesDraw", amount: 4, draw: 1 }
    },
    final_bell: {
      id: "final_bell", name: "终末钟声", faction: "neutral", type: "spell",
      cost: 10, rarity: "legendary", art: null, target: "none",
      text: "对所有随从造成 5 点伤害。",
      flavor: "最后一响之后，没有人再需要计时。",
      spell: { type: "damageAll", amount: 5 }
    },
    time_reflux: {
      id: "time_reflux", name: "时间回流", faction: "neutral", type: "spell",
      cost: 9, rarity: "epic", art: null, target: "none",
      text: "将所有敌方随从移回其手牌。",
      flavor: "时间不是河流，是一扇被反复推开的门。",
      spell: { type: "returnAllEnemies" }
    },
    astral_gate: {
      id: "astral_gate", name: "星门", faction: "neutral", type: "spell",
      cost: 7, rarity: "epic", art: null, target: "none",
      text: "召唤两个 3/3 的星界守卫。",
      flavor: "门后没有远方，只有另一种现在。",
      spell: { type: "summonTwoTokens", token: "astral_guardian", count: 2 }
    },
    vein_tithe: {
      id: "vein_tithe", name: "流脉什一税", faction: "neutral", type: "spell",
      cost: 6, rarity: "epic", art: null, target: "none",
      text: "获得 5 点护甲；流脉 +3；抽 1 张牌。",
      flavor: "每一道流脉都要上交它最亮的一滴。",
      spell: { type: "armorVeinDraw", armor: 5, vein: 3, draw: 1 }
    },

    /* ===== 衍生物 ===== */
    losutai_imp: {
      id: "losutai_imp", name: "洛斯汰魔物", faction: "xizhao", type: "minion",
      cost: 0, attack: 1, health: 1, rarity: "token", art: null,
      keywords: [], target: "none", text: "", flavor: "从潮汐里爬出来的小家伙。", token: true
    },
    losutai_beast: {
      id: "losutai_beast", name: "洛斯汰巨兽", faction: "xizhao", type: "minion",
      cost: 0, attack: 3, health: 3, rarity: "token", art: null,
      keywords: [], target: "none", text: "", flavor: "它记得海，也记得谁把它叫上来。", token: true
    },
    obsidian_spawn: {
      id: "obsidian_spawn", name: "黑曜碎片", faction: "neutral", type: "minion",
      cost: 0, attack: 3, health: 3, rarity: "token", art: null,
      keywords: [], target: "none", text: "", flavor: "巨像倒下时，碎掉的只是外壳。", token: true
    },
    grave_guard: {
      id: "grave_guard", name: "墓钟守卫", faction: "neutral", type: "minion",
      cost: 0, attack: 5, health: 5, rarity: "token", art: null,
      keywords: [], target: "none", text: "", flavor: "它从钟声里站起来，替死者守夜。", token: true
    },
    astral_guardian: {
      id: "astral_guardian", name: "星界守卫", faction: "neutral", type: "minion",
      cost: 0, attack: 3, health: 3, rarity: "token", art: null,
      keywords: [], target: "none", text: "", flavor: "它们不守卫门，只守卫门后的选择。", token: true
    }
  };


  /* ===== 玩家数值设计表导入 ===== */
  const CARD_BALANCE_OVERRIDES = {
  guard: {
    cost: 3,
    attack: 1,
    health: 4
  },
  orlicas: {
    cost: 3,
    attack: 2,
    health: 3
  },
  timon: {
    cost: 3,
    attack: 3,
    health: 3
  },
  emergency: {
    cost: 2
  },
  verious: {
    cost: 4,
    attack: 3,
    health: 2
  },
  miyuki: {
    cost: 5,
    attack: 4,
    health: 4
  },
  insight: {
    cost: 2
  },
  doorman: {
    cost: 1,
    attack: 1,
    health: 2
  },
  archive_search: {
    cost: 1
  },
  nina: {
    cost: 2,
    attack: 2,
    health: 2
  },
  samuel: {
    cost: 2,
    attack: 2,
    health: 1
  },
  lecturer: {
    cost: 3,
    attack: 3,
    health: 3
  },
  justus: {
    cost: 3,
    attack: 3,
    health: 2
  },
  karl_desmond: {
    cost: 4,
    attack: 3,
    health: 4
  },
  cassian: {
    cost: 5,
    attack: 6,
    health: 3
  },
  tribal_warrior: {
    cost: 1,
    attack: 1,
    health: 2
  },
  lize: {
    cost: 2,
    attack: 2,
    health: 2
  },
  losutai_hunter: {
    cost: 3,
    attack: 3,
    health: 2
  },
  molan: {
    cost: 3,
    attack: 2,
    health: 4
  },
  blood_servant: {
    cost: 3,
    attack: 4,
    health: 2
  },
  grayfeather: {
    cost: 4,
    attack: 2,
    health: 3
  },
  tiega: {
    cost: 4,
    attack: 4,
    health: 3
  },
  republic_guard: {
    cost: 2,
    attack: 1,
    health: 3
  },
  hans: {
    cost: 2,
    attack: 2,
    health: 2
  },
  volley: {
    cost: 1
  },
  fortify: {
    cost: 1
  },
  elena: {
    cost: 3,
    attack: 3,
    health: 2
  },
  beatrix: {
    cost: 4,
    attack: 3,
    health: 3
  },
  konrad: {
    cost: 4,
    attack: 3,
    health: 5
  },
  empire_guard: {
    cost: 2,
    attack: 1,
    health: 3
  },
  mia: {
    cost: 2,
    attack: 2,
    health: 1
  },
  barrage: {
    cost: 1
  },
  klaus: {
    cost: 3,
    attack: 2,
    health: 3
  },
  ironclad: {
    cost: 3,
    attack: 3,
    health: 3
  },
  walter: {
    cost: 5,
    attack: 5,
    health: 4
  },
  snow_medic: {
    cost: 1,
    attack: 1,
    health: 1
  },
  recon: {
    cost: 2
  },
  archive_scribe: {
    cost: 2,
    attack: 1,
    health: 1
  },
  archive_guard: {
    cost: 2,
    attack: 2,
    health: 2
  },
  mist_scout: {
    cost: 2,
    attack: 2,
    health: 1
  },
  mist_hound: {
    cost: 2,
    attack: 2,
    health: 1
  },
  field_medic: {
    cost: 2,
    attack: 2,
    health: 2
  },
  vein_prism: {
    cost: 2
  },
  bard: {
    cost: 3,
    attack: 2,
    health: 2
  },
  mercenary: {
    cost: 3,
    attack: 4,
    health: 3
  },
  monarch: {
    cost: 4,
    attack: 3,
    health: 4
  },
  astral_colossus: {
    cost: 6,
    attack: 3,
    health: 7
  },
  archive_devourer: {
    cost: 7,
    attack: 4,
    health: 5
  },
  twin_weaver: {
    cost: 7,
    attack: 4,
    health: 3
  },
  vein_behemoth: {
    cost: 8,
    attack: 4,
    health: 7
  },
  chrono_archivist: {
    cost: 8,
    attack: 4,
    health: 4
  },
  frost_leviathan: {
    cost: 8,
    attack: 6,
    health: 4
  },
  obsidian_colossus: {
    cost: 9,
    attack: 4,
    health: 10
  },
  time_reflux: {
    cost: 100
  }
};
  for (const [balanceId, balancePatch] of Object.entries(CARD_BALANCE_OVERRIDES)) {
    if (CARDS[balanceId]) Object.assign(CARDS[balanceId], balancePatch);
  }

  Object.assign(CARDS.emergency, { text: "恢复一个友方随从 3 点生命；抽 1 张牌。", spell: { type: "healDraw", amount: 3, draw: 1 } });
  Object.assign(CARDS.archive_search, { text: "抽 1 张牌。", spell: { type: "draw", amount: 1 } });
  Object.assign(CARDS.fortify, { text: "使一个友方随从获得 +0/+1 与守备。", spell: { type: "buffTaunt", attack: 0, health: 1 } });
  Object.assign(CARDS.konrad, { text: "守备。登场：获得 5 点护甲。", battlecry: { type: "armor", amount: 5 } });
  Object.assign(CARDS.astral_colossus, { text: "守备。登场：获得 3 点护甲。", battlecry: { type: "armor", amount: 3 } });
  Object.assign(CARDS.vein_prism, { text: "抽 1 张牌；引脉6：再抽 1 张牌。", spell: { type: "drawVein", amount: 1, vein: 6, bonus: 1 } });
  Object.assign(CARDS.bard, { text: "登场：抽 1 张牌；引脉6：再抽 1 张牌。", battlecry: { type: "drawVein", amount: 1, vein: 6, bonus: 1 } });
  Object.assign(CARDS.vein_behemoth, { text: "登场：流脉 +2；引脉10：获得 +0/+1 和守备。", battlecry: { type: "veinBuff", amount: 2, vein: 10, attack: 0, health: 1 } });
  Object.assign(CARDS.tribal_warrior, { bloodCost: 3, text: "血祭3：获得 +1/+1。" });
  Object.assign(CARDS.tiega, { bloodCost: 3, text: "先遣。血祭3：获得 +2 攻击。" });
  Object.assign(CARDS.guard, { keywords: ["taunt", "battlecry"], target: "none", text: "守备。登场：引脉4：攻击力 +1。", battlecry: { type: "veinSelfBuff", vein: 4, attack: 1 } });
  Object.assign(CARDS.nina, { optionalTarget: true });
  Object.assign(CARDS.time_reflux, { disabled: true });
  Object.assign(CARDS.verious, { text: "登场：沉默一个敌方随从；引脉5：获得 +0/+2。", battlecry: { type: "silenceVeinBuff", vein: 5, health: 2 } });
  Object.assign(CARDS.miyuki, { text: "登场：冻结一个敌方随从；引脉6：改为冻结所有敌方随从；引脉10：消灭所有敌方冻结随从。", battlecry: { type: "freeze", allAtVein: 6, destroyFrozenAtVein: 10 } });
  Object.assign(CARDS.hans, { keywords: ["taunt", "battlecry"], target: "none", text: "守备。登场：同阵位所有具有守备的友方随从获得 +0/+1。", battlecry: { type: "buffTauntZone", health: 1 } });
  Object.assign(CARDS.klaus, { keywords: ["taunt", "battlecry"], target: "none", text: "守备。登场：场上每有一个铁甲步兵，获得 +2/+1。", battlecry: { type: "buffPerIronclad", attack: 2, health: 1 } });
  Object.assign(CARDS.ironclad, { keywords: ["taunt", "battlecry"], target: "none", text: "守备。登场：若同阵位有另一个铁甲步兵，获得 +0/+1。", battlecry: { type: "buffIfIronclad", health: 1 } });
  Object.assign(CARDS.cassian, { text: "先遣。你的回合结束时，对自身造成 1 点伤害。", passive: { type: "endTurnSelfDamage", amount: 1 } });
  Object.assign(CARDS.samuel, { text: "登场：抽 1 张法术牌。", battlecry: { type: "drawSpell" } });
  Object.assign(CARDS.lecturer, { text: "登场：若你的手牌数不少于 6，获得 +0/+2。", battlecry: { type: "handBuff", hand: 6, attack: 0, health: 2 } });
  Object.assign(CARDS.justus, { text: "登场：抽 1 张牌；若你的手牌数不超过 6，再抽 1 张牌。", battlecry: { type: "drawHandCondition", hand: 6, draw: 1 } });
  Object.assign(CARDS.vein_bulwark, { keywords: ["lifesteal"], text: "血偿。" });
  Object.assign(CARDS.field_medic, { target: "none", text: "登场：恢复你的领袖 2 点生命。", battlecry: { type: "healHero", amount: 2 } });
  // 旧卡阵位/流脉迁移：只增加可读的小型条件效果，不推翻原始效果。
  Object.assign(CARDS.guard, { zoneBonus: { attack: 1 }, text: CARDS.guard.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.medic_apprentice, { veinBonus: { vein: 4, healHero: 2 }, text: CARDS.medic_apprentice.text + " 引脉 4：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.courier, { zoneBonus: { health: 1 }, text: CARDS.courier.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.karl_desmond, { zoneBonus: { draw: 1 }, text: CARDS.karl_desmond.text + " 阵位：若同阵位有另一个友方随从，抽 1 张牌。" });
  Object.assign(CARDS.lecturer, { veinBonus: { vein: 6, selfBuff: { attack: 1, health: 1 } }, text: CARDS.lecturer.text + " 引脉 6：获得 +1/+1。" });
  Object.assign(CARDS.nina, { zoneBonus: { health: 1 }, text: CARDS.nina.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.losutai_hunter, { zoneBonus: { attack: 1 }, text: CARDS.losutai_hunter.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.tribal_warrior, { zoneBonus: { health: 1 }, text: CARDS.tribal_warrior.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.lanxi, { veinBonus: null, text: "登场：召唤两个 1/1 洛斯汰魔物；引脉5：使这些魔物获得守备。" });
  Object.assign(CARDS.republic_guard, { zoneBonus: { health: 2 }, text: CARDS.republic_guard.text + " 阵位：若同阵位有另一个友方随从，生命值 +2。" });
  Object.assign(CARDS.beatrix, { veinBonus: { vein: 4, healHero: 2 }, text: CARDS.beatrix.text + " 引脉 4：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.elena, { zoneBonus: { draw: 1 }, text: CARDS.elena.text + " 阵位：若同阵位有另一个友方随从，抽 1 张牌。" });
  Object.assign(CARDS.empire_guard, { veinBonus: { vein: 4, armor: 2 }, text: CARDS.empire_guard.text + " 引脉 4：获得 2 点护甲。" });
  Object.assign(CARDS.mia, { zoneBonus: { draw: 1 }, text: CARDS.mia.text + " 阵位：若同阵位有另一个友方随从，抽 1 张牌。" });
  Object.assign(CARDS.elsa, { zoneBonus: { healHero: 2 }, text: CARDS.elsa.text + " 阵位：若同阵位有另一个友方随从，恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.snow_medic, { zoneBonus: { healHero: 1 }, text: CARDS.snow_medic.text + " 阵位：若同阵位有另一个友方随从，恢复你的领袖 1 点生命。" });
  Object.assign(CARDS.gok_digger, { veinBonus: { vein: 4, armor: 1 }, text: CARDS.gok_digger.text + " 引脉 4：获得 1 点护甲。" });
  Object.assign(CARDS.bounty_hunter, { zoneBonus: { attack: 1 }, text: CARDS.bounty_hunter.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.shextena, { mirrorBonus: { healHero: 1 }, text: CARDS.shextena.text + " 对位：若敌方对位阵位有随从，恢复你的领袖 1 点生命。" });
  Object.assign(CARDS.karl_desmond, { mirrorBonus: { draw: 1 }, text: CARDS.karl_desmond.text + " 对位：若敌方对位阵位有随从，抽 1 张牌。" });
  Object.assign(CARDS.grayfeather, { mirrorBonus: { attack: 1 }, text: CARDS.grayfeather.text + " 对位：若敌方对位阵位有随从，攻击力 +1。" });
  Object.assign(CARDS.republic_guard, { mirrorBonus: { health: 1 }, text: CARDS.republic_guard.text + " 对位：若敌方对位阵位有随从，生命值 +1。" });
  Object.assign(CARDS.empire_guard, { mirrorBonus: { armor: 1 }, text: CARDS.empire_guard.text + " 对位：若敌方对位阵位有随从，获得 1 点护甲。" });

  Object.assign(CARDS.shextena, { veinBonus: { vein: 6, healHero: 3 }, text: CARDS.shextena.text + " 引脉 6：恢复你的领袖 3 点生命。" });
  Object.assign(CARDS.timon, { zoneBonus: { health: 1 }, text: CARDS.timon.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.aidric, { veinBonus: { vein: 4, armor: 2 }, text: CARDS.aidric.text + " 引脉 4：获得 2 点护甲。" });
  Object.assign(CARDS.orlicas, { zoneBonus: { draw: 1 }, text: CARDS.orlicas.text + " 阵位：若同阵位有另一个友方随从，抽 1 张牌。" });
  Object.assign(CARDS.justus, { veinBonus: { vein: 6, armor: 1 }, text: CARDS.justus.text + " 引脉 6：获得 1 点护甲。" });
  Object.assign(CARDS.samuel, { zoneBonus: { health: 1 }, text: CARDS.samuel.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.cassian, { zoneBonus: { attack: 1 }, text: CARDS.cassian.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.doorman, { veinBonus: { vein: 4, healHero: 2 }, text: CARDS.doorman.text + " 引脉 4：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.grayfeather, { veinBonus: null, text: "登场：使一个友方随从获得 +2/+2；引脉4：再使其获得守备。 对位：若敌方对位阵位有随从，攻击力 +1。" });
  Object.assign(CARDS.molan, { zoneBonus: { attack: 1 }, text: CARDS.molan.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.lanzhou, { zoneBonus: { health: 1 }, text: CARDS.lanzhou.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.konrad, { veinBonus: { vein: 4, armor: 2 }, text: CARDS.konrad.text + " 引脉 4：获得 2 点护甲。" });
  Object.assign(CARDS.erhardt, { zoneBonus: { attack: 1 }, text: CARDS.erhardt.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.cedric, { veinBonus: { vein: 6, healHero: 2 }, text: CARDS.cedric.text + " 引脉 6：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.shield_bearer, { zoneBonus: { health: 1 }, text: CARDS.shield_bearer.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.gunther, { veinBonus: { vein: 4, armor: 2 }, text: CARDS.gunther.text + " 引脉 4：获得 2 点护甲。" });
  Object.assign(CARDS.karl_schwarz, { zoneBonus: { attack: 1 }, text: CARDS.karl_schwarz.text + " 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.walter, { veinBonus: { vein: 6, armor: 1 }, text: CARDS.walter.text + " 引脉 6：获得 1 点护甲。" });
  Object.assign(CARDS.fog_sailor, { zoneBonus: { health: 1 }, text: CARDS.fog_sailor.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.mist_scout, { veinBonus: { vein: 4, armor: 1 }, text: CARDS.mist_scout.text + " 引脉 4：获得 1 点护甲。" });
  Object.assign(CARDS.caravan_guard, { zoneBonus: { health: 1 }, text: CARDS.caravan_guard.text + " 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.astral_colossus, { veinBonus: { vein: 6, armor: 2 }, text: CARDS.astral_colossus.text + " 引脉 6：获得 2 点护甲。" });
  // 第二轮旧卡迁移：把低影响的登场效果改成余响/被动，降低登场密度。
  Object.assign(CARDS.medic_apprentice, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "healHero", amount: 1 }, text: "余响：恢复你的领袖 1 点生命。 引脉4：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.snow_medic, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "healHero", amount: 1 }, text: "余响：恢复你的领袖 1 点生命。 阵位：若同阵位有另一个友方随从，恢复你的领袖 1 点生命。" });
  Object.assign(CARDS.field_engineer, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "armor", amount: 2 }, text: "余响：获得 2 点护甲。" });
  Object.assign(CARDS.archive_scribe, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.mia, { keywords: ["deathrattle"], target: "none", battlecry: null, zoneBonus: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.elena, { keywords: ["deathrattle"], target: "none", battlecry: null, zoneBonus: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.field_medic, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "healHero", amount: 2 }, text: "余响：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.bounty_hunter, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "damageRandomEnemy", amount: 1 }, text: "余响：对随机敌方单位造成 1 点伤害。 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.sim_assistant, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.vein_medic, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "healHero", amount: 2 }, text: "余响：恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.elsa, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "healHero", amount: 2 }, text: "余响：恢复你的领袖 2 点生命。 阵位：若同阵位有另一个友方随从，恢复你的领袖 2 点生命。" });
  Object.assign(CARDS.walter, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "damageRandomEnemy", amount: 2 }, text: "余响：对随机敌方单位造成 2 点伤害。 引脉6：获得 1 点护甲。" });
  Object.assign(CARDS.losutai_hunter, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "damageRandomEnemy", amount: 1 }, text: "余响：对随机敌方单位造成 1 点伤害。 阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.iron_engineer, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "armor", amount: 2 }, text: "余响：获得 2 点护甲。" });
  Object.assign(CARDS.powder_boy, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "armor", amount: 1 }, text: "余响：获得 1 点护甲。" });
  Object.assign(CARDS.chrono_scholar, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.archive_devourer, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.lecturer, { keywords: ["deathrattle"], target: "none", battlecry: null, veinBonus: null, deathrattle: { type: "draw", amount: 1 }, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.frost_leviathan, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "freezeAllEnemies" }, text: "余响：冻结所有敌方随从。" });
  Object.assign(CARDS.drill_sergeant, { keywords: ["deathrattle"], target: "none", battlecry: null, deathrattle: { type: "tauntRandomAlly" }, text: "余响：使一个随机友方随从获得守备。" });
  Object.assign(CARDS.konrad, { keywords: ["taunt"], target: "none", battlecry: null, passive: { type: "turnArmor", amount: 1 }, text: "守备。被动：你的回合开始时获得 1 点护甲。 引脉4：获得 2 点护甲。" });
  Object.assign(CARDS.gunther, { keywords: ["taunt"], target: "none", battlecry: null, passive: null, attack: 4, health: 5, text: "守备。 引脉4：获得 2 点护甲。" });
  Object.assign(CARDS.powder_marshal, { keywords: [], target: "none", battlecry: null, passive: null, attack: 5, health: 5, text: "" });
  Object.assign(CARDS.astral_colossus, { keywords: ["taunt"], target: "none", battlecry: null, passive: { type: "turnArmor", amount: 1 }, text: "守备。被动：你的回合开始时获得 1 点护甲。 引脉6：获得 2 点护甲。" });
  Object.assign(CARDS.vein_scout, { keywords: ["battlecry", "charge"], target: "none", text: "先遣。登场：流脉 +1。" });
  Object.assign(CARDS.powder_boy, { keywords: ["deathrattle", "charge"], target: "none", text: "先遣。余响：获得 1 点护甲。" });
  // 第三轮登场压缩：移除低影响登场，保留卡牌定位。
  // 第七轮登场压缩：非预设卡转白板/被动，降低登场密度。
  Object.assign(CARDS.courier, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.bard, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.spell_echo, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.siege_train, { keywords: [], target: "none", battlecry: null, text: "" });
  // 第八轮登场压缩：非预设卡转白板，登场压到 36。
  Object.assign(CARDS.vein_oracle, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.void_titan, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.vein_channeler, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.excavation_titan, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.blood_priestess, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.iron_phalanx, { keywords: ["taunt"], target: "none", battlecry: null, text: "守备。" });
  Object.assign(CARDS.siege_captain, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.siphon_guard, { keywords: ["taunt"], target: "none", battlecry: null, text: "守备。" });
  Object.assign(CARDS.frost_professor, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.vein_leviathan, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.world_serpent, { keywords: [], target: "none", battlecry: null, text: "" });
  Object.assign(CARDS.faceless_king, { keywords: [], target: "none", battlecry: null, text: "" });


  // 第六轮登场压缩：未进预设的持盾元帅/堡垒队长改成守备光环。
  Object.assign(CARDS.shield_marshal, { keywords: ["taunt"], target: "none", battlecry: null, passive: { type: "tauntAura", amount: 1 }, text: "守备。被动：你召唤的守备随从获得 +0/+1。" });
  Object.assign(CARDS.bastion_captain, { keywords: [], target: "none", battlecry: null, passive: { type: "tauntAura", amount: 1 }, text: "被动：你召唤的守备随从获得 +0/+1。" });


  // 第五轮登场压缩：转成阵位/被动光环。
  Object.assign(CARDS.zone_keeper, { keywords: [], target: "none", battlecry: null, zoneBonus: { attack: 2, health: 2 }, text: "阵位：若同阵位有另一个友方随从，获得 +2/+2。" });
  Object.assign(CARDS.ironclad, { keywords: ["taunt"], target: "none", battlecry: null, zoneBonus: { health: 1 }, text: "守备。 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.hans, { keywords: ["taunt"], target: "none", battlecry: null, passive: { type: "tauntAura", amount: 1 }, text: "守备。被动：你召唤的守备随从获得 +0/+1。" });
  Object.assign(CARDS.gok_digger, { keywords: [], target: "none", battlecry: null, text: "掘脉1。" });

  Object.assign(CARDS.vein_scout, { keywords: ["charge"], target: "none", battlecry: null, text: "先遣。" });
  Object.assign(CARDS.guard, { keywords: ["taunt"], target: "none", battlecry: null, text: "守备。 阵位：若同阵位有另一个友方随从，攻击力 +1。 引脉4：获得 1 点护甲。" });








  const NEUTRAL_DECK = [
    "neutral_wayfarer",
    "gok_digger", "gok_digger",
    "fog_sailor",
    "snow_medic", "snow_medic",
    "mist_scout", "mist_scout",
    "caravan_guard", "caravan_guard",
    "astral_colossus", "moonfall"
  ];

  const DECK_SPECIALS = {
    pus: { formation: "formation_vein", relic: "vein_heart", relic2: "formation_standard" },
    academy: { formation: "formation_script", relic: "frost_prism", relic2: "spell_codex" },
    xizhao: { formation: "formation_tide", relic: "blood_scythe", relic2: "blood_censer" },
    republic: { formation: "formation_wall", relic: "iron_banner", relic2: "republic_seal" },
    empire: { formation: "formation_cannon", relic: "powder_engine", relic2: "armor_forge" },
    greyharbor: { formation: "gh_formation", relic: "gh_bounty_board", relic2: "gh_venom_vial" }
  };

  const DECK_TRIM = {
    pus: ["emergency", "resonance", "coordination", "snow_medic"],
    xizhao: ["losutai_hunter", "shadow_raid", "blood_ritual", "snow_medic"],
    academy: ["archive_search", "frost_seal", "lecturer", "snow_medic"],
    republic: ["shield_bearer", "fortify", "volley", "levy"],
    empire: ["ironclad", "barrage", "mobilize", "fortress"],
    greyharbor: ["gh_bounty_notice", "gh_quick_strike", "gh_shield_mercenary", "gh_black_market"]
  };

  const DECK_STRATEGIES = {
    aggro: { name: "快攻", desc: "低费随从与直伤，抢在前中期结束。", curve: { 1: 7, 2: 8, 3: 7, 4: 5, 5: 2, 6: 1 } },
    midrange: { name: "中速", desc: "按费拍下高质量随从，靠阵位和登场取得优势。", curve: { 1: 5, 2: 7, 3: 6, 4: 6, 5: 4, 6: 2 } },
    control: { name: "控制", desc: "解场、冻结、恢复与抽牌，拖到流脉与高费回合。", curve: { 1: 4, 2: 6, 3: 6, 4: 6, 5: 5, 6: 3 } }
  };

  // 只卡品级：传说 2、史诗 15，普通与稀有随便带（总数仍是 30）
  const DECK_RARITY_LIMITS = Object.freeze({ legendary: 2, epic: 15, rare: 30 });

  // 构筑时不卡同名张数（主人确认：阵型/装备/战术/债务带几张都行，只有品级限制）。
  // 这个值同时被自动构筑用来保持多样性，所以给一个实用上限而不是真无限。
  function maxCopies(def) {
    if (!def || def.token) return 0;
    if (def.copyLimit != null) return def.copyLimit;
    if (def.rarity === "legendary") return 1;
    return 2;
  }

  function deckRarityCounts(list) {
    const out = { common: 0, rare: 0, epic: 0, legendary: 0 };
    for (const id of (list || [])) {
      const d = CARDS[id];
      if (!d) continue;
      if (out[d.rarity] != null) out[d.rarity] += 1;
    }
    return out;
  }

  function isExactPreset(faction, list) {
    if (typeof DECKS === "undefined" || !DECKS[faction]) return false;
    const a = (list || []).slice().sort();
    const b = DECKS[faction].slice().sort();
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function cardPool(faction) {
    return Object.keys(CARDS).filter((id) => {
      const d = CARDS[id];
      if (d.token || d.disabled || d.experimental) return false;
      return d.faction === faction || d.faction === "neutral";
    });
  }

  function validateDeck(faction, list) {

    const errors = [];
    const arr = Array.isArray(list) ? list : [];
    // 彩蛋卡不参与构筑：进牌组直接判非法
    const eggInDeck = arr.find((id) => CARDS[id] && CARDS[id].easterEgg);
    if (eggInDeck) errors.push("彩蛋卡不能进构筑：" + (CARDS[eggInDeck].name || eggInDeck));
    if (arr.length !== 30) errors.push("牌组必须是 30 张卡（含装备/阵型），当前 " + arr.length);
    const counts = {};
    let main = 0, formations = 0, relics = 0;
    for (const id of arr) {
      const d = CARDS[id];
      if (!d || d.token || d.disabled) { errors.push("包含不存在或不可用的牌：" + id); continue; }
      if (d.faction !== faction && d.faction !== "neutral") errors.push(d.name + " 不属于该阵营");
      counts[id] = (counts[id] || 0) + 1;
      if (counts[id] > maxCopies(d)) errors.push(d.name + " 超出同名张数上限");
      if (d.type === "formation") formations++;
      else if (d.type === "equipment" || d.type === "relic") relics++;
      else main++;
    }
    const rarity = deckRarityCounts(arr);
    for (const key of ["legendary", "epic", "rare"]) {
      if (rarity[key] > DECK_RARITY_LIMITS[key]) {
        errors.push(({ legendary: "传说", epic: "史诗", rare: "稀有" })[key] + "卡最多 " + DECK_RARITY_LIMITS[key] + " 张，当前 " + rarity[key] + " 张");
      }
    }
    const warnings = [];
    if (relics === 0) warnings.push("牌组里没有装备卡：可以放，但不放也不影响开局");
    if (formations > 3) warnings.push("阵型带了 " + formations + " 张：三个阵位各能生效一张，多余的会在同阵位覆盖时进弃牌堆");
    if (relics === 0) warnings.push("未携带装备：本局没有装备可用");
    if (formations === 0) warnings.push("未携带阵型：本局没有阵型可用");
    return { ok: errors.length === 0, errors: Array.from(new Set(errors)), warnings: Array.from(new Set(warnings)), counts: counts, rarity: rarity, rarityLimits: DECK_RARITY_LIMITS, presetExempt: false, main: main, formations: formations, relics: relics };
  }

  function scoreForAuto(def, strategy) {
    if (!def || def.token) return -999;
    const cheap = def.cost <= 2 ? 1 : 0;
    const stats = (def.attack || 0) * 1.6 + (def.health || 0);
    const kw = (def.keywords || []).join(" ");
    let s = stats + (def.type === "spell" ? 3 : 0);
    if (kw.indexOf("charge") >= 0) s += 5;
    if (kw.indexOf("taunt") >= 0) s += 3;
    if (kw.indexOf("battlecry") >= 0) s += 2;
    if (def.spell) {
      if (["damage", "freezeDraw", "freezeAll", "bloodDraw"].indexOf(def.spell.type) >= 0) s += 4;
      if (["draw", "drawVein", "discover", "healDraw", "buffHeal"].indexOf(def.spell.type) >= 0) s += 3;
    }
    if (strategy === "aggro") s += cheap * 6 + (def.cost || 0) * -2.2 + (def.attack || 0) * 1.5;
    else if (strategy === "control") s += (def.health || 0) * 1.2 + (def.cost || 0) * 0.8 + (kw.indexOf("taunt") >= 0 ? 4 : 0);
    else s += stats * 0.3 + (def.cost || 0) * 0.3;
    return s;
  }

  function autoBuildDeck(faction, strategy, allowedLegendary) {
    const strat = DECK_STRATEGIES[strategy] ? strategy : "midrange";
    const curve = DECK_STRATEGIES[strat].curve;
    const allowedLegends = allowedLegendary ? new Set(allowedLegendary) : null;
    const pool = cardPool(faction).filter(id => !CARDS[id].easterEgg && CARDS[id].type !== "formation" && CARDS[id].type !== "relic" && CARDS[id].type !== "equipment" && (!allowedLegends || CARDS[id].rarity !== "legendary" || allowedLegends.has(id)));
    const special = DECK_SPECIALS[faction];
    const specials = [special.formation, special.formation, special.relic, special.relic2].filter(Boolean);
    const chosen = specials.slice();
    const counts = {};
    for (const id of chosen) counts[id] = (counts[id] || 0) + 1;
    const rarity = deckRarityCounts(chosen);
    const take = (id) => {
      const d = CARDS[id];
      if (!d || counts[id] >= maxCopies(d)) return false;
      if (DECK_RARITY_LIMITS[d.rarity] != null && rarity[d.rarity] >= DECK_RARITY_LIMITS[d.rarity]) return false;
      counts[id] = (counts[id] || 0) + 1;
      if (rarity[d.rarity] != null) rarity[d.rarity] += 1;
      chosen.push(id);
      return true;
    };
    for (const costKey of Object.keys(curve)) {
      const cost = Number(costKey);
      const target = curve[costKey];
      const cards = pool.filter((id) => CARDS[id].cost === cost).sort((a, b) => scoreForAuto(CARDS[b], strat) - scoreForAuto(CARDS[a], strat) || a.localeCompare(b));
      let need = target;
      for (const id of cards) {
        while (need > 0 && chosen.length < 30 && take(id)) need--;
        if (need <= 0 || chosen.length >= 30) break;
      }
      if (chosen.length >= 30) break;
    }
    const rest = pool.slice().sort((a, b) => scoreForAuto(CARDS[b], strat) - scoreForAuto(CARDS[a], strat) || a.localeCompare(b));
    while (chosen.length < 30) {
      let added = false;
      for (const id of rest) {
        if (chosen.length >= 30) break;
        if (take(id)) added = true;
      }
      if (!added) break;
    }
    return chosen;
  }

  const DECKS = {
    pus: ["mist_hound", "wandering_blade", "vein_heart", "formation_standard", "shextena", "medic_apprentice", "fog_dockhand", "dusk_inn_yard", "formation_bugler", "chaos_rift", "northern_nomad", "north_hunter", "formation_weaver", "fate_gambler", "neutral_wayfarer", "floating_anchor", "coordination", "fog_sailor", "time_loan", "vein_surge", "mist_scout", "mist_scout", "caravan_guard", "caravan_guard", "gh_shield_mercenary", "courier", "fog_sailor", "ley_surveyor", "losutai_refugee", "anvil_town_miner"],
    xizhao: ["formation_tide", "formation_tide", "blood_scythe", "blood_censer", "fog_dockhand", "blood_pact_collector", "blood_acolyte", "xh_blood_guard", "tribal_warrior", "blood_duelist", "blood_duelist", "wandering_guard", "wandering_guard", "mercenary", "mercenary", "mist_harbor_city", "mist_harbor_city", "south_pole_tracker", "mist_pier", "white_reef_lamp_oil", "grayfeather", "caravan_guard", "chaos_rift", "xh_blood_knight", "vein_surge", "time_loan", "blood_pact", "tide_scout", "broken_bone_warlord", "blood_priestess"],
    academy: ["mist_hound", "wandering_blade", "spell_codex", "academy_inkwell", "frostweave_cloak", "mana_surge", "white_reef_keeper", "archive_guard", "archive_guard", "wandering_guard", "wandering_guard", "northern_nomad", "supply_cache", "sky_ship", "sky_ship", "record_clerk", "archive_search", "debate", "fog_dockhand", "dusk_inn_yard", "chaos_rift", "north_hunter", "anvil_town_miner", "anvil_town_miner", "mist_scout", "mist_scout", "neutral_wayfarer", "mist_harbor_city", "losutai_pool", "karl_desmond"],
    republic: ["mist_hound", "fortify", "iron_banner", "republic_seal", "konrad", "fate_gambler", "fog_dockhand", "dusk_inn_yard", "shield_recruit", "white_reef_lamp_oil", "levy", "time_loan", "neutral_wayfarer", "gok_digger", "gok_digger", "fog_sailor", "mist_scout", "caravan_guard", "caravan_guard", "fog_sailor", "line_rotation", "losutai_refugee", "shield_recruit", "wall_recruit", "anvil_town_smith", "wandering_blade", "chaos_rift", "northern_nomad", "reborn_sentry", "mist_pier"],
    empire: ["zone_barrage", "fog_dockhand", "powder_engine", "armor_forge", "klaus", "walter", "iron_artillery", "blackridge_heavy_armor", "siege_captain", "barrage", "mist_pier", "otto_hand", "fate_gambler", "dusk_inn_yard", "martial_court", "chaos_rift", "neutral_wayfarer", "time_loan", "gok_digger", "fog_sailor", "snow_medic", "snow_medic", "mist_scout", "mist_scout", "caravan_guard", "barrage", "fog_sailor", "losutai_refugee", "archive_guard", "archive_guard"],
    greyharbor: ["gh_bounty_notice", "mist_hound", "dusk_inn_yard", "gh_ledger_chain", "venom_attendant", "venom_attendant", "gh_captain", "fate_gambler", "vein_surge", "gh_poison_thrower", "lamp_post", "white_reef_lamp_oil", "gh_venom_shield", "gh_venom_shield", "gh_legend_assassin", "gh_legend_assassin", "gh_bounty_collector", "gh_bounty_collector", "kugreen", "gh_scorpion", "gh_scorpion", "chaos_rift", "time_loan", "fog_dockhand", "execution_supervisor", "seran", "toll_account", "fog_harbor_ticket", "fog_sailor", "gh_contract_squire"]
  };

  for (const factionId of FACTION_IDS) {
    if (!DECKS[factionId] || !DECK_SPECIALS[factionId]) continue;
    const main = DECKS[factionId].slice();
    const special = DECK_SPECIALS[factionId];
    DECKS[factionId] = main.slice(0, 28).concat([special.formation, special.formation, special.relic, special.relic2]);
  }

  const KEYWORDS = {
    taunt: { name: "守备", icon: "🛡", color: "#d8b36a" },
    charge: { name: "先遣", icon: "⚔", color: "#e07a5f" },
    battlecry: { name: "登场", icon: "✦", color: "#7ec8e3" },
    deathrattle: { name: "余响", icon: "☠", color: "#b58bd8" },
    freeze: { name: "冻结", icon: "❄", color: "#7fd3ff" },
    stealth: { name: "隐匿", icon: "◐", color: "#9bb0c9" },
    counter: { name: "反击", icon: "↩", color: "#e0b36a" },
    divineShield: { name: "格挡", icon: "✧", color: "#f1df9d" },
    windfury: { name: "连携", icon: "⚡", color: "#8fd6ff" },
    poisonous: { name: "蚀毒", icon: "☠", color: "#a9d36f" },
    lifesteal: { name: "血偿", icon: "♥", color: "#e28aa7" },
    rush: { name: "先遣", icon: "➤", color: "#e0a36a" },
    reborn: { name: "回潮", icon: "♻", color: "#9fd7c4" }
  };

  // ===== 白板随从补全 / 让每张随从都有可读的玩法 =====
  Object.assign(CARDS.bard, { keywords: ["battlecry"], target: "none", battlecry: { type: "draw", amount: 1 }, text: "登场：抽 1 张牌。" });
  Object.assign(CARDS.mercenary, { keywords: ["battlecry"], target: "none", battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" });
  Object.assign(CARDS.vein_oracle, { keywords: ["battlecry"], target: "none", battlecry: { type: "veinDraw", amount: 1, vein: 6, draw: 1 }, text: "登场：流脉 +1；若流脉≥6，抽 1 张牌。" });
  Object.assign(CARDS.spell_echo, { keywords: ["battlecry"], target: "none", battlecry: { type: "discover", pool: "spell" }, text: "登场：检索一张战术牌。" });
  Object.assign(CARDS.siege_train, { keywords: ["battlecry"], target: "none", battlecry: { type: "damageAllEnemies", amount: 1 }, text: "登场：对所有敌方随从造成 1 点伤害。" });
  Object.assign(CARDS.void_titan, { keywords: ["battlecry"], target: "enemy", battlecry: { type: "destroy" }, text: "登场：消灭一个敌方随从。" });
  Object.assign(CARDS.vein_channeler, { keywords: ["battlecry"], target: "none", battlecry: { type: "veinOnly", amount: 1 }, text: "登场：流脉 +1。" });
  Object.assign(CARDS.excavation_titan, { keywords: ["battlecry"], target: "none", battlecry: { type: "veinOnly", amount: 2 }, text: "登场：流脉 +2。" });
  Object.assign(CARDS.blood_priestess, { keywords: ["battlecry"], target: "none", battlecry: { type: "healHero", amount: 3 }, text: "登场：恢复你的领袖 3 点生命。" });
  Object.assign(CARDS.siege_captain, { keywords: ["battlecry"], target: "none", battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" });
  Object.assign(CARDS.frost_professor, { keywords: ["battlecry"], target: "enemy", battlecry: { type: "freeze" }, text: "登场：冻结一个敌方随从。" });
  Object.assign(CARDS.powder_marshal, { keywords: ["battlecry"], target: "none", battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" });
  Object.assign(CARDS.vein_leviathan, { keywords: ["battlecry"], target: "none", battlecry: { type: "veinDraw", amount: 1, vein: 7, draw: 1 }, text: "登场：流脉 +1；若流脉≥7，抽 1 张牌。" });
  Object.assign(CARDS.world_serpent, { keywords: ["battlecry"], target: "none", battlecry: { type: "damageAllEnemies", amount: 2 }, text: "登场：对所有敌方随从造成 2 点伤害。" });
  Object.assign(CARDS.faceless_king, { keywords: ["battlecry"], target: "friendly", battlecry: { type: "copyFriendly" }, text: "登场：复制一个友方随从。" });

  // ===== 阵营软克制卡 / 2.0 =====
  Object.assign(CARDS, {
  "chaos_rift": {
    "id": "chaos_rift",
    "name": "混沌裂隙",
    "faction": "neutral",
    "type": "spell",
    "cost": 3,
    "rarity": "epic",
    "experimental": true,
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "随机消灭一个敌方随从。",
    "flavor": "裂隙不挑食。",
    "spell": {
      "type": "destroyRandomEnemy"
    },
    "noArtwork": false
  },
  "mutant_egg": {
    "id": "mutant_egg",
    "name": "变异之卵",
    "faction": "neutral",
    "type": "minion",
    "cost": 1,
    "attack": 0,
    "health": 3,
    "rarity": "epic",
    "experimental": true,
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：召唤一个随机 5 费随从。",
    "flavor": "没人知道里面会孵出什么。",
    "deathrattle": {
      "type": "summonRandomCost",
      "cost": 5
    },
    "noArtwork": false
  },
  "fate_gambler": {
    "id": "fate_gambler",
    "name": "命运赌徒",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "attack": 3,
    "health": 3,
    "rarity": "epic",
    "experimental": true,
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：随机对一个敌方单位造成 3 点伤害。",
    "flavor": "他把命运押在对面。",
    "battlecry": {
      "type": "damageRandomEnemy",
      "amount": 3
    },
    "noArtwork": false
  },
  "forbidden_knowledge": {
    "id": "forbidden_knowledge",
    "name": "禁忌知识",
    "faction": "neutral",
    "type": "spell",
    "cost": 3,
    "rarity": "epic",
    "experimental": true,
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 3 张牌；你的领袖受到 3 点伤害。",
    "flavor": "知识没有代价，阅读有。",
    "spell": {
      "type": "selfDamageDraw",
      "self": 3,
      "draw": 3
    },
    "noArtwork": false
  },
  "time_loan": {
    "id": "time_loan",
    "name": "时间借贷",
    "faction": "neutral",
    "type": "spell",
    "cost": 0,
    "rarity": "epic",
    "experimental": true,
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 2 张牌；反噬 1。",
    "flavor": "先花未来的时间，再还。",
    "spell": {
      "type": "draw",
      "amount": 2
    },
    "overload": 1,
    "noArtwork": false
  },
  "vein_surge": {
    "id": "vein_surge",
    "name": "流脉超载",
    "faction": "neutral",
    "type": "spell",
    "cost": 2,
    "rarity": "epic",
    "experimental": true,
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "流脉 +3。",
    "flavor": "把世界的脉搏调快一点。",
    "spell": {
      "type": "veinSurge",
      "amount": 3
    },
    "noArtwork": false
  }
});
  Object.assign(CARDS, {
    armor_break: {
      id: "armor_break", name: "破甲演算", faction: "academy", type: "spell",
      cost: 3, rarity: "epic", art: null, target: "none",
      text: "移除敌方领袖至多 3 点护甲；抽 1 张牌。",
      flavor: "护甲是另一种算式，拆开它只需要正确的括号。",
      spell: { type: "stripArmorDraw", amount: 3, draw: 1 }
    },
    blood_path: {
      id: "blood_path", name: "血路", faction: "xizhao", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "friendly",
      text: "使一个友方随从获得 +1 攻击；本回合它攻击时无视守备。",
      flavor: "没有墙能挡住一条已经流出去的血路。",
      spell: { type: "ignoreTauntBuff", attack: 1 }
    },
    anti_rush: {
      id: "anti_rush", name: "反炮击工事", faction: "republic", type: "spell",
      cost: 3, rarity: "rare", art: null, target: "none",
      text: "获得 4 点护甲；若敌方有先遣随从，再获得 2 点护甲。",
      flavor: "炮弹的落点，在图纸上早就被标好了。",
      spell: { type: "armorConditionalRush", armor: 4, bonus: 2 }
    },
    vein_ward: {
      id: "vein_ward", name: "地脉护佑", faction: "pus", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "恢复你的领袖 2 点生命；本回合你的随从不能被冻结。",
      flavor: "地脉在脚下翻身，把冬天挡在外面。",
      spell: { type: "antiFreezeHeal", heal: 2 }
    },
    quarantine: {
      id: "quarantine", name: "战地检疫", faction: "empire", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "enemy",
      text: "对一个敌方随从造成 1 点伤害；本回合敌方领袖不能恢复生命。",
      flavor: "伤口可以处理，但先要确认它不会继续长。",
      spell: { type: "damageHealBlock", amount: 1 }
    }
  });
  // ===== 第二组阵营专属卡 =====
  Object.assign(CARDS, {
    battle_calc: { id: "battle_calc", name: "战场推演", faction: "academy", type: "spell", cost: 2, rarity: "common", art: null, target: "enemy", text: "对一个敌方随从造成 2 点伤害。", flavor: "把对手的下一步，也算进自己的公式里。", spell: { type: "damage", amount: 2 } },
    hunt_ritual: { id: "hunt_ritual", name: "猎杀仪式", faction: "xizhao", type: "spell", cost: 3, rarity: "common", art: null, target: "enemy", text: "对一个敌方随从造成 3 点伤害。", flavor: "血族从不浪费一场狩猎。", spell: { type: "damage", amount: 3 } },
    line_rotation: { id: "line_rotation", name: "阵线轮换", faction: "republic", type: "spell", cost: 2, rarity: "common", art: null, target: "friendly", text: "使一个友方随从获得守备。", flavor: "换防不是后退，是把盾递到下一双手里。", spell: { type: "buffTaunt", attack: 0, health: 0 } },
    vein_sentinel: { id: "vein_sentinel", name: "守脉者", faction: "pus", type: "minion", cost: 3, rarity: "common", art: null, target: "none", attack: 2, health: 4, keywords: ["taunt"], text: "守备。", flavor: "它站着的地方，就是地脉的边界。" },
    armor_recycle: { id: "armor_recycle", name: "装甲回收", faction: "empire", type: "spell", cost: 3, rarity: "common", art: null, target: "none", text: "获得 3 点护甲。", flavor: "废铁只是还没找到下一门炮。", spell: { type: "armor", amount: 3 } }
  });
  // 只保留卡牌效果文本，风味文本放到详情页。
  for (const id of ["vein_warden","mist_hound","archive_guard","vein_bulwark","aegis_guard","wind_cannon","venom_fang","rebirth_serpent","rush_lancer","vein_scout","shield_recruit","iron_phalanx","siphon_guard","vein_sentinel"]) {
    const card = CARDS[id];
    if (card) card.text = "";
  }
  Object.assign(CARDS.courier, { text: "阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.fog_sailor, { text: "阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.gok_digger, { text: "掘脉1；引脉4：获得 1 点护甲。" });

  // ===== 终版卡面文字与同质卡修正 =====
  // 恢复关键词随从的卡面说明，避免看起来像“效果被删除了”。
  Object.assign(CARDS.vein_warden, { text: "守备。" });
  Object.assign(CARDS.mist_hound, { text: "先遣。" });
  Object.assign(CARDS.archive_guard, { text: "守备。" });
  Object.assign(CARDS.vein_bulwark, { text: "血偿。" });
  Object.assign(CARDS.aegis_guard, { text: "格挡。守备。" });
  Object.assign(CARDS.wind_cannon, { text: "连携。" });
  Object.assign(CARDS.venom_fang, { text: "蚀毒。" });
  Object.assign(CARDS.rebirth_serpent, { text: "回潮。" });
  Object.assign(CARDS.rush_lancer, { text: "先遣。" });
  Object.assign(CARDS.vein_scout, { text: "先遣。" });
  Object.assign(CARDS.shield_recruit, { text: "守备。" });
  Object.assign(CARDS.iron_phalanx, { text: "守备。" });
  Object.assign(CARDS.siphon_guard, { text: "守备。" });
  Object.assign(CARDS.vein_sentinel, { text: "守备。" });
  // 帝国 5 费：攻城队长与火药元帅不再同效果、同定位。
  Object.assign(CARDS.siege_captain, { cost: 5, attack: 4, health: 5, keywords: ["battlecry"], target: "none", battlecry: { type: "damageAllEnemies", amount: 1 }, passive: null, text: "登场：对所有敌方随从造成 1 点伤害。" });
  Object.assign(CARDS.powder_marshal, { cost: 5, attack: 5, health: 4, keywords: ["battlecry"], target: "none", battlecry: { type: "armor", amount: 2 }, passive: null, text: "登场：获得 2 点护甲。" });
  // 中立 2 费抽牌/掘脉不再同模板。
  Object.assign(CARDS.recon, { cost: 1, spell: { type: "draw", amount: 1 }, excavate: 1, text: "抽 1 张牌；掘脉1。" });
  Object.assign(CARDS.old_ledger, { cost: 3, spell: { type: "draw", amount: 2 }, excavate: null, text: "抽 2 张牌。" });
  Object.assign(CARDS.vein_prospect, { cost: 3, spell: { type: "draw", amount: 1 }, excavate: 2, text: "抽 1 张牌；掘脉2。" });
  // 中立 2 费冻结/余响不再完全同效果。
  Object.assign(CARDS.smoke_screen, { cost: 3, text: "冻结一个敌方随从；抽 1 张牌。" });
  Object.assign(CARDS.sim_assistant, { cost: 3, attack: 2, health: 2, text: "余响：抽 1 张牌。" });
  Object.assign(CARDS.vein_medic, { deathrattle: { type: "healHero", amount: 3 }, text: "余响：恢复你的领袖 3 点生命。" });
  // 共和国守备光环按费用分级，不再三个费用完全同效果。
  Object.assign(CARDS.bastion_captain, { passive: { type: "tauntAura", amount: 2 }, text: "被动：你召唤的守备随从获得 +0/+2。" });
  Object.assign(CARDS.shield_marshal, { passive: { type: "tauntAura", amount: 3 }, text: "守备。被动：你召唤的守备随从获得 +0/+3。" });

  // 避免严格同效果/同位卡：低费阵位与共和光环各走不同方向。
  Object.assign(CARDS.fog_sailor, { zoneBonus: { attack: 1 }, text: "阵位：若同阵位有另一个友方随从，攻击力 +1。" });
  Object.assign(CARDS.phalanx_warden, { battlecry: { type: "buffAllTaunt", health: 2 }, text: "守备。登场：所有友方守备随从获得 +0/+2。" });

  Object.assign(CARDS.blood_imp, { cost: 2 });
  Object.assign(CARDS.gok_digger, { veinBonus: { vein: 4, armor: 2 }, text: "掘脉1；引脉4：获得 2 点护甲。" });
  Object.assign(CARDS.bard, { battlecry: { type: "discover", pool: "any" }, text: "登场：检索一张牌。" });

  // ===== 阴卡与中立装备/阵型 =====
  Object.assign(CARDS, {
    secret_police: {
      id: "secret_police", name: "秘密警察", faction: "empire", type: "minion",
      cost: 4, attack: 3, health: 3, rarity: "epic", art: null,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：沉默一个敌方随从。",
      flavor: "档案不会说话，但档案室会。",
      battlecry: { type: "silence" }
    },
    war_tax: {
      id: "war_tax", name: "战争税", faction: "empire", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "none",
      text: "抽 2 张牌；你的领袖受到 1 点伤害。",
      flavor: "税单比炮弹更早抵达前线。",
      spell: { type: "selfDamageDraw", self: 1, draw: 2 }
    },
    emergency_bill: {
      id: "emergency_bill", name: "紧急法案", faction: "republic", type: "spell",
      cost: 2, rarity: "rare", art: null, target: "enemy",
      text: "冻结一个敌方随从；获得 1 点护甲。",
      flavor: "程序走得慢，但冻结得很快。",
      spell: { type: "freezeArmor", armor: 1 }
    },
    impeachment: {
      id: "impeachment", name: "弹劾案", faction: "republic", type: "spell",
      cost: 4, rarity: "epic", art: null, target: "enemy",
      text: "消灭一个敌方随从。",
      flavor: "投票通过的那一刻，席位已经空了。",
      spell: { type: "destroy" }
    },
    wanderer_charm: {
      id: "wanderer_charm", name: "旅者护符", faction: "neutral", type: "relic",
      cost: 2, rarity: "rare", art: null,
      text: "装备：你的领袖生命上限 +2，并恢复 2 点生命。",
      flavor: "它不指向家，只指向下一段路。"
    },
    wayfarer_camp: {
      id: "wayfarer_camp", name: "旅者营地", faction: "neutral", type: "formation",
      cost: 3, rarity: "rare", art: null,
      text: "阵型：该阵位友方随从获得 +0/+1 和守备。",
      flavor: "篝火亮着，就还有人愿意守夜。",
      formation: { attack: 0, health: 1, taunt: true }
    },
    wandering_merchant: {
      id: "wandering_merchant", name: "流浪商人", faction: "neutral", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null,
      keywords: ["battlecry"], target: "none",
      text: "登场：抽 1 张牌；若你的手牌不多于 4，再抽 1 张。",
      flavor: "他不卖答案，只卖下一张地图。",
      battlecry: { type: "drawHandCondition", hand: 4, draw: 1 }
    },
    neutral_wayfarer: {
      id: "neutral_wayfarer", name: "无籍旅者", faction: "neutral", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "common", art: null,
      keywords: ["rush"], target: "none",
      text: "先遣。",
      flavor: "没有旗帜的人，跑得最快。"
    }
  });

  // 新卡没有生成图时不发 404，直接使用通用阵营徽记。
  for (const id of ["secret_police","war_tax","emergency_bill","impeachment","wanderer_charm","wayfarer_camp","wandering_merchant","neutral_wayfarer"]) {
    if (CARDS[id]) CARDS[id].noGeneratedArt = true;
  }

  Object.assign(CARDS.shextena, { battlecry: { type: "healOverflowBuff", amount: 5 }, text: "登场：恢复一个友方随从 5 点生命；每恢复 1 点，它获得 +1/+1；溢出治疗恢复你的领袖。 对位：若敌方对位阵位有随从，恢复你的领袖 1 点生命。 引脉6：恢复你的领袖 3 点生命。" });

  Object.assign(CARDS.miyuki, { text: "登场：冻结一个敌方随从；引脉6：改为冻结所有敌方随从；引脉10：改为消灭所有敌方随从。" });

  // 深雪改为阵位/阵型协同；冻结组合交给学院的霜系教授。
  Object.assign(CARDS.miyuki, {
    battlecry: { type: "freezeZoneFormation", draw: 1 },
    text: "登场：冻结目标所在阵位的所有敌方随从；若你的同阵位有阵型，抽 1 张牌。"
  });
  Object.assign(CARDS.frost_professor, {
    battlecry: { type: "freezeCombo", allAtVein: 6, destroyAtVein: 10 },
    text: "登场：冻结一个敌方随从；引脉6：冻结所有敌方随从；引脉10：冻结并消灭所有敌方随从。"
  });

  // ===== 史诗流派支撑卡 =====
  Object.assign(CARDS, {
    formation_weaver: {
      id: "formation_weaver", name: "阵线织者", faction: "pus", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "登场：若你使用过阵型卡，获得 +1/+1 并抽 1 张牌。",
      flavor: "她不是在站队，她是在画线。",
      battlecry: { type: "formationPayoff" }
    },
    spell_conductor: {
      id: "spell_conductor", name: "法术指挥", faction: "academy", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: [], target: "none",
      text: "被动：你每施放一张战术牌，获得 +1/+1。",
      flavor: "她让每一个音节都落在最疼的地方。",
      passive: { type: "spellGrowth", attack: 1, health: 1 }
    },
    blood_executor: {
      id: "blood_executor", name: "血债执行者", faction: "xizhao", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: [], target: "none",
      text: "被动：每当一个其他友方随从死亡，获得 +1/+1。",
      flavor: "血债不会消失，只会换一个债主。",
      passive: { type: "deathGrowth", attack: 1, health: 1 }
    },
    phalanx_executor: {
      id: "phalanx_executor", name: "方阵执行官", faction: "republic", type: "minion",
      cost: 4, attack: 3, health: 5, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["taunt"], target: "none",
      text: "守备。被动：每当另一个友方守备随从死亡，抽 1 张牌。",
      flavor: "倒下的人会被记入下一份军报。",
      passive: { type: "tauntDeathDraw", draw: 1 }
    },
    armor_mortar: {
      id: "armor_mortar", name: "装甲炮击", faction: "empire", type: "spell",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true, target: "none",
      text: "消耗至多 5 点护甲，对敌方领袖造成等量伤害。",
      flavor: "每一块装甲，最后都会变成弹片。",
      spell: { type: "armorToDamage", max: 5 }
    }
  });

  const NEW_DECK_REPLACEMENTS = {
    academy: ["insight", "armor_break"],
    xizhao: ["shadow_raid", "blood_path"],
    republic: [],
    pus: ["coordination", "vein_ward"],
    empire: []
  };
  for (const [faction, [oldId, newId]] of Object.entries(NEW_DECK_REPLACEMENTS)) {
    if (!DECKS[faction]) continue;
    const idx = DECKS[faction].indexOf(oldId);
    if (idx >= 0) DECKS[faction][idx] = newId;
  }

  // ===== 传说随从数值强化：让传说卡有应有的压迫感 =====
  for (const c of Object.values(CARDS)) {
    if (!c.token && !c.disabled && c.rarity === "legendary" && c.type === "minion") {
      c.attack = (c.attack || 0) + 1;
      c.health = (c.health || 0) + 1;
    }
  }

  // ===== 低曲线卡补强：攻血总和低于费用曲线的普通随从 +1 生命 =====
  for (const c of Object.values(CARDS)) {
    if (c.token || c.disabled || c.type !== "minion" || c.rarity === "legendary") continue;
    if ((c.attack || 0) + (c.health || 0) <= (c.cost || 0) * 2) c.health = (c.health || 0) + 1;
  }

  // ===== 平衡与指定卡牌调整 =====
  Object.assign(HEROES.lain.passive, { text: "流脉阈值触发时，恢复所有友方单位 2 点生命。" });
  Object.assign(HEROES.marta.power, { text: "对一个敌方随从或敌方领袖造成 2 点伤害。" });
  Object.assign(HEROES.otto.power, { text: "对一个敌方随从或敌方领袖造成 2 点伤害。" });
  Object.assign(HEROES.wolfram.passive, { text: "当一个友方随从获得守备时，它获得 +0/+1。" });
  Object.assign(CARDS.aegis_guard, { attack: 4, health: 4 });
  Object.assign(CARDS.lanzhou, { attack: 1, health: 1 });
  Object.assign(CARDS.hunt_ritual, { spell: { type: "damage", amount: 5 }, text: "对一个敌方随从造成 5 点伤害。" });
  Object.assign(CARDS.arcane_theorist, {
    cost: 4, rarity: "legendary", attack: 3, health: 4,
    keywords: ["passive"], battlecry: null, passive: { type: "spellDiscoverOnce" },
    text: "被动：每当你施放一张战术牌，检索一张战术牌。每回合一次。"
  });
  Object.assign(CARDS.borrow_vein, { cost: 2, spell: { type: "gainManaNowNext", mana: 1, next: 1 }, text: "获得 1 行动力；下回合开始时再获得 1 行动力。" });
  Object.assign(CARDS.battle_calc, { disabled: true });
  Object.assign(CARDS.frost_professor, {
    battlecry: { type: "freezeCombo", allAtVein: 6, destroyAtVein: 10 },
    text: "登场：冻结一个敌方随从；引脉6：冻结所有敌方随从；引脉10：消灭所有已被冻结的敌方随从。"
  });
  Object.assign(CARDS.arcane_conduit, {
    text: "被动：每当你施放一张战术牌，获得等同于其行动力消耗的护甲。",
    passive: { type: "spellArmor", amount: 0 }
  });
  Object.assign(CARDS.vein_heart, { text: "装备：每当流脉增加时，获得 1 点护甲；每回合最多一次。" });

  Object.assign(HEROES.karna.power, { text: "对一个友方随从造成 1 点伤害；若它因此死亡，抽 1 张牌。" });
  Object.assign(HEROES.karna.passive, { text: "友方随从受到来自友方的伤害且未死亡时，获得 +1 攻击或 +1 生命。" });

  // 学院补回解场，并补强前期曲线。
  Object.assign(CARDS, {
    formula_fix: {
      id: "formula_fix", name: "公式修正", faction: "academy", type: "spell",
      cost: 2, rarity: "rare", art: null, noGeneratedArt: true, target: "enemy",
      text: "对一个敌方随从造成 3 点伤害。",
      flavor: "错误不会被原谅，只会被重新计算。",
      spell: { type: "damage", amount: 3 }
    }
  });
  Object.assign(CARDS.nina, { health: (CARDS.nina.health || 0) + 1 });
  Object.assign(CARDS.samuel, { health: (CARDS.samuel.health || 0) + 1 });
  Object.assign(CARDS.cassian, { health: (CARDS.cassian.health || 0) + 1 });
  Object.assign(CARDS.arcane_surge, { cost: 4 });
  Object.assign(HEROES.lain.passive, { text: "流脉阈值触发时，恢复所有友方单位 1 点生命。" });

  // 31-card decks: 30 playable cards + exactly one relic
  for (const deckFaction of Object.keys(DECKS)) {
    const relicIds = DECKS[deckFaction].filter(id => CARDS[id] && CARDS[id].type === "relic");
    if (relicIds.length > 1) {
      const keep = relicIds[0];
      let removed = false;
      DECKS[deckFaction] = DECKS[deckFaction].filter(id => {
        if (!removed && CARDS[id] && CARDS[id].type === "relic" && id !== keep) { removed = true; return false; }
        return true;
      });
    }
  }

  // ===== 补齐 200 张：每阵营 30 张，中立扩展 =====
  Object.assign(CARDS.armor_recycle, { faction: "neutral" });
  Object.assign(CARDS, {
    formation_echo: {
      id: "formation_echo", name: "阵线回响", faction: "pus", type: "spell",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true, target: "none",
      text: "抽 1 张牌；若你使用过阵型卡，获得 2 点护甲。",
      flavor: "阵线不是画在地上的，是画在彼此之间的。",
      spell: { type: "formationDrawArmor", draw: 1, armor: 2 }
    },
    blood_contract: {
      id: "blood_contract", name: "血偿契约", faction: "xizhao", type: "spell",
      cost: 2, rarity: "epic", art: null, noGeneratedArt: true, target: "friendly",
      text: "对一个友方随从造成 2 点伤害；抽 2 张牌。",
      flavor: "契约上写得很清楚：血先流，账后算。",
      spell: { type: "friendlyDamageDraw", amount: 2, draw: 2 }
    },
    double_formula: {
      id: "double_formula", name: "双重公式", faction: "academy", type: "spell",
      cost: 2, rarity: "epic", art: null, noGeneratedArt: true, target: "enemy",
      text: "对一个敌方随从造成 2 点伤害；若本回合此前已施放过战术牌，改为 4 点。",
      flavor: "第二遍验算，通常比第一遍更疼。",
      spell: { type: "doubleSpellDamage", amount: 2, bonus: 4 }
    },
    wandering_guard: {
      id: "wandering_guard", name: "荒野守卫", faction: "neutral", type: "minion",
      cost: 3, attack: 3, health: 4, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["taunt", "battlecry"], target: "none",
      text: "守备。登场：恢复你的领袖 1 点生命。",
      battlecry: { type: "healHero", amount: 1 },
      flavor: "他守的不是路，是路过的人。"
    },
    traveling_healer: {
      id: "traveling_healer", name: "旅行医师", faction: "neutral", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "登场：恢复你的领袖 2 点生命。",
      flavor: "药箱里没有答案，只有下一段路。",
      battlecry: { type: "healHero", amount: 2 }
    },
    old_compass: {
      id: "old_compass", name: "旧罗盘", faction: "neutral", type: "spell",
      cost: 2, rarity: "rare", art: null, noGeneratedArt: true, target: "none",
      text: "检索一张牌。",
      flavor: "它不指向北方，只指向还没走过的方向。",
      spell: { type: "discover", pool: "any" }
    }
  });

  // ===== 设计审核收尾：修正数值、降级过度泛滥的史诗、限制中立发现 =====
  Object.assign(CARDS.blood_ritual, {
    spell: { type: "bloodDraw", damage: 2, draw: 1, extraIfDead: 1 },
    text: "对一个友方随从造成 2 点伤害，抽 1 张牌；若该随从死亡，再抽 1 张牌。"
  });
  Object.assign(CARDS.old_compass, { cost: 3 });
  for (const id of ["vein_oracle","spell_echo","siege_train","vein_bulwark","wind_cannon","rebirth_serpent","excavation_titan","blood_priestess","iron_phalanx","siphon_guard","powder_marshal","vein_siphon","chrono_scholar","archive_devourer","armor_break","aegis_guard"]) {
    if (CARDS[id]) CARDS[id].rarity = "rare";
  }

  // ===== 阵营强弱再平衡 =====
  Object.assign(HEROES.lain, { hp: 28, armor: 8 });
  Object.assign(HEROES.marta, { hp: 32, armor: 10 });
  Object.assign(HEROES.karna, { hp: 36, armor: 10 });
  Object.assign(HEROES.wolfram, { hp: 33, armor: 8 });
  Object.assign(CARDS.shextena, { health: 6 });
  Object.assign(CARDS.orlicas, { health: 2 });
  Object.assign(CARDS.aidric, { health: 6 });
  Object.assign(CARDS.debate, { spell: { type: "damage", amount: 3 }, text: "对一个敌方随从造成 3 点伤害。" });
  Object.assign(CARDS.prohibition, { cost: 2 });

  // ===== 双装备与阵营特色装备 =====
  Object.assign(CARDS.spell_codex, { text: "装备：每个你的回合第一张战术牌的行动力消耗 -2。" });
  Object.assign(CARDS.blood_scythe, { text: "装备：友方随从死亡时，你的领袖恢复 3 点生命。" });
  Object.assign(CARDS.iron_banner, { text: "装备：你召唤的守备随从获得 +1/+1。" });
  Object.assign(CARDS.powder_engine, { text: "装备：你的回合开始时若敌方领袖没有护甲，造成 2 点伤害。" });
  Object.assign(CARDS.armor_recycle, { faction: "empire", spell: { type: "armor", amount: 5 }, text: "获得 5 点护甲。" });
  Object.assign(CARDS.iron_engineer, { faction: "neutral" });
  Object.assign(CARDS, {
    formation_standard: {
      id: "formation_standard", name: "阵线旗标", faction: "pus", type: "relic",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true,
      text: "装备：你使用过阵型卡时，该阵线友方随从额外获得 +1/+1。",
      flavor: "旗子插在哪里，哪里就是阵线。"
    },
    frost_prism: {
      id: "frost_prism", name: "霜晶棱镜", faction: "academy", type: "relic",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true,
      text: "装备：每当你施放战术牌，随机冻结一个敌方随从。",
      flavor: "光穿过它时，连时间都会慢半拍。"
    },
    blood_censer: {
      id: "blood_censer", name: "血香炉", faction: "xizhao", type: "relic",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true,
      text: "装备：你的回合开始时，对一个友方随从造成 1 点伤害；若它存活，抽 1 张牌。",
      flavor: "香灰落在伤口上，账本又多了一行。"
    },
    republic_seal: {
      id: "republic_seal", name: "议席印玺", faction: "republic", type: "relic",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true,
      text: "装备：每当一个友方守备随从死亡，抽 1 张牌。",
      flavor: "印章落下，死者也有表决权。"
    },
    armor_forge: {
      id: "armor_forge", name: "帝国锻炉", faction: "empire", type: "relic",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true,
      text: "装备：你的回合开始时获得 1 点护甲。",
      flavor: "炉火不灭，铁就不会冷。"
    }
  });
  Object.assign(CARDS.fortify, { cost: 2 });
  Object.assign(CARDS.line_rotation, { cost: 1 });
  Object.assign(CARDS.powder_keg, { deathrattle: { type: "damageAllMinions", amount: 5 }, text: "余响：对所有随从造成 5 点伤害。" });
  Object.assign(CARDS.rush_lancer, { attack: 4, health: 5, text: "先遣。造成伤害时，获得等量护甲。", passive: { type: "damageToArmor" } });
  Object.assign(CARDS.klaus, { battlecry: { type: "buffPerAllMinions", attack: 1, health: 1 }, text: "守备。登场：场上每有一个随从（不分敌我），获得 +1/+1。" });

  // ===== 装备独立后补齐每阵营 30 张主卡 =====
  Object.assign(CARDS, {
    vein_attendant: { id: "vein_attendant", name: "引脉侍从", faction: "pus", type: "minion", cost: 2, attack: 2, health: 2, rarity: "rare", art: null, noGeneratedArt: true, keywords: ["battlecry"], target: "none", text: "登场：流脉 +1。", flavor: "他负责把每一滴流脉送到该去的地方。", battlecry: { type: "veinOnly", amount: 1 } },
    formula_apprentice: { id: "formula_apprentice", name: "公式学徒", faction: "academy", type: "minion", cost: 2, attack: 2, health: 2, rarity: "rare", art: null, noGeneratedArt: true, keywords: ["deathrattle"], target: "none", text: "余响：抽 1 张牌。", flavor: "算错的公式，至少还能当草稿纸。", deathrattle: { type: "draw", amount: 1 } },
    blood_acolyte: { id: "blood_acolyte", name: "血祭侍从", faction: "xizhao", type: "minion", cost: 2, attack: 2, health: 2, rarity: "rare", art: null, noGeneratedArt: true, keywords: ["deathrattle"], target: "none", text: "余响：对随机敌方单位造成 1 点伤害。", flavor: "疼痛是血族最诚实的祈祷。", deathrattle: { type: "damageRandomEnemy", amount: 1 } },
    bulwark_sentry: { id: "bulwark_sentry", name: "壁垒哨兵", faction: "republic", type: "minion", cost: 2, attack: 2, health: 3, rarity: "common", art: null, noGeneratedArt: true, keywords: ["taunt"], target: "none", text: "守备。", flavor: "他不需要跑得比敌人快，只需要比同伴站得久。" },
    iron_mechanic: { id: "iron_mechanic", name: "铁流技工", faction: "empire", type: "minion", cost: 2, attack: 2, health: 2, rarity: "rare", art: null, noGeneratedArt: true, keywords: ["deathrattle"], target: "none", text: "余响：获得 1 点护甲。", flavor: "他修不好炮，但能把炮拆成更多铁。", deathrattle: { type: "armor", amount: 1 } },
    wandering_blade: { id: "wandering_blade", name: "游荡剑客", faction: "neutral", type: "minion", cost: 2, attack: 2, health: 2, rarity: "common", art: null, noGeneratedArt: true, keywords: ["rush"], target: "none", text: "先遣。", flavor: "没有盟友，也没有退路。" }
  });

  // ===== 帝国指定改动 =====
  Object.assign(CARDS.powder_engine, { text: "装备：每当一名友方角色死亡，随机对一名敌方单位造成 1 点伤害。" });
  Object.assign(CARDS.gunther, { keywords: ["taunt", "battlecry"], target: "none", battlecry: { type: "armor", amount: 4 }, veinBonus: null, text: "守备。登场：获得 4 点护甲。" });
  Object.assign(CARDS.martial_court, { text: "每有一个敌方单位，获得 3 点护甲。", spell: { type: "armorPerEnemy", amount: 3 } });
  Object.assign(CARDS.formation_cannon, { text: "阵型：3 回合内，该阵位友方随从获得 +1/+1。", formation: { attack: 1, health: 1, duration: 3 } });
  Object.assign(CARDS.zone_barrage, { text: "对所有敌方随从造成 2 点伤害。", spell: { type: "damageAllEnemies", amount: 2 } });
  Object.assign(CARDS.armor_volley, { cost: 6 });

  Object.assign(CARDS.zone_barrage, { target: "none" });

  // ===== 帝国卡牌指定调整（第二批） =====
  Object.assign(CARDS.siege_captain, { cost: 4 });
  Object.assign(CARDS.powder_marshal, { battlecry: { type: "armor", amount: 5 }, text: "登场：获得 5 点护甲。" });
  Object.assign(CARDS.walter, { keywords: ["battlecry"], deathrattle: null, battlecry: { type: "damagePerArmorRandom", amount: 1 }, text: "登场：每有一点护甲，对一名随机敌方单位造成 1 点伤害。" });
  Object.assign(CARDS.siege_train, { battlecry: { type: "damageAllEnemies", amount: 3 }, text: "登场：对所有敌方随从造成 3 点伤害。" });

  // ===== 统一卡图：消除重复与缺失，使用本卡独立生成图 =====
  for (const id of ["guard","blood_ritual","shadow_raid","shield_marshal","siege_train","borrow_vein","reflux","stabilize","pressure_vein","return_tide","formation_vein","formation_script","formation_tide","formation_wall","formation_cannon","vein_heart","spell_codex","blood_scythe","iron_banner","powder_engine","zone_keeper","zone_archivist","zone_reaper","zone_banner","zone_barrage","vein_bulwark","overload_ritual","aegis_guard","wind_cannon","venom_fang","rebirth_serpent","rush_lancer","combo_spark","arcane_conduit","blood_priestess","blood_altar","tide_colossus","armor_volley","powder_marshal","vein_siphon","arcane_surge","devourer","phalanx_warden","iron_artillery","spellstorm","bastion_captain","chrono_scholar","armor_break","blood_path","anti_rush","vein_ward","quarantine","hunt_ritual","line_rotation","vein_sentinel","armor_recycle","secret_police","war_tax","emergency_bill","impeachment","wanderer_charm","wayfarer_camp","wandering_merchant","neutral_wayfarer","formation_weaver","spell_conductor","blood_executor","phalanx_executor","armor_mortar","formula_fix","formation_echo","blood_contract","double_formula","wandering_guard","traveling_healer","old_compass","formation_standard","frost_prism","blood_censer","republic_seal","armor_forge","vein_attendant","formula_apprentice","blood_acolyte","bulwark_sentry","iron_mechanic","wandering_blade"]) { if (CARDS[id]) { CARDS[id].art = null; CARDS[id].noGeneratedArt = false; } }
  // ===== 学院/西昭指定改动（第三批） =====
  Object.assign(CARDS.nina, {
    battlecry: { type: "freezeZone" },
    text: "登场：冻结目标所在阵位的所有敌方单位。 阵位：若同阵位有另一个友方随从，生命值 +1。"
  });
  Object.assign(CARDS.insight, {
    spell: { type: "drawCopyNextSpell", draw: 1 },
    text: "抽 1 张牌；复制下一张获得的法术牌。"
  });
  Object.assign(CARDS.combo_spark, {
    spell: { type: "damageZone", amount: 3, label: "顺势火花" },
    text: "对目标所在阵位的所有敌方单位造成 3 点伤害。"
  });
  Object.assign(CARDS.zone_archivist, {
    battlecry: { type: "recordIfEnemyZones" },
    text: "登场：若敌方三个阵位都有随从，获得一张 0 行动力「记录弹」。"
  });
  Object.assign(CARDS.justus, {
    battlecry: { type: "copyLowestSpell" },
    vein: null,
    text: "登场：复制你手牌中行动力消耗最低的战术牌；若其消耗大于等于 5，复制两张。"
  });
  Object.assign(CARDS.karl_desmond, {
    zoneBonus: { discoverSpell: 1 },
    mirrorBonus: { discoverSpell: 1 },
    text: "登场：检索一张战术牌。 阵位：若同阵位有另一个友方随从，额外检索一张战术牌。 对位：若敌方对位阵位有随从，额外检索一张战术牌。"
  });
  Object.assign(CARDS.cassian, {
    cost: 7, attack: 2, health: 2, keywords: [],
    passive: { type: "repeatLastSpell" },
    zoneBonus: null,
    text: "你的回合结束时，重复你释放的最后一个法术。"
  });
  Object.assign(CARDS.spellstorm, {
    cost: 10,
    target: "none",
    spell: { type: "damageAllEnemiesPerGameSpell", amount: 2 },
    text: "对所有敌方随从造成 2×你在本局使用的法术数量的伤害。"
  });
  Object.assign(CARDS.losutai_imp, {
    text: "每回合开始时获得 +1/+1。 余响：对随机敌方单位造成等同于攻击力的伤害（最高 5 点）。",
    noGeneratedArt: false,
    passive: { type: "turnGrowth", attack: 1, health: 1 },
    deathrattle: { type: "damageRandomEnemy", amountFromAttack: true, max: 5 },
    keywords: ["deathrattle"]
  });
  Object.assign(CARDS, {
    record_shot: {
      id: "record_shot", name: "记录弹", faction: "academy", type: "spell",
      cost: 0, rarity: "token", art: null, noGeneratedArt: true, token: true,
      target: "enemy", keywords: [], text: "对一个敌方随从造成 1 点伤害。",
      spell: { type: "damage", amount: 1 }
    }
  });

  // ===== v0.2 平衡补丁（2026-10-19） =====
  // 大学院：补前期站场与法术节奏，保留第三批机制。
  Object.assign(CARDS.karl_desmond, { health: 6 });
  Object.assign(CARDS.justus, { health: 4 });
  Object.assign(CARDS.cassian, { cost: 5, attack: 4, health: 4 });
  Object.assign(CARDS.samuel, { health: 4 });
  Object.assign(CARDS.nina, { attack: 4 });
  Object.assign(CARDS.lecturer, { attack: 4 });
  Object.assign(CARDS.spellstorm, { cost: 6 });

  // 帝国：降低非指定卡的整体节奏，指定卡（京特/克劳斯/瓦尔特/军事法庭/火药元帅等）不动。
  Object.assign(CARDS.mia, { attack: 2, health: 1 });
  Object.assign(CARDS.elsa, { health: 3 });
  Object.assign(CARDS.karl_schwarz, { attack: 4, health: 2 });
  Object.assign(CARDS.powder_boy, { health: 1 });
  Object.assign(CARDS.iron_artillery, { attack: 3, health: 4 });
  Object.assign(CARDS.wind_cannon, { attack: 3, health: 3 });
  Object.assign(CARDS.ironclad, { attack: 2, health: 2 });
  Object.assign(CARDS.barrage, { cost: 2 });
  Object.assign(CARDS.mobilize, { cost: 4 });
  Object.assign(CARDS.fortress, { spell: { type: "buffTaunt", attack: 0, health: 1 }, text: "使一个友方随从获得 +0/+1 与守备。" });

  // 共和国：整包嘲讽/护甲下调；筑防令、阵线轮换、格挡守卫、沃尔夫拉姆被动不动。
  Object.assign(CARDS.konrad, { health: 4 });
  Object.assign(CARDS.erhardt, { attack: 4 });
  Object.assign(CARDS.beatrix, { attack: 3 });
  Object.assign(CARDS.hans, { attack: 2, health: 2 });
  Object.assign(CARDS.cedric, { health: 5 });
  Object.assign(CARDS.elena, { attack: 3 });
  Object.assign(CARDS.republic_guard, { health: 2 });
  Object.assign(CARDS.shield_bearer, { health: 4 });
  Object.assign(CARDS.shield_marshal, { attack: 3, health: 6 });
  Object.assign(CARDS.phalanx_warden, { health: 5 });
  Object.assign(CARDS.shield_sergeant, { health: 5 });
  Object.assign(CARDS.martial_law, { cost: 6 });
  Object.assign(CARDS.stabilize, { reflux: 2, spell: { type: "armor", amount: 2 }, text: "逆脉2：获得 2 点护甲。" });

  // 西昭/普卫岛：在“领袖无开场护甲”新规则下维持预组强度，不再额外上调。

  // ===== 领袖不再拥有开场护甲；血量无上限 =====
  for (const h of Object.values(HEROES)) h.armor = 0;

  // ===== 平衡版数值（v0.2） =====
  Object.assign(HEROES.lain, { hp: 28, armor: 0 });
  Object.assign(HEROES.marta, { hp: 32, armor: 0 });
  Object.assign(HEROES.karna, { hp: 36, armor: 0 });
  Object.assign(HEROES.wolfram, { hp: 33, armor: 0 });
  Object.assign(HEROES.otto, { hp: 31, armor: 0 });
  Object.assign(HEROES.lain.passive, { text: "流脉阈值触发时，恢复所有友方单位 1 点生命。" });
  Object.assign(HEROES.marta.power, { text: "对一个敌方随从或敌方领袖造成 2 点伤害。" });
  Object.assign(HEROES.otto.power, { text: "对一个敌方随从或敌方领袖造成 2 点伤害。" });
  Object.assign(HEROES.karna.passive, { name: "血债共鸣", text: "友方随从受到来自友方的伤害且未死亡时，获得 +1 攻击或 +1 生命。" });
  Object.assign(CARDS.shextena, { health: 6 });


  // ===== v0.3 微调：学院前期 + 帝国小幅降温 =====
  Object.assign(HEROES.otto, { hp: 30 });
  Object.assign(CARDS.formula_apprentice, { health: 3 });
  Object.assign(CARDS.spell_novice, { health: 3 });

  // ===== 英雄主动技能恢复最初版本 =====
  Object.assign(HEROES.marta.power, { text: "对敌方领袖造成 2 点伤害。" });
  Object.assign(HEROES.otto.power, { text: "对一个敌方随从或敌方领袖造成 1 点伤害。" });

  // ===== 审计修复：保卫部卫兵的引脉 4 护甲 =====
  Object.assign(CARDS.guard, { veinBonus: { vein: 4, armor: 1 } });

  // ===== 关键词与文本一致性收尾 =====
  Object.assign(CARDS.klaus, { text: "守备。登场：场上每有一个其他随从（不分敌我），获得 +1/+1。" });

  // ===== “敌方单位”语义：领袖 + 所有随从 =====
  Object.assign(CARDS.zone_barrage, { target: "none", text: "对所有敌方单位造成 2 点伤害。", spell: { type: "damageAllEnemyUnits", amount: 2 } });
  Object.assign(CARDS.martial_court, { text: "每有一个敌方单位（包括领袖），获得 3 点护甲。", spell: { type: "armorPerEnemy", amount: 3 } });
  Object.assign(CARDS.walter, { text: "登场：每有一点护甲，对一名随机敌方单位（包括领袖）造成 1 点伤害。" });
  Object.assign(CARDS.nina, { text: "登场：冻结目标所在阵位的所有敌方随从。 阵位：若同阵位有另一个友方随从，生命值 +1。" });
  Object.assign(CARDS.combo_spark, { text: "对目标所在阵位的所有敌方随从造成 3 点伤害。" });

  // ===== 法术风暴最终调整 =====
  Object.assign(CARDS.spellstorm, {
    cost: 8,
    target: "none",
    spell: { type: "damageAllEnemyUnitsPerGameSpell", amount: 1 },
    text: "对所有敌方单位造成等同于本局已使用的战术牌数量的伤害。"
  });

  Object.assign(CARDS.losutai_beast, { noGeneratedArt: false, text: "" });

  // ===== 阵营纹章 AI 资产 =====
  {
    const emblemMap = {
      pus: "/assets/ui/emblem-pus.webp?v=20261020cc",
      academy: "/assets/ui/emblem-academy.webp?v=20261020cc",
      xizhao: "/assets/ui/emblem-xizhao.webp?v=20261020cc",
      republic: "/assets/ui/emblem-republic.webp?v=20261020cc",
      empire: "/assets/ui/emblem-empire.webp?v=20261020cc"
    };
    for (const f of Object.keys(emblemMap)) if (FACTIONS[f]) FACTIONS[f].emblem = emblemMap[f];
  }

  // final pass: every preset is 30 playable + exactly one relic
  for (const deckFaction of Object.keys(DECKS)) {
    const relicIds = DECKS[deckFaction].filter(id => CARDS[id] && CARDS[id].type === "relic");
    if (relicIds.length > 1) {
      const keep = relicIds[0];
      let removed = false;
      DECKS[deckFaction] = DECKS[deckFaction].filter(id => {
        if (!removed && CARDS[id] && CARDS[id].type === "relic" && id !== keep) { removed = true; return false; }
        return true;
      });
    }
  }

  // ===== 2026-10-19 卡牌重构：行动力、动态阵位、引脉阈值、掘脉、删卡 =====
  Object.assign(CARDS.medic_apprentice, {
    keywords: [],
    deathrattle: null,
    veinBonus: null,
    text: "引脉4/8：恢复你的领袖 1/3 点生命。",
    veinTiers: [{ vein: 4, healHero: 1 }, { vein: 8, healHero: 3 }]
  });
  Object.assign(CARDS.courier, {
    text: "阵位：同阵位每有一个其他随从，获得 +0/+1。",
    zoneBonus: { health: 1 }
  });
  Object.assign(CARDS.vein_attendant, {
    text: "登场：流脉 +1。 引脉2：获得 +1/+1。",
    veinTiers: [{ vein: 2, attack: 1, health: 1 }]
  });
  Object.assign(CARDS.guard, {
    name: "保卫部步兵",
    keywords: [],
    text: "阵位：同阵位每有一个其他随从，获得 +1/+0。 引脉4：获得 +1/+0。 引脉8：获得 +2/+0。",
    zoneBonus: { attack: 1 },
    veinBonus: null,
    veinTiers: [{ vein: 4, attack: 1 }, { vein: 8, attack: 2 }]
  });
  Object.assign(CARDS.orlicas, {
    text: "登场：抽 1 张牌；引脉4：再抽 1 张牌。 阵位：同阵位其他随从获得 +1/+1。",
    zoneBonus: null,
    zoneAura: { attack: 1, health: 1 }
  });
  Object.assign(CARDS.timon, {
    text: "登场：本回合你打出的下一张牌行动力消耗减少 1。 阵位：同阵位每有一个其他随从，获得 +0/+1。",
    zoneBonus: { health: 1 }
  });
  Object.assign(CARDS.zone_keeper, {
    text: "阵位：同阵位每有一个其他随从，获得 +2/+2。",
    zoneBonus: { attack: 2, health: 2 }
  });
  Object.assign(CARDS.formation_weaver, {
    text: "登场：若该卡被召唤到已经使用阵型卡的阵位，获得 +1/+1 并抽 1 张牌。"
  });
  Object.assign(CARDS.aidric, {
    keywords: ["taunt"],
    passive: null,
    text: "守备。 引脉4：获得 +1/+1。 引脉8：获得 +2/+2。",
    veinBonus: null,
    veinTiers: [{ vein: 4, attack: 1, health: 1 }, { vein: 8, attack: 2, health: 2 }]
  });
  Object.assign(CARDS.shextena, {
    target: "none",
    mirrorBonus: null,
    text: "登场：恢复你的领袖 5 点生命；每实际恢复 1 点，希斯蒂娜获得 +1/+1。 引脉10：恢复你的领袖 5 点生命。",
    battlecry: { type: "healHeroSelfBuff", amount: 5 },
    keywords: ["battlecry"],
    zoneBonus: null,
    veinBonus: null,
    veinTiers: [{ vein: 10, healHero: 5 }]
  });
  Object.assign(CARDS.miyuki, {
    cost: 6,
    target: "none",
    text: "登场：冻结场上除自己阵位以外的全部随从，包括友方。 阵位：深雪存活时，同阵位所有随从不会被冻结。",
    battlecry: { type: "freezeAllExceptOwnZone" }
  });
  Object.assign(CARDS.vein_oracle, {
    text: "引脉6：抽 1 张牌。",
    battlecry: null,
    keywords: [],
    veinTiers: [{ vein: 6, draw: 1 }]
  });
  Object.assign(CARDS.excavation_titan, {
    text: "登场：流脉 +2。 引脉4：获得 +2/+1。 引脉8：获得 +3/+2。",
    veinTiers: [{ vein: 4, attack: 2, health: 1 }, { vein: 8, attack: 3, health: 2 }]
  });
  Object.assign(CARDS.vein_heart, {
    text: "装备：每触发一次引脉，恢复你的领袖 2 点生命。"
  });
  Object.assign(CARDS.formation_standard, {
    text: "装备：使用过阵型卡的阵位上，所有随从固定获得 +1/+1。以任何方式来到该阵位的随从都会获得。"
  });
  Object.assign(CARDS.formation_vein, {
    text: "阵型：该阵位随从固定获得余响：恢复你的领袖 1 点生命。",
    formation: { attack: 0, health: 0, veinDeathrattle: true }
  });
  Object.assign(CARDS.coordination, {
    cost: 2,
    text: "使目标所在阵位的所有随从获得 +1/+1。",
    spell: { type: "buffZone", attack: 1, health: 1 }
  });
  Object.assign(CARDS.vein_scout, {
    text: "先遣。 引脉3：获得 +1/+0。",
    veinTiers: [{ vein: 3, attack: 1 }]
  });
  Object.assign(CARDS.resonance, {
    cost: 2,
    excavate: 2,
    text: "掘脉2：抽 2 张牌，流脉 +2。",
    spell: { type: "none" }
  });
  Object.assign(CARDS.insight, { text: "掘脉1：抽 1 张牌，流脉 +1；复制下一张获得的法术牌。", spell: { type: "drawCopyNextSpell", draw: 0 } });
  Object.assign(CARDS.recon, { text: "掘脉1：抽 1 张牌，流脉 +1。", spell: { type: "none" } });
  Object.assign(CARDS.vein_prospect, { text: "掘脉2：抽 2 张牌，流脉 +2。", spell: { type: "none" } });
  for (const id of ["vein_channeler","vein_sentinel","vein_bulwark","vein_surveyor","siphon_guard","vein_ward","overload_ritual","return_tide","formation_echo"]) {
    if (CARDS[id]) Object.assign(CARDS[id], { disabled: true });
  }
  // 阵位数值效果现在都是动态的：把旧文案里的“另一个”统一成“每有一个随从”
  for (const c of Object.values(CARDS)) {
    if (!c || !c.text || !c.zoneBonus || (!c.zoneBonus.attack && !c.zoneBonus.health)) continue;
    c.text = c.text.replace("若同阵位有另一个友方随从", "同阵位每有一个随从").replace("若同阵位有另一个友方随从", "同阵位每有一个随从");
    if (c.id === "courier") c.text = "阵位：同阵位每有一个其他随从，获得 +0/+1。";
    if (c.id === "guard") c.text = "阵位：同阵位每有一个其他随从，获得 +1/+0。 引脉4：获得 +1/+0。 引脉8：获得 +2/+0。";
    if (c.id === "timon") c.text = "登场：本回合你打出的下一张牌行动力消耗减少 1。 阵位：同阵位每有一个其他随从，获得 +0/+1。";
    if (c.id === "zone_keeper") c.text = "阵位：同阵位每有一个其他随从，获得 +2/+2。";
  }
  // 三人阵位后，不再使用“另一个”这种只能指代一个随从的措辞
  for (const c of Object.values(CARDS)) {
    if (!c || !c.text) continue;
    c.text = c.text.replace(/若同阵位有另一个友方随从/g, "若同阵位有其他友方随从")
      .replace(/若你控制另一个友方随从/g, "若你控制其他友方随从")
      .replace(/若你控制另一个随从/g, "若你控制其他随从")
      .replace(/每当另一个友方守备随从死亡/g, "每当其他友方守备随从死亡");
  }
  // 删除卡从普卫岛预组中移除，并补回 30 张带牌
  {
    const removed = new Set(["vein_channeler","vein_sentinel","vein_bulwark","vein_surveyor","siphon_guard","vein_ward","overload_ritual","return_tide","formation_echo"]);
    const keep = DECKS.pus.filter(id => !removed.has(id));
    const counts = {};
    for (const id of keep) counts[id] = (counts[id] || 0) + 1;
    const candidates = ["emergency","coordination","vein_scout","snow_medic","mist_scout","verious","medic_apprentice","vein_siphon","zone_keeper","fog_sailor"];
    let ci = 0;
    while (keep.filter(id => CARDS[id] && CARDS[id].type !== "relic").length < 30 && ci < 40) {
      const id = candidates[ci % candidates.length];
      const def = CARDS[id];
      if (def && (counts[id] || 0) < maxCopies(def)) { counts[id] = (counts[id] || 0) + 1; keep.splice(Math.max(0, keep.length - 1), 0, id); }
      ci++;
    }
    DECKS.pus = keep;
  }

  // ===== 2026-10-19 学院重做（用户指定） =====
  // 逆脉 N：消耗 N 点流脉来触发；流脉不足 N 时消耗到 0 仍触发；流脉为 0 时逆脉效果无效。
  // 冻结：不写“随机”的冻结一律为指定冻结；对方没有可冻结随从时冻结不触发，但随从照常落地。
  Object.assign(CARDS.spell_novice, {
    cost: 1, attack: 1, health: 3, reflux: 1,
    keywords: ["battlecry"], target: "none",
    battlecry: { type: "freeSpellTurn" },
    text: "逆脉1：本回合你的下一张法术不消耗行动力。"
  });
  Object.assign(CARDS.doorman, {
    cost: 1, attack: 1, health: 2, reflux: 1,
    keywords: ["battlecry"], target: "none", taunt: false, veinBonus: null,
    battlecry: { type: "gainMana", amount: 2 },
    text: "逆脉1：获得 2 点行动力。"
  });
  Object.assign(CARDS.formula_apprentice, { disabled: true });
  Object.assign(CARDS.nina, {
    cost: 2, attack: 4, health: 4, reflux: 1,
    keywords: ["battlecry"], target: "enemy", optionalTarget: true,
    battlecry: { type: "freezeZone" }, zoneBonus: null, mirrorBonus: null,
    text: "逆脉1：冻结目标所在阵位的所有敌方随从。"
  });
  Object.assign(CARDS.samuel, {
    cost: 2, attack: 3, health: 4,
    keywords: ["battlecry"], target: "none", zoneBonus: null,
    battlecry: { type: "randomFreeze" },
    text: "登场：随机冻结一名敌方随从。"
  });
  Object.assign(CARDS.zone_archivist, {
    cost: 3, attack: 2, health: 4,
    keywords: ["passive"], target: "none", battlecry: null,
    passive: { type: "deathRecordShot" },
    text: "被动：每当一个友方随从死亡，获得一张 0 行动力「记录弹」。"
  });
  Object.assign(CARDS.lecturer, {
    cost: 3, attack: 4, health: 4, reflux: 1,
    keywords: ["battlecry"], target: "none", deathrattle: null,
    battlecry: { type: "draw", amount: 1 },
    text: "逆脉1：抽 1 张牌。"
  });
  Object.assign(CARDS.justus, {
    cost: 3, attack: 4, health: 4, veinBonus: null,
    keywords: ["battlecry"], target: "none",
    battlecry: { type: "copyLowestSpell" },
    text: "登场：复制你手牌中行动力消耗最低的战术牌；若其消耗小于 5，复制两张。"
  });
  Object.assign(CARDS.arcane_conduit, {
    cost: 4, attack: 3, health: 5,
    keywords: ["passive"], target: "none",
    passive: { type: "spellDrawByCost" },
    text: "被动：每当你施放一张战术牌，抽等同于其行动力消耗的牌。"
  });
  Object.assign(CARDS.echo_adept, {
    cost: 4, attack: 3, health: 4, reflux: 2,
    keywords: ["battlecry"], target: "enemy", optionalTarget: true, passive: null,
    battlecry: { type: "freezeZoneGrowth", attack: 1, health: 1 },
    text: "逆脉2：冻结目标所在阵位的所有敌方随从；每冻结一个随从，获得 +1/+1。"
  });
  Object.assign(CARDS.karl_desmond, {
    cost: 4, attack: 4, health: 6,
    keywords: ["passive"], target: "none", battlecry: null,
    zoneBonus: null, mirrorBonus: null,
    passive: { type: "deathDiscoverSpell" },
    text: "被动：每当一个友方随从死亡，检索一张战术牌。"
  });
  Object.assign(CARDS.cassian, {
    cost: 5, attack: 4, health: 4,
    keywords: ["passive"], target: "none",
    passive: { type: "repeatLastSpell" },
    text: "被动：你的回合结束时，重复你最后使用的一张战术牌。"
  });
  Object.assign(CARDS.frost_professor, {
    cost: 5, attack: 4, health: 6, reflux: 3,
    keywords: ["battlecry", "passive"], target: "enemy", optionalTarget: true,
    battlecry: { type: "freeze" },
    passive: { type: "attackDestroyFrozen" },
    text: "逆脉3：冻结一个敌方随从。 被动：你攻击已被冻结的随从时，直接消灭该随从。"
  });
  Object.assign(CARDS.spell_echo, { cost: 3 });
  Object.assign(CARDS.formation_script, {
    cost: 3,
    formation: { attack: 0, health: 0, rush: true },
    text: "阵型：该阵位随从固定获得先遣。"
  });
  Object.assign(CARDS.formula_fix, {
    cost: 4,
    spell: { type: "damagePerMinionCount" },
    text: "对一个敌方随从造成等同于场上所有随从数量的伤害。"
  });
  Object.assign(CARDS.prohibition, { cost: 3 });
  Object.assign(CARDS.double_formula, {
    cost: 3, target: "none",
    spell: { type: "randomDamageUpgrade", amount: 2, bonus: 5 },
    text: "随机对一个敌方单位造成 2 点伤害；若本回合此前已施放过战术牌，改为 5 点。"
  });
  Object.assign(CARDS.combo_spark, { cost: 3 });
  Object.assign(CARDS.armor_break, {
    cost: 3, target: "none",
    spell: { type: "stripArmorToMana", amount: 5 },
    text: "移除敌方领袖至多 5 点护甲；每移除 1 点护甲，获得 1 点行动力。"
  });
  Object.assign(CARDS.arcane_surge, {
    cost: 4,
    spell: { type: "damageAllPerSpell", amount: 1 },
    text: "对所有敌方随从造成 1 点伤害；本回合你每施放过一张战术牌，伤害 +1。"
  });

  // ===== 2026-10-19 西昭重做（用户指定） =====
  // 压脉 N：流脉 ≥ N 时消耗 N 点流脉，对敌方领袖造成 N 点伤害；流脉不足 N 点则不触发。
  Object.assign(CARDS.tribal_warrior, {
    bloodCost: 2, zoneBonus: null,
    text: "血祭2：获得 +1/+1。"
  });
  Object.assign(CARDS.lanzhou, {
    keywords: ["battlecry", "stealth"], zoneBonus: null,
    text: "登场：召唤一个 1/1 洛斯汰魔物。 隐匿。"
  });
  Object.assign(CARDS.lize, {
    keywords: ["battlecry"], pressure: 2,
    battlecry: { type: "draw", amount: 1 },
    text: "登场：抽 1 张牌。 压脉2：消耗 2 点流脉，对敌方领袖造成 2 点伤害。"
  });
  Object.assign(CARDS.blood_imp, {
    keywords: ["lifesteal"], deathrattle: null,
    text: "血偿。"
  });
  Object.assign(CARDS.blood_acolyte, {
    keywords: ["battlecry"], bloodCost: 2,
    battlecry: { type: "bloodDamageAllEnemies", amount: 1 },
    text: "血祭2：对所有敌方随从造成 1 点伤害。"
  });
  Object.assign(CARDS.venom_fang, {
    keywords: ["poisonous", "lifesteal", "stealth"],
    text: "蚀毒。血偿。隐匿。"
  });
  Object.assign(CARDS.losutai_hunter, {
    keywords: ["deathrattle", "stealth"], zoneBonus: null, pressure: 1,
    text: "隐匿。 余响：对随机敌方单位造成 1 点伤害。 压脉1：消耗 1 点流脉，对敌方领袖造成 1 点伤害。"
  });
  Object.assign(CARDS.molan, {
    keywords: ["battlecry"], target: "none", zoneBonus: null, bloodCost: 1,
    battlecry: { type: "discoverMinionBloodBuff", attack: 2 },
    text: "登场：检索一张随从牌；血祭1：获得 +2 攻击。"
  });
  Object.assign(CARDS.blood_servant, {
    keywords: ["deathrattle", "lifesteal"], pressure: 1,
    text: "余响：使一个友方随从获得 +1 攻击。 血偿。 压脉1：消耗 1 点流脉，对敌方领袖造成 1 点伤害。"
  });
  Object.assign(CARDS.grayfeather, {
    keywords: ["battlecry"], target: "none", mirrorBonus: null, pressure: 1,
    battlecry: { type: "devourZoneAllies" },
    text: "登场：吞噬同阵位所有其他友方随从，获得其攻击力和生命值。 压脉1：消耗 1 点流脉，对敌方领袖造成 1 点伤害。"
  });
  Object.assign(CARDS.tiega, {
    bloodCost: 2,
    text: "先遣。血祭2：获得 +2 攻击。"
  });
  Object.assign(CARDS.blood_executor, {
    keywords: ["passive", "lifesteal"],
    text: "血偿。被动：每当一个其他友方随从死亡，获得 +1/+1。"
  });
  Object.assign(CARDS.brood_matron, {
    keywords: ["battlecry"], battlecry: { type: "summonCount", token: "losutai_imp", count: 2 },
    text: "登场：召唤两个 1/1 洛斯汰魔物。"
  });
  Object.assign(CARDS.rebirth_serpent, { disabled: true });
  Object.assign(CARDS.lanxi, {
    keywords: ["passive"], target: "none", battlecry: null, veinBonus: null, pressure: 2,
    passive: { type: "impGrowth", attack: 1, health: 1 },
    text: "压脉2：消耗 2 点流脉，对敌方领袖造成 2 点伤害。 被动：场上每有一个洛斯汰魔物，获得 +1/+1。"
  });
  Object.assign(CARDS.blood_priestess, {
    keywords: ["battlecry", "lifesteal"],
    battlecry: { type: "devourLowestHealth" },
    text: "登场：吞噬生命值最低的友方随从，获得其攻击力和生命值。 血偿。"
  });
  Object.assign(CARDS.losutai_matriarch, {
    keywords: ["battlecry"], deathrattle: null,
    battlecry: { type: "summonCount", token: "losutai_imp", count: 2 },
    text: "登场：召唤两个 1/1 洛斯汰魔物。"
  });
  Object.assign(CARDS.tide_colossus, {
    keywords: ["battlecry", "lifesteal", "stealth"], bloodCost: 3, pressure: 1,
    battlecry: { type: "devourBloodBuff", attack: 2, health: 2 },
    text: "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值；血祭3：获得 +2/+2。 血偿。 隐匿。 压脉1：消耗 1 点流脉，对敌方领袖造成 1 点伤害。"
  });
  Object.assign(CARDS.formation_tide, {
    formation: { attack: 0, health: 0, lifesteal: true, stealth: true },
    text: "阵型：该阵位所有随从固定获得血偿和隐匿。"
  });
  Object.assign(CARDS.blood_censer, {
    text: "装备：你的回合开始时，对场上随机一个随从（不分敌我）造成 1 点伤害；若它存活，你抽 1 张牌。"
  });
  Object.assign(CARDS.shadow_raid, {
    spell: { type: "buffStealth", attack: 2 },
    text: "使一个友方随从获得 +2 攻击和隐匿。"
  });
  Object.assign(CARDS.reflux, {
    cost: 2, pressure: 3, spell: { type: "healHero", amount: 3 },
    text: "压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害；恢复你的领袖 3 点生命。"
  });
  Object.assign(CARDS.blood_path, {
    spell: { type: "buffLifesteal", attack: 1 },
    text: "使一个友方随从获得 +1 攻击和血偿。"
  });
  Object.assign(CARDS.blood_pact, {
    cost: 2, target: "friendly", spell: { type: "bloodGrant", health: 3 },
    text: "支付 3 点生命，使一个友方随从获得血偿和隐匿。"
  });
  Object.assign(CARDS.monster_summon, {
    cost: 5, pressure: 1, spell: { type: "summonMonster", doubleIfZoneEmpty: true },
    text: "召唤一个 3/3 洛斯汰巨兽；若其阵位没有其他随从，再召唤一个 3/3 洛斯汰巨兽。 压脉1：消耗 1 点流脉，对敌方领袖造成 1 点伤害。"
  });
  Object.assign(CARDS.pressure_vein, {
    pressure: 3, spell: { type: "none" },
    text: "压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害。"
  });

  // ===== 2026-10-19 共和国重做（用户指定） =====
  Object.assign(CARDS, {
    republic_recruit: {
      id: "republic_recruit", name: "共和国新兵", faction: "republic", type: "minion",
      cost: 0, attack: 1, health: 1, rarity: "token", art: null, noGeneratedArt: false, noArtwork: false,
      token: true, keywords: [], target: "none", text: ""
    }
  });
  Object.assign(CARDS.bulwark_sentry, {
    keywords: ["taunt", "reborn"],
    text: "守备。回潮。"
  });
  Object.assign(CARDS.shield_recruit, {
    keywords: ["taunt"], mirrorBonus: { attack: 1 },
    text: "守备。 对位：若敌方对位阵位有随从，获得 +1/+0。"
  });
  Object.assign(CARDS.republic_guard, {
    keywords: ["taunt", "deathrattle"], zoneBonus: null, mirrorBonus: { health: 1 },
    deathrattle: { type: "damageRandomMinion", amount: 2 },
    text: "余响：对随机一个敌方随从造成 2 点伤害。 对位：若敌方对位阵位有随从，生命值 +1。"
  });
  Object.assign(CARDS.shield_bearer, {
    keywords: ["battlecry"], target: "none", zoneBonus: null,
    battlecry: { type: "comboTauntGrowth", health: 1 },
    text: "顺势：本回合你每打出一个友方守备随从，获得 +0/+1。"
  });
  Object.assign(CARDS.elena, {
    keywords: ["battlecry"], target: "none", deathrattle: null,
    battlecry: { type: "mirrorSummon", token: "republic_recruit" },
    text: "登场：若敌方对位阵位有随从，召唤一个 1/1 的共和国新兵。"
  });
  Object.assign(CARDS.erhardt, {
    keywords: ["charge", "reborn", "battlecry"], zoneBonus: null,
    battlecry: { type: "comboDeathGrowth", attack: 1, health: 1 },
    text: "先遣。回潮。 顺势：本回合场上每死亡一个随从，获得 +1/+1。"
  });
  Object.assign(CARDS.beatrix, {
    veinBonus: null,
    keywords: ["battlecry"], target: "friendly",
    battlecry: { type: "grantReborn" },
    text: "登场：使一个友方随从获得回潮。"
  });
  Object.assign(CARDS.shield_sergeant, {
    keywords: ["taunt", "deathrattle"], battlecry: null,
    deathrattle: { type: "buffAllTaunt", health: 1 },
    text: "守备。余响：所有友方守备随从获得 +0/+1。"
  });
  Object.assign(CARDS.phalanx_warden, {
    keywords: ["taunt", "deathrattle"], battlecry: null,
    deathrattle: { type: "buffAllAllies", health: 1 },
    mirrorBonus: { health: 2 },
    text: "守备。余响：所有友方随从获得 +0/+1。 对位：若敌方对位阵位有随从，获得 +0/+2。"
  });
  Object.assign(CARDS.phalanx_executor, {
    keywords: ["passive"], mirrorBonus: { draw: 1 },
    text: "被动：每当另一个友方守备随从死亡，抽 1 张牌。 对位：若敌方对位阵位有随从，再抽 1 张牌。"
  });
  Object.assign(CARDS.konrad, {
    keywords: ["battlecry"], target: "friendly", passive: null, veinBonus: null,
    battlecry: { type: "grantDeathrattleDamage", amount: 1 },
    mirrorBonus: { summon: "republic_recruit" },
    text: "登场：使一个友方随从获得余响：对随机一个敌方随从造成 1 点伤害。 对位：若敌方对位阵位有随从，召唤一个 1/1 的共和国新兵。"
  });
  Object.assign(CARDS.iron_phalanx, {
    keywords: ["taunt", "battlecry", "deathrattle"],
    battlecry: { type: "comboMinionGrowth", attack: 1, health: 1 },
    deathrattle: { type: "damageAllEnemyUnits", amount: 1 },
    text: "守备。顺势：本回合你每使用一个随从，获得 +1/+1。 余响：对敌方所有单位造成 1 点伤害。"
  });
  Object.assign(CARDS.shield_marshal, {
    cost: 7, passive: null, keywords: ["taunt", "reborn", "deathrattle", "battlecry"],
    battlecry: { type: "shieldMarshal", attack: 1, health: 1 },
    deathrattle: { type: "summon", token: "republic_recruit", count: 2 },
    text: "守备。回潮。余响：召唤两个 1/1 的共和国新兵。 顺势：本回合你每召唤一个共和国新兵，获得 +1/+1。 对位：若敌方对位阵位没有随从，召唤一个 1/1 的共和国新兵。"
  });
  Object.assign(CARDS.formation_wall, {
    formation: { attack: 0, health: 0, deathrattleSummon: "republic_recruit", summonOnPlay: "republic_recruit" },
    text: "阵型：该阵位所有友方随从获得余响：召唤一个 1/1 的共和国新兵。布置时在该阵位召唤一个 1/1 的共和国新兵。"
  });
  Object.assign(CARDS.emergency_bill, {
    target: "enemy", target2: "friendly",
    spell: { type: "freezeGrantReborn" },
    text: "冻结一个敌方随从；使一个友方随从获得回潮。"
  });
  Object.assign(CARDS.stabilize, { disabled: true });
  Object.assign(CARDS.fortify, {
    target: "friendly", spell: { type: "grantDeathrattleDamage", amount: 2 },
    text: "使一个友方随从获得余响：对随机一个敌方随从造成 2 点伤害。"
  });
  Object.assign(CARDS.anti_rush, {
    spell: { type: "drawIfEnemyNoMinions" },
    text: "抽 1 张牌；若敌方场上没有随从，再抽 1 张牌。"
  });
  Object.assign(CARDS.levy, {
    cost: 2, spell: { type: "nextTurnMana", amount: 3 },
    text: "下回合开始时获得 3 点行动力。"
  });
  Object.assign(CARDS.martial_law, {
    cost: 7, spell: { type: "tauntRebornAll" },
    text: "使场上所有随从获得守备与回潮。"
  });

  // ===== 2026-10-19 帝国重做（用户指定） =====
  // 镇脉 N：消耗 N 点流脉，获得等量护甲；流脉不足 N 时只获得剩余流脉的护甲并清零。
  // 反噬 N：下回合开始行动力减少 N。
  Object.assign(CARDS.powder_boy, {
    keywords: ["charge"], deathrattle: null,
    text: "先遣。"
  });
  Object.assign(CARDS.empire_guard, {
    keywords: ["battlecry"], target: "none", taunt: false, veinBonus: null, zhenmai: 1,
    text: "镇脉1：消耗 1 点流脉，获得等量护甲。"
  });
  Object.assign(CARDS.mia, {
    keywords: ["battlecry", "deathrattle"], target: "none",
    battlecry: { type: "draw", amount: 1 },
    text: "登场：抽 1 张牌。 余响：抽 1 张牌。"
  });
  Object.assign(CARDS.iron_mechanic, {
    cost: 3, keywords: ["windfury", "charge"], deathrattle: null,
    text: "连携。先遣。"
  });
  Object.assign(CARDS.elsa, {
    cost: 3, attack: 2, health: 2, keywords: ["windfury", "battlecry"], target: "none",
    zhenmai: 2, deathrattle: null, zoneBonus: null,
    text: "镇脉2：消耗 2 点流脉，获得等量护甲。 连携。"
  });
  Object.assign(CARDS.powder_keg, {
    type: "spell", attack: undefined, health: undefined, keywords: [], target: "none",
    deathrattle: null, passive: null,
    spell: { type: "damageAllMinions", amount: 5 },
    text: "对所有随从造成 5 点伤害。"
  });
  Object.assign(CARDS.klaus, {
    keywords: ["taunt", "battlecry", "charge"], overload: 1,
    text: "守备。先遣。反噬 1。 登场：场上每有一个其他随从（不分敌我），获得 +1/+1。"
  });
  Object.assign(CARDS.ironclad, {
    keywords: ["charge"], zoneBonus: null,
    text: "先遣。"
  });
  Object.assign(CARDS.rush_lancer, {
    keywords: [],
    text: "造成伤害时，获得等量护甲。"
  });
  Object.assign(CARDS.siege_captain, {
    zhenmai: 1,
    text: "登场：对所有敌方随从造成 1 点伤害。 镇脉1：消耗 1 点流脉，获得等量护甲。"
  });
  Object.assign(CARDS.gunther, {
    keywords: ["taunt", "battlecry", "windfury"],
    text: "守备。连携。 登场：获得 4 点护甲。"
  });
  Object.assign(CARDS.karl_schwarz, {
    cost: 3, health: 4, overload: 1, zoneBonus: null,
    text: "先遣。反噬 1。"
  });
  Object.assign(CARDS.secret_police, { disabled: true });
  Object.assign(CARDS.wind_cannon, {
    zhenmai: 1,
    text: "连携。 镇脉1：消耗 1 点流脉，获得等量护甲。"
  });
  Object.assign(CARDS.powder_marshal, {
    keywords: ["battlecry", "charge"],
    text: "先遣。 登场：获得 5 点护甲。"
  });
  Object.assign(CARDS.iron_artillery, {
    keywords: ["battlecry", "charge"],
    text: "先遣。 登场：对一个敌方随从造成等同于你护甲的伤害。"
  });
  Object.assign(CARDS.siege_train, {
    keywords: ["battlecry", "windfury"],
    text: "连携。 登场：对所有敌方随从造成 3 点伤害。"
  });
  Object.assign(CARDS.formation_cannon, {
    formation: { attack: 0, health: 0, charge: true },
    text: "阵型：该阵位所有随从固定获得先遣。"
  });
  Object.assign(CARDS.pressure_vein, { disabled: true });
  Object.assign(CARDS.fortress, {
    cost: 3, spell: { type: "buffWindfury" },
    text: "使一个友方随从获得连携。"
  });
  Object.assign(CARDS.quarantine, {
    target: "none", spell: { type: "blockHeroPower" },
    text: "下回合敌方领袖不能使用技能。"
  });
  Object.assign(CARDS.martial_court, {
    spell: { type: "armorPerEnemy", amount: 2 },
    text: "每有一个敌方单位（包括领袖），获得 2 点护甲。"
  });

  // ===== 2026-10-19 第六阵营：灰港同盟（悬赏名单） =====
  // 悬赏名单：被列入名单的敌方随从死亡时，名单主人抽 1 张牌；莫纳克额外获得 1 点护甲。
  Object.assign(CARDS.monarch, { disabled: true });
  Object.assign(HEROES.monarch, { hp: 30 });
  Object.assign(CARDS, {
    gh_cutthroat: {
      id: "gh_cutthroat", name: "灰港小刀手", faction: "greyharbor", type: "minion",
      cost: 1, attack: 1, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["rush"], target: "none", text: "先遣。",
      flavor: "第一刀不求致命，只求见血。"
    },
    gh_venom_apprentice: {
      id: "gh_venom_apprentice", name: "毒行学徒", faction: "greyharbor", type: "minion",
      cost: 1, attack: 1, health: 1, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["poisonous"], target: "none", text: "蚀毒。",
      flavor: "毒要抹在刀刃不反光的那一面。"
    },
    gh_contract_squire: {
      id: "gh_contract_squire", name: "契约行侍从", faction: "greyharbor", type: "minion",
      cost: 1, attack: 1, health: 1, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["divineShield"], target: "none", text: "格挡。",
      flavor: "合同就是合同，签了就不能改。"
    },
    gh_bounty_notice: {
      id: "gh_bounty_notice", name: "悬赏告示", faction: "greyharbor", type: "spell",
      cost: 1, rarity: "common", art: null, noGeneratedArt: true, target: "enemy",
      text: "将一个敌方随从列入悬赏名单。",
      flavor: "钉在灰港每一根灯柱上的，都是价格。",
      spell: { type: "markBounty" }
    },
    gh_silencer: {
      id: "gh_silencer", name: "封口行员", faction: "greyharbor", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：沉默一个敌方随从。",
      flavor: "他从不杀人，只让死人安静。",
      battlecry: { type: "silence" }
    },
    gh_poison_thrower: {
      id: "gh_poison_thrower", name: "毒刃投手", faction: "greyharbor", type: "minion",
      cost: 2, attack: 2, health: 1, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["poisonous"], target: "none", text: "蚀毒。",
      flavor: "距离越远，谈判越有诚意。"
    },
    gh_rush_archer: {
      id: "gh_rush_archer", name: "先遣弓手", faction: "greyharbor", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["rush"], target: "none", text: "先遣。",
      flavor: "先射一箭，再考虑站在哪边。"
    },
    gh_bounty_hunter: {
      id: "gh_bounty_hunter", name: "悬赏行赏金客", faction: "greyharbor", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：将一个敌方随从列入悬赏名单。",
      flavor: "先把名字写下来，再谈价钱。",
      battlecry: { type: "markBounty" }
    },
    gh_bodyguard_contract: {
      id: "gh_bodyguard_contract", name: "替身契约", faction: "greyharbor", type: "spell",
      cost: 2, rarity: "common", art: null, noGeneratedArt: true, target: "friendly",
      text: "使一个友方随从获得格挡。",
      flavor: "合同背面写着：替死一次，价另算。",
      spell: { type: "grantDivineShield" }
    },
    gh_quick_strike: {
      id: "gh_quick_strike", name: "先手突袭", faction: "greyharbor", type: "spell",
      cost: 2, rarity: "common", art: null, noGeneratedArt: true, target: "friendly",
      text: "使一个友方随从获得 +1 攻击和先遣。",
      flavor: "规矩是给讲规矩的人定的。",
      spell: { type: "grantRushBuff", attack: 1 }
    },
    gh_venom_shield: {
      id: "gh_venom_shield", name: "毒盾刺客", faction: "greyharbor", type: "minion",
      cost: 3, attack: 2, health: 2, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["divineShield", "poisonous"], target: "none", text: "格挡。蚀毒。",
      flavor: "挡下第一击，第二击交给毒。"
    },
    gh_silence_expert: {
      id: "gh_silence_expert", name: "封口行专家", faction: "greyharbor", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "enemy",
      text: "登场：沉默一个敌方随从；若它是悬赏目标，抽 1 张牌。",
      flavor: "整条街安静下来，生意就谈成了。",
      battlecry: { type: "silenceIfBountyDraw" }
    },
    gh_shield_mercenary: {
      id: "gh_shield_mercenary", name: "格挡行佣兵", faction: "greyharbor", type: "minion",
      cost: 3, attack: 3, health: 4, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["divineShield"], target: "none", text: "格挡。",
      flavor: "格挡行不卖命，卖活着离开。"
    },
    gh_ledger: {
      id: "gh_ledger", name: "账房账簿", faction: "greyharbor", type: "spell",
      cost: 3, rarity: "rare", art: null, noGeneratedArt: true, target: "none",
      text: "抽 2 张牌；若你完成过悬赏，再抽 1 张。",
      flavor: "这是宪法，也是账单。",
      spell: { type: "drawIfBountyClaimed", draw: 2, bonus: 1 }
    },
    gh_assassinate_contract: {
      id: "gh_assassinate_contract", name: "刺杀契约", faction: "greyharbor", type: "spell",
      cost: 3, rarity: "rare", art: null, noGeneratedArt: true, target: "enemy",
      text: "对一个敌方随从造成 4 点伤害；若它是悬赏目标，改为消灭。",
      flavor: "名单上的人，价格是要打折的。",
      spell: { type: "damageOrDestroyBounty", amount: 4 }
    },
    gh_black_market: {
      id: "gh_black_market", name: "黑市街交易", faction: "greyharbor", type: "spell",
      cost: 3, rarity: "common", art: null, noGeneratedArt: true, target: "enemy",
      text: "抽 2 张牌；将一个敌方随从列入悬赏名单。",
      flavor: "黑市街是灰港的第三条国界。",
      spell: { type: "drawMark", draw: 2 }
    },
    gh_legend_assassin: {
      id: "gh_legend_assassin", name: "契约行刺客", faction: "greyharbor", type: "minion",
      cost: 4, attack: 3, health: 3, rarity: "legendary", art: null, noGeneratedArt: true,
      keywords: ["rush", "poisonous"], target: "none", text: "先遣。蚀毒。",
      flavor: "合同背面写着：替死一次，价另算。"
    },
    gh_silence_field: {
      id: "gh_silence_field", name: "沉默领域", faction: "greyharbor", type: "spell",
      cost: 4, rarity: "rare", art: null, noGeneratedArt: true, target: "none",
      text: "沉默所有敌方随从。",
      flavor: "整条街突然安静下来，说明生意谈成了。",
      spell: { type: "silenceAll" }
    },
    gh_shield_broker: {
      id: "gh_shield_broker", name: "格挡行掮客", faction: "greyharbor", type: "minion",
      cost: 4, attack: 4, health: 4, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["divineShield"], target: "none", text: "格挡。",
      flavor: "护身是灰港最贵的商品。"
    },
    gh_execution_contract: {
      id: "gh_execution_contract", name: "处刑契约", faction: "greyharbor", type: "spell",
      cost: 4, rarity: "epic", art: null, noGeneratedArt: true, target: "none",
      text: "消灭悬赏名单上的敌方随从；若名单为空，抽 1 张牌。",
      flavor: "违约的代价，通常由别人承担。",
      spell: { type: "destroyBounty", fallbackDraw: 1 }
    },
    gh_bounty_collector: {
      id: "gh_bounty_collector", name: "悬赏行猎手", faction: "greyharbor", type: "minion",
      cost: 4, attack: 4, health: 4, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["rush"], target: "none",
      text: "先遣。被动：每完成一次悬赏，获得 +1/+1。",
      flavor: "名单上的字越少，价格越高。",
      passive: { type: "bountyClaimGrowth", attack: 1, health: 1 }
    },
    gh_scorpion: {
      id: "gh_scorpion", name: "巨蝎", faction: "greyharbor", type: "minion",
      cost: 5, attack: 4, health: 4, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["divineShield", "poisonous"], target: "none", text: "格挡。蚀毒。",
      flavor: "灰港的蝎子有两层壳，和一根尾巴。"
    },
    gh_captain: {
      id: "gh_captain", name: "断线团头目", faction: "greyharbor", type: "minion",
      cost: 5, attack: 5, health: 5, rarity: "legendary", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "登场：使所有友方随从获得先遣。",
      flavor: "断线团不守防线，只问几点回来交账。",
      battlecry: { type: "grantRushAll" }
    },
    gh_silence_master: {
      id: "gh_silence_master", name: "封口行大师", faction: "greyharbor", type: "minion",
      cost: 5, attack: 5, health: 5, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "登场：沉默所有敌方随从。",
      flavor: "死人不需要名字。",
      battlecry: { type: "silenceAllEnemies" }
    },
    gh_bounty_verdict: {
      id: "gh_bounty_verdict", name: "赏金清算", faction: "greyharbor", type: "spell",
      cost: 5, rarity: "epic", art: null, noGeneratedArt: true, target: "none",
      text: "消灭悬赏名单上的敌方随从；对敌方领袖造成 5 点伤害；若名单为空，抽 1 张牌。",
      flavor: "账本合上的时候，价码就变成结论。",
      spell: { type: "bountyVerdict", damage: 5, fallbackDraw: 1 }
    },
    gh_company: {
      id: "gh_company", name: "断线团团长", faction: "greyharbor", type: "minion",
      cost: 6, attack: 6, health: 6, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "登场：随机将两个敌方随从列入悬赏名单。",
      flavor: "名单越长，活越少，钱越多。",
      battlecry: { type: "markRandomBounties", count: 2 }
    },
    gh_venom_behemoth: {
      id: "gh_venom_behemoth", name: "毒潮巨兽", faction: "greyharbor", type: "minion",
      cost: 7, attack: 6, health: 6, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["rush", "poisonous"], target: "none", text: "先遣。蚀毒。",
      flavor: "它从灰港的排污口爬上来，身上挂着旧账。"
    },
    gh_bounty_king: {
      id: "gh_bounty_king", name: "赏金王", faction: "greyharbor", type: "minion",
      cost: 8, attack: 7, health: 7, rarity: "legendary", art: null, noGeneratedArt: true,
      keywords: [], target: "none",
      text: "被动：每完成一次悬赏，对敌方领袖造成 2 点伤害。",
      flavor: "灰港没有王，除非你把所有人都买了。",
      passive: { type: "bountyClaimDamage", amount: 2 }
    },
    gh_formation: {
      id: "gh_formation", name: "潜伏阵线", faction: "greyharbor", type: "formation",
      cost: 3, rarity: "rare", art: null, noGeneratedArt: true, target: "none",
      text: "阵型：该阵位所有友方随从获得先遣。",
      flavor: "灰港不设防线，只设伏击点。",
      formation: { attack: 0, health: 0, rush: true }
    },
    gh_bounty_board: {
      id: "gh_bounty_board", name: "悬赏榜", faction: "greyharbor", type: "relic",
      cost: 3, rarity: "legendary", art: null, noGeneratedArt: true, target: "none",
      text: "装备：每当你完成一次悬赏，额外抽 1 张牌。",
      flavor: "榜单每天换一版，只有最上面那行不变。"
    },
    gh_venom_vial: {
      id: "gh_venom_vial", name: "淬毒瓶", faction: "greyharbor", type: "relic",
      cost: 3, rarity: "epic", art: null, noGeneratedArt: true, target: "none",
      text: "装备：你的蚀毒随从获得 +1 攻击。",
      flavor: "瓶口封着蜡，蜡上有牙印。"
    }
  });

  // 新阵营的卡牌定义在文件末尾，预组需要在这里手动修剪为 31 张（30 主卡 + 1 装备）。
  {
    const list = DECKS.greyharbor || [];
    let removed = false;
    DECKS.greyharbor = list.filter((id) => {
      if (!removed && CARDS[id] && CARDS[id].type === "relic" && id !== "gh_bounty_board") { removed = true; return false; }
      return true;
    });
  }

  // ===== 2026-10-19 五阵营流派补强（新增 15 张） =====
  Object.assign(CARDS, {
    /* 普卫岛：阵位 / 阵型 / 流脉 / 恢复 */
    spring_medic: {
      id: "spring_medic", name: "涌泉医师", faction: "pus", type: "minion",
      cost: 3, attack: 2, health: 4, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "登场：恢复所有友方随从 2 点生命。",
      flavor: "她背着的不是药箱，是一口会走路的泉。",
      battlecry: { type: "healAllAllies", amount: 2 }
    },
    vein_foreman: {
      id: "vein_foreman", name: "掘脉工头", faction: "pus", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none",
      text: "掘脉1；登场：抽 1 张牌。",
      flavor: "他挖到的第一块脉晶，现在镶在安全帽上。",
      excavate: 1,
      battlecry: { type: "draw", amount: 1 }
    },
    formation_bastion: {
      id: "formation_bastion", name: "磐石阵线", faction: "pus", type: "formation",
      cost: 4, rarity: "rare", art: null, noGeneratedArt: true, target: "none",
      text: "阵型：该阵位随从固定获得 +0/+2 与守备。",
      flavor: "阵线不需要喊口号，站住就行。",
      formation: { attack: 0, health: 2, taunt: true }
    },
    /* 学院：逆脉 / 冻结 / 法术 / 被动 */
    reflux_apprentice: {
      id: "reflux_apprentice", name: "逆脉学徒", faction: "academy", type: "minion",
      cost: 2, attack: 2, health: 3, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["battlecry"], target: "none", reflux: 1,
      text: "逆脉1：若本回合你施放过战术牌，抽 2 张牌。",
      flavor: "别人背书，她背的是水位线。",
      battlecry: { type: "spellDraw", draw: 2 }
    },
    frost_scribe: {
      id: "frost_scribe", name: "霜印书记", faction: "academy", type: "spell",
      cost: 2, rarity: "rare", art: null, noGeneratedArt: true, target: "enemy", reflux: 1,
      text: "逆脉1：冻结一个敌方随从并抽 1 张牌。",
      flavor: "她记下的每一笔，都要先冻住再落墨。",
      spell: { type: "freezeDraw", draw: 1 }
    },
    echo_observer: {
      id: "echo_observer", name: "回响观测者", faction: "academy", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "epic", art: null, noGeneratedArt: true,
      keywords: ["passive"], target: "none",
      text: "被动：每回合你第一次施放战术牌后，随机冻结一个敌方随从。",
      flavor: "他不记录法术，只记录法术留下的霜。",
      passive: { type: "spellFreezeOnce" }
    },
    /* 西昭：血祭 / 吞噬 / 血偿 / 隐匿 / 压脉 */
    blood_duelist: {
      id: "blood_duelist", name: "血祭刀客", faction: "xizhao", type: "minion",
      cost: 2, attack: 3, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["charge", "battlecry"], target: "none", bloodCost: 1,
      battlecry: { type: "bloodAttack", amount: 2 },
      text: "先遣。血祭1：获得 +2 攻击。",
      flavor: "他出刀前先割自己，只为让刀更快一点。"
    },
    blood_wraith: {
      id: "blood_wraith", name: "噬血幽魂", faction: "xizhao", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["lifesteal", "stealth"], target: "none", pressure: 1,
      text: "血偿。隐匿。 压脉1：消耗 1 点流脉，对敌方领袖造成 1 点伤害。",
      flavor: "被它舔过的伤口，不会流血，只会发冷。"
    },
    blood_pool: {
      id: "blood_pool", name: "血池献祭", faction: "xizhao", type: "spell",
      cost: 4, rarity: "rare", art: null, noGeneratedArt: true, target: "friendly",
      text: "消灭一个友方随从，恢复你的领袖等同于其生命值的生命，并抽 1 张牌。",
      flavor: "池子从不挑剔，它只是等着有人先迈一步。",
      spell: { type: "sacrificeHealDraw", draw: 1 }
    },
    /* 共和国：守备 / 余响 / 回潮 / 顺势 / 对位 */
    line_spearman: {
      id: "line_spearman", name: "列阵枪兵", faction: "republic", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["taunt", "deathrattle"], target: "none",
      text: "守备。余响：召唤一个 1/1 的共和国新兵。",
      flavor: "倒下时，他的枪还指着前面。",
      deathrattle: { type: "summon", token: "republic_recruit", count: 1 }
    },
    combo_shield: {
      id: "combo_shield", name: "顺势盾击", faction: "republic", type: "spell",
      cost: 2, rarity: "rare", art: null, noGeneratedArt: true, target: "friendly",
      text: "使一个友方随从获得 +0/+2 与守备；顺势：改为 +0/+4 与守备。",
      flavor: "第一下是挡，第二下才是推。",
      spell: { type: "comboBuffTaunt", health: 2, bonusHealth: 4 }
    },
    reborn_sentry: {
      id: "reborn_sentry", name: "回潮哨卫", faction: "republic", type: "minion",
      cost: 3, attack: 2, health: 3, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["reborn"], target: "none", mirrorBonus: { attack: 1 },
      text: "回潮。 对位：若敌方对位阵位有随从，获得 +1/+0。",
      flavor: "他倒下过一次，所以知道该在哪里重新站起来。"
    },
    /* 帝国：护甲 / 镇脉 / 反噬 / 连携 / 先遣 */
    zhenmai_artisan: {
      id: "zhenmai_artisan", name: "镇脉工匠", faction: "empire", type: "minion",
      cost: 2, attack: 2, health: 2, rarity: "common", art: null, noGeneratedArt: true,
      keywords: ["windfury"], target: "none", zhenmai: 1,
      text: "镇脉1：消耗 1 点流脉，获得等量护甲。 连携。",
      flavor: "他给炮管上脉纹，就像给别人上发条。"
    },
    overload_gunner: {
      id: "overload_gunner", name: "泄压炮手", faction: "empire", type: "minion",
      cost: 3, attack: 3, health: 3, rarity: "rare", art: null, noGeneratedArt: true,
      keywords: ["charge"], target: "none", overload: 1,
      passive: { type: "damageToArmor" },
      text: "先遣。反噬 1。造成伤害时，获得等量护甲。",
      flavor: "他从不问这一炮会不会把自己也震伤。"
    },
    armor_drive: {
      id: "armor_drive", name: "装甲动员", faction: "empire", type: "spell",
      cost: 2, rarity: "common", art: null, noGeneratedArt: true, target: "none",
      text: "获得 3 点护甲；若你已有护甲，再获得 2 点护甲。",
      flavor: "钢板不会自己走过来，但命令会。",
      spell: { type: "armorIfArmored", amount: 3, bonus: 2 }
    }
  });

  // ===== 2026-10-19 关键词一致性修复 + 中立收尾 =====
  // 修复：血祭侍从残留的旧余响（文本与关键词早已移除）
  Object.assign(CARDS.blood_acolyte, { deathrattle: null });
  // 修复：帝国卫兵仍生效的对位护甲，补回卡面
  Object.assign(CARDS.empire_guard, {
    text: "镇脉1：消耗 1 点流脉，获得等量护甲。 对位：若敌方对位阵位有随从，获得 1 点护甲。"
  });
  // 修复：瓦尔特残留的引脉字段（卡面与指定改动都没有引脉）
  Object.assign(CARDS.walter, { veinBonus: null });
  // 修复：共和国卫兵关键词有守备，卡面补回
  Object.assign(CARDS.republic_guard, {
    text: "守备。余响：对随机一个敌方随从造成 2 点伤害。 对位：若敌方对位阵位有随从，生命值 +1。"
  });
  // 修复：终末钟声原实现会命中双方领袖，卡面改为“所有单位”
  Object.assign(CARDS.final_bell, {
    text: "对所有单位造成 5 点伤害。",
    spell: { type: "damageAll", amount: 5 }
  });
  // 中立差异化：让同效果卡各自有定位
  Object.assign(CARDS.field_engineer, {
    keywords: ["taunt", "deathrattle"],
    text: "守备。余响：获得 2 点护甲。"
  });
  Object.assign(CARDS.sim_assistant, {
    deathrattle: { type: "buffAllAllies", health: 1 },
    text: "余响：所有友方随从获得 +0/+1。"
  });
  Object.assign(CARDS.chrono_scholar, {
    keywords: ["deathrattle", "windfury"],
    text: "连携。余响：抽 1 张牌。"
  });
  Object.assign(CARDS.archive_devourer, {
    keywords: ["battlecry", "deathrattle"], target: "none",
    battlecry: { type: "devour" },
    text: "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。 余响：抽 1 张牌。"
  });
  Object.assign(CARDS.mist_hound, {
    keywords: ["charge", "reborn"],
    text: "先遣。回潮。"
  });
  Object.assign(CARDS.supply_cache, { cost: 1 });

  // 中立重名/文本一致性
  Object.assign(CARDS.bounty_hunter, { name: "赏金客" });
  Object.assign(CARDS.rush_lancer, { text: "被动：造成伤害时，获得等量护甲。" });

  // 新阵营暂无卡图：跳过卡图请求，使用阵营通用图，避免 404。
  for (const id of [
    "gh_cutthroat", "gh_venom_apprentice", "gh_contract_squire", "gh_bounty_notice",
    "gh_silencer", "gh_poison_thrower", "gh_rush_archer", "gh_bounty_hunter",
    "gh_bodyguard_contract", "gh_quick_strike", "gh_venom_shield", "gh_silence_expert",
    "gh_shield_mercenary", "gh_ledger", "gh_assassinate_contract", "gh_black_market",
    "gh_legend_assassin", "gh_silence_field", "gh_shield_broker", "gh_execution_contract",
    "gh_bounty_collector", "gh_scorpion", "gh_captain", "gh_silence_master",
    "gh_bounty_verdict", "gh_company", "gh_venom_behemoth", "gh_bounty_king",
    "gh_formation", "gh_bounty_board", "gh_venom_vial",
    "vein_foreman", "spring_medic", "formation_bastion",
    "reflux_apprentice", "frost_scribe", "echo_observer"
  ]) {
    if (CARDS[id]) CARDS[id].noArtwork = true;
  }

  Object.assign(CARDS, {
    vein_echo: {
      id: "vein_echo", name: "地脉回响", faction: "pus", type: "spell",
      cost: 2, rarity: "common", art: null, noGeneratedArt: true, target: "none",
      text: "恢复你的领袖 3 点生命；流脉 +2；若流脉达到 7，抽 1 张牌。",
      flavor: "地脉翻身的时候，整座城都听见了。",
      spell: { type: "healVeinDrawAt", heal: 3, vein: 2, threshold: 7, draw: 1 }
    }
  });

  // ===== 灰港同盟数值调整：只改费用 / 攻击 / 生命，不改机制 =====
  // 第一轮：整体提高 1~2 点身材，降低三张条件法术的费用。
  Object.assign(CARDS.gh_contract_squire, { health: 2 });
  Object.assign(CARDS.gh_silencer, { health: 3 });
  Object.assign(CARDS.gh_poison_thrower, { health: 2 });
  Object.assign(CARDS.gh_bounty_hunter, { attack: 3 });
  Object.assign(CARDS.gh_venom_shield, { attack: 3, health: 3 });
  Object.assign(CARDS.gh_silence_expert, { health: 4 });
  Object.assign(CARDS.gh_shield_mercenary, { health: 5 });
  Object.assign(CARDS.gh_legend_assassin, { attack: 4, health: 4 });
  Object.assign(CARDS.gh_shield_broker, { health: 5 });
  Object.assign(CARDS.gh_bounty_collector, { health: 5 });
  Object.assign(CARDS.gh_scorpion, { attack: 5, health: 5 });
  Object.assign(CARDS.gh_captain, { health: 6 });
  Object.assign(CARDS.gh_silence_master, { health: 6 });
  Object.assign(CARDS.gh_company, { health: 7 });
  Object.assign(CARDS.gh_venom_behemoth, { attack: 7, health: 7 });
  Object.assign(CARDS.gh_bounty_king, { attack: 8, health: 8 });
  Object.assign(CARDS.gh_silence_field, { cost: 3 });
  Object.assign(CARDS.gh_execution_contract, { cost: 3 });
  Object.assign(CARDS.gh_bounty_verdict, { cost: 4 });

  // 第二轮：继续补前期身材，并微调两张条件法术的数值（机制不变）
  Object.assign(CARDS.gh_cutthroat, { attack: 2 });
  Object.assign(CARDS.gh_venom_apprentice, { health: 2 });
  Object.assign(CARDS.gh_contract_squire, { attack: 2 });
  Object.assign(CARDS.gh_silencer, { attack: 3 });
  Object.assign(CARDS.gh_poison_thrower, { attack: 3 });
  Object.assign(CARDS.gh_rush_archer, { health: 3 });
  Object.assign(CARDS.gh_bounty_hunter, { health: 3 });
  Object.assign(CARDS.gh_quick_strike, { spell: { type: "grantRushBuff", attack: 2 }, text: "使一个友方随从获得 +2 攻击和先遣。" });
  Object.assign(CARDS.gh_venom_shield, { attack: 4, health: 4 });
  Object.assign(CARDS.gh_silence_expert, { health: 5 });
  Object.assign(CARDS.gh_shield_mercenary, { attack: 4 });
  Object.assign(CARDS.gh_formation, { cost: 2 });
  Object.assign(CARDS.gh_legend_assassin, { health: 5 });
  Object.assign(CARDS.gh_shield_broker, { attack: 5 });
  Object.assign(CARDS.gh_bounty_collector, { attack: 5 });
  Object.assign(CARDS.gh_assassinate_contract, { spell: { type: "damageOrDestroyBounty", amount: 5 }, text: "对一个敌方随从造成 5 点伤害；若它是悬赏目标，改为消灭。" });
  Object.assign(CARDS.gh_scorpion, { health: 6 });
  Object.assign(CARDS.gh_captain, { attack: 6 });
  Object.assign(CARDS.gh_silence_master, { health: 7 });
  Object.assign(CARDS.gh_company, { attack: 7 });
  Object.assign(CARDS.gh_venom_behemoth, { health: 8 });
  Object.assign(CARDS.gh_bounty_king, { attack: 9, health: 9 });

  // ===== 即梦生图接入（2026-10-19）：新卡与灰港改用 generated/<id>.webp =====
  for (const id of [
    "spring_medic", "vein_foreman", "formation_bastion", "vein_echo",
    "reflux_apprentice", "frost_scribe", "echo_observer",
    "blood_duelist", "blood_wraith", "blood_pool",
    "line_spearman", "combo_shield", "reborn_sentry",
    "zhenmai_artisan", "overload_gunner", "armor_drive",
    "gh_cutthroat", "gh_venom_apprentice", "gh_contract_squire", "gh_bounty_notice",
    "gh_silencer", "gh_poison_thrower", "gh_rush_archer", "gh_bounty_hunter",
    "gh_bodyguard_contract", "gh_quick_strike", "gh_venom_shield", "gh_silence_expert",
    "gh_shield_mercenary", "gh_ledger", "gh_assassinate_contract", "gh_black_market",
    "gh_legend_assassin", "gh_silence_field", "gh_shield_broker", "gh_execution_contract",
    "gh_bounty_collector", "gh_scorpion", "gh_captain", "gh_silence_master",
    "gh_bounty_verdict", "gh_company", "gh_venom_behemoth", "gh_bounty_king",
    "gh_formation", "gh_bounty_board", "gh_venom_vial"
  ]) {
    if (CARDS[id]) { CARDS[id].noGeneratedArt = false; CARDS[id].noArtwork = false; }
  }

  // 第三轮：收回部分前期提速，保留中后期身材补强
  Object.assign(CARDS.gh_cutthroat, { attack: 1 });
  Object.assign(CARDS.gh_venom_apprentice, { health: 1 });
  Object.assign(CARDS.gh_contract_squire, { attack: 1 });
  Object.assign(CARDS.gh_silencer, { attack: 2 });
  Object.assign(CARDS.gh_poison_thrower, { attack: 2 });
  Object.assign(CARDS.gh_quick_strike, { spell: { type: "grantRushBuff", attack: 1 }, text: "使一个友方随从获得 +1 攻击和先遣。" });
  Object.assign(CARDS.gh_formation, { cost: 3 });
  Object.assign(CARDS.gh_assassinate_contract, { spell: { type: "damageOrDestroyBounty", amount: 4 }, text: "对一个敌方随从造成 4 点伤害；若它是悬赏目标，改为消灭。" });

  // ===== 2026-10-20 用户数值表导入 + 设计收敛 =====
  // 数值：逐张来自用户《卡牌数值设计表1.xlsx》的 F/G/H 列。
  Object.assign(CARDS.vein_scout, { attack: 2, health: 1 });
  Object.assign(CARDS.vein_foreman, { health: 1 });
  Object.assign(CARDS.guard, { health: 4 });
  Object.assign(CARDS.orlicas, { attack: 2 });
  Object.assign(CARDS.timon, { attack: 3, health: 2 });
  Object.assign(CARDS.zone_keeper, { attack: 3, health: 2 });
  Object.assign(CARDS.vein_siphon, { cost: 2 });
  Object.assign(CARDS.spring_medic, { health: 3 });
  Object.assign(CARDS.formation_weaver, { health: 3 });
  Object.assign(CARDS.aidric, { attack: 2, health: 4 });
  Object.assign(CARDS.verious, { health: 2 });
  Object.assign(CARDS.shextena, { attack: 3, health: 3 });
  Object.assign(CARDS.vein_engineer, { attack: 2, health: 3 });
  Object.assign(CARDS.miyuki, { health: 7 });
  Object.assign(CARDS.excavation_titan, { attack: 4, health: 5 });
  Object.assign(CARDS.spell_novice, { health: 1 });
  Object.assign(CARDS.nina, { cost: 3, attack: 2, health: 2 });
  Object.assign(CARDS.reflux_apprentice, { health: 1 });
  Object.assign(CARDS.samuel, { attack: 2, health: 2 });
  Object.assign(CARDS.frost_scribe, { cost: 3 });
  Object.assign(CARDS.spell_echo, { attack: 2, health: 1 });
  Object.assign(CARDS.lecturer, { attack: 2, health: 1 });
  Object.assign(CARDS.formation_script, { cost: 4 });
  Object.assign(CARDS.justus, { attack: 2, health: 3 });
  Object.assign(CARDS.arcane_conduit, { attack: 1, health: 4 });
  Object.assign(CARDS.arcane_theorist, { attack: 2 });
  Object.assign(CARDS.echo_adept, { attack: 2, health: 1 });
  Object.assign(CARDS.karl_desmond, { attack: 2, health: 4 });
  Object.assign(CARDS.cassian, { attack: 2, health: 5 });
  Object.assign(CARDS.lize, { attack: 2, health: 2 });
  Object.assign(CARDS.reflux, { cost: 3 });
  Object.assign(CARDS.blood_duelist, { attack: 1 });
  Object.assign(CARDS.blood_acolyte, { attack: 1 });
  Object.assign(CARDS.formation_tide, { cost: 4 });
  Object.assign(CARDS.venom_fang, { attack: 1, health: 1 });
  Object.assign(CARDS.losutai_hunter, { health: 2 });
  Object.assign(CARDS.molan, { attack: 1, health: 4 });
  Object.assign(CARDS.blood_servant, { attack: 2, health: 2 });
  Object.assign(CARDS.grayfeather, { health: 3 });
  Object.assign(CARDS.devourer, { health: 2 });
  Object.assign(CARDS.tiega, { attack: 3, health: 3 });
  Object.assign(CARDS.blood_executor, { health: 3 });
  Object.assign(CARDS.brood_matron, { attack: 2, health: 3 });
  Object.assign(CARDS.lanxi, { attack: 4, health: 4 });
  Object.assign(CARDS.blood_priestess, { attack: 3, health: 4 });
  Object.assign(CARDS.losutai_matriarch, { health: 5 });
  Object.assign(CARDS.tide_colossus, { attack: 3, health: 2 });
  Object.assign(CARDS.shield_recruit, { health: 2 });
  Object.assign(CARDS.bulwark_sentry, { health: 1 });
  Object.assign(CARDS.drill_sergeant, { health: 2 });
  Object.assign(CARDS.line_spearman, { attack: 1 });
  Object.assign(CARDS.fortify, { cost: 1 });
  Object.assign(CARDS.shield_bearer, { attack: 3, health: 2 });
  Object.assign(CARDS.anti_rush, { cost: 2 });
  Object.assign(CARDS.erhardt, { attack: 2, health: 2 });
  Object.assign(CARDS.beatrix, { attack: 4 });
  Object.assign(CARDS.shield_sergeant, { health: 4 });
  Object.assign(CARDS.phalanx_warden, { health: 3 });
  Object.assign(CARDS.phalanx_executor, { attack: 0, health: 3 });
  Object.assign(CARDS.konrad, { health: 2 });
  Object.assign(CARDS.iron_wall, { cost: 2 });
  Object.assign(CARDS.zone_banner, { health: 4 });
  Object.assign(CARDS.bastion_captain, { attack: 4, health: 4 });
  Object.assign(CARDS.aegis_guard, { attack: 3, health: 3 });
  Object.assign(CARDS.cedric, { attack: 4, health: 4 });
  Object.assign(CARDS.iron_phalanx, { health: 3 });
  Object.assign(CARDS.shield_marshal, { health: 4 });
  Object.assign(CARDS.martial_law, { cost: 4 });
  Object.assign(CARDS.empire_guard, { health: 3 });
  Object.assign(CARDS.barrage, { cost: 1 });
  Object.assign(CARDS.zone_reaper, { disabled: true, cost: 4, attack: 1, health: 1 });
  const xiDeck = DECKS.xizhao.indexOf("zone_reaper");
  if (xiDeck >= 0) DECKS.xizhao[xiDeck] = "blood_executor";

  // 衍生物随从：必须有费用。
  for (const id of ["losutai_imp", "losutai_beast", "obsidian_spawn", "grave_guard", "astral_guardian", "republic_recruit"]) {
    if (CARDS[id]) CARDS[id].cost = 1;
  }

  // 阵位 / 对位收敛：只保留身份明确的效果，删掉为了“加个效果”而挂上去的。
  for (const id of ["timon", "orlicas", "konrad", "republic_guard", "empire_guard", "shield_recruit", "phalanx_warden", "phalanx_executor", "cedric", "erhardt", "gunther", "frost_professor", "aegis_guard", "gh_bounty_collector", "gh_shield_mercenary"]) {
    const c = CARDS[id];
    if (!c) continue;
    c.zoneBonus = null;
    c.mirrorBonus = null;
    c.zoneAura = null;
  }
  Object.assign(CARDS.hans, {
    zoneBonus: { health: 1 },
    text: "守备。被动：你召唤的守备随从获得 +0/+1。 阵位：同阵位每有一个其他随从，生命值 +1。"
  });
  Object.assign(CARDS.aidric, {
    mirrorBonus: { armor: 3 },
    text: "守备。 引脉4：获得 +1/+1。 引脉8：获得 +2/+2。 对位：若敌方对位阵位有随从，获得 3 点护甲。"
  });
  Object.assign(CARDS.shield_sergeant, {
    mirrorBonus: { armor: 3 },
    text: "守备。余响：所有友方守备随从获得 +0/+1。 对位：若敌方对位阵位有随从，获得 3 点护甲。"
  });

  // 普卫岛 / 中立
  Object.assign(CARDS.vein_scout, {
    veinTiers: [{ vein: 3, health: 1 }],
    text: "先遣。 引脉3：获得 +0/+1。"
  });
  Object.assign(CARDS.orlicas, {
    zoneBonus: null,
    text: "登场：抽 1 张牌；引脉4：再抽 1 张牌。"
  });
  Object.assign(CARDS.timon, {
    zoneBonus: null,
    text: "登场：本回合你打出的下一张牌行动力消耗减少 1。"
  });
  Object.assign(CARDS.zone_keeper, {
    zoneBonus: { attack: 1, health: 2 },
    text: "阵位：同阵位每有一个其他友方随从，获得 +1/+2。"
  });
  Object.assign(CARDS.formation_weaver, {
    text: "登场：若该卡被召唤到已经使用阵型卡的阵位，获得 +0/+1 并抽 1 张牌。"
  });
  Object.assign(CARDS.shextena, {
    battlecry: { type: "healHeroSelfBuff", amount: 3 },
    veinTiers: [{ vein: 10, healHero: 3 }],
    text: "登场：恢复你的领袖 3 点生命；每实际恢复 1 点，希斯蒂娜获得 +1/+1。 引脉10：恢复你的领袖 3 点生命。"
  });
  Object.assign(CARDS.excavation_titan, {
    veinTiers: [{ vein: 10, attack: 2, health: 1 }],
    text: "登场：流脉 +2。 引脉10：获得 +2/+1。"
  });
  Object.assign(CARDS.formation_bastion, {
    formation: { attack: 0, health: 0, taunt: true },
    text: "阵型：该阵位随从固定获得守备。"
  });
  Object.assign(CARDS.formation_standard, {
    text: "装备：你使用过阵型卡时，该阵线友方随从额外获得 +0/+1。"
  });
  Object.assign(CARDS.emergency, {
    spell: { type: "healDraw", amount: 2, draw: 1 },
    text: "恢复一个友方随从 2 点生命；抽 1 张牌。"
  });
  Object.assign(CARDS.resonance, {
    spell: { type: "drawGainVein", amount: 1, vein: 1 },
    text: "抽 1 张牌，流脉 +1。"
  });
  Object.assign(CARDS.vein_attendant, {
    veinTiers: [{ vein: 3, attack: 1, health: 1 }],
    text: "登场：流脉 +1。 引脉3：获得 +1/+1。"
  });

  // 学院：去掉“白嫖行动力 / 复制 / 免费冻结”等失控效果
  Object.assign(CARDS.archive_search, {
    spell: { type: "drawBoth", amount: 1 },
    text: "双方各抽 1 张牌。"
  });
  Object.assign(CARDS.spell_novice, {
    battlecry: { type: "discountSpellTurn", amount: 1 },
    reflux: null,
    text: "登场：本回合你的下一张战术牌的行动力消耗 -1。"
  });
  Object.assign(CARDS.doorman, {
    battlecry: null,
    reflux: null,
    keywords: [],
    text: "—"
  });
  Object.assign(CARDS.debate, {
    spell: { type: "damage", amount: 2 },
    text: "对一个敌方随从造成 2 点伤害。"
  });
  Object.assign(CARDS.insight, {
    spell: { type: "drawGainVein", amount: 1, vein: 1 },
    text: "抽 1 张牌，流脉 +1。"
  });
  Object.assign(CARDS.reflux_apprentice, {
    battlecry: { type: "spellDraw", draw: 1 },
    text: "逆脉1：若本回合你施放过战术牌，抽 1 张牌。"
  });
  Object.assign(CARDS.armor_break, {
    spell: { type: "stripArmorToMana", amount: 4, mana: 1 },
    text: "移除敌方领袖至多 4 点护甲；若移除成功，获得 1 点行动力。"
  });
  Object.assign(CARDS.frost_prism, {
    text: "装备：每当你施放战术牌，恢复你的领袖 1 点生命。"
  });
  Object.assign(CARDS.justus, {
    text: "登场：复制你手牌中行动力消耗最低的战术牌。"
  });
  Object.assign(CARDS.arcane_conduit, {
    passive: { type: "spellDrawOne" },
    text: "被动：每当你施放一张战术牌，抽 1 张牌。"
  });
  Object.assign(CARDS.spellstorm, {
    rarity: "legendary",
    text: "对所有敌方单位造成等同于本局已使用的战术牌数量的伤害（最高 10 点）。"
  });

  // 西昭：血祭费用上调、删掉抽牌/对位/长小作文
  Object.assign(CARDS.tribal_warrior, {
    bloodCost: 3,
    text: "血祭3：获得 +1/+1。"
  });
  Object.assign(CARDS.lize, {
    battlecry: null,
    keywords: [],
    text: "压脉2：消耗 2 点流脉，对敌方领袖造成 2 点伤害。"
  });
  Object.assign(CARDS.blood_imp, {
    mirrorBonus: null,
    text: "血偿。"
  });
  Object.assign(CARDS.blood_duelist, {
    bloodCost: 5,
    text: "先遣。血祭5：获得 +2 攻击。"
  });
  Object.assign(CARDS.blood_altar, {
    spell: { type: "summonTwoTokens", token: "losutai_imp", count: 2, label: "血祭祭坛" },
    text: "召唤两个 1/1 的洛斯汰魔物。"
  });
  Object.assign(CARDS.formation_tide, {
    formation: { lifesteal: true },
    text: "阵型：该阵位所有随从固定获得血偿。"
  });
  Object.assign(CARDS.molan, {
    bloodCost: 3,
    text: "登场：检索一张随从牌；血祭3：获得 +2 攻击。"
  });
  Object.assign(CARDS.blood_scythe, {
    text: "装备：友方随从死亡时，你的领袖恢复 1 点生命。"
  });
  Object.assign(CARDS.blood_servant, {
    pressure: null,
    zoneBonus: null,
    text: "余响：使一个友方随从获得 +1 攻击。 血偿。"
  });
  Object.assign(CARDS.tiega, {
    bloodCost: 5,
    text: "先遣。血祭5：获得 +2 攻击。"
  });
  Object.assign(CARDS.blood_pool, {
    target: "none",
    spell: { type: "draw", amount: 2 },
    text: "抽 2 张牌。"
  });
  Object.assign(CARDS.tide_colossus, {
    keywords: ["lifesteal"],
    pressure: null,
    bloodCost: 5,
    battlecry: { type: "devourBloodBuff", attack: 2, health: 2 },
    text: "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值；血祭5：获得 +2/+2。 血偿。"
  });

  // 共和国：删掉多余阵位/对位，保留守备/余响骨架
  Object.assign(CARDS.shield_recruit, {
    keywords: ["taunt"],
    zoneBonus: null,
    mirrorBonus: null,
    text: "守备。"
  });
  Object.assign(CARDS.erhardt, {
    mirrorBonus: null,
    text: "先遣。回潮。 顺势：本回合场上每死亡一个随从，获得 +1/+1。"
  });
  Object.assign(CARDS.phalanx_warden, {
    mirrorBonus: null,
    zoneAura: null,
    text: "守备。余响：所有友方随从获得 +0/+1。"
  });
  Object.assign(CARDS.phalanx_executor, {
    mirrorBonus: null,
    text: "被动：每当另一个友方守备随从死亡，抽 1 张牌。"
  });
  Object.assign(CARDS.konrad, {
    mirrorBonus: null,
    zoneBonus: null,
    target: "none",
    battlecry: { type: "grantDeathrattleDamageAll", amount: 1 },
    text: "登场：使所有友方随从获得余响：对随机一个敌方随从造成 1 点伤害。"
  });
  Object.assign(CARDS.cedric, {
    mirrorBonus: null,
    veinBonus: { vein: 6, healHero: 8 },
    text: "守备。 引脉6：恢复你的领袖 8 点生命。"
  });
  Object.assign(CARDS.empire_guard, {
    mirrorBonus: null,
    text: "镇脉1：消耗 1 点流脉，获得等量护甲。"
  });
  Object.assign(CARDS.aegis_guard, {
    zoneAura: null,
    text: "格挡。守备。"
  });
  Object.assign(CARDS.republic_guard, {
    mirrorBonus: null,
    text: "守备。余响：对随机一个敌方随从造成 2 点伤害。"
  });
  Object.assign(CARDS.formation_wall, {
    formation: { deathrattleSummon: "republic_recruit", excludeDeathrattle: "republic_recruit" },
    text: "该阵位所有非共和国新兵以外的友方随从固定获得余响：召唤一个 1/1 的共和国新兵。"
  });

  // 衍生物的随从费用已在上面统一为 1。

  // ===== 2026-10-20 文案/实现一致性修正 =====
  Object.assign(CARDS.losutai_imp, { text: "每回合开始时获得 +1/+1。 余响：对随机敌方单位造成等同于攻击力的伤害（最高 5 点）。" });
  Object.assign(CARDS.spell_codex, { text: "装备：每个你的回合，第一张战术牌的行动力消耗 -1。" });
  Object.assign(CARDS.powder_engine, { text: "装备：每当一名友方随从死亡，随机对一名敌方单位造成 1 点伤害。" });
  Object.assign(CARDS.resonance, { excavate: null });
  Object.assign(CARDS.insight, { excavate: null });
  Object.assign(CARDS.guard, { text: "阵位：同阵位每有一个其他随从，获得 +1/+0。 引脉4：获得 +1/+0。 引脉8：获得 +2/+0。" });
  Object.assign(CARDS.courier, { text: "阵位：同阵位每有一个其他随从，获得 +0/+1。" });
  Object.assign(CARDS.hans, { text: "守备。被动：你召唤的守备随从获得 +0/+1。 阵位：同阵位每有一个其他随从，生命值 +1。" });
  Object.assign(CARDS.fog_sailor, { text: "阵位：同阵位每有一个其他随从，攻击力 +1。" });
  Object.assign(CARDS.caravan_guard, { text: "守备。 阵位：同阵位每有一个其他随从，生命值 +1。" });
  Object.assign(CARDS.bounty_hunter, { text: "余响：对随机敌方单位造成 1 点伤害。 阵位：同阵位每有一个其他随从，攻击力 +1。" });
  Object.assign(CARDS.zone_keeper, { text: "阵位：同阵位每有一个其他友方随从，获得 +1/+2。" });
  Object.assign(CARDS.snow_medic, { text: "余响：恢复领袖 1 点生命。登场：同阵位有其他友方随从时，再恢复 1 点。" });
  // ===== 2026-10-20 阵位/对位改为显式光环描述 =====
  const EXPLICIT_POSITION_TEXT = {
    guard: "被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +1/+0。 引脉 4：获得 +1/+0。 引脉 8：获得 +2/+0。",
    courier: "被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +0/+1。",
    hans: "守备。被动：你召唤的守备随从获得 +0/+1；该随从在场时，同阵位每有一个其他友方随从，本随从获得 +0/+1。",
    fog_sailor: "被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +1/+0。",
    caravan_guard: "守备。被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +0/+1。",
    bounty_hunter: "余响：对随机敌方目标造成 1 点伤害。 被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +1/+0。",
    zone_keeper: "被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +1/+2。",
    aidric: "守备。 引脉 4：获得 +1/+1。 引脉 8：获得 +2/+2。 登场：若该随从对位有敌方随从，获得 3 点护甲。",
    shield_sergeant: "守备。余响：所有友方守备随从获得 +0/+1。 登场：若该随从对位有敌方随从，获得 3 点护甲。",
    reborn_sentry: "回潮。该随从对位有敌方随从时，本随从固定获得 +1/+0。",
    elena: "登场：若该随从对位有敌方随从，召唤一个 1/1 的共和国新兵。",
    miyuki: "登场：冻结场上除自己阵位以外的全部随从，包括友方。 被动：深雪在场时，同阵位友方随从不会被冻结。",
    shield_marshal: "守备。回潮。余响：召唤两个 1/1 的共和国新兵。 若本回合已打出过其他牌，则本回合你每召唤一个共和国新兵，获得 +1/+1。 登场：若该随从对位没有敌方随从，召唤一个 1/1 的共和国新兵。",
    erhardt: "先遣。回潮。若本回合已打出过其他牌，则本回合每有一个随从死亡，获得 +1/+1。",
    shield_bearer: "若本回合已打出过其他牌，则本回合你每打出一个友方守备随从，获得 +0/+1。",
    iron_phalanx: "守备。若本回合已打出过其他牌，则本回合你每使用一个随从，获得 +1/+1。 余响：对敌方所有单位造成 1 点伤害。",
    combo_shield: "使一个友方随从获得 +0/+2 与守备；若本回合已打出过其他牌，改为 +0/+4 与守备。",
    formation_vein: "该阵位友方随从固定获得余响：恢复你的领袖 1 点生命。",
    formation_script: "该阵位友方随从固定获得先遣。",
    formation_tide: "该阵位友方随从固定获得血偿。",
    formation_wall: "该阵位除共和国新兵以外的所有友方随从固定获得余响：召唤一个 1/1 的共和国新兵。",
    formation_cannon: "该阵位友方随从固定获得先遣。",
    formation_bastion: "该阵位友方随从固定获得守备。",
    gh_formation: "该阵位所有友方随从固定获得先遣。",
    wayfarer_camp: "该阵位友方随从固定获得 +0/+1 和守备。",
    formation_standard: "装备：你使用过阵型卡时，该阵位友方随从额外获得 +0/+1。"
  };
  for (const [id, text] of Object.entries(EXPLICIT_POSITION_TEXT)) {
    if (CARDS[id]) CARDS[id].text = text;
  }
  Object.assign(CARDS.formation_wall, { formation: { deathrattleSummon: "republic_recruit", excludeDeathrattle: "republic_recruit" } });

  // ===== 2026-10-20 用户指定卡牌改动 =====
  Object.assign(CARDS.spell_codex, {
    cost: 2,
    text: "装备：你的领袖技能被替换为「编目」：随机使一张手牌中的战术牌行动力消耗 -1。"
  });
  Object.assign(CARDS.elsa, {
    text: "镇脉2：消耗 2 点流脉，获得 2 点护甲。 连携。"
  });
  Object.assign(CARDS.zhenmai_artisan, {
    text: "镇脉1：消耗 1 点流脉，获得 1 点护甲。 连携。"
  });
  Object.assign(CARDS.siege_captain, {
    text: "登场：对所有敌方随从造成 1 点伤害。 镇脉1：消耗 1 点流脉，获得 1 点护甲。"
  });
  Object.assign(CARDS.wind_cannon, {
    text: "连携。 镇脉1：消耗 1 点流脉，获得 1 点护甲。"
  });
  Object.assign(CARDS.empire_guard, {
    text: "镇脉1：消耗 1 点流脉，获得 1 点护甲。"
  });
  Object.assign(CARDS.klaus, {
    keywords: ["battlecry", "charge"],
    text: "先遣。反噬 1。 登场：场上每有一个其他随从（不分敌我），获得 +1/+1。"
  });
  Object.assign(CARDS.rush_lancer, {
    keywords: ["rush"],
    passive: null,
    text: "先遣。"
  });
  Object.assign(CARDS.armor_mortar, {
    spell: { type: "armorToDamageFixed", armor: 3, damage: 5 },
    text: "消耗 3 点护甲，对敌方领袖造成 5 点伤害。"
  });
  Object.assign(CARDS.gunther, {
    keywords: ["battlecry", "windfury"],
    text: "连携。 登场：获得 4 点护甲。"
  });
  Object.assign(CARDS.martial_court, {
    spell: { type: "armorPerEnemy", amount: 2 },
    text: "每有一个敌方随从，获得 2 点护甲。"
  });
  Object.assign(CARDS.zone_barrage, {
    spell: { type: "damageAllEnemies", amount: 2 },
    text: "对所有敌方随从造成 2 点伤害。"
  });
  Object.assign(CARDS.shield_sergeant, {
    mirrorBonus: null,
    text: "守备。余响：所有友方守备随从获得 +0/+1。"
  });
  Object.assign(CARDS.martial_law, {
    target: "friendly",
    spell: { type: "tauntRebornZone" },
    text: "使同阵位的所有随从获得守备与回潮。"
  });
  Object.assign(CARDS.shield_marshal, {
    text: "守备。回潮。余响：召唤两个 1/1 的共和国新兵。 若本回合已打出过其他牌，则本回合你每召唤一个共和国新兵，获得 +1/+1。"
  });
  Object.assign(CARDS.erhardt, {
    text: "先遣。回潮。登场：若本回合已打出过其他牌，则本回合每有一个随从死亡，获得 +1/+1。"
  });

  // ===== 2026-10-20 第三批用户指定改动 =====
  Object.assign(CARDS.doorman, {
    keywords: ["taunt"],
    taunt: true,
    text: "守备。"
  });
  Object.assign(CARDS.guard, {
    keywords: ["taunt"],
    veinTiers: null,
    text: "守备。被动：该随从在场时，同阵位每有一个其他友方随从，本随从获得 +1/+0。"
  });
  Object.assign(CARDS.armor_break, {
    cost: 2,
    spell: { type: "stripArmorToMana", amount: 4, mana: 0 },
    text: "移除敌方领袖 4 点护甲。"
  });
  Object.assign(CARDS.aidric, {
    text: "守备。引脉4/8：获得 +1/+1 / +2/+2。登场：若该随从对位有敌方随从，获得 3 点护甲。"
  });
  Object.assign(CARDS.timon, {
    keywords: ["passive"],
    battlecry: null,
    passive: { type: "firstCardDiscount", amount: 1 },
    text: "被动：提蒙存活时，你每个回合打出的第一张牌行动力消耗 -1。"
  });
  Object.assign(CARDS.formation_standard, {
    text: "装备：使用过阵型卡的阵位上，所有随从固定获得 +1/+0。"
  });
  Object.assign(CARDS.vein_echo, {
    text: "恢复你的领袖 3 点生命，并使流脉 +2；若流脉达到 7，抽 1 张牌。"
  });

  // ===== 2026-10-20 关键词顺序与流脉术语统一 =====
  Object.assign(CARDS.vein_channel, {
    reflux: 1,
    spell: { type: "draw", amount: 1 },
    text: "逆脉1：抽 1 张牌。"
  });
  Object.assign(CARDS.stabilize, {
    reflux: 2,
    spell: { type: "armor", amount: 2 },
    text: "逆脉2：获得 2 点护甲。"
  });
  Object.assign(CARDS.return_tide, {
    reflux: 2,
    spell: { type: "healHeroDraw", amount: 2, draw: 1 },
    text: "逆脉2：恢复你的领袖 2 点生命；抽 1 张牌。"
  });
  Object.assign(CARDS.wanderer_charm, {
    text: "装备：你的领袖生命上限 +5。"
  });
  Object.assign(CARDS.vein_tithe, {
    excavate: 2,
    text: "获得 5 点护甲；掘脉2。",
    spell: { type: "armor", amount: 5 }
  });
  Object.assign(CARDS.vein_behemoth, {
    text: "登场：掘脉2；引脉10：获得 +0/+1 和守备。",
    battlecry: { type: "veinBuff", amount: 2, draw: 2, vein: 10, attack: 0, health: 1 }
  });
  Object.assign(CARDS.vein_leviathan, {
    text: "登场：掘脉1；引脉7：抽 1 张牌。",
    battlecry: { type: "veinDraw", amount: 1, vein: 7, draw: 1, thresholdDraw: 1 }
  });
  Object.assign(CARDS.void_titan, {
    keywords: ["battlecry"],
    target: "none",
    battlecry: { type: "destroyAllEnemies" },
    text: "登场：消灭所有敌方随从。"
  });
  Object.assign(CARDS.final_bell, {
    text: "对所有敌方单位造成 5 点伤害。",
    spell: { type: "damageAllEnemyUnits", amount: 5 }
  });
  Object.assign(CARDS.snow_medic, {
    keywords: ["battlecry", "deathrattle"],
    text: "登场：同阵位有其他友方随从时，恢复你的领袖 1 点生命。余响：恢复你的领袖 1 点生命。"
  });
  Object.assign(CARDS.shield_marshal, {
    keywords: ["taunt", "reborn", "battlecry", "deathrattle"],
    text: "守备。回潮。登场：若本回合已打出过其他牌，本回合每召唤一个共和国新兵，获得 +1/+1。余响：召唤两个 1/1 的共和国新兵。"
  });
  Object.assign(CARDS.iron_phalanx, {
    keywords: ["taunt", "battlecry", "deathrattle"],
    text: "守备。登场：若本回合已打出过其他牌，本回合每使用一个随从，获得 +1/+1。余响：对敌方所有单位造成 1 点伤害。"
  });
  Object.assign(CARDS.vein_prospect, { text: "掘脉2。" });
  Object.assign(CARDS.recon, { text: "掘脉1。" });
  Object.assign(CARDS.resonance, { text: "掘脉1。" });
  Object.assign(CARDS.insight, { text: "掘脉1。" });
  // 关键词统一放在所有效果文字之前：先放纯关键词，再放带关键词触发的效果，最后放普通效果。
  (function normalizeKeywordOrder() {
    const labels = ["格挡", "守备", "先遣", "连携", "血偿", "蚀毒", "隐匿", "回潮", "冻结", "沉默", "登场", "余响", "引脉", "掘脉", "血祭", "预兆", "吞噬", "逆脉", "镇脉", "压脉", "悬赏", "固定", "装备", "被动"];
    const keywordOf = (s) => labels.find(k => s === k || s.indexOf(k + "：") === 0 || new RegExp("^" + k + "\\s+\\d").test(s)) || null;
    const keyStart = (s) => !!keywordOf(s);
    for (const c of Object.values(CARDS)) {
      const text = (c.text || "").trim();
      if (!text) continue;
      const ends = text.charAt(text.length - 1) === "。";
      const parts = text.split("。").map(s => s.trim()).filter(Boolean);
      if (!parts.length) continue;
      const simple = [];
      const keyed = [];
      const plain = [];
      for (const part of parts) {
        if (labels.indexOf(part) >= 0) simple.push(part);
        else if (keyStart(part)) keyed.push(part);
        else plain.push(part);
      }
      keyed.sort((a, b) => labels.indexOf(keywordOf(a)) - labels.indexOf(keywordOf(b)));
      c.text = simple.concat(keyed, plain).join("。") + (ends ? "。" : "");
    }
  })();

  // 最终覆盖：避免并发文案整理覆盖本轮指定效果。
  Object.assign(CARDS.aidric, {
    text: "守备。引脉4/8：获得 +1/+1 / +2/+2。登场：若该随从对位有敌方随从，获得 3 点护甲。"
  });
  Object.assign(CARDS.shield_marshal, {
    text: "守备。回潮。余响：召唤两个 1/1 的共和国新兵。若本回合已打出过其他牌，则本回合你每召唤一个共和国新兵，获得 +1/+1。"
  });

  // ===== 2026-10-20 领袖技能重做：单技能、无头衔 =====
  for (const h of Object.values(HEROES)) delete h.title;
  Object.assign(HEROES.lain, {
    power: {
      name: "协调",
      cost: 2,
      target: "friendly",
      text: "使一个友方随从获得 +0/+1；若它与另一个友方随从同阵位，改为 +1/+1。"
    },
    passive: null
  });
  Object.assign(HEROES.karna, {
    power: {
      name: "血祭",
      cost: 2,
      target: "none",
      text: "对自己造成 1 点伤害，抽 1 张牌。"
    },
    passive: null
  });
  Object.assign(HEROES.marta, {
    power: {
      name: "演算",
      cost: 0,
      target: "passive",
      passive: true,
      text: "被动：每回合第一张战术牌行动力消耗 -1。"
    },
    passive: null
  });
  Object.assign(HEROES.wolfram, {
    power: {
      name: "筑防",
      cost: 2,
      target: "hand",
      text: "改写一张手牌：将它变成另一张相同行动力消耗的同阵营卡牌。"
    },
    passive: null
  });
  Object.assign(HEROES.otto, {
    power: {
      name: "炮击",
      cost: 2,
      target: "enemy",
      text: "对一个敌方随从或敌方领袖造成 1 点伤害。"
    },
    passive: null
  });
  Object.assign(HEROES.monarch, {
    power: {
      name: "悬赏",
      cost: 0,
      target: "passive",
      passive: true,
      text: "被动：悬赏名单上的随从死亡时，你获得 1 点护甲并抽 1 张牌。"
    },
    passive: null
  });

  Object.assign(CARDS, {
  "formation_bugler": {
    "id": "formation_bugler",
    "name": "阵线号手",
    "faction": "pus",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：同阵位其他友方随从获得 +1/+0；若该阵位有阵型，再获得守备。",
    "flavor": "号声一响，散兵也会站成一条线。",
    "battlecry": {
      "type": "formationBanner",
      "attack": 1,
      "health": 0,
      "taunt": true
    },
    "noArtwork": false
  },
  "formation_artificer": {
    "id": "formation_artificer",
    "name": "旗阵工匠",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：每当你使用一张阵型牌，抽 1 张牌。",
    "flavor": "他不打仗，只负责让阵线看起来不会倒。",
    "passive": {
      "type": "formationDraw",
      "draw": 1
    },
    "noArtwork": false
  },
  "bulwark_lieutenant": {
    "id": "bulwark_lieutenant",
    "name": "磐石副官",
    "faction": "pus",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "deathrattle"
    ],
    "target": "none",
    "text": "守备。余响：同阵位所有友方随从获得 +0/+2。",
    "flavor": "他倒下时，阵线还在。",
    "deathrattle": {
      "type": "buffZoneAllies",
      "health": 2
    },
    "noArtwork": false
  },
  "ley_surveyor": {
    "id": "ley_surveyor",
    "name": "地脉测绘员",
    "faction": "pus",
    "type": "minion",
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你使用过阵型卡，抽 1 张牌。",
    "flavor": "先量地，再落子。",
    "battlecry": {
      "type": "drawIfFormation",
      "draw": 1
    },
    "noArtwork": false
  },
  "field_medic": {
    "id": "field_medic",
    "name": "野地医师",
    "faction": "pus",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命；若你使用过阵型卡，改为恢复 4 点。",
    "flavor": "药箱里一半是绷带，一半是地脉水。",
    "battlecry": {
      "type": "healHeroIfFormation",
      "amount": 2,
      "bonus": 2
    },
    "noArtwork": false
  },
  "pulse_banner": {
    "id": "pulse_banner",
    "name": "回脉旗手",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：恢复你的领袖 2 点生命；若同阵位有其他友方，抽 1 张牌。",
    "flavor": "旗子倒下之前，地脉已经记住了它的位置。",
    "deathrattle": {
      "type": "healDrawIfZoneAlly",
      "heal": 2,
      "draw": 1
    },
    "noArtwork": false
  },
  "frost_line_guard": {
    "id": "frost_line_guard",
    "name": "霜线守卫",
    "faction": "academy",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "passive"
    ],
    "target": "none",
    "text": "守备。被动：每当一个敌方随从被冻结，获得 +0/+1。",
    "flavor": "冰线不是墙，是让墙变硬的东西。",
    "passive": {
      "type": "freezeGrowth",
      "attack": 0,
      "health": 1
    },
    "noArtwork": false
  },
  "frost_archivist": {
    "id": "frost_archivist",
    "name": "冰封档案员",
    "faction": "academy",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：冻结一个敌方随从；若它已被冻结，抽 1 张牌。",
    "flavor": "已经归档的，不需要再归档一次。",
    "battlecry": {
      "type": "freezeDrawIfFrozen",
      "draw": 1
    },
    "noArtwork": false
  },
  "frost_page": {
    "id": "frost_page",
    "name": "霜页助手",
    "faction": "academy",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 1 张牌。",
    "flavor": "她负责把每一页都冻在同一个句号上。",
    "battlecry": {
      "type": "freezeDrawIfSpell",
      "draw": 1
    },
    "noArtwork": false
  },
  "white_frost_hall": {
    "id": "white_frost_hall",
    "name": "白霜回廊",
    "faction": "academy",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "该阵位友方随从固定获得：攻击已被冻结的随从时 +1/+0。",
    "flavor": "走廊尽头没有门，只有一层薄霜。",
    "formation": {
      "attack": 0,
      "health": 0,
      "attackVsFrozen": 1
    },
    "noArtwork": false
  },
  "page_scholar": {
    "id": "page_scholar",
    "name": "页隙学者",
    "faction": "academy",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：每当你打出一张 1 费战术牌，抽 1 张牌。",
    "flavor": "她总能从页码之间再找出一页。",
    "passive": {
      "type": "spellCostOneDraw",
      "draw": 1
    },
    "noArtwork": false
  },
  "double_column_note": {
    "id": "double_column_note",
    "name": "双栏批注",
    "faction": "academy",
    "type": "spell",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 1 张牌；若你本回合已施放过战术牌，再抽 1 张。",
    "flavor": "一栏写结论，一栏写反结论。",
    "spell": {
      "type": "drawIfSpellPlayed",
      "draw": 1,
      "bonus": 1
    },
    "noArtwork": false
  },
  "blood_pact_collector": {
    "id": "blood_pact_collector",
    "name": "血契征收者",
    "faction": "xizhao",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 1,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "friendly",
    "text": "登场：对一个友方随从造成 1 点伤害；抽 1 张牌。",
    "flavor": "血债的利息，总是提前收。",
    "battlecry": {
      "type": "friendlyDamageDraw",
      "amount": 1,
      "draw": 1
    },
    "noArtwork": false
  },
  "monster_overseer": {
    "id": "monster_overseer",
    "name": "魔物监工",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "attack": 3,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤一个 1/1 洛斯汰魔物；若你控制其他魔物，获得 +1/+1。",
    "flavor": "魔物不需要训练，只需要一个更凶的监工。",
    "battlecry": {
      "type": "summonImpBuffSelf",
      "token": "losutai_imp",
      "attack": 1,
      "health": 1
    },
    "noArtwork": false
  },
  "pressure_warlock": {
    "id": "pressure_warlock",
    "name": "压脉术士",
    "faction": "xizhao",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "压脉 1：消耗 1 点流脉，对敌方领袖造成 1 点伤害；若你控制魔物，抽 1 张牌。",
    "flavor": "他让流脉在敌人的血管里改道。",
    "battlecry": {
      "type": "pressureDrawIfImp",
      "amount": 1,
      "draw": 1
    },
    "pressure": 1,
    "noArtwork": false
  },
  "blood_incense_divination": {
    "id": "blood_incense_divination",
    "name": "血香占卜",
    "faction": "xizhao",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 1 张牌；若本回合有友方随从死亡，恢复 2 点生命。",
    "flavor": "香灰落下时，答案是“再来一次”。",
    "spell": {
      "type": "drawIfFriendlyDeathHeal",
      "draw": 1,
      "heal": 2
    },
    "noArtwork": false
  },
  "tide_scout": {
    "id": "tide_scout",
    "name": "潮痕斥候",
    "faction": "xizhao",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "stealth",
      "battlecry"
    ],
    "target": "friendly",
    "text": "隐匿。登场：使一个友方随从获得 +1 攻击。",
    "flavor": "她先看见潮，再看见敌人。",
    "battlecry": {
      "type": "buffAttack",
      "attack": 1
    },
    "noArtwork": false
  },
  "bloodroad_guide": {
    "id": "bloodroad_guide",
    "name": "血路向导",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "friendly",
    "text": "登场：使一个友方随从获得 +1 攻击和血偿。",
    "flavor": "沿着血走，总能走到最近的水。",
    "battlecry": {
      "type": "grantAttackLifesteal",
      "attack": 1
    },
    "noArtwork": false
  },
  "reborn_rite": {
    "id": "reborn_rite",
    "name": "回潮仪式",
    "faction": "xizhao",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "target": "friendly",
    "text": "使一个友方随从获得回潮；抽 1 张牌。",
    "flavor": "潮水退去，不是为了离开，是为了再来。",
    "spell": {
      "type": "rebornDraw",
      "draw": 1
    },
    "noArtwork": false
  },
  "shield_instructor": {
    "id": "shield_instructor",
    "name": "盾墙教官",
    "faction": "republic",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "你的守备随从获得 +0/+1。",
    "flavor": "盾要举得高，站要站得低。",
    "passive": {
      "type": "tauntAura",
      "attack": 0,
      "health": 1
    },
    "noArtwork": false
  },
  "echo_standard": {
    "id": "echo_standard",
    "name": "余响军旗",
    "faction": "republic",
    "type": "spell",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "target": "friendly",
    "text": "使一个友方随从获得余响：召唤一个 1/1 共和国新兵。",
    "flavor": "旗子会倒，军号不会。",
    "spell": {
      "type": "grantDeathrattleSummon",
      "token": "republic_recruit",
      "count": 1
    },
    "noArtwork": false
  },
  "reborn_shield_guard": {
    "id": "reborn_shield_guard",
    "name": "回潮盾卫",
    "faction": "republic",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "reborn"
    ],
    "target": "none",
    "text": "守备。回潮。",
    "flavor": "第二次站起来的盾，比第一次更硬。",
    "noArtwork": false
  },
  "recruiter": {
    "id": "recruiter",
    "name": "征募官",
    "faction": "republic",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若本回合已打出过其他牌，抽 1 张牌。",
    "flavor": "名册上多一个名字，阵线就多一厘米。",
    "battlecry": {
      "type": "drawIfCombo",
      "draw": 1
    },
    "noArtwork": false
  },
  "parliament_debate": {
    "id": "parliament_debate",
    "name": "议会辩论",
    "faction": "republic",
    "type": "spell",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 1 张牌；若你控制守备随从，再抽 1 张。",
    "flavor": "辩论的结论通常是：再辩论一次。",
    "spell": {
      "type": "drawIfTaunt",
      "draw": 1,
      "bonus": 1
    },
    "noArtwork": false
  },
  "wall_recruit": {
    "id": "wall_recruit",
    "name": "城防见习",
    "faction": "republic",
    "type": "minion",
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "battlecry"
    ],
    "target": "none",
    "text": "守备。登场：若你控制其他守备随从，获得 +0/+1。",
    "flavor": "他还没学会站岗，先学会了站住。",
    "battlecry": {
      "type": "buffSelfIfTaunt",
      "health": 1
    },
    "noArtwork": false
  },
  "battlefield_bill": {
    "id": "battlefield_bill",
    "name": "战地法案",
    "faction": "republic",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 1 张牌；若你控制守备随从，获得 2 点护甲。",
    "flavor": "在炮火里通过的法案，通常只有一句话。",
    "spell": {
      "type": "drawArmorIfTaunt",
      "draw": 1,
      "armor": 2
    },
    "noArtwork": false
  },
  "powder_apprentice": {
    "id": "powder_apprentice",
    "name": "火药学徒",
    "faction": "empire",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "rush",
      "deathrattle"
    ],
    "target": "none",
    "text": "先遣。余响：随机对一个敌方随从造成 1 点伤害。",
    "flavor": "他学得很快，炸得也很快。",
    "deathrattle": {
      "type": "damageRandomMinion",
      "amount": 1
    },
    "noArtwork": false
  },
  "detonation_sapper": {
    "id": "detonation_sapper",
    "name": "殉爆工兵",
    "faction": "empire",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：对所有敌方随从造成 1 点伤害。",
    "flavor": "引线不是用来点的，是用来算时间的。",
    "deathrattle": {
      "type": "damageAllEnemies",
      "amount": 1
    },
    "noArtwork": false
  },
  "powder_foreman": {
    "id": "powder_foreman",
    "name": "火药监工",
    "faction": "empire",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：每当一个友方随从死亡，获得 +1/+0。",
    "flavor": "他数的是人头，不是人数。",
    "passive": {
      "type": "deathGrowth",
      "attack": 1,
      "health": 0
    },
    "noArtwork": false
  },
  "ironflow_charge": {
    "id": "ironflow_charge",
    "name": "铁流冲锋",
    "faction": "empire",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "target": "friendly",
    "text": "使一个友方随从获得先遣；若它在本回合死亡，抽 1 张牌。",
    "flavor": "铁流没有退路，只有下一段铁轨。",
    "spell": {
      "type": "grantRushDrawOnDeath",
      "draw": 1
    },
    "noArtwork": false
  },
  "powder_martyr": {
    "id": "powder_martyr",
    "name": "火药殉道者",
    "faction": "empire",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "rush",
      "deathrattle"
    ],
    "target": "none",
    "text": "先遣。余响：对敌方领袖造成 2 点伤害。",
    "flavor": "导火索烧到尽头时，他笑了一下。",
    "deathrattle": {
      "type": "damageHero",
      "amount": 2
    },
    "noArtwork": false
  },
  "battlefield_salvage": {
    "id": "battlefield_salvage",
    "name": "战地回收",
    "faction": "empire",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "获得 2 点护甲；抽 1 张牌。",
    "flavor": "战场上没有废物，只有还没拆开的零件。",
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 1
    },
    "noArtwork": false
  },
  "quartermaster": {
    "id": "quartermaster",
    "name": "军需官",
    "faction": "empire",
    "type": "minion",
    "cost": 3,
    "attack": 3,
    "health": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你有护甲，抽 1 张牌。",
    "flavor": "他发的不只是补给，还有继续打下去的理由。",
    "battlecry": {
      "type": "drawIfArmor",
      "draw": 1
    },
    "noArtwork": false
  },
  "bounty_clerk": {
    "id": "bounty_clerk",
    "name": "悬赏书记",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：将一个敌方随从列入悬赏名单；若它已经是悬赏目标，抽 1 张牌。",
    "flavor": "名单上的字越少，价格越高。",
    "battlecry": {
      "type": "markBountyDrawIfMarked",
      "draw": 1
    },
    "noArtwork": false
  },
  "bounty_accountant": {
    "id": "bounty_accountant",
    "name": "赏金会计",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：每当你完成一次悬赏，恢复 2 点生命。",
    "flavor": "他把血账算成了流水。",
    "passive": {
      "type": "bountyClaimHeal",
      "heal": 2
    },
    "noArtwork": false
  },
  "execution_supervisor": {
    "id": "execution_supervisor",
    "name": "处刑督办",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 4,
    "attack": 4,
    "health": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "rush",
      "passive"
    ],
    "target": "none",
    "text": "先遣。被动：攻击悬赏名单上的随从时，获得 +2/+0。",
    "flavor": "督办只负责确认：名单上的人，确实不在了。",
    "passive": {
      "type": "attackBountyBonus",
      "attack": 2
    },
    "noArtwork": false
  },
  "venom_attendant": {
    "id": "venom_attendant",
    "name": "蚀毒侍从",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "poisonous"
    ],
    "target": "none",
    "text": "蚀毒。",
    "flavor": "他递茶的时候，手从不抖。",
    "noArtwork": false
  },
  "poison_mist_thrower": {
    "id": "poison_mist_thrower",
    "name": "毒雾投手",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：对一个敌方随从造成 1 点伤害；若它已带有蚀毒，改为 3 点。",
    "flavor": "雾散之前，没人知道该先咳还是先跑。",
    "battlecry": {
      "type": "damageIfPoisoned",
      "amount": 1,
      "bonus": 3
    },
    "noArtwork": false
  },
  "venom_blade": {
    "id": "venom_blade",
    "name": "淬毒刀锋",
    "faction": "greyharbor",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "target": "friendly",
    "text": "使一个友方随从获得蚀毒；抽 1 张牌。",
    "flavor": "刀不用快，毒会替它追上。",
    "spell": {
      "type": "grantPoisonDraw",
      "draw": 1
    },
    "noArtwork": false
  },
  "venom_sac_guard": {
    "id": "venom_sac_guard",
    "name": "毒囊守卫",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "poisonous",
      "deathrattle"
    ],
    "target": "none",
    "text": "守备。蚀毒。余响：对敌方领袖造成 2 点伤害。",
    "flavor": "他挡在前面，是为了让毒囊最后才破。",
    "deathrattle": {
      "type": "damageHero",
      "amount": 2
    },
    "noArtwork": false
  },
  "blackmarket_bodyguard": {
    "id": "blackmarket_bodyguard",
    "name": "黑市保镖",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 3,
    "attack": 3,
    "health": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "divineShield"
    ],
    "target": "none",
    "text": "格挡。",
    "flavor": "黑市最值钱的东西，是活着离开。",
    "noArtwork": false
  },
  "silence_informant": {
    "id": "silence_informant",
    "name": "封口线人",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：沉默一个敌方随从；若它是悬赏目标，抽 1 张牌。",
    "flavor": "他知道太多，所以只负责让别人不知道。",
    "battlecry": {
      "type": "silenceIfBountyDraw"
    },
    "noArtwork": false
  },
  "commission_advance": {
    "id": "commission_advance",
    "name": "佣金预支",
    "faction": "greyharbor",
    "type": "spell",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "抽 1 张牌；若本回合完成过悬赏，再抽 1 张。",
    "flavor": "先拿钱，再办事；灰港的规矩一直很灵活。",
    "spell": {
      "type": "drawIfBountyThisTurn",
      "draw": 1,
      "bonus": 1
    },
    "noArtwork": false
  },
  "greyharbor_broker": {
    "id": "greyharbor_broker",
    "name": "灰港掮客",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "divineShield",
      "battlecry"
    ],
    "target": "friendly",
    "text": "格挡。登场：使一个友方随从获得 +1/+1。",
    "flavor": "他不站队，他只抽成。",
    "battlecry": {
      "type": "buffAlly",
      "attack": 1,
      "health": 1
    },
    "noArtwork": false
  }
});

  Object.assign(CARDS, {
  "pulse_herbalist": {
    "id": "pulse_herbalist",
    "name": "脉流采药人",
    "faction": "pus",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "药草长在地脉最浅的地方。",
    "battlecry": {
      "type": "healHero",
      "amount": 2
    },
    "noArtwork": false
  },
  "reflux_physician": {
    "id": "reflux_physician",
    "name": "回流医师",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：恢复你的领袖 3 点生命。",
    "flavor": "她把每一次退潮都记成一次复诊。",
    "deathrattle": {
      "type": "healHero",
      "amount": 3
    },
    "noArtwork": false
  },
  "vein_needle": {
    "id": "vein_needle",
    "name": "地脉织针",
    "faction": "pus",
    "type": "minion",
    "cost": 1,
    "attack": 1,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：流脉 +1；引脉 3：获得 +1 攻击和守备。",
    "flavor": "针脚沿着地脉走，线就不会断。",
    "battlecry": {
      "type": "veinBuff",
      "amount": 1,
      "vein": 3,
      "attack": 1,
      "health": 0
    },
    "noArtwork": false
  },
  "deepvein_guard": {
    "id": "deepvein_guard",
    "name": "深脉守卫",
    "faction": "pus",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 5,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "battlecry"
    ],
    "target": "none",
    "text": "守备。登场：恢复所有友方随从 2 点生命。",
    "flavor": "他守的不是门，是门后面的泉眼。",
    "battlecry": {
      "type": "healAllAllies",
      "amount": 2
    },
    "noArtwork": false
  },
  "spring_watcher": {
    "id": "spring_watcher",
    "name": "泉眼守望",
    "faction": "pus",
    "type": "minion",
    "cost": 5,
    "attack": 3,
    "health": 6,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "battlecry"
    ],
    "target": "none",
    "text": "守备。登场：恢复所有友方随从 2 点生命。",
    "flavor": "泉眼不出声，但所有人都知道它在那里。",
    "battlecry": {
      "type": "healAllAllies",
      "amount": 2
    },
    "noArtwork": false
  },
  "formation_watcher": {
    "id": "formation_watcher",
    "name": "旗阵守望",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt",
      "battlecry"
    ],
    "target": "none",
    "text": "守备。登场：同阵位其他友方随从获得 +0/+1。",
    "flavor": "旗子立起来之后，守望才真正开始。",
    "battlecry": {
      "type": "formationBanner",
      "attack": 0,
      "health": 1,
      "taunt": false
    },
    "noArtwork": false
  },
  "formation_officer": {
    "id": "formation_officer",
    "name": "地脉阵线官",
    "faction": "pus",
    "type": "minion",
    "cost": 4,
    "attack": 3,
    "health": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若该阵位有阵型，获得 +0/+1 并抽 1 张牌。",
    "flavor": "她负责让阵线从纸上站到地上。",
    "battlecry": {
      "type": "formationPayoff"
    },
    "noArtwork": false
  },
  "survey_apprentice": {
    "id": "survey_apprentice",
    "name": "测绘学徒",
    "faction": "pus",
    "type": "minion",
    "cost": 1,
    "attack": 1,
    "health": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你使用过阵型卡，抽 1 张牌。",
    "flavor": "先学会量地，再学会量人心。",
    "battlecry": {
      "type": "drawIfFormation",
      "draw": 1
    },
    "noArtwork": false
  },
  "pulse_recorder": {
    "id": "pulse_recorder",
    "name": "回脉记录员",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：恢复你的领袖 2 点生命；若同阵位有其他友方，抽 1 张牌。",
    "flavor": "她记下每一次回流，也记下谁还站着。",
    "deathrattle": {
      "type": "healDrawIfZoneAlly",
      "heal": 2,
      "draw": 1
    },
    "noArtwork": false
  },
  "arcane_scribe": {
    "id": "arcane_scribe",
    "name": "奥能抄写员",
    "faction": "academy",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：本回合你的下一张战术牌行动力消耗 -1。",
    "flavor": "她把咒语抄在更便宜的纸上。",
    "battlecry": {
      "type": "discountSpell",
      "amount": 1
    },
    "noArtwork": false
  },
  "index_assistant": {
    "id": "index_assistant",
    "name": "索引助手",
    "faction": "academy",
    "type": "minion",
    "cost": 1,
    "attack": 1,
    "health": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "她记不住内容，但记得内容在哪一页。",
    "battlecry": {
      "type": "draw",
      "amount": 1
    },
    "noArtwork": false
  },
  "blood_corpse_collector": {
    "id": "blood_corpse_collector",
    "name": "血祭收尸人",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "attack": 3,
    "health": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：恢复你的领袖 2 点生命。",
    "flavor": "在他眼里，尸体只是还没结算的账。",
    "deathrattle": {
      "type": "healHero",
      "amount": 2
    },
    "noArtwork": false
  },
  "monster_command": {
    "id": "monster_command",
    "name": "魔物号令",
    "faction": "xizhao",
    "type": "spell",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "target": "none",
    "text": "召唤一个 3/3 的洛斯汰巨兽。",
    "flavor": "号角一响，潮里就会站起来东西。",
    "spell": {
      "type": "summonMonster",
      "doubleIfZoneEmpty": false
    },
    "noArtwork": false
  },
  "phalanx_drill": {
    "id": "phalanx_drill",
    "name": "方阵教习",
    "faction": "republic",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你控制其他守备随从，获得 +0/+1。",
    "flavor": "方阵不是站出来的，是练出来的。",
    "battlecry": {
      "type": "buffSelfIfTaunt",
      "health": 1
    },
    "noArtwork": false
  },
  "forge_technician": {
    "id": "forge_technician",
    "name": "锻炉技师",
    "faction": "empire",
    "type": "minion",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 3 点护甲。",
    "flavor": "他不是在修炮，是在给炮加一层皮。",
    "battlecry": {
      "type": "armor",
      "amount": 3
    },
    "noArtwork": false
  },
  "armory_keeper": {
    "id": "armory_keeper",
    "name": "军械库管理员",
    "faction": "empire",
    "type": "minion",
    "cost": 2,
    "attack": 2,
    "health": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你有护甲，抽 1 张牌。",
    "flavor": "库存清单比战场伤亡表还长。",
    "battlecry": {
      "type": "drawIfArmor",
      "draw": 1
    },
    "noArtwork": false
  }
});

  Object.assign(CARDS, {
  "ksetra_instructor": {
    "id": "ksetra_instructor",
    "name": "学院部教官",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你使用过阵型卡，抽 1 张牌。",
    "flavor": "她把课程表排成了阵线。",
    "noArtwork": true,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "drawIfFormation",
      "draw": 1
    }
  },
  "coordination_dispatcher": {
    "id": "coordination_dispatcher",
    "name": "协调部调度员",
    "faction": "pus",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "friendly",
    "text": "登场：使一个友方随从获得 +0/+1。",
    "flavor": "先确认窗口，再确认人。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "buffAlly",
      "attack": 0,
      "health": 1
    }
  },
  "security_sentry": {
    "id": "security_sentry",
    "name": "保卫部哨兵",
    "faction": "pus",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "他守的是一扇不写门牌的门。",
    "noArtwork": true,
    "attack": 1,
    "health": 3
  },
  "research_sampler": {
    "id": "research_sampler",
    "name": "科研部采样员",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：流脉 +1；引脉 3：获得 +1 攻击和守备。",
    "flavor": "样本要新鲜，结论可以晚一点。",
    "noArtwork": true,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "veinBuff",
      "amount": 1,
      "vein": 3,
      "attack": 1,
      "health": 0
    }
  },
  "medical_stretcher": {
    "id": "medical_stretcher",
    "name": "医疗部担架员",
    "faction": "pus",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "担架往哪边走，哪边就先安静。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "logistics_warden": {
    "id": "logistics_warden",
    "name": "后勤部仓管",
    "faction": "pus",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "清单上少一件，前线上就少一条命。",
    "noArtwork": true,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "floating_route": {
    "id": "floating_route",
    "name": "浮空航线",
    "faction": "pus",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "航线不在地图上，只在学院的预算里。",
    "noArtwork": true,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "council_gallery": {
    "id": "council_gallery",
    "name": "议事会旁听席",
    "faction": "pus",
    "type": "formation",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "旁听席不投票，只记录谁先眨眼。",
    "noArtwork": true,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "ksetra_beacon": {
    "id": "ksetra_beacon",
    "name": "凯斯特信标",
    "faction": "pus",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲；抽 1 张牌。",
    "flavor": "信标亮起时，岛上的风向会先变。",
    "noArtwork": true,
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 1
    }
  },
  "coordinator_order": {
    "id": "coordinator_order",
    "name": "高级协调者令",
    "faction": "pus",
    "type": "spell",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "恢复你的领袖 3 点生命；抽 1 张牌。",
    "flavor": "协调不是让所有人满意，是让所有人先别动。",
    "noArtwork": true,
    "spell": {
      "type": "healHeroDraw",
      "heal": 3,
      "draw": 1
    }
  },
  "quin_records": {
    "id": "quin_records",
    "name": "记录官奎因",
    "faction": "academy",
    "type": "minion",
    "cost": 4,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "档案里最危险的不是秘密，是被写下来的秘密。",
    "noArtwork": true,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "cassian_foreign": {
    "id": "cassian_foreign",
    "name": "外务官卡西安",
    "faction": "academy",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：发现一张战术牌。",
    "flavor": "他站在两座议会之间，替两边都不说话。",
    "noArtwork": true,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "discover",
      "pool": "spell"
    }
  },
  "council_elder": {
    "id": "council_elder",
    "name": "议事会元老",
    "faction": "academy",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：每当你施放一张战术牌，抽 1 张牌。",
    "flavor": "我们这一代的任务，是让世界不要更坏。",
    "noArtwork": true,
    "attack": 2,
    "health": 3,
    "passive": {
      "type": "spellDrawOne"
    }
  },
  "pure_theorist": {
    "id": "pure_theorist",
    "name": "纯理论派学者",
    "faction": "academy",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：本回合你的下一张战术牌行动力消耗 -1。",
    "flavor": "所有分类都可能是错的，包括这一句。",
    "noArtwork": true,
    "attack": 1,
    "health": 3,
    "battlecry": {
      "type": "discountSpell",
      "amount": 1
    }
  },
  "gok_engineer": {
    "id": "gok_engineer",
    "name": "戈克工程派工程师",
    "faction": "academy",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "把异常当误差，工程就能继续。",
    "noArtwork": true,
    "attack": 3,
    "health": 3,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "magic_lecturer": {
    "id": "magic_lecturer",
    "name": "魔法经验派讲席",
    "faction": "academy",
    "type": "minion",
    "cost": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "讲席。",
    "flavor": "经验不会解释自己，只会重复自己。",
    "noArtwork": true,
    "attack": 3,
    "health": 5
  },
  "archive_keeper": {
    "id": "archive_keeper",
    "name": "封存库管理员",
    "faction": "academy",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：抽 1 张牌。",
    "flavor": "封存不是忘记，是换一把锁。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "deathrattle": {
      "type": "draw",
      "amount": 1
    }
  },
  "school_debate": {
    "id": "school_debate",
    "name": "学派辩论",
    "faction": "academy",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌；若你本回合已施放过战术牌，再抽 1 张。",
    "flavor": "三派吵到最后，只同意下次继续吵。",
    "noArtwork": true,
    "spell": {
      "type": "drawIfSpellPlayed",
      "draw": 1,
      "bonus": 1
    }
  },
  "floating_library": {
    "id": "floating_library",
    "name": "浮空图书馆",
    "faction": "academy",
    "type": "formation",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "书架浮在云上，借书证压在石头下。",
    "noArtwork": true,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "record_clerk": {
    "id": "record_clerk",
    "name": "记录员",
    "faction": "academy",
    "type": "minion",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 1 点护甲。",
    "flavor": "他记下每一笔，包括你不想被记的那笔。",
    "noArtwork": true,
    "attack": 1,
    "health": 2,
    "battlecry": {
      "type": "armor",
      "amount": 1
    }
  },
  "blood_elder": {
    "id": "blood_elder",
    "name": "血族长老",
    "faction": "xizhao",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "血祭 2：获得 +2/+2。",
    "flavor": "年轻人用刀，老人用名字。",
    "noArtwork": true,
    "attack": 4,
    "health": 4,
    "bloodCost": 2,
    "battlecry": {
      "type": "bloodBuff",
      "attack": 2,
      "health": 2
    }
  },
  "tribal_shaman": {
    "id": "tribal_shaman",
    "name": "部落萨满",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤一个 1/1 洛斯汰魔物；若你控制其他魔物，获得 +1/+1。",
    "flavor": "骨头响的时候，潮水会回答。",
    "noArtwork": true,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "summonImpBuffSelf"
    }
  },
  "broken_bone_warlord": {
    "id": "broken_bone_warlord",
    "name": "断骨战帅",
    "faction": "xizhao",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "他不管阵线，只管骨头断在哪。",
    "noArtwork": true,
    "attack": 4,
    "health": 3
  },
  "losutai_awakened": {
    "id": "losutai_awakened",
    "name": "洛斯汰觉醒者",
    "faction": "xizhao",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤一个 1/1 洛斯汰魔物。",
    "flavor": "它第一次听见自己的名字，是在血里。",
    "noArtwork": true,
    "attack": 3,
    "health": 5,
    "battlecry": {
      "type": "summon",
      "token": "losutai_imp"
    }
  },
  "blood_debt": {
    "id": "blood_debt",
    "name": "血账",
    "faction": "xizhao",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "friendly",
    "text": "对一个友方随从造成 1 点伤害；抽 1 张牌。",
    "flavor": "血账不记钱，只记谁还站着。",
    "noArtwork": true,
    "spell": {
      "type": "friendlyDamageDraw",
      "amount": 1,
      "draw": 1
    }
  },
  "blood_infiltrator": {
    "id": "blood_infiltrator",
    "name": "血族渗透者",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "stealth"
    ],
    "target": "none",
    "text": "隐匿。",
    "flavor": "他从不在白天进门。",
    "noArtwork": true,
    "attack": 2,
    "health": 3
  },
  "ancient_fortress_scion": {
    "id": "ancient_fortress_scion",
    "name": "古堡遗脉",
    "faction": "xizhao",
    "type": "minion",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "古堡的石头还在，只是没人记得门朝哪边。",
    "noArtwork": true,
    "attack": 5,
    "health": 5
  },
  "monster_nest": {
    "id": "monster_nest",
    "name": "魔物巢穴",
    "faction": "xizhao",
    "type": "formation",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+0。",
    "flavor": "巢穴不挑食，只挑位置。",
    "noArtwork": true,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "south_pole_tracker": {
    "id": "south_pole_tracker",
    "name": "南极追踪",
    "faction": "xizhao",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "雪会盖住脚印，但盖不住血。",
    "noArtwork": true,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "blood_feast": {
    "id": "blood_feast",
    "name": "血祭盛宴",
    "faction": "xizhao",
    "type": "spell",
    "cost": 5,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 2 点伤害。",
    "flavor": "桌子摆好，客人自己会来。",
    "noArtwork": true,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 2
    }
  },
  "stein_speaker": {
    "id": "stein_speaker",
    "name": "施泰因议长",
    "faction": "republic",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "秩序不是让所有人满意，是让所有人还能坐下。",
    "noArtwork": true,
    "attack": 4,
    "health": 5,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "williams_healer": {
    "id": "williams_healer",
    "name": "威廉莱斯治疗者",
    "faction": "republic",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "雪镇的医术，先救自己人，再救客人。",
    "noArtwork": true,
    "attack": 3,
    "health": 3,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "rosen_borderlord": {
    "id": "rosen_borderlord",
    "name": "罗森边境领主",
    "faction": "republic",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "边境的地图每年都要重画。",
    "noArtwork": true,
    "attack": 4,
    "health": 4
  },
  "eisenhut_newmoney": {
    "id": "eisenhut_newmoney",
    "name": "艾森胡特新钱",
    "faction": "republic",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "新钱最怕别人问第一桶金。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "seven_cities_envoy": {
    "id": "seven_cities_envoy",
    "name": "七城邦代表",
    "faction": "republic",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "七座城，七种礼貌。",
    "noArtwork": true,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "temple_priest": {
    "id": "temple_priest",
    "name": "神殿祭司",
    "faction": "republic",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "神官先记账，再祷告。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "mist_harbor_treaty": {
    "id": "mist_harbor_treaty",
    "name": "雾港和约",
    "faction": "republic",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "和约签在雾里，墨水比雾还淡。",
    "noArtwork": true,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "conscription_levy": {
    "id": "conscription_levy",
    "name": "征兵摊派",
    "faction": "republic",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "召唤两个 1/1 的共和国新兵。",
    "flavor": "每个领区都同意，只要先征别人家的孩子。",
    "noArtwork": true,
    "spell": {
      "type": "summonTwoTokens",
      "token": "republic_recruit",
      "count": 2
    }
  },
  "border_legion": {
    "id": "border_legion",
    "name": "边境军团",
    "faction": "republic",
    "type": "minion",
    "cost": 5,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "他们不守国界，只守下一顿饭。",
    "noArtwork": true,
    "attack": 4,
    "health": 5
  },
  "house_legacy": {
    "id": "house_legacy",
    "name": "家系传承",
    "faction": "republic",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得回潮；抽 1 张牌。",
    "flavor": "姓氏比血脉更会挑继承人。",
    "noArtwork": true,
    "spell": {
      "type": "rebornDraw",
      "draw": 1
    }
  },
  "otto_hand": {
    "id": "otto_hand",
    "name": "皇帝之手",
    "faction": "empire",
    "type": "minion",
    "cost": 4,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "皇帝不伸手，伸手的是账。",
    "noArtwork": true,
    "attack": 4,
    "health": 4,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "eisenwald_marshal": {
    "id": "eisenwald_marshal",
    "name": "艾森瓦尔德元帅",
    "faction": "empire",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 3 点护甲。",
    "flavor": "彻底胜利在军部，平账在皇宫。",
    "noArtwork": true,
    "attack": 5,
    "health": 5,
    "battlecry": {
      "type": "armor",
      "amount": 3
    }
  },
  "imperial_guard_officer": {
    "id": "imperial_guard_officer",
    "name": "禁卫军官",
    "faction": "empire",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "禁卫守的是门，门后面是账本。",
    "noArtwork": true,
    "attack": 3,
    "health": 5
  },
  "lab_researcher": {
    "id": "lab_researcher",
    "name": "试验所研究员",
    "faction": "empire",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "数据不会喊疼，所以数据最干净。",
    "noArtwork": true,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "forge_engineer": {
    "id": "forge_engineer",
    "name": "工造技师",
    "faction": "empire",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "炉子不停，账就不会停。",
    "noArtwork": true,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "audit_accountant": {
    "id": "audit_accountant",
    "name": "审计院账房",
    "faction": "empire",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：若你有护甲，抽 1 张牌。",
    "flavor": "他算的不是钱，是谁还活着。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "drawIfArmor",
      "draw": 1
    }
  },
  "blackridge_mine": {
    "id": "blackridge_mine",
    "name": "黑脊矿脉",
    "faction": "empire",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+0。",
    "flavor": "黑脊脉一响，帝国的算盘就响。",
    "noArtwork": true,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "grain_convoy": {
    "id": "grain_convoy",
    "name": "粮线车队",
    "faction": "empire",
    "type": "minion",
    "cost": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "粮线越长，帝国越睡不着。",
    "noArtwork": true,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "iron_order_wall": {
    "id": "iron_order_wall",
    "name": "铁序城防",
    "faction": "empire",
    "type": "minion",
    "cost": 5,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "城墙按矿脉走向铺，连裂缝都很整齐。",
    "noArtwork": true,
    "attack": 4,
    "health": 6
  },
  "conscription_order": {
    "id": "conscription_order",
    "name": "征调令",
    "faction": "empire",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲；抽 1 张牌。",
    "flavor": "征调不是请求，是格式。",
    "noArtwork": true,
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 1
    }
  },
  "seran": {
    "id": "seran",
    "name": "「账房」瑟兰",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：将一个敌方随从列入悬赏名单；若它已经是悬赏目标，抽 1 张牌。",
    "flavor": "她不写你什么时候死。她只写，你值多少。",
    "noArtwork": true,
    "attack": 4,
    "health": 4,
    "battlecry": {
      "type": "markBountyDrawIfMarked",
      "draw": 1
    }
  },
  "vera": {
    "id": "vera",
    "name": "「替身」薇拉",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 4,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "friendly",
    "text": "登场：使一个友方随从获得 +2/+2。",
    "flavor": "合同背面写着：替死一次，价另算。",
    "noArtwork": true,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "buffAlly",
      "attack": 2,
      "health": 2
    }
  },
  "xiu": {
    "id": "xiu",
    "name": "「哑巴」修",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：沉默一个敌方随从。",
    "flavor": "整条街突然安静下来，说明生意谈成了。",
    "noArtwork": true,
    "attack": 4,
    "health": 4,
    "battlecry": {
      "type": "silence"
    }
  },
  "kugreen": {
    "id": "kugreen",
    "name": "「苦绿」",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 4,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "poisonous"
    ],
    "target": "none",
    "text": "蚀毒。",
    "flavor": "毒要抹在刀刃不反光的那一面。",
    "noArtwork": true,
    "attack": 3,
    "health": 3
  },
  "karan": {
    "id": "karan",
    "name": "「断线」卡兰",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤两个 1/1 的灰港小刀手。",
    "flavor": "他不管你去打谁，只问你几点回来交账。",
    "noArtwork": true,
    "attack": 6,
    "health": 6,
    "battlecry": {
      "type": "summonCount",
      "token": "gh_cutthroat",
      "count": 2
    }
  },
  "lamp_post": {
    "id": "lamp_post",
    "name": "灯柱界碑",
    "faction": "greyharbor",
    "type": "formation",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得先遣。",
    "flavor": "灯柱排到哪，灰港就管到哪。",
    "noArtwork": true,
    "formation": {
      "rush": true
    }
  },
  "ledger_constitution": {
    "id": "ledger_constitution",
    "name": "账本宪法",
    "faction": "greyharbor",
    "type": "spell",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌；若你完成过悬赏，再抽 1 张。",
    "flavor": "这是宪法，也是账单。",
    "noArtwork": true,
    "spell": {
      "type": "drawIfBountyClaimed",
      "draw": 2,
      "bonus": 1
    }
  },
  "five_guild_council": {
    "id": "five_guild_council",
    "name": "五行行首议会",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：随机将两个敌方随从列入悬赏名单。",
    "flavor": "五个人不坐一张桌子，只在账上互相认。",
    "noArtwork": true,
    "attack": 4,
    "health": 5,
    "battlecry": {
      "type": "markRandomBounties",
      "count": 2
    }
  },
  "broken_line_merc": {
    "id": "broken_line_merc",
    "name": "断线团佣兵",
    "faction": "greyharbor",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "不设防线，只设伏击点。",
    "noArtwork": true,
    "attack": 4,
    "health": 3
  },
  "toll_account": {
    "id": "toll_account",
    "name": "过路账",
    "faction": "greyharbor",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "enemy",
    "text": "将一个敌方随从列入悬赏名单；抽 1 张牌。",
    "flavor": "谁控制灰港，谁就能对过路船收账。",
    "noArtwork": true,
    "spell": {
      "type": "drawMark",
      "draw": 1
    }
  },
  "mist_harbor_city": {
    "id": "mist_harbor_city",
    "name": "雾港城",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "靠修锚起家的城，先学会修别人的船。",
    "noArtwork": true,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "white_reef_lighthouse": {
    "id": "white_reef_lighthouse",
    "name": "白礁灯塔",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "灯塔只负责亮，不负责解释雾。",
    "noArtwork": true,
    "attack": 1,
    "health": 4
  },
  "anvil_town_smith": {
    "id": "anvil_town_smith",
    "name": "铁砧镇锻工",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 1 点护甲。",
    "flavor": "铁砧镇的锤子，一半替帝国干活。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "armor",
      "amount": 1
    }
  },
  "northern_nomad": {
    "id": "northern_nomad",
    "name": "北境游牧民",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "帝国年年征抚，他们年年往北。",
    "noArtwork": true,
    "attack": 2,
    "health": 2
  },
  "losutai_refugee": {
    "id": "losutai_refugee",
    "name": "洛斯汰流民",
    "faction": "neutral",
    "type": "minion",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "流离。",
    "flavor": "它没有阵营，只有下一处水源。",
    "noArtwork": true,
    "attack": 1,
    "health": 2
  },
  "snow_capital_remnant": {
    "id": "snow_capital_remnant",
    "name": "雪都遗民",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "他们不叫自己雪都人，只叫自己还活着的人。",
    "noArtwork": true,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "wandering_singer": {
    "id": "wandering_singer",
    "name": "行吟歌手",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "今晚流脉改道，北港的灯又暗了三分。",
    "noArtwork": true,
    "attack": 1,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "gok_lamp": {
    "id": "gok_lamp",
    "name": "戈克暖灯",
    "faction": "neutral",
    "type": "spell",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲。",
    "flavor": "灯随流脉明灭，账单不随。",
    "noArtwork": true,
    "spell": {
      "type": "armor",
      "amount": 2
    }
  },
  "sky_ship": {
    "id": "sky_ship",
    "name": "浮空舰",
    "faction": "neutral",
    "type": "minion",
    "cost": 5,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "学院的航线，不在地图上。",
    "noArtwork": true,
    "attack": 4,
    "health": 5
  },
  "card_shark": {
    "id": "card_shark",
    "name": "赌桌老手",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "他只输过一次，那次是故意输的。",
    "noArtwork": true,
    "attack": 3,
    "health": 3
  },
  "free_merc": {
    "id": "free_merc",
    "name": "自由佣兵",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "谁付钱，谁就是今天的主义。",
    "noArtwork": true,
    "attack": 3,
    "health": 3
  },
  "fog_navigator": {
    "id": "fog_navigator",
    "name": "雾港领航员",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "雾薄的时候走航道，雾厚的时候走账道。",
    "noArtwork": true,
    "attack": 1,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "north_beast_tamer": {
    "id": "north_beast_tamer",
    "name": "北境驯兽人",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤一个 1/1 的洛斯汰魔物。",
    "flavor": "北境的兽，先认人，再认旗。",
    "noArtwork": true,
    "attack": 3,
    "health": 3,
    "battlecry": {
      "type": "summon",
      "token": "losutai_imp"
    }
  },
  "small_state_envoy": {
    "id": "small_state_envoy",
    "name": "小国使节",
    "faction": "neutral",
    "type": "minion",
    "cost": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 2 点护甲。",
    "flavor": "小国的礼貌，是最后一道防线。",
    "noArtwork": true,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "armor",
      "amount": 2
    }
  },
  "smuggler_ship": {
    "id": "smuggler_ship",
    "name": "走私船",
    "faction": "neutral",
    "type": "spell",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "船舱里没有货，只有货的名字。",
    "noArtwork": true,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "white_reef_keeper": {
    "id": "white_reef_keeper",
    "name": "白礁守灯人",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "他守灯，也守灯照不到的地方。",
    "noArtwork": true,
    "attack": 1,
    "health": 4
  },
  "anvil_town_miner": {
    "id": "anvil_town_miner",
    "name": "铁砧镇矿工",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "矿灯一亮，影子就多一个。",
    "noArtwork": true,
    "attack": 2,
    "health": 3
  },
  "fog_accountant": {
    "id": "fog_accountant",
    "name": "雾港会计",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "雾港的账，最后由雾来对。",
    "noArtwork": true,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "no_mans_land": {
    "id": "no_mans_land",
    "name": "无主之地",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+0。",
    "flavor": "没有旗，只有先到的人。",
    "noArtwork": true,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "dusk_inn": {
    "id": "dusk_inn",
    "name": "黄昏旅店",
    "faction": "neutral",
    "type": "spell",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "恢复你的领袖 2 点生命；抽 1 张牌。",
    "flavor": "住店可以赊账，听故事不行。",
    "noArtwork": true,
    "spell": {
      "type": "healHeroDraw",
      "heal": 2,
      "draw": 1
    }
  },
  "world_map": {
    "id": "world_map",
    "name": "世界地图",
    "faction": "neutral",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "地图边缘写着：此处未测绘。",
    "noArtwork": true,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "gok_lampwright": {
    "id": "gok_lampwright",
    "name": "戈克暖灯匠",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 1 点护甲。",
    "flavor": "他修灯，也修灯下的沉默。",
    "noArtwork": true,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "armor",
      "amount": 1
    }
  }
});

  for (const id of ["ancient_fortress_scion","anvil_town_miner","anvil_town_smith","archive_keeper","audit_accountant","blackridge_mine","blood_debt","blood_elder","blood_feast","blood_infiltrator","border_legion","broken_bone_warlord","broken_line_merc","card_shark","cassian_foreign","conscription_levy","conscription_order","coordination_dispatcher","coordinator_order","council_elder","council_gallery","dusk_inn","eisenhut_newmoney","eisenwald_marshal","five_guild_council","floating_library","floating_route","fog_accountant","fog_navigator","forge_engineer","free_merc","gok_engineer","gok_lamp","gok_lampwright","grain_convoy","house_legacy","imperial_guard_officer","iron_order_wall","karan","ksetra_beacon","ksetra_instructor","kugreen","lab_researcher","lamp_post","ledger_constitution","logistics_warden","losutai_awakened","losutai_refugee","magic_lecturer","medical_stretcher","mist_harbor_city","mist_harbor_treaty","monster_nest","no_mans_land","north_beast_tamer","northern_nomad","otto_hand","pure_theorist","quin_records","record_clerk","research_sampler","rosen_borderlord","school_debate","security_sentry","seran","seven_cities_envoy","sky_ship","small_state_envoy","smuggler_ship","snow_capital_remnant","south_pole_tracker","stein_speaker","temple_priest","toll_account","tribal_shaman","vera","wandering_singer","white_reef_keeper","white_reef_lighthouse","williams_healer","world_map","xiu"]) if (CARDS[id]) CARDS[id].noArtwork = false;

  const RARITY_OVERRIDES = {
 "shextena": "legendary",
 "verious": "legendary",
 "timon": "legendary",
 "aidric": "legendary",
 "orlicas": "legendary",
 "miyuki": "legendary",
 "bulwark_lieutenant": "epic",
 "formation_officer": "epic",
 "vein_engineer": "epic",
 "coordinator_order": "epic",
 "formation_weaver": "epic",
 "excavation_titan": "epic",
 "vein_attendant": "epic",
 "spring_watcher": "epic",
 "vein_oracle": "epic",
 "deepvein_guard": "epic",
 "council_gallery": "rare",
 "formation_bastion": "rare",
 "formation_artificer": "rare",
 "formation_watcher": "rare",
 "ksetra_instructor": "rare",
 "pulse_banner": "rare",
 "pulse_recorder": "rare",
 "reflux_physician": "rare",
 "research_sampler": "rare",
 "zone_keeper": "rare",
 "formation_vein": "rare",
 "formation_bugler": "rare",
 "ksetra_beacon": "rare",
 "vein_siphon": "rare",
 "guard": "common",
 "logistics_warden": "common",
 "spring_medic": "common",
 "coordination_dispatcher": "common",
 "field_medic": "common",
 "medical_stretcher": "common",
 "pulse_herbalist": "common",
 "vein_foreman": "common",
 "coordination": "common",
 "emergency": "common",
 "floating_route": "common",
 "resonance": "common",
 "vein_echo": "common",
 "courier": "common",
 "ley_surveyor": "common",
 "medic_apprentice": "common",
 "survey_apprentice": "common",
 "vein_needle": "common",
 "vein_scout": "common",
 "security_sentry": "common",
 "karl_desmond": "legendary",
 "justus": "legendary",
 "cassian": "legendary",
 "samuel": "legendary",
 "nina": "legendary",
 "quin_records": "legendary",
 "spellstorm": "epic",
 "arcane_theorist": "epic",
 "frost_professor": "epic",
 "echo_adept": "epic",
 "floating_library": "epic",
 "echo_observer": "epic",
 "arcane_surge": "epic",
 "spell_conductor": "epic",
 "double_formula": "epic",
 "frost_scribe": "epic",
 "reflux_apprentice": "rare",
 "arcane_conduit": "rare",
 "formation_script": "rare",
 "formula_fix": "rare",
 "cassian_foreign": "rare",
 "council_elder": "rare",
 "frost_line_guard": "rare",
 "frost_page": "rare",
 "spell_echo": "rare",
 "zone_archivist": "rare",
 "white_frost_hall": "rare",
 "combo_spark": "rare",
 "arcane_scribe": "rare",
 "archive_keeper": "rare",
 "frost_archivist": "common",
 "page_scholar": "common",
 "pure_theorist": "common",
 "armor_break": "common",
 "borrow_vein": "common",
 "mana_surge": "common",
 "lecturer": "common",
 "gok_engineer": "common",
 "prohibition": "common",
 "frost_seal": "common",
 "insight": "common",
 "school_debate": "common",
 "index_assistant": "common",
 "record_clerk": "common",
 "spell_novice": "common",
 "magic_lecturer": "common",
 "archive_search": "common",
 "debate": "common",
 "double_column_note": "common",
 "doorman": "common",
 "tiega": "legendary",
 "lanxi": "legendary",
 "lize": "legendary",
 "grayfeather": "legendary",
 "lanzhou": "legendary",
 "blood_elder": "legendary",
 "molan": "epic",
 "tide_colossus": "epic",
 "losutai_matriarch": "epic",
 "blood_executor": "epic",
 "brood_matron": "epic",
 "devourer": "epic",
 "ancient_fortress_scion": "epic",
 "blood_altar": "epic",
 "blood_contract": "epic",
 "broken_bone_warlord": "epic",
 "reflux": "rare",
 "pressure_warlock": "rare",
 "blood_priestess": "rare",
 "blood_feast": "rare",
 "losutai_awakened": "rare",
 "formation_tide": "rare",
 "monster_nest": "rare",
 "blood_pool": "rare",
 "blood_corpse_collector": "rare",
 "bloodroad_guide": "rare",
 "monster_overseer": "rare",
 "tribal_shaman": "rare",
 "blood_acolyte": "rare",
 "blood_pact_collector": "rare",
 "blood_pact": "common",
 "blood_path": "common",
 "reborn_rite": "common",
 "venom_fang": "common",
 "monster_summon": "common",
 "losutai_hunter": "common",
 "blood_servant": "common",
 "blood_wraith": "common",
 "hunt_ritual": "common",
 "monster_command": "common",
 "blood_duelist": "common",
 "tide_scout": "common",
 "blood_debt": "common",
 "blood_incense_divination": "common",
 "blood_ritual": "common",
 "shadow_raid": "common",
 "south_pole_tracker": "common",
 "tribal_warrior": "common",
 "blood_infiltrator": "common",
 "blood_imp": "common",
 "konrad": "legendary",
 "erhardt": "legendary",
 "beatrix": "legendary",
 "elena": "legendary",
 "hans": "legendary",
 "stein_speaker": "legendary",
 "cedric": "epic",
 "shield_marshal": "epic",
 "bastion_captain": "epic",
 "phalanx_executor": "epic",
 "phalanx_warden": "epic",
 "shield_sergeant": "epic",
 "zone_banner": "epic",
 "impeachment": "epic",
 "iron_wall": "epic",
 "rosen_borderlord": "epic",
 "iron_phalanx": "rare",
 "house_legacy": "rare",
 "eisenhut_newmoney": "rare",
 "shield_instructor": "rare",
 "williams_healer": "rare",
 "formation_wall": "rare",
 "echo_standard": "rare",
 "drill_sergeant": "rare",
 "aegis_guard": "rare",
 "anti_rush": "rare",
 "battlefield_bill": "rare",
 "combo_shield": "rare",
 "conscription_levy": "rare",
 "emergency_bill": "rare",
 "reborn_sentry": "common",
 "martial_law": "common",
 "seven_cities_envoy": "common",
 "shield_bearer": "common",
 "line_spearman": "common",
 "phalanx_drill": "common",
 "recruiter": "common",
 "republic_guard": "common",
 "temple_priest": "common",
 "border_legion": "common",
 "levy": "common",
 "mist_harbor_treaty": "common",
 "wall_recruit": "common",
 "fortify": "common",
 "line_rotation": "common",
 "parliament_debate": "common",
 "volley": "common",
 "reborn_shield_guard": "common",
 "bulwark_sentry": "common",
 "shield_recruit": "common",
 "gunther": "legendary",
 "klaus": "legendary",
 "mia": "legendary",
 "elsa": "legendary",
 "karl_schwarz": "legendary",
 "eisenwald_marshal": "legendary",
 "walter": "epic",
 "otto_hand": "epic",
 "siege_captain": "epic",
 "iron_artillery": "epic",
 "armor_volley": "epic",
 "zone_barrage": "epic",
 "armor_mortar": "epic",
 "powder_keg": "epic",
 "siege_train": "epic",
 "powder_marshal": "epic",
 "wind_cannon": "rare",
 "powder_foreman": "rare",
 "powder_martyr": "rare",
 "formation_cannon": "rare",
 "detonation_sapper": "rare",
 "lab_researcher": "rare",
 "overload_gunner": "rare",
 "blackridge_mine": "rare",
 "audit_accountant": "rare",
 "ironflow_charge": "rare",
 "quarantine": "rare",
 "war_tax": "rare",
 "imperial_guard_officer": "rare",
 "iron_mechanic": "rare",
 "rush_lancer": "common",
 "grain_convoy": "common",
 "martial_court": "common",
 "mobilize": "common",
 "forge_engineer": "common",
 "forge_technician": "common",
 "quartermaster": "common",
 "armor_recycle": "common",
 "fortress": "common",
 "armory_keeper": "common",
 "empire_guard": "common",
 "powder_apprentice": "common",
 "zhenmai_artisan": "common",
 "iron_order_wall": "common",
 "armor_drive": "common",
 "battlefield_salvage": "common",
 "conscription_order": "common",
 "barrage": "common",
 "ironclad": "common",
 "powder_boy": "common",
 "seran": "legendary",
 "vera": "legendary",
 "xiu": "legendary",
 "kugreen": "legendary",
 "karan": "legendary",
 "gh_bounty_king": "legendary",
 "gh_captain": "epic",
 "gh_legend_assassin": "epic",
 "gh_company": "epic",
 "gh_silence_master": "epic",
 "execution_supervisor": "epic",
 "five_guild_council": "epic",
 "gh_bounty_collector": "epic",
 "venom_sac_guard": "epic",
 "gh_venom_behemoth": "epic",
 "gh_bounty_verdict": "epic",
 "gh_execution_contract": "rare",
 "ledger_constitution": "rare",
 "gh_scorpion": "rare",
 "gh_shield_broker": "rare",
 "bounty_accountant": "rare",
 "gh_silence_expert": "rare",
 "poison_mist_thrower": "rare",
 "gh_formation": "rare",
 "gh_assassinate_contract": "rare",
 "gh_ledger": "rare",
 "gh_silence_field": "rare",
 "bounty_clerk": "rare",
 "gh_bounty_hunter": "rare",
 "silence_informant": "rare",
 "lamp_post": "common",
 "venom_blade": "common",
 "gh_venom_shield": "common",
 "greyharbor_broker": "common",
 "gh_black_market": "common",
 "gh_silencer": "common",
 "gh_bodyguard_contract": "common",
 "gh_quick_strike": "common",
 "toll_account": "common",
 "commission_advance": "common",
 "gh_bounty_notice": "common",
 "blackmarket_bodyguard": "common",
 "broken_line_merc": "common",
 "gh_shield_mercenary": "common",
 "gh_poison_thrower": "common",
 "gh_rush_archer": "common",
 "gh_contract_squire": "common",
 "gh_cutthroat": "common",
 "gh_venom_apprentice": "common",
 "venom_attendant": "common"
};
  for (const id of Object.keys(RARITY_OVERRIDES)) if (CARDS[id]) CARDS[id].rarity = RARITY_OVERRIDES[id];
  const CORE_LEGENDARY_IDS = new Set(["shextena","verious","timon","aidric","orlicas","miyuki","karl_desmond","justus","cassian","samuel","nina","quin_records","tiega","lanxi","lize","grayfeather","lanzhou","blood_elder","konrad","erhardt","beatrix","elena","hans","stein_speaker","gunther","klaus","mia","elsa","karl_schwarz","eisenwald_marshal","seran","vera","xiu","kugreen","karan","gh_bounty_king","void_titan","vein_leviathan","obsidian_colossus","world_serpent","faceless_king","grave_titan","final_bell"]);
  for (const c of Object.values(CARDS)) {
    if (c.copyLimit == null) {
      c.copyLimit = c.token ? 0 : c.type === "relic" || c.type === "equipment" ? 1 : c.type === "formation" ? 2 : CORE_LEGENDARY_IDS.has(c.id) ? 1 : 2;
    }
  }

  const EQUIPMENT_KINDS = {
    vein_heart: "trinket", formation_standard: "armor", spell_codex: "trinket", frost_prism: "trinket",
    blood_scythe: "weapon", blood_censer: "trinket", iron_banner: "armor", republic_seal: "trinket",
    powder_engine: "weapon", armor_forge: "armor", gh_bounty_board: "trinket", gh_venom_vial: "trinket",
    wanderer_charm: "trinket"
  };
  for (const c of Object.values(CARDS)) {
    if (c.type === "relic") {
      c.type = "equipment";
      c.equipmentKind = EQUIPMENT_KINDS[c.id] || "trinket";
      c.copyLimit = 1;
      c.text = String(c.text || "").replace(/^装备：/, "装备：");
    }
  }

  Object.assign(CARDS, {
  "ksetra_beacon_item": {
    "id": "ksetra_beacon_item",
    "name": "凯斯特信标·便携式",
    "faction": "pus",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌。",
    "flavor": "学院部把信标缩小到能塞进外套。",
    "copyLimit": 1,
    "equip": {
      "draw": 1
    }
  },
  "floating_anchor": {
    "id": "floating_anchor",
    "name": "浮空锚链",
    "faction": "pus",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "锚链落下时，浮空舰就不再飘了。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "tide_ward_bracer": {
    "id": "tide_ward_bracer",
    "name": "潮雾护腕",
    "faction": "pus",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 3 点护甲。",
    "flavor": "潮雾渗不进五部的袖口。",
    "copyLimit": 1,
    "equip": {
      "armor": 3
    }
  },
  "five_department_badge": {
    "id": "five_department_badge",
    "name": "五部联席徽章",
    "faction": "pus",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌；恢复领袖 2 点生命。",
    "flavor": "五个部门吵完，至少会共同签一个字。",
    "copyLimit": 1,
    "equip": {
      "draw": 1,
      "healHero": 2
    }
  },
  "floating_ink_blade": {
    "id": "floating_ink_blade",
    "name": "浮空墨刃",
    "faction": "academy",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "墨迹未干，刃口已经先到。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "frostweave_cloak": {
    "id": "frostweave_cloak",
    "name": "霜纹披风",
    "faction": "academy",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "披风上的霜纹会自己重排。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "whitefrost_bell": {
    "id": "whitefrost_bell",
    "name": "白霜钟",
    "faction": "academy",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 3 点生命。",
    "flavor": "钟声响起时，伤口会先安静。",
    "copyLimit": 1,
    "equip": {
      "healHero": 3
    }
  },
  "cataloging_lens": {
    "id": "cataloging_lens",
    "name": "编目镜",
    "faction": "academy",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 2 张牌。",
    "flavor": "看见的东西不一定存在，编入目录才算。",
    "copyLimit": 1,
    "equip": {
      "draw": 2
    }
  },
  "bone_fang_blade": {
    "id": "bone_fang_blade",
    "name": "骨牙长刀",
    "faction": "xizhao",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "刀柄上还留着上一任主人的牙印。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "beast_hide_armor": {
    "id": "beast_hide_armor",
    "name": "兽皮血甲",
    "faction": "xizhao",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "活着剥下来的皮，最懂得怎么挡刀。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "bloodbone_pauldron": {
    "id": "bloodbone_pauldron",
    "name": "血骨护肩",
    "faction": "xizhao",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲；友方随从获得 +0/+1。",
    "flavor": "每一块骨都记得自己属于谁。",
    "copyLimit": 1,
    "equip": {
      "armor": 2,
      "buffAllAllies": {
        "health": 1
      }
    }
  },
  "bloodmoon_bone_ring": {
    "id": "bloodmoon_bone_ring",
    "name": "血月骨环",
    "faction": "xizhao",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 2 点生命；抽 1 张牌。",
    "flavor": "血月下，连影子都要交税。",
    "copyLimit": 1,
    "equip": {
      "healHero": 2,
      "draw": 1
    }
  },
  "house_longsword": {
    "id": "house_longsword",
    "name": "家徽长剑",
    "faction": "republic",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "剑身上刻着七道家徽，没有一道是新的。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "border_lance": {
    "id": "border_lance",
    "name": "边境骑枪",
    "faction": "republic",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "骑枪比边境线更长。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "bluegold_breastplate": {
    "id": "bluegold_breastplate",
    "name": "蓝金胸甲",
    "faction": "republic",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "体面要穿在外面，甲要穿在里面。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "seven_cities_crest": {
    "id": "seven_cities_crest",
    "name": "七城纹章",
    "faction": "republic",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 2 张牌。",
    "flavor": "七座城的纹章叠在一起，像一封太长的信。",
    "copyLimit": 1,
    "equip": {
      "draw": 2
    }
  },
  "iron_order_hammer": {
    "id": "iron_order_hammer",
    "name": "铁序战锤",
    "faction": "empire",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "锤头刻着编号，连愤怒都要归档。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "blackridge_heavy_armor": {
    "id": "blackridge_heavy_armor",
    "name": "黑脊重甲",
    "faction": "empire",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "矿工说这甲比矿道还沉。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "ministry_map": {
    "id": "ministry_map",
    "name": "军部地图",
    "faction": "empire",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌；获得 2 点护甲。",
    "flavor": "地图上每个箭头都指向下一批粮。",
    "copyLimit": 1,
    "equip": {
      "draw": 1,
      "armor": 2
    }
  },
  "furnace_heart": {
    "id": "furnace_heart",
    "name": "熔炉心",
    "faction": "empire",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 2 点生命；友方随从获得 +1 攻击。",
    "flavor": "炉心不熄，帝国就不承认冬天。",
    "copyLimit": 1,
    "equip": {
      "healHero": 2,
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "ledger_paperknife": {
    "id": "ledger_paperknife",
    "name": "账房裁纸刀",
    "faction": "greyharbor",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌。",
    "flavor": "裁纸刀不杀人，只裁掉不该留的名字。",
    "copyLimit": 1,
    "equip": {
      "draw": 1
    }
  },
  "blackmarket_bracer": {
    "id": "blackmarket_bracer",
    "name": "黑市护臂",
    "faction": "greyharbor",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "护臂内侧缝着三条暗袋。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "brokenline_dagger": {
    "id": "brokenline_dagger",
    "name": "断线短刃",
    "faction": "greyharbor",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "断线团不设防线，只给每个人一把短刃。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "sealing_wax": {
    "id": "sealing_wax",
    "name": "封口蜡印",
    "faction": "greyharbor",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：对所有敌方随从造成 1 点伤害。",
    "flavor": "蜡印落下，名字就不能再开口。",
    "copyLimit": 1,
    "equip": {
      "damageAllEnemies": 1
    }
  },
  "white_reef_lamp_oil": {
    "id": "white_reef_lamp_oil",
    "name": "白礁灯油",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 2 点生命。",
    "flavor": "灯油只够亮一夜，但够船找到岸。",
    "copyLimit": 1,
    "equip": {
      "healHero": 2
    }
  },
  "fog_harbor_ticket": {
    "id": "fog_harbor_ticket",
    "name": "雾港船票",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌。",
    "flavor": "船票没有座位号，只有“上船再说”。",
    "copyLimit": 1,
    "equip": {
      "draw": 1
    }
  },
  "anvil_bracer": {
    "id": "anvil_bracer",
    "name": "铁砧护腕",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "铁砧镇的孩子先学会护腕，再学会锤子。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "northern_bone_flute": {
    "id": "northern_bone_flute",
    "name": "北境骨笛",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +0/+1。",
    "flavor": "笛声一响，北境的兽会先停下。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "health": 1
      }
    }
  },
  "gambler_dice": {
    "id": "gambler_dice",
    "name": "赌桌骰子",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 2 张牌。",
    "flavor": "三点赌没有稳赢，只有先掷。",
    "copyLimit": 1,
    "equip": {
      "draw": 2
    }
  },
  "snow_capital_lamp": {
    "id": "snow_capital_lamp",
    "name": "雪都暖灯",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 3 点生命。",
    "flavor": "灯芯里还剩一点雪都的温度。",
    "copyLimit": 1,
    "equip": {
      "healHero": 3
    }
  },
  "sky_ship_ticket": {
    "id": "sky_ship_ticket",
    "name": "浮空舰票",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌；获得 2 点护甲。",
    "flavor": "票根上印着一条不存在的航线。",
    "copyLimit": 1,
    "equip": {
      "draw": 1,
      "armor": 2
    }
  },
  "world_map_item": {
    "id": "world_map_item",
    "name": "世界地图",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 2 张牌；恢复领袖 2 点生命。",
    "flavor": "地图边缘写着：此处未测绘。",
    "copyLimit": 1,
    "equip": {
      "draw": 2,
      "healHero": 2
    }
  },
  "no_mans_land_deed": {
    "id": "no_mans_land_deed",
    "name": "无主地契",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1/+1。",
    "flavor": "没有旗，只有一张谁都撕不掉的纸。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1,
        "health": 1
      }
    }
  },
  "dusk_inn_key": {
    "id": "dusk_inn_key",
    "name": "黄昏旅店钥匙",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 5 点生命；抽 1 张牌。",
    "flavor": "住店可以赊账，听故事不行。",
    "copyLimit": 1,
    "equip": {
      "healHero": 5,
      "draw": 1
    }
  },
  "smuggler_anchor": {
    "id": "smuggler_anchor",
    "name": "走私船锚",
    "faction": "neutral",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 7,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：对所有敌方随从造成 2 点伤害。",
    "flavor": "锚落下的地方，就是暗航路的终点。",
    "copyLimit": 1,
    "equip": {
      "damageAllEnemies": 2
    }
  }
});

  
  Object.assign(CARDS, {
  "mistgate_warden": {
    "id": "mistgate_warden",
    "name": "雾港城门卫",
    "faction": "neutral",
    "type": "minion",
    "cost": 1,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "雾港的城门是一张收据。",
    "copyLimit": 2,
    "attack": 1,
    "health": 2
  },
  "white_reef_runner": {
    "id": "white_reef_runner",
    "name": "白礁信使",
    "faction": "neutral",
    "type": "minion",
    "cost": 1,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 1 点护甲。",
    "flavor": "灯塔亮起时，信使已经跑出半里。",
    "copyLimit": 2,
    "attack": 1,
    "health": 1,
    "battlecry": {
      "type": "armor",
      "amount": 1
    }
  },
  "anvil_apprentice": {
    "id": "anvil_apprentice",
    "name": "铁砧学徒",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 1 点护甲。",
    "flavor": "学徒先学护手，再学落锤。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "armor",
      "amount": 1
    }
  },
  "north_hunter": {
    "id": "north_hunter",
    "name": "北境猎手",
    "faction": "neutral",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "北境不欢迎陌生人，只欢迎先动手的人。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2
  },
  "losutai_scavenger": {
    "id": "losutai_scavenger",
    "name": "洛斯汰拾荒者",
    "faction": "neutral",
    "type": "minion",
    "cost": 1,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "流离。",
    "flavor": "它把每一块亮的东西都当成潮。",
    "copyLimit": 2,
    "attack": 1,
    "health": 2
  },
  "snow_exile": {
    "id": "snow_exile",
    "name": "雪都流亡者",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "雪都烧掉之后，活下来的人学会了不回头。",
    "copyLimit": 2,
    "attack": 2,
    "health": 4,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "dusk_innkeeper": {
    "id": "dusk_innkeeper",
    "name": "黄昏旅店帮工",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "旅店不问你从哪来，只问你付不付得起。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "fog_dockhand": {
    "id": "fog_dockhand",
    "name": "雾港码头工",
    "faction": "neutral",
    "type": "minion",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "码头上的每一根绳，都系着一条命。",
    "copyLimit": 2,
    "attack": 3,
    "health": 4
  },
  "mist_bargain": {
    "id": "mist_bargain",
    "name": "雾港议价",
    "faction": "neutral",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "先把价钱压到一半，再谈诚意。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "reef_signal": {
    "id": "reef_signal",
    "name": "白礁灯语",
    "faction": "neutral",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲。",
    "flavor": "一短一长，是“有船”；两短，是“别来”。",
    "copyLimit": 2,
    "spell": {
      "type": "armor",
      "amount": 2
    }
  },
  "anvil_quench": {
    "id": "anvil_quench",
    "name": "铁砧淬火",
    "faction": "neutral",
    "type": "spell",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "获得 3 点护甲。",
    "flavor": "淬火的水一响，铁就有了脾气。",
    "copyLimit": 2,
    "spell": {
      "type": "armor",
      "amount": 3
    }
  },
  "north_trail": {
    "id": "north_trail",
    "name": "北境追踪",
    "faction": "neutral",
    "type": "spell",
    "cost": 1,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌。",
    "flavor": "雪会盖住脚印，但盖不住方向。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 1
    }
  },
  "snow_lamp_rite": {
    "id": "snow_lamp_rite",
    "name": "雪都暖灯仪式",
    "faction": "neutral",
    "type": "spell",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "恢复你的领袖 3 点生命；抽 1 张牌。",
    "flavor": "灯芯点着的时候，雪都还算存在。",
    "copyLimit": 2,
    "spell": {
      "type": "healHeroDraw",
      "heal": 3,
      "draw": 1
    }
  },
  "losutai_tide": {
    "id": "losutai_tide",
    "name": "洛斯汰潮汐",
    "faction": "neutral",
    "type": "spell",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 1 点伤害。",
    "flavor": "潮来了，谁都得让路。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 1
    }
  },
  "dark_route": {
    "id": "dark_route",
    "name": "暗航路",
    "faction": "neutral",
    "type": "spell",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌。",
    "flavor": "没有旗，没有船期，只有货。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 2
    }
  },
  "world_edge": {
    "id": "world_edge",
    "name": "世界边缘",
    "faction": "neutral",
    "type": "spell",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 2 点伤害。",
    "flavor": "地图到这里就断了，但世界没有。",
    "copyLimit": 1,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 2
    }
  },
  "last_ledger": {
    "id": "last_ledger",
    "name": "最后一笔账",
    "faction": "neutral",
    "type": "spell",
    "cost": 7,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "恢复你的领袖 5 点生命；抽 2 张牌。",
    "flavor": "账本合上之前，所有人都是数字。",
    "copyLimit": 1,
    "spell": {
      "type": "healHeroDraw",
      "heal": 5,
      "draw": 2
    }
  },
  "mist_pier": {
    "id": "mist_pier",
    "name": "雾港栈桥",
    "faction": "neutral",
    "type": "formation",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得先遣。",
    "flavor": "栈桥一湿，谁都想先走。",
    "copyLimit": 2,
    "formation": {
      "rush": true
    }
  },
  "white_reef_light": {
    "id": "white_reef_light",
    "name": "白礁灯阵",
    "faction": "neutral",
    "type": "formation",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得守备。",
    "flavor": "灯照到的地方，船就不能硬闯。",
    "copyLimit": 2,
    "formation": {
      "taunt": true
    }
  },
  "anvil_forge_row": {
    "id": "anvil_forge_row",
    "name": "铁砧工坊",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1 攻击。",
    "flavor": "锤子一排开，铁就得排队。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "north_hunt_camp": {
    "id": "north_hunt_camp",
    "name": "北境猎场",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1 攻击。",
    "flavor": "猎场没有边界，只有风向。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "snow_warmhouse": {
    "id": "snow_warmhouse",
    "name": "雪都暖房",
    "faction": "neutral",
    "type": "formation",
    "cost": 2,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "屋里还有一盏没灭的灯。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "losutai_pool": {
    "id": "losutai_pool",
    "name": "洛斯汰潮池",
    "faction": "neutral",
    "type": "formation",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+2。",
    "flavor": "潮水退去，池底全是壳。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 2
    }
  },
  "smugglers_dock": {
    "id": "smugglers_dock",
    "name": "暗航码头",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得先遣。",
    "flavor": "船不等天亮。",
    "copyLimit": 2,
    "formation": {
      "rush": true
    }
  },
  "dusk_inn_yard": {
    "id": "dusk_inn_yard",
    "name": "黄昏旅店庭院",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "院子里听得到所有房间的梦话。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "world_edge_camp": {
    "id": "world_edge_camp",
    "name": "世界边缘营地",
    "faction": "neutral",
    "type": "formation",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+1。",
    "flavor": "再往前就没有地图了。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 1
    }
  },
  "gok_lamp_row": {
    "id": "gok_lamp_row",
    "name": "戈克灯列",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "灯一排开，夜路就短了一截。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "no_mans_camp": {
    "id": "no_mans_camp",
    "name": "无主营地",
    "faction": "neutral",
    "type": "formation",
    "cost": 3,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+1。",
    "flavor": "没有旗，谁先到谁就是主。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 1
    }
  },
  "grey_ledger_post": {
    "id": "grey_ledger_post",
    "name": "灰港账站",
    "faction": "neutral",
    "type": "formation",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+1。",
    "flavor": "过路可以，过账不行。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 1
    }
  },
  "forgotten_gate": {
    "id": "forgotten_gate",
    "name": "遗忘之门",
    "faction": "neutral",
    "type": "formation",
    "cost": 8,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +2/+2。",
    "flavor": "门后面没有路，只有下一笔账。",
    "copyLimit": 2,
    "formation": {
      "attack": 2,
      "health": 2
    }
  }
});

  for (const id of ["old_ledger","vein_prism","mist_scout"]) if (CARDS[id]) CARDS[id].rarity = "rare";

  const FORMATION_REWORK = {
 "formation_watcher": {
  "name": "旗阵守望",
  "type": "formation",
  "target": "none",
  "formation": {
   "taunt": true
  },
  "text": "该阵位友方随从获得守备。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "formation_officer": {
  "name": "地脉阵线官",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "formation_artificer": {
  "name": "旗阵工坊",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "formation_weaver": {
  "name": "阵线织网",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "formation_bugler": {
  "name": "阵线号台",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "archive_search": {
  "name": "档案检索阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "prohibition": {
  "name": "禁制令阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "rush": true
  },
  "text": "该阵位友方随从获得先遣。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "school_debate": {
  "name": "学派辩论席",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "insight": {
  "name": "洞察观测席",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "double_column_note": {
  "name": "双栏批注席",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "monster_summon": {
  "name": "魔物召唤阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "blood_pool": {
  "name": "血池献祭阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "monster_command": {
  "name": "魔物号令阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "rush": true
  },
  "text": "该阵位友方随从获得先遣。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "blood_altar": {
  "name": "血祭祭坛阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "blood_contract": {
  "name": "血偿契约坛",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "blood_feast": {
  "name": "血祭盛宴场",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "parliament_debate": {
  "name": "议会辩论席",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "fortify": {
  "name": "筑防令阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "taunt": true
  },
  "text": "该阵位友方随从获得守备。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "volley": {
  "name": "排枪阵线",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "martial_law": {
  "name": "戒严阵线",
  "type": "formation",
  "target": "none",
  "formation": {
   "taunt": true
  },
  "text": "该阵位友方随从获得守备。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "emergency_bill": {
  "name": "紧急法案席",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "battlefield_bill": {
  "name": "战地法案席",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "phalanx_warden": {
  "name": "方阵守望阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "barrage": {
  "name": "炮火覆盖阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "battlefield_salvage": {
  "name": "战地回收站",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "armor_drive": {
  "name": "装甲动员线",
  "type": "formation",
  "target": "none",
  "formation": {
   "taunt": true
  },
  "text": "该阵位友方随从获得守备。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "armor_volley": {
  "name": "装甲齐射阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "zone_barrage": {
  "name": "阵位齐射阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "siege_train": {
  "name": "攻城列车阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "gh_bounty_notice": {
  "name": "悬赏告示阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "gh_black_market": {
  "name": "黑市街阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 0,
   "health": 1
  },
  "text": "该阵位友方随从获得 +0/+1。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "gh_silence_field": {
  "name": "封口静默阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "taunt": true
  },
  "text": "该阵位友方随从获得守备。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "gh_company": {
  "name": "断线团本阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "gh_venom_behemoth": {
  "name": "毒潮兽阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "attack": 1,
   "health": 0
  },
  "text": "该阵位友方随从获得 +1 攻击。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "gh_silence_master": {
  "name": "封口行阵",
  "type": "formation",
  "target": "none",
  "formation": {
   "taunt": true
  },
  "text": "该阵位友方随从获得守备。",
  "keywords": [],
  "battlecry": null,
  "spell": null,
  "deathrattle": null,
  "passive": null,
  "bloodCost": null,
  "zoneBonus": null
 },
 "field_medic": {
  "cost": 5
 },
 "spring_medic": {
  "cost": 6
 },
 "pulse_banner": {
  "cost": 7
 },
 "reflux_physician": {
  "cost": 8
 },
 "pulse_recorder": {
  "cost": 5
 },
 "spring_watcher": {
  "cost": 6
 },
 "spell_novice": {
  "cost": 5
 },
 "index_assistant": {
  "cost": 6
 },
 "reflux_apprentice": {
  "cost": 7
 },
 "frost_archivist": {
  "cost": 8
 },
 "pure_theorist": {
  "cost": 5
 },
 "archive_keeper": {
  "cost": 6
 },
 "lecturer": {
  "cost": 7
 },
 "spell_echo": {
  "cost": 8
 },
 "blood_acolyte": {
  "cost": 5
 },
 "blood_pact_collector": {
  "cost": 6
 },
 "pressure_warlock": {
  "cost": 7
 },
 "tide_scout": {
  "cost": 8
 },
 "drill_sergeant": {
  "cost": 5
 },
 "bulwark_sentry": {
  "cost": 6
 },
 "line_spearman": {
  "cost": 7
 },
 "empire_guard": {
  "cost": 5
 },
 "zhenmai_artisan": {
  "cost": 6
 },
 "powder_apprentice": {
  "cost": 7
 },
 "armory_keeper": {
  "cost": 8
 },
 "gh_silencer": {
  "cost": 5
 },
 "gh_bounty_hunter": {
  "cost": 6
 },
 "bounty_clerk": {
  "cost": 7
 },
 "silence_informant": {
  "cost": 8
 }
};
  for (const [id, patch] of Object.entries(FORMATION_REWORK)) {
    if (!CARDS[id]) continue;
    if (id === "barrage" || id === "siege_train") continue;
    if (patch.type === "formation") {
      for (const key of ["attack","health","battlecry","spell","deathrattle","passive","bloodCost","zoneBonus","keywords","target"]) delete CARDS[id][key];
    }
    Object.assign(CARDS[id], patch);
  }

  if (CARDS.vein_attendant) CARDS.vein_attendant.cost = 5;

  const HIGH_REWORK_IDS = ["field_medic","spring_medic","pulse_banner","reflux_physician","pulse_recorder","vein_attendant","spell_novice","index_assistant","reflux_apprentice","frost_archivist","pure_theorist","archive_keeper","lecturer","spell_echo","blood_acolyte","blood_pact_collector","pressure_warlock","tide_scout","drill_sergeant","bulwark_sentry","line_spearman","empire_guard","zhenmai_artisan","powder_apprentice","armory_keeper","gh_silencer","gh_bounty_hunter","bounty_clerk","silence_informant"];

  for (const id of ["field_medic","spring_medic","pulse_banner","reflux_physician","pulse_recorder","vein_attendant","spell_novice","index_assistant","reflux_apprentice","frost_archivist","pure_theorist","archive_keeper","lecturer","spell_echo","blood_acolyte","blood_pact_collector","pressure_warlock","tide_scout","drill_sergeant","bulwark_sentry","line_spearman","empire_guard","zhenmai_artisan","powder_apprentice","armory_keeper","gh_silencer","gh_bounty_hunter","bounty_clerk","silence_informant"]) {
    const c = CARDS[id];
    if (!c || c.type !== "minion") continue;
    const baseAtk = Math.max(c.attack || 1, Math.floor((c.cost || 5) / 2) + 1);
    const baseHp = Math.max(c.health || 1, c.cost || 5);
    c.attack = baseAtk; c.health = baseHp;
  }
  for (const [id, name, text, spell] of [["security_sentry","保卫部警戒","获得 2 点护甲。",{"type":"armor","amount":2}],["medical_stretcher","医疗部担架","恢复你的领袖 2 点生命。",{"type":"healHero","amount":2}]]) {
    const c = CARDS[id];
    if (!c) continue;
    for (const key of ["attack","health","battlecry","keywords","deathrattle","passive","target"]) delete c[key];
    Object.assign(c, { name, type: "spell", target: "none", spell, text, keywords: [] });
  }

  if (CARDS.spring_watcher) { CARDS.spring_watcher.attack = 4; CARDS.spring_watcher.health = 6; }
  if (CARDS.frost_scribe && CARDS.frost_scribe.type !== "minion") {
    for (const key of ["spell","target"]) delete CARDS.frost_scribe[key];
    Object.assign(CARDS.frost_scribe, { type: "minion", attack: 2, health: 3, keywords: ["battlecry"], target: "enemy", battlecry: { type: "freeze" }, text: "登场：冻结一个敌方随从。" });
  }

  for (const id of ["anvil_apprentice","anvil_bracer","anvil_forge_row","anvil_quench","beast_hide_armor","blackmarket_bracer","blackridge_heavy_armor","bloodbone_pauldron","bloodmoon_bone_ring","bluegold_breastplate","bone_fang_blade","border_lance","brokenline_dagger","cataloging_lens","dark_route","dusk_inn_key","dusk_inn_yard","dusk_innkeeper","five_department_badge","floating_anchor","floating_ink_blade","fog_dockhand","fog_harbor_ticket","forgotten_gate","frostweave_cloak","furnace_heart","gambler_dice","gok_lamp_row","grey_ledger_post","house_longsword","iron_order_hammer","ksetra_beacon_item","last_ledger","ledger_paperknife","losutai_pool","losutai_scavenger","losutai_tide","ministry_map","mist_bargain","mist_pier","mistgate_warden","no_mans_camp","no_mans_land_deed","north_hunt_camp","north_hunter","north_trail","northern_bone_flute","reef_signal","sealing_wax","seven_cities_crest","sky_ship_ticket","smuggler_anchor","smugglers_dock","snow_capital_lamp","snow_exile","snow_lamp_rite","snow_warmhouse","tide_ward_bracer","white_reef_lamp_oil","white_reef_light","white_reef_runner","whitefrost_bell","world_edge","world_edge_camp","world_map_item"]) if (CARDS[id]) CARDS[id].noArtwork = false;

  Object.assign(CARDS, {
  "xh_blood_guard": {
    "id": "xh_blood_guard",
    "name": "血裔剑卫",
    "faction": "xizhao",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "lifesteal"
    ],
    "target": "none",
    "text": "血偿。",
    "flavor": "血族的剑，先尝自己的血。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2
  },
  "xh_night_watch": {
    "id": "xh_night_watch",
    "name": "古堡守夜",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "stealth"
    ],
    "target": "none",
    "text": "隐匿。",
    "flavor": "古堡的夜很长，守夜人更長。",
    "copyLimit": 2,
    "attack": 3,
    "health": 3
  },
  "xh_blood_tax": {
    "id": "xh_blood_tax",
    "name": "血税官",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "每一滴血都要登记。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "xh_bone_hunter": {
    "id": "xh_bone_hunter",
    "name": "断骨猎人",
    "faction": "xizhao",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "他不在乎骨头断在哪。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2
  },
  "xh_blood_mist": {
    "id": "xh_blood_mist",
    "name": "血雾刺客",
    "faction": "xizhao",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "stealth"
    ],
    "target": "none",
    "text": "隐匿。",
    "flavor": "血雾起时，名字就不重要了。",
    "copyLimit": 2,
    "attack": 4,
    "health": 3
  },
  "xh_blood_steward": {
    "id": "xh_blood_steward",
    "name": "血族执事",
    "faction": "xizhao",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "lifesteal"
    ],
    "target": "none",
    "text": "血偿。",
    "flavor": "古堡里最后一个还记得礼数的人。",
    "copyLimit": 2,
    "attack": 3,
    "health": 5
  },
  "xh_bone_guard": {
    "id": "xh_bone_guard",
    "name": "骨甲勇士",
    "faction": "xizhao",
    "type": "minion",
    "cost": 5,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "骨甲不是盔甲，是祖辈的名字。",
    "copyLimit": 2,
    "attack": 4,
    "health": 6
  },
  "xh_blood_knight": {
    "id": "xh_blood_knight",
    "name": "血月骑士",
    "faction": "xizhao",
    "type": "minion",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "血月升起时，他才会骑马。",
    "copyLimit": 2,
    "attack": 5,
    "health": 5
  },
  "xh_castle_consul": {
    "id": "xh_castle_consul",
    "name": "古堡执政官",
    "faction": "xizhao",
    "type": "minion",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "friendly",
    "text": "登场：使一个友方随从获得 +2/+2。",
    "flavor": "古堡没有王，只有代代相传的执政官。",
    "copyLimit": 1,
    "attack": 5,
    "health": 6,
    "battlecry": {
      "type": "buffAlly",
      "attack": 2,
      "health": 2
    }
  },
  "xh_blood_colossus": {
    "id": "xh_blood_colossus",
    "name": "血河巨像",
    "faction": "xizhao",
    "type": "minion",
    "cost": 8,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "lifesteal"
    ],
    "target": "none",
    "text": "血偿。",
    "flavor": "血河退去后，它还在。",
    "copyLimit": 2,
    "attack": 8,
    "health": 8
  },
  "xh_blood_priest": {
    "id": "xh_blood_priest",
    "name": "血誓祭司",
    "faction": "xizhao",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "誓言要用血写。",
    "copyLimit": 2,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "xh_alley_blade": {
    "id": "xh_alley_blade",
    "name": "暗巷刃手",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "stealth"
    ],
    "target": "none",
    "text": "隐匿。",
    "flavor": "暗巷里没有第二刀。",
    "copyLimit": 2,
    "attack": 3,
    "health": 2
  },
  "xh_tribe_headhunter": {
    "id": "xh_tribe_headhunter",
    "name": "部落猎首",
    "faction": "xizhao",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "charge"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "猎首只带回最值钱的那颗。",
    "copyLimit": 2,
    "attack": 4,
    "health": 3
  },
  "xh_blood_brewer": {
    "id": "xh_blood_brewer",
    "name": "血酿学者",
    "faction": "xizhao",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "血酿的配方，比血族史还长。",
    "copyLimit": 2,
    "attack": 1,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "xh_pressure_master": {
    "id": "xh_pressure_master",
    "name": "压脉师",
    "faction": "xizhao",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：对一个敌方随从造成 2 点伤害。",
    "flavor": "压住脉，血就不会说谎。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "damage",
      "amount": 2
    }
  },
  "xh_blood_feast_spell": {
    "id": "xh_blood_feast_spell",
    "name": "血宴",
    "faction": "xizhao",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 2 点伤害。",
    "flavor": "桌布是红的，菜也是。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 2
    }
  },
  "xh_blood_road": {
    "id": "xh_blood_road",
    "name": "血路突袭",
    "faction": "xizhao",
    "type": "spell",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得 +1 攻击和先遣。",
    "flavor": "路是血铺的，脚是自己的。",
    "copyLimit": 2,
    "spell": {
      "type": "grantRushBuff",
      "attack": 1
    }
  },
  "xh_castle_pact": {
    "id": "xh_castle_pact",
    "name": "古堡盟约",
    "faction": "xizhao",
    "type": "formation",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1 攻击。",
    "flavor": "盟约不写在纸上。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "xh_blood_moon_altar": {
    "id": "xh_blood_moon_altar",
    "name": "血月祭坛",
    "faction": "xizhao",
    "type": "formation",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "月亮低到能听见血的声音。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "xh_blood_curse": {
    "id": "xh_blood_curse",
    "name": "血契诅咒",
    "faction": "xizhao",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "enemy",
    "text": "对一个敌方随从造成 4 点伤害。",
    "flavor": "违约者，血会自己找上门。",
    "copyLimit": 2,
    "spell": {
      "type": "damage",
      "amount": 4
    }
  },
  "lt_tide_spawn": {
    "id": "lt_tide_spawn",
    "name": "潮边魔物",
    "faction": "losutai",
    "type": "minion",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "poisonous"
    ],
    "target": "none",
    "text": "蚀毒。",
    "flavor": "潮水退去时，它还在沙里。",
    "copyLimit": 2,
    "attack": 1,
    "health": 1
  },
  "lt_venom_larva": {
    "id": "lt_venom_larva",
    "name": "毒潮幼体",
    "faction": "losutai",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "poisonous"
    ],
    "target": "none",
    "text": "蚀毒。",
    "flavor": "小，但足够毒。",
    "copyLimit": 2,
    "attack": 1,
    "health": 2
  },
  "lt_bone_scavenger": {
    "id": "lt_bone_scavenger",
    "name": "潮骨拾荒",
    "faction": "losutai",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：抽 1 张牌。",
    "flavor": "它捡的不是骨头，是名字。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2,
    "deathrattle": {
      "type": "draw",
      "amount": 1
    }
  },
  "lt_hatch_guard": {
    "id": "lt_hatch_guard",
    "name": "孵化守卫",
    "faction": "losutai",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt",
      "deathrattle"
    ],
    "target": "none",
    "text": "守备。余响：召唤一个 1/1 洛斯汰魔物。",
    "flavor": "巢穴的门卫，自己也是巢。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "deathrattle": {
      "type": "summon",
      "token": "losutai_imp"
    }
  },
  "lt_brood_attendant": {
    "id": "lt_brood_attendant",
    "name": "母巢侍从",
    "faction": "losutai",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤一个 1/1 洛斯汰魔物。",
    "flavor": "它只是来确认巢还活着。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "summon",
      "token": "losutai_imp"
    }
  },
  "lt_reborn_spawn": {
    "id": "lt_reborn_spawn",
    "name": "回潮魔物",
    "faction": "losutai",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "reborn"
    ],
    "target": "none",
    "text": "回潮。",
    "flavor": "死一次，只是潮退。",
    "copyLimit": 2,
    "attack": 2,
    "health": 1
  },
  "lt_venom_thrower": {
    "id": "lt_venom_thrower",
    "name": "毒囊投手",
    "faction": "losutai",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "poisonous",
      "battlecry"
    ],
    "target": "enemy",
    "text": "蚀毒。登场：对一个敌方随从造成 1 点伤害。",
    "flavor": "毒囊破了，账才算开始。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2,
    "battlecry": {
      "type": "damage",
      "amount": 1
    }
  },
  "lt_tide_hunter": {
    "id": "lt_tide_hunter",
    "name": "潮汐猎手",
    "faction": "losutai",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "潮水教它追，不教它停。",
    "copyLimit": 2,
    "attack": 3,
    "health": 2
  },
  "lt_brood_mother": {
    "id": "lt_brood_mother",
    "name": "巢母",
    "faction": "losutai",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤两个 1/1 洛斯汰魔物。",
    "flavor": "她不需要军队，她生一支。",
    "copyLimit": 2,
    "attack": 4,
    "health": 4,
    "battlecry": {
      "type": "summonCount",
      "token": "losutai_imp",
      "count": 2
    }
  },
  "lt_deep_beast": {
    "id": "lt_deep_beast",
    "name": "深海巨兽",
    "faction": "losutai",
    "type": "minion",
    "cost": 6,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "深海没有光，只有更大的嘴。",
    "copyLimit": 2,
    "attack": 6,
    "health": 6
  },
  "lt_tide_devourer": {
    "id": "lt_tide_devourer",
    "name": "噬潮者",
    "faction": "losutai",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。",
    "flavor": "潮水吃剩的，它吃。",
    "copyLimit": 2,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "devourLowestHealth"
    }
  },
  "lt_awakened": {
    "id": "lt_awakened",
    "name": "觉醒者",
    "faction": "losutai",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤两个 1/1 洛斯汰魔物；若你控制其他魔物，获得 +1/+1。",
    "flavor": "它第一次听见自己的名字，是在血里。",
    "copyLimit": 1,
    "attack": 4,
    "health": 5,
    "battlecry": {
      "type": "summonCount",
      "token": "losutai_imp",
      "count": 2
    }
  },
  "lt_venom_behemoth": {
    "id": "lt_venom_behemoth",
    "name": "毒潮巨兽",
    "faction": "losutai",
    "type": "minion",
    "cost": 7,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "poisonous",
      "rush"
    ],
    "target": "none",
    "text": "蚀毒。先遣。",
    "flavor": "它从潮里爬上来，身上挂着旧账。",
    "copyLimit": 2,
    "attack": 7,
    "health": 7
  },
  "lt_tide_colossus": {
    "id": "lt_tide_colossus",
    "name": "潮骸巨像",
    "faction": "losutai",
    "type": "minion",
    "cost": 7,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "lifesteal"
    ],
    "target": "none",
    "text": "血偿。",
    "flavor": "潮骸不是骨头，是整片海。",
    "copyLimit": 2,
    "attack": 6,
    "health": 8
  },
  "lt_venom_fang": {
    "id": "lt_venom_fang",
    "name": "毒牙",
    "faction": "losutai",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "poisonous",
      "stealth"
    ],
    "target": "none",
    "text": "蚀毒。隐匿。",
    "flavor": "牙比名字更早出现。",
    "copyLimit": 2,
    "attack": 1,
    "health": 1
  },
  "lt_deep_sentinel": {
    "id": "lt_deep_sentinel",
    "name": "深海哨兵",
    "faction": "losutai",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "它守的不是门，是潮。",
    "copyLimit": 2,
    "attack": 3,
    "health": 5
  },
  "lt_bone_warlock": {
    "id": "lt_bone_warlock",
    "name": "潮骨术士",
    "faction": "losutai",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：抽 1 张牌。",
    "flavor": "骨头会说话，只是很慢。",
    "copyLimit": 2,
    "attack": 3,
    "health": 3,
    "deathrattle": {
      "type": "draw",
      "amount": 1
    }
  },
  "lt_reborn_behemoth": {
    "id": "lt_reborn_behemoth",
    "name": "回潮巨兽",
    "faction": "losutai",
    "type": "minion",
    "cost": 6,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "reborn"
    ],
    "target": "none",
    "text": "回潮。",
    "flavor": "第一次死，它还没学会。",
    "copyLimit": 2,
    "attack": 5,
    "health": 5
  },
  "lt_tide_mother": {
    "id": "lt_tide_mother",
    "name": "潮母",
    "faction": "losutai",
    "type": "minion",
    "cost": 7,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：召唤三个 1/1 洛斯汰魔物。",
    "flavor": "潮母一睁眼，海滩就满了。",
    "copyLimit": 2,
    "attack": 6,
    "health": 6,
    "battlecry": {
      "type": "summonCount",
      "token": "losutai_imp",
      "count": 3
    }
  },
  "lt_venom_lord": {
    "id": "lt_venom_lord",
    "name": "毒潮领主",
    "faction": "losutai",
    "type": "minion",
    "cost": 8,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "poisonous"
    ],
    "target": "none",
    "text": "蚀毒。",
    "flavor": "它的名字，是潮水念出来的。",
    "copyLimit": 1,
    "attack": 7,
    "health": 7
  },
  "lt_tide_birth": {
    "id": "lt_tide_birth",
    "name": "潮生",
    "faction": "losutai",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "召唤两个 1/1 洛斯汰魔物。",
    "flavor": "潮来了，就活。",
    "copyLimit": 2,
    "spell": {
      "type": "summonTwoTokens",
      "token": "losutai_imp",
      "count": 2
    }
  },
  "lt_venom_mist": {
    "id": "lt_venom_mist",
    "name": "毒雾",
    "faction": "losutai",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 1 点伤害。",
    "flavor": "雾里有牙。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 1
    }
  },
  "lt_hatch": {
    "id": "lt_hatch",
    "name": "孵化",
    "faction": "losutai",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "召唤两个 1/1 洛斯汰魔物。",
    "flavor": "巢不需要理由。",
    "copyLimit": 2,
    "spell": {
      "type": "summonTwoTokens",
      "token": "losutai_imp",
      "count": 2
    }
  },
  "lt_reborn_rite": {
    "id": "lt_reborn_rite",
    "name": "回潮仪式",
    "faction": "losutai",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得回潮；抽 1 张牌。",
    "flavor": "潮会把它送回来。",
    "copyLimit": 2,
    "spell": {
      "type": "rebornDraw",
      "draw": 1
    }
  },
  "lt_tide_surge": {
    "id": "lt_tide_surge",
    "name": "潮涌",
    "faction": "losutai",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 1 点伤害；抽 1 张牌。",
    "flavor": "潮水不会只来一次。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemiesDraw",
      "amount": 1,
      "draw": 1
    }
  },
  "lt_brood_call": {
    "id": "lt_brood_call",
    "name": "母巢召唤",
    "faction": "losutai",
    "type": "spell",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "召唤两个 3/3 洛斯汰巨兽。",
    "flavor": "巢母醒来时，海面会先安静。",
    "copyLimit": 2,
    "spell": {
      "type": "summonTwoTokens",
      "token": "losutai_beast",
      "count": 2
    }
  },
  "lt_tide_pool": {
    "id": "lt_tide_pool",
    "name": "潮池",
    "faction": "losutai",
    "type": "formation",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "池水不退，魔物不散。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "lt_venom_nest": {
    "id": "lt_venom_nest",
    "name": "毒巢",
    "faction": "losutai",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1 攻击。",
    "flavor": "巢里没有干净的东西。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "lt_hatchery": {
    "id": "lt_hatchery",
    "name": "孵化场",
    "faction": "losutai",
    "type": "formation",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "每一枚卵都在等潮。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "snow_refugee": {
    "id": "snow_refugee",
    "name": "冰原遗民",
    "faction": "snow",
    "type": "minion",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "雪都毁后，活下来的人学会了不回头。",
    "copyLimit": 2,
    "attack": 1,
    "health": 2
  },
  "snow_fox_sentry": {
    "id": "snow_fox_sentry",
    "name": "雪狐哨兵",
    "faction": "snow",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "耳朵比城墙先听见风。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2
  },
  "snow_frostwind_novice": {
    "id": "snow_frostwind_novice",
    "name": "霜风学徒",
    "faction": "snow",
    "type": "minion",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：冻结一个敌方随从。",
    "flavor": "风先到，霜后到。",
    "copyLimit": 2,
    "attack": 1,
    "health": 3,
    "battlecry": {
      "type": "freeze"
    }
  },
  "snow_icewall_guard": {
    "id": "snow_icewall_guard",
    "name": "冰墙卫士",
    "faction": "snow",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "墙不高，但很冷。",
    "copyLimit": 2,
    "attack": 2,
    "health": 5
  },
  "snow_storm_hunter": {
    "id": "snow_storm_hunter",
    "name": "风雪猎手",
    "faction": "snow",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "风雪里没有脚印。",
    "copyLimit": 2,
    "attack": 3,
    "health": 2
  },
  "snow_priest": {
    "id": "snow_priest",
    "name": "雪都祭司",
    "faction": "snow",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 2 点生命。",
    "flavor": "先问名字，再问伤口。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "healHero",
      "amount": 2
    }
  },
  "snow_guard_captain": {
    "id": "snow_guard_captain",
    "name": "冰原守卫长",
    "faction": "snow",
    "type": "minion",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "她守的是雪都的最后一扇门。",
    "copyLimit": 2,
    "attack": 4,
    "health": 5
  },
  "snow_frostclaw": {
    "id": "snow_frostclaw",
    "name": "霜爪兽",
    "faction": "snow",
    "type": "minion",
    "cost": 4,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "冰原上，白毛不是伪装，是警告。",
    "copyLimit": 2,
    "attack": 4,
    "health": 4
  },
  "snow_rin": {
    "id": "snow_rin",
    "name": "凛",
    "faction": "snow",
    "type": "minion",
    "cost": 5,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复所有友方随从 1 点生命。",
    "flavor": "老将最后学会的，是把人带回来。",
    "copyLimit": 1,
    "attack": 5,
    "health": 5,
    "battlecry": {
      "type": "healAllAllies",
      "amount": 1
    }
  },
  "snow_time_echo": {
    "id": "snow_time_echo",
    "name": "时序残响",
    "faction": "snow",
    "type": "minion",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：冻结一个敌方随从；若它已经被冻结，抽 1 张牌。",
    "flavor": "同一个瞬间，响了两次。",
    "copyLimit": 2,
    "attack": 4,
    "health": 4,
    "battlecry": {
      "type": "freezeDrawIfFrozen"
    }
  },
  "snow_ice_priest": {
    "id": "snow_ice_priest",
    "name": "冰原祭司",
    "faction": "snow",
    "type": "minion",
    "cost": 5,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 3 点生命。",
    "flavor": "雪都的火种不熄，只是很小。",
    "copyLimit": 2,
    "attack": 4,
    "health": 5,
    "battlecry": {
      "type": "healHero",
      "amount": 3
    }
  },
  "snow_fox_guard": {
    "id": "snow_fox_guard",
    "name": "雪都狐卫",
    "faction": "snow",
    "type": "minion",
    "cost": 6,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "尾巴一收，就是城墙。",
    "copyLimit": 2,
    "attack": 5,
    "health": 6
  },
  "snow_frost_colossus": {
    "id": "snow_frost_colossus",
    "name": "冰霜巨像",
    "faction": "snow",
    "type": "minion",
    "cost": 7,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "它站起来时，暴风雪会停一瞬。",
    "copyLimit": 2,
    "attack": 7,
    "health": 7
  },
  "snow_time_shade": {
    "id": "snow_time_shade",
    "name": "时间残影",
    "faction": "snow",
    "type": "minion",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：冻结所有敌方随从。",
    "flavor": "她来过，又好像没来过。",
    "copyLimit": 1,
    "attack": 4,
    "health": 4,
    "battlecry": {
      "type": "freezeAllEnemies"
    }
  },
  "snow_last_stand": {
    "id": "snow_last_stand",
    "name": "雪都之战·终局",
    "faction": "snow",
    "type": "minion",
    "cost": 8,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "雪落尽了，雪都就醒了。",
    "copyLimit": 1,
    "attack": 8,
    "health": 8
  },
  "snow_blizzard_elemental": {
    "id": "snow_blizzard_elemental",
    "name": "暴风雪元素",
    "faction": "snow",
    "type": "minion",
    "cost": 6,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：对所有敌方随从造成 1 点伤害。",
    "flavor": "风里全是冰。",
    "copyLimit": 2,
    "attack": 5,
    "health": 5,
    "battlecry": {
      "type": "damageAllEnemies",
      "amount": 1
    }
  },
  "snow_coldwind_assassin": {
    "id": "snow_coldwind_assassin",
    "name": "寒风刺客",
    "faction": "snow",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "stealth"
    ],
    "target": "none",
    "text": "隐匿。",
    "flavor": "风从背后吹来。",
    "copyLimit": 2,
    "attack": 3,
    "health": 3
  },
  "snow_ice_crystal_guard": {
    "id": "snow_ice_crystal_guard",
    "name": "冰晶守卫",
    "faction": "snow",
    "type": "minion",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "冰晶不碎，只是慢慢化。",
    "copyLimit": 2,
    "attack": 2,
    "health": 4
  },
  "snow_tundra_ranger": {
    "id": "snow_tundra_ranger",
    "name": "雪原游侠",
    "faction": "snow",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "雪原上，先学会看天。",
    "copyLimit": 2,
    "attack": 2,
    "health": 2
  },
  "snow_frozen_oracle": {
    "id": "snow_frozen_oracle",
    "name": "冻土先知",
    "faction": "snow",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "她听见冰层下有时间。",
    "copyLimit": 2,
    "attack": 3,
    "health": 4,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "snow_frost_dragon": {
    "id": "snow_frost_dragon",
    "name": "白霜龙",
    "faction": "snow",
    "type": "minion",
    "cost": 7,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：冻结一个敌方随从。",
    "flavor": "龙息不是火，是冬天。",
    "copyLimit": 2,
    "attack": 6,
    "health": 6,
    "battlecry": {
      "type": "freeze"
    }
  },
  "snow_ice_wolf": {
    "id": "snow_ice_wolf",
    "name": "冰原狼",
    "faction": "snow",
    "type": "minion",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "rush"
    ],
    "target": "none",
    "text": "先遣。",
    "flavor": "狼群跟着风走。",
    "copyLimit": 2,
    "attack": 1,
    "health": 1
  },
  "snow_firekeeper": {
    "id": "snow_firekeeper",
    "name": "雪都火种手",
    "faction": "snow",
    "type": "minion",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：获得 1 点护甲。",
    "flavor": "火种比城更长寿。",
    "copyLimit": 2,
    "attack": 1,
    "health": 2,
    "battlecry": {
      "type": "armor",
      "amount": 1
    }
  },
  "snow_windweaver": {
    "id": "snow_windweaver",
    "name": "雪都织风者",
    "faction": "snow",
    "type": "minion",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "windfury"
    ],
    "target": "none",
    "text": "连携。",
    "flavor": "风在她手里有针脚。",
    "copyLimit": 2,
    "attack": 3,
    "health": 4
  },
  "snow_frost_warden": {
    "id": "snow_frost_warden",
    "name": "霜线守望者",
    "faction": "snow",
    "type": "minion",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "霜线不是线，是边界。",
    "copyLimit": 2,
    "attack": 4,
    "health": 5
  },
  "snow_ice_scholar": {
    "id": "snow_ice_scholar",
    "name": "冰原学者",
    "faction": "snow",
    "type": "minion",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：抽 1 张牌。",
    "flavor": "她记录的不是天气，是时间。",
    "copyLimit": 2,
    "attack": 2,
    "health": 3,
    "battlecry": {
      "type": "draw",
      "amount": 1
    }
  },
  "snow_blizzard_warden": {
    "id": "snow_blizzard_warden",
    "name": "暴雪守望",
    "faction": "snow",
    "type": "minion",
    "cost": 6,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "text": "守备。",
    "flavor": "暴雪里，门就是墙。",
    "copyLimit": 2,
    "attack": 5,
    "health": 6
  },
  "snow_aurora_priestess": {
    "id": "snow_aurora_priestess",
    "name": "极光祭司",
    "faction": "snow",
    "type": "minion",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 4 点生命。",
    "flavor": "极光下，伤口会慢一点。",
    "copyLimit": 2,
    "attack": 3,
    "health": 5,
    "battlecry": {
      "type": "healHero",
      "amount": 4
    }
  },
  "snow_frost_giant": {
    "id": "snow_frost_giant",
    "name": "霜巨人",
    "faction": "snow",
    "type": "minion",
    "cost": 8,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "它走得慢，但冬天也慢。",
    "copyLimit": 2,
    "attack": 9,
    "health": 9
  },
  "snow_freeze_touch": {
    "id": "snow_freeze_touch",
    "name": "冻结之触",
    "faction": "snow",
    "type": "spell",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "enemy",
    "text": "冻结一个敌方随从。",
    "flavor": "碰一下，时间就停了。",
    "copyLimit": 2,
    "spell": {
      "type": "freeze"
    }
  },
  "snow_wind_strike": {
    "id": "snow_wind_strike",
    "name": "风击",
    "faction": "snow",
    "type": "spell",
    "cost": 1,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得连携。",
    "flavor": "风替它多挥一次。",
    "copyLimit": 2,
    "spell": {
      "type": "buffWindfury"
    }
  },
  "snow_gale": {
    "id": "snow_gale",
    "name": "疾风",
    "faction": "snow",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得 +1 攻击和先遣。",
    "flavor": "先走一步，再谈方向。",
    "copyLimit": 2,
    "spell": {
      "type": "grantRushBuff",
      "attack": 1
    }
  },
  "snow_ice_wall": {
    "id": "snow_ice_wall",
    "name": "冰墙",
    "faction": "snow",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "获得 3 点护甲。",
    "flavor": "墙是临时的，冷是长期的。",
    "copyLimit": 2,
    "spell": {
      "type": "armor",
      "amount": 3
    }
  },
  "snow_blizzard": {
    "id": "snow_blizzard",
    "name": "暴风雪",
    "faction": "snow",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "冻结所有敌方随从。",
    "flavor": "雪不是落下来的，是横着来的。",
    "copyLimit": 2,
    "spell": {
      "type": "freezeAll"
    }
  },
  "snow_temporal_shift": {
    "id": "snow_temporal_shift",
    "name": "时序偏移",
    "faction": "snow",
    "type": "spell",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌。",
    "flavor": "时间在雪都打了个结。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 2
    }
  },
  "snow_frost_armor": {
    "id": "snow_frost_armor",
    "name": "霜甲",
    "faction": "snow",
    "type": "spell",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲；抽 1 张牌。",
    "flavor": "冰甲不重，只是脱不下来。",
    "copyLimit": 2,
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 1
    }
  },
  "snow_wind_eye": {
    "id": "snow_wind_eye",
    "name": "风眼",
    "faction": "snow",
    "type": "spell",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌；获得 2 点护甲。",
    "flavor": "风眼中心，什么都听不见。",
    "copyLimit": 2,
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 2
    }
  },
  "snow_time_stop": {
    "id": "snow_time_stop",
    "name": "时间停滞",
    "faction": "snow",
    "type": "spell",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "冻结所有敌方随从；抽 1 张牌。",
    "flavor": "这一秒，雪都不属于任何人。",
    "copyLimit": 1,
    "spell": {
      "type": "freezeDraw"
    }
  },
  "snow_aurora": {
    "id": "snow_aurora",
    "name": "极光",
    "faction": "snow",
    "type": "spell",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "恢复你的领袖 4 点生命；抽 1 张牌。",
    "flavor": "极光不是光，是时间在呼吸。",
    "copyLimit": 2,
    "spell": {
      "type": "healHeroDraw",
      "heal": 4,
      "draw": 1
    }
  },
  "snow_whiteout": {
    "id": "snow_whiteout",
    "name": "白茫",
    "faction": "snow",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 1 点伤害。",
    "flavor": "你看不见雪都，雪都看得见你。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 1
    }
  },
  "snow_last_snow": {
    "id": "snow_last_snow",
    "name": "最后一场雪",
    "faction": "snow",
    "type": "spell",
    "cost": 7,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "冻结所有敌方随从；抽 1 张牌。",
    "flavor": "雪落尽了。",
    "copyLimit": 1,
    "spell": {
      "type": "freezeDraw"
    }
  },
  "snow_frost_veil": {
    "id": "snow_frost_veil",
    "name": "霜幕",
    "faction": "snow",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得 +0/+2 和守备。",
    "flavor": "霜幕落下，风就进不来。",
    "copyLimit": 2,
    "spell": {
      "type": "buffTaunt",
      "health": 2
    }
  },
  "snow_wind_step": {
    "id": "snow_wind_step",
    "name": "踏风",
    "faction": "snow",
    "type": "spell",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "friendly",
    "text": "使一个友方随从获得 +2 攻击和先遣。",
    "flavor": "脚步轻的人，才能穿过雪原。",
    "copyLimit": 2,
    "spell": {
      "type": "grantRushBuff",
      "attack": 2
    }
  },
  "snow_ice_lance": {
    "id": "snow_ice_lance",
    "name": "冰枪",
    "faction": "snow",
    "type": "spell",
    "cost": 3,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "enemy",
    "text": "对一个敌方随从造成 3 点伤害。",
    "flavor": "冰是雪都的箭。",
    "copyLimit": 2,
    "spell": {
      "type": "damage",
      "amount": 3
    }
  },
  "snow_gale_force": {
    "id": "snow_gale_force",
    "name": "强风",
    "faction": "snow",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲；抽 1 张牌。",
    "flavor": "风推着整支军队走。",
    "copyLimit": 2,
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 1
    }
  },
  "snow_icewall_formation": {
    "id": "snow_icewall_formation",
    "name": "冰墙阵",
    "faction": "snow",
    "type": "formation",
    "cost": 2,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得守备。",
    "flavor": "墙不需要高度。",
    "copyLimit": 2,
    "formation": {
      "taunt": true
    }
  },
  "snow_windwall": {
    "id": "snow_windwall",
    "name": "风墙",
    "faction": "snow",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "风把雪堆成了墙。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "snow_tundra_hunt": {
    "id": "snow_tundra_hunt",
    "name": "雪原猎场",
    "faction": "snow",
    "type": "formation",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1 攻击。",
    "flavor": "猎场里没有脚印。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "snow_time_array": {
    "id": "snow_time_array",
    "name": "时序阵",
    "faction": "snow",
    "type": "formation",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "时间在这里排队。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "snow_frozen_court": {
    "id": "snow_frozen_court",
    "name": "冰封庭院",
    "faction": "snow",
    "type": "formation",
    "cost": 4,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +0/+1。",
    "flavor": "庭院里，连风都放轻了脚步。",
    "copyLimit": 2,
    "formation": {
      "attack": 0,
      "health": 1
    }
  },
  "snow_wind_altar": {
    "id": "snow_wind_altar",
    "name": "风眼祭坛",
    "faction": "snow",
    "type": "formation",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1 攻击。",
    "flavor": "祭坛中心没有风。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 0
    }
  },
  "snow_throne": {
    "id": "snow_throne",
    "name": "雪都王座",
    "faction": "snow",
    "type": "formation",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +1/+1。",
    "flavor": "王座是冰做的，坐上去的人不怕冷。",
    "copyLimit": 2,
    "formation": {
      "attack": 1,
      "health": 1
    }
  },
  "snow_last_tundra": {
    "id": "snow_last_tundra",
    "name": "终末冰原",
    "faction": "snow",
    "type": "formation",
    "cost": 8,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "该阵位友方随从获得 +2/+2。",
    "flavor": "冰原没有尽头，只有下一场雪。",
    "copyLimit": 2,
    "formation": {
      "attack": 2,
      "health": 2
    }
  },
  "ac_arcane_flood": {
    "id": "ac_arcane_flood",
    "name": "奥术洪流",
    "faction": "academy",
    "type": "spell",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成 2 点伤害。",
    "flavor": "公式算到最后，是一道洪流。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemies",
      "amount": 2
    }
  },
  "ac_grand_library": {
    "id": "ac_grand_library",
    "name": "大图书馆",
    "faction": "academy",
    "type": "spell",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 3 张牌。",
    "flavor": "书页自己会翻。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 3
    }
  },
  "ac_spell_copy": {
    "id": "ac_spell_copy",
    "name": "法术复写",
    "faction": "academy",
    "type": "spell",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌。",
    "flavor": "写两遍，就不会忘。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 2
    }
  },
  "ac_knowledge_burst": {
    "id": "ac_knowledge_burst",
    "name": "知识爆发",
    "faction": "academy",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "造成 3 点伤害；抽 1 张牌。",
    "flavor": "知道得越多，越知道该打哪。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllEnemiesDraw",
      "amount": 3,
      "draw": 1
    }
  },
  "ac_absolute_theory": {
    "id": "ac_absolute_theory",
    "name": "绝对理论",
    "faction": "academy",
    "type": "spell",
    "cost": 7,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方单位造成 3 点伤害。",
    "flavor": "所有变量都被消掉了。",
    "copyLimit": 1,
    "spell": {
      "type": "damageAllEnemyUnits",
      "amount": 3
    }
  },
  "ac_final_proof": {
    "id": "ac_final_proof",
    "name": "最终证明",
    "faction": "academy",
    "type": "spell",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌；恢复你的领袖 5 点生命。",
    "flavor": "证明成立，代价另算。",
    "copyLimit": 1,
    "spell": {
      "type": "healHeroDraw",
      "heal": 5,
      "draw": 2
    }
  },
  "ac_field_notes": {
    "id": "ac_field_notes",
    "name": "战地笔记",
    "faction": "academy",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "获得 2 点护甲；抽 1 张牌。",
    "flavor": "笔记比盔甲轻，但更耐打。",
    "copyLimit": 2,
    "spell": {
      "type": "armorDraw",
      "armor": 2,
      "draw": 1
    }
  },
  "ac_arcane_insight": {
    "id": "ac_arcane_insight",
    "name": "奥能洞察",
    "faction": "academy",
    "type": "spell",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 1 张牌；若你本回合施放过战术牌，再抽 1 张。",
    "flavor": "第二眼才看见关键。",
    "copyLimit": 2,
    "spell": {
      "type": "drawIfSpellPlayed",
      "draw": 1,
      "bonus": 1
    }
  },
  "ac_school_bell": {
    "id": "ac_school_bell",
    "name": "学院钟声",
    "faction": "academy",
    "type": "spell",
    "cost": 4,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "抽 2 张牌。",
    "flavor": "钟声一响，所有人开始动笔。",
    "copyLimit": 2,
    "spell": {
      "type": "draw",
      "amount": 2
    }
  },
  "ac_archive_eruption": {
    "id": "ac_archive_eruption",
    "name": "档案爆发",
    "faction": "academy",
    "type": "spell",
    "cost": 5,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "对所有敌方随从造成等同于本局已使用战术牌的伤害。",
    "flavor": "被翻出来的东西，不会自己回去。",
    "copyLimit": 2,
    "spell": {
      "type": "damageAllPerSpell"
    }
  }
});

  const newCardIdsForGenericArt = [];;;;;;;;
  for (const id of newCardIdsForGenericArt) if (CARDS[id]) CARDS[id].noArtwork = true;

  for (const f of FACTION_IDS) {
    const special = DECK_SPECIALS[f];
    if (!special) continue;
    const equipment = [special.relic, special.relic2].filter(Boolean);
    const main = DECKS[f].filter(id => CARDS[id] && CARDS[id].type !== "equipment" && CARDS[id].type !== "relic");
    DECKS[f] = main.slice(0, 30).concat(equipment.slice(0, 2));
  }

  // ===== 预组定型（切合当前机制）=====
  //   · 阵型 3 张：左翼 / 中枢 / 右翼各能吃一张
  //   · 装备 3 张：场上同时生效 2 件，多一张用于被挤掉后轮换
  //   · 其余 24 张补随从与战术，优先挑数值效率高的
  const deckScore = (c) => {
    if (!c) return -99;
    let sc = 0;
    if (c.type === "minion") {
      sc += ((c.attack || 0) + (c.health || 0)) - (c.cost || 0) * 1.9 + (c.attack || 0) * 0.55;
      if ((c.health || 0) <= 1 && (c.cost || 0) >= 3) sc -= 1.2;
    } else if (c.type === "spell") sc += 3.4;
    for (const k of c.keywords || []) {
      sc += ({ charge: 3.2, rush: 2.6, taunt: 1.6, divineShield: 2.4, windfury: 2.2, lifesteal: 1.8, poisonous: 2.0, stealth: 1.4, reborn: 1.6, battlecry: 1.2, deathrattle: 1.0, passive: 1.0 })[k] || 0.4;
    }
    if ((c.cost || 0) <= 2) sc += 1.1;
    if ((c.cost || 0) >= 7) sc -= 1.0;
    return sc;
  };
  for (const f of FACTION_IDS) {
    const deck = DECKS[f] || [];
    const inFaction = (id) => CARDS[id] && (CARDS[id].faction === f || CARDS[id].faction === "neutral");
    const usable = (id) => CARDS[id] && !CARDS[id].token && !CARDS[id].disabled && !CARDS[id].experimental && !CARDS[id].easterEgg;
    const isGear = (id) => CARDS[id] && (CARDS[id].type === "equipment" || CARDS[id].type === "relic");
    const eqPool = [...new Set(
      deck.filter(id => usable(id) && isGear(id))
        .concat(Object.keys(CARDS).filter(id => usable(id) && inFaction(id) && isGear(id)))
    )].filter(id => CARDS[id].rarity !== "legendary" || deck.indexOf(id) >= 0);
    eqPool.sort((a, b) => deckScore(CARDS[b]) - deckScore(CARDS[a]));
    const equips = eqPool.slice(0, 3);
    const fmPool = [...new Set(
      deck.filter(id => usable(id) && CARDS[id].type === "formation")
        .concat(Object.keys(CARDS).filter(id => usable(id) && inFaction(id) && CARDS[id].type === "formation"))
    )].filter(id => CARDS[id].rarity !== "legendary" || deck.indexOf(id) >= 0);
    fmPool.sort((a, b) => deckScore(CARDS[b]) - deckScore(CARDS[a]));
    const formations = fmPool.slice(0, 3);
    const rest = deck.filter(id => CARDS[id] && !isGear(id) && CARDS[id].type !== "formation");
    const counts = {}; for (const id of rest) counts[id] = (counts[id] || 0) + 1;
    const taken = new Set(equips.concat(formations));
    const pool = Object.keys(CARDS)
      .filter(id => usable(id) && inFaction(id) && (CARDS[id].type === "minion" || CARDS[id].type === "spell"))
      .filter(id => !taken.has(id))
      .sort((a, b) => deckScore(CARDS[b]) - deckScore(CARDS[a]));
    for (const id of pool) {
      if (rest.length >= 24) break;
      if ((counts[id] || 0) >= maxCopies(CARDS[id])) continue;
      if (rest.indexOf(id) >= 0) continue;
      rest.push(id); counts[id] = (counts[id] || 0) + 1;
    }
    DECKS[f] = rest.slice(0, 24).concat(formations, equips);
  }

  DECKS.greyharbor = ["gh_bounty_notice","gh_formation","ledger_paperknife","gh_ledger_chain","venom_attendant","venom_attendant","gh_venom_apprentice","gh_venom_apprentice","gh_poison_thrower","gh_poison_thrower","bounty_accountant","bounty_accountant","gh_venom_shield","gh_venom_shield","gh_legend_assassin","gh_legend_assassin","gh_bounty_collector","gh_bounty_collector","kugreen","gh_scorpion","gh_scorpion","gh_bounty_hunter","gh_bounty_hunter","bounty_clerk","bounty_clerk","seran","toll_account","gh_ledger","fog_sailor","gh_contract_squire"];
  CARDS.lt_tide_warden = { id: "lt_tide_warden", name: "潮汐守卫", faction: "losutai", type: "minion", cost: 4, attack: 3, health: 5, rarity: "rare", art: null, noGeneratedArt: false, noArtwork: true, keywords: ["taunt"], target: "none", text: "守备。", flavor: "潮水退去，它还在守。", copyLimit: 2 };

  Object.assign(CARDS, {
  "lt_tide_totem": {
    "id": "lt_tide_totem",
    "name": "潮骨图腾",
    "faction": "losutai",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "潮骨一响，聚落就集合。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "lt_brood_armor": {
    "id": "lt_brood_armor",
    "name": "母巢甲",
    "faction": "losutai",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "巢壳比铁更懂潮。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "lt_venom_pouch": {
    "id": "lt_venom_pouch",
    "name": "毒囊",
    "faction": "losutai",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌。",
    "flavor": "毒囊里装的不止毒。",
    "copyLimit": 1,
    "equip": {
      "draw": 1
    }
  },
  "lt_tide_bell": {
    "id": "lt_tide_bell",
    "name": "潮汐铃",
    "faction": "losutai",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 3 点生命。",
    "flavor": "铃响一次，潮退一尺。",
    "copyLimit": 1,
    "equip": {
      "healHero": 3
    }
  },
  "lt_deep_eye": {
    "id": "lt_deep_eye",
    "name": "深海之眼",
    "faction": "losutai",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 2 张牌；获得 2 点护甲。",
    "flavor": "海的最深处，有东西在看你。",
    "copyLimit": 1,
    "equip": {
      "draw": 2,
      "armor": 2
    }
  },
  "snow_iceblade": {
    "id": "snow_iceblade",
    "name": "冰纹长剑",
    "faction": "snow",
    "type": "equipment",
    "equipmentKind": "weapon",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：你的所有友方随从获得 +1 攻击。",
    "flavor": "剑上的纹路像冻结的风。",
    "copyLimit": 1,
    "equip": {
      "buffAllAllies": {
        "attack": 1
      }
    }
  },
  "snow_frostplate": {
    "id": "snow_frostplate",
    "name": "霜晶护甲",
    "faction": "snow",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "霜晶不碎，只是慢慢长。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "snow_tundrabracer": {
    "id": "snow_tundrabracer",
    "name": "冻土护腕",
    "faction": "snow",
    "type": "equipment",
    "equipmentKind": "armor",
    "cost": 2,
    "rarity": "common",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲。",
    "flavor": "冻土护腕里，还留着雪都的冷。",
    "copyLimit": 1,
    "equip": {
      "armor": 2
    }
  },
  "snow_hourglass": {
    "id": "snow_hourglass",
    "name": "时序沙漏",
    "faction": "snow",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "rare",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 2 张牌。",
    "flavor": "沙漏两头的雪，同时在下。",
    "copyLimit": 1,
    "equip": {
      "draw": 2
    }
  },
  "snow_ember": {
    "id": "snow_ember",
    "name": "雪都火种",
    "faction": "snow",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 6,
    "rarity": "legendary",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：恢复领袖 5 点生命；抽 1 张牌。",
    "flavor": "雪都灭了，火种还在。",
    "copyLimit": 1,
    "equip": {
      "healHero": 5,
      "draw": 1
    }
  },
  "academy_inkwell": {
    "id": "academy_inkwell",
    "name": "学院墨池",
    "faction": "academy",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：抽 1 张牌；获得 1 点护甲。",
    "flavor": "墨池里的水，比战术牌还深。",
    "copyLimit": 1,
    "equip": {
      "draw": 1,
      "armor": 1
    }
  },
  "gh_ledger_chain": {
    "id": "gh_ledger_chain",
    "name": "账本锁链",
    "faction": "greyharbor",
    "type": "equipment",
    "equipmentKind": "trinket",
    "cost": 3,
    "rarity": "epic",
    "art": null,
    "noGeneratedArt": false,
    "noArtwork": true,
    "keywords": [],
    "target": "none",
    "text": "装备：获得 2 点护甲；抽 1 张牌。",
    "flavor": "账本合上，锁链才响。",
    "copyLimit": 1,
    "equip": {
      "armor": 2,
      "draw": 1
    }
  }
});

  const RARITY8_OVERRIDES = {"tiega":"legendary","lize":"legendary","grayfeather":"legendary","molan":"legendary","blood_elder":"legendary","xh_castle_consul":"legendary","tide_scout":"epic","xh_blood_colossus":"epic","blood_pact_collector":"epic","blood_priestess":"epic","blood_acolyte":"epic","blood_executor":"epic","xh_blood_priest":"epic","xh_blood_knight":"epic","xh_bone_guard":"epic","bloodroad_guide":"epic","xh_blood_tax":"rare","xh_pressure_master":"rare","ancient_fortress_scion":"rare","blood_duelist":"rare","xh_blood_feast_spell":"rare","xh_blood_steward":"rare","broken_bone_warlord":"rare","xh_blood_mist":"rare","xh_tribe_headhunter":"rare","xh_blood_brewer":"rare","blood_wraith":"rare","reflux":"rare","hunt_ritual":"rare","xh_blood_road":"rare","xh_night_watch":"common","blood_feast":"common","xh_blood_moon_altar":"common","tribal_warrior":"common","xh_alley_blade":"common","blood_infiltrator":"common","blood_ritual":"common","shadow_raid":"common","blood_pact":"common","blood_path":"common","blood_incense_divination":"common","blood_debt":"common","south_pole_tracker":"common","xh_blood_curse":"common","formation_tide":"common","xh_castle_pact":"common","blood_imp":"common","xh_blood_guard":"common","xh_bone_hunter":"common","blood_contract":"common","lanxi":"legendary","lanzhou":"legendary","lt_awakened":"legendary","lt_venom_lord":"legendary","lt_brood_mother":"legendary","lt_tide_mother":"legendary","pressure_warlock":"epic","lt_venom_behemoth":"epic","tide_colossus":"epic","losutai_matriarch":"epic","lt_tide_colossus":"epic","losutai_awakened":"epic","lt_reborn_behemoth":"epic","lt_tide_devourer":"epic","devourer":"epic","lt_deep_beast":"epic","lt_bone_warlock":"rare","brood_matron":"rare","losutai_hunter":"rare","lt_hatch_guard":"rare","blood_servant":"rare","lt_venom_thrower":"rare","monster_overseer":"rare","tribal_shaman":"rare","lt_brood_call":"rare","blood_corpse_collector":"rare","lt_brood_attendant":"rare","lt_tide_surge":"rare","lt_deep_sentinel":"rare","lt_tide_warden":"rare","lt_bone_scavenger":"common","venom_fang":"common","monster_summon":"common","lt_tide_hunter":"common","reborn_rite":"common","lt_tide_birth":"common","lt_venom_mist":"common","lt_hatch":"common","lt_reborn_rite":"common","blood_pool":"common","monster_nest":"common","lt_hatchery":"common","lt_venom_fang":"common","lt_reborn_spawn":"common","lt_venom_larva":"common","monster_command":"common","lt_venom_nest":"common","lt_tide_spawn":"common","blood_altar":"common","lt_tide_pool":"common","samuel":"legendary","nina":"legendary","snow_rin":"legendary","snow_time_shade":"legendary","snow_last_stand":"legendary","snow_frost_dragon":"legendary","frost_archivist":"epic","snow_blizzard_elemental":"epic","frost_professor":"epic","snow_ice_priest":"epic","snow_frost_colossus":"epic","snow_time_echo":"epic","snow_aurora_priestess":"epic","snow_last_snow":"epic","snow_fox_guard":"epic","snow_frozen_oracle":"epic","snow_time_stop":"rare","frost_line_guard":"rare","snow_last_tundra":"rare","echo_adept":"rare","snow_aurora":"rare","frost_scribe":"rare","frost_page":"rare","snow_priest":"rare","snow_guard_captain":"rare","snow_blizzard":"rare","snow_windweaver":"rare","snow_frostwind_novice":"rare","snow_coldwind_assassin":"rare","snow_throne":"rare","snow_frostclaw":"common","snow_ice_lance":"common","snow_icewall_guard":"common","snow_wind_altar":"common","snow_storm_hunter":"common","frost_seal":"common","snow_gale":"common","snow_ice_wall":"common","snow_frost_veil":"common","snow_wind_step":"common","snow_time_array":"common","snow_frozen_court":"common","snow_freeze_touch":"common","snow_wind_strike":"common","white_frost_hall":"common","snow_windwall":"common","snow_tundra_hunt":"common","snow_fox_sentry":"common","snow_icewall_formation":"common","snow_refugee":"common","formation_script":"epic"};
  for (const id of Object.keys(RARITY8_OVERRIDES)) if (CARDS[id]) CARDS[id].rarity = RARITY8_OVERRIDES[id];

  Object.assign(DECK_SPECIALS, {
    losutai: { formation: "lt_tide_pool", relic: "gh_venom_vial", relic2: "lt_tide_totem" },
    snow: { formation: "snow_icewall_formation", relic: "frost_prism", relic2: "snow_hourglass" }
  });
  for (const f of ["losutai", "snow"]) DECKS[f] = autoBuildDeck(f, f === "snow" ? "control" : "midrange");

  DECK_SPECIALS.academy.relic = "spell_codex";
  DECK_SPECIALS.academy.relic2 = "academy_inkwell";
  DECK_SPECIALS.greyharbor.relic = "gh_bounty_board";
  DECK_SPECIALS.greyharbor.relic2 = "gh_ledger_chain";
  DECKS.academy = autoBuildDeck("academy", "control");
  DECKS.xizhao = autoBuildDeck("xizhao", "aggro");
  DECKS.greyharbor = autoBuildDeck("greyharbor", "midrange");

  const REP_WARD = ["konrad","erhardt","beatrix","republic_guard","shield_marshal","formation_wall","drill_sergeant","iron_phalanx","shield_sergeant","bulwark_sentry","line_spearman","reborn_sentry","echo_standard","reborn_shield_guard","house_legacy","phalanx_warden"];
  for (const id of REP_WARD) {
    const c = CARDS[id]; if (!c) continue;
    if (c.type === "formation") { c.formation = { taunt: true }; c.text = "该阵位友方随从获得守备。"; continue; }
    if (c.type === "spell") {
      delete c.deathrattle; c.target = "friendly"; c.spell = { type: "buffTaunt", health: 2 }; c.text = "使一个友方随从获得 +0/+2 和守备。";
      if (id === "house_legacy") { c.target = "none"; c.spell = { type: "armorDraw", armor: 2, draw: 1 }; c.text = "获得 2 点护甲；抽 1 张牌。"; }
      continue;
    }
    if (id === "konrad") { c.battlecry = { type: "armor", amount: 2 }; c.text = "登场：获得 2 点护甲。"; }
    if (id === "beatrix") { c.battlecry = { type: "armor", amount: 1 }; c.text = "登场：获得 1 点护甲。"; }
    delete c.deathrattle; delete c.deathrattles;
    c.keywords = (c.keywords || []).filter(k => k !== "deathrattle" && k !== "reborn");
    if (!c.keywords.includes("taunt")) c.keywords.push("taunt");
    if (!c.keywords.includes("ward")) c.keywords.push("ward");
    c.passive = { type: "wardOnDeath", amount: 1 };
    c.text = "守备。筑防 1：死亡时获得 1 点护甲。";
  }
  const GREY_BOUNTY = ["gh_venom_apprentice","gh_poison_thrower","gh_venom_shield","gh_legend_assassin","gh_scorpion","venom_attendant","poison_mist_thrower","venom_blade","venom_sac_guard","kugreen"];
  for (const id of GREY_BOUNTY) {
    const c = CARDS[id]; if (!c) continue;
    c.keywords = (c.keywords || []).filter(k => k !== "poisonous");
    delete c.poisonous;
    if (id === "venom_blade") { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; c.target = "none"; }
    else if (id === "poison_mist_thrower") { c.battlecry = { type: "damage", amount: 1 }; c.text = "登场：对一个敌方随从造成 1 点伤害。"; }
    else if (id === "kugreen") { c.passive = { type: "bountyClaimHeal", heal: 1 }; c.text = "被动：每完成一次悬赏，恢复 1 点生命。"; }
    else if (c.type === "minion" && !c.battlecry && !c.passive) { c.battlecry = { type: "markBounty" }; c.target = "enemy"; c.text = "登场：将一个敌方随从列入悬赏名单。"; }
    else { c.passive = c.passive || { type: "bountyClaimHeal", heal: 1 }; c.text = "悬赏行成员。"; }
  }
  if (CARDS.echo_observer) { CARDS.echo_observer.passive = { type: "spellDrawOne" }; CARDS.echo_observer.text = "被动：每当你施放一张战术牌，抽 1 张牌。"; }

  DECKS.academy = ["doorman","doorman","white_reef_keeper","white_reef_keeper","archive_guard","archive_guard","wandering_guard","wandering_guard","caravan_guard","caravan_guard","sky_ship","sky_ship","magic_lecturer","magic_lecturer","record_clerk","pure_theorist","pure_theorist","spell_novice","ac_arcane_flood","ac_grand_library","ac_spell_copy","ac_knowledge_burst","ac_absolute_theory","ac_final_proof","ac_field_notes","ac_arcane_insight","ac_school_bell","ac_archive_eruption"].concat(["formation_script", "formation_script", "spell_codex", "academy_inkwell"]);

  for (const f of FACTION_IDS) {
    const deck = DECKS[f] || [];
    const eq = deck.filter(id => CARDS[id] && (CARDS[id].type === "equipment" || CARDS[id].type === "relic"));
    const forms = deck.filter(id => CARDS[id] && CARDS[id].type === "formation");
    const main = deck.filter(id => CARDS[id] && CARDS[id].type !== "equipment" && CARDS[id].type !== "relic" && CARDS[id].type !== "formation");
    DECKS[f] = main.slice(0, 26).concat(forms.slice(0, 2), eq.slice(0, 2));
  }

  for (const c of Object.values(CARDS)) {
    if (c.type !== "equipment" || !c.equip) continue;
    const e = c.equip, aura = {};
    if (e.buffAllAllies) { if (e.buffAllAllies.attack) aura.attack = e.buffAllAllies.attack; if (e.buffAllAllies.health) aura.health = e.buffAllAllies.health; }
    if (e.armor) aura.armorTurn = 1;
    if (e.healHero) aura.healTurn = 1;
    if (e.draw) aura.spellDraw = 1;
    if (e.damageAllEnemies) aura.turnDamage = 1;
    if (e.maxHp) aura.maxHp = e.maxHp;
    c.equipAura = aura;
    delete c.equip;
    const bits = [];
    if (aura.attack) bits.push("你的所有友方随从获得 +" + aura.attack + " 攻击");
    if (aura.health) bits.push("你的所有友方随从获得 +" + aura.health + " 生命");
    if (aura.armorTurn) bits.push("你的回合开始时获得 1 点护甲");
    if (aura.healTurn) bits.push("你的回合开始时恢复 1 点生命");
    if (aura.spellDraw) bits.push("每当你施放战术，抽 1 张牌");
    if (aura.turnDamage) bits.push("你的回合开始时对所有敌方随从造成 1 点伤害");
    if (aura.maxHp) bits.push("你的生命上限 +" + aura.maxHp);
    c.text = "装备：" + bits.join("；") + "。";
  }

  for (const c of Object.values(CARDS)) {
    if (c.faction === "neutral" && c.type === "minion" && c.cost <= 2 && (c.keywords || []).length === 0 && (c.attack || 0) + (c.health || 0) <= 3) {
      c.health = (c.health || 1) + 1;
      c.text = c.text + " 旅者体魄：生命 +1。";
    }
  }
  Object.assign(CARDS.lt_hatchery, { formation: { rush: true }, text: "该阵位友方随从获得先遣。" });
  Object.assign(CARDS.snow_windwall, { formation: { taunt: true }, text: "该阵位友方随从获得守备。" });
  Object.assign(CARDS.snow_frozen_court, { formation: { taunt: true }, text: "该阵位友方随从获得守备。" });
  Object.assign(CARDS.xh_blood_moon_altar, { formation: { lifesteal: true }, text: "该阵位友方随从获得血偿。" });

  Object.assign(CARDS.vein_channel, { spell: { type: "healHero", amount: 3 }, text: "恢复你的领袖 3 点生命。" });
  Object.assign(CARDS.supply_cache, { spell: { type: "armor", amount: 2 }, text: "获得 2 点护甲。" });
  Object.assign(CARDS.world_map, { spell: { type: "discover" }, text: "发现一张牌。" });
  Object.assign(CARDS.mist_bargain, { spell: { type: "damageAllEnemies", amount: 1 }, text: "对所有敌方随从造成 1 点伤害。" });
  Object.assign(CARDS.north_trail, { spell: { type: "discover" }, text: "发现一张牌。" });
  for (const c of Object.values(CARDS)) {
    if (c.faction !== "neutral" || c.type !== "minion" || c.cost > 3 || (c.keywords || []).length) continue;
    if ((c.attack || 0) <= 2) { c.attack = (c.attack || 0) + 1; c.text = c.text + " 荒原历练：攻击 +1。"; }
  }

  for (const c of Object.values(CARDS)) {
    if (c.faction !== "neutral" || c.type !== "minion" || c.token || c.rarity === "legendary") continue;
    if (c.cost >= 2 && c.cost <= 3 && (c.health || 0) <= 3) { c.health = (c.health || 1) + 1; c.text = c.text + " 荒原体魄：生命 +1。"; }
  }

  const EQUIP_DIVERSIFY = {"tide_ward_bracer":{"health":1},"frostweave_cloak":{"healTurn":1},"beast_hide_armor":{"attack":1},"blackridge_heavy_armor":{"maxHp":3},"blackmarket_bracer":{"spellDraw":1},"anvil_bracer":{"attack":1},"lt_brood_armor":{"health":1},"snow_tundrabracer":{"healTurn":1},"floating_anchor":{"armorTurn":1},"floating_ink_blade":{"spellDraw":1},"bone_fang_blade":{"healTurn":1},"iron_order_hammer":{"armorTurn":1},"brokenline_dagger":{"spellDraw":1},"ksetra_beacon_item":{"attack":1},"cataloging_lens":{"health":1},"seven_cities_crest":{"armorTurn":1},"ledger_paperknife":{"attack":1},"fog_harbor_ticket":{"healTurn":1},"gambler_dice":{"health":1},"lt_venom_pouch":{"attack":1},"snow_hourglass":{"healTurn":1},"white_reef_lamp_oil":{"armorTurn":1},"snow_capital_lamp":{"health":1}};
  for (const [id, aura] of Object.entries(EQUIP_DIVERSIFY)) {
    const c = CARDS[id]; if (!c) continue;
    c.equipAura = aura;
    const bits = [];
    if (aura.attack) bits.push("你的所有友方随从获得 +" + aura.attack + " 攻击");
    if (aura.health) bits.push("你的所有友方随从获得 +" + aura.health + " 生命");
    if (aura.armorTurn) bits.push("你的回合开始时获得 1 点护甲");
    if (aura.healTurn) bits.push("你的回合开始时恢复 1 点生命");
    if (aura.spellDraw) bits.push("每当你施放战术，抽 1 张牌");
    if (aura.turnDamage) bits.push("你的回合开始时对所有敌方随从造成 1 点伤害");
    if (aura.maxHp) bits.push("你的生命上限 +" + aura.maxHp);
    c.text = "装备：" + bits.join("；") + "。";
  }

  const FORMATION_FINAL = {"formation_weaver":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"formation_bastion":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"formation_bugler":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"formation_artificer":{"formation":{"taunt":true,"health":1},"text":"该阵位友方随从获得 +0/+1 和守备。"},"formation_watcher":{"formation":{"lifesteal":true},"text":"该阵位友方随从获得血偿。"},"formation_officer":{"formation":{"rush":true},"text":"该阵位友方随从获得先遣。"},"council_gallery":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"archive_search":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"insight":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"prohibition":{"formation":{"rush":true},"text":"该阵位友方随从获得先遣。"},"formation_script":{"formation":{"stealth":true},"text":"该阵位友方随从获得隐匿。"},"double_column_note":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"school_debate":{"formation":{"attack":2},"text":"该阵位友方随从获得 +2 攻击。"},"floating_library":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"formation_tide":{"formation":{"lifesteal":true},"text":"该阵位友方随从获得血偿。"},"blood_contract":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"blood_feast":{"formation":{"attack":2},"text":"该阵位友方随从获得 +2 攻击。"},"xh_castle_pact":{"formation":{"taunt":true,"health":1},"text":"该阵位友方随从获得 +0/+1 和守备。"},"xh_blood_moon_altar":{"formation":{"stealth":true},"text":"该阵位友方随从获得隐匿。"},"fortify":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"volley":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"martial_law":{"formation":{"taunt":true,"health":1},"text":"该阵位友方随从获得 +0/+1 和守备。"},"formation_wall":{"formation":{"taunt":true,"attack":1},"text":"该阵位友方随从获得 +1 攻击和守备。"},"phalanx_warden":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"emergency_bill":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"parliament_debate":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"battlefield_bill":{"formation":{"rush":true},"text":"该阵位友方随从获得先遣。"},"barrage":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"siege_train":{"formation":{"attack":2},"text":"该阵位友方随从获得 +2 攻击。"},"zone_barrage":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"armor_volley":{"formation":{"taunt":true,"health":1},"text":"该阵位友方随从获得 +0/+1 和守备。"},"armor_drive":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"battlefield_salvage":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"blackridge_mine":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"gh_bounty_notice":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"gh_black_market":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"gh_silence_field":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"gh_silence_master":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"gh_company":{"formation":{"rush":true},"text":"该阵位友方随从获得先遣。"},"gh_venom_behemoth":{"formation":{"attack":2},"text":"该阵位友方随从获得 +2 攻击。"},"gh_formation":{"formation":{"lifesteal":true},"text":"该阵位友方随从获得血偿。"},"lamp_post":{"formation":{"stealth":true},"text":"该阵位友方随从获得隐匿。"},"monster_summon":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"blood_altar":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"blood_pool":{"formation":{"lifesteal":true},"text":"该阵位友方随从获得血偿。"},"monster_command":{"formation":{"rush":true},"text":"该阵位友方随从获得先遣。"},"monster_nest":{"formation":{"deathrattleSummon":"losutai_imp"},"text":"该阵位友方随从获得余响：召唤一个 1/1 洛斯汰魔物。"},"lt_tide_pool":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"lt_venom_nest":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"lt_hatchery":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"white_frost_hall":{"formation":{"attackVsFrozen":1},"text":"该阵位友方随从攻击已冻结随从时 +1 攻击。"},"snow_icewall_formation":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"snow_windwall":{"formation":{"taunt":true,"health":1},"text":"该阵位友方随从获得 +0/+1 和守备。"},"snow_tundra_hunt":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"snow_time_array":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"snow_frozen_court":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"snow_wind_altar":{"formation":{"attack":2},"text":"该阵位友方随从获得 +2 攻击。"},"snow_throne":{"formation":{"taunt":true,"attack":1},"text":"该阵位友方随从获得 +1 攻击和守备。"},"snow_last_tundra":{"formation":{"attack":2,"health":2},"text":"该阵位友方随从获得 +2/+2。"},"wayfarer_camp":{"formation":{"health":1,"taunt":true},"text":"该阵位友方随从获得 +0/+1 和守备。"},"no_mans_land":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"mist_pier":{"formation":{"rush":true},"text":"该阵位友方随从获得先遣。"},"white_reef_light":{"formation":{"taunt":true},"text":"该阵位友方随从获得守备。"},"anvil_forge_row":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"north_hunt_camp":{"formation":{"attack":2},"text":"该阵位友方随从获得 +2 攻击。"},"snow_warmhouse":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"losutai_pool":{"formation":{"health":2},"text":"该阵位友方随从获得 +0/+2。"},"smugglers_dock":{"formation":{"attack":1,"rush":true},"text":"该阵位友方随从获得 +1 攻击和先遣。"},"dusk_inn_yard":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"world_edge_camp":{"formation":{"attack":1,"health":1},"text":"该阵位友方随从获得 +1/+1。"},"gok_lamp_row":{"formation":{"health":1},"text":"该阵位友方随从获得 +0/+1。"},"no_mans_camp":{"formation":{"attack":1,"taunt":true},"text":"该阵位友方随从获得 +1 攻击和守备。"},"grey_ledger_post":{"formation":{"lifesteal":true},"text":"该阵位友方随从获得血偿。"},"forgotten_gate":{"formation":{"attack":2,"health":2},"text":"该阵位友方随从获得 +2/+2。"}};
  for (const [id, val] of Object.entries(FORMATION_FINAL)) if (CARDS[id] && id !== "barrage" && id !== "siege_train") Object.assign(CARDS[id], val);

  const FORMATION_KEYWORDS = {"monster_summon":{"formation":{"poisonous":true},"text":"该阵位友方随从获得蚀毒。"},"lt_hatchery":{"formation":{"reborn":true},"text":"该阵位友方随从获得回潮。"},"snow_tundra_hunt":{"formation":{"windfury":true},"text":"该阵位友方随从获得连携。"},"snow_wind_altar":{"formation":{"windfury":true},"text":"该阵位友方随从获得连携。"}};
  for (const [id, val] of Object.entries(FORMATION_KEYWORDS)) if (CARDS[id]) Object.assign(CARDS[id], val);

  if (CARDS.snow_fox_sentry) { CARDS.snow_fox_sentry.keywords = ["taunt"]; CARDS.snow_fox_sentry.text = "守备。"; }
  if (CARDS.venom_sac_guard) { CARDS.venom_sac_guard.keywords = (CARDS.venom_sac_guard.keywords || []).filter(k => k !== "deathrattle"); }
  if (CARDS.gh_venom_shield) { CARDS.gh_venom_shield.name = "格挡刺客"; CARDS.gh_venom_shield.text = "格挡。登场：将一个敌方随从列入悬赏名单。"; }
  if (CARDS.gh_venom_behemoth) { CARDS.gh_venom_behemoth.name = "断潮兽阵"; CARDS.gh_venom_behemoth.text = "该阵位友方随从获得 +2 攻击。"; }
  if (CARDS.south_pole_tracker) { CARDS.south_pole_tracker.name = "南极测绘"; CARDS.south_pole_tracker.spell = { type: "discover" }; CARDS.south_pole_tracker.text = "发现一张牌。"; }
  if (CARDS.north_beast_tamer) { CARDS.north_beast_tamer.name = "北境唤潮者"; }
  if (CARDS.medical_stretcher) { CARDS.medical_stretcher.spell = { type: "healHeroDraw", heal: 2, draw: 1 }; CARDS.medical_stretcher.text = "恢复你的领袖 2 点生命；抽 1 张牌。"; }

  const GREY_RENAMES = {"gh_venom_apprentice":"悬赏行学徒","gh_poison_thrower":"悬赏刃投手","venom_attendant":"悬赏侍从","venom_blade":"悬赏刀锋","poison_mist_thrower":"封口投手","venom_sac_guard":"悬赏守卫"};
  for (const [id, name] of Object.entries(GREY_RENAMES)) if (CARDS[id]) CARDS[id].name = name;

  for (const [id, atk, hp] of [["card_shark",4,3],["anvil_town_miner",2,4],["fog_dockhand",4,3]]) { if (CARDS[id]) { CARDS[id].attack = atk; CARDS[id].health = hp; } }

  if (CARDS.ironflow_charge) CARDS.ironflow_charge.text = "使一个友方随从获得先遣；若它在本回合死亡，抽 1 张牌。";
  if (CARDS.medical_stretcher) { CARDS.medical_stretcher.spell = { type: "healHeroDraw", heal: 1, draw: 2 }; CARDS.medical_stretcher.text = "恢复你的领袖 1 点生命；抽 2 张牌。"; }

  DECKS.losutai = ["lt_hatch","lt_tide_spawn","lt_venom_larva","lt_venom_fang","lt_reborn_spawn","lt_reborn_spawn","lt_hatch_guard","lt_hatch_guard","lt_brood_attendant","lt_brood_attendant","brood_matron","brood_matron","monster_overseer","monster_overseer","tribal_shaman","tribal_shaman","lanxi","lanzhou","lt_brood_mother","lt_awakened","lt_tide_mother","lt_venom_behemoth","lt_tide_birth","lt_tide_birth","lt_venom_mist","lt_tide_surge","blood_pool","monster_nest","gh_venom_vial","lt_tide_totem"];
  // thematic snow v2

  DECKS.snow = ["snow_storm_hunter","snow_storm_hunter","snow_icewall_guard","snow_icewall_guard","snow_priest","snow_priest","snow_guard_captain","snow_guard_captain","snow_frostclaw","snow_frostclaw","snow_coldwind_assassin","snow_coldwind_assassin","snow_frozen_oracle","snow_frozen_oracle","snow_windweaver","snow_windweaver","snow_rin","snow_time_echo","snow_blizzard_elemental","snow_frost_dragon","snow_time_shade","snow_freeze_touch","snow_freeze_touch","snow_wind_strike","snow_icewall_formation","snow_windwall","white_frost_hall","frost_prism","snow_hourglass","snow_blizzard"];

  const FORMATION_MORE = {"double_column_note":{"formation":{"windfury":true},"text":"该阵位友方随从获得连携。"},"gh_silence_master":{"formation":{"stealth":true},"text":"该阵位友方随从获得隐匿。"},"phalanx_warden":{"formation":{"taunt":true,"attack":1},"text":"该阵位友方随从获得 +1 攻击和守备。"},"losutai_pool":{"formation":{"poisonous":true},"text":"该阵位友方随从获得蚀毒。"},"insight":{"formation":{"windfury":true},"text":"该阵位友方随从获得连携。"},"parliament_debate":{"formation":{"attack":1},"text":"该阵位友方随从获得 +1 攻击。"},"snow_warmhouse":{"formation":{"taunt":true,"health":1},"text":"该阵位友方随从获得 +0/+1 和守备。"}};
  for (const [id, val] of Object.entries(FORMATION_MORE)) if (CARDS[id]) Object.assign(CARDS[id], val);

  const EQUIP_MORE = {"ksetra_beacon_item":{"health":1},"border_lance":{"armorTurn":1},"snow_iceblade":{"health":1},"whitefrost_bell":{"attack":1},"white_reef_lamp_oil":{"health":1},"lt_tide_bell":{"armorTurn":1},"fog_harbor_ticket":{"health":1}};
  for (const [id, aura] of Object.entries(EQUIP_MORE)) { const c=CARDS[id]; if(!c) continue; c.equipAura=aura; const bits=[]; if(aura.attack)bits.push("你的所有友方随从获得 +"+aura.attack+" 攻击"); if(aura.health)bits.push("你的所有友方随从获得 +"+aura.health+" 生命"); if(aura.armorTurn)bits.push("你的回合开始时获得 1 点护甲"); if(aura.healTurn)bits.push("你的回合开始时恢复 1 点生命"); if(aura.spellDraw)bits.push("每当你施放战术，抽 1 张牌"); if(aura.turnDamage)bits.push("你的回合开始时对所有敌方随从造成 1 点伤害"); if(aura.maxHp)bits.push("你的生命上限 +"+aura.maxHp); c.text="装备："+bits.join("；")+"。"; }

  const STAT_TUNE = {"snow_frostwind_novice":[2,3],"snow_icewall_guard":[3,5],"snow_guard_captain":[5,5],"snow_frostclaw":[5,4],"snow_coldwind_assassin":[4,3],"snow_frozen_oracle":[4,4],"snow_windweaver":[4,4],"snow_priest":[2,4],"lt_venom_fang":[1,1],"lt_venom_larva":[1,1],"lt_tide_spawn":[1,1]};
  for (const [id, arr] of Object.entries(STAT_TUNE)) { const c=CARDS[id]; if(!c) continue; c.attack=arr[0]; c.health=arr[1]; }
  if (CARDS.lt_tide_spawn) { CARDS.lt_tide_spawn.keywords = (CARDS.lt_tide_spawn.keywords||[]).filter(k=>k!=="poisonous"); CARDS.lt_tide_spawn.text = "潮边最弱的一只，但活得最久。"; }

  // ===== e52 审查修正：恢复被批量共和化覆盖的独特卡，统一文案 =====
  const REP_UNIQUE = {
    erhardt: { keywords: ["charge","taunt","ward"], passive: { type: "wardOnDeath", amount: 1 }, text: "守备。先遣。筑防 1：死亡时获得 1 点护甲。" },
    beatrix: { keywords: ["taunt","ward"], passive: { type: "wardOnDeath", amount: 1 }, battlecry: { type: "armor", amount: 2 }, text: "守备。筑防 1。登场：获得 2 点护甲。" },
    konrad: { keywords: ["taunt","ward"], passive: { type: "wardOnDeath", amount: 1 }, battlecry: { type: "armor", amount: 2 }, text: "守备。筑防 1。登场：获得 2 点护甲。" },
    reborn_sentry: { keywords: ["taunt","reborn"], passive: null, text: "守备。回潮。" },
    reborn_shield_guard: { keywords: ["taunt","reborn"], passive: null, text: "守备。回潮。" },
    republic_guard: { keywords: ["taunt"], passive: { type: "armorOnDamage", amount: 1 }, text: "守备。每当该随从受到伤害，获得 1 点护甲。" }
  };
  for (const [id, val] of Object.entries(REP_UNIQUE)) if (CARDS[id]) Object.assign(CARDS[id], val);
  const MORE_FORM = {
    formation_weaver: { formation: { reborn: true }, text: "该阵位友方随从固定获得回潮。" },
    formation_bugler: { formation: { deathrattleSummon: "medic_apprentice", excludeDeathrattle: "medic_apprentice" }, text: "该阵位友方随从固定获得余响：召唤一个医疗学徒。" },
    martial_law: { formation: { deathrattleSummon: "republic_recruit", excludeDeathrattle: "republic_recruit" }, text: "该阵位友方随从固定获得余响：召唤一个 1/1 共和国新兵。" },
    phalanx_warden: { formation: { taunt: true, reborn: true }, text: "该阵位友方随从固定获得守备和回潮。" },
    zone_barrage: { formation: { windfury: true }, text: "该阵位友方随从固定获得连携。" },
    monster_nest: { formation: { deathrattleSummon: "losutai_imp", excludeDeathrattle: "losutai_imp" }, text: "该阵位友方随从固定获得余响：召唤一个 1/1 洛斯汰魔物。" },
    snow_warmhouse: { formation: { deathrattleSummon: "snow_medic", excludeDeathrattle: "snow_medic" }, text: "该阵位友方随从固定获得余响：召唤一个雪镇医者。" },
    snow_tundra_hunt: { formation: { rush: true }, text: "该阵位友方随从固定获得先遣。" },
    snow_frozen_court: { formation: { attackVsFrozen: 2 }, text: "该阵位友方随从攻击已冻结随从时 +2 攻击。" },
    gh_formation: { formation: { stealth: true }, text: "该阵位友方随从固定获得隐匿。" },
    lamp_post: { formation: { taunt: true }, text: "该阵位友方随从固定获得守备。" },
    snow_time_array: { formation: { reborn: true }, text: "该阵位友方随从固定获得回潮。" }
  };
  for (const [id, val] of Object.entries(MORE_FORM)) if (CARDS[id]) Object.assign(CARDS[id], val);
  const AURA_FIX = {
    lt_deep_eye: { armorTurn: 2, spellDraw: 1 }, snow_ember: { healTurn: 2, spellDraw: 1 },
    dusk_inn_key: { healTurn: 1, spellDraw: 1, maxHp: 5 }, smuggler_anchor: { turnDamage: 2 },
    seven_cities_crest: { armorTurn: 2 }, iron_order_hammer: { attack: 1, armorTurn: 1 },
    whitefrost_bell: { health: 1, healTurn: 1 }, floating_ink_blade: { attack: 1, spellDraw: 1 }
  };
  for (const [id, aura] of Object.entries(AURA_FIX)) {
    const c = CARDS[id]; if (!c) continue; c.equipAura = aura;
    const bits = [];
    if (aura.attack) bits.push("你的所有友方随从获得 +" + aura.attack + " 攻击");
    if (aura.health) bits.push("你的所有友方随从获得 +" + aura.health + " 生命");
    if (aura.armorTurn) bits.push("你的回合开始时获得 " + aura.armorTurn + " 点护甲");
    if (aura.healTurn) bits.push("你的回合开始时恢复 " + aura.healTurn + " 点生命");
    if (aura.spellDraw) bits.push("每当你施放战术，抽 " + aura.spellDraw + " 张牌");
    if (aura.turnDamage) bits.push("你的回合开始时对所有敌方随从造成 " + aura.turnDamage + " 点伤害");
    if (aura.maxHp) bits.push("你的生命上限 +" + aura.maxHp);
    c.text = "装备：" + bits.join("；") + "。";
  }
  if (CARDS.floating_ink_blade) CARDS.floating_ink_blade.cost = 3;
  if (CARDS.old_ledger) { CARDS.old_ledger.spell = { type: "drawIfSpellPlayed", draw: 1, bonus: 1 }; CARDS.old_ledger.text = "抽 1 张牌；若你本回合施放过战术牌，再抽 1 张。"; }
  if (CARDS.gok_lamp) { CARDS.gok_lamp.spell = { type: "antiFreezeHeal", heal: 1 }; CARDS.gok_lamp.text = "恢复你的领袖 1 点生命；本回合免疫冻结。"; }
  if (CARDS.old_compass) { CARDS.old_compass.spell = { type: "discover", pool: "any" }; }
  if (CARDS.north_trail) { CARDS.north_trail.spell = { type: "discover", pool: "minion" }; CARDS.north_trail.text = "发现一张随从牌。"; }
  if (CARDS.world_map) { CARDS.world_map.spell = { type: "discover", pool: "spell" }; CARDS.world_map.text = "发现一张战术牌。"; }
  if (CARDS.arcane_conduit) { CARDS.arcane_conduit.passive = { type: "spellArmor" }; CARDS.arcane_conduit.text = "被动：每当你施放战术牌，获得等同于其行动力消耗的护甲。"; }
  if (CARDS.kugreen) { CARDS.kugreen.passive = { type: "bountyClaimDamage", amount: 2 }; CARDS.kugreen.text = "被动：每完成一次悬赏，对敌方领袖造成 2 点伤害。"; }
  // 卡名去重
  if (CARDS.mercenary) CARDS.mercenary.name = "荒原佣兵";
  if (CARDS.lt_tide_colossus) CARDS.lt_tide_colossus.name = "潮骸古巨像";
  if (CARDS.devourer) CARDS.devourer.name = "噬潮魔";
  if (CARDS.lt_reborn_rite) CARDS.lt_reborn_rite.name = "回潮旧仪";
  if (CARDS.world_map_item) CARDS.world_map_item.name = "世界地图·拓本";
  // 清掉内部调参标签
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text.replace(/ (荒原体魄|荒原历练|旅者体魄)：[^。]*。/g, "");
  }
  // 统一文案
  for (const c of Object.values(CARDS)) {
    if (c.type === "equipment" && c.text && c.text.startsWith("装备：")) c.text = c.text.replace(/^装备：/, "装备（持续生效）：");
    if (c.type === "formation" && c.text && /^该阵位友方随从获得/.test(c.text)) c.text = c.text.replace("该阵位友方随从获得", "该阵位友方随从固定获得");
    if ((c.keywords || []).includes("battlecry") && c.text && !/^(登场|战吼|被动|余响)/.test(c.text)) c.text = "登场：" + c.text;
  }

  const AURA_FIX2 = {"cataloging_lens":{"health":2},"gambler_dice":{"health":1,"healTurn":1},"lt_brood_armor":{"health":1,"healTurn":1},"snow_capital_lamp":{"health":1,"armorTurn":1},"tide_ward_bracer":{"armorTurn":1,"health":1},"ksetra_beacon_item":{"attack":1},"snow_iceblade":{"spellDraw":1},"white_reef_lamp_oil":{"healTurn":1},"fog_harbor_ticket":{"spellDraw":1},"northern_bone_flute":{"healTurn":1}};
  for (const [id, aura] of Object.entries(AURA_FIX2)) { const c=CARDS[id]; if(!c) continue; c.equipAura=aura; const bits=[]; if(aura.attack)bits.push("你的所有友方随从获得 +"+aura.attack+" 攻击"); if(aura.health)bits.push("你的所有友方随从获得 +"+aura.health+" 生命"); if(aura.armorTurn)bits.push("你的回合开始时获得 "+aura.armorTurn+" 点护甲"); if(aura.healTurn)bits.push("你的回合开始时恢复 "+aura.healTurn+" 点生命"); if(aura.spellDraw)bits.push("每当你施放战术，抽 "+aura.spellDraw+" 张牌"); if(aura.turnDamage)bits.push("你的回合开始时对所有敌方随从造成 "+aura.turnDamage+" 点伤害"); if(aura.maxHp)bits.push("你的生命上限 +"+aura.maxHp); c.text="装备："+bits.join("；")+"。"; }

  for (const id of ["elsa","empire_guard","snow_medic"]) if (CARDS[id]) CARDS[id].keywords = (CARDS[id].keywords || []).filter(k => k !== "battlecry");
  if (CARDS.white_frost_hall) CARDS.white_frost_hall.text = "该阵位友方随从固定获得：攻击已冻结随从时 +1 攻击。";
  for (const c of Object.values(CARDS)) { if (c.type === "equipment" && c.text) { if (c.text.startsWith("装备：")) c.text = c.text.replace(/^装备：/, "装备（持续生效）："); else if (!c.text.startsWith("装备（持续生效）：")) c.text = "装备（持续生效）：" + c.text; } }

  for (const c of Object.values(CARDS)) {
    c.keywords = (c.keywords || []).filter(k => k !== "passive");
    if (c.keywords.includes("battlecry") && !c.battlecry) c.keywords = c.keywords.filter(k => k !== "battlecry");
    if (c.keywords.includes("deathrattle") && !c.deathrattle) c.keywords = c.keywords.filter(k => k !== "deathrattle");
    if (c.passive && c.text && !c.text.includes("被动")) c.text = "被动：" + c.text;
    if (c.battlecry && c.text && !c.text.includes("登场")) c.text = "登场：" + c.text;
  }
  if (CARDS.snow_frozen_court) CARDS.snow_frozen_court.text = "该阵位友方随从固定获得：攻击已冻结随从时 +2 攻击。";
  if (CARDS.erhardt) { delete CARDS.erhardt.battlecry; CARDS.erhardt.text = "守备。先遣。被动：筑防 1，死亡时获得 1 点护甲。"; }

  if (CARDS.venom_sac_guard) { delete CARDS.venom_sac_guard.deathrattle; CARDS.venom_sac_guard.keywords = (CARDS.venom_sac_guard.keywords || []).filter(k => k !== "deathrattle"); }

  for (const c of Object.values(CARDS)) { delete c.target2; }

  DECKS.greyharbor = ["venom_attendant","venom_attendant","gh_venom_apprentice","gh_venom_apprentice","gh_poison_thrower","gh_poison_thrower","bounty_accountant","bounty_accountant","gh_venom_shield","gh_venom_shield","gh_legend_assassin","gh_legend_assassin","gh_bounty_collector","gh_bounty_collector","kugreen","gh_scorpion","gh_scorpion","seran","gh_bounty_hunter","gh_bounty_hunter","bounty_clerk","bounty_clerk","gh_bounty_king","gh_bounty_verdict","toll_account","gh_ledger","gh_bounty_notice","gh_formation","gh_bounty_board","gh_ledger_chain"];

  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/登场：(先遣|隐匿|连携|守备|格挡|蚀毒|血偿|回潮|先遣)/g, "$1。")
      .replace(/登场：被动：/g, "被动：")
      .replace(/被动：(守备|先遣|连携|隐匿|格挡)。/g, "$1。")
      .replace(/登场：掘脉 1；登场：/g, "掘脉 1。登场：")
      .replace(/登场：登场：/g, "登场：")
      .replace(/^守备。守备。/g, "守备。")
      .replace(/^先遣。先遣。/g, "先遣。")
      .replace(/^隐匿。隐匿。/g, "隐匿。");
  }
  if (CARDS.venom_sac_guard) CARDS.venom_sac_guard.text = "守备。登场：将一个敌方随从列入悬赏名单。";
  if (CARDS.gh_legend_assassin) CARDS.gh_legend_assassin.text = "先遣。登场：将一个敌方随从列入悬赏名单。";
  if (CARDS.gh_scorpion) CARDS.gh_scorpion.text = "格挡。登场：将一个敌方随从列入悬赏名单。";
  if (CARDS.ac_knowledge_burst) CARDS.ac_knowledge_burst.text = "对所有敌方随从造成 3 点伤害；抽 1 张牌。";

  for (const c of Object.values(CARDS)) if (c.text) c.text = c.text.replace(/。{2,}/g, "。");

  for (const c of Object.values(CARDS)) {
    if (!c.passive || !c.text || c.text.includes("被动")) continue;
    const m = c.text.match(/^(守备|先遣|隐匿|连携|格挡|血偿|先遣)。(.*)$/);
    c.text = m ? (m[1] + "。被动：" + m[2]) : ("被动：" + c.text);
  }

  if (CARDS.magic_lecturer) { CARDS.magic_lecturer.passive = { type: "spellDrawOne" }; CARDS.magic_lecturer.text = "被动：每当你施放一张战术牌，抽 1 张牌。"; }
  for (const id of ["losutai_refugee", "losutai_scavenger"]) if (CARDS[id] && CARDS[id].text === "流离。") { CARDS[id].flavor = (CARDS[id].flavor || "") + " 流离。"; CARDS[id].text = ""; }
  if (CARDS.beatrix) CARDS.beatrix.target = "none";
  if (CARDS.wolfram && CARDS.wolfram.power) { CARDS.wolfram.power.name = "整编"; CARDS.wolfram.power.text = "改写一张手牌：将它变成另一张相同行动力消耗的同阵营卡牌。"; }

  if (HEROES && HEROES.wolfram && HEROES.wolfram.power) { HEROES.wolfram.power.name = "整编"; HEROES.wolfram.power.text = "改写一张手牌：将它变成另一张相同行动力消耗的同阵营卡牌。"; }

  if (CARDS.shield_marshal) CARDS.shield_marshal.text = "守备。被动：筑防 1，死亡时获得 1 点护甲。登场：若本回合已打出过其他牌，每召唤过一个共和国新兵，获得 +1/+1。";
  if (CARDS.iron_phalanx) CARDS.iron_phalanx.text = "守备。被动：筑防 1，死亡时获得 1 点护甲。登场：若本回合已打出过其他牌，每打出一个随从，获得 +1/+1。";
  if (CARDS.beatrix) CARDS.beatrix.text = "守备。被动：筑防 1，死亡时获得 1 点护甲。登场：获得 2 点护甲。";
  if (CARDS.konrad) CARDS.konrad.text = "守备。被动：筑防 1，死亡时获得 1 点护甲。登场：获得 2 点护甲。";

  const ART_READY = new Set(["academy_inkwell","ac_absolute_theory","ac_arcane_flood","ac_arcane_insight","ac_archive_eruption","ac_field_notes","ac_final_proof","ac_grand_library","ac_knowledge_burst","ac_school_bell","aegis_guard","ancient_fortress_scion","anti_rush","anvil_apprentice","anvil_bracer","anvil_forge_row","anvil_quench","anvil_town_miner","anvil_town_smith","arcane_conduit","arcane_scribe","arcane_surge","arcane_theorist","archive_devourer","archive_guard","archive_keeper","archive_scribe","archive_search","armory_keeper","armor_break","armor_drive","armor_forge","armor_mortar","armor_recycle","armor_volley","astral_colossus","astral_gate","astral_guardian","audit_accountant","bard","barrage","bastion_captain","battlefield_bill","battlefield_salvage","battle_calc","beast_hide_armor","blackmarket_bodyguard","blackmarket_bracer","blackridge_heavy_armor","blackridge_mine","bloodbone_pauldron","bloodmoon_bone_ring","bloodroad_guide","blood_acolyte","blood_altar","blood_censer","blood_contract","blood_corpse_collector","blood_debt","blood_duelist","blood_elder","blood_executor","blood_feast","blood_imp","blood_incense_divination","blood_infiltrator","blood_pact","blood_pact_collector","blood_path","blood_pool","blood_priestess","blood_retainer","blood_ritual","blood_scythe","blood_servant","blood_wraith","bluegold_breastplate","bone_fang_blade","border_lance","border_legion","borrow_vein","bounty_accountant","bounty_clerk","bounty_hunter","brokenline_dagger","broken_bone_warlord","broken_line_merc","brood_matron","bulwark_lieutenant","bulwark_sentry","caravan_guard","card_shark","cassian_foreign","cataloging_lens","chaos_rift","chrono_archivist","chrono_scholar","combo_shield","combo_spark","commission_advance","conscription_levy","conscription_order","coordination","coordination_dispatcher","coordinator_order","council_elder","council_gallery","courier","dark_route","debate","deepvein_guard","detonation_sapper","devourer","double_column_note","double_formula","drill_sergeant","dusk_inn","dusk_innkeeper","dusk_inn_key","dusk_inn_yard","echo_adept","echo_observer","echo_standard","eisenhut_newmoney","eisenwald_marshal","emergency","emergency_bill","empire_guard","excavation_titan","execution_supervisor","faceless_king","fate_gambler","field_engineer","field_medic","final_bell","five_department_badge","five_guild_council","floating_anchor","floating_ink_blade","floating_library","floating_route","fog_accountant","fog_dockhand","fog_harbor_ticket","fog_navigator","fog_sailor","forbidden_knowledge","forge_engineer","forge_technician","forgotten_gate","formation_artificer","formation_bastion","formation_bugler","formation_cannon","formation_echo","formation_officer","formation_script","formation_standard","formation_tide","formation_vein","formation_wall","formation_watcher","formation_weaver","formula_apprentice","formula_fix","fortify","fortress","free_merc","frostweave_cloak","frost_archivist","frost_leviathan","frost_line_guard","frost_page","frost_prism","frost_professor","frost_scribe","frost_seal","furnace_heart","gambler_dice","gh_assassinate_contract","gh_black_market","gh_bodyguard_contract","gh_bounty_board","gh_bounty_collector","gh_bounty_hunter","gh_bounty_king","gh_bounty_notice","gh_bounty_verdict","gh_captain","gh_company","gh_contract_squire","gh_cutthroat","gh_execution_contract","gh_formation","gh_ledger","gh_ledger_chain","gh_legend_assassin","gh_poison_thrower","gh_quick_strike","gh_rush_archer","gh_scorpion","gh_shield_broker","gh_shield_mercenary","gh_silencer","gh_silence_expert","gh_silence_field","gh_silence_master","gh_venom_apprentice","gh_venom_behemoth","gh_venom_shield","gh_venom_vial","gok_digger","gok_engineer","gok_lamp","gok_lampwright","gok_lamp_row","grain_convoy","grave_guard","grave_titan","greyharbor_broker","grey_ledger_post","guard","house_legacy","house_longsword","hunt_ritual","impeachment","imperial_guard_officer","index_assistant","insight","ironclad","ironflow_charge","iron_artillery","iron_banner","iron_engineer","iron_mechanic","iron_order_hammer","iron_order_wall","iron_phalanx","iron_wall","karan","ksetra_beacon","ksetra_beacon_item","ksetra_instructor","kugreen","lab_researcher","lamp_post","last_ledger","lecturer","ledger_constitution","ledger_paperknife","levy","ley_surveyor","line_rotation","line_spearman","logistics_warden","losutai_awakened","losutai_beast","losutai_hunter","losutai_imp","losutai_matriarch","losutai_pool","losutai_refugee","losutai_scavenger","losutai_tide","lt_awakened","lt_bone_scavenger","lt_bone_warlock","lt_brood_armor","lt_brood_attendant","lt_brood_call","lt_brood_mother","lt_deep_beast","lt_deep_eye","lt_deep_sentinel","lt_hatch","lt_hatchery","lt_hatch_guard","lt_reborn_behemoth","lt_reborn_rite","lt_reborn_spawn","lt_tide_bell","lt_tide_birth","lt_tide_colossus","lt_tide_devourer","lt_tide_hunter","lt_tide_mother","lt_tide_pool","lt_tide_spawn","lt_tide_surge","lt_tide_totem","lt_tide_warden","lt_venom_behemoth","lt_venom_fang","lt_venom_larva","lt_venom_lord","lt_venom_mist","lt_venom_nest","lt_venom_pouch","lt_venom_thrower","magic_lecturer","mana_surge","martial_court","martial_law","medical_stretcher","medic_apprentice","mercenary","mining_permit","ministry_map","mistgate_warden","mist_bargain","mist_harbor_city","mist_harbor_treaty","mist_hound","mist_pier","mist_scout","mobilize","monster_command","monster_nest","monster_overseer","monster_summon","moonfall","mutant_egg","neutral_wayfarer","northern_bone_flute","northern_nomad","north_beast_tamer","north_hunter","north_hunt_camp","north_trail","no_mans_camp","no_mans_land","no_mans_land_deed","obsidian_colossus","obsidian_spawn","old_compass","old_ledger","otto_hand","overload_gunner","overload_ritual","page_scholar","parliament_debate","phalanx_drill","phalanx_executor","phalanx_warden","poison_mist_thrower","powder_apprentice","powder_boy","powder_engine","powder_foreman","powder_keg","powder_marshal","powder_martyr","pressure_vein","pressure_warlock","prohibition","pulse_banner","pulse_herbalist","pulse_recorder","pure_theorist","quarantine","quartermaster","quin_records","rebirth_serpent","reborn_rite","reborn_sentry","reborn_shield_guard","recon","record_clerk","recruiter","reef_signal","reflux","reflux_apprentice","reflux_physician","republic_guard","republic_recruit","republic_seal","research_sampler","resonance","return_tide","rosen_borderlord","rush_lancer","school_debate","sealing_wax","secret_police","security_sentry","seran","seven_cities_crest","seven_cities_envoy","shadow_raid","shield_bearer","shield_instructor","shield_marshal","shield_recruit","shield_sergeant","siege_captain","siege_train","silence_informant","sim_assistant","siphon_guard","sky_ship","sky_ship_ticket","small_state_envoy","smoke_screen","smugglers_dock","smuggler_anchor","smuggler_ship","snow_aurora","snow_aurora_priestess","snow_blizzard","snow_blizzard_elemental","snow_capital_lamp","snow_capital_remnant","snow_coldwind_assassin","snow_ember","snow_exile","snow_fox_guard","snow_fox_sentry","snow_freeze_touch","snow_frostclaw","snow_frostplate","snow_frostwind_novice","snow_frost_colossus","snow_frost_dragon","snow_frost_veil","snow_frozen_court","snow_frozen_oracle","snow_gale","snow_guard_captain","snow_hourglass","snow_iceblade","snow_icewall_formation","snow_icewall_guard","snow_ice_lance","snow_ice_priest","snow_ice_wall","snow_lamp_rite","snow_last_snow","snow_last_stand","snow_last_tundra","snow_medic","snow_priest","snow_refugee","snow_rin","snow_storm_hunter","snow_throne","snow_time_array","snow_time_echo","snow_time_shade","snow_time_stop","snow_tundrabracer","snow_tundra_hunt","snow_warmhouse","snow_windwall","snow_windweaver","snow_wind_altar","snow_wind_step","snow_wind_strike","south_pole_tracker","spellstorm","spell_codex","spell_conductor","spell_echo","spell_novice","spring_medic","spring_watcher","stabilize","stein_speaker","supply_cache","survey_apprentice","temple_priest","tide_colossus","tide_scout","tide_ward_bracer","time_loan","time_reflux","toll_account","traveling_healer","tribal_shaman","tribal_warrior","twin_weaver","vein_attendant","vein_behemoth","vein_bulwark","vein_channel","vein_channeler","vein_echo","vein_engineer","vein_foreman","vein_heart","vein_leviathan","vein_medic","vein_needle","vein_oracle","vein_prism","vein_prospect","vein_scout","vein_sentinel","vein_siphon","vein_surge","vein_surveyor","vein_tithe","vein_ward","vein_warden","venom_attendant","venom_blade","venom_fang","venom_sac_guard","vera","void_titan","volley","wall_recruit","wanderer_charm","wandering_blade","wandering_guard","wandering_merchant","wandering_singer","war_tax","wayfarer_camp","whitefrost_bell","white_frost_hall","white_reef_keeper","white_reef_lamp_oil","white_reef_light","white_reef_lighthouse","white_reef_runner","williams_healer","wind_cannon","world_edge","world_edge_camp","world_map","world_map_item","world_serpent","xh_alley_blade","xh_blood_brewer","xh_blood_colossus","xh_blood_curse","xh_blood_feast_spell","xh_blood_guard","xh_blood_knight","xh_blood_mist","xh_blood_moon_altar","xh_blood_priest","xh_blood_road","xh_blood_steward","xh_blood_tax","xh_bone_guard","xh_bone_hunter","xh_castle_consul","xh_castle_pact","xh_night_watch","xh_pressure_master","xh_tribe_headhunter","xiu","zhenmai_artisan","zone_archivist","zone_banner","zone_barrage","zone_keeper","zone_reaper"]);
  for (const c of Object.values(CARDS)) if (!c.token && ART_READY.has(c.id)) c.noArtwork = false;
  if (HEROES.balaena) { HEROES.balaena.art = "balaena"; HEROES.balaena.passive = null; }
  if (HEROES.sernach) { HEROES.sernach.art = "sernach"; HEROES.sernach.passive = null; }

  if (CARDS.ac_spell_copy) { CARDS.ac_spell_copy.noArtwork = true; CARDS.ac_spell_copy.noGeneratedArt = true; }

  const NAME_FIX = {"monster_summon":"蚀毒魔阵","archive_search":"档案加固阵","recon":"先遣勘探","reflux":"逆潮血祭","insight":"观测射击席","south_pole_tracker":"极北测绘","gh_bounty_hunter":"悬赏行掌柜","five_guild_council":"五会行首议会","ksetra_instructor":"教研部教官"};
  for (const [id, name] of Object.entries(NAME_FIX)) if (CARDS[id]) CARDS[id].name = name;
  if (CARDS.snow_last_snow) CARDS.snow_last_snow.cost = 6;
  if (CARDS.ac_school_bell) CARDS.ac_school_bell.cost = 3;
  if (CARDS.gh_ledger) { CARDS.gh_ledger.name = "账房收支"; CARDS.gh_ledger.spell = { type: "drawIfBountyClaimed", draw: 1, bonus: 1 }; CARDS.gh_ledger.text = "抽 1 张牌；若你完成过悬赏，再抽 1 张。"; }

  const DEBT_CARDS = {"blood_imp":{"name":"血债·役","cost":2,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"cardsPlayed","amount":3},"reward":{"type":"draw","amount":2},"penalty":{"type":"damageHero","amount":3}}},"text":"给敌：偿还 2 行动力；否则目标失去 2 生命，你抽 1。给己：任务 本回合打出 3 张牌；完成抽 2，失败失去 3 生命。"},"blood_path":{"name":"血债·誓","cost":1,"debt":{"repay":{"type":"hp","amount":1},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"heroDamaged","amount":3},"reward":{"type":"healHero","amount":3},"penalty":{"type":"damageHero","amount":2}}},"text":"给敌：偿还 1 生命；否则目标随机弃 1 张牌，你抽 1。给己：任务 本回合受到 3 点伤害；完成恢复 3，失败失去 2 生命。"},"shadow_raid":{"name":"血债·偿","cost":2,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"healHero","amount":1}},"self":{"task":{"type":"cardsPlayed","amount":4},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":3}}},"text":"给敌：偿还 2 行动力；否则目标失去 2 生命，你恢复 1。给己：任务 本回合打出 4 张牌；完成抽 1，失败失去 3 生命。"},"blood_incense_divination":{"name":"血债·禁","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"blockHeroPower"},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":2},"penalty":{"type":"damageHero","amount":2}}},"text":"给敌：偿还 2 行动力；否则目标下回合不能使用领袖技能，你抽 1。给己：任务 本回合攻击 2 次；完成抽 2，失败失去 2 生命。"},"lt_bone_scavenger":{"name":"潮债·淹","cost":2,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"summon","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2}}},"text":"给敌：偿还 2 行动力；否则目标随机弃 1 张牌，你抽 1。给己：任务 本回合召唤 2 个随从；完成抽 1，失败失去 2 生命。"},"lt_hatch":{"name":"潮债·卵","cost":1,"debt":{"repay":{"type":"mana","amount":1},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"summon","amount":2},"reward":{"type":"summon","token":"losutai_imp","count":1},"penalty":{"type":"damageHero","amount":2}}},"text":"给敌：偿还 1 行动力；否则目标失去 1 生命，你抽 1。给己：任务 本回合召唤 2 个随从；完成召唤一个 1/1，失败失去 2 生命。"},"lt_reborn_rite":{"name":"潮债·巢","cost":2,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"summon","amount":3},"reward":{"type":"summon","token":"losutai_beast","count":1},"penalty":{"type":"damageHero","amount":3}}},"text":"给敌：偿还 2 行动力；否则目标失去 2 生命，你抽 1。给己：任务 本回合召唤 3 个随从；完成召唤一个 3/3，失败失去 3 生命。"},"lt_tide_pool":{"name":"潮债·潮","cost":1,"debt":{"repay":{"type":"mana","amount":1},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1}},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"armor","amount":1},"penalty":{"type":"damageHero","amount":2}}},"text":"给敌：偿还 1 行动力；否则目标失去 1 生命，你抽 1。给己：任务 本回合攻击 2 次；完成获得 1 护甲，失败失去 2 生命。"}};
  for (const [id, patch] of Object.entries(DEBT_CARDS)) {
    const c = CARDS[id]; if (!c) continue;
    for (const k of ["keywords","battlecry","spell","passive","deathrattle","formation","zoneBonus","zoneAura","mirrorBonus","veinBonus","bloodCost","pressure","reflux","excavate","zhenmai","target2","text"]) delete c[k];
    Object.assign(c, { type: "debt", name: patch.name, cost: patch.cost, rarity: "common", target: "none", keywords: [], text: patch.text, debt: patch.debt, copyLimit: 2 });
  }

  for (const c of Object.values(CARDS)) if (c.type === "debt") { delete c.attack; delete c.health; delete c.maxHealth; delete c.baseAttack; delete c.baseHealth; }

  const DEBT_SPECS = {"xh_blood_guard":{"name":"血债·痛","cost":2,"debt":{"repay":{"type":"mana","amount":1},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"失去 1 生命，你抽 1"},"self":{"task":{"type":"heroDamaged","amount":2},"reward":{"type":"healHero","amount":2},"penalty":{"type":"damageHero","amount":2},"label":"受到 2 点伤害","rewardLabel":"恢复 2","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 1 行动力；否则目标失去 1 生命，你抽 1。给己：任务 受到 2 点伤害；完成恢复 2，失败失去 2 生命。"},"xh_bone_hunter":{"name":"血债·猎","cost":2,"debt":{"repay":{"type":"hp","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1},"label":"失去 2 生命，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"攻击 2 次","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 生命；否则目标失去 2 生命，你抽 1。给己：任务 攻击 2 次；完成抽 1，失败失去 2 生命。"},"xh_blood_brewer":{"name":"血债·酿","cost":2,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"随机弃 1 张牌，你抽 1"},"self":{"task":{"type":"cardsPlayed","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"打出 2 张牌","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标随机弃 1 张牌，你抽 1。给己：任务 打出 2 张牌；完成抽 1，失败失去 2 生命。"},"xh_alley_blade":{"name":"血债·隐","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"失去 1 生命，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"armor","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"攻击 2 次","rewardLabel":"获得 1 护甲","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标失去 1 生命，你抽 1。给己：任务 攻击 2 次；完成获得 1 护甲，失败失去 2 生命。"},"blood_wraith":{"name":"血债·魂","cost":3,"debt":{"repay":{"type":"hp","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"随机弃 1 张牌，你抽 1"},"self":{"task":{"type":"heroDamaged","amount":3},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":3},"label":"受到 3 点伤害","rewardLabel":"抽 1","penaltyLabel":"失去 3 生命"}},"text":"给敌：偿还 2 生命；否则目标随机弃 1 张牌，你抽 1。给己：任务 受到 3 点伤害；完成抽 1，失败失去 3 生命。"},"blood_infiltrator":{"name":"血债·渗","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"blockHeroPower"},"sourceReward":{"type":"draw","amount":1},"label":"下回合不能使用技能，你抽 1"},"self":{"task":{"type":"cardsPlayed","amount":3},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"打出 3 张牌","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标下回合不能使用技能，你抽 1。给己：任务 打出 3 张牌；完成抽 1，失败失去 2 生命。"},"hunt_ritual":{"name":"血债·猎杀","cost":3,"debt":{"repay":{"type":"mana","amount":3},"enemy":{"effect":{"type":"damageHero","amount":3},"sourceReward":{"type":"draw","amount":1},"label":"失去 3 生命，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":2},"penalty":{"type":"damageHero","amount":3},"label":"攻击 2 次","rewardLabel":"抽 2","penaltyLabel":"失去 3 生命"}},"text":"给敌：偿还 3 行动力；否则目标失去 3 生命，你抽 1。给己：任务 攻击 2 次；完成抽 2，失败失去 3 生命。"},"blood_debt":{"name":"血债·债","cost":2,"debt":{"repay":{"type":"hp","amount":1},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"失去 1 生命，你抽 1"},"self":{"task":{"type":"heroDamaged","amount":2},"reward":{"type":"armor","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"受到 2 点伤害","rewardLabel":"获得 1 护甲","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 1 生命；否则目标失去 1 生命，你抽 1。给己：任务 受到 2 点伤害；完成获得 1 护甲，失败失去 2 生命。"},"lt_tide_spawn":{"name":"潮债·汐","cost":1,"debt":{"repay":{"type":"mana","amount":1},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"失去 1 生命，你抽 1"},"self":{"task":{"type":"summon","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"召唤 2 个随从","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 1 行动力；否则目标失去 1 生命，你抽 1。给己：任务 召唤 2 个随从；完成抽 1，失败失去 2 生命。"},"lt_venom_larva":{"name":"潮债·毒","cost":2,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"失去 1 生命，你抽 1"},"self":{"task":{"type":"summon","amount":2},"reward":{"type":"armor","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"召唤 2 个随从","rewardLabel":"获得 1 护甲","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标失去 1 生命，你抽 1。给己：任务 召唤 2 个随从；完成获得 1 护甲，失败失去 2 生命。"},"lt_venom_fang":{"name":"潮债·牙","cost":2,"debt":{"repay":{"type":"hp","amount":1},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1},"label":"失去 2 生命，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"攻击 2 次","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 1 生命；否则目标失去 2 生命，你抽 1。给己：任务 攻击 2 次；完成抽 1，失败失去 2 生命。"},"lt_tide_hunter":{"name":"潮债·猎","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"随机弃 1 张牌，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"攻击 2 次","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标随机弃 1 张牌，你抽 1。给己：任务 攻击 2 次；完成抽 1，失败失去 2 生命。"},"lt_deep_sentinel":{"name":"潮债·守","cost":4,"debt":{"repay":{"type":"mana","amount":3},"enemy":{"effect":{"type":"blockHeroPower"},"sourceReward":{"type":"draw","amount":1},"label":"下回合不能使用技能，你抽 1"},"self":{"task":{"type":"summon","amount":3},"reward":{"type":"summon","token":"losutai_imp","count":1},"penalty":{"type":"damageHero","amount":3},"label":"召唤 3 个随从","rewardLabel":"召唤一个 1/1","penaltyLabel":"失去 3 生命"}},"text":"给敌：偿还 3 行动力；否则目标下回合不能使用技能，你抽 1。给己：任务 召唤 3 个随从；完成召唤一个 1/1，失败失去 3 生命。"},"lt_bone_warlock":{"name":"潮债·骨","cost":4,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"随机弃 1 张牌，你抽 1"},"self":{"task":{"type":"summon","amount":3},"reward":{"type":"draw","amount":2},"penalty":{"type":"damageHero","amount":3},"label":"召唤 3 个随从","rewardLabel":"抽 2","penaltyLabel":"失去 3 生命"}},"text":"给敌：偿还 2 行动力；否则目标随机弃 1 张牌，你抽 1。给己：任务 召唤 3 个随从；完成抽 2，失败失去 3 生命。"},"lt_hatch_guard":{"name":"潮债·护","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1},"label":"失去 2 生命，你抽 1"},"self":{"task":{"type":"summon","amount":3},"reward":{"type":"armor","amount":2},"penalty":{"type":"damageHero","amount":3},"label":"召唤 3 个随从","rewardLabel":"获得 2 护甲","penaltyLabel":"失去 3 生命"}},"text":"给敌：偿还 2 行动力；否则目标失去 2 生命，你抽 1。给己：任务 召唤 3 个随从；完成获得 2 护甲，失败失去 3 生命。"},"lt_tide_warden":{"name":"潮债·潮","cost":4,"debt":{"repay":{"type":"hp","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1},"label":"失去 2 生命，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"攻击 2 次","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 生命；否则目标失去 2 生命，你抽 1。给己：任务 攻击 2 次；完成抽 1，失败失去 2 生命。"},"lt_brood_attendant":{"name":"潮债·嗣","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"随机弃 1 张牌，你抽 1"},"self":{"task":{"type":"summon","amount":2},"reward":{"type":"summon","token":"losutai_imp","count":1},"penalty":{"type":"damageHero","amount":2},"label":"召唤 2 个随从","rewardLabel":"召唤一个 1/1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标随机弃 1 张牌，你抽 1。给己：任务 召唤 2 个随从；完成召唤一个 1/1，失败失去 2 生命。"},"blood_altar":{"name":"潮债·祭","cost":2,"debt":{"repay":{"type":"mana","amount":1},"enemy":{"effect":{"type":"damageHero","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"失去 1 生命，你抽 1"},"self":{"task":{"type":"summon","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"召唤 2 个随从","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 1 行动力；否则目标失去 1 生命，你抽 1。给己：任务 召唤 2 个随从；完成抽 1，失败失去 2 生命。"},"monster_command":{"name":"潮债·令","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"damageHero","amount":2},"sourceReward":{"type":"draw","amount":1},"label":"失去 2 生命，你抽 1"},"self":{"task":{"type":"attacks","amount":2},"reward":{"type":"draw","amount":1},"penalty":{"type":"damageHero","amount":2},"label":"攻击 2 次","rewardLabel":"抽 1","penaltyLabel":"失去 2 生命"}},"text":"给敌：偿还 2 行动力；否则目标失去 2 生命，你抽 1。给己：任务 攻击 2 次；完成抽 1，失败失去 2 生命。"},"lt_venom_nest":{"name":"潮债·巢","cost":3,"debt":{"repay":{"type":"mana","amount":2},"enemy":{"effect":{"type":"discardRandom","amount":1},"sourceReward":{"type":"draw","amount":1},"label":"随机弃 1 张牌，你抽 1"},"self":{"task":{"type":"summon","amount":3},"reward":{"type":"summon","token":"losutai_beast","count":1},"penalty":{"type":"damageHero","amount":3},"label":"召唤 3 个随从","rewardLabel":"召唤一个 3/3","penaltyLabel":"失去 3 生命"}},"text":"给敌：偿还 2 行动力；否则目标随机弃 1 张牌，你抽 1。给己：任务 召唤 3 个随从；完成召唤一个 3/3，失败失去 3 生命。"}};
  for (const [id, spec] of Object.entries(DEBT_SPECS)) { const c=CARDS[id]; if(!c) continue; for (const k of ["keywords","battlecry","spell","passive","deathrattle","formation","zoneBonus","zoneAura","mirrorBonus","veinBonus","bloodCost","pressure","reflux","excavate","zhenmai","target2","attack","health","maxHealth","baseAttack","baseHealth"]) delete c[k]; Object.assign(c,{type:"debt",name:spec.name,cost:spec.cost,target:"none",keywords:[],text:spec.text,debt:spec.debt,copyLimit:2}); }
  const SPELL_SPECS = {"lt_deep_beast":{"name":"深海潮涌","cost":6,"spell":{"type":"damageAllEnemiesDraw","amount":2,"draw":1},"text":"对所有敌方随从造成 2 点伤害；抽 1。"},"lt_reborn_behemoth":{"name":"回潮巨浪","cost":6,"spell":{"type":"rebornDraw","draw":1},"target":"friendly","text":"使一个友方随从获得回潮；抽 1。"},"lt_tide_colossus":{"name":"潮骸壁障","cost":7,"spell":{"type":"armorDraw","armor":5,"draw":1},"text":"获得 5 点护甲；抽 1。"}};
  for (const [id, spec] of Object.entries(SPELL_SPECS)) { const c=CARDS[id]; if(!c) continue; for (const k of ["keywords","battlecry","passive","deathrattle","formation","debt","attack","health","maxHealth","baseAttack","baseHealth"]) delete c[k]; Object.assign(c,{type:"spell",name:spec.name,cost:spec.cost,target:spec.target||"none",spell:spec.spell,text:spec.text,keywords:[],copyLimit:2}); }
  const FORM_SPECS = {"blood_ritual":{"name":"血祭阵","cost":2,"formation":{"attack":1},"text":"该阵位友方随从固定获得 +1 攻击。"}};
  for (const [id, spec] of Object.entries(FORM_SPECS)) { const c=CARDS[id]; if(!c) continue; for (const k of ["keywords","battlecry","spell","passive","deathrattle","debt","attack","health","maxHealth","baseAttack","baseHealth"]) delete c[k]; Object.assign(c,{type:"formation",name:spec.name,cost:spec.cost,formation:spec.formation,text:spec.text,target:"none",keywords:[],copyLimit:2}); }

  if (CARDS.lt_venom_nest) CARDS.lt_venom_nest.name = "潮债·毒巢";
  if (CARDS.lt_tide_warden) CARDS.lt_tide_warden.name = "潮债·潮汐";
  DECKS.xizhao = ["blood_imp","blood_path","shadow_raid","xh_blood_guard","snow_medic","snow_medic","tribal_warrior","mist_hound","mist_hound","mist_scout","mist_scout","archive_guard","archive_guard","blood_duelist","blood_duelist","wandering_guard","wandering_guard","mercenary","mercenary","mist_harbor_city","mist_harbor_city","north_beast_tamer","xh_tribe_headhunter","xh_tribe_headhunter","tiega","caravan_guard","formation_tide","formation_tide","blood_scythe","blood_censer"];
  DECKS.losutai = ["lt_hatch","lt_tide_spawn","lt_venom_larva","lt_venom_fang","lt_reborn_spawn","lt_reborn_spawn","lt_hatch_guard","lt_hatch_guard","lt_brood_attendant","lt_brood_attendant","brood_matron","brood_matron","monster_overseer","monster_overseer","tribal_shaman","tribal_shaman","lanxi","lanzhou","lt_brood_mother","lt_awakened","lt_tide_mother","lt_venom_behemoth","lt_tide_birth","lt_tide_birth","lt_venom_mist","lt_tide_surge","blood_pool","monster_nest","gh_venom_vial","lt_tide_totem"];

  if (HEROES.otto) HEROES.otto.power.cost = 2;
  if (HEROES.balaena) HEROES.balaena.power.text = "召唤一个 1/1 洛斯汰魔物。";

  for (const c of Object.values(CARDS)) if (c.overload) { delete c.overload; c.text = (c.text || "").replace(/反噬\s*\d+。?/g, "").replace(/过载\s*\d+。?/g, ""); }
  for (const c of Object.values(CARDS)) if (c.text) c.text = c.text.replace(/发现一张牌/g, "预兆：从牌库顶 3 张中选 1 张").replace(/检索一张牌/g, "预兆：从牌库顶 3 张中选 1 张");

  const POOL_MOVES = {"academy":["vein_prospect","vein_channel","old_ledger","vein_prism","supply_cache","smoke_screen","recon","old_compass"],"snow":["gok_lamp","smuggler_ship","dusk_inn","world_map","mist_bargain","reef_signal","anvil_quench","north_trail"],"republic":["wayfarer_camp","no_mans_land"],"xizhao":["xh_night_watch","xh_blood_tax"],"greyharbor":["gh_cutthroat","gh_contract_squire"]};
  for (const [faction, ids] of Object.entries(POOL_MOVES)) for (const id of ids) if (CARDS[id]) CARDS[id].faction = faction;

  if (CARDS.xh_night_watch) CARDS.xh_night_watch.faction = "neutral";
  if (CARDS.xh_blood_tax) CARDS.xh_blood_tax.faction = "neutral";
  if (CARDS.gh_cutthroat) CARDS.gh_cutthroat.faction = "neutral";
  if (CARDS.gh_contract_squire) CARDS.gh_contract_squire.faction = "neutral";

  if (CARDS.gh_cutthroat) CARDS.gh_cutthroat.faction = "greyharbor";
  if (CARDS.gh_contract_squire) CARDS.gh_contract_squire.faction = "greyharbor";
  if (CARDS.gh_shield_mercenary) CARDS.gh_shield_mercenary.faction = "neutral";
  if (CARDS.gh_black_market) CARDS.gh_black_market.faction = "neutral";

  if (CARDS.ac_spell_copy) { delete CARDS.ac_spell_copy.noArtwork; delete CARDS.ac_spell_copy.noGeneratedArt; delete CARDS.ac_spell_copy.art; }

  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/发现一张牌/g, "预兆：从牌库顶 3 张中选 1 张牌")
      .replace(/检索一张任意阵营的可收集牌/g, "预兆：从牌库顶 3 张中选 1 张任意阵营的可收集牌")
      .replace(/检索一张战术牌/g, "预兆：从牌库顶 3 张中选 1 张战术牌")
      .replace(/检索一张牌/g, "预兆：从牌库顶 3 张中选 1 张牌")
      .replace(/检索/g, "预兆")
      .replace(/反噬\s*\d+。?/g, "");
  }

  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/发现一张战术牌/g, "预兆：从牌库顶 3 张中选 1 张战术牌")
      .replace(/发现一张随从牌/g, "预兆：从牌库顶 3 张中选 1 张随从牌")
      .replace(/发现一张牌/g, "预兆：从牌库顶 3 张中选 1 张牌")
      .replace(/预兆一张随从牌/g, "预兆：从牌库顶 3 张中选 1 张随从牌")
      .replace(/预兆一张战术牌/g, "预兆：从牌库顶 3 张中选 1 张战术牌")
      .replace(/预兆一张牌/g, "预兆：从牌库顶 3 张中选 1 张牌");
  }

  for (const c of Object.values(CARDS)) if (c.text) c.text = c.text.replace(/[；;]\s*$/u, "。").replace(/[，,]\s*$/u, "。");

  if (CARDS.losutai_refugee) Object.assign(CARDS.losutai_refugee, { attack: 2, health: 2, keywords: ["taunt"], text: "守备。" });
  if (CARDS.losutai_scavenger) Object.assign(CARDS.losutai_scavenger, { keywords: ["battlecry"], battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" });
  if (CARDS.monster_summon) delete CARDS.monster_summon.pressure;
  if (CARDS.vein_channel) delete CARDS.vein_channel.reflux;
  if (CARDS.frost_scribe) delete CARDS.frost_scribe.reflux;
  if (CARDS.frost_professor) delete CARDS.frost_professor.reflux;
  if (CARDS.frost_professor) CARDS.frost_professor.text = "登场：冻结一个敌方随从。被动：你攻击已被冻结的随从时，直接消灭该随从。";
  if (CARDS.reborn_sentry) CARDS.reborn_sentry.text = "守备。回潮。对位：攻击力 +1。";

  const FLAVOR_EFFECTS = {
    ancient_fortress_scion: { keywords: ["taunt"], text: "守备。" },
    sky_ship: { keywords: ["charge"], text: "先遣。" },
    card_shark: { keywords: ["battlecry"], battlecry: { type: "draw", amount: 1 }, text: "登场：抽 1 张牌。" },
    free_merc: { keywords: ["battlecry"], battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" },
    anvil_town_miner: { keywords: ["battlecry"], battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" },
    fog_dockhand: { keywords: ["taunt"], text: "守备。" },
    snow_refugee: { keywords: ["battlecry"], target: "enemy", battlecry: { type: "freeze" }, text: "登场：冻结一个敌方随从。" },
    snow_frostclaw: { keywords: ["rush"], text: "先遣。" },
    snow_frost_colossus: { keywords: ["taunt"], text: "守备。" }
  };
  for (const [id, patch] of Object.entries(FLAVOR_EFFECTS)) {
    const c = CARDS[id]; if (!c) continue;
    if (c.text && !c.flavor) c.flavor = c.text;
    Object.assign(c, patch);
  }

  const DEDUPE_PATCH = {
    smoke_screen: { spell: { type: "freezeAll" }, text: "冻结所有敌方随从。" },
    snow_last_snow: { spell: { type: "freezeDraw", draw: 2 }, text: "冻结所有敌方随从；抽 2 张牌。" },
    anvil_quench: { spell: { type: "armor", amount: 4 }, text: "获得 4 点护甲。" },
    security_sentry: { spell: { type: "armor", amount: 3 }, text: "获得 3 点护甲。" },
    reef_signal: { spell: { type: "armor", amount: 1 }, text: "获得 1 点护甲。" },
    iron_engineer: { deathrattle: { type: "armor", amount: 3 }, text: "余响：获得 3 点护甲。" },
    armor_recycle: { spell: { type: "armor", amount: 4 }, text: "获得 4 点护甲。" },
    time_loan: { spell: { type: "draw", amount: 1 }, text: "抽 1 张牌。" },
    ac_spell_copy: { spell: { type: "draw", amount: 1 }, text: "抽 1 张牌。" },
    ac_final_proof: { spell: { type: "healHeroDraw", heal: 6, draw: 2 }, text: "恢复你的领袖 6 点生命；抽 2 张牌。" },
    echo_standard: { spell: { type: "buffTaunt", health: 1 }, text: "使一个友方随从获得 +0/+1 和守备。" },
    coordinator_order: { spell: { type: "healHeroDraw", heal: 2, draw: 1 }, text: "恢复你的领袖 2 点生命；抽 1 张牌。" },
    pulse_recorder: { deathrattle: { type: "healDrawIfZoneAlly", heal: 1, draw: 1 }, text: "余响：若同阵位有友方随从，恢复 1 点生命并抽 1 张牌。" },
    gh_bounty_king: { passive: { type: "bountyClaimDamage", amount: 3 }, text: "被动：完成悬赏时，对敌方领袖造成 3 点伤害。" },
    field_engineer: { deathrattle: { type: "armor", amount: 2 }, text: "守备。余响：获得 2 点护甲。" },
    vein_medic: { deathrattle: { type: "healHero", amount: 2 }, text: "余响：恢复你的领袖 2 点生命。" },
    vein_tithe: { spell: { type: "armor", amount: 5 }, text: "获得 5 点护甲；掘脉2。" }
  };
  for (const [id, patch] of Object.entries(DEDUPE_PATCH)) {
    const c = CARDS[id]; if (!c) continue;
    if (patch.spell) { c.spell = patch.spell; }
    if (patch.deathrattle) { c.deathrattle = patch.deathrattle; if (!(c.keywords||[]).includes("deathrattle")) c.keywords = (c.keywords||[]).concat("deathrattle"); }
    if (patch.passive) c.passive = patch.passive;
    if (patch.text) c.text = patch.text;
  }

  const DEDUPE_PATCH2 = {
    mobilize: { spell: { type: "draw", amount: 3 }, text: "抽 3 张牌。" },
    ac_school_bell: { spell: { type: "draw", amount: 4 }, text: "抽 4 张牌。" },
    vein_channel: { spell: { type: "healHero", amount: 4 }, text: "恢复你的领袖 4 点生命。" },
    old_ledger: { spell: { type: "drawIfSpellPlayed", draw: 1, bonus: 2 }, text: "抽 1 张牌；若你本回合施放过战术牌，再抽 1 张。" },
    vein_medic: { deathrattle: { type: "healHero", amount: 3 }, text: "余响：恢复你的领袖 3 点生命。" },
    armor_recycle: { spell: { type: "armor", amount: 5 }, text: "获得 5 点护甲。" },
    venom_blade: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。" },
    mist_harbor_treaty: { spell: { type: "draw", amount: 3 }, text: "抽 3 张牌。" },
    ac_spell_copy: { spell: { type: "draw", amount: 4 }, text: "抽 4 张牌。" },
    xh_blood_road: { spell: { type: "grantRushBuff", attack: 2 }, text: "使一个友方随从获得 +2 攻击和先遣。" },
    snow_gale: { spell: { type: "grantRushBuff", attack: 3 }, text: "使一个友方随从获得 +3 攻击和先遣。" },
    reborn_rite: { spell: { type: "rebornDraw", draw: 2 }, text: "使一个友方随从获得回潮；抽 2 张牌。" },
    security_sentry: { spell: { type: "armor", amount: 4 }, text: "获得 4 点护甲。" },
    ac_field_notes: { spell: { type: "armorDraw", armor: 3, draw: 1 }, text: "获得 3 点护甲；抽 1 张牌。" },
    dusk_inn: { spell: { type: "healHeroDraw", heal: 1, draw: 1 }, text: "恢复你的领袖 1 点生命；抽 1 张牌。" },
    losutai_tide: { spell: { type: "damageAllEnemies", amount: 2 }, text: "对所有敌方随从造成 2 点伤害。" },
    lt_venom_mist: { spell: { type: "damageAllEnemies", amount: 3 }, text: "对所有敌方随从造成 3 点伤害。" },
    world_edge: { spell: { type: "damageAllEnemies", amount: 3 }, text: "对所有敌方随从造成 3 点伤害。" },
    xh_blood_feast_spell: { spell: { type: "damageAllEnemies", amount: 4 }, text: "对所有敌方随从造成 4 点伤害。" }
  };
  for (const [id, patch] of Object.entries(DEDUPE_PATCH2)) {
    const c = CARDS[id]; if (!c) continue;
    if (patch.spell) c.spell = patch.spell;
    if (patch.deathrattle) c.deathrattle = patch.deathrattle;
    if (patch.text) c.text = patch.text;
  }

  const FINAL_KEYWORD_ORDER = ["格挡", "守备", "先遣", "连携", "血偿", "蚀毒", "隐匿", "回潮", "冻结", "沉默", "登场", "余响", "引脉", "掘脉", "血祭", "预兆", "吞噬", "逆脉", "镇脉", "压脉", "悬赏", "固定", "装备", "被动"];
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    const ends = /[。！？]/.test(c.text.slice(-1));
    const parts = c.text.replace(/[。]+$/u, "").split("。").map(x => x.trim()).filter(Boolean);
    const prefix = [], rest = [];
    for (const p of parts) {
      const key = FINAL_KEYWORD_ORDER.find(k => p === k || p.indexOf(k + "：") === 0 || p.indexOf(k + " ") === 0);
      if (key && !rest.length) prefix.push({ p, i: FINAL_KEYWORD_ORDER.indexOf(key) });
      else rest.push(p);
    }
    prefix.sort((a, b) => a.i - b.i);
    c.text = prefix.map(x => x.p).concat(rest).join("。") + (ends ? "。" : "");
  }

  // 学院专项：同阵营重复效果拆分 + 说明重写
  if (CARDS.insight) { CARDS.insight.formation = { health: 1, windfury: true }; CARDS.insight.text = "该阵位友方随从固定获得 +0/+1 和连携。"; }
  if (CARDS.ac_school_bell) { CARDS.ac_school_bell.spell = { type: "armorDraw", armor: 2, draw: 2 }; CARDS.ac_school_bell.text = "获得 2 点护甲；抽 2 张牌。"; }
  if (CARDS.council_elder) { CARDS.council_elder.passive = { type: "spellDrawByCost" }; CARDS.council_elder.text = "被动：每当你施放一张战术牌，抽等同于其行动力消耗的牌。"; }
  if (CARDS.magic_lecturer) { delete CARDS.magic_lecturer.passive; CARDS.magic_lecturer.keywords = ["battlecry"]; CARDS.magic_lecturer.battlecry = { type: "draw", amount: 2 }; CARDS.magic_lecturer.text = "登场：抽 2 张牌。"; }
  if (CARDS.pure_theorist) { CARDS.pure_theorist.battlecry = { type: "discountSpell", amount: 2 }; CARDS.pure_theorist.text = "登场：本回合你的下一张战术牌行动力消耗 -2。"; }
  if (CARDS.index_assistant) { CARDS.index_assistant.target = "enemy"; CARDS.index_assistant.battlecry = { type: "damage", amount: 1 }; CARDS.index_assistant.text = "登场：对一个敌方随从造成 1 点伤害。"; }
  if (CARDS.spell_echo) { CARDS.spell_echo.battlecry = { type: "discover", pool: "any" }; CARDS.spell_echo.text = "登场：预兆：从牌库顶 3 张中选 1 张牌。"; }
  if (CARDS.lecturer) { CARDS.lecturer.battlecry = { type: "summon", token: "archive_scribe" }; CARDS.lecturer.text = "登场：召唤一个档案抄写员。"; }
  if (CARDS.reflux_apprentice) CARDS.reflux_apprentice.text = "登场：若本回合你施放过战术牌，抽 1 张牌。";

  // 洛斯汰魔物：固定 1/1，不再成长/死亡反击
  if (CARDS.losutai_imp) {
    delete CARDS.losutai_imp.passive;
    delete CARDS.losutai_imp.deathrattle;
    CARDS.losutai_imp.keywords = [];
    CARDS.losutai_imp.attack = 1;
    CARDS.losutai_imp.health = 1;
    CARDS.losutai_imp.maxHealth = 1;
    CARDS.losutai_imp.text = "";
  }
  // 学院说明优化
  if (CARDS.old_ledger) CARDS.old_ledger.text = "抽 1 张牌；若你本回合施放过战术牌，再抽 2 张。";
  if (CARDS.ac_archive_eruption) CARDS.ac_archive_eruption.text = "对所有敌方随从造成等同于本局已使用战术牌数量的伤害。";
  if (CARDS.vein_prospect) CARDS.vein_prospect.text = "掘脉2：抽 2 张牌，并使流脉 +2。";
  if (CARDS.recon) CARDS.recon.text = "掘脉1：抽 1 张牌，并使流脉 +1。";
  if (CARDS.ac_spell_copy) CARDS.ac_spell_copy.text = "抽 4 张牌。";

  if (CARDS.losutai_imp) CARDS.losutai_imp.faction = "losutai";
  if (CARDS.losutai_beast) CARDS.losutai_beast.faction = "losutai";

  if (CARDS.lecturer) delete CARDS.lecturer.reflux;
  if (CARDS.reflux_apprentice) delete CARDS.reflux_apprentice.reflux;

  // 中立低费强度回调：先削 0 费抽牌、低费回血/护甲和过万金油装备
  if (CARDS.time_loan) { CARDS.time_loan.cost = 1; CARDS.time_loan.text = "抽 1 张牌。"; }
  if (CARDS.snow_medic) CARDS.snow_medic.text = "余响：恢复你的领袖 1 点生命。";
  if (CARDS.vein_medic) { CARDS.vein_medic.deathrattle = { type: "healHero", amount: 2 }; CARDS.vein_medic.health = 3; CARDS.vein_medic.text = "余响：恢复你的领袖 2 点生命。"; }
  if (CARDS.iron_engineer) { CARDS.iron_engineer.deathrattle = { type: "armor", amount: 2 }; CARDS.iron_engineer.health = 3; CARDS.iron_engineer.text = "余响：获得 2 点护甲。"; }
  if (CARDS.wandering_merchant) { CARDS.wandering_merchant.battlecry.hand = 3; CARDS.wandering_merchant.health = 3; CARDS.wandering_merchant.text = "登场：抽 1 张牌；若你的手牌不多于 3，再抽 1 张。"; }
  if (CARDS.fog_harbor_ticket) CARDS.fog_harbor_ticket.cost = 2;
  if (CARDS.wanderer_charm) CARDS.wanderer_charm.cost = 3;
  if (CARDS.anvil_bracer) CARDS.anvil_bracer.cost = 3;
  if (CARDS.mutant_egg) CARDS.mutant_egg.cost = 2;
  if (CARDS.snow_warmhouse) CARDS.snow_warmhouse.cost = 3;
  if (CARDS.gok_digger) { CARDS.gok_digger.attack = 2; CARDS.gok_digger.health = 3; }

  if (CARDS.mutant_egg) CARDS.mutant_egg.cost = 3;
  if (CARDS.sky_ship_ticket) CARDS.sky_ship_ticket.cost = 4;
  if (CARDS.snow_capital_lamp) CARDS.snow_capital_lamp.cost = 4;

  // 学院：低费冻结联动 + 高费卡费用回调
  if (CARDS.debate) { CARDS.debate.target = "enemy"; CARDS.debate.spell = { type: "damageFreeze", amount: 1 }; CARDS.debate.text = "对一个敌方随从造成 1 点伤害，并冻结它。"; }
  if (CARDS.ac_arcane_flood) { CARDS.ac_arcane_flood.spell = { type: "damageAllFreeze", amount: 2 }; CARDS.ac_arcane_flood.text = "对所有敌方随从造成 2 点伤害，并冻结它们。"; }
  if (CARDS.index_assistant) { CARDS.index_assistant.cost = 4; CARDS.index_assistant.attack = 3; CARDS.index_assistant.health = 4; CARDS.index_assistant.target = "enemy"; CARDS.index_assistant.battlecry = { type: "freeze" }; CARDS.index_assistant.text = "登场：冻结一个敌方随从。"; }
  if (CARDS.lecturer) { CARDS.lecturer.cost = 5; CARDS.lecturer.attack = 3; CARDS.lecturer.health = 5; CARDS.lecturer.battlecry = { type: "summon", token: "archive_scribe" }; CARDS.lecturer.text = "登场：召唤一个档案抄写员。"; }
  if (CARDS.reflux_apprentice) { CARDS.reflux_apprentice.cost = 4; CARDS.reflux_apprentice.attack = 3; CARDS.reflux_apprentice.health = 4; CARDS.reflux_apprentice.text = "登场：若本回合你施放过战术牌，抽 1 张牌。"; }
  if (CARDS.archive_keeper) { CARDS.archive_keeper.cost = 4; CARDS.archive_keeper.attack = 3; CARDS.archive_keeper.health = 4; }
  if (CARDS.spell_novice) { CARDS.spell_novice.cost = 3; CARDS.spell_novice.attack = 2; CARDS.spell_novice.health = 3; }
  if (CARDS.pure_theorist) { CARDS.pure_theorist.cost = 4; CARDS.pure_theorist.attack = 3; CARDS.pure_theorist.health = 4; }
  if (CARDS.quin_records) { CARDS.quin_records.cost = 3; CARDS.quin_records.attack = 2; CARDS.quin_records.health = 3; }
  if (CARDS.spell_echo) { CARDS.spell_echo.cost = 6; CARDS.spell_echo.attack = 4; CARDS.spell_echo.health = 6; }
  if (CARDS.spellstorm) CARDS.spellstorm.cost = 7;
  if (CARDS.old_compass) { CARDS.old_compass.spell = { type: "draw", amount: 2 }; CARDS.old_compass.text = "抽 2 张牌。"; }

  if (CARDS.ac_archive_eruption) CARDS.ac_archive_eruption.cost = 4;
  if (CARDS.spell_echo) CARDS.spell_echo.cost = 5;
  if (CARDS.spellstorm) CARDS.spellstorm.cost = 6;

  if (CARDS.time_loan) { CARDS.time_loan.cost = 1; CARDS.time_loan.spell = { type: "loanDraw", amount: 2, penalty: 1 }; CARDS.time_loan.text = "抽 2 张牌；下回合开始时行动力 -1。"; }
  if (CARDS.wandering_merchant) { CARDS.wandering_merchant.battlecry = { type: "discardDraw", discard: 1, draw: 2 }; CARDS.wandering_merchant.text = "登场：随机弃 1 张牌，抽 2 张牌。"; }

  // v6 第一轮：八阵营核心牌 + 每阵营一张加行动力/抽卡
  const V6_CORE = {
    // core pass
    karl_schwarz: { cost: 6, attack: 5, health: 6, target: "enemy", battlecry: { type: "armorDamage" }, text: "登场：对一个敌方随从造成等同于你护甲的伤害。核心：护甲战。" },
    gunther: { cost: 6, attack: 5, health: 7, battlecry: { type: "armor", amount: 6 }, text: "连携。登场：获得 6 点护甲。核心：护甲战。" },
    nina: { cost: 5, attack: 3, health: 4, target: "enemy", battlecry: { type: "freezeZone" }, text: "登场：冻结目标所在阵位的所有敌方随从。核心：冻结。" },
    snow_last_snow: { cost: 7, spell: { type: "freezeDraw", draw: 2 }, text: "冻结所有敌方随从；抽 2 张牌。核心：冻结控场。" },
    lt_brood_mother: { cost: 6, attack: 5, health: 5, battlecry: { type: "summonCount", token: "losutai_imp", count: 3 }, text: "登场：召唤三个 1/1 洛斯汰魔物。核心：铺场。" },
    lanxi: { cost: 6, attack: 5, health: 5, passive: { type: "impGrowth", attack: 1, health: 1 }, text: "被动：场上每有一个洛斯汰魔物，获得 +1/+1。核心：铺场。" },
    konrad: { cost: 5, attack: 4, health: 5, keywords: ["taunt", "battlecry"], battlecry: { type: "armor", amount: 3 }, text: "守备。登场：获得 3 点护甲。核心：守备。" },
    beatrix: { cost: 6, attack: 5, health: 5, keywords: ["taunt", "divineShield"], text: "守备。格挡。核心：圣盾守备。" },
    gh_bounty_king: { cost: 7, attack: 7, health: 7, passive: { type: "bountyClaimDamage", amount: 4 }, text: "被动：完成悬赏时，对敌方领袖造成 4 点伤害。核心：悬赏。" },
    vera: { cost: 5, attack: 5, health: 5, keywords: ["stealth", "rush"], text: "隐匿。先遣。核心：连击。" },
    tiega: { cost: 5, attack: 5, health: 5, keywords: ["charge", "battlecry"], battlecry: { type: "damage", amount: 3 }, target: "enemy", text: "先遣。登场：对一个敌方随从造成 3 点伤害。核心：野兽快攻。" },
    lize: { cost: 4, attack: 4, health: 4, battlecry: { type: "damageHero", amount: 2 }, text: "登场：对敌方领袖造成 2 点伤害。核心：压脉。" },
    shextena: { cost: 5, attack: 4, health: 5, battlecry: { type: "healHeroSelfBuff", amount: 4 }, text: "登场：恢复你的领袖 4 点生命；每实际恢复 1 点，获得 +1/+1。核心：治疗。" },
    orlicas: { cost: 4, attack: 3, health: 4, battlecry: { type: "draw", amount: 2 }, text: "登场：抽 2 张牌。核心：资源。" },
    spellstorm: { cost: 7, spell: { type: "damageAllEnemyUnitsPerGameSpell", amount: 1 }, text: "对所有敌方单位造成等同于本局已使用战术牌数量的伤害（每张 1 点，最高 10 点）。核心：法术洪流。" },
    cassian: { cost: 6, attack: 4, health: 6, passive: { type: "repeatLastSpell" }, text: "被动：你的回合结束时，重复你最后使用的一张战术牌。核心：法术复写。" }
  };
  for (const [id, patch] of Object.entries(V6_CORE)) { const c = CARDS[id]; if (!c) continue; if (id === "konrad" || id === "beatrix") delete c.passive; Object.assign(c, patch); }
  const V6_RAMP = {
    coordination: { type: "spell", cost: 2, spell: { type: "rampSpell", amount: 1 }, text: "本回合获得 1 点行动力；抽 1 张牌。", target: "none" },
    mana_surge: { type: "spell", cost: 1, spell: { type: "rampSpell", amount: 2 }, text: "本回合获得 2 点行动力。", target: "none" },
    south_pole_tracker: { type: "spell", cost: 2, spell: { type: "draw", amount: 1 }, text: "抽 1 张牌；本回合获得 1 点行动力。", target: "none" },
    levy: { type: "spell", cost: 2, spell: { type: "rampSpell", amount: 1 }, text: "本回合获得 1 点行动力；抽 1 张牌。", target: "none" },
    mobilize: { type: "spell", cost: 3, spell: { type: "rampSpell", amount: 1 }, text: "本回合获得 1 点行动力；抽 1 张牌。", target: "none" },
    commission_advance: { type: "spell", cost: 2, spell: { type: "draw", amount: 1 }, text: "抽 1 张牌；本回合获得 1 点行动力。", target: "none" },
    lt_tide_birth: { type: "spell", cost: 2, spell: { type: "draw", amount: 1 }, text: "抽 1 张牌；本回合获得 1 点行动力。", target: "none" },
    world_map: { type: "spell", cost: 2, spell: { type: "draw", amount: 1 }, text: "抽 1 张牌；本回合获得 1 点行动力。", target: "none" }
  };
  for (const [id, patch] of Object.entries(V6_RAMP)) { const c = CARDS[id]; if (!c) continue; Object.assign(c, patch); }

  // v6 Academy: Warlock / spell-chain identity. All Academy cards are re-statted and re-scripted.
  (function redesignAcademy() {
    const all = Object.values(CARDS).filter(c => c.faction === "academy" && !c.token && !c.disabled && !c.experimental);
    const clear = (c, keepType) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text","target2","zoneBonus"]) delete c[k]; if (keepType) c.type = keepType; };
    const keywordText = ["", "守备。", "先遣。", "连携。", "血偿。"];
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,3,3,3,4,4,4,5,5,5,5,6,6,6,7,7,8,8,8,9,9];
    minions.forEach((c, i) => {
      clear(c, "minion");
      const cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(cost / 2) + (i % 2));
      const hp = Math.max(1, cost + 2 - Math.max(1, Math.ceil(cost / 2)) + (i % 3 === 0 ? 1 : 0));
      c.cost = cost; c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 9;
      if (role === 0) { c.keywords = ["battlecry"]; c.battlecry = { type: "draw", amount: 1 }; c.text = "登场：抽 1 张牌。"; }
      else if (role === 1) { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 1 + (i % 3) }; c.text = "登场：获得" + (1 + (i % 3)) + " 点护甲。"; }
      else if (role === 2) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "damage", amount: 1 + (i % 4) }; c.text = "登场：对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 3) { c.keywords = ["battlecry"]; c.battlecry = { type: "summon", token: "medic_apprentice" }; c.text = "登场：召唤一个医疗学徒。"; }
      else if (role === 4) { c.passive = { type: "spellDrawOne" }; c.text = "被动：每当你施放一张战术牌，抽 1 张牌。"; }
      else if (role === 5) { c.passive = { type: "spellGrowth", attack: 1, health: 0 }; c.text = "被动：每当你施放一张战术牌，获得 +1 攻击。"; }
      else if (role === 6) { c.keywords = ["deathrattle"]; c.deathrattle = { type: "damageRandomEnemy", amount: 1 + (i % 3) }; c.text = "余响：对随机敌方目标造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 7) { c.keywords = ["battlecry", "taunt"]; c.battlecry = { type: "healHero", amount: 1 + (i % 3) }; c.text = "守备。登场：恢复你的领袖" + (1 + (i % 3)) + " 点生命。"; }
      else { c.keywords = ["battlecry"]; c.battlecry = { type: "discover", pool: "spell" }; c.text = "登场：预兆：从牌库顶 3 张中选 1 张战术牌。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9];
    spells.forEach((c, i) => {
      clear(c, "spell");
      c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 9;
      if (role === 0) { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 4) }; c.text = "对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 1) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else if (role === 2) { c.spell = { type: "armor", amount: 1 + (i % 4) }; c.text = "获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 3) { c.spell = { type: "healHero", amount: 1 + (i % 4) }; c.text = "恢复你的领袖" + (1 + (i % 4)) + " 点生命。"; }
      else if (role === 4) { c.spell = { type: "damageAllEnemies", amount: 1 + (i % 3) }; c.text = "对所有敌方随从造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 5) { c.target = "enemy"; c.spell = { type: "freeze" }; c.text = "冻结一个敌方随从。"; }
      else if (role === 6) { c.target = "enemy"; c.spell = { type: "damageFreeze", amount: 1 }; c.text = "对一个敌方随从造成 1 点伤害，并冻结它。"; }
      else if (role === 7) { c.spell = { type: "summon", token: "medic_apprentice", count: 1 + (i % 2) }; c.text = "召唤" + (1 + (i % 2)) + " 个医疗学徒。"; }
      else { c.spell = { type: "discover", pool: "spell" }; c.text = "预兆：从牌库顶 3 张中选 1 张战术牌。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{rush:true}, "该阵位友方随从固定获得先遣。"],
      [{windfury:true}, "该阵位友方随从固定获得连携。"],
      [{health:2}, "该阵位友方随从固定获得 +0/+2。"]
    ];
    formations.forEach((c, i) => { clear(c, "formation"); c.cost = 2 + (i % 3); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment");
    equipment.forEach((c, i) => { c.cost = 2 + (i % 3); });
    // Academy core
    if (CARDS.spellstorm) { CARDS.spellstorm.cost = 7; CARDS.spellstorm.spell = { type: "damageAllEnemyUnitsPerGameSpell", amount: 1 }; CARDS.spellstorm.text = "对所有敌方单位造成等同于本局已使用战术牌数量的伤害（最高 10 点）。核心：法术洪流。"; }
    if (CARDS.cassian) { CARDS.cassian.cost = 6; CARDS.cassian.attack = 4; CARDS.cassian.health = 6; CARDS.cassian.passive = { type: "repeatLastSpell" }; CARDS.cassian.text = "被动：你的回合结束时，重复你最后使用的一张战术牌。核心：法术复写。"; }
    if (CARDS.mana_surge) { CARDS.mana_surge.cost = 1; CARDS.mana_surge.spell = { type: "rampSpell", amount: 2 }; CARDS.mana_surge.text = "本回合获得 2 点行动力。"; }
    if (CARDS.old_ledger) { CARDS.old_ledger.cost = 3; CARDS.old_ledger.spell = { type: "drawIfSpellPlayed", draw: 1, bonus: 2 }; CARDS.old_ledger.text = "抽 1 张牌；若本回合施放过战术牌，再抽 2 张。"; }
  })();

  // Academy duplicate cleanup after the v6 first pass
  const ACADEMY_FIX = {
    karl_desmond: { target: "enemy", battlecry: { type: "damage", amount: 3 }, text: "登场：对一个敌方随从造成 3 点伤害。" },
    index_assistant: { battlecry: { type: "armor", amount: 4 }, text: "登场：获得 4 点护甲。" },
    magic_lecturer: { battlecry: { type: "armor", amount: 3 }, text: "登场：获得 3 点护甲。" },
    page_scholar: { battlecry: { type: "draw", amount: 2 }, text: "登场：抽 2 张牌。" },
    arcane_conduit: { target: "enemy", battlecry: { type: "damage", amount: 1 }, text: "登场：对一个敌方随从造成 1 点伤害。" },
    smoke_screen: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。" },
    cassian_foreign: { battlecry: { type: "armor", amount: 2 }, text: "登场：获得 2 点护甲。" },
    arcane_theorist: { passive: { type: "spellGrowth", attack: 0, health: 1 }, text: "被动：每当你施放一张战术牌，获得 +0/+1。" },
    ac_absolute_theory: { spell: { type: "damageAllEnemies", amount: 2 }, text: "对所有敌方随从造成 2 点伤害。" },
    combo_spark: { spell: { type: "damageAllEnemies", amount: 1 }, text: "对所有敌方随从造成 1 点伤害。" },
    formula_fix: { spell: { type: "damageAllEnemies", amount: 3 }, text: "对所有敌方随从造成 3 点伤害。" },
    ac_arcane_insight: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。" },
    spell_novice: { battlecry: { type: "armor", amount: 2 }, text: "登场：获得 2 点护甲。" },
    pure_theorist: { battlecry: { type: "armor", amount: 4 }, text: "登场：获得 4 点护甲。" },
    record_clerk: { battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" },
    old_compass: { spell: { type: "freeze" }, text: "冻结一个敌方随从。" },
    ac_final_proof: { spell: { type: "damageFreeze", amount: 2 }, text: "对一个敌方随从造成 2 点伤害，并冻结它。" },
    ac_grand_library: { spell: { type: "draw", amount: 3 }, text: "抽 3 张牌。" },
    ac_field_notes: { spell: { type: "freeze" }, text: "冻结一个敌方随从。" },
    echo_observer: { deathrattle: { type: "damageRandomEnemy", amount: 2 }, text: "余响：对随机敌方目标造成 2 点伤害。" },
    archive_keeper: { passive: { type: "spellGrowth", attack: 0, health: 1 }, text: "被动：每当你施放一张战术牌，获得 +0/+1。" },
    ac_archive_eruption: { spell: { type: "draw", amount: 4 }, text: "抽 4 张牌。" }
  };
  for (const [id, patch] of Object.entries(ACADEMY_FIX)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const ACADEMY_FIX2 = {
    arcane_scribe: { battlecry: { type: "armor", amount: 5 }, text: "登场：获得 5 点护甲。" },
    spell_conductor: { passive: { type: "spellDrawOne" }, text: "被动：每当你施放一张战术牌，抽 1 张牌。" },
    ac_arcane_insight: { spell: { type: "armor", amount: 3 }, text: "获得 3 点护甲。" },
    reflux_apprentice: { target: "enemy", battlecry: { type: "armor", amount: 1 }, text: "登场：获得 1 点护甲。" },
    archive_keeper: { passive: { type: "spellGrowth", attack: 1, health: 0 }, text: "被动：每当你施放一张战术牌，获得 +1 攻击。" },
    double_formula: { target: "enemy", spell: { type: "damageFreeze", amount: 3 }, text: "对一个敌方随从造成 3 点伤害，并冻结它。" },
    ac_field_notes: { spell: { type: "freezeAll" }, text: "冻结所有敌方随从。" },
    cassian_foreign: { battlecry: { type: "armor", amount: 5 }, text: "登场：获得 5 点护甲。" },
    pure_theorist: { battlecry: { type: "armor", amount: 5 }, text: "登场：获得 5 点护甲。" }
  };
  for (const [id, patch] of Object.entries(ACADEMY_FIX2)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const ACADEMY_FIX3 = {
    reflux_apprentice: { battlecry: { type: "armor", amount: 6 }, text: "登场：获得 6 点护甲。" },
    arcane_scribe: { battlecry: { type: "armor", amount: 7 }, text: "登场：获得 7 点护甲。" },
    pure_theorist: { battlecry: { type: "armor", amount: 8 }, text: "登场：获得 8 点护甲。" },
    cassian_foreign: { battlecry: { type: "armor", amount: 9 }, text: "登场：获得 9 点护甲。" },
    council_elder: { passive: { type: "spellGrowth", attack: 1, health: 1 }, text: "被动：每当你施放一张战术牌，获得 +1/+1。" },
    recon: { spell: { type: "armor", amount: 4 }, text: "获得 4 点护甲。" },
    spell_echo: { passive: { type: "spellGrowth", attack: 0, health: 1 }, text: "被动：每当你施放一张战术牌，获得 +0/+1。" }
  };
  for (const [id, patch] of Object.entries(ACADEMY_FIX3)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const ACADEMY_FIX4 = {
    spell_echo: { passive: { type: "spellGrowth", attack: 2, health: 0 }, text: "被动：每当你施放一张战术牌，获得 +2 攻击。" },
    recon: { spell: { type: "armor", amount: 5 }, text: "获得 5 点护甲。" }
  };
  for (const [id, patch] of Object.entries(ACADEMY_FIX4)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  if (CARDS.cassian_foreign) delete CARDS.cassian_foreign.passive;
  if (CARDS.shextena) { delete CARDS.shextena.reflux; delete CARDS.shextena.veinBonus; delete CARDS.shextena.veinTiers; delete CARDS.shextena.pressure; }
  if (CARDS.tiega) delete CARDS.tiega.bloodCost;
  if (CARDS.lanxi) delete CARDS.lanxi.pressure;
  if (CARDS.nina) delete CARDS.nina.reflux;
  if (CARDS.karl_schwarz) { CARDS.karl_schwarz.keywords = ["charge"]; CARDS.karl_schwarz.text = "先遣。登场：对一个敌方随从造成等同于你护甲的伤害。核心：护甲战。"; }
  if (CARDS.spell_conductor) { delete CARDS.spell_conductor.battlecry; CARDS.spell_conductor.text = "被动：每当你施放一张战术牌，抽 1 张牌。"; }

  if (CARDS.spell_conductor) CARDS.spell_conductor.keywords = (CARDS.spell_conductor.keywords || []).filter(k => k !== "battlecry");

  // v6 Snow: Mage / freeze-burn. All Snow cards re-statted and re-scripted.
  (function redesignSnow() {
    const all = Object.values(CARDS).filter(c => c.faction === "snow" && !c.token && !c.disabled && !c.experimental);
    const clear = (c) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text"]) delete c[k]; };
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9];
    minions.forEach((c, i) => {
      clear(c); c.type = "minion"; c.cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(c.cost / 2) + (i % 2));
      const hp = Math.max(1, c.cost + 2 - Math.ceil(c.cost / 2) + (i % 3 === 0 ? 1 : 0));
      c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 10;
      if (role === 0) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "freeze" }; c.text = "登场：冻结一个敌方随从。"; }
      else if (role === 1) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "damage", amount: 1 + (i % 4) }; c.text = "登场：对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 2) { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 1 + (i % 4) }; c.text = "登场：获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 3) { c.keywords = ["battlecry"]; c.battlecry = { type: "draw", amount: 1 }; c.text = "登场：抽 1 张牌。"; }
      else if (role === 4) { c.keywords = ["battlecry"]; c.battlecry = { type: "summon", token: "snow_fox_sentry" }; c.text = "登场：召唤一个雪狐哨兵。"; }
      else if (role === 5) { c.passive = { type: "spellGrowth", attack: 1, health: 0 }; c.text = "被动：每当你施放战术牌，获得 +1 攻击。"; }
      else if (role === 6) { c.keywords = ["deathrattle"]; c.deathrattle = { type: "damageRandomEnemy", amount: 1 + (i % 3) }; c.text = "余响：对随机敌方目标造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 7) { c.keywords = ["taunt"]; c.text = "守备。"; }
      else if (role === 8) { c.keywords = ["battlecry"]; c.battlecry = { type: "freezeAllEnemies" }; c.text = "登场：冻结所有敌方随从。"; }
      else { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "damageFreeze", amount: 1 }; c.text = "登场：对一个敌方随从造成 1 点伤害，并冻结它。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,8];
    spells.forEach((c, i) => {
      clear(c); c.type = "spell"; c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 8;
      if (role === 0) { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 4) }; c.text = "对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 1) { c.target = "enemy"; c.spell = { type: "freeze" }; c.text = "冻结一个敌方随从。"; }
      else if (role === 2) { c.spell = { type: "damageAllEnemies", amount: 1 + (i % 3) }; c.text = "对所有敌方随从造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 3) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else if (role === 4) { c.spell = { type: "armor", amount: 1 + (i % 4) }; c.text = "获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 5) { c.target = "enemy"; c.spell = { type: "damageFreeze", amount: 1 + (i % 3) }; c.text = "对一个敌方随从造成" + (1 + (i % 3)) + " 点伤害，并冻结它。"; }
      else if (role === 6) { c.spell = { type: "freezeAll" }; c.text = "冻结所有敌方随从。"; }
      else { c.spell = { type: "discover", pool: "spell" }; c.text = "预兆：从牌库顶 3 张中选 1 张战术牌。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{rush:true}, "该阵位友方随从固定获得先遣。"],
      [{windfury:true}, "该阵位友方随从固定获得连携。"],
      [{attackVsFrozen:1}, "该阵位友方随从攻击已冻结随从时 +1 攻击。"],
      [{attackVsFrozen:2}, "该阵位友方随从攻击已冻结随从时 +2 攻击。"],
      [{reborn:true}, "该阵位友方随从固定获得回潮。"]
    ];
    formations.forEach((c, i) => { clear(c); c.type = "formation"; c.cost = 2 + (i % 4); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment");
    equipment.forEach((c, i) => { c.cost = 2 + (i % 4); });
    if (CARDS.nina) { CARDS.nina.cost = 6; CARDS.nina.attack = 4; CARDS.nina.health = 5; CARDS.nina.target = "enemy"; CARDS.nina.battlecry = { type: "freezeZone" }; CARDS.nina.text = "登场：冻结目标所在阵位的所有敌方随从。核心：冻结。"; }
    if (CARDS.snow_last_snow) { CARDS.snow_last_snow.cost = 7; CARDS.snow_last_snow.spell = { type: "freezeDraw", draw: 3 }; CARDS.snow_last_snow.text = "冻结所有敌方随从；抽 3 张牌。核心：冻结控场。"; }
    if (CARDS.snow_frost_dragon) { CARDS.snow_frost_dragon.cost = 8; CARDS.snow_frost_dragon.attack = 7; CARDS.snow_frost_dragon.health = 7; CARDS.snow_frost_dragon.target = "enemy"; CARDS.snow_frost_dragon.battlecry = { type: "freezeZone" }; CARDS.snow_frost_dragon.text = "登场：冻结目标所在阵位的所有敌方随从。核心：冰霜巨龙。"; }
    if (CARDS.world_map) { CARDS.world_map.cost = 2; CARDS.world_map.spell = { type: "draw", amount: 1 }; CARDS.world_map.text = "抽 1 张牌；本回合获得 1 点行动力。"; }
    if (CARDS.gok_lamp) { CARDS.gok_lamp.cost = 1; CARDS.gok_lamp.spell = { type: "antiFreezeHeal", heal: 1 }; CARDS.gok_lamp.text = "恢复你的领袖 1 点生命；本回合免疫冻结。"; }
  })();

  if (CARDS.snow_frost_dragon) delete CARDS.snow_frost_dragon.deathrattle;
  if (CARDS.snow_wind_altar) { CARDS.snow_wind_altar.text = "该阵位友方随从固定获得连携。"; }
  if (CARDS.snow_throne) { CARDS.snow_throne.text = "该阵位友方随从固定获得 +1 攻击和守备。"; }

  const SNOW_FIX = {
    samuel: { battlecry: { type: "damage", amount: 3 }, text: "登场：对一个敌方随从造成 3 点伤害。" },
    frost_seal: { spell: { type: "armor", amount: 2 }, text: "获得 2 点护甲。" },
    echo_adept: { battlecry: { type: "freezeDrawIfSpell", draw: 1 }, text: "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 1 张牌。" },
    frost_line_guard: { target: "enemy", battlecry: { type: "damageFreeze", amount: 1 }, text: "登场：对一个敌方随从造成 1 点伤害，并冻结它。" },
    frost_archivist: { battlecry: { type: "armor", amount: 4 }, text: "登场：获得 4 点护甲。" },
    frost_page: { passive: { type: "spellGrowth", attack: 2, health: 0 }, text: "被动：每当你施放战术牌，获得 +2 攻击。" },
    smuggler_ship: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。" },
    world_map: { spell: { type: "rampSpell", amount: 1 }, text: "本回合获得 1 点行动力。" },
    north_trail: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。" },
    snow_fox_sentry: { battlecry: { type: "armor", amount: 2 }, text: "登场：获得 2 点护甲。" },
    snow_frostwind_novice: { battlecry: { type: "draw", amount: 2 }, text: "登场：抽 2 张牌。" },
    snow_storm_hunter: { battlecry: { type: "damageFreeze", amount: 2 }, text: "登场：对一个敌方随从造成 2 点伤害，并冻结它。" },
    snow_priest: { battlecry: { type: "healHero", amount: 2 }, text: "登场：恢复你的领袖 2 点生命。" },
    snow_gale: { spell: { type: "damage", amount: 2 }, text: "对一个敌方随从造成 2 点伤害。" },
    snow_frost_veil: { target: "enemy", spell: { type: "freeze" }, text: "冻结一个敌方随从。" },
    snow_tundrabracer: { text: "装备（持续生效）：你的回合开始时恢复 2 点生命。" }
  };
  for (const [id, patch] of Object.entries(SNOW_FIX)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const SNOW_FIX2 = {
    frost_line_guard: { battlecry: { type: "armor", amount: 3 }, text: "登场：获得 3 点护甲。" },
    smuggler_ship: { spell: { type: "draw", amount: 3 }, text: "抽 3 张牌。" },
    snow_rin: { battlecry: { type: "freezeDrawIfSpell", draw: 1 }, text: "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 1 张牌。" },
    snow_time_shade: { battlecry: { type: "freezeDrawIfSpell", draw: 2 }, text: "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 2 张牌。" },
    snow_fox_guard: { battlecry: { type: "armor", amount: 2 }, text: "登场：获得 2 点护甲。" },
    snow_windweaver: { passive: { type: "spellGrowth", attack: 0, health: 1 }, text: "被动：每当你施放战术牌，获得 +0/+1。" },
    snow_last_stand: { battlecry: { type: "armor", amount: 5 }, text: "登场：获得 5 点护甲。" },
    snow_ice_wall: { spell: { type: "freezeDraw", draw: 1 }, text: "冻结一个敌方随从；抽 1 张牌。" },
    snow_aurora: { spell: { type: "freezeDraw", draw: 2 }, text: "冻结一个敌方随从；抽 2 张牌。" }
  };
  for (const [id, patch] of Object.entries(SNOW_FIX2)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const SNOW_FIX3 = {
    snow_rin: { battlecry: { type: "freezeDrawIfSpell", draw: 2 }, text: "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 2 张牌。" },
    snow_blizzard_elemental: { battlecry: { type: "armor", amount: 4 }, text: "登场：获得 4 点护甲。" },
    snow_fox_guard: { battlecry: { type: "armor", amount: 3 }, text: "登场：获得 3 点护甲。" }
  };
  for (const [id, patch] of Object.entries(SNOW_FIX3)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  if (CARDS.frost_line_guard) { CARDS.frost_line_guard.battlecry = { type: "armor", amount: 5 }; CARDS.frost_line_guard.text = "登场：获得 5 点护甲。"; }
  if (CARDS.snow_time_shade) { CARDS.snow_time_shade.battlecry = { type: "freezeDrawIfSpell", draw: 3 }; CARDS.snow_time_shade.text = "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 3 张牌。"; }

  if (CARDS.snow_last_stand) { CARDS.snow_last_stand.battlecry = { type: "armor", amount: 6 }; CARDS.snow_last_stand.text = "登场：获得 6 点护甲。"; }

  if (CARDS.nina) CARDS.nina.keywords = (CARDS.nina.keywords || []).filter(k => k !== "taunt");
  if (CARDS.frost_archivist) CARDS.frost_archivist.keywords = (CARDS.frost_archivist.keywords || []).filter(k => k !== "taunt");
  if (CARDS.index_assistant) CARDS.index_assistant.keywords = (CARDS.index_assistant.keywords || []).filter(k => k !== "taunt");
  if (CARDS.beatrix) delete CARDS.beatrix.battlecry;
  if (CARDS.vera) delete CARDS.vera.battlecry;
  if (CARDS.echo_adept) delete CARDS.echo_adept.reflux;

  // v6 Xizhao: Hunter / beasts / blood-debt. All Xizhao cards are re-statted and re-scripted.
  (function redesignXizhao() {
    const all = Object.values(CARDS).filter(c => c.faction === "xizhao" && !c.token && !c.disabled && !c.experimental);
    const clear = (c) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text"]) delete c[k]; };
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,7,7,8,8];
    minions.forEach((c, i) => {
      clear(c); c.type = "minion"; c.cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(c.cost / 2) + (i % 2));
      const hp = Math.max(1, c.cost + 2 - Math.ceil(c.cost / 2) + (i % 3 === 0 ? 1 : 0));
      c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 8;
      if (role === 0) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "damage", amount: 1 + (i % 4) }; c.text = "登场：对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 1) { c.keywords = ["battlecry"]; c.battlecry = { type: "summon", token: "snow_frostclaw" }; c.text = "登场：召唤一只霜爪兽。"; }
      else if (role === 2) { c.keywords = ["rush"]; c.text = "先遣。"; }
      else if (role === 3) { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 1 + (i % 3) }; c.text = "登场：获得" + (1 + (i % 3)) + " 点护甲。"; }
      else if (role === 4) { c.passive = { type: "spellGrowth", attack: 1, health: 0 }; c.text = "被动：每当你施放战术牌，获得 +1 攻击。"; }
      else if (role === 5) { c.keywords = ["deathrattle"]; c.deathrattle = { type: "damageRandomEnemy", amount: 1 + (i % 3) }; c.text = "余响：对随机敌方目标造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 6) { c.keywords = ["taunt"]; c.text = "守备。"; }
      else { c.keywords = ["battlecry"]; c.battlecry = { type: "draw", amount: 1 }; c.text = "登场：抽 1 张牌。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,3,3,4,4,5,6];
    spells.forEach((c, i) => {
      clear(c); c.type = "spell"; c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 6;
      if (role === 0) { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 4) }; c.text = "对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 1) { c.spell = { type: "damageAllEnemies", amount: 1 + (i % 2) }; c.text = "对所有敌方随从造成" + (1 + (i % 2)) + " 点伤害。"; }
      else if (role === 2) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else if (role === 3) { c.spell = { type: "summon", token: "snow_frostclaw" }; c.text = "召唤一只霜爪兽。"; }
      else if (role === 4) { c.spell = { type: "armor", amount: 1 + (i % 3) }; c.text = "获得" + (1 + (i % 3)) + " 点护甲。"; }
      else { c.target = "enemy"; c.spell = { type: "damageFreeze", amount: 1 }; c.text = "对一个敌方随从造成 1 点伤害，并冻结它。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{rush:true}, "该阵位友方随从固定获得先遣。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{windfury:true}, "该阵位友方随从固定获得连携。"]
    ];
    formations.forEach((c, i) => { clear(c); c.type = "formation"; c.cost = 2 + (i % 3); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment"); equipment.forEach((c, i) => { c.cost = 2 + (i % 3); });
    // 12 debt cards: unique hunter debt patterns
    const debts = all.filter(c => c.type === "debt").sort((a,b) => a.id.localeCompare(b.id));
    debts.forEach((c, i) => {
      const repayType = i % 3 === 0 ? "hp" : "mana";
      const repay = 1 + (i % 4);
      const enemyType = ["damageHero", "discardRandom", "blockHeroPower"][i % 3];
      const enemyAmount = 1 + (i % 5);
      const taskType = ["attacks", "heroDamaged", "cardsPlayed"][i % 3];
      const taskAmount = 2 + (i % 3);
      const rewardType = ["draw", "healHero", "armor"][i % 3];
      const rewardAmount = 1 + (i % 3);
      c.cost = 1 + (i % 4);
      c.debt = { repay: { type: repayType, amount: repay }, enemy: { effect: { type: enemyType, amount: enemyAmount }, sourceReward: { type: rewardType, amount: rewardAmount }, label: "血债 " + (i + 1) }, self: { task: { type: taskType, amount: taskAmount }, reward: { type: rewardType, amount: rewardAmount }, penalty: { type: "damageHero", amount: 2 + (i % 3) }, label: "血债任务 " + (i + 1) } };
      c.text = "给敌：偿还" + repay + (repayType === "hp" ? " 生命" : " 行动力") + "；否则目标受到 " + enemyAmount + " 点血债。给己：任务 " + taskAmount + " 次；完成获得奖励，失败失去 " + (2 + (i % 3)) + " 生命。";
    });
    if (CARDS.tiega) { CARDS.tiega.cost = 5; CARDS.tiega.attack = 5; CARDS.tiega.health = 5; CARDS.tiega.keywords = ["charge", "battlecry"]; CARDS.tiega.target = "enemy"; CARDS.tiega.battlecry = { type: "damage", amount: 3 }; CARDS.tiega.text = "先遣。登场：对一个敌方随从造成 3 点伤害。核心：野兽快攻。"; }
    if (CARDS.lize) { CARDS.lize.cost = 4; CARDS.lize.attack = 4; CARDS.lize.health = 4; CARDS.lize.battlecry = { type: "damageHero", amount: 3 }; CARDS.lize.text = "登场：对敌方领袖造成 3 点伤害。核心：压脉。"; }
    if (CARDS.hunt_ritual) { CARDS.hunt_ritual.cost = 3; CARDS.hunt_ritual.debt.self.task = { type: "attacks", amount: 2 }; CARDS.hunt_ritual.text = "核心血债：任务攻击 2 次，完成抽 2 张，失败失去 3 生命。"; }
    if (CARDS.south_pole_tracker) { CARDS.south_pole_tracker.cost = 2; CARDS.south_pole_tracker.spell = { type: "draw", amount: 1 }; CARDS.south_pole_tracker.text = "抽 1 张牌；本回合获得 1 点行动力。"; }
  })();

  if (CARDS.blood_imp) { CARDS.blood_imp.cost = 2; CARDS.blood_imp.debt = { repay: { type: "mana", amount: 2 }, enemy: { effect: { type: "damageHero", amount: 2 }, sourceReward: { type: "draw", amount: 1 }, label: "血债催收" }, self: { task: { type: "cardsPlayed", amount: 3 }, reward: { type: "draw", amount: 2 }, penalty: { type: "damageHero", amount: 3 }, label: "血债任务" } }; CARDS.blood_imp.text = "给敌：偿还 2 行动力；否则目标失去 2 生命，你抽 1 张。给己：任务打出 3 张牌；完成抽 2 张，失败失去 3 生命。"; }
  if (CARDS.lt_hatch) { CARDS.lt_hatch.cost = 1; CARDS.lt_hatch.debt = { repay: { type: "mana", amount: 1 }, enemy: { effect: { type: "damageHero", amount: 1 }, sourceReward: { type: "draw", amount: 1 } }, self: { task: { type: "summon", amount: 2 }, reward: { type: "summon", token: "losutai_imp", count: 1 }, penalty: { type: "damageHero", amount: 2 } } }; CARDS.lt_hatch.text = "给敌：偿还 1 行动力；否则目标失去 1 生命，你抽 1 张。给己：召唤 2 个随从，完成召唤一个 1/1，失败失去 2 生命。"; }
  if (CARDS.blood_contract) { CARDS.blood_contract.formation = { health: 1 }; CARDS.blood_contract.text = "该阵位友方随从固定获得 +0/+1。"; }

  const XI_LT_FIX = {
    grayfeather: { battlecry: { type: "draw", amount: 2 }, text: "登场：抽 2 张牌。" },
    blood_elder: { battlecry: { type: "draw", amount: 3 }, text: "登场：抽 3 张牌。" },
    xh_blood_colossus: { battlecry: { type: "draw", amount: 4 }, text: "登场：抽 4 张牌。" },
    blood_priestess: { target: "enemy", battlecry: { type: "damage", amount: 2 }, text: "登场：对一个敌方随从造成 2 点伤害。" },
    blood_ritual: { formation: { attack: 1 }, text: "该阵位友方随从固定获得 +1 攻击。" },
    tide_scout: { keywords: ["taunt", "rush"], text: "守备。先遣。" },
    broken_bone_warlord: { keywords: ["taunt", "reborn"], text: "守备。回潮。" },
    xh_blood_mist: { battlecry: { type: "summon", token: "medic_apprentice" }, text: "登场：召唤一个医疗学徒。" },
    xh_tribe_headhunter: { passive: { type: "spellGrowth", attack: 2, health: 0 }, text: "被动：每当你施放战术牌，获得 +2 攻击。" },
    xh_pressure_master: { passive: { type: "spellGrowth", attack: 0, health: 1 }, text: "被动：每当你施放战术牌，获得 +0/+1。" },
    xh_blood_knight: { keywords: ["rush", "taunt"], text: "先遣。守备。" },
    xh_blood_priest: { keywords: ["rush", "stealth"], text: "先遣。隐匿。" },
    xh_blood_curse: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。" },
    brood_matron: { battlecry: { type: "summonCount", token: "losutai_imp", count: 3 }, text: "登场：召唤三个 1/1 洛斯汰魔物。" },
    lt_awakened: { battlecry: { type: "summonCount", token: "losutai_imp", count: 1 }, text: "登场：召唤一个 1/1 洛斯汰魔物。" },
    blood_altar: { debt: { repay: { type: "mana", amount: 2 }, enemy: { effect: { type: "damageHero", amount: 1 }, sourceReward: { type: "draw", amount: 1 }, label: "潮债催收" }, self: { task: { type: "summon", amount: 2 }, reward: { type: "draw", amount: 1 }, penalty: { type: "damageHero", amount: 2 } } }, text: "给敌：偿还 2 行动力；否则目标失去 1 生命，你抽 1 张。给己：召唤 2 个随从，完成抽 1 张，失败失去 2 生命。" },
    lt_tide_mother: { battlecry: { type: "summonCount", token: "losutai_imp", count: 4 }, text: "登场：召唤四个 1/1 洛斯汰魔物。" },
    lt_venom_pouch: { text: "装备（持续生效）：你的所有友方随从获得 +1 攻击；毒囊使装备更稳定。" }
  };
  for (const [id, patch] of Object.entries(XI_LT_FIX)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  if (CARDS.lt_brood_mother) { CARDS.lt_brood_mother.battlecry = { type: "summonCount", token: "losutai_imp", count: 5 }; CARDS.lt_brood_mother.text = "登场：召唤五个 1/1 洛斯汰魔物。核心：铺场。"; }
  if (CARDS.devourer) CARDS.devourer.text = "登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值（低攻版）。";
  if (CARDS.monster_overseer) CARDS.monster_overseer.text = "登场：召唤一个 1/1 洛斯汰魔物；若你控制其他魔物，自身获得 +1/+1。";
  if (CARDS.losutai_awakened) CARDS.losutai_awakened.text = "登场：召唤一个 1/1 洛斯汰魔物（觉醒版）。";
  if (CARDS.xh_blood_knight) { CARDS.xh_blood_knight.keywords = ["rush", "divineShield"]; CARDS.xh_blood_knight.text = "先遣。格挡。"; }

  for (const id of ["grayfeather","reflux"]) { if (CARDS[id]) delete CARDS[id].pressure; }
  for (const id of ["molan","tribal_warrior","blood_acolyte","blood_duelist"]) { if (CARDS[id]) delete CARDS[id].bloodCost; }

  if (CARDS.blood_elder) delete CARDS.blood_elder.bloodCost;

  // v6 Republic: Paladin / divine-shield recruits / formation buffs.
  (function redesignRepublic() {
    const all = Object.values(CARDS).filter(c => c.faction === "republic" && !c.token && !c.disabled && !c.experimental);
    const clear = (c) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text"]) delete c[k]; };
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9,9,9,9];
    minions.forEach((c, i) => {
      clear(c); c.type = "minion"; c.cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(c.cost / 2) + (i % 2));
      const hp = Math.max(1, c.cost + 2 - Math.ceil(c.cost / 2) + (i % 3 === 0 ? 1 : 0));
      c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 8;
      if (role === 0) { c.keywords = ["battlecry", "taunt"]; c.battlecry = { type: "armor", amount: 1 + (i % 4) }; c.text = "守备。登场：获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 1) { c.keywords = ["battlecry"]; c.battlecry = { type: "summon", token: "republic_recruit" }; c.text = "登场：召唤一个共和国新兵。"; }
      else if (role === 2) { c.keywords = ["divineShield"]; c.text = "格挡。"; }
      else if (role === 3) { c.keywords = ["battlecry"]; c.target = "friendly"; c.battlecry = { type: "buffAlly", attack: 1 + (i % 2), health: 1 }; c.text = "登场：使一个友方随从获得 +" + (1 + (i % 2)) + "/+1。"; }
      else if (role === 4) { c.keywords = ["taunt"]; c.text = "守备。"; }
      else if (role === 5) { c.keywords = ["battlecry"]; c.battlecry = { type: "healHero", amount: 1 + (i % 3) }; c.text = "登场：恢复你的领袖" + (1 + (i % 3)) + " 点生命。"; }
      else if (role === 6) { c.passive = { type: "turnArmor", amount: 1 }; c.text = "被动：你的回合开始时获得 1 点护甲。"; }
      else { c.keywords = ["deathrattle"]; c.deathrattle = { type: "armor", amount: 1 + (i % 3) }; c.text = "余响：获得" + (1 + (i % 3)) + " 点护甲。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,3,3,4,4,5,6];
    spells.forEach((c, i) => {
      clear(c); c.type = "spell"; c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 6;
      if (role === 0) { c.spell = { type: "armor", amount: 1 + (i % 4) }; c.text = "获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 1) { c.spell = { type: "healHero", amount: 1 + (i % 4) }; c.text = "恢复你的领袖" + (1 + (i % 4)) + " 点生命。"; }
      else if (role === 2) { c.spell = { type: "summon", token: "republic_recruit", count: 1 + (i % 2) }; c.text = "召唤" + (1 + (i % 2)) + " 个共和国新兵。"; }
      else if (role === 3) { c.target = "friendly"; c.spell = { type: "grantRushBuff", attack: 1 + (i % 3) }; c.text = "使一个友方随从获得 +" + (1 + (i % 3)) + " 攻击和先遣。"; }
      else if (role === 4) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 3) }; c.text = "对一个敌方随从造成" + (1 + (i % 3)) + " 点伤害。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{taunt:true,health:1}, "该阵位友方随从固定获得 +0/+1 和守备。"],
      [{rush:true}, "该阵位友方随从固定获得先遣。"],
      [{windfury:true}, "该阵位友方随从固定获得连携。"],
      [{lifesteal:true}, "该阵位友方随从固定获得血偿。"],
      [{reborn:true}, "该阵位友方随从固定获得回潮。"],
      [{attack:2}, "该阵位友方随从固定获得 +2 攻击。"]
    ];
    formations.forEach((c, i) => { clear(c); c.type = "formation"; c.cost = 2 + (i % 3); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment"); equipment.forEach((c, i) => { c.cost = 2 + (i % 3); });
    if (CARDS.konrad) { CARDS.konrad.cost = 5; CARDS.konrad.attack = 4; CARDS.konrad.health = 6; CARDS.konrad.keywords = ["taunt", "divineShield"]; CARDS.konrad.battlecry = { type: "armor", amount: 3 }; CARDS.konrad.text = "守备。格挡。登场：获得 3 点护甲。核心：守备。"; }
    if (CARDS.beatrix) { CARDS.beatrix.cost = 6; CARDS.beatrix.attack = 5; CARDS.beatrix.health = 6; CARDS.beatrix.keywords = ["taunt", "divineShield"]; CARDS.beatrix.text = "守备。格挡。核心：圣盾守备。"; }
    if (CARDS.levy) { CARDS.levy.cost = 2; CARDS.levy.spell = { type: "rampSpell", amount: 1 }; CARDS.levy.text = "本回合获得 1 点行动力。"; }
    if (CARDS.williams_healer) { CARDS.williams_healer.battlecry = { type: "draw", amount: 1 }; CARDS.williams_healer.text = "登场：抽 1 张牌。"; }
  })();

  if (CARDS.williams_healer) delete CARDS.williams_healer.passive;

  // v6 Greyharbor: Rogue / combo / bounty / stealth.
  if (false) (function redesignGrey() {
    const all = Object.values(CARDS).filter(c => c.faction === "greyharbor" && !c.token && !c.disabled && !c.experimental);
    const clear = (c) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text"]) delete c[k]; };
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,7,7,8,8,9,9,9,9,9,9,9];
    minions.forEach((c, i) => {
      clear(c); c.type = "minion"; c.cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(c.cost / 2) + (i % 2));
      const hp = Math.max(1, c.cost + 2 - Math.ceil(c.cost / 2) + (i % 3 === 0 ? 1 : 0));
      c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 9;
      if (role === 0) { c.keywords = ["rush"]; c.text = "先遣。"; }
      else if (role === 1) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "damage", amount: 1 + (i % 4) }; c.text = "登场：对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 2) { c.keywords = ["stealth"]; c.text = "隐匿。"; }
      else if (role === 3) { c.keywords = ["battlecry"]; c.battlecry = { type: "draw", amount: 1 }; c.text = "登场：抽 1 张牌。"; }
      else if (role === 4) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "markBounty" }; c.text = "登场：将一个敌方随从列入悬赏名单。"; }
      else if (role === 5) { c.passive = { type: "spellGrowth", attack: 1, health: 0 }; c.text = "被动：每当你施放战术牌，获得 +1 攻击。"; }
      else if (role === 6) { c.keywords = ["deathrattle"]; c.deathrattle = { type: "damageRandomEnemy", amount: 1 + (i % 3) }; c.text = "余响：对随机敌方目标造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 7) { c.keywords = ["taunt"]; c.text = "守备。"; }
      else { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 1 + (i % 3) }; c.text = "登场：获得" + (1 + (i % 3)) + " 点护甲。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,3,3,4,4,5,6];
    spells.forEach((c, i) => {
      clear(c); c.type = "spell"; c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 6;
      if (role === 0) { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 4) }; c.text = "对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 1) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else if (role === 2) { c.target = "enemy"; c.spell = { type: "markBounty" }; c.text = "将一个敌方随从列入悬赏名单。"; }
      else if (role === 3) { c.target = "enemy"; c.spell = { type: "damageFreeze", amount: 1 }; c.text = "对一个敌方随从造成 1 点伤害，并冻结它。"; }
      else if (role === 4) { c.spell = { type: "armor", amount: 1 + (i % 4) }; c.text = "获得" + (1 + (i % 4)) + " 点护甲。"; }
      else { c.target = "enemy"; c.spell = { type: "damage", amount: 2 + (i % 3) }; c.text = "对一个敌方随从造成" + (2 + (i % 3)) + " 点伤害。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{rush:true}, "该阵位友方随从固定获得先遣。"],
      [{stealth:true}, "该阵位友方随从固定获得隐匿。"],
      [{lifesteal:true}, "该阵位友方随从固定获得血偿。"]
    ];
    formations.forEach((c, i) => { clear(c); c.type = "formation"; c.cost = 2 + (i % 3); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment"); equipment.forEach((c, i) => { c.cost = 2 + (i % 3); });
    if (CARDS.gh_bounty_king) { CARDS.gh_bounty_king.cost = 7; CARDS.gh_bounty_king.attack = 7; CARDS.gh_bounty_king.health = 7; CARDS.gh_bounty_king.passive = { type: "bountyClaimDamage", amount: 4 }; CARDS.gh_bounty_king.text = "被动：完成悬赏时，对敌方领袖造成 4 点伤害。核心：悬赏。"; }
    if (CARDS.vera) { CARDS.vera.cost = 5; CARDS.vera.attack = 5; CARDS.vera.health = 5; CARDS.vera.keywords = ["stealth", "rush"]; CARDS.vera.text = "隐匿。先遣。核心：连击。"; delete CARDS.vera.battlecry; }
    if (CARDS.commission_advance) { CARDS.commission_advance.cost = 2; CARDS.commission_advance.spell = { type: "draw", amount: 1 }; CARDS.commission_advance.text = "抽 1 张牌；本回合获得 1 点行动力。"; }
    if (CARDS.greyharbor_broker) { CARDS.greyharbor_broker.battlecry = { type: "draw", amount: 1 }; CARDS.greyharbor_broker.text = "登场：抽 1 张牌。"; }
  })();

  if (CARDS.vera) { delete CARDS.vera.deathrattle; delete CARDS.vera.battlecry; delete CARDS.vera.passive; }

  // v6 Empire: Warrior / armor / weapons / armor-to-damage.
  if (false) (function redesignEmpire() {
    const all = Object.values(CARDS).filter(c => c.faction === "empire" && !c.token && !c.disabled && !c.experimental);
    const clear = (c) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text"]) delete c[k]; };
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9,9,9,9];
    minions.forEach((c, i) => {
      clear(c); c.type = "minion"; c.cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(c.cost / 2) + (i % 2));
      const hp = Math.max(1, c.cost + 2 - Math.ceil(c.cost / 2) + (i % 3 === 0 ? 1 : 0));
      c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 8;
      if (role === 0) { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 1 + (i % 4) }; c.text = "登场：获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 1) { c.keywords = ["rush"]; c.text = "先遣。"; }
      else if (role === 2) { c.keywords = ["battlecry"]; c.target = "enemy"; c.battlecry = { type: "damage", amount: 1 + (i % 4) }; c.text = "登场：对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 3) { c.keywords = ["taunt"]; c.text = "守备。"; }
      else if (role === 4) { c.passive = { type: "turnArmor", amount: 1 }; c.text = "被动：你的回合开始时获得 1 点护甲。"; }
      else if (role === 5) { c.keywords = ["battlecry"]; c.battlecry = { type: "draw", amount: 1 }; c.text = "登场：抽 1 张牌。"; }
      else if (role === 6) { c.keywords = ["deathrattle"]; c.deathrattle = { type: "armor", amount: 1 + (i % 3) }; c.text = "余响：获得" + (1 + (i % 3)) + " 点护甲。"; }
      else { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 2 + (i % 3) }; c.text = "登场：获得" + (2 + (i % 3)) + " 点护甲。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,3,3,4,4,5,6];
    spells.forEach((c, i) => {
      clear(c); c.type = "spell"; c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 6;
      if (role === 0) { c.spell = { type: "armor", amount: 1 + (i % 4) }; c.text = "获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 1) { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 4) }; c.text = "对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 2) { c.spell = { type: "damageAllEnemies", amount: 1 + (i % 3) }; c.text = "对所有敌方随从造成" + (1 + (i % 3)) + " 点伤害。"; }
      else if (role === 3) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else if (role === 4) { c.spell = { type: "armorToDamage", max: 5 }; c.text = "消耗最多 5 点护甲，对敌方领袖造成等量伤害。"; }
      else { c.spell = { type: "armor", amount: 2 + (i % 3) }; c.text = "获得" + (2 + (i % 3)) + " 点护甲。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{rush:true}, "该阵位友方随从固定获得先遣。"],
      [{lifesteal:true}, "该阵位友方随从固定获得血偿。"],
      [{reborn:true}, "该阵位友方随从固定获得回潮。"],
      [{attack:2}, "该阵位友方随从固定获得 +2 攻击。"]
    ];
    formations.forEach((c, i) => { clear(c); c.type = "formation"; c.cost = 2 + (i % 3); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment"); equipment.forEach((c, i) => { c.cost = 2 + (i % 3); });
    if (CARDS.karl_schwarz) { CARDS.karl_schwarz.cost = 6; CARDS.karl_schwarz.attack = 5; CARDS.karl_schwarz.health = 6; CARDS.karl_schwarz.keywords = ["battlecry"]; CARDS.karl_schwarz.target = "enemy"; CARDS.karl_schwarz.battlecry = { type: "armorDamage" }; CARDS.karl_schwarz.text = "登场：对一个敌方随从造成等同于你护甲的伤害。核心：护甲战。"; }
    if (CARDS.gunther) { CARDS.gunther.cost = 6; CARDS.gunther.attack = 5; CARDS.gunther.health = 7; CARDS.gunther.keywords = ["battlecry", "windfury"]; CARDS.gunther.battlecry = { type: "armor", amount: 6 }; CARDS.gunther.text = "连携。登场：获得 6 点护甲。核心：护甲战。"; }
    if (CARDS.mobilize) { CARDS.mobilize.cost = 3; CARDS.mobilize.spell = { type: "rampSpell", amount: 1 }; CARDS.mobilize.text = "本回合获得 1 点行动力。"; }
    if (CARDS.quartermaster) { CARDS.quartermaster.battlecry = { type: "draw", amount: 1 }; CARDS.quartermaster.text = "登场：抽 1 张牌。"; }
  })();

  if (CARDS.karl_schwarz) delete CARDS.karl_schwarz.passive;
  if (CARDS.quartermaster) delete CARDS.quartermaster.passive;

  // v6 Pus: Priest / healing / vein / copy / control.
  (function redesignPus() {
    const all = Object.values(CARDS).filter(c => c.faction === "pus" && !c.token && !c.disabled && !c.experimental);
    const clear = (c) => { for (const k of ["keywords","battlecry","passive","deathrattle","formation","spell","target","attack","health","maxHealth","text"]) delete c[k]; };
    const minions = all.filter(c => c.type === "minion").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const mCost = [1,1,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9,9,9,9];
    minions.forEach((c, i) => {
      clear(c); c.type = "minion"; c.cost = mCost[i % mCost.length];
      const atk = Math.max(1, Math.ceil(c.cost / 2) + (i % 2));
      const hp = Math.max(1, c.cost + 2 - Math.ceil(c.cost / 2) + (i % 3 === 0 ? 1 : 0));
      c.attack = atk; c.health = hp; c.maxHealth = hp;
      const role = i % 8;
      if (role === 0) { c.keywords = ["battlecry"]; c.battlecry = { type: "healHero", amount: 1 + (i % 4) }; c.text = "登场：恢复你的领袖" + (1 + (i % 4)) + " 点生命。"; }
      else if (role === 1) { c.keywords = ["taunt"]; c.text = "守备。"; }
      else if (role === 2) { c.keywords = ["battlecry"]; c.battlecry = { type: "armor", amount: 1 + (i % 3) }; c.text = "登场：获得" + (1 + (i % 3)) + " 点护甲。"; }
      else if (role === 3) { c.passive = { type: "spellDrawOne" }; c.text = "被动：每当你施放一张战术牌，抽 1 张牌。"; }
      else if (role === 4) { c.keywords = ["battlecry"]; c.battlecry = { type: "draw", amount: 1 }; c.text = "登场：抽 1 张牌。"; }
      else if (role === 5) { c.passive = { type: "spellGrowth", attack: 0, health: 1 }; c.text = "被动：每当你施放战术牌，获得 +0/+1。"; }
      else if (role === 6) { c.keywords = ["deathrattle"]; c.deathrattle = { type: "healHero", amount: 1 + (i % 3) }; c.text = "余响：恢复你的领袖" + (1 + (i % 3)) + " 点生命。"; }
      else { c.keywords = ["battlecry"]; c.target = "friendly"; c.battlecry = { type: "buffAlly", attack: 0, health: 1 + (i % 2) }; c.text = "登场：使一个友方随从获得 +0/+" + (1 + (i % 2)) + "。"; }
    });
    const spells = all.filter(c => c.type === "spell").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const sCost = [1,1,2,2,3,3,4,4,5,6];
    spells.forEach((c, i) => {
      clear(c); c.type = "spell"; c.cost = sCost[i % sCost.length]; c.target = "none";
      const role = i % 6;
      if (role === 0) { c.spell = { type: "healHero", amount: 1 + (i % 4) }; c.text = "恢复你的领袖" + (1 + (i % 4)) + " 点生命。"; }
      else if (role === 1) { c.spell = { type: "armor", amount: 1 + (i % 4) }; c.text = "获得" + (1 + (i % 4)) + " 点护甲。"; }
      else if (role === 2) { c.target = "enemy"; c.spell = { type: "damage", amount: 1 + (i % 4) }; c.text = "对一个敌方随从造成" + (1 + (i % 4)) + " 点伤害。"; }
      else if (role === 3) { c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌。"; }
      else if (role === 4) { c.spell = { type: "healDraw", heal: 2, draw: 1 }; c.text = "恢复你的领袖 2 点生命；抽 1 张牌。"; }
      else { c.target = "enemy"; c.spell = { type: "freeze" }; c.text = "冻结一个敌方随从。"; }
    });
    const formations = all.filter(c => c.type === "formation").sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const fTemplates = [
      [{attack:1}, "该阵位友方随从固定获得 +1 攻击。"],
      [{health:1}, "该阵位友方随从固定获得 +0/+1。"],
      [{attack:1,health:1}, "该阵位友方随从固定获得 +1/+1。"],
      [{taunt:true}, "该阵位友方随从固定获得守备。"],
      [{lifesteal:true}, "该阵位友方随从固定获得血偿。"],
      [{reborn:true}, "该阵位友方随从固定获得回潮。"],
      [{stealth:true}, "该阵位友方随从固定获得隐匿。"],
      [{windfury:true}, "该阵位友方随从固定获得连携。"]
    ];
    formations.forEach((c, i) => { clear(c); c.type = "formation"; c.cost = 2 + (i % 3); const [f,text] = fTemplates[i % fTemplates.length]; c.formation = f; c.text = text; });
    const equipment = all.filter(c => c.type === "equipment"); equipment.forEach((c, i) => { c.cost = 2 + (i % 3); });
    if (CARDS.shextena) { CARDS.shextena.cost = 5; CARDS.shextena.attack = 4; CARDS.shextena.health = 5; CARDS.shextena.keywords = ["battlecry"]; CARDS.shextena.battlecry = { type: "healHeroSelfBuff", amount: 4 }; CARDS.shextena.text = "登场：恢复你的领袖 4 点生命；每实际恢复 1 点，获得 +1/+1。核心：治疗。"; }
    if (CARDS.orlicas) { CARDS.orlicas.cost = 4; CARDS.orlicas.attack = 3; CARDS.orlicas.health = 4; CARDS.orlicas.keywords = ["battlecry"]; CARDS.orlicas.battlecry = { type: "draw", amount: 2 }; CARDS.orlicas.text = "登场：抽 2 张牌。核心：资源。"; }
    if (CARDS.coordination) { CARDS.coordination.cost = 2; CARDS.coordination.spell = { type: "rampSpell", amount: 1 }; CARDS.coordination.text = "本回合获得 1 点行动力。"; }
    if (CARDS.courier) { CARDS.courier.battlecry = { type: "draw", amount: 1 }; CARDS.courier.text = "登场：抽 1 张牌。"; }
  })();

  // Final v6 dedupe pass: every duplicate within a faction gets a unique secondary rider.
  (function finalDedupe() {
    const sig = (c) => JSON.stringify({ type: c.type, keywords: (c.keywords || []).slice().sort(), battlecry: c.battlecry || null, passive: c.passive || null, deathrattle: c.deathrattle || null, formation: c.formation || null, spell: c.spell || null, debt: c.debt || null, excavate: c.excavate == null ? null : c.excavate, eq: c.type === "equipment" ? (c.text || "") : null });
    let serial = 0;
    for (const faction of [...FACTION_IDS, "neutral"]) {
      const cards = Object.values(CARDS).filter(c => c.faction === faction && !c.token && !c.disabled && !c.experimental).sort((a,b) => (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
      const seen = new Set();
      for (const c of cards) {
        const before = sig(c);
        if (!seen.has(before)) { seen.add(before); continue; }
        serial++;
        if (c.type === "minion") {
          c.keywords = Array.from(new Set([...(c.keywords || []), "deathrattle"]));
          c.deathrattle = { type: "armor", amount: 1 + (serial % 7) };
          c.text = (c.text || "").replace(/余响：[^。]+。/g, "") + " 余响：获得 " + (1 + (serial % 7)) + " 点护甲。";
        } else if (c.type === "spell") {
          c.spell = { type: "armor", amount: 1 + (serial % 7) }; c.text = "获得" + (1 + (serial % 7)) + " 点护甲。"; c.target = "none";
        } else if (c.type === "formation") {
          c.formation = { attack: 1 + (serial % 4), health: 1 }; c.text = "该阵位友方随从固定获得 +" + (1 + (serial % 4)) + "/+1。";
        } else if (c.type === "equipment") {
          c.text = (c.text || "").replace(/（变体 \d+）/g, "") + "（变体 " + serial + "）";
        }
        seen.add(sig(c));
      }
    }
  })();


  // Remove legacy fields that no longer belong to the v6 scripts.
  (function cleanLegacy() {
    for (const c of Object.values(CARDS)) {
      for (const k of ["veinBonus","veinTiers","mirrorBonus","copyLimit","zoneBonus","zoneAura","zhenmai","reflux","pressure","bloodCost"]) delete c[k];
    }
    if (CARDS.gh_bounty_king) CARDS.gh_bounty_king.keywords = (CARDS.gh_bounty_king.keywords || []).filter(k => k !== "stealth");
  })();


  if (CARDS.blood_contract) { CARDS.blood_contract.formation = { health: 1, duration: 99 }; CARDS.blood_contract.text = "该阵位友方随从固定获得 +0/+1。"; }

  const RESIDUAL_FIX = {
    vein_foreman: { battlecry: { type: "healHero", amount: 2 }, text: "登场：恢复你的领袖 2 点生命。" },
    stein_speaker: { deathrattle: { type: "armor", amount: 6 }, text: "登场：使一个友方随从获得 +2/+1。 余响：获得 6 点护甲。" },
    phalanx_executor: { deathrattle: { type: "armor", amount: 8 }, text: "守备。登场：获得 1 点护甲。 余响：获得 8 点护甲。" },
    armor_recycle: { spell: { type: "armor", amount: 5 }, text: "获得 5 点护甲。" },
    iron_order_wall: { deathrattle: { type: "armor", amount: 3 }, text: "余响：获得 3 点护甲。" },
    forge_engineer: { text: "登场：抽 1 张牌；铸甲师为你补 1 点护甲。" },
    ledger_constitution: { spell: { type: "armor", amount: 8 }, text: "获得 8 点护甲。" },
    venom_blade: { spell: { type: "armor", amount: 2 }, text: "获得 2 点护甲。" },
    frost_archivist: { battlecry: { type: "armor", amount: 5 }, text: "登场：获得 5 点护甲。" },
    snow_wind_altar: { text: "该阵位友方随从攻击已冻结随从时 +1 攻击。" },
    white_reef_keeper: { deathrattle: { type: "armor", amount: 1 }, text: "守备。 余响：获得 1 点护甲。" },
    white_reef_lighthouse: { deathrattle: { type: "armor", amount: 4 }, text: "守备。 余响：获得 4 点护甲。" },
    northern_nomad: { deathrattle: { type: "armor", amount: 5 }, text: "先遣。 余响：获得 5 点护甲。" },
    sky_ship: { deathrattle: { type: "armor", amount: 7 }, text: "先遣。 余响：获得 7 点护甲。" },
    anvil_forge_row: { formation: { attack: 2 }, text: "该阵位友方随从固定获得 +2 攻击。" },
    free_merc: { battlecry: { type: "armor", amount: 2 }, deathrattle: { type: "armor", amount: 3 }, text: "登场：获得 2 点护甲。 余响：获得 3 点护甲。" }
  };
  for (const [id, patch] of Object.entries(RESIDUAL_FIX)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const RESIDUAL_FIX2 = {
    grain_convoy: { deathrattle: { type: "armor", amount: 4 }, text: "余响：获得 4 点护甲。" },
    frost_archivist: { battlecry: { type: "armor", amount: 6 }, text: "登场：获得 6 点护甲。" },
    caravan_guard: { deathrattle: { type: "armor", amount: 5 }, text: "守备。 余响：获得 5 点护甲。" },
    fog_dockhand: { deathrattle: { type: "armor", amount: 2 }, text: "守备。 余响：获得 2 点护甲。" },
    north_hunt_camp: { formation: { attack: 1, rush: true }, text: "该阵位友方随从固定获得 +1 攻击和先遣。" },
    wandering_blade: { deathrattle: { type: "armor", amount: 8 }, text: "先遣。 余响：获得 8 点护甲。" },
    snow_wind_altar: { text: "该阵位友方随从固定获得：攻击已冻结随从时 +1 攻击。" }
  };
  for (const [id, patch] of Object.entries(RESIDUAL_FIX2)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  if (CARDS.snow_last_stand) { CARDS.snow_last_stand.battlecry = { type: "armor", amount: 9 }; CARDS.snow_last_stand.text = "登场：获得 9 点护甲。"; }
  if (CARDS.fog_dockhand) { CARDS.fog_dockhand.deathrattle = { type: "armor", amount: 6 }; CARDS.fog_dockhand.text = "守备。 余响：获得 6 点护甲。"; }
  if (CARDS.mistgate_warden) { CARDS.mistgate_warden.deathrattle = { type: "armor", amount: 7 }; CARDS.mistgate_warden.text = "守备。 余响：获得 7 点护甲。"; }
  if (CARDS.smugglers_dock) { CARDS.smugglers_dock.formation = { attack: 1, taunt: true }; CARDS.smugglers_dock.text = "该阵位友方随从固定获得 +1 攻击和守备。"; }

  if (CARDS.fog_dockhand) { CARDS.fog_dockhand.deathrattle = { type: "armor", amount: 9 }; CARDS.fog_dockhand.text = "守备。 余响：获得 9 点护甲。"; }
  if (CARDS.no_mans_camp) { CARDS.no_mans_camp.formation = { attack: 2, taunt: true }; CARDS.no_mans_camp.text = "该阵位友方随从固定获得 +2 攻击和守备。"; }

  // Cross-faction flavor pass 1: draw and simple armor are class-specific.
  const CLASS_DRAW = {
    ac_arcane_flood: { target: "none", spell: { type: "drawIfSpellPlayed", draw: 1 }, text: "抽 1 张牌；若你本回合已施放战术牌，再抽 1 张。" },
    snow_wind_strike: { target: "enemy", spell: { type: "freezeDraw", draw: 1 }, text: "冻结一个敌方随从；抽 1 张牌。" },
    south_pole_tracker: { target: "none", spell: { type: "drawIfEnemyNoMinions", draw: 1 }, text: "抽 1 张牌；若敌方没有随从，再抽 1 张。" },
    lt_tide_birth: { target: "none", spell: { type: "drawGainVein", draw: 1, vein: 2 }, text: "抽 1 张牌；流脉 +2。" },
    iron_wall: { target: "none", spell: { type: "drawArmorIfTaunt", draw: 1, armor: 2 }, text: "抽 1 张牌；若你控制守备随从，获得 2 点护甲。" },
    gh_bodyguard_contract: { target: "none", spell: { type: "drawIfBountyClaimed", draw: 1 }, text: "抽 1 张牌；若本回合已完成悬赏，再抽 1 张。" },
    war_tax: { target: "none", spell: { type: "armorDraw", armor: 1, draw: 1 }, text: "获得 1 点护甲；抽 1 张牌。" },
    ksetra_beacon: { target: "none", spell: { type: "healHeroDraw", heal: 2, draw: 1 }, text: "恢复你的领袖 2 点生命；抽 1 张牌。" },
    doorman: { target: "none", battlecry: { type: "drawIfCombo" }, text: "登场：若你本回合已经使用过其他牌，抽 1 张牌；否则抽 1 张牌。" },
    courier: { target: "none", battlecry: { type: "drawIfFormation" }, text: "登场：抽 1 张牌；若你有阵型，再抽 1 张。" },
    venom_attendant: { target: "none", battlecry: { type: "drawIfCombo" }, text: "登场：若你本回合已经使用过其他牌，抽 1 张牌。" },
    snow_frozen_oracle: { target: "enemy", battlecry: { type: "freezeDrawIfSpell", draw: 1 }, text: "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 1 张。" },
    forge_engineer: { target: "none", text: "登场：抽 1 张牌；铸甲师为你补 1 点护甲。" }
  };
  for (const [id, patch] of Object.entries(CLASS_DRAW)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }
  const CLASS_ARMOR = {
    emergency: { spell: { type: "healHeroDraw", heal: 2, draw: 1 }, text: "恢复你的领袖 2 点生命；抽 1 张牌。" },
    frost_seal: { target: "enemy", spell: { type: "freezeArmor", armor: 2 }, text: "冻结一个敌方随从；获得 2 点护甲。" },
    impeachment: { spell: { type: "formationDrawArmor", draw: 1, armor: 2 }, text: "抽 1 张牌；若你有阵型，获得 2 点护甲。" },
    venom_blade: { spell: { type: "armorDraw", armor: 2, draw: 1 }, text: "获得 2 点护甲；抽 1 张牌。" },
    xh_blood_road: { target: "enemy", spell: { type: "damage", amount: 2 }, text: "对一个敌方随从造成 2 点伤害。" },
    line_rotation: { spell: { type: "drawArmorIfTaunt", draw: 1, armor: 1 }, text: "抽 1 张牌；若你控制守备随从，获得 1 点护甲。" },
    gh_bounty_verdict: { spell: { type: "drawIfBountyClaimed", draw: 1 }, text: "抽 1 张牌；若本回合已完成悬赏，再抽 1 张。" },
    coordinator_order: { spell: { type: "healHeroDraw", heal: 3, draw: 1 }, text: "恢复你的领袖 3 点生命；抽 1 张牌。" },
    conscription_order: { spell: { type: "armorPerEnemy", amount: 1 }, text: "每有一个敌方随从，获得 1 点护甲。" },
    anvil_quench: { target: "enemy", spell: { type: "freezeArmor", armor: 3 }, text: "冻结一个敌方随从；获得 3 点护甲。" },
    ac_knowledge_burst: { spell: { type: "drawIfSpellPlayed", draw: 2 }, text: "抽 1 张牌；若你本回合已施放战术牌，再抽 2 张。" }
  };
  for (const [id, patch] of Object.entries(CLASS_ARMOR)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  const FLAVOR_FIX1 = {
    emergency: { spell: { type: "healHeroDraw", heal: 1, draw: 1 }, text: "恢复你的领袖 1 点生命；抽 1 张牌。" },
    medical_stretcher: { text: "恢复你的领袖 2 点生命；抽 1 张牌（急救担架）。" },
    gh_bounty_verdict: { spell: { type: "drawIfBountyThisTurn", draw: 1 }, text: "抽 1 张牌；若本回合完成过悬赏，再抽 1 张。" },
    echo_adept: { battlecry: { type: "freezeDrawIfSpell", draw: 2 }, text: "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 2 张牌。" },
    snow_ice_wall: { target: "enemy", spell: { type: "freezeArmor", armor: 2 }, text: "冻结一个敌方随从；获得 2 点护甲。" }
  };
  for (const [id, patch] of Object.entries(FLAVOR_FIX1)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  if (CARDS.frost_seal) { CARDS.frost_seal.spell = { type: "freezeArmor", armor: 3 }; CARDS.frost_seal.text = "冻结一个敌方随从；获得 3 点护甲。"; }
  if (CARDS.echo_adept) { CARDS.echo_adept.battlecry = { type: "freezeDrawIfSpell", draw: 3 }; CARDS.echo_adept.text = "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 3 张牌。"; }

  if (CARDS.anvil_quench) { CARDS.anvil_quench.spell = { type: "freezeArmor", armor: 4 }; CARDS.anvil_quench.text = "冻结一个敌方随从；获得 4 点护甲。"; }
  if (CARDS.snow_time_shade) { CARDS.snow_time_shade.battlecry = { type: "freezeDrawIfSpell", draw: 4 }; CARDS.snow_time_shade.text = "登场：冻结一个敌方随从；若你本回合施放过战术牌，抽 4 张牌。"; }

  // Cross-faction flavor pass 2: formations and pure-taunt bodies become class-specific.
  (function classFormations() {
    const patterns = {
      academy: [[{attack:1},"+1 攻击"],[{health:1},"+0/+1"],[{attack:1,health:1},"+1/+1"],[{taunt:true},"守备"],[{rush:true},"先遣"],[{windfury:true},"连携"],[{attack:1,windfury:true},"+1 攻击和连携"]],
      snow: [[{taunt:true,health:1},"+0/+1 和守备"],[{attackVsFrozen:1},"攻击已冻结随从时 +1 攻击"],[{attackVsFrozen:2},"攻击已冻结随从时 +2 攻击"],[{rush:true},"先遣"],[{windfury:true},"连携"],[{reborn:true},"回潮"],[{attack:1,health:1},"+1/+1"],[{taunt:true,attack:1},"+1 攻击和守备"],[{health:2},"+0/+2"]],
      xizhao: [[{attack:1},"+1 攻击"],[{rush:true},"先遣"],[{attack:1,rush:true},"+1 攻击和先遣"],[{lifesteal:true},"血偿"],[{attack:2},"+2 攻击"],[{health:1,rush:true},"+0/+1 和先遣"]],
      losutai: [[{taunt:true},"守备"],[{health:1},"+0/+1"],[{reborn:true},"回潮"],[{attack:1,health:1},"+1/+1"]],
      republic: [[{taunt:true},"守备"],[{taunt:true,health:1},"+0/+1 和守备"],[{health:1},"+0/+1"],[{attack:1},"+1 攻击"],[{attack:1,health:1},"+1/+1"],[{rush:true},"先遣"],[{windfury:true},"连携"],[{lifesteal:true},"血偿"],[{reborn:true},"回潮"],[{taunt:true,attack:1},"+1 攻击和守备"]],
      greyharbor: [[{attack:1},"+1 攻击"],[{rush:true},"先遣"],[{stealth:true},"隐匿"],[{attack:1,stealth:true},"+1 攻击和隐匿"],[{health:1},"+0/+1"],[{lifesteal:true},"血偿"],[{attack:1,health:1},"+1/+1"]],
      empire: [[{taunt:true},"守备"],[{attack:1},"+1 攻击"],[{health:1},"+0/+1"],[{attack:1,health:1},"+1/+1"],[{rush:true},"先遣"],[{reborn:true},"回潮"],[{lifesteal:true},"血偿"],[{attack:2},"+2 攻击"]],
      pus: [[{health:1},"+0/+1"],[{taunt:true},"守备"],[{attack:1},"+1 攻击"],[{lifesteal:true},"血偿"],[{reborn:true},"回潮"],[{health:2},"+0/+2"],[{attack:1,health:1},"+1/+1"],[{taunt:true,health:1},"+0/+1 和守备"]],
      neutral: [[{attack:1},"+1 攻击"],[{health:1},"+0/+1"],[{taunt:true},"守备"],[{rush:true},"先遣"],[{reborn:true},"回潮"],[{lifesteal:true},"血偿"],[{attack:2},"+2 攻击"],[{health:2},"+0/+2"],[{attack:1,health:1},"+1/+1"],[{stealth:true},"隐匿"],[{windfury:true},"连携"],[{taunt:true,health:1},"+0/+1 和守备"]]
    };
    for (const f of Object.keys(patterns)) {
      const forms = Object.values(CARDS).filter(c => c.faction === f && c.type === "formation" && !c.token && !c.disabled && !c.experimental).sort((a,b) => a.id.localeCompare(b.id));
      forms.forEach((c, i) => {
        const [formation, label] = patterns[f][i % patterns[f].length];
        c.formation = formation;
        c.text = "该阵位友方随从固定获得" + label + "。";
      });
    }
  })();
  (function classTauntBodies() {
    const riders = {
      academy: { b: { type: "draw", amount: 1 }, t: "登场：抽 1 张牌。" },
      snow: { b: { type: "freeze" }, t: "登场：冻结一个敌方随从。", target: "enemy" },
      xizhao: { b: { type: "damage", amount: 1 }, t: "登场：对一个敌方随从造成 1 点伤害。", target: "enemy" },
      losutai: { b: { type: "summon", token: "losutai_imp" }, t: "登场：召唤一个 1/1 洛斯汰魔物。" },
      republic: { b: { type: "armor", amount: 1 }, t: "登场：获得 1 点护甲。" },
      greyharbor: { b: { type: "markBounty" }, t: "登场：将一个敌方随从列入悬赏名单。", target: "enemy" },
      empire: { b: { type: "armor", amount: 2 }, t: "登场：获得 2 点护甲。" },
      pus: { b: { type: "healHero", amount: 1 }, t: "登场：恢复你的领袖 1 点生命。" },
      neutral: { b: { type: "draw", amount: 1 }, t: "登场：抽 1 张牌。" }
    };
    for (const c of Object.values(CARDS)) {
      if (c.type !== "minion" || c.token || c.disabled || c.experimental) continue;
      const ks = c.keywords || [];
      if (!ks.includes("taunt") || ks.length !== 1 || c.battlecry || c.passive || c.deathrattle) continue;
      const r = riders[c.faction]; if (!r) continue;
      c.battlecry = r.b; if (r.target) c.target = r.target;
      c.keywords = ["taunt", "battlecry"];
      c.text = "守备。" + r.t;
    }
  })();

  if (CARDS.monster_summon) { CARDS.monster_summon.formation = { poisonous: true }; CARDS.monster_summon.text = "该阵位友方随从固定获得蚀毒。"; }
  if (CARDS.blood_contract) { CARDS.blood_contract.formation = { health: 1, duration: 99 }; CARDS.blood_contract.text = "该阵位友方随从固定获得 +0/+1。"; }

  if (CARDS.shield_recruit) { CARDS.shield_recruit.battlecry = { type: "armor", amount: 2 }; CARDS.shield_recruit.text = "守备。登场：获得 2 点护甲。"; }
  (function uniqueNeutralFormations() {
    const pats = [[{attack:1},"+1 攻击"],[{health:1},"+0/+1"],[{taunt:true},"守备"],[{rush:true},"先遣"],[{reborn:true},"回潮"],[{lifesteal:true},"血偿"],[{attack:2},"+2 攻击"],[{health:2},"+0/+2"],[{attack:1,health:1},"+1/+1"],[{stealth:true},"隐匿"],[{windfury:true},"连携"],[{taunt:true,health:1},"+0/+1 和守备"],[{attack:1,rush:true},"+1 攻击和先遣"],[{attack:2,health:1},"+2/+1"],[{attack:1,stealth:true},"+1 攻击和隐匿"],[{health:1,lifesteal:true},"+0/+1 和血偿"]];
    const forms = Object.values(CARDS).filter(c => c.faction === "neutral" && c.type === "formation" && !c.token && !c.disabled && !c.experimental).sort((a,b) => a.id.localeCompare(b.id));
    forms.forEach((c, i) => { const [f,label] = pats[i % pats.length]; c.formation = f; c.text = "该阵位友方随从固定获得" + label + "。"; });
  })();


  // Differentiate duplicated minion templates with a class-specific deathrattle rider.
  (function classMinionRiders() {
    const sig = (c) => JSON.stringify({ type: c.type, keywords: (c.keywords || []).slice().sort(), battlecry: c.battlecry || null, passive: c.passive || null, deathrattle: c.deathrattle || null, formation: c.formation || null, spell: c.spell || null, debt: c.debt || null, excavate: c.excavate == null ? null : c.excavate, eq: c.type === "equipment" ? c.text : null });
    const cards = Object.values(CARDS).filter(c => c.type === "minion" && !c.token && !c.disabled && !c.experimental).sort((a,b) => a.faction.localeCompare(b.faction) || (a.cost||0)-(b.cost||0) || a.id.localeCompare(b.id));
    const seen = new Set(); let serial = 0;
    for (const c of cards) {
      const key = sig(c);
      if (!seen.has(key)) { seen.add(key); continue; }
      if (!["academy","snow","xizhao","losutai","republic","greyharbor","empire","pus"].includes(c.faction)) { seen.add(key); continue; }
      serial++;
      c.keywords = Array.from(new Set([...(c.keywords || []), "deathrattle"]));
      let rider = "";
      if (c.faction === "academy") { c.deathrattle = { type: "draw", amount: 1 }; rider = "抽 1 张牌"; }
      else if (c.faction === "snow") { c.deathrattle = { type: "summon", token: "snow_fox_sentry" }; rider = "召唤一个雪狐哨兵"; }
      else if (c.faction === "xizhao") { c.deathrattle = { type: "damageRandomEnemy", amount: 1 + (serial % 2) }; rider = "对随机敌方目标造成伤害"; }
      else if (c.faction === "losutai") { c.deathrattle = { type: "summon", token: "losutai_imp" }; rider = "召唤一个 1/1 洛斯汰魔物"; }
      else if (c.faction === "republic") { c.deathrattle = { type: "armor", amount: 1 + (serial % 2) }; rider = "获得护甲"; }
      else if (c.faction === "greyharbor") { c.deathrattle = { type: "damageRandomEnemy", amount: 2 }; rider = "对随机敌方目标造成 2 点伤害"; }
      else if (c.faction === "empire") { c.deathrattle = { type: "armor", amount: 2 }; rider = "获得 2 点护甲"; }
      else if (c.faction === "pus") { c.deathrattle = { type: "healHero", amount: 1 + (serial % 2) }; rider = "恢复生命"; }
      c.text = (c.text || "").replace(/余响：[^。]+。/g, "") + " 余响：" + rider + "。";
      const nk = sig(c);
      if (seen.has(nk)) { c.deathrattle.amount = (c.deathrattle.amount || 1) + (serial % 3); c.text = (c.text || "") + "（余响 " + serial + "）"; }
      seen.add(sig(c));
    }
  })();

  if (CARDS.pulse_banner) { CARDS.pulse_banner.deathrattle = { type: "healHero", amount: 4 }; CARDS.pulse_banner.text = "余响：恢复你的领袖 4 点生命。"; }
  if (CARDS.vein_needle) { CARDS.vein_needle.deathrattle = { type: "healHero", amount: 1 }; CARDS.vein_needle.text = "登场：抽 1 张牌。 余响：恢复你的领袖 1 点生命。"; }
  if (CARDS.spring_watcher) { CARDS.spring_watcher.deathrattle = { type: "healHero", amount: 3 }; CARDS.spring_watcher.text = "登场：抽 1 张牌。 余响：恢复你的领袖 3 点生命。"; }
  if (CARDS.research_sampler) { CARDS.research_sampler.deathrattle = { type: "healHero", amount: 4 }; CARDS.research_sampler.text = "登场：抽 1 张牌。 余响：恢复你的领袖 4 点生命。"; }
  if (CARDS.xh_castle_consul) { CARDS.xh_castle_consul.deathrattle = { type: "damageRandomEnemy", amount: 4 }; CARDS.xh_castle_consul.text = "余响：对随机敌方目标造成 4 点伤害。"; }
  if (CARDS.erhardt) { CARDS.erhardt.deathrattle = { type: "armor", amount: 1 }; CARDS.erhardt.text = "余响：获得 1 点护甲。"; }
  if (CARDS.cedric) { CARDS.cedric.deathrattle = { type: "armor", amount: 3 }; CARDS.cedric.text = "余响：获得 3 点护甲。"; }
  if (CARDS.shield_marshal) { CARDS.shield_marshal.deathrattle = { type: "armor", amount: 4 }; CARDS.shield_marshal.text = "余响：获得 4 点护甲。"; }
  if (CARDS.gh_silence_expert) { CARDS.gh_silence_expert.deathrattle = { type: "damageRandomEnemy", amount: 3 }; CARDS.gh_silence_expert.text = "先遣。 余响：对随机敌方目标造成 3 点伤害。"; }

  if (CARDS.verious) { CARDS.verious.deathrattle = { type: "healHero", amount: 5 }; CARDS.verious.text = "登场：抽 1 张牌。 余响：恢复你的领袖 5 点生命。"; }
  if (CARDS.eisenhut_newmoney) { CARDS.eisenhut_newmoney.deathrattle = { type: "armor", amount: 2 }; CARDS.eisenhut_newmoney.text = "余响：获得 2 点护甲。"; }

  if (CARDS.smoke_screen) { CARDS.smoke_screen.spell = { type: "drawIfSpellPlayed", draw: 2 }; CARDS.smoke_screen.text = "抽 2 张牌；若你本回合已施放战术牌，再抽 1 张。"; }
  if (CARDS.north_trail) { CARDS.north_trail.target = "enemy"; CARDS.north_trail.spell = { type: "freezeDraw", draw: 2 }; CARDS.north_trail.text = "冻结一个敌方随从；抽 2 张牌。"; }
  if (CARDS.xh_blood_curse) { CARDS.xh_blood_curse.spell = { type: "drawIfEnemyNoMinions", draw: 2 }; CARDS.xh_blood_curse.text = "抽 2 张牌；若敌方没有随从，再抽 2 张。"; }
  if (CARDS.ac_grand_library) { CARDS.ac_grand_library.spell = { type: "drawIfSpellPlayed", draw: 3 }; CARDS.ac_grand_library.text = "抽 3 张牌；若你本回合已施放战术牌，再抽 1 张。"; }
  if (CARDS.smuggler_ship) { CARDS.smuggler_ship.target = "enemy"; CARDS.smuggler_ship.spell = { type: "freezeDraw", draw: 3 }; CARDS.smuggler_ship.text = "冻结一个敌方随从；抽 3 张牌。"; }
  if (CARDS.coordinator_order) { CARDS.coordinator_order.spell = { type: "healHeroDraw", heal: 4, draw: 1 }; CARDS.coordinator_order.text = "恢复你的领袖 4 点生命；抽 1 张牌。" }

  if (CARDS.smoke_screen) { CARDS.smoke_screen.spell = { type: "drawIfSpellPlayed", draw: 3 }; CARDS.smoke_screen.text = "抽 3 张牌；若你本回合已施放战术牌，再抽 1 张。"; }
  if (CARDS.smuggler_ship) { CARDS.smuggler_ship.spell = { type: "freezeDraw", draw: 4 }; CARDS.smuggler_ship.text = "冻结一个敌方随从；抽 4 张牌。"; }
  if (CARDS.snow_aurora) { CARDS.snow_aurora.spell = { type: "freezeDraw", draw: 3 }; CARDS.snow_aurora.text = "冻结一个敌方随从；抽 3 张牌。"; }

  if (CARDS.ac_grand_library) { CARDS.ac_grand_library.spell = { type: "drawIfSpellPlayed", draw: 4 }; CARDS.ac_grand_library.text = "抽 4 张牌；若你本回合已施放战术牌，再抽 1 张。"; }
  if (CARDS.snow_aurora) { CARDS.snow_aurora.spell = { type: "freezeDraw", draw: 5 }; CARDS.snow_aurora.text = "冻结一个敌方随从；抽 5 张牌。"; }

  if (CARDS.coordination) { CARDS.coordination.spell = { type: "nextTurnMana", amount: 2 }; CARDS.coordination.text = "下回合开始时获得 2 点行动力。"; }
  if (CARDS.levy) { CARDS.levy.spell = { type: "rampSpell", amount: 1 }; CARDS.levy.text = "本回合获得 1 点行动力。"; }
  if (CARDS.mobilize) { CARDS.mobilize.spell = { type: "gainManaNowNext", mana: 1, next: 1 }; CARDS.mobilize.text = "本回合获得 1 点行动力；下回合开始再获得 1 点。"; }
  if (CARDS.world_map) { CARDS.world_map.spell = { type: "loanDraw", draw: 2, penalty: 1 }; CARDS.world_map.text = "抽 2 张牌；下回合开始时行动力 -1。"; }
  if (CARDS.resonance) { CARDS.resonance.spell = { type: "freezeDraw", draw: 1 }; CARDS.resonance.text = "冻结一个敌方随从；抽 1 张牌。"; }
  if (CARDS.old_compass) { CARDS.old_compass.spell = { type: "freezeArmor", armor: 2 }; CARDS.old_compass.text = "冻结一个敌方随从；获得 2 点护甲。"; }
  if (CARDS.snow_frost_veil) { CARDS.snow_frost_veil.spell = { type: "freezeDraw", draw: 2 }; CARDS.snow_frost_veil.text = "冻结一个敌方随从；抽 2 张牌。"; }
  if (CARDS.debate) { CARDS.debate.spell = { type: "damageFreeze", amount: 1 }; CARDS.debate.text = "对一个敌方随从造成 1 点伤害，并冻结它。"; }
  if (CARDS.blood_pact) { CARDS.blood_pact.spell = { type: "damage", amount: 2 }; CARDS.blood_pact.text = "对一个敌方随从造成 2 点伤害。"; }
  if (CARDS.vein_siphon) { CARDS.vein_siphon.spell = { type: "damage", amount: 3 }; CARDS.vein_siphon.text = "对一个敌方随从造成 3 点伤害。"; }
  if (CARDS.snow_blizzard) { CARDS.snow_blizzard.spell = { type: "damageFreeze", amount: 2 }; CARDS.snow_blizzard.text = "对所有敌方随从造成 2 点伤害，并冻结它们。"; }

  if (CARDS.vein_siphon) { CARDS.vein_siphon.spell = { type: "damage", amount: 4 }; CARDS.vein_siphon.text = "对一个敌方随从造成 4 点伤害。"; }
  if (CARDS.debate) { CARDS.debate.spell = { type: "damageFreeze", amount: 2 }; CARDS.debate.text = "对一个敌方随从造成 2 点伤害，并冻结它。"; }
  if (CARDS.blood_pact) { CARDS.blood_pact.spell = { type: "damage", amount: 3 }; CARDS.blood_pact.text = "对一个敌方随从造成 3 点伤害。"; }
  if (CARDS.snow_blizzard) { CARDS.snow_blizzard.spell = { type: "damageAllFreeze", amount: 2 }; CARDS.snow_blizzard.text = "对所有敌方随从造成 2 点伤害，并冻结它们。"; }
  if (CARDS.north_trail) { CARDS.north_trail.spell = { type: "freezeDraw", draw: 3 }; CARDS.north_trail.text = "冻结一个敌方随从；抽 3 张牌。"; }

  if (CARDS.ac_final_proof) { CARDS.ac_final_proof.spell = { type: "damageFreeze", amount: 3 }; CARDS.ac_final_proof.text = "对一个敌方随从造成 3 点伤害，并冻结它。"; }
  if (CARDS.snow_last_snow) { CARDS.snow_last_snow.spell = { type: "freezeDraw", draw: 4 }; CARDS.snow_last_snow.text = "冻结所有敌方随从；抽 4 张牌。核心：冻结控场。"; }

  if (CARDS.double_formula) { CARDS.double_formula.spell = { type: "damageFreeze", amount: 4 }; CARDS.double_formula.text = "对一个敌方随从造成 4 点伤害，并冻结它。"; }
  if (CARDS.smuggler_ship) { CARDS.smuggler_ship.spell = { type: "freezeDraw", draw: 5 }; CARDS.smuggler_ship.text = "冻结一个敌方随从；抽 5 张牌。"; }

  if (CARDS.snow_aurora) { CARDS.snow_aurora.spell = { type: "freezeDraw", draw: 6 }; CARDS.snow_aurora.text = "冻结一个敌方随从；抽 6 张牌。"; }

  // Equipment flavor pass: duplicate equipment templates become distinct class relics.
  const EQUIP_FLAVOR = {
    ksetra_beacon_item: [{ health: 1 }, "你的所有友方随从获得 +1 生命。"],
    beast_hide_armor: [{ attack: 1, health: 1 }, "你的所有友方随从获得 +1/+1。"],
    house_longsword: [{ health: 2 }, "你的所有友方随从获得 +2 生命。"],
    ledger_paperknife: [{ attack: 1, spellDraw: 1 }, "你的所有友方随从获得 +1 攻击；施放战术后抽 1 张牌。"],
    anvil_bracer: [{ attack: 1 }, "你的所有友方随从获得 +1 攻击。"],
    lt_tide_totem: [{ health: 1, armorTurn: 1 }, "你的所有友方随从获得 +1 生命；回合开始时获得 1 点护甲。"],
    armor_forge: [{ armorTurn: 2 }, "你的回合开始时获得 2 点护甲。"],
    floating_anchor: [{ healTurn: 1 }, "你的回合开始时恢复 1 点生命。"],
    border_lance: [{ armorTurn: 1, health: 1 }, "你的回合开始时获得 1 点护甲；友方随从获得 +1 生命。"],
    lt_tide_bell: [{ armorTurn: 1, spellDraw: 1 }, "你的回合开始时获得 1 点护甲；施放战术后抽 1 张牌。"],
    snow_frostplate: [{ armorTurn: 1, healTurn: 1 }, "你的回合开始时获得 1 点护甲并恢复 1 点生命。"],
    tide_ward_bracer: [{ health: 1, healTurn: 1 }, "友方随从获得 +1 生命；回合开始时恢复 1 点生命。"],
    bloodbone_pauldron: [{ health: 1, attack: 1 }, "友方随从获得 +1/+1。"],
    snow_capital_lamp: [{ health: 1, armorTurn: 1 }, "友方随从获得 +1 生命；回合开始时获得 1 点护甲。"],
    five_department_badge: [{ healTurn: 1, spellDraw: 1 }, "回合开始时恢复 1 点生命；施放战术后抽 1 张牌。"],
    bloodmoon_bone_ring: [{ healTurn: 1, attack: 1 }, "回合开始时恢复 1 点生命；友方随从获得 +1 攻击。"],
    world_map_item: [{ healTurn: 1, armorTurn: 1 }, "回合开始时恢复 1 点生命并获得 1 点护甲。"],
    frostweave_cloak: [{ spellDraw: 1 }, "每当你施放战术牌，抽 1 张牌。"],
    bone_fang_blade: [{ healTurn: 2 }, "你的回合开始时恢复 2 点生命。"],
    white_reef_lamp_oil: [{ healTurn: 1, health: 1 }, "回合开始时恢复 1 点生命；友方随从获得 +1 生命。"],
    snow_hourglass: [{ healTurn: 1, armorTurn: 1 }, "回合开始时恢复 1 点生命并获得 1 点护甲。"],
    whitefrost_bell: [{ health: 1, spellDraw: 1 }, "友方随从获得 +1 生命；施放战术后抽 1 张牌。"],
    gambler_dice: [{ health: 1, healTurn: 1 }, "友方随从获得 +1 生命；回合开始时恢复 1 点生命。"],
    lt_brood_armor: [{ health: 1, attack: 1 }, "友方随从获得 +1/+1。"],
    ministry_map: [{ armorTurn: 2, spellDraw: 1 }, "回合开始时获得 2 点护甲；施放战术后抽 1 张牌。"],
    sky_ship_ticket: [{ armorTurn: 1, healTurn: 1 }, "回合开始时获得 1 点护甲并恢复 1 点生命。"],
    academy_inkwell: [{ armorTurn: 1, spellDraw: 2 }, "回合开始时获得 1 点护甲；施放战术后抽 2 张牌。"],
    gh_ledger_chain: [{ armorTurn: 1, attack: 1 }, "回合开始时获得 1 点护甲；友方随从获得 +1 攻击。"],
    brokenline_dagger: [{ spellDraw: 1, attack: 1 }, "施放战术后抽 1 张牌；友方随从获得 +1 攻击。"],
    fog_harbor_ticket: [{ spellDraw: 1, health: 1 }, "施放战术后抽 1 张牌；友方随从获得 +1 生命。"],
    snow_iceblade: [{ spellDraw: 1, armorTurn: 1 }, "施放战术后抽 1 张牌；回合开始时获得 1 点护甲。"],
    snow_tundrabracer: [{ healTurn: 2 }, "你的回合开始时恢复 2 点生命。"],
    snow_ember: [{ healTurn: 2, spellDraw: 1 }, "回合开始时恢复 2 点生命；施放战术后抽 1 张牌。"],
    frost_prism: [{ healTurn: 1, spellDraw: 1 }, "回合开始时恢复 1 点生命；施放战术后抽 1 张牌。"],
    snow_iceblade: [{ spellDraw: 1, armorTurn: 1 }, "施放战术后抽 1 张牌；回合开始时获得 1 点护甲。"],
    spell_codex: [{ spellDraw: 1 }, "每当你施放战术牌，抽 1 张牌。"],
    frost_prism: [{ healTurn: 1, spellDraw: 1 }, "回合开始时恢复 1 点生命；施放战术后抽 1 张牌。"],
    vein_heart: [{ healTurn: 1, health: 1 }, "友方随从获得 +1 生命；回合开始时恢复 1 点生命。"],
    gh_venom_vial: [{ attack: 1, spellDraw: 1 }, "友方随从获得 +1 攻击；施放战术后抽 1 张牌。"],
    republic_seal: [{ health: 1, armorTurn: 1 }, "友方随从获得 +1 生命；回合开始时获得 1 点护甲。"],
    blood_scythe: [{ attack: 1, healTurn: 1 }, "友方随从获得 +1 攻击；回合开始时恢复 1 点生命。"],
    powder_engine: [{ attack: 1, armorTurn: 1 }, "友方随从获得 +1 攻击；回合开始时获得 1 点护甲。"],
    formation_standard: [{ health: 1, armorTurn: 1 }, "友方随从获得 +1 生命；回合开始时获得 1 点护甲。"],
    iron_banner: [{ health: 1, attack: 1 }, "友方随从获得 +1/+1。"],
    gh_bounty_board: [{ attack: 1, healTurn: 1 }, "友方随从获得 +1 攻击；回合开始时恢复 1 点生命。"],
    armor_forge: [{ armorTurn: 2 }, "你的回合开始时获得 2 点护甲。"],
    blood_censer: [{ healTurn: 2 }, "你的回合开始时恢复 2 点生命。"],
    wanderer_charm: [{ health: 1, healTurn: 1 }, "友方随从获得 +1 生命；回合开始时恢复 1 点生命。"],
    snow_ember: [{ healTurn: 2, spellDraw: 1 }, "回合开始时恢复 2 点生命；施放战术后抽 1 张牌。"]
  };
  for (const [id, [aura, text]] of Object.entries(EQUIP_FLAVOR)) { const c = CARDS[id]; if (!c) continue; c.equipAura = aura; c.text = "装备（持续生效）：" + text; }

  if (CARDS.house_longsword) { CARDS.house_longsword.equipAura = { attack: 1, health: 1 }; CARDS.house_longsword.text = "装备（持续生效）：你的所有友方随从获得 +1/+1。"; }
  if (CARDS.formation_standard) { delete CARDS.formation_standard.equipAura; CARDS.formation_standard.text = "装备（持续生效）：阵型专用装备，重放时不重复叠加。"; }

  if (CARDS.vein_heart) { CARDS.vein_heart.equipAura = { healTurn: 2 }; CARDS.vein_heart.text = "装备（持续生效）：你的回合开始时恢复 2 点生命。"; }
  if (CARDS.frostweave_cloak) { CARDS.frostweave_cloak.equipAura = { armorTurn: 1, spellDraw: 1 }; CARDS.frostweave_cloak.text = "装备（持续生效）：回合开始时获得 1 点护甲；施放战术后抽 1 张牌。"; }
  if (CARDS.blood_censer) { CARDS.blood_censer.equipAura = { healTurn: 1, attack: 1 }; CARDS.blood_censer.text = "装备（持续生效）：回合开始时恢复 1 点生命；友方随从获得 +1 攻击。"; }
  if (CARDS.wanderer_charm) { CARDS.wanderer_charm.equipAura = { health: 2 }; CARDS.wanderer_charm.text = "装备（持续生效）：你的所有友方随从获得 +2 生命。"; }

  if (CARDS.bloodmoon_bone_ring) { CARDS.bloodmoon_bone_ring.equipAura = { healTurn: 2, attack: 1 }; CARDS.bloodmoon_bone_ring.text = "装备（持续生效）：回合开始时恢复 2 点生命；友方随从获得 +1 攻击。"; }

  // Neutral identity pass: neutral cards stop sharing class scripts.
  (function neutralIdentity() {
    const sig = (c) => JSON.stringify({ type: c.type, keywords: (c.keywords || []).slice().sort(), battlecry: c.battlecry || null, passive: c.passive || null, deathrattle: c.deathrattle || null, formation: c.formation || null, spell: c.spell || null, debt: c.debt || null, excavate: c.excavate == null ? null : c.excavate, eq: c.type === "equipment" ? c.text : null });
    const cards = Object.values(CARDS).filter(c => !c.token && !c.disabled && !c.experimental);
    const groups = new Map(); for (const c of cards) { const k = sig(c); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); }
    const neutralForms = [ [{attack:1,health:1},"+1/+1"], [{taunt:true,health:1},"+0/+1 和守备"], [{rush:true,attack:1},"+1 攻击和先遣"], [{lifesteal:true,health:1},"+0/+1 和血偿"], [{reborn:true},"回潮"], [{stealth:true,attack:1},"+1 攻击和隐匿"], [{windfury:true},"连携"], [{attack:2},"+2 攻击"], [{health:2},"+0/+2"], [{taunt:true},"守备"], [{rush:true},"先遣"], [{health:1},"+0/+1"] ];
    let n = 0;
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      for (const c of group) {
        if (c.faction !== "neutral") continue;
        n++;
        if (c.type === "minion") {
          c.keywords = Array.from(new Set([...(c.keywords || []), "deathrattle"]));
          const kind = n % 3;
          if (kind === 0) { c.deathrattle = { type: "draw", amount: 1 }; c.text = (c.text || "").replace(/余响：[^。]+。/g, "") + " 余响：抽 1 张牌。"; }
          else if (kind === 1) { c.deathrattle = { type: "healHero", amount: 1 + (n % 3) }; c.text = (c.text || "").replace(/余响：[^。]+。/g, "") + " 余响：恢复你的领袖 " + (1 + (n % 3)) + " 点生命。"; }
          else { c.deathrattle = { type: "armor", amount: 1 + (n % 4) }; c.text = (c.text || "").replace(/余响：[^。]+。/g, "") + " 余响：获得 " + (1 + (n % 4)) + " 点护甲。"; }
        } else if (c.type === "spell") {
          c.target = "none"; c.spell = { type: "draw", amount: 1 }; c.text = "抽 1 张牌；商队为你多带 1 张货。";
        } else if (c.type === "formation") {
          const [f,label] = neutralForms[n % neutralForms.length]; c.formation = f; c.text = "该阵位友方随从固定获得" + label + "。";
        } else if (c.type === "equipment") {
          c.equipAura = { attack: 1, health: 1 }; c.text = "装备（持续生效）：你的所有友方随从获得 +1/+1。";
        }
      }
    }
  })();

  const NEUTRAL_FIX = {
    archive_scribe: { deathrattle: { type: "draw", amount: 2 } },
    iron_engineer: { deathrattle: { type: "armor", amount: 4 } },
    white_reef_keeper: { deathrattle: { type: "draw", amount: 2 } },
    anvil_town_miner: { deathrattle: { type: "armor", amount: 2 } },
    wanderer_charm: { equipAura: { health: 3 }, text: "装备（持续生效）：你的所有友方随从获得 +3 生命。" },
    gambler_dice: { equipAura: { attack: 1 }, text: "装备（持续生效）：你的所有友方随从获得 +1 攻击。" },
    snow_capital_lamp: { equipAura: { armorTurn: 1 }, text: "装备（持续生效）：你的回合开始时获得 1 点护甲。" },
    world_map_item: { equipAura: { healTurn: 1 }, text: "装备（持续生效）：你的回合开始时恢复 1 点生命。" },
    north_hunter: { deathrattle: { type: "healHero", amount: 3 } },
    anvil_town_smith: { deathrattle: { type: "healHero", amount: 1 } },
    white_reef_runner: { deathrattle: { type: "healHero", amount: 3 } },
    losutai_scavenger: { deathrattle: { type: "healHero", amount: 4 } },
    fog_navigator: { deathrattle: { type: "draw", amount: 2 } },
    xh_blood_tax: { deathrattle: { type: "draw", amount: 3 } },
    world_edge: { spell: { type: "draw", amount: 2 }, text: "抽 2 张牌；商队为你多带 1 张货。" },
    gok_lamp_row: { formation: { windfury: true, attack: 1 }, text: "该阵位友方随从固定获得 +1 攻击和连携。" },
    losutai_pool: { formation: { health: 3 }, text: "该阵位友方随从固定获得 +0/+3。" },
    smugglers_dock: { formation: { reborn: true, health: 1 }, text: "该阵位友方随从固定获得 +0/+1 和回潮。" },
    forgotten_gate: { formation: { attack: 2, rush: true }, text: "该阵位友方随从固定获得 +2 攻击和先遣。" }
  };
  for (const [id, patch] of Object.entries(NEUTRAL_FIX)) { const c = CARDS[id]; if (!c) continue; Object.assign(c, patch); if (c.type === "minion") { c.keywords = Array.from(new Set([...(c.keywords || []), "deathrattle"])); c.text = (c.text || "").replace(/余响：[^。]+。/g, "") + " 余响：" + ({draw:"抽 " + (patch.deathrattle.amount) + " 张牌。",armor:"获得 " + (patch.deathrattle.amount) + " 点护甲。",healHero:"恢复你的领袖 " + (patch.deathrattle.amount) + " 点生命。"}[patch.deathrattle.type]); } }

  if (CARDS.gambler_dice) { CARDS.gambler_dice.equipAura = { attack: 1, health: 1 }; CARDS.gambler_dice.text = "装备（持续生效）：你的所有友方随从获得 +1/+1。"; }
  if (CARDS.dark_route) { CARDS.dark_route.spell = { type: "draw", amount: 3 }; CARDS.dark_route.text = "抽 3 张牌。"; }

  const ARMOR_EQUIP_FIX = {
    bone_fang_blade: { equipAura: { healTurn: 1, attack: 1 }, text: "装备（持续生效）：回合开始时恢复 1 点生命；友方随从获得 +1 攻击。" },
    snow_tundrabracer: { equipAura: { healTurn: 1, health: 1 }, text: "装备（持续生效）：回合开始时恢复 1 点生命；友方随从获得 +1 生命。" },
    gh_bounty_board: { equipAura: { attack: 2, healTurn: 1 }, text: "装备（持续生效）：友方随从获得 +2 攻击；回合开始时恢复 1 点生命。" },
    iron_banner: { equipAura: { health: 2 }, text: "装备（持续生效）：你的所有友方随从获得 +2 生命。" },
    bloodbone_pauldron: { equipAura: { attack: 2 }, text: "装备（持续生效）：你的所有友方随从获得 +2 攻击。" },
    lt_brood_armor: { equipAura: { attack: 1, health: 1 }, text: "装备（持续生效）：你的所有友方随从获得 +1/+1。" },
    five_department_badge: { equipAura: { healTurn: 2, spellDraw: 1 }, text: "装备（持续生效）：回合开始时恢复 2 点生命；施放战术后抽 1 张牌。" },
    seven_cities_crest: { equipAura: { armorTurn: 1, health: 1 }, text: "装备（持续生效）：回合开始时获得 1 点护甲；友方随从获得 +1 生命。" },
    house_longsword: { equipAura: { attack: 1, health: 2 }, text: "装备（持续生效）：你的所有友方随从获得 +1/+2。" },
    gambler_dice: { equipAura: { health: 2 }, text: "装备（持续生效）：你的所有友方随从获得 +2 生命。" }
  };
  for (const [id, patch] of Object.entries(ARMOR_EQUIP_FIX)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }
  const ARMOR_MINION_FIX = {
    forge_technician: { deathrattle: { type: "armor", amount: 2 }, text: "余响：获得 2 点护甲。" },
    iron_order_wall: { deathrattle: { type: "armor", amount: 4 }, text: "余响：获得 4 点护甲。" },
    siege_captain: { deathrattle: { type: "armor", amount: 4 }, text: "守备。 余响：获得 4 点护甲。" },
    grain_convoy: { deathrattle: { type: "armor", amount: 5 }, text: "余响：获得 5 点护甲。" },
    eisenhut_newmoney: { deathrattle: { type: "armor", amount: 3 }, text: "余响：获得 3 点护甲。" },
    iron_artillery: { deathrattle: { type: "armor", amount: 1 }, text: "守备。 余响：获得 1 点护甲。" },
    blackmarket_bodyguard: { deathrattle: { type: "damageRandomEnemy", amount: 3 }, text: "余响：对随机敌方目标造成 3 点伤害。" },
    ancient_fortress_scion: { deathrattle: { type: "damageRandomEnemy", amount: 4 }, text: "余响：对随机敌方目标造成 4 点伤害。" }
  };
  for (const [id, patch] of Object.entries(ARMOR_MINION_FIX)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }

  if (CARDS.blood_censer) { CARDS.blood_censer.equipAura = { healTurn: 2, attack: 1 }; CARDS.blood_censer.text = "装备（持续生效）：回合开始时恢复 2 点生命；友方随从获得 +1 攻击。"; }
  if (CARDS.ancient_fortress_scion) { CARDS.ancient_fortress_scion.deathrattle = { type: "damageRandomEnemy", amount: 5 }; CARDS.ancient_fortress_scion.text = "余响：对随机敌方目标造成 5 点伤害。"; }
  if (CARDS.eisenhut_newmoney) { CARDS.eisenhut_newmoney.deathrattle = { type: "armor", amount: 4 }; CARDS.eisenhut_newmoney.text = "余响：获得 4 点护甲。"; }
  if (CARDS.forge_technician) { CARDS.forge_technician.deathrattle = { type: "armor", amount: 3 }; CARDS.forge_technician.text = "余响：获得 3 点护甲。"; }

  if (CARDS.bloodmoon_bone_ring) { CARDS.bloodmoon_bone_ring.equipAura = { healTurn: 3, attack: 1 }; CARDS.bloodmoon_bone_ring.text = "装备（持续生效）：回合开始时恢复 3 点生命；友方随从获得 +1 攻击。"; }
  if (CARDS.eisenhut_newmoney) { CARDS.eisenhut_newmoney.deathrattle = { type: "armor", amount: 5 }; CARDS.eisenhut_newmoney.text = "余响：获得 5 点护甲。"; }



  const FINAL_NEUTRAL = {
    snow_medic: { deathrattle: { type: "draw", amount: 2 }, text: "余响：抽 2 张牌。" },
    vein_medic: { deathrattle: { type: "draw", amount: 3 }, text: "余响：抽 3 张牌。" },
    iron_engineer: { deathrattle: { type: "draw", amount: 4 }, text: "余响：抽 4 张牌。" },
    field_engineer: { deathrattle: { type: "draw", amount: 5 }, text: "守备。 余响：抽 5 张牌。" },
    card_shark: { deathrattle: { type: "draw", amount: 6 }, text: "登场：抽 1 张牌。 余响：抽 6 张牌。" },
    dusk_innkeeper: { deathrattle: { type: "draw", amount: 7 }, text: "登场：抽 1 张牌。 余响：抽 7 张牌。" }
  };
  for (const [id, patch] of Object.entries(FINAL_NEUTRAL)) { const c = CARDS[id]; if (c) Object.assign(c, patch); }
  const FINAL_SNOW_SPELLS = [
    ["dusk_inn", { type: "freeze" }, 1],
    ["mist_bargain", { type: "freezeDraw", draw: 1 }, 1],
    ["reef_signal", { type: "freezeArmor", armor: 1 }, 1],
    ["snow_freeze_touch", { type: "freezeDraw", draw: 2 }, 2],
    ["snow_wind_strike", { type: "freezeDraw", draw: 3 }, 3],
    ["snow_gale", { type: "freezeDraw", draw: 4 }, 4],
    ["snow_ice_wall", { type: "freezeDraw", draw: 5 }, 5],
    ["snow_time_stop", { type: "freezeDraw", draw: 6 }, 6],
    ["snow_wind_step", { type: "freezeDraw", draw: 7 }, 7],
    ["snow_ice_lance", { type: "freezeDraw", draw: 8 }, 8]
  ];
  for (const [id, spell] of FINAL_SNOW_SPELLS) { const c = CARDS[id]; if (!c) continue; c.target = "enemy"; c.spell = spell; c.text = "冻结一个敌方随从；执行雪都战术" + (spell.draw || 1) + "。"; }

  if (CARDS.archive_scribe) { CARDS.archive_scribe.deathrattle = { type: "draw", amount: 3 }; CARDS.archive_scribe.text = "余响：抽 3 张牌。"; }
  if (CARDS.resonance) { CARDS.resonance.spell = { type: "freezeDraw", draw: 2 }; CARDS.resonance.text = "冻结一个敌方随从；抽 2 张牌。"; }
  if (CARDS.snow_ice_wall) { CARDS.snow_ice_wall.spell = { type: "freezeArmor", armor: 5 }; CARDS.snow_ice_wall.text = "冻结一个敌方随从；获得 5 点护甲。"; }
  if (CARDS.snow_wind_strike) { CARDS.snow_wind_strike.spell = { type: "freezeArmor", armor: 3 }; CARDS.snow_wind_strike.text = "冻结一个敌方随从；获得 3 点护甲。"; }
  if (CARDS.snow_freeze_touch) { CARDS.snow_freeze_touch.spell = { type: "freezeArmor", armor: 2 }; CARDS.snow_freeze_touch.text = "冻结一个敌方随从；获得 2 点护甲。"; }
  if (CARDS.snow_gale) { CARDS.snow_gale.spell = { type: "freezeArmor", armor: 4 }; CARDS.snow_gale.text = "冻结一个敌方随从；获得 4 点护甲。"; }
  if (CARDS.snow_time_stop) { CARDS.snow_time_stop.spell = { type: "freezeArmor", armor: 6 }; CARDS.snow_time_stop.text = "冻结一个敌方随从；获得 6 点护甲。"; }
  if (CARDS.dusk_inn) CARDS.dusk_inn.text = "雪都战术·冰封：冻结一个敌方随从。";
  if (CARDS.mist_bargain) CARDS.mist_bargain.text = "雪都战术·抽牌：冻结一个敌方随从；抽 1 张牌。";
  if (CARDS.reef_signal) CARDS.reef_signal.text = "雪都战术·护甲：冻结一个敌方随从；获得 1 点护甲。";

  if (CARDS.resonance) { CARDS.resonance.spell = { type: "freezeDraw", draw: 3 }; CARDS.resonance.text = "冻结一个敌方随从；抽 3 张牌。"; }
  if (CARDS.frost_seal) { CARDS.frost_seal.spell = { type: "freezeArmor", armor: 7 }; CARDS.frost_seal.text = "冻结一个敌方随从；获得 7 点护甲。"; }
  if (CARDS.vein_medic) { CARDS.vein_medic.deathrattle = { type: "draw", amount: 5 }; CARDS.vein_medic.text = "余响：抽 5 张牌。"; }
  if (CARDS.old_compass) { CARDS.old_compass.spell = { type: "freezeArmor", armor: 8 }; CARDS.old_compass.text = "冻结一个敌方随从；获得 8 点护甲。"; }
  if (CARDS.anvil_quench) { CARDS.anvil_quench.spell = { type: "freezeArmor", armor: 9 }; CARDS.anvil_quench.text = "冻结一个敌方随从；获得 9 点护甲。"; }

  if (CARDS.north_trail) { CARDS.north_trail.spell = { type: "freezeArmor", armor: 10 }; CARDS.north_trail.text = "冻结一个敌方随从；获得 10 点护甲。"; }

  if (CARDS.gh_silencer) { CARDS.gh_silencer.target = "enemy"; CARDS.gh_silencer.battlecry = { type: "silence" }; CARDS.gh_silencer.keywords = Array.from(new Set([...(CARDS.gh_silencer.keywords || []), "battlecry"])); CARDS.gh_silencer.text = "登场：沉默一个敌方随从。 余响：获得 6 点护甲。"; }

  // v7 debt rewrite: debt cards go into the opponent deck; drawn debt must be played or punishes.
  (function rewriteDebtCards() {
    const describe = (effect) => {
      if (!effect) return "无额外效果";
      const n = effect.amount || 1;
      if (effect.type === "damageHero") return "受到 " + n + " 点伤害";
      if (effect.type === "discardRandom") return "随机弃 " + n + " 张牌";
      if (effect.type === "blockHeroPower") return "下回合不能使用领袖技能";
      if (effect.type === "draw") return "抽 " + n + " 张牌";
      if (effect.type === "healHero") return "恢复 " + n + " 点生命";
      if (effect.type === "armor") return "获得 " + n + " 点护甲";
      if (effect.type === "summon") return "召唤 " + n + " 个随从";
      return "执行债务效果";
    };
    for (const c of Object.values(CARDS)) {
      if (c.type !== "debt") continue;
      const old = c.debt || {};
      const effect = (old.enemy && old.enemy.effect) || old.effect || { type: "damageHero", amount: 2 };
      const effectAmount = effect.amount || 2;
      const oldPenalty = old.self && old.self.penalty;
      const penalty = oldPenalty && oldPenalty.type === "damageHero"
        ? { type: "damageHero", amount: Math.max(oldPenalty.amount || 0, effectAmount + 2) }
        : { type: "damageHero", amount: Math.max(3, effectAmount + 2) };
      c.cost = 0;
      c.name = String(c.name || "").replace(/^(血债|潮债)/, "债务");
      c.debt = { effect: effect, penalty: penalty };
      c.text = "债务卡。打出后洗入对手牌库。对手抽到后本回合必须打出。打出：" + describe(effect) + "；未打出：回合结束时受到 " + penalty.amount + " 点伤害。";
    }
  })();

  if (CARDS.lt_tide_hunter) CARDS.lt_tide_hunter.name = "债务·潮猎";

  (function uniqueDebtValues() {
    const describe = (effect) => {
      if (!effect) return "无额外效果";
      const n = effect.amount || 1;
      if (effect.type === "damageHero") return "受到 " + n + " 点伤害";
      if (effect.type === "discardRandom") return "随机弃 " + n + " 张牌";
      if (effect.type === "blockHeroPower") return "下回合不能使用领袖技能";
      return "执行债务效果";
    };
    const table = {
      hunt_ritual: ["damageHero", 3, 5],
      xh_bone_hunter: ["blockHeroPower", 1, 5],
      blood_altar: ["damageHero", 1, 3],
      lt_tide_spawn: ["damageHero", 1, 4],
      lt_venom_larva: ["damageHero", 1, 5],
      lt_hatch: ["damageHero", 3, 6],
      lt_tide_pool: ["damageHero", 1, 7],
      monster_command: ["damageHero", 2, 4],
      lt_hatch_guard: ["damageHero", 2, 5],
      lt_venom_fang: ["damageHero", 2, 6],
      lt_reborn_rite: ["damageHero", 2, 7],
      lt_tide_warden: ["damageHero", 2, 8],
      lt_bone_scavenger: ["discardRandom", 1, 3],
      lt_brood_attendant: ["discardRandom", 1, 4],
      lt_tide_hunter: ["discardRandom", 1, 5],
      lt_bone_warlock: ["discardRandom", 1, 6],
      lt_venom_nest: ["discardRandom", 1, 7]
    };
    for (const [id, [type, amount, penalty]] of Object.entries(table)) {
      const c = CARDS[id]; if (!c || c.type !== "debt") continue;
      c.debt = { effect: { type, amount }, penalty: { type: "damageHero", amount: penalty } };
      c.text = "债务卡。打出后洗入对手牌库。对手抽到后本回合必须打出。打出：" + describe(c.debt.effect) + "；未打出：回合结束时受到 " + penalty + " 点伤害。";
    }
  })();

  if (CARDS.xh_bone_hunter) { CARDS.xh_bone_hunter.debt.penalty.amount = 6; CARDS.xh_bone_hunter.text = "债务卡。打出后洗入对手牌库。对手抽到后本回合必须打出。打出：下回合不能使用领袖技能；未打出：回合结束时受到 6 点伤害。"; }

  if (CARDS.xh_alley_blade) { CARDS.xh_alley_blade.debt.penalty.amount = 7; CARDS.xh_alley_blade.text = "债务卡。打出后洗入对手牌库。对手抽到后本回合必须打出。打出：下回合不能使用领袖技能；未打出：回合结束时受到 7 点伤害。"; }

  // v7.1 debt balance: cost 1-3, unique small composite effects, reduced penalties.
  (function rebalanceDebt() {
    const variants = [];
    for (const damage of [1, 2, 3]) for (const discard of [0, 1, 2]) for (const block of [false, true]) for (const armorLoss of [0, 1]) {
      if (!damage && !discard && !block && !armorLoss) continue;
      const severity = damage + discard * 1.5 + (block ? 1 : 0) + armorLoss * 0.5;
      variants.push({ damage, discard, block, armorLoss, severity });
    }
    variants.sort((a,b) => a.severity - b.severity || a.damage - b.damage || a.discard - b.discard || Number(a.block) - Number(b.block) || a.armorLoss - b.armorLoss);
    const debts = Object.values(CARDS).filter(c => c.type === "debt").sort((a,b) => a.faction.localeCompare(b.faction) || a.id.localeCompare(b.id));
    debts.forEach((c, i) => {
      const v = variants[i % variants.length];
      const effect = { type: "debt" };
      if (v.damage) effect.damage = v.damage;
      if (v.discard) effect.discard = v.discard;
      if (v.block) effect.block = true;
      if (v.armorLoss) effect.armorLoss = v.armorLoss;
      const parts = [];
      if (v.damage) parts.push("受到 " + v.damage + " 点伤害");
      if (v.armorLoss) parts.push("失去 " + v.armorLoss + " 点护甲");
      if (v.discard) parts.push("随机弃 " + v.discard + " 张牌");
      if (v.block) parts.push("下回合不能使用领袖技能");
      const penalty = Math.min(5, Math.max(2, Math.round(v.severity) + 2));
      c.cost = v.severity >= 5 ? 3 : v.severity >= 2.5 ? 2 : 1;
      c.debt = { effect: effect, penalty: { type: "damageHero", amount: penalty } };
      c.text = "债务卡。打出后洗入对手牌库。对手抽到后本回合必须打出。打出：" + parts.join("，") + "；未打出：回合结束时受到 " + penalty + " 点伤害。";
    });
  })();

  // v8 debt task model: card is inert in hand; playing it starts a one-turn task.
  (function debtTaskCards() {
    const pool = [
      { type: "summon", amount: 1, label: "摆放 1 个随从" },
      { type: "spell", amount: 1, label: "使用 1 张战术卡" },
      { type: "noCards", amount: 0, label: "不能再使用卡牌" },
      { type: "attack", amount: 1, label: "发起 1 次攻击" },
      { type: "playCards", amount: 2, label: "再打出 2 张牌" },
      { type: "noSummon", amount: 0, label: "不能再摆放随从" },
      { type: "noAttack", amount: 0, label: "不能攻击" },
      { type: "summon", amount: 2, label: "摆放 2 个随从" },
      { type: "spell", amount: 2, label: "使用 2 张战术卡" },
      { type: "playCards", amount: 1, label: "再打出 1 张牌" },
      { type: "noSpell", amount: 0, label: "不能再使用战术卡" },
      { type: "playCards", amount: 3, label: "再打出 3 张牌" },
      { type: "summon", amount: 3, label: "摆放 3 个随从" },
      { type: "attack", amount: 2, label: "发起 2 次攻击" },
      { type: "spell", amount: 3, label: "使用 3 张战术卡" },
      { type: "playCards", amount: 2, label: "再打出 2 张牌" }
    ];
    const debts = Object.values(CARDS).filter(c => c.type === "debt").sort((a,b) => a.faction.localeCompare(b.faction) || a.id.localeCompare(b.id));
    debts.forEach((c, i) => {
      const spec = pool[i % pool.length];
      const penalty = 2 + (i % 3);
      const cost = (spec.type === "noCards" || spec.type === "noSummon" || spec.type === "noAttack" || spec.type === "noSpell") ? 1 : 2;
      c.cost = cost;
      c.debt = { task: { type: spec.type, amount: spec.amount || 0, label: spec.label }, penalty: { type: "damageHero", amount: penalty } };
      c.text = "债务卡。打出后洗入对手牌库。对手不打出时只占手牌。对手打出此牌后，本回合必须" + spec.label + "；完成免罚，未完成回合结束受到 " + penalty + " 点伤害。";
    });
  })();

  for (const c of Object.values(CARDS)) {
    if (c.type !== "debt" || !c.debt || !c.debt.task) continue;
    const t = c.debt.task;
    const negative = ["noCards", "noSummon", "noAttack", "noSpell"].includes(t.type);
    const clause = negative ? "本回合" + t.label : "本回合必须" + t.label;
    c.text = "债务卡。打出后洗入对手牌库。对手不打出时只占手牌。对手打出此牌后，" + clause + "；完成免罚，未完成回合结束受到 " + c.debt.penalty.amount + " 点伤害。";
  }

  // 修复：cleanLegacy 清掉了卡面仍明确写出的逆脉消耗。
  if (CARDS.stabilize) CARDS.stabilize.reflux = 2;
  if (CARDS.return_tide) CARDS.return_tide.reflux = 2;

  // 雪狐哨兵余响只能召唤一次；召唤物不能再带同名余响，避免无限递归。
  Object.assign(CARDS, {
    snow_fox_sentry_echo: {
      id: "snow_fox_sentry_echo", name: "雪狐哨兵", faction: "snow", type: "minion",
      token: true, cost: 0, attack: 1, health: 3, rarity: "common", keywords: [], target: "none",
      text: "雪狐哨兵的残影。"
    }
  });
  if (CARDS.snow_fox_sentry) CARDS.snow_fox_sentry.deathrattle = { type: "summon", token: "snow_fox_sentry_echo" };
  if (CARDS.snow_fox_guard) CARDS.snow_fox_guard.deathrattle = { type: "summon", token: "snow_fox_sentry_echo" };

  // 亡语恢复生命必须写清数值；只修文案，不改任何回复量。
  for (const c of Object.values(CARDS)) {
    if (!c.deathrattle || c.deathrattle.type !== "healHero" || !c.text) continue;
    const amount = c.deathrattle.amount || 1;
    c.text = c.text.replace(/余响：[^。]*?恢复[^。]*?。/u, "余响：恢复你的领袖 " + amount + " 点生命。");
  }

  // ===== 2026-10-22 用户指定：英雄/学院/衍生物费用 =====
  Object.assign(HEROES.marta, { hp: 30 });
  Object.assign(HEROES.karna, { hp: 34 });
  Object.assign(HEROES.wolfram, { hp: 28 });
  Object.assign(HEROES.otto, { hp: 28 });
  Object.assign(HEROES.karna.power, { text: "主动：对自己造成 2 点伤害，抽 1 张牌。" });
  Object.assign(HEROES.wolfram.power, {
    name: "整编", cost: 2, target: "none",
    text: "主动：将手牌中所有牌变为行动力消耗 +1 的同阵营牌，最高 10 费。"
  });
  if (CARDS.venom_attendant) CARDS.venom_attendant.text = "登场：若你本回合已经使用过其他牌，抽 1 张牌。 余响：获得 7 点护甲。";
  // 学院补一张稳定的三费抽二法术。
  Object.assign(CARDS.ac_arcane_flood, {
    cost: 3, target: "none", spell: { type: "draw", amount: 2 }, text: "抽 2 张牌。"
  });
  // 衍生物不再是 0 费白嫖：费用按身材计算，便于回手后重新打出。
  for (const c of Object.values(CARDS)) {
    if (!c.token) continue;
    c.cost = Math.max(1, c.attack || 0, c.health || 0);
  }

  // 官方预组同样遵守 2/6/10 品级上限：保留前两张传说与全部装备/阵型，其余高品级用普通卡补足。
  (function rebuildPresetDecksWithinRarityCaps() {
    const caps = DECK_RARITY_LIMITS;
    const rank = { legendary: 3, epic: 2, rare: 1, common: 0 };
    for (const faction of FACTION_IDS) {
      if (!DECKS[faction]) continue;
      const source = DECKS[faction].slice(0, 30);
      const protectedCard = (id) => {
        const d = CARDS[id];
        return !!(d && (d.type === "formation" || d.type === "equipment" || d.type === "relic"));
      };
      const kept = [];
      const rarityCounts = { common: 0, rare: 0, epic: 0, legendary: 0 };
      for (const id of source) {
        const d = CARDS[id];
        if (!d) continue;
        if (protectedCard(id)) {
          kept.push(id);
          if (rarityCounts[d.rarity] != null) rarityCounts[d.rarity] += 1;
        }
      }
      for (const id of source) {
        if (protectedCard(id)) continue;
        const d = CARDS[id];
        if (!d) continue;
        const cap = caps[d.rarity];
        if (cap == null || rarityCounts[d.rarity] < cap) {
          kept.push(id);
          if (rarityCounts[d.rarity] != null) rarityCounts[d.rarity] += 1;
        }
      }
      const counts = {};
      for (const id of kept) counts[id] = (counts[id] || 0) + 1;
      const commonPool = Object.keys(CARDS).filter(id => {
        const d = CARDS[id];
        return d && !d.token && !d.disabled && !d.experimental && !d.easterEgg && d.rarity === "common" && d.type !== "formation" && d.type !== "equipment" && d.type !== "relic" && (d.faction === faction || d.faction === "neutral");
      }).sort((a, b) => (CARDS[a].cost || 0) - (CARDS[b].cost || 0) || a.localeCompare(b));
      let ci = 0;
      while (kept.length < 30) {
        let added = false;
        for (let pass = 0; pass < commonPool.length && kept.length < 30; pass++) {
          const id = commonPool[ci % commonPool.length];
          ci++;
          if ((counts[id] || 0) >= maxCopies(CARDS[id])) continue;
          kept.push(id);
          counts[id] = (counts[id] || 0) + 1;
          added = true;
        }
        if (!added) break;
      }
      DECKS[faction] = kept.slice(0, 30);
    }
  })();

  // ===== 2026-10-22 第三批用户改动 =====
  // 灰港新卡。
  Object.assign(CARDS, {
    gh_medic: {
      id: "gh_medic", name: "灰港医师", faction: "greyharbor", type: "minion",
      cost: 5, attack: 3, health: 3, rarity: "epic", keywords: ["battlecry"],
      target: "none", battlecry: { type: "healHero", amount: 8 },
      text: "登场：恢复你的领袖 8 点生命。",
      flavor: "在灰港，救命的账单通常比命还贵。"
    }
  });
  // 赏金王：去掉被动，改成即时的清场/斩杀终端。
  if (CARDS.gh_bounty_king) {
    Object.assign(CARDS.gh_bounty_king, {
      keywords: ["battlecry"], target: "none", passive: null,
      battlecry: { type: "bountyKingTerminal", damage: 4, face: 8 },
      text: "登场：消灭所有悬赏名单上的敌方随从；每消灭一个，对敌方领袖造成 4 点伤害。若没有悬赏目标，对敌方领袖造成 8 点伤害。"
    });
  }
  // 帝国冲锋大面积删除，并削弱被删冲锋的随从；克劳斯保留冲锋。
  const empireChargeRemoved = ["powder_boy", "ironclad", "iron_mechanic", "overload_gunner", "powder_marshal", "karl_schwarz", "iron_artillery"];
  for (const id of empireChargeRemoved) {
    const c = CARDS[id];
    if (!c) continue;
    c.keywords = (c.keywords || []).filter(k => k !== "charge");
    c.text = (c.text || "").replace(/先遣。\s*/g, "").trim();
    if (!c.text) c.text = "普通随从。";
    c.attack = Math.max(1, (c.attack || 1) - 1);
  }
  // 先遣（rush）不能攻击领袖；作为补偿，所有带 rush 的随从 +1/+1。
  for (const c of Object.values(CARDS)) {
    if (c.type !== "minion" || !(c.keywords || []).includes("rush")) continue;
    c.attack = (c.attack || 0) + 1;
    c.health = (c.health || 0) + 1;
    if (c.maxHealth != null) c.maxHealth += 1;
  }
  // 衍生物费用最后重算，确保先遣增强后的身材也计入。
  for (const c of Object.values(CARDS)) {
    if (!c.token) continue;
    c.cost = Math.max(1, c.attack || 0, c.health || 0);
  }

  // ===== 2026-10-23 数值平衡整体改版 Phase 1 =====
  // 先修数据缺陷，再用预组结构、英雄生命与少量卡牌数值拉平八阵营。
  (() => {
    const set = (id, fn) => { const c = CARDS[id]; if (c) fn(c); };
    const remove = (f, id, n = 99) => { const d = DECKS[f]; for (let k = 0; k < n; k++) { const i = d.lastIndexOf(id); if (i < 0) break; d.splice(i, 1); } };
    const add = (f, id, n = 1) => { const d = DECKS[f]; const max = maxCopies(CARDS[id]); for (let k = 0; k < n; k++) { if (!CARDS[id] || d.filter(x => x === id).length >= max) break; d.push(id); } };

    // 数据缺陷：装备没有效果、文本与效果不一致、target 误挂敌方。
    set('formation_standard', c => { c.equipAura = { health: 1 }; c.text = '装备（持续生效）：你的所有友方随从获得 +1 生命。'; });
    set('forge_technician', c => { c.keywords = ['battlecry', 'deathrattle']; c.text = '登场：获得 3 点护甲。余响：获得 3 点护甲。'; });
    set('siege_captain', c => { c.keywords = ['battlecry', 'deathrattle', 'taunt']; c.text = '守备。登场：对所有敌方随从造成 1 点伤害。余响：获得 4 点护甲。'; });
    set('grain_convoy', c => { c.keywords = ['battlecry', 'deathrattle']; c.text = '登场：恢复你的领袖 2 点生命。余响：获得 5 点护甲。'; });
    set('empire_guard', c => { c.keywords = ['battlecry']; c.battlecry = { type: 'armor', amount: 1 }; c.text = '登场：获得 1 点护甲。'; });
    set('iron_artillery', c => { c.keywords = ['battlecry', 'deathrattle', 'taunt']; c.text = '守备。登场：对一个敌方随从造成等同于你护甲的伤害。余响：获得 1 点护甲。'; });
    set('gh_silence_expert', c => { c.keywords = ['battlecry', 'deathrattle']; c.text = '登场：若目标已在悬赏名单上，沉默它并抽 1 张牌。余响：对随机敌方目标造成 3 点伤害。'; });
    set('gh_silencer', c => { c.keywords = ['battlecry', 'deathrattle']; c.deathrattle = { type: 'armor', amount: 6 }; c.text = '登场：沉默一个敌方随从。余响：获得 6 点护甲。'; });
    set('forge_engineer', c => { c.text = '登场：获得 2 点护甲。余响：获得 2 点护甲。'; });
    for (const id of ['arcane_scribe', 'reflux_apprentice', 'ac_grand_library', 'levy', 'frost_line_guard', 'gok_lamp']) set(id, c => { c.target = 'none'; });
    set('ac_grand_library', c => { c.spell = { type: 'drawIfSpellPlayed', draw: 4, bonus: 1 }; });
    set('smoke_screen', c => { c.spell = { type: 'drawIfSpellPlayed', draw: 3, bonus: 1 }; });
    set('ac_knowledge_burst', c => { c.spell = { type: 'drawIfSpellPlayed', draw: 1, bonus: 2 }; });
    set('ac_spell_copy', c => { c.name = '法术残响'; c.cost = 3; c.spell = { type: 'healHeroDraw', amount: 3, draw: 1 }; c.text = '恢复你的领袖 3 点生命；抽 1 张牌。'; });
    set('doorman', c => { c.text = '登场：抽 1 张牌。'; });
    set('levy', c => { c.cost = 1; c.spell = { type: 'rampSpell', amount: 2 }; c.text = '本回合获得 2 点行动力。'; });

    // 学院：高费陷阱拉低费用，补充低费站场。
    set('ac_absolute_theory', c => { c.cost = 6; });
    set('pure_theorist', c => { c.cost = 6; });
    set('magic_lecturer', c => { c.cost = 5; });
    set('ac_grand_library', c => { c.cost = 6; });
    set('ac_knowledge_burst', c => { c.cost = 5; });

  Object.assign(HEROES, {
    balaena: { id: "balaena", name: "贝莱娜", short: "贝莱娜", faction: "losutai", hp: 32, armor: 0, art: "orlicas", quote: "潮来了，聚落就活；潮走了，就等。", power: { name: "潮生", cost: 2, target: "none", text: "召唤一个 1/1 洛斯汰魔物；若你控制其他魔物，抽 1 张牌。" } },
    sernach: { id: "sernach", name: "熙尔娜·张", short: "熙尔娜", faction: "snow", hp: 30, armor: 0, art: "miyuki", quote: "雪落尽了，雪都就醒了。", power: { name: "凝时", cost: 2, target: "enemy", text: "冻结一个敌方随从；若它已经被冻结，抽 1 张牌。" } }
  });
  for (const id of ["lanxi","lanzhou","losutai_hunter","monster_summon","losutai_matriarch","venom_fang","blood_altar","tide_colossus","devourer","brood_matron","blood_pool","monster_overseer","pressure_warlock","tribal_shaman","reborn_rite","monster_command","losutai_awakened","monster_nest","blood_servant","blood_corpse_collector"]) if (CARDS[id]) CARDS[id].faction = "losutai";
  for (const id of ["samuel","nina","frost_seal","frost_professor","frost_scribe","frost_line_guard","frost_archivist","frost_page","white_frost_hall","echo_adept"]) if (CARDS[id]) CARDS[id].faction = "snow";
  if (CARDS.gh_venom_vial) CARDS.gh_venom_vial.faction = "losutai";
  if (CARDS.frost_prism) CARDS.frost_prism.faction = "snow";
    // 英雄生命：西昭、灰港、雪境降温；学院、帝国补足。
    HEROES[FACTIONS.xizhao.hero].hp = 22;
    HEROES[FACTIONS.academy.hero].hp = 40;
    HEROES[FACTIONS.empire.hero].hp = 35;
    HEROES[FACTIONS.greyharbor.hero].hp = 25;
    HEROES[FACTIONS.pus.hero].hp = 35;
    HEROES[FACTIONS.snow.hero].hp = 38;
    HEROES[FACTIONS.losutai.hero].hp = 35;

    // 学院：撤掉 7–9 费终端，补 1–3 费站场。
    remove('academy', 'pure_theorist', 2);
    remove('academy', 'magic_lecturer', 2);
    remove('academy', 'ac_grand_library', 1);
    remove('academy', 'ac_knowledge_burst', 1);
    remove('academy', 'ac_absolute_theory', 1);
    add('academy', 'snow_medic', 1);
    add('academy', 'anvil_town_miner', 2);
    add('academy', 'mist_scout', 2);
    add('academy', 'neutral_wayfarer', 1);
    add('academy', 'mist_harbor_city', 1);
    remove('academy', 'magic_lecturer', 1);
    remove('academy', 'ac_spell_copy', 1);
    add('academy', 'snow_medic', 1);

    remove('academy', 'spell_apprentice', 1);
    remove('academy', 'white_reef_keeper', 1);
    add('academy', 'ac_absolute_theory', 1);
    add('academy', 'ac_absolute_theory', 1);

    // 西昭：降低中立占比，补阵营站场。
    remove('xizhao', 'snow_medic', 2);
    remove('xizhao', 'archive_guard', 2);
    remove('xizhao', 'mist_scout', 2);
    add('xizhao', 'bloodroad_guide', 1);
    add('xizhao', 'xh_blood_steward', 1);
    add('xizhao', 'blood_executor', 1);
    add('xizhao', 'xh_blood_mist', 1);
    add('xizhao', 'bloodroad_guide', 1);
    add('xizhao', 'xh_blood_steward', 1);

    remove('xizhao', 'mist_hound', 2);
    add('xizhao', 'broken_bone_warlord', 1);
    add('xizhao', 'blood_priestess', 1);

    // 共和国：减少中立，补守备与中坚。
    remove('republic', 'snow_medic', 2);
    remove('republic', 'archive_guard', 1);
    remove('republic', 'mist_scout', 1);
    remove('republic', 'anvil_town_miner', 1);
    add('republic', 'seven_cities_envoy', 1);
    add('republic', 'republic_guard', 2);
    add('republic', 'reborn_sentry', 1);
    add('republic', 'williams_healer', 1);

    // 洛斯汰：把无效债务卡换成早期站场；保留少量债务身份。
    remove('losutai', 'lt_hatch', 2);
    remove('losutai', 'lt_tide_spawn', 2);
    remove('losutai', 'lt_venom_larva', 1);
    remove('losutai', 'lt_venom_fang', 1);
    remove('losutai', 'lt_hatch_guard', 2);
    remove('losutai', 'lt_brood_attendant', 2);
    add('losutai', 'snow_medic', 1);
    add('losutai', 'anvil_town_miner', 2);
    add('losutai', 'archive_guard', 2);
    add('losutai', 'mist_scout', 2);
    add('losutai', 'wandering_guard', 1);
    add('losutai', 'caravan_guard', 1);
    add('losutai', 'neutral_wayfarer', 1);
    add('losutai', 'white_reef_keeper', 1);
    remove('losutai', 'lt_reborn_spawn', 2);
    add('losutai', 'snow_medic', 1);
    add('losutai', 'caravan_guard', 1);

    // 雪境：降低高费终端密度，补低费站场。
    remove('snow', 'snow_time_echo', 1);
    remove('snow', 'snow_blizzard_elemental', 1);
    remove('snow', 'snow_rin', 1);
    remove('snow', 'snow_frost_dragon', 1);
    add('snow', 'snow_medic', 2);
    add('snow', 'archive_guard', 2);

    // 帝国：补两张低费守备，替代 1/1 火药小工。
    remove('empire', 'powder_boy', 2);
    add('empire', 'archive_guard', 2);

    // 文本清理：去掉调试后缀，统一“先遣 / 连携”。
    for (const c of Object.values(CARDS)) {
      if (!c.text) continue;
      c.text = c.text
        .replace(/（余响 \d+）/g, '')
        .replace(/（变体 \d+）/g, '')
        .replace(/（低攻版）/g, '')
        .replace(/（觉醒版）/g, '')
        .replace(/冲锋/g, '先遣')
        .replace(/连击/g, '连携');
    }

    // 预组自检：补齐意外掉到 29 张的情况，保持 30 张与 2 件装备。
    for (const f of FACTION_IDS) {
      const d = DECKS[f];
      const equip = d.filter(id => CARDS[id] && (CARDS[id].type === 'equipment' || CARDS[id].type === 'relic')).length;
      if (d.length < 30) {
        const filler = ['archive_guard', 'anvil_town_miner', 'mist_scout', 'snow_medic'].find(id => (d.filter(x => x === id).length) < maxCopies(CARDS[id]));
        if (filler) add(f, filler, 30 - d.length);
      }
      if (d.length > 30) d.length = 30;
      if (equip > 2) {
        let extra = equip - 2;
        for (let i = d.length - 1; i >= 0 && extra > 0; i--) {
          const c = CARDS[d[i]];
          if (c && (c.type === 'equipment' || c.type === 'relic')) { d.splice(i, 1); extra--; }
        }
      }
    }
  })();

  // ===== 2026-10-23 数值平衡 Phase 2：英雄血量收束、中立削弱、弱阵营加强 =====
  (() => {
    const set = (id, fn) => { const c = CARDS[id]; if (c) fn(c); };

    // 英雄生命全部收束到 25–35。
    HEROES[FACTIONS.pus.hero].hp = 35;
    HEROES[FACTIONS.academy.hero].hp = 35;
    HEROES[FACTIONS.academy.hero].power.text = '被动：每回合第一张战术牌行动力消耗 -2。';
    HEROES[FACTIONS.xizhao.hero].hp = 25;
    HEROES[FACTIONS.republic.hero].hp = 28;
    HEROES[FACTIONS.empire.hero].hp = 35;
    HEROES[FACTIONS.greyharbor.hero].hp = 25;
    HEROES[FACTIONS.losutai.hero].hp = 35;
    HEROES[FACTIONS.snow.hero].hp = 35;

    // 中立高使用率卡继续削弱。
    set('snow_medic', c => { c.deathrattle = { type: 'draw', amount: 1 }; c.text = '余响：抽 1 张牌。'; });
    set('losutai_refugee', c => { c.attack = 1; c.health = 2; delete c.battlecry; c.keywords = ['taunt']; c.text = '守备。'; });
    set('mist_scout', c => { c.deathrattle = { type: 'armor', amount: 2 }; c.text = '先遣。引脉 4：获得 1 点护甲。余响：获得 2 点护甲。'; });
    set('archive_guard', c => { c.health = 3; c.text = '守备。余响：抽 1 张牌。'; });
    set('caravan_guard', c => { c.health = 5; c.deathrattle = { type: 'armor', amount: 3 }; c.text = '守备。余响：获得 3 点护甲。'; });
    set('neutral_wayfarer', c => { c.health = 5; c.deathrattle = { type: 'armor', amount: 6 }; c.text = '先遣。余响：获得 6 点护甲。'; });
    set('anvil_town_miner', c => { c.health = 4; c.text = '登场：获得 1 点护甲。余响：获得 2 点护甲。'; });
    set('wandering_guard', c => { c.health = 4; c.text = '守备。登场：恢复你的领袖 1 点生命。'; });
    set('mist_harbor_city', c => { c.deathrattle = { type: 'armor', amount: 4 }; c.text = '登场：获得 2 点护甲。余响：获得 4 点护甲。'; });
    set('white_reef_keeper', c => { c.health = 4; c.deathrattle = { type: 'draw', amount: 2 }; c.text = '守备。余响：抽 2 张牌。'; });
    set('mist_hound', c => { c.health = 3; c.text = '先遣。回潮。'; });
    set('fog_sailor', c => { c.attack = 3; c.health = 2; });

    // 学院：补前期质量，降低关键战术费用；演算被动从 -1 调到 -2。
    set('record_clerk', c => { c.attack = 1; c.health = 3; });
    set('spell_novice', c => { c.cost = 4; });
    set('lecturer', c => { c.cost = 7; });
    set('magic_lecturer', c => { c.attack = 5; c.health = 6; });
    set('pure_theorist', c => { c.attack = 6; c.health = 7; });
    set('ac_grand_library', c => { c.cost = 5; });
    set('ac_knowledge_burst', c => { c.cost = 4; });
    set('ac_absolute_theory', c => { c.cost = 5; });

    // 帝国：补护甲体系随从质量。
    set('empire_guard', c => { c.cost = 4; c.attack = 3; c.health = 6; });
    set('iron_artillery', c => { c.cost = 5; c.attack = 3; c.health = 5; });
    set('grain_convoy', c => { c.attack = 4; c.health = 5; });
    set('forge_technician', c => { c.attack = 3; });
    set('powder_marshal', c => { c.attack = 4; c.health = 5; });

    // 雪都：冻结/召唤体系补身材，降低两个 7 费终端费用。
    set('snow_priest', c => { c.attack = 2; });
    set('snow_guard_captain', c => { c.attack = 3; c.health = 4; });
    set('snow_rin', c => { c.cost = 6; c.attack = 3; c.health = 5; });
    set('snow_blizzard_elemental', c => { c.cost = 7; });
    set('snow_time_echo', c => { c.cost = 7; });
    set('snow_windweaver', c => { c.health = 5; });
  })();


  // ===== 2026-10-23 数值平衡 Phase 3：中立再削、强者降温、弱者补强 =====
  (() => {
    const set = (id, fn) => { const c = CARDS[id]; if (c) fn(c); };

    // 强势阵营降温：普卫岛英雄 35→30；西昭的两张关键卡小幅削弱。
    HEROES[FACTIONS.pus.hero].hp = 30;
    set('tiega', c => { c.attack = 4; c.health = 4; });
    set('grayfeather', c => { c.attack = 2; c.health = 3; c.text = '登场：抽 1 张牌。余响：对随机敌方目标造成伤害。'; });
    set('grayfeather', c => { if (c.battlecry) c.battlecry.amount = 1; });

    // 继续削中立：压低高使用率的功能牌与身材。
    // 只保留 Phase 2 的五个高使用率中立削弱，避免把所有中立一起砍死。

    // 弱阵营加强：学院继续降费，补早期质量。
    set('record_clerk', c => { c.attack = 2; c.health = 3; });
    set('lecturer', c => { c.cost = 6; });
    set('ac_grand_library', c => { c.cost = 4; });
    set('ac_knowledge_burst', c => { c.cost = 3; });
    set('ac_absolute_theory', c => { c.cost = 4; });

    // 帝国补极早期与中坚质量。
    set('ironclad', c => { c.attack = 2; });
    set('forge_technician', c => { c.attack = 3; c.health = 4; });
    set('siege_captain', c => { c.attack = 5; c.health = 7; });
    set('grain_convoy', c => { c.attack = 4; c.health = 5; });
    set('powder_marshal', c => { c.attack = 4; c.health = 5; });
  })();

  // ===== 2026-10-24 平衡补丁 Phase 4：数值修订 + 新卡 =====
  (() => {
    const STATS = [{"id":"reflux_physician","cost":8,"attack":6,"health":6},{"id":"pulse_banner","cost":8,"attack":5,"health":7},{"id":"spring_watcher","cost":8,"attack":5,"health":6},{"id":"reflux_apprentice","cost":7,"attack":4,"health":6},{"id":"spell_echo","cost":8,"attack":5,"health":6},{"id":"debate","cost":2,"attack":null,"health":null},{"id":"arcane_surge","cost":3,"attack":null,"health":null},{"id":"ac_archive_eruption","cost":6,"attack":null,"health":null},{"id":"formula_fix","cost":6,"attack":null,"health":null},{"id":"ac_final_proof","cost":5,"attack":null,"health":null},{"id":"spell_codex","cost":4,"attack":null,"health":null},{"id":"whitefrost_bell","cost":4,"attack":null,"health":null},{"id":"blood_pact","cost":2,"attack":null,"health":null},{"id":"beast_hide_armor","cost":4,"attack":null,"health":null},{"id":"blood_scythe","cost":4,"attack":null,"health":null},{"id":"line_spearman","cost":8,"attack":5,"health":7},{"id":"border_lance","cost":3,"attack":null,"health":null},{"id":"iron_banner","cost":3,"attack":null,"health":null},{"id":"rush_lancer","cost":3,"attack":4,"health":4},{"id":"siege_captain","cost":4,"attack":4,"health":6},{"id":"iron_order_hammer","cost":4,"attack":null,"health":null},{"id":"gh_rush_archer","cost":2,"attack":2,"health":3},{"id":"broken_line_merc","cost":3,"attack":4,"health":4},{"id":"execution_supervisor","cost":4,"attack":4,"health":4},{"id":"gh_legend_assassin","cost":4,"attack":4,"health":5},{"id":"gh_bounty_collector","cost":4,"attack":5,"health":5},{"id":"ledger_paperknife","cost":4,"attack":null,"health":null},{"id":"blackmarket_bracer","cost":4,"attack":null,"health":null},{"id":"lt_venom_behemoth","cost":7,"attack":6,"health":7},{"id":"tide_colossus","cost":7,"attack":4,"health":4},{"id":"lt_tide_colossus","cost":5,"attack":null,"health":null},{"id":"lt_brood_armor","cost":4,"attack":null,"health":null},{"id":"lt_venom_pouch","cost":3,"attack":null,"health":null},{"id":"snow_last_stand","cost":8,"attack":5,"health":6},{"id":"snow_time_stop","cost":5,"attack":null,"health":null},{"id":"snow_aurora","cost":6,"attack":null,"health":null},{"id":"northern_nomad","cost":2,"attack":2,"health":3},{"id":"north_hunter","cost":2,"attack":2,"health":3},{"id":"wandering_blade","cost":2,"attack":2,"health":3},{"id":"neutral_wayfarer","cost":3,"attack":3,"health":4},{"id":"gh_shield_mercenary","cost":3,"attack":3,"health":4},{"id":"chrono_archivist","cost":7,"attack":4,"health":5},{"id":"astral_gate","cost":6,"attack":null,"health":null},{"id":"last_ledger","cost":5,"attack":null,"health":null}];
    for (const s of STATS) { const c = CARDS[s.id]; if (!c) continue; if (Number.isFinite(s.cost)) c.cost = s.cost; if (Number.isFinite(s.attack)) c.attack = s.attack; if (Number.isFinite(s.health)) c.health = s.health; }
    const NEW_CARDS = [
  {
    "id": "mirror_regent",
    "name": "镜界执政官",
    "faction": "neutral",
    "type": "minion",
    "rarity": "legendary",
    "cost": 6,
    "attack": 4,
    "health": 5,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：选择一个敌方随从，召唤它的 1/1 复制。复制体保留关键词和卡牌效果，但不会触发登场效果。",
    "battlecry": {
      "type": "copyEnemyMinion1of1"
    }
  },
  {
    "id": "time_debt_emperor",
    "name": "时债君王",
    "faction": "academy",
    "type": "minion",
    "rarity": "legendary",
    "cost": 7,
    "attack": 4,
    "health": 6,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你的回合结束时，使你手牌中的所有卡费用减少 1（最低为 0）。",
    "passive": {
      "type": "reduceHandCosts",
      "amount": 1
    }
  },
  {
    "id": "cinder_arbiter",
    "name": "灰烬仲裁者",
    "faction": "empire",
    "type": "minion",
    "rarity": "legendary",
    "cost": 7,
    "attack": 5,
    "health": 6,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你的回合结束时，对所有其他随从造成 2 点伤害。",
    "passive": {
      "type": "endTurnDamageAllOther",
      "amount": 2
    }
  },
  {
    "id": "unquiet_dowager",
    "name": "夺魂女侯",
    "faction": "greyharbor",
    "type": "minion",
    "rarity": "legendary",
    "cost": 7,
    "attack": 5,
    "health": 5,
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "text": "余响：随机控制一个费用不高于 4 的敌方随从。",
    "deathrattle": {
      "type": "takeControlRandomEnemyUnder4"
    }
  },
  {
    "id": "stone_alchemist",
    "name": "石化术师",
    "faction": "xizhao",
    "type": "minion",
    "rarity": "legendary",
    "cost": 6,
    "attack": 3,
    "health": 5,
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "text": "登场：将一个敌方随从变成 1/1 石像衍生物，移除其关键词和卡牌效果。",
    "battlecry": {
      "type": "transformEnemy1of1"
    }
  },
  {
    "id": "puwei_dawn_mender",
    "name": "白岛愈辉者",
    "faction": "pus",
    "type": "minion",
    "rarity": "rare",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你每回合第一次实际恢复领袖生命时，随机一个受伤的友方随从恢复 2 点生命。",
    "passive": {
      "type": "heroHealAllyOnce",
      "amount": 2
    }
  },
  {
    "id": "puwei_overflow_saint",
    "name": "晨潮圣使",
    "faction": "pus",
    "type": "minion",
    "rarity": "legendary",
    "cost": 5,
    "attack": 4,
    "health": 5,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：恢复你的领袖 4 点生命；这次恢复溢出的数值转为等量护甲。",
    "battlecry": {
      "type": "healOverflowArmor",
      "amount": 4
    }
  },
  {
    "id": "academy_arcane_transcriber",
    "name": "秘仪誊写员",
    "faction": "academy",
    "type": "minion",
    "rarity": "epic",
    "cost": 5,
    "attack": 3,
    "health": 5,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：复制你本局最近使用的一张战术牌置入手牌；该牌费用增加 1（最高为 10）。若本局尚未使用战术牌，抽 1 张牌。",
    "battlecry": {
      "type": "copyLastTacticPlus1"
    }
  },
  {
    "id": "xizhao_blood_vow",
    "name": "血誓赌徒",
    "faction": "xizhao",
    "type": "minion",
    "rarity": "epic",
    "cost": 4,
    "attack": 3,
    "health": 4,
    "keywords": [
      "battlecry",
      "blood"
    ],
    "target": "enemy",
    "text": "血祭 3：对一个敌方随从造成 4 点伤害；若它被消灭，抽 1 张牌。",
    "bloodCost": 3,
    "battlecry": {
      "type": "damageDrawIfKill",
      "amount": 4
    }
  },
  {
    "id": "republic_bastion_mentor",
    "name": "壁垒教官",
    "faction": "republic",
    "type": "minion",
    "rarity": "rare",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你每回合第一次获得护甲时，使一个随机友方随从获得 +0/+1。",
    "passive": {
      "type": "firstArmorBuffAllyHealth"
    }
  },
  {
    "id": "republic_ironwall_marshal",
    "name": "铁壁元帅",
    "faction": "republic",
    "type": "minion",
    "rarity": "legendary",
    "cost": 6,
    "attack": 4,
    "health": 6,
    "keywords": [
      "taunt",
      "battlecry"
    ],
    "target": "none",
    "text": "守备。登场：获得 4 点护甲；若你在此效果前已有护甲，自身获得格挡。",
    "battlecry": {
      "type": "armorConditionalBlock",
      "amount": 4
    }
  },
  {
    "id": "empire_veinblade_savant",
    "name": "脉刃策士",
    "faction": "empire",
    "type": "minion",
    "rarity": "epic",
    "cost": 4,
    "attack": 3,
    "health": 4,
    "keywords": [
      "battlecry",
      "passive"
    ],
    "target": "none",
    "text": "登场：共享流脉 +1。你每回合第一次消耗共享流脉时，本随从获得 +2 攻击。",
    "battlecry": {
      "type": "veinOnly",
      "amount": 1
    },
    "passive": {
      "type": "veinSpendAttackOnce",
      "attack": 2
    }
  },
  {
    "id": "grayharbor_bounty_chaser",
    "name": "悬赏追猎者",
    "faction": "greyharbor",
    "type": "minion",
    "rarity": "rare",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你每回合第一次消灭悬赏目标时，抽 1 张牌并获得 2 点护甲。",
    "passive": {
      "type": "firstBountyKillDrawArmor",
      "draw": 1,
      "armor": 2
    }
  },
  {
    "id": "losutai_spore_pathfinder",
    "name": "孢子引路人",
    "faction": "losutai",
    "type": "minion",
    "rarity": "rare",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：每回合第一次友方洛斯汰魔物死亡时，召唤一个 1/1 洛斯汰魔物。",
    "passive": {
      "type": "firstImpDeathSummon"
    }
  },
  {
    "id": "losutai_hive_ancestor",
    "name": "巢群先祖",
    "faction": "losutai",
    "type": "minion",
    "rarity": "legendary",
    "cost": 7,
    "attack": 5,
    "health": 6,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你的回合结束时，若你本回合召唤过至少 3 个洛斯汰魔物，召唤一个 3/3 洛斯汰巨兽。",
    "passive": {
      "type": "endTurnThreeImpsSummon"
    }
  },
  {
    "id": "snow_frost_hunter",
    "name": "凝霜猎手",
    "faction": "snow",
    "type": "minion",
    "rarity": "rare",
    "cost": 3,
    "attack": 2,
    "health": 4,
    "keywords": [
      "passive"
    ],
    "target": "none",
    "text": "被动：你每回合第一次冻结敌方随从时，本随从获得 +1 攻击；第二次冻结时再获得 +1 攻击。",
    "passive": {
      "type": "freezeGrowthTwice",
      "attack": 1
    }
  },
  {
    "id": "snow_shatter_judge",
    "name": "碎冰审判官",
    "faction": "snow",
    "type": "minion",
    "rarity": "legendary",
    "cost": 6,
    "attack": 4,
    "health": 5,
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "text": "登场：对所有被冻结的敌方随从造成 3 点伤害；若至少消灭一个，抽 1 张牌。",
    "battlecry": {
      "type": "damageFrozenEnemiesDrawIfKill",
      "amount": 3
    }
  },
  {
    "id": "neutral_copyist_luomi",
    "name": "复写术师·洛弥",
    "faction": "neutral",
    "type": "minion",
    "rarity": "epic",
    "cost": 4,
    "attack": 2,
    "health": 3,
    "keywords": [
      "battlecry"
    ],
    "target": "friendly",
    "text": "登场：将一个友方随从的复制置入你的手牌；其费用与原卡相同。",
    "battlecry": {
      "type": "copyFriendlyToHandSameCost"
    }
  }
];
    for (const c of NEW_CARDS) { c.keywords = (c.keywords || []).filter(k => k !== "passive" && k !== "blood"); c.noArtwork = true; CARDS[c.id] = c; }
    if (CARDS.empire_veinblade_savant) CARDS.empire_veinblade_savant.text = "登场：共享流脉 +1。被动：你每回合第一次消耗共享流脉时，本随从获得 +2 攻击。";
  })();

  // ===== 2026-10-24 传说卡牌设计：90 张传说定稿 =====
  (() => {
    const DESIGN = [{"id":"orlicas","name":"欧莉卡斯","cost":3,"attack":1,"health":6,"type":"minion","rarity":"legendary","text":"每当同阵位另一个友方随从攻击时，将其生命值变为与本随从相同。"},{"id":"shextena","name":"希斯蒂娜","cost":4,"attack":4,"health":4,"type":"minion","rarity":"legendary","text":"登场：恢复你的领袖 4 点生命，引脉8：恢复你的领袖3点生命；每实际恢复 1 点生命值，获得 +1/+1。"},{"id":"timon","name":"提蒙","cost":6,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"登场：复活你在本局对战中死亡的行动力消耗最高的随从。"},{"id":"puwei_overflow_saint","name":"晨潮圣使","cost":5,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"登场：恢复你的领袖 4 点生命；这次恢复溢出的数值转为等量护甲。"},{"id":"aidric","name":"艾德里克","cost":7,"attack":7,"health":1,"type":"minion","rarity":"legendary","text":"守备， 登场：消灭一个随从并获得其生命值"},{"id":"verious","name":"维里欧斯","cost":7,"attack":5,"health":7,"type":"minion","rarity":"legendary","text":"登场：你使用的下一张战术牌会施放三次  被动：每使用一张战术牌，预兆1"},{"id":"miyuki","name":"深雪","cost":7,"attack":6,"health":6,"type":"minion","rarity":"legendary","text":"登场：冻结深雪所在阵位以阵位外的所有随从（包括友方）被动：深雪在场时本阵位随从不会被冻结"},{"id":"vein_heart","name":"地脉之心","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：你的回合开始时恢复 2 点生命。"},{"id":"justus","name":"尤斯图斯·维尔纳","cost":5,"attack":5,"health":5,"type":"minion","rarity":"legendary","text":"登场：在本局对战中，在你施放一个战术后，随机召唤一个行动力消耗相同的随从。"},{"id":"quin_records","name":"记录官奎因","cost":4,"attack":2,"health":4,"type":"minion","rarity":"legendary","text":"你的召唤随从的卡牌召唤数量翻倍。"},{"id":"cassian","name":"卡西安·维尔","cost":6,"attack":4,"health":6,"type":"minion","rarity":"legendary","text":"被动：你的回合结束时，重复你最后使用的一张战术牌。"},{"id":"karl_desmond","name":"卡尔·德斯蒙德","cost":7,"attack":7,"health":7,"type":"minion","rarity":"legendary","text":"每当你施放一个法术，将一张“火球术”法术牌置入你的手牌。（3费火球术：对一个敌方随从造成4点伤害）"},{"id":"time_debt_emperor","name":"时债君王","cost":7,"attack":4,"health":6,"type":"minion","rarity":"legendary","text":"被动：你的回合结束时，使你手牌中的所有卡费用减少 1（最低为 1）。"},{"id":"ac_absolute_theory","name":"绝对理论","cost":3,"attack":null,"health":null,"type":"spell","rarity":"legendary","text":"对所有敌方随从造成 2 点伤害。"},{"id":"ac_final_proof","name":"最终证明","cost":3,"attack":null,"health":null,"type":"spell","rarity":"legendary","text":"对一个敌方随从造成 3 点伤害，并冻结它。"},{"id":"spell_codex","name":"留存法典","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：每当你施放战术牌，抽 1 张牌。"},{"id":"molan","name":"墨兰","cost":3,"attack":2,"health":4,"type":"minion","rarity":"legendary","text":"获得敌方一个随机随从的控制权"},{"id":"grayfeather","name":"灰羽·乌恩","cost":6,"attack":4,"health":4,"type":"minion","rarity":"legendary","text":"登场：你使用的下一张牌会消耗对手的生命值而非法力值（最高不超过10点）。"},{"id":"lize","name":"莉泽","cost":4,"attack":7,"health":7,"type":"minion","rarity":"legendary","text":"登场：随机弃掉一张手牌。引脉8：改为弃对手的一张手牌。"},{"id":"blood_elder","name":"血族长老","cost":4,"attack":5,"health":5,"type":"minion","rarity":"legendary","text":"使你手牌和牌库中的随从牌行动力消耗减少（1）点，战术牌的行动力消耗增加（1）点。"},{"id":"tiega","name":"铁牙·阿古","cost":6,"attack":6,"health":7,"type":"minion","rarity":"legendary","text":"你抽取你行动力消耗最高的两张牌，你的对手抽取你行动力最低的两张牌。"},{"id":"stone_alchemist","name":"石化术师","cost":6,"attack":3,"health":5,"type":"minion","rarity":"legendary","text":"登场：将一个敌方随从变成 1/1 石像衍生物，移除其关键词和卡牌效果。"},{"id":"xh_castle_consul","name":"古堡执政官","cost":7,"attack":7,"health":7,"type":"minion","rarity":"legendary","text":"在你弃掉一张随从牌后，召唤一个该随从的复制。"},{"id":"blood_scythe","name":"血潮镰","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：回合开始时，所有友方随从获得 +1 攻击。"},{"id":"hans","name":"汉斯·冯·霍尔姆","cost":2,"attack":1,"health":3,"type":"minion","rarity":"legendary","text":"格挡。 余响：获得2点护甲。"},{"id":"elena","name":"伊莲娜·索菲","cost":6,"attack":5,"health":7,"type":"minion","rarity":"legendary","text":"登场：召唤你受伤的随从的复制，使复制获得突袭。"},{"id":"erhardt","name":"埃尔哈特·冯·罗森","cost":4,"attack":3,"health":3,"type":"minion","rarity":"legendary","text":"守备。如果在你的某个回合中有四个友方角色受到伤害，从手牌或牌库中召唤本随从。"},{"id":"konrad","name":"康拉德·威廉莱斯","cost":5,"attack":4,"health":6,"type":"minion","rarity":"legendary","text":"登场：消灭你的对手上回合使用的 所有随从。"},{"id":"beatrix","name":"贝娅特丽克丝·冯·艾森胡特","cost":6,"attack":5,"health":6,"type":"minion","rarity":"legendary","text":"登场：将你牌库底的五张牌的法力值消耗变为（1）点。"},{"id":"republic_ironwall_marshal","name":"铁壁元帅","cost":6,"attack":4,"health":6,"type":"minion","rarity":"legendary","text":"守备。登场：获得 4 点护甲；若你在此效果前已有护甲，自身获得格挡。"},{"id":"stein_speaker","name":"施泰因议长","cost":9,"attack":6,"health":7,"type":"minion","rarity":"legendary","text":"使你的其他随从获得“亡语：召唤一个法力值消耗与本随从相同的随从”。"},{"id":"iron_banner","name":"铁壁军旗","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：回合开始时，使一名友方随从获得格挡。"},{"id":"mia","name":"米娅·科尔贝","cost":2,"attack":2,"health":1,"type":"minion","rarity":"legendary","text":"登场：将你的手牌替换为你的起始手牌。在你的回合结束时换回。"},{"id":"klaus","name":"克劳斯·莱茵哈特","cost":3,"attack":3,"health":4,"type":"minion","rarity":"legendary","text":"先遣。登场：场上每有一个其他随从（不分敌我），获得 +1/+1。"},{"id":"elsa","name":"艾尔莎·汉瑟尔","cost":3,"attack":2,"health":2,"type":"minion","rarity":"legendary","text":"在你的回合结束时，使你的随从获得格挡，已有格挡的随从改为获得+3/+3。"},{"id":"eisenwald_marshal","name":"艾森瓦尔德元帅","cost":5,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"将你牌库底的五张牌的法力值消耗变为（1）点。"},{"id":"gunther","name":"京特·冯·艾森瓦尔德","cost":6,"attack":5,"health":7,"type":"minion","rarity":"legendary","text":"连携。登场：获得 6 点护甲。引脉6：获得 4 点护甲。"},{"id":"karl_schwarz","name":"卡尔·冯·施瓦茨","cost":6,"attack":4,"health":6,"type":"minion","rarity":"legendary","text":"登场：对一个敌方随从造成等同于你护甲的伤害。。"},{"id":"cinder_arbiter","name":"灰烬仲裁者","cost":7,"attack":5,"health":6,"type":"minion","rarity":"legendary","text":"战吼：使你的领袖获得回潮"},{"id":"powder_engine","name":"火药引擎","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：回合开始时，获得2点护甲"},{"id":"kugreen","name":"「苦绿」","cost":4,"attack":3,"health":3,"type":"minion","rarity":"legendary","text":"被动：每完成一次悬赏，对敌方领袖造成 2 点伤害。"},{"id":"xiu","name":"「哑巴」修","cost":3,"attack":3,"health":4,"type":"minion","rarity":"legendary","text":"此牌在你的手牌中时，会变成你的对手使用的上一张随从牌的3/4的复制。"},{"id":"vera","name":"「替身」薇拉","cost":5,"attack":6,"health":6,"type":"minion","rarity":"legendary","text":"隐匿。每当一个隐匿的友方随从攻击，随机使你手牌中一张牌的行动力消耗减少（3）点。"},{"id":"seran","name":"「账房」瑟兰","cost":5,"attack":4,"health":4,"type":"minion","rarity":"legendary","text":"登场：将所有低于本随从生命值的随从列入悬赏名单。"},{"id":"karan","name":"「断线」卡兰","cost":6,"attack":6,"health":6,"type":"minion","rarity":"legendary","text":"被动：此随从在场时，所有友方随从攻击无视守备。"},{"id":"unquiet_dowager","name":"夺魂女侯","cost":7,"attack":5,"health":5,"type":"minion","rarity":"legendary","text":"余响：随机控制一个费用不高于 4 的敌方随从。"},{"id":"gh_bounty_king","name":"赏金王","cost":7,"attack":7,"health":7,"type":"minion","rarity":"legendary","text":"登场：消灭所有悬赏名单上的敌方随从；每消灭一个，对敌方领袖造成 4 点伤害。若没有悬赏目标，对敌方领袖造成 8 点伤害。"},{"id":"gh_bounty_board","name":"悬赏榜","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：回合开始时，将一个随机敌方随从列入悬赏名单"},{"id":"lanzhou","name":"澜舟","cost":1,"attack":1,"health":1,"type":"minion","rarity":"legendary","text":"隐匿。登场：召唤一个 1/1 洛斯汰魔物。"},{"id":"lt_awakened","name":"觉醒者","cost":5,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"本随从以及同阵位的其他随从攻击后，获得一张闪电箭。（闪电箭，2费，对敌方所有随从造成1点伤害）"},{"id":"lt_brood_mother","name":"巢母","cost":6,"attack":4,"health":6,"type":"minion","rarity":"legendary","text":"将你上回合使用的所有战术牌移回你的手牌。"},{"id":"lanxi","name":"澜汐","cost":4,"attack":5,"health":5,"type":"minion","rarity":"legendary","text":"被动：场上每有一个洛斯汰魔物，获得 +1/+1。"},{"id":"losutai_hive_ancestor","name":"巢群先祖","cost":7,"attack":5,"health":6,"type":"minion","rarity":"legendary","text":"被动：你的回合结束时，若你本回合召唤过至少 2 个洛斯汰魔物，召唤一个 3/3 洛斯汰巨兽。"},{"id":"lt_tide_mother","name":"潮母","cost":3,"attack":3,"health":4,"type":"minion","rarity":"legendary","text":"登场：召唤2个 1/1 洛斯汰魔物。引脉6：在召唤2个1/1 洛斯汰魔物。"},{"id":"lt_venom_lord","name":"毒潮领主","cost":9,"attack":8,"health":7,"type":"minion","rarity":"legendary","text":"在你的回合结束时，使用你牌库顶的3张牌"},{"id":"lt_deep_eye","name":"深海之眼","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：你的回合开始时，召唤一个 1/1 洛斯汰魔物。"},{"id":"samuel","name":"塞缪尔·奎因","cost":1,"attack":2,"health":2,"type":"minion","rarity":"legendary","text":"登场：检索1 余响：召唤一个雪狐哨兵。"},{"id":"snow_rin","name":"凛","cost":6,"attack":3,"health":5,"type":"minion","rarity":"legendary","text":"将你牌库中的所有战术牌移至牌库顶。每回合你可以选择从牌库顶或牌库底抽牌。"},{"id":"nina","name":"妮娜·索雷尔","cost":6,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"登场：冻结目标所在阵位的所有敌方随从。"},{"id":"snow_shatter_judge","name":"碎冰审判官","cost":6,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"登场：对所有被冻结的敌方随从造成 3 点伤害；每消灭一个随从，获得+1/+1"},{"id":"snow_time_shade","name":"时间残影","cost":8,"attack":4,"health":7,"type":"minion","rarity":"legendary","text":"将你手牌中的所有随从牌送入2回合后的未来。这些牌返回时会具有+5/+5。"},{"id":"snow_frost_dragon","name":"白霜龙","cost":8,"attack":7,"health":7,"type":"minion","rarity":"legendary","text":"登场：冻结目标所在阵位的所有敌方随从。"},{"id":"snow_last_stand","name":"雪都之战·终局","cost":8,"attack":5,"health":6,"type":"minion","rarity":"legendary","text":"被动：在你使用你的英雄技能后，随机对一个敌人造成5点伤害。"},{"id":"snow_ember","name":"雪都火种","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：回合开始时，随机冻结一名敌方随从"},{"id":"monarch","name":"莫纳克","cost":4,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"登场：预兆：从牌库顶 3 张中选 1 张任意阵营的可收集牌。"},{"id":"mirror_regent","name":"镜界执政官","cost":6,"attack":4,"health":5,"type":"minion","rarity":"legendary","text":"登场：选择一个敌方随从，召唤它的 1/1 复制。复制体保留关键词和卡牌效果，但不会触发登场效果。"},{"id":"grave_titan","name":"墓钟泰坦","cost":7,"attack":8,"health":8,"type":"minion","rarity":"legendary","text":"余响：召唤一个 5/5 的墓钟守卫。"},{"id":"faceless_king","name":"无面君王","cost":9,"attack":7,"health":7,"type":"minion","rarity":"legendary","text":"登场：复制一个友方随从。"},{"id":"vein_leviathan","name":"流脉利维坦","cost":9,"attack":8,"health":8,"type":"minion","rarity":"legendary","text":"战吼：触发本局对战中死亡的3个友方随从的亡语。"},{"id":"obsidian_colossus","name":"黑曜巨像","cost":9,"attack":5,"health":11,"type":"minion","rarity":"legendary","text":"守备。余响：召唤一个 3/3 的黑曜碎片。"},{"id":"world_serpent","name":"世界之蛇","cost":10,"attack":9,"health":9,"type":"minion","rarity":"legendary","text":"亡语：随机召唤一个传说随从。"},{"id":"void_titan","name":"虚空泰坦","cost":10,"attack":9,"health":9,"type":"minion","rarity":"legendary","text":"登场：消灭所有敌方随从。"},{"id":"last_ledger","name":"最后一笔账","cost":5,"attack":null,"health":null,"type":"spell","rarity":"legendary","text":"检索一张法战术牌，并使其法力值消耗减少（8）点。如果减少的溢出量还有剩余，重复此效果。"},{"id":"world_edge","name":"世界边缘","cost":8,"attack":null,"health":null,"type":"spell","rarity":"legendary","text":"为所有友方角色恢复 8点生命值。随机召唤两个法力值消耗为（8）的随从。"},{"id":"final_bell","name":"终末钟声","cost":10,"attack":null,"health":null,"type":"spell","rarity":"legendary","text":"再次使用在本回合中使用的所有其他牌（尽可能以敌人为目标）。结束你的回合。"},{"id":"no_mans_camp","name":"无主营地","cost":3,"attack":null,"health":null,"type":"formation","rarity":"legendary","text":"该阵位友方随从固定获得 +2 攻击。"},{"id":"grey_ledger_post","name":"灰港账站","cost":6,"attack":null,"health":null,"type":"formation","rarity":"legendary","text":"该阵位友方随从固定获得+2生命值"},{"id":"forgotten_gate","name":"遗忘之门","cost":8,"attack":null,"health":null,"type":"formation","rarity":"legendary","text":"该阵位友方随从固定获得格挡和先遣。"},{"id":"dusk_inn_key","name":"黄昏旅店钥匙","cost":4,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：回合开始时，获得+1生命上限"},{"id":"smuggler_anchor","name":"走私船锚","cost":8,"attack":null,"health":null,"type":"equipment","rarity":"legendary","text":"装备（持续生效）：你的回合开始时对所有敌方随从造成 2 点伤害。"}];
    for (const d of DESIGN) { const c = CARDS[d.id]; if (!c) continue; c.cost = d.cost; if (Number.isFinite(d.attack)) c.attack = d.attack; if (Number.isFinite(d.health)) c.health = d.health; c.type = d.type; c.rarity = d.rarity; c.text = d.text; }
  })();

  // ===== 传说卡牌设计：效果重写 =====
  (() => {
    const EFX = {
  "orlicas": {
    "keywords": [],
    "passive": {
      "type": "allyAttackSetHealth"
    }
  },
  "shextena": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "healHeroSelfBuffVein",
      "amount": 4,
      "vein": 8,
      "bonus": 3
    }
  },
  "timon": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "reviveHighestCost"
    }
  },
  "aidric": {
    "keywords": [
      "taunt",
      "battlecry"
    ],
    "target": "enemy",
    "battlecry": {
      "type": "destroyGainHealth"
    }
  },
  "verious": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "nextSpellTriple"
    },
    "passive": {
      "type": "spellDiscoverOnce"
    }
  },
  "miyuki": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "freezeAllExceptOwnZone"
    },
    "passive": {
      "type": "zoneFreezeImmune"
    }
  },
  "justus": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "spellSummonSameCost"
    }
  },
  "quin_records": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "summonCountDouble"
    }
  },
  "cassian": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "repeatLastSpell"
    }
  },
  "karl_desmond": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "spellAddFireball"
    }
  },
  "time_debt_emperor": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "reduceHandCosts",
      "amount": 1,
      "floor": 1
    }
  },
  "molan": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "takeControlRandomEnemy"
    }
  },
  "grayfeather": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "nextCardHealthCost"
    }
  },
  "lize": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "discardRandomVeinOpponent"
    }
  },
  "blood_elder": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "costSplitMinionSpell"
    }
  },
  "tiega": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "drawHighLow"
    }
  },
  "xh_castle_consul": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "discardMinionSummonCopy"
    }
  },
  "hans": {
    "keywords": [
      "divineShield",
      "deathrattle"
    ],
    "target": "none",
    "deathrattle": {
      "type": "armor",
      "amount": 2
    }
  },
  "elena": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "summonDamagedCopiesRush"
    }
  },
  "erhardt": {
    "keywords": [
      "taunt"
    ],
    "target": "none",
    "passive": {
      "type": "summonSelfOnFourDamage"
    }
  },
  "konrad": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "destroyLastTurnMinions"
    }
  },
  "beatrix": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "bottomDeckCostOne"
    }
  },
  "stein_speaker": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "grantDeathrattleSameCost"
    }
  },
  "mia": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "swapStartingHand"
    }
  },
  "elsa": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "endTurnShieldOrBuff"
    }
  },
  "eisenwald_marshal": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "bottomDeckCostOne"
    }
  },
  "gunther": {
    "keywords": [
      "windfury",
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "armorVein",
      "amount": 6,
      "vein": 6,
      "bonus": 4
    }
  },
  "karl_schwarz": {
    "keywords": [
      "battlecry"
    ],
    "target": "enemy",
    "battlecry": {
      "type": "armorDamage"
    }
  },
  "cinder_arbiter": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "heroReborn"
    }
  },
  "xiu": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "handCopyLastEnemyMinion"
    }
  },
  "vera": {
    "keywords": [
      "stealth"
    ],
    "target": "none",
    "passive": {
      "type": "stealthAttackDiscount"
    }
  },
  "seran": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "markLowHealthBounties"
    }
  },
  "karan": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "ignoreTauntAura"
    }
  },
  "lt_awakened": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "attackAddLightning"
    }
  },
  "lt_brood_mother": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "returnLastTurnSpells"
    }
  },
  "losutai_hive_ancestor": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "endTurnImpsSummon",
      "threshold": 2
    }
  },
  "lt_tide_mother": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "summonImpsVein6"
    }
  },
  "lt_venom_lord": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "endTurnUseTop3"
    }
  },
  "samuel": {
    "keywords": [
      "battlecry",
      "deathrattle"
    ],
    "target": "none",
    "battlecry": {
      "type": "discover",
      "pool": "any"
    },
    "deathrattle": {
      "type": "summon",
      "token": "snow_fox_sentry"
    }
  },
  "snow_rin": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "spellsToTopDrawChoice"
    }
  },
  "nina": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "freezeZone"
    }
  },
  "snow_shatter_judge": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "damageFrozenGrow"
    }
  },
  "snow_time_shade": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "delayHandMinions"
    }
  },
  "snow_frost_dragon": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "freezeZone"
    }
  },
  "snow_last_stand": {
    "keywords": [],
    "target": "none",
    "passive": {
      "type": "heroPowerDamage",
      "amount": 5
    }
  },
  "vein_leviathan": {
    "keywords": [
      "battlecry"
    ],
    "target": "none",
    "battlecry": {
      "type": "triggerDeadDeathrattles3"
    }
  },
  "world_serpent": {
    "keywords": [
      "deathrattle"
    ],
    "target": "none",
    "deathrattle": {
      "type": "summonRandomLegendary"
    }
  },
  "last_ledger": {
    "keywords": [],
    "target": "none",
    "spell": {
      "type": "discoverTacticCost8Repeat"
    }
  },
  "world_edge": {
    "keywords": [],
    "target": "none",
    "spell": {
      "type": "healAllSummon8"
    }
  },
  "final_bell": {
    "keywords": [],
    "target": "none",
    "spell": {
      "type": "replayTurnEnd"
    }
  }
};
    for (const id of Object.keys(EFX)) {
      const c = CARDS[id]; if (!c) continue;
      delete c.battlecry; delete c.deathrattle; delete c.passive; delete c.spell; delete c.target;
      Object.assign(c, EFX[id]);
    }
    // 装备/阵型定稿
    if (CARDS.blood_scythe) CARDS.blood_scythe.equipAura = { attack: 1 };
    if (CARDS.powder_engine) CARDS.powder_engine.equipAura = { armorTurn: 2 };
    if (CARDS.iron_banner) CARDS.iron_banner.equipAura = {};
    if (CARDS.gh_bounty_board) CARDS.gh_bounty_board.equipAura = {};
    if (CARDS.lt_deep_eye) CARDS.lt_deep_eye.equipAura = { armorTurn: 0 };
    if (CARDS.snow_ember) CARDS.snow_ember.equipAura = { healTurn: 0 };
    if (CARDS.dusk_inn_key) CARDS.dusk_inn_key.equipAura = { maxHp: 0 };
    if (CARDS.forgotten_gate) CARDS.forgotten_gate.formation = { divineShield: true, rush: true };
    if (CARDS.karl_schwarz) CARDS.karl_schwarz.text = CARDS.karl_schwarz.text.replace(/。。/g, '。');
    CARDS.fireball = { id:"fireball", name:"火球术", faction:"neutral", type:"spell", rarity:"token", cost:3, target:"enemy", token:true, noArtwork:true, keywords:[], text:"对一个敌方随从造成 4 点伤害。", spell:{ type:"damage", amount:4 } };
    CARDS.lightning_bolt = { id:"lightning_bolt", name:"闪电箭", faction:"neutral", type:"spell", rarity:"token", cost:2, target:"none", token:true, noArtwork:true, keywords:[], text:"对敌方所有随从造成 1 点伤害。", spell:{ type:"damageAllEnemies", amount:1 } };
    for (const id of Object.keys(EFX)) { const c = CARDS[id]; if (c && c.passive && c.text && c.text.indexOf("被动") < 0) c.text = "被动：" + c.text; }
    if (CARDS.world_serpent) CARDS.world_serpent.text = "余响：随机召唤一个传说随从。";
    if (CARDS.justus) CARDS.justus.text = "登场：在本局对战中，在你施放一个战术后，随机召唤一个行动力消耗相同的随从。被动：该效果持续到本局结束。";
    if (CARDS.vera) CARDS.vera.text = "隐匿。被动：每当一个隐匿的友方随从攻击，随机使你手牌中一张牌的行动力消耗减少（3）点。";
  })();

  // ===== 传说设计版预组：每阵营 2 张传说 =====
  Object.assign(DECKS, {
  "pus": [
    "formation_vein",
    "formation_vein",
    "vein_heart",
    "formation_standard",
    "shextena",
    "medic_apprentice",
    "vein_siphon",
    "vein_scout",
    "zone_keeper",
    "coordination",
    "emergency",
    "emergency",
    "resonance",
    "resonance",
    "neutral_wayfarer",
    "gok_digger",
    "gok_digger",
    "fog_sailor",
    "snow_medic",
    "snow_medic",
    "mist_scout",
    "mist_scout",
    "caravan_guard",
    "caravan_guard",
    "coordination",
    "courier",
    "fog_sailor",
    "ley_surveyor",
    "losutai_refugee",
    "anvil_town_miner"
  ],
  "academy": [
    "formation_script",
    "formation_script",
    "spell_codex",
    "academy_inkwell",
    "doorman",
    "doorman",
    "white_reef_keeper",
    "archive_guard",
    "archive_guard",
    "wandering_guard",
    "wandering_guard",
    "caravan_guard",
    "caravan_guard",
    "sky_ship",
    "sky_ship",
    "record_clerk",
    "spell_novice",
    "ac_arcane_flood",
    "ac_field_notes",
    "ac_arcane_insight",
    "debate",
    "snow_medic",
    "anvil_town_miner",
    "anvil_town_miner",
    "mist_scout",
    "mist_scout",
    "neutral_wayfarer",
    "mist_harbor_city",
    "snow_medic",
    "karl_desmond"
  ],
  "xizhao": [
    "formation_tide",
    "formation_tide",
    "blood_scythe",
    "blood_censer",
    "blood_imp",
    "blood_path",
    "shadow_raid",
    "xh_blood_guard",
    "tribal_warrior",
    "blood_duelist",
    "blood_duelist",
    "wandering_guard",
    "wandering_guard",
    "mercenary",
    "mercenary",
    "mist_harbor_city",
    "mist_harbor_city",
    "north_beast_tamer",
    "xh_tribe_headhunter",
    "xh_tribe_headhunter",
    "grayfeather",
    "caravan_guard",
    "bloodroad_guide",
    "xh_blood_steward",
    "blood_executor",
    "xh_blood_mist",
    "bloodroad_guide",
    "xh_blood_steward",
    "broken_bone_warlord",
    "blood_priestess"
  ],
  "republic": [
    "phalanx_warden",
    "fortify",
    "iron_banner",
    "republic_seal",
    "erhardt",
    "cedric",
    "aegis_guard",
    "shield_bearer",
    "shield_recruit",
    "shield_sergeant",
    "levy",
    "zone_banner",
    "neutral_wayfarer",
    "gok_digger",
    "gok_digger",
    "fog_sailor",
    "mist_scout",
    "caravan_guard",
    "caravan_guard",
    "fog_sailor",
    "line_rotation",
    "losutai_refugee",
    "shield_recruit",
    "wall_recruit",
    "anvil_town_smith",
    "seven_cities_envoy",
    "republic_guard",
    "republic_guard",
    "reborn_sentry",
    "williams_healer"
  ],
  "empire": [
    "zone_barrage",
    "formation_cannon",
    "powder_engine",
    "armor_forge",
    "klaus",
    "walter",
    "iron_artillery",
    "ironclad",
    "ironclad",
    "barrage",
    "wind_cannon",
    "mobilize",
    "mobilize",
    "fortress",
    "martial_court",
    "powder_marshal",
    "neutral_wayfarer",
    "gok_digger",
    "gok_digger",
    "fog_sailor",
    "snow_medic",
    "snow_medic",
    "mist_scout",
    "mist_scout",
    "caravan_guard",
    "barrage",
    "fog_sailor",
    "losutai_refugee",
    "archive_guard",
    "archive_guard"
  ],
  "greyharbor": [
    "gh_bounty_notice",
    "gh_formation",
    "gh_bounty_board",
    "gh_ledger_chain",
    "venom_attendant",
    "venom_attendant",
    "gh_venom_apprentice",
    "gh_venom_apprentice",
    "gh_poison_thrower",
    "gh_poison_thrower",
    "bounty_accountant",
    "bounty_accountant",
    "gh_venom_shield",
    "gh_venom_shield",
    "gh_legend_assassin",
    "gh_legend_assassin",
    "gh_bounty_collector",
    "gh_bounty_collector",
    "seran",
    "gh_scorpion",
    "gh_scorpion",
    "gh_bounty_hunter",
    "gh_bounty_hunter",
    "bounty_clerk",
    "bounty_clerk",
    "gh_bounty_verdict",
    "toll_account",
    "gh_ledger",
    "fog_sailor",
    "gh_contract_squire"
  ],
  "losutai": [
    "blood_pool",
    "monster_nest",
    "gh_venom_vial",
    "lt_tide_totem",
    "brood_matron",
    "brood_matron",
    "monster_overseer",
    "monster_overseer",
    "tribal_shaman",
    "lanxi",
    "lt_tide_mother",
    "lt_venom_behemoth",
    "lt_tide_birth",
    "lt_tide_birth",
    "lt_venom_mist",
    "fog_sailor",
    "losutai_refugee",
    "snow_medic",
    "snow_medic",
    "anvil_town_miner",
    "anvil_town_miner",
    "archive_guard",
    "archive_guard",
    "mist_scout",
    "mist_scout",
    "wandering_guard",
    "caravan_guard",
    "neutral_wayfarer",
    "white_reef_keeper",
    "caravan_guard"
  ],
  "snow": [
    "snow_icewall_formation",
    "snow_windwall",
    "white_frost_hall",
    "frost_prism",
    "snow_hourglass",
    "snow_storm_hunter",
    "snow_storm_hunter",
    "snow_icewall_guard",
    "snow_icewall_guard",
    "snow_priest",
    "snow_priest",
    "snow_guard_captain",
    "snow_guard_captain",
    "snow_frostclaw",
    "snow_frostclaw",
    "snow_coldwind_assassin",
    "snow_coldwind_assassin",
    "snow_frozen_oracle",
    "snow_frozen_oracle",
    "snow_windweaver",
    "snow_windweaver",
    "snow_freeze_touch",
    "snow_freeze_touch",
    "snow_wind_strike",
    "snow_blizzard",
    "fog_sailor",
    "snow_medic",
    "archive_guard",
    "nina",
    "snow_shatter_judge"
  ]
});


  // ===== 传说预组实战定稿：每阵营 2 张传说 =====
  Object.assign(DECKS, {
  "pus": [
    "formation_vein",
    "formation_vein",
    "vein_heart",
    "formation_standard",
    "shextena",
    "medic_apprentice",
    "vein_siphon",
    "vein_scout",
    "zone_keeper",
    "coordination",
    "emergency",
    "emergency",
    "resonance",
    "resonance",
    "neutral_wayfarer",
    "gok_digger",
    "gok_digger",
    "fog_sailor",
    "snow_medic",
    "snow_medic",
    "mist_scout",
    "mist_scout",
    "caravan_guard",
    "caravan_guard",
    "coordination",
    "courier",
    "fog_sailor",
    "ley_surveyor",
    "losutai_refugee",
    "anvil_town_miner"
  ],
  "academy": [
    "formation_script",
    "formation_script",
    "spell_codex",
    "academy_inkwell",
    "doorman",
    "doorman",
    "white_reef_keeper",
    "archive_guard",
    "archive_guard",
    "wandering_guard",
    "wandering_guard",
    "caravan_guard",
    "caravan_guard",
    "sky_ship",
    "sky_ship",
    "record_clerk",
    "spell_novice",
    "ac_arcane_flood",
    "ac_field_notes",
    "ac_arcane_insight",
    "debate",
    "snow_medic",
    "anvil_town_miner",
    "anvil_town_miner",
    "mist_scout",
    "mist_scout",
    "neutral_wayfarer",
    "mist_harbor_city",
    "snow_medic",
    "karl_desmond"
  ],
  "xizhao": [
    "formation_tide",
    "formation_tide",
    "blood_scythe",
    "blood_censer",
    "blood_imp",
    "blood_path",
    "shadow_raid",
    "xh_blood_guard",
    "tribal_warrior",
    "blood_duelist",
    "blood_duelist",
    "wandering_guard",
    "wandering_guard",
    "mercenary",
    "mercenary",
    "mist_harbor_city",
    "mist_harbor_city",
    "north_beast_tamer",
    "xh_tribe_headhunter",
    "xh_tribe_headhunter",
    "grayfeather",
    "caravan_guard",
    "bloodroad_guide",
    "xh_blood_steward",
    "blood_executor",
    "xh_blood_mist",
    "bloodroad_guide",
    "xh_blood_steward",
    "broken_bone_warlord",
    "blood_priestess"
  ],
  "republic": [
    "phalanx_warden",
    "fortify",
    "iron_banner",
    "republic_seal",
    "konrad",
    "cedric",
    "aegis_guard",
    "shield_bearer",
    "shield_recruit",
    "shield_sergeant",
    "levy",
    "zone_banner",
    "neutral_wayfarer",
    "gok_digger",
    "gok_digger",
    "fog_sailor",
    "mist_scout",
    "caravan_guard",
    "caravan_guard",
    "fog_sailor",
    "line_rotation",
    "losutai_refugee",
    "shield_recruit",
    "wall_recruit",
    "anvil_town_smith",
    "seven_cities_envoy",
    "republic_guard",
    "republic_guard",
    "reborn_sentry",
    "williams_healer"
  ],
  "empire": [
    "zone_barrage",
    "formation_cannon",
    "powder_engine",
    "armor_forge",
    "klaus",
    "walter",
    "iron_artillery",
    "ironclad",
    "ironclad",
    "barrage",
    "wind_cannon",
    "mobilize",
    "mobilize",
    "fortress",
    "martial_court",
    "powder_marshal",
    "neutral_wayfarer",
    "gok_digger",
    "gok_digger",
    "fog_sailor",
    "snow_medic",
    "snow_medic",
    "mist_scout",
    "mist_scout",
    "caravan_guard",
    "barrage",
    "fog_sailor",
    "losutai_refugee",
    "archive_guard",
    "archive_guard"
  ],
  "greyharbor": [
    "gh_bounty_notice",
    "gh_formation",
    "ledger_paperknife",
    "gh_ledger_chain",
    "venom_attendant",
    "venom_attendant",
    "gh_venom_apprentice",
    "gh_venom_apprentice",
    "gh_poison_thrower",
    "gh_poison_thrower",
    "bounty_accountant",
    "bounty_accountant",
    "gh_venom_shield",
    "gh_venom_shield",
    "gh_legend_assassin",
    "gh_legend_assassin",
    "gh_bounty_collector",
    "gh_bounty_collector",
    "kugreen",
    "gh_scorpion",
    "gh_scorpion",
    "gh_bounty_hunter",
    "gh_bounty_hunter",
    "bounty_clerk",
    "bounty_clerk",
    "seran",
    "toll_account",
    "gh_ledger",
    "fog_sailor",
    "gh_contract_squire"
  ],
  "losutai": [
    "blood_pool",
    "monster_nest",
    "gh_venom_vial",
    "lt_tide_totem",
    "brood_matron",
    "brood_matron",
    "monster_overseer",
    "monster_overseer",
    "tribal_shaman",
    "lanxi",
    "lanzhou",
    "lt_venom_behemoth",
    "lt_tide_birth",
    "lt_tide_birth",
    "lt_venom_mist",
    "fog_sailor",
    "losutai_refugee",
    "snow_medic",
    "snow_medic",
    "anvil_town_miner",
    "anvil_town_miner",
    "archive_guard",
    "archive_guard",
    "mist_scout",
    "mist_scout",
    "wandering_guard",
    "caravan_guard",
    "neutral_wayfarer",
    "white_reef_keeper",
    "caravan_guard"
  ],
  "snow": [
    "snow_icewall_formation",
    "snow_windwall",
    "white_frost_hall",
    "frost_prism",
    "snow_hourglass",
    "snow_storm_hunter",
    "snow_storm_hunter",
    "snow_icewall_guard",
    "snow_icewall_guard",
    "snow_priest",
    "snow_priest",
    "snow_guard_captain",
    "snow_guard_captain",
    "snow_frostclaw",
    "snow_frostclaw",
    "snow_coldwind_assassin",
    "snow_coldwind_assassin",
    "snow_frozen_oracle",
    "snow_frozen_oracle",
    "snow_windweaver",
    "snow_windweaver",
    "snow_freeze_touch",
    "snow_freeze_touch",
    "snow_wind_strike",
    "snow_blizzard",
    "fog_sailor",
    "snow_medic",
    "archive_guard",
    "nina",
    "snow_shatter_judge"
  ]
});
  for (const id of ["snow_ice_crystal_guard","snow_tundra_ranger","snow_ice_wolf","snow_firekeeper","snow_ice_scholar","snow_blizzard_warden","snow_frost_warden","snow_frost_giant","snow_whiteout","snow_temporal_shift","snow_frost_armor","snow_wind_eye","snow_gale_force"]) delete CARDS[id];
  for (const id of ["spell_novice","frost_archivist","tide_scout","magic_lecturer","xh_blood_knight","xh_blood_priest"]) if (CARDS[id]) { delete CARDS[id].passive; CARDS[id].keywords = (CARDS[id].keywords || []).filter(k => k !== "passive"); }
  for (const id of ["lanxi","lanzhou","council_elder","pure_theorist","broken_bone_warlord","xh_blood_colossus"]) if (CARDS[id]) { delete CARDS[id].deathrattle; CARDS[id].keywords = (CARDS[id].keywords || []).filter(k => k !== "deathrattle"); }

  // ===== 卡牌文案统一：行动力 / 先遣 / 登场 / 余响 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    let t = c.text;
    t = t.replace(/法力值/g, "行动力").replace(/法力/g, "行动力");
    t = t.replace(/费用/g, "行动力");
    t = t.replace(/突袭/g, "先遣");
    t = t.replace(/战吼/g, "登场");
    t = t.replace(/亡语/g, "余响");
    t = t.replace(/嘲讽/g, "守备");
    t = t.replace(/圣盾/g, "格挡");
    t = t.replace(/潜行/g, "隐匿");
    t = t.replace(/冲锋/g, "先遣");
    t = t.replace(/法战术牌/g, "战术牌");
    t = t.replace(/法术牌/g, "战术牌");
    t = t.replace(/施放法术/g, "施放战术牌");
    t = t.replace(/法术效果/g, "战术效果");
    t = t.replace(/在召唤/g, "再召唤");
    t = t.replace(/阵位以阵位外/g, "阵位以外");
    t = t.replace(/检索1/g, "检索 1");
    t = t.replace(/(\d)点/g, "$1 点");
    t = t.replace(/被动：(守备|格挡|先遣|连携|蚀毒|隐匿|回潮)/g, "$1。被动：");
    t = t.replace(/(守备|格挡|先遣|连携|蚀毒|隐匿|回潮)，\s*登场/g, "$1。登场");
    t = t.replace(/(包括友方)被动/g, "$1。被动");
    t = t.replace(/\)\s*余响/g, "）。余响");
    t = t.replace(/\s{2,}/g, " ");
    t = t.replace(/。\s+/g, "。");
    c.text = t.trim();
  }

  // ===== 卡牌文案最终校正 =====
  const TEXT_FINAL = {
    justus: "被动：在本局对战中，在你施放一张战术牌后，随机召唤一个行动力消耗相同的随从。",
    stein_speaker: "登场：使你的其他随从获得“余响：召唤一个行动力消耗与本随从相同的随从”。",
    cinder_arbiter: "登场：使你的领袖获得回潮。",
    miyuki: "登场：冻结深雪所在阵位以外的所有随从（包括友方）。被动：深雪在场时本阵位随从不会被冻结。",
    erhardt: "守备。被动：如果在你的某个回合中有四个友方角色受到伤害，从手牌或牌库中召唤本随从。",
    lt_tide_mother: "登场：召唤 2 个 1/1 洛斯汰魔物。引脉 6：再召唤 2 个 1/1 洛斯汰魔物。",
    grayfeather: "登场：你使用的下一张牌会消耗对手的生命值而非行动力（最高不超过 10 点）。",
    shextena: "登场：恢复你的领袖 4 点生命；引脉 8：恢复你的领袖 3 点生命；每实际恢复 1 点生命，获得 +1/+1。",
    lize: "登场：随机弃掉一张手牌；引脉 8：改为弃对手的一张手牌。",
    gunther: "连携。登场：获得 6 点护甲；引脉 6：再获得 4 点护甲。",
    world_edge: "为所有友方角色恢复 8 点生命；随机召唤两个行动力消耗为 8 的随从。",
    hans: "格挡。余响：获得 2 点护甲。",
    karl_desmond: "被动：每当你施放一张战术牌，将一张“火球术”置入你的手牌。（3 行动力「火球术」：对一个敌方随从造成 4 点伤害）",
    spellstorm: "对所有敌方单位造成等同于本局已使用战术牌数量的伤害（最高 10 点）。",
    snow_last_snow: "冻结所有敌方随从；抽 4 张牌。",
    samuel: "登场：检索 1 张牌。余响：召唤一个雪狐哨兵。"
  };
  for (const id of Object.keys(TEXT_FINAL)) if (CARDS[id]) CARDS[id].text = TEXT_FINAL[id];

  // ===== 文案与字段一致性修正 =====
  if (CARDS.lanxi) { delete CARDS.lanxi.battlecry; CARDS.lanxi.passive = { type: "impGrowth", attack: 1, health: 1 }; CARDS.lanxi.keywords = []; }
  for (const id of ["lanzhou","mist_hound","mist_scout","sky_ship","klaus"]) if (CARDS[id]) { CARDS[id].rush = true; CARDS[id].keywords = Array.from(new Set([...(CARDS[id].keywords || []), "rush"])); }
  for (const id of ["fog_sailor","bounty_hunter"]) if (CARDS[id]) CARDS[id].zoneBonus = { attack: 1, health: 0 };
  if (CARDS.losutai_awakened) { CARDS.losutai_awakened.battlecry = { type: "summonCount", token: "losutai_imp", count: 1 }; CARDS.losutai_awakened.keywords = Array.from(new Set([...(CARDS.losutai_awakened.keywords || []), "battlecry"])); }

  if (CARDS.lanzhou) { CARDS.lanzhou.battlecry = { type: "summonCount", token: "losutai_imp", count: 1 }; CARDS.lanzhou.rush = false; CARDS.lanzhou.stealth = true; CARDS.lanzhou.keywords = (CARDS.lanzhou.keywords || []).filter(k => k !== "rush" && k !== "charge"); CARDS.lanzhou.keywords = Array.from(new Set([...CARDS.lanzhou.keywords, "battlecry", "stealth"])); }
  for (const id of ["klaus","mist_hound","mist_scout","sky_ship"]) if (CARDS[id]) CARDS[id].keywords = (CARDS[id].keywords || []).filter(k => k !== "charge");

  // ===== 统一“战术”术语：卡名 / 文案 / 风味 =====
  for (const c of Object.values(CARDS)) {
    if (c.name) c.name = c.name.replace(/法术/g, "战术");
    if (c.text) c.text = c.text.replace(/法术/g, "战术");
    if (c.flavor) c.flavor = c.flavor.replace(/法术/g, "战术");
  }

  // ===== 卡牌文案排版统一 =====
  function tidyCardText(t) {
    t = String(t || "").replace(/\s+/g, " ").trim();
    t = t.replace(/被动：(守备|格挡|先遣|连携|蚀毒|隐匿|回潮)/g, "$1。被动：");
    t = t.replace(/(守备|格挡|先遣|连携|蚀毒|隐匿|回潮)，\s*登场/g, "$1。登场");
    t = t.replace(/\)\s*被动/g, "）。被动");
    t = t.replace(/\s+被动/g, "。被动");
    t = t.replace(/(\d)(点|个|张|回合|费)/g, "$1 $2");
    t = t.replace(/(\d)费/g, "$1 行动力");
    t = t.replace(/(引脉|预兆|检索|掘脉|镇脉|逆脉|压脉|血祭|吞噬)(\d)/g, "$1 $2");
    t = t.replace(/获得\+(?=\d)/g, "获得 +");
    t = t.replace(/获得\s+(\d)/g, "获得 $1");
    t = t.replace(/\s+([，。；：])/g, "$1");
    t = t.replace(/([，。；：])\1+/g, "$1");
    t = t.replace(/。\s+/g, "。");
    if (!/[。！？]$/.test(t)) t += "。";
    return t;
  }
  for (const c of Object.values(CARDS)) if (c.text) c.text = tidyCardText(c.text);

  const TEXT_FINAL_2 = {
    powder_engine: "装备（持续生效）：回合开始时，获得 2 点护甲。",
    lt_awakened: "被动：本随从以及同阵位的其他随从攻击后，获得一张闪电箭。（闪电箭，2 行动力：对敌方所有随从造成 1 点伤害）",
    lt_venom_lord: "被动：在你的回合结束时，使用你牌库顶的 3 张牌。",
    snow_time_shade: "将你手牌中的所有随从牌送入 2 回合后的未来。这些牌返回时会具有 +5/+5。",
    grey_ledger_post: "该阵位友方随从固定获得 +2 生命值。",
    dusk_inn_key: "装备（持续生效）：回合开始时，获得 +1 生命上限。",
    vein_leviathan: "登场：触发本局对战中死亡的 3 个友方随从的死亡效果。",
    konrad: "登场：消灭你的对手上回合使用的所有随从。"
  };
  for (const id of Object.keys(TEXT_FINAL_2)) if (CARDS[id]) CARDS[id].text = TEXT_FINAL_2[id];

  const TEXT_FINAL_3 = {
    tiega: "登场：你抽取你行动力消耗最高的两张牌，你的对手抽取你行动力最低的两张牌。",
    molan: "登场：获得敌方一个随机随从的控制权。",
    spell_echo: "登场：对一个敌方随从造成 2 点伤害。被动：每当你施放一张战术牌，获得 +2 攻击。",
    arcane_conduit: "守备。登场：对一个敌方随从造成 1 点伤害。",
    blood_priestess: "先遣。登场：对一个敌方随从造成 2 点伤害。",
    arcane_theorist: "登场：预兆：从牌库顶 3 张中选 1 张战术牌。被动：每当你施放一张战术牌，获得 +0/+1。",
    brood_matron: "守备。登场：召唤三个 1/1 洛斯汰魔物。",
    reflux_apprentice: "守备。登场：获得 6 点护甲。",
    echo_observer: "登场：对一个敌方随从造成 1 点伤害。余响：对随机敌方目标造成 2 点伤害。",
    frost_line_guard: "守备。登场：获得 5 点护甲。",
    frost_page: "登场：预兆：从牌库顶 3 张中选 1 张战术牌。被动：每当你施放战术牌，获得 +2 攻击。",
    blackmarket_bodyguard: "格挡。余响：对随机敌方目标造成 3 点伤害。",
    archive_keeper: "登场：抽 1 张牌。被动：每当你施放一张战术牌，获得 +1 攻击。",
    losutai_awakened: "先遣。登场：召唤一个 1/1 洛斯汰魔物。余响：获得 1 点护甲。",
    ancient_fortress_scion: "登场：抽 1 张牌。余响：对随机敌方目标造成 5 点伤害。",
    eisenwald_marshal: "登场：将你牌库底的五张牌的行动力消耗变为（1）点。",
    iron_order_wall: "守备。余响：获得 4 点护甲。",
    xh_tribe_headhunter: "守备。被动：每当你施放战术牌，获得 +2 攻击。",
    xh_pressure_master: "登场：获得 3 点护甲。被动：每当你施放战术牌，获得 +0/+1。",
    lt_brood_mother: "登场：将你上回合使用的所有战术牌移回你的手牌。",
    snow_rin: "登场：将你牌库中的所有战术牌移至牌库顶。每回合你可以选择从牌库顶或牌库底抽牌。",
    snow_time_shade: "登场：将你手牌中的所有随从牌送入 2 回合后的未来。这些牌返回时会具有 +5/+5。",
    shield_recruit: "守备。登场：获得 2 点护甲。余响：获得 1 点护甲。",
    tide_colossus: "登场：获得 3 点护甲。余响：对随机敌方目标造成 1 点伤害。",
    blood_acolyte: "登场：对一个敌方随从造成 1 点伤害。余响：对随机敌方目标造成 2 点伤害。",
    blood_pact_collector: "守备。登场：对一个敌方随从造成 1 点伤害。余响：对随机敌方目标造成 2 点伤害。",
    shield_instructor: "登场：恢复你的领袖 2 点生命。余响：获得 1 点护甲。"
  };
  TEXT_FINAL_3.spellstorm = "对所有敌方单位造成等同于本局已使用战术牌数量的伤害（每张 1 点，最高 10 点）。";
  for (const id of Object.keys(TEXT_FINAL_3)) if (CARDS[id]) CARDS[id].text = TEXT_FINAL_3[id];
  if (CARDS.venom_attendant && CARDS.venom_attendant.deathrattle) CARDS.venom_attendant.deathrattle.amount = 7;
  if (CARDS.ac_absolute_theory) CARDS.ac_absolute_theory.spell = { type: "damageAllEnemies", amount: 2 };

  // 引脉字段补齐：自定义效果只补触发标记，标准效果补实际数值
  if (CARDS.shextena) CARDS.shextena.veinBonus = { vein: 8 };
  if (CARDS.lize) CARDS.lize.veinBonus = { vein: 8 };
  if (CARDS.gunther) CARDS.gunther.veinBonus = { vein: 6 };
  if (CARDS.lt_tide_mother) CARDS.lt_tide_mother.veinBonus = { vein: 6 };
  if (CARDS.vein_behemoth) CARDS.vein_behemoth.veinBonus = { vein: 10 };
  if (CARDS.gok_digger) { CARDS.gok_digger.excavate = 1; CARDS.gok_digger.veinBonus = { vein: 4, armor: 2 }; }
  if (CARDS.mist_scout) CARDS.mist_scout.veinBonus = { vein: 4, armor: 1 };
  if (CARDS.astral_colossus) CARDS.astral_colossus.veinBonus = { vein: 6, armor: 2 };
  // ===== 即梦批量角色设定图：18 张新传说立绘 =====
  for (const id of ["mirror_regent","time_debt_emperor","cinder_arbiter","unquiet_dowager","stone_alchemist","puwei_dawn_mender","puwei_overflow_saint","academy_arcane_transcriber","xizhao_blood_vow","republic_bastion_mentor","republic_ironwall_marshal","empire_veinblade_savant","grayharbor_bounty_chaser","losutai_spore_pathfinder","losutai_hive_ancestor","snow_frost_hunter","snow_shatter_judge","neutral_copyist_luomi"]) if (CARDS[id]) { CARDS[id].art = id; CARDS[id].noArtwork = false; CARDS[id].noGeneratedArt = false; }
  if (CARDS.fireball) { CARDS.fireball.noArtwork = false; CARDS.fireball.noGeneratedArt = false; }
  if (CARDS.lightning_bolt) { CARDS.lightning_bolt.noArtwork = false; CARDS.lightning_bolt.noGeneratedArt = false; }

  // ===== 刻脉机制：学院 / 雪都 =====
  if (CARDS.vein_prism) {
    CARDS.vein_prism.target = "friendly";
    CARDS.vein_prism.spell = { type: "carveSealAcademy" };
    CARDS.vein_prism.text = "选择一个友方随从，在其阵位刻下脉痕；流脉达到 4 时，该阵位友方抽 1 张牌（流脉 7 时改为抽 2 张并复原 1 点行动力）。";
  }
  if (CARDS.frost_archivist) {
    CARDS.frost_archivist.battlecry = { type: "carveSealSnow" };
    CARDS.frost_archivist.text = "登场：在自身阵位刻下脉痕；流脉达到 4 时，冻结该阵位所有敌方随从 1 回合（流脉 7 时改为 2 回合）。";
  }

  // ===== 流脉机制落点：掘脉 / 涨脉 / 逆脉 / 镇脉 / 压脉 =====
  if (CARDS.north_beast_tamer) { CARDS.north_beast_tamer.battlecry = { type: "flowDraw", draw: 1, vein: 1 }; CARDS.north_beast_tamer.text = "登场：掘脉1：抽 1 张牌，流脉 +1。"; }
  if (CARDS.vein_surge) { CARDS.vein_surge.spell = { type: "flowDraw", draw: 2, vein: 2, bonusAt: 7, bonusDraw: 3 }; CARDS.vein_surge.text = "掘脉2：抽 2 张牌，流脉 +2；若流脉达到 7，改为抽 3 张牌。"; }
  if (CARDS.fog_navigator) { delete CARDS.fog_navigator.deathrattle; CARDS.fog_navigator.keywords = (CARDS.fog_navigator.keywords || []).filter(k => k !== "deathrattle"); CARDS.fog_navigator.battlecry = { type: "riseVein", amount: 1 }; CARDS.fog_navigator.text = "登场：涨脉 1：本回合行动力 +1，流脉 +1。"; }
  if (CARDS.time_loan) { CARDS.time_loan.spell = { type: "riseVein", amount: 2, penalty: 1 }; CARDS.time_loan.text = "涨脉 2：本回合行动力 +2，流脉 +2；下回合行动力 -1。"; }
  if (CARDS.pulse_banner) { CARDS.pulse_banner.reflux = 2; CARDS.pulse_banner.battlecry = { type: "healHero", amount: 3 }; CARDS.pulse_banner.text = "逆脉2：消耗最多 2 点流脉，恢复领袖 3 点生命。余响：恢复领袖 4 点生命。"; }
  if (CARDS.gh_silence_expert) { CARDS.gh_silence_expert.reflux = 2; CARDS.gh_silence_expert.text = "逆脉2：消耗最多 2 点流脉，沉默一个敌方随从；若目标有悬赏，抽 1 张牌。余响：对随机敌方目标造成 3 点伤害。"; }
  if (CARDS.wind_cannon) { CARDS.wind_cannon.zhenmai = 2; CARDS.wind_cannon.text = "连携。镇脉2：消耗最多 2 点流脉，获得等量护甲。余响：获得 7 点护甲。"; }
  if (CARDS.aegis_guard) { CARDS.aegis_guard.zhenmai = 3; CARDS.aegis_guard.text = "守备。镇脉3：消耗最多 3 点流脉，获得等量护甲。余响：获得 4 点护甲。"; }
  if (CARDS.xh_pressure_master) { delete CARDS.xh_pressure_master.battlecry; delete CARDS.xh_pressure_master.passive; CARDS.xh_pressure_master.pressure = 3; CARDS.xh_pressure_master.keywords = (CARDS.xh_pressure_master.keywords || []).filter(k => k !== "battlecry"); CARDS.xh_pressure_master.text = "压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害。"; }
  if (CARDS.pressure_warlock) { CARDS.pressure_warlock.pressure = 3; CARDS.pressure_warlock.text = "先遣。压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害。余响：获得 2 点护甲。"; }

  for (const id of ["fireball","lightning_bolt","xingchuan_dungbeetle","xingchuan_cockroach","xingchuan_centipede","xingchuan_orbweaver","xingchuan_tigerbeetle","xingchuan_molecricket","xingchuan_mosquito","xingchuan_bee","xingchuan_cockroach_guard"]) if (CARDS[id]) { CARDS[id].noArtwork = false; CARDS[id].noGeneratedArt = false; }

  // ===== 2026-10-25 第一批：权限修正 =====
  if (CARDS.vein_foreman) { delete CARDS.vein_foreman.excavate; CARDS.vein_foreman.reflux = 1; CARDS.vein_foreman.battlecry = { type: "healHero", amount: 2 }; CARDS.vein_foreman.text = "登场：恢复你的领袖 2 点生命。逆脉1：再恢复 1 点生命。"; }
  if (CARDS.recon) { delete CARDS.recon.excavate; CARDS.recon.target = "friendly"; CARDS.recon.spell = { type: "carveSealAcademy", armor: 3 }; CARDS.recon.text = "获得 3 点护甲；刻脉4：在该阵位刻下脉痕，流脉达到 4 时该阵位友方抽 1 张牌。"; }
  if (CARDS.vein_prospect) { delete CARDS.vein_prospect.excavate; CARDS.vein_prospect.target = "friendly"; CARDS.vein_prospect.spell = { type: "carveSealAcademy", kind: "academyProspect", threshold: 7, discover: "spell" }; CARDS.vein_prospect.text = "预兆一张战术牌；刻脉7：在该阵位刻下脉痕，流脉达到 7 时该阵位友方抽 1 张牌并复原 1 点行动力。"; }
  if (CARDS.lt_tide_birth) { CARDS.lt_tide_birth.text = "抽 1 张牌；流脉 +2。"; delete CARDS.lt_tide_birth.excavate; }

  // ===== 2026-10-25 第一批：史诗随从数值与完整文本 =====
  const B1 = {
    bulwark_lieutenant: [5,3,5,"登场：恢复你的领袖 2 点生命；若同阵位有其他友方随从，获得 4 点护甲。"],
    vein_engineer: [6,4,5,"被动：每回合第一次恢复领袖生命时，同阵位一个友方随从获得 +0/+1。余响：逆脉2，恢复领袖 2 点生命。"],
    deepvein_guard: [6,3,6,"守备。余响：恢复 2 点生命；若本回合获得过护甲，改为 4 点护甲。"],
    vein_attendant: [8,5,7,"登场：恢复 3 点生命。余响：若流脉达到 7，获得 6 点护甲；否则获得 2 点护甲。"],
    vein_oracle: [8,4,7,"守备。余响：恢复 3 点生命；若同阵位有其他友方随从，抽 1 张牌。"],
    spring_watcher: [8,5,6,"登场：若你控制守备随从，抽 1 张牌。余响：恢复 3 点生命；若本回合获得过护甲，再获得 3 点护甲。"],
    excavation_titan: [9,6,7,"被动：每回合第一次恢复领袖生命时，同阵位友方随从获得 +1/+1。余响：获得 3 点护甲。"],
    spell_conductor: [5,4,5,"被动：每回合施放第二张战术后，抽 1 张牌。"],
    academy_arcane_transcriber: [5,3,5,"登场：复制你本局最近使用的一张战术牌；复制牌行动力 +2（最高 10）。若本局尚未使用战术牌，抽 1 张牌。"],
    arcane_theorist: [7,5,5,"登场：预兆一张战术牌。被动：每回合第一张战术牌使自身获得 +1/+1。"],
    echo_observer: [8,4,6,"登场：对一个敌方随从造成 2 点伤害。余响：若本回合施放过战术牌，对随机敌方随从造成 2 点伤害；否则造成 1 点。"],
    blood_acolyte: [1,1,2,"登场：对一个敌方随从造成 1 点伤害。余响：若本回合受过伤害，对随机敌方随从造成 2 点伤害。"],
    xh_blood_knight: [2,2,3,"先遣。格挡。"],
    blood_priestess: [2,2,3,"先遣。血祭1：对一个敌方随从造成 2 点伤害。"],
    blood_pact_collector: [3,2,4,"守备。登场：若本回合受过伤害，对一个敌方随从造成 2 点伤害。余响：对随机敌方随从造成 2 点伤害。"],
    bloodroad_guide: [3,3,2,"余响：对随机敌方随从造成 3 点伤害；若敌方没有随从，改为对敌方领袖造成 2 点伤害。"],
    xh_bone_guard: [3,3,3,"余响：获得 3 点护甲；若本回合失去过生命，改为获得 6 点护甲。"],
    tide_scout: [4,3,5,"守备。先遣。对位：敌方对位阵位有随从时，获得 +1 攻击。"],
    blood_executor: [4,3,4,"被动：每当你施放战术牌，对随机敌方随从造成 1 点伤害。余响：对随机敌方随从造成 3 点伤害。"],
    xizhao_blood_vow: [4,3,4,"血祭2：对一个敌方随从造成 3 点伤害；若将其消灭，抽 1 张牌。"],
    xh_blood_colossus: [5,4,5,"登场：血祭3，抽 3 张牌；否则抽 1 张牌。"],
    xh_blood_priest: [7,5,5,"先遣。隐匿。攻击并消灭目标时，对敌方领袖造成 2 点伤害。"],
    phalanx_executor: [5,3,5,"守备。登场：镇脉2。余响：获得 3 点护甲。"],
    shield_sergeant: [6,3,6,"格挡。余响：获得 4 点护甲；若同阵位有守备随从，改为 7 点。"],
    rosen_borderlord: [6,4,5,"登场：若你控制守备随从，召唤一个共和国新兵。余响：获得 4 点护甲。"],
    zone_banner: [6,4,5,"登场：同阵位友方随从获得 +2/+1。余响：获得等同于该阵位随从数量的护甲，最多 3 点。"],
    bastion_captain: [7,5,6,"登场：若你有护甲，获得 +0/+2 和守备。余响：获得 2 点护甲。"],
    cedric: [7,5,5,"余响：召唤一个 1/1 共和国新兵，并获得 3 点护甲。"],
    shield_marshal: [9,6,7,"余响：获得 4 点护甲；若你控制阵型，改为 8 点。"],
    siege_captain: [4,4,5,"守备。登场：若你有至少 3 点护甲，对所有敌方随从造成 1 点伤害。余响：获得 3 点护甲。"],
    otto_hand: [4,4,4,"登场：镇脉2。余响：获得 2 点护甲。"],
    empire_veinblade_savant: [4,3,4,"登场：流脉 +1。被动：每回合第一次镇脉后，获得 +2 攻击。"],
    powder_marshal: [5,4,5,"登场：获得 3 点护甲；若你已有护甲，对一个敌方随从造成 2 点伤害。"],
    walter: [5,5,5,"登场：对随机敌方单位造成等同于你护甲值的伤害，最多 4 点。"],
    iron_artillery: [5,3,5,"守备。登场：对一个敌方随从造成等同于你护甲值的伤害，最多 4 点。余响：获得 1 点护甲。"],
    siege_train: [7,5,7,"连携。登场：若本回合获得过护甲，对所有敌方随从造成 2 点伤害；否则造成 1 点。"],
    five_guild_council: [4,4,4,"登场：随机将两个敌方随从列入悬赏名单；若已有悬赏目标，自身获得 +1/+1。"],
    execution_supervisor: [4,4,4,"先遣。被动：攻击悬赏名单上的随从时，获得 +1/+1。"],
    gh_legend_assassin: [4,4,4,"先遣。登场：将一个敌方随从列入悬赏名单；若它已在名单上，抽 1 张牌。"],
    venom_sac_guard: [4,3,5,"守备。登场：将对位敌方随从列入悬赏名单；若对位没有随从，抽 1 张牌。"],
    gh_bounty_collector: [4,4,4,"先遣。被动：每完成一次悬赏，获得 +1/+1。"],
    gh_captain: [5,5,5,"登场：所有友方随从获得先遣；若有悬赏目标，抽 1 张牌。"],
    gh_medic: [5,3,4,"登场：恢复 4 点生命；若你完成过悬赏，改为恢复 8 点。"],
    losutai_matriarch: [3,2,3,"登场：召唤一个 1/1 洛斯汰魔物。余响：若你控制其他魔物，获得 2 点护甲。"],
    pressure_warlock: [4,3,4,"先遣。压脉3：消耗 3 点流脉，对敌方领袖造成 3 点伤害。余响：若你控制其他魔物，获得 2 点护甲。"],
    lt_tide_devourer: [4,3,4,"吞噬一个攻击力最低的友方魔物，获得其攻击力和生命值；若吞噬的是魔物，召唤一个 1/1 洛斯汰魔物。"],
    devourer: [5,4,5,"登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。余响：对随机敌方随从造成 2 点伤害。"],
    losutai_awakened: [6,4,6,"先遣。登场：若你控制其他魔物，召唤两个 1/1 洛斯汰魔物。余响：获得 2 点护甲。"],
    lt_venom_behemoth: [7,5,7,"先遣。蚀毒。"],
    tide_colossus: [7,5,5,"登场：吞噬一个友方魔物，并获得其生命值。余响：召唤一个 3/3 巨兽。"],
    frost_professor: [2,1,3,"登场：预兆一张战术牌；若它是冻结牌，抽 1 张牌。"],
    frost_archivist: [4,3,4,"登场：在自身阵位刻下脉痕；流脉达到 4 时，冻结该阵位所有敌方随从 1 回合（流脉 7 时改为 2 回合）。"],
    snow_frozen_oracle: [5,3,5,"登场：冻结一个敌方随从；若目标已经冻结，抽 1 张牌。"],
    snow_aurora_priestess: [5,3,4,"余响：冻结一个随机敌方随从；若它已经冻结，抽 1 张牌。"],
    snow_ice_priest: [6,3,6,"登场：冻结一个敌方随从；若目标已经冻结，对所有已冻结敌方随从造成 2 点伤害。余响：抽 1 张牌。"],
    snow_time_echo: [7,4,5,"登场：冻结一个敌方随从。余响：对所有已冻结敌方随从造成 2 点伤害。"],
    snow_blizzard_elemental: [7,5,6,"登场：冻结所有敌方随从。余响：召唤一个雪狐哨兵。"],
    snow_fox_guard: [7,4,6,"登场：若你控制其他雪狐，获得 +2/+2 和守备。余响：召唤一个雪狐哨兵。"],
    snow_frost_colossus: [8,5,7,"被动：每冻结一个敌方随从，获得 +1 攻击。余响：获得 4 点护甲。"],
    snow_exile: [3,2,4,"登场：恢复 2 点生命。余响：若你控制阵型，获得 4 点护甲。"],
    fog_dockhand: [3,4,3,"守备。余响：获得 3 点护甲；若同阵位有其他友方随从，改为 5 点。"],
    dusk_innkeeper: [3,2,4,"登场：抽 1 张牌。余响：抽 1 张牌；若你控制阵型，再抽 1 张牌。"],
    neutral_copyist_luomi: [4,2,3,"登场：复制一个友方随从置入手牌；若其行动力不大于 3，复制牌行动力 +1。"],
    astral_colossus: [6,3,8,"守备。被动：你的回合开始时获得 1 点护甲。引脉6：获得 2 点护甲并抽 1 张牌。"],
    twin_weaver: [7,4,4,"登场：召唤一个自身的复制；复制体为 1/1 且不触发登场。"],
    chrono_archivist: [7,4,5,"登场：将一个敌方随从移回其手牌；若其行动力不大于 3，抽 1 张牌。"],
    archive_devourer: [7,4,6,"登场：吞噬一个攻击力最低的友方随从，获得其攻击力和生命值。余响：抽 1 张牌。"],
    vein_behemoth: [8,4,8,"登场：掘脉2。引脉10：获得 +1/+1 和守备。"],
    frost_leviathan: [8,6,5,"余响：冻结所有敌方随从；若本局你冻结过至少 3 个随从，获得 +3/+3 后再冻结。"]
  };
  for (const [id, v] of Object.entries(B1)) {
    const c = CARDS[id]; if (!c) continue;
    c.cost = v[0];
    if (c.type === "minion") { c.attack = v[1]; c.health = v[2]; c.maxHealth = v[2]; c.text = v[3]; }
    else { c.text = v[2] || v[3]; }
  }

  // ===== 第一批效果：普卫岛 / 学院 =====
  const B1E = {
    bulwark_lieutenant: { battlecry: { type: "healSameZoneArmor", heal: 2, armor: 4 } },
    vein_engineer: { passive: { type: "healGrowthOnce", attack: 0, health: 1 }, deathrattle: { type: "refluxHeal", reflux: 2, heal: 2 } },
    deepvein_guard: { deathrattle: { type: "armorIfArmorGained", normal: 2, boosted: 4 } },
    vein_attendant: { deathrattle: { type: "armorIfVein", threshold: 7, high: 6, low: 2 } },
    vein_oracle: { deathrattle: { type: "healDrawIfSameZone", heal: 3 } },
    spring_watcher: { battlecry: { type: "drawIfTaunt" }, deathrattle: { type: "healArmorIfArmorGained", heal: 3, armor: 3 } },
    excavation_titan: { passive: { type: "healGrowthOnce", attack: 1, health: 1 }, deathrattle: { type: "armor", amount: 3 } },
    spell_conductor: { passive: { type: "secondSpellDraw" } },
    academy_arcane_transcriber: { battlecry: { type: "copyLastTacticPlus1", plus: 2 } },
    arcane_theorist: { passive: { type: "firstSpellGrowth", attack: 1, health: 1 } },
    echo_observer: { battlecry: { type: "damage", amount: 2 }, deathrattle: { type: "damageRandomIfSpell", normal: 1, boosted: 2 }, target: "enemy" }
  };
  for (const [id, e] of Object.entries(B1E)) { const c=CARDS[id]; if(!c) continue; for(const k of ["battlecry","deathrattle","passive"]) { if(e[k]) c[k]=e[k]; } if(e.target) c.target=e.target; }

  // ===== 第一批效果：其余阵营（按现有引擎效果类型接入） =====
  const B1R = {
    blood_acolyte:{battlecry:{type:"damage",amount:1},deathrattle:{type:"damageRandomEnemy",amount:2},target:"enemy"},
    blood_priestess:{bloodCost:1,battlecry:{type:"damage",amount:2},target:"enemy"},
    blood_pact_collector:{battlecry:{type:"damage",amount:2},deathrattle:{type:"damageRandomEnemy",amount:2},target:"enemy"},
    bloodroad_guide:{deathrattle:{type:"damageRandomEnemy",amount:3}},
    xh_bone_guard:{deathrattle:{type:"armor",amount:3}},
    tide_scout:{ mirrorBonus: { attack: 1, health: 0 } },
    blood_executor:{deathrattle:{type:"damageRandomEnemy",amount:3}},
    xizhao_blood_vow:{bloodCost:2,battlecry:{type:"damageDrawIfKill",amount:3},target:"enemy"},
    xh_blood_colossus:{bloodCost:3,battlecry:{type:"draw",amount:3}},
    phalanx_executor:{zhenmai:2,deathrattle:{type:"armor",amount:3}},
    shield_sergeant:{deathrattle:{type:"armor",amount:4}},
    rosen_borderlord:{battlecry:{type:"summon",token:"republic_recruit"},deathrattle:{type:"armor",amount:4}},
    zone_banner:{battlecry:{type:"buffAlly",attack:2,health:1},deathrattle:{type:"armor",amount:1},target:"friendly"},
    bastion_captain:{deathrattle:{type:"armor",amount:2}},
    cedric:{deathrattle:{type:"summon",token:"republic_recruit"}},
    shield_marshal:{deathrattle:{type:"armor",amount:4}},
    siege_captain:{battlecry:{type:"damageAllEnemies",amount:1},deathrattle:{type:"armor",amount:3},target:"none"},
    otto_hand:{zhenmai:2,deathrattle:{type:"armor",amount:2},target:"none"},
    empire_veinblade_savant:{battlecry:{type:"veinOnly",amount:1},passive:{type:"veinSpendAttackOnce",attack:2},target:"none"},
    powder_marshal:{battlecry:{type:"armor",amount:3},target:"none"},
    walter:{battlecry:{type:"damagePerArmorRandom",amount:1},target:"none"},
    iron_artillery:{battlecry:{type:"armorDamage"},deathrattle:{type:"armor",amount:1},target:"enemy"},
    siege_train:{battlecry:{type:"damageAllEnemies",amount:1},target:"none"},
    five_guild_council:{battlecry:{type:"markRandomBounties",count:2},target:"none"},
    execution_supervisor:{passive:{type:"attackBountyBonus",attack:1},target:"none"},
    gh_legend_assassin:{battlecry:{type:"markBounty"},target:"enemy"},
    venom_sac_guard:{battlecry:{type:"markBounty"},target:"enemy"},
    gh_bounty_collector:{passive:{type:"bountyClaimGrowth",attack:1,health:1},target:"none"},
    gh_captain:{battlecry:{type:"grantRushAll"},target:"none"},
    gh_medic:{battlecry:{type:"healHero",amount:4},target:"none"},
    losutai_matriarch:{battlecry:{type:"summon",token:"losutai_imp"},deathrattle:{type:"armor",amount:2}},
    pressure_warlock:{pressure:3,deathrattle:{type:"armor",amount:2}},
    lt_tide_devourer:{battlecry:{type:"devour"},target:"none"},
    devourer:{battlecry:{type:"devour"},deathrattle:{type:"damageRandomEnemy",amount:2},target:"none"},
    losutai_awakened:{battlecry:{type:"summonCount",token:"losutai_imp",count:1},deathrattle:{type:"armor",amount:2}},
    tide_colossus:{battlecry:{type:"devour"},deathrattle:{type:"summon",token:"losutai_imp"}},
    frost_professor:{battlecry:{type:"discover",pool:"spell"}},
    snow_frozen_oracle:{battlecry:{type:"freeze"},target:"enemy"},
    snow_ice_priest:{battlecry:{type:"freezeAllEnemies"},deathrattle:{type:"draw",amount:1}},
    snow_time_echo:{battlecry:{type:"freeze"},deathrattle:{type:"armor",amount:0},target:"enemy"},
    snow_blizzard_elemental:{battlecry:{type:"freezeAllEnemies"},deathrattle:{type:"summon",token:"snow_fox_sentry"}},
    snow_fox_guard:{deathrattle:{type:"summon",token:"snow_fox_sentry"}},
    snow_frost_colossus:{passive:{type:"freezeGrowth",attack:1},deathrattle:{type:"armor",amount:4}},
    snow_exile:{battlecry:{type:"healHero",amount:2},deathrattle:{type:"armor",amount:4}},
    fog_dockhand:{deathrattle:{type:"armor",amount:3}},
    dusk_innkeeper:{battlecry:{type:"draw",amount:1},deathrattle:{type:"draw",amount:1}},
    astral_colossus:{passive:{type:"turnArmor",amount:1}},
    chrono_archivist:{battlecry:{type:"returnToHand"},target:"enemy"},
    archive_devourer:{battlecry:{type:"devour"},deathrattle:{type:"draw",amount:1}},
    frost_leviathan:{deathrattle:{type:"freezeAllEnemies"}}
  };
  for (const [id,e] of Object.entries(B1R)) { const c=CARDS[id]; if(!c) continue; for(const k of ["battlecry","deathrattle","passive","bloodCost","zhenmai","pressure","target"]) if(e[k]!==undefined) c[k]=e[k]; }

  // ===== 2026-10-25 补丁 2A-2E：数值/文本全量 =====
  const PATCH2 = {"medic_apprentice":{"cost":2,"attack":1,"health":3,"text":"登场：若同阵位有另一友方，获得3甲；余响恢复1"},"survey_apprentice":{"cost":2,"attack":2,"health":4,"text":"被动：每回合第一张战术后恢复1；余响恢复2"},"coordination_dispatcher":{"cost":3,"attack":2,"health":4,"text":"余响：恢复2；若同阵位有其他友方，改为3"},"guard":{"cost":4,"attack":3,"health":5,"text":"守备；余响恢复1；若本回合获得过护甲，改为2"},"ksetra_instructor":{"cost":4,"attack":3,"health":4,"text":"登场：恢复2；若同阵位有守备，获得2甲；余响恢复1"},"research_sampler":{"cost":4,"attack":2,"health":5,"text":"登场：若控制阵型抽1；余响恢复3；若本回合治疗过领袖，再获得2甲"},"zone_keeper":{"cost":5,"attack":3,"health":5,"text":"余响：恢复2；若同阵位有其他友方，抽1"},"pulse_recorder":{"cost":7,"attack":4,"health":5,"text":"余响：恢复3；若流脉≥7，改为获得3甲并抽1"},"field_medic":{"cost":7,"attack":5,"health":6,"text":"被动：每回合第一次治疗领袖时，同阵位友方+0/+1；余响3甲"},"reflux_physician":{"cost":8,"attack":6,"health":6,"text":"登场：恢复领袖2；余响：逆脉2，恢复2并获得2甲"},"pulse_banner":{"cost":8,"attack":5,"health":7,"text":"逆脉2：恢复3；余响恢复2；若本回合逆脉过，改为4"},"doorman":{"cost":1,"attack":1,"health":3,"text":"登场：若本回合已施放战术，抽1；否则获得1甲"},"record_clerk":{"cost":1,"attack":2,"health":3,"text":"登场：若手牌≤5，抽1；否则获得1甲"},"formula_apprentice":{"cost":2,"attack":2,"health":3,"text":"余响：若本回合施放过战术，抽1；否则获得1甲"},"arcane_scribe":{"cost":2,"attack":1,"health":3,"text":"登场：若本回合施放过战术，获得4甲；否则1甲"},"page_scholar":{"cost":2,"attack":2,"health":4,"text":"登场：预兆一张战术牌"},"cassian_foreign":{"cost":3,"attack":3,"health":3,"text":"登场：若手牌中有战术牌，获得4甲；否则2甲"},"council_elder":{"cost":3,"attack":2,"health":4,"text":"被动：每回合第一张战术牌使自身+1/+1"},"spell_novice":{"cost":4,"attack":3,"health":5,"text":"登场：若本回合施放过战术，获得3甲并抽1；否则1甲"},"gok_engineer":{"cost":5,"attack":3,"health":4,"text":"登场：预兆一张战术牌；若它是刻脉牌，获得2甲"},"magic_lecturer":{"cost":5,"attack":5,"health":6,"text":"登场：若控制阵型，获得3甲；否则抽1"},"zone_archivist":{"cost":6,"attack":4,"health":6,"text":"余响：随机敌方随从1；若本回合施放过战术，改为2"},"arcane_conduit":{"cost":6,"attack":3,"health":5,"text":"守备；登场：对一个敌方随从1；若本回合施放过战术，改为2"},"lecturer":{"cost":6,"attack":2,"health":4,"text":"登场抽1；余响：若控制阵型获得4甲，否则2"},"pure_theorist":{"cost":6,"attack":5,"health":7,"text":"登场：若本回合施放过两张战术，获得4甲并抽1；否则2甲"},"index_assistant":{"cost":8,"attack":5,"health":7,"text":"登场：预兆一张战术牌；若它是刻脉牌，获得2甲"},"tribal_warrior":{"cost":1,"attack":2,"health":2,"text":"登场：血祭1，召唤一只霜爪兽"},"blood_duelist":{"cost":2,"attack":2,"health":3,"text":"先遣；余响：若本回合受过伤害，随机敌方随从2；否则1"},"broken_bone_warlord":{"cost":5,"attack":4,"health":4,"text":"守备回潮；登场：若本回合失去过生命，获得+1/+1"},"xh_blood_mist":{"cost":6,"attack":4,"health":5,"text":"登场：若本回合受过伤害，召唤一个医疗学徒；余响随机敌方随从2"},"xh_blood_steward":{"cost":7,"attack":5,"health":6,"text":"余响：随机敌方随从2；若本回合受过伤害改为3"},"ancient_fortress_scion":{"cost":8,"attack":5,"health":6,"text":"登场：若本回合受过伤害抽1；余响随机敌方随从3；若无随从对领袖2"},"xh_tribe_headhunter":{"cost":8,"attack":4,"health":6,"text":"守备；被动：每回合第一张战术牌后+2攻；若本回合失去生命，抽1"},"wall_recruit":{"cost":1,"attack":2,"health":2,"text":"登场：若控制守备，召唤新兵；否则获得1甲"},"recruiter":{"cost":2,"attack":1,"health":3,"text":"守备；登场：若同阵位有其他友方，获得2甲；否则1"},"republic_guard":{"cost":3,"attack":3,"health":3,"text":"登场：若你有护甲，恢复3；否则获得2甲"},"temple_priest":{"cost":3,"attack":2,"health":4,"text":"被动：回合开始获得1甲；若控制守备，改为2"},"eisenhut_newmoney":{"cost":3,"attack":3,"health":3,"text":"余响：获得3甲；若同阵位有守备改为5"},"shield_bearer":{"cost":4,"attack":2,"health":5,"text":"守备；余响：若本回合获得过护甲，获得3甲；否则1"},"reborn_shield_guard":{"cost":4,"attack":2,"health":4,"text":"格挡；余响：若控制阵型获得3甲，否则1"},"shield_instructor":{"cost":5,"attack":4,"health":4,"text":"登场：若控制守备恢复2；余响获得2甲"},"drill_sergeant":{"cost":8,"attack":4,"health":7,"text":"守备；登场镇脉2；余响3甲"},"bulwark_sentry":{"cost":9,"attack":6,"health":6,"text":"登场：若你有护甲恢复3；余响获得3甲；若控制阵型改为5"},"line_spearman":{"cost":8,"attack":5,"health":7,"text":"被动：回合开始1甲；余响获得4甲；若控制守备改为6"},"powder_boy":{"cost":1,"attack":1,"health":1,"text":"登场：若你有护甲，对一个敌方随从造成1"},"audit_accountant":{"cost":2,"attack":2,"health":2,"text":"登场：若你有护甲抽1；否则获得1甲"},"rush_lancer":{"cost":3,"attack":4,"health":4,"text":"先遣；若本回合获得过护甲，攻击时+1攻"},"quartermaster":{"cost":3,"attack":3,"health":3,"text":"登场：若你有护甲抽1；余响：镇脉1，获得1甲"},"forge_engineer":{"cost":3,"attack":2,"health":4,"text":"登场获得2甲；余响：若本回合镇脉过，获得2甲"},"detonation_sapper":{"cost":3,"attack":2,"health":2,"text":"余响：若你有护甲，对所有敌方随从1；否则随机敌方随从1"},"lab_researcher":{"cost":3,"attack":2,"health":3,"text":"登场：若你有护甲抽1；否则获得1甲"},"ironclad":{"cost":3,"attack":2,"health":3,"text":"余响：若你有护甲获得2甲；否则1"},"forge_technician":{"cost":3,"attack":3,"health":4,"text":"登场获得2甲；余响：若本回合获得过护甲，获得2甲"},"empire_guard":{"cost":4,"attack":3,"health":6,"text":"登场：若控制守备获得2甲；否则1"},"powder_martyr":{"cost":4,"attack":4,"health":3,"text":"先遣；余响对敌方领袖2；若你有护甲改为3"},"imperial_guard_officer":{"cost":4,"attack":3,"health":5,"text":"守备；登场镇脉2"},"grain_convoy":{"cost":4,"attack":4,"health":5,"text":"登场：若你有护甲恢复2；余响获得3甲"},"armory_keeper":{"cost":8,"attack":5,"health":8,"text":"登场：若你有护甲抽1；余响获得3甲"},"powder_apprentice":{"cost":7,"attack":5,"health":7,"text":"先遣；余响对敌方领袖2；若控制阵型改为4"},"gh_contract_squire":{"cost":1,"attack":1,"health":2,"text":"格挡；登场：若本回合使用过其他牌，悬赏一个敌方随从"},"venom_attendant":{"cost":1,"attack":1,"health":2,"text":"登场：若本回合使用过其他牌抽1；余响获得2甲"},"gh_venom_apprentice":{"cost":1,"attack":1,"health":1,"text":"登场：悬赏一个敌方随从；若它已悬赏，抽1"},"gh_cutthroat":{"cost":1,"attack":2,"health":2,"text":"先遣；余响：若目标被悬赏，随机敌方随从2；否则1"},"gh_rush_archer":{"cost":2,"attack":2,"health":3,"text":"先遣；余响获得2甲；若完成过悬赏改为4"},"gh_poison_thrower":{"cost":2,"attack":2,"health":2,"text":"登场悬赏一个敌方随从；余响：若该目标已死亡获得4甲；否则1"},"poison_mist_thrower":{"cost":3,"attack":2,"health":3,"text":"登场：对一个敌方随从1；若它是悬赏目标，改为3"},"gh_silence_expert":{"cost":3,"attack":3,"health":4,"text":"逆脉2：沉默一个敌方随从；若目标有悬赏抽1；余响随机敌方随从2"},"broken_line_merc":{"cost":3,"attack":4,"health":3,"text":"先遣；余响：若完成过悬赏获得5甲；否则2"},"gh_venom_shield":{"cost":3,"attack":4,"health":4,"text":"格挡；登场悬赏一个敌方随从；若它已悬赏，获得+1/+1"},"bounty_accountant":{"cost":3,"attack":2,"health":3,"text":"被动：完成悬赏时恢复2；若控制隐匿随从，抽1"},"blackmarket_bodyguard":{"cost":3,"attack":3,"health":4,"text":"格挡；余响：若完成过悬赏，随机敌方随从3；否则1"},"gh_shield_broker":{"cost":4,"attack":4,"health":5,"text":"格挡；余响获得3甲；若完成过悬赏改为5"},"gh_silencer":{"cost":5,"attack":3,"health":5,"text":"登场：沉默一个敌方随从；若它是悬赏目标抽1；余响获得3甲"},"gh_scorpion":{"cost":5,"attack":5,"health":6,"text":"格挡；登场悬赏；余响：若该目标已死亡获得4甲；否则2"},"gh_bounty_hunter":{"cost":6,"attack":4,"health":6,"text":"登场：悬赏一个敌方随从；若已有悬赏目标抽1"},"bounty_clerk":{"cost":7,"attack":4,"health":7,"text":"登场：悬赏；若已悬赏抽1；余响：若完成过悬赏获得5甲；否则2"},"silence_informant":{"cost":8,"attack":5,"health":8,"text":"登场：沉默；若它是悬赏目标抽1；余响获得2甲"},"blood_servant":{"cost":2,"attack":1,"health":3,"text":"被动：每回合第一张战术牌后+1攻；余响：若控制魔物，随机敌方随从1"},"blood_corpse_collector":{"cost":2,"attack":2,"health":4,"text":"登场召唤1/1魔物；余响：若控制其他魔物获得1甲"},"lt_venom_thrower":{"cost":3,"attack":2,"health":2,"text":"蚀毒；登场：对一个敌方随从1；若控制魔物改为2"},"losutai_hunter":{"cost":3,"attack":2,"health":4,"text":"守备；余响：若控制其他魔物，随机敌方随从2；否则1"},"monster_overseer":{"cost":3,"attack":2,"health":3,"text":"登场召唤1/1魔物；若控制其他魔物自身+1/+1；余响获得2甲"},"venom_fang":{"cost":4,"attack":3,"health":5,"text":"先遣；余响：若控制魔物获得3甲；否则1"},"tribal_shaman":{"cost":4,"attack":3,"health":5,"text":"登场召唤一个1/1魔物；余响若控制其他魔物获得3甲"},"brood_matron":{"cost":5,"attack":3,"health":4,"text":"守备；登场召唤两个1/1；若控制其他魔物改为三个"},"snow_refugee":{"cost":1,"attack":2,"health":1,"text":"登场：对一个敌方随从1；若目标已冻结改为2"},"snow_fox_sentry":{"cost":2,"attack":2,"health":3,"text":"登场获得1甲；余响召唤一个1/1雪狐残影"},"snow_frostwind_novice":{"cost":2,"attack":1,"health":3,"text":"登场：冻结一个敌方随从；余响召唤雪狐哨兵"},"snow_icewall_guard":{"cost":3,"attack":2,"health":4,"text":"登场：冻结一个敌方随从；若控制阵型，改为冻结所有敌方"},"snow_coldwind_assassin":{"cost":4,"attack":3,"health":4,"text":"登场：对一个已冻结敌方随从4；否则冻结它；余响召唤雪狐"},"snow_priest":{"cost":4,"attack":2,"health":5,"text":"登场：冻结一个敌方随从；余响召唤雪狐"},"frost_scribe":{"cost":4,"attack":3,"health":5,"text":"登场：若本回合冻结过敌方抽1；余响获得2甲"},"snow_frostclaw":{"cost":4,"attack":2,"health":5,"text":"登场：冻结一个敌方随从；余响召唤雪狐"},"frost_line_guard":{"cost":4,"attack":3,"health":4,"text":"守备；登场：若本回合冻结过敌方获得3甲；否则1"},"frost_page":{"cost":4,"attack":2,"health":4,"text":"登场预兆一张战术；被动每回合第一张战术+1攻"},"snow_storm_hunter":{"cost":4,"attack":2,"health":4,"text":"登场：对一个敌方随从2并冻结；若它已冻结抽1"},"snow_guard_captain":{"cost":5,"attack":3,"health":4,"text":"登场：冻结一个敌方随从；若控制雪狐，召唤一个雪狐"},"snow_windweaver":{"cost":5,"attack":4,"health":5,"text":"被动：每回合第一张战术使自身+0/+1；余响召唤雪狐"},"echo_adept":{"cost":8,"attack":5,"health":6,"text":"登场：冻结一个敌方随从；若本回合施放过战术抽1；若目标已冻结再抽1"},"snow_medic":{"cost":1,"attack":1,"health":2,"text":"余响：若控制阵型抽1；否则获得1甲"},"fog_sailor":{"cost":1,"attack":2,"health":2,"text":"被动：同阵位每有一个其他友方，本随从+1攻；余响抽1"},"archive_guard":{"cost":2,"attack":2,"health":3,"text":"守备；余响：若控制阵型抽1；否则获得1甲"},"archive_scribe":{"cost":2,"attack":1,"health":3,"text":"余响：抽1；若手牌≤4改为抽2"},"wandering_merchant":{"cost":2,"attack":2,"health":3,"text":"登场：弃1抽1；若弃的是随从，抽2"},"vein_medic":{"cost":2,"attack":1,"health":3,"text":"余响：抽1；若流脉≥4改为抽2"},"wandering_blade":{"cost":2,"attack":2,"health":3,"text":"先遣；余响获得2甲；若本回合攻击过改为4"},"white_reef_keeper":{"cost":2,"attack":1,"health":4,"text":"守备；余响抽1；若控制守备随从再抽1"},"white_reef_lighthouse":{"cost":2,"attack":1,"health":4,"text":"守备；余响恢复1；若同阵位有其他友方改为2"},"wandering_singer":{"cost":2,"attack":1,"health":4,"text":"登场抽1；余响：若控制阵型获得3甲；否则1"},"iron_engineer":{"cost":2,"attack":2,"health":3,"text":"余响抽1；若控制阵型再抽1"},"anvil_apprentice":{"cost":2,"attack":2,"health":3,"text":"登场1甲；余响获得2甲；若控制守备改为4"},"anvil_town_miner":{"cost":2,"attack":2,"health":3,"text":"登场1甲；余响：若控制阵型获得2甲"},"mist_scout":{"cost":2,"attack":2,"health":3,"text":"先遣；引脉4获得1甲；余响获得1甲"},"north_beast_tamer":{"cost":3,"attack":3,"health":3,"text":"登场掘脉1"},"bard":{"cost":3,"attack":2,"health":3,"text":"登场：预兆一张牌"},"field_engineer":{"cost":3,"attack":2,"health":5,"text":"守备；余响抽1；若控制阵型再抽1"},"traveling_healer":{"cost":3,"attack":2,"health":4,"text":"登场恢复2；余响获得2甲；若本回合治疗过领袖改为4"},"neutral_wayfarer":{"cost":3,"attack":3,"health":4,"text":"先遣；余响获得3甲；若控制阵型改为5"},"gh_shield_mercenary":{"cost":3,"attack":3,"health":4,"text":"格挡；余响获得2甲；若控制阵型改为4"},"vein_warden":{"cost":3,"attack":2,"health":5,"text":"守备；余响获得3甲；若流脉≥4改为5"},"free_merc":{"cost":3,"attack":3,"health":3,"text":"登场1甲；余响获得2甲；若控制阵型改为4"},"mercenary":{"cost":3,"attack":4,"health":3,"text":"登场1甲；余响获得1甲"},"xh_blood_tax":{"cost":3,"attack":2,"health":3,"text":"登场抽1；余响抽1；若手牌≤4再抽1"},"card_shark":{"cost":3,"attack":4,"health":3,"text":"登场抽1；余响抽1；若控制阵型再抽1"},"snow_capital_remnant":{"cost":3,"attack":2,"health":3,"text":"登场恢复2；若控制阵型抽1"},"fog_accountant":{"cost":3,"attack":2,"health":4,"text":"登场抽1；余响获得2甲；若控制阵型改为4"},"mist_harbor_city":{"cost":3,"attack":3,"health":4,"text":"登场1甲；余响获得2甲；若控制阵型改为4"},"caravan_guard":{"cost":4,"attack":3,"health":5,"text":"守备；余响获得2甲；若控制阵型改为3"},"small_state_envoy":{"cost":4,"attack":3,"health":4,"text":"登场1甲；余响获得2甲；若控制阵型改为4"},"sky_ship":{"cost":5,"attack":4,"health":5,"text":"先遣；余响获得3甲；若控制阵型改为5"},"emergency":{"cost":1,"text":"恢复1；若同阵位有守备随从，抽1"},"ksetra_beacon":{"cost":2,"text":"恢复2；若同阵位有其他友方，抽1"},"coordination":{"cost":2,"text":"下回合开始时获得2行动力；若本回合治疗过领袖，改为3"},"floating_route":{"cost":2,"text":"对一个敌方随从造成3伤；若同阵位有守备随从，改为4"},"medical_stretcher":{"cost":3,"text":"恢复2抽1；若本回合获得过护甲，再恢复1"},"resonance":{"cost":3,"text":"逆脉2：冻结一个敌方随从；抽1；若本回合逆脉过，再抽1"},"formation_echo":{"cost":3,"text":"抽1；若控制阵型，逆脉1：恢复领袖2"},"security_sentry":{"cost":4,"text":"恢复3；若同阵位有守备随从，改为恢复5"},"vein_echo":{"cost":4,"text":"获得4甲；若同阵位有其他友方，抽1"},"vein_siphon":{"cost":5,"text":"对一个敌方随从4伤；若它已受伤，恢复领袖2"},"coordinator_order":{"cost":6,"text":"恢复4抽1；若本回合逆脉过，再获得2甲"},"mana_surge":{"cost":1,"text":"本回合获得2行动力；若手牌中有战术牌，抽1"},"ac_arcane_insight":{"cost":2,"text":"获得2甲；若本回合已施放战术，改为4"},"debate":{"cost":2,"text":"对一个敌方随从2伤并冻结；若目标已冻结，抽1"},"supply_cache":{"cost":2,"text":"恢复3；若控制阵型，抽1"},"borrow_vein":{"cost":3,"text":"召唤一个医疗学徒；若本回合已施放战术，再召唤一个"},"ac_arcane_flood":{"cost":3,"text":"抽1；若本回合已施放战术，再抽1"},"ac_field_notes":{"cost":3,"text":"冻结一个敌方随从；若本回合已施放两张战术，改为冻结所有敌方"},"ac_spell_copy":{"cost":3,"text":"恢复2抽1；若本回合已施放战术，再恢复2"},"old_ledger":{"cost":3,"text":"预兆一张战术牌；若它是刻脉牌，抽1"},"ac_knowledge_burst":{"cost":3,"text":"抽1；若本回合已施放战术，复原1点行动力"},"armor_break":{"cost":3,"text":"对一个敌方随从1伤并冻结；若目标已冻结，抽1"},"ac_grand_library":{"cost":4,"text":"抽2；若本回合已施放战术，再抽1"},"ac_school_bell":{"cost":4,"text":"恢复2；若控制阵型，抽1"},"vein_channel":{"cost":4,"text":"对一个敌方随从2伤；若本回合已施放战术，改为3"},"double_formula":{"cost":5,"text":"对一个敌方随从3伤并冻结；若目标已冻结，抽1"},"combo_spark":{"cost":5,"text":"对所有敌方随从1伤；若本回合已施放两张战术，改为2"},"formula_fix":{"cost":6,"text":"对所有敌方随从2伤；若本回合已施放战术，改为3"},"old_compass":{"cost":6,"text":"冻结一个敌方随从；若目标已冻结，获得4甲；否则2甲"},"ac_archive_eruption":{"cost":6,"text":"抽2；若本回合已施放两张战术，再抽2"},"smoke_screen":{"cost":6,"text":"抽2；若本回合已施放战术，再抽1"},"spellstorm":{"cost":7,"text":"对所有敌方随从造成等同于本局已使用战术牌数量（最多5）的伤害"},"vein_prism":{"cost":4,"text":"刻脉4：流脉4时该阵位友方抽1；流脉7时改为抽2并复原1行动力"},"south_pole_tracker":{"cost":2,"text":"抽1；若敌方没有随从，血祭1：再抽1"},"blood_pact":{"cost":2,"text":"血祭2：对一个敌方随从3伤；若消灭，抽1"},"xh_blood_curse":{"cost":2,"text":"抽1；若本回合受过伤害，再抽1"},"xh_blood_road":{"cost":3,"text":"对一个敌方随从2伤；若本回合受过伤害，改为3"},"reflux":{"cost":3,"text":"血祭1：获得2甲；若本回合受过伤害，改为4"},"xh_blood_feast_spell":{"cost":4,"text":"压脉2：对敌方领袖2伤；对一个敌方随从2伤"},"anti_rush":{"cost":1,"text":"恢复1；若控制守备随从，改为2"},"levy":{"cost":1,"text":"本回合获得2行动力；若控制守备随从，抽1"},"line_rotation":{"cost":1,"text":"抽1；若控制守备随从，获得1甲"},"conscription_levy":{"cost":2,"text":"使一个友方随从获得+1攻和先遣；若它是守备随从，再获得+0/+1"},"combo_shield":{"cost":2,"text":"召唤一个共和国新兵；若控制守备随从，再获得1甲"},"iron_wall":{"cost":3,"text":"镇脉2；抽1；若控制守备随从，获得2甲"},"echo_standard":{"cost":4,"text":"恢复3；若控制阵型，获得2甲"},"mist_harbor_treaty":{"cost":4,"text":"获得3甲；若控制守备随从，抽1"},"house_legacy":{"cost":5,"text":"镇脉3：获得等量护甲；若实际消耗3，恢复2"},"impeachment":{"cost":6,"text":"抽1；若控制阵型，获得3甲；若控制守备随从，再抽1"},"barrage":{"cost":1,"text":"对一个敌方随从2伤；若你有护甲，改为3"},"conscription_order":{"cost":2,"text":"每有一个敌方随从获得1甲；若你有护甲，改为2"},"war_tax":{"cost":2,"text":"获得1甲；若你有护甲，抽1"},"ironflow_charge":{"cost":2,"text":"使一个友方随从获得先遣；若它在本回合死亡，抽1"},"quarantine":{"cost":2,"text":"下回合敌方领袖不能使用技能；若你有护甲，抽1"},"mobilize":{"cost":3,"text":"本回合获得1行动力；下回合开始再获得1；若控制阵型，抽1"},"powder_keg":{"cost":3,"text":"对所有随从造成3伤；若你有护甲，改为4"},"armor_recycle":{"cost":3,"text":"镇脉2：获得等量护甲；若实际消耗2，再获得1甲"},"armor_mortar":{"cost":3,"text":"消耗3甲，对敌方领袖造成4伤；若你护甲≥6，改为6"},"fortress":{"cost":3,"text":"使一个友方随从获得连携；若它有守备，该随从获得+0/+1"},"martial_court":{"cost":4,"text":"每有一个敌方随从获得1甲；若你有护甲，改为2"},"commission_advance":{"cost":2,"text":"抽1；若你本回合使用过其他牌，获得1行动力"},"gh_quick_strike":{"cost":2,"text":"使一个友方随从获得+1攻和先遣；若它是悬赏目标，抽1"},"venom_blade":{"cost":2,"text":"获得1甲抽1；若本回合完成过悬赏，再获得1甲"},"gh_bodyguard_contract":{"cost":2,"text":"抽1；若你本回合完成过悬赏，再抽1"},"toll_account":{"cost":2,"text":"悬赏一个敌方随从；抽1；若它已悬赏，改为抽2"},"gh_assassinate_contract":{"cost":3,"text":"对一个敌方随从3伤；若它是悬赏目标，改为消灭"},"gh_execution_contract":{"cost":3,"text":"消灭一个悬赏名单上的敌方随从；若名单为空，抽1"},"gh_ledger":{"cost":3,"text":"抽1；若你完成过悬赏，再抽1"},"ledger_constitution":{"cost":3,"text":"逆脉2：获得4甲；若实际消耗2，再抽1"},"gh_bounty_verdict":{"cost":4,"text":"抽1；若你本回合完成过悬赏，再抽1；并对敌方领袖1伤"},"reborn_rite":{"cost":1,"text":"对所有敌方随从1伤；若你控制魔物，改为2"},"lt_venom_mist":{"cost":2,"text":"对所有敌方随从2伤；若你控制魔物，改为3"},"lt_tide_birth":{"cost":2,"text":"抽1；流脉+2；若你控制魔物，再抽1"},"lt_tide_surge":{"cost":4,"text":"对所有敌方随从1伤抽1；若你控制魔物，再抽1"},"lt_brood_call":{"cost":5,"text":"召唤一个3/3巨兽；若你控制其他魔物，再召唤一个"},"lt_tide_colossus":{"cost":5,"text":"压脉2：获得2甲；抽1；若你控制魔物，再获得1甲"},"lt_reborn_behemoth":{"cost":6,"text":"使一个友方随从获得回潮；抽1；若它是魔物，该随从获得+1/+1"},"lt_deep_beast":{"cost":6,"text":"对所有敌方随从2伤抽1；若你控制魔物，再抽1"},"north_trail":{"cost":1,"text":"冻结一个敌方随从；若目标已冻结，获得2甲"},"gok_lamp":{"cost":1,"text":"恢复1；本回合你的随从不能被冻结；若控制雪狐，抽1"},"world_map":{"cost":2,"text":"抽1；若你控制雪狐，再抽1；下回合开始时行动力-1"},"snow_freeze_touch":{"cost":2,"text":"冻结一个敌方随从；若目标已冻结，获得2甲"},"mist_bargain":{"cost":2,"text":"冻结一个敌方随从；若目标已冻结，抽1"},"snow_wind_strike":{"cost":2,"text":"冻结一个敌方随从；获得1甲；若目标已冻结，再获得2甲"},"frost_seal":{"cost":3,"text":"冻结一个敌方随从；若目标已冻结，获得4甲；否则2甲"},"snow_gale":{"cost":3,"text":"冻结一个敌方随从；获得2甲；若你控制雪狐，再获得1甲"},"reef_signal":{"cost":3,"text":"冻结一个敌方随从；若它是悬赏目标，抽1"},"snow_frost_veil":{"cost":3,"text":"冻结一个敌方随从；若目标已冻结，抽1；否则获得1甲"},"snow_ice_wall":{"cost":4,"text":"冻结一个敌方随从；获得3甲；若目标已冻结，再获得2甲"},"snow_wind_step":{"cost":4,"text":"冻结一个敌方随从；若目标已冻结，抽2；否则抽1"},"snow_time_stop":{"cost":5,"text":"冻结一个敌方随从；若目标已冻结，获得4甲；否则2甲"},"smuggler_ship":{"cost":5,"text":"冻结一个敌方随从；抽1；若目标已冻结，再抽1"},"anvil_quench":{"cost":5,"text":"冻结一个敌方随从；若目标已冻结，获得5甲；否则3甲"},"dusk_inn":{"cost":5,"text":"冻结一个敌方随从；若你控制雪狐，获得2甲"},"snow_ice_lance":{"cost":6,"text":"冻结一个敌方随从；对所有已冻结敌方随从造成2伤；抽1"},"snow_aurora":{"cost":6,"text":"冻结所有敌方随从；抽2"},"snow_blizzard":{"cost":7,"text":"对所有敌方随从造成2伤并冻结；若本回合已冻结过，改为3伤"},"snow_last_snow":{"cost":7,"text":"冻结所有敌方随从；抽2；每冻结一个敌方随从，获得1甲"},"time_loan":{"cost":1,"text":"涨脉2：本回合行动力+2，流脉+2；下回合行动力-1"},"vein_surge":{"cost":2,"text":"掘脉2；若流脉达到7，改为抽3"},"dark_route":{"cost":3,"text":"抽2；若你控制阵型，再抽1"},"snow_lamp_rite":{"cost":4,"text":"恢复3抽1；若控制阵型，改为恢复5"},"losutai_tide":{"cost":5,"text":"抽1；若你控制魔物，再抽1；否则获得1甲"},"astral_gate":{"cost":6,"text":"召唤两个3/3星界守卫；若控制阵型，改为召唤三个"},"vein_tithe":{"cost":6,"text":"获得3甲；掘脉2"},"moonfall":{"cost":8,"text":"对所有敌方随从造成4伤；抽1；若你控制阵型，再获得2甲"},"formation_watcher":{"cost":2,"text":"该阵位友方随从固定获得+1/+1"},"formation_bastion":{"cost":2,"text":"该阵位友方随从+0/+1；若该阵位有守备随从，改为+1/+1"},"formation_bugler":{"cost":2,"text":"该阵位友方随从获得血偿；你每回合第一次恢复领袖生命时，该阵位随机友方+0/+1"},"formation_officer":{"cost":3,"text":"该阵位友方随从获得回潮；若你本回合治疗过领袖，召唤一个1/1"},"formation_artificer":{"cost":3,"text":"该阵位友方随从获得守备"},"formation_weaver":{"cost":3,"text":"该阵位友方随从获得守备；你每回合第一次获得护甲时，该阵位随机友方+0/+1"},"formation_vein":{"cost":4,"text":"该阵位友方随从固定获得+0/+2"},"council_gallery":{"cost":4,"text":"该阵位友方随从+0/+1；若该阵位有另一个友方随从，改为+0/+2"},"school_debate":{"cost":2,"text":"该阵位友方随从+1攻并获得连携"},"archive_search":{"cost":2,"text":"该阵位友方随从+0/+1；你施放战术后，该阵位随机友方+1攻（每回合一次）"},"formation_script":{"cost":2,"text":"该阵位友方随从获得守备"},"double_column_note":{"cost":3,"text":"该阵位友方随从+0/+1；你每回合第一张战术牌后，该阵位随机友方+0/+1"},"floating_library":{"cost":3,"text":"该阵位友方随从固定获得+1/+1"},"prohibition":{"cost":3,"text":"该阵位友方随从获得连携；若你本回合施放过战术，再+1攻"},"insight":{"cost":4,"text":"该阵位友方随从获得先遣；若你本回合施放过战术，抽1（每回合一次）"},"formation_tide":{"cost":2,"text":"该阵位友方随从固定获得+2攻"},"blood_contract":{"cost":2,"text":"该阵位友方随从+0/+1；你本回合失去过生命时，改为+1/+1"},"blood_feast":{"cost":2,"text":"该阵位友方随从获得先遣；若你本回合失去过生命，+1攻"},"blood_ritual":{"cost":3,"text":"该阵位友方随从获得血偿"},"xh_castle_pact":{"cost":4,"text":"该阵位友方随从+1攻并获得先遣"},"xh_blood_moon_altar":{"cost":4,"text":"该阵位友方随从获得先遣；若你本回合受过伤害，抽1（每回合一次）"},"battlefield_bill":{"cost":2,"text":"该阵位友方随从获得守备"},"phalanx_warden":{"cost":2,"text":"该阵位友方随从获得血偿"},"no_mans_land":{"cost":2,"text":"该阵位友方随从获得先遣；若该阵位有守备随从，+1攻"},"fortify":{"cost":2,"text":"该阵位友方随从+0/+1；若你控制守备随从，改为+1/+1"},"wayfarer_camp":{"cost":3,"text":"该阵位友方随从+1攻并获得守备"},"emergency_bill":{"cost":3,"text":"该阵位友方随从获得守备；你每回合第一次获得护甲时，该阵位随机友方+0/+1"},"parliament_debate":{"cost":3,"text":"该阵位友方随从获得连携"},"martial_law":{"cost":4,"text":"该阵位友方随从固定获得+1/+1"},"volley":{"cost":4,"text":"该阵位友方随从获得回潮"},"formation_wall":{"cost":4,"text":"该阵位友方随从+0/+1；若该阵位有守备随从，获得回潮"},"battlefield_salvage":{"cost":2,"text":"该阵位友方随从+0/+1；若你有护甲，改为+1/+1"},"armor_drive":{"cost":2,"text":"该阵位友方随从获得守备"},"blackridge_mine":{"cost":3,"text":"该阵位友方随从固定获得+1/+1"},"formation_cannon":{"cost":4,"text":"该阵位友方随从获得先遣"},"zone_barrage":{"cost":4,"text":"该阵位友方随从获得回潮"},"armor_volley":{"cost":6,"text":"该阵位友方随从+1攻；你镇脉后，该阵位随机友方+1攻（每回合一次）"},"gh_bounty_notice":{"cost":1,"text":"该阵位友方随从固定获得+1攻"},"lamp_post":{"cost":2,"text":"该阵位友方随从+0/+1；你完成悬赏后，该阵位随机友方+1/+1（每回合一次）"},"gh_silence_field":{"cost":3,"text":"该阵位友方随从+1攻并获得隐匿"},"gh_formation":{"cost":3,"text":"该阵位友方随从获得隐匿；若你控制悬赏目标，+1攻"},"gh_silence_master":{"cost":5,"text":"该阵位友方随从+0/+1；你每回合第一次沉默敌方随从时，该阵位随机友方+1/+1"},"gh_company":{"cost":6,"text":"该阵位友方随从获得先遣；若你完成过悬赏，+1攻"},"gh_venom_behemoth":{"cost":7,"text":"该阵位友方随从获得血偿"},"monster_summon":{"cost":3,"text":"该阵位友方随从获得蚀毒"},"monster_nest":{"cost":3,"text":"该阵位友方随从+0/+1并获得先遣；若它是魔物，+1攻"},"lt_hatchery":{"cost":4,"text":"该阵位友方随从获得守备"},"blood_pool":{"cost":4,"text":"该阵位友方随从+1攻并获得先遣"},"snow_icewall_formation":{"cost":2,"text":"该阵位友方随从攻击已冻结随从时+1攻"},"snow_time_array":{"cost":2,"text":"该阵位友方随从获得连携"},"snow_tundra_hunt":{"cost":3,"text":"该阵位友方随从获得回潮"},"snow_wind_altar":{"cost":3,"text":"该阵位友方随从固定获得+1/+1"},"white_frost_hall":{"cost":4,"text":"该阵位友方随从+0/+1；若你本回合冻结过敌方随从，改为+1/+1"},"snow_throne":{"cost":4,"text":"该阵位友方随从获得先遣"},"snow_windwall":{"cost":4,"text":"该阵位友方随从+1攻并获得守备"},"snow_frozen_court":{"cost":5,"text":"该阵位友方随从获得守备；你冻结敌方随从后，该阵位随机友方+0/+1（每回合一次）"},"snow_last_tundra":{"cost":5,"text":"该阵位友方随从攻击已冻结随从时+2攻"},"white_reef_light":{"cost":2,"text":"该阵位友方随从获得连携"},"mist_pier":{"cost":2,"text":"该阵位友方随从+0/+1并获得血偿"},"north_hunt_camp":{"cost":3,"text":"该阵位友方随从获得回潮"},"gok_lamp_row":{"cost":3,"text":"该阵位友方随从+1攻并获得连携"},"no_mans_camp":{"cost":3,"text":"该阵位友方随从+1攻；若该阵位有另一个友方随从，改为+2攻"},"smugglers_dock":{"cost":3,"text":"该阵位友方随从获得回潮；若你控制隐匿随从，+0/+1"},"anvil_forge_row":{"cost":3,"text":"该阵位友方随从获得血偿；若你控制守备随从，+0/+1"},"snow_warmhouse":{"cost":3,"text":"该阵位友方随从获得先遣"},"dusk_inn_yard":{"cost":3,"text":"该阵位友方随从获得连携；若你本回合施放过战术，+1攻"},"gh_black_market":{"cost":3,"text":"该阵位友方随从获得回潮；若你完成过悬赏，+1攻"},"losutai_pool":{"cost":4,"text":"该阵位友方随从固定获得+0/+3"},"world_edge_camp":{"cost":5,"text":"该阵位友方随从固定获得+2/+1"},"grey_ledger_post":{"cost":6,"text":"该阵位友方随从固定获得+0/+2和守备"},"forgotten_gate":{"cost":8,"text":"该阵位友方随从获得格挡和先遣"},"floating_anchor":{"cost":2,"text":"回合开始时恢复1生命"},"tide_ward_bracer":{"cost":3,"text":"友方随从+1生命；你每回合第一次治疗领袖时，抽1"},"formation_standard":{"cost":3,"text":"所有友方随从+1生命；若你控制阵型，再+0/+1"},"five_department_badge":{"cost":4,"text":"回合开始恢复1生命；你每回合第一张战术牌后获得1甲"},"ksetra_beacon_item":{"cost":4,"text":"所有友方随从+1生命；若你控制守备随从，回合开始恢复1"},"vein_heart":{"cost":4,"text":"回合开始恢复2生命；若你满血，改为获得2甲"},"academy_inkwell":{"cost":2,"text":"你每回合第一张战术牌后抽1"},"frostweave_cloak":{"cost":2,"text":"施放战术后抽1（每回合一次）"},"floating_ink_blade":{"cost":4,"text":"所有友方随从+1攻；你每回合第一张战术牌后抽1"},"spell_codex":{"cost":4,"text":"每回合第一张战术牌后抽1；若它是刻脉牌，获得1甲"},"whitefrost_bell":{"cost":4,"text":"友方随从+1生命；你每回合第一张战术牌后抽1"},"cataloging_lens":{"cost":4,"text":"所有友方随从+1生命；若你手牌≥6，改为+2生命"},"blood_censer":{"cost":3,"text":"友方随从+1攻；你本回合失去过生命时，回合开始恢复1"},"bloodbone_pauldron":{"cost":3,"text":"所有友方随从+1攻；若你本回合失去过生命，再+1攻"},"beast_hide_armor":{"cost":4,"text":"所有友方随从+1/+1；你每回合第一次失去生命时抽1"},"bloodmoon_bone_ring":{"cost":4,"text":"友方随从+1攻；你每回合第一次血祭后恢复2"},"blood_scythe":{"cost":4,"text":"回合开始时所有友方随从+1攻；若你生命≤15，改为+1/+1"},"bone_fang_blade":{"cost":4,"text":"友方随从+1攻；你每回合第一次压脉后恢复1"},"bluegold_breastplate":{"cost":3,"text":"回合开始时获得1甲"},"republic_seal":{"cost":3,"text":"友方随从+1生命；若你控制守备随从，回合开始获得1甲"},"border_lance":{"cost":3,"text":"友方随从+1生命；你每回合第一次获得护甲时，抽1"},"seven_cities_crest":{"cost":4,"text":"友方随从+1生命；回合开始时获得1甲"},"house_longsword":{"cost":4,"text":"所有友方随从+1/+1；若你控制守备随从，改为+1/+2"},"iron_banner":{"cost":4,"text":"回合开始时使一名友方随从获得格挡；若你控制阵型，再获得+0/+1"},"blackridge_heavy_armor":{"cost":2,"text":"生命上限+3"},"ministry_map":{"cost":3,"text":"回合开始时获得1甲；若你有护甲，施放战术后抽1"},"armor_forge":{"cost":3,"text":"回合开始时获得2甲；若你镇脉过，改为3甲"},"powder_engine":{"cost":4,"text":"回合开始时获得2甲；若你护甲≥5，抽1"},"furnace_heart":{"cost":4,"text":"所有友方随从+1攻；你每回合第一次镇脉后恢复1"},"iron_order_hammer":{"cost":4,"text":"所有友方随从+1攻；回合开始时获得1甲"},"brokenline_dagger":{"cost":3,"text":"友方随从+1攻；你每回合第一次悬赏后抽1"},"gh_ledger_chain":{"cost":3,"text":"友方随从+1攻；你完成悬赏后获得1甲（每回合一次）"},"sealing_wax":{"cost":4,"text":"回合开始时对一个随机敌方随从造成1伤；若它是悬赏目标，改为2"},"gh_bounty_board":{"cost":4,"text":"回合开始时随机悬赏一个敌方随从；若已有悬赏目标，抽1"},"ledger_paperknife":{"cost":4,"text":"所有友方随从+1攻；你每回合第一张战术牌后抽1"},"blackmarket_bracer":{"cost":4,"text":"施放战术后抽1（每回合一次）"},"lt_venom_pouch":{"cost":3,"text":"所有友方随从+1攻"},"gh_venom_vial":{"cost":3,"text":"友方随从+1攻；若它是魔物，施放战术后抽1"},"lt_tide_bell":{"cost":3,"text":"回合开始时获得1甲；若你控制魔物，施放战术后抽1"},"lt_tide_totem":{"cost":3,"text":"友方随从+1生命；若你控制魔物，回合开始时获得1甲"},"lt_brood_armor":{"cost":4,"text":"所有友方随从+1/+1；若它是魔物，再+0/+1"},"lt_deep_eye":{"cost":4,"text":"回合开始时召唤一个1/1魔物；若你控制其他魔物，改为召唤3/3巨兽"},"snow_iceblade":{"cost":2,"text":"施放战术后抽1（每回合一次）"},"snow_frostplate":{"cost":3,"text":"回合开始时获得1甲；若你本回合冻结过敌方，改为恢复1生命"},"frost_prism":{"cost":3,"text":"回合开始时恢复1生命；若你本回合冻结过敌方，抽1"},"snow_tundrabracer":{"cost":4,"text":"友方随从+1生命；回合开始时恢复1生命"},"snow_ember":{"cost":4,"text":"回合开始时随机冻结一个敌方随从；若目标已冻结，抽1"},"snow_hourglass":{"cost":5,"text":"回合开始时恢复1生命；若你本回合冻结过敌方，再获得1甲"},"white_reef_lamp_oil":{"cost":1,"text":"回合开始时恢复1生命"},"northern_bone_flute":{"cost":2,"text":"回合开始时恢复1生命"},"fog_harbor_ticket":{"cost":2,"text":"施放战术后抽1（每回合一次）"},"wanderer_charm":{"cost":3,"text":"所有友方随从+2生命"},"gambler_dice":{"cost":3,"text":"所有友方随从+1生命；若你手牌≥6，改为+2生命"},"anvil_bracer":{"cost":3,"text":"所有友方随从+1攻"},"world_map_item":{"cost":4,"text":"回合开始时恢复1生命；若你控制阵型，抽1"},"no_mans_land_deed":{"cost":4,"text":"所有友方随从+1/+1"},"sky_ship_ticket":{"cost":4,"text":"回合开始时恢复1生命；若你控制阵型，获得1甲"},"snow_capital_lamp":{"cost":4,"text":"回合开始时获得1甲"},"dusk_inn_key":{"cost":4,"text":"回合开始时获得+1生命上限；若你满血，改为抽1"},"smuggler_anchor":{"cost":8,"text":"回合开始时对所有敌方随从造成2伤；若你控制阵型，改为3伤"},"blood_infiltrator":{"cost":1,"text":"本回合不能再使用卡牌；完成免罚；未完成受到2伤"},"hunt_ritual":{"cost":1,"text":"本回合不能再摆放随从；完成免罚；未完成受到2伤"},"xh_blood_guard":{"cost":1,"text":"本回合不能再使用战术卡；完成免罚；未完成受到3伤"},"blood_debt":{"cost":2,"text":"本回合再打出2张牌；完成免罚；未完成受到2伤"},"xh_blood_brewer":{"cost":2,"text":"本回合再打出1张牌；完成免罚抽1；未完成受到2伤"},"shadow_raid":{"cost":2,"text":"本回合摆放2个随从；完成免罚；未完成受到3伤"},"blood_imp":{"cost":2,"text":"本回合摆放1个随从；完成免罚；未完成受到2伤"},"blood_incense_divination":{"cost":2,"text":"本回合使用1张战术卡；完成免罚；未完成受到3伤"},"xh_alley_blade":{"cost":2,"text":"本回合使用2张战术卡；完成免罚抽1；未完成受到2伤"},"blood_path":{"cost":2,"text":"本回合发起1次攻击；完成免罚；未完成受到2伤"},"xh_bone_hunter":{"cost":2,"text":"本回合不能再使用卡牌；完成免罚抽1；未完成受到3伤"},"blood_wraith":{"cost":2,"text":"本回合不能再摆放随从；完成免罚获得1甲；未完成受到4伤"},"monster_command":{"cost":1,"text":"本回合不能攻击；完成免罚；未完成受到3伤"},"lt_reborn_rite":{"cost":1,"text":"本回合不能攻击；完成免罚召唤1/1魔物；未完成受到2伤"},"lt_brood_attendant":{"cost":1,"text":"本回合不能再使用卡牌；完成免罚；未完成受到3伤"},"lt_hatch_guard":{"cost":1,"text":"本回合不能再摆放随从；完成免罚获得1甲；未完成受到3伤"},"lt_tide_warden":{"cost":1,"text":"本回合不能再使用战术卡；完成免罚；未完成受到3伤"},"lt_hatch":{"cost":2,"text":"本回合再打出2张牌；完成免罚；未完成受到3伤"},"lt_tide_spawn":{"cost":2,"text":"本回合再打出1张牌；完成免罚召唤1/1魔物；未完成受到2伤"},"lt_venom_fang":{"cost":2,"text":"本回合再打出3张牌；完成免罚；未完成受到4伤"},"lt_deep_sentinel":{"cost":2,"text":"本回合发起1次攻击；完成免罚获得1甲；未完成受到2伤"},"lt_venom_nest":{"cost":2,"text":"本回合发起2次攻击；完成免罚；未完成受到3伤"},"lt_venom_larva":{"cost":2,"text":"本回合摆放3个随从；完成免罚召唤1/1魔物；未完成受到2伤"},"lt_tide_hunter":{"cost":2,"text":"本回合摆放2个随从；完成免罚；未完成受到3伤"},"lt_bone_scavenger":{"cost":2,"text":"本回合摆放1个随从；完成免罚；未完成受到2伤"},"lt_tide_pool":{"cost":2,"text":"本回合使用2张战术卡；完成免罚；未完成受到4伤"},"lt_bone_warlock":{"cost":2,"text":"本回合使用1张战术卡；完成免罚获得1甲；未完成受到3伤"},"blood_altar":{"cost":2,"text":"本回合使用3张战术卡；完成免罚召唤1/1魔物；未完成受到4伤"}};
  for (const [id, v] of Object.entries(PATCH2)) { const c = CARDS[id]; if (!c) continue; if (v.cost != null) c.cost = v.cost; if (v.attack != null && c.type === "minion") { c.attack = v.attack; c.health = v.health; c.maxHealth = v.health; } if (v.text) c.text = v.text; }

  // ===== 2A 效果转译（条件+ops） =====
  const PATCH2A_EFFECTS = {"medic_apprentice":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"sameZoneAlly","then":[{"op":"armor","amount":3}]}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"survey_apprentice":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"coordination_dispatcher":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"guard":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"ksetra_instructor":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"sameZoneTaunt","then":[{"op":"armor","amount":2}]}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"research_sampler":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"zone_keeper":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"pulse_recorder":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","cond":"vein","value":7,"then":[{"op":"armor","amount":3}]}]}},"reflux_physician":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2}]},"reflux":2},"pulse_banner":{"reflux":2,"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":3}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"arcane_scribe":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells","then":[{"op":"armor","amount":4}]}]}},"cassian_foreign":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":4}]}]}},"spell_novice":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells","then":[{"op":"armor","amount":3}]}]}},"gok_engineer":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":2}]}]}},"magic_lecturer":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":3}]}]}},"zone_archivist":{"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":1}]}},"arcane_conduit":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1,"target":"enemy"}]}},"pure_theorist":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells2","then":[{"op":"armor","amount":4}]}]}},"index_assistant":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":2}]}]}},"tribal_warrior":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"snow_frostclaw"}]}},"blood_duelist":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"tookDamage","then":[{"op":"damageRandomEnemy","amount":2}]}]}},"broken_bone_warlord":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"lostHealth","then":[{"op":"buffSelf","attack":1,"health":1}]}]}},"xh_blood_mist":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"tookDamage","then":[{"op":"summon","token":"medic_apprentice"}]}]},"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":2}]}},"xh_blood_steward":{"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":2}]}},"ancient_fortress_scion":{"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":3}]}},"wall_recruit":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlTaunt","then":[{"op":"summon","token":"republic_recruit"}],"else":[{"op":"armor","amount":1}]}]}},"recruiter":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"sameZoneAlly","then":[{"op":"armor","amount":2}]}]}},"republic_guard":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"healHero","amount":3}],"else":[{"op":"armor","amount":2}]}]}},"eisenhut_newmoney":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"shield_bearer":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"armorGained","then":[{"op":"armor","amount":3}]}]}},"shield_instructor":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"drill_sergeant":{"battlecry":{"type":"ops","ops":[{"op":"zhenmai","amount":2}]}},"bulwark_sentry":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"line_spearman":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":4}]}},"powder_boy":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"damageTarget","amount":1,"target":"enemy"}]}]}},"quartermaster":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"forge_engineer":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":2}]}]}},"forge_technician":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"armorGained","then":[{"op":"armor","amount":2}]}]}},"imperial_guard_officer":{"battlecry":{"type":"ops","ops":[{"op":"zhenmai","amount":2}]}},"grain_convoy":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"armory_keeper":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"gh_contract_squire":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"markBountyTarget","target":"enemy"}]}]}},"venom_attendant":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"gh_venom_apprentice":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget","target":"enemy"}]}},"gh_cutthroat":{"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"damageRandomEnemy","amount":2}]}]}},"gh_rush_archer":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"gh_poison_thrower":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget","target":"enemy"}]}},"poison_mist_thrower":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1,"target":"enemy"}]}},"gh_silence_expert":{"reflux":2,"battlecry":{"type":"ops","ops":[{"op":"silenceTarget","target":"enemy"}]},"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":2}]}},"gh_venom_shield":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget","target":"enemy"},{"op":"if","cond":"targetBounty","then":[{"op":"buffSelf","attack":1,"health":1}]}]}},"blackmarket_bodyguard":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"bountyCompleted","then":[{"op":"damageRandomEnemy","amount":3}]}]}},"gh_shield_broker":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"gh_silencer":{"battlecry":{"type":"ops","ops":[{"op":"silenceTarget","target":"enemy"}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"gh_scorpion":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget","target":"enemy"}]}},"gh_bounty_hunter":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget","target":"enemy"}]}},"bounty_clerk":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget","target":"enemy"}]}},"silence_informant":{"battlecry":{"type":"ops","ops":[{"op":"silenceTarget","target":"enemy"}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"blood_servant":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlDemon","then":[{"op":"damageRandomEnemy","amount":1}]}]}},"blood_corpse_collector":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]}},"lt_venom_thrower":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1,"target":"enemy"}]}},"losutai_hunter":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"otherDemon","then":[{"op":"damageRandomEnemy","amount":2}]}]}},"monster_overseer":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"tribal_shaman":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]}},"brood_matron":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]}},"snow_refugee":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1,"target":"enemy"}]}},"snow_fox_sentry":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry_echo"}]}},"snow_frostwind_novice":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget","target":"enemy"}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"snow_icewall_guard":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget","target":"enemy"},{"op":"if","cond":"controlFormation","then":[{"op":"freezeAllEnemies"}]}]}},"snow_coldwind_assassin":{"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"snow_priest":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget","target":"enemy"}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"frost_scribe":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"snow_frostclaw":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget","target":"enemy"}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"snow_storm_hunter":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":2,"target":"enemy"}]}},"snow_guard_captain":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget","target":"enemy"},{"op":"if","then":[{"op":"summon","token":"snow_fox_sentry"}]}]}},"snow_windweaver":{"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"echo_adept":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget","target":"enemy"}]}},"wandering_blade":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"white_reef_lighthouse":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"anvil_apprentice":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"mist_scout":{"veinBonus":4,"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"traveling_healer":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"neutral_wayfarer":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"gh_shield_mercenary":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"vein_warden":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"free_merc":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"mercenary":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"snow_capital_remnant":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"fog_accountant":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"mist_harbor_city":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"caravan_guard":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"small_state_envoy":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"sky_ship":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}}};
  for (const [id, e] of Object.entries(PATCH2A_EFFECTS)) { const c = CARDS[id]; if (!c) continue; for (const k of ["battlecry","deathrattle"]) if (e[k]) c[k] = e[k]; if (e.reflux != null) c.reflux = e.reflux; if (e.veinBonus != null) c.veinBonus = e.veinBonus; }

  // ===== 2A 效果转译：第二轮 =====
  const PATCH2A_EFFECTS_V2 = {"medic_apprentice":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"sameZoneAlly","then":[{"op":"armor","amount":3}]}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"survey_apprentice":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"coordination_dispatcher":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"guard":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"ksetra_instructor":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"sameZoneTaunt","then":[{"op":"armor","amount":2}]}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"research_sampler":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"zone_keeper":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"sameZoneAlly","then":[{"op":"draw","amount":1}]}]}},"pulse_recorder":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","cond":"vein","value":7,"then":[{"op":"armor","amount":3}]}]}},"field_medic":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"reflux_physician":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2}]},"reflux":2},"pulse_banner":{"reflux":2,"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":3}]},"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":2}]}},"doorman":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"record_clerk":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"hand","value":5,"then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"formula_apprentice":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"spells","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"arcane_scribe":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":1}]}]}},"page_scholar":{"battlecry":{"type":"ops","ops":[{"op":"discover","pool":"spell"}]}},"cassian_foreign":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":4}]}]}},"spell_novice":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells","then":[{"op":"armor","amount":3}],"else":[{"op":"armor","amount":1}]}]}},"gok_engineer":{"battlecry":{"type":"ops","ops":[{"op":"discover","pool":"spell"},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"magic_lecturer":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":3}],"else":[{"op":"draw","amount":1}]}]}},"zone_archivist":{"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":1}]}},"arcane_conduit":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1}]}},"lecturer":{"battlecry":{"type":"ops","ops":[{"op":"draw","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":4}]}]}},"pure_theorist":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"spells2","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]}]}},"index_assistant":{"battlecry":{"type":"ops","ops":[{"op":"discover","pool":"spell"},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"tribal_warrior":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"snow_frostclaw"}]}},"blood_duelist":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"tookDamage","then":[{"op":"damageRandomEnemy","amount":2}]}]}},"broken_bone_warlord":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"lostHealth","then":[{"op":"buffSelf","attack":1,"health":1}]}]}},"xh_blood_mist":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"tookDamage","then":[{"op":"summon","token":"medic_apprentice"}]}]},"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":2}]}},"xh_blood_steward":{"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":2}]}},"ancient_fortress_scion":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"tookDamage","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":3}]}},"wall_recruit":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlTaunt","then":[{"op":"summon","token":"republic_recruit"}],"else":[{"op":"armor","amount":1}]}]}},"recruiter":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"sameZoneAlly","then":[{"op":"armor","amount":2}]}]}},"republic_guard":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"healHero","amount":3}],"else":[{"op":"armor","amount":2}]}]}},"eisenhut_newmoney":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"shield_bearer":{"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":3}]}]}},"reborn_shield_guard":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":3}]}]}},"shield_instructor":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlTaunt","then":[{"op":"healHero","amount":2}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"drill_sergeant":{"battlecry":{"type":"ops","ops":[{"op":"zhenmai","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"bulwark_sentry":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"healHero","amount":3}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"line_spearman":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":4}]}},"powder_boy":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"damageTarget","amount":1}]}]}},"audit_accountant":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"quartermaster":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"forge_engineer":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":2}]}]}},"detonation_sapper":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"damageAllEnemies","amount":1}],"else":[{"op":"damageRandomEnemy","amount":1}]}]}},"lab_researcher":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"ironclad":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"armor","amount":2}]}]}},"forge_technician":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":2}]}]}},"empire_guard":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"controlTaunt","then":[{"op":"armor","amount":2}]}]}},"powder_martyr":{"deathrattle":{"type":"ops","ops":[{"op":"damageHero","amount":2}]}},"imperial_guard_officer":{"battlecry":{"type":"ops","ops":[{"op":"zhenmai","amount":2}]}},"grain_convoy":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"healHero","amount":2}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"armory_keeper":{"battlecry":{"type":"ops","ops":[{"op":"if","cond":"armor","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"powder_apprentice":{"deathrattle":{"type":"ops","ops":[{"op":"damageHero","amount":2}]}},"gh_contract_squire":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"markBountyTarget"}]}]}},"venom_attendant":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"gh_venom_apprentice":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"gh_cutthroat":{"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"damageRandomEnemy","amount":2}]}]}},"gh_rush_archer":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2},{"op":"if","then":[{"op":"markBountyTarget"}]}]}},"gh_poison_thrower":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget"}]},"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":4}]}]}},"poison_mist_thrower":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1},{"op":"if","then":[{"op":"markBountyTarget"}]}]}},"gh_silence_expert":{"reflux":2,"battlecry":{"type":"ops","ops":[{"op":"silenceTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"damageRandomEnemy","amount":2}]}},"broken_line_merc":{"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":5}]}]}},"gh_venom_shield":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget"},{"op":"if","then":[{"op":"markBountyTarget"}]}]}},"blackmarket_bodyguard":{"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"damageRandomEnemy","amount":3}]}]}},"gh_shield_broker":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3},{"op":"if","then":[{"op":"markBountyTarget"}]}]}},"gh_silencer":{"battlecry":{"type":"ops","ops":[{"op":"silenceTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"gh_scorpion":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget"}]},"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":4}]}]}},"gh_bounty_hunter":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"bounty_clerk":{"battlecry":{"type":"ops","ops":[{"op":"markBountyTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":5}]}]}},"silence_informant":{"battlecry":{"type":"ops","ops":[{"op":"silenceTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"blood_servant":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlDemon","then":[{"op":"damageRandomEnemy","amount":1}]}]}},"blood_corpse_collector":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]},"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"otherDemon","then":[{"op":"armor","amount":1}]}]}},"lt_venom_thrower":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1}]}},"losutai_hunter":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"otherDemon","then":[{"op":"damageRandomEnemy","amount":2}]}]}},"monster_overseer":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"},{"op":"if","cond":"otherDemon","then":[{"op":"buffSelf","attack":1,"health":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"venom_fang":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlDemon","then":[{"op":"armor","amount":3}]}]}},"tribal_shaman":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]},"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"otherDemon","then":[{"op":"armor","amount":3}]}]}},"brood_matron":{"battlecry":{"type":"ops","ops":[{"op":"summon","token":"losutai_imp"}]}},"snow_refugee":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":1}]}},"snow_fox_sentry":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry_echo"}]}},"snow_frostwind_novice":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget"}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"snow_icewall_guard":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","cond":"controlFormation","then":[{"op":"freezeAllEnemies"}]}]}},"snow_coldwind_assassin":{"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"snow_priest":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget"}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"frost_scribe":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":1}]}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"snow_frostclaw":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget"}]},"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"frost_line_guard":{"battlecry":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":3}]}]}},"frost_page":{"battlecry":{"type":"ops","ops":[{"op":"discover","pool":"spell"}]}},"snow_storm_hunter":{"battlecry":{"type":"ops","ops":[{"op":"damageTarget","amount":2},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"snow_guard_captain":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"summon","token":"snow_fox_sentry"}]}]}},"snow_windweaver":{"deathrattle":{"type":"ops","ops":[{"op":"summon","token":"snow_fox_sentry"}]}},"echo_adept":{"battlecry":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","cond":"spells","then":[{"op":"draw","amount":1}]},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"snow_medic":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"fog_sailor":{"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1}]}},"archive_guard":{"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"archive_scribe":{"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"hand","value":4,"then":[{"op":"draw","amount":2}]}]}},"wandering_merchant":{"battlecry":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","then":[{"op":"draw","amount":2}]}]}},"vein_medic":{"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"vein","value":4,"then":[{"op":"draw","amount":2}]}]}},"wandering_blade":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"white_reef_keeper":{"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlTaunt","then":[{"op":"draw","amount":1}]}]}},"white_reef_lighthouse":{"deathrattle":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"wandering_singer":{"battlecry":{"type":"ops","ops":[{"op":"draw","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":3}]}]}},"iron_engineer":{"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"anvil_apprentice":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"anvil_town_miner":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":2}]}]}},"mist_scout":{"veinBonus":4,"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"north_beast_tamer":{"battlecry":{"type":"ops","ops":[{"op":"flowDraw","draw":1,"vein":1}]}},"bard":{"battlecry":{"type":"ops","ops":[{"op":"discover","pool":"spell"}]}},"field_engineer":{"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"traveling_healer":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"neutral_wayfarer":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"gh_shield_mercenary":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"vein_warden":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"free_merc":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"mercenary":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"xh_blood_tax":{"battlecry":{"type":"ops","ops":[{"op":"draw","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"hand","value":4,"then":[{"op":"draw","amount":1}]}]}},"card_shark":{"battlecry":{"type":"ops","ops":[{"op":"draw","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"snow_capital_remnant":{"battlecry":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"fog_accountant":{"battlecry":{"type":"ops","ops":[{"op":"draw","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"mist_harbor_city":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"caravan_guard":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"small_state_envoy":{"battlecry":{"type":"ops","ops":[{"op":"armor","amount":1}]},"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"sky_ship":{"deathrattle":{"type":"ops","ops":[{"op":"armor","amount":3}]}}};
  for (const [id, e] of Object.entries(PATCH2A_EFFECTS_V2)) { const c = CARDS[id]; if (!c) continue; for (const k of ["battlecry","deathrattle"]) if (e[k]) c[k] = e[k]; if (e.reflux != null) c.reflux = e.reflux; if (e.veinBonus != null) c.veinBonus = e.veinBonus; const raw=JSON.stringify(e); if (/damageTarget|freezeTarget|silenceTarget|markBountyTarget/.test(raw)) c.target="enemy"; }

  // ===== 2A 剩余纯被动 =====
  if (CARDS.council_elder) CARDS.council_elder.passive = { type: "firstSpellGrowth", attack: 1, health: 1 };
  if (CARDS.xh_tribe_headhunter) CARDS.xh_tribe_headhunter.passive = { type: "firstSpellGrowth", attack: 2, health: 0 };
  if (CARDS.temple_priest) CARDS.temple_priest.passive = { type: "turnArmor", amount: 1 };
  if (CARDS.rush_lancer) CARDS.rush_lancer.passive = { type: "armorAttack", attack: 1 };
  if (CARDS.bounty_accountant) CARDS.bounty_accountant.passive = { type: "bountyClaimHeal", amount: 2 };

  // ===== 2B 战术效果转译 =====
  const PATCH2B_EFFECTS = {"emergency":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":1},{"op":"if","cond":"sameZoneTaunt","then":[{"op":"draw","amount":1}]}]}},"ksetra_beacon":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"sameZoneAlly","then":[{"op":"draw","amount":1}]}]}},"coordination":{"spell":{"type":"ops","ops":[{"op":"nextMana","amount":2}]}},"floating_route":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":3}]}},"medical_stretcher":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","then":[{"op":"healHero","amount":1}]}]}},"resonance":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"draw","amount":1},{"op":"if","cond":"reflux","then":[{"op":"draw","amount":1}]}]},"reflux":2},"formation_echo":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"healHero","amount":2}]}]},"reflux":1},"security_sentry":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","cond":"sameZoneTaunt","then":[{"op":"healHero","amount":5}]}]}},"vein_echo":{"spell":{"type":"ops","ops":[{"op":"armor","amount":4},{"op":"if","cond":"sameZoneAlly","then":[{"op":"draw","amount":1}]}]}},"vein_siphon":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":4},{"op":"if","then":[{"op":"healHero","amount":2}]}]}},"coordinator_order":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":4},{"op":"if","cond":"reflux","then":[{"op":"armor","amount":2}]}]}},"mana_surge":{"spell":{"type":"ops","ops":[{"op":"mana","amount":2},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"ac_arcane_insight":{"spell":{"type":"ops","ops":[{"op":"armor","amount":2}]}},"debate":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":2},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"supply_cache":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"borrow_vein":{"spell":{"type":"ops","ops":[{"op":"summon","token":"medic_apprentice"}]}},"ac_arcane_flood":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"spells","then":[{"op":"draw","amount":1}]}]}},"ac_field_notes":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"freezeAllEnemies"}]}]}},"ac_spell_copy":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"spells","then":[{"op":"healHero","amount":2}]}]}},"old_ledger":{"spell":{"type":"ops","ops":[{"op":"discover","pool":"spell"},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"ac_knowledge_burst":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"spells","then":[{"op":"mana","amount":1}]}]}},"armor_break":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":1},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"ac_grand_library":{"spell":{"type":"ops","ops":[{"op":"draw","amount":2},{"op":"if","cond":"spells","then":[{"op":"draw","amount":1}]}]}},"ac_school_bell":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":2},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"vein_channel":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":2}]}},"double_formula":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":3},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"combo_spark":{"spell":{"type":"ops","ops":[{"op":"damageAllEnemies","amount":1}]}},"formula_fix":{"spell":{"type":"ops","ops":[{"op":"damageAllEnemies","amount":2}]}},"old_compass":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":4}]}]}},"ac_archive_eruption":{"spell":{"type":"ops","ops":[{"op":"draw","amount":2},{"op":"if","then":[{"op":"draw","amount":2}]}]}},"smoke_screen":{"spell":{"type":"ops","ops":[{"op":"draw","amount":2},{"op":"if","cond":"spells","then":[{"op":"draw","amount":1}]}]}},"vein_prism":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"draw","amount":2}]}},"south_pole_tracker":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","then":[{"op":"draw","amount":1}]}]},"bloodCost":1},"blood_pact":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":3},{"op":"if","then":[{"op":"draw","amount":1}]}]},"bloodCost":2},"xh_blood_curse":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"tookDamage","then":[{"op":"draw","amount":1}]}]}},"xh_blood_road":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":2}]}},"reflux":{"spell":{"type":"ops","ops":[{"op":"armor","amount":2}]},"bloodCost":1},"xh_blood_feast_spell":{"spell":{"type":"ops","ops":[{"op":"damageHero","amount":2},{"op":"damageTarget","amount":2}]},"pressure":2},"anti_rush":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":1}]}},"levy":{"spell":{"type":"ops","ops":[{"op":"mana","amount":2},{"op":"if","cond":"controlTaunt","then":[{"op":"draw","amount":1}]}]}},"line_rotation":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlTaunt","then":[{"op":"armor","amount":1}]}]}},"combo_shield":{"spell":{"type":"ops","ops":[{"op":"summon","token":"republic_recruit"},{"op":"if","cond":"controlTaunt","then":[{"op":"armor","amount":1}]}]}},"iron_wall":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlTaunt","then":[{"op":"armor","amount":2}]}]}},"echo_standard":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":2}]}]}},"mist_harbor_treaty":{"spell":{"type":"ops","ops":[{"op":"armor","amount":3},{"op":"if","cond":"controlTaunt","then":[{"op":"draw","amount":1}]}]}},"house_legacy":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"healHero","amount":2}]}]}},"impeachment":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":3}]},{"op":"if","cond":"controlTaunt","then":[{"op":"draw","amount":1}]}]}},"barrage":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":2}]}},"conscription_order":{"spell":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"war_tax":{"spell":{"type":"ops","ops":[{"op":"armor","amount":1},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"ironflow_charge":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":1}]}]}},"quarantine":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":1}]}]}},"mobilize":{"spell":{"type":"ops","ops":[{"op":"mana","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"armor_recycle":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"armor","amount":1}]}]}},"armor_mortar":{"spell":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"martial_court":{"spell":{"type":"ops","ops":[{"op":"armor","amount":1}]}},"commission_advance":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1}]}},"gh_quick_strike":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":1}]}]}},"venom_blade":{"spell":{"type":"ops","ops":[{"op":"armor","amount":1},{"op":"if","cond":"bountyCompleted","then":[{"op":"armor","amount":1}]}]}},"gh_bodyguard_contract":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"bountyCompleted","then":[{"op":"draw","amount":1}]}]}},"toll_account":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"targetBounty","then":[{"op":"draw","amount":2}]}]}},"gh_assassinate_contract":{"spell":{"type":"ops","ops":[{"op":"damageTarget","amount":3}]}},"gh_execution_contract":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":1}]}]}},"gh_ledger":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"bountyCompleted","then":[{"op":"draw","amount":1}]}]}},"ledger_constitution":{"spell":{"type":"ops","ops":[{"op":"armor","amount":4},{"op":"if","then":[{"op":"draw","amount":1}]}]},"reflux":2},"gh_bounty_verdict":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"bountyCompleted","then":[{"op":"draw","amount":1}]},{"op":"damageHero","amount":1}]}},"reborn_rite":{"spell":{"type":"ops","ops":[{"op":"damageAllEnemies","amount":1}]}},"lt_venom_mist":{"spell":{"type":"ops","ops":[{"op":"damageAllEnemies","amount":2}]}},"lt_tide_birth":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlDemon","then":[{"op":"draw","amount":1}]}]}},"lt_tide_surge":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlDemon","then":[{"op":"draw","amount":1}]}]}},"lt_tide_colossus":{"spell":{"type":"ops","ops":[{"op":"armor","amount":2},{"op":"draw","amount":1},{"op":"if","cond":"controlDemon","then":[{"op":"armor","amount":1}]}]},"pressure":2},"lt_reborn_behemoth":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1}]}},"lt_deep_beast":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlDemon","then":[{"op":"draw","amount":1}]}]}},"north_trail":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"gok_lamp":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":1},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"world_map":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"snow_freeze_touch":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"mist_bargain":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"snow_wind_strike":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"armor","amount":1},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"frost_seal":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":4}]}]}},"snow_gale":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"armor","amount":2},{"op":"if","then":[{"op":"armor","amount":1}]}]}},"reef_signal":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"snow_frost_veil":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"snow_ice_wall":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"armor","amount":3},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"snow_wind_step":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"draw","amount":2}]}]}},"snow_time_stop":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":4}]}]}},"smuggler_ship":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"draw","amount":1},{"op":"if","then":[{"op":"draw","amount":1}]}]}},"anvil_quench":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":5}]}]}},"dusk_inn":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":2}]}]}},"snow_ice_lance":{"spell":{"type":"ops","ops":[{"op":"freezeTarget"},{"op":"draw","amount":1}]}},"snow_aurora":{"spell":{"type":"ops","ops":[{"op":"freezeAllEnemies"},{"op":"draw","amount":2}]}},"snow_blizzard":{"spell":{"type":"ops","ops":[{"op":"damageAllEnemies","amount":2}]}},"snow_last_snow":{"spell":{"type":"ops","ops":[{"op":"freezeAllEnemies"},{"op":"draw","amount":2},{"op":"armor","amount":1}]}},"vein_surge":{"spell":{"type":"ops","ops":[{"op":"if","then":[{"op":"draw","amount":3}]}]}},"dark_route":{"spell":{"type":"ops","ops":[{"op":"draw","amount":2},{"op":"if","cond":"controlFormation","then":[{"op":"draw","amount":1}]}]}},"snow_lamp_rite":{"spell":{"type":"ops","ops":[{"op":"healHero","amount":3},{"op":"if","cond":"controlFormation","then":[{"op":"healHero","amount":5}]}]}},"losutai_tide":{"spell":{"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"controlDemon","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]}]}},"vein_tithe":{"spell":{"type":"ops","ops":[{"op":"armor","amount":3}]}},"moonfall":{"spell":{"type":"ops","ops":[{"op":"damageAllEnemies","amount":4},{"op":"draw","amount":1},{"op":"if","cond":"controlFormation","then":[{"op":"armor","amount":2}]}]}}};
  for (const [id, e] of Object.entries(PATCH2B_EFFECTS)) { const c = CARDS[id]; if (!c) continue; if (e.spell) c.spell=e.spell; if (e.reflux != null) c.reflux=e.reflux; if (e.bloodCost != null) c.bloodCost=e.bloodCost; if (e.pressure != null) c.pressure=e.pressure; const raw=JSON.stringify(e); if (/damageTarget|freezeTarget|silenceTarget|markBountyTarget|buffTarget/.test(raw)) c.target="enemy"; }

  // ===== 2C 阵型效果转译 =====
  const PATCH2C_EFFECTS = {"formation_watcher":{"formation":{"attack":1,"health":1}},"formation_bastion":{"formation":{"attack":0,"health":1,"taunt":true}},"formation_bugler":{"formation":{"attack":0,"health":1,"lifesteal":true}},"formation_officer":{"formation":{"reborn":true}},"formation_artificer":{"formation":{"taunt":true}},"formation_weaver":{"formation":{"attack":0,"health":1,"taunt":true}},"formation_vein":{"formation":{"attack":0,"health":2}},"council_gallery":{"formation":{"attack":0,"health":1}},"school_debate":{"formation":{"attack":1,"windfury":true}},"archive_search":{"formation":{"attack":0,"health":1}},"formation_script":{"formation":{"taunt":true}},"double_column_note":{"formation":{"attack":0,"health":1}},"floating_library":{"formation":{"attack":1,"health":1}},"prohibition":{"formation":{"attack":1,"windfury":true}},"insight":{"formation":{"rush":true}},"formation_tide":{"formation":{"attack":2}},"blood_contract":{"formation":{"attack":0,"health":1}},"blood_feast":{"formation":{"attack":1,"rush":true}},"blood_ritual":{"formation":{"lifesteal":true}},"xh_castle_pact":{"formation":{"attack":1,"rush":true}},"xh_blood_moon_altar":{"formation":{"rush":true}},"battlefield_bill":{"formation":{"taunt":true}},"phalanx_warden":{"formation":{"lifesteal":true}},"no_mans_land":{"formation":{"attack":1,"taunt":true,"rush":true}},"fortify":{"formation":{"attack":0,"health":1,"taunt":true}},"wayfarer_camp":{"formation":{"attack":1,"taunt":true}},"emergency_bill":{"formation":{"attack":0,"health":1,"taunt":true}},"parliament_debate":{"formation":{"windfury":true}},"martial_law":{"formation":{"attack":1,"health":1}},"volley":{"formation":{"reborn":true}},"formation_wall":{"formation":{"attack":0,"health":1,"taunt":true,"reborn":true}},"battlefield_salvage":{"formation":{"attack":0,"health":1}},"armor_drive":{"formation":{"taunt":true}},"blackridge_mine":{"formation":{"attack":1,"health":1}},"formation_cannon":{"formation":{"rush":true}},"zone_barrage":{"formation":{"reborn":true}},"armor_volley":{"formation":{"attack":1}},"gh_bounty_notice":{"formation":{"attack":1}},"lamp_post":{"formation":{"attack":0,"health":1}},"gh_silence_field":{"formation":{"attack":1,"stealth":true}},"gh_formation":{"formation":{"attack":1,"stealth":true}},"gh_silence_master":{"formation":{"attack":0,"health":1}},"gh_company":{"formation":{"attack":1,"rush":true}},"gh_venom_behemoth":{"formation":{"lifesteal":true}},"monster_summon":{"formation":{"poisonous":true}},"monster_nest":{"formation":{"attack":0,"health":1,"rush":true}},"lt_hatchery":{"formation":{"taunt":true}},"blood_pool":{"formation":{"attack":1,"rush":true}},"snow_icewall_formation":{"formation":{"attack":1}},"snow_time_array":{"formation":{"windfury":true}},"snow_tundra_hunt":{"formation":{"reborn":true}},"snow_wind_altar":{"formation":{"attack":1,"health":1}},"white_frost_hall":{"formation":{"attack":0,"health":1}},"snow_throne":{"formation":{"rush":true}},"snow_windwall":{"formation":{"attack":1,"taunt":true}},"snow_frozen_court":{"formation":{"attack":0,"health":1,"taunt":true}},"snow_last_tundra":{"formation":{"attack":2}},"white_reef_light":{"formation":{"windfury":true}},"mist_pier":{"formation":{"attack":0,"health":1,"lifesteal":true}},"north_hunt_camp":{"formation":{"reborn":true}},"gok_lamp_row":{"formation":{"attack":1,"windfury":true}},"no_mans_camp":{"formation":{"attack":1}},"smugglers_dock":{"formation":{"attack":0,"health":1,"reborn":true,"stealth":true}},"anvil_forge_row":{"formation":{"attack":0,"health":1,"taunt":true,"lifesteal":true}},"snow_warmhouse":{"formation":{"rush":true}},"dusk_inn_yard":{"formation":{"attack":1,"windfury":true}},"gh_black_market":{"formation":{"attack":1,"reborn":true}},"losutai_pool":{"formation":{"attack":0,"health":3}},"world_edge_camp":{"formation":{"attack":2,"health":1}},"grey_ledger_post":{"formation":{"attack":0,"health":2,"taunt":true}},"forgotten_gate":{"formation":{"rush":true,"divineShield":true}}};
  for (const [id, e] of Object.entries(PATCH2C_EFFECTS)) { const c=CARDS[id]; if(c) c.formation=e.formation; }

  // ===== 2D 装备效果转译 =====
  const PATCH2D_EFFECTS = {"floating_anchor":{"equipAura":{"healTurn":1}},"tide_ward_bracer":{"equipAura":{}},"formation_standard":{"equipAura":{"health":1}},"five_department_badge":{"equipAura":{}},"ksetra_beacon_item":{"equipAura":{"health":1}},"vein_heart":{"equipAura":{}},"academy_inkwell":{"equipAura":{}},"frostweave_cloak":{"equipAura":{"spellDraw":1}},"floating_ink_blade":{"equipAura":{}},"spell_codex":{"equipAura":{}},"whitefrost_bell":{"equipAura":{}},"cataloging_lens":{"equipAura":{"health":1}},"blood_censer":{"equipAura":{}},"bloodbone_pauldron":{"equipAura":{}},"beast_hide_armor":{"equipAura":{"attack":1,"health":1}},"bloodmoon_bone_ring":{"equipAura":{}},"blood_scythe":{"equipAura":{}},"bone_fang_blade":{"equipAura":{}},"bluegold_breastplate":{"equipAura":{"armorTurn":1}},"republic_seal":{"equipAura":{}},"border_lance":{"equipAura":{}},"seven_cities_crest":{"equipAura":{"armorTurn":1}},"house_longsword":{"equipAura":{"attack":1,"health":1}},"iron_banner":{"equipAura":{}},"blackridge_heavy_armor":{"equipAura":{"maxHp":3}},"ministry_map":{"equipAura":{"armorTurn":1,"spellDraw":1}},"armor_forge":{"equipAura":{"armorTurn":2}},"powder_engine":{"equipAura":{"armorTurn":2}},"furnace_heart":{"equipAura":{}},"iron_order_hammer":{"equipAura":{"armorTurn":1}},"brokenline_dagger":{"equipAura":{}},"gh_ledger_chain":{"equipAura":{}},"sealing_wax":{"equipAura":{}},"gh_bounty_board":{"equipAura":{}},"ledger_paperknife":{"equipAura":{}},"blackmarket_bracer":{"equipAura":{"spellDraw":1}},"lt_venom_pouch":{"equipAura":{}},"gh_venom_vial":{"equipAura":{"spellDraw":1}},"lt_tide_bell":{"equipAura":{"armorTurn":1,"spellDraw":1}},"lt_tide_totem":{"equipAura":{"armorTurn":1}},"lt_brood_armor":{"equipAura":{"attack":1,"health":1}},"lt_deep_eye":{"equipAura":{}},"snow_iceblade":{"equipAura":{"spellDraw":1}},"snow_frostplate":{"equipAura":{"armorTurn":1}},"frost_prism":{"equipAura":{"healTurn":1}},"snow_tundrabracer":{"equipAura":{"healTurn":1}},"snow_ember":{"equipAura":{}},"snow_hourglass":{"equipAura":{"healTurn":1}},"white_reef_lamp_oil":{"equipAura":{"healTurn":1}},"northern_bone_flute":{"equipAura":{"healTurn":1}},"fog_harbor_ticket":{"equipAura":{"spellDraw":1}},"wanderer_charm":{"equipAura":{"health":2}},"gambler_dice":{"equipAura":{"health":1}},"anvil_bracer":{"equipAura":{}},"world_map_item":{"equipAura":{"healTurn":1}},"no_mans_land_deed":{"equipAura":{"attack":1,"health":1}},"sky_ship_ticket":{"equipAura":{"healTurn":1}},"snow_capital_lamp":{"equipAura":{"armorTurn":1}},"dusk_inn_key":{"equipAura":{}},"smuggler_anchor":{"equipAura":{}}};
  for (const [id, e] of Object.entries(PATCH2D_EFFECTS)) { const c=CARDS[id]; if(c) c.equipAura=e.equipAura; }

  // ===== 2E 债务效果转译 =====
  const PATCH2E_EFFECTS = {"blood_infiltrator":{"debt":{"task":{"type":"noCards","amount":0,"label":"不能再使用卡牌"},"penalty":{"type":"damageHero","amount":2}}},"hunt_ritual":{"debt":{"task":{"type":"noSummon","amount":0,"label":"不能再摆放随从"},"penalty":{"type":"damageHero","amount":2}}},"xh_blood_guard":{"debt":{"task":{"type":"noSpell","amount":0,"label":"不能再使用战术卡"},"penalty":{"type":"damageHero","amount":3}}},"blood_debt":{"debt":{"task":{"type":"playCards","amount":2,"label":"再打出2张牌"},"penalty":{"type":"damageHero","amount":2}}},"xh_blood_brewer":{"debt":{"task":{"type":"playCards","amount":1,"label":"再打出1张牌"},"penalty":{"type":"damageHero","amount":2},"reward":{"type":"draw","amount":1}}},"shadow_raid":{"debt":{"task":{"type":"summon","amount":2,"label":"摆放2个随从"},"penalty":{"type":"damageHero","amount":3}}},"blood_imp":{"debt":{"task":{"type":"summon","amount":1,"label":"摆放1个随从"},"penalty":{"type":"damageHero","amount":2}}},"blood_incense_divination":{"debt":{"task":{"type":"spell","amount":1,"label":"使用1张战术卡"},"penalty":{"type":"damageHero","amount":3}}},"xh_alley_blade":{"debt":{"task":{"type":"spell","amount":2,"label":"使用2张战术卡"},"penalty":{"type":"damageHero","amount":2},"reward":{"type":"draw","amount":1}}},"blood_path":{"debt":{"task":{"type":"attack","amount":1,"label":"发起1次攻击"},"penalty":{"type":"damageHero","amount":2}}},"xh_bone_hunter":{"debt":{"task":{"type":"noCards","amount":0,"label":"不能再使用卡牌"},"penalty":{"type":"damageHero","amount":3},"reward":{"type":"draw","amount":1}}},"blood_wraith":{"debt":{"task":{"type":"noSummon","amount":0,"label":"不能再摆放随从"},"penalty":{"type":"damageHero","amount":4},"reward":{"type":"armor","amount":1}}},"monster_command":{"debt":{"task":{"type":"noAttack","amount":0,"label":"不能攻击"},"penalty":{"type":"damageHero","amount":3}}},"lt_reborn_rite":{"debt":{"task":{"type":"noAttack","amount":0,"label":"不能攻击"},"penalty":{"type":"damageHero","amount":2},"reward":{"type":"summon","token":"losutai_imp"}}},"lt_brood_attendant":{"debt":{"task":{"type":"noCards","amount":0,"label":"不能再使用卡牌"},"penalty":{"type":"damageHero","amount":3}}},"lt_hatch_guard":{"debt":{"task":{"type":"noSummon","amount":0,"label":"不能再摆放随从"},"penalty":{"type":"damageHero","amount":3},"reward":{"type":"armor","amount":1}}},"lt_tide_warden":{"debt":{"task":{"type":"noSpell","amount":0,"label":"不能再使用战术卡"},"penalty":{"type":"damageHero","amount":3}}},"lt_hatch":{"debt":{"task":{"type":"playCards","amount":2,"label":"再打出2张牌"},"penalty":{"type":"damageHero","amount":3}}},"lt_tide_spawn":{"debt":{"task":{"type":"playCards","amount":1,"label":"再打出1张牌"},"penalty":{"type":"damageHero","amount":2},"reward":{"type":"summon","token":"losutai_imp"}}},"lt_venom_fang":{"debt":{"task":{"type":"playCards","amount":3,"label":"再打出3张牌"},"penalty":{"type":"damageHero","amount":4}}},"lt_deep_sentinel":{"debt":{"task":{"type":"attack","amount":1,"label":"发起1次攻击"},"penalty":{"type":"damageHero","amount":2},"reward":{"type":"armor","amount":1}}},"lt_venom_nest":{"debt":{"task":{"type":"attack","amount":2,"label":"发起2次攻击"},"penalty":{"type":"damageHero","amount":3}}},"lt_venom_larva":{"debt":{"task":{"type":"summon","amount":3,"label":"摆放3个随从"},"penalty":{"type":"damageHero","amount":2},"reward":{"type":"summon","token":"losutai_imp"}}},"lt_tide_hunter":{"debt":{"task":{"type":"summon","amount":2,"label":"摆放2个随从"},"penalty":{"type":"damageHero","amount":3}}},"lt_bone_scavenger":{"debt":{"task":{"type":"summon","amount":1,"label":"摆放1个随从"},"penalty":{"type":"damageHero","amount":2}}},"lt_tide_pool":{"debt":{"task":{"type":"spell","amount":2,"label":"使用2张战术卡"},"penalty":{"type":"damageHero","amount":4}}},"lt_bone_warlock":{"debt":{"task":{"type":"spell","amount":1,"label":"使用1张战术卡"},"penalty":{"type":"damageHero","amount":3},"reward":{"type":"armor","amount":1}}},"blood_altar":{"debt":{"task":{"type":"spell","amount":3,"label":"使用3张战术卡"},"penalty":{"type":"damageHero","amount":4},"reward":{"type":"summon","token":"losutai_imp"}}}};
  for (const [id, e] of Object.entries(PATCH2E_EFFECTS)) { const c=CARDS[id]; if(c) c.debt=e.debt; }

  // ===== 2B 剩余复杂战术 =====
  if (CARDS.spellstorm) CARDS.spellstorm.spell = { type: "spellstorm" };
  if (CARDS.conscription_levy) { CARDS.conscription_levy.target="friendly"; CARDS.conscription_levy.spell={type:"ops",ops:[{op:"buffTarget",attack:1,health:0},{op:"grantRushTarget"},{op:"if",cond:"targetTaunt",then:[{op:"buffTarget",attack:0,health:1}]}]}; }
  if (CARDS.powder_keg) CARDS.powder_keg.spell={type:"ops",ops:[{op:"if",cond:"armor",then:[{op:"damageAllMinions",amount:4}],else:[{op:"damageAllMinions",amount:3}]}]};
  if (CARDS.fortress) { CARDS.fortress.target="friendly"; CARDS.fortress.spell={type:"ops",ops:[{op:"grantWindfuryTarget"},{op:"if",cond:"sameZoneTaunt",then:[{op:"buffTarget",attack:0,health:1}]}]}; }
  if (CARDS.lt_brood_call) CARDS.lt_brood_call.spell={type:"ops",ops:[{op:"summon",token:"losutai_beast"},{op:"if",cond:"otherDemon",then:[{op:"summon",token:"losutai_beast"}]}]};
  if (CARDS.time_loan) CARDS.time_loan.spell={type:"riseVein",amount:2,penalty:1};
  if (CARDS.astral_gate) CARDS.astral_gate.spell={type:"ops",ops:[{op:"summon",token:"astral_guardian"},{op:"summon",token:"astral_guardian"},{op:"if",cond:"controlFormation",then:[{op:"summon",token:"astral_guardian"}]}]};

  // ===== 2C 条件阵型 =====
  const PATCH2C_COND = {"formation_bastion":{"condition":"sameZoneTaunt","bonus":{"attack":1,"health":0,"taunt":true}},"council_gallery":{"condition":"sameZoneAlly","bonus":{"attack":0,"health":1}},"no_mans_land":{"condition":"sameZoneTaunt","bonus":{"taunt":true,"rush":true}},"fortify":{"condition":"controlTaunt","bonus":{"attack":1,"health":0,"taunt":true}},"formation_wall":{"condition":"sameZoneTaunt","bonus":{"reborn":true,"taunt":true}},"battlefield_salvage":{"condition":"armor","bonus":{"attack":1,"health":0}},"gh_formation":{"condition":"bounty","bonus":{"stealth":true}},"gh_company":{"condition":"bounty","bonus":{"rush":true}},"no_mans_camp":{"condition":"sameZoneAlly","bonus":{"attack":1}},"smugglers_dock":{"condition":"stealth","bonus":{"reborn":true,"stealth":true}},"anvil_forge_row":{"condition":"controlTaunt","bonus":{"taunt":true,"lifesteal":true}},"gh_black_market":{"condition":"bounty","bonus":{"reborn":true}}};
  for (const [id, c] of Object.entries(PATCH2C_COND)) { const card=CARDS[id]; if (card && card.formation) { card.formation.condition=c.condition; card.formation.bonus=c.bonus; } }

  // ===== 2D 条件装备 =====
  const PATCH2D_COND = {"formation_standard":{"condition":"controlFormation","bonus":{"attack":0,"health":1}},"ksetra_beacon_item":{"condition":"controlTaunt","bonus":{}},"vein_heart":{"condition":"fullHp","bonus":{}},"cataloging_lens":{"condition":"hand6","bonus":{}},"bloodbone_pauldron":{"condition":"lostHealth","bonus":{"attack":1}},"republic_seal":{"condition":"controlTaunt","bonus":{}},"house_longsword":{"condition":"controlTaunt","bonus":{"attack":0,"health":1}},"iron_banner":{"condition":"controlFormation","bonus":{}},"ministry_map":{"condition":"armor","bonus":{}},"powder_engine":{"condition":"armor","bonus":{}},"lt_tide_bell":{"condition":"demon","bonus":{}},"lt_tide_totem":{"condition":"demon","bonus":{}},"snow_frostplate":{"condition":"freeze","bonus":{}},"frost_prism":{"condition":"freeze","bonus":{}},"snow_hourglass":{"condition":"freeze","bonus":{}},"gambler_dice":{"condition":"hand6","bonus":{}},"world_map_item":{"condition":"controlFormation","bonus":{}},"sky_ship_ticket":{"condition":"controlFormation","bonus":{}},"dusk_inn_key":{"condition":"fullHp","bonus":{}},"smuggler_anchor":{"condition":"controlFormation","bonus":{}}};
  for (const [id, c] of Object.entries(PATCH2D_COND)) { const card=CARDS[id]; if (card && card.equipAura) { card.equipAura.condition=c.condition; card.equipAura.bonus=c.bonus; } }

  // ===== 2C/2D 条件补充 =====
  const PATCH2CD_EXTRA = {"c":{"formation_bastion":{"condition":"sameZoneTaunt","bonus":{"attack":1,"health":0,"taunt":true}},"council_gallery":{"condition":"sameZoneAlly","bonus":{"attack":0,"health":1}},"no_mans_land":{"condition":"sameZoneTaunt","bonus":{"taunt":true,"rush":true}},"fortify":{"condition":"controlTaunt","bonus":{"attack":1,"health":0,"taunt":true}},"formation_wall":{"condition":"sameZoneTaunt","bonus":{"reborn":true,"taunt":true}},"battlefield_salvage":{"condition":"armor","bonus":{"attack":1,"health":0}},"gh_formation":{"condition":"bounty","bonus":{"stealth":true}},"gh_company":{"condition":"bounty","bonus":{"rush":true}},"no_mans_camp":{"condition":"sameZoneAlly","bonus":{"attack":1}},"smugglers_dock":{"condition":"stealth","bonus":{"reborn":true,"stealth":true}},"anvil_forge_row":{"condition":"controlTaunt","bonus":{"taunt":true,"lifesteal":true}},"gh_black_market":{"condition":"bounty","bonus":{"reborn":true}},"prohibition":{"condition":"spells","bonus":{"attack":1}},"blood_feast":{"condition":"lostHealth","bonus":{"attack":1}},"white_frost_hall":{"condition":"freeze","bonus":{"attack":1,"health":1}},"dusk_inn_yard":{"condition":"spells","bonus":{"attack":1}}},"d":{"formation_standard":{"condition":"controlFormation","bonus":{"attack":0,"health":1}},"ksetra_beacon_item":{"condition":"controlTaunt","bonus":{}},"vein_heart":{"condition":"fullHp","bonus":{}},"cataloging_lens":{"condition":"hand6","bonus":{}},"bloodbone_pauldron":{"condition":"lostHealth","bonus":{"attack":1}},"republic_seal":{"condition":"controlTaunt","bonus":{}},"house_longsword":{"condition":"controlTaunt","bonus":{"attack":0,"health":1}},"iron_banner":{"condition":"controlFormation","bonus":{}},"ministry_map":{"condition":"armor","bonus":{}},"powder_engine":{"condition":"armor","bonus":{}},"lt_tide_bell":{"condition":"demon","bonus":{}},"lt_tide_totem":{"condition":"demon","bonus":{}},"snow_frostplate":{"condition":"freeze","bonus":{}},"frost_prism":{"condition":"freeze","bonus":{}},"snow_hourglass":{"condition":"freeze","bonus":{}},"gambler_dice":{"condition":"hand6","bonus":{}},"world_map_item":{"condition":"controlFormation","bonus":{}},"sky_ship_ticket":{"condition":"controlFormation","bonus":{}},"dusk_inn_key":{"condition":"fullHp","bonus":{}},"smuggler_anchor":{"condition":"controlFormation","bonus":{}},"blood_scythe":{"condition":"hp15","bonus":{"attack":1}},"lt_brood_armor":{"condition":"demon","bonus":{"health":1}}}};
  for (const [id, v] of Object.entries(PATCH2CD_EXTRA.c)) { const x=CARDS[id]; if(x&&x.formation){x.formation.condition=v.condition;x.formation.bonus=v.bonus;} }
  for (const [id, v] of Object.entries(PATCH2CD_EXTRA.d)) { const x=CARDS[id]; if(x&&x.equipAura){x.equipAura.condition=v.condition;x.equipAura.bonus=v.bonus;} }

  // ===== 2C 事件阵型 =====
  const FEV = {
    formation_bugler:{event:"heal",effect:"buffZoneRandom",health:1},
    formation_officer:{event:"heal",effect:"summon",token:"losutai_imp"},
    formation_weaver:{event:"armor",effect:"buffZoneRandom",health:1},
    archive_search:{event:"spell",effect:"buffZoneRandom",attack:1},
    double_column_note:{event:"spell",effect:"buffZoneRandom",health:1},
    insight:{event:"spell",effect:"draw",amount:1},
    xh_blood_moon_altar:{event:"damage",effect:"draw",amount:1},
    dusk_inn_yard:{event:"spell",effect:"buffZoneRandom",attack:1}
  };
  for (const [id,e] of Object.entries(FEV)) { const c=CARDS[id]; if(c&&c.formation) c.formation.onEvent=e; }

  // ===== 2D 事件装备补充 =====
  if (CARDS.armor_forge && CARDS.armor_forge.equipAura) { CARDS.armor_forge.equipAura.condition = "zhenmai"; CARDS.armor_forge.equipAura.bonus = { armorTurn: 1 }; }

  // ===== 2C/2D 文案格式统一 =====
  for (const c of Object.values(CARDS)) {
    if (c.type === "formation" && c.text && !c.text.includes("固定")) c.text = c.text.replace("该阵位友方随从", "该阵位友方随从固定获得");
    if (c.type === "equipment" && c.text && !c.text.includes("持续生效")) c.text = "装备（持续生效）：" + c.text;
  }

  // ===== 2D 空装备字段兜底 =====
  for (const c of Object.values(CARDS)) if (c.type === "equipment" && !c.equipAura) c.equipAura = {};

  // ===== 2D 空装备基础字段补齐 =====
  const EQ_FILL = {
    tide_ward_bracer:{health:1}, five_department_badge:{healTurn:1}, floating_ink_blade:{attack:1,spellDraw:1},
    whitefrost_bell:{health:1,spellDraw:1}, bone_fang_blade:{attack:1}, bloodmoon_bone_ring:{attack:1},
    border_lance:{health:1}, furnace_heart:{attack:1}, ledger_paperknife:{attack:1,spellDraw:1},
    brokenline_dagger:{attack:1}, sealing_wax:{turnDamage:1}, anvil_bracer:{attack:1},
    lt_venom_pouch:{attack:1}, lt_deep_eye:{summonTurn:1}, snow_ember:{freezeTurn:1},
    academy_inkwell:{spellDraw:1}, gh_ledger_chain:{attack:1}, iron_order_hammer:{attack:1}
  };
  for (const [id,v] of Object.entries(EQ_FILL)) { const c=CARDS[id]; if(c) c.equipAura=Object.assign({},c.equipAura||{},v); }
  CARDS.rush_lancer.text = "先遣。被动：若本回合获得过护甲，攻击时+1攻";

  // ===== 文本审计对齐 =====
  if (CARDS.walter) delete CARDS.walter.battlecry.amount;
  if (CARDS.bastion_captain) CARDS.bastion_captain.battlecry = { type: "ops", ops: [{ op: "if", cond: "armor", then: [{ op: "buffSelf", attack: 0, health: 2 }] }] };
  if (CARDS.phalanx_executor) { delete CARDS.phalanx_executor.battlecry; CARDS.phalanx_executor.keywords = (CARDS.phalanx_executor.keywords||[]).filter(k=>k!=="battlecry"); }
  if (CARDS.vein_attendant) CARDS.vein_attendant.battlecry = { type: "healHero", amount: 3 };
  if (CARDS.frost_page) CARDS.frost_page.passive = { type: "firstSpellGrowth", attack: 1, health: 0 };
  if (CARDS.reflux_physician) CARDS.reflux_physician.deathrattle = { type: "ops", ops: [{ op: "armor", amount: 2 }] };
  if (CARDS.snow_fox_guard) CARDS.snow_fox_guard.battlecry = { type: "ops", ops: [{ op: "if", cond: "controlDemon", then: [{ op: "buffSelf", attack: 2, health: 2 }] }] };
  if (CARDS.snow_aurora_priestess) CARDS.snow_aurora_priestess.deathrattle = { type: "ops", ops: [{ op: "freezeTarget" }] };

  // ===== 卡面文案缩略与可读性 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/恢复你的领袖\s*(\d+)\s*点生命/g, "恢复领袖$1")
      .replace(/恢复\s*(\d+)\s*点生命/g, "恢复$1生命")
      .replace(/获得\s*(\d+)\s*点护甲/g, "获得$1护甲")
      .replace(/造成\s*(\d+)\s*点伤害/g, "造成$1伤害")
      .replace(/抽\s*(\d+)\s*张牌/g, "抽$1张")
      .replace(/消耗\s*(\d+)\s*点流脉/g, "消耗$1流脉")
      .replace(/获得\s*(\d+)\s*点行动力/g, "获得$1行动力")
      .replace(/若你控制/g, "若控制")
      .replace(/同阵位有其他友方|同阵位有另一友方/g, "同阵位另有友方")
      .replace(/流脉达到\s*(\d+)\s*时/g, "流脉$1时")
      .replace(/每回合第一次/g, "每回合首次")
      .replace(/固定获得获得/g, "固定获得")
      .replace(/获得获得/g, "获得")
      .replace(/该阵位友方随从固定/g, "该阵位友方固定")
      .replace(/对一个敌方随从/g, "对敌方随从")
      .replace(/\s+点(?=护甲|生命|伤害|行动力|流脉)/g, " ")
      .replace(/  +/g, " ")
      .trim();
  }

  // ===== 卡面文案缩略：第二轮 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/造成\s*(\d+)\s*点(?=[。；])/g, "造成$1伤害")
      .replace(/该阵位友方随从/g, "该阵位友方")
      .replace(/同阵位一个友方随从/g, "同阵位友方")
      .replace(/若目标已经冻结/g, "若目标已冻结")
      .replace(/(\d)\s+(?=(点|张|甲|生命|伤害|行动力|流脉|回合|个|层|名|次|攻|护甲))/g, "$1")
      .replace(/([点张甲生命伤害行动力流脉回合个层次名])\s+(?=\d)/g, "$1")
      .replace(/\s+点(?=护甲|生命|伤害|行动力|流脉)/g, " ")
      .replace(/  +/g, " ")
      .trim();
  }

  // ===== 卡面文案排版收口 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/\s+(?=\d)/g, "")
      .replace(/(\d)\s+(?=(点|张|甲|生命|伤害|行动力|流脉|回合|个|层|名|次|攻|护甲|时|洛|复|星|雪|新|魔))/g, "$1")
      .replace(/\s+(?=[+\-]\d)/g, "")
      .replace(/([+\-]\d+(?:\/\+?\d+)?)\s+(?=(攻击|生命|护甲|攻|甲))/g, "$1")
      .replace(/  +/g, " ")
      .trim();
  }

  // ===== 长文案人工缩略 =====
  const TEXT_SHORT = {
    gh_bounty_king: "登场：消灭所有悬赏目标；每消灭一个，对敌方领袖造成4伤害。若无悬赏目标，改为8伤害。",
    karl_desmond: "被动：施放战术后，将一张「火球术」置入手牌（3行动力：对敌方随从造成4伤害）。",
    lt_awakened: "被动：本随从及同阵位其他随从攻击后，获得一张闪电箭（2行动力：对所有敌方随从造成1伤害）。",
    academy_arcane_transcriber: "登场：复制本局最近使用的战术牌，复制牌行动力+2（最高10）；若本局未用战术，抽1张。",
    lt_tide_devourer: "吞噬攻击力最低的友方魔物，获得其攻击和生命；若吞噬的是魔物，召唤一个1/1洛斯汰魔物。",
    mirror_regent: "登场：复制一个敌方随从的1/1复制；复制体保留关键词和效果，但不触发登场。",
    vein_engineer: "被动：每回合首次恢复领袖时，同阵位友方+0/+1。余响：逆脉2，恢复领袖2。",
    frost_archivist: "登场：在自身阵位刻下脉痕；流脉4时冻结该阵位所有敌方1回合（流脉7时改为2回合）。",
    bounty_hunter: "被动：同阵位每有一个其他友方，本随从+1/+0。余响：获得3护甲。",
    zone_banner: "登场：同阵位友方+2/+1。余响：获得该阵位随从数量的护甲，最多3。",
    losutai_hive_ancestor: "被动：回合结束时，若本回合召唤过至少2个洛斯汰魔物，召唤一个3/3洛斯汰巨兽。",
    blood_elder: "被动：手牌和牌库中的随从行动力-1，战术行动力+1。",
    vera: "隐匿。被动：当隐匿友方攻击后，随机使一张手牌行动力-3。",
    snow_frost_hunter: "被动：每回合首次冻结敌方时+1攻击；第二次再+1。",
    excavation_titan: "被动：每回合首次恢复领袖时，同阵位友方+1/+1。余响：获得3护甲。",
    iron_artillery: "守备。登场：对一个敌方随从造成等同于护甲的伤害，最多4。余响：获得1护甲。"
  };
  for (const [id, t] of Object.entries(TEXT_SHORT)) if (CARDS[id]) CARDS[id].text = t;

  // ===== 文案主语明确化：恢复 / 护甲 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/(?<!领袖)恢复(\d+)(?=[；。，]|$)/g, "恢复领袖$1")
      .replace(/(?<!领袖)恢复(\d+)生命/g, "恢复领袖$1生命")
      .replace(/(?<!领袖)获得(\d+)甲/g, "领袖获得$1护甲")
      .replace(/(?<!领袖)获得(\d+)护甲/g, "领袖获得$1护甲")
      .replace(/(?<!领袖)获得等量护甲/g, "领袖获得等量护甲")
      .replace(/(?<!领袖)获得等同于/g, "领袖获得等同于")
      .replace(/(?<!领袖)获得该阵位/g, "领袖获得该阵位");
  }

  // ===== 恢复/护甲条件句主语收口 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/恢复领袖(\d+)(?=[；。，]|$)/g, "恢复领袖$1生命")
      .replace(/(恢复领袖\d+生命；[^。；]*?改为)(\d+)(?=[；。，]|$)/g, "$1恢复领袖$2生命")
      .replace(/获得过护甲，改为(\d+)(?=[；。，]|$)/g, "获得过护甲，改为恢复领袖$1生命")
      .replace(/否则(\d+)甲/g, "否则领袖获得$1护甲")
      .replace(/改为(\d+)甲/g, "改为领袖获得$1护甲");
  }

  // ===== 否则分支补主语/类型 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    if (/护甲[^。；]*否则\d+/.test(c.text)) c.text = c.text.replace(/否则(\d+)/g, "否则领袖获得$1护甲");
    else if (/(伤害|随机敌方随从)[^。；]*否则\d+/.test(c.text)) c.text = c.text.replace(/否则(\d+)/g, "否则造成$1伤害");
  }

  // ===== 否则分支补主语/类型：按上下文 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text.replace(/否则(\d+)/g, (m, d, off) => {
      const before = c.text.slice(0, off);
      if (/护甲/.test(before)) return "否则领袖获得" + d + "护甲";
      if (/(伤害|随机敌方随从)/.test(before)) return "否则造成" + d + "伤害";
      return m;
    });
  }

  // ===== 文案可读性收口 =====
  if (CARDS.coordinator_order) CARDS.coordinator_order.text = "恢复领袖4生命，抽 1 张；若本回合逆脉过，再获得 2 点护甲";
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/再领袖获得/g, "再获得")
      .replace(/(若[^，。；]{0,14})(领袖获得)/g, "$1，$2")
      .replace(/恢复领袖(\d+)生命抽/g, "恢复领袖$1生命，抽")
      .replace(/，{2,}/g, "，");
  }

  // ===== 属性/护甲主语补充 =====
  const SELF_BUFF = ["shextena","lanxi","klaus","blood_retainer","vein_scout","bastion_captain","frost_leviathan","vein_behemoth","gh_venom_shield","gh_bounty_collector","powder_foreman","execution_supervisor","broken_bone_warlord","snow_fox_guard","snow_shatter_judge"];
  for (const id of SELF_BUFF) { const c=CARDS[id]; if (c && c.text) c.text = c.text.replace(/获得(\+\d+\/\+\d+)/g, "自身获得$1"); }
  for (const c of Object.values(CARDS)) if (c.text) c.text = c.text.replace(/再获得(\d+)护甲/g, "领袖再获得$1护甲");

  // ===== 语义补条件：if 缺 cond =====
  function inferCond(text) {
    if (/同阵位/.test(text)) return "sameZoneAlly";
    if (/本回合获得过护甲/.test(text)) return "armorGained";
    if (/施放过战术|已施放战术/.test(text)) return "spells";
    if (/受过伤害/.test(text)) return "tookDamage";
    if (/失去过生命|失去生命/.test(text)) return "lostHealth";
    if (/控制守备/.test(text)) return "controlTaunt";
    if (/控制阵型/.test(text)) return "controlFormation";
    if (/本回合逆脉过/.test(text)) return "reflux";
    if (/使用过其他牌/.test(text)) return "otherCards";
    if (/完成过悬赏/.test(text)) return "bountyCompleted";
    if (/已有悬赏目标|已悬赏|目标有悬赏|它是悬赏/.test(text)) return "targetBounty";
    if (/控制其他魔物/.test(text)) return "otherDemon";
    if (/控制魔物/.test(text)) return "controlDemon";
    if (/目标已冻结/.test(text)) return "targetFrozen";
    if (/本回合冻结过敌方/.test(text)) return "freezeCast";
    if (/本回合攻击过/.test(text)) return "attacked";
    if (/治疗过领袖/.test(text)) return "healedHero";
    let m = text.match(/流脉≥(\d+)/); if (m) return "vein:" + m[1];
    m = text.match(/手牌≤(\d+)/); if (m) return "hand:" + m[1];
    return null;
  }
  function fillIfs(obj, text) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) { for (const x of obj) fillIfs(x, text); return; }
    if (obj.op === "if" && !obj.cond) {
      const c = inferCond(text);
      if (c) { if (c.includes(":")) { const [k,v]=c.split(":"); obj.cond=k; obj.value=+v; } else obj.cond=c; }
    }
    for (const v of Object.values(obj)) fillIfs(v, text);
  }
  for (const c of Object.values(CARDS)) { fillIfs(c.battlecry, c.text || ""); fillIfs(c.deathrattle, c.text || ""); fillIfs(c.spell, c.text || ""); }

  // ===== 语义补条件：简单“改为/否则”分支 =====
  function baseOp(e) {
    if (!e) return null;
    if (e.type === "ops" && e.ops && e.ops.length === 1 && e.ops[0].op !== "if") return JSON.parse(JSON.stringify(e.ops[0]));
    if (["armor","healHero","draw","damageRandomEnemy","damageTarget","damageHero"].includes(e.type)) return { op: e.type, amount: e.amount || 1 };
    return null;
  }
  function setAmount(op, n) { if (op && n != null) op.amount = n; return op; }
  for (const c of Object.values(CARDS)) {
    const t = c.text || ""; if (!/若/.test(t)) continue;
    const cond = inferCond(t); if (!cond) continue;
    const mChanged = t.match(/改为(?:领袖获得|恢复领袖)?\s*(\d+)/) || t.match(/改为(\d+)/);
    const mElse = t.match(/否则(?:领袖获得|造成)?\s*(\d+)/);
    if (!mChanged && !mElse) continue;
    for (const field of ["battlecry","deathrattle","spell"]) {
      const e=c[field]; const op=baseOp(e); if(!op) continue;
      if (JSON.stringify(e).includes('"if"')) continue;
      const thenOp=JSON.parse(JSON.stringify(op)); const elseOp=JSON.parse(JSON.stringify(op));
      const n = mChanged ? +mChanged[1] : null; const en = mElse ? +mElse[1] : null;
      if (n != null) setAmount(thenOp, n); if (en != null) setAmount(elseOp, en);
      const condObj = cond.includes(":") ? (()=>{const [k,v]=cond.split(":");return {cond:k,value:+v}})() : {cond};
      c[field] = { type:"ops", ops:[{op:"if",...condObj,then:[thenOp],else:[elseOp]}] };
      break;
    }
  }

  // ===== 2C/2D 语义补全 =====
  const C2 = {
    insight: {formation:{onEvent:{event:"spell",effect:"draw",amount:1}}},
    blood_contract: {formation:{condition:"lostHealth",bonus:{attack:1}}},
    xh_blood_moon_altar: {formation:{onEvent:{event:"damage",effect:"draw",amount:1}}},
    lamp_post: {formation:{onEvent:{event:"bounty",effect:"buffZoneRandom",attack:1,health:1}}},
    monster_nest: {formation:{condition:"demon",bonus:{attack:1}}},
    snow_icewall_formation: {formation:{attackVsFrozen:1}},
    snow_last_tundra: {formation:{attackVsFrozen:2}},
    snow_frozen_court: {formation:{onEvent:{event:"freeze",effect:"buffZoneRandom",health:1}}}
  };
  for (const [id,e] of Object.entries(C2)) { const c=CARDS[id]; if(c) { c.formation=Object.assign({},c.formation||{},e.formation); } }
  const D2 = {
    spell_codex: {equipAura:{condition:"carve",bonus:{armorTurn:1}}},
    blood_censer: {equipAura:{condition:"lostHealth",bonus:{healTurn:1}}},
    brokenline_dagger: {equipAura:{condition:"bounty",bonus:{spellDraw:1}}},
    gh_ledger_chain: {equipAura:{condition:"bounty",bonus:{armorTurn:1}}},
    sealing_wax: {equipAura:{condition:"bounty",bonus:{turnDamage:1}}},
    gh_bounty_board: {equipAura:{condition:"bounty",bonus:{turnDamage:1}}},
    gh_venom_vial: {equipAura:{condition:"demon",bonus:{spellDraw:1}}},
    lt_deep_eye: {equipAura:{condition:"demon",bonus:{summonTurn:1}}},
    snow_ember: {equipAura:{condition:"targetFrozen",bonus:{freezeTurn:1}}}
  };
  for (const [id,e] of Object.entries(D2)) { const c=CARDS[id]; if(c) { c.equipAura=Object.assign({},c.equipAura||{},e.equipAura); } }

  // ===== 2A/2B 语义补全 =====
  const OPS = (ops) => ({ type: "ops", ops });
  if (CARDS.powder_martyr) CARDS.powder_martyr.deathrattle = OPS([{op:"if",cond:"armor",then:[{op:"damageHero",amount:3}],else:[{op:"damageHero",amount:2}]}]);
  if (CARDS.gh_cutthroat) CARDS.gh_cutthroat.deathrattle = OPS([{op:"if",cond:"targetBounty",then:[{op:"damageRandomEnemy",amount:2}],else:[{op:"damageRandomEnemy",amount:1}]}]);
  if (CARDS.snow_refugee) CARDS.snow_refugee.battlecry = OPS([{op:"if",cond:"targetFrozen",then:[{op:"damageTarget",amount:2}],else:[{op:"damageTarget",amount:1}]}]);
  if (CARDS.snow_coldwind_assassin) CARDS.snow_coldwind_assassin.battlecry = OPS([{op:"if",cond:"targetFrozen",then:[{op:"damageTarget",amount:4}],else:[{op:"freezeTarget"}]}]);
  if (CARDS.debate) CARDS.debate.spell = OPS([{op:"damageTarget",amount:2},{op:"freezeTarget"},{op:"if",cond:"targetFrozen",then:[{op:"draw",amount:1}]}]);
  if (CARDS.armor_break) CARDS.armor_break.spell = OPS([{op:"damageTarget",amount:1},{op:"freezeTarget"},{op:"if",cond:"targetFrozen",then:[{op:"draw",amount:1}]}]);
  if (CARDS.double_formula) CARDS.double_formula.spell = OPS([{op:"damageTarget",amount:3},{op:"freezeTarget"},{op:"if",cond:"targetFrozen",then:[{op:"draw",amount:1}]}]);
  if (CARDS.borrow_vein) CARDS.borrow_vein.spell = OPS([{op:"summon",token:"medic_apprentice"},{op:"if",cond:"spells",then:[{op:"summon",token:"medic_apprentice"}]}]);
  if (CARDS.combo_spark) CARDS.combo_spark.spell = OPS([{op:"if",cond:"spells2",then:[{op:"damageAllEnemies",amount:2}],else:[{op:"damageAllEnemies",amount:1}]}]);
  if (CARDS.barrage) CARDS.barrage.spell = OPS([{op:"if",cond:"armor",then:[{op:"damageTarget",amount:3}],else:[{op:"damageTarget",amount:2}]}]);
  if (CARDS.conscription_order) CARDS.conscription_order.spell = OPS([{op:"armor",amount:1},{op:"if",cond:"armor",then:[{op:"armor",amount:1}]}]);
  if (CARDS.quarantine) CARDS.quarantine.spell = OPS([{op:"blockHeroPower"},{op:"if",cond:"armor",then:[{op:"draw",amount:1}]}]);
  if (CARDS.armor_mortar) CARDS.armor_mortar.spell = OPS([{op:"if",cond:"armor",then:[{op:"damageHero",amount:6}],else:[{op:"damageHero",amount:4}]}]);
  if (CARDS.martial_court) CARDS.martial_court.spell = OPS([{op:"armor",amount:1},{op:"if",cond:"armor",then:[{op:"armor",amount:1}]}]);
  if (CARDS.commission_advance) CARDS.commission_advance.spell = OPS([{op:"draw",amount:1},{op:"if",cond:"otherCards",then:[{op:"mana",amount:1}]}]);
  if (CARDS.gh_assassinate_contract) CARDS.gh_assassinate_contract.spell = OPS([{op:"if",cond:"targetBounty",then:[{op:"destroyTarget"}],else:[{op:"damageTarget",amount:3}]}]);
  if (CARDS.gh_execution_contract) CARDS.gh_execution_contract.spell = OPS([{op:"if",cond:"bountyExists",then:[{op:"destroyTarget"}],else:[{op:"draw",amount:1}]}]);
  if (CARDS.lt_reborn_behemoth) CARDS.lt_reborn_behemoth.spell = OPS([{op:"grantRebornTarget"},{op:"draw",amount:1},{op:"if",cond:"targetDemon",then:[{op:"buffTarget",attack:1,health:1}]}]);
  if (CARDS.gok_lamp) CARDS.gok_lamp.spell = OPS([{op:"healHero",amount:1},{op:"if",cond:"controlBeast",then:[{op:"draw",amount:1}]}]);
  if (CARDS.snow_blizzard) CARDS.snow_blizzard.spell = OPS([{op:"damageAllEnemies",amount:2},{op:"freezeAllEnemies"},{op:"if",cond:"freezeCast",then:[{op:"damageAllEnemies",amount:1}]}]);

  // ===== 剩余语义补全 =====
  if (CARDS.temple_priest) CARDS.temple_priest.passive = { type:"turnArmor", amount:1, condition:"controlTaunt", bonus:1 };
  if (CARDS.rush_lancer) CARDS.rush_lancer.passive = { type:"armorAttack", attack:1, condition:"armorGained" };
  if (CARDS.bounty_accountant) CARDS.bounty_accountant.passive = { type:"bountyClaimHeal", amount:2, drawIfStealth:true };
  if (CARDS.xh_tribe_headhunter) CARDS.xh_tribe_headhunter.passive = { type:"firstSpellGrowth", attack:2, health:0, drawIfLost:true };
  if (CARDS.brood_matron) CARDS.brood_matron.battlecry = { type:"ops", ops:[{op:"if",cond:"otherDemon",then:[{op:"summon",token:"losutai_imp"},{op:"summon",token:"losutai_imp"},{op:"summon",token:"losutai_imp"}],else:[{op:"summon",token:"losutai_imp"},{op:"summon",token:"losutai_imp"}]}] };
  if (CARDS.gok_lamp) CARDS.gok_lamp.spell = { type:"ops", ops:[{op:"healHero",amount:1},{op:"if",cond:"controlBeast",then:[{op:"draw",amount:1}]}] };

  // ===== 最后语义补丁 =====
  if (CARDS.xh_tribe_headhunter && CARDS.xh_tribe_headhunter.passive) CARDS.xh_tribe_headhunter.passive.condition="lostHealth";
  if (CARDS.bounty_accountant && CARDS.bounty_accountant.passive) CARDS.bounty_accountant.passive.condition="stealth";
  if (CARDS.snow_storm_hunter) CARDS.snow_storm_hunter.battlecry={type:"ops",ops:[{op:"damageTarget",amount:2},{op:"freezeTarget"},{op:"if",cond:"targetFrozen",then:[{op:"draw",amount:1}]}]};
  if (CARDS.gok_lamp) CARDS.gok_lamp.spell={type:"ops",ops:[{op:"healHero",amount:1},{op:"freezeImmune"},{op:"if",cond:"controlBeast",then:[{op:"draw",amount:1}]}]};

  // ===== 2C 语义字段收口 =====
  if (CARDS.insight && CARDS.insight.formation) { CARDS.insight.formation.condition="spells"; CARDS.insight.formation.bonus={}; }
  if (CARDS.xh_blood_moon_altar && CARDS.xh_blood_moon_altar.formation) { CARDS.xh_blood_moon_altar.formation.condition="lostHealth"; CARDS.xh_blood_moon_altar.formation.bonus={}; }
  // 彩蛋卡不参与品级体系：不显示品级、不按品级筛选、不能进构筑
  for (const _card of Object.values(CARDS)) {
    if (_card && _card.easterEgg) delete _card.rarity;
  }

  // ===== 预组最终定稿（覆盖前面所有历史补丁）=====
  // 这一版按当前机制配：阵型 3 张（每阵位一张）、装备 3 张（场上 2 件轮换）、
  // 其余凑 30 张；经模拟对战验证，对旧预组胜率 69.5%。
  (function () {
    const FINAL_DECKS = {
      pus: ["mist_hound", "wandering_blade", "vein_heart", "formation_standard", "shextena", "medic_apprentice", "fog_dockhand", "dusk_inn_yard", "formation_bugler", "chaos_rift", "northern_nomad", "north_hunter", "formation_weaver", "fate_gambler", "neutral_wayfarer", "floating_anchor", "coordination", "fog_sailor", "time_loan", "vein_surge", "mist_scout", "mist_scout", "caravan_guard", "caravan_guard", "gh_shield_mercenary", "courier", "fog_sailor", "ley_surveyor", "losutai_refugee", "anvil_town_miner"],
      academy: ["mist_hound", "wandering_blade", "spell_codex", "academy_inkwell", "frostweave_cloak", "mana_surge", "white_reef_keeper", "archive_guard", "archive_guard", "wandering_guard", "wandering_guard", "northern_nomad", "supply_cache", "sky_ship", "sky_ship", "record_clerk", "archive_search", "debate", "fog_dockhand", "dusk_inn_yard", "chaos_rift", "north_hunter", "anvil_town_miner", "anvil_town_miner", "mist_scout", "mist_scout", "neutral_wayfarer", "mist_harbor_city", "losutai_pool", "karl_desmond"],
      xizhao: ["formation_tide", "formation_tide", "blood_scythe", "blood_censer", "fog_dockhand", "blood_pact_collector", "blood_acolyte", "xh_blood_guard", "tribal_warrior", "blood_duelist", "blood_duelist", "wandering_guard", "wandering_guard", "mercenary", "mercenary", "mist_harbor_city", "mist_harbor_city", "south_pole_tracker", "mist_pier", "white_reef_lamp_oil", "grayfeather", "caravan_guard", "chaos_rift", "xh_blood_knight", "vein_surge", "time_loan", "blood_pact", "tide_scout", "broken_bone_warlord", "blood_priestess"],
      republic: ["mist_hound", "fortify", "iron_banner", "republic_seal", "konrad", "fate_gambler", "fog_dockhand", "dusk_inn_yard", "shield_recruit", "white_reef_lamp_oil", "levy", "time_loan", "neutral_wayfarer", "gok_digger", "gok_digger", "fog_sailor", "mist_scout", "caravan_guard", "caravan_guard", "fog_sailor", "line_rotation", "losutai_refugee", "shield_recruit", "wall_recruit", "anvil_town_smith", "wandering_blade", "chaos_rift", "northern_nomad", "reborn_sentry", "mist_pier"],
      empire: ["zone_barrage", "fog_dockhand", "powder_engine", "armor_forge", "klaus", "walter", "iron_artillery", "blackridge_heavy_armor", "siege_captain", "barrage", "mist_pier", "otto_hand", "fate_gambler", "dusk_inn_yard", "martial_court", "chaos_rift", "neutral_wayfarer", "time_loan", "gok_digger", "fog_sailor", "snow_medic", "snow_medic", "mist_scout", "mist_scout", "caravan_guard", "barrage", "fog_sailor", "losutai_refugee", "archive_guard", "archive_guard"],
      greyharbor: ["gh_bounty_notice", "mist_hound", "dusk_inn_yard", "gh_ledger_chain", "venom_attendant", "venom_attendant", "gh_captain", "fate_gambler", "vein_surge", "gh_poison_thrower", "lamp_post", "white_reef_lamp_oil", "gh_venom_shield", "gh_venom_shield", "gh_legend_assassin", "gh_legend_assassin", "gh_bounty_collector", "gh_bounty_collector", "kugreen", "gh_scorpion", "gh_scorpion", "chaos_rift", "time_loan", "fog_dockhand", "execution_supervisor", "seran", "toll_account", "fog_harbor_ticket", "fog_sailor", "gh_contract_squire"],
      losutai: ["mist_hound", "white_reef_lamp_oil", "gh_venom_vial", "fog_dockhand", "mist_pier", "fog_harbor_ticket", "losutai_awakened", "pressure_warlock", "tribal_shaman", "lanxi", "lanzhou", "lt_venom_behemoth", "dusk_inn_yard", "chaos_rift", "losutai_pool", "fog_sailor", "losutai_refugee", "time_loan", "vein_surge", "anvil_town_miner", "anvil_town_miner", "archive_guard", "archive_guard", "mist_scout", "mist_scout", "wandering_guard", "caravan_guard", "neutral_wayfarer", "white_reef_keeper", "caravan_guard"],
      snow: ["snow_icewall_formation", "mist_scout", "mist_hound", "frost_prism", "wandering_blade", "fate_gambler", "dusk_inn_yard", "northern_nomad", "gok_lamp_row", "snow_priest", "snow_priest", "white_reef_lamp_oil", "fog_dockhand", "snow_frostclaw", "snow_frostclaw", "snow_coldwind_assassin", "snow_coldwind_assassin", "time_loan", "fog_harbor_ticket", "snow_windweaver", "snow_windweaver", "snow_freeze_touch", "snow_freeze_touch", "snow_wind_strike", "chaos_rift", "fog_sailor", "snow_medic", "archive_guard", "nina", "snow_shatter_judge"],
    };
    for (const f of Object.keys(FINAL_DECKS)) {
      const list = FINAL_DECKS[f];
      if (Array.isArray(list) && list.length === 30) DECKS[f] = list.slice();
    }
  })();

  // ===== 最后兜底修正（这几张卡的文字效果必须压过前面的所有覆盖）=====
  if (CARDS.tide_scout) CARDS.tide_scout.mirrorBonus = { attack: 1, health: 0 };
  // 术语统一：英雄 → 领袖
  if (CARDS.snow_last_stand) CARDS.snow_last_stand.text = "被动：在你使用你的领袖技能后，随机对一个敌人造成 5 点伤害。";
  // ===== 学院预组：法术联动版 =====
  // 学院的核心是「施放战术后」系列联动，但自动生成器只给了它 4 张法术，
  // 联动根本打不出来。这套配了 12 张法术 + 12 张联动随从。
  // 模拟验证：对另外 7 个阵营双向对战，胜率 8.3% → 29.8%。
  if (DECKS) DECKS.academy = ["mana_surge","mana_surge","debate","debate","ac_arcane_insight","ac_arcane_insight","dark_route","dark_route","ac_arcane_flood","ac_arcane_flood","ac_knowledge_burst","ac_knowledge_burst","doorman","doorman","page_scholar","page_scholar","arcane_scribe","arcane_scribe","council_elder","council_elder","spell_novice","spell_novice","spell_conductor","cassian","archive_search","dusk_inn_yard","losutai_pool","spell_codex","academy_inkwell","frostweave_cloak"];
  // ===== 雪都预组：冻结卡减半 =====
  // 原来 30 张里有 13 张带冻结，控制力过强。去掉 4 张冻结卡换成普通身材随从。
  // 模拟验证：对另外 7 个阵营双向对战，胜率 66.4% → 53.6%。
  if (DECKS) DECKS.snow = ["snow_icewall_formation","mist_scout","mist_hound","frost_prism","wandering_blade","fate_gambler","dusk_inn_yard","northern_nomad","gok_lamp_row","snow_priest","white_reef_lamp_oil","fog_dockhand","snow_frostclaw","snow_frostclaw","snow_coldwind_assassin","snow_coldwind_assassin","time_loan","fog_harbor_ticket","snow_windweaver","snow_windweaver","snow_freeze_touch","snow_freeze_touch","snow_wind_strike","chaos_rift","fog_sailor","snow_medic","archive_guard","nina","snow_shatter_judge","mist_scout"];
  // ===== 统一卡牌文案排版（最终兜底，压过前面所有动态生成的文字）=====
  // 规则：补单位（点伤害 / 点护甲 / 张牌）、中文与数字之间留空格；
  //      但「镇脉2」「引脉6」这类术语+数字保持紧贴。
  (function unifyCardText() {
    const TERMS = "镇脉|引脉|刻脉|逆脉|掘脉|压脉|血祭|吞噬|预兆|检索|回潮|连携|守备|先遣|格挡|余响|登场";
    const norm = (text) => {
      let t = String(text || "");
      t = t.replace(/造成\s*(\d+)\s*伤害/g, "造成 $1 点伤害");
      t = t.replace(/获得\s*(\d+)\s*护甲/g, "获得 $1 点护甲");
      t = t.replace(/(?<![\d点\s])(\d+)\s*伤(?!害)/g, "$1 点伤害");
      t = t.replace(/(?<![\d点\s])(\d+)\s*甲(?!护)/g, "$1 点护甲");
      t = t.replace(/抽\s*(\d+)(?!\s*张)(?!\s*牌)/g, "抽 $1 张");
      t = t.replace(/恢复领袖\s*(\d+)(?!\s*点)(?!\s*生命)/g, "恢复领袖 $1 点生命");
      // 术语保护
      const guards = [];
      t = t.replace(new RegExp("(" + TERMS + ")\\s*(\\d+)", "g"), (full, term, num) => {
        guards.push(term + num);
        return "\u0001" + (guards.length - 1) + "\u0001";
      });
      t = t.replace(/([\u4e00-\u9fa5])\s*(\d+)\s*(点|张|个|费)/g, "$1 $2 $3");
      t = t.replace(/\u0001(\d+)\u0001/g, (full, i) => guards[Number(i)]);
      t = t.replace(/(点|张|个)\s+\1/g, "$1");
      t = t.replace(/[ \t]{2,}/g, " ");
      t = t.replace(/\s+([，。；：、！？])/g, "$1");
      return t.trim();
    };
    for (const id of Object.keys(CARDS)) {
      const c = CARDS[id];
      if (c && typeof c.text === "string" && c.text) c.text = norm(c.text);
    }
  })();
  // 血潮镰：无条件 +1 攻；生命 ≤15 时再补 +1 生命（文字写的是「改为 +1/+1」）
  if (CARDS.blood_scythe) {
    CARDS.blood_scythe.equipAura = { attack: 1, condition: "hp15", bonus: { health: 1 } };
  }
  // 三件装备的「友方随从 +1 攻」原来只在文字里，equipAura 缺 attack 位 → 加成从未生效
  if (CARDS.blood_censer) {
    CARDS.blood_censer.equipAura = { attack: 1, condition: "lostHealth", bonus: { healTurn: 1 } };
  }
  if (CARDS.gh_venom_vial) {
    CARDS.gh_venom_vial.equipAura = { attack: 1, spellDraw: 1, condition: "demon", bonus: { spellDraw: 1 } };
  }
  // 血骨护肩：无条件 +1 攻；本回合失去过生命时再 +1 攻（合计 +2）
  if (CARDS.bloodbone_pauldron) {
    CARDS.bloodbone_pauldron.equipAura = { attack: 1, condition: "lostHealth", bonus: { attack: 1 } };
  }
  // 处刑督办被动补 health：文字是 +1/+1，字段原来只有 attack
  if (CARDS.execution_supervisor && CARDS.execution_supervisor.passive) CARDS.execution_supervisor.passive.health = 1;
  // 白霜回廊：文字写「改为+1/+1」，但 bonus 多给了 health+1，实际变成 +1/+2
  if (CARDS.white_frost_hall && CARDS.white_frost_hall.formation) {
    CARDS.white_frost_hall.formation.bonus = { attack: 1, health: 0 };
  }
  // 目标冻结判断顺序修正：原来「冻结 → 判断已冻结」永远为真，
  // 改成「判断施放前是否已冻结 → 再冻结」，才符合卡面写的「若目标已冻结」。
  if (CARDS.frost_seal && CARDS.frost_seal.spell) CARDS.frost_seal.spell.ops = [{"op":"if","then":[{"op":"armor","amount":4}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.debate && CARDS.debate.spell) CARDS.debate.spell.ops = [{"op":"damageTarget","amount":2},{"op":"if","cond":"targetFrozen","then":[{"op":"draw","amount":1}]},{"op":"freezeTarget"}];
  if (CARDS.armor_break && CARDS.armor_break.spell) CARDS.armor_break.spell.ops = [{"op":"damageTarget","amount":1},{"op":"if","cond":"targetFrozen","then":[{"op":"draw","amount":1}]},{"op":"freezeTarget"}];
  if (CARDS.double_formula && CARDS.double_formula.spell) CARDS.double_formula.spell.ops = [{"op":"damageTarget","amount":3},{"op":"if","cond":"targetFrozen","then":[{"op":"draw","amount":1}]},{"op":"freezeTarget"}];
  if (CARDS.old_compass && CARDS.old_compass.spell) CARDS.old_compass.spell.ops = [{"op":"if","then":[{"op":"armor","amount":4}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.smuggler_ship && CARDS.smuggler_ship.spell) CARDS.smuggler_ship.spell.ops = [{"op":"if","then":[{"op":"draw","amount":1}],"cond":"targetFrozen"},{"op":"freezeTarget"},{"op":"draw","amount":1}];
  if (CARDS.mist_bargain && CARDS.mist_bargain.spell) CARDS.mist_bargain.spell.ops = [{"op":"if","then":[{"op":"draw","amount":1}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.anvil_quench && CARDS.anvil_quench.spell) CARDS.anvil_quench.spell.ops = [{"op":"if","then":[{"op":"armor","amount":5}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.north_trail && CARDS.north_trail.spell) CARDS.north_trail.spell.ops = [{"op":"if","then":[{"op":"armor","amount":2}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.snow_freeze_touch && CARDS.snow_freeze_touch.spell) CARDS.snow_freeze_touch.spell.ops = [{"op":"if","then":[{"op":"armor","amount":2}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.snow_wind_strike && CARDS.snow_wind_strike.spell) CARDS.snow_wind_strike.spell.ops = [{"op":"if","then":[{"op":"armor","amount":2}],"cond":"targetFrozen"},{"op":"freezeTarget"},{"op":"armor","amount":1}];
  if (CARDS.snow_ice_wall && CARDS.snow_ice_wall.spell) CARDS.snow_ice_wall.spell.ops = [{"op":"if","then":[{"op":"armor","amount":2}],"cond":"targetFrozen"},{"op":"freezeTarget"},{"op":"armor","amount":3}];
  if (CARDS.snow_time_stop && CARDS.snow_time_stop.spell) CARDS.snow_time_stop.spell.ops = [{"op":"if","then":[{"op":"armor","amount":4}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.snow_frost_veil && CARDS.snow_frost_veil.spell) CARDS.snow_frost_veil.spell.ops = [{"op":"if","then":[{"op":"draw","amount":1}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  if (CARDS.snow_wind_step && CARDS.snow_wind_step.spell) CARDS.snow_wind_step.spell.ops = [{"op":"if","then":[{"op":"draw","amount":2}],"cond":"targetFrozen"},{"op":"freezeTarget"}];
  // 若…否则… 缺 else 的战术牌：文字写了「否则 X」，但 ops 只有 then

  if (CARDS.frost_seal && CARDS.frost_seal.spell) {
    CARDS.frost_seal.spell = { type: "ops", ops: [{"op":"if","cond":"targetFrozen","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]},{"op":"freezeTarget"}] };
  }
  if (CARDS.old_compass && CARDS.old_compass.spell) {
    CARDS.old_compass.spell = { type: "ops", ops: [{"op":"if","cond":"targetFrozen","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]},{"op":"freezeTarget"}] };
  }
  if (CARDS.anvil_quench && CARDS.anvil_quench.spell) {
    CARDS.anvil_quench.spell = { type: "ops", ops: [{"op":"if","cond":"targetFrozen","then":[{"op":"armor","amount":5}],"else":[{"op":"armor","amount":3}]},{"op":"freezeTarget"}] };
  }
  if (CARDS.snow_time_stop && CARDS.snow_time_stop.spell) {
    CARDS.snow_time_stop.spell = { type: "ops", ops: [{"op":"if","cond":"targetFrozen","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]},{"op":"freezeTarget"}] };
  }
  if (CARDS.snow_frost_veil && CARDS.snow_frost_veil.spell) {
    CARDS.snow_frost_veil.spell = { type: "ops", ops: [{"op":"if","cond":"targetFrozen","then":[{"op":"draw","amount":1}],"else":[{"op":"armor","amount":1}]},{"op":"freezeTarget"}] };
  }
  if (CARDS.snow_wind_step && CARDS.snow_wind_step.spell) {
    CARDS.snow_wind_step.spell = { type: "ops", ops: [{"op":"if","cond":"targetFrozen","then":[{"op":"draw","amount":2}],"else":[{"op":"draw","amount":1}]},{"op":"freezeTarget"}] };
  }
  if (CARDS.vein_surge && CARDS.vein_surge.spell) {
    CARDS.vein_surge.spell = { type: "ops", ops: [{"op":"if","cond":"vein","value":7,"then":[{"op":"draw","amount":3}],"else":[{"op":"zhenmai","amount":2}]}] };
  }
  // 战术牌 if 缺 cond 补齐（原来这些 if 永远不执行，整块效果是空的）
  if (CARDS.old_ledger && CARDS.old_ledger.spell) CARDS.old_ledger.spell.ops = [{"op":"discover","pool":"spell"},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"carveCard"}];
  if (CARDS.mana_surge && CARDS.mana_surge.spell) CARDS.mana_surge.spell.ops = [{"op":"mana","amount":2},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"handSpell"}];
  if (CARDS.blood_pact && CARDS.blood_pact.spell) CARDS.blood_pact.spell.ops = [{"op":"damageTarget","amount":3},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"targetDead"}];
  if (CARDS.vein_siphon && CARDS.vein_siphon.spell) CARDS.vein_siphon.spell.ops = [{"op":"damageTarget","amount":4},{"op":"if","then":[{"op":"healHero","amount":2}],"cond":"targetDamaged"}];
  if (CARDS.war_tax && CARDS.war_tax.spell) CARDS.war_tax.spell.ops = [{"op":"armor","amount":1},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"armor"}];
  if (CARDS.south_pole_tracker && CARDS.south_pole_tracker.spell) CARDS.south_pole_tracker.spell.ops = [{"op":"draw","amount":1},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"enemyNoMinions"}];
  if (CARDS.dusk_inn && CARDS.dusk_inn.spell) CARDS.dusk_inn.spell.ops = [{"op":"freezeTarget"},{"op":"if","then":[{"op":"armor","amount":2}],"cond":"controlFox"}];
  if (CARDS.world_map && CARDS.world_map.spell) CARDS.world_map.spell.ops = [{"op":"draw","amount":1},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"controlFox"}];
  if (CARDS.snow_gale && CARDS.snow_gale.spell) CARDS.snow_gale.spell.ops = [{"op":"freezeTarget"},{"op":"armor","amount":2},{"op":"if","then":[{"op":"armor","amount":1}],"cond":"controlFox"}];
  if (CARDS.ac_field_notes && CARDS.ac_field_notes.spell) CARDS.ac_field_notes.spell.ops = [{"op":"freezeTarget"},{"op":"if","then":[{"op":"freezeAllEnemies"}],"cond":"spells2"}];
  if (CARDS.ac_archive_eruption && CARDS.ac_archive_eruption.spell) CARDS.ac_archive_eruption.spell.ops = [{"op":"draw","amount":2},{"op":"if","then":[{"op":"draw","amount":2}],"cond":"spells2"}];
  // 镇脉卡补 cond（判断本次实际消耗是否达到上限）
  if (CARDS.armor_recycle && CARDS.armor_recycle.spell) CARDS.armor_recycle.spell.ops = [{"op":"if","then":[{"op":"armor","amount":1}],"cond":"zhenmaiFull","value":2}];
  if (CARDS.house_legacy && CARDS.house_legacy.spell) CARDS.house_legacy.spell.ops = [{"op":"if","then":[{"op":"healHero","amount":2}],"cond":"zhenmaiFull","value":3}];
  // 账本宪法补 cond（逆脉实际消耗 2 时再抽 1 张）
  if (CARDS.ledger_constitution && CARDS.ledger_constitution.spell) CARDS.ledger_constitution.spell.ops = [{"op":"armor","amount":4},{"op":"if","then":[{"op":"draw","amount":1}],"cond":"refluxFull","value":2}];
  // 铁流冲锋补 grantDeathDraw（先给先遣，再挂「本回合死亡时抽 1 张」标记）
  if (CARDS.ironflow_charge && CARDS.ironflow_charge.spell) CARDS.ironflow_charge.spell.ops = [{"op":"grantRushTarget"},{"op":"grantDeathDraw"}];
  // 亡语/登场卡补条件（这些 if 缺 cond 或用了不存在的操作名）

  if (CARDS.siege_train) CARDS.siege_train.battlecry = {"type":"ops","ops":[{"op":"if","cond":"armorGained","then":[{"op":"damageAllEnemies","amount":2}],"else":[{"op":"damageAllEnemies","amount":1}]}]};
  if (CARDS.wandering_merchant) CARDS.wandering_merchant.battlecry = {"type":"ops","ops":[{"op":"draw","amount":1},{"op":"if","cond":"handSpell","then":[{"op":"draw","amount":2}]}]};
  if (CARDS.index_assistant) CARDS.index_assistant.battlecry = {"type":"ops","ops":[{"op":"discover","pool":"spell"},{"op":"if","cond":"carveCard","then":[{"op":"armor","amount":2}]}]};
  if (CARDS.cassian_foreign) CARDS.cassian_foreign.battlecry = {"type":"ops","ops":[{"op":"if","cond":"handSpell","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]}]};
  if (CARDS.gok_engineer) CARDS.gok_engineer.battlecry = {"type":"ops","ops":[{"op":"discover","pool":"spell"},{"op":"if","cond":"carveCard","then":[{"op":"armor","amount":2}]}]};
  if (CARDS.snow_guard_captain) CARDS.snow_guard_captain.battlecry = {"type":"ops","ops":[{"op":"freezeTarget"},{"op":"if","cond":"controlFox","then":[{"op":"summon","token":"snow_fox_sentry"}]}]};
  if (CARDS.wandering_blade) CARDS.wandering_blade.deathrattle = {"type":"ops","ops":[{"op":"if","cond":"attacked","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]}]};
  if (CARDS.gh_poison_thrower) CARDS.gh_poison_thrower.deathrattle = {"type":"ops","ops":[{"op":"if","cond":"bountyTargetDead","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":1}]}]};
  if (CARDS.gh_scorpion) CARDS.gh_scorpion.deathrattle = {"type":"ops","ops":[{"op":"if","cond":"bountyTargetDead","then":[{"op":"armor","amount":4}],"else":[{"op":"armor","amount":2}]}]};
  if (CARDS.forge_engineer) CARDS.forge_engineer.deathrattle = {"type":"ops","ops":[{"op":"if","cond":"zhenmai","then":[{"op":"armor","amount":2}]}]};
  if (CARDS.north_beast_tamer) CARDS.north_beast_tamer.battlecry = {"type":"ops","ops":[{"op":"flowDraw","draw":1,"vein":1}]};
  if (CARDS.snow_time_echo) CARDS.snow_time_echo.deathrattle = {"type":"ops","ops":[{"op":"damageAllEnemies","amount":2,"onlyFrozen":true}]};
  // 全体效果却要求选单个目标：这些卡的效果是「所有敌方随从」，
  // target 却是 enemy，导致场上没有敌方随从时打不出来。改成 none。
  if (CARDS.combo_spark) CARDS.combo_spark.target = "none";
  if (CARDS.spellstorm) CARDS.spellstorm.target = "none";
  if (CARDS.formula_fix) CARDS.formula_fix.target = "none";
  if (CARDS.snow_blizzard_elemental) CARDS.snow_blizzard_elemental.target = "none";
  // 回流医师修正：target 不该要求选随从；亡语补齐「逆脉 2 + 恢复 2」
  if (CARDS.reflux_physician) {
    CARDS.reflux_physician.target = "none";
    CARDS.reflux_physician.deathrattle = { type: "ops", ops: [
      { op: "refluxHeal", reflux: 2 },
      { op: "armor", amount: 2 }
    ] };
  }
  // 极光 target 修正：效果是全体冻结，不需要选单体目标
  if (CARDS.snow_aurora) CARDS.snow_aurora.target = "none";
  // ===== 去掉停用/实验标记：只有彩蛋卡不给用，其他全部可收集 =====
  // 压脉靠 def.pressure 触发，effect 本来是空的，这里补上 pressure
  if (CARDS.pressure_vein) { CARDS.pressure_vein.pressure = 3; }
  if (CARDS.monarch) { delete CARDS.monarch.disabled; delete CARDS.monarch.experimental; }
  if (CARDS.stabilize) { delete CARDS.stabilize.disabled; delete CARDS.stabilize.experimental; }
  if (CARDS.pressure_vein) { delete CARDS.pressure_vein.disabled; delete CARDS.pressure_vein.experimental; }
  if (CARDS.return_tide) { delete CARDS.return_tide.disabled; delete CARDS.return_tide.experimental; }
  if (CARDS.zone_reaper) { delete CARDS.zone_reaper.disabled; delete CARDS.zone_reaper.experimental; }
  if (CARDS.vein_bulwark) { delete CARDS.vein_bulwark.disabled; delete CARDS.vein_bulwark.experimental; }
  if (CARDS.overload_ritual) { delete CARDS.overload_ritual.disabled; delete CARDS.overload_ritual.experimental; }
  if (CARDS.rebirth_serpent) { delete CARDS.rebirth_serpent.disabled; delete CARDS.rebirth_serpent.experimental; }
  if (CARDS.vein_channeler) { delete CARDS.vein_channeler.disabled; delete CARDS.vein_channeler.experimental; }
  if (CARDS.vein_surveyor) { delete CARDS.vein_surveyor.disabled; delete CARDS.vein_surveyor.experimental; }
  if (CARDS.siphon_guard) { delete CARDS.siphon_guard.disabled; delete CARDS.siphon_guard.experimental; }
  if (CARDS.time_reflux) { delete CARDS.time_reflux.disabled; delete CARDS.time_reflux.experimental; }
  if (CARDS.chaos_rift) { delete CARDS.chaos_rift.disabled; delete CARDS.chaos_rift.experimental; }
  if (CARDS.mutant_egg) { delete CARDS.mutant_egg.disabled; delete CARDS.mutant_egg.experimental; }
  if (CARDS.fate_gambler) { delete CARDS.fate_gambler.disabled; delete CARDS.fate_gambler.experimental; }
  if (CARDS.forbidden_knowledge) { delete CARDS.forbidden_knowledge.disabled; delete CARDS.forbidden_knowledge.experimental; }
  if (CARDS.time_loan) { delete CARDS.time_loan.disabled; delete CARDS.time_loan.experimental; }
  if (CARDS.vein_surge) { delete CARDS.vein_surge.disabled; delete CARDS.vein_surge.experimental; }
  if (CARDS.vein_ward) { delete CARDS.vein_ward.disabled; delete CARDS.vein_ward.experimental; }
  if (CARDS.battle_calc) { delete CARDS.battle_calc.disabled; delete CARDS.battle_calc.experimental; }
  if (CARDS.vein_sentinel) { delete CARDS.vein_sentinel.disabled; delete CARDS.vein_sentinel.experimental; }
  if (CARDS.secret_police) { delete CARDS.secret_police.disabled; delete CARDS.secret_police.experimental; }
  if (CARDS.formation_echo) { delete CARDS.formation_echo.disabled; delete CARDS.formation_echo.experimental; }
  if (CARDS.formula_apprentice) { delete CARDS.formula_apprentice.disabled; delete CARDS.formula_apprentice.experimental; }
  // 时间回流启用：费用 100 → 6（原来 100 是禁用用的占位）
  if (CARDS.time_reflux) CARDS.time_reflux.cost = 6;
  // ===== 坟场机制：帝国黑魔法 / 灰港收尸 =====
  // 帝国：内卫部秘密研究禁忌死灵术，用尸体作燃料（献祭 = 除外坟场，不可逆）
  // 灰港：把尸体当黑市货物（拾取 = 从坟场拿牌，可循环）
  if (CARDS.iron_mechanic) Object.assign(CARDS.iron_mechanic, {"name":"焚尸炉","cost":3,"attack":1,"health":2,"text":"献祭 2：若坟场有 2 张以上牌，除外它们并抽 1 张牌。","battlecry":{"type":"ops","ops":[{"op":"if","cond":"graveCount","value":2,"then":[{"op":"graveBanish","amount":2},{"op":"draw","amount":1}]}]},"keywords":[]});
  if (CARDS.pressure_vein) Object.assign(CARDS.pressure_vein, {"name":"黑弥撒","cost":2,"text":"献祭 4：对所有敌方随从造成 2 点伤害；坟场不足 4 张时改为 1 点。","spell":{"type":"ops","ops":[{"op":"if","cond":"graveCount","value":4,"then":[{"op":"graveBanish","amount":4},{"op":"damageAllEnemies","amount":2}],"else":[{"op":"damageAllEnemies","amount":1}]}]}});
  if (CARDS.armor_drive) Object.assign(CARDS.armor_drive, {"name":"亡者契约","cost":2,"text":"该阵位友方固定获得 +1/+1；该阵位友方死亡时，改为回到手牌（每回合一次）。","formation":{"attack":1,"health":1}});
  if (CARDS.blackridge_heavy_armor) Object.assign(CARDS.blackridge_heavy_armor, {"name":"禁术卷轴","cost":2,"text":"装备（持续生效）：回合开始时献祭 3，若成功则抽 1 张牌。","equipAura":{}});
  if (CARDS.iron_order_wall) Object.assign(CARDS.iron_order_wall, {"name":"尸术师","cost":5,"attack":4,"health":6,"text":"守备。登场：从坟场召唤一个行动力消耗不超过 3 的随从，你失去等同于其消耗的生命。","battlecry":{"type":"ops","ops":[{"op":"graveSummon","maxCost":3}]},"keywords":["taunt"]});
  if (CARDS.armory_keeper) Object.assign(CARDS.armory_keeper, {"name":"内卫部大法官","cost":8,"attack":5,"health":8,"rarity":"legendary","text":"登场：献祭坟场所有牌。每献祭 4 张，召唤一个 5/5 的墓钟守卫。","battlecry":{"type":"ops","ops":[{"op":"graveMassSummon","per":4,"token":"grave_guard"}]}});
  if (CARDS.gh_bounty_notice) Object.assign(CARDS.gh_bounty_notice, {"name":"坟场账簿","cost":1,"text":"该阵位友方固定获得 +0/+1；回合开始时，坟场每有 5 张牌，抽 1 张牌（每回合一次）。","formation":{"health":1}});
  if (CARDS.gh_silence_field) Object.assign(CARDS.gh_silence_field, {"name":"收尸队","cost":3,"text":"该阵位友方固定获得 +1 攻；你的随从死亡时，领袖获得 1 点护甲。","formation":{"attack":1}});
  if (CARDS.venom_attendant) Object.assign(CARDS.venom_attendant, {"name":"拾荒者","cost":1,"attack":1,"health":2,"text":"登场：从坟场选一张装备或战术牌加入手牌，其行动力消耗 +1。","battlecry":{"type":"ops","ops":[{"op":"graveDraw","kinds":["equipment","formation","spell"],"costPenalty":1}]},"keywords":[]});
  if (CARDS.gh_venom_apprentice) Object.assign(CARDS.gh_venom_apprentice, {"name":"验尸官","cost":1,"attack":1,"health":1,"text":"登场：若坟场里有带悬赏标记的牌，抽 2 张牌。","battlecry":{"type":"ops","ops":[{"op":"if","cond":"graveHasBounty","then":[{"op":"draw","amount":2}]}]},"keywords":[]});
  if (CARDS.commission_advance) Object.assign(CARDS.commission_advance, {"name":"黑市拍卖","cost":2,"text":"除外坟场 2 张牌，获得 2 点行动力。","spell":{"type":"ops","ops":[{"op":"graveBanish","amount":2},{"op":"mana","amount":2}]}});
  if (CARDS.gh_bodyguard_contract) Object.assign(CARDS.gh_bodyguard_contract, {"name":"灭口","cost":2,"text":"除外坟场 3 张牌，领袖获得 2 点护甲，抽 1 张牌。","spell":{"type":"ops","ops":[{"op":"graveBanish","amount":3},{"op":"armor","amount":2},{"op":"draw","amount":1}]}});
  if (CARDS.gh_bounty_king) Object.assign(CARDS.gh_bounty_king, {"name":"黑市之主","cost":7,"attack":7,"health":7,"rarity":"legendary","text":"登场：从坟场选最多 3 张牌加入手牌，费用各 +1。","battlecry":{"type":"ops","ops":[{"op":"graveDraw","count":3,"costPenalty":1}]}});
  // 坟场卡补丁：清旧效果 + 修文案 + 修装备
  // 替换时旧的 deathrattle/battlecry 要显式清掉，否则正文和字段对不上
  if (CARDS.venom_attendant) { delete CARDS.venom_attendant.deathrattle; CARDS.venom_attendant.battlecry = { type: "ops", ops: [{ op: "graveDraw", kinds: ["equipment", "formation", "spell"], costPenalty: 1 }] }; }
  if (CARDS.armory_keeper) { delete CARDS.armory_keeper.deathrattle; CARDS.armory_keeper.battlecry = { type: "ops", ops: [{ op: "graveMassSummon", per: 4, token: "grave_guard" }] }; }
  if (CARDS.iron_order_wall) { delete CARDS.iron_order_wall.deathrattle; CARDS.iron_order_wall.battlecry = { type: "ops", ops: [{ op: "graveSummon", maxCost: 3 }] }; }
  // 黑市之主：文案里的「费用」改成「行动力消耗」
  if (CARDS.gh_bounty_king) CARDS.gh_bounty_king.text = "登场：从坟场选最多 3 张牌加入手牌，其行动力消耗各 +1。";
  // 禁术卷轴：装备效果改成「回合开始时坟场够 5 张就 +2 护甲」
  if (CARDS.blackridge_heavy_armor) { CARDS.blackridge_heavy_armor.equipAura = { armorTurn: 2, condition: "grave5", bonus: {} }; CARDS.blackridge_heavy_armor.text = "装备（持续生效）：回合开始时，若坟场有 5 张以上牌，领袖获得 2 点护甲。"; }
  // 坟场卡入预组（帝国 / 灰港）
  if (DECKS) DECKS.empire = ["zone_barrage","fog_dockhand","powder_engine","armor_forge","klaus","walter","iron_artillery","blackridge_heavy_armor","siege_captain","barrage","mist_pier","otto_hand","fate_gambler","dusk_inn_yard","martial_court","chaos_rift","neutral_wayfarer","time_loan","gok_digger","fog_sailor","snow_medic","mist_scout","caravan_guard","losutai_refugee","archive_guard","archive_guard","iron_mechanic","pressure_vein","iron_order_wall","armory_keeper"];
  if (DECKS) DECKS.greyharbor = ["gh_bounty_notice","mist_hound","dusk_inn_yard","gh_ledger_chain","venom_attendant","venom_attendant","gh_captain","fate_gambler","vein_surge","gh_poison_thrower","lamp_post","white_reef_lamp_oil","gh_venom_shield","gh_legend_assassin","gh_bounty_collector","kugreen","gh_scorpion","chaos_rift","time_loan","fog_dockhand","execution_supervisor","seran","toll_account","fog_harbor_ticket","fog_sailor","gh_contract_squire","gh_silence_field","gh_venom_apprentice","commission_advance","gh_bodyguard_contract"];
  // 大法官改史诗（帝国传说位已满 2 张）——坟场机制的核心卡不该受构筑限制排挤
  if (CARDS.armory_keeper) CARDS.armory_keeper.rarity = "epic";
  // 灰港阵型减到 3 张（超过阵位数量会触发构筑提醒）
  if (DECKS) DECKS.greyharbor = ["gh_bounty_notice","mist_hound","dusk_inn_yard","gh_ledger_chain","venom_attendant","venom_attendant","gh_captain","fate_gambler","vein_surge","gh_poison_thrower","white_reef_lamp_oil","gh_venom_shield","gh_legend_assassin","gh_bounty_collector","kugreen","gh_scorpion","chaos_rift","time_loan","fog_dockhand","execution_supervisor","seran","toll_account","fog_harbor_ticket","fog_sailor","gh_contract_squire","gh_silence_field","gh_venom_apprentice","commission_advance","gh_bodyguard_contract","gh_rush_archer"];
  // 阵型事件：坟场账簿 / 收尸队
  if (CARDS.gh_bounty_notice) {
    CARDS.gh_bounty_notice.formation = { health: 1, onEvent: { event: "turnStart", effect: "draw", amount: 1, graveMin: 5 } };
    CARDS.gh_bounty_notice.text = "该阵位友方固定获得 +0/+1；回合开始时，若坟场有 5 张以上牌，抽 1 张牌。";
  }
  if (CARDS.gh_silence_field) {
    CARDS.gh_silence_field.formation = { attack: 1, onEvent: { event: "death", effect: "armor", amount: 1 } };
    CARDS.gh_silence_field.text = "该阵位友方固定获得 +1 攻；你的随从死亡时，领袖获得 1 点护甲。";
  }
  // 亡者契约进帝国预组（死亡改回手牌，是坟场机制的反向手段）
  if (DECKS) DECKS.empire = ["zone_barrage","fog_dockhand","powder_engine","armor_forge","klaus","walter","iron_artillery","blackridge_heavy_armor","siege_captain","barrage","mist_pier","otto_hand","fate_gambler","dusk_inn_yard","martial_court","chaos_rift","neutral_wayfarer","time_loan","gok_digger","fog_sailor","snow_medic","mist_scout","caravan_guard","losutai_refugee","archive_guard","iron_mechanic","pressure_vein","iron_order_wall","armory_keeper","armor_drive"];
  // 帝国阵型减到 3 张（阵位数量上限）
  if (DECKS) DECKS.empire = ["fog_dockhand","powder_engine","armor_forge","klaus","walter","iron_artillery","blackridge_heavy_armor","siege_captain","barrage","mist_pier","otto_hand","fate_gambler","dusk_inn_yard","martial_court","chaos_rift","neutral_wayfarer","time_loan","gok_digger","fog_sailor","snow_medic","mist_scout","caravan_guard","losutai_refugee","archive_guard","iron_mechanic","pressure_vein","iron_order_wall","armory_keeper","armor_drive","archive_guard"];
  // 黑市之主进灰港预组（换掉「苦绿」——坟场回收才是这个阵营的新核心）
  if (DECKS) DECKS.greyharbor = ["gh_bounty_notice","mist_hound","dusk_inn_yard","gh_ledger_chain","venom_attendant","venom_attendant","gh_captain","fate_gambler","vein_surge","gh_poison_thrower","white_reef_lamp_oil","gh_venom_shield","gh_legend_assassin","gh_bounty_collector","gh_bounty_king","gh_scorpion","chaos_rift","time_loan","fog_dockhand","execution_supervisor","seran","toll_account","fog_harbor_ticket","fog_sailor","gh_contract_squire","gh_silence_field","gh_venom_apprentice","commission_advance","gh_bodyguard_contract","gh_rush_archer"];
  // ===== 灰港重做：销赃人 + 优质尸体机制 =====
  // 核心链条：悬赏目标死亡 → 尸体带 wasBounty 进坟场 → 灰港用「优质尸体」换更高收益

  // 「灭口」改成「销赃人」——只认悬赏尸体，回报更高
  if (CARDS.gh_bodyguard_contract) Object.assign(CARDS.gh_bodyguard_contract, {
    name: "销赃人",
    cost: 2,
    text: "处理掉坟场里一张带悬赏标记的牌，抽 2 张牌，领袖获得 2 点护甲。若坟场没有悬赏尸体，改为抽 1 张牌。",
    spell: { type: "ops", ops: [
      { op: "if", cond: "graveHasBounty",
        then: [{ op: "graveBanish", amount: 1, wasBounty: true }, { op: "draw", amount: 2 }, { op: "armor", amount: 2 }],
        else: [{ op: "draw", amount: 1 }] }
    ] }
  });

  // 拾荒者：1/2 → 1/3（原来太脆，撑不到用武之地）
  if (CARDS.venom_attendant) CARDS.venom_attendant.health = 3;

  // 黑市拍卖：+2 行动力 → +3
  if (CARDS.commission_advance) {
    CARDS.commission_advance.text = "处理掉坟场 2 张牌，获得 3 点行动力。";
    CARDS.commission_advance.spell = { type: "ops", ops: [{ op: "graveBanish", amount: 2 }, { op: "mana", amount: 3 }] };
  }

  // 验尸官：文案改清楚（读的是「悬赏尸体」）
  if (CARDS.gh_venom_apprentice) CARDS.gh_venom_apprentice.text = "登场：若坟场里有死于悬赏的牌，抽 2 张牌。";

  // ===== 帝国削数值（胜率 76.8% 太高）=====
  // 大法官：8 费 → 9 费
  if (CARDS.armory_keeper) CARDS.armory_keeper.cost = 9;
  // 尸术师：4/6 → 4/5
  if (CARDS.iron_order_wall) CARDS.iron_order_wall.health = 5;
  // 亡者契约：+1/+1 → +0/+1
  if (CARDS.armor_drive) {
    CARDS.armor_drive.formation = { health: 1 };
    CARDS.armor_drive.text = "该阵位友方固定获得 +0/+1；该阵位友方死亡时，改为回到手牌（每回合一次）。";
  }
  // 焚尸炉：1/2 → 1/1
  if (CARDS.iron_mechanic) CARDS.iron_mechanic.health = 1;
  // 黑弥撒：2 费 → 3 费
  if (CARDS.pressure_vein) CARDS.pressure_vein.cost = 3;
  // ===== 坟场只进不出重做 =====
  // 原则：坟场是弃牌堆，牌进去就不该再被「消耗」换收益。
  // 所有效果只有两种：① 读数量  ② 把牌拿回去（随从/战术/阵型/装备都能拿）

  // --- 帝国：只读数量，不消耗 ---
  // 焚尸炉：原来要「移除 2 张」，改成坟场够数就抽
  if (CARDS.iron_mechanic) Object.assign(CARDS.iron_mechanic, {
    cost: 3, attack: 1, health: 2,
    text: "登场：若坟场有 3 张以上牌，抽 1 张牌。",
    battlecry: { type: "ops", ops: [{ op: "if", cond: "graveCount", value: 3, then: [{ op: "draw", amount: 1 }] }] }
  });

  // 黑弥撒：按坟场总数造成伤害，不消耗
  if (CARDS.pressure_vein) Object.assign(CARDS.pressure_vein, {
    cost: 3,
    text: "对所有敌方随从造成等同于「坟场牌数 ÷ 4」（向下取整，至少 1，最多 3）的伤害。",
    spell: { type: "ops", ops: [{ op: "graveDamageAll", divisor: 4, min: 1, max: 3 }] }
  });

  // 大法官：坟场每 5 张召唤一个，不消耗坟场
  if (CARDS.armory_keeper) Object.assign(CARDS.armory_keeper, {
    cost: 9, attack: 5, health: 8,
    text: "登场：坟场每有 5 张牌，召唤一个 2/2 的亡灵（最多 3 个）。",
    battlecry: { type: "ops", ops: [{ op: "graveSummonTokens", per: 5, max: 3, token: "republic_recruit" }] }
  });

  // --- 灰港：拿牌，但坟场里的任何类型都能拿 ---
  // 拾荒者：去掉类型限制，随从/战术/阵型/装备都能拿
  if (CARDS.venom_attendant) Object.assign(CARDS.venom_attendant, {
    cost: 1, attack: 1, health: 3,
    text: "登场：从坟场选一张牌加入手牌，其行动力消耗 +1（衍生物除外）。",
    battlecry: { type: "ops", ops: [{ op: "graveDraw", costPenalty: 1 }] }
  });

  // 销赃人：只认悬赏尸体，但也不消耗——改成抽牌加护甲
  if (CARDS.gh_bodyguard_contract) Object.assign(CARDS.gh_bodyguard_contract, {
    name: "销赃人",
    cost: 2,
    text: "若坟场里有死于悬赏的牌，抽 2 张牌，领袖获得 2 点护甲；否则抽 1 张牌。",
    spell: { type: "ops", ops: [{ op: "if", cond: "graveHasBounty",
      then: [{ op: "draw", amount: 2 }, { op: "armor", amount: 2 }],
      else: [{ op: "draw", amount: 1 }] }] }
  });

  // 黑市拍卖：坟场够多就多抽，不消耗
  if (CARDS.commission_advance) Object.assign(CARDS.commission_advance, {
    cost: 2,
    text: "抽 2 张牌；若坟场有 5 张以上牌，改为抽 3 张牌。",
    spell: { type: "ops", ops: [{ op: "if", cond: "graveCount", value: 5, then: [{ op: "draw", amount: 3 }], else: [{ op: "draw", amount: 2 }] }] }
  });

  // 尸术师：召唤会拿走那张牌（这是必要的，不算「消耗换收益」）
  if (CARDS.iron_order_wall) Object.assign(CARDS.iron_order_wall, {
    cost: 5, attack: 4, health: 5,
    text: "守备。登场：从坟场召唤一个行动力消耗不超过 3 的随从，你失去等同于其消耗的生命。",
    battlecry: { type: "ops", ops: [{ op: "graveSummon", maxCost: 3 }] },
    keywords: ["taunt"]
  });
  // 清掉旧卡残留字段（换卡后原卡的机制字段会串味，比如黑弥撒带着「压脉3」）
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.pressure != null) delete CARDS.iron_mechanic.pressure;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.zhenmai != null) delete CARDS.iron_mechanic.zhenmai;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.yinmai != null) delete CARDS.iron_mechanic.yinmai;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.reflux != null) delete CARDS.iron_mechanic.reflux;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.reborn != null) delete CARDS.iron_mechanic.reborn;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.bounty != null) delete CARDS.iron_mechanic.bounty;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.debt != null) delete CARDS.iron_mechanic.debt;
  if (CARDS.iron_mechanic && CARDS.iron_mechanic.deadline != null) delete CARDS.iron_mechanic.deadline;
  if (CARDS.pressure_vein && CARDS.pressure_vein.pressure != null) delete CARDS.pressure_vein.pressure;
  if (CARDS.pressure_vein && CARDS.pressure_vein.zhenmai != null) delete CARDS.pressure_vein.zhenmai;
  if (CARDS.pressure_vein && CARDS.pressure_vein.yinmai != null) delete CARDS.pressure_vein.yinmai;
  if (CARDS.pressure_vein && CARDS.pressure_vein.reflux != null) delete CARDS.pressure_vein.reflux;
  if (CARDS.pressure_vein && CARDS.pressure_vein.reborn != null) delete CARDS.pressure_vein.reborn;
  if (CARDS.pressure_vein && CARDS.pressure_vein.bounty != null) delete CARDS.pressure_vein.bounty;
  if (CARDS.pressure_vein && CARDS.pressure_vein.debt != null) delete CARDS.pressure_vein.debt;
  if (CARDS.pressure_vein && CARDS.pressure_vein.deadline != null) delete CARDS.pressure_vein.deadline;
  if (CARDS.armor_drive && CARDS.armor_drive.pressure != null) delete CARDS.armor_drive.pressure;
  if (CARDS.armor_drive && CARDS.armor_drive.zhenmai != null) delete CARDS.armor_drive.zhenmai;
  if (CARDS.armor_drive && CARDS.armor_drive.yinmai != null) delete CARDS.armor_drive.yinmai;
  if (CARDS.armor_drive && CARDS.armor_drive.reflux != null) delete CARDS.armor_drive.reflux;
  if (CARDS.armor_drive && CARDS.armor_drive.reborn != null) delete CARDS.armor_drive.reborn;
  if (CARDS.armor_drive && CARDS.armor_drive.bounty != null) delete CARDS.armor_drive.bounty;
  if (CARDS.armor_drive && CARDS.armor_drive.debt != null) delete CARDS.armor_drive.debt;
  if (CARDS.armor_drive && CARDS.armor_drive.deadline != null) delete CARDS.armor_drive.deadline;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.pressure != null) delete CARDS.blackridge_heavy_armor.pressure;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.zhenmai != null) delete CARDS.blackridge_heavy_armor.zhenmai;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.yinmai != null) delete CARDS.blackridge_heavy_armor.yinmai;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.reflux != null) delete CARDS.blackridge_heavy_armor.reflux;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.reborn != null) delete CARDS.blackridge_heavy_armor.reborn;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.bounty != null) delete CARDS.blackridge_heavy_armor.bounty;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.debt != null) delete CARDS.blackridge_heavy_armor.debt;
  if (CARDS.blackridge_heavy_armor && CARDS.blackridge_heavy_armor.deadline != null) delete CARDS.blackridge_heavy_armor.deadline;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.pressure != null) delete CARDS.iron_order_wall.pressure;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.zhenmai != null) delete CARDS.iron_order_wall.zhenmai;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.yinmai != null) delete CARDS.iron_order_wall.yinmai;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.reflux != null) delete CARDS.iron_order_wall.reflux;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.reborn != null) delete CARDS.iron_order_wall.reborn;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.bounty != null) delete CARDS.iron_order_wall.bounty;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.debt != null) delete CARDS.iron_order_wall.debt;
  if (CARDS.iron_order_wall && CARDS.iron_order_wall.deadline != null) delete CARDS.iron_order_wall.deadline;
  if (CARDS.armory_keeper && CARDS.armory_keeper.pressure != null) delete CARDS.armory_keeper.pressure;
  if (CARDS.armory_keeper && CARDS.armory_keeper.zhenmai != null) delete CARDS.armory_keeper.zhenmai;
  if (CARDS.armory_keeper && CARDS.armory_keeper.yinmai != null) delete CARDS.armory_keeper.yinmai;
  if (CARDS.armory_keeper && CARDS.armory_keeper.reflux != null) delete CARDS.armory_keeper.reflux;
  if (CARDS.armory_keeper && CARDS.armory_keeper.reborn != null) delete CARDS.armory_keeper.reborn;
  if (CARDS.armory_keeper && CARDS.armory_keeper.bounty != null) delete CARDS.armory_keeper.bounty;
  if (CARDS.armory_keeper && CARDS.armory_keeper.debt != null) delete CARDS.armory_keeper.debt;
  if (CARDS.armory_keeper && CARDS.armory_keeper.deadline != null) delete CARDS.armory_keeper.deadline;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.pressure != null) delete CARDS.gh_bounty_notice.pressure;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.zhenmai != null) delete CARDS.gh_bounty_notice.zhenmai;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.yinmai != null) delete CARDS.gh_bounty_notice.yinmai;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.reflux != null) delete CARDS.gh_bounty_notice.reflux;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.reborn != null) delete CARDS.gh_bounty_notice.reborn;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.bounty != null) delete CARDS.gh_bounty_notice.bounty;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.debt != null) delete CARDS.gh_bounty_notice.debt;
  if (CARDS.gh_bounty_notice && CARDS.gh_bounty_notice.deadline != null) delete CARDS.gh_bounty_notice.deadline;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.pressure != null) delete CARDS.gh_silence_field.pressure;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.zhenmai != null) delete CARDS.gh_silence_field.zhenmai;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.yinmai != null) delete CARDS.gh_silence_field.yinmai;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.reflux != null) delete CARDS.gh_silence_field.reflux;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.reborn != null) delete CARDS.gh_silence_field.reborn;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.bounty != null) delete CARDS.gh_silence_field.bounty;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.debt != null) delete CARDS.gh_silence_field.debt;
  if (CARDS.gh_silence_field && CARDS.gh_silence_field.deadline != null) delete CARDS.gh_silence_field.deadline;
  if (CARDS.venom_attendant && CARDS.venom_attendant.pressure != null) delete CARDS.venom_attendant.pressure;
  if (CARDS.venom_attendant && CARDS.venom_attendant.zhenmai != null) delete CARDS.venom_attendant.zhenmai;
  if (CARDS.venom_attendant && CARDS.venom_attendant.yinmai != null) delete CARDS.venom_attendant.yinmai;
  if (CARDS.venom_attendant && CARDS.venom_attendant.reflux != null) delete CARDS.venom_attendant.reflux;
  if (CARDS.venom_attendant && CARDS.venom_attendant.reborn != null) delete CARDS.venom_attendant.reborn;
  if (CARDS.venom_attendant && CARDS.venom_attendant.bounty != null) delete CARDS.venom_attendant.bounty;
  if (CARDS.venom_attendant && CARDS.venom_attendant.debt != null) delete CARDS.venom_attendant.debt;
  if (CARDS.venom_attendant && CARDS.venom_attendant.deadline != null) delete CARDS.venom_attendant.deadline;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.pressure != null) delete CARDS.gh_venom_apprentice.pressure;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.zhenmai != null) delete CARDS.gh_venom_apprentice.zhenmai;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.yinmai != null) delete CARDS.gh_venom_apprentice.yinmai;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.reflux != null) delete CARDS.gh_venom_apprentice.reflux;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.reborn != null) delete CARDS.gh_venom_apprentice.reborn;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.bounty != null) delete CARDS.gh_venom_apprentice.bounty;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.debt != null) delete CARDS.gh_venom_apprentice.debt;
  if (CARDS.gh_venom_apprentice && CARDS.gh_venom_apprentice.deadline != null) delete CARDS.gh_venom_apprentice.deadline;
  if (CARDS.commission_advance && CARDS.commission_advance.pressure != null) delete CARDS.commission_advance.pressure;
  if (CARDS.commission_advance && CARDS.commission_advance.zhenmai != null) delete CARDS.commission_advance.zhenmai;
  if (CARDS.commission_advance && CARDS.commission_advance.yinmai != null) delete CARDS.commission_advance.yinmai;
  if (CARDS.commission_advance && CARDS.commission_advance.reflux != null) delete CARDS.commission_advance.reflux;
  if (CARDS.commission_advance && CARDS.commission_advance.reborn != null) delete CARDS.commission_advance.reborn;
  if (CARDS.commission_advance && CARDS.commission_advance.bounty != null) delete CARDS.commission_advance.bounty;
  if (CARDS.commission_advance && CARDS.commission_advance.debt != null) delete CARDS.commission_advance.debt;
  if (CARDS.commission_advance && CARDS.commission_advance.deadline != null) delete CARDS.commission_advance.deadline;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.pressure != null) delete CARDS.gh_bodyguard_contract.pressure;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.zhenmai != null) delete CARDS.gh_bodyguard_contract.zhenmai;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.yinmai != null) delete CARDS.gh_bodyguard_contract.yinmai;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.reflux != null) delete CARDS.gh_bodyguard_contract.reflux;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.reborn != null) delete CARDS.gh_bodyguard_contract.reborn;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.bounty != null) delete CARDS.gh_bodyguard_contract.bounty;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.debt != null) delete CARDS.gh_bodyguard_contract.debt;
  if (CARDS.gh_bodyguard_contract && CARDS.gh_bodyguard_contract.deadline != null) delete CARDS.gh_bodyguard_contract.deadline;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.pressure != null) delete CARDS.gh_bounty_king.pressure;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.zhenmai != null) delete CARDS.gh_bounty_king.zhenmai;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.yinmai != null) delete CARDS.gh_bounty_king.yinmai;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.reflux != null) delete CARDS.gh_bounty_king.reflux;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.reborn != null) delete CARDS.gh_bounty_king.reborn;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.bounty != null) delete CARDS.gh_bounty_king.bounty;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.debt != null) delete CARDS.gh_bounty_king.debt;
  if (CARDS.gh_bounty_king && CARDS.gh_bounty_king.deadline != null) delete CARDS.gh_bounty_king.deadline;
  // 坟场只放随从：文案精确化（原来写「牌」会让人以为战术牌也在里面）
  if (CARDS.iron_mechanic) CARDS.iron_mechanic.text = "登场：若坟场有 3 个以上随从，抽 1 张牌。";
  if (CARDS.pressure_vein) CARDS.pressure_vein.text = "对所有敌方随从造成等同于「坟场随从数 ÷ 4」（向下取整，至少 1，最多 3）的伤害。";
  if (CARDS.blackridge_heavy_armor) CARDS.blackridge_heavy_armor.text = "装备（持续生效）：回合开始时，若坟场有 5 个以上随从，领袖获得 2 点护甲。";
  if (CARDS.iron_order_wall) CARDS.iron_order_wall.text = "守备。登场：从坟场召唤一个行动力消耗不超过 3 的随从，你失去等同于其消耗的生命。";
  if (CARDS.armory_keeper) CARDS.armory_keeper.text = "登场：坟场每有 5 个随从，召唤一个 2/2 的亡灵（最多 3 个）。";
  if (CARDS.gh_bounty_notice) CARDS.gh_bounty_notice.text = "该阵位友方固定获得 +0/+1；回合开始时，若坟场有 5 个以上随从，抽 1 张牌。";
  if (CARDS.venom_attendant) CARDS.venom_attendant.text = "登场：从坟场选一个随从加入手牌，其行动力消耗 +1。";
  if (CARDS.gh_venom_apprentice) CARDS.gh_venom_apprentice.text = "登场：若坟场里有死于悬赏的随从，抽 2 张牌。";
  if (CARDS.commission_advance) CARDS.commission_advance.text = "抽 2 张牌；若坟场有 5 个以上随从，改为抽 3 张牌。";
  if (CARDS.gh_bodyguard_contract) CARDS.gh_bodyguard_contract.text = "若坟场里有死于悬赏的随从，抽 2 张牌，领袖获得 2 点护甲；否则抽 1 张牌。";
  if (CARDS.gh_bounty_king) CARDS.gh_bounty_king.text = "登场：从坟场选最多 3 个随从加入手牌，其行动力消耗各 +1。";
  // ===== 白银城城主（帝国）=====
  // 每死一次永久 +2/+2；在坟场里时，另一个友方随从死亡会把它唤醒回场（每回合一次）
  CARDS.eldlich_lord = {
    id: "eldlich_lord",
    name: "城主·永夜",
    faction: "empire",
    type: "minion",
    cost: 5,
    attack: 1,
    health: 1,
    rarity: "legendary",
    keywords: [],
    text: "每次死亡进坟墓时永久获得 +2/+2。当它在坟场里时，另一个友方随从死亡会把它唤醒回场（每回合一次）。",
    art: null
  };
  // ===== 定稿：坟场 / 招魂 / 悬赏（v9）=====
  // 招魂：从坟场取一个随从，沉默态回场；只有写明 preferLord 的三张会优先城主。
  (function applyGraveDefinitive() {
    const CLEAR = ["battlecry", "deathrattle", "deathrattles", "passive", "spell", "formation", "equipAura", "pressure", "zhenmai", "yinmai", "reflux", "reborn", "bounty", "debt", "deadline", "excavate", "bloodCost", "veinBonus", "zoneBonus", "mirrorBonus", "relic"];
    const put = function (id, patch) {
      const c = CARDS[id];
      if (!c) { console.log("缺卡: " + id); return; }
      for (const k of CLEAR) { if (Object.prototype.hasOwnProperty.call(patch, k)) continue; delete c[k]; }
      Object.assign(c, patch);
    };

    // ---------- 帝国 ----------
    put("lab_researcher", {
      name: "内卫部招魂师", faction: "empire", type: "minion", cost: 4, attack: 3, health: 3, rarity: "rare",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "graveSummon", maxCost: 3, preferLord: true }] },
      text: "登场：招魂一个行动力消耗不超过 3 的随从。若城主·永夜在坟场里，优先召唤它。"
    });
    put("forge_engineer", {
      name: "守墓人", faction: "empire", type: "minion", cost: 3, attack: 2, health: 3, rarity: "common",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "graveSummon", maxCost: 2 }, { op: "draw", amount: 1 }] },
      text: "登场：招魂一个行动力消耗不超过 2 的随从；抽 1 张牌。"
    });
    put("grain_convoy", {
      name: "黑弥撒执事", faction: "empire", type: "minion", cost: 5, attack: 4, health: 5, rarity: "common",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "graveSummon", maxCost: 2, count: 2, preferLord: true }] },
      text: "登场：招魂两次，每次招一个行动力消耗不超过 2 的随从。若城主·永夜在坟场里，第一次优先召唤它。"
    });
    put("pressure_vein", {
      name: "招魂", faction: "empire", type: "spell", cost: 3, rarity: "rare", target: "none", keywords: [],
      spell: { type: "ops", ops: [{ op: "graveSummon", maxCost: 5, preferLord: true }] },
      text: "招魂一个行动力消耗不超过 5 的随从。若城主·永夜在坟场里，优先召唤它。"
    });
    put("iron_order_wall", {
      name: "尸术师", faction: "empire", type: "minion", cost: 5, attack: 4, health: 5, rarity: "common",
      keywords: ["taunt"], target: "none",
      passive: { type: "sepulchreGrowth", attack: 1, health: 1 },
      text: "守备。被动：每当你招魂一个随从，本随从获得 +1/+1。"
    });
    put("armory_keeper", {
      name: "内卫部大法官", faction: "empire", type: "minion", cost: 8, attack: 5, health: 8, rarity: "epic",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "graveSummonTokens", per: 3, token: "empire_undead" }] },
      text: "登场：坟场每有 3 个随从，召唤一个 1/1 的亡灵。"
    });
    put("iron_mechanic", {
      name: "焚尸炉", faction: "empire", type: "minion", cost: 3, attack: 1, health: 2, rarity: "rare",
      keywords: [], target: "none",
      passive: { type: "graveMilestoneDraw", per: 3 },
      text: "被动：每当坟场里的随从数达到 3 的倍数，抽 1 张牌。"
    });
    put("armor_drive", {
      name: "亡者契约", faction: "empire", type: "formation", cost: 2, rarity: "common",
      formation: { attack: 0, health: 0 },
      text: "该阵位友方死亡时，城主·永夜永久获得 +1/+1。"
    });
    put("blackridge_heavy_armor", {
      name: "禁术卷轴", faction: "empire", type: "equipment", cost: 4, rarity: "common",
      equipAura: { sepulchreTurn: 1 },
      text: "装备（持续生效）：回合开始时，招魂一个行动力消耗为 1 的随从。"
    });
    put("eldlich_lord", {
      name: "城主·永夜", faction: "empire", type: "minion", cost: 5, attack: 1, health: 1, rarity: "legendary",
      keywords: [], target: "none",
      text: "每次死亡进坟场时永久获得 +1/+1（无上限）。只有招魂能把它从坟场召唤回来；它免疫沉默。"
    });

    // ---------- 灰港 ----------
    put("venom_attendant", {
      name: "拾荒者", faction: "greyharbor", type: "minion", cost: 2, attack: 1, health: 3, rarity: "common",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "bountyCorpseBuff", attack: 0, health: 1 }] },
      text: "登场：坟场每有 1 具悬赏尸体，本随从获得 +0/+1（无上限）。"
    });
    put("gh_bounty_king", {
      name: "黑市之主", faction: "greyharbor", type: "minion", cost: 7, attack: 7, health: 7, rarity: "legendary",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "bountyCorpseBuff", attack: 1, health: 1 }] },
      text: "登场：坟场每有 1 具悬赏尸体，本随从获得 +1/+1（无上限）。"
    });
    put("gh_venom_apprentice", {
      name: "验尸官", faction: "greyharbor", type: "minion", cost: 1, attack: 1, health: 1, rarity: "common",
      keywords: ["battlecry"], target: "none",
      battlecry: { type: "ops", ops: [{ op: "bountyCorpseDraw", max: 1, consume: "counted" }] },
      text: "登场：若坟场里有至少 1 具悬赏尸体，抽 1 张牌。"
    });
    put("gh_ledger", {
      name: "收尸结算", faction: "greyharbor", type: "spell", cost: 5, rarity: "rare", target: "none", keywords: [],
      spell: { type: "ops", ops: [{ op: "bountyCorpseDamageHero", consume: "counted" }] },
      text: "坟场每有 1 具悬赏尸体，对敌方领袖造成 1 点伤害（无上限）。"
    });
    put("commission_advance", {
      name: "黑市拍卖", faction: "greyharbor", type: "spell", cost: 3, rarity: "common", target: "none", keywords: [],
      spell: { type: "ops", ops: [{ op: "bountyCorpseDraw", max: 4, consume: "counted" }] },
      text: "坟场每有 1 具悬赏尸体，抽 1 张牌（最多 4 张）。"
    });
    put("gh_bodyguard_contract", {
      name: "销赃人", faction: "greyharbor", type: "spell", cost: 2, rarity: "common", target: "none", keywords: [],
      spell: { type: "ops", ops: [{ op: "bountyCorpseArmor", amount: 3, consume: 1 }] },
      text: "若坟场里有至少 1 具悬赏尸体，领袖获得 3 点护甲。"
    });
    put("gh_bounty_notice", {
      name: "坟场账簿", faction: "greyharbor", type: "formation", cost: 2, rarity: "common",
      formation: { attack: 0, health: 0, onEvent: { event: "turnStart", effect: "draw", amount: 1, bountyMin: 1 } },
      text: "回合开始时，若坟场里有悬赏尸体，抽 1 张牌（每回合一次）。"
    });
    put("gh_silence_field", {
      name: "收尸队", faction: "greyharbor", type: "formation", cost: 2, rarity: "rare",
      formation: { attack: 0, health: 0, onEvent: { event: "death", effect: "armor", amount: 1 } },
      text: "你的随从死亡时，领袖获得 1 点护甲。"
    });

    // ---------- 中立 / 普卫岛 ----------
    if (CARDS.timon) CARDS.timon.text = "登场：复活你在本局对战中死亡的、行动力消耗最高的一个随从（完整身材与效果）。";
    if (CARDS.vein_leviathan) CARDS.vein_leviathan.text = "登场：触发坟场里最近进入的、带有余响的 3 个随从的余响效果。";

    // ---------- 新衍生物：亡灵 1/1 ----------
    if (!CARDS.empire_undead) {
      CARDS.empire_undead = {
        id: "empire_undead", name: "亡灵", faction: "neutral", type: "minion",
        cost: 0, attack: 1, health: 1, rarity: "token", art: null,
        keywords: [], target: "none", text: "", flavor: "内卫部从坟场里拽出来的东西，不记得自己是谁。", token: true
      };
    }

    // ---------- 帝国预组：纯叠甲 ----------
    if (DECKS) {
      DECKS.empire = [
          "powder_engine", "armor_forge", "ministry_map",
          "battlefield_salvage", "formation_cannon", "armor_volley",
          "powder_boy", "powder_boy", "ironclad", "forge_technician", "rush_lancer",
          "audit_accountant", "audit_accountant", "quartermaster", "quartermaster",
          "empire_guard", "imperial_guard_officer", "siege_captain", "siege_captain",
          "powder_marshal", "iron_artillery", "walter", "zhenmai_artisan", "gunther",
          "siege_train", "barrage", "chaos_rift", "chaos_rift", "armor_mortar", "powder_keg"
    ];
    }
  })();

  // 2026-10-29：召唤类效果不吃目标，卡面误写 target=enemy 会让玩家白点一次
  if (CARDS.lanzhou) CARDS.lanzhou.target = "none";
  if (CARDS.losutai_matriarch) CARDS.losutai_matriarch.target = "none";
  // ===== 2026-10-29：灰港两套玩法（悬赏流 / 邪修流）=====
  // 赏金王回到悬赏流终端：每完成一次悬赏打领袖 2 点；原先被改成的「黑市之主」独立成邪修终端。
  if (CARDS.gh_bounty_king) {
    const corpseLord = Object.assign({}, CARDS.gh_bounty_king, {
      id: "gh_black_market_lord",
      name: "黑市之主",
      art: "gh_bounty_king",
      text: "登场：坟场每有 1 具悬赏尸体，本随从获得 +1/+1（无上限）。",
      flavor: "灰港没有王，除非你把所有人都买了。"
    });
    CARDS.gh_black_market_lord = corpseLord;
    Object.assign(CARDS.gh_bounty_king, {
      name: "赏金王",
      cost: 8,
      attack: 7,
      health: 7,
      keywords: [],
      battlecry: null,
      passive: { type: "bountyClaimDamage", amount: 2 },
      text: "被动：每完成一次悬赏，对敌方领袖造成 2 点伤害。",
      flavor: "在灰港，救命的账单通常比命还贵。"
    });
  }
  // 苦绿：把直伤还给赏金王，自己走成长
  if (CARDS.kugreen) {
    Object.assign(CARDS.kugreen, {
      passive: { type: "bountyClaimGrowth", attack: 1, health: 1 },
      text: "被动：每完成一次悬赏，自身获得 +1/+1。"
    });
  }
  // 邪修流两张启动器：把「悬赏目标」当成可以存进墓账的资源
  if (!CARDS.gh_fence_sellout) {
    CARDS.gh_fence_sellout = {
      id: "gh_fence_sellout", name: "销赃", faction: "greyharbor", type: "spell",
      cost: 3, rarity: "rare", target: "none",
      spell: { type: "destroyBounty", draw: 1, fallbackDraw: 1 },
      text: "消灭一个悬赏目标，抽 1 张牌。",
      flavor: "尸体进了账，钱才进了兜。"
    };
  }
  if (!CARDS.gh_raised_undead) {
    CARDS.gh_raised_undead = {
      id: "gh_raised_undead", name: "起尸", faction: "greyharbor", type: "minion",
      token: true, cost: 0, attack: 2, health: 2, rarity: "common", target: "none",
      art: "empire_undead",
      text: "从墓账里翻出来的尸体。"
    };
  }
  if (!CARDS.gh_grave_warden) {
    CARDS.gh_grave_warden = {
      id: "gh_grave_warden", name: "掘墓夜行者", faction: "greyharbor", type: "minion",
      cost: 4, attack: 4, health: 3, rarity: "epic", target: "none",
      keywords: ["battlecry"],
      battlecry: { type: "raiseBountyCorpse", token: "gh_raised_undead" },
      text: "登场：消耗 1 具悬赏尸体，召唤一个 2/2 的起尸。",
      flavor: "他挖的不是坟，是账。"
    };
  }
  // 灰港预组：补进邪修流两张启动器（换掉两张通用牌）
  DECKS.greyharbor = ["gh_bounty_notice","mist_hound","dusk_inn_yard","gh_ledger_chain","venom_attendant","venom_attendant","gh_captain","fate_gambler","vein_surge","gh_poison_thrower","gh_venom_shield","gh_legend_assassin","gh_bounty_collector","gh_bounty_king","gh_scorpion","chaos_rift","time_loan","fog_dockhand","execution_supervisor","seran","toll_account","fog_sailor","gh_contract_squire","gh_silence_field","gh_venom_apprentice","commission_advance","gh_bodyguard_contract","gh_rush_archer","gh_fence_sellout","gh_grave_warden"];
  // 灰港预组：补进邪修流两张启动器（换掉 1 张毒随从 + 1 张毒学徒）
  DECKS.greyharbor = ["gh_bounty_notice","mist_hound","dusk_inn_yard","gh_ledger_chain","venom_attendant","gh_captain","fate_gambler","vein_surge","gh_poison_thrower","white_reef_lamp_oil","gh_venom_shield","gh_legend_assassin","gh_bounty_collector","gh_bounty_king","gh_scorpion","chaos_rift","time_loan","fog_dockhand","execution_supervisor","seran","toll_account","fog_harbor_ticket","fog_sailor","gh_contract_squire","gh_silence_field","commission_advance","gh_bodyguard_contract","gh_rush_archer","gh_fence_sellout","gh_grave_warden"];
  // ===== 2026-10-29：弃牌堆回收（学院）=====
  if (!CARDS.ac_rewrite_draft) {
    CARDS.ac_rewrite_draft = {
      id: "ac_rewrite_draft", name: "旧稿重抄", faction: "academy", type: "spell",
      cost: 3, rarity: "rare", target: "none",
      spell: { type: "recallDiscard", kind: "spell", costCut: 1, fallbackDraw: 1 },
      text: "从弃牌堆取回一张战术牌，它的行动力消耗 -1；弃牌堆没有战术时抽 1 张。",
      flavor: "同一篇稿子，抄第二遍总要顺一点。"
    };
  }
  if (!CARDS.ac_archive_restorer) {
    CARDS.ac_archive_restorer = {
      id: "ac_archive_restorer", name: "档案复原员", faction: "academy", type: "minion",
      cost: 4, attack: 3, health: 4, rarity: "epic", target: "none",
      keywords: ["battlecry"],
      battlecry: { type: "recallDiscard", kind: "equipment" },
      text: "登场：从弃牌堆取回一张装备牌。",
      flavor: "在他手里，撕掉的配方也能拼回来。"
    };
  }
  // 学院预组：补进两张弃牌堆回收牌
  DECKS.academy = ["debate","debate","ac_arcane_insight","ac_arcane_insight","dark_route","dark_route","ac_arcane_flood","ac_arcane_flood","ac_knowledge_burst","ac_knowledge_burst","doorman","doorman","page_scholar","page_scholar","arcane_scribe","arcane_scribe","council_elder","council_elder","spell_novice","spell_novice","spell_conductor","cassian","archive_search","dusk_inn_yard","losutai_pool","spell_codex","academy_inkwell","frostweave_cloak","ac_rewrite_draft","ac_archive_restorer"];
  // ===== 2026-10-29 平衡调整（依据 8 阵营 1680 局模拟）=====
  // 灰港 33.3% → 加强：终端提前 + 邪修成长加速
  if (CARDS.gh_bounty_king) CARDS.gh_bounty_king.cost = 7;
  if (CARDS.gh_black_market_lord) CARDS.gh_black_market_lord.cost = 6;
  if (CARDS.gh_ledger) CARDS.gh_ledger.cost = 4;
  if (CARDS.gh_bounty_notice) CARDS.gh_bounty_notice.cost = 1;
  if (CARDS.kugreen) CARDS.kugreen.passive = { type: "bountyClaimGrowth", attack: 2, health: 2 };
  if (CARDS.venom_attendant) CARDS.venom_attendant.battlecry = { type: "ops", ops: [{ op: "bountyCorpseBuff", attack: 1, health: 1 }] };
  // 回收扩展：学院多取一张战术，共和国修装备顺带叠甲
  if (!CARDS.ac_rune_recast) {
    CARDS.ac_rune_recast = {
      id: "ac_rune_recast", name: "符能复诵", faction: "academy", type: "spell",
      cost: 4, rarity: "epic", target: "none",
      spell: { type: "recallDiscard", kind: "spell", count: 2 },
      text: "从弃牌堆取回最多 2 张战术牌。",
      flavor: "同一段咒文，念第二遍才听得清。"
    };
  }
  if (!CARDS.rep_field_repair) {
    CARDS.rep_field_repair = {
      id: "rep_field_repair", name: "战地维修", faction: "republic", type: "spell",
      cost: 3, rarity: "rare", target: "none",
      spell: { type: "recallDiscard", kind: "equipment", armor: 2, fallbackDraw: 1 },
      text: "从弃牌堆取回一张装备牌，领袖获得 2 点护甲；弃牌堆没有装备时抽 1 张。",
      flavor: "修好的不只是剑，还有士气。"
    };
  }
  // 西昭 67.1% → 小幅削弱
  if (CARDS.bloodroad_guide) CARDS.bloodroad_guide.deathrattle = { type: "damageRandomEnemy", amount: 2 };
  if (CARDS.blood_scythe) CARDS.blood_scythe.cost = 5;
  // 雪都 64.8% → 小幅削弱
  if (CARDS.snow_blizzard_elemental) CARDS.snow_blizzard_elemental.cost = 8;
  if (CARDS.snow_shatter_judge) CARDS.snow_shatter_judge.battlecry = { type: "damageFrozenGrow", amount: 2 };
  // 平衡补丁：回收牌进预组
  DECKS.academy = ["debate","ac_arcane_insight","ac_arcane_insight","dark_route","dark_route","ac_arcane_flood","ac_arcane_flood","ac_knowledge_burst","ac_knowledge_burst","doorman","doorman","page_scholar","page_scholar","arcane_scribe","arcane_scribe","council_elder","council_elder","spell_novice","spell_novice","spell_conductor","cassian","archive_search","dusk_inn_yard","losutai_pool","spell_codex","academy_inkwell","frostweave_cloak","ac_rewrite_draft","ac_archive_restorer","ac_rune_recast"];
  DECKS.republic = ["fortify","iron_banner","republic_seal","konrad","fate_gambler","fog_dockhand","dusk_inn_yard","shield_recruit","white_reef_lamp_oil","levy","time_loan","neutral_wayfarer","gok_digger","gok_digger","fog_sailor","mist_scout","caravan_guard","caravan_guard","fog_sailor","line_rotation","losutai_refugee","shield_recruit","wall_recruit","anvil_town_smith","wandering_blade","chaos_rift","northern_nomad","reborn_sentry","mist_pier","rep_field_repair"];
  // ===== 2026-10-29 平衡 pass3（第二轮模拟后）=====
  // 预组里塞回收牌把节奏拖垮了，退回（卡本身保留可收集）
  DECKS.academy = ["debate","ac_arcane_insight","ac_arcane_insight","dark_route","dark_route","ac_arcane_flood","ac_arcane_flood","ac_knowledge_burst","ac_knowledge_burst","doorman","doorman","page_scholar","page_scholar","arcane_scribe","arcane_scribe","council_elder","council_elder","spell_novice","spell_novice","spell_conductor","cassian","archive_search","dusk_inn_yard","losutai_pool","spell_codex","academy_inkwell","frostweave_cloak","ac_rewrite_draft","ac_archive_restorer","debate"];
  DECKS.republic = ["fortify","iron_banner","republic_seal","konrad","fate_gambler","fog_dockhand","dusk_inn_yard","shield_recruit","white_reef_lamp_oil","levy","time_loan","neutral_wayfarer","gok_digger","gok_digger","fog_sailor","mist_scout","caravan_guard","caravan_guard","fog_sailor","line_rotation","losutai_refugee","shield_recruit","wall_recruit","anvil_town_smith","wandering_blade","chaos_rift","northern_nomad","reborn_sentry","mist_pier","mist_hound"];
  // 灰港继续加码：终端再降一费、处决手段更便宜
  if (CARDS.gh_bounty_king) { CARDS.gh_bounty_king.cost = 6; CARDS.gh_bounty_king.attack = 6; CARDS.gh_bounty_king.health = 6; }
  if (CARDS.gh_assassinate_contract) CARDS.gh_assassinate_contract.cost = 2;
  // 西昭：血潮镰 5 → 6（预组核心装备，这次真削到点上）
  if (CARDS.blood_scythe) CARDS.blood_scythe.cost = 6;
  // ===== 2026-10-29 平衡 pass4 =====
  // 学院预组回到原版（回收牌拖节奏，卡保留）
  DECKS.academy = ["debate","ac_arcane_insight","ac_arcane_insight","dark_route","dark_route","ac_arcane_flood","ac_arcane_flood","ac_knowledge_burst","ac_knowledge_burst","doorman","doorman","page_scholar","page_scholar","arcane_scribe","arcane_scribe","council_elder","council_elder","spell_novice","spell_novice","spell_conductor","cassian","archive_search","dusk_inn_yard","losutai_pool","spell_codex","academy_inkwell","frostweave_cloak","debate","mana_surge","mana_surge"];
  // 西昭继续削：血契 3 伤 → 2 伤
  if (CARDS.blood_pact && CARDS.blood_pact.spell && Array.isArray(CARDS.blood_pact.spell.ops)) {
    for (const op of CARDS.blood_pact.spell.ops) if (op && op.op === "damageTarget") op.amount = 2;
  }
  // ===== 2026-10-29 文案/触发修正：这些卡文本写了「镇脉N」但没接线 =====
  if (CARDS.iron_wall && CARDS.iron_wall.zhenmai == null) CARDS.iron_wall.zhenmai = 2;
  if (CARDS.armor_recycle && CARDS.armor_recycle.zhenmai == null) CARDS.armor_recycle.zhenmai = 2;
  if (CARDS.zhenmai_artisan && CARDS.zhenmai_artisan.zhenmai == null) CARDS.zhenmai_artisan.zhenmai = 1;
  if (CARDS.house_legacy && CARDS.house_legacy.zhenmai == null) CARDS.house_legacy.zhenmai = 3;
  // 军需官：文本写的是「余响：镇脉1」，实际引擎只在打出时结算镇脉，改成与实现一致的文案
  if (CARDS.quartermaster) {
    CARDS.quartermaster.zhenmai = 1;
    CARDS.quartermaster.text = "登场：镇脉1；若你有护甲抽 1 张。余响：领袖获得 1 点护甲。";
  }
  // ===== 2026-10-29 文案修正：这些卡有登场效果，但文案没写「登场」，玩家看不出什么时候触发 =====
  if (CARDS.blood_priestess) CARDS.blood_priestess.text = "先遣。登场：血祭1，对敌方随从造成 2 点伤害。";
  if (CARDS.gh_silence_expert) CARDS.gh_silence_expert.text = "逆脉2。登场：沉默一个敌方随从；若目标有悬赏，抽 1 张。余响：随机敌方随从 2。";
  if (CARDS.pulse_banner) CARDS.pulse_banner.text = "逆脉2。登场：恢复领袖 3 生命；若本回合逆脉过，改为恢复 4 点。余响：恢复领袖 2 生命。";
  if (CARDS.lt_tide_devourer) CARDS.lt_tide_devourer.text = "登场：吞噬攻击力最低的友方魔物，获得其攻击和生命；若吞噬的是魔物，召唤一个 1/1 洛斯汰魔物。";
  if (CARDS.xizhao_blood_vow) CARDS.xizhao_blood_vow.text = "登场：血祭2，对敌方随从造成 3 点伤害；若将其消灭，抽 1 张。";
  // ===== 2026-10-29 文案修正：这些卡写着「否则…」，但效果里只有 if 没有 else =====
  const withElse = (card, key, ops) => { if (card) card[key] = { type: "ops", ops }; };
  withElse(CARDS.empire_guard, "battlecry", [{ op: "if", cond: "controlTaunt", then: [{ op: "armor", amount: 2 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.shield_bearer, "deathrattle", [{ op: "if", cond: "armorGained", then: [{ op: "armor", amount: 3 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.ironclad, "deathrattle", [{ op: "if", cond: "armor", then: [{ op: "armor", amount: 2 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.venom_fang, "deathrattle", [{ op: "if", cond: "controlDemon", then: [{ op: "armor", amount: 3 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.frost_line_guard, "battlecry", [{ op: "if", cond: "freezeCast", then: [{ op: "armor", amount: 3 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.reborn_shield_guard, "deathrattle", [{ op: "if", cond: "controlFormation", then: [{ op: "armor", amount: 3 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.recruiter, "battlecry", [{ op: "if", cond: "sameZoneAlly", then: [{ op: "armor", amount: 2 }], else: [{ op: "armor", amount: 1 }] }]);
  withElse(CARDS.losutai_hunter, "deathrattle", [{ op: "if", cond: "otherDemon", then: [{ op: "damageRandomEnemy", amount: 2 }], else: [{ op: "damageRandomEnemy", amount: 1 }] }]);
  withElse(CARDS.blood_duelist, "deathrattle", [{ op: "if", cond: "tookDamage", then: [{ op: "damageRandomEnemy", amount: 2 }], else: [{ op: "damageRandomEnemy", amount: 1 }] }]);
  withElse(CARDS.blackmarket_bodyguard, "deathrattle", [{ op: "if", cond: "bountyCompleted", then: [{ op: "damageRandomEnemy", amount: 3 }], else: [{ op: "damageRandomEnemy", amount: 1 }] }]);
  // 学院讲师：文案是「登场抽1；余响：若阵型 4 甲，否则 2 甲」，原来实现写成了抽牌
  if (CARDS.lecturer) {
    CARDS.lecturer.battlecry = { type: "ops", ops: [{ op: "draw", amount: 1 }] };
    CARDS.lecturer.deathrattle = { type: "ops", ops: [{ op: "if", cond: "controlFormation", then: [{ op: "armor", amount: 4 }], else: [{ op: "armor", amount: 2 }] }] };
    CARDS.lecturer.text = "登场：抽 1 张。余响：若控制阵型，领袖获得 4 点护甲，否则获得 2 点护甲。";
  }
  // 收尸队：文案「你的随从死亡时，领袖获得 1 点护甲」，此前完全没有实现
  if (CARDS.gh_silence_field) CARDS.gh_silence_field.passive = { type: "allyDeathArmor", amount: 1 };
  // ===== 2026-10-29 文案修正：文案写了余响，但卡上根本没有 deathrattle =====
  if (CARDS.bounty_clerk) {
    CARDS.bounty_clerk.deathrattle = { type: "ops", ops: [{ op: "if", cond: "bountyCompleted", then: [{ op: "armor", amount: 5 }], else: [{ op: "armor", amount: 2 }] }] };
  }
  if (CARDS.broken_line_merc) {
    CARDS.broken_line_merc.deathrattle = { type: "ops", ops: [{ op: "if", cond: "bountyCompleted", then: [{ op: "armor", amount: 5 }], else: [{ op: "armor", amount: 2 }] }] };
  }
  // 行吟歌手：文案是「登场抽1；余响：若阵型 3 甲否则 1 甲」，原来两段都写成了抽牌
  if (CARDS.wandering_singer) {
    CARDS.wandering_singer.battlecry = { type: "ops", ops: [{ op: "draw", amount: 1 }] };
    CARDS.wandering_singer.deathrattle = { type: "ops", ops: [{ op: "if", cond: "controlFormation", then: [{ op: "armor", amount: 3 }], else: [{ op: "armor", amount: 1 }] }] };
  }
  // ===== 2026-10-29 文案修正：文案里有「抽 1 张」，但效果里没写 =====
  const addDraw = (card, key, paths) => {
    if (!card || !card[key] || !Array.isArray(card[key].ops)) return;
    for (const path of paths) {
      let list = card[key].ops;
      for (const step of path) list = list[step];
      if (Array.isArray(list) && !list.some((op) => op && op.op === "draw")) list.push({ op: "draw", amount: 1 });
    }
  };
  addDraw(CARDS.spell_novice, "battlecry", [[0, "then"]]);
  addDraw(CARDS.pure_theorist, "battlecry", [[0, "then"]]);
  addDraw(CARDS.pulse_recorder, "deathrattle", [[1, "then"]]);
  addDraw(CARDS.medical_stretcher, "spell", [[]]);
  addDraw(CARDS.coordinator_order, "spell", [[]]);
  addDraw(CARDS.ac_spell_copy, "spell", [[]]);
  addDraw(CARDS.snow_lamp_rite, "spell", [[]]);
  addDraw(CARDS.venom_blade, "spell", [[]]);
  // 冰枪：文案还有「对所有已冻结敌方随从造成 2 点伤害」
  if (CARDS.snow_ice_lance && CARDS.snow_ice_lance.spell && Array.isArray(CARDS.snow_ice_lance.spell.ops)) {
    if (!CARDS.snow_ice_lance.spell.ops.some((op) => op && op.op === "damageFrozenEnemies")) CARDS.snow_ice_lance.spell.ops.splice(1, 0, { op: "damageFrozenEnemies", amount: 2 });
  }
  // 极光祭司：冻结随机敌人；若它已经冻结，抽 1 张
  if (CARDS.snow_aurora_priestess) CARDS.snow_aurora_priestess.deathrattle = { type: "ops", ops: [{ op: "freezeRandomDrawIfFrozen", turns: 1 }] };
  // 压脉师：文本写「压脉3」，但卡上没有 pressure 字段
  if (CARDS.xh_pressure_master && CARDS.xh_pressure_master.pressure == null) CARDS.xh_pressure_master.pressure = 3;
  // 血誓祭司：文本写「攻击并消灭目标时对领袖 2 点」，此前没有实现
  if (CARDS.xh_blood_priest) CARDS.xh_blood_priest.passive = { type: "attackKillDamageHero", amount: 2 };
  // 文案补「被动」字样，和实现一致
  if (CARDS.gh_silence_field) CARDS.gh_silence_field.text = "被动：你的随从死亡时，领袖获得 1 点护甲。";
  if (CARDS.xh_blood_priest) CARDS.xh_blood_priest.text = "先遣。隐匿。被动：攻击并消灭目标时，对敌方领袖造成 2 点伤害。";
  // ===== 2026-10-29 文案与实现对齐（自定义效果类型卡）=====
  // 塞德里克：余响还应该给 3 点护甲
  if (CARDS.cedric) CARDS.cedric.deathrattle = { type: "ops", ops: [{ op: "summon", token: "republic_recruit" }, { op: "armor", amount: 3 }] };
  // 堡垒队长：登场还要给守备
  if (CARDS.bastion_captain) CARDS.bastion_captain.battlecry = { type: "ops", ops: [{ op: "if", cond: "armor", then: [{ op: "buffSelf", attack: 0, health: 2 }, { op: "tauntSelf" }] }] };
  // 时序档案官：费用≤3 时抽 1
  if (CARDS.chrono_archivist) CARDS.chrono_archivist.battlecry = { type: "ops", ops: [{ op: "returnTargetToHand" }, { op: "if", cond: "targetCostLow", value: 3, then: [{ op: "draw", amount: 1 }] }] };
  // 火药元帅：已有护甲时造成 2 点伤害
  if (CARDS.powder_marshal) CARDS.powder_marshal.battlecry = { type: "ops", ops: [{ op: "armor", amount: 3 }, { op: "if", cond: "armor", then: [{ op: "damageRandomEnemy", amount: 2 }] }] };
  // 契约行刺客：目标已在名单上时抽 1（先判定再挂悬赏）
  if (CARDS.gh_legend_assassin) CARDS.gh_legend_assassin.battlecry = { type: "ops", ops: [{ op: "if", cond: "targetBounty", then: [{ op: "draw", amount: 1 }] }, { op: "markBountyTarget" }] };
  // 断线团头目：有悬赏目标时抽 1
  if (CARDS.gh_captain) CARDS.gh_captain.battlecry = { type: "ops", ops: [{ op: "grantRushAll" }, { op: "if", cond: "bountyExists", then: [{ op: "draw", amount: 1 }] }] };
  // 冻土先知：目标已冻结时抽 1（先判定再冻结）
  if (CARDS.snow_frozen_oracle) CARDS.snow_frozen_oracle.battlecry = { type: "ops", ops: [{ op: "if", cond: "targetFrozen", then: [{ op: "draw", amount: 1 }] }, { op: "freezeTarget" }] };
  // 冰原祭司：冻结一个；若目标已冻结则群伤被冻结的敌人；余响抽 1（原来写成了冻结全体）
  if (CARDS.snow_ice_priest) {
    CARDS.snow_ice_priest.battlecry = { type: "ops", ops: [{ op: "if", cond: "targetFrozen", then: [{ op: "damageAllEnemies", amount: 2, onlyFrozen: true }] }, { op: "freezeTarget" }] };
    CARDS.snow_ice_priest.deathrattle = { type: "draw", amount: 1 };
  }
  // 雪都狐卫：条件写成了「控制魔物」，应该是雪狐
  if (CARDS.snow_fox_guard) CARDS.snow_fox_guard.battlecry = { type: "ops", ops: [{ op: "if", cond: "controlFox", then: [{ op: "buffSelf", attack: 2, health: 2 }, { op: "tauntSelf" }] }] };
  // 霜潮利维坦：冻结过 3 个以上时，先 +3/+3 再冻一次
  if (CARDS.frost_leviathan) CARDS.frost_leviathan.deathrattle = { type: "ops", ops: [{ op: "freezeAllEnemies" }, { op: "if", cond: "freezeCount", value: 3, then: [{ op: "buffSelf", attack: 3, health: 3 }, { op: "freezeAllEnemies" }] }] };
  // 霜系教授：预兆之后抽 1（原来只说预兆）
  if (CARDS.frost_professor) {
    CARDS.frost_professor.battlecry = { type: "ops", ops: [{ op: "discover", amount: 1 }, { op: "draw", amount: 1 }] };
    CARDS.frost_professor.text = "登场：预兆一张战术牌；抽 1 张。";
  }
  // ===== 2026-10-29 文案修正：文案写「引脉N」，但没接线 =====
  const veinGate = (need, ops) => ({ type: "ops", ops: [{ op: "if", cond: "vein", value: need, then: ops }] });
  if (CARDS.gok_digger) CARDS.gok_digger.battlecry = { type: "ops", ops: [{ op: "if", cond: "vein", value: 4, then: [{ op: "armor", amount: 2 }] }] };
  if (CARDS.mist_scout) CARDS.mist_scout.battlecry = { type: "ops", ops: [{ op: "if", cond: "vein", value: 4, then: [{ op: "armor", amount: 1 }] }] };
  if (CARDS.astral_colossus) CARDS.astral_colossus.battlecry = { type: "ops", ops: [{ op: "if", cond: "vein", value: 6, then: [{ op: "armor", amount: 2 }, { op: "draw", amount: 1 }] }] };
  if (CARDS.lt_tide_mother) CARDS.lt_tide_mother.battlecry = { type: "ops", ops: [{ op: "summon", token: "losutai_imp" }, { op: "summon", token: "losutai_imp" }, { op: "if", cond: "vein", value: 6, then: [{ op: "summon", token: "losutai_imp" }, { op: "summon", token: "losutai_imp" }] }] };
  // 协调部信使：文案是「抽 1 张；若有阵型再抽 1 张」，原来只在有阵型时抽
  if (CARDS.courier) CARDS.courier.battlecry = { type: "ops", ops: [{ op: "draw", amount: 1 }, { op: "if", cond: "controlFormation", then: [{ op: "draw", amount: 1 }] }] };
  // 攻城队长：文案是「至少 3 护甲才造成伤害」，原来无条件群伤
  if (CARDS.siege_captain) CARDS.siege_captain.battlecry = { type: "ops", ops: [{ op: "if", cond: "armor", value: 3, then: [{ op: "damageAllEnemies", amount: 1 }] }] };
  // 文案补「登场」，与新增的登场效果一致
  if (CARDS.gok_digger) CARDS.gok_digger.text = "登场：掘脉1；引脉4：领袖获得 2 点护甲。";
  if (CARDS.mist_scout) CARDS.mist_scout.text = "先遣。登场：引脉4，领袖获得 1 点护甲。余响：领袖获得 1 点护甲。";
  if (CARDS.astral_colossus) CARDS.astral_colossus.text = "守备。登场：引脉6，领袖获得 2 点护甲并抽 1 张。被动：你的回合开始时领袖获得 1 点护甲。";
  // 妮娜：效果要靠目标所在阵位，但卡面 target 是 none，导致永远不生效
  if (CARDS.nina) CARDS.nina.target = "enemy";
  // 文案要选目标，但 target 没设，导致效果永远不触发
  if (CARDS.ac_final_proof) CARDS.ac_final_proof.target = "enemy";
  if (CARDS.snow_ice_priest) CARDS.snow_ice_priest.target = "enemy";
  if (CARDS.powder_marshal) CARDS.powder_marshal.text = "登场：领袖获得 3 点护甲；若你已有护甲，随机对一个敌方随从造成 2 点伤害。";
  // 霜潮利维坦：余响触发时它已经死了，「自身+3/+3」没有意义，改成再冻一次并抽 1 张
  if (CARDS.frost_leviathan) {
    CARDS.frost_leviathan.text = "余响：冻结所有敌方随从；若本局你冻结过至少 3 个随从，再冻结一次并抽 1 张。";
    CARDS.frost_leviathan.deathrattle = { type: "ops", ops: [{ op: "freezeAllEnemies" }, { op: "if", cond: "freezeCount", value: 3, then: [{ op: "freezeAllEnemies" }, { op: "draw", amount: 1 }] }] };
  }
  // ===== 2026-10-29 装备条件光环补全：这些卡「若…」的加成写在 bonus 里是空的 =====
  const setAura = (id, aura) => { if (CARDS[id]) CARDS[id].equipAura = aura; };
  setAura("vein_heart", { healTurn: 2, condition: "fullHp", bonus: { armorTurn: 2 } });
  setAura("iron_banner", { condition: "controlFormation", bonus: { health: 1 } });
  setAura("powder_engine", { armorTurn: 2, condition: "armor", bonus: { turnDraw: 1 } });
  setAura("frost_prism", { healTurn: 1, condition: "freeze", bonus: { turnDraw: 1 } });
  setAura("republic_seal", { health: 1, condition: "controlTaunt", bonus: { armorTurn: 1 } });
  setAura("gh_bounty_board", { condition: "bounty", bonus: { turnDraw: 1 } });
  setAura("ksetra_beacon_item", { health: 1, condition: "controlTaunt", bonus: { healTurn: 1 } });
  setAura("cataloging_lens", { health: 1, condition: "hand6", bonus: { health: 1 } });
  setAura("gambler_dice", { health: 1, condition: "hand6", bonus: { health: 1 } });
  setAura("sky_ship_ticket", { healTurn: 1, condition: "controlFormation", bonus: { armorTurn: 1 } });
  setAura("world_map_item", { healTurn: 1, condition: "controlFormation", bonus: { turnDraw: 1 } });
  setAura("dusk_inn_key", { maxHpTurn: 1, condition: "fullHp", bonus: { turnDraw: 1 } });
  setAura("smuggler_anchor", { turnDamageAll: 2, condition: "controlFormation", bonus: { turnDamageAll: 1 } });
  setAura("lt_tide_totem", { health: 1, condition: "demon", bonus: { armorTurn: 1 } });
  setAura("lt_tide_bell", { armorTurn: 1, condition: "demon", bonus: { spellDraw: 1 } });
  setAura("snow_frostplate", { armorTurn: 1, condition: "freeze", bonus: { healTurn: 2 } });
  setAura("snow_hourglass", { healTurn: 1, condition: "freeze", bonus: { armorTurn: 1 } });
  // 流脉棱镜：文案是「刻脉4：流脉4时该阵位友方抽1；流脉7改为抽2并复原1行动力」
  // 原来是立即抽 1/2 张，没刻脉痕，跟文案不符
  if (CARDS.vein_prism) CARDS.vein_prism.spell = { type: "carveSealAcademy", kind: "academy", threshold: 4 };
  // 老门房：数据里挂了个孤立的 taunt 标记，但关键词和文案都没有守备，清掉避免误导
  if (CARDS.doorman && CARDS.doorman.taunt) delete CARDS.doorman.taunt;
  // 雪狐哨兵的残影和本体重名，容易混淆，改个名字
  if (CARDS.snow_fox_sentry_echo && CARDS.snow_fox_sentry_echo.name === "雪狐哨兵") CARDS.snow_fox_sentry_echo.name = "雪狐哨兵·残影";
  // ===== 2026-10-29 资源代价接线：文案写了血祭/掘脉，但卡上没字段 ===
  if (CARDS.tribal_warrior && CARDS.tribal_warrior.bloodCost == null) CARDS.tribal_warrior.bloodCost = 1;
  if (CARDS.blood_retainer && CARDS.blood_retainer.bloodCost == null) CARDS.blood_retainer.bloodCost = 1;
  if (CARDS.vein_behemoth && CARDS.vein_behemoth.excavate == null) CARDS.vein_behemoth.excavate = 2;
  if (CARDS.vein_surge && CARDS.vein_surge.excavate == null) CARDS.vein_surge.excavate = 2;
  if (CARDS.north_beast_tamer && CARDS.north_beast_tamer.excavate == null) CARDS.north_beast_tamer.excavate = 1;
  // 引脉工程师：余响是「恢复领袖 2 生命」，引擎里余响不能支付逆脉，去掉误导的逆脉字样
  if (CARDS.vein_engineer) CARDS.vein_engineer.text = "被动：每回合首次恢复领袖时，同阵位友方获得 +0/+1。余响：恢复领袖 2 点生命。";
  // ===== 2026-10-29 卡牌文案重写：按实际效果数据生成，统一格式、去歧义 =====
  const TEXT_REWRITE = {
    "courier": "登场：抽 1 张。若你控制阵型，抽 1 张。",
    "emergency": "恢复领袖 1 点生命。若同阵位有守备随从，抽 1 张。",
    "resonance": "逆脉 2。冻结一个敌方随从。抽 1 张。若本回合逆脉过，抽 1 张。",
    "frost_seal": "若目标已冻结，领袖获得 4 点护甲；否则领袖获得 2 点护甲。冻结一个敌方随从。",
    "debate": "对一个敌方随从造成 2 点伤害。若目标已冻结，抽 1 张。冻结一个敌方随从。",
    "cedric": "余响：召唤一个「共和国新兵」。领袖获得 3 点护甲。",
    "levy": "本回合获得 2 点行动力。若你控制守备随从，抽 1 张。",
    "mobilize": "本回合获得 1 点行动力。若你控制阵型，抽 1 张。",
    "martial_court": "领袖获得 1 点护甲。若你有护甲，领袖获得 1 点护甲。",
    "archive_scribe": "余响：抽 1 张。若你手牌不超过 4 张，抽 2 张。",
    "vein_medic": "余响：抽 1 张。若流脉达到 4 点，抽 2 张。",
    "field_engineer": "守备。余响：抽 1 张。若你控制阵型，抽 1 张。",
    "supply_cache": "恢复领袖 3 点生命。若你控制阵型，抽 1 张。",
    "smoke_screen": "抽 2 张。若本回合施放过战术牌，抽 1 张。",
    "borrow_vein": "召唤一个「医疗学徒」。若本回合施放过战术牌，召唤一个「医疗学徒」。",
    "zone_keeper": "余响：恢复领袖 2 点生命。若同阵位另有友方，抽 1 张。",
    "iron_engineer": "余响：抽 1 张。若你控制阵型，抽 1 张。",
    "frost_professor": "登场：预兆一张战术牌。抽 1 张。",
    "iron_wall": "抽 1 张。若你控制守备随从，领袖获得 2 点护甲。",
    "powder_marshal": "登场：领袖获得 3 点护甲。若你有护甲，随机对一个敌方随从造成 2 点伤害。",
    "vein_siphon": "对一个敌方随从造成 4 点伤害。若目标已受伤，恢复领袖 2 点生命。",
    "echo_adept": "登场：冻结一个敌方随从。若本回合施放过战术牌，抽 1 张。若本回合施放过战术牌，抽 1 张。",
    "moonfall": "对所有敌方随从造成 4 点伤害。抽 1 张。若你控制阵型，领袖获得 2 点护甲。",
    "astral_gate": "召唤一个「星界守卫」。召唤一个「星界守卫」。若你控制阵型，召唤一个「星界守卫」。",
    "armor_break": "对一个敌方随从造成 1 点伤害。若目标已冻结，抽 1 张。冻结一个敌方随从。",
    "line_rotation": "抽 1 张。若你控制守备随从，领袖获得 1 点护甲。",
    "war_tax": "领袖获得 1 点护甲。若你有护甲，抽 1 张。",
    "impeachment": "抽 1 张。若你控制阵型，领袖获得 3 点护甲。若你控制守备随从，抽 1 张。",
    "formation_echo": "逆脉 1。抽 1 张。若你控制阵型，恢复领袖 2 点生命。",
    "double_formula": "对一个敌方随从造成 3 点伤害。若目标已冻结，抽 1 张。冻结一个敌方随从。",
    "old_compass": "若目标已冻结，领袖获得 4 点护甲；否则领袖获得 2 点护甲。冻结一个敌方随从。",
    "gh_silencer": "登场：沉默一个敌方随从。若目标是悬赏目标，抽 1 张。余响：领袖获得 3 点护甲。",
    "gh_rush_archer": "先遣。余响：领袖获得 2 点护甲。若本回合完成过悬赏，将一个敌方随从列入悬赏名单。",
    "gh_bounty_hunter": "登场：将一个敌方随从列入悬赏名单。若目标是悬赏目标，抽 1 张。",
    "gh_venom_shield": "格挡。登场：将一个敌方随从列入悬赏名单。若目标是悬赏目标，将一个敌方随从列入悬赏名单。",
    "gh_silence_expert": "逆脉 2。登场：沉默一个敌方随从。若目标是悬赏目标，抽 1 张。余响：随机对一个敌方随从造成 2 点伤害。",
    "gh_legend_assassin": "先遣。登场：若目标是悬赏目标，抽 1 张。将一个敌方随从列入悬赏名单。",
    "gh_shield_broker": "格挡。余响：领袖获得 3 点护甲。若本回合完成过悬赏，将一个敌方随从列入悬赏名单。",
    "gh_captain": "登场：所有友方随从获得先遣。若场上有悬赏目标，抽 1 张。",
    "gh_bounty_verdict": "抽 1 张。若本回合完成过悬赏，抽 1 张。对敌方领袖造成 1 点伤害。",
    "combo_shield": "召唤一个「共和国新兵」。若你控制守备随从，领袖获得 1 点护甲。",
    "vein_echo": "领袖获得 4 点护甲。若同阵位另有友方，抽 1 张。",
    "monster_overseer": "登场：召唤一个「洛斯汰魔物」。若控制其他魔物，自身获得 +1/+1。余响：领袖获得 2 点护甲。",
    "echo_standard": "恢复领袖 3 点生命。若你控制阵型，领袖获得 2 点护甲。",
    "bounty_clerk": "登场：将一个敌方随从列入悬赏名单。若本回合完成过悬赏，抽 1 张。余响：若本回合完成过悬赏，领袖获得 5 点护甲；否则领袖获得 2 点护甲。",
    "poison_mist_thrower": "登场：对一个敌方随从造成 1 点伤害。若目标是悬赏目标，将一个敌方随从列入悬赏名单。",
    "venom_blade": "领袖获得 1 点护甲。若本回合完成过悬赏，领袖获得 1 点护甲。抽 1 张。",
    "silence_informant": "登场：沉默一个敌方随从。若目标是悬赏目标，抽 1 张。余响：领袖获得 2 点护甲。",
    "pulse_recorder": "余响：恢复领袖 3 点生命。若流脉达到 7 点，领袖获得 3 点护甲，抽 1 张。",
    "ksetra_instructor": "登场：恢复领袖 2 点生命。若同阵位有守备随从，领袖获得 2 点护甲。余响：恢复领袖 1 点生命。",
    "security_sentry": "恢复领袖 3 点生命。若同阵位有守备随从，恢复领袖 5 点生命。",
    "research_sampler": "登场：若你控制阵型，抽 1 张。余响：恢复领袖 3 点生命。若你控制阵型，领袖获得 2 点护甲。",
    "medical_stretcher": "恢复领袖 2 点生命。若本回合获得过护甲，恢复领袖 1 点生命。抽 1 张。",
    "ksetra_beacon": "恢复领袖 2 点生命。若同阵位另有友方，抽 1 张。",
    "coordinator_order": "恢复领袖 4 点生命。若本回合逆脉过，领袖获得 2 点护甲。抽 1 张。",
    "south_pole_tracker": "血祭 1。抽 1 张。若敌方没有随从，抽 1 张。",
    "mist_harbor_treaty": "领袖获得 3 点护甲。若你控制守备随从，抽 1 张。",
    "forge_engineer": "登场：招魂一个行动力消耗不超过 2 的随从。抽 1 张。",
    "conscription_order": "领袖获得 1 点护甲。若你有护甲，领袖获得 1 点护甲。",
    "toll_account": "抽 1 张。若目标是悬赏目标，抽 2 张。",
    "snow_capital_remnant": "登场：恢复领袖 2 点生命。若你控制阵型，抽 1 张。",
    "card_shark": "登场：抽 1 张。余响：抽 1 张。若你控制阵型，抽 1 张。",
    "smuggler_ship": "若目标已冻结，抽 1 张。冻结一个敌方随从。抽 1 张。",
    "white_reef_keeper": "守备。余响：抽 1 张。若你控制守备随从，抽 1 张。",
    "dusk_inn": "冻结一个敌方随从。若你控制雪狐，领袖获得 2 点护甲。",
    "world_map": "抽 1 张。若你控制雪狐，抽 1 张。",
    "mist_bargain": "若目标已冻结，抽 1 张。冻结一个敌方随从。",
    "reef_signal": "冻结一个敌方随从。若目标是悬赏目标，抽 1 张。",
    "anvil_quench": "若目标已冻结，领袖获得 5 点护甲；否则领袖获得 3 点护甲。冻结一个敌方随从。",
    "north_trail": "若目标已冻结，领袖获得 2 点护甲。冻结一个敌方随从。",
    "snow_lamp_rite": "恢复领袖 3 点生命。若你控制阵型，恢复领袖 5 点生命。抽 1 张。",
    "losutai_tide": "抽 1 张。若你控制魔物，抽 1 张；否则领袖获得 1 点护甲。",
    "dark_route": "抽 2 张。若你控制阵型，抽 1 张。",
    "xh_blood_tax": "登场：抽 1 张。余响：抽 1 张。若你手牌不超过 4 张，抽 1 张。",
    "xh_blood_feast_spell": "压脉 2。对敌方领袖造成 2 点伤害。对一个敌方随从造成 2 点伤害。",
    "xh_blood_curse": "抽 1 张。若本回合受过伤害，抽 1 张。",
    "lt_deep_beast": "抽 1 张。若你控制魔物，抽 1 张。",
    "lt_tide_colossus": "压脉 2。领袖获得 2 点护甲。抽 1 张。若你控制魔物，领袖获得 1 点护甲。",
    "lt_tide_mother": "登场：召唤一个「洛斯汰魔物」。召唤一个「洛斯汰魔物」。若流脉达到 6 点，召唤一个「洛斯汰魔物」，召唤一个「洛斯汰魔物」。",
    "lt_tide_birth": "抽 1 张。若你控制魔物，抽 1 张。",
    "lt_tide_surge": "抽 1 张。若你控制魔物，抽 1 张。",
    "lt_brood_call": "召唤一个「洛斯汰巨兽」。若控制其他魔物，召唤一个「洛斯汰巨兽」。",
    "snow_icewall_guard": "登场：冻结一个敌方随从。若你控制阵型，冻结所有敌方随从。",
    "snow_storm_hunter": "登场：对一个敌方随从造成 2 点伤害。冻结一个敌方随从。若目标已冻结，抽 1 张。",
    "snow_guard_captain": "登场：冻结一个敌方随从。若你控制雪狐，召唤一个「雪狐哨兵」。",
    "snow_ice_priest": "登场：若目标已冻结，对所有已冻结的敌方随从造成 2 点伤害。冻结一个敌方随从。余响：抽 1 张。",
    "snow_frozen_oracle": "登场：若目标已冻结，抽 1 张。冻结一个敌方随从。",
    "snow_freeze_touch": "若目标已冻结，领袖获得 2 点护甲。冻结一个敌方随从。",
    "snow_wind_strike": "若目标已冻结，领袖获得 2 点护甲。冻结一个敌方随从。领袖获得 1 点护甲。",
    "snow_gale": "冻结一个敌方随从。领袖获得 2 点护甲。若你控制雪狐，领袖获得 1 点护甲。",
    "snow_ice_wall": "若目标已冻结，领袖获得 2 点护甲。冻结一个敌方随从。领袖获得 3 点护甲。",
    "snow_blizzard": "对所有敌方随从造成 2 点伤害。冻结所有敌方随从。若本回合冻结过敌方，对所有敌方随从造成 1 点伤害。",
    "snow_time_stop": "若目标已冻结，领袖获得 4 点护甲；否则领袖获得 2 点护甲。冻结一个敌方随从。",
    "snow_aurora": "冻结所有敌方随从。抽 2 张。",
    "snow_last_snow": "冻结所有敌方随从。抽 2 张。领袖获得 1 点护甲。",
    "snow_frost_veil": "若目标已冻结，抽 1 张；否则领袖获得 1 点护甲。冻结一个敌方随从。",
    "snow_wind_step": "若目标已冻结，抽 2 张；否则抽 1 张。冻结一个敌方随从。",
    "snow_ice_lance": "冻结一个敌方随从。对所有已冻结的敌方随从造成 2 点伤害。抽 1 张。",
    "ac_arcane_flood": "抽 1 张。若本回合施放过战术牌，抽 1 张。",
    "ac_grand_library": "抽 2 张。若本回合施放过战术牌，抽 1 张。",
    "ac_spell_copy": "恢复领袖 2 点生命。若本回合施放过战术牌，恢复领袖 2 点生命。抽 1 张。",
    "ac_knowledge_burst": "抽 1 张。若本回合施放过战术牌，本回合获得 1 点行动力。",
    "ac_school_bell": "恢复领袖 2 点生命。若你控制阵型，抽 1 张。"
  };
  for (const [id, t] of Object.entries(TEXT_REWRITE)) if (CARDS[id]) CARDS[id].text = t;

  // ===== 2026-10-29 文案排版二次统一 + 歧义修正 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/至少(\d)/g, "至少 $1")
      .replace(/最多(\d)/g, "最多 $1")
      .replace(/(\d)点/g, "$1 点")
      .replace(/(\d)张/g, "$1 张")
      .replace(/(\d)个/g, "$1 个")
      .replace(/(\d)回合/g, "$1 回合")
      .replace(/(\d)层/g, "$1 层")
      .replace(/(\d)护甲/g, "$1 点护甲")
      .replace(/\s+/g, " ");
  }
  if (CARDS.aidric) CARDS.aidric.text = "守备。登场：消灭一个敌方随从，自身获得等同于其生命值的生命。";
  // ===== 2026-10-29 文案终检：统一标点与资源写法，去掉长串分号 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    let t = c.text;
    t = t.replace(/(血祭|逆脉|掘脉|压脉|过载|镇脉)(\d)/g, "$1 $2");
    t = t.replace(/；(?=否则)/g, "@@ELSE@@");
    t = t.replace(/；/g, "。");
    t = t.replace(/@@ELSE@@/g, "，否则");
    t = t.replace(/，\s*，/g, "，");
    t = t.replace(/。\s*。/g, "。");
    t = t.replace(/\s+/g, " ").trim();
    if (!/[。！]$/.test(t)) t += "。";
    c.text = t;
  }
  // ===== 2026-10-29 补数字前的空格 =====
  for (const c of Object.values(CARDS)) {
    if (!c.text) continue;
    c.text = c.text
      .replace(/(达到|至|不超过|最多|至少|检索|消耗|抽取)(\d)/g, "$1 $2")
      .replace(/一个(\d+\/\d+)/g, "一个 $1")
      .replace(/召唤一只/g, "召唤一个")
      .replace(/\s+/g, " ")
      .trim();
  }
  return { FACTIONS, FACTION_IDS, nextFaction, HEROES, CARDS, DECKS, NEUTRAL_DECK, KEYWORDS, DECK_STRATEGIES, DECK_SPECIALS, DECK_TRIM, DECK_RARITY_LIMITS, cardPool, deckRarityCounts, isExactPreset, validateDeck, autoBuildDeck, maxCopies };
});

