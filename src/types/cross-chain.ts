import type { AddressValue, ChainId } from "@summer_fi/sdk-client";

export type CrossChainParams = {
  sourceChainId: ChainId;
  destinationChainId: ChainId;
  senderAddress: AddressValue;
  fleetAddress: AddressValue;
  sourceTokenSymbol: string;
  assetTokenSymbol: string;
  amount: string;
};
