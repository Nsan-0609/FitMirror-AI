"use client";

import { useEffect, useState } from "react";

type TryOnResult = {
  generatedImageStatus: string;
  message: string;
  advice: {
    recommendedSize: string;
    relaxedSize: string;
    fitScore: number;
    compatibility: "A" | "B" | "C";
    comment: string;
    caution: string;
  };
  purchaseScore: number;
  reasons: string[];
};

type Product = {
  id: string;
  platform: string;
  name: string;
  brand: string;
  price: string;
  description: string;
};

export default function TryOnPage() {
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [clothPhoto, setClothPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    height: "165",
    weight: "55",
    bodyType: "normal",
    usualTop: "M",
    usualBottom: "M",
    fitPreference: "normal",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  function handlePreview(file: File | undefined, setter: (url: string) => void) {
    if (!file) return;
    setter(URL.createObjectURL(file));
  }

  async function runTryOn() {
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        height: Number(form.height),
        weight: Number(form.weight),
        bodyType: form.bodyType,
        usualTop: form.usualTop,
        usualBottom: form.usualBottom,
        fitPreference: form.fitPreference,
      }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <section className="form-page">
      <div className="eyebrow">AI Try-On</div>
      <h1>AI試着を作成</h1>
      <p className="section-lead">
        全身写真と服画像をアップロードして、サイズ感・似合いやすさ・購入前チェックを確認します。
      </p>

      <div className="app-shell">
        <div className="form-card">
          <h2>入力情報</h2>
          <div className="field">
            <label>自分の全身写真</label>
            <input type="file" accept="image/*" onChange={(e) => handlePreview(e.target.files?.[0], setBodyPhoto)} />
          </div>
          <div className="field">
            <label>試したい服の画像</label>
            <input type="file" accept="image/*" onChange={(e) => handlePreview(e.target.files?.[0], setClothPhoto)} />
          </div>

          <div className="preview-grid">
            <div className="preview-box">{bodyPhoto ? <img src={bodyPhoto} alt="人物写真プレビュー" /> : "人物写真"}</div>
            <div className="preview-box">{clothPhoto ? <img src={clothPhoto} alt="服画像プレビュー" /> : "服画像"}</div>
          </div>

          <div className="row-2">
            <div className="field">
              <label>身長 cm</label>
              <input value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
            </div>
            <div className="field">
              <label>体重 kg</label>
              <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label>普段のトップス</label>
              <select value={form.usualTop} onChange={(e) => setForm({ ...form, usualTop: e.target.value })}>
                <option>S</option><option>M</option><option>L</option><option>XL</option>
              </select>
            </div>
            <div className="field">
              <label>普段のボトムス</label>
              <select value={form.usualBottom} onChange={(e) => setForm({ ...form, usualBottom: e.target.value })}>
                <option>S</option><option>M</option><option>L</option><option>XL</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>好みの着方</label>
            <select value={form.fitPreference} onChange={(e) => setForm({ ...form, fitPreference: e.target.value })}>
              <option value="tight">ぴったり</option>
              <option value="normal">普通</option>
              <option value="loose">ゆったり</option>
            </select>
          </div>

          <button className="primary-btn" onClick={runTryOn} disabled={loading}>
            {loading ? "診断中..." : "AI試着チェック"}
          </button>
          <p className="notice" style={{ marginTop: 14 }}>
            初期版では画像はブラウザ内プレビューのみです。実際の保存・AI生成はSupabase StorageとAI試着APIを接続して追加します。
          </p>
        </div>

        <div className="result-card">
          <h2>試着結果</h2>
          <div className="result-hero">
            {result ? (
              <div>
                <strong>AI試着結果プレビュー</strong>
                <p>{result.message}</p>
              </div>
            ) : (
              <div>
                <strong>まだ結果はありません</strong>
                <p>左の情報を入力して「AI試着チェック」を押してください。</p>
              </div>
            )}
          </div>

          {result && (
            <>
              <div className="result-metrics">
                <div className="metric"><span>おすすめサイズ</span><strong>{result.advice.recommendedSize}</strong></div>
                <div className="metric"><span>購入おすすめ度</span><strong>{result.purchaseScore}</strong></div>
                <div className="metric"><span>相性</span><strong>{result.advice.compatibility}</strong></div>
              </div>
              <div className="notice">
                <strong>{result.advice.comment}</strong><br />
                {result.advice.caution}
              </div>
              <ul className="clean">
                {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>

              <h3>購入候補</h3>
              <div className="product-list">
                {products.map((product) => (
                  <div className="product-row" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.brand} / {product.price}</p>
                      <p>{product.description}</p>
                    </div>
                    <a className="primary-btn" href={`/api/redirect/${product.id}`} target="_blank" rel="noreferrer">購入する</a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
