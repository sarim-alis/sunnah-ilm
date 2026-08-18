import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  create(data: { name: string; email: string; password: string }) {
    return this.usersRepository.create(data);
  }

  update(
    id: string,
    data: { name?: string; email?: string; imageUrl?: string },
  ) {
    return this.usersRepository.update(id, data);
  }
}
