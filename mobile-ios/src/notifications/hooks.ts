import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/keys';
import {
  createNotification,
  listNotifications,
  markAllNotificationsRead,
  setNotificationRead,
} from '@/services/inbox';
import type { AppNotification } from '@/types';

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: listNotifications,
    retry: 1,
    refetchOnMount: 'always',
  });
}

export function useUnreadNotificationCount() {
  const query = useNotifications();
  return query.data?.unreadCount ?? 0;
}

export function useCreateNotification() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useSetNotificationRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      setNotificationRead(id, isRead),
    onMutate: async ({ id, isRead }) => {
      await client.cancelQueries({ queryKey: queryKeys.notifications.list });
      const previous = client.getQueryData<{
        notifications: AppNotification[];
        unreadCount: number;
      }>(queryKeys.notifications.list);
      if (previous) {
        const notifications = previous.notifications.map((item) =>
          item.id === id ? { ...item, isRead } : item,
        );
        client.setQueryData(queryKeys.notifications.list, {
          notifications,
          unreadCount: notifications.filter((item) => !item.isRead).length,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        client.setQueryData(queryKeys.notifications.list, context.previous);
      }
    },
    onSettled: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
