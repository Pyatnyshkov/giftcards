import React from 'react';
import { ISettings } from '../../models/settings';

import { useAppSelector } from '../../helpers/redux-hooks';

const Loader = () => {
	const { localization, settings } = useAppSelector((state) => state.app);
	const { brand, shop_name } = settings.theme;
	const src = require(`../../config/${brand}/${shop_name}/img/loader.gif`)
		.default.src;
	return (
		<div className="loader">
			<p className="loader__text">{localization.loading}</p>
			<img alt="loader" src={src} />
		</div>
	);
};

export default Loader;
