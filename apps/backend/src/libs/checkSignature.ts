import type { ILoggingObject } from '../interfaces/logging.interface';
import type { IErrorData } from '../interfaces/error.interface';

/**
 * Check two signatures
 * @param signature - Signature, generated from request data
 * @param bodySignature - Signature from request
 * @param loggingObject - Logging object
 * @return - throw error object, if signatures not equal
 */
export function checkSignature(signature: string, bodySignature: string, loggingObject: ILoggingObject) {
	loggingObject.incomeSignature = bodySignature;
	loggingObject.generatedSignature = signature;

	const error: IErrorData = {};
	error.info = {};
	error.info.code = 100;
	error.info.logMessage = 'Wrong signature';
	throw(error);
}
