import type { AppMode } from "@/lib/mode";

export const USER_ROLES = ["user", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type UserPreference = {
  id: string;
  name: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  preferences: UserPreference[];
  mode: AppMode;
  role: UserRole;
};
