import React from "react";
import { useAccount } from "wagmi";
import { ChainIds } from "@/types";
import { Environment, type EnvironmentType } from "@/types";

type GlobalState = {
  userAddress?: string;
  setUserAddress: (addr: string) => void;
  chainId: number;
  setChainId: (id: number) => void;
  environment: EnvironmentType;
  setEnvironment: (env: EnvironmentType) => void;
};

const GlobalStateContext = React.createContext<GlobalState | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userAddress, setUserAddress] = React.useState<string | undefined>(
    undefined
  );
  const [chainId, setChainId] = React.useState<number>(() => {
    try {
      const raw = localStorage.getItem("chainId");
      // validate it's a number and a supported chain
      if (raw) {
        const parsed = parseInt(raw, 10);
        if (
          Object.values(ChainIds).includes(
            parsed as (typeof ChainIds)[keyof typeof ChainIds]
          )
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return ChainIds.Base;
  });
  const [environment, setEnvironment] = React.useState<EnvironmentType>(() => {
    try {
      const raw = localStorage.getItem("environment");
      if (raw && Object.values(Environment).includes(raw as EnvironmentType)) {
        return raw as EnvironmentType;
      }
    } catch {
      // ignore
    }
    return Environment.Prod;
  });

  // Restore from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("userAddress");
      if (raw) setUserAddress(raw);
    } catch {
      // ignore (private mode, etc.)
    }
  }, []);

  // If user doesn't have a saved address, default to connected wallet address when available
  const { address: connectedAddress, isConnected } = useAccount();

  React.useEffect(() => {
    if (!userAddress && isConnected && connectedAddress) {
      setUserAddress(connectedAddress);
    }
    // Only run when connection state or connectedAddress changes
  }, [isConnected, connectedAddress, userAddress]);

  // Persist to localStorage when changed
  React.useEffect(() => {
    try {
      if (userAddress) {
        localStorage.setItem("userAddress", userAddress);
      } else {
        localStorage.removeItem("userAddress");
      }
    } catch {
      // ignore
    }
  }, [userAddress]);

  // Persist chainId to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("chainId", String(chainId));
    } catch {
      // ignore
    }
  }, [chainId]);

  // Persist environment to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("environment", environment);
    } catch {
      // ignore
    }
  }, [environment]);

  return (
    <GlobalStateContext.Provider
      value={{
        userAddress,
        setUserAddress,
        chainId,
        setChainId,
        environment,
        setEnvironment,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export function useGlobalState() {
  const ctx = React.useContext(GlobalStateContext);
  if (!ctx) throw new Error("useGlobalState must be used within provider");
  return ctx;
}

export default GlobalStateContext;
