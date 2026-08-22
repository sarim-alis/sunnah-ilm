import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsersModule } from '../users/users.module';
import { Hadith } from './entities/hadith.entity';
import { SavedHadith } from './entities/saved-hadith.entity';
import { HadithController } from './hadith.controller';
import { HadithService } from './hadith.service';
import { HadithRepository } from './repositories/hadith.repository';
import { SavedHadithRepository } from './repositories/saved-hadith.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Hadith, SavedHadith]), AuthModule, UsersModule],
  controllers: [HadithController],
  providers: [HadithRepository, SavedHadithRepository, HadithService, AdminGuard],
  exports: [HadithService],
})
export class HadithModule {}
