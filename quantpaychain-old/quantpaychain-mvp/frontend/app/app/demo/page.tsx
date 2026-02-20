
"use client";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";

function randomAddress() {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return "0x" + Array.from({ length: 40 }, hex).join("");
}

export default function DemoPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ledger, setLedger] = useState<any[]>([]);

  async function createWallet() {
    const addr = randomAddress();
    setAddress(addr);
    await fetch("/api/demo/event", { 
      method: "POST", 
      body: JSON.stringify({ event: "wallet_created", payload: { address: addr } }) 
    });
  }

  async function sendSimulatedTx() {
    setLoading(true);
    await fetch("/api/demo/event", { 
      method: "POST", 
      body: JSON.stringify({ event: "tx_initiated", payload: {} }) 
    });
    const res = await fetch("/api/demo/simulate-tx", { 
      method: "POST", 
      headers: { "content-type": "application/json" }, 
      body: JSON.stringify({ from: address }) 
    });
    const data = await res.json();
    setTxHash(data.txHash);
    setLedger(prev => [
      { 
        txHash: data.txHash, 
        amount: process.env.NEXT_PUBLIC_DEMO_AMOUNT || "0.05", 
        status: data.status, 
        ts: data.timestamp 
      }, 
      ...prev
    ]);
    await fetch("/api/demo/event", { 
      method: "POST", 
      body: JSON.stringify({ event: "tx_simulated", payload: data }) 
    });
    setLoading(false);
    await fetch("/api/demo/event", { 
      method: "POST", 
      body: JSON.stringify({ event: "demo_completed", payload: {} }) 
    });
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Prueba interactiva — demo simulada</h1>
      <p className="mt-2 text-sm">Esta demostración es una simulación. No requiere claves ni fondos reales.</p>

      <section className="mt-6">
        <h2>1. Generar wallet efímera</h2>
        <Button onClick={createWallet}>Generar wallet</Button>
        {address && <div className="mt-2 p-2 border rounded">{address}</div>}
      </section>

      <section className="mt-6">
        <h2>2. Enviar pago simulado</h2>
        <Button onClick={sendSimulatedTx} disabled={!address || loading}>
          {loading ? "Enviando..." : `Enviar ${process.env.NEXT_PUBLIC_DEMO_AMOUNT || "0.05"} QPC (simulado)`}
        </Button>
      </section>

      <section className="mt-6">
        <h2>3. Confirmación</h2>
        {txHash && <div className="p-2 border rounded"><div>Hash: {txHash}</div></div>}
        <div className="mt-4">
          <h3>Mini-ledger</h3>
          <ul>
            {ledger.map((l, i) => (
              <li key={i} className="text-sm">
                {l.ts} — {l.amount} QPC — {l.status} — {l.txHash}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
