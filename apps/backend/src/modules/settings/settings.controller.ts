import { Body, Controller, Headers, Post, Session } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';

@Controller()
export class SettingsController {
	constructor(
		private readonly settingsService: SettingsService
	) {}

	@Post('settings')
	async activate(
		@Body() body: SettingsDto,
		@Session() session: Record<string, string>,
		@Headers() headers: Headers,
	): Promise<unknown> {
		return this.settingsService.settings(body, session, headers)
	}
}
