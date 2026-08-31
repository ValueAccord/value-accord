import { randomUUID } from "node:crypto";

const providers = [
  { id: "mock-atlas", name: "Atlas FX", rate: 1.091, fee: 0.32, reliability: 0.998, etaMs: 850 },
  { id: "mock-bridge", name: "Bridge Test Rail", rate: 1.087, fee: 0.18, reliability: 0.994, etaMs: 620 },
  { id: "mock-northstar", name: "Northstar Demo", rate: 1.096, fee: 0.52, reliability: 0.999, etaMs: 1100 }
];

export function getQuotes(intent, sourceCurrency = "USD") {
  if (intent.currency !== "EUR" || sourceCurrency !== "USD") throw new Error("Mock providers only support USD → EUR");
  return providers.map((provider) => ({
    id: `quote_${randomUUID()}`,
    providerId: provider.id,
    providerName: provider.name,
    sourceCurrency,
    destinationCurrency: intent.currency,
    destinationAmount: intent.amount,
    sourceAmount: Number((intent.amount * provider.rate + provider.fee).toFixed(2)),
    fee: provider.fee,
    reliability: provider.reliability,
    etaMs: provider.etaMs,
    available: true
  }));
}
