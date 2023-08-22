interface Theme {
	brand: string;
	shop_name: string;
}

const getConfig = (theme: Theme, type: string) => {
	const globalConfig = require(`../config/${type}.json`);
	const brandConfig = require(`../config/${theme.brand}/${type}.json`);
	const shopConfig = require(`../config/${theme.brand}/${theme.shop_name}/${type}.json`);

	return {
		...globalConfig,
		...brandConfig,
		...shopConfig,
	};
};

export default getConfig;
