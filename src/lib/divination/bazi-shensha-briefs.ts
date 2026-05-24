const SHENSHA_BRIEF_MAP: Record<string, string> = {
  月德: "贵人扶持逢凶化吉",
  天恩: "天恩护佑诸事渐顺",
  月恩: "月恩临门人和事顺",
  四相: "四相得位谋事可成",
  王日: "王日当值利于决断",
  天仓: "天仓有气衣食丰足",
  不将: "不将守稳婚嫁宜慎",
  要安: "要安主静家宅少扰",
  五合: "五合相扶合作顺遂",
  鸣吠对: "鸣吠相对小事多扰",
  月建: "月建当令压力偏重",
  小时: "小时临身杂务牵绊",
  土府: "土府偏重守成为宜",
  往亡: "往亡示警出行宜慎",
  天刑: "天刑主严守正避祸",
  "天刑（黑道）": "黑道值日谨言慎行",
  "天德（黄道）": "天德照命遇难呈祥",
  煞北: "煞临北方远行宜慎",
};

const SHENSHA_GROUP_FALLBACK_MAP: Record<string, string> = {
  "吉神宜趋": "吉神拱照诸事可为",
  "凶煞宜忌": "凶煞临门凡事宜慎",
  天神: "天神司令宜顺时势",
  冲煞: "冲煞并见以静制动",
};

function normalizeShenShaKey(item: string) {
  return item.replace(/（.*?）/g, "").replace(/\(.*?\)/g, "").trim();
}

export function getBaziShenShaBrief(item: string, groupLabel: string) {
  if (SHENSHA_BRIEF_MAP[item]) {
    return SHENSHA_BRIEF_MAP[item];
  }

  const normalizedKey = normalizeShenShaKey(item);

  if (SHENSHA_BRIEF_MAP[normalizedKey]) {
    return SHENSHA_BRIEF_MAP[normalizedKey];
  }

  if (groupLabel === "冲煞" && item.includes(")")) {
    return "逢冲之象凡事多变";
  }

  return SHENSHA_GROUP_FALLBACK_MAP[groupLabel] ?? "神煞有象审势而行";
}
