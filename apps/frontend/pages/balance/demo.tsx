import DemoLayout from '../../components/Demo/DemoLayout';
import DemoLabel from '../../components/Demo/DemoLabel';
import React, { useState } from 'react';

export function Demo() {
	const [Shop_IDP, setShop_IDP] = useState("Sephora");
	const handleInput = (e:React.FormEvent<HTMLInputElement>): void => {
		const val = e.currentTarget.value;
		setShop_IDP(val);
	};
	return (
		<DemoLayout settings='balance'>
			<DemoLabel
				title='Название магазина (Shop_IDP)'
				value={Shop_IDP}
				name='Shop_IDP'
				handleInput={handleInput}
			/>
		</DemoLayout>
	);
}

export default Demo;
