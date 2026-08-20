import { ArrayMaxSize, IsArray, IsIn } from 'class-validator';
import { HADITH_TOPICS, MAX_PREFERENCE_TOPICS } from '../../users/preferences';

export class UserPreferencesDto {
  @IsArray()
  @ArrayMaxSize(MAX_PREFERENCE_TOPICS)
  @IsIn([...HADITH_TOPICS], { each: true })
  topics!: string[];
}
