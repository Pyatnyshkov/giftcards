import styles from './index.module.css';
import React, { FC, useMemo } from 'react';

export interface DemoLayoutProps {
	settings: string;
	children: React.ReactNode;
}

const DemoLayout: FC<DemoLayoutProps> = ({ settings, children }) => {
	const method = useMemo(
		() => (settings === 'status' ? 'get' : 'post'),
		[settings],
	);
	return (
		<div className={styles['demo_container']}>
			<div className={styles['demo_header']}>
				Ввод демо данных сервиса подарочных карт
			</div>
			<div className={styles['demo_tip']}>{`Страница ${settings}`}</div>
			<form
				action="./"
				method={method}
				className={styles['demo_form']}
				target="demo_frame"
			>
				<div className={styles['form_content']}>{children}</div>
				<button type="submit" className={styles['demo_button']}>
					Просмотр
				</button>
			</form>
			<div className={styles['frame_container']}>
				<iframe
					name="demo_frame"
					seamless={true}
					width="100%"
					height="450"
					frameBorder="0"
					title="iframe"
					className={styles['demo_frame']}
				/>
			</div>
		</div>
	);
};

export default DemoLayout;
