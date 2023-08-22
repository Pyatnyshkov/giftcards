import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { RegisterService } from '../order/register.service';

@Module({
	controllers: [PurchaseController],
	providers: [PurchaseService, RegisterService],
})
export class PurchaseModule {}
