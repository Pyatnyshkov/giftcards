import React, { useState, useEffect, Fragment } from 'react';

import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import MD5 from 'md5';

import { useAppSelector, useAppDispatch } from '../../helpers/redux-hooks';
import { api } from '../../services/api';
import { setError, setStatus, setUrl } from '../../store/reducers/pay';

import InputMask from 'react-input-mask';
import Loader from '../UI/Loader';
import Offer from '../UI/Offer';
import Card from '../UI/Card';
import RegisterError from './Error';
import Result from './Result';

import luhnCheck from '../../helpers/luhnCheck';
import info from '../../helpers/info';
import urls from '../../utils/urls';

import { IReqData } from '../../models/reqData';

const Pay = () => {
	const { config, settings, localization, reqData } = useAppSelector(
		(state) => state.app,
	);
	const [cancel, cancelResult] = api.useLazyCancelQuery();
	const [payRequest, payResult] = api.useLazyPayQuery();
	const [statusRequest, statusResult] = api.useLazyStatusQuery();

	const dispatch = useAppDispatch();
	const { loading, error, redirectUrl, status } = useAppSelector((state) => state.pay);
	const [numval, setNumval] = useState<string>('');
	const [number, setNumber] = useState<string>('');
	const [code, setCode] = useState<string>('');
	const [captcha, setCaptcha] = useState<string | null>(null);
	const [tlimit, setTlimit] = useState<number>(0);
	const [timer, setTimer] = useState<number>(9);

	const [showCardError, setShowCardError] = useState(false);
	const [showCodeError, setShowCodeError] = useState(false);
	const [showCaptchaError, setCaptchaError] = useState(false);

	const [registerError, setRegisterError] = useState(false);

	useEffect(() => {
		if (cancelResult.isSuccess) {
			let redirect_url =
				reqData.URL_RETURN_NO || reqData.URL_RETURN || '';
			info(reqData.Shop_IDP, 'redirect user', {
				reason: 'timeout',
				url: redirect_url,
			});
			window.location.href = redirect_url;
		}
	}, [cancelResult]);

	useEffect(() => {
		if (payResult.data && payResult.data.url) {
			info(reqData.Shop_IDP, 'redirect user', {
				reason: 'success pay w/o status request',
				url: payResult.data.url,
			});
			window.location.href = payResult.data.url;
		} else if (payResult.error == 0) {
			getStatus();
		} else {
			switch (payResult.error) {
				case 611:
					dispatch(setError({ tip: localization.invalidPin }));
					setError({ tip: localization.invalidPin });
					const codedNumber = MD5(number);
					const savedData = localStorage[codedNumber];
					const attempts = savedData
						? ++JSON.parse(savedData).attempts
						: 1;
					if (attempts === 3) {
						const estimateTime = new Date().setHours(
							new Date().getHours() + 1,
						);
						const saving = {
							attempts: 3,
							timer: estimateTime,
						};
						localStorage.setItem(
							codedNumber,
							JSON.stringify(saving),
						);
						setError({
							tip: localization.invalidPin,
							text: localization.cardBlockForHour,
						});
					} else {
						localStorage.setItem(
							codedNumber,
							JSON.stringify({ attempts }),
						);
					}
					break;
				case 612:
					dispatch(
						setError({ text: localization.insufficientFunds }),
					);
					break;
				case 613:
					dispatch(setError({ text: localization.cardLocked }));
					break;
				case 614:
					dispatch(
						setError({
							tip: localization.expired_tip,
							text: localization.expired_text,
							comment: localization.expired_comment,
						}),
					);
					break;
				case 301:
					dispatch(setError({ text: localization.support }));
					break;
				default:
					dispatch(setError({ text: localization.error }));
			}
		}
	}, [payResult]);

	useEffect(() => {
		if (statusResult.data) {
			if (statusResult.data.status === 'process') {
				setTimeout(() => getStatus(), 1000);
			} else {
				let redirect_url = '';
				if (statusResult.data.status === 'authorized') {
					redirect_url =
						reqData.URL_RETURN_OK ||
						reqData.URL_RETURN ||
						'';
				} else if (statusResult.data.status === 'non authorized') {
					redirect_url =
						reqData.URL_RETURN_NO ||
						reqData.URL_RETURN ||
						'';
				}
				dispatch(setStatus(status));
				dispatch(setUrl(redirect_url));
				startRedirectTimer(timer, redirect_url);
			}
		} else if (statusResult.isError) {
			dispatch(setError({ text: localization.error }))
		}
	}, [statusResult]);

	useEffect(() => {
		if (settings.error) {
			setRegisterError(true);
		} else {
			setTlimit(Math.ceil(reqData.Lifetime / 60));
			checkTimelimit(reqData.Lifetime, reqData);
			setNumval(settings.bin);
		}
		let infoData = (({ password, ...rest }) => rest)(reqData); //убираем пароль
		info(reqData.Shop_IDP, 'loaded page pay', infoData);
	}, []);

	const checkTimelimit = (timelimit: number, data: IReqData) => {
		let timerId = setInterval(() => {
			timelimit--;
			if (timelimit) {
				setTlimit(Math.ceil(timelimit / 60));
			} else {
				clearInterval(timerId);
				const cancelData = {
					standalone_name: data.Shop_IDP,
					orderNumber: data.Order_IDP,
				};
				cancel(cancelData);
			}
		}, 1 * 1000);
	};

	const handleNumber = (event: { target: HTMLInputElement }) => {
		setShowCardError(false);
		const val = event.target.value;
		setNumval(val);
		const str = val.replace(/\s/g, '');
		/^\d*$/.test(str) && setNumber(str);
	};

	const handleCode = (event: { target: HTMLInputElement }) => {
		setShowCodeError(false);
		const val = event.target.value;
		/^\d*$/.test(val) && setCode(val);
	};

	const handleCaptcha = (val: string | null) => {
		setCaptchaError(false);
		val && setCaptcha(val);
	};

	const pay = () => {
		if (validate()) {
			setCode('');
			const payData = {
				standalone_name: reqData.Shop_IDP,
				orderNumber: reqData.Order_IDP,
				account: number,
				pin: code,
				account_type: 'gift',
			};
			payRequest(payData);
		}
	};

	const getStatus = () => {
		const statusData = {
			standalone_name: reqData.Shop_IDP,
			orderNumber: reqData.Order_IDP,
		};
		setCode('');
		statusRequest(statusData);
	};

	const startRedirectTimer = (timer: number, redirect_url: string) => {
		let redirectIntervalId = setInterval(() => {
			timer--;
			if (timer) {
				setTimer(timer);
			} else {
				clearInterval(redirectIntervalId);
				redirect({ reason: 'timeout', url: redirect_url });
			}
		}, 1000);
	};

	const redirect = (e: any) => {
		info(reqData.Shop_IDP, 'redirect user', {
			reason: status || e.reason,
			url: redirectUrl || e.url,
		});
		window.location.href = redirectUrl || e.url;
	};

	const validate = () => {
		let valid = true;
		if (
			!luhnCheck(number) ||
			!config.card_length!.includes(number.length)
		) {
			valid = false;
			setShowCardError(true);
		}
		if (!config.pin_length!.includes(`${code}`.length)) {
			valid = false;
			setShowCodeError(true);
		}
		if (!captcha) {
			valid = false;
			setCaptchaError(true);
		}
		const codedNumber = MD5(number);
		const savedData = localStorage[codedNumber];
		const attempts = savedData ? JSON.parse(savedData).attempts : 0;
		if (attempts === 3) {
			const estimate = JSON.parse(savedData).timer;
			const timer = new Date(
				new Date(estimate).valueOf() - new Date().valueOf(),
			).getMinutes();
			if (timer > 0) {
				showTimer(estimate);
				valid = false;
			} else {
				delete localStorage[codedNumber];
			}
		}
		return tlimit && valid;
	};

	const showTimer = (estimate: string) => {
		setTimeout(function getEstimate() {
			const timer = new Date(
				new Date(estimate).valueOf() - new Date().valueOf(),
			).getMinutes();
			if (timer) {
				setError({
					tip: localization.invalidPin,
					text: `${localization.cardBlock} ${timer} ${localization.min}`,
				});
				setTimeout(getEstimate, 1 * 60 * 1000);
			} else {
				delete localStorage['codedNumber'];
			}
		}, 0);
	};

	if (loading) return <Loader />;
	if (registerError) return <RegisterError />;
	if (status) return <Result timer={timer} redirect={redirect} />;

	return (
		<Card header={localization.header_pay}>
			<div className="card">
				<div className="card_row">
					<div className="card_col">
						<div className="order_desc">
							<div className="order_desc-amount">
								{`${localization.amountToPay} ${reqData.Subtotal_P} ${reqData.Currency}`}
							</div>
							<div className="order_desc-number">
								{`${localization.orderNumber} ${reqData.Order_IDP}`}
							</div>
						</div>
					</div>

					<div className="card_col">
						<label className="card_form-cardnumber">
							<div className="form_input-title">
								{localization.cardNumber}
							</div>
							<InputMask
								type="text"
								inputMode="numeric"
								name="number"
								className="form_input form_input-wide"
								onChange={handleNumber}
								value={numval}
								mask="99999999 99999999999"
								maskChar="_"
								autoFocus={true}
								placeholder={
									config.placeholder &&
									localization.cardNumber
								}
							/>
							{showCardError && (
								<div className="form_input-error">
									{localization.errorCardNumber}
								</div>
							)}
						</label>
					</div>
				</div>

				<div className="card_row">
					<div className="card_col">
						<div className="card_col_row">
							<label className="card_form-pin">
								<div className="form_input-title">
									{localization.pinCode}
								</div>
								<input
									type="password"
									name="code"
									className="form_input"
									value={code}
									onChange={handleCode}
									maxLength={4}
									placeholder={
										config.placeholder &&
										localization.pinCode
									}
								/>
								{showCodeError && (
									<div className="form_input-error">
										{localization.errorPinCode}
									</div>
								)}
							</label>

							<button onClick={pay} className="button">
								{localization.pay}
							</button>
						</div>
					</div>
				</div>

				<div className="card_row">
					<div className="card_col">
						<div className="timer">
							<div className="timer_tip">
								{localization.attention}
							</div>
							<div className="timer_text">
								{`${localization.tlimit} ${tlimit} ${localization.min}`}
							</div>
						</div>

						<Offer />
					</div>

					<div className="card_col">
						<div className="captcha_block">
							<ReCAPTCHA
								sitekey="6LcHU3gaAAAAAO7sPDxYQ4dkvsQpqGtbo9AvqyKe"
								onChange={handleCaptcha}
								className="captcha"
								size={
									window.innerWidth > 380
										? 'normal'
										: 'compact'
								}
							/>
							{showCaptchaError && (
								<div className="form_input-error">
									{localization.captchaError}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default Pay;
