import { BigNumber } from "bignumber.js";
import { formatAnyNumericValue } from "./formatters";

// Helper to format 18-decimal values (like SUMR wei)
export const formatSumrValue = (value: string | undefined) => {
  if (!value) return "-";
  const bn = BigNumber(value).shiftedBy(-18); // Convert from wei to human readable
  return formatAnyNumericValue(bn.toFixed());
};
