import { PageShell } from '@/components/site-chrome';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata(
  'Contribute to the open-source protocol',
  'Run the Value Accord reference sandbox locally, review RFC-0001, and find concrete ways to contribute to routing, security, and interoperability.',
  '/join',
);

export default function Join() {
  return (
    <PageShell
      eyebrow="JOIN THE PROJECT"
      title="Build the accord in the open."
      intro="Start with a runnable example. Then help answer a concrete question about routing, trust, or failure handling."
    >
      <section className="quickstart" aria-labelledby="quickstart-title">
        <div>
          <span className="section-kicker">01 / RUN THE REFERENCE</span>
          <h2 id="quickstart-title">One clone. A complete test payment.</h2>
          <p>
            Use Node.js 24+. The reference CLI uses built-in Node modules and
            runs without installing the website dependencies.
          </p>
          <p>
            It prints the selected quote, virtual balances, signed packet, and
            receipt. Nothing connects to a bank or payment provider.
          </p>
        </div>
        <pre>
          <code>{`git clone https://github.com/ValueAccord/value-accord.git\ncd value-accord\nnode apps/sandbox/src/cli.js\nnode --test tests/*.test.js`}</code>
        </pre>
      </section>
      <section aria-labelledby="contribution-title">
        <span className="section-kicker">02 / CHOOSE A QUESTION</span>
        <h2 id="contribution-title" className="section-title">
          Useful first contributions
        </h2>
        <div className="join-grid">
          <article>
            <h3>Routing under failure</h3>
            <p>
              What should happen when a quote expires or a provider disappears?
              Propose a synthetic fixture and the expected result.
            </p>
            <a
              className="text-link"
              href="https://github.com/ValueAccord/value-accord/tree/main/packages/router"
            >
              Inspect the router →
            </a>
          </article>
          <article>
            <h3>Protocol review</h3>
            <p>
              Challenge packet fields, replay protection, and trust assumptions.
              Reference the exact RFC section in your proposal.
            </p>
            <a
              className="text-link"
              href="https://github.com/ValueAccord/value-accord/blob/main/docs/RFC-0001.md"
            >
              Review RFC-0001 →
            </a>
          </article>
          <article>
            <h3>Reproducible feedback</h3>
            <p>
              Found confusing wording or a broken interaction? Include the URL,
              steps, and expected behavior using test data.
            </p>
            <a
              className="text-link"
              href="https://github.com/ValueAccord/value-accord/issues/new?template=bug_report.yml"
            >
              Report a problem →
            </a>
          </article>
        </div>
      </section>
      <section className="resource-list" aria-label="Contributor resources">
        <a href="https://github.com/ValueAccord/value-accord/blob/main/docs/browser-demo.md">
          <strong>Verify a demo packet</strong>
          <span>Inspect a downloaded receipt independently ↗</span>
        </a>
        <a href="https://github.com/ValueAccord/value-accord/blob/main/CONTRIBUTING.md">
          <strong>Contribution guide</strong>
          <span>Tests, scope, and how to propose changes ↗</span>
        </a>
        <a href="https://github.com/ValueAccord/value-accord/blob/main/docs/threat-model.md">
          <strong>Threat model</strong>
          <span>Assumptions and known research gaps ↗</span>
        </a>
        <a href="https://github.com/ValueAccord/value-accord/blob/main/GOVERNANCE.md">
          <strong>Governance</strong>
          <span>How stewardship is being discussed ↗</span>
        </a>
        <a href="https://github.com/ValueAccord/value-accord/blob/main/SECURITY.md">
          <strong>Security reports</strong>
          <span>How to request private maintainer contact ↗</span>
        </a>
      </section>
      <div className="callout">
        <strong>Working group status: forming</strong>
        <p>
          Proposals and feedback start in the public repository. For a larger
          contribution, discuss the design in an issue before implementation.
        </p>
        <div className="actions">
          <a
            href="https://github.com/ValueAccord/value-accord"
            className="button"
          >
            View on GitHub
          </a>
          <a
            href="https://github.com/ValueAccord/value-accord/issues"
            className="text-link"
          >
            Explore open issues →
          </a>
        </div>
      </div>
    </PageShell>
  );
}
