export default function ClosetPage() {
  return (
    <section className="section">
      <div className="eyebrow">AI Closet</div>
      <h1>クローゼット管理</h1>
      <p className="section-lead">
        持っている服を登録して、買い物前に「似た服を持っていないか」「手持ち服と合わせやすいか」を確認するページです。
      </p>
      <div className="grid-3">
        <div className="feature-card">
          <h3>手持ち服登録</h3>
          <p>トップス・ボトムス・アウター・靴・バッグを保存。あとでSupabase Storageに接続します。</p>
        </div>
        <div className="feature-card">
          <h3>似た服チェック</h3>
          <p>購入前に、同じ色や形の服をすでに持っていないか確認します。</p>
        </div>
        <div className="feature-card">
          <h3>コーデ提案</h3>
          <p>新しく買う服と手持ち服を組み合わせて、着回しやすさを表示します。</p>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 22 }}>
        <h2>次に実装する内容</h2>
        <ul className="clean">
          <li>服画像アップロード</li>
          <li>カテゴリ・色・季節の自動分類</li>
          <li>手持ち服との相性スコア</li>
          <li>買わなくていい服の判定</li>
        </ul>
      </div>
    </section>
  );
}
