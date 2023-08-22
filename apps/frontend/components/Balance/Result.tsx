import React, { Fragment, FC } from 'react';

import Offer from '../UI/Offer';

import { useAppSelector, useAppDispatch } from '../../helpers/redux-hooks';
import { clearBalance } from '../../store/reducers/balance';

const formatNumber = (number: string) => {
	let formatted = [];
	for (let i = 0; i <= number.length; i++) {
		if (i <= 5 || i >= 15) {
			formatted[i] = number[i];
		} else {
			formatted[i] = '*';
		}
	}
	return formatted.join('');
};

interface ResultProps {
	number: string;
}

const Result: FC<ResultProps> = ({ number }) => {
	const { localization, config } = useAppSelector((state) => state.app);
	const { balance } = useAppSelector((state) => state.balance);
	const dispatch = useAppDispatch();
	return (
		<Fragment>
			<div className="balance_result-title">
				{`${localization.allow} ${formatNumber(number)} ${
					localization.is
				}`}
			</div>
			<div className="balance_result-amount">
				{`${balance!.amount} ${balance!.currency}`}
			</div>
			<button
				onClick={() => dispatch(clearBalance())}
				className="button button_result"
			>
				{localization.back}
			</button>
			<Offer />
		</Fragment>
	);
};

export default Result;
