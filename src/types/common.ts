import type { ChainId as _ChainId } from "@summer_fi/sdk-client";

// Local type definitions to avoid importing server-side SDK in client code
export type ChainId = _ChainId;
export type AddressValue = `0x${string}`;

export const ChainIds: Record<string, ChainId> = {
  Mainnet: 1,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
  HyperEvm: 999,
};
