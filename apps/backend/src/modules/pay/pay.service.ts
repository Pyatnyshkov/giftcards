import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { generateAuthorizeData, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { PayDto } from './dto/pay.dto';
import type { IErrorData } from '../../interfaces/error.interface';
import type { IAuthorizeData } from '../../interfaces/main.interfaces';

@Injectable()
export class PayService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async pay(
		body: PayDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/pay', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const authorizeData = generateAuthorizeData(shopSettingsResponse, body);
			await this.authorizeBackendRequest(authorizeData)
			this.loggerService.error('Success authorize', loggingObject);

			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info)
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async authorizeBackendRequest(
		data: IAuthorizeData
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
			const clientMethod = client.authorizeAsync;
			await getDataRequest(data, {}, this.configService.getOrThrow('loyalty'), clientMethod);
			return;
		} catch(error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to authorize';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}
}
