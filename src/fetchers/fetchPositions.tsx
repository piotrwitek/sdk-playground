import type { Position } from "../pages/api/positions";

export async function fetchPositions(chainId: number, address: string) {
  const res = await fetch("/api/positions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chainId, address }),
  });
  if (!res.ok) throw new Error(`Failed to fetch positions: ${res.statusText}`);
  return res.json() as Promise<Position[]>;
}
