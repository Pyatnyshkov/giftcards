import type { IUrl } from './main_request.interface';
import type { IReceiptItem } from './receipt.interface';
export interface IPrePurchaseData {
	shop: number;
	orderNumber: string;
	currency: string;
	amount: number;
	email: string;
	phone: string;
	name?: string;
	timelimit: string;
	language?: string;
	urls?: IUrl;
	basketElems: IReceiptItem[];
}
