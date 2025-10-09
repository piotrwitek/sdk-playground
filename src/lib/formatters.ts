import { BigNumber } from "bignumber.js";

/**
 * Format APY as percentage with 2 decimal places
 * @param apy - APY value as string or number
 * @returns Formatted percentage string (e.g., "5.25%")
 */
export function formatApy(apy: string | number): string {
  if (apy === "N/A" || !apy) return "N/A";

  const numericApy = typeof apy === "string" ? parseFloat(apy) : apy;
  if (isNaN(numericApy)) return "N/A";

  return `${numericApy.toFixed(2)}%`;
}

/**
 * Formats any numeric value with K/M/B suffixes. Defaults to 2 decimal places.
 * @param value - bigint, number, string, or undefined
 * @param decimals - decimal places (default: 2)
 * @returns formatted string (e.g., "1.40K", "7.06M", "2.15B")
 */
export function formatAnyNumericValue(
  value: bigint | string | number | undefined,
  decimals: number = 2
): string {
  if (value === undefined || value === null) return "-";

  try {
    const bn = BigNumber(value.toString());
    if (!bn.isFinite() || bn.isNaN()) return value?.toString() || "-";

    const billion = BigNumber(1e9);
    const million = BigNumber(1e6);
    const thousand = BigNumber(1e3);

    if (bn.gte(billion)) {
      return `${bn.div(billion).toFixed(decimals)}B`;
    } else if (bn.gte(million)) {
      return `${bn.div(million).toFixed(decimals)}M`;
    } else if (bn.gte(thousand)) {
      return `${bn.div(thousand).toFixed(decimals)}K`;
    } else {
      return bn.toFixed(decimals);
    }
  } catch {
    return value?.toString() || "-";
  }
}

/**
 * Format a number with unit (e.g., "58.982631 USDT") to human readable format
 * @param tokenAmount - String in format "number unit" (e.g., "58.982631 USDT")
 * @returns Formatted string with human readable number and original unit (e.g., "58.98 USDT")
 */
export function formatTokenAmount(tokenAmount: string): string {
  if (!tokenAmount || typeof tokenAmount !== "string") {
    return tokenAmount;
  }

  const parts = tokenAmount.split(" ");
  if (parts.length !== 2) {
    return tokenAmount; // Return original if format doesn't match expected pattern
  }

  const [numberPart, unit] = parts;
  const formattedNumber = formatAnyNumericValue(numberPart);

  return `${formattedNumber} ${unit}`;
}

/**
 * Format in standardized currency format with symbol in front
 * @param value - Currency value as string or number
 * @param currency - Currency symbol (default: "$")
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: string | number,
  currency: string = "$"
): string {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return `${currency}0.00`;

  return `${currency}${numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
