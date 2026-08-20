export const HADITH_TOPICS = [
  'Namaz',
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

export type UserPreferences = {
  topics: HadithTopic[];
};

export const MAX_PREFERENCE_TOPICS = 5;

export const defaultPreferences: UserPreferences = {
  topics: [],
};

export function normalizePreferences(value: unknown): UserPreferences {
  const raw =
    value && typeof value === 'object' ? (value as Partial<UserPreferences>) : {};
  if (!Array.isArray(raw.topics)) return { topics: [] };

  const allowed = new Set<string>(HADITH_TOPICS);
  const topics: HadithTopic[] = [];
  for (const item of raw.topics) {
    if (typeof item === 'string' && allowed.has(item) && !topics.includes(item as HadithTopic)) {
      topics.push(item as HadithTopic);
    }
    if (topics.length >= MAX_PREFERENCE_TOPICS) break;
  }
  return { topics };
}
