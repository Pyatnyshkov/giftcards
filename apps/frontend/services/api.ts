import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { RootState } from '../store';
import { IBalance, IBalanceReq } from '../models/balance';
import { IActStatusRes, IActStatusReq } from '../models/result';
import { IBuyRes, IBuyReq, IActivateReq } from '../models/buy';
import { ICancelReq, IPayReq, IPayRes, IstatusReq, IStatusRes } from '../models/pay';

import urls from '../utils/urls';

const apiBaseQuery =
	(): BaseQueryFn<{
		url: string;
		data: AxiosRequestConfig["data"];
	}> =>
	async ({ url, data }) => {
		try {
			const response = await axios.post(url, data);
			const result = await response.data;
			if (result.error) {
				return { error: result.error };
			}
			return { data: result.data };
		} catch (axiosError) {
			let err = axiosError as AxiosError;
			return {
				error: err.response?.status,
			};
		}
	};

export const api = createApi({
	reducerPath: 'api',
	baseQuery: apiBaseQuery(),
	endpoints: (build) => ({
		getBalance: build.query<IBalance, IBalanceReq>({
			query: (data) => ({
				url: urls.balance,
				data
			}),
		}),
		actStatus: build.query<IActStatusRes, IActStatusReq>({
			query: (data) => ({
				url: urls.actStatus,
				data
			}),
		}),
		purchase: build.query<IBuyRes, IBuyReq>({
			query: (data) => ({
				url: urls.purchase,
				data
			}),
		}),
		activate: build.query<null, IActivateReq>({
			query: (data) => ({
				url: urls.activate,
				data
			}),
		}),
		cancel: build.query<null, ICancelReq>({
			query: (data) => ({
				url: urls.cancel,
				data
			}),
		}),
		pay: build.query<IPayRes, IPayReq>({
			query: (data) => ({
				url: urls.pay,
				data
			}),
		}),
		status: build.query<IStatusRes, IstatusReq>({
			query: (data) => ({
				url: urls.status,
				data
			}),
		}),
	}),
});
