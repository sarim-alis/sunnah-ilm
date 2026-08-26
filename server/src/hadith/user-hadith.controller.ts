import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { HadithService } from './hadith.service';

type AuthedRequest = { user: { id: string } };

@Controller('user/hadith')
export class UserHadithController {
  constructor(private hadithService: HadithService) {}

  @Get('saved')
  @UseGuards(JwtGuard)
  listSaved(
    @Req() req: AuthedRequest,
    @Query('q') q?: string,
    @Query('topic') topic?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.hadithService.listSavedPage(
      req.user.id,
      q,
      topic,
      Number(page) || 1,
      Number(limit) || 3,
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  list(
    @Req() req: AuthedRequest,
    @Query('q') q?: string,
    @Query('topic') topic?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.hadithService.listForUser(
      req.user.id,
      q,
      topic,
      Number(page) || 1,
      Number(limit) || 3,
    );
  }
}
