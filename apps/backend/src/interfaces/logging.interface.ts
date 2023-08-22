import { IBalanceResponse, IGiftcardSettings, IStandaloneShopSettings } from './response.interface';

export interface ILoggingObject {
	request_name: string;
	request_body: any;
	request_headers: Headers;
	session_id?: string;
	error_messages: {
		logMessage?: string;
		requestErrorBody?: string;
		requestErrorMessage?: string;
		connectionError?: string;
		connectionErrorCode?: string;
		receiptAmount?: string;
		incomeAmount?: string;
		preRegisterDataErrorStr?: string;
		receiptErrorStr?: string;
		code?: number;
		message?: string;
		dataErrorStr?: string;
	};
	response_data: {
		url?: string;
		signature?: string;
		standaloneShopSettings?: IStandaloneShopSettings;
		balance?: IBalanceResponse;
		status?: string;
		giftcard?: IGiftcardSettings,
	};
	incomeSignature?: string;
	generatedSignature?: string;
}
