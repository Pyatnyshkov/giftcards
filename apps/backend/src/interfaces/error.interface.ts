export interface IErrorData {
	info?: {
		connectionError?: string;
		logMessage?: string;
		requestError?: string;
		code?: number;
	};
}

export interface IErrorInfoData {
	logMessage: string;
	requestError?: {
		body?: string;
		message?: string;
	};
	connectionError?: {
		message?: string;
		code?: string;
	};
	code: number;
}

export interface ErrorInterface {
	info?: {
		receiptAmount?: string | number;
		incomeAmount?: string | number;
		preRegisterDataErrorStr?: string;
		receiptErrorStr?: string;
		dataErrorStr?: string;
		logMessage?: string;
		code?: number;
		message?: string;
	};
}


