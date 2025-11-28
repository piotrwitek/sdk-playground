import type { VaultActivityResponse } from "@/types";

export interface PositionActivityParams {
  chainId: number;
  fleetAddress: string;
  userAddress: string;
  first?: number;
  skip?: number;
}

export async function fetchPositionActivity(
  params: PositionActivityParams
): Promise<VaultActivityResponse> {
  const res = await fetch("/api/positionActivity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch position activity: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<VaultActivityResponse>;
}
