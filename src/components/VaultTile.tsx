import { formatSumrValue } from "../lib/formatSumrValue";
import { formatTokenAmount, formatApy } from "../lib/formatters";
import { truncateHex } from "../lib/truncators";
import type { VaultTileProps } from "./VaultSelector";

export function VaultTile({ vault, onSelect }: VaultTileProps) {
  // Get SUMR reward APY if available
  const sumrReward = vault.merklRewards?.find(
    (reward) => reward.symbol === "SUMR"
  );
  const sumrBonusApy = sumrReward?.apy;

  return (
    <div
      className="p-4 cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 border rounded-lg hover:border-primary/50 bg-card"
      onClick={() => onSelect(vault.id)}
    >
      <div className="space-y-3">
        {/* Token name takes full width on top */}
        <div className="w-full">
          <h3 className="font-semibold text-lg text-center">
            {vault.name.replace(/_/g, " | ")}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            ID: {truncateHex(vault.id)}
          </p>
        </div>

        {/* Deposit Cap and TVL side by side */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">
              Deposit Cap:
            </span>
            <p className="font-medium">{formatTokenAmount(vault.depositCap)}</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">TVL:</span>
            <p className="font-medium">{formatTokenAmount(vault.tvl)}</p>
          </div>
        </div>

        {/* APY takes full width */}
        <div className="text-sm space-y-1">
          <span className="font-semibold text-foreground block text-center">
            Base APY:
          </span>
          <p className="font-medium text-green-600 text-center text-lg">
            {formatApy(vault.apy)}
          </p>
        </div>

        {/* Merkl Rewards */}
        {vault.merklRewards && vault.merklRewards.length > 0 && (
          <div className="text-sm space-y-2 pt-2 border-t">
            <span className="font-semibold text-foreground block text-center">
              Merkl Rewards (Daily):
            </span>
            <div className="space-y-1">
              {vault.merklRewards.map((reward, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-2"
                >
                  <span className="text-muted-foreground">{reward.symbol}</span>
                  <span className="font-medium text-blue-600">
                    {formatSumrValue(reward.dailyEmission)}
                  </span>
                </div>
              ))}
            </div>

            {/* SUMR Bonus APY */}
            {sumrBonusApy && (
              <div className="pt-2 border-t border-dashed">
                <div className="flex justify-between items-center px-2">
                  <span className="text-muted-foreground">SUMR Bonus APY</span>
                  <span className="font-semibold text-green-600">
                    {sumrBonusApy}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
