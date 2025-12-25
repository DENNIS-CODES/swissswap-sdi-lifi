import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Plus } from "lucide-react";

export default function PoolPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-bold tracking-tight">Yield Liquidity</h2>
          <p className="text-slate-500 mt-3 text-lg">Pool UI shell (wire to your protocol). Identity gating can be enforced via the Identity Vault.</p>
        </div>
        <Button className="px-10"><Plus size={18}/> Create New Position</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { pair: "SWTR/USDT", apr: "18.5%", tvl: "$4.2M", volume: "$890k", chain: "Swisstronik" },
          { pair: "SWTR/ETH", apr: "12.2%", tvl: "$1.8M", volume: "$210k", chain: "Bridge" },
          { pair: "USDC/USDT", apr: "4.5%", tvl: "$15.2M", volume: "$2.5M", chain: "Stablecoin" },
        ].map((p) => (
          <Card key={p.pair} className="p-8 hover:border-red-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="text-[10px] font-bold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 uppercase tracking-widest">
                High Yield
              </div>
              <div className="text-xs text-slate-500 font-bold uppercase">{p.chain}</div>
            </div>
            <h3 className="text-2xl font-bold">{p.pair}</h3>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-6">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">APR</p>
                <p className="text-2xl font-bold text-green-400">{p.apr}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">TVL</p>
                <p className="text-2xl font-bold">{p.tvl}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Volume</p>
                <p className="text-lg font-bold">{p.volume}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Fees</p>
                <p className="text-lg font-bold">0.30%</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-8 text-sm">View / Add</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
