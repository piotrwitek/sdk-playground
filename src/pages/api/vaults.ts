import { NextApiRequest, NextApiResponse } from "next";
import { sdk } from "../../clients/sdk-client";
import type { VaultInfo, VaultsParams } from "@/types";
import { FiatCurrency } from "@summer_fi/sdk-client";
import BigNumber from "bignumber.js";
import { SUMR_PRICE } from "../../sdk/constants";
import { calculateMerklRewardApy } from "../../lib/utils";

const fetchVaults = async ({ chainId }: VaultsParams): Promise<VaultInfo[]> => {
  // you can retrieve all user positions on a particular chain
  const vaults = await sdk.armada.users.getVaultInfoList({
    chainId,
  });

  if (!vaults.list.length) {
    return [];
  }

  // Gather unique asset tokens to deduplicate price fetch calls
  const uniqueAssetTokens = new Map<
    string,
    (typeof vaults.list)[0]["assetToken"]
  >();

  vaults.list.forEach((vault) => {
    const symbol = vault.assetToken.symbol.toString();
    if (!uniqueAssetTokens.has(symbol)) {
      uniqueAssetTokens.set(symbol, vault.assetToken);
    }
  });

  // Fetch prices for unique asset tokens only
  const pricePromises = Array.from(uniqueAssetTokens.entries()).map(
    async ([symbol, assetToken]) => {
      try {
        const priceInfo = await sdk.oracle.getSpotPrice({
          baseToken: assetToken,
          denomination: FiatCurrency.USD,
        });
        return {
          symbol,
          price: priceInfo.price.value,
        };
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
        // Default to 1.0 for stablecoins if price fetch fails
        const isStablecoin = ["USDC", "USDT", "DAI", "USDC.e"].includes(symbol);
        return {
          symbol,
          price: isStablecoin ? "1" : "0",
        };
      }
    }
  );

  const prices = await Promise.all(pricePromises);
  const priceMap = new Map(prices.map((p) => [p.symbol, p.price]));
  priceMap.set("SUMR", SUMR_PRICE.toString()); // Add SUMR price manually

  return vaults.list.map((vault) => {
    const assetTokenSymbol = vault.assetToken.symbol.toString();
    const assetTokenPriceUSD = priceMap.get(assetTokenSymbol) || "0";

    // Calculate TVL in USD for merkl reward APY calculations
    const tvlBN = BigNumber(
      vault.totalDeposits.toString().split(" ")[0] || "0"
    );

    const tvlUSD = tvlBN.multipliedBy(assetTokenPriceUSD);

    return {
      id: vault.id.fleetAddress.value,
      name: vault.token.name.toString(),
      token: vault.token.symbol.toString(),
      assetToken: assetTokenSymbol,
      assetTokenPriceUSD,
      apy: vault.apy?.toString() || "N/A",
      rewardsApys: vault.rewardsApys.map((r) => ({
        symbol: r.token.symbol.toString(),
        apy: r.apy?.toString(),
      })),
      merklRewards: vault.merklRewards?.map((r) => {
        const symbol = r.token.symbol.toString();
        const dailyEmission = r.dailyEmission.toString();

        // Calculate APY for SUMR rewards
        const apy = calculateMerklRewardApy(
          dailyEmission,
          symbol,
          Number(priceMap.get(symbol) || "0"),
          tvlUSD
        );

        return {
          symbol,
          dailyEmission,
          apy,
        };
      }),
      tvl: vault.totalDeposits.toString(),
      depositCap: vault.depositCap.toString(),
    };
  });
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
