import { type Client, createClientAsync } from 'soap';
import type { IWsdlSettings, IRequestSettings, IConfigKey } from '../interfaces/request_settings.interfaces';
import type { IToken } from '../interfaces/main.interfaces';

/**
 * Generate wsdlSettings object;
 * add auth, host and timeout to wsdlSettings;
 * return call of createClientAsync with params
 * @param auth - Authorization object or empty object
 * @param config - Global config
 * @param key - Key to connect to different services
 * @return call of createClientAsync with params
 */
export async function getClientObject(
	auth: IToken,
	config: IConfigKey,
): Promise<Client> {
	const wsdlSettings: IWsdlSettings = {
		disableCache: true,
		wsdl_headers: {},
		wsdl_options: {},
	};

	wsdlSettings.wsdl_headers = auth;
	wsdlSettings.wsdl_headers.Host = config.host;
	wsdlSettings.wsdl_options.timeout = config.connectionTimeout;

	return createClientAsync(config.url, wsdlSettings);
}

/**
 * Generate requestSettings object;
 * add auth, host and timeout to requestSettings;
 * return call of async client method with params
 * @param data - Data for backend request
 * @param auth - Authorization object or empty object
 * @param config - Global config
 * @param clientMethod - Async method from Client object
 * @param key - Key to connect to different services
 * @return call of async client method with params
 */
export async function getDataRequest<D, T>(
	data: D,
	auth: IToken,
	config: IConfigKey,
	clientMethod: (arg0: D, arg1: IRequestSettings) => T
): Promise<any> {
	const requestSettings: IRequestSettings = {
		headers: {},
		wsdl_options: {},
	};

	requestSettings.headers = auth;
	requestSettings.headers.Host = config.host;
	requestSettings.wsdl_options.timeout = config.timeout;

	return clientMethod(data, requestSettings);
}
