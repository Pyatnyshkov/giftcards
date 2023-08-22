import type { IByOrderRequest, IStandaloneName, IBalanceData, IAuthorizeData } from '../interfaces/main.interfaces';
import type {
	IStandaloneShopSettings, ResponseInterface, IGenerateRequestObjectsResponse
} from '../interfaces/response.interface';
import type { BalanceDto } from '../modules/balance/dto/balance.dto';
import type { PayDto } from '../modules/pay/dto/pay.dto';
import type { ConfirmDto } from '../modules/confirm/dto/confirm.dto';
import type { PurchaseDto } from '../modules/purchase/dto/purchase.dto';
import type { IPreConfirmData } from '../interfaces/confirm.interface';
import type { IPrePurchaseData}  from '../interfaces/purchase.interface';
import type { ILoggingObject } from '../interfaces/logging.interface';
import type { IErrorInfoData } from '../interfaces/error.interface';

/**
 * Generate and return Response, Logging and StandaloneName objects.
 * @param request_name - Name of request for logging
 * @param body - Request body
 * @param session - Session for logging
 * @param headers - Headers  for logging
 */
export function generateRequestObjects(
	request_name: string,
	body: any,
	session: Record<string, string>,
	headers: Headers,
): IGenerateRequestObjectsResponse {
	const res: ResponseInterface = {
		error: 0,
		data: {}
	};

	const loggingObject: ILoggingObject = {
		request_name: request_name,
		request_body: body,
		request_headers: headers,
		session_id: session.id,
		error_messages: {},
		response_data: {}
	};

	const standaloneName: IStandaloneName = {
		standalone_name: body.standalone_name
	};

	return { res, loggingObject, standaloneName };
}

/**
 * Adds errors to the logging object.
 * @param loggingObject - Logging object
 * @param errorInfo - Object with error messages
 */
export function pushErrorMessages(loggingObject: ILoggingObject, errorInfo: IErrorInfoData) {
	loggingObject.error_messages.logMessage = errorInfo.logMessage;
	loggingObject.error_messages.requestErrorBody = errorInfo.requestError?.body;
	loggingObject.error_messages.requestErrorMessage = errorInfo.requestError?.message;
	loggingObject.error_messages.connectionError = errorInfo.connectionError?.message;
	loggingObject.error_messages.connectionErrorCode = errorInfo.connectionError?.code;
	loggingObject.error_messages.code = errorInfo.code;
}

/**
 * Generate request data and return it.
 */
export function generateOrderRequest(shop_id: number, orderNumber: string) {
	const byOrderRequest: IByOrderRequest = {
		order: {
			shop_id: shop_id,
			number: orderNumber
		}
	};

	return byOrderRequest;
}

/**
 * Generate request data and return it.
 */
export function generateBalanceData(shop_id: number, body: BalanceDto) {
	const balanceData: IBalanceData = {
		shop_id: shop_id,
		account_type: body.account_type,
		account: body.account,
		pin: body.pin,
	};

	return balanceData;
}

/**
 * Generate request data and return it.
 */
export function generateAuthorizeData(shopSettingsResponse: IStandaloneShopSettings, body: PayDto) {
	const authorizeRequest: IAuthorizeData = {
		order: {
			shop_id: shopSettingsResponse.shop_id,
			number: body.orderNumber,
		},
		account_type: body.account_type,
		account: body.account,
		pin: body.pin,
	};

	return authorizeRequest;
}

/**
 * Generate request data and return it.
 */
export function generatePreConfirmData(body: ConfirmDto, shopSettingsResponse: IStandaloneShopSettings) {
	const preConfirmData: IPreConfirmData = {
		shop: shopSettingsResponse.shop_id,
		orderNumber: body.orderNumber,
		basketElems: [],
	};

	return preConfirmData;
}

/**
 * Generate request data and return it.
 */
export function generatePrePurchaseData(body: PurchaseDto, shopSettingsResponse: IStandaloneShopSettings) {
	const prePurchaseData: IPrePurchaseData = {
		shop: shopSettingsResponse.shop_id,
		orderNumber: body.orderNumber,
		currency: body.currency,
		amount: body.amount,
		email: body.email,
		phone: body.phone,
		timelimit: shopSettingsResponse.timelimit,
		urls: {
			ok: body.url?.ok,
			fail: body.url?.fail,
		},
		basketElems: [],
	};

	return prePurchaseData;
}
