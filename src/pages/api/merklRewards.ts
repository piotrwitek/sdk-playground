import type { NextApiRequest, NextApiResponse } from "next";
import type { MerklRewardsResponse } from "../../types/merkl";
import { sdk } from "../../clients/sdk-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MerklRewardsResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { chainId, address } = req.query;

  if (!chainId || !address) {
    return res.status(400).json({ error: "chainId and address are required" });
  }

  try {
    const userMerklRewards = await sdk.armada.users.getUserMerklRewards({
      address,
    });
    const result = userMerklRewards as MerklRewardsResponse;

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Merkl rewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
