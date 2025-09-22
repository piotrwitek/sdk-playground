import type { GetTokenBySymbolResponse } from "../pages/api/tokenBySymbol";
import type { ChainId } from "@summer_fi/sdk-client";

export async function fetchTokenBySymbol(
  symbol: string,
  chainId: ChainId,
  amount: string
): Promise<GetTokenBySymbolResponse> {
  const params = new URLSearchParams({
    symbol,
    chainId: chainId.toString(),
    amount,
  });

  const response = await fetch(`/api/tokenBySymbol?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch token information");
  }

  return response.json();
}
