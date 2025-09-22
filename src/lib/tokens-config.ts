export const SUPPORTED_TOKENS = [
  {
    symbol: "USDC",
    label: "USDC",
  },
  {
    symbol: "USDT", 
    label: "USDT",
  },
  {
    symbol: "ETH",
    label: "ETH",
  },
  {
    symbol: "DAI",
    label: "DAI", 
  },
  {
    symbol: "EURC",
    label: "EURC",
  },
] as const;

export type TokenSymbol = typeof SUPPORTED_TOKENS[number]["symbol"];