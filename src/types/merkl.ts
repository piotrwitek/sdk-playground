import type { ChainId, MerklReward } from "@summer_fi/sdk-client";

export type MerklParams = {
  chainId: ChainId;
};

/**
 * Response type for the Merkl rewards API
 */
export interface MerklRewardsResponse {
  perChain: Partial<Record<ChainId, MerklReward[]>>;
}
