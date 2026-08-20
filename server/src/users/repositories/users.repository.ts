import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryClient } from '@tanstack/query-core';
import { Repository } from 'typeorm';
import { QUERY_CLIENT } from '../../common/query/query-client.provider';
import { Preference } from '../entities/preference.entity';
import { User } from '../entities/user.entity';
import { uniqueTopicNames, type HadithTopic } from '../preferences';
import { userKeys } from '../query/keys';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Preference) private preferences: Repository<Preference>,
    @Inject(QUERY_CLIENT) private queryClient: QueryClient,
  ) {}

  findByEmail(email: string) {
    const normalized = email.toLowerCase();
    return this.queryClient.fetchQuery({
      queryKey: userKeys.email(normalized),
      queryFn: () =>
        this.users.findOne({
          where: { email: normalized },
          relations: { preferences: true },
        }),
    });
  }

  findById(id: string) {
    return this.queryClient.fetchQuery({
      queryKey: userKeys.id(id),
      queryFn: () =>
        this.users.findOne({
          where: { id },
          relations: { preferences: true },
        }),
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    const user = this.users.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      imageUrl: null,
      preferences: [],
      mode: 'light',
    });
    const saved = await this.users.save(user);
    await this.queryClient.invalidateQueries({ queryKey: userKeys.all });
    return saved;
  }

  async update(
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
    const user = await this.users.findOne({
      where: { id },
      relations: { preferences: true },
    });
    if (!user) return null;

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email.toLowerCase();
    if (data.imageUrl !== undefined) user.imageUrl = data.imageUrl;
    if (data.password) user.password = data.password;
    if (data.mode) user.mode = data.mode;

    await this.users.update(id, {
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      password: user.password,
      mode: user.mode,
    });

    if (data.preferenceNames !== undefined) {
      const names = uniqueTopicNames(data.preferenceNames);
      await this.preferences.delete({ userId: id });
      if (names.length) {
        await this.preferences.save(
          names.map((name) => this.preferences.create({ name, userId: id })),
        );
      }
    }

    await this.queryClient.removeQueries({ queryKey: userKeys.all });
    return this.users.findOne({
      where: { id },
      relations: { preferences: true },
    });
  }
}
