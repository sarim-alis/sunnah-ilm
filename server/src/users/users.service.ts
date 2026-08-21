import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import type { HadithTopic } from './preferences';
import type { UserRole } from './roles';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  create(data: { name: string; email: string; password: string; role?: UserRole }) {
    return this.usersRepository.create(data);
  }

  update(
    id: string,
    data: {
      name?: string;
      email?: string;
      imageUrl?: string;
      password?: string;
      preferenceNames?: HadithTopic[];
      mode?: 'light' | 'dark';
    },
  ) {
    return this.usersRepository.update(id, data);
  }
}
