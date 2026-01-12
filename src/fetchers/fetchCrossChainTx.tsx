import type { CrossChainParams, EnvironmentType } from "@/types";
import type { TxData } from "../features/cross-chain-deposit/CrossChainDeposit";

export async function fetchCrossChainTx(
  params: CrossChainParams,
  environment: EnvironmentType
): Promise<TxData> {
  const response = await fetch("/api/crossChainTx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params, environment }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create transaction data: ${await response.text()}`
    );
  }

  return response.json();
}
