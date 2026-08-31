# Architecture

The sandbox is intentionally a modular monolith. `protocol` owns portable messages, `cryptography` owns deterministic encoding and signatures, `mock-providers` supplies virtual offers, `router` ranks them, and `apps/sandbox` orchestrates lifecycle state.

```text
Merchant intent → Mock providers → Router → Test hold
                                      ↓
Receipt ← Exact test EUR ← Value Packet verifier ← Payer authorization
```

Trust boundaries exist between payer/router, router/provider, provider/payee, and every signer/verifier pair. The in-memory orchestrator collapses these boundaries for demonstration; that is not a production topology. A production architecture would require authenticated APIs, durable idempotency/replay storage, independent provider attestations, reconciliation, observability, privacy controls, and jurisdiction-specific compliance ownership.

The website demo mirrors the flow for education. It is deliberately not connected to the reference engine or any external service.
