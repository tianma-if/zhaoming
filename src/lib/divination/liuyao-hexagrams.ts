type TrigramCode = "111" | "110" | "101" | "100" | "011" | "010" | "001" | "000";

type TrigramInfo = {
  code: TrigramCode;
  name: string;
  nature: string;
  attribute: string;
};

const TRIGRAMS: Record<TrigramCode, TrigramInfo> = {
  "111": { code: "111", name: "乾", nature: "天", attribute: "刚健" },
  "110": { code: "110", name: "兑", nature: "泽", attribute: "悦纳" },
  "101": { code: "101", name: "离", nature: "火", attribute: "明辨" },
  "100": { code: "100", name: "震", nature: "雷", attribute: "发动" },
  "011": { code: "011", name: "巽", nature: "风", attribute: "渗透" },
  "010": { code: "010", name: "坎", nature: "水", attribute: "险阻" },
  "001": { code: "001", name: "艮", nature: "山", attribute: "止守" },
  "000": { code: "000", name: "坤", nature: "地", attribute: "承载" },
};

const HEXAGRAM_NAME_MAP: Record<string, string> = {
  "111111": "乾",
  "110111": "夬",
  "101111": "大有",
  "100111": "大壮",
  "011111": "小畜",
  "010111": "需",
  "001111": "大畜",
  "000111": "泰",
  "111110": "履",
  "110110": "兑",
  "101110": "睽",
  "100110": "归妹",
  "011110": "中孚",
  "010110": "节",
  "001110": "损",
  "000110": "临",
  "111101": "同人",
  "110101": "革",
  "101101": "离",
  "100101": "丰",
  "011101": "家人",
  "010101": "既济",
  "001101": "贲",
  "000101": "明夷",
  "111100": "无妄",
  "110100": "随",
  "101100": "噬嗑",
  "100100": "震",
  "011100": "益",
  "010100": "屯",
  "001100": "颐",
  "000100": "复",
  "111011": "姤",
  "110011": "大过",
  "101011": "鼎",
  "100011": "恒",
  "011011": "巽",
  "010011": "井",
  "001011": "蛊",
  "000011": "升",
  "111010": "讼",
  "110010": "困",
  "101010": "未济",
  "100010": "解",
  "011010": "涣",
  "010010": "坎",
  "001010": "蒙",
  "000010": "师",
  "111001": "遯",
  "110001": "咸",
  "101001": "旅",
  "100001": "小过",
  "011001": "渐",
  "010001": "蹇",
  "001001": "艮",
  "000001": "谦",
  "111000": "否",
  "110000": "萃",
  "101000": "晋",
  "100000": "豫",
  "011000": "观",
  "010000": "比",
  "001000": "剥",
  "000000": "坤",
};

export function getTrigramByCode(code: string) {
  return TRIGRAMS[code as TrigramCode];
}

export function getHexagramByLines(lines: number[]) {
  const lowerCode = lines.slice(0, 3).join("") as TrigramCode;
  const upperCode = lines.slice(3, 6).join("") as TrigramCode;
  const lower = getTrigramByCode(lowerCode);
  const upper = getTrigramByCode(upperCode);
  const key = `${upperCode}${lowerCode}`;
  const name = HEXAGRAM_NAME_MAP[key] ?? `${upper?.name ?? "?"}${lower?.name ?? "?"}卦`;

  return {
    key,
    name,
    upperTrigram: upper?.name ?? "未知",
    lowerTrigram: lower?.name ?? "未知",
    lines: lines
      .slice()
      .reverse()
      .map((value) => (value === 1 ? "阳" : "阴")),
    description:
      upper && lower
        ? `${upper.nature}在上，${lower.nature}在下，强调从“${lower.attribute}”出发，逐步走向“${upper.attribute}”的局势变化。`
        : "卦象结构已生成，可结合动爻观察当前局势与后续走向。",
  };
}
