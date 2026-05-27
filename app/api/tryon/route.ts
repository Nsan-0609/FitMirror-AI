import { buildSizeAdvice } from "@/lib/sizeAdvisor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const advice = buildSizeAdvice(body);

    return Response.json({
      ok: true,
      generatedImageStatus: "mock",
      message: "初期版ではAI試着画像はモック表示です。TRYON_API_URLを設定すると外部AI試着APIに差し替えできます。",
      advice,
      purchaseScore: Math.min(96, advice.fitScore + 5),
      reasons: [
        "入力された体型情報から大きなサイズ不一致は少なそうです。",
        "標準〜ややゆったりの着用感を想定できます。",
        "手持ち服との相性チェックを行うと購入判断の精度が上がります。",
      ],
    });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
