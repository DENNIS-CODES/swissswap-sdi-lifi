"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { useEffect, useState } from "react";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/swap", label: "Swap" },
  { href: "/pool", label: "Pool" },
  { href: "/identity", label: "Identity Vault" },
];

export function Nav() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.body.className = dark ? "" : "";
    document.body.style.backgroundColor = dark ? "#020203" : "#F8FAFC";
    document.body.style.color = dark ? "#F8FAFC" : "#0F172A";
  }, [dark]);

  return (
    <nav className={clsx("fixed w-full top-0 z-50 border-b h-24 flex items-center glass", dark ? "border-white/5 bg-black/40" : "border-slate-200 bg-white/70")}>
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-glow">
            <Shield size={28} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold tracking-tight">Swiss<span className="text-red-600">Swap</span></h1>
            <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase">Compliance Layer</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <Button key={t.href} variant="tab" active={active} as-child={undefined as any} className={clsx("px-5 py-2.5", active ? "active" : "")}>
                <Link href={t.href}>{t.label}</Link>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark((v) => !v)} className={clsx("p-3 rounded-2xl border transition-all", dark ? "bg-slate-800 border-white/10 text-yellow-300" : "bg-slate-100 border-slate-200 text-slate-600")}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
