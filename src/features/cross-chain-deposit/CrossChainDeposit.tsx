import React, { useState } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { type ChainId, type AddressValue } from "@summer_fi/sdk-client";
import { fetchCrossChainTx } from "../../fetchers/fetchCrossChainTx";
import type { CrossChainParams, VaultInfo } from "@/types";
import { SUPPORTED_TOKENS, type TokenSymbol } from "../../lib/tokens-config";
import { useGlobalState } from "../../context/GlobalStateContext";
import { ChainSelector } from "../../components/ChainSelector";
import { VaultSelector } from "../../components/VaultSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  PersonIcon,
  ArrowRightIcon,
  CheckCircledIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { ChainIds } from "@/types";

export interface TxData {
  to: string;
  data: string;
  value: string;
  gas: string;
}

const CrossChainDeposit: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { environment } = useGlobalState();
  const [isCreatingTx, setIsCreatingTx] = useState(false);
  const [txCreationError, setTxCreationError] = useState<string | null>(null);

  // Chain and vault selection state
  const [sourceChainId, setSourceChainId] = useState<ChainId>(ChainIds.Base);
  const [destinationChainId, setDestinationChainId] = useState<ChainId>(
    ChainIds.ArbitrumOne
  );
  const [selectedVaultId, setSelectedVaultId] = useState<
    AddressValue | undefined
  >();
  const [selectedVault, setSelectedVault] = useState<VaultInfo | undefined>();

  // Form input state
  const [amount, setAmount] = useState<string>("0.001");
  const [sourceTokenSymbol, setSourceTokenSymbol] =
    useState<TokenSymbol>("ETH");

  const {
    data: txHash,
    sendTransaction,
    isPending: txIsPending,
    error: txError,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Handler functions for selectors
  const handleSourceChainChange = (chainId: number) => {
    // Reset vault selection when source chain changes
    setSelectedVaultId(undefined);
    setSelectedVault(undefined);
    setSourceChainId(chainId as ChainId);

    // If destination chain is the same as new source chain, reset destination
    if (destinationChainId === chainId) {
      // Find a different chain to set as destination
      const availableChains = Object.values(ChainIds);
      const differentChain = availableChains.find((chain) => chain !== chainId);
      if (differentChain) {
        setDestinationChainId(differentChain);
      }
    }
  };

  const handleDestinationChainChange = (chainId: number) => {
    // Only allow selection if different from source chain
    if (chainId !== sourceChainId) {
      setDestinationChainId(chainId as ChainId);
      // Reset vault selection when destination chain changes
      setSelectedVaultId(undefined);
      setSelectedVault(undefined);
    }
  };

  const handleVaultChange = (vaultId: AddressValue) => {
    setSelectedVaultId(vaultId);
  };

  const handleVaultSelected = (vault: VaultInfo) => {
    setSelectedVault(vault);
  };

  const handleStartTransaction = async () => {
    if (
      !address ||
      !selectedVaultId ||
      !selectedVault ||
      sourceChainId === destinationChainId ||
      !amount ||
      parseFloat(amount) <= 0
    )
      return;

    try {
      setIsCreatingTx(true);
      setTxCreationError(null);

      const params: CrossChainParams = {
        sourceChainId,
        destinationChainId,
        senderAddress: address,
        fleetAddress: selectedVaultId,
        assetTokenSymbol: selectedVault.assetToken,
        sourceTokenSymbol: sourceTokenSymbol,
        amount: amount,
        slippage: 50, // 0.5%
      };

      const txData = await fetchCrossChainTx(params, environment);

      await sendTransaction({
        to: txData.to as `0x${string}`,
        data: txData.data as `0x${string}`,
        value: BigInt(txData.value),
        gas: BigInt(txData.gas),
      });
    } catch (error) {
      console.error("Failed to call API:", error);
      setTxCreationError(
        error instanceof Error ? error.message : "Failed to call API"
      );
    } finally {
      setIsCreatingTx(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chain and Vault Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">
            Source Chain
          </label>
          <ChainSelector
            value={sourceChainId}
            onValueChange={handleSourceChainChange}
            defaultValue={ChainIds.Base}
            hideLabel={true}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">
            Dest Chain
          </label>
          <ChainSelector
            value={destinationChainId}
            onValueChange={handleDestinationChainChange}
            defaultValue={ChainIds.ArbitrumOne}
            hideLabel={true}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">Vault</label>
          <VaultSelector
            chainId={destinationChainId}
            value={selectedVaultId}
            onValueChange={handleVaultChange}
            onVaultSelected={handleVaultSelected}
            hideLabel={true}
          />
        </div>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">
            Amount
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">
            Source Token
          </label>
          <Select
            value={sourceTokenSymbol}
            onValueChange={(value) =>
              setSourceTokenSymbol(value as TokenSymbol)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_TOKENS.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transaction Card */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightIcon className="h-5 w-5" />
            Cross-chain deposit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected &&
          address &&
          selectedVaultId &&
          selectedVault &&
          sourceChainId !== destinationChainId &&
          amount &&
          parseFloat(amount) > 0 ? (
            <Button
              disabled={txIsPending || isCreatingTx}
              onClick={handleStartTransaction}
              className="w-full"
              size="lg"
            >
              {isCreatingTx ? (
                <>
                  <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating transaction...
                </>
              ) : txIsPending ? (
                <>
                  <PersonIcon className="mr-2 h-4 w-4" />
                  Check wallet...
                </>
              ) : (
                <>
                  <ArrowRightIcon className="mr-2 h-4 w-4" />
                  Start Deposit
                </>
              )}
            </Button>
          ) : (
            <Alert>
              <PersonIcon />
              <AlertDescription>
                {!isConnected || !address
                  ? "Connect your wallet to start"
                  : sourceChainId === destinationChainId
                  ? "Source and destination chains must be different"
                  : !selectedVaultId || !selectedVault
                  ? "Select a vault to continue"
                  : !amount || parseFloat(amount) <= 0
                  ? "Enter a valid amount greater than 0"
                  : "Complete setup to start cross-chain deposit"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {txHash && (
              <Alert className="border-blue-200 bg-blue-50">
                <ExternalLinkIcon className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="flex items-center justify-between">
                    <span>
                      Transaction sent: {txHash.slice(0, 10)}...
                      {txHash.slice(-8)}
                    </span>
                    <a
                      href={`https://basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-xs"
                    >
                      View on Basescan
                    </a>
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
            {txCreationError && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{txCreationError}</AlertDescription>
              </Alert>
            )}
            {txError && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  {(txError as BaseError).shortMessage || txError.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossChainDeposit;
