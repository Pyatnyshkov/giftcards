import React, { useState, useEffect, Fragment } from 'react';

import ReCAPTCHA 	from 'react-google-recaptcha';
import axios 		from 'axios';
import InputMask 	from 'react-input-mask';

import Card 		from '../UI/Card';
import Offer 		from '../UI/Offer';
import Loader 		from '../UI/Loader';
import BalanceError from './Error';
import Result 		from './Result';

import { useAppSelector } from '../../helpers/redux-hooks';
import { api } from '../../services/api';

import luhnCheck from '../../helpers/luhnCheck';
import info from '../../helpers/info';
import urls from '../../utils/urls';

const Balance = () => {
	const { config, settings, localization, reqData } = useAppSelector(
		(state) => state.app,
	);
	const { loading, showError, balance } = useAppSelector(
		(state) => state.balance,
	);
	const [getBalance] = api.useLazyGetBalanceQuery();

	const [numval, setNumval] = useState<string>('');
	const [number, setNumber] = useState<string>('');
	const [code, setCode] = useState<string>('');
	const [captcha, setCaptcha] = useState<string>('');

	const [showCardError, setShowCardError] = useState<boolean>(false);
	const [showCodeError, setShowCodeError] = useState<boolean>(false);
	const [showCaptchaError, setCaptchaError] = useState<boolean>(false);

	useEffect(() => {
		setNumval(settings.bin);
		setNumber(settings.bin);
		info(reqData.Shop_IDP, 'loaded page balance', reqData);
	}, []);

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

	const handleBalance = () => {
		if (validate()) {
			const balanceData = {
				standalone_name: reqData.Shop_IDP,
				account: number,
				pin: code,
				account_type: 'gift',
			};
			getBalance(balanceData);
			setCaptcha('');
			setCode('');
		}
	};

	const validate = () => {
		let valid = true;
		if (
			!luhnCheck(number) ||
			(config.card_length && !config.card_length.includes(number.length))
		) {
			valid = false;
			setShowCardError(true);
		}
		if (config.show_pin_balance) {
			if (
				config.pin_length &&
				!config.pin_length.includes(`${code}`.length)
			) {
				valid = false;
				setShowCodeError(true);
			}
		}
		if (!captcha) {
			valid = false;
			setCaptchaError(true);
		}
		return valid;
	};

	if (loading) return <Loader />;
	return (
		<Card header={localization.header_balance}>
			{balance ? (
				<Result number={number} />
			) : showError ? (
				<BalanceError />
			) : (
				<Fragment>
					<div>{localization.tip_balance}</div>
					<div className="card_form-balance">
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

						{config.show_pin_balance && (
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
						)}
					</div>
					{config.captcha && (
						<div className="captcha_block">
							<ReCAPTCHA
								sitekey="6LcH48kZAAAAACTUu6i3x8eFPNk1h39jgIDoWENV"
								stoken="6LcH48kZAAAAAEhhXbJQnFS4stQC6O4AGc0J4QYf"
								onChange={handleCaptcha}
								className="captcha"
								size={
									typeof window !== 'undefined' &&
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
					)}
					<div className="balance_footer">
						<button
							onClick={handleBalance}
							type="button"
							className="button"
						>
							{localization.checkOut}
						</button>
						<Offer />
					</div>
				</Fragment>
			)}
		</Card>
	);
};

export default Balance;
