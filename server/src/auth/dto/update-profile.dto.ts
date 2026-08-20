import { IsEmail, IsIn, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { UserPreferencesDto } from './user-preferences.dto';

function emptyToUndefined({ value }: { value: unknown }) {
  return value === '' || value === null ? undefined : value;
}

function parsePreferences({ value }: { value: unknown }) {
  if (value == null || value === '') return undefined;
  let parsed: unknown = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return value;
    }
  }
  if (Array.isArray(parsed)) {
    parsed = { topics: parsed };
  }
  if (!parsed || typeof parsed !== 'object') return parsed;
  return plainToInstance(UserPreferencesDto, parsed);
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

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsIn(['light', 'dark'])
  mode?: 'light' | 'dark';
}
