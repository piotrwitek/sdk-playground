import { NextApiRequest, NextApiResponse } from "next";
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
} from "@summer_fi/sdk-client";
import { sdk } from "../../clients/sdk-client";
import {
  mapSdkTransactionToTransaction,
  Transaction,
  DepositParams,
} from "@/types";

async function createTransactions({
  chainId,
  senderAddress,
  fleetAddress,
  assetTokenSymbol,
}: DepositParams): Promise<Transaction[]> {
  // create a user using EOA address
  const user = User.createFromEthereum(chainId, senderAddress);

  // create a vaultId object for a selected fleet using it's deployment address
  const vaultId = ArmadaVaultId.createFrom({
    chainInfo: getChainInfoByChainId(chainId),
    fleetAddress: Address.createFromEthereum({
      value: fleetAddress,
    }),
  });

  // you can get token entity using chain namespace to get particular token entity
  // you can query by symbol or by address on a particular chain from our curated list
  const assetToken = await sdk.tokens.getTokenBySymbol({
    chainId: chainId,
    symbol: assetTokenSymbol,
  });

  // create a token amount to deposit
  const amount = TokenAmount.createFrom({
    token: assetToken,
    amount: "1", // amount is in full units e.g. 1 ETH, 1 USDC, ... etc.
  });

  // you need to set slippage in case there is swap involved
  // happens when deposited asset is different from the vault asset
  // use value in percentage
  const slippage = Percentage.createFrom({ value: 0.5 });

  // this will return either one tx with deposit or two tx's if allowance is required
  const transactions = await sdk.armada.users.getNewDepositTx({
    vaultId,
    user,
    amount,
    slippage,
    referralCode: "test",
  });

  // Convert SDK transactions to our Transaction format
  return transactions.map(mapSdkTransactionToTransaction);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transaction[] | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { chainId, senderAddress, fleetAddress, assetTokenSymbol } = req.body;

    if (!chainId) {
      return res.status(400).json({ error: "chainId is required" });
    }
    if (!senderAddress) {
      return res.status(400).json({ error: "userAddress is required" });
    }
    if (!fleetAddress) {
      return res.status(400).json({ error: "fleetAddress is required" });
    }
    if (!assetTokenSymbol) {
      return res.status(400).json({ error: "assetTokenSymbol is required" });
    }

    const transactions = await createTransactions({
      chainId,
      senderAddress,
      fleetAddress,
      assetTokenSymbol,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Deposit API error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
