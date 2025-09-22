import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { cn } from "../../lib/utils";
import { truncateHex } from "../../lib/truncators";
import type { MerklRewardsResponse } from "../../types/merkl";
import { fetchMerklRewards } from "../../fetchers/fetchMerklRewards";
import { UserInputSection } from "../../components/shared/UserInputSection";
import { Card, CardContent } from "../../components/ui/card";
import { getChainName, SupportedChainIds } from "../../sdk/chains";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { BigNumber } from "bignumber.js";

interface TokenRewardCardProps {
  reward: {
    chainId: number;
    token: {
      address: string;
      symbol: string;
      decimals: number;
      price: number;
    };
    amount: string;
    claimed: string;
    pending: string;
    breakdowns: Record<
      string,
      Record<
        string,
        {
          amount: string;
          claimed: string;
        }
      >
    >;
    unknownCampaigns: {
      amount: string;
      claimed: string;
    }[];
  };
}

const TokenRewardCard: React.FC<TokenRewardCardProps> = ({ reward }) => {
  const [isVaultsExpanded, setIsVaultsExpanded] = useState(false);
  const [isReferralsExpanded, setIsReferralsExpanded] = useState(false);

  const claimableAmount = BigNumber(reward.amount)
    .minus(BigNumber(reward.claimed))
    .shiftedBy(-reward.token.decimals);
  const claimableUsdValue = claimableAmount.times(reward.token.price || 0);
  const claimedAmount = BigNumber(reward.claimed).shiftedBy(
    -reward.token.decimals
  );
  const claimedUsdValue = claimedAmount.times(reward.token.price || 0);

  // Check if there are vault breakdowns
  const hasVaultBreakdowns = Object.keys(reward.breakdowns).length > 0;

  // For referrals, we'll simulate the data for now based on the screenshots
  const hasReferrals = reward.unknownCampaigns.length > 0; // Simple check for demo

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Token Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {reward.token.symbol.charAt(0)}
            </div>
            <span className="font-semibold text-lg">{reward.token.symbol}</span>
          </div>
        </div>

        {/* Amounts Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Claimable</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {claimableAmount.toFixed(3)} {reward.token.symbol}
              </span>
              <span className="text-sm text-gray-500">
                ${claimableUsdValue.toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Claimed</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {claimedAmount.toFixed(3)} {reward.token.symbol}
              </span>
              <span className="text-sm text-gray-500">
                ${claimedUsdValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Vault Breakdowns */}
        {hasVaultBreakdowns && (
          <div className="border-t pt-4">
            <button
              onClick={() => setIsVaultsExpanded(!isVaultsExpanded)}
              className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded"
            >
              {isVaultsExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              <span className="font-medium">Vaults</span>
            </button>

            {isVaultsExpanded && (
              <div className="mt-3 pl-6 space-y-2">
                {Object.entries(reward.breakdowns).map(
                  ([chainId, breakdown]) => {
                    const breakdownEntries = Object.entries(breakdown);
                    if (!breakdownEntries.length) return null;

                    return (
                      <div key={chainId}>
                        <div className="text-sm text-gray-600 mb-2">
                          On {getChainName(chainId)}:
                        </div>
                        {breakdownEntries.map(([key, breakdown]) => {
                          const bdClaimableAmount = BigNumber(breakdown.amount)
                            .minus(BigNumber(breakdown.claimed))
                            .shiftedBy(-reward.token.decimals);
                          const bdClaimedAmount = BigNumber(
                            breakdown.claimed
                          ).shiftedBy(-reward.token.decimals);
                          return (
                            <div key={key} className="mb-4 space-y-1">
                              <div className="text-sm font-medium">
                                - {truncateHex(key)}
                                {" - "}
                                <span className="text-gray-500">
                                  claimable
                                </span>{" "}
                                {bdClaimableAmount.toFixed(3)}{" "}
                                {reward.token.symbol} {" - "}
                                <span className="text-gray-500">
                                  claimed
                                </span>{" "}
                                {bdClaimedAmount.toFixed(3)}{" "}
                                {reward.token.symbol}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}

        {/* Collapsible Referrals */}
        {hasReferrals && (
          <div className="border-t pt-4 mt-4">
            <button
              onClick={() => setIsReferralsExpanded(!isReferralsExpanded)}
              className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded"
            >
              {isReferralsExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              <span className="font-medium">Referrals</span>
            </button>

            {isReferralsExpanded && (
              <div className="mt-3 pl-6">
                {reward.unknownCampaigns.map((campaign, idx) => {
                  const campClaimableAmount = BigNumber(campaign.amount)
                    .minus(BigNumber(campaign.claimed))
                    .shiftedBy(-reward.token.decimals);
                  const campClaimedAmount = BigNumber(
                    campaign.claimed
                  ).shiftedBy(-reward.token.decimals);
                  return (
                    <div key={idx} className="mb-4">
                      <div className="text-sm font-medium">
                        - Campaign {idx + 1} {" - "}
                        <span className="text-gray-500">claimable</span>{" "}
                        {campClaimableAmount.toFixed(3)} {reward.token.symbol}
                        {" - "}
                        <span className="text-gray-500">claimed</span>{" "}
                        {campClaimedAmount.toFixed(3)} {reward.token.symbol}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MerklRewards: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState<string | undefined>(
    "0x805769AA22219E3a29b301Ab5897B903A9ad2C4A"
  );
  const [chainId, setChainId] = useState<number>(SupportedChainIds.Base);

  useEffect(() => {
    if (!address) setAddress(connectedAddress);
  }, [connectedAddress, address]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["merklRewards", chainId, address],
    queryFn: () => fetchMerklRewards(chainId, address ?? ""),
    enabled: !!address,
  });

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleChainChange = (newChainId: number) => {
    setChainId(newChainId);
  };

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

      <UserInputSection
        address={address}
        chainId={chainId}
        onAddressChange={handleAddressChange}
        onChainChange={handleChainChange}
        onSubmit={refetch}
        addressPlaceholder="Wallet address"
        className="mb-6"
      />

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
