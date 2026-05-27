export type Product = {
  id: string;
  platform: "rakuten" | "amazon" | "qoo10" | "shein" | "zozo" | "manual";
  name: string;
  brand: string;
  price: string;
  imageUrl?: string;
  normalUrl: string;
  affiliateUrl: string;
  description: string;
};

export const mockProducts: Product[] = [
  {
    id: "p001",
    platform: "rakuten",
    name: "きれいめオーバーサイズシャツ",
    brand: "Sample Brand",
    price: "3,980円",
    normalUrl: "https://example.com/product/p001",
    affiliateUrl: process.env.RAKUTEN_AFFILIATE_ID
      ? `https://hb.afl.rakuten.co.jp/hgc/${process.env.RAKUTEN_AFFILIATE_ID}/?pc=https%3A%2F%2Fexample.com%2Fproduct%2Fp001`
      : "https://example.com/product/p001?aff=demo-rakuten",
    description: "春秋に使いやすいベーシックなシャツ。手持ち服との相性チェック向き。",
  },
  {
    id: "p002",
    platform: "amazon",
    name: "ミニマルワイドパンツ",
    brand: "Mirror Select",
    price: "4,480円",
    normalUrl: "https://example.com/product/p002",
    affiliateUrl: process.env.AMAZON_PARTNER_TAG
      ? `https://www.amazon.co.jp/dp/EXAMPLE?tag=${process.env.AMAZON_PARTNER_TAG}`
      : "https://example.com/product/p002?tag=demo-amazon",
    description: "脚長に見せやすいワイドシルエット。トップス試着後の合わせ買い導線向き。",
  },
  {
    id: "p003",
    platform: "manual",
    name: "韓国風ショートジャケット",
    brand: "Manual Affiliate",
    price: "5,980円",
    normalUrl: "https://example.com/product/p003",
    affiliateUrl: process.env.SHEIN_AFFILIATE_BASE_URL || "https://example.com/product/p003?aff=manual-demo",
    description: "A8・バリューコマース・もしも等で生成したURLを管理画面から登録する想定。",
  },
];

export function getProductById(id: string) {
  return mockProducts.find((product) => product.id === id);
}
