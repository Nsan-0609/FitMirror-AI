import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0円",
    description: "まず試したい人向け",
    items: ["月3回までAI試着", "服登録10点まで", "簡易サイズ提案", "試着履歴3件まで"],
  },
  {
    name: "Standard",
    price: "980円",
    description: "一番おすすめ",
    items: ["AI試着 月50回", "服登録100点", "サイズ提案詳細版", "購入前チェック", "お気に入り保存"],
  },
  {
    name: "Premium",
    price: "1,480円",
    description: "本格的に使う人向け",
    items: ["AI試着ほぼ無制限", "クローゼット無制限", "通販URL管理", "似た服チェック", "AIスタイリスト相談"],
  },
];

export default function PricingPage() {
  return (
    <section className="section">
      <div className="eyebrow">Pricing</div>
      <h1>料金プラン</h1>
      <p className="section-lead">
        最初は無料で試し、気に入ったら月額プランでAI試着・クローゼット管理・購入前チェックを増やせます。
      </p>
      <div className="grid-3">
        {plans.map((plan) => (
          <div className="price-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <div className="price">{plan.price}<small>/月</small></div>
            <ul className="clean">
              {plan.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Link href="/try-on" className="primary-btn">このプランで始める</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
