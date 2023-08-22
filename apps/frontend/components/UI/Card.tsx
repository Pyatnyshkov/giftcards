import React, { FC } from 'react';

import { useAppSelector } from '../../helpers/redux-hooks';

interface CardProps {
	children: React.ReactNode;
	wide?: boolean;
	header: string;
}

const Card: FC<CardProps> = ({ children, wide = false, header }) => {
	const { localization } = useAppSelector((state) => state.app);
	return (
		<div className={`${wide ? 'container_wide' : 'container'}`}>
			<div className="card_header">{header}</div>
			<div className="card">{children}</div>
		</div>
	);
};

export default Card;
