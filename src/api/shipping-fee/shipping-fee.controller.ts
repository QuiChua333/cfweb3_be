import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingFeeService } from './shipping-fee.service';
import { CreateShippingFeeDto } from './dto/create-shipping-fee.dto';
import { UpdateShippingFeeDto } from './dto/update-shipping-fee.dto';

@Controller('shipping-fee')
export class ShippingFeeController {
  constructor(private readonly shippingFeeService: ShippingFeeService) {}

  @Post()
  create(@Body() createShippingFeeDto: CreateShippingFeeDto) {
    return this.shippingFeeService.create(createShippingFeeDto);
  }

  @Get()
  findAll() {
    return this.shippingFeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingFeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingFeeDto: UpdateShippingFeeDto) {
    return this.shippingFeeService.update(+id, updateShippingFeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingFeeService.remove(+id);
  }
}
