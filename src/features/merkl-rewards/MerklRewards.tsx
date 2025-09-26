import React from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import type { MerklRewardsResponse } from "@/types";
import { fetchMerklRewards } from "../../fetchers/fetchMerklRewards";
import { SelectorsSection } from "../../components/shared/SelectorsSection";
import { Card, CardContent } from "../../components/ui/card";
import { useGlobalState } from "@/context/GlobalStateContext";
import { TokenRewardCard } from "./TokenRewardCard";

export const MerklRewards: React.FC = () => {
  const { chainId, userAddress } = useGlobalState();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["merklRewards", chainId, userAddress],
    queryFn: () => fetchMerklRewards(chainId, userAddress ?? ""),
    enabled: !!userAddress && !!chainId,
  });

  const renderRewardsCards = (data: MerklRewardsResponse) => {
    const allRewards = Object.entries(data.perChain).flatMap(
      ([chainId, rewards]) =>
        rewards?.map((reward) => ({ ...reward, chainId: Number(chainId) })) ||
        []
    );

    if (allRewards.length === 0) {
      return <div className="text-gray-600">No rewards found</div>;
    }

    return (
      <div className="space-y-4">
        {/* Token Cards */}
        {allRewards.map((reward, index) => (
          <TokenRewardCard
            key={`${reward.chainId}-${reward.token.address}-${index}`}
            reward={reward}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("p-4")}>
      <h2 className="text-2xl font-semibold mb-4">Merkl Rewards</h2>

      <SelectorsSection onSubmit={refetch} />

      {isLoading && (
        <Card>
          <CardContent className="p-4">
            <div>Loading Merkl rewards...</div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="text-red-500">
              Error: {(error as Error).message}
            </div>
          </CardContent>
        </Card>
      )}

      {data && !isLoading && !error && renderRewardsCards(data)}
    </div>
  );
};

export default MerklRewards;
