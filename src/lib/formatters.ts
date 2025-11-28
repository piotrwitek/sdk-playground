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
 * Formats any numeric value with K/M/B suffixes. Defaults to 4 decimal places.
 * @param value - bigint, number, string, or undefined
 * @param decimals - decimal places (default: 4)
 * @returns formatted string (e.g., "1.4000K", "7.0600M", "2.1500B")
 */
export function formatAnyNumericValue(
  value: bigint | string | number | undefined,
  decimals: number = 4
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

/**
 * Format a fiat amount string like "123.45 USD" to localized currency format
 * @param value - String in format "number currency" (e.g., "123.45 USD")
 * @returns Formatted currency string (e.g., "$123.45" for USD)
 */
export function formatFiatAmount(value: string): string {
  if (!value) return "-";
  const [amountPart, currencyPart] = value.split(" ");
  const amount = Number(amountPart);
  if (Number.isNaN(amount)) {
    return value;
  }
  if (!currencyPart || currencyPart === "USD") {
    return formatCurrency(amount, "$");
  }
  return `${currencyPart} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a Unix timestamp to a localized date/time string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date/time string
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "-";
  return new Date(timestamp * 1000).toLocaleString();
}
