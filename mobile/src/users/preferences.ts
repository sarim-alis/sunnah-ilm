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

export type UserPreference = {
  id: string;
  name: string;
};

export const MAX_PREFERENCE_TOPICS = 3;

export function uniqueTopicNames(values: unknown): HadithTopic[] {
  if (!Array.isArray(values)) return [];
  const allowed = new Set<string>(HADITH_TOPICS);
  const topics: HadithTopic[] = [];
  for (const item of values) {
    const name =
      typeof item === 'string'
        ? item
        : item && typeof item === 'object' && 'name' in item
          ? String((item as { name: unknown }).name)
          : '';
    if (allowed.has(name) && !topics.includes(name as HadithTopic)) {
      topics.push(name as HadithTopic);
    }
    if (topics.length >= MAX_PREFERENCE_TOPICS) break;
  }
  return topics;
}

export function normalizePreferences(value: unknown): UserPreference[] {
  if (Array.isArray(value)) {
    return uniqueTopicNames(value).map((name) => {
      const match = value.find(
        (item) =>
          item &&
          typeof item === 'object' &&
          'name' in item &&
          (item as { name: unknown }).name === name,
      ) as { id?: string } | undefined;
      return { id: match?.id ?? name, name };
    });
  }
  if (value && typeof value === 'object' && 'topics' in value) {
    return uniqueTopicNames((value as { topics: unknown }).topics).map((name) => ({
      id: name,
      name,
    }));
  }
  return [];
}

export function preferenceNames(preferences: UserPreference[]): HadithTopic[] {
  return uniqueTopicNames(preferences);
}
