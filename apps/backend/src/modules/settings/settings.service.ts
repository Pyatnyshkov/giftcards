import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { getClientObject, getDataRequest } from '../../libs/requestSettings';
import { generateRequestObjects, pushErrorMessages } from '../../libs/generateRequestObjects';
import { SettingsDto } from './dto/settings.dto';
import type { IByShopIdRequest, IStandaloneName } from '../../interfaces/main.interfaces';
import type {
	ResponseInterface, IStandaloneShopSettings, IGiftcardSettings
} from '../../interfaces/response.interface';
import type { IErrorData } from '../../interfaces/error.interface';

@Injectable()
export class SettingsService {
	constructor(
		private readonly configService: ConfigService,
		private readonly loggerService: LoggerService,
	) {}

	async settings(
		body: SettingsDto,
		session: Record<string, string>,
		headers: Headers,
	): Promise<IStandaloneShopSettings | ResponseInterface> {
		const { res, loggingObject, standaloneName } =
			generateRequestObjects('/api/settings', body, session, headers);

		try {
			const standaloneShopSettings = await this.settingsBackendRequest(standaloneName);
			loggingObject.response_data.standaloneShopSettings = standaloneShopSettings;
			this.loggerService.log('Successful get standalone shop settings from backend', loggingObject);
			res.data.theme = standaloneShopSettings.theme;

			const giftCardSettings =
				await this.giftCardSettingsBackendRequest({ shop_id: standaloneShopSettings.shop_id });
			loggingObject.response_data.giftcard = giftCardSettings;
			this.loggerService.log('Successful get giftcard settings from backend', loggingObject);

			res.data.bin = giftCardSettings.bin;
			res.data.denominals = giftCardSettings.denominals;
			res.data.bestseller_denominals = giftCardSettings.bestseller_denominals;
			return res;
		} catch(error) {
			pushErrorMessages(loggingObject, error.info)
			this.loggerService.error(error.info.logMessage, loggingObject);

			res.error = error.info.code;
			res.errorMessage = error.info.logMessage;
			return res;
		}
	}

	/**
	 * @param standaloneName - StandaloneName object
	 *
	 * @return shop settings for this standaloneName
	 */
	async settingsBackendRequest(
		standaloneName: IStandaloneName,
	): Promise<IStandaloneShopSettings> {
		let client;
		const errorData: IErrorData = {};
		errorData.info = {};

		try {
			client = await getClientObject({}, this.configService.getOrThrow('coreSettings'));
		} catch (error) {
			errorData.info.code = 300;
			errorData.info.connectionError = error;
			errorData.info.logMessage = 'Failed to connect to core settings service';
			throw(errorData);
		}

		try {
			const clientMethod = client.get_standalone_shop_settingsAsync;
			const result = await getDataRequest(standaloneName, {}, this.configService.getOrThrow('coreSettings'), clientMethod);
			return result[0].retval;
		} catch(error) {
			errorData.info.code = 301;
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to get standalone shop settings from backend';
			throw(errorData);
		}
	}

	/**
	 * @param shopID - shopID objct
	 *
	 * @return giftcard settings
	 */
	async giftCardSettingsBackendRequest(
		shopID: IByShopIdRequest
	): Promise<IGiftcardSettings> {
		let client;
		const errorData: IErrorData = {};
		errorData.info = {};

		try {
			client = await getClientObject({}, this.configService.getOrThrow('coreSettings'));
		} catch (error) {
			errorData.info.code = 300;
			errorData.info.connectionError = error;
			errorData.info.logMessage = 'Failed to connect to core settings service';
			throw(errorData);
		}

		try {
			const clientMethod = client.get_gift_card_settingsAsync;
			const result =
				await getDataRequest(shopID, {}, this.configService.getOrThrow('coreSettings'), clientMethod);
			return result[0].retval;
		} catch(error) {
			errorData.info.code = 301;
			errorData.info.requestError = error;
			errorData.info.logMessage = 'Failed to get gift card settings from backend';
			throw(errorData);
		}
	}
}

