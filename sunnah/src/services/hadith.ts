import { apiConfig } from "@/lib/config";
import { getToken } from "@/lib/storage";

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
};

export type HadithPage = {
  hadiths: HadithRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

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
    };
  }

  const total = data.total ?? rows.length;
  return {
    hadiths: rows,
    total,
    page: data.page ?? currentPage,
    limit: data.limit ?? pageSize,
    totalPages: data.totalPages ?? Math.max(1, Math.ceil(total / pageSize) || 1),
  };
}

function messageFrom(data: HadithResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? "Request failed";
}

function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("Please log in again");
  return { Authorization: `Bearer ${token}` };
}

export async function createHadith(input: CreateHadithInput) {
  const response = await fetch(`${apiConfig.baseUrl}/hadith`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadith;
}

export async function listHadiths(
  query = "",
  topic = "",
  page = 1,
  limit = 3,
): Promise<HadithPage> {
  const search = new URLSearchParams();
  if (query.trim()) search.set("q", query.trim());
  if (topic.trim()) search.set("topic", topic.trim());
  search.set("page", String(page));
  search.set("limit", String(limit));
  const response = await fetch(`${apiConfig.baseUrl}/hadith?${search}`, {
    headers: authHeaders(),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return toHadithPage(data, page, limit);
}

export async function updateHadith(id: string, input: CreateHadithInput) {
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadith;
}

export async function deleteHadith(id: string) {
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
}

export async function getSavedHadiths() {
  const response = await fetch(`${apiConfig.baseUrl}/hadith/saved`, {
    headers: authHeaders(),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
  return data.hadiths ?? [];
}

export async function saveHadith(id: string) {
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}/save`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
}

export async function unsaveHadith(id: string) {
  const response = await fetch(`${apiConfig.baseUrl}/hadith/${id}/save`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = (await response.json()) as HadithResponse;
  if (!response.ok) throw new Error(messageFrom(data));
}
