# SwissSwap (Next.js + TypeScript) — LI.FI Token Picker + Swisstronik SDI

This project ships a **production-ready** Next.js App Router setup that includes:

- **Token picker UI backed by LI.FI** `/v1/tokens` (no hardcoded lists / no address-pasting required).
- **Swisstronik SDI “handshake” UX** + **real compliance-state reading** from `x/compliance` via `@swisstronik/sdk`.

## Why two SDI layers?

- **Compliance truth** (what matters for gating): read from Swisstronik compliance module using `SwisstronikStargateClient.queryAddressDetails`.
- **Handshake UX** (issuer/verifier flows): attempts to use `@swisstronik/sdi-react-sdk` if your build includes the correct exports for your issuer/verifier configuration.

Because SDK exports can change between versions, the handshake wrapper is defensive and will still finish the flow by refreshing onchain compliance state.

## Quick start

```bash
cp .env.example .env
npm i
npm run dev
```

Open http://localhost:3000

## Env vars

- `NEXT_PUBLIC_LIFI_BASE_URL` (default: https://li.quest)
- `NEXT_PUBLIC_SWISSTRONIK_RPC` (default: https://rpc.testnet.swisstronik.com)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (recommended; RainbowKit)

## Token Picker

The picker calls:

- `/api/lifi/tokens` → proxies `GET {LIFI_BASE_URL}/v1/tokens` and caches results in-memory for 5 minutes.

## Production notes

- Replace the placeholder WalletConnect project id.
- For SDI issuer/verifier flows, configure your issuer/verifier settings in `.env` per Swisstronik’s SDK docs and update `SdiHandshake.trySdiSdkHandshake()` if you want to call a specific exported function/component.
