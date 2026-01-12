import type { ChainId, AddressValue } from "@summer_fi/sdk-client";
import type { EnvironmentType } from "./environment";

export type DepositParams = {
  chainId: ChainId;
  senderAddress: AddressValue;
  fleetAddress: AddressValue;
  assetTokenSymbol: string;
  environment: EnvironmentType;
};
