import { Module } from '@nestjs/common';
import { ActivateController } from './activate.controller';
import { ActivateService } from './activate.service';
import { ActivateStatusService } from './activate_status.service';

@Module({
	controllers: [ActivateController],
	providers: [ActivateService, ActivateStatusService],
})
export class ActivateModule {}
