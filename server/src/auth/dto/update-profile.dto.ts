import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

function emptyToUndefined({ value }: { value: unknown }) {
  return value === '' || value === null ? undefined : value;
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
  password?: string;
}
