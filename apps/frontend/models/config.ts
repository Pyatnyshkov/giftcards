export interface IConfig extends IObjectKeys {
	name?: string;
	card_length?: number[];
	pin_length?: number[];
	captcha?: true;
	placeholder?: true;
	show_pin_balance?: true;
	offer?: string;
	pd?: string;
}

interface IObjectKeys {
	[name: string]: any;
}
