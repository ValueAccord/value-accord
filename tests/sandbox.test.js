import test from "node:test";
import assert from "node:assert/strict";
import { AccordSandbox } from "../apps/sandbox/src/index.js";
import { verifyValuePacket } from "../packages/protocol/src/index.js";

test("routes USD to exact merchant EUR and creates a verifiable packet", () => {
  const sandbox = new AccordSandbox();
  const tx = sandbox.pay({ amountEur: 42 });
  assert.equal(tx.status, "settled");
  assert.equal(tx.intent.amount, 42);
  assert.equal(sandbox.balances.merchantEur, 42);
  assert.equal(tx.selected.providerName, "Bridge Test Rail");
  assert.equal(verifyValuePacket(tx.packet, sandbox.signer.publicKey).valid, true);
  assert.match(tx.receipt.merchantReceived, /42\.00 EUR/);
});

test("rejects replay of a consumed Value Packet", () => {
  const sandbox = new AccordSandbox();
  const tx = sandbox.pay({ amountEur: 10 });
  assert.deepEqual(verifyValuePacket(tx.packet, sandbox.signer.publicKey, sandbox.consumedNonces), { valid: false, reason: "replayed" });
});

test("refund reverses test balances", () => {
  const sandbox = new AccordSandbox();
  const initial = { ...sandbox.balances };
  const tx = sandbox.pay({ amountEur: 25 });
  sandbox.refund(tx.id);
  assert.deepEqual(sandbox.balances, initial);
  assert.equal(tx.status, "refunded");
});

test("opens a test dispute without moving balances", () => {
  const sandbox = new AccordSandbox();
  const tx = sandbox.pay({ amountEur: 19 });
  const before = { ...sandbox.balances };
  sandbox.dispute(tx.id, "item_not_received");
  assert.equal(tx.status, "disputed");
  assert.deepEqual(sandbox.balances, before);
});
