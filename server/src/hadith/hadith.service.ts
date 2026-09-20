import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { uniqueTopicNames } from '../users/preferences';
import { UsersService } from '../users/users.service';
import { CreateHadithDto } from './dto/create-hadith.dto';
import { HadithRepository } from './repositories/hadith.repository';
import { SavedHadithRepository } from './repositories/saved-hadith.repository';

@Injectable()
export class HadithService {
  constructor(
    private hadithRepository: HadithRepository,
    private savedHadithRepository: SavedHadithRepository,
    private usersService: UsersService,
  ) {}

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

  async list(query?: string, topic?: string, page = 1, limit = 3) {
    const currentPage = Math.max(1, page);
    const pageSize = Math.min(50, Math.max(1, limit));
    const { hadiths, total } = await this.hadithRepository.findPage(
      query,
      topic,
      currentPage,
      pageSize,
    );
    return {
      hadiths,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async listForUser(
    userId: string,
    query?: string,
    topic?: string,
    page = 1,
    limit = 3,
  ) {
    const user = await this.usersService.findById(userId);
    const topics = uniqueTopicNames(user?.preferences);
    if (!topics.length) {
      return {
        hadiths: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 1,
        topics: [],
      };
    }

    const requested = topic?.trim();
    const filter =
      requested && topics.includes(requested as (typeof topics)[number])
        ? [requested]
        : topics;

    const currentPage = Math.max(1, page);
    const pageSize = Math.min(50, Math.max(1, limit));
    const { hadiths, total } = await this.hadithRepository.findPage(
      query,
      filter,
      currentPage,
      pageSize,
    );
    return {
      hadiths,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      topics,
    };
  }

  async listSavedPage(
    userId: string,
    query?: string,
    topic?: string,
    page = 1,
    limit = 3,
  ) {
    const user = await this.usersService.findById(userId);
    const topics = uniqueTopicNames(user?.preferences);
    const requested = topic?.trim();
    const filter =
      requested && topics.includes(requested as (typeof topics)[number])
        ? requested
        : undefined;

    const currentPage = Math.max(1, page);
    const pageSize = Math.min(50, Math.max(1, limit));
    const { hadiths, total } = await this.savedHadithRepository.findPage(
      userId,
      query,
      filter,
      currentPage,
      pageSize,
    );
    return {
      hadiths,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      topics,
    };
  }

  async remove(id: string) {
    const existing = await this.hadithRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Hadith not found');
    }
    await this.hadithRepository.remove(id);
    return { message: 'Hadith deleted successfully' };
  }

  async listSaved(userId: string) {
    const rows = await this.savedHadithRepository.findByUser(userId);
    return { hadiths: rows.map((row) => row.hadith) };
  }

  async save(userId: string, hadithId: string) {
    const hadith = await this.hadithRepository.findById(hadithId);
    if (!hadith) {
      throw new NotFoundException('Hadith not found');
    }
    const existing = await this.savedHadithRepository.findOne(userId, hadithId);
    if (existing) {
      return { message: 'Hadith already saved', hadith };
    }
    await this.savedHadithRepository.create(userId, hadithId);
    return { message: 'Hadith saved', hadith };
  }

  async unsave(userId: string, hadithId: string) {
    await this.savedHadithRepository.remove(userId, hadithId);
    return { message: 'Hadith removed from saved' };
  }

  utcDateKey(now = new Date()) {
    return now.toISOString().slice(0, 10);
  }

  async getDaily(now = new Date()) {
    const total = await this.hadithRepository.countAll();
    if (!total) {
      return { hadith: null, date: this.utcDateKey(now) };
    }

    const days = Math.floor(now.getTime() / 86_400_000);
    const hadith = await this.hadithRepository.findAtOffset(days % total);
    return { hadith, date: this.utcDateKey(now) };
  }

  async getById(id: string) {
    const hadith = await this.hadithRepository.findById(id);
    if (!hadith) {
      throw new NotFoundException('Hadith not found');
    }
    return { hadith };
  }

  async notifyDaily() {
    const { hadith, date } = await this.getDaily();
    if (!hadith) {
      return { sent: 0, date };
    }

    const users = await this.usersService.listPushTokens();
    const tokens = users
      .map((user) => user.expoPushToken)
      .filter((token): token is string => Boolean(token));
    if (!tokens.length) {
      return { sent: 0, date };
    }

    const body = dailyNotificationBody(hadith);
    const invalid: string[] = [];
    const chunkSize = 100;

    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          chunk.map((to) => ({
            to,
            sound: 'default',
            title: 'Hadith of the Day',
            body,
            data: {
              type: 'daily-hadith',
              date,
              hadithId: hadith.id,
            },
          })),
        ),
      });

      const payload = (await response.json()) as {
        data?: { status?: string; details?: { error?: string } }[];
      };
      payload.data?.forEach((ticket, index) => {
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
          invalid.push(chunk[index]);
        }
      });
    }

    if (invalid.length) {
      await this.usersService.clearPushTokens(invalid);
    }

    return { sent: tokens.length - invalid.length, date };
  }
}

function dailyNotificationBody(hadith: {
  description?: string;
  text?: string;
  translation?: { english?: string };
}) {
  const text =
    hadith.description?.trim() ||
    hadith.translation?.english?.trim() ||
    hadith.text?.trim() ||
    'Open Sunnah Ilm to read today’s Hadith.';
  return text.length > 140 ? `${text.slice(0, 137)}...` : text;
}
