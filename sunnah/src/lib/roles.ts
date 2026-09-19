import { USER_ROLES } from "@/types";
import type { UserRole } from "@/types";

export { USER_ROLES };
export type { UserRole };

export function normalizeRole(value: unknown): UserRole {
  return value === "admin" ? "admin" : "user";
}
