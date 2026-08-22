import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class HadithTranslationDto {
  @IsString()
  english!: string;

  @IsOptional()
  @IsString()
  urdu?: string;

  @IsOptional()
  @IsString()
  arabic?: string;
}

export class HadithReferenceDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  book!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  hadith!: number;
}

export class CreateHadithDto {
  @IsString()
  book!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  hadithNumber!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  arabicNumber!: number;

  @ValidateNested()
  @Type(() => HadithTranslationDto)
  translation!: HadithTranslationDto;

  @IsString()
  narrator!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grade?: string[];

  @IsString()
  topic!: string;

  @IsOptional()
  @IsString()
  chapter?: string;

  @ValidateNested()
  @Type(() => HadithReferenceDto)
  reference!: HadithReferenceDto;

  @IsString()
  text!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
