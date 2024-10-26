import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class FaqService {
  constructor(private readonly repository: RepositoryService) {}

  create(createFaqDto: CreateFaqDto) {
    return 'This action adds a new faq';
  }

  findAll() {
    return `This action returns all faq`;
  }

  findOne(id: number) {
    return `This action returns a #${id} faq`;
  }

  update(id: number, updateFaqDto: UpdateFaqDto) {
    return `This action updates a #${id} faq`;
  }

  remove(id: number) {
    return `This action removes a #${id} faq`;
  }
}
