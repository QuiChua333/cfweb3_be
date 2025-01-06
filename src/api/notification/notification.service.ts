import { RepositoryService } from '@/repositories/repository.service';
import { BadRequestException, Injectable } from '@nestjs/common';

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
}
