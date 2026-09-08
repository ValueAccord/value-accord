'use client';

import { useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Download,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  BrowserSandbox,
  getDemoQuotes,
  parseAmount,
  verifyDemoPacket,
} from '@/lib/browser-sandbox';
import type { DemoTransaction, Scenario } from '@/lib/browser-sandbox';

const money = (minor: number) => (minor / 100).toFixed(2);

export function SandboxDemo() {
  const session = useRef<BrowserSandbox | null>(null);
  const [amount, setAmount] = useState('42');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [transaction, setTransaction] = useState<DemoTransaction | null>(null);
  const [balances, setBalances] = useState({
    buyerUsdMinor: 100_000,
    merchantEurMinor: 0,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState('');
  let validation = '';
  let minor = 0;
  try {
    minor = parseAmount(amount);
  } catch (cause) {
    validation = (cause as Error).message;
  }
  const quotes = minor ? getDemoQuotes(minor, scenario) : [];
  const selected = quotes.find((quote) => quote.available);

  async function pay(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError('');
    setVerification('');
    setBusy(true);
    try {
      session.current ??= new BrowserSandbox();
      const tx = await session.current.pay(amount, scenario);
      setTransaction(tx);
      setBalances(session.current.balances);
      setVerification('Signature verified against this session’s public key.');
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function transition(status: 'refunded' | 'disputed') {
    if (!transaction || !session.current || busy) return;
    try {
      setTransaction(session.current.transition(transaction.id, status));
      setBalances(session.current.balances);
      setError('');
    } catch (cause) {
      setError((cause as Error).message);
    }
  }

  function reset() {
    if (busy) return;
    session.current = new BrowserSandbox();
    setTransaction(null);
    setBalances(session.current.balances);
    setError('');
    setVerification('');
  }

  function download() {
    if (!transaction) return;
    const report = {
      testOnly: true,
      note: 'Only packet.payload is signed. Status and events are local demo annotations, not signed settlement evidence. The session key is self-generated and does not establish participant identity.',
      ...transaction,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `value-accord-demo-${transaction.id}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function verify() {
    if (!transaction) return;
    setVerification('Checking signature…');
    setVerification(
      (await verifyDemoPacket(transaction.packet))
        ? 'Signature verified against this session’s public key.'
        : 'Signature verification failed.',
    );
  }

  return (
    <>
      <div className="balance-strip" aria-label="Virtual balances">
        <div>
          <span>Buyer · test USD</span>
          <strong>${money(balances.buyerUsdMinor)}</strong>
        </div>
        <div>
          <span>Merchant · test EUR</span>
          <strong>€{money(balances.merchantEurMinor)}</strong>
        </div>
        <Button className="secondary-button" disabled={busy} onClick={reset}>
          <RotateCcw size={16} /> Reset sandbox
        </Button>
      </div>
      <div className="demo-grid">
        <section className="panel demo-control">
          <div className="panel-head">
            <span>PAYMENT INTENT</span>
            <span className="live-dot">TEST MODE</span>
          </div>
          <form onSubmit={pay} noValidate>
            <label htmlFor="eur-amount">Merchant receives</label>
            <div className="amount-input">
              <Input
                id="eur-amount"
                aria-label="EUR amount"
                aria-describedby="amount-help"
                aria-invalid={!!validation}
                type="text"
                inputMode="decimal"
                value={amount}
                disabled={busy}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError('');
                }}
              />
              <strong>EUR</strong>
            </div>
            <p
              id="amount-help"
              className={validation ? 'field-error' : 'field-help'}
            >
              {validation || '€1–€500 · up to two decimal places'}
            </p>
            <label htmlFor="scenario">Provider scenario</label>
            <NativeSelect
              id="scenario"
              className="scenario-select"
              value={scenario}
              disabled={busy}
              onChange={(event) => {
                setScenario(event.target.value as Scenario);
                setError('');
              }}
            >
              <NativeSelectOption value="normal">
                All providers available
              </NativeSelectOption>
              <NativeSelectOption value="provider-offline">
                Cheapest provider offline
              </NativeSelectOption>
              <NativeSelectOption value="no-routes">
                All providers offline
              </NativeSelectOption>
            </NativeSelect>
            <div className="conversion">
              <span>Buyer pays</span>
              <strong>
                {selected ? `$${money(selected.totalMinor)} USD` : 'No route'}
              </strong>
            </div>
            <Button
              type="submit"
              className="button wide"
              disabled={busy || !!validation || !selected}
            >
              {busy ? 'Signing test payment…' : 'Create test payment'}
              <ArrowRight size={17} />
            </Button>
            <p className="micro">
              Synthetic rates. Everything stays in this tab. Resetting or
              reloading clears this session.
            </p>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
          </form>
        </section>
        <section className="panel">
          <div className="panel-head">
            <span>COMPETITIVE ROUTES</span>
            <span>
              {quotes.filter((quote) => quote.available).length} available
            </span>
          </div>
          <div className="quotes">
            {quotes.map((quote) => (
              <div
                className={`quote ${selected?.id === quote.id ? 'chosen' : ''} ${!quote.available ? 'unavailable' : ''}`}
                key={quote.id}
              >
                <div>
                  <strong>{quote.name}</strong>
                  <small>
                    {quote.available
                      ? `${quote.eta} · $${money(quote.feeMinor)} fee`
                      : 'Unavailable in this scenario'}
                  </small>
                </div>
                <b>${money(quote.totalMinor)}</b>
                {selected?.id === quote.id && <span>BEST</span>}
              </div>
            ))}
          </div>
          {!selected && (
            <output className="outcome warn">
              {validation
                ? 'Enter a valid amount to compare routes.'
                : 'No available route. Balances stay unchanged; choose another scenario.'}
            </output>
          )}
          <p className="field-help">
            The lowest available total wins. The fee is already included.
          </p>
        </section>
        <section className="panel receipt" aria-label="Latest test receipt">
          <div className="panel-head">
            <span>LATEST TEST RECEIPT</span>
            <span className={`status ${transaction?.status ?? 'ready'}`}>
              {transaction?.status ?? 'ready'}
            </span>
          </div>
          {!transaction ? (
            <div className="empty-receipt">
              <ShieldAlert />
              <h3>Ready to route</h3>
              <p>
                Create a test payment to sign a demo packet, verify its
                signature, and update virtual balances.
              </p>
            </div>
          ) : (
            <>
              <div className="receipt-mark">
                <Check />
                <div>
                  <small>
                    {transaction.status === 'refunded'
                      ? 'REFUNDED · TEST EUR'
                      : 'ORIGINAL TEST SETTLEMENT'}
                  </small>
                  <strong>€{money(transaction.amountEurMinor)} EUR</strong>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Receipt</dt>
                  <dd title={transaction.id}>{transaction.id.slice(0, 8)}</dd>
                </div>
                <div>
                  <dt>Route</dt>
                  <dd>{transaction.provider}</dd>
                </div>
                <div>
                  <dt>Original buyer debit</dt>
                  <dd>${money(transaction.paidUsdMinor)} USD</dd>
                </div>
                <div>
                  <dt>Packet signature</dt>
                  <dd>Ed25519</dd>
                </div>
              </dl>
              <output className="verification">{verification}</output>
              <div className="receipt-actions">
                <Button disabled={busy} onClick={verify}>
                  Verify again
                </Button>
                <Button disabled={busy} onClick={download}>
                  <Download size={14} /> Download JSON
                </Button>
              </div>
              {transaction.status === 'settled' && (
                <div className="receipt-actions">
                  <Button
                    disabled={busy}
                    onClick={() => transition('refunded')}
                  >
                    <RotateCcw size={14} /> Test refund
                  </Button>
                  <Button
                    disabled={busy}
                    onClick={() => transition('disputed')}
                  >
                    <ShieldAlert size={14} /> Open test dispute
                  </Button>
                </div>
              )}
              {transaction.status === 'refunded' && (
                <p className="outcome">
                  Both virtual balances reversed by the original amounts. The
                  receipt is retained.
                </p>
              )}
              {transaction.status === 'disputed' && (
                <p className="outcome warn">
                  Test dispute opened. Balances are unchanged.
                </p>
              )}
              <ol className="receipt-events" aria-label="Receipt history">
                {transaction.events.map((event) => (
                  <li key={event.status}>
                    {event.status} ·{' '}
                    <time dateTime={event.at}>
                      {new Date(event.at).toISOString().slice(11, 19)} UTC
                    </time>
                  </li>
                ))}
              </ol>
              <p className="field-help">
                The signature proves this demo payload is unchanged. The
                temporary key does not identify a real provider. Refund and
                dispute events are unsigned local annotations.
              </p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
