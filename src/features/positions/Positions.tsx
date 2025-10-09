import React from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import { formatTokenAmount } from "../../lib/formatters";
import { truncateHex } from "../../lib/truncators";
import type { IArmadaPosition } from "@summer_fi/sdk-client";
import { fetchPositions } from "../../fetchers/fetchPositions";
import { SelectorsSection } from "../../components/shared/SelectorsSection";
import { useGlobalState } from "@/context/GlobalStateContext";

export type ArmadaPosition = IArmadaPosition;

export const Positions: React.FC = () => {
  const { userAddress, chainId } = useGlobalState();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["positions", chainId, userAddress],
    queryFn: () => fetchPositions(chainId, userAddress ?? ""),
    enabled: !!userAddress && !!chainId,
  });

  return (
    <div className={cn("p-4")}>
      <h2 className="text-2xl font-semibold mb-4">Positions</h2>

      <SelectorsSection onSubmit={refetch} />

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{(error as Error).message}</div>}

      {Array.isArray(data) && data.length === 0 && (
        <div>No positions found</div>
      )}

      {Array.isArray(data) && data.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Vault ID</th>
              <th className="border px-2 py-1 text-left">Token</th>
              <th className="border px-2 py-1 text-right">Shares</th>
              <th className="border px-2 py-1 text-right">Amount</th>
              <th className="border px-2 py-1 text-right">Deposits</th>
              <th className="border px-2 py-1 text-right">Deposits_List</th>
              <th className="border px-2 py-1 text-right">Withdrawals</th>
              <th className="border px-2 py-1 text-right">Withdrawals_List</th>
              <th className="border px-2 py-1 text-right">Claimable SUMR</th>
              <th className="border px-2 py-1 text-right">Claimed SUMR</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1 align-top">
                  {truncateHex(p.vaultId)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {p.vaultName}
                </td>
                <td className="border px-2 py-1 align-top">{p.shares}</td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatTokenAmount(p.amount)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatTokenAmount(p.depositsAmount)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {p.deposits.map(formatTokenAmount).join(", ")}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatTokenAmount(p.withdrawalsAmount)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {p.withdrawals.map(formatTokenAmount).join(", ")}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatTokenAmount(p.claimableSummerToken)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatTokenAmount(p.claimedSummerToken)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Positions;
