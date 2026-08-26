import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from '@/configs/api';
import { errorMessage } from '@/services/auth';

export type Hadith = {
  id: string;
  collection: string;
  number: string;
  arabic: string;
  english: string;
  narrator: string;
  grade?: string;
};

export type CreateHadithInput = {
  book: string;
  hadithNumber: number;
  arabicNumber: number;
  translation: {
    english: string;
    urdu: string;
    arabic: string;
  };
  narrator: string;
  grade: string[];
  topic: string;
  chapter: string;
  reference: {
    book: number;
    hadith: number;
  };
  text: string;
  description: string;
};

export type HadithRecord = CreateHadithInput & {
  id: string;
};

type HadithResponse = {
  message?: string | string[];
  hadith?: HadithRecord;
  hadiths?: HadithRecord[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  topics?: string[];
};

export type HadithPage = {
  hadiths: HadithRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  topics: string[];
};

function messageFrom(data: HadithResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? 'Request failed';
}

function toHadithPage(
  data: HadithResponse,
  page: number,
  limit: number,
): HadithPage {
  const rows = data.hadiths ?? [];
  const pageSize = Math.max(1, limit);
  const currentPage = Math.max(1, page);

  if (rows.length > pageSize) {
    const start = (currentPage - 1) * pageSize;
    return {
      hadiths: rows.slice(start, start + pageSize),
      total: rows.length,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
      topics: data.topics ?? [],
    };
  }

  const total = data.total ?? rows.length;
  return {
    hadiths: rows,
    total,
    page: data.page ?? currentPage,
    limit: data.limit ?? pageSize,
    totalPages: data.totalPages ?? Math.max(1, Math.ceil(total / pageSize) || 1),
    topics: data.topics ?? [],
  };
}

export async function createHadith(input: CreateHadithInput) {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');

  const response = await fetch(`${apiConfig.baseUrl}/hadith`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadith;
}

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');
  return { Authorization: `Bearer ${token}` };
}

export async function listHadiths(
  query = '',
  topic = '',
  page = 1,
  limit = 3,
): Promise<HadithPage> {
  const headers = await authHeaders();
  const search = new URLSearchParams();
  if (query.trim()) search.set('q', query.trim());
  if (topic.trim()) search.set('topic', topic.trim());
  search.set('page', String(page));
  search.set('limit', String(limit));
  const response = await fetch(`${apiConfig.baseUrl}/hadith?${search}`, { headers });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return toHadithPage(data, page, limit);
}

export async function listUserHadiths(
  query = '',
  topic = '',
  page = 1,
  limit = 3,
): Promise<HadithPage> {
  const headers = await authHeaders();
  const search = new URLSearchParams();
  if (query.trim()) search.set('q', query.trim());
  if (topic.trim()) search.set('topic', topic.trim());
  search.set('page', String(page));
  search.set('limit', String(limit));
  const response = await fetch(`${apiConfig.baseUrl}/hadith/user?${search}`, {
    headers,
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return toHadithPage(data, page, limit);
}

export async function listUserSavedHadiths(
  query = '',
  topic = '',
  page = 1,
  limit = 3,
): Promise<HadithPage> {
  const headers = await authHeaders();
  const search = new URLSearchParams();
  if (query.trim()) search.set('q', query.trim());
  if (topic.trim()) search.set('topic', topic.trim());
  search.set('page', String(page));
  search.set('limit', String(limit));
  const response = await fetch(
    `${apiConfig.baseUrl}/hadith/user/saved?${search}`,
    { headers },
  );
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return toHadithPage(data, page, limit);
}

export async function updateHadith(id: string, input: CreateHadithInput) {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');

  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadith;
}

export async function deleteHadith(id: string) {
  const headers = await authHeaders();
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}`, {
    method: 'DELETE',
    headers,
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
}

export async function searchHadiths(_query: string): Promise<Hadith[]> {
  return [];
}

export async function getHadithById(_id: string): Promise<Hadith | null> {
  return null;
}

export async function getSavedHadiths(): Promise<HadithRecord[]> {
  const headers = await authHeaders();
  const response = await fetch(`${apiConfig.baseUrl}/hadith/saved`, { headers });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadiths ?? [];
}

export async function saveHadith(id: string) {
  const headers = await authHeaders();
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}/save`, {
    method: 'POST',
    headers,
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
}

export async function unsaveHadith(id: string) {
  const headers = await authHeaders();
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}/save`, {
    method: 'DELETE',
    headers,
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
}

export { errorMessage };
