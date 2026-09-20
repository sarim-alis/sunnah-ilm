import { IsString, Matches } from 'class-validator';

export class SavePushTokenDto {
  @IsString()
  @Matches(/^ExponentPushToken\[.+\]$/)
  token!: string;
}
