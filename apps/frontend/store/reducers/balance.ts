import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBalanceState, IBalance } from '../../models/balance';
import { api } from '../../services/api';

const initialState: IBalanceState = {
	showError: false,
	balance: null,
	loading: false,
};

const balanceSlice = createSlice({
	name: 'balance',
	initialState,
	reducers: {
		showError(state: IBalanceState, action: PayloadAction<boolean>) {
			state.showError = action.payload;
		},
		clearBalance(state: IBalanceState) {
			state.balance = null;
		},
	},
	extraReducers: (builder) =>
		builder
			.addMatcher(
				api.endpoints.getBalance.matchPending,
				(state: IBalanceState) => {
					state.loading = true;
					state.balance = null;
					state.showError = false;
				},
			)
			.addMatcher(
				api.endpoints.getBalance.matchFulfilled,
				(state: IBalanceState, action: PayloadAction<IBalance>) => {
					state.loading = false;
					state.balance = action.payload;
				},
			)
			.addMatcher(
				api.endpoints.getBalance.matchRejected,
				(state: IBalanceState) => {
					state.loading = false;
					state.showError = true;
				},
			),
});

export const { showError, clearBalance } = balanceSlice.actions;
export default balanceSlice.reducer;
