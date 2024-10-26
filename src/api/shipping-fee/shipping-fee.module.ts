import { Module } from '@nestjs/common';
import { ShippingFeeService } from './shipping-fee.service';
import { ShippingFeeController } from './shipping-fee.controller';

@Module({
  controllers: [ShippingFeeController],
  providers: [ShippingFeeService],
})
export class ShippingFeeModule {}
