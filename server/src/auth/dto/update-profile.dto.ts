import { IsEmail, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserPreferencesDto } from './user-preferences.dto';

function emptyToUndefined({ value }: { value: unknown }) {
  return value === '' || value === null ? undefined : value;
}

function parsePreferences({ value }: { value: unknown }) {
  if (value == null || value === '') return undefined;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export class UpdateProfileDto {
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @Transform(parsePreferences)
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto;
}
