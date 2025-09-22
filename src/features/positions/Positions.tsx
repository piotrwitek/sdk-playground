import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { cn } from "../../lib/utils";
import { formatNumberWithUnit } from "../../lib/formatters";
import { truncateHex } from "../../lib/truncators";
import type { IArmadaPosition } from "@summer_fi/sdk-client";
import { fetchPositions } from "../../fetchers/fetchPositions";
import { UserInputSection } from "../../components/shared/UserInputSection";

export type ArmadaPosition = IArmadaPosition;

export const Positions: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState<string | undefined>(connectedAddress);
  const [chainId, setChainId] = useState<number>(1);

  useEffect(() => {
    if (!address) setAddress(connectedAddress);
  }, [connectedAddress, address]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["positions", chainId, address],
    queryFn: () => fetchPositions(chainId, address ?? ""),
    enabled: !!address,
  });

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleChainChange = (newChainId: number) => {
    setChainId(newChainId);
  };

  return (
    <div className={cn("p-4")}>
      <h2 className="text-2xl font-semibold mb-4">Positions</h2>

      <UserInputSection
        address={address}
        chainId={chainId}
        onAddressChange={handleAddressChange}
        onChainChange={handleChainChange}
        onSubmit={refetch}
        addressPlaceholder="Wallet address"
      />

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
                  {formatNumberWithUnit(p.amount)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatNumberWithUnit(p.depositsAmount)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {p.deposits.map(formatNumberWithUnit).join(", ")}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatNumberWithUnit(p.withdrawalsAmount)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {p.withdrawals.map(formatNumberWithUnit).join(", ")}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatNumberWithUnit(p.claimableSummerToken)}
                </td>
                <td className="border px-2 py-1 text-right align-top">
                  {formatNumberWithUnit(p.claimedSummerToken)}
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
