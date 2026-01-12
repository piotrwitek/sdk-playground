import type { AggregatedRewards, EnvironmentType } from "@/types";

export default async function fetchRewards(
  chainId: number,
  address: string,
  environment: EnvironmentType
): Promise<AggregatedRewards> {
  if (!address) throw new Error("Address is required");
  if (!chainId) throw new Error("chainId is required");

  const resp = await fetch(
    `/api/rewards?address=${address}&chainId=${chainId}&environment=${environment}`
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch rewards: ${await resp.text()}`);
  }

  const json = await resp.json();

  if (json.error) throw new Error(json.error);

  return json;
}
