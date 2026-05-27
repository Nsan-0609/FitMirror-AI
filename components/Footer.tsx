import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>FitMirror AI</strong>
        <p>ネット通販の「買って失敗した」を減らすAIクローゼット。</p>
      </div>
      <div className="footer-links">
        <Link href="/privacy">プライバシー</Link>
        <Link href="/terms">利用規約</Link>
      </div>
    </footer>
  );
}
