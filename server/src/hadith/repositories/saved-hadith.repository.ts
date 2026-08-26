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

  async findPage(
    userId: string,
    query?: string,
    topic?: string | string[],
    page = 1,
    limit = 3,
  ) {
    const qb = this.saved
      .createQueryBuilder('saved')
      .innerJoinAndSelect('saved.hadith', 'hadith')
      .where('saved.userId = :userId', { userId })
      .orderBy('saved.createdAt', 'DESC');

    const term = query?.trim();
    if (term) {
      qb.andWhere(
        `(
          hadith.topic ILIKE :q
          OR hadith.narrator ILIKE :q
          OR hadith.book ILIKE :q
          OR CAST(hadith.hadithNumber AS text) ILIKE :q
          OR CAST(hadith.arabicNumber AS text) ILIKE :q
          OR hadith.chapter ILIKE :q
        )`,
        { q: `%${term}%` },
      );
    }

    const topics = Array.isArray(topic)
      ? topic.map((name) => name.trim()).filter(Boolean)
      : topic?.trim()
        ? [topic.trim()]
        : [];
    if (topics.length === 1) {
      qb.andWhere('hadith.topic = :topic', { topic: topics[0] });
    } else if (topics.length > 1) {
      qb.andWhere('hadith.topic IN (:...topics)', { topics });
    }

    const [rows, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { hadiths: rows.map((row) => row.hadith), total };
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
