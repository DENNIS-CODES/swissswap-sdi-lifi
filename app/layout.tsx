import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/src/components/providers/Providers";
import { Nav } from "@/src/components/shell/Nav";

export const metadata: Metadata = {
  title: "SwissSwap — SDI + LI.FI Token Picker",
  description: "Production-ready Next.js app with LI.FI token picker and Swisstronik SDI flow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[520px] h-[520px] rounded-full blur-[160px] bg-red-900/10" />
            <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full blur-[140px] bg-blue-900/5" />
          </div>
          <main className="relative z-10 pt-44 pb-24 px-6 max-w-7xl mx-auto">{children}</main>
          <footer className="relative z-10 max-w-7xl mx-auto px-6 pb-10 text-xs text-slate-600">
            SwissSwap demo app • LI.FI token data via /v1/tokens • SDI checks via Swisstronik SDK
          </footer>
        </Providers>
      </body>
    </html>
  );
}
