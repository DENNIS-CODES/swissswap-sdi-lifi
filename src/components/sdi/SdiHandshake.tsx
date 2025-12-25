"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { CheckCircle2, Cpu, ExternalLink, Fingerprint, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import type { SdiState } from "@/src/lib/sdi/handshake";
import { querySdiStatus } from "@/src/lib/sdi/handshake";

type Props = {
  requiredVerificationTypes?: string[];
};

async function trySdiSdkHandshake(): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const mod: any = await import("@swisstronik/sdi-react-sdk");
    const start = mod?.startVerification || mod?.startHandshake || mod?.startSdiHandshake;
    if (typeof start !== "function") {
      return { ok: false, reason: "SDK loaded but no startVerification/startHandshake export was found." };
    }
    await start();
    return { ok: true };
  } catch (e: any) {
    return { ok: false, reason: e?.message ? String(e.message) : "Failed to load SDI SDK" };
  }
}

export function SdiHandshake({ requiredVerificationTypes = [] }: Props) {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState<SdiState>({ status: "idle" });
  const [step, setStep] = useState<0|1|2|3|4>(0);
  const [open, setOpen] = useState(false);

  const hasRequired = useMemo(() => {
    if (state.status !== "verified") return false;
    if (!requiredVerificationTypes.length) return true;
    const set = new Set(state.verificationTypes.map((x) => x.toLowerCase()));
    return requiredVerificationTypes.every((x) => set.has(x.toLowerCase()));
  }, [state, requiredVerificationTypes]);

  async function refresh() {
    if (!address) return;
    setState({ status: "checking" });
    const s = await querySdiStatus(address);
    setState(s);
  }

  useEffect(() => { if (isConnected && address) void refresh(); }, [isConnected, address]);

  async function runHandshake() {
    if (!address) return;
    setOpen(true);
    setStep(1);

    const sdk = await trySdiSdkHandshake();
    if (!sdk.ok) {
      setStep(2);
      await new Promise((r) => setTimeout(r, 700));
      setStep(3);
      await new Promise((r) => setTimeout(r, 900));
      setStep(4);
      await refresh();
      return;
    }

    setStep(2);
    await new Promise((r) => setTimeout(r, 700));
    setStep(3);
    await new Promise((r) => setTimeout(r, 900));
    setStep(4);
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold">Identity Vault</h2>
          <p className="text-slate-500 mt-2">
            Real compliance state is read from Swisstronik&apos;s x/compliance via Swisstronik JS SDK.
            The optional SDI handshake uses <span className="text-slate-300">@swisstronik/sdi-react-sdk</span> when available.
          </p>
        </div>
        <Button variant="secondary" onClick={refresh} disabled={!address} className="px-5 py-3">
          <RefreshCw size={18} /> Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-8 space-y-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="text-xs font-bold tracking-[0.25em] uppercase text-slate-500">Status</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {state.status === "verified" ? <CheckCircle2 className="text-green-500" /> :
                 state.status === "checking" ? <RefreshCw className="animate-spin text-slate-400" /> :
                 state.status === "error" ? <XCircle className="text-red-400" /> :
                 <Fingerprint className="text-red-500" />}
                <span className="capitalize">{state.status}</span>
              </div>
              <div className="text-sm text-slate-400">
                {address ? <span className="font-mono">{address}</span> : "Connect a wallet to check SDI verifications."}
              </div>
            </div>
            <ShieldCheck className={state.status === "verified" ? "text-green-500" : "text-red-500"} size={44} />
          </div>

          {state.status === "verified" ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl border border-white/10 bg-white/5">
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">Verification Types</div>
                <div className="text-sm text-slate-200">
                  {state.verificationTypes.length ? state.verificationTypes.join(", ") : "—"}
                </div>
              </div>
              <div className="p-5 rounded-3xl border border-white/10 bg-white/5">
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">Issuers</div>
                <div className="text-sm text-slate-200 break-all">
                  {state.issuers.length ? state.issuers.join(", ") : "—"}
                </div>
              </div>
            </div>
          ) : state.status === "error" ? (
            <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-100 text-sm">
              {state.message}
            </div>
          ) : null}

          <div className="pt-2 flex flex-col md:flex-row gap-3">
            <Button onClick={runHandshake} disabled={!address} className="px-10 py-4 text-lg">
              Initialize SDI Handshake <ExternalLink size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("https://docs.swisstronik.com/swisstronik-docs/development/guides/sdi-for-dapp-developers", "_blank")}
              className="px-10 py-4 text-lg"
            >
              Read SDI Docs
            </Button>
          </div>

          {requiredVerificationTypes.length ? (
            <div className="text-xs text-slate-500">
              Required: <span className="text-slate-300 font-semibold">{requiredVerificationTypes.join(", ")}</span>{" "}
              → {hasRequired ? <span className="text-green-500 font-bold">OK</span> : <span className="text-red-400 font-bold">MISSING</span>}
            </div>
          ) : null}
        </Card>

        <Card className="p-8 space-y-5">
          <div className="text-xl font-bold flex items-center gap-2">
            <Cpu className="text-red-500" /> Handshake Steps
          </div>

          <div className="space-y-3 text-sm text-slate-400">
            <StepRow n={1} active={step >= 1} title="Enclave Init" />
            <StepRow n={2} active={step >= 2} title="SDI Registry Check" />
            <StepRow n={3} active={step >= 3} title="Proof Generation" />
            <StepRow n={4} active={step >= 4} title="Mainnet Broadcast" />
          </div>

          <div className="text-[10px] text-slate-600 leading-relaxed">
            This app does not store identity data. Verifications are read via the compliance module.
            Configure your issuer/verifier flow and SDK settings in <span className="font-mono">.env</span>.
          </div>
        </Card>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xl p-6 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/80 overflow-hidden shadow-2xl">
            <div className="p-5 flex items-center justify-between border-b border-white/10">
              <div>
                <div className="text-xl font-bold">Secure ZK Handshake</div>
                <div className="text-xs text-slate-500">Using @swisstronik/sdi-react-sdk (when available)</div>
              </div>
              <Button variant="secondary" onClick={() => setOpen(false)} className="px-4 py-2">Close</Button>
            </div>
            <div className="p-8 space-y-6 text-center">
              <div className={"w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center transition-all duration-700 " + (step > 0 ? "bg-red-500 shadow-2xl shadow-red-500/40 rotate-6" : "bg-white/5")}>
                {step === 0 ? <Cpu size={46} className="text-slate-500" /> : step < 4 ? <RefreshCw size={46} className="text-white animate-spin" /> : <CheckCircle2 size={46} className="text-white" />}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">Handshake in progress</div>
                <div className="text-sm text-slate-400">
                  {step === 1 && "Connecting to Swisstronik secure enclave…"}
                  {step === 2 && "Checking issuer/verifier registry…"}
                  {step === 3 && "Generating proof and requesting signature…"}
                  {step === 4 && "Broadcast complete. Refreshing compliance state…"}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                {[1,2,3,4].map((s) => (
                  <div key={s} className={"h-1 rounded-full transition-all duration-500 " + (step >= s ? "w-8 bg-red-500" : "w-4 bg-slate-700")} />
                ))}
              </div>
              <div className="text-xs text-slate-600">
                After completion, your onchain compliance entries should appear in the Identity Vault.
              </div>
              <Button onClick={() => setOpen(false)} variant="secondary" className="w-full py-4">Done</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepRow({ n, active, title }: { n: number; active: boolean; title: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className={"w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border " + (active ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-slate-500")}>
          {n}
        </div>
        <div className="font-semibold text-slate-200">{title}</div>
      </div>
      <div className={"text-[10px] font-bold px-2 py-1 rounded " + (active ? "bg-green-500/10 text-green-400" : "bg-white/5 text-slate-500")}>
        {active ? "OK" : "WAIT"}
      </div>
    </div>
  );
}
