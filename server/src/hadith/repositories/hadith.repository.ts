import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hadith } from '../entities/hadith.entity';

type HadithPayload = {
  book: string;
  hadithNumber: number;
  arabicNumber: number;
  translation: Hadith['translation'];
  narrator: string;
  grade: string[];
  topic: string;
  chapter: string;
  reference: Hadith['reference'];
  text: string;
  description: string;
};

@Injectable()
export class HadithRepository {
  constructor(@InjectRepository(Hadith) private hadiths: Repository<Hadith>) {}

  findByBookAndNumber(book: string, hadithNumber: number) {
    return this.hadiths.findOne({ where: { book, hadithNumber } });
  }

  findAll(query?: string, topic?: string) {
    const qb = this.hadiths
      .createQueryBuilder('hadith')
      .orderBy('hadith.book', 'ASC')
      .addOrderBy('hadith.hadithNumber', 'ASC');

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

    const topicName = topic?.trim();
    if (topicName) {
      qb.andWhere('hadith.topic = :topic', { topic: topicName });
    }

    return qb.getMany();
  }

  async findPage(
    query?: string,
    topic?: string | string[],
    page = 1,
    limit = 3,
  ) {
    const qb = this.hadiths
      .createQueryBuilder('hadith')
      .orderBy('hadith.book', 'ASC')
      .addOrderBy('hadith.hadithNumber', 'ASC');

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

    const [hadiths, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { hadiths, total };
  }

  findById(id: string) {
    return this.hadiths.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.hadiths.delete(id);
  }

  create(data: HadithPayload) {
    return this.hadiths.save(this.hadiths.create(data));
  }

  save(id: string, data: HadithPayload) {
    return this.hadiths.save({ id, ...data });
  }
}
