import { createSlice } from '@reduxjs/toolkit';
import { IReqData } from '../../models/reqData';
import { ISettings } from '../../models/settings';
import { IConfig } from '../../models/config';
import { ILocalization } from '../../models/localization';

interface IAppState {
	reqData: IReqData;
	settings: ISettings;
	config: IConfig;
	localization: ILocalization;
}

const appSlice = createSlice({
	name: 'app',
	initialState: {} as IAppState,
	reducers: {},
});

export default appSlice.reducer;
