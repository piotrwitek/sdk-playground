import { DepositFeature } from "./components/DepositFeature";
import { WithdrawFeature } from "./components/WithdrawFeature";
import { ChainSelector } from "../../components/ChainSelector";
import { VaultSelector } from "../../components/VaultSelector";
import { useState } from "react";
import { useAccount } from "wagmi";
import { type ChainId, type AddressValue } from "@summer_fi/sdk-client";
import type { VaultInfo } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PersonIcon } from "@radix-ui/react-icons";
import { SupportedChainIds } from "../../sdk/chains";

export default function Vaults() {
  const { address, isConnected } = useAccount();
  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    SupportedChainIds.Base
  );
  const [selectedVaultId, setSelectedVaultId] = useState<
    AddressValue | undefined
  >();
  const [selectedVault, setSelectedVault] = useState<VaultInfo | undefined>();

  const handleChainChange = (chainId: number) => {
    // Reset vault selection when chain changes
    setSelectedVaultId(undefined);
    setSelectedVault(undefined);
    setSelectedChainId(chainId as ChainId);
  };

  const handleVaultChange = (vaultId: AddressValue) => {
    setSelectedVaultId(vaultId);
  };

  const handleVaultSelected = (vault: VaultInfo) => {
    setSelectedVault(vault);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
        <ChainSelector
          value={selectedChainId}
          onValueChange={handleChainChange}
          defaultValue={SupportedChainIds.Base}
        />
        <VaultSelector
          chainId={selectedChainId}
          value={selectedVaultId}
          onValueChange={handleVaultChange}
          onVaultSelected={handleVaultSelected}
        />
      </div>

      {!isConnected || !address ? (
        <div className="mb-6">
          <Alert>
            <PersonIcon />
            <AlertDescription>Connect your wallet to start</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DepositFeature
          chainId={selectedChainId}
          vaultId={selectedVaultId}
          assetTokenSymbol={selectedVault?.assetToken}
        />
        <WithdrawFeature
          chainId={selectedChainId}
          vaultId={selectedVaultId}
          assetTokenSymbol={selectedVault?.assetToken}
        />
      </div>
    </div>
  );
}
