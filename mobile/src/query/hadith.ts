import { getHadithById, getSavedHadiths, searchHadiths } from '@/services/hadith';
import { queryKeys } from './keys';

export function searchHadithsQuery(query: string) {
  return {
    queryKey: queryKeys.hadiths.search(query),
    queryFn: () => searchHadiths(query),
  };
}

export function hadithByIdQuery(id: string) {
  return {
    queryKey: queryKeys.hadiths.detail(id),
    queryFn: () => getHadithById(id),
  };
}

export function savedHadithsQuery() {
  return {
    queryKey: queryKeys.hadiths.saved,
    queryFn: () => getSavedHadiths(),
  };
}
