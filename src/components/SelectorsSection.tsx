import React from "react";
import { Button } from "./ui/button";
import { ChainSelector } from "./ChainSelector";
import { useUserAddress } from "@/components/hooks/useUserAddress";
import { cn } from "../lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";

interface UserInputSectionProps {
  onSubmit: () => void;
  className?: string;
  showFetchButton?: boolean;
}

export const SelectorsSection: React.FC<UserInputSectionProps> = ({
  onSubmit,
  className,
  showFetchButton = false,
}) => {
  const { UserAddressSelector } = useUserAddress();
  const { chainId, setChainId } = useGlobalState();

  return (
    <div className={cn("flex items-center gap-2 mb-4", className)}>
      <UserAddressSelector />

      <ChainSelector
        value={chainId}
        onValueChange={setChainId}
        className="w-36"
        hideLabel={true}
      />
      {showFetchButton && <Button onClick={onSubmit}>Refetch</Button>}
    </div>
  );
};
