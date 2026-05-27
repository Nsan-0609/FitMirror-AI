"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

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

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(204, 181, 138, 0.25), transparent 36%), #f6f1e8",
    color: "#1d1a16",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    borderBottom: "1px solid #e4dac7",
    background: "rgba(246, 241, 232, 0.92)",
    position: "sticky",
    top: 0,
    zIndex: 20,
    backdropFilter: "blur(12px)",
  },
  headerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "18px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 800,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #21170e, #5b452b)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  nav: {
    display: "flex",
    gap: 28,
    fontSize: 14,
    color: "#6b6258",
  },
  navLink: {
    color: "#6b6258",
    textDecoration: "none",
  },
  cta: {
    background: "#050505",
    color: "#fff",
    padding: "13px 24px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 800,
    boxShadow: "0 14px 35px rgba(0,0,0,0.16)",
  },
  layout: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: 28,
    display: "grid",
    gridTemplateColumns: "370px minmax(0, 1fr)",
    gap: 24,
  },
  panel: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #eadfcb",
    borderRadius: 30,
    padding: 24,
    boxShadow: "0 24px 80px rgba(54, 42, 24, 0.08)",
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    margin: "0 0 22px",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 8,
    color: "#3b3329",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #e0d3bd",
    background: "#fbf7ef",
    borderRadius: 16,
    padding: "13px 14px",
    fontSize: 14,
    outline: "none",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #e0d3bd",
    background: "#fbf7ef",
    borderRadius: 16,
    padding: "13px 14px",
    fontSize: 14,
    outline: "none",
  },
  formGroup: {
    marginBottom: 18,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    margin: "18px 0",
  },
  previewBox: {
    border: "1px dashed #cdbfaa",
    background: "#fbf8f1",
    borderRadius: 22,
    height: 235,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#9a8b78",
    fontSize: 13,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  button: {
    width: "100%",
    border: "none",
    background: "#050505",
    color: "#fff",
    borderRadius: 999,
    padding: "16px 18px",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
  },
  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    marginTop: 14,
    border: "1px solid #efb6a9",
    background: "#fff0ec",
    color: "#a03424",
    padding: 14,
    borderRadius: 16,
    fontSize: 13,
    lineHeight: 1.7,
  },
  resultArea: {
    minHeight: 455,
    background:
      "linear-gradient(135deg, rgba(239, 228, 207, 0.96), rgba(247, 241, 229, 0.95))",
    border: "1px solid #ded0b9",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    marginBottom: 18,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    maxHeight: 560,
    objectFit: "contain",
    borderRadius: 24,
  },
  resultEmpty: {
    textAlign: "center",
    color: "#716553",
    lineHeight: 1.8,
  },
  resultEmptyTitle: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 8,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    background: "#eee7dc",
    borderRadius: 22,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    color: "#7a6f61",
    fontWeight: 800,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 38,
    fontWeight: 950,
    letterSpacing: "-0.06em",
  },
  summary: {
    background: "#fbf3e4",
    border: "1px solid #eadbc2",
    borderRadius: 22,
    padding: 18,
    color: "#5d5246",
    lineHeight: 1.8,
    marginBottom: 16,
  },
  reasonList: {
    color: "#5d5246",
    lineHeight: 1.9,
    marginBottom: 26,
  },
  productCard: {
    border: "1px solid #e5d8c2",
    background: "#fdfaf4",
    borderRadius: 24,
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 6,
  },
  productMeta: {
    color: "#776a59",
    fontSize: 14,
    marginBottom: 8,
  },
  productText: {
    color: "#776a59",
    fontSize: 13,
    lineHeight: 1.7,
  },
  buyButton: {
    background: "#050505",
    color: "#fff",
    borderRadius: 999,
    padding: "14px 22px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    fontWeight: 900,
  },
  note: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 1.7,
    color: "#7a6f61",
  },
};

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

export default function TryOnPage() {
  const [bodyFile, setBodyFile] = useState<File | null>(null);
  const [clothFile, setClothFile] = useState<File | null>(null);

  const [bodyPreview, setBodyPreview] = useState("");
  const [clothPreview, setClothPreview] = useState("");

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
      "人物写真と服画像をアップロードして、AI試着チェックを実行してください。"
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
    } catch {
      setErrorMessage(
        "通信エラーが発生しました。時間をおいて再度お試しください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoWrap}>
            <div style={styles.logo}>FM</div>
            <div>FitMirror AI</div>
          </div>

          <nav style={styles.nav}>
            <a href="/try-on" style={styles.navLink}>
              AI試着
            </a>
            <a href="/closet" style={styles.navLink}>
              クローゼット
            </a>
            <a href="/pricing" style={styles.navLink}>
              料金
            </a>
          </nav>

          <a href="/pricing" style={styles.cta}>
            無料で試す
          </a>
        </div>
      </header>

      <div style={styles.layout}>
        <section style={styles.panel}>
          <h2 style={styles.title}>入力情報</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>自分の全身写真</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleBodyFile(event.target.files?.[0] || null)
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>試したい服の画像</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleClothFile(event.target.files?.[0] || null)
              }
              style={styles.input}
            />
          </div>

          <div style={styles.previewGrid}>
            <div style={styles.previewBox}>
              {bodyPreview ? (
                <img
                  src={bodyPreview}
                  alt="人物プレビュー"
                  style={styles.previewImage}
                />
              ) : (
                <span>人物プレビュー</span>
              )}
            </div>

            <div style={styles.previewBox}>
              {clothPreview ? (
                <img
                  src={clothPreview}
                  alt="服プレビュー"
                  style={styles.previewImage}
                />
              ) : (
                <span>服プレビュー</span>
              )}
            </div>
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>身長 cm</label>
              <input
                type="number"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>体重 kg</label>
              <input
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.twoCol}>
            <div style={styles.formGroup}>
              <label style={styles.label}>普段のトップス</label>
              <select
                value={usualTop}
                onChange={(event) => setUsualTop(event.target.value)}
                style={styles.select}
              >
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>普段のボトムス</label>
              <select
                value={usualBottom}
                onChange={(event) => setUsualBottom(event.target.value)}
                style={styles.select}
              >
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>好みの着方</label>
            <select
              value={fitPreference}
              onChange={(event) => setFitPreference(event.target.value)}
              style={styles.select}
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
            style={{
              ...styles.button,
              ...(loading ? styles.disabledButton : {}),
            }}
          >
            {loading ? "AI試着を生成中..." : "AI試着チェック"}
          </button>

          <div style={styles.note}>
            写真はAI試着のために使用されます。正式版では保存期間・削除機能・プライバシー設定を追加します。
          </div>

          {errorMessage ? <div style={styles.error}>{errorMessage}</div> : null}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.title}>試着結果</h2>

          <div style={styles.resultArea}>
            {resultImage ? (
              <img
                src={resultImage}
                alt="AI試着結果"
                style={styles.resultImage}
              />
            ) : (
              <div style={styles.resultEmpty}>
                <div style={styles.resultEmptyTitle}>
                  AI試着結果プレビュー
                </div>
                <div>
                  人物写真と服画像をアップロードして、
                  <br />
                  AI試着チェックを実行してください。
                </div>
              </div>
            )}
          </div>

          <div style={styles.stats}>
            <StatCard label="おすすめサイズ" value={recommendedSize} />
            <StatCard label="購入おすすめ度" value={purchaseScore} />
            <StatCard label="相性" value={compatibilityGrade} />
          </div>

          <div style={styles.summary}>{summary}</div>

          {reasons.length > 0 ? (
            <ul style={styles.reasonList}>
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          ) : null}

          <h3 style={{ ...styles.title, fontSize: 24, marginBottom: 14 }}>
            購入候補
          </h3>

          <div style={styles.productCard}>
            <div>
              <div style={styles.productTitle}>
                きれいめオーバーサイズシャツ
              </div>
              <div style={styles.productMeta}>
                Sample Brand / 3,980円
              </div>
              <div style={styles.productText}>
                春秋に使いやすいベーシックなシャツ。手持ち服との相性チェック向き。
              </div>
            </div>

            <a href="/api/redirect/sample-product-1" style={styles.buyButton}>
              購入する
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
