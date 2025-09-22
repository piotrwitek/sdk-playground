import type { CrossChainParams } from "../types/cross-chain";
import type { TxData } from "../features/cross-chain-deposit/CrossChainDeposit";

export async function fetchCrossChainTx(
  params: CrossChainParams
): Promise<TxData> {
  const response = await fetch("/api/crossChainTx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to create transaction data");
  }

  return response.json();
}
