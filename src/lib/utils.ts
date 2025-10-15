import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import BigNumber from "bignumber.js";
import { SUMR_DECIMALS } from "../sdk/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate APY for a merkl reward token
 */
export const calculateMerklRewardApy = (
  dailyEmission: string,
  tokenSymbol: string,
  tokenPrice: number,
  totalValueLockedUSD: BigNumber
): string | undefined => {
  if (totalValueLockedUSD.isZero() || totalValueLockedUSD.isNaN()) {
    return undefined;
  }

  try {
    // For SUMR, we have a known price
    if (tokenSymbol === "SUMR") {
      // bonusSumrDaily = dailyEmission / (10 ** 18)
      const dailyEmissionAmount = BigNumber(dailyEmission).shiftedBy(
        -SUMR_DECIMALS
      );
      // APY = (dailyEmission * 365 * tokenPrice) / totalValueLockedUSD * 100
      const annualValue = dailyEmissionAmount
        .multipliedBy(365)
        .multipliedBy(tokenPrice);
      const apyDecimal = annualValue.dividedBy(totalValueLockedUSD);
      const apyPercentage = apyDecimal.multipliedBy(100);

      return apyPercentage.toFixed(2);
    }

    // For other tokens, we could add logic here if needed
    return "0";
  } catch (error) {
    console.error(
      `Error calculating merkl reward APY for ${tokenSymbol}:`,
      error
    );
    return undefined;
  }
};
