import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preference } from './entities/preference.entity';
import { User } from './entities/user.entity';
import { SavedHadith } from '../hadith/entities/saved-hadith.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Preference, SavedHadith])],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
