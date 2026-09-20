import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification) private notifications: Repository<Notification>,
  ) {}

  listForUser(userId: string) {
    return this.notifications.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  unreadCount(userId: string) {
    return this.notifications.count({ where: { userId, isRead: false } });
  }

  findForUser(id: string, userId: string) {
    return this.notifications.findOne({ where: { id, userId } });
  }

  createForUser(data: {
    userId: string;
    title: string;
    description: string;
    isRead: boolean;
  }) {
    return this.notifications.save(this.notifications.create(data));
  }

  save(notification: Notification) {
    return this.notifications.save(notification);
  }

  markAllRead(userId: string) {
    return this.notifications.update({ userId, isRead: false }, { isRead: true });
  }

  deleteForUser(userId: string) {
    return this.notifications.delete({ userId });
  }
}
