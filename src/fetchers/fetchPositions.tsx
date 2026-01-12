import type { Position } from "../pages/api/positions";
import type { EnvironmentType } from "@/types";

export async function fetchPositions(
  chainId: number,
  address: string,
  environment: EnvironmentType
) {
  const res = await fetch("/api/positions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chainId, address, environment }),
  });

  if (!res.ok)
    throw new Error(`Failed to fetch positions: ${await res.text()}`);
  return res.json() as Promise<Position[]>;
}
