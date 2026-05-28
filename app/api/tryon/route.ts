import { buildSizeAdvice } from "@/lib/sizeAdvisor";

type ParsedImage = {
  mimeType: string;
  data: string;
};

type GeminiAttemptResult = {
  ok: boolean;
  model: string;
  status: number;
  result: any;
  errorMessage?: string;
};

function parseDataUrl(dataUrl: string): ParsedImage {
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

function getGeminiErrorMessage(result: any): string {
  return (
    result?.error?.message ||
    result?.error?.status ||
    result?.message ||
    "Gemini image generation failed."
  );
}

function findGeneratedImage(result: any) {
  const parts = result?.candidates?.[0]?.content?.parts || [];

  const imagePart = parts.find((part: any) => {
    return part.inlineData || part.inline_data;
  });

  const inlineImage = imagePart?.inlineData || imagePart?.inline_data;

  if (!inlineImage?.data) {
    return null;
  }

  const mimeType =
    inlineImage.mimeType ||
    inlineImage.mime_type ||
    "image/png";

  return `data:${mimeType};base64,${inlineImage.data}`;
}

async function callGeminiImageModel({
  apiKey,
  model,
  prompt,
  bodyImage,
  clothImage,
}: {
  apiKey: string;
  model: string;
  prompt: string;
  bodyImage: ParsedImage;
  clothImage: ParsedImage;
}): Promise<GeminiAttemptResult> {
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
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = getGeminiErrorMessage(result);

    console.error(
      "Gemini API Error:",
      JSON.stringify(
        {
          model,
          status: response.status,
          errorMessage,
          result,
        },
        null,
        2
      )
    );

    return {
      ok: false,
      model,
      status: response.status,
      result,
      errorMessage,
    };
  }

  return {
    ok: true,
    model,
    status: response.status,
    result,
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

    if (!bodyImage.data || !clothImage.data) {
      return Response.json(
        {
          ok: false,
          error: "Invalid image data.",
          message:
            "画像データを読み込めませんでした。別のJPG/PNG画像で再度お試しください。",
          advice,
        },
        { status: 400 }
      );
    }

    const prompt = `
あなたは高精度なAIファッション試着エンジンです。

目的：
1枚目の人物写真に、2枚目の服画像の服を自然に着せたAI試着画像を生成してください。

重要条件：
- 人物の体型、姿勢、顔、髪型、肌の色、背景はできるだけ維持する
- 2枚目の服の色、襟、袖、丈、柄、素材感をできるだけ維持する
- 実際の通販試着イメージとして自然に見えるようにする
- 過度な加工や別人化はしない
- 服が体型に合った時の見え方を自然に再現する
- 画像内に説明文、余計な文字、注釈、ロゴ風テキストを追加しない
- 全身写真として自然な構図を維持する
- 服だけをそのまま表示するのではなく、人物が着用している画像にする

ユーザー情報：
身長：${body.height}cm
体重：${body.weight}kg
普段のトップス：${body.usualTop}
普段のボトムス：${body.usualBottom}
好みの着方：${body.fitPreference}

生成するもの：
人物が2枚目の服を着ている自然なAI試着画像。
`;

    const requestedModel =
      process.env.GEMINI_IMAGE_MODEL ||
      "gemini-3.1-flash-image-preview";

    const modelsToTry = Array.from(
      new Set([
        requestedModel,
        "gemini-3.1-flash-image-preview",
        "gemini-2.5-flash-image",
      ])
    );

    const attempts: GeminiAttemptResult[] = [];

    for (const model of modelsToTry) {
      const attempt = await callGeminiImageModel({
        apiKey,
        model,
        prompt,
        bodyImage,
        clothImage,
      });

      attempts.push(attempt);

      if (!attempt.ok) {
        continue;
      }

      const generatedImage = findGeneratedImage(attempt.result);

      if (!generatedImage) {
        console.error(
          "Gemini returned no image:",
          JSON.stringify(
            {
              model,
              result: attempt.result,
            },
            null,
            2
          )
        );

        attempts[attempts.length - 1].errorMessage =
          "Geminiから画像データが返りませんでした。";

        continue;
      }

      return Response.json({
        ok: true,
        generatedImageStatus: "generated",
        generatedImage,
        usedModel: model,
        message: "AI試着画像を生成しました。",
        advice,
        purchaseScore: Math.min(96, (advice.fitScore || 80) + 5),
        reasons: [
          "入力された体型情報から大きなサイズ不一致は少なそうです。",
          "標準〜ややゆったりの着用感を想定できます。",
          "手持ち服との相性チェックを行うと購入判断の精度が上がります。",
        ],
      });
    }

    const lastAttempt = attempts[attempts.length - 1];
    const allErrors = attempts
      .map((attempt) => {
        return `${attempt.model}: ${attempt.errorMessage || "No image returned"}`;
      })
      .join(" / ");

    return Response.json(
      {
        ok: false,
        error: allErrors,
        message: `AI試着画像の生成に失敗しました。原因：${allErrors}`,
        advice,
        attempts: attempts.map((attempt) => ({
          model: attempt.model,
          status: attempt.status,
          errorMessage: attempt.errorMessage,
          raw: attempt.result,
        })),
        raw: lastAttempt?.result,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Try-on API Fatal Error:", error);

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Invalid request",
        message:
          "処理中にエラーが発生しました。画像形式や入力内容を確認してください。",
      },
      { status: 400 }
    );
  }
}
