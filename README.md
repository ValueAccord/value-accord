# Value Accord

**One protocol. Any value.**

Value Accord is an early open-source experiment in coordinating value transfer across otherwise incompatible financial systems. It is not a coin, blockchain, bank, payment processor, or custodian. The open standard is the **Value Accord Protocol (VAP)**; the runnable reference prototype is **Accord Sandbox**; the signed one-time payment object is a **Value Packet**.

> **Sandbox only — no real funds are transferred.** Every balance, provider, quote, hold, settlement, refund, and dispute is simulated. Never submit card numbers, bank credentials, personal data, or real funds.

## What works

The first vertical slice lets a merchant request exact EUR, obtains competitive USD→EUR quotes from three virtual providers, selects the cheapest viable route, conditionally holds a test USD balance, signs an Ed25519 Value Packet, settles exact test EUR, and issues a receipt. Refund and dispute transitions are included.

## Repository

```text
apps/website          Public explanation and interactive browser demo
apps/sandbox          Executable in-memory reference flow
packages/protocol     Intent and Value Packet data model
packages/router       Deterministic quote ranking
packages/mock-providers  Virtual quote providers
packages/cryptography Canonicalization, hashing, Ed25519 signatures
docs                  RFC, architecture, threat model, roadmap
tests                 End-to-end protocol lifecycle tests
```

## Run locally

Requires Node.js 22+ and pnpm 10+.

```bash
node --test tests/*.test.js
node apps/sandbox/src/cli.js
cd apps/website
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Build the website with `pnpm build` inside `apps/website`.

## Boundaries

- No real funds, custody, cards, accounts, KYC data, or production integrations.
- No claim of bank, money-transmitter, payment-institution, or other financial license.
- No claim that this replaces Visa, banks, or existing networks.
- The code is offered under Apache-2.0. The protocol specification is marked separately because its final legal terms need specialist review.

See [CONTRIBUTING.md](CONTRIBUTING.md), [GOVERNANCE.md](GOVERNANCE.md), and [docs/RFC-0001.md](docs/RFC-0001.md).
