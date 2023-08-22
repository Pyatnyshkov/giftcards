import { useMemo } from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import app 		from './reducers/app';
import balance 	from './reducers/balance';
import result 	from './reducers/result';
import buy 		from './reducers/buy';
import pay 		from './reducers/pay';

import { api } from '../services/api';

import { IReqData } 		from '../models/reqData';
import { ISettings } 		from '../models/settings';
import { IConfig } 			from '../models/config';
import { ILocalization } 	from '../models/localization';

interface Preloaded {
	reqData: IReqData;
	settings: ISettings;
	config: IConfig;
	localization: ILocalization;
}

const reducer = combineReducers({
	[api.reducerPath]: api.reducer,
	app,
	balance,
	result,
	buy,
	pay,
});

const configureState = (initialState: Preloaded) => ({
	app: {
		...initialState,
	},
});

const createStore = (state: any) =>
	configureStore({
		reducer,
		preloadedState: state,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({ serializableCheck: false }).concat(
				api.middleware,
			),
	});

export function useStore(initialState: Preloaded) {
	return useMemo(
		() => createStore(configureState(initialState)),
		[initialState],
	);
}

export type RootState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof useStore>;
export type AppDispatch = AppStore['dispatch'];