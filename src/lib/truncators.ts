/**
 * Truncate a single hex string to a more readable format
 * @param hex - Hex string to truncate
 * @param maxLength - Maximum length before truncating (default: 10)
 * @returns Truncated hex string
 */
export function truncateHex(hex: string, maxLength: number = 10): string {
  if (!hex || typeof hex !== "string") return hex;

  // Check if it's a hex string
  if (!hex.startsWith("0x") || hex.length <= maxLength + 2) {
    return hex;
  }

  const start = hex.slice(0, Math.ceil(maxLength / 2) + 2); // +2 for "0x"
  const end = hex.slice(-Math.floor(maxLength / 2));
  return `${start}...${end}`;
}

/**
 * Truncate long hex strings in text to a more readable format
 * @param text - Text that may contain long hex strings
 * @param maxLength - Maximum length before truncating (default: 10)
 * @returns Text with truncated hex strings
 */
export function truncateHexInText(
  text: string,
  maxLength: number = 10
): string {
  // Regex to match hex strings (0x followed by 8+ hex characters)
  const hexRegex = /(0x[a-fA-F0-9]{8,})/g;

  return text.replace(hexRegex, (match) => truncateHex(match, maxLength));
}
