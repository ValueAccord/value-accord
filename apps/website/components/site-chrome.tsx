import Link from "next/link";

export function Header() {
  return <><div className="notice">Sandbox only — no real funds are transferred</div><header className="nav shell"><Link href="/" className="brand"><span>VA</span> Value Accord</Link><nav aria-label="Primary navigation"><Link href="/demo">Live Demo</Link><Link href="/how-it-works">How It Works</Link><Link href="/protocol">Protocol</Link><Link href="/roadmap">Roadmap</Link><Link href="/faq">FAQ</Link></nav><Link href="/demo" className="button compact">Try the Sandbox</Link></header></>;
}

export function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div><Link href="/" className="brand"><span>VA</span> Value Accord</Link><p>One protocol. Any value.</p></div><div><strong>Explore</strong><Link href="/demo">Live Demo</Link><Link href="/protocol">Protocol</Link><Link href="/roadmap">Roadmap</Link></div><div><strong>Participate</strong><Link href="/join">Join the Project</Link><a href="https://github.com/" aria-label="GitHub placeholder">GitHub (not yet published)</a></div></div><div className="shell legal">Experimental open-source project. No real funds, custody, cards, or regulated financial services.</div></footer>;
}

export function PageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <><Header/><main className="page shell"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="lede">{intro}</p>{children}</main><Footer/></>;
}
