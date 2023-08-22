import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { generateOrderRequest, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { CancelDto } from './dto/cancel.dto';
import type { IByOrderRequest } from '../../interfaces/main.interfaces';
import type { IErrorData } from '../../interfaces/error.interface';
import md5 from 'md5'

@Injectable()
export class CancelService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async cancel(
		body: CancelDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/cancel', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const byOrderRequest = generateOrderRequest(shopSettingsResponse.shop_id, body.orderNumber);
			await this.cancelBackendRequest(byOrderRequest);

			const status = 'Non authorized';
			const signature = this.generateSignature(body.orderNumber, status, shopSettingsResponse.password);
			loggingObject.response_data.signature = signature;
			this.loggerService.error(status, loggingObject);

			res.data = {}
			res.data.status = status;
			res.data.signature = signature;
			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info)
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	generateSignature(orderNumber: string, status: string, password: string) {
		return md5(
			md5(orderNumber) + '&' + md5(status) + '&' + password
		).toUpperCase()
	}

	async cancelBackendRequest(
		data: IByOrderRequest
	): Promise<void> {
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
			const clientMethod = client.cancelAsync;
			await getDataRequest(data, {}, this.configService.getOrThrow('loyalty'), clientMethod);
			return;
		} catch(error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to cancel order';
			errorData.info.code = 301;
			throw(errorData);
		}
	}
}
