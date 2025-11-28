import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChainSelector } from "@/components/ChainSelector";
import { VaultSelector } from "@/components/VaultSelector";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SupportedChainIds } from "@/sdk/chains";
import { useUserAddress } from "@/components/hooks/useUserAddress";
import type { VaultInfo, VaultActivityResponse } from "@/types";
import { type AddressValue, type ChainId } from "@summer_fi/sdk-client";
import { fetchPositionActivity } from "@/fetchers/fetchPositionActivity";
import {
  formatTokenAmount,
  formatFiatAmount,
  formatTimestamp,
} from "@/lib/formatters";
import { truncateHex } from "@/lib/truncators";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ActivityTableProps {
  entries: VaultActivityResponse["activities"];
}

function ActivityTable({ entries }: ActivityTableProps) {
  if (!entries.length) {
    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity</h3>
          <span className="text-sm text-muted-foreground">No records</span>
        </div>
        <p className="text-sm text-muted-foreground">
          No activity available for this selection.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">From</th>
              <th className="px-3 py-2 text-left">To</th>
              <th className="px-3 py-2 text-left">Tx Hash</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-right">Vault Balance</th>
              <th className="px-3 py-2 text-right">Amount (USD)</th>
              <th className="px-3 py-2 text-right">Vault Balance (USD)</th>
              <th className="px-3 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={`${entry.txHash}-${entry.timestamp}`}
                className="border-t"
              >
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      entry.type === "deposit"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {entry.type}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {truncateHex(entry.from, 12)}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {truncateHex(entry.to, 12)}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {truncateHex(entry.txHash, 16)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatTokenAmount(entry.amount)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatTokenAmount(entry.vaultBalance)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatFiatAmount(entry.amountUsd)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {formatFiatAmount(entry.vaultBalanceUsd)}
                </td>
                <td className="px-3 py-2 text-left whitespace-nowrap">
                  {formatTimestamp(entry.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PositionActivity() {
  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    SupportedChainIds.Base
  );
  const [selectedVaultId, setSelectedVaultId] = useState<
    AddressValue | undefined
  >();
  const [selectedVault, setSelectedVault] = useState<VaultInfo | undefined>();
  const { userAddress, UserAddressSelector } = useUserAddress();

  const { data, isFetching, isError, error, refetch } =
    useQuery<VaultActivityResponse>({
      queryKey: [
        "position-activity",
        selectedChainId,
        selectedVaultId,
        userAddress,
      ],
      queryFn: () =>
        fetchPositionActivity({
          chainId: selectedChainId,
          fleetAddress: selectedVaultId as string,
          userAddress: userAddress as string,
        }),
      enabled: Boolean(selectedVaultId && userAddress),
      staleTime: 30_000,
    });

  const handleChainChange = (chainId: number) => {
    setSelectedVaultId(undefined);
    setSelectedVault(undefined);
    setSelectedChainId(chainId as ChainId);
  };

  const handleVaultChange = (vaultId: AddressValue) => {
    setSelectedVaultId(vaultId);
  };

  const isReady = Boolean(selectedVaultId && userAddress);

  const positionLabel = useMemo(() => {
    if (!data?.positionId) return "No position found for this selection";
    return `Position ID: ${truncateHex(data.positionId, 24)}`;
  }, [data?.positionId]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChainSelector
          value={selectedChainId}
          onValueChange={handleChainChange}
          defaultValue={SupportedChainIds.Base}
        />
        <VaultSelector
          chainId={selectedChainId}
          value={selectedVaultId}
          onValueChange={handleVaultChange}
          onVaultSelected={setSelectedVault}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-center block">User</label>
          <UserAddressSelector />
        </div>
      </div>

      {!isReady && (
        <Alert>
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Choose inputs first</AlertTitle>
          <AlertDescription>
            Select a chain, vault, and user address to load position activity.
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Failed to fetch activity</AlertTitle>
          <AlertDescription>
            {(error as Error).message || "Unexpected error"}
          </AlertDescription>
        </Alert>
      )}

      {isReady && !data && isFetching && (
        <div className="text-sm text-muted-foreground">Loading activity...</div>
      )}

      {isReady && data && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedVault?.name?.replace(/_/g, " ") || "Selected Vault"}
              </p>
              <p className="text-base font-medium">{positionLabel}</p>
            </div>
            <Button onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refetch"}
            </Button>
          </div>

          <ActivityTable entries={data.activities} />
        </div>
      )}
    </div>
  );
}

export default PositionActivity;
