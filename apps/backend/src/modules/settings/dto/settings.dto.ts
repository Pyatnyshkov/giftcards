import { IsNotEmpty, IsString } from 'class-validator';

export class SettingsDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;
}
