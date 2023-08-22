export interface IBalance {
	amount: number;
	currency: string;
}

export interface IBalanceState {
	showError: boolean;
	balance: IBalance | null;
	loading: boolean;
}

export interface IBalanceReq {
	standalone_name: string;
	account: string;
	pin: string;
	account_type: string;
}
