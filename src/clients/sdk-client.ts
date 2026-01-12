import { makeSDK } from "@summer_fi/sdk-client";
import { configDotenv } from "dotenv";
import { EnvironmentType, Environment } from "@/types";

configDotenv();

const getApiDomainUrl = (environment: EnvironmentType): string => {
  switch (environment) {
    case Environment.Local:
      if (!process.env.SDK_API_URL_LOCAL) {
        throw new Error(
          "SDK_API_URL_LOCAL is not defined in environment variables"
        );
      }
      return process.env.SDK_API_URL_LOCAL;
    case Environment.Staging:
      if (!process.env.SDK_API_URL_STAGING) {
        throw new Error(
          "SDK_API_URL_STAGING is not defined in environment variables"
        );
      }
      return process.env.SDK_API_URL_STAGING;
    case Environment.Prod:
      if (!process.env.SDK_API_URL_PROD) {
        throw new Error(
          "SDK_API_URL_PROD is not defined in environment variables"
        );
      }
      return process.env.SDK_API_URL_PROD;
    default:
      throw new Error(`Unknown environment: ${environment}`);
  }
};

/**
 * Factory function to create an SDK instance for a specific environment
 * @param environment - The environment to create the SDK for (local, staging, prod)
 * @returns SDK instance configured for the specified environment
 */
export const createSDK = (
  environment: EnvironmentType,
  version: "v1" | "v2" = "v2"
) => {
  const apiDomainUrl = getApiDomainUrl(environment);

  return makeSDK({
    apiDomainUrl,
    version,
    logging: process.env.NODE_ENV === "development",
  });
};
