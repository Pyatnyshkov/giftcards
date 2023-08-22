import React, { Fragment, useState, useEffect } from 'react';

import axios from 'axios';

import { useAppSelector } from '../../helpers/redux-hooks';
import { api } from '../../services/api';

import InputMask 	from 'react-input-mask';
import Card 		from '../UI/Card';
import Loader 		from '../UI/Loader';
import Offer 		from '../UI/Offer';
import Figure 		from './Figure';

import info from '../../helpers/info';
import urls from '../../utils/urls';

const Buy = () => {
	const { config, settings, localization, reqData } = useAppSelector(
		(state) => state.app,
	);
	const { loading, showError } = useAppSelector((state) => state.buy);
	const [purchase, purchaseResult] = api.useLazyPurchaseQuery();
	const [activate, activateResult] = api.useLazyActivateQuery();

	const [step, setStep] = useState<number>(1);

	const [cardAmount, setAmount] = useState<number>(2000);
	const [customAmount, setCustomAmount] = useState<string>('');

	const [email, setEmail] = useState<string>('');
	const [phone, setPhone] = useState<string>('');

	const [emailError, setEmailError] = useState<boolean>(false);
	const [emailEmpty, setEmailEmpty] = useState<boolean>(false);
	const [phoneError, setPhoneError] = useState<boolean>(false);
	const [phoneEmpty, setPhoneEmpty] = useState<boolean>(false);

	const [isGoing, setIsGoing] = useState<boolean>(false);

	useEffect(() => {
		info(reqData.Shop_IDP, 'loaded page giftcard', reqData);
	}, []);

	const pay = () => {
		if (checkData()) {
			const url =
				window.location.origin +
				window.location.pathname.replace(/\/purchase|\/buy/, '/result');
			const orderNumber = reqData.Order_IDP || Date.now().toString();
			const { Shop_IDP, Currency } = reqData;
			const return_url_ok = `${url}?Shop_IDP=${Shop_IDP}&Order_IDP=${orderNumber}&Currency=${Currency}&status=ok`;
			const return_url_fail = `${url}?Shop_IDP=${Shop_IDP}&Order_IDP=${orderNumber}&Currency=${Currency}&status=fail`;
			const purchaseData = {
				standalone_name: Shop_IDP,
				orderNumber,
				amount: cardAmount.toString() || customAmount,
				currency: Currency,
				email,
				phone,
				url: {
					ok: return_url_ok,
					fail: return_url_fail,
				},
			};
			purchase(purchaseData);
			console.log(purchaseResult)
			if (purchaseResult.data) {
				sendActivate(purchaseResult.data.url, return_url_fail, orderNumber);
			}
		}
	};

	const sendActivate = (
		pay_url: string,
		url_fail: string,
		orderNumber: string,
	) => {
		const activateData = {
			standalone_name: reqData.Shop_IDP,
			orderNumber,
		};
		activate(activateData);
		if (activateResult.isError) {
			window.location.href = url_fail;
		} else {
			window.location.href = pay_url;
		}
	};

	const checkData = () => {
		let valid = true;
		setEmailError(false);
		setEmailEmpty(false);
		setPhoneError(false);
		setPhoneEmpty(false);
		setEmail(email.trim());
		setPhone(phone.trim());
		let emailReg =
			/^(([^<>()\[\]\"\".,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!email) {
			setEmailEmpty(true);
			valid = false;
		} else if (!emailReg.test(email)) {
			setEmailError(true);
			valid = false;
		}

		if (!phone) {
			setPhoneEmpty(true);
			valid = false;
		} else if (phone.length !== 11) {
			setPhoneError(true);
			valid = false;
		}
		return valid;
	};

	const handlePhone = (event: { target: HTMLInputElement }) => {
		let phone = event.target.value.replace(/\D/g, '');
		if (phone[0] === '7') {
			phone = '8' + phone.slice(1);
		}
		setPhone(phone);
	};

	const selectAmount = (event: any) => {
		setCustomAmount('');
		setAmount(parseInt(event.target.value));
	};

	const selectCustomAmount = (event: { target: HTMLInputElement }) => {
		const amount = event.target.value;
		if (!amount) {
			setCustomAmount('');
			setAmount(2000);
		} else if (/^\d*$/.test(amount)) {
			setCustomAmount(event.target.value);
			setAmount(0);
		}
	};

	const nextStep = () => {
		const newStep = step + 1;
		setStep(newStep);
	};

	if (loading) {
		return <Loader />;
	} else {
		const nominals = [
			...settings.denominals,
			...settings.bestseller_denominals,
		].sort((a, b) => a - b);

		return (
			<Card wide={true} header={localization.header_giftcard}>
				<div className="giftacard_content">
					<Figure />
					<div className="giftcard_content-right">
						{step === 1 && (
							<Fragment>
								<div className="giftcard_amount-tip">
									{localization.amount_tip}
								</div>
								<div className="giftcard_amount-chips">
									{nominals.map((amount, index) => (
										<label key={index}>
											<input
												name="chip"
												type="radio"
												value={amount}
												className="amount_chip-input"
												onChange={selectAmount}
												checked={amount === cardAmount}
											/>
											<div
												className={
													settings.denominals.includes(
														amount,
													)
														? 'amount_chip'
														: 'amount_chip pref_chip'
												}
											>
												{amount}
											</div>
										</label>
									))}
								</div>
								<div className="giftcard_amount-custom">
									<div className="giftcard_amount-custom_tip">
										{localization.custom_tip}
									</div>
									<div className="giftcard_amount-custom_input">
										<input
											type="text"
											value={customAmount}
											onChange={selectCustomAmount}
											placeholder={
												localization.enterAmount
											}
											className="form_input"
										/>
									</div>
								</div>
								<div className="selectedAmount">
									{`${localization.selectedAmount} ${
										customAmount || cardAmount
									} ${localization.rub}`}
								</div>
							</Fragment>
						)}
						{step === 2 && (
							<Fragment>
								<div className="selectedAmount">
									{`${localization.selectedAmount} ${
										customAmount || cardAmount
									} ${localization.rub}`}
								</div>
								<div className="giftcard_contact">
									<input
										type="text"
										className="form_input form_input-wide"
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder={localization.enterEmail}
									/>
									{emailError && (
										<div className="form_input-error">
											{localization.emailError}
										</div>
									)}
									{emailEmpty && (
										<div className="form_input-error">
											{localization.required}
										</div>
									)}
								</div>
								<div className="giftcard_contact">
									<InputMask
										mask="+7 (999) 999-99-99"
										maskChar=" "
										type="text"
										className="form_input form_input-wide"
										onChange={handlePhone}
										placeholder={localization.enterPhone}
									/>
									{phoneError && (
										<div className="form_input-error">
											{localization.phoneError}
										</div>
									)}
									{phoneEmpty && (
										<div className="form_input-error">
											{localization.required}
										</div>
									)}
								</div>
								<label className="giftcard_contact_check">
									<input
										className="giftcard_content-checkbox"
										type="checkbox"
										checked={isGoing}
										onChange={() => setIsGoing(!isGoing)}
									/>
									<span
										className={
											isGoing
												? 'giftcard_content-checked giftcard_content-checked-true'
												: 'giftcard_content-checked'
										}
									></span>
									<p className="giftcard_contact_check-text">
										{localization.agree_text}&nbsp;
										<a href={config.offer} target="_blank">
											{localization.agree_link}
										</a>
									</p>
								</label>
							</Fragment>
						)}
					</div>
				</div>
				<div className="giftacard_footer">
					<Offer />
					<div className="giftacard_footer-btns">
						{step === 1 && (
							<button
								type="button"
								className="button"
								onClick={nextStep}
							>
								{`${localization.next} >>`}
							</button>
						)}
						{step === 2 && (
							<button
								disabled={!isGoing}
								type="button"
								className="button"
								onClick={pay}
							>
								{localization.pay}
							</button>
						)}
						{showError && (
							<div className="result_error">
								{localization.error}
							</div>
						)}
					</div>
				</div>
			</Card>
		);
	}
};

export default Buy;
