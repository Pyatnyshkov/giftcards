import React, { Fragment } from 'react';

import Offer from '../UI/Offer';

import { useAppSelector, useAppDispatch } from '../../helpers/redux-hooks';
import { showError } from '../../store/reducers/balance';

const BalanceError = () => {
	const { localization } = useAppSelector((state) => state.app);
	const dispatch = useAppDispatch();
	return (
		<Fragment>
			<div className="balance_error-title">
				{localization.balance_error_title}
			</div>
			<div className="balance_error-message">
				{localization.balance_error_message}
			</div>
			<div className="balance_error-tip">
				{localization.balance_error_tip}
			</div>
			<button
				onClick={() => dispatch(showError(false))}
				className="button button_result"
			>
				{localization.back}
			</button>
			<Offer />
		</Fragment>
	);
};

export default BalanceError;
