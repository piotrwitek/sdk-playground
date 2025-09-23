import type { Transaction, WithdrawParams } from "@/types";

export async function fetchWithdrawTx(
  params: WithdrawParams
): Promise<Transaction[]> {
  const response = await fetch("/api/withdrawTx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to create withdraw transactions");
  }

  return response.json();
}
