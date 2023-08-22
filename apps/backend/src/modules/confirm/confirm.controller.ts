import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { ConfirmDto } from './dto/confirm.dto';

@Controller()
export class ConfirmController {
	constructor(
		private readonly confirmService: ConfirmService,
	) {}

	@Post('confirm')
	async confirm(
		@Body() body: ConfirmDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.confirmService.confirm(body, session, headers);
	}
}
