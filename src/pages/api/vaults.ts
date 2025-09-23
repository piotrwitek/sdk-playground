import { NextApiRequest, NextApiResponse } from "next";
import { sdk } from "../../clients/sdk-client";
import type { VaultInfo, VaultsParams } from "@/types";

const fetchVaults = async ({ chainId }: VaultsParams): Promise<VaultInfo[]> => {
  // you can retrieve all user positions on a particular chain
  const vaults = await sdk.armada.users.getVaultInfoList({
    chainId,
  });

  if (!vaults.list.length) {
    return [];
  }

  return vaults.list.map((vault) => ({
    id: vault.id.fleetAddress.value,
    name: vault.token.name.toString(),
    token: vault.token.symbol.toString(),
    assetToken: vault.assetToken.symbol.toString(),
    apy: vault.apy?.toString() || "N/A",
    tvl: vault.totalDeposits.toString(),
    depositCap: vault.depositCap.toString(),
  }));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VaultInfo[] | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { chainId } = req.body;

    if (!chainId) {
      return res.status(400).json({ error: "chainId is required" });
    }

    const vaults = await fetchVaults({ chainId });
    res.status(200).json(vaults);
  } catch (error) {
    console.error("Retrieve vaults API error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
