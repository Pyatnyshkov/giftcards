import { IReceiptItem } from './receipt.interface';

export interface IUrl {
	ok: string;
	fail: string;
}

export interface IAmount {
	amount?: number;
	currency?: string;
}

export interface IOrder {
	shop_id?: number;
	number?: string;
}

export interface ICustomer {
	id?: number;
	full_name?: string;
	email?: string;
	phone?: string;
	name?: string;
}

export interface IPayments {
	kind: string;
	amount: number;
}

export interface IParams {
	place: string
}

export interface IItemMarkingInfo {
	kt?: string
}

export interface IDescription {
	timelimit: string;
	sales?: {
		OrderItem?: IReceiptItem[];
	};
	parts?: {
		PaymentPart?: IPaymentPart[];
	}
}

export interface IPostdata {
	PostEntry: PostEntryObject[]
}

export interface ILines {
	vat: number;
	name: string;
	id: number;
	qty: number;
	price: number;
	sum: number;
	payattr: number;
	lineattr: number;
	product: IItemMarkingInfo;
	shopref: string;
}

export interface IItemCheque {
	quantity?: number;
	measure?: string;
	taxation_system?: string | number;
	taxation_item_type?: string | number;
	taxation_item_settlement_method?: string | number;
	tax_rate?: string | number;
	source?: string;
	amount?: number;
}

export interface ITax {
	attributes?: {
		type?: string
	};
	percentage?: string | number;
	source?: string;
	amount: IAmount;
}

export interface IItemsByName { [key: string]: ILines[] }

export interface IPaymentPart {
	ref?: number;
	type?: string;
	amount?: IAmount;
	code?: number | string;
	id?: number | string;
}

export interface ITaxes {
	tax: ITax[]
}

export interface PostEntryObject {
	[key: string]: string
}
