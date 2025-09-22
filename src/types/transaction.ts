/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type AddressValue,
  type HexData,
  type TransactionInfo,
} from "@summer_fi/sdk-client";

export interface Transaction {
  to: AddressValue;
  data: HexData;
  value: string;
  gas?: string;
  type: "approval" | "operation";
  description: string;
  metadata?: any;
}

export const mapSdkTransactionToTransaction = (
  tx: TransactionInfo
): Transaction => {
  return {
    to: tx.transaction.target.value,
    data: tx.transaction.calldata,
    value: tx.transaction.value,
    gas: undefined,
    description: tx.description,
    type: (tx as any).type === "Approve" ? "approval" : "operation",
    metadata: (tx as any).metadata,
  };
};
