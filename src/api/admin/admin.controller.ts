import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import AdminRoute from './admin.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';

@Controller(AdminRoute.root)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @InjectRoute(AdminRoute.checkAdmin)
  checkAdmin(@User() currentUser: ITokenPayload) {
    return this.adminService.checkAdmin(currentUser);
  }
}
