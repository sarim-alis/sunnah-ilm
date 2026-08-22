import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHadithDto } from './dto/create-hadith.dto';
import { HadithRepository } from './repositories/hadith.repository';

@Injectable()
export class HadithService {
  constructor(private hadithRepository: HadithRepository) {}

  async create(dto: CreateHadithDto) {
    const existing = await this.hadithRepository.findByBookAndNumber(
      dto.book,
      dto.hadithNumber,
    );
    if (existing) {
      throw new ConflictException('This Hadith already exists');
    }

    const hadith = await this.hadithRepository.create({
      book: dto.book,
      hadithNumber: dto.hadithNumber,
      arabicNumber: dto.arabicNumber,
      translation: {
        english: dto.translation.english,
        urdu: dto.translation.urdu ?? '',
        arabic: dto.translation.arabic ?? '',
      },
      narrator: dto.narrator,
      grade: dto.grade ?? [],
      topic: dto.topic,
      chapter: dto.chapter ?? '',
      reference: {
        book: dto.reference.book,
        hadith: dto.reference.hadith,
      },
      text: dto.text,
      description: dto.description ?? '',
    });

    return {
      message: 'Hadith added successfully',
      hadith,
    };
  }

  async update(id: string, dto: CreateHadithDto) {
    const existing = await this.hadithRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Hadith not found');
    }

    const duplicate = await this.hadithRepository.findByBookAndNumber(
      dto.book,
      dto.hadithNumber,
    );
    if (duplicate && duplicate.id !== id) {
      throw new ConflictException('This Hadith already exists');
    }

    const payload = {
      book: dto.book,
      hadithNumber: dto.hadithNumber,
      arabicNumber: dto.arabicNumber,
      translation: {
        english: dto.translation.english,
        urdu: dto.translation.urdu ?? '',
        arabic: dto.translation.arabic ?? '',
      },
      narrator: dto.narrator,
      grade: dto.grade ?? [],
      topic: dto.topic,
      chapter: dto.chapter ?? '',
      reference: {
        book: dto.reference.book,
        hadith: dto.reference.hadith,
      },
      text: dto.text,
      description: dto.description ?? '',
    };

    const hadith = await this.hadithRepository.save(id, payload);
    return {
      message: 'Hadith updated successfully',
      hadith,
    };
  }

  async list(query?: string) {
    const hadiths = await this.hadithRepository.findAll(query);
    return { hadiths };
  }

  async remove(id: string) {
    const existing = await this.hadithRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Hadith not found');
    }
    await this.hadithRepository.remove(id);
    return { message: 'Hadith deleted successfully' };
  }
}
