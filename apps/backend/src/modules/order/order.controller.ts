import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { RegisterService } from './register.service';
import { StatusService } from './status.service';
import { CancelService } from './cancel.service';
import { RegisterDto } from './dto/register.dto';
import { StatusDto } from './dto/status.dto';
import { CancelDto } from './dto/cancel.dto';

@Controller()
export class OrderController {
	constructor(
		private readonly registerService: RegisterService,
		private readonly statusService: StatusService,
		private readonly cancelService: CancelService
	) {}

	@Post('register')
	async register(
		@Body() body: RegisterDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.registerService.register(body, session, headers);
	}

	@Post('status')
	async status(
		@Body() body: StatusDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.statusService.status(body, session, headers);
	}

	@Post('cancel')
	async cancel(
		@Body() body: CancelDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.cancelService.cancel(body, session, headers);
	}
}
