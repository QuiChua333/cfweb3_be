import { Injectable } from '@nestjs/common';
import { CreatePerkDto } from './dto/create-perk.dto';
import { UpdatePerkDto } from './dto/update-perk.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class PerkService {
  constructor(
    private readonly repository: RepositoryService
  ) {}
  create(createPerkDto: CreatePerkDto) {
    return 'This action adds a new perk';
  }

  findAll() {
    return `This action returns all perk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} perk`;
  }

  update(id: number, updatePerkDto: UpdatePerkDto) {
    return `This action updates a #${id} perk`;
  }

  remove(id: number) {
    return `This action removes a #${id} perk`;
  }
}
