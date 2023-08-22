import {
	IAmount, ICustomer, IItemCheque, IItemMarkingInfo, ILines, IParams, IPayments, ITaxes
} from './main_request.interface';

export interface IReceiptItem {
	name: string;
	host: string;
	typename: string;
	clearing: string;
	amount: IAmount | number;
	currency?: string;
	number?: string;
	shopref?: string;
	ref?: number;
	marking_info?: IItemMarkingInfo;
	cheque?: IItemCheque;
	taxes?: ITaxes;
	PaymentParts?: [];
	quantity?: number;
	measure?: string;
	taxation_system?: string | number;
	taxation_item_type?: string | number;
	taxation_item_settlement_method?: string | number;
}

export interface IParsedReceiptItem {
	customer: ICustomer;
	taxmode: number;
	lines: ILines[];
	payments: IPayments[];
	params: IParams;
	total: number;
}
