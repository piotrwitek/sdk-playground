import React, { useState } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useSwitchChain,
  type BaseError,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  PersonIcon,
  ArrowRightIcon,
  CheckCircledIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Transaction } from "@/types";
import { truncateHexInText } from "../lib/truncators";
import type { ChainId } from "@summer_fi/sdk-client";

interface TransactionExecutorProps<TransactionParams extends object> {
  title: string;
  badges?: string[];
  icon?: React.ReactNode;
  transactionChainId: ChainId;
  transactionParams: TransactionParams;
  onFetchTransactions: (params: TransactionParams) => Promise<Transaction[]>;
}

export function TransactionExecutor<TransactionParams extends object>({
  title,
  badges = [],
  icon,
  onFetchTransactions,
  transactionParams,
  transactionChainId,
}: TransactionExecutorProps<TransactionParams>) {
  const [isFetchingTx, setIsFetchingTx] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | undefined>(
    undefined
  );
  const [remainingTransactions, setRemainingTransactions] = useState<
    Transaction[]
  >([]);

  const { chain, chainId: walletChainId } = useAccount();
  const explorerUrl = chain?.blockExplorers?.default?.url
    ? `${chain.blockExplorers.default.url}/tx/`
    : undefined;

  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const {
    data: txHash,
    sendTransaction,
    isPending: pendingSendTransaction,
    error: sendTransactionError,
    reset: resetSendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: 2,
    });

  const resetState = () => {
    resetSendTransaction();
    setIsFetchingTx(false);
    setTransaction(undefined);
    setRemainingTransactions([]);
  };

  const isWrongChain = walletChainId !== Number(transactionChainId);

  const handleSwitchChain = async () => {
    if (!transactionChainId) return;

    try {
      await switchChain({ chainId: Number(transactionChainId) });
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  const handleStepButton = async () => {
    try {
      // If finished sending
      if (isConfirmed) {
        // If there are remaining transactions set the next one
        if (remainingTransactions.length > 0) {
          resetSendTransaction();
          const tx = remainingTransactions[0];
          await sendTransaction({
            to: tx.to,
            data: tx.data,
            value: BigInt(tx.value),
          });
          setTransaction(tx);
          setRemainingTransactions(remainingTransactions.slice(1));
          return;
        } // If no remaining tx, reset state
        else {
          resetState();
          return;
        }
      }

      // Reset state if there was a sendTransactionError
      if (sendTransactionError) {
        resetSendTransaction();
      }

      setIsFetchingTx(true);

      // Fetch transactions from the API
      const transactions = await onFetchTransactions(transactionParams);

      // Execute the first transaction
      if (transactions.length > 0) {
        const tx = transactions[0];
        await sendTransaction({
          to: tx.to,
          data: tx.data,
          value: BigInt(tx.value),
        });
        setTransaction(tx);
        if (transactions.length > 1) {
          setRemainingTransactions(transactions.slice(1));
        }
      }
    } catch (error) {
      console.error("Failed to process transaction:", error);
    } finally {
      setIsFetchingTx(false);
    }
  };

  // // Handle transaction errors - just log them, don't auto-reset
  // React.useEffect(() => {
  //   if (sendTransactionError && !pendingSendTransaction) {
  //     console.error("Transaction failed:", sendTransactionError);
  //     // Don't auto-reset, let user control when to retry
  //   }
  // }, [sendTransactionError, pendingSendTransaction]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon || <ArrowRightIcon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {badges.length > 0 && (
          <div className="flex gap-2 pt-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {transaction && (
          <p className="text-sm text-gray-600 break-words overflow-wrap-anywhere">
            {truncateHexInText(transaction.description)}
          </p>
        )}
        {isWrongChain && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Wrong Wallet Chain
            </AlertDescription>
          </Alert>
        )}
        {isWrongChain ? (
          <Button
            disabled={isSwitchingChain}
            onClick={handleSwitchChain}
            className="w-full"
            size="lg"
            variant="outline"
          >
            {isSwitchingChain ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Switching Chain...
              </>
            ) : (
              <>
                <ReloadIcon className="mr-2 h-4 w-4" />
                Switch Chain
              </>
            )}
          </Button>
        ) : (
          <Button
            disabled={pendingSendTransaction || isFetchingTx || isConfirming}
            onClick={handleStepButton}
            className="w-full"
            size="lg"
            variant={isConfirmed ? "outline" : "default"}
          >
            {isFetchingTx ? (
              <>
                <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
                Fetching tx...
              </>
            ) : pendingSendTransaction ? (
              <>
                <PersonIcon className="mr-2 h-4 w-4" />
                Sign {transaction?.type} tx...
              </>
            ) : isConfirming ? (
              <>
                <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
                Confirming tx...
              </>
            ) : isConfirmed ? (
              remainingTransactions.length > 0 ? (
                <>
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Process next tx
                </>
              ) : (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Flow completed
                </>
              )
            ) : sendTransactionError ? (
              <>
                <ArrowRightIcon className="mr-2 h-4 w-4" />
                Retry {transaction?.type} tx
              </>
            ) : (
              <>
                <ArrowRightIcon className="mr-2 h-4 w-4" />
                Start flow
              </>
            )}
          </Button>
        )}

        <div className="space-y-3">
          {txHash && (
            <Alert className="border-blue-200 bg-blue-50">
              <ExternalLinkIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <span>
                    Transaction sent: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </span>
                  {explorerUrl && (
                    <a
                      href={`${explorerUrl}${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-xs"
                    >
                      View
                    </a>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
          {isConfirming && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <ClockIcon className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Waiting for confirmation...
              </AlertDescription>
            </Alert>
          )}
          {isConfirmed && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircledIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Transaction confirmed successfully!
              </AlertDescription>
            </Alert>
          )}
          {sendTransactionError && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                {(sendTransactionError as BaseError).shortMessage ||
                  sendTransactionError.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
