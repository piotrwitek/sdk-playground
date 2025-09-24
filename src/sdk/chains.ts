// Define supported chain IDs
export const SupportedChainIds = {
  Mainnet: 1,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
} as const;

// Function to get the chain name by its ID
export const getChainName = (chainId: string | number): string => {
  switch (Number(chainId)) {
    case SupportedChainIds.Mainnet:
      return "Mainnet";
    case SupportedChainIds.Base:
      return "Base";
    case SupportedChainIds.ArbitrumOne:
      return "Arbitrum One";
    case SupportedChainIds.Sonic:
      return "Sonic";
    default:
      return "Unknown Chain";
  }
};

// Get all available chain IDs and their info
export const getAvailableChains = () => {
  return Object.values(SupportedChainIds).map((chainId) => {
    const name = getChainName(chainId);
    return {
      id: chainId,
      name,
    };
  });
};
