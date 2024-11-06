import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingFeeService } from './shipping-fee.service';
import ShippingFeeRoute from './shipping-fee.routes';
import { InjectRoute } from '@/decorators';

@Controller(ShippingFeeRoute.root)
export class ShippingFeeController {
  constructor(private readonly shippingFeeService: ShippingFeeService) {}

  @InjectRoute(ShippingFeeRoute.findAll)
  findAll() {
    return this.shippingFeeService.findAll();
  }
}
