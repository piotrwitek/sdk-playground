import React from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { truncateHex } from "@/lib/truncators";

interface AddressPillProps {
  onOpen: () => void;
}

export function AddressPill({ onOpen }: AddressPillProps) {
  const { userAddress } = useGlobalState();

  return (
    <button
      onClick={onOpen}
      className="flex items-center space-x-3 px-3 py-2 rounded-full bg-white border shadow-sm hover:shadow-md"
    >
      <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" />
      <span className="text-sm font-medium text-slate-700">
        {userAddress ? truncateHex(userAddress, 8) : "No address"}
      </span>
    </button>
  );
}

export default AddressPill;
