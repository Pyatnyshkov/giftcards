import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBuyState } from '../../models/buy';
import { api } from '../../services/api';

const initialState: IBuyState = {
	showError: false,
	loading: false,
};

const buySlice = createSlice({
	name: 'buy',
	initialState,
	reducers: {
		showError(state: IBuyState, action: PayloadAction<boolean>) {
			state.showError = action.payload;
		},
	},
	extraReducers: (builder) =>
		builder
			.addMatcher(
				api.endpoints.purchase.matchPending,
				(state: IBuyState) => {
					state.loading = true;
					state.showError = false;
				},
			)
			.addMatcher(
				api.endpoints.purchase.matchRejected,
				(state: IBuyState) => {
					state.loading = false;
					state.showError = true;
				},
			),
});

export const { showError } = buySlice.actions;
export default buySlice.reducer;
