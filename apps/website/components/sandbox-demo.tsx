"use client";
import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw, ShieldAlert } from "lucide-react";

type Status = "ready" | "settled" | "refunded" | "disputed";
const providers = [{name:"Atlas FX",rate:1.091,fee:.32,eta:"~1 sec"},{name:"Bridge Test Rail",rate:1.087,fee:.18,eta:"<1 sec"},{name:"Northstar Demo",rate:1.096,fee:.52,eta:"~2 sec"}];

export function SandboxDemo() {
  const [eur, setEur] = useState(42);
  const [status, setStatus] = useState<Status>("ready");
  const [run, setRun] = useState(0);
  const quotes = useMemo(() => providers.map((p) => ({...p,total:Number((eur*p.rate+p.fee).toFixed(2))})).sort((a,b)=>a.total-b.total), [eur]);
  const selected = quotes[0];
  const id = `VP-${String(92841 + run).padStart(6,"0")}`;
  const start = () => { setRun((v)=>v+1); setStatus("settled"); };
  return <div className="demo-grid">
    <section className="panel demo-control"><div className="panel-head"><span>PAYMENT INTENT</span><span className="live-dot">TEST MODE</span></div><label htmlFor="eur-amount">Merchant receives</label><div className="amount-input"><input id="eur-amount" aria-label="EUR amount" type="number" min="1" max="500" value={eur} onChange={(e)=>{setEur(Math.max(1,Number(e.target.value)));setStatus("ready")}}/><strong>EUR</strong></div><div className="conversion"><span>Buyer pays</span><strong>${selected.total.toFixed(2)} USD</strong></div><button className="button wide" onClick={start}>Create test payment <ArrowRight size={17}/></button><p className="micro">Virtual balances only. No card or bank details are collected.</p></section>
    <section className="panel"><div className="panel-head"><span>COMPETITIVE ROUTES</span><span>{quotes.length} quotes</span></div><div className="quotes">{quotes.map((q,i)=><div className={`quote ${i===0?"chosen":""}`} key={q.name}><div><strong>{q.name}</strong><small>{q.eta} · ${q.fee.toFixed(2)} fee</small></div><b>${q.total.toFixed(2)}</b>{i===0&&<span>BEST</span>}</div>)}</div></section>
    <section className="panel receipt"><div className="panel-head"><span>VALUE PACKET + RECEIPT</span><span className={`status ${status}`}>{status}</span></div>{status==="ready"?<div className="empty-receipt"><ShieldAlert/><h3>Ready to route</h3><p>Create a test payment to sign a single-use packet and produce a settlement receipt.</p></div>:<><div className="receipt-mark"><Check/><div><small>MERCHANT RECEIVED</small><strong>€{eur.toFixed(2)} EUR</strong></div></div><dl><div><dt>Packet</dt><dd>{id}</dd></div><div><dt>Route</dt><dd>{selected.name}</dd></div><div><dt>Buyer paid</dt><dd>${selected.total.toFixed(2)} USD</dd></div><div><dt>Signature</dt><dd>ed25519 · verified</dd></div></dl>{status==="settled"&&<div className="receipt-actions"><button onClick={()=>setStatus("refunded")}><RotateCcw size={14}/> Test refund</button><button onClick={()=>setStatus("disputed")}><ShieldAlert size={14}/> Open test dispute</button></div>}{status==="refunded"&&<p className="outcome">Test balances reversed. Receipt retained.</p>}{status==="disputed"&&<p className="outcome warn">Test dispute opened. No funds moved.</p>}</>}</section>
  </div>;
}
