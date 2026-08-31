# Threat Model

## Protected properties

Exact destination amount; payer authorization; quote integrity; packet uniqueness; receipt authenticity; balance conservation; participant privacy; availability; audit continuity.

## Principal threats and initial controls

| Threat | Sandbox control | Production gap |
|---|---|---|
| Packet tampering | SHA-256 digest + Ed25519 signature | Key discovery, rotation, HSMs |
| Replay/double spend | Unique nonce + consumed set | Durable, distributed replay registry |
| Expired authorization | Signed expiry check | Clock policy and outage handling |
| Quote manipulation | Deterministic comparison | Provider authentication and quote signatures |
| Router favoritism | Observable ranking rule | Independent audit and policy disclosure |
| Partial settlement | Single-process atomic sequence | Compensating protocol and reconciliation |
| Insider/key compromise | None beyond ephemeral key | Separation of duties and revocation |
| Privacy leakage | Synthetic identifiers only | Data minimization, encryption, selective disclosure |
| Denial of service | None | Rate limits, admission control, redundancy |
| Refund/dispute abuse | Explicit state guard | Evidence rules, deadlines, adjudication, law |

The current prototype is unsuitable for adversarial or financial use. Security reports should follow `SECURITY.md`.
