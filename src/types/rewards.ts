export type AggregatedRewards = {
  total: bigint;
  vaultUsagePerChain: Record<number, bigint>;
  vaultUsage: bigint;
  merkleDistribution: bigint;
  voteDelegation: bigint;
};
