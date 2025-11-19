import type { NextApiRequest, NextApiResponse } from "next";
import {
  NATIVE_CURRENCY_ADDRESS_LOWERCASE,
  TokenAmount,
} from "@summer_fi/sdk-client";
import { sdk } from "../../clients/sdk-client";
import { ensoClient } from "../../clients/enso-client";
import type { CrossChainParams } from "@/types";
import type { BundleAction } from "@ensofinance/sdk";

export async function createEnsoTxData({
  senderAddress,
  sourceChainId,
  destinationChainId,
  fleetAddress,
  sourceTokenSymbol,
  assetTokenSymbol,
  amount,
  slippage, // in basis points, e.g., 50 = 0.5%
}: CrossChainParams) {
  const sourceToken = await sdk.tokens.getTokenBySymbol({
    symbol: sourceTokenSymbol,
    chainId: sourceChainId,
  });
  const sourceAmount = TokenAmount.createFrom({
    amount,
    token: sourceToken,
  });

  const assetToken = await sdk.tokens.getTokenBySymbol({
    symbol: assetTokenSymbol,
    chainId: destinationChainId,
  });

  const isNative =
    sourceToken.address.value.toLowerCase() ===
    NATIVE_CURRENCY_ADDRESS_LOWERCASE;

  const ensoSourceSwapToEth: BundleAction = {
    protocol: "enso",
    action: "route",
    args: {
      tokenIn: sourceToken.address.value,
      amountIn: sourceAmount.toSolidityValue().toString(),
      tokenOut: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
      slippage,
    },
  };

  const data = await ensoClient.getBundleData(
    {
      chainId: sourceChainId,
      fromAddress: senderAddress,
      spender: senderAddress,
      routingStrategy: "router",
    },
    [
      ...(!isNative ? [ensoSourceSwapToEth] : []),
      {
        protocol: "stargate",
        action: "bridge",
        args: {
          primaryAddress: "0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7",
          destinationChainId: destinationChainId,
          tokenIn: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
          amountIn: isNative
            ? sourceAmount.toSolidityValue().toString()
            : { useOutputOfCallAt: 0 },
          receiver: senderAddress,
          callback: [
            {
              protocol: "enso",
              action: "balance",
              args: {
                token: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
              },
            },
            {
              protocol: "enso",
              action: "route",
              args: {
                tokenIn: NATIVE_CURRENCY_ADDRESS_LOWERCASE,
                amountIn: { useOutputOfCallAt: 0 },
                tokenOut: assetToken.address.value,
                slippage,
              },
            },
            {
              protocol: "summer-fi",
              action: "deposit",
              args: {
                tokenIn: assetToken.address.value,
                tokenOut: fleetAddress,
                amountIn: { useOutputOfCallAt: 1 },
                primaryAddress: fleetAddress,
                receiver: senderAddress,
              },
            },
          ],
        },
      },
    ]
  );

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      senderAddress,
      sourceChainId,
      destinationChainId,
      fleetAddress,
      sourceTokenSymbol,
      assetTokenSymbol,
      amount,
      slippage,
    } = req.body;

    const missingFields = [];
    if (!senderAddress) missingFields.push("senderAddress");
    if (!sourceChainId) missingFields.push("sourceChainId");
    if (!destinationChainId) missingFields.push("destinationChainId");
    if (!fleetAddress) missingFields.push("fleetAddress");
    if (!sourceTokenSymbol) missingFields.push("sourceTokenSymbol");
    if (!assetTokenSymbol) missingFields.push("assetTokenSymbol");
    if (!amount) missingFields.push("amount");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: "All fields are required", missingFields });
    }

    const txData = await createEnsoTxData({
      senderAddress,
      sourceChainId,
      destinationChainId,
      fleetAddress,
      sourceTokenSymbol,
      assetTokenSymbol,
      amount,
      slippage: slippage ?? 50, // default to 0.5% if not provided
    });

    console.log("txData:", JSON.stringify(txData));

    res.status(200).json({
      to: txData.tx.to,
      data: txData.tx.data,
      value: txData.tx.value.toString(),
      gas: txData.gas.toString(),
      amountsOut: txData.amountsOut,
      route: txData.route,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      priceImpact: (txData as any).priceImpact,
    });
  } catch (error) {
    console.error("Error creating Enso transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
}
