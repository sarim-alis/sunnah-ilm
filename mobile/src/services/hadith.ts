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
};

function messageFrom(data: HadithResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? 'Request failed';
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

export async function listHadiths(query = '') {
  const headers = await authHeaders();
  const url = query.trim()
    ? `${apiConfig.baseUrl}/hadith?q=${encodeURIComponent(query.trim())}`
    : `${apiConfig.baseUrl}/hadith`;
  const response = await fetch(url, { headers });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadiths ?? [];
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

export async function getSavedHadiths(): Promise<Hadith[]> {
  return [];
}

export { errorMessage };
