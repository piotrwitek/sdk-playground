import type { MerklRewardsResponse } from "../types/merkl";

export const fetchMerklRewards = async (
  chainId: number,
  address: string
): Promise<MerklRewardsResponse> => {
  if (!address) {
    throw new Error("Address is required");
  }

  const response = await fetch(
    `/api/merklRewards?chainId=${chainId}&address=${address}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Merkl rewards: ${response.statusText}`);
  }

  return response.json();
};
