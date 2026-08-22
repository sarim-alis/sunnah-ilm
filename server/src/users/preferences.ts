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

export type PublicPreference = {
  id: string;
  name: string;
};

export const MAX_PREFERENCE_TOPICS = 3;

export function uniqueTopicNames(values: unknown): HadithTopic[] {
  if (values && typeof values === 'object' && !Array.isArray(values) && 'topics' in values) {
    values = (values as { topics: unknown }).topics;
  }
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

export function toPublicPreferences(
  preferences?: { id?: string; name: string }[] | null,
): PublicPreference[] {
  return uniqueTopicNames(preferences).map((name) => {
    const match = preferences?.find((item) => item.name === name);
    return { id: match?.id ?? name, name };
  });
}
