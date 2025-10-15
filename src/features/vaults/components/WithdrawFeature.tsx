import { TransactionExecutor } from "../../../components/TransactionExecutor";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import type { WithdrawParams } from "@/types";
import { type AddressValue, type ChainId } from "@summer_fi/sdk-client";
import { useAccount } from "wagmi";
import { fetchWithdrawTx } from "../../../fetchers/fetchWithdrawTx";

interface WithdrawFeatureProps {
  chainId: ChainId;
  vaultId?: AddressValue;
  assetTokenSymbol?: string;
}

export function WithdrawFeature({
  chainId,
  vaultId,
  assetTokenSymbol,
}: WithdrawFeatureProps) {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address || !vaultId || !assetTokenSymbol) {
    return null;
  }

  return (
    <TransactionExecutor<WithdrawParams>
      title="Withdraw"
      icon={<ArrowUpIcon className="h-5 w-5" />}
      onFetchTransactions={fetchWithdrawTx}
      transactionParams={{
        chainId,
        fleetAddress: vaultId,
        senderAddress: address,
        assetTokenSymbol,
      }}
      transactionChainId={chainId}
    />
  );
}
