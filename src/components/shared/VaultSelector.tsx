import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { formatApy, formatAnyNumericValue } from "../../lib/formatters";
import type { AddressValue, ChainId } from "@summer_fi/sdk-client";
import type { VaultInfo } from "@/types";
import { truncateHex } from "../../lib/truncators";

interface VaultSelectorProps {
  chainId: ChainId;
  value?: AddressValue;
  onValueChange?: (vaultId: AddressValue) => void;
  onVaultSelected?: (vault: VaultInfo) => void;
  className?: string;
  hideLabel?: boolean;
}

interface VaultTileProps {
  vault: VaultInfo;
  onSelect: (vaultId: AddressValue) => void;
}

function VaultTile({ vault, onSelect }: VaultTileProps) {
  return (
    <div
      className="p-4 cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 border rounded-lg hover:border-primary/50 bg-card"
      onClick={() => onSelect(vault.id)}
    >
      <div className="space-y-3">
        {/* Token name takes full width on top */}
        <div className="w-full">
          <h3 className="font-semibold text-lg text-center">
            {vault.name.replace(/_/g, " | ")}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            ID: {truncateHex(vault.id)}
          </p>
        </div>

        {/* Deposit Cap and TVL side by side */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">
              Deposit Cap:
            </span>
            <p className="font-medium">
              {formatAnyNumericValue(vault.depositCap)} {vault.assetToken}
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">TVL:</span>
            <p className="font-medium">
              {formatAnyNumericValue(vault.tvl)} {vault.assetToken}
            </p>
          </div>
        </div>

        {/* APY takes full width */}
        <div className="text-sm space-y-1">
          <span className="font-semibold text-foreground block text-center">
            APY:
          </span>
          <p className="font-medium text-green-600 text-center text-lg">
            {formatApy(vault.apy)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Add the hook to memoize fetchVaults and expose state
function useVaults(chainId: ChainId) {
  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVaults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/vaults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chainId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vaults");
      }

      const data = await response.json();
      setVaults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vaults");
      setVaults([]);
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  useEffect(() => {
    // run once on mount and whenever chainId changes (fetchVaults is stable)
    void fetchVaults();
  }, [fetchVaults]);

  return { vaults, loading, error, fetchVaults, setVaults };
}

export function VaultSelector({
  chainId,
  value,
  onValueChange,
  onVaultSelected,
  className = "",
  hideLabel = false,
}: VaultSelectorProps) {
  // Replace component-local states for vaults/loading/error with the hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { vaults, loading, error, fetchVaults } = useVaults(chainId);

  // Fetch when opening modal if needed (hook provides fetchVaults)
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Only fetch if we don't have data or if there was an error
    if (vaults.length === 0 && !loading) {
      void fetchVaults();
    }
  };

  const handleSelectVault = (vaultId: AddressValue) => {
    const selectedVault = vaults.find((vault) => vault.id === vaultId);
    setIsModalOpen(false);
    onValueChange?.(vaultId);
    if (selectedVault) {
      onVaultSelected?.(selectedVault);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getButtonText = () => {
    if (value) {
      const selectedVault = vaults.find((vault) => vault.id === value);
      if (selectedVault) {
        return `${selectedVault.name.replace(/_/g, " ")}`;
      }
      return ` ${value}`;
    }
    return "Select Vault";
  };

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        {!hideLabel && (
          <label className="text-sm font-medium text-center block">Vault</label>
        )}
        <Button
          variant="outline"
          onClick={handleOpenModal}
          className="w-full justify-start"
          disabled={loading}
        >
          {loading ? "Loading..." : getButtonText()}
        </Button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative bg-background rounded-lg shadow-lg max-w-6xl w-full max-h-[80vh] m-4 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Select a Vault</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading && (
                <div className="text-center py-8">
                  <p>Loading vaults...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>Error: {error}</p>
                  <Button
                    variant="outline"
                    onClick={fetchVaults}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {!loading && !error && vaults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No vaults found for this chain.</p>
                </div>
              )}

              {!loading && !error && vaults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {vaults.map((vault) => (
                    <VaultTile
                      key={vault.id}
                      vault={vault}
                      onSelect={handleSelectVault}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
