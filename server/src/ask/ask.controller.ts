import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AskService } from './ask.service';
import { AskHadithDto } from './dto/ask-hadith.dto';

type AuthedRequest = { user: { id: string } };

@Controller('ask')
export class AskController {
  constructor(private askService: AskService) {}

  @Post()
  @UseGuards(JwtGuard)
  ask(@Req() req: AuthedRequest, @Body() dto: AskHadithDto) {
    return this.askService.ask(req.user.id, dto.topic, dto.question);
  }
}
