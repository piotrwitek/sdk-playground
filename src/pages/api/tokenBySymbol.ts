import type { NextApiRequest, NextApiResponse } from "next";
import { createSDK } from "../../clients/sdk-client";
import { isValidEnvironment } from "@/types";
import { type ChainId } from "@summer_fi/sdk-client";

export interface GetTokenBySymbolRequest {
  symbol: string;
  chainId: ChainId;
  amount: string;
}

export interface GetTokenBySymbolResponse {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetTokenBySymbolResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { symbol, chainId, environment } = req.query;

    if (!symbol || !chainId) {
      return res.status(400).json({
        error: "Missing required parameters: symbol, chainId",
      });
    }
    if (!environment) {
      return res.status(400).json({ error: "environment is required" });
    }
    if (!isValidEnvironment(environment)) {
      return res.status(400).json({ 
        error: "Invalid environment. Must be one of: local, staging, prod" 
      });
    }

    const sdk = createSDK(environment);
    const token = await sdk.tokens.getTokenBySymbol({
      symbol: symbol as string,
      chainId: parseInt(chainId as string) as ChainId,
    });

    const response: GetTokenBySymbolResponse = {
      tokenAddress: token.address.value,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      decimals: token.decimals,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting token by symbol:", error);
    res.status(500).json({
      error: "Failed to get token information",
    });
  }
}
