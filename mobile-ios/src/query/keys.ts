import { userKeys } from '@/users/query/keys';

export const queryKeys = {
  hadiths: {
    all: ['hadiths'] as const,
    search: (query: string) => ['hadiths', 'search', query] as const,
    detail: (id: string) => ['hadiths', 'detail', id] as const,
    saved: ['hadiths', 'saved'] as const,
    admin: ['hadiths', 'admin'] as const,
    user: (prefs: string, topic: string, query: string, page: number) =>
      ['hadiths', 'user', prefs, topic, query, page] as const,
    userSaved: (topic: string, query: string, page: number) =>
      ['hadiths', 'user-saved', topic, query, page] as const,
  },
  ask: {
    all: ['ask'] as const,
  },
  users: userKeys,
};
