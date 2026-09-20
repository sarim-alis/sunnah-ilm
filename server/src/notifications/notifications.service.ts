import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private notifications: NotificationsRepository) {}

  async list(userId: string) {
    const notifications = await this.notifications.listForUser(userId);
    const unreadCount = notifications.filter((item) => !item.isRead).length;
    return { notifications, unreadCount };
  }

  async unreadCount(userId: string) {
    return { unreadCount: await this.notifications.unreadCount(userId) };
  }

  async create(userId: string, dto: CreateNotificationDto) {
    const notification = await this.notifications.createForUser({
      userId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      isRead: dto.isRead ?? false,
    });
    return { message: 'Notification added', notification };
  }

  async setRead(userId: string, id: string, dto: UpdateNotificationDto) {
    const notification = await this.notifications.findForUser(id, userId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = dto.isRead;
    await this.notifications.save(notification);
    return { notification };
  }

  async markAllRead(userId: string) {
    await this.notifications.markAllRead(userId);
    return { message: 'All notifications marked as read' };
  }

  deleteForUser(userId: string) {
    return this.notifications.deleteForUser(userId);
  }
}
