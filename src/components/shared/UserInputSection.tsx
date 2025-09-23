import React from "react";
import { Button } from "../ui/button";
import { ChainSelector } from "./ChainSelector";
import { AddressInput } from "./AddressInput";
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
      <AddressInput
        value={address}
        onChange={onAddressChange}
        placeholder={addressPlaceholder}
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
