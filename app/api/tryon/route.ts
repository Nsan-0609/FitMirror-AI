import { buildSizeAdvice } from "@/lib/sizeAdvisor";

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    return {
      mimeType: "image/jpeg",
      data: dataUrl,
    };
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const advice = buildSizeAdvice(body);

    if (!apiKey) {
      return Response.json(
        {
          ok: false,
          error: "GEMINI_API_KEY is not set.",
          message:
            "Gemini APIキーが設定されていません。VercelのEnvironment Variablesを確認してください。",
          advice,
        },
        { status: 500 }
      );
    }

    if (!body.bodyImage || !body.clothImage) {
      return Response.json(
        {
          ok: false,
          error: "Missing images.",
          message:
            "人物写真と服画像の両方をアップロードしてください。",
          advice,
        },
        { status: 400 }
      );
    }

    const bodyImage = parseDataUrl(body.bodyImage);
    const clothImage = parseDataUrl(body.clothImage);

    const prompt = `
あなたは高精度なAIファッション試着エンジンです。

目的：
1枚目の人物写真に、2枚目の服画像の服を自然に着せたAI試着画像を生成してください。

重要条件：
- 人物の体型、姿勢、顔、髪型、肌の色、背景はできるだけ維持する
- 服の色、襟、袖、丈、柄、素材感をできるだけ維持する
- 実際の通販試着イメージとして自然に見えるようにする
- 過度な加工や別人化はしない
- 服が体型に合った時の見え方を自然に再現する
- 画像内に文字、ロゴ風の説明、余計な注釈を追加しない

ユーザー情報：
身長：${body.height}cm
体重：${body.weight}kg
普段のトップス：${body.usualTop}
普段のボトムス：${body.usualBottom}
好みの着方：${body.fitPreference}

生成するもの：
人物が2枚目の服を着ている自然なAI試着画像。
`;

    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: bodyImage.mimeType,
                    data: bodyImage.data,
                  },
                },
                {
                  inline_data: {
                    mime_type: clothImage.mimeType,
                    data: clothImage.data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          ok: false,
          error: result?.error?.message || "Gemini image generation failed.",
          message:
            "AI試着画像の生成に失敗しました。APIキー、モデル名、画像サイズを確認してください。",
          advice,
          raw: result,
        },
        { status: 500 }
      );
    }

    const parts = result?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part: any) => part.inlineData || part.inline_data);

    const inlineImage = imagePart?.inlineData || imagePart?.inline_data;

    if (!inlineImage?.data) {
      return Response.json(
        {
          ok: false,
          error: "No image returned from Gemini.",
          message:
            "AIから画像が返りませんでした。別の写真で再度お試しください。",
          advice,
          raw: result,
        },
        { status: 500 }
      );
    }

    const generatedImage = `data:${inlineImage.mimeType || inlineImage.mime_type || "image/png"};base64,${inlineImage.data}`;

    return Response.json({
      ok: true,
      generatedImageStatus: "generated",
      generatedImage,
      message: "AI試着画像を生成しました。",
      advice,
      purchaseScore: Math.min(96, advice.fitScore + 5),
      reasons: [
        "入力された体型情報から大きなサイズ不一致は少なそうです。",
        "標準〜ややゆったりの着用感を想定できます。",
        "手持ち服との相性チェックを行うと購入判断の精度が上がります。",
      ],
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "Invalid request",
        message:
          "処理中にエラーが発生しました。画像形式や入力内容を確認してください。",
      },
      { status: 400 }
    );
  }
}
