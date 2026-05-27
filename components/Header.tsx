import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-mark">FM</span>
        <span>FitMirror AI</span>
      </Link>
      <nav className="nav">
        <Link href="/try-on">AI試着</Link>
        <Link href="/closet">クローゼット</Link>
        <Link href="/pricing">料金</Link>
      </nav>
      <Link href="/try-on" className="header-cta">無料で試す</Link>
    </header>
  );
}
