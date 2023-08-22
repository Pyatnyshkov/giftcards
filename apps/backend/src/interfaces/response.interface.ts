import { ILoggingObject } from './logging.interface';
import { IStandaloneName } from './main.interfaces';

export interface IGenerateRequestObjectsResponse {
	res: ResponseInterface,
	loggingObject: ILoggingObject,
	standaloneName: IStandaloneName,
}

export interface ResponseInterface {
	error: number;
	errorMessage?: string;
	data: {
		url?: string;
		status?: string;
		signature?: string;
		gift_card_number?: string,
		user_email?: string;
		amount?: number;
		currency?: string;
		theme?: {
			brand: string;
			shop_name: string;
		};
		bin?: string;
		denominals?: number[];
		bestseller_denominals?: number[];
	};
}

export interface IActiveStatusResponse {
	gift_card_number: string,
	status: string,
	user_email: string
}

export interface IStandaloneShopSettings {
	language: string;
	credentials: string;
	password: string;
	receipt: {
		clearing: string;
		host: string;
		name: string;
		tax: string;
		taxation_item_type: string;
		taxation_system: string;
		taxation_item_settlement_method: string;
		typename: string;
	};
	shop_id: number;
	standalone_name: string;
	theme: {
		brand: string;
		shop_name: string;
	};
	timelimit: string;
}

export interface IBalanceResponse {
	amount: number;
	currency: string;
}

export interface IGiftcardSettings {
	bin: string;
	denominals: number[];
	bestseller_denominals: number[];
}
