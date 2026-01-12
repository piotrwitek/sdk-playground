import type { DepositParams, Transaction, EnvironmentType } from "@/types";

export async function fetchDepositTx(
  params: DepositParams,
  environment: EnvironmentType
): Promise<Transaction[]> {
  const response = await fetch("/api/depositTx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params, environment }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create deposit transactions: ${await response.text()}`
    );
  }

  return response.json();
}
