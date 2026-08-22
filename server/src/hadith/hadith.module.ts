import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsersModule } from '../users/users.module';
import { Hadith } from './entities/hadith.entity';
import { HadithController } from './hadith.controller';
import { HadithService } from './hadith.service';
import { HadithRepository } from './repositories/hadith.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Hadith]), AuthModule, UsersModule],
  controllers: [HadithController],
  providers: [HadithRepository, HadithService, AdminGuard],
  exports: [HadithService],
})
export class HadithModule {}
