import React from "react";
import { Button } from "../ui/button";
import { ChainSelector } from "./ChainSelector";
import { cn } from "../../lib/utils";

interface UserInputSectionProps {
  address: string | undefined;
  chainId: number;
  onAddressChange: (address: string) => void;
  onChainChange: (chainId: number) => void;
  onSubmit: () => void;
  className?: string;
  addressPlaceholder?: string;
  showFetchButton?: boolean;
}

export const UserInputSection: React.FC<UserInputSectionProps> = ({
  address,
  chainId,
  onAddressChange,
  onChainChange,
  onSubmit,
  className,
  addressPlaceholder = "Wallet address",
  showFetchButton = false,
}) => {
  return (
    <div className={cn("flex gap-2 mb-4", className)}>
      <input
        className="border px-2 py-1 rounded w-80"
        placeholder={addressPlaceholder}
        value={address ?? ""}
        onChange={(e) => onAddressChange(e.target.value)}
      />
      <ChainSelector
        value={chainId}
        onValueChange={onChainChange}
        className="w-32"
        hideLabel={true}
      />
      {showFetchButton && <Button onClick={onSubmit}>Fetch</Button>}
    </div>
  );
};
