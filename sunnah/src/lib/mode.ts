export type AppMode = "light" | "dark";

export function normalizeMode(value: unknown): AppMode {
  return value === "dark" ? "dark" : "light";
}
