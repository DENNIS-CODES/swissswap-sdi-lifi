import { SWISSTRONIK_RPC } from "@/src/lib/config/app";
import { SwisstronikStargateClient } from "@swisstronik/sdk";

export type SdiState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "verified"; verificationTypes: string[]; issuers: string[] }
  | { status: "unverified" }
  | { status: "error"; message: string };

export async function querySdiStatus(address: string): Promise<SdiState> {
  try {
    const client = await SwisstronikStargateClient.connect(SWISSTRONIK_RPC);
    const details: any = await client.queryAddressDetails(address);
    const verifications = Array.isArray(details?.verifications) ? details.verifications : [];
    if (!verifications.length) return { status: "unverified" };
    const verificationTypes = verifications.map((v: any) => String(v?.verificationType ?? v?.type ?? "")).filter(Boolean);
    const issuers = verifications.map((v: any) => String(v?.issuerAddress ?? v?.issuer ?? "")).filter(Boolean);
    return { status: "verified", verificationTypes, issuers };
  } catch (e: any) {
    return { status: "error", message: e?.message ? String(e.message) : "SDI query failed" };
  }
}
