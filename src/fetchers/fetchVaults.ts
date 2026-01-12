import type { ChainId } from "@summer_fi/sdk-client";
import type { VaultInfo, EnvironmentType } from "@/types";

export async function fetchVaults(
  chainId: ChainId,
  environment: EnvironmentType
): Promise<VaultInfo[]> {
  const response = await fetch("/api/vaults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chainId, environment }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vaults: ${await response.text()}`);
  }

  return response.json();
}
