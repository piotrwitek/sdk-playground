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
 * Format big numbers in human readable format
 * @param value - Numeric value as string or number
 * @returns Human readable string (e.g., "1.4K", "7.06M", "2.15B")
 */
export function formatNumber(value: string | number): string {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return value.toString();

  if (numericValue >= 1e9) {
    return `${(numericValue / 1e9).toFixed(2)}B`;
  } else if (numericValue >= 1e6) {
    return `${(numericValue / 1e6).toFixed(2)}M`;
  } else if (numericValue >= 1e3) {
    return `${(numericValue / 1e3).toFixed(1)}K`;
  } else {
    return numericValue.toFixed(2);
  }
}

/**
 * Format a number with unit (e.g., "58.982631 USDT") to human readable format
 * @param valueWithUnit - String in format "number unit" (e.g., "58.982631 USDT")
 * @returns Formatted string with human readable number and original unit (e.g., "58.98 USDT")
 */
export function formatNumberWithUnit(valueWithUnit: string): string {
  if (!valueWithUnit || typeof valueWithUnit !== "string") {
    return valueWithUnit;
  }

  const parts = valueWithUnit.split(" ");
  if (parts.length !== 2) {
    return valueWithUnit; // Return original if format doesn't match expected pattern
  }

  const [numberPart, unit] = parts;
  const formattedNumber = formatNumber(numberPart);

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
