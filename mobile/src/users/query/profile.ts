import { queryOptions } from '@tanstack/react-query';
import { getProfile, getToken, getUser } from '@/services/auth';
import type { AuthUser } from '@/types';
import { userKeys } from './keys';

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await getProfile();
  } catch {
    return getUser();
  }
}

export function currentUserQuery() {
  return queryOptions({
    queryKey: userKeys.me(),
    queryFn: fetchCurrentUser,
    staleTime: 30_000,
  });
}
