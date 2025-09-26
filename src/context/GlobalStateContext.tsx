import React from "react";
import { useAccount } from "wagmi";

type GlobalState = {
  userAddress?: string;
  setUserAddress: (addr?: string) => void;
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

  return (
    <GlobalStateContext.Provider value={{ userAddress, setUserAddress }}>
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
