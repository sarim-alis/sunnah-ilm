export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function normalizeRole(value: unknown): UserRole {
  return value === 'admin' ? 'admin' : 'user';
}
