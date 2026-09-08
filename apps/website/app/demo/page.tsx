import { Header, Footer } from '@/components/site-chrome';
import { SandboxDemo } from '@/components/sandbox-demo';
import { pageMetadata } from '@/lib/page-metadata';
export const metadata = pageMetadata(
  'Interactive payment routing demo',
  'Compare synthetic USD to EUR quotes, simulate unavailable providers, verify an Ed25519 demo signature, and test refunds with virtual balances.',
  '/demo',
);
export default function Demo() {
  return (
    <>
      <Header />
      <main id="main-content" className="page shell demo-page">
        <div className="eyebrow">ACCORD SANDBOX</div>
        <h1>Route a test payment.</h1>
        <p className="lede">
          Ask for exact test EUR, compare providers, then sign and verify a demo
          packet. Change the provider scenario to see how the route responds.
        </p>
        <SandboxDemo />
        <p className="demo-footnote">
          This browser demo uses a simplified, separately versioned packet
          format. For the draft Value Accord Protocol and the Node.js reference
          implementation, <a href="/protocol">read the protocol</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
