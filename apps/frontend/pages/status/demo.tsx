import DemoLayout from '../../components/Demo/DemoLayout';
import DemoLabel from '../../components/Demo/DemoLabel';
import React, { useState } from 'react';

export function Demo() {
	const [state, setState] = useState({
		Shop_IDP: 'Sephora',
		Order_IDP: Date.now().toString(),
	});

	const handleInput = (event: { target: HTMLInputElement }) => {
		const val = event.target.value;
		const name = event.target.name;
		const newState = {
			...state,
			[name]: val,
		};
		setState(newState);
	};

	return (
		<DemoLayout settings="status">
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
		</DemoLayout>
	);
}

export default Demo;
