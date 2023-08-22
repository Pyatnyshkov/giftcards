import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { PurchaseDto } from './dto/purchase.dto';
import { PurchaseService } from './purchase.service';

@Controller()
export class PurchaseController {
	constructor(
		private readonly purchaseService: PurchaseService
	) {}

	@Post('purchase')
	async purchase(
		@Body() body: PurchaseDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.purchaseService.purchase(body, session, headers);
	}
}
