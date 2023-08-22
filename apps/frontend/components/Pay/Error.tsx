import React, { Fragment } from 'react';

import { useAppSelector } from '../../helpers/redux-hooks';

import Card		from '../UI/Card';
import Offer 	from '../UI/Offer';

const RegisterError = () => {
	const { localization } = useAppSelector((state) => state.app);
	return (
		<Card header={localization.header_pay}>
			<div className="result_title">
				{localization.result_fault_title}
			</div>
			<div className="result_message-container">
				<div className="result_message">
					{localization.loading_fault_message}
				</div>
				<div className="result_tip">
					{localization.loading_fault_tip}
				</div>
				<div className="result_support">
					{localization.loading_support}
				</div>
			</div>
			<Offer />
		</Card>
	);
};

export default RegisterError;
