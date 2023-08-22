import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { RegisterService } from './register.service';
import { CancelService } from './cancel.service';
import { StatusService } from './status.service';

@Module({
	controllers: [OrderController],
	providers: [RegisterService, StatusService, CancelService],
})
export class OrderModule {}
