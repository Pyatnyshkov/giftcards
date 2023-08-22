import React, { Fragment } from 'react';

import { useAppSelector } from '../../helpers/redux-hooks';

const Figure = () => {
	const { localization, settings } = useAppSelector((state) => state.app);
	const { brand, shop_name } = settings.theme;
	const cardSrc = require(`../../config/${brand}/${shop_name}/img/card.png`)
		.default.src;
	return (
		<figure className="giftcard_content-figure">
			<img
				src={cardSrc}
				alt="giftcard"
				className="giftcard_content-image"
			/>
			<p className="giftcard_content-parag">
				{localization.electronic_gift_cards}
			</p>
		</figure>
	);
};

export default Figure;
