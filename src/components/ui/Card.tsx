import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("glass rounded-[2.5rem] border border-white/10 bg-slate-900/40 shadow-2xl overflow-hidden", className)}>
      {children}
    </div>
  );
}
