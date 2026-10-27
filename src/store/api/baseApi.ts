import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { publicEnv } from '@/shared/config/env';

const httpBaseQuery = fetchBaseQuery({ baseUrl: publicEnv.NEXT_PUBLIC_API_URL });

// Эндпоинты не знают, откуда приходят данные. С NEXT_PUBLIC_API_MOCKS=true запросы уходят
// в src/mocks (отдельный чанк, грузится только в этом режиме), иначе на настоящий API.
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  if (publicEnv.NEXT_PUBLIC_API_MOCKS) {
    const { mockBaseQuery } = await import('@/mocks/mockBaseQuery');
    return mockBaseQuery(args);
  }
  return httpBaseQuery(args, api, extraOptions);
};

// Единый API-слайс. Эндпоинты добавляются из entities и фич через baseApi.injectEndpoints(...).
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  // Ответ не совпал с responseSchema эндпоинта: показываем это как обычную ошибку запроса.
  catchSchemaFailure: (error) => ({ status: 'CUSTOM_ERROR' as const, error: error.message, data: error.issues }),
  tagTypes: ['User', 'Balance', 'Rates'],
  endpoints: () => ({}),
});
