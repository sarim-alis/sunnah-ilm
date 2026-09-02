import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HadithModule } from '../hadith/hadith.module';
import { UsersModule } from '../users/users.module';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [AuthModule, UsersModule, HadithModule],
  controllers: [AskController],
  providers: [AskService, GeminiService],
})
export class AskModule {}
