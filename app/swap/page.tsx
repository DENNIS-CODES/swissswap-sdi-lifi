"use client";

import { useMemo, useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { TokenPicker } from "@/src/components/token/TokenPicker";
import type { LifiToken } from "@/src/lib/lifi/types";
import { SUPPORTED_CHAINS } from "@/src/lib/config/chains";
import { ArrowDown } from "lucide-react";

function calcOut(amountIn: string, from: LifiToken | null, to: LifiToken | null) {
  const n = Number(amountIn);
  if (!Number.isFinite(n) || n <= 0) return "";
  const fromPrice = from?.priceUSD ? Number(from.priceUSD) : NaN;
  const toPrice = to?.priceUSD ? Number(to.priceUSD) : NaN;
  if (!Number.isFinite(fromPrice) || !Number.isFinite(toPrice) || toPrice === 0) return "";
  const out = (n * fromPrice) / toPrice;
  return out.toFixed(6);
}

export default function SwapPage() {
  const chainIds = useMemo(() => SUPPORTED_CHAINS.map((c) => c.id), []);
  const [fromToken, setFromToken] = useState<LifiToken | null>(null);
  const [toToken, setToToken] = useState<LifiToken | null>(null);
  const [amountIn, setAmountIn] = useState("");
  const amountOut = useMemo(() => calcOut(amountIn, fromToken, toToken), [amountIn, fromToken, toToken]);

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <Card className="p-1">
        <div className="p-8 space-y-6 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Swap Assets</h2>
            <div className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              Token picker = LI.FI /v1/tokens
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-3">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Amount In</span>
              <span>Auto-Quote</span>
            </div>
            <input
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              type="number"
              placeholder="0.0"
              className="bg-transparent text-4xl font-bold outline-none w-full placeholder:text-slate-700"
            />
          </div>

          <TokenPicker label="From Token" chains={chainIds} value={fromToken} onChange={setFromToken} />

          <div className="flex justify-center">
            <button
              onClick={() => { setFromToken(toToken); setToToken(fromToken); }}
              className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-xl"
              type="button"
            >
              <ArrowDown size={18} className="text-red-300" />
            </button>
          </div>

          <TokenPicker label="To Token" chains={chainIds} value={toToken} onChange={setToToken} />

          <div className="p-5 rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Out</span>
              <span className="font-bold">{amountOut || "—"}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Uses LI.FI token prices when available. Wire this into real routing/execution with LI.FI SDK in your next step.
            </div>
          </div>

          <Button
            className="w-full py-5 text-lg"
            disabled={!amountIn || !fromToken || !toToken}
            onClick={() => {
              alert("Swap execution is not wired in this scaffold. Token picking and SDI flows are production-ready; integrate LI.FI routing + execution next.");
            }}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
