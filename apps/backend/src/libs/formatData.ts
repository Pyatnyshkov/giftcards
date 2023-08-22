import type { IPreRegisterData, IFormattedRegisterData } from '../interfaces/register.interface';
import type { IFormattedConfirmData, IPreConfirmData } from '../interfaces/confirm.interface';
import type { IPrePurchaseData } from '../interfaces/purchase.interface';
import type { ErrorInterface } from '../interfaces/error.interface';
import type { IItemsByName, ILines, IPaymentPart, ITax, PostEntryObject } from '../interfaces/main_request.interface';
import type { IParsedReceiptItem, IReceiptItem } from '../interfaces/receipt.interface';
import { makeDate } from './makeDate';
import { escapeName } from './escapeName';
import taxDictionaries from './taxDictionaries';
import md5 from 'md5';

export function formatDataRegister(
	data: IPreRegisterData | IPrePurchaseData
): Promise<IFormattedRegisterData>{
	return new Promise((resolve, reject) => {
		try {
			const formatted: IFormattedRegisterData = {
				order: {
					shop_id: data.shop,
					number: data.orderNumber,
				},
				cost: {
					currency: data.currency,
					amount: data.amount,
				},
				customer: {
					name: data.name,
					email: data.email,
					phone: data.phone,
				},
				description: {
					timelimit: makeDate(data.timelimit),
				},
				postdata: {
					PostEntry: [],
				},
			};

			if (data.basketElems && data.basketElems.length !== 0) {
				formatted.description.sales = {};
				formatted.description.sales.OrderItem = [];
			}

			const language: PostEntryObject = {};
			language.name = 'Language';
			language.value = data.language || 'ru';
			formatted.postdata.PostEntry.push(language);

			if (data.urls && data.urls.ok) {
				const ReturnURLOk: PostEntryObject = {};
				ReturnURLOk.name = 'ReturnURLOk';
				ReturnURLOk.value = data.urls.ok;
				formatted.postdata.PostEntry.push(ReturnURLOk);
			}

			if (data.urls && data.urls.fail) {
				const ReturnURLFault: PostEntryObject = {};
				ReturnURLFault.name = 'ReturnURLFault';
				ReturnURLFault.value = data.urls.fail;
				formatted.postdata.PostEntry.push(ReturnURLFault);
			}

			data.basketElems.forEach((item, i) => {
				const _item: IReceiptItem = {
					name: escapeName(item.name),
					shopref: item.shopref,
					marking_info: item.marking_info,
					host: item.host,
					typename: item.typename,
					number: data.orderNumber,
					clearing: item.clearing,
					ref: i + 1,
					amount: {
						amount: item.amount as number,
						currency: data.currency,
					},
					taxes: {
						tax: [],
					},
				};

				if (_item.marking_info && _item.marking_info.kt) {
					_item.marking_info.kt = Buffer.from(_item.marking_info.kt).toString('base64');
				}

				if (item.PaymentParts && item.PaymentParts.length !== 0) {
					formatted.description.parts = {};
					formatted.description.parts.PaymentPart = [];
					item.PaymentParts.forEach((PaymentPart: IPaymentPart) => {
						const _part: IPaymentPart = {}
						_part.ref = i + 1;
						_part.type = PaymentPart.type;
						_part.amount = {};
						_part.amount.currency = data.currency;
						_part.amount.amount = PaymentPart.amount as number;

						if (PaymentPart.code) _part.id = PaymentPart.code;

						formatted.description.parts?.PaymentPart?.push(_part);
					});
				}

				if (item.cheque && Object.keys(item.cheque).length !== 0) {
					const cheque = item.cheque;
					_item.quantity = cheque.quantity;
					_item.measure = cheque.measure;
					_item.taxation_system = cheque.taxation_system;
					_item.taxation_item_type = cheque.taxation_item_type;
					_item.taxation_item_settlement_method = cheque.taxation_item_settlement_method;

					const tax: ITax = {
						attributes: {
							type: 'vat'
						},
						percentage: cheque.tax_rate,
						source: cheque.source,
						amount: {
							amount: cheque.amount,
							currency: data.currency
						}
					};
					_item.taxes?.tax.push(tax);
				}

				formatted.description?.sales?.OrderItem?.push(_item);
			});
			resolve(formatted);
		} catch (e) {
			const error: ErrorInterface = {};
			error.info = {};
			error.info.dataErrorStr = e.toString();
			error.info.logMessage = 'Failed to format register data';
			error.info.code = 300;
			error.info.message = 'system error';
			reject(error);
		}
	});
}

export function formatDataConfirm(
	data: IPreConfirmData
): Promise<IFormattedConfirmData>{
	return new Promise(function (resolve, reject) {
		try {
			const formatted: IFormattedConfirmData = {
				order: {
					shop_id: data.shop,
					number: data.orderNumber,
				},
				items: {
					OrderItem: [],
				},
				parts: {
					PaymentPart: [],
				},
				description: {},
			};

			data.basketElems.forEach((item, i) => {
				const _item: IReceiptItem = {
					name: escapeName(item.name),
					marking_info: item.marking_info,
					host: item.host,
					typename: item.typename,
					number: data.orderNumber,
					clearing: item.clearing,
					shopref: item.shopref,
					ref: i + 1,
					amount: {
						amount: item.amount as number,
						currency: item.currency,
					},
					taxes: {
						tax: [],
					},
				};

				if (_item.marking_info && _item.marking_info.kt) {
					const kt = _item.marking_info.kt;
					const buff = Buffer.from(kt);
					_item.marking_info.kt = buff.toString('base64');
				}

				if (item.PaymentParts && item.PaymentParts.length !== 0) {
					formatted.description.parts = {};
					formatted.description.parts.PaymentPart = [];
					item.PaymentParts.forEach((PaymentPart: IPaymentPart) => {
						const _part: IPaymentPart = {};
						_part.ref = i + 1;
						_part.type = PaymentPart.type;
						_part.amount = {};
						_part.amount.amount = PaymentPart.amount as number;
						_part.amount.currency = item.currency;

						if (PaymentPart.code) {
							_part.id = PaymentPart.code;
						}

						formatted.parts.PaymentPart?.push(_part);
					});
				}
				if (item.cheque && Object.keys(item.cheque).length !== 0) {
					const cheque = item.cheque;
					_item.quantity = cheque.quantity;
					_item.measure = cheque.measure;
					_item.taxation_system = cheque.taxation_system;
					_item.taxation_item_type = cheque.taxation_item_type;
					_item.taxation_item_settlement_method = cheque.taxation_item_settlement_method;

					const tax: ITax = {
						attributes: {
							type: 'vat'
						},
						percentage: cheque.tax_rate,
						source: cheque.source,
						amount: {
							amount: cheque.amount,
							currency: item.currency
						}
					};
					_item.taxes?.tax.push(tax);
				}
				formatted.items.OrderItem?.push(_item);
			});
			resolve(formatted);
		} catch (e) {
			const error: ErrorInterface = {};
			error.info = {};
			error.info.dataErrorStr = e.toString();
			error.info.logMessage = 'Failed to format confirm data';
			error.info.code = 300;
			error.info.message  = 'system error';
			reject(error);
		}
	})
}

export function formatReceipt(
	receipt: IParsedReceiptItem
): Promise<IParsedReceiptItem> {
	return new Promise((resolve, reject) => {
		try {
			const newLines: ILines[] = [];
			const itemsByName: IItemsByName = {};
			receipt.lines.forEach((item: ILines) => {
				const count = item.qty;
				item.qty = 1;
				item.sum = item.price;
				for (let i = 0; i < count; i++) {
					const itemName = item.name;
					if (!itemsByName[itemName]) {
						itemsByName[itemName] = [];
					}
					itemsByName[itemName]?.push(JSON.parse(JSON.stringify(item)));
				}
			});

			Object.keys(itemsByName).forEach((name) => {
				let itemCount = 0;
				itemsByName[name]?.forEach((item) => {
					itemCount++;
					item.shopref = md5(name + itemCount);
					newLines.push(item);
				});
			});
			receipt.lines = newLines;
			resolve(receipt);
		} catch (e) {
			const error: ErrorInterface = {};
			error.info = {};
			error.info.receiptErrorStr = e.toString();
			error.info.logMessage = 'Failed to format receipt';
			error.info.code = 300;
			error.info.message = 'system error';
			reject(error);
		}
	});
}

/**
 * Add tax to each item
 * @param item
 * @param currency - Currency
 * @param formattedReceipt - Receipt after formatted
 * @return item with tax data
 */
export function generateFormattedItem(
	item: ILines,
	currency: string,
	formattedReceipt: IParsedReceiptItem
): IReceiptItem {
	const _taxation_system =
		'taxmode' in taxDictionaries ? taxDictionaries.taxmode[formattedReceipt.taxmode] : formattedReceipt.taxmode;
	const _taxation_item_type =
		'lineattr' in taxDictionaries ? taxDictionaries.lineattr[item.lineattr] : item.lineattr;
	const _taxation_item_settlement_method =
		'payattr' in taxDictionaries ? taxDictionaries.payattr[item.payattr] : item.payattr;
	const _tax_rate =
		'vat' in taxDictionaries ? taxDictionaries.vat[item.vat] : item.vat;

	return {
		name: item.name,
		shopref: item.shopref,
		host: 'shop',
		typename: 'goods',
		clearing: 'loyalty',
		amount: item.sum,
		currency: currency,
		marking_info: item.product,
		cheque: {
			quantity: item.qty,
			measure: 'ШТ',
			taxation_system: _taxation_system,
			taxation_item_type: _taxation_item_type,
			taxation_item_settlement_method: _taxation_item_settlement_method,
			tax_rate: _tax_rate,
			source: 'shop_on_confirm',
			amount: item.price,
		},
	};
}

/**
 * Parsing coding string
 * @param receipt - base64 code string
 * @return object type IParsedReceiptItem
 */
export function parseReceipt(
	receipt: string
): IParsedReceiptItem {
	const bufferedReceipt = Buffer.from(receipt, 'base64').toString();
	return JSON.parse(bufferedReceipt);
}

