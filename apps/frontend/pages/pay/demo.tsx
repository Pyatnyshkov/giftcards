import DemoLayout from '../../components/Demo/DemoLayout';
import DemoLabel from '../../components/Demo/DemoLabel';
import React, { useEffect, useState } from 'react';

export function Demo() {
	const [state, setState] = useState({
		Shop_IDP: 'Sephora',
		Order_IDP: Date.now().toString(),
		Subtotal_P: '10',
		URL_RETURN: '',
		URL_RETURN_OK: 'https://ucscards.ru/',
		URL_RETURN_NO: 'https://ucscards.ru/',
		Currency: 'RUB',
		Lifetime: '600',
		Email: 'test@test.ru',
		password: '',
		check: '{}'
	});
	const [Signature, setSignature] = useState('');
	const [Receipt, setReceipt] = useState('');

	const generateSignature = (data: any) => {
		const MD5 = require("md5");
		const signature = MD5(
			MD5(data.Shop_IDP) +
			"&" +
			MD5(data.Order_IDP) +
			"&" +
			MD5(data.Subtotal_P) +
			"&" +
			MD5(data.Lifetime) +
			"&" +
			MD5(encode(data.check)) +
			"&" +
			MD5(data.password)
		).toUpperCase();
		setSignature(signature);
	};

	const encode = (string: string) => {
		return btoa(unescape(encodeURIComponent(string)));
	};

	useEffect(() => {
		setReceipt(encode(state.check));
		generateSignature(state);
	}, [state.check]);

	const handleInput = (e: React.FormEvent<HTMLInputElement>): void => {
		const name 	= e.currentTarget.name;
		const val 	= e.currentTarget.value;
		const newState = {
			...state,
			[name]: val
		};
		setState(newState);
		generateSignature(newState);
		if (name === 'check') {
			setReceipt(encode(val));
		}
	};

	return (
		<DemoLayout settings="buy">
			<DemoLabel
				title='Название магазина (Shop_IDP)'
				value={state.Shop_IDP}
				name='Shop_IDP'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Номер заказа (Order_IDP)'
				value={state.Order_IDP}
				name='Order_IDP'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Сумма покупки (Subtotal_P)'
				value={state.Subtotal_P}
				name='Subtotal_P'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='URL (URL_RETURN)'
				value={state.URL_RETURN}
				name='URL_RETURN'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='URL success (URL_RETURN_OK)'
				value={state.URL_RETURN_OK}
				name='URL_RETURN_OK'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='URL fail (URL_RETURN_NO)'
				value={state.URL_RETURN_NO}
				name='URL_RETURN_NO'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Код валюты (Currency)'
				value={state.Currency}
				name='Currency'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Таймаут, с (Lifetime)'
				value={state.Lifetime}
				name='Lifetime'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Почта (Email)'
				value={state.Email}
				name='Email'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Пароль'
				value={state.password}
				name='password'
				handleInput={handleInput}
			/>
			<DemoLabel
				title='Чек'
				value={state.check}
				name='check'
				handleInput={handleInput}
				type='textarea'
			/>
			<input
				type="hidden"
				defaultValue={Receipt}
				name="Receipt"
			/>
			<input
				type="hidden"
				defaultValue={Signature}
				name="Signature"
			/>
		</DemoLayout>
	);
}

export default Demo;
