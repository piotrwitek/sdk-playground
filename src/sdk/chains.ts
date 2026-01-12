import { ChainIds } from "../types";

export { ChainIds };

// Function to get the chain name by its ID
export const getChainName = (chainId: string | number): string => {
  switch (Number(chainId)) {
    case ChainIds.Mainnet:
      return "Mainnet";
    case ChainIds.Base:
      return "Base";
    case ChainIds.ArbitrumOne:
      return "Arbitrum One";
    case ChainIds.Sonic:
      return "Sonic";
    case ChainIds.HyperEvm:
      return "HyperEVM";
    default:
      return "Unknown Chain";
  }
};

// Get all available chain IDs and their info
export const getAvailableChains = () => {
  return Object.values(ChainIds).map((chainId) => {
    const name = getChainName(chainId);
    return {
      id: chainId,
      name,
    };
  });
};
