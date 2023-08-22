import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { generateOrderRequest, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { ActivateDto } from './dto/activate.dto';
import type { IByOrderRequest } from '../../interfaces/main.interfaces';
import type { IActiveStatusResponse } from '../../interfaces/response.interface';
import type { IErrorData } from '../../interfaces/error.interface';

@Injectable()
export class ActivateStatusService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async activate_status(
		body: ActivateDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/activate_status', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const byOrderRequest = generateOrderRequest(shopSettingsResponse.shop_id, body.orderNumber);
			const status = await this.getActivationStatusBackendRequest(byOrderRequest);
			this.loggerService.log('Success activated', loggingObject);

			res.data = status;
			return res;
		} catch (error) {
			pushErrorMessages(loggingObject, error.info)
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async getActivationStatusBackendRequest(
		data: IByOrderRequest
	): Promise<IActiveStatusResponse> {
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
			const clientMethod = client.get_activation_statusAsync;
			const status = await getDataRequest(data, {}, this.configService.getOrThrow('loyalty'), clientMethod);
			return status[0].retval;
		} catch (error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to get activation status from backend';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}
}
