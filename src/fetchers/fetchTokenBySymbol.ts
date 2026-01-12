import type { GetTokenBySymbolResponse } from "../pages/api/tokenBySymbol";
import type { ChainId } from "@summer_fi/sdk-client";
import type { EnvironmentType } from "@/types";

export async function fetchTokenBySymbol(
  symbol: string,
  chainId: ChainId,
  amount: string,
  environment: EnvironmentType
): Promise<GetTokenBySymbolResponse> {
  const params = new URLSearchParams({
    symbol,
    chainId: chainId.toString(),
    amount,
    environment,
  });

  const response = await fetch(`/api/tokenBySymbol?${params}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch token information: ${await response.text()}`
    );
  }

  return response.json();
}
