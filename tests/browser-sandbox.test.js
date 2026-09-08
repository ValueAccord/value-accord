import test from "node:test";
import assert from "node:assert/strict";
import { BrowserSandbox, parseAmount, getDemoQuotes, verifyDemoPacket } from "../apps/website/lib/browser-sandbox.ts";

test("browser money inputs are bounded and preserve cents", () => {
  assert.equal(parseAmount("42.01"), 4201);
  assert.equal(parseAmount("500.00"), 50000);
  for (const value of ["", "NaN", "Infinity", "-1", "0", "0.99", "500.01", "1.001", "1e2"]) assert.throws(() => parseAmount(value));
  assert.equal(getDemoQuotes(4200, "normal")[0].totalMinor, 4583);
  assert.equal(getDemoQuotes(4200, "provider-offline")[0].id, "atlas");
});

test("browser signs a verifiable packet; altered data and keys fail verification", async () => {
  const sandbox = new BrowserSandbox();
  const tx = await sandbox.pay("42.01");
  assert.equal(await verifyDemoPacket(tx.packet), true);
  const payload = JSON.parse(tx.packet.payload);
  payload.destination.amountMinor += 1;
  assert.equal(await verifyDemoPacket({ ...tx.packet, payload: JSON.stringify(payload) }), false);
  const other = await new BrowserSandbox().pay("42.01");
  assert.equal(await verifyDemoPacket({ ...tx.packet, publicKey: other.packet.publicKey }), false);
  assert.equal(await verifyDemoPacket({ ...tx.packet, signature: "invalid" }), false);
  assert.equal(sandbox.balances.merchantEurMinor, 4201);
});

test("failed routes and insufficient funds leave balances unchanged", async () => {
  const sandbox = new BrowserSandbox();
  const initial = sandbox.balances;
  await assert.rejects(sandbox.pay("42", "no-routes"), /No provider/);
  await assert.rejects(sandbox.pay("500.01"), /amount/);
  assert.deepEqual(sandbox.balances, initial);
  await sandbox.pay("500");
  const beforeFailure = sandbox.balances;
  await assert.rejects(sandbox.pay("500"), /Insufficient/);
  assert.deepEqual(sandbox.balances, beforeFailure);
});

test("refund uses the saved amounts exactly once; callers cannot alter internal receipt", async () => {
  const sandbox = new BrowserSandbox();
  const initial = sandbox.balances;
  const tx = await sandbox.pay("42.01", "provider-offline");
  assert.equal(tx.provider, "Atlas FX");
  tx.paidUsdMinor = 999999;
  tx.amountEurMinor = 999999;
  const refunded = sandbox.transition(tx.id, "refunded");
  assert.deepEqual(sandbox.balances, initial);
  assert.equal(refunded.amountEurMinor, 4201);
  assert.throws(() => sandbox.transition(tx.id, "refunded"));
  assert.throws(() => sandbox.transition(tx.id, "disputed"));
  assert.equal(await verifyDemoPacket(refunded.packet), true);
});

test("disputes do not move balances and concurrent payments are rejected", async () => {
  const sandbox = new BrowserSandbox();
  const pending = sandbox.pay("19");
  await assert.rejects(sandbox.pay("19"), /already/);
  const tx = await pending;
  const balances = sandbox.balances;
  assert.equal(sandbox.transition(tx.id, "disputed").status, "disputed");
  assert.deepEqual(sandbox.balances, balances);
  assert.throws(() => sandbox.transition(tx.id, "refunded"));
});
