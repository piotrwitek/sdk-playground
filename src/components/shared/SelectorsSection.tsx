import React from "react";
import { Button } from "../ui/button";
import { ChainSelector } from "./ChainSelector";
import { useUserAddress } from "@/hooks/useUserAddress";
import { cn } from "../../lib/utils";
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
  const { UserAddressModal: Modal, UserAddressSelector: AddressSelector } =
    useUserAddress();
  const { chainId, setChainId } = useGlobalState();

  return (
    <div className={cn("flex gap-2 mb-4", className)}>
      <AddressSelector />
      {/* Render modal for editing the user address */}
      <Modal />

      <ChainSelector
        value={chainId}
        onValueChange={setChainId}
        className="w-36"
        hideLabel={true}
      />
      {showFetchButton && <Button onClick={onSubmit}>Fetch</Button>}
    </div>
  );
};
