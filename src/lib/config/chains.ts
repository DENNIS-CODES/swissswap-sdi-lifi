export type ChainId = number;

export type SupportedChain = {
  id: ChainId;
  key: "swisstronik" | "ethereum" | "bsc" | "polygon";
  name: string;
  symbol: string;
  logo: string;
  color: string;
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    id: 1291,
    key: "swisstronik",
    name: "Swisstronik",
    symbol: "SWTR",
    logo: "https://raw.githubusercontent.com/Swisstronik/brand-assets/main/logo/Logo_Icon_Red.png",
    color: "#ef4444",
  },
  {
    id: 1,
    key: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "#627EEA",
  },
  {
    id: 56,
    key: "bsc",
    name: "BSC",
    symbol: "BNB",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    color: "#F3BA2F",
  },
  {
    id: 137,
    key: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    color: "#8247E5",
  },
];

export const CHAIN_BY_ID = new Map(SUPPORTED_CHAINS.map((c) => [c.id, c]));

// LI.FI /v1/tokens only supports these chains in this demo.
export const LIFI_SUPPORTED_CHAIN_IDS = [1, 56, 137];
