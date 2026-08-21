import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from '@/configs/api';
import { normalizeMode } from '@/constants/colors';
import type { AppMode } from '@/constants/colors';
import { normalizePreferences } from '@/users/preferences';
import type { UserPreference } from '@/users/preferences';
import { normalizeRole } from '@/users/roles';
import type { UserRole } from '@/users/roles';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  preferences: UserPreference[];
  mode: AppMode;
  role: UserRole;
};

type AuthResponse = {
  message?: string | string[];
  user: AuthUser;
  token?: string;
};

function messageFrom(data: AuthResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? 'Request failed';
}

export function errorMessage(err: unknown, fallback: string) {
  if (typeof err === 'string' && err.length > 0) return err;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const message = (err as { message: unknown }).message;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return fallback;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${apiConfig.baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  if (!data.token) throw new Error('Login failed');
  const user = toAuthUser(data.user);
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return { ...data, user };
}

export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${apiConfig.baseUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data;
}

export async function updateProfile(data: {
  name: string;
  email: string;
  password?: string;
  imageUri?: string | null;
  preferences?: { topics: string[] };
  mode?: AppMode;
}) {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  if (data.password) formData.append('password', data.password);
  if (data.preferences) {
    formData.append('preferences', JSON.stringify(data.preferences));
  }
  if (data.mode) formData.append('mode', data.mode);

  if (data.imageUri) {
    formData.append('image', {
      uri: data.imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as unknown as Blob);
  }

  const response = await fetch(`${apiConfig.baseUrl}/users/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const payload = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(messageFrom(payload));
  const user = toAuthUser(payload.user);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
}

export async function getToken() {
  return AsyncStorage.getItem('token');
}

export async function getUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem('user');
  return raw ? toAuthUser(JSON.parse(raw) as AuthUser) : null;
}

function toAuthUser(user: AuthUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl ?? null,
    preferences: normalizePreferences(user.preferences),
    mode: normalizeMode(user.mode),
    role: normalizeRole(user.role),
  };
}

export async function getProfile(): Promise<AuthUser> {
  const token = await getToken();
  if (!token) throw new Error('Please log in again');

  const response = await fetch(`${apiConfig.baseUrl}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await response.json()) as AuthResponse;
  if (!response.ok) {
    if (response.status === 401) await logout();
    throw new Error(messageFrom(data));
  }
  if (!data.user) throw new Error('Request failed');

  const user = toAuthUser(data.user);
  await AsyncStorage.setItem('user', JSON.stringify(user));
  return user;
}
