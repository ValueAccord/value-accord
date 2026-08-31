export function Header() {
  return <><div className="notice">Sandbox only — no real funds are transferred</div><header className="nav shell"><a href="/" className="brand"><span>VA</span> Value Accord</a><nav aria-label="Primary navigation"><a href="/demo">Live Demo</a><a href="/how-it-works">How It Works</a><a href="/protocol">Protocol</a><a href="/roadmap">Roadmap</a><a href="/faq">FAQ</a></nav><a href="/demo" className="button compact">Try the Sandbox</a></header></>;
}

export function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div><a href="/" className="brand"><span>VA</span> Value Accord</a><p>One protocol. Any value.</p></div><div><strong>Explore</strong><a href="/demo">Live Demo</a><a href="/protocol">Protocol</a><a href="/roadmap">Roadmap</a></div><div><strong>Participate</strong><a href="/join">Join the Project</a><a href="https://github.com/ValueAccord/value-accord" aria-label="Value Accord on GitHub">GitHub</a><a href="https://github.com/ValueAccord/value-accord/issues">Issues</a></div></div><div className="shell legal">Experimental open-source project. No real funds, custody, cards, or regulated financial services.</div></footer>;
}

export function PageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <><Header/><main className="page shell"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="lede">{intro}</p>{children}</main><Footer/></>;
}
