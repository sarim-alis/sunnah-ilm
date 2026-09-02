import { IsIn, IsString, MinLength } from 'class-validator';
import { HADITH_TOPICS } from '../../users/preferences';

export class AskHadithDto {
  @IsString()
  @IsIn([...HADITH_TOPICS])
  topic!: string;

  @IsString()
  @MinLength(3)
  question!: string;
}
