import { IsNotEmpty, IsString } from 'class-validator';

export class StatusDto {
	@IsNotEmpty()
	@IsString()
	standalone_name: string;

	@IsNotEmpty()
	@IsString()
	orderNumber: string;
}
