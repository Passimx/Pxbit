import { baseApi } from '@/store/api/baseApi';

import { type Balance, balanceSchema, type Rates, ratesSchema } from '../model';

export const walletApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBalance: build.query<Balance, void>({
      query: () => '/me/balance',
      responseSchema: balanceSchema,
      providesTags: ['Balance'],
    }),
    getRates: build.query<Rates, void>({
      query: () => '/rates',
      responseSchema: ratesSchema,
      providesTags: ['Rates'],
    }),
  }),
});

export const { useGetBalanceQuery, useGetRatesQuery } = walletApi;
