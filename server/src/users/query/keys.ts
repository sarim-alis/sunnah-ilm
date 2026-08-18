export const userKeys = {
  all: ['users'] as const,
  email: (email: string) => [...userKeys.all, 'email', email] as const,
  id: (id: string) => [...userKeys.all, 'id', id] as const,
};
