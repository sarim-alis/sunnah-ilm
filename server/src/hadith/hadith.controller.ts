import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateHadithDto } from './dto/create-hadith.dto';
import { HadithService } from './hadith.service';

@Controller('hadith')
export class HadithController {
  constructor(private hadithService: HadithService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  create(@Body() dto: CreateHadithDto) {
    return this.hadithService.create(dto);
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  list(@Query('q') q?: string) {
    return this.hadithService.list(q);
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
