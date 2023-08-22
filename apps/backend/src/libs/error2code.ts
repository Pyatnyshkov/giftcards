import { ICodes } from '../interfaces/main.interfaces';

/**
 * Check error code.
 * @param xml - error body string;
 * @return error number
 */
export function error2code(xml: string) {
	const codes: ICodes = {
		INVALID_PIN: 611,
		INSUFFICIENT_FUNDS: 612,
		BLOCKED_CARD: 613,
		EXPIRED_CARD: 614,
	};

	const regExp = /<faultstring>(?<error>.*)<\/faultstring>/g;
	const faultString  = regExp.exec(xml)?.groups?.error || '';
	return codes[faultString] || 600;
}
