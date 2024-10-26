import { Injectable } from '@nestjs/common';
import { CreateDetailPerkDto } from './dto/create-detail-perk.dto';
import { UpdateDetailPerkDto } from './dto/update-detail-perk.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class DetailPerkService {
  constructor(private readonly repository: RepositoryService) {}

  create(createDetailPerkDto: CreateDetailPerkDto) {
    return 'This action adds a new detailPerk';
  }

  findAll() {
    return `This action returns all detailPerk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailPerk`;
  }

  update(id: number, updateDetailPerkDto: UpdateDetailPerkDto) {
    return `This action updates a #${id} detailPerk`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailPerk`;
  }
}
