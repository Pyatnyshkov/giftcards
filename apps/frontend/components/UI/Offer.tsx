import React from 'react';

import { useAppSelector } from '../../helpers/redux-hooks';

const Offer = () => {
	const {
		localization,
		config: { offer },
	} = useAppSelector((state) => state.app);
	return (
		<div className="offer_container">
			<div className="offer_tip">{localization.offer_tip}</div>
			<div className="offer_links">
				<a href={offer} target="_blank">
					{localization.offer_rules}
				</a>{' '}
				|{' '}
				<a href={offer} target="_blank">
					{localization.offer_offer}
				</a>
			</div>
		</div>
	);
};

export default Offer;
