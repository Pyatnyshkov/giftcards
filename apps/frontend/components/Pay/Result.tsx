import React, { FC } from 'react';

import { useAppSelector } from '../../helpers/redux-hooks';

import Offer from '../UI/Offer';
import Card  from '../UI/Card';

interface IResultProps {
	timer: number;
	redirect: (e: any) => void;
}

const Result: FC<IResultProps> = ({ timer, redirect }) => {
	const {
		reqData: { Subtotal_P, Currency }, localization,
	} = useAppSelector((state) => state.app);
	const { status } = useAppSelector((state) => state.pay);

	return (
		<Card header={localization.header_pay}>
			<div className="card">
				<div className="result_title">
					{status === 'authorized'
						? localization.result_ok_title
						: localization.result_fault_title}
				</div>
				{status === 'authorized' ? (
					<div className="result_message-container">
						<div className="result_message">
							{`${localization.pay_order} ${localization.pay_amount} ${Subtotal_P} ${Currency} ${localization.pay_ok}`}
						</div>
						<div className="result_tip">{localization.pay_ok_tip}</div>
					</div>
				) : (
					<div className="result_message-container">
						<div className="result_message">
							{localization.pay_fail_message}
						</div>
						<div className="result_tip">
							{localization.result_fault_tip}
						</div>
					</div>
				)}

				<div className="result_container">
					<button onClick={redirect} className="button button_result">
						{localization.back}
					</button>
					<div className="result_timer">{`Вы будете перенаправлены на сайт магазина через ${timer} сек.`}</div>
				</div>

				<Offer />
			</div>
		</Card>
	);
};

export default Result;
