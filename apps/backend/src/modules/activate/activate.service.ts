import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { generateOrderRequest, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { ActivateDto } from './dto/activate.dto';
import type { IByOrderRequest } from '../../interfaces/main.interfaces';
import type { IErrorData } from '../../interfaces/error.interface';

@Injectable()
export class ActivateService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async activate(
		body: ActivateDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/activate', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const byOrderRequest = generateOrderRequest(shopSettingsResponse.shop_id, body.orderNumber);
			await this.activateBackendRequest(byOrderRequest);
			this.loggerService.log('Success activated', loggingObject);

			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info)
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async activateBackendRequest(
		data: IByOrderRequest
	): Promise<unknown> {
		let client;
		const errorData: IErrorData = {};
		errorData.info = {};

		try {
			client = await getClientObject({}, this.configService.getOrThrow('loyalty'));
		} catch (error) {
			errorData.info.connectionError = error;
			errorData.info.logMessage = 'Failed to connect to loyalty service';
			errorData.info.code = 300;
			throw(errorData);
		}

		try {
			const clientMethod = client.activateAsync;
			await getDataRequest(data, {}, this.configService.getOrThrow('loyalty'), clientMethod);
			return;
		} catch(error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to activate';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}
}
