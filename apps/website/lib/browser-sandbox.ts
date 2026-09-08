// A browser-local demonstration, deliberately separate from the draft VAP wire format.
export type Scenario = 'normal' | 'provider-offline' | 'no-routes';
export type DemoPacket = {
  algorithm: 'Ed25519';
  payload: string;
  publicKey: string;
  signature: string;
};
export type DemoTransaction = {
  id: string;
  status: 'settled' | 'refunded' | 'disputed';
  amountEurMinor: number;
  paidUsdMinor: number;
  provider: string;
  packet: DemoPacket;
  events: { status: string; at: string }[];
};

const providers = [
  {
    id: 'bridge',
    name: 'Bridge Test Rail',
    rateMilli: 1087,
    feeMinor: 18,
    eta: '<1 sec',
  },
  {
    id: 'atlas',
    name: 'Atlas FX',
    rateMilli: 1091,
    feeMinor: 32,
    eta: '~1 sec',
  },
  {
    id: 'northstar',
    name: 'Northstar Demo',
    rateMilli: 1096,
    feeMinor: 52,
    eta: '~2 sec',
  },
];

export function parseAmount(value: string): number {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed))
    throw new Error('Enter a EUR amount with up to two decimal places.');
  const [whole, cents = ''] = trimmed.split('.');
  const minor = Number(whole) * 100 + Number(cents.padEnd(2, '0'));
  if (!Number.isSafeInteger(minor) || minor < 100 || minor > 50_000)
    throw new Error('Choose an amount from €1.00 to €500.00.');
  return minor;
}

export function getDemoQuotes(amountMinor: number, scenario: Scenario) {
  if (
    !Number.isInteger(amountMinor) ||
    amountMinor < 100 ||
    amountMinor > 50_000
  )
    throw new Error('Invalid amount.');
  if (!['normal', 'provider-offline', 'no-routes'].includes(scenario))
    throw new Error('Unknown scenario.');
  return providers
    .map((provider) => ({
      ...provider,
      totalMinor:
        Math.round((amountMinor * provider.rateMilli) / 1000) +
        provider.feeMinor,
      available:
        scenario !== 'no-routes' &&
        !(scenario === 'provider-offline' && provider.id === 'bridge'),
    }))
    .sort(
      (a, b) =>
        Number(b.available) - Number(a.available) ||
        a.totalMinor - b.totalMinor ||
        a.id.localeCompare(b.id),
    );
}

function encode(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}
function decode(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

export async function verifyDemoPacket(packet: DemoPacket): Promise<boolean> {
  try {
    if (packet.algorithm !== 'Ed25519') return false;
    const key = await crypto.subtle.importKey(
      'raw',
      decode(packet.publicKey),
      'Ed25519',
      false,
      ['verify'],
    );
    return await crypto.subtle.verify(
      'Ed25519',
      key,
      decode(packet.signature),
      new TextEncoder().encode(packet.payload),
    );
  } catch {
    return false;
  }
}

export class BrowserSandbox {
  #buyerUsdMinor = 100_000;
  #merchantEurMinor = 0;
  #identity: CryptoKeyPair | null = null;
  #transaction: DemoTransaction | null = null;
  #busy = false;

  get balances() {
    return {
      buyerUsdMinor: this.#buyerUsdMinor,
      merchantEurMinor: this.#merchantEurMinor,
    };
  }

  async pay(
    amount: string,
    scenario: Scenario = 'normal',
  ): Promise<DemoTransaction> {
    if (this.#busy) throw new Error('A test payment is already being created.');
    this.#busy = true;
    try {
      const amountEurMinor = parseAmount(amount);
      const selected = getDemoQuotes(amountEurMinor, scenario).find(
        (quote) => quote.available,
      );
      if (!selected)
        throw new Error(
          'No provider is available. Change the scenario to try again. Your balances are unchanged.',
        );
      if (selected.totalMinor > this.#buyerUsdMinor)
        throw new Error(
          'Insufficient test USD. Lower the amount or reset the sandbox.',
        );
      if (!crypto.subtle)
        throw new Error(
          'This browser cannot sign demo packets. Open the HTTPS site in a recent browser.',
        );
      if (!this.#identity) {
        try {
          this.#identity = (await crypto.subtle.generateKey('Ed25519', false, [
            'sign',
            'verify',
          ])) as CryptoKeyPair;
        } catch {
          throw new Error(
            'Ed25519 is unavailable in this browser. Try a recent browser; your balances are unchanged.',
          );
        }
      }
      const id = crypto.randomUUID();
      const at = new Date().toISOString();
      const payload = JSON.stringify({
        format: 'value-accord-browser-demo/1',
        testOnly: true,
        id,
        issuedAt: at,
        source: { amountMinor: selected.totalMinor, currency: 'USD' },
        destination: { amountMinor: amountEurMinor, currency: 'EUR' },
        provider: selected.name,
      });
      const packet: DemoPacket = {
        algorithm: 'Ed25519',
        payload,
        publicKey: encode(
          await crypto.subtle.exportKey('raw', this.#identity.publicKey),
        ),
        signature: encode(
          await crypto.subtle.sign(
            'Ed25519',
            this.#identity.privateKey,
            new TextEncoder().encode(payload),
          ),
        ),
      };
      if (!(await verifyDemoPacket(packet)))
        throw new Error(
          'Signature verification failed. Your balances are unchanged.',
        );
      // Commit the simulated balances only after all fallible signing work succeeds.
      this.#buyerUsdMinor -= selected.totalMinor;
      this.#merchantEurMinor += amountEurMinor;
      this.#transaction = {
        id,
        status: 'settled',
        amountEurMinor,
        paidUsdMinor: selected.totalMinor,
        provider: selected.name,
        packet,
        events: [{ status: 'settled', at }],
      };
      return structuredClone(this.#transaction);
    } finally {
      this.#busy = false;
    }
  }

  transition(id: string, status: 'refunded' | 'disputed'): DemoTransaction {
    if (this.#busy) throw new Error('Wait for the test payment to finish.');
    if (status !== 'refunded' && status !== 'disputed')
      throw new Error('Unknown transition.');
    const tx = this.#transaction;
    if (!tx || tx.id !== id || tx.status !== 'settled')
      throw new Error(
        'Only the latest settled test payment can be changed once.',
      );
    if (status === 'refunded') {
      this.#buyerUsdMinor += tx.paidUsdMinor;
      this.#merchantEurMinor -= tx.amountEurMinor;
    }
    tx.status = status;
    tx.events.push({ status, at: new Date().toISOString() });
    return structuredClone(tx);
  }
}
