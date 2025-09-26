import React from "react";
import { Button } from "../ui/button";
import { ChainSelector } from "./ChainSelector";
import AddressSelector from "./AddressSelector";
import { useUserAddressModal } from "@/hooks/useUserAddressModal";
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
  chainId,
  onAddressChange,
  onChainChange,
  onSubmit,
  className,
  showFetchButton = false,
}) => {
  const { userAddress, openModal, Modal } = useUserAddressModal();

  React.useEffect(() => {
    // Notify parent when global userAddress changes. Pass empty string if undefined to match previous string-only callback.
    onAddressChange(userAddress ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return (
    <div className={cn("flex gap-2 mb-4", className)}>
      <AddressSelector onOpen={openModal} />
      {/* Render modal for editing the user address */}
      <Modal />

      <ChainSelector
        value={chainId}
        onValueChange={onChainChange}
        className="w-36"
        hideLabel={true}
      />
      {showFetchButton && <Button onClick={onSubmit}>Fetch</Button>}
    </div>
  );
};
