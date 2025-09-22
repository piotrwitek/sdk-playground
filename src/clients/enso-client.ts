import { EnsoClient } from "@ensofinance/sdk";

const ENSO_API_KEY = process.env.ENSO_API_KEY;
if (!ENSO_API_KEY) {
  throw new Error("ENSO_API_KEY is not defined");
}

export const ensoClient = new EnsoClient({
  apiKey: ENSO_API_KEY,
});
