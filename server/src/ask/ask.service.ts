import { BadRequestException, Injectable } from '@nestjs/common';
import { HadithRepository } from '../hadith/repositories/hadith.repository';
import { uniqueTopicNames } from '../users/preferences';
import { UsersService } from '../users/users.service';
import { GeminiService } from './gemini.service';

@Injectable()
export class AskService {
  constructor(
    private usersService: UsersService,
    private hadithRepository: HadithRepository,
    private geminiService: GeminiService,
  ) {}

  async ask(userId: string, topic: string, question: string) {
    const user = await this.usersService.findById(userId);
    const preferences = uniqueTopicNames(user?.preferences);
    if (!preferences.length) {
      throw new BadRequestException(
        'Pick up to 3 topics in Profile before asking',
      );
    }

    const topicName = topic.trim();
    if (!preferences.includes(topicName as (typeof preferences)[number])) {
      throw new BadRequestException(
        'Choose one of your saved preference topics',
      );
    }

    const trimmed = question.trim();
    let hadiths = await this.hadithRepository.findForAsk(
      topicName,
      trimmed,
      5,
    );
    if (!hadiths.length) {
      hadiths = await this.hadithRepository.findForAsk(topicName, '', 5);
    }

    if (!hadiths.length) {
      return {
        topic: topicName,
        question: trimmed,
        hadiths: [],
        explanation:
          'We do not have verified Ahadees for this topic in the corpus yet. Please try another topic or check back later.',
      };
    }

    try {
      const explanation = await this.geminiService.explain(
        topicName,
        trimmed,
        hadiths,
      );
      return {
        topic: topicName,
        question: trimmed,
        hadiths,
        explanation,
      };
    } catch {
      return {
        topic: topicName,
        question: trimmed,
        hadiths,
        explanation:
          'Our AI is busy right now, so we could not write an explanation. Please read the retrieved Ahadees below — they are still verified from our corpus.',
      };
    }
  }
}
