import { RepositoryService } from '@/repositories/repository.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ITokenPayload } from '../auth/auth.interface';

@Injectable()
export class NotificationService {
  constructor(private readonly repository: RepositoryService) {}

  async findAll() {}

  async seen(notificationId: string) {
    const notification = await this.repository.notification.findOne({
      where: { id: notificationId },
    });

    if (!notification) throw new BadRequestException('Thông báo không tồn tại');

    notification.isRead = true;
    await this.repository.notification.save(notification);
  }

  async getNotification(currentUser: ITokenPayload) {
    const notifications = await this.repository.notification.find({
      where: {
        user: {
          id: currentUser.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return notifications;
  }
}
