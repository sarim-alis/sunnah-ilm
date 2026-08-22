import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedHadith } from '../entities/saved-hadith.entity';

@Injectable()
export class SavedHadithRepository {
  constructor(
    @InjectRepository(SavedHadith) private saved: Repository<SavedHadith>,
  ) {}

  findByUser(userId: string) {
    return this.saved.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: string, hadithId: string) {
    return this.saved.findOne({ where: { userId, hadithId } });
  }

  create(userId: string, hadithId: string) {
    return this.saved.save(this.saved.create({ userId, hadithId }));
  }

  remove(userId: string, hadithId: string) {
    return this.saved.delete({ userId, hadithId });
  }
}
