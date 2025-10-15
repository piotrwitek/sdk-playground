import type { ChainId } from "@summer_fi/sdk-client";
import { useState, useCallback, useEffect } from "react";
import type { VaultInfo } from "../../types";

// Add the hook to memoize fetchVaults and expose state
export function useVaults(chainId: ChainId) {
  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVaults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/vaults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chainId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vaults");
      }

      const data = await response.json();
      setVaults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vaults");
      setVaults([]);
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  useEffect(() => {
    // run once on mount and whenever chainId changes (fetchVaults is stable)
    void fetchVaults();
  }, [fetchVaults]);

  return { vaults, loading, error, fetchVaults, setVaults };
}
