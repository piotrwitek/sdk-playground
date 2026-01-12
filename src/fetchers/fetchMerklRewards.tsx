import type { MerklRewardsResponse, EnvironmentType } from "@/types";

export const fetchMerklRewards = async (
  chainId: number,
  address: string,
  environment: EnvironmentType
): Promise<MerklRewardsResponse> => {
  if (!address) {
    throw new Error("Address is required");
  }

  const response = await fetch(
    `/api/merklRewards?chainId=${chainId}&address=${address}&environment=${environment}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Merkl rewards: ${await response.text()}`);
  }

  return response.json();
};
