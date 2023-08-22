import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPayState, IPayError } from '../../models/pay';
import { api } from '../../services/api';

const initialState: IPayState = {
	loading: false,
	status: '',
	redirectUrl: '',
	error: {},
};

const paySlice = createSlice({
	name: 'pay',
	initialState,
	reducers: {
		setError(state: IPayState, action: PayloadAction<IPayError>) {
			state.error = action.payload;
		},
		setStatus(state: IPayState, action: PayloadAction<string>) {
			state.status = action.payload;
		},
		setUrl(state: IPayState, action: PayloadAction<string>) {
			state.redirectUrl = action.payload;
		},
	},
	extraReducers: (builder) =>
		builder
			.addMatcher(
				api.endpoints.pay.matchPending,
				(state: IPayState) => {
					state.loading = true;
					state.error = {};
				},
			)
			.addMatcher(
				api.endpoints.pay.matchFulfilled,
				(state: IPayState) => {
					state.loading = false;
				},
			)
			.addMatcher(
				api.endpoints.pay.matchRejected,
				(state: IPayState) => {
					state.loading = false;
				},
			)
			.addMatcher(
				api.endpoints.status.matchRejected,
				(state: IPayState) => {
					state.loading = false;
				},
			),
});

export const { setError, setStatus, setUrl } = paySlice.actions;
export default paySlice.reducer;
