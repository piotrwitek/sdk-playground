import type { ChainId, AddressValue } from "@summer_fi/sdk-client";

export type DepositParams = {
  chainId: ChainId;
  senderAddress: AddressValue;
  fleetAddress: AddressValue;
  assetTokenSymbol: string;
};
