import React from 'react';
import styles from './index.module.css';

/* eslint-disable-next-line */
export interface DemoLayoutProps {
	title: string;
	value: string;
	name: string;
	handleInput: (e: any) => void;
	type?: string;
}

const DemoLabel = ({
	title,
	value,
	name,
	handleInput,
	type,
}: DemoLayoutProps) => (
	<label className={styles['form_label']}>
		<div className={styles['form_label-title']}>{title}</div>
		{type === 'textarea' ? (
			<textarea
				onChange={handleInput}
				value={value}
				name={name}
				className={styles['form_label-input']}
			/>
		) : (
			<input
				type="text"
				value={value}
				name={name}
				className={styles['form_label-input']}
				onChange={handleInput}
			/>
		)}
	</label>
);

export default DemoLabel;
