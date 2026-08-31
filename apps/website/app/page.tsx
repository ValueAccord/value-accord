import { ArrowRight, Route, ShieldCheck } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";

export default function Home() {
  return (
    <main>
      <Header/>
      <section className="hero shell">
        <div className="eyebrow">OPEN PAYMENT COORDINATION</div>
        <h1>One protocol.<br/><em>Any value.</em></h1>
        <p className="lede">An open protocol for payment intent, competitive routing, and verifiable settlement receipts across financial systems.</p>
        <div className="actions"><a href="/demo" className="button">Try the Sandbox <ArrowRight size={17}/></a><a href="/protocol" className="text-link">Read the Protocol</a></div>
        <p className="qualification">Not a coin. Not a blockchain. A shared language for moving value.</p>
      </section>
      <section className="flow shell" aria-label="Protocol flow">
        <div><span>01</span><Route/><h2>Intent</h2><p>Merchant requests an exact amount in the currency they need.</p></div>
        <div><span>02</span><ArrowRight/><h2>Route</h2><p>Providers compete on price, speed, and reliability.</p></div>
        <div><span>03</span><ShieldCheck/><h2>Prove</h2><p>A signed, single-use Value Packet produces a durable receipt.</p></div>
      </section>
      <section className="manifesto shell"><div className="eyebrow">THE ACCORD</div><h2>Different rails.<br/>Shared understanding.</h2><p>Value Accord coordinates a payment without pretending every provider, asset, or jurisdiction is the same. Participants keep their roles; the protocol makes intent, routing, authorization, and proof interoperable.</p><a href="/how-it-works" className="text-link">See how it works →</a></section>
      <Footer/>
    </main>
  );
}
