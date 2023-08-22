import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { generateOrderRequest, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { StatusDto } from './dto/status.dto';
import type { IToken, IByOrderRequest } from '../../interfaces/main.interfaces';
import type { IStandaloneShopSettings } from '../../interfaces/response.interface';
import type { IErrorData } from '../../interfaces/error.interface';
import md5 from 'md5';

@Injectable()
export class StatusService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async status(
		body: StatusDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } = generateRequestObjects('/api/status', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const byOrderRequest = generateOrderRequest(shopSettingsResponse.shop_id, body.orderNumber);
			const auth: IToken = {
				Authorization: shopSettingsResponse.credentials,
			};
			const status = await this.getStatusBackendRequest(byOrderRequest, auth);
			const signature = this.generateStatusSignature(body, shopSettingsResponse, status);

			switch (status) {
				case 'registered':
				case 'in_progress':
					res.data.status = 'process';
					break;
				case 'acknowledged':
				case 'not_acknowledged':
				case 'authorized':
					res.data.status = 'authorized';
					break;
				case 'failed':
				case 'not_authorized':
				case 'canceled':
				case 'refunded':
					res.data.status = 'non authorized';
					break;
			}

			loggingObject.response_data.status = status;
			loggingObject.response_data.signature = signature;
			this.loggerService.log('Success get status', loggingObject);

			res.data.signature = signature;
			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info);
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async getStatusBackendRequest(
		data: IByOrderRequest,
		auth: IToken
	): Promise<string> {
		let client;
		const errorData: IErrorData = {};
		errorData.info = {};

		try {
			client = await getClientObject(auth, this.configService.getOrThrow('statusv2'));
		} catch (error) {
			errorData.info.connectionError = error;
			errorData.info.logMessage = 'Failed to connect to statusv2 service';
			errorData.info.code = 300;
			throw(errorData);
		}

		try {
			const clientMethod = client.get_by_orderAsync;
			const result = await getDataRequest(data, auth, this.configService.getOrThrow('statusv2'), clientMethod);
			return result[0].retval.status;
		} catch(error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to get status from backend';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}

	generateStatusSignature(
		body: StatusDto,
		standaloneShopSettings: IStandaloneShopSettings,
		status: string,
	): string {
		const orderNumber = md5(body.orderNumber);
		const signatureStatus = md5(status);
		return md5(orderNumber + '&' + signatureStatus + '&' + standaloneShopSettings.password).toUpperCase();
	}
}
