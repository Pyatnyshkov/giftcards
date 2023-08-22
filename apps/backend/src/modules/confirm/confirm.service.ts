import { Injectable, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { formatDataConfirm, formatReceipt, generateFormattedItem, parseReceipt } from '../../libs/formatData';
import {
	generateOrderRequest, generatePreConfirmData, generateRequestObjects, pushErrorMessages
} from '../../libs/generateRequestObjects';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { checkSignature } from '../../libs/checkSignature';
import { ConfirmDto } from './dto/confirm.dto';
import type { IByOrderRequest, IToken } from '../../interfaces/main.interfaces';
import type { IFormattedConfirmData, IPreConfirmData } from '../../interfaces/confirm.interface';
import type { IStandaloneShopSettings } from '../../interfaces/response.interface';
import type { ErrorInterface, IErrorData } from '../../interfaces/error.interface';
import type { IParsedReceiptItem, IReceiptItem } from '../../interfaces/receipt.interface';
import md5 from 'md5';

@Injectable()
export class ConfirmService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async confirm(
		body: ConfirmDto,
		session: Record<string, string>,
		headers: Headers
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/confirm', body, session, headers);
		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const signature = this.generateSignature(body, shopSettingsResponse);
			if (signature !== body.signature) {
				checkSignature(signature, body.signature, loggingObject);
			}

			const preConfirmData = generatePreConfirmData(body, shopSettingsResponse);
			const parsedReceipt = parseReceipt(body.receipt);
			const byOrderRequest = generateOrderRequest(shopSettingsResponse.shop_id, body.orderNumber);
			const auth: IToken = {
				Authorization: shopSettingsResponse.credentials,
			};
			const currency = await this.getCurrencyBackendRequest(byOrderRequest, auth);
			const formattedPreConfirmData =
				await this.formattedPreConfirmData(body, currency, preConfirmData, shopSettingsResponse, parsedReceipt);
			const formattedConfirmData = await formatDataConfirm(formattedPreConfirmData);

			await this.confirmBackendRequest(formattedConfirmData, auth);
			this.loggerService.log('Order confirmed', loggingObject);

			res.data = {};
			res.data.status = 'success';
			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info)
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async getCurrencyBackendRequest(
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
			errorData.info.code = 500;
			throw(errorData);
		}

		try {
			const clientMethod = client.get_by_orderAsync;
			const result = await getDataRequest(data, auth, this.configService.getOrThrow('statusv2'), clientMethod);
			return result[0].retval.payments.Payment[0].amount.currency;
		} catch (error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to get currency from backend';
			errorData.info.code = 300;
			throw(errorData);
		}
	}

	async confirmBackendRequest(
		data: IFormattedConfirmData,
		auth: IToken,
	): Promise<unknown> {
		let client;
		const errorData: IErrorData = {};
		errorData.info = {};

		try {
			client = await getClientObject(auth, this.configService.getOrThrow('orderv2'));
		} catch (error) {
			errorData.info.connectionError = error;
			errorData.info.logMessage = 'Failed to connect to order v2';
			errorData.info.code = 500;
			throw(errorData);
		}

		try {
			const clientMethod = client.confirmAsync;
			await getDataRequest(data, auth, this.configService.getOrThrow('orderv2'), clientMethod);
			return;
		} catch (error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to confirm order';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}

	generateSignature(
		body: ConfirmDto,
		shopSettings: IStandaloneShopSettings,
	): string {
		const orderNumber = md5(body.orderNumber);
		const status = md5(body.status);
		const receipt = 	md5(body.receipt);

		return md5(orderNumber + '&' + status + '&' + receipt  + '&' + shopSettings.password).toUpperCase();
	}

	async formattedPreConfirmData(
		body: ConfirmDto,
		currency: string,
		preConfirmData: IPreConfirmData,
		shopSettings: IStandaloneShopSettings,
		receipt: IParsedReceiptItem
	): Promise<IPreConfirmData> {
		return new Promise(async (resolve, reject) => {
			try {
				if (Object.keys(receipt).length === 0) {
					const _item: IReceiptItem = {
						name: "аванс",
						host: "shop",
						typename: "goods",
						clearing: "loyalty",
						amount: body.amount,
						currency: currency,
						cheque: {},
					};
					preConfirmData.basketElems.push(_item);
				} else {
					const formattedReceipt = await formatReceipt(receipt).catch((error) => reject(error));
					if (!formattedReceipt) return;

					formattedReceipt.lines.forEach((item) => {
						const _item = generateFormattedItem(item, currency, formattedReceipt);
						preConfirmData.basketElems.push(_item);
					})
				}
				resolve(preConfirmData)
			} catch (e) {
				const error: ErrorInterface = {};
				error.info = {};
				error.info.preRegisterDataErrorStr = e.toString();
				error.info.logMessage = 'Failed to create pre confirm data';
				error.info.code = 300;
				error.info.message = 'system error';
				reject(error);
			}
		})
	}
}
