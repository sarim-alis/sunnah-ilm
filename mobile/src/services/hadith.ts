export type Hadith = {
  id: string;
  collection: string;
  number: string;
  arabic: string;
  english: string;
  narrator: string;
  grade?: string;
};

export async function searchHadiths(_query: string): Promise<Hadith[]> {
  return [];
}

export async function getHadithById(_id: string): Promise<Hadith | null> {
  return null;
}

export async function getSavedHadiths(): Promise<Hadith[]> {
  return [];
}
