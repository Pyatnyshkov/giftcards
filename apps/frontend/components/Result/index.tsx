import React, { useState, useEffect, Fragment } from 'react';

import { useAppSelector, useAppDispatch } from '../../helpers/redux-hooks';
import { api } from '../../services/api';
import { setError, setLoading } from '../../store/reducers/result';

import Loader from '../UI/Loader';
import Offer from '../UI/Offer';
import Card from '../UI/Card';

import axios from 'axios';
import info from '../../helpers/info';
import urls from '../../utils/urls';

import { IReqData } from '../../models/reqData';

declare global {
	interface Window {
		dataLayer: { [key: string]: string }[];
	}
}

const Result = () => {
	const { config, settings, localization, reqData } = useAppSelector(
		(state) => state.app,
	);
	const { loading, showError } = useAppSelector((state) => state.result);
	const [actStatus, result] = api.useLazyActStatusQuery();
	const dispatch = useAppDispatch();

	useEffect(() => {
		info(reqData.Shop_IDP, 'loaded page result', reqData);
		if (reqData.status === 'ok') {
			getStatus(reqData);
		} else {
			dispatch(setError(true));
			showPage(reqData);
		}
	}, []);

	const timeoutRedirect = (data: IReqData) => {
		setTimeout(() => {
			const purchaseUrl =
				window.location.origin +
				window.location.pathname.replace('/result', '/purchase') +
				`?Shop_IDP=${data.Shop_IDP}&Currency=${data.Currency}`;
			window.location.href = purchaseUrl;
		}, 10 * 1000);
	};

	const showPage = (data: IReqData) => {
		dispatch(setLoading(false));
		// timeoutRedirect(data);
	};

	useEffect(() => {
		if (result.data && result.data.status === 'success') {
			const eventAction = 'purchase.gift.card';
			const pageType = ' purchase.gift.card ';
			const userAuth = 'Y';
			const { user_email, user_name, gift_card_value } = result.data;
			const dataLayer: { [key: string]: string } = {
				eventAction: 'purchase.gift.card',
				pageType: ' purchase.gift.card ',
				userAuth: 'Y',
				user_email: user_email,
				user_name: user_name || '',
				gift_card_value: gift_card_value,
			};
			window.dataLayer = window.dataLayer || [];
			Object.keys(dataLayer).forEach((elem) =>
				window.dataLayer.push({ [elem]: dataLayer[elem] }),
			);
		} else if (result.data && result.data.status !== 'failed') {
			setTimeout(() => {
				const statusData = {
					standalone_name: reqData.Shop_IDP,
					orderNumber: reqData.Order_IDP,
				};
				actStatus(statusData);
			}, 1000);
		}
	}, [result])

	const getStatus = (data: IReqData) => {
		const statusData = {
			standalone_name: data.Shop_IDP,
			orderNumber: data.Order_IDP,
		};
		actStatus(statusData);
	};

	if (loading) return <Loader />;

	return (
		<Card header={localization.result_pay}>
			<div className="card card_result">
				<div className="result_title">
					{!showError
						? localization.result_ok_title
						: localization.result_fault_title}
				</div>
				<div className="result_message-container">
					{!showError ? (
						<Fragment>
							<div className="result_message">
								{localization.result_ok_message}
							</div>
							<div className="result_tip">
								{localization.result_ok_tip}
							</div>
						</Fragment>
					) : (
						<Fragment>
							<div className="result_message">
								{localization.result_fault_message}
							</div>
							<div className="result_tip">
								{localization.result_fault_tip}
							</div>
							<div className="result_support">
								{localization.result_support}
							</div>
						</Fragment>
					)}
				</div>
				<Offer />
			</div>
		</Card>
	);
};

export default Result;
