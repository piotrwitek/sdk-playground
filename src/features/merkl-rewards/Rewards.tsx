import React from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import fetchRewards from "@/fetchers/fetchRewards";
import type { AggregatedRewards } from "@/types";
import { useGlobalState } from "@/context/GlobalStateContext";
import { SelectorsSection } from "@/components/shared/SelectorsSection";
import { formatRewardValue } from "./formatRewardValue";

export const Rewards: React.FC = () => {
  const { isConnected } = useAccount();
  const { chainId, userAddress } = useGlobalState();

  const { data, isLoading, refetch, error } = useQuery<
    AggregatedRewards,
    Error
  >({
    queryKey: ["rewards", userAddress, chainId],
    queryFn: () => fetchRewards(userAddress ?? "", chainId),
    enabled: !!userAddress && !!chainId,
  });

  // Compute sum of constituent parts as bigint (if present)
  const sumOfConstituents: bigint | undefined = React.useMemo(() => {
    if (!data) return undefined;
    const a = BigInt(data.vaultUsage) ?? BigInt(0);
    const b = BigInt(data.merkleDistribution) ?? BigInt(0);
    const c = BigInt(data.voteDelegation) ?? BigInt(0);
    return a + b + c;
  }, [data]);

  // Compute difference total - sum
  const difference: bigint | undefined = React.useMemo(() => {
    if (!data || sumOfConstituents === undefined || data.total === undefined)
      return undefined;
    return BigInt(data.total) - sumOfConstituents;
  }, [data, sumOfConstituents]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Rewards</h2>

      <div className="mb-4">
        <SelectorsSection onSubmit={() => refetch()} showFetchButton={true} />
      </div>

      {error && (
        <Card>
          <CardContent>
            <div className="text-red-500">{error.message}</div>
          </CardContent>
        </Card>
      )}

      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>Please connect your wallet to view rewards.</CardContent>
        </Card>
      )}

      {isConnected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatRewardValue(data ? data.total : undefined)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vault Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatRewardValue(data ? data.vaultUsage : undefined)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Merkl Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatRewardValue(data ? data.merkleDistribution : undefined)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vote Delegation</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatRewardValue(data ? data.voteDelegation : undefined)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Constituents Sum Check</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && "Loading..."}
              {!isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>Total (Vault + Merkl + Vote)</div>
                    <div>
                      {formatRewardValue(sumOfConstituents?.toString())}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Reported Total</div>
                    <div>
                      {formatRewardValue(data ? data.total : undefined)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Difference</div>
                    <div>
                      {difference === undefined
                        ? "-"
                        : difference === BigInt(0)
                        ? "Match ✅"
                        : `${formatRewardValue(difference.toString())} ${
                            difference > BigInt(0)
                              ? "(total > sum)"
                              : "(sum > total)"
                          }`}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 sm:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Vault Usage Per Chain</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && "Loading..."}
              {!isLoading && data?.vaultUsagePerChain && (
                <div className="space-y-2">
                  {Object.entries(data.vaultUsagePerChain).map(
                    ([chain, value]) => (
                      <div key={chain} className="flex justify-between">
                        <div>Chain {chain}</div>
                        <div>{formatRewardValue(value)}</div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Rewards;
