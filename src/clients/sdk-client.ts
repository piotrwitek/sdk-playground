import { makeSDK } from "@summer_fi/sdk-client";
import { configDotenv } from "dotenv";

configDotenv();
const apiDomainUrl = process.env.SDK_API_URL;
if (!apiDomainUrl) {
  throw new Error("SDK_API_URL is not defined in environment variables");
}

// Initialize the SDK with the API domain URL and logging enabled in development mode

export const sdk = makeSDK({
  apiDomainUrl,
  // version: "v1",
  logging: process.env.NODE_ENV === "development",
});
