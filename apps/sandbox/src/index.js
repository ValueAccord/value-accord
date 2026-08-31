import { randomUUID } from "node:crypto";
import { createPaymentIntent, createValuePacket, verifyValuePacket } from "../../../packages/protocol/src/index.js";
import { selectBestRoute } from "../../../packages/router/src/index.js";
import { getQuotes } from "../../../packages/mock-providers/src/index.js";
import { createSigningIdentity } from "../../../packages/cryptography/src/index.js";

export class AccordSandbox {
  constructor({ buyerUsd = 1000, merchantEur = 0 } = {}) {
    this.balances = { buyerUsd, merchantEur };
    this.heldUsd = 0;
    this.transactions = new Map();
    this.consumedNonces = new Set();
    this.signer = createSigningIdentity();
  }

  quote({ amountEur, merchantId = "merchant_demo" }) {
    const intent = createPaymentIntent({ amount: amountEur, currency: "EUR", merchantId });
    const quotes = getQuotes(intent);
    return { intent, quotes, selected: selectBestRoute(quotes) };
  }

  pay({ amountEur, payer = "buyer_demo", payee = "merchant_demo" }) {
    const { intent, quotes, selected } = this.quote({ amountEur, merchantId: payee });
    if (this.balances.buyerUsd < selected.sourceAmount) throw new Error("Insufficient test balance");
    this.balances.buyerUsd -= selected.sourceAmount;
    this.heldUsd += selected.sourceAmount;
    const packet = createValuePacket({ intent, quote: selected, payer, payee }, this.signer);
    const check = verifyValuePacket(packet, this.signer.publicKey, this.consumedNonces);
    if (!check.valid) throw new Error(`Packet rejected: ${check.reason}`);
    this.consumedNonces.add(packet.claims.nonce);
    this.heldUsd -= selected.sourceAmount;
    this.balances.merchantEur += intent.amount;
    const transaction = {
      id: `tx_${randomUUID()}`, status: "settled", intent, quotes, selected, packet,
      receipt: { id: `receipt_${randomUUID()}`, status: "settled", merchantReceived: `${intent.amount.toFixed(2)} EUR`, buyerPaid: `${selected.sourceAmount.toFixed(2)} USD`, packetDigest: packet.digest, issuedAt: new Date().toISOString() }
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  refund(transactionId) {
    const tx = this.#getSettled(transactionId);
    this.balances.merchantEur -= tx.intent.amount;
    this.balances.buyerUsd += tx.selected.sourceAmount;
    tx.status = "refunded";
    tx.refund = { id: `refund_${randomUUID()}`, status: "completed", issuedAt: new Date().toISOString() };
    return tx;
  }

  dispute(transactionId, reason = "service_not_received") {
    const tx = this.#getSettled(transactionId);
    tx.status = "disputed";
    tx.dispute = { id: `dispute_${randomUUID()}`, status: "open", reason, openedAt: new Date().toISOString(), testOnly: true };
    return tx;
  }

  #getSettled(id) {
    const tx = this.transactions.get(id);
    if (!tx) throw new Error("Transaction not found");
    if (tx.status !== "settled") throw new Error(`Transaction cannot be changed from ${tx.status}`);
    return tx;
  }
}
