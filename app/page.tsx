import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">AI Virtual Try-On Closet</div>
          <h1>買う前に、<br />自分で着てみる。</h1>
          <p className="lead">
            自分の写真に、気になる服をAIで試着。サイズ感・似合い方・手持ち服との相性まで確認できるAIクローゼットです。
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" href="/try-on">無料でAI試着してみる</Link>
            <Link className="secondary-btn" href="/pricing">料金を見る</Link>
          </div>
          <div className="trust-row">
            <span className="pill">顔を隠して利用OK</span>
            <span className="pill">購入前チェック</span>
            <span className="pill">アフィリエイト購入導線対応</span>
          </div>
        </div>

        <div className="phone-mock">
          <div className="phone-screen">
            <div className="tryon-card">
              <div className="tryon-image">
                <div>
                  <strong>AI試着プレビュー</strong>
                  <p>人物写真 + 服画像から着用イメージを生成</p>
                </div>
              </div>
              <div className="score-grid">
                <div className="mini-score"><span>おすすめ</span><strong>84</strong></div>
                <div className="mini-score"><span>サイズ</span><strong>M</strong></div>
                <div className="mini-score"><span>相性</span><strong>A</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>ネット通販の不安を、AIで減らす。</h2>
        <p className="section-lead">
          写真では可愛い。でも自分が着たら似合うか分からない。サイズも丈感も届くまで分からない。FitMirror AIは、その不安を購入前に減らします。
        </p>
        <div className="problem-list">
          <div className="problem-item">写真では可愛いけど、自分に似合うか分からない</div>
          <div className="problem-item">サイズ選びで毎回迷う</div>
          <div className="problem-item">似たような服をまた買ってしまう</div>
          <div className="problem-item">手持ち服と合わせられるか不安</div>
        </div>
      </section>

      <section className="section">
        <h2>最初に入れるMVP機能</h2>
        <div className="grid-3">
          <FeatureCard title="AI試着" body="自分の全身写真と服画像をアップするだけで、着用イメージを生成します。初期版はモック結果、後からAI APIに接続できます。" />
          <FeatureCard title="サイズ提案" body="身長・体重・体型・普段のサイズから、合いやすいサイズと注意点を表示します。断定せず参考情報として案内します。" />
          <FeatureCard title="購入導線" body="購入ボタンは /redirect/product/id を経由し、あなたのアフィリエイトURLへ転送できます。クリック計測にも対応予定です。" />
        </div>
      </section>

      <section className="section">
        <div className="panel">
          <h2>収益化の形</h2>
          <p className="section-lead">
            月額課金でAI試着・クローゼット・サイズ提案を提供し、商品購入ボタンはあなたのアフィリエイトURLへ誘導します。
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" href="/try-on">試着画面へ進む</Link>
            <Link className="ghost-btn" href="/closet">クローゼットを見る</Link>
          </div>
        </div>
      </section>
    </>
  );
}
