import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

class Ulr {
	@IsOptional()
	@IsUrl()
	readonly ok: string;

	@IsOptional()
	@IsUrl()
	readonly fail: string;
}


export class PurchaseDto {
	@IsNotEmpty()
	@IsString()
	readonly standalone_name: string;

	@IsNotEmpty()
	@IsString()
	readonly orderNumber: string;

	@IsNotEmpty()
	@IsString()
	readonly currency: string;

	@IsNotEmpty()
	@IsNumber()
	readonly amount: number;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	// @IsPhoneNumber()
	readonly phone: string;

	@IsOptional()
	@IsObject()
	readonly url: Ulr;
}
