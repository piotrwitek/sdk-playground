import type { DepositParams } from "../types/deposit";
import type { Transaction } from "../types/transaction";

export async function fetchDepositTx(
  params: DepositParams
): Promise<Transaction[]> {
  const response = await fetch("/api/depositTx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to create deposit transactions");
  }

  return response.json();
}
