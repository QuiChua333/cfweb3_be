import { Body, Controller, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import NotificationRoute from './notification.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';

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

  @InjectRoute(NotificationRoute.getNotification)
  getNotification(@User() currentUser: ITokenPayload) {
    return this.notificationService.getNotification(currentUser);
  }
}
