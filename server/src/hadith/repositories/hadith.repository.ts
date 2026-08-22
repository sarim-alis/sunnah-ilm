import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hadith } from '../entities/hadith.entity';

@Injectable()
export class HadithRepository {
  constructor(@InjectRepository(Hadith) private hadiths: Repository<Hadith>) {}

  findByBookAndNumber(book: string, hadithNumber: number) {
    return this.hadiths.findOne({ where: { book, hadithNumber } });
  }

  findAll(query?: string) {
    const qb = this.hadiths
      .createQueryBuilder('hadith')
      .orderBy('hadith.book', 'ASC')
      .addOrderBy('hadith.hadithNumber', 'ASC');

    const term = query?.trim();
    if (term) {
      qb.where(
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

    return qb.getMany();
  }

  findById(id: string) {
    return this.hadiths.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.hadiths.delete(id);
  }

  create(data: {
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
  }) {
    return this.hadiths.save(this.hadiths.create(data));
  }
}
