export interface IActStatusReq {
	standalone_name: string,
	orderNumber: string,
}

export interface IActStatusRes {
	status: string;
	user_email: string;
	user_name: string;
	gift_card_value: string;
}

export interface IResultState {
	showError: boolean,
	loading: boolean,
}