import type { DepositParams, Transaction } from "@/types";

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
