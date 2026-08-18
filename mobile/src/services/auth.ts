import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from '@/configs/api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
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

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
}

export async function getUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem('user');
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}
