"use client";

import { useMemo, useState } from "react";

type TryOnResponse = {
  ok: boolean;
  generatedImageStatus?: string;
  generatedImage?: string;
  message?: string;
  error?: string;
  advice?: {
    recommendedSize?: string;
    fitScore?: number;
    compatibilityGrade?: string;
    summary?: string;
  };
  purchaseScore?: number;
  reasons?: string[];
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function TryOnPage() {
  const [bodyFile, setBodyFile] = useState<File | null>(null);
  const [clothFile, setClothFile] = useState<File | null>(null);

  const [bodyPreview, setBodyPreview] = useState<string>("");
  const [clothPreview, setClothPreview] = useState<string>("");

  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("60");
  const [usualTop, setUsualTop] = useState("M");
  const [usualBottom, setUsualBottom] = useState("M");
  const [fitPreference, setFitPreference] = useState("普通");

  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<TryOnResponse | null>(null);

  const recommendedSize = useMemo(() => {
    return result?.advice?.recommendedSize || "—";
  }, [result]);

  const purchaseScore = useMemo(() => {
    return result?.purchaseScore ?? result?.advice?.fitScore ?? "—";
  }, [result]);

  const compatibilityGrade = useMemo(() => {
    return result?.advice?.compatibilityGrade || "—";
  }, [result]);

  const summary = useMemo(() => {
    return (
      result?.advice?.summary ||
      result?.message ||
      "画像をアップロードしてAI試着チェックを実行してください。"
    );
  }, [result]);

  const reasons = useMemo(() => {
    return result?.reasons || [];
  }, [result]);

  const handleBodyFile = (file: File | null) => {
    if (!file) return;
    setBodyFile(file);
    setBodyPreview(URL.createObjectURL(file));
  };

  const handleClothFile = (file: File | null) => {
    if (!file) return;
    setClothFile(file);
    setClothPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setResult(null);
    setResultImage("");

    if (!bodyFile || !clothFile) {
      setErrorMessage("人物写真と服画像の両方をアップロードしてください。");
      return;
    }

    try {
      setLoading(true);

      const bodyImage = await fileToBase64(bodyFile);
      const clothImage = await fileToBase64(clothFile);

      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bodyImage,
          clothImage,
          height: Number(height),
          weight: Number(weight),
          usualTop,
          usualBottom,
          fitPreference,
        }),
      });

      const data: TryOnResponse = await response.json();
      setResult(data);

      if (!response.ok || !data.ok) {
        setErrorMessage(
          data.message ||
            data.error ||
            "AI試着画像の生成に失敗しました。"
        );
        return;
      }

      if (data.generatedImage) {
        setResultImage(data.generatedImage);
      }
    } catch (error) {
      setErrorMessage("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#1d1d1d]">
      <header className="border-b border-[#e6dccb] bg-[#f6f1e8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2118] text-white font-bold">
              FM
            </div>
            <div className="text-xl font-semibold">FitMirror AI</div>
          </div>
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="/try-on" className="hover:opacity-70">
              AI試着
            </a>
            <a href="/closet" className="hover:opacity-70">
              クローゼット
            </a>
            <a href="/pricing" className="hover:opacity-70">
              料金
            </a>
          </nav>
          <a
            href="/pricing"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
          >
            無料で試す
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[360px_1fr]">
        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-4xl font-bold">入力情報</h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                自分の全身写真
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBodyFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                試したい服の画像
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleClothFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-dashed border-[#d8cab2] bg-[#fbf8f2] p-2">
                {bodyPreview ? (
                  <img
                    src={bodyPreview}
                    alt="人物プレビュー"
                    className="h-60 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center rounded-2xl text-sm text-gray-400">
                    人物プレビュー
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-dashed border-[#d8cab2] bg-[#fbf8f2] p-2">
                {clothPreview ? (
                  <img
                    src={clothPreview}
                    alt="服プレビュー"
                    className="h-60 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center rounded-2xl text-sm text-gray-400">
                    服プレビュー
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">身長 cm</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-4"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">体重 kg</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  普段のトップス
                </label>
                <select
                  value={usualTop}
                  onChange={(e) => setUsualTop(e.target.value)}
                  className="w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-4"
                >
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  普段のボトムス
                </label>
                <select
                  value={usualBottom}
                  onChange={(e) => setUsualBottom(e.target.value)}
                  className="w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-4"
                >
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">好みの着方</label>
              <select
                value={fitPreference}
                onChange={(e) => setFitPreference(e.target.value)}
                className="w-full rounded-2xl border border-[#e6dccb] bg-[#f7f1e6] p-4"
              >
                <option>ぴったり</option>
                <option>普通</option>
                <option>ゆったり</option>
                <option>オーバーサイズ</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-black px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "AI試着を生成中..." : "AI試着チェック"}
            </button>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-4xl font-bold">試着結果</h2>

          <div className="mb-5 flex min-h-[420px] items-center justify-center rounded-[28px] border border-[#e6dccb] bg-[#efe4cf] p-4">
            {resultImage ? (
              <img
                src={resultImage}
                alt="AI試着結果"
                className="max-h-[520px] w-full rounded-[24px] object-contain"
              />
            ) : (
              <div className="text-center text-[#6f6251]">
                <div className="mb-3 text-xl font-semibold">AI試着結果プレビュー</div>
                <p className="text-sm">
                  人物写真と服画像をアップロードして、AI試着チェックを実行してください。
                </p>
              </div>
            )}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-[#ece6dc] p-4">
              <div className="text-sm text-[#7a6e5d]">おすすめサイズ</div>
              <div className="mt-2 text-5xl font-bold">{recommendedSize}</div>
            </div>
            <div className="rounded-3xl bg-[#ece6dc] p-4">
              <div className="text-sm text-[#7a6e5d]">購入おすすめ度</div>
              <div className="mt-2 text-5xl font-bold">{purchaseScore}</div>
            </div>
            <div className="rounded-3xl bg-[#ece6dc] p-4">
              <div className="text-sm text-[#7a6e5d]">相性</div>
              <div className="mt-2 text-5xl font-bold">{compatibilityGrade}</div>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-[#eadfcf] bg-[#f7f0e4] p-5 text-[#5f5446]">
            {summary}
          </div>

          {reasons.length > 0 ? (
            <ul className="mb-8 list-disc space-y-2 pl-5 text-[#5f5446]">
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          ) : null}

          <div>
            <h3 className="mb-4 text-2xl font-bold">購入候補</h3>
            <div className="flex items-center justify-between rounded-[28px] border border-[#e6dccb] bg-[#faf8f3] p-5">
              <div>
                <div className="text-2xl font-semibold">きれいめオーバーサイズシャツ</div>
                <div className="mt-1 text-[#786b5b]">Sample Brand / 3,980円</div>
                <div className="mt-2 text-sm text-[#786b5b]">
                  春秋に使いやすいベーシックなシャツ。手持ち服との相性チェック向き。
                </div>
              </div>
              <a
                href="/api/redirect/sample-product-1"
                className="rounded-full bg-black px-7 py-4 text-white"
              >
                購入する
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
