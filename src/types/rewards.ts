export type AggregatedRewards = {
  total: string;
  vaultUsagePerChain: Record<number, string>;
  vaultUsage: string;
  merkleDistribution: string;
  voteDelegation: string;
};
