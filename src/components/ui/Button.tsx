"use client";

import { RefreshCw } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "tab";
  active?: boolean;
  loading?: boolean;
};

export function Button({ className, variant="primary", active, loading, disabled, children, ...rest }: Props) {
  const base =
    "px-6 py-3 rounded-full font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-500/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    outline: "border-2 border-red-500/30 text-red-200 hover:bg-red-500/10",
    tab: active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
  };
  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <RefreshCw className="animate-spin" size={18} /> : children}
    </button>
  );
}
