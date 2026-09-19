import { HADITH_TOPICS } from "@/types";
import type { HadithTopic, UserPreference } from "@/types";

export { HADITH_TOPICS };
export type { HadithTopic, UserPreference };

export function uniqueTopicNames(values: unknown): HadithTopic[] {
  if (!Array.isArray(values)) return [];
  const allowed = new Set<string>(HADITH_TOPICS);
  const topics: HadithTopic[] = [];
  for (const item of values) {
    const name =
      typeof item === "string"
        ? item
        : item && typeof item === "object" && "name" in item
          ? String((item as { name: unknown }).name)
          : "";
    if (allowed.has(name) && !topics.includes(name as HadithTopic)) {
      topics.push(name as HadithTopic);
    }
  }
  return topics;
}

export function normalizePreferences(value: unknown): UserPreference[] {
  if (!Array.isArray(value)) return [];
  return uniqueTopicNames(value).map((name) => ({ id: name, name }));
}
