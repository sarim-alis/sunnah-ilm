export const HADITH_TOPICS = [
  "Quran",
  "Parents",
  "Marriage",
  "Prayer",
  "Love",
  "Health",
  "Anger",
  "Death",
  "Education",
] as const;

export type HadithTopic = (typeof HADITH_TOPICS)[number];

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
};
