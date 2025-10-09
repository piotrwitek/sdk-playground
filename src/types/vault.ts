import type { AddressValue, ChainId } from "@summer_fi/sdk-client";

export interface VaultInfo {
  id: AddressValue;
  name: string;
  token: string;
  assetToken: string;
  apy: string;
  rewardsApys: { symbol: string; apy?: string }[];
  merklRewards?: { symbol: string; dailyEmission: string }[];
  tvl: string;
  depositCap: string;
}

export type VaultsParams = {
  chainId: ChainId;
};
