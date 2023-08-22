import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { formatDataRegister, formatReceipt, generateFormattedItem, parseReceipt } from '../../libs/formatData';
import { generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { error2code } from '../../libs/error2code';
import { checkSignature } from '../../libs/checkSignature';
import { RegisterDto } from './dto/register.dto';
import type { IToken } from '../../interfaces/main.interfaces';
import type { IStandaloneShopSettings } from '../../interfaces/response.interface';
import type { IFormattedRegisterData, IPreRegisterData } from '../../interfaces/register.interface';
import type { ErrorInterface, IErrorData } from '../../interfaces/error.interface';
import type { IReceiptItem } from '../../interfaces/receipt.interface';
import md5 from 'md5';

@Injectable()
export class RegisterService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
	) {}

	async register(
		body: RegisterDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } = generateRequestObjects('/api/register', body, session, headers);

		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const signature = this.generateRegisterSignature(body, shopSettingsResponse);
			if (signature !== body.signature) {
				checkSignature(signature, body.signature, loggingObject);
			}

			const preRegisterData = await this.createPreRegisterData(body, shopSettingsResponse);

			const registerData = await formatDataRegister(preRegisterData);

			const auth: IToken = {
				Authorization: shopSettingsResponse.credentials,
			};

			const url = await this.registerBackendRequest(registerData, auth);
			loggingObject.response_data.url = url;
			this.loggerService.log('Order registered', loggingObject)

			res.data = {};
			res.data.url = url;
			return res;
		} catch (error) {
			pushErrorMessages(loggingObject, error.info);
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	async registerBackendRequest(
		data: IFormattedRegisterData,
		auth: IToken
	): Promise<string> {
		let client;
		const errorData: IErrorData = {};
		errorData.info = {};

		try {
			client = await getClientObject(auth, this.configService.getOrThrow('orderv2'));
		} catch (error) {
			errorData.info.connectionError = error;
			errorData.info.logMessage = 'Failed to connect to order v2';
			errorData.info.code = 300;
			throw(errorData);
		}

		try {
			const clientMethod = client.registerAsync;
			const result = await getDataRequest(data, auth, this.configService.getOrThrow('orderv2'), clientMethod);
			return result[0].retval.redirect_url + '?session=' + result[0].retval.session;
		} catch (error) {
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to register';
			errorData.info.code = error2code(error.body);
			throw(errorData);
		}
	}

	generateRegisterSignature(
		body: RegisterDto,
		standaloneShopSettings: IStandaloneShopSettings
	): string {
		const standaloneName = md5(body.standalone_name);
		const orderNumber = md5(body.orderNumber);
		const amount = md5(String(body.amount));
		const timelimit = md5(body.timelimit);
		const receipt = md5(body.receipt);
		const password = standaloneShopSettings.password;

		return md5(
			standaloneName + '&' + orderNumber + '&' + amount + '&' + timelimit + '&' + receipt + '&' + password
		).toUpperCase();
	};

	async createPreRegisterData(
		body: RegisterDto,
		shopSettings: IStandaloneShopSettings
	): Promise<IPreRegisterData> {
		return new Promise(async (resolve, reject) => {
			try {
				const preRegisterData: IPreRegisterData = {
					shop: shopSettings.shop_id,
					orderNumber: body.orderNumber,
					currency: body.currency,
					amount: body.amount,
					timelimit: body.timelimit,
					basketElems: [],
				};

				if (!body.email) {
					preRegisterData.email = body.email;
				}

				let totalAmount = 0;
				const receipt = parseReceipt(body.receipt);

				if (Object.keys(receipt).length === 0) {
					const _item: IReceiptItem = {
						name: 'аванс',
						host: 'shop',
						typename: 'goods',
						clearing: 'loyalty',
						amount: body.amount,
						currency: body.currency,
						cheque: {},
					};
					preRegisterData.basketElems.push(_item);
				} else {
					const formattedReceipt =
						await formatReceipt(receipt).catch((error) => reject(error));

					if (!formattedReceipt) return;

					if (formattedReceipt.customer && formattedReceipt.customer.phone) {
						preRegisterData.phone = formattedReceipt.customer.phone;
					}

					formattedReceipt.lines.forEach((item) => {
						const _item = generateFormattedItem(item, body.currency, formattedReceipt)
						preRegisterData.basketElems.push(_item);
						totalAmount += parseFloat(String(item.sum));
					});
				}
				if (totalAmount !== 0 && parseFloat(totalAmount.toFixed(2)) !== body.amount) {
					const error: ErrorInterface = {};
					error.info = {};
					error.info.receiptAmount = totalAmount;
					error.info.incomeAmount = body.amount;
					error.info.logMessage = 'Wrong amount';
					error.info.code = 300;
					error.info.message = 'system error';
					reject(error);
				}
				resolve(preRegisterData)
			} catch (e) {
				const error: ErrorInterface = {};
				error.info = {};
				error.info.preRegisterDataErrorStr = e.toString();
				error.info.logMessage = 'Failed to create pre register data';
				error.info.code = 300;
				error.info.message = 'system error';
				reject(error);
			}
		})
	};
}
