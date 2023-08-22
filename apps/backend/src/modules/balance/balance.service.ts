import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { generateBalanceData, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { BalanceDto } from './dto/balance.dto';
import type { IBalanceResponse } from '../../interfaces/response.interface';
import type { IBalanceData } from '../../interfaces/main.interfaces';
import type { IErrorData } from '../../interfaces/error.interface';

@Injectable()
export class BalanceService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async balance(
		body: BalanceDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/balance', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const balanceData = generateBalanceData(shopSettingsResponse.shop_id, body);
			const balance = await this.balanceBackendRequest(balanceData);
			loggingObject.response_data.balance = balance;
			this.loggerService.log('Success get balance', loggingObject);

			res.data = balance;
			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info);
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async balanceBackendRequest(
		data: IBalanceData
	): Promise<IBalanceResponse> {
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
			const clientMethod = client.balanceAsync;
			const balance = await getDataRequest(data, {}, this.configService.getOrThrow('loyalty'), clientMethod);
			return balance[0].retval;
		} catch(error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to get balance from backend';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}
}
