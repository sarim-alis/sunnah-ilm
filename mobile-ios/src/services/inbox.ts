import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from 'expo/fetch';
import { apiConfig } from '@/configs/api';
import type { AppNotification, CreateNotificationInput } from '@/types';

type InboxResponse = {
  message?: string | string[];
  notifications?: AppNotification[];
  notification?: AppNotification;
  unreadCount?: number;
};

function messageFrom(data: InboxResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? 'Request failed';
}

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...init,
    headers: {
      ...(await authHeaders()),
      ...(init?.headers ?? {}),
    },
  });
  const data = (await response.json()) as InboxResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data;
}

export async function listNotifications() {
  const data = await request('/notifications');
  return {
    notifications: data.notifications ?? [],
    unreadCount: data.unreadCount ?? 0,
  };
}

export async function createNotification(input: CreateNotificationInput) {
  const data = await request('/notifications', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.notification;
}

export async function setNotificationRead(id: string, isRead: boolean) {
  const data = await request(`/notifications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isRead }),
  });
  return data.notification;
}

export async function markAllNotificationsRead() {
  await request('/notifications/read-all', { method: 'PATCH' });
}
