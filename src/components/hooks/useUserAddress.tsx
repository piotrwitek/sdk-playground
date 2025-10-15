import { useState } from "react";
import { useAccount } from "wagmi";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useModal } from "@/components/hooks/useModal";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import React from "react";

export function useUserAddress() {
  const { address: connectedAddress } = useAccount();
  const { userAddress, setUserAddress } = useGlobalState();

  const modal = useModal(false);
  const [inputValue, setInputValue] = useState<string>(userAddress ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const openUserAddressModal = () => {
    setInputValue(userAddress ?? "");
    setValidationError(null);
    modal.open();
  };

  const closeUserAddressModal = () => {
    modal.close();
  };

  function isValidAddress(addr?: string) {
    if (!addr) return false;
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(addr);
  }

  const saveAddress = () => {
    if (!isValidAddress(inputValue)) {
      setValidationError("Invalid address format");
      return;
    }
    setUserAddress(inputValue || undefined);
    modal.close();
  };

  const setToConnected = () => {
    if (connectedAddress) setInputValue(connectedAddress);
  };

  const UserAddressModal: React.FC = () => {
    if (!modal.isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeUserAddressModal}
        />

        <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg m-4">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Set User Address</h2>
            <button
              className="h-8 w-8 p-1 text-muted-foreground"
              onClick={closeUserAddressModal}
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </div>

          <div className="p-4">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Address
            </label>
            <input
              className="w-full rounded border px-3 py-2 mb-3"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste address or use connected wallet"
            />
            {validationError && (
              <div className="text-sm text-red-500 mb-2">{validationError}</div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button variant="outline" onClick={setToConnected}>
                  Use Connected Wallet
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={closeUserAddressModal}>
                  Cancel
                </Button>
                <Button
                  onClick={saveAddress}
                  disabled={!isValidAddress(inputValue)}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UserAddressSelector: React.FC<{ className?: string }> = ({
    className = "",
  }) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <button
          onClick={openUserAddressModal}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />
            <span className="text-sm font-medium text-slate-700">
              {userAddress
                ? userAddress.slice(0, 8) + "..." + userAddress.slice(-4)
                : "No address"}
            </span>
          </div>
        </button>
        <UserAddressModal />
      </div>
    );
  };

  return {
    userAddress,
    setUserAddress,
    openUserAddressModal,
    closeUserAddressModal,
    UserAddressSelector,
  } as const;
}

export default useUserAddress;
