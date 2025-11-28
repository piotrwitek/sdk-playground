import { NextApiRequest, NextApiResponse } from "next";
import { Address, User } from "@summer_fi/sdk-client";
import type {
  IArmadaDeposit,
  IArmadaWithdrawal,
  ITokenAmount,
} from "@summer_fi/sdk-client";
import { sdk } from "../../clients/sdk-client";
import type { VaultActivityResponse, ArmadaActivityRecord } from "@/types";
import BigNumber from "bignumber.js";

function toDisplayTokenAmount(tokenAmount: ITokenAmount): string {
  try {
    const decimals = tokenAmount.token.decimals ?? 18;
    const divisor = new BigNumber(10).pow(decimals);
    const normalized = new BigNumber(tokenAmount.amount).div(divisor);
    return `${normalized.toString()} ${tokenAmount.token.symbol}`;
  } catch (error) {
    console.warn("Failed to normalize token amount", error);
    return `${tokenAmount.amount} ${tokenAmount.token.symbol}`;
  }
}

function serializeActivity(
  entry: IArmadaDeposit | IArmadaWithdrawal,
  type: "deposit" | "withdrawal"
): ArmadaActivityRecord {
  const activity: ArmadaActivityRecord = {
    type,
    from: entry.from,
    to: entry.to,
    amount: toDisplayTokenAmount(entry.amount),
    amountUsd: entry.amountUsd.toString(),
    timestamp: entry.timestamp,
    txHash: entry.txHash,
    vaultBalance: toDisplayTokenAmount(entry.vaultBalance),
    vaultBalanceUsd: entry.vaultBalanceUsd.toString(),
  };

  return activity;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VaultActivityResponse | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { chainId, userAddress, fleetAddress, first, skip } = req.body;

    if (!chainId) {
      return res.status(400).json({ error: "chainId is required" });
    }
    if (!userAddress) {
      return res.status(400).json({ error: "userAddress is required" });
    }
    if (!fleetAddress) {
      return res.status(400).json({ error: "fleetAddress is required" });
    }

    const user = User.createFromEthereum(chainId, userAddress);
    const fleet = Address.createFromEthereum({ value: fleetAddress });

    const position = await sdk.armada.users.getUserPosition({
      user,
      fleetAddress: fleet,
    });

    if (!position) {
      return res.status(200).json({
        positionId: null,
        activities: [],
      });
    }

    const [deposits, withdrawals] = await Promise.all([
      sdk.armada.users.getDeposits({
        positionId: position.id,
        first,
        skip,
      }),
      sdk.armada.users.getWithdrawals({
        positionId: position.id,
        first,
        skip,
      }),
    ]);

    const allActivities: ArmadaActivityRecord[] = [
      ...deposits.map((d) => serializeActivity(d, "deposit")),
      ...withdrawals.map((w) => serializeActivity(w, "withdrawal")),
    ].sort((a, b) => b.timestamp - a.timestamp);

    const response: VaultActivityResponse = {
      positionId: position.id.id,
      activities: allActivities,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("positionActivity API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
