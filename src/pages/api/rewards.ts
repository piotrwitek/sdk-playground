import type { NextApiRequest, NextApiResponse } from "next";
import { createSDK } from "../../clients/sdk-client";
import { isValidEnvironment, ChainIds } from "@/types";
import { User } from "@summer_fi/sdk-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        total: string;
        vaultUsagePerChain: Record<number, string>;
        vaultUsage: string;
        merkleDistribution: string;
        voteDelegation: string;
      }
    | { error: string }
  >
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, chainId, environment } = req.query;
  if (!address) {
    return res.status(400).json({ error: "address is required" });
  }
  if (!chainId) {
    return res.status(400).json({ error: "chainId is required" });
  }
  if (!environment) {
    return res.status(400).json({ error: "environment is required" });
  }
  if (!isValidEnvironment(environment)) {
    return res.status(400).json({ 
      error: "Invalid environment. Must be one of: local, staging, prod" 
    });
  }

  try {
    const parsedChainId = Number(chainId);
    if (Number.isNaN(parsedChainId)) {
      return res.status(400).json({ error: "chainId must be a number" });
    }

    const resolvedChainId =
      ChainIds[
        parsedChainId as unknown as keyof typeof ChainIds
      ] ?? parsedChainId;

    const user = User.createFromEthereum(
      resolvedChainId,
      address as `0x${string}`
    );
    const sdk = createSDK(environment);
    const data = await sdk.armada.users.getAggregatedRewardsIncludingMerkl({
      user,
    });

    // Convert bigint values to string for JSON serialization
    const result = {
      total: data.total.toString(),
      vaultUsagePerChain: Object.fromEntries(
        Object.entries(data.vaultUsagePerChain).map(([k, v]) => [
          k,
          v.toString(),
        ])
      ),
      vaultUsage: data.vaultUsage.toString(),
      merkleDistribution: data.merkleDistribution.toString(),
      voteDelegation: data.voteDelegation.toString(),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching aggregated rewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
