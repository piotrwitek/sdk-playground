import React from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import fetchRewards from "@/fetchers/fetchRewards";
import type { AggregatedRewards } from "@/types";
import { formatAnyNumericValue } from "@/lib/formatters";

export const Rewards: React.FC = () => {
  const { address, isConnected } = useAccount();

  const { data, isLoading, refetch, error } = useQuery<
    AggregatedRewards,
    Error
  >({
    queryKey: ["rewards", address],
    queryFn: () => fetchRewards(address ?? ""),
    enabled: isConnected && !!address,
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Rewards</h2>

      <div className="mb-4 flex items-center justify-between">
        <div />
        <div>
          <Button onClick={() => refetch()} disabled={!isConnected}>
            Refresh
          </Button>
        </div>
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
                : formatAnyNumericValue(data ? data.total : undefined)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vault Usage</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatAnyNumericValue(data ? data.vaultUsage : undefined)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Merkl Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatAnyNumericValue(
                    data ? data.merkleDistribution : undefined
                  )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vote Delegation</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading
                ? "Loading..."
                : formatAnyNumericValue(data ? data.voteDelegation : undefined)}
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
                        <div>
                          {formatAnyNumericValue(value as unknown as bigint)}
                        </div>
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
