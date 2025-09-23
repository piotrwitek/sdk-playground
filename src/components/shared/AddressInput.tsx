import React from "react";
import { cn } from "../../lib/utils";

interface AddressInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "User address",
  className,
}) => {
  return (
    <input
      className={cn("border px-2 py-1 rounded w-80", className)}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
