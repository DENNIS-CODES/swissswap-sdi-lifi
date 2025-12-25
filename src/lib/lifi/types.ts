import { z } from "zod";

export const LifiTokenSchema = z.object({
  address: z.string(),
  chainId: z.number(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  logoURI: z.string().optional().nullable(),
  priceUSD: z.string().optional().nullable(),
});

export type LifiToken = z.infer<typeof LifiTokenSchema>;

export const LifiTokensResponseSchema = z.object({
  tokens: z.record(z.array(LifiTokenSchema)),
});

export type LifiTokensResponse = z.infer<typeof LifiTokensResponseSchema>;
