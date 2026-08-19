import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from '@/configs/api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
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
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  return data;
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
}) {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  if (data.password) formData.append('password', data.password);

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
  await AsyncStorage.setItem('user', JSON.stringify(payload.user));
  return payload.user;
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
}

export async function getUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem('user');
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}
