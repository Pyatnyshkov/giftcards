import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;

	@IsNotEmpty()
	@IsString()
	readonly orderNumber: string;
}
