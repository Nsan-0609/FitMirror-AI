import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FitMirror AI | 買う前に、自分で着てみる",
  description: "自分の写真に気になる服をAI試着。サイズ感・似合い方・手持ち服との相性まで確認できるAIクローゼット。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
