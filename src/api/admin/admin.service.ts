import { RepositoryService } from '@/repositories/repository.service';
import { Injectable } from '@nestjs/common';
import { ITokenPayload } from '../auth/auth.interface';
import { Role } from '@/constants';

@Injectable()
export class AdminService {
  constructor(private readonly repository: RepositoryService) {}

  async checkAdmin(currentUser: ITokenPayload) {
    return currentUser.role === Role.Admin;
  }
}
