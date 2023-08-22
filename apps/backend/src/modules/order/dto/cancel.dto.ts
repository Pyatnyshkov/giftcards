import { IsNotEmpty, IsString } from 'class-validator';

export class CancelDto {
	@IsNotEmpty()
	@IsString()
	standalone_name: string;

	@IsNotEmpty()
	@IsString()
	orderNumber: string;
}
