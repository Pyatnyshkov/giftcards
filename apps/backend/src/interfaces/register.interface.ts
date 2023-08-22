import type { IAmount, ICustomer, IDescription, IOrder, IPostdata, IUrl } from './main_request.interface';
import type { IReceiptItem } from './receipt.interface';

export interface IPreRegisterData {
	shop: number;
	orderNumber: string;
	amount: number;
	currency: string;
	timelimit: string;
	basketElems: IReceiptItem[];
	email?: string;
	phone?: string;
	name?: string;
	language?: string;
	urls?: IUrl;
}

export interface IFormattedRegisterData {
	order: IOrder;
	cost: IAmount;
	customer: ICustomer;
	description: IDescription;
	postdata: IPostdata
}
