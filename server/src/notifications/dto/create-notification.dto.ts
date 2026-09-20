import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
