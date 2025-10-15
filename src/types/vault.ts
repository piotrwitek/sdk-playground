import type { AddressValue, ChainId } from "@summer_fi/sdk-client";

export interface VaultInfo {
  id: AddressValue;
  name: string;
  token: string;
  assetToken: string;
  assetTokenPriceUSD: string;
  apy: string;
  rewardsApys: { symbol: string; apy?: string }[];
  merklRewards?: { symbol: string; dailyEmission: string; apy?: string }[];
  tvl: string;
  depositCap: string;
}

export type VaultsParams = {
  chainId: ChainId;
};
