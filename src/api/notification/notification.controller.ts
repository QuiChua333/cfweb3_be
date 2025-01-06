import { Body, Controller, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import NotificationRoute from './notification.routes';
import { InjectRoute } from '@/decorators';

@Controller(NotificationRoute.root)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @InjectRoute(NotificationRoute.findAll)
  findAll() {
    return this.notificationService.findAll();
  }

  @InjectRoute(NotificationRoute.seen)
  seen(@Param('id') notificationId: string) {
    return this.notificationService.seen(notificationId);
  }
}
