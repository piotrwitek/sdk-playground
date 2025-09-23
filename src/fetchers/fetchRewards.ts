import type { AggregatedRewards } from "@/types";

export default async function fetchRewards(
  address: string
): Promise<AggregatedRewards> {
  if (!address) throw new Error("Address is required");

  const resp = await fetch(`/api/rewards?address=${address}`);

  if (!resp.ok) {
    throw new Error(`Failed to fetch rewards: ${resp.statusText}`);
  }

  const json = await resp.json();

  if (json.error) throw new Error(json.error);

  return {
    total: BigInt(json.total),
    vaultUsagePerChain: Object.fromEntries(
      Object.entries(json.vaultUsagePerChain).map(([k, v]) => [
        Number(k),
        BigInt(String(v)),
      ])
    ),
    vaultUsage: BigInt(json.vaultUsage),
    merkleDistribution: BigInt(json.merkleDistribution),
    voteDelegation: BigInt(json.voteDelegation),
  };
}
