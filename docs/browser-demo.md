# Browser demo and receipt verification

The browser demo at https://valueaccord.com/demo uses only synthetic USD/EUR quotes and tab-local state. It starts with $1,000.00 test USD and €0.00 test EUR. Reloading or resetting removes the session state and its signing key.

## Try the flow

1. Request €42.00. Bridge Test Rail quotes $45.83, including its fee.
2. Choose “Cheapest provider offline”. Atlas FX becomes the selected route at $46.14.
3. Create the test payment. An ephemeral Ed25519 key signs the demo payload and verification must succeed before virtual balances change.
4. Download the JSON receipt, then test a refund or a dispute. A refund restores the original amounts exactly once; a dispute leaves balances unchanged. The previous receipt stays visible when preparing a different amount.
5. Choose “All providers offline”. No payment can be created and balances remain unchanged.

Rates and completion estimates are fixed synthetic examples, not current market quotes or measured network performance. Amounts are €1.00–€500.00, with at most two decimal places. The demo calculates balances and fees in integer minor units; the older Node reference flow still uses decimal amounts.

## Verify a downloaded packet independently

After cloning this repository, with Node.js 24+:

```bash
node scripts/verify-demo-receipt.mjs /path/to/value-accord-demo-receipt.json
```

The verifier checks the Ed25519 signature over the exact UTF-8 bytes of `packet.payload` using the raw public key in `packet.publicKey`. Both key and signature are base64 encoded. It exits nonzero on invalid or malformed data.

This proves integrity relative to the included, self-generated key. It does not prove participant identity, actual settlement, external provider authorization, or a trusted timestamp. The packet uses `value-accord-browser-demo/1`, not the draft VAP wire format. It is an exportable demonstration, not a reusable payment authorization; no import/execution endpoint exists.

The top-level status, amounts, and event history are unsigned display annotations. Only `packet.payload` is signed. A successful signature check must not be interpreted as authenticating those annotations. Reordering or editing the payload string breaks its signature.

## Tests

`node --test tests/*.test.js` covers the reference sandbox and browser engine, including amount validation, signature tampering, incorrect keys, unavailable routes, insufficient balance, repeated refunds, receipt isolation, disputes, and concurrent requests. Browser Ed25519 support is required; unsupported browsers receive an explicit error without changing virtual balances.

API reference: [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).
