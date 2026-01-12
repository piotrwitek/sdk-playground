export const Environment = {
  Local: "local",
  Staging: "staging",
  Prod: "prod",
} as const;

export type EnvironmentType = (typeof Environment)[keyof typeof Environment];

export const environmentLabels: Record<EnvironmentType, string> = {
  [Environment.Local]: "Local",
  [Environment.Staging]: "Staging",
  [Environment.Prod]: "Production",
};

export function isValidEnvironment(value: unknown): value is EnvironmentType {
  return Object.values(Environment).includes(value as EnvironmentType);
}
