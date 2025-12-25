import { Button } from "@/src/components/ui/Button";
import Link from "next/link";
import { Fingerprint, Globe, ArrowUpRight } from "lucide-react";
import { Card } from "@/src/components/ui/Card";

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-20 py-8">
      <div className="flex-1 space-y-9">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-300 border border-red-500/20">
          <Globe size={12} /> Global Compliance Standard
        </div>

        <h1 className="text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tighter">
          Trade with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Perfect Privacy.</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
          This project is a production-ready Next.js (TypeScript) app that ships:
          a LI.FI-backed token picker (no manual address pasting) and a real SDI compliance state reader for Swisstronik.
        </p>

        <div className="flex gap-4 pt-2 flex-wrap">
          <Link href="/swap">
            <Button className="px-10 py-4 text-lg">Launch Swap <ArrowUpRight size={18} /></Button>
          </Link>
          <Link href="/identity">
            <Button variant="secondary" className="px-10 py-4 text-lg">Open Identity Vault</Button>
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[520px] hidden lg:block">
        <div className="animate-pulse-slow p-2 bg-gradient-to-br from-red-500/20 to-transparent rounded-[3rem] border border-white/10">
          <Card className="p-12 space-y-6 rotate-2">
            <Fingerprint size={64} className="text-red-500" />
            <h3 className="text-3xl font-bold">ZK-SDI Shield</h3>
            <p className="text-slate-400">
              Verify via Swisstronik Digital Identity while keeping your data private. Token discovery uses LI.FI.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
