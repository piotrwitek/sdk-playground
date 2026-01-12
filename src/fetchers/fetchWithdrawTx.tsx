import type { Transaction, WithdrawParams, EnvironmentType } from "@/types";

export async function fetchWithdrawTx(
  params: WithdrawParams,
  environment: EnvironmentType
): Promise<Transaction[]> {
  const response = await fetch("/api/withdrawTx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...params, environment }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create withdraw transactions: ${await response.text()}`
    );
  }

  return response.json();
}
