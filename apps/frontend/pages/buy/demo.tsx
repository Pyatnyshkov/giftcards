import DemoLayout from '../../components/Demo/DemoLayout';
import DemoLabel from '../../components/Demo/DemoLabel';
import React, { useState } from 'react';

export function Demo() {
	const [state, setState] = useState({
		Shop_IDP: 'Sephora',
		Order_IDP: Date.now().toString(),
		Currency: 'RUB',
	});

	const handleInput = (e: React.FormEvent<HTMLInputElement>): void => {
		const val = e.currentTarget.value;
		const name = e.currentTarget.name;
		const newState = {
			...state,
			[name]: val,
		};
		setState(newState);
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
				title='Код валюты (Currency)'
				value={state.Currency}
				name='Currency'
				handleInput={handleInput}
			/>
		</DemoLayout>
	);
}

export default Demo;
