import type { ChainId, AddressValue } from "@summer_fi/sdk-client";
import type { EnvironmentType } from "./environment";

export type WithdrawParams = {
  chainId: ChainId;
  senderAddress: AddressValue;
  fleetAddress: AddressValue;
  assetTokenSymbol: string;
  environment: EnvironmentType;
};
