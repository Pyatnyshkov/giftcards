import type { IOrder, IPaymentPart } from './main_request.interface';
import type { IReceiptItem } from './receipt.interface';

export interface IPreConfirmData {
	shop: number;
	orderNumber: string;
	basketElems: IReceiptItem[];
}

interface IConfirmItems {
	OrderItem?: IReceiptItem[];
}

interface IConfirmParts {
	PaymentPart?: IPaymentPart[];
}

interface IConfirmDescription {
	parts?: {
		PaymentPart?: IPaymentPart[];
	};
}

export interface IFormattedConfirmData {
	order: IOrder;
	items: IConfirmItems;
	parts: IConfirmParts;
	description: IConfirmDescription;
}
