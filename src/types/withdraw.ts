import type { ChainId, AddressValue } from "@summer_fi/sdk-client";

export type WithdrawParams = {
  chainId: ChainId;
  senderAddress: AddressValue;
  fleetAddress: AddressValue;
  assetTokenSymbol: string;
};
