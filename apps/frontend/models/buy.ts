export interface IBuyState {
	loading: boolean;
	showError: boolean;
}

export interface IBuyRes {
	url: string;
}

export interface IBuyReq {
	standalone_name: string;
	orderNumber: string;
	amount: string;
	currency: string;
	email: string;
	phone: string;
	url: {
		ok: string;
		fail: string;
	};
}

export interface IActivateReq {
	standalone_name: string;
	orderNumber: string;
}
