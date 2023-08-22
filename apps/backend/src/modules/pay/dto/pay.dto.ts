import { IsNotEmpty, IsString } from 'class-validator';

export class PayDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;

	@IsNotEmpty()
	@IsString()
	readonly account: string;

	@IsNotEmpty()
	@IsString()
	readonly account_type: string;

	@IsNotEmpty()
	@IsString()
	readonly pin: string;

	@IsNotEmpty()
	@IsString()
	readonly orderNumber: string;
}
