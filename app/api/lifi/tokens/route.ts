import { NextResponse } from "next/server";
import { z } from "zod";
import { getCached, setCached } from "@/src/lib/cache/memory";
import { getLifiTokens } from "@/src/lib/lifi/getTokens";

const QuerySchema = z.object({
  chains: z.string().optional(),
  q: z.string().optional(),
  limit: z.string().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = QuerySchema.parse({
    chains: searchParams.get("chains") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  const chainIds = q.chains
    ? q.chains
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n))
    : undefined;

  const limit = q.limit ? Math.min(Math.max(Number(q.limit) || 250, 10), 5000) : 250;

  const cacheKey = `lifi:tokens:${(chainIds ?? []).join(",") || "all"}`;
  const cached = getCached<unknown>(cacheKey);
  const tokens = cached ? (cached as any) : await getLifiTokens({ chains: chainIds });

  if (!cached) setCached(cacheKey, tokens, 5 * 60 * 1000);

  const term = (q.q ?? "").trim().toLowerCase();
  let filtered = tokens as any[];
  if (term) {
    filtered = filtered.filter((t) => {
      const sym = String(t.symbol ?? "").toLowerCase();
      const name = String(t.name ?? "").toLowerCase();
      const addr = String(t.address ?? "").toLowerCase();
      return sym.includes(term) || name.includes(term) || addr.includes(term);
    });
  }

  filtered = filtered.slice(0, limit);

  return NextResponse.json(
    { tokens: filtered },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}
