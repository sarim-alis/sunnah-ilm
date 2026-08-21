import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hadith } from './entities/hadith.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hadith])],
  exports: [TypeOrmModule],
})
export class HadithModule {}
