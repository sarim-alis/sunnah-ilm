import { askSunnahQuestion } from '@/services/ai';
import { queryKeys } from './keys';

export function askQuestionQuery(question: string) {
  return {
    queryKey: [...queryKeys.ask.all, question] as const,
    queryFn: () => askSunnahQuestion(question),
  };
}
