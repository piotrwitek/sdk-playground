import type { NextApiRequest, NextApiResponse } from "next";
import type { MerklRewardsResponse } from "@/types";
import { createSDK } from "../../clients/sdk-client";
import { isValidEnvironment } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MerklRewardsResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { chainId, address, environment } = req.query;

  if (!chainId || !address) {
    return res.status(400).json({ error: "chainId and address are required" });
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
  const addr = String(address) as `0x${string}`;
  const sdk = createSDK(environment);
  const userMerklRewards = await sdk.armada.users.getUserMerklRewards({ address: addr });
    const result = userMerklRewards as MerklRewardsResponse;

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Merkl rewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
