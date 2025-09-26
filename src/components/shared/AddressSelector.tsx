import React from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { truncateHex } from "@/lib/truncators";

interface AddressSelectorProps {
  onOpen: () => void;
  className?: string;
}

export function AddressSelector({
  onOpen,
  className = "",
}: AddressSelectorProps) {
  const { userAddress } = useGlobalState();

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={onOpen}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <div className="flex items-center space-x-3">
          <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-sm font-medium text-slate-700">
            {userAddress ? truncateHex(userAddress, 8) : "No address"}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-slate-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default AddressSelector;
