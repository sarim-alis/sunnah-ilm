import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryClient } from '@tanstack/query-core';
import { Repository } from 'typeorm';
import { QUERY_CLIENT } from '../../common/query/query-client.provider';
import { User } from '../entities/user.entity';
import { defaultPreferences, type UserPreferences } from '../preferences';
import { userKeys } from '../query/keys';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @Inject(QUERY_CLIENT) private queryClient: QueryClient,
  ) {}

  findByEmail(email: string) {
    const normalized = email.toLowerCase();
    return this.queryClient.fetchQuery({
      queryKey: userKeys.email(normalized),
      queryFn: () => this.users.findOne({ where: { email: normalized } }),
    });
  }

  findById(id: string) {
    return this.queryClient.fetchQuery({
      queryKey: userKeys.id(id),
      queryFn: () =>
        this.users.findOne({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            preferences: true,
            mode: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    const user = this.users.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      imageUrl: null,
      preferences: defaultPreferences,
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
      preferences?: UserPreferences;
      mode?: 'light' | 'dark';
    },
  ) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) return null;

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email.toLowerCase();
    if (data.imageUrl !== undefined) user.imageUrl = data.imageUrl;
    if (data.password) user.password = data.password;
    if (data.preferences) user.preferences = data.preferences;
    if (data.mode) user.mode = data.mode;

    const saved = await this.users.save(user);
    await this.queryClient.invalidateQueries({ queryKey: userKeys.all });
    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      imageUrl: saved.imageUrl,
      preferences: saved.preferences ?? defaultPreferences,
      mode: saved.mode === 'dark' ? ('dark' as const) : ('light' as const),
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
