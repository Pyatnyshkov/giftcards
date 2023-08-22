import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { useStore } from '../store';

import '../styles/styles.css';

const App = ({ Component, pageProps }: AppProps) => {
	if (pageProps.initialState) {
		const store = useStore(pageProps.initialState);
		return (
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		);
	} else {
		return <Component {...pageProps} />;
	}
};

export default App;