import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser, login, logout, updateProfile, type AuthUser } from '@/services/auth';
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
    onMutate: async (data) => {
      void client.cancelQueries({ queryKey: userKeys.me() });
      const previous = client.getQueryData<AuthUser | null>(userKeys.me());
      if (!previous) return { previous };

      const next: AuthUser = {
        ...previous,
        name: data.name,
        email: data.email,
        mode: data.mode ?? previous.mode,
        preferences: data.preferences
          ? data.preferences.topics.map((name) => ({ id: name, name }))
          : previous.preferences,
      };
      client.setQueryData(userKeys.me(), next);
      void AsyncStorage.setItem('user', JSON.stringify(next));
      return { previous };
    },
    onError: async (_err, _data, context) => {
      if (!context?.previous) return;
      client.setQueryData(userKeys.me(), context.previous);
      await AsyncStorage.setItem('user', JSON.stringify(context.previous));
    },
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

export function useToggleMode() {
  const client = useQueryClient();
  const { data: user } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  return async () => {
    if (!user) return;
    const next = user.mode === 'dark' ? 'light' : 'dark';
    client.setQueryData(userKeys.me(), { ...user, mode: next });
    try {
      await updateProfileMutation.mutateAsync({
        name: user.name,
        email: user.email,
        mode: next,
      });
    } catch (err) {
      client.setQueryData(userKeys.me(), user);
      throw err;
    }
  };
}

export async function hydrateCurrentUser() {
  const user = await getUser();
  queryClient.setQueryData(userKeys.me(), user);
  return user;
}
