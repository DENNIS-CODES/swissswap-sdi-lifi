"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown } from "lucide-react";
import { SUPPORTED_CHAINS, CHAIN_BY_ID } from "@/src/lib/config/chains";
import type { LifiToken } from "@/src/lib/lifi/types";
import { Button } from "@/src/components/ui/Button";
import clsx from "clsx";

type Props = {
  label: string;
  chains: number[];
  value: LifiToken | null;
  onChange: (token: LifiToken) => void;
};

function fmtAddress(a: string) {
  if (!a) return "";
  if (a === "0x0000000000000000000000000000000000000000") return "Native";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function TokenPicker({ label, chains, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["lifiTokens", chains.join(","), term],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("chains", chains.join(","));
      if (term.trim()) params.set("q", term.trim());
      params.set("limit", "500");
      const res = await fetch(`/api/lifi/tokens?${params.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { tokens: LifiToken[] };
      return json.tokens;
    },
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });

  const selectedChain = value ? CHAIN_BY_ID.get(value.chainId) : null;

  const chainsLabel = useMemo(() => {
    const names = SUPPORTED_CHAINS.filter((c) => chains.includes(c.id)).map((c) => c.name);
    return names.length ? names.join(", ") : "All chains";
  }, [chains]);

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">{label}</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">{chainsLabel}</p>
      </div>

      <button
        className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
        onClick={() => setOpen(true)}
        type="button"
      >
        <div className="flex items-center gap-3 min-w-0">
          {value?.logoURI ? (
            <Image src={value.logoURI} alt={value.symbol} width={28} height={28} className="rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10" />
          )}
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold">{value?.symbol ?? "Select token"}</span>
              {selectedChain ? (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  {selectedChain.name}
                </span>
              ) : null}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {value ? `${value.name} · ${fmtAddress(value.address)}` : "Search 10k+ tokens via LI.FI"}
            </div>
          </div>
        </div>
        <ChevronDown className="text-slate-400" size={18} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl p-6 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/80 overflow-hidden shadow-2xl">
            <div className="p-5 flex items-center justify-between border-b border-white/10">
              <div>
                <div className="text-xl font-bold">Choose a token</div>
                <div className="text-xs text-slate-500">Powered by LI.FI /v1/tokens</div>
              </div>
              <Button variant="secondary" onClick={() => setOpen(false)} className="px-4 py-2">Close</Button>
            </div>

            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5">
                <Search size={18} className="text-slate-400" />
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search symbol, name, or address…"
                  className="bg-transparent outline-none w-full text-sm placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="max-h-[520px] overflow-auto">
              {error ? (
                <div className="p-6 text-sm text-red-300">
                  Failed to load tokens. {String((error as Error).message || error)}
                </div>
              ) : isLoading ? (
                <div className="p-6 text-sm text-slate-400">Loading tokens…</div>
              ) : !data?.length ? (
                <div className="p-6 text-sm text-slate-400">No matches.</div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {data.map((t) => {
                    const chain = CHAIN_BY_ID.get(t.chainId);
                    const selected = value?.address === t.address && value?.chainId === t.chainId;
                    return (
                      <li key={`${t.chainId}:${t.address}`} className={clsx("px-5 py-4 hover:bg-white/5 cursor-pointer", selected && "bg-white/5")}
                          onClick={() => { onChange(t); setOpen(false); setTerm(""); }}>
                        <div className="flex items-center gap-3">
                          {t.logoURI ? (
                            <Image src={t.logoURI} alt={t.symbol} width={28} height={28} className="rounded-full" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-white/10" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{t.symbol}</span>
                              {chain ? (
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                                  {chain.name}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                                  Chain {t.chainId}
                                </span>
                              )}
                              {t.priceUSD ? (
                                <span className="text-xs text-slate-500">${Number(t.priceUSD).toLocaleString()}</span>
                              ) : null}
                            </div>
                            <div className="text-xs text-slate-400 truncate">{t.name} · {fmtAddress(t.address)}</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="p-4 border-t border-white/10 text-[10px] text-slate-600">
              Tip: You can paste an address, but you don&apos;t have to — search by symbol/name across supported chains.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
