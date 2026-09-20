export const HADITH_TOPICS = [
  'Quran',
  'Parents',
  'Marriage',
  'Prayer',
  'Love',
  'Health',
  'Anger',
  'Death',
  'Education',
] as const;

export type HadithTopic = (typeof HADITH_TOPICS)[number];

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

export type HadithPage = {
  hadiths: HadithRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  topics: string[];
};

export type AskHadithResult = {
  topic: string;
  question: string;
  hadiths: HadithRecord[];
  explanation: string;
};

export type DailyHadith = {
  hadith: HadithRecord | null;
  date: string;
};
