import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@summer_fi/sdk-client";
import type { IArmadaPosition } from "@summer_fi/sdk-client/dist/sdk-common/common/interfaces/IArmadaPosition";
import { createSDK } from "../../clients/sdk-client";
import { isValidEnvironment } from "@/types";

export type Position = {
  id: string;
  vaultId: string;
  vaultName: string;
  amount: string;
  shares: string;
  depositsAmount: string;
  withdrawalsAmount: string;
  deposits: string[];
  withdrawals: string[];
  depositsAmountUSD: string;
  withdrawalsAmountUSD: string;
  claimableSummerToken: string;
  claimedSummerToken: string;
  rewards: { claimed: string; claimable: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Position[] | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { chainId, address, environment } = req.body;

    if (!chainId) {
      return res.status(400).json({ error: "chainId is required" });
    }
    if (!address) {
      return res.status(400).json({ error: "address is required" });
    }
    if (!environment) {
      return res.status(400).json({ error: "environment is required" });
    }
    if (!isValidEnvironment(environment)) {
      return res.status(400).json({ 
        error: "Invalid environment. Must be one of: local, staging, prod" 
      });
    }

    const sdk = createSDK(environment);
    // fetch positions for Armada protocol
    const positions = await sdk.armada.users.getUserPositions({
      user: User.createFromEthereum(chainId, address),
    });

    const result: Position[] = positions.map((p: IArmadaPosition) => ({
      id: p.id.id,
      vaultId: p.pool.id.fleetAddress.value,
      vaultName: p.shares.token.name,
      amount: p.amount.toString(),
      shares: p.shares.toString(),
      depositsAmount: p.depositsAmount.toString(),
      withdrawalsAmount: p.withdrawalsAmount.toString(),
      deposits: p.deposits.map((d) => d.amount.toString()),
      withdrawals: p.withdrawals.map((d) => d.amount.toString()),
      depositsAmountUSD: p.depositsAmountUSD.toString(),
      withdrawalsAmountUSD: p.withdrawalsAmountUSD.toString(),
      claimableSummerToken: p.claimableSummerToken.toString(),
      claimedSummerToken: p.claimedSummerToken.toString(),
      rewards: p.rewards.map((r) => ({
        claimed: r.claimed.toString(),
        claimable: r.claimable.toString(),
      })),
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error("fetchPositions API error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
