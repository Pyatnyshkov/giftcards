export interface ISettings extends IObjectKeys {
	theme: ITheme;
	bin: string;
	denominals: number[];
	bestseller_denominals: number[];
}

export interface ITheme extends IObjectKeys {
	brand: string;
	shop_name: string;
}

interface IObjectKeys {
	[key: string]: any
}
