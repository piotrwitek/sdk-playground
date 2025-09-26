import type { NextApiRequest, NextApiResponse } from "next";
import { sdk } from "../../clients/sdk-client";
import { User } from "@summer_fi/sdk-client";
import { SupportedChainIds } from "../../sdk/chains";

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

  const { address, chainId } = req.query;
  if (!address) {
    return res.status(400).json({ error: "address is required" });
  }
  if (!chainId) {
    return res.status(400).json({ error: "chainId is required" });
  }

  try {
    const parsedChainId = Number(chainId);
    if (Number.isNaN(parsedChainId)) {
      return res.status(400).json({ error: "chainId must be a number" });
    }

    const resolvedChainId =
      SupportedChainIds[
        parsedChainId as unknown as keyof typeof SupportedChainIds
      ] ?? parsedChainId;

    const user = User.createFromEthereum(
      resolvedChainId,
      address as `0x${string}`
    );
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
