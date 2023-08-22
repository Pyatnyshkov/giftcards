import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { BalanceDto } from './dto/balance.dto';
import { BalanceService } from './balance.service';

@Controller()
export class BalanceController {
	constructor(
		private readonly balanceService: BalanceService,
	) {}

	@Post('balance')
	async balance(
		@Body() body: BalanceDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown>  {
		return this.balanceService.balance(body, session, headers);
	}
}
