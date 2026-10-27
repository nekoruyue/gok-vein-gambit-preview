/* 服务端卡组校验：不信任客户端提交的牌组
 * 规则与客户端一致：30 张、同阵营、阵型 ≤3、品级上限（传说 2 / 史诗 15）、同名传说 1 张其余 2 张
 */
const path = require("path");
const D = require(path.join(__dirname, "..", "public", "js", "data.js"));

const DECK_SIZE = 30;
// 与客户端 DECK_RARITY_LIMITS 保持一致：只卡传说与史诗，普通与稀有不单列上限
const RARITY_LIMITS = { legendary: 2, epic: 15, rare: 30 };
const MAX_FORMATION = 3;

function validateDeck(deck, faction) {
  if (!Array.isArray(deck)) return { ok: false, error: "牌组格式不对" };
  if (deck.length !== DECK_SIZE) return { ok: false, error: "牌组必须是 " + DECK_SIZE + " 张，现在是 " + deck.length + " 张" };

  const counts = {};
  const rarity = { legendary: 0, epic: 0, rare: 0 };
  let formation = 0;

  for (const raw of deck) {
    const id = String(raw || "");
    const def = D.CARDS[id];
    if (!def) return { ok: false, error: "牌组里有不存在的卡：" + id };
    if (def.disabled) return { ok: false, error: "牌组里有已停用的卡：" + (def.name || id) };
    if (def.token) return { ok: false, error: "衍生物不能进牌组：" + (def.name || id) };
    if (def.easterEgg) return { ok: false, error: "彩蛋卡不能进牌组：" + (def.name || id) };
    if (faction && def.faction && def.faction !== "neutral" && def.faction !== faction) {
      return { ok: false, error: "包含其它阵营的卡：" + (def.name || id) };
    }
    counts[id] = (counts[id] || 0) + 1;
    // 同名上限：传说 1 张，其余 2 张
    const copyCap = def.rarity === "legendary" ? 1 : 2;
    if (counts[id] > copyCap) return { ok: false, error: "同名卡最多 " + copyCap + " 张：" + (def.name || id) };
    if (rarity[def.rarity] != null) rarity[def.rarity] += 1;
    if (def.type === "formation") formation += 1;
  }

  for (const [r, limit] of Object.entries(RARITY_LIMITS)) {
    if (rarity[r] > limit) return { ok: false, error: "品级超限：" + r + " 最多 " + limit + " 张" };
  }
  if (formation > MAX_FORMATION) return { ok: false, error: "阵型最多 " + MAX_FORMATION + " 张" };

  return { ok: true, rarity, formation };
}

/** 没提交牌组就用该阵营预组的 */
function deckFor(faction, submitted) {
  if (Array.isArray(submitted) && submitted.length) return submitted;
  return (D.DECKS[faction] || []).slice();
}

module.exports = { validateDeck, deckFor, DECK_SIZE, RARITY_LIMITS, MAX_FORMATION };
