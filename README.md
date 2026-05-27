# FitMirror AI

買う前に、自分で着てみる。  
自分の写真に気になる服をAIで試着し、サイズ感・似合い方・購入前チェック・アフィリエイト購入導線まで作るMVPです。

## 入っているもの

- Next.js App Router構成
- LPトップページ
- AI試着入力ページ
- モックAI診断API
- 商品一覧API
- アフィリエイトURLへのリダイレクトAPI
- 料金ページ
- プライバシー/利用規約ページ
- Stripe Checkout用のAPI雛形
- Supabase用SQLスキーマ

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 環境変数

`.env.example` を `.env.local` にコピーして入力してください。

```bash
cp .env.example .env.local
```

最初は未入力でもLPとモック試着は動きます。

## アフィリエイトURLについて

`lib/mockProducts.ts` に商品データがあります。  
初期版では `affiliateUrl` を優先し、購入ボタンは `/api/redirect/[productId]` を経由して外部URLへ転送します。

本番では以下を追加してください。

- 楽天APIの `affiliateUrl` を商品データに保存
- Amazonアソシエイトタグ付きURLを保存
- A8/もしも/バリューコマース等で生成したURLを保存
- `affiliate_clicks` テーブルへクリックログ保存

## AI試着について

初期版では画像の本生成はモックです。  
`app/api/tryon/route.ts` の中身を、利用するAI試着APIに差し替えてください。

## 注意

- ユーザーの全身写真は個人情報性が高いため、保存・削除・利用目的の表示を必ず入れてください。
- サイズ提案は参考情報として表示し、適合を保証しない表現にしてください。
- 外部ECやASPの規約に反するリンク改変は行わないでください。
