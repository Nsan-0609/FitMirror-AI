export type BodyProfile = {
  height?: number;
  weight?: number;
  bodyType?: string;
  usualTop?: string;
  usualBottom?: string;
  fitPreference?: string;
};

export type SizeAdvice = {
  recommendedSize: string;
  relaxedSize: string;
  fitScore: number;
  compatibility: "A" | "B" | "C";
  comment: string;
  caution: string;
};

export function buildSizeAdvice(profile: BodyProfile): SizeAdvice {
  const height = Number(profile.height || 0);
  const weight = Number(profile.weight || 0);
  const fit = profile.fitPreference || "normal";

  let base: "S" | "M" | "L" | "XL" = "M";
  if (height > 178 || weight > 78) base = "XL";
  else if (height > 168 || weight > 62) base = "L";
  else if (height < 158 && weight < 52) base = "S";

  const relaxedMap: Record<string, string> = { S: "M", M: "L", L: "XL", XL: "XL" };
  const recommendedSize = fit === "loose" ? relaxedMap[base] : base;
  const relaxedSize = relaxedMap[base];

  const score = Math.min(92, Math.max(68, 76 + Math.round((height || 165) / 18) - Math.round((weight || 58) / 24)));
  const compatibility = score >= 84 ? "A" : score >= 74 ? "B" : "C";

  return {
    recommendedSize,
    relaxedSize,
    fitScore: score,
    compatibility,
    comment: `入力情報から見ると、${recommendedSize}サイズが合いやすい可能性があります。${fit === "loose" ? "ゆったり感を優先した候補です。" : "標準的な着用感を想定しています。"}`,
    caution: "実際のサイズ感はブランド・素材・商品寸法により変わります。商品ページのサイズ表と合わせて確認してください。",
  };
}
