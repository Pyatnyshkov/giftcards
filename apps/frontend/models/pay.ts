export interface IPayState {
	loading: boolean;
	status: string;
	redirectUrl: string;
	error: IPayError;
}

export interface IPayError {
	tip?: string;
	text?: string;
	comment?: string;
}

export interface ICancelReq {
	standalone_name: string;
	orderNumber: string;
}

export interface IPayReq {
	standalone_name: string;
	orderNumber: string;
	account: string;
	pin: string;
	account_type: string;
}

export interface IPayRes {
	url: string;
}

export interface IstatusReq {
	standalone_name: string;
	orderNumber: string;
}

export interface IStatusRes {
	status: string;
}
