import { TransactionExecutor } from "../../../components/TransactionExecutor";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import type { DepositParams } from "@/types";
import { type AddressValue, type ChainId } from "@summer_fi/sdk-client";
import { useAccount } from "wagmi";
import { fetchDepositTx } from "../../../fetchers/fetchDepositTx";
import { useGlobalState } from "@/context/GlobalStateContext";

interface DepositFeatureProps {
  chainId: ChainId;
  vaultId?: AddressValue;
  assetTokenSymbol?: string;
}

export function DepositFeature({
  chainId,
  vaultId,
  assetTokenSymbol,
}: DepositFeatureProps) {
  const { address, isConnected } = useAccount();
  const { environment } = useGlobalState();

  if (!isConnected || !address || !vaultId || !assetTokenSymbol) {
    return null;
  }

  return (
    <TransactionExecutor<DepositParams>
      title="Deposit"
      icon={<ArrowDownIcon className="h-5 w-5" />}
      onFetchTransactions={fetchDepositTx}
      transactionParams={{
        chainId,
        fleetAddress: vaultId,
        senderAddress: address,
        assetTokenSymbol,
      }}
      transactionChainId={chainId}
      environment={environment}
    />
  );
}
