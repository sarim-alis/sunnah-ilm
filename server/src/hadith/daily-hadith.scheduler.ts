import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HadithService } from './hadith.service';

@Injectable()
export class DailyHadithScheduler {
  private readonly logger = new Logger(DailyHadithScheduler.name);

  constructor(private hadithService: HadithService) {}

  @Cron('0 8 * * *', { timeZone: 'UTC' })
  async sendDailyNotification() {
    const result = await this.hadithService.notifyDaily();
    this.logger.log(`Daily Hadith push sent=${result.sent} date=${result.date}`);
  }
}
