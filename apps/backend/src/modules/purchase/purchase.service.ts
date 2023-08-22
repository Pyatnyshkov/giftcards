import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { RegisterService } from '../order/register.service';
import { LoggerService } from '../logger/logger.service';
import { PurchaseDto } from './dto/purchase.dto';
import { generatePrePurchaseData, generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { formatDataRegister } from '../../libs/formatData';
import type { IPrePurchaseData } from '../../interfaces/purchase.interface';
import type { IStandaloneShopSettings } from '../../interfaces/response.interface';
import type { IToken } from '../../interfaces/main.interfaces';
import type { IReceiptItem } from '../../interfaces/receipt.interface';

@Injectable()
export class PurchaseService {
	constructor(
		private readonly loggerService: LoggerService,
		private readonly settings: SettingsService,
		private readonly registerService: RegisterService,
	) {}

	async purchase(
		body: PurchaseDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<unknown> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/purchase', body, session, headers);
		try {
			const shopSettingsResponse = await this.settings.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = shopSettingsResponse;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);

			const prePurchaseData = generatePrePurchaseData(body, shopSettingsResponse);
			this.generateBasketElement(body, shopSettingsResponse, prePurchaseData);

			const registerData = await formatDataRegister(prePurchaseData);
			const auth: IToken = {
				Authorization: shopSettingsResponse.credentials,
			};

			const url = await this.registerService.registerBackendRequest(registerData, auth);
			loggingObject.response_data.url = url;
			this.loggerService.log('Order registered', loggingObject)

			res.data = {};
			res.data.url = url;
			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info);
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	generateBasketElement(
		body: PurchaseDto,
		shopSettingsResponse: IStandaloneShopSettings,
		prePurchaseData: IPrePurchaseData
	) {
		const _item: IReceiptItem = {
			name: 'Giftcard',
			host: 'shop',
			typename: 'goods',
			clearing: 'card',
			amount: body.amount,
			currency: body.currency,
			cheque: {},
		};
		const taxSettings = shopSettingsResponse.receipt || {};
		const taxCondition =
			Boolean(taxSettings.tax &&
				taxSettings.taxation_system &&
				taxSettings.taxation_item_type &&
				taxSettings.taxation_item_settlement_method
			);

		if(taxCondition && _item.cheque) {
			_item.cheque.quantity = 1;
			_item.cheque.measure = 'ШТ';
			_item.cheque.taxation_system = taxSettings.taxation_system;
			_item.cheque.taxation_item_type = taxSettings.taxation_item_type;
			_item.cheque.taxation_item_settlement_method = taxSettings.taxation_item_settlement_method;
			_item.cheque.tax_rate = taxSettings.tax;

			let tax_amount;
			const tax_rate = taxSettings.tax.toString();
			switch (tax_rate) {
				case '0':
				case '10':
				case '18':
				case '20':
					tax_amount = body.amount - body.amount / (1 + parseInt(tax_rate) / 100);
					break;
				case '10/110':
				case '18/118':
				case '20/120':
					const [rate, base] = tax_rate.split("/");
					if(rate && base) tax_amount = body.amount * parseInt(rate) / parseInt(base);
					break;
				default:
					tax_amount = 0;
			}
			_item.cheque.amount = tax_amount;
		}


		prePurchaseData.basketElems.push(_item);
	}
}
