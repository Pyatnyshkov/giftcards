import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResultState } from '../../models/result';
import { api } from '../../services/api';

const initialState: IResultState = {
	showError: false,
	loading: false,
};

const resultSlice = createSlice({
	name: 'result',
	initialState,
	reducers: {
		setLoading(state: IResultState, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setError(state: IResultState, action: PayloadAction<boolean>) {
			state.showError = action.payload;
		}
	},
	extraReducers: (builder) =>
		builder
			.addMatcher(
				api.endpoints.actStatus.matchPending,
				(state: IResultState) => {
					state.loading = true;
					state.showError = false;
				},
			)
			.addMatcher(
				api.endpoints.actStatus.matchFulfilled,
				(state: IResultState) => {
					state.loading = false;
				},
			)
			.addMatcher(
				api.endpoints.actStatus.matchRejected,
				(state: IResultState) => {
					state.loading = false;
					state.showError = true;
				},
			),
});

export const { setLoading, setError } = resultSlice.actions;
export default resultSlice.reducer;
