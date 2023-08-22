import { IsNotEmpty, IsString, IsOptional, IsEmail, IsObject, IsUrl, IsNumber } from 'class-validator';

class Ulr {
	@IsOptional()
	@IsUrl()
	readonly ok: string;

	@IsOptional()
	@IsUrl()
	readonly fail: string;
}

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;

	@IsNotEmpty()
	@IsString()
	readonly orderNumber: string;

	@IsNotEmpty()
	@IsNumber()
	readonly amount: number;

	@IsOptional()
	@IsString()
	readonly currency: string;

	@IsOptional()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	readonly timelimit: string;

	@IsNotEmpty()
	@IsString()
	readonly receipt: string;

	@IsNotEmpty()
	@IsString()
	readonly signature: string;

	@IsOptional()
	@IsObject()
	readonly url: Ulr;
}
