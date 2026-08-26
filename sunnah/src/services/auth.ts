import { apiConfig } from "@/lib/config";
import { errorMessage } from "@/lib/errors";
import { normalizeMode, type AppMode } from "@/lib/mode";
import { normalizeRole, type UserRole } from "@/lib/roles";
import { clearSession, getStoredUser, getToken, setStoredUser, setToken } from "@/lib/storage";
import { normalizePreferences, type UserPreference } from "@/lib/topics";

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
  user?: AuthUser;
  token?: string;
};

function messageFrom(data: AuthResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? "Request failed";
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

export function readCachedUser(): AuthUser | null {
  const user = getStoredUser<AuthUser>();
  return user ? toAuthUser(user) : null;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${apiConfig.baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  if (!data.token || !data.user) throw new Error("Login failed");

  const user = toAuthUser(data.user);
  if (user.role !== "admin") {
    throw new Error("Admin only. Use the mobile app to sign in.");
  }

  setToken(data.token);
  setStoredUser(user);
  return { user, token: data.token };
}

export async function logout() {
  clearSession();
}

export async function getProfile(): Promise<AuthUser> {
  const token = getToken();
  if (!token) throw new Error("Please log in again");

  const response = await fetch(`${apiConfig.baseUrl}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await response.json()) as AuthResponse;
  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new Error(messageFrom(data));
  }
  if (!data.user) throw new Error("Request failed");
  const user = toAuthUser(data.user);
  if (user.role !== "admin") {
    clearSession();
    throw new Error("Admin only");
  }
  setStoredUser(user);
  return user;
}

export async function updateProfile(input: {
  name: string;
  email: string;
  mode?: AppMode;
  image?: File | null;
}) {
  const token = getToken();
  if (!token) throw new Error("Please log in again");

  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("email", input.email);
  if (input.mode) formData.append("mode", input.mode);
  if (input.image) formData.append("image", input.image);

  const response = await fetch(`${apiConfig.baseUrl}/users/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const payload = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(messageFrom(payload));
  if (!payload.user) throw new Error("Request failed");
  const user = toAuthUser(payload.user);
  setStoredUser(user);
  return user;
}

export async function deleteAccount() {
  const token = getToken();
  if (!token) throw new Error("Please log in again");

  const response = await fetch(`${apiConfig.baseUrl}/users/account`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await response.json()) as AuthResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  clearSession();
}

export { errorMessage };
