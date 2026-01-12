import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChainIds, getAvailableChains } from "../sdk/chains";

interface ChainSelectorProps {
  value?: number;
  onValueChange?: (chainId: number) => void;
  defaultValue?: number;
  className?: string;
  hideLabel?: boolean;
}

export function ChainSelector({
  value,
  onValueChange,
  defaultValue = ChainIds.Base,
  className = "",
  hideLabel = false,
}: ChainSelectorProps) {
  const availableChains = getAvailableChains();

  const handleValueChange = (stringValue: string) => {
    const chainId = parseInt(stringValue, 10);
    onValueChange?.(chainId);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {!hideLabel && (
        <label className="text-sm font-medium text-center block">Chain</label>
      )}
      <Select
        value={(value ?? defaultValue).toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a chain" />
        </SelectTrigger>
        <SelectContent>
          {availableChains.map((chain) => (
            <SelectItem key={chain.id} value={chain.id.toString()}>
              {chain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
