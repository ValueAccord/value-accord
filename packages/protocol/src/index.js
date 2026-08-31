import { randomUUID } from "node:crypto";
import { digest, signPayload, verifyPayload } from "../../cryptography/src/index.js";

export const PACKET_VERSION = "vap/0.1";

export function createPaymentIntent({ amount, currency, merchantId, expiresInMs = 300_000, now = Date.now() }) {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be positive");
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Currency must be an ISO-style three-letter code");
  return { id: `intent_${randomUUID()}`, amount, currency, merchantId, createdAt: new Date(now).toISOString(), expiresAt: new Date(now + expiresInMs).toISOString(), status: "open" };
}

export function createValuePacket({ intent, quote, payer, payee, nonce = randomUUID(), issuedAt = new Date().toISOString() }, signer) {
  const claims = {
    version: PACKET_VERSION,
    id: `vp_${randomUUID()}`,
    nonce,
    singleUse: true,
    intentId: intent.id,
    source: { amount: quote.sourceAmount, currency: quote.sourceCurrency, account: payer },
    destination: { amount: intent.amount, currency: intent.currency, account: payee },
    route: { providerId: quote.providerId, quoteId: quote.id },
    issuedAt,
    expiresAt: intent.expiresAt
  };
  return { claims, digest: digest(claims), signer: signer.id, signature: signPayload(claims, signer.privateKey) };
}

export function verifyValuePacket(packet, publicKey, consumedNonces = new Set(), now = Date.now()) {
  if (packet.claims.version !== PACKET_VERSION) return { valid: false, reason: "unsupported_version" };
  if (new Date(packet.claims.expiresAt).getTime() <= now) return { valid: false, reason: "expired" };
  if (consumedNonces.has(packet.claims.nonce)) return { valid: false, reason: "replayed" };
  if (packet.digest !== digest(packet.claims)) return { valid: false, reason: "digest_mismatch" };
  if (!verifyPayload(packet.claims, packet.signature, publicKey)) return { valid: false, reason: "invalid_signature" };
  return { valid: true };
}
