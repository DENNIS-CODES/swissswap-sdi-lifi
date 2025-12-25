import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { mainnet, bsc, polygon } from "wagmi/chains";

const swisstronik = {
  id: 1291,
  name: "Swisstronik",
  network: "swisstronik",
  nativeCurrency: { name: "SWTR", symbol: "SWTR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://json-rpc.testnet.swisstronik.com"] },
    public: { http: ["https://json-rpc.testnet.swisstronik.com"] },
  },
  blockExplorers: {
    default: { name: "Swisstronik Explorer", url: "https://explorer.testnet.swisstronik.com" },
  },
} as const;

export const wagmiConfig = getDefaultConfig({
  appName: "SwissSwap",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "00000000000000000000000000000000",
  chains: [swisstronik as any, mainnet, bsc, polygon],
  transports: {
    [swisstronik.id]: http(swisstronik.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});

export const SWISSTRONIK_CHAIN_ID = swisstronik.id;
