export interface ArmadaActivityRecord {
  type: "deposit" | "withdrawal";
  from: string;
  to: string;
  amount: string;
  amountUsd: string;
  timestamp: number;
  txHash: string;
  vaultBalance: string;
  vaultBalanceUsd: string;
}

export interface VaultActivityResponse {
  positionId: string | null;
  activities: ArmadaActivityRecord[];
}
