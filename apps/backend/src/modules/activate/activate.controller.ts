import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { ActivateService } from './activate.service';
import { ActivateStatusService } from './activate_status.service';
import { ActivateDto } from './dto/activate.dto';

@Controller()
export class ActivateController {
	constructor(
		private readonly activateService: ActivateService,
		private readonly activateStatusService: ActivateStatusService,
	) {}

	@Post('activate')
	async activate(
		@Body() body: ActivateDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.activateService.activate(body, session, headers);
	}

	@Post('activate_status')
	async activateStatus(
		@Body() body: ActivateDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.activateStatusService.activate_status(body, session, headers);
	}
}
