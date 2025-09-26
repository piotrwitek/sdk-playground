import React from "react";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { GlobalStateProvider } from "./GlobalStateContext";
import { arbitrum, base, mainnet, sonic } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet, base, arbitrum, sonic],
    transports: {
      [mainnet.id]: http(),
      [base.id]: http(),
      [arbitrum.id]: http(),
      [sonic.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "SDK playground",
  })
);
declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>
          {/* Global state provider for app-wide values like userAddress */}
          <GlobalStateProvider>{children}</GlobalStateProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
