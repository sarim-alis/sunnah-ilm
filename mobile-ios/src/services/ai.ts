import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiConfig } from '@/configs/api';
import type { HadithRecord } from '@/services/hadith';

export type AskHadithResult = {
  topic: string;
  question: string;
  hadiths: HadithRecord[];
  explanation: string;
};

type AskResponse = {
  message?: string | string[];
  topic?: string;
  question?: string;
  hadiths?: HadithRecord[];
  explanation?: string;
};

function messageFrom(data: AskResponse) {
  if (Array.isArray(data.message)) return data.message[0];
  return data.message ?? 'Request failed';
}

function stripExplanationLabel(text: string): string {
  return text
    .replace(
      /^(?:\*\*)?(?:explanation(?:\s+only)?|answer)(?:\*\*)?\s*:?\s*/i,
      '',
    )
    .trim();
}

export function friendlyAskError(message: string): string {
  if (/high demand|overloaded|resource exhausted|rate limit|try again later/i.test(message)) {
    return 'AI is busy right now. Please wait a moment and try again.';
  }
  if (/not configured|api key|permission|invalid/i.test(message)) {
    return 'AI service is not available right now. Please try again later.';
  }
  return message;
}

export async function askHadith(
  topic: string,
  question: string,
): Promise<AskHadithResult> {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Please log in again');

  const response = await fetch(`${apiConfig.baseUrl}/ask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, question: question.trim() }),
  });
  const data = (await response.json()) as AskResponse;
  if (!response.ok) throw new Error(messageFrom(data));

  return {
    topic: data.topic ?? topic,
    question: data.question ?? question.trim(),
    hadiths: data.hadiths ?? [],
    explanation: stripExplanationLabel(data.explanation ?? ''),
  };
}
