import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateHadithDto } from './dto/create-hadith.dto';
import { HadithService } from './hadith.service';

type AuthedRequest = { user: { id: string } };

@Controller('hadith')
export class HadithController {
  constructor(private hadithService: HadithService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  create(@Body() dto: CreateHadithDto) {
    return this.hadithService.create(dto);
  }

  @Get('saved')
  @UseGuards(JwtGuard)
  listSaved(@Req() req: AuthedRequest) {
    return this.hadithService.listSaved(req.user.id);
  }

  @Get('user/saved')
  @UseGuards(JwtGuard)
  listUserSaved(
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

  @Get('user')
  @UseGuards(JwtGuard)
  listUser(
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

  @Post(':id/save')
  @UseGuards(JwtGuard)
  save(@Req() req: AuthedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.hadithService.save(req.user.id, id);
  }

  @Delete(':id/save')
  @UseGuards(JwtGuard)
  unsave(@Req() req: AuthedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.hadithService.unsave(req.user.id, id);
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  list(
    @Query('q') q?: string,
    @Query('topic') topic?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.hadithService.list(
      q,
      topic,
      Number(page) || 1,
      Number(limit) || 3,
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard, AdminGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateHadithDto) {
    return this.hadithService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.hadithService.remove(id);
  }
}
