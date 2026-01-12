import type { ChainId } from "@summer_fi/sdk-client";
import { useState, useCallback, useEffect } from "react";
import type { VaultInfo } from "../../types";
import { fetchVaults } from "../../fetchers/fetchVaults";
import { useGlobalState } from "@/context/GlobalStateContext";

// Add the hook to memoize fetchVaults and expose state
export function useVaults(chainId: ChainId) {
  const { environment } = useGlobalState();
  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVaultsHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVaults(chainId, environment);
      setVaults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vaults");
      setVaults([]);
    } finally {
      setLoading(false);
    }
  }, [chainId, environment]);

  useEffect(() => {
    // run once on mount and whenever chainId or environment changes
    void fetchVaultsHandler();
  }, [fetchVaultsHandler]);

  return { vaults, loading, error, fetchVaults: fetchVaultsHandler, setVaults };
}
