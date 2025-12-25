import { LIFI_BASE_URL } from "@/src/lib/config/app";
import { LIFI_SUPPORTED_CHAIN_IDS } from "@/src/lib/config/chains";
import { fetchJson } from "@/src/lib/http/fetchJson";
import { LifiTokensResponseSchema, type LifiToken } from "@/src/lib/lifi/types";

type GetTokensParams = {
  chains?: number[];
};

export async function getLifiTokens(
  params: GetTokensParams = {}
): Promise<LifiToken[]> {
  const allowedChainSet = new Set(LIFI_SUPPORTED_CHAIN_IDS);
  const chains = params.chains?.filter((id) => allowedChainSet.has(id)) ?? [];
  if (params.chains && chains.length === 0) return [];

  const url = new URL("/v1/tokens", LIFI_BASE_URL);
  if (chains.length) {
    url.searchParams.set("chains", chains.join(","));
  }
  const json = await fetchJson<unknown>(url.toString(), {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  const parsed = LifiTokensResponseSchema.parse(json);
  const flattened: LifiToken[] = [];
  for (const chainIdStr of Object.keys(parsed.tokens)) {
    const list = parsed.tokens[chainIdStr];
    for (const t of list) flattened.push(t);
  }
  return flattened;
}
