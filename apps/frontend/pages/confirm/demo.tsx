import DemoLayout from '../../components/Demo/DemoLayout';
import DemoLabel from '../../components/Demo/DemoLabel';
import React, { useEffect, useState } from 'react';

export function Demo() {
	const [state, setState] = useState({
		Shop_IDP: 'Sephora',
		Order_IDP: Date.now().toString(),
		Status: 'delivered',
		check: '{}',
		password: '',
	});

	const [Signature, setSignature] = useState('');
	const [Receipt, setReceipt] = useState('');

	useEffect(() => {
		setReceipt(encode(state.check));
		generateSignature(state);
	}, [state.check]);

	const generateSignature = (data: any) => {
		const MD5 = require('md5');
		const signature = MD5(
			MD5(data.Order_IDP) +
				'&' +
				MD5(data.Status) +
				'&' +
				MD5(encode(data.check)) +
				'&' +
				MD5(data.password),
		).toUpperCase();
		setSignature(signature);
	};

	const encode = (string: string) => {
		return btoa(unescape(encodeURIComponent(string)));
	};

	const handleInput = (event: { target: HTMLInputElement }) => {
		const val = event.target.value;
		const name = event.target.name;
		const newState = {
			...state,
			[name]: val,
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
				title="Название магазина (Shop_IDP)"
				value={state.Shop_IDP}
				name="Shop_IDP"
				handleInput={handleInput}
			/>
			<DemoLabel
				title="Номер заказа (Order_IDP)"
				value={state.Order_IDP}
				name="Order_IDP"
				handleInput={handleInput}
			/>
			<DemoLabel
				title="Статус (Status)"
				value={state.Status}
				name="Status"
				handleInput={handleInput}
			/>
			<DemoLabel
				title="Пароль (password)"
				value={state.password}
				name="password"
				handleInput={handleInput}
			/>
			<DemoLabel
				title="Чек (check)"
				value={state.check}
				name="check"
				handleInput={handleInput}
				type="textarea"
			/>
			<input type="hidden" defaultValue={Receipt} name="Receipt" />
			<input type="hidden" value={Signature} name="Signature" />
		</DemoLayout>
	);
}

export default Demo;
