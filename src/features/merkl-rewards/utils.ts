/**
 * Formats a raw token amount to a human-readable string
 * @param amount - The raw token amount as string or number
 * @param decimals - The number of decimals for the token
 * @param precision - The number of decimal places to display (default: 3)
 * @returns Formatted amount as string
 */
export const formatTokenAmount = (
  amount: string | number,
  decimals: number,
  precision: number = 3
): string => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(precision);
};