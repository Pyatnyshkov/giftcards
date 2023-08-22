export interface ICodes {
	[key: string]: number
}

export interface IStandaloneName {
	standalone_name: string;
}

interface IShopAndNumber {
	shop_id: number;
	number: string;
}

export interface IByOrderRequest {
	order: IShopAndNumber;
}

export interface IByShopIdRequest {
	shop_id: number;
}

export interface IToken {
	Authorization?: string;
}

export interface IBalanceData {
	shop_id: number;
	account_type: string;
	account: string;
	pin?: number;
}

export interface IAuthorizeData {
	order: IShopAndNumber;
	account_type: string;
	account: string;
	pin: string;
}
