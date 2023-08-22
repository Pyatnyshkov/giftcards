import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;

	@IsNotEmpty()
	@IsString()
	readonly orderNumber: string;

	@IsNotEmpty()
	@IsString()
	readonly status: string;

	@IsNotEmpty()
	@IsString()
	readonly receipt: string;

	@IsNotEmpty()
	@IsString()
	readonly signature: string;

	@IsNotEmpty()
	@IsNumber()
	readonly amount: number;
}
