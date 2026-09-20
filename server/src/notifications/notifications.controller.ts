import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

type AuthedRequest = { user: { id: string } };

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  list(@Req() req: AuthedRequest) {
    return this.notificationsService.list(req.user.id);
  }

  @Get('unread-count')
  unreadCount(@Req() req: AuthedRequest) {
    return this.notificationsService.unreadCount(req.user.id);
  }

  @Post()
  create(@Req() req: AuthedRequest, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(req.user.id, dto);
  }

  @Patch('read-all')
  markAllRead(@Req() req: AuthedRequest) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Patch(':id')
  setRead(
    @Req() req: AuthedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.setRead(req.user.id, id, dto);
  }
}
