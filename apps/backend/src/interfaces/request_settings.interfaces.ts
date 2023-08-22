import { IToken } from './main.interfaces';

export interface IConfigKey {
	host: string;
	url: string;
	timeout?: number;
	connectionTimeout?: number;
}

export interface IWsdlSettings {
	disableCache: boolean;
	wsdl_headers: ISettingsHeaders;
	wsdl_options: {
		timeout?: number,
	};
}

interface ISettingsHeaders extends IToken {
	Host?: string;
}

export interface IRequestSettings {
	headers: ISettingsHeaders;
	wsdl_options: {
		timeout?: number,
	};
}
