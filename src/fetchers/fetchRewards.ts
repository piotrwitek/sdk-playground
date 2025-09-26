import type { AggregatedRewards } from "@/types";

export default async function fetchRewards(
  chainId: number,
  address: string
): Promise<AggregatedRewards> {
  if (!address) throw new Error("Address is required");
  if (!chainId) throw new Error("chainId is required");

  const resp = await fetch(
    `/api/rewards?address=${address}&chainId=${chainId}`
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch rewards: ${resp.statusText}`);
  }

  const json = await resp.json();

  if (json.error) throw new Error(json.error);

  return json;
}
