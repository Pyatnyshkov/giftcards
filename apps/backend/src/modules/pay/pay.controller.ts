import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { PayDto } from './dto/pay.dto';
import { PayService } from './pay.service';

@Controller()
export class PayController {
	constructor(
		private readonly payService: PayService
	) {}

	@Post('pay')
	async confirm(
		@Body() body: PayDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.payService.pay(body, session, headers);
	}
}
