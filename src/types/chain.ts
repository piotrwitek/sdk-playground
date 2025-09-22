// Local type definitions to avoid importing server-side SDK in client code
export type ChainId = number;
export type AddressValue = string;

export const ChainIds: Record<string, ChainId> = {
  Mainnet: 1,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
};
