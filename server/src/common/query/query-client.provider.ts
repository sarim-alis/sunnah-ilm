import { QueryClient } from '@tanstack/query-core';
export const QUERY_CLIENT = 'QUERY_CLIENT';

export const queryClientProvider = {
  provide: QUERY_CLIENT,
  useFactory: () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          gcTime: 5 * 60_000,
        },
      },
    }),
};
