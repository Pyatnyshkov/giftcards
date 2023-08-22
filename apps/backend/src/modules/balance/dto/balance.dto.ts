import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BalanceDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;

	@IsNotEmpty()
	@IsString()
	readonly account: string;

	@IsNotEmpty()
	@IsString()
	readonly account_type: string;

	@IsOptional()
	@IsString()
	readonly pin: number;
}
