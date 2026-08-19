import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser, login, logout, updateProfile } from '@/services/auth';
import { queryClient } from '@/query/client';
import { userKeys } from './query/keys';
import { currentUserQuery } from './query/profile';

export function useCurrentUser() {
  return useQuery(currentUserQuery());
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      client.setQueryData(userKeys.me(), user);
    },
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      client.setQueryData(userKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      client.setQueryData(userKeys.me(), null);
      client.removeQueries({ queryKey: userKeys.all });
    },
  });
}

export async function hydrateCurrentUser() {
  const user = await getUser();
  queryClient.setQueryData(userKeys.me(), user);
  return user;
}
