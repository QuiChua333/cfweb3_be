import { Injectable } from '@nestjs/common';
import { CreateShippingFeeDto } from './dto/create-shipping-fee.dto';
import { UpdateShippingFeeDto } from './dto/update-shipping-fee.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class ShippingFeeService {
  constructor(
    private readonly repository: RepositoryService
  ) {}
  create(createShippingFeeDto: CreateShippingFeeDto) {
    return 'This action adds a new shippingFee';
  }

  findAll() {
    return `This action returns all shippingFee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingFee`;
  }

  update(id: number, updateShippingFeeDto: UpdateShippingFeeDto) {
    return `This action updates a #${id} shippingFee`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingFee`;
  }
}
