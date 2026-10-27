import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { publicEnv } from '@/shared/config/env';

// Единый API-слайс. Эндпоинты добавляются из фич через baseApi.injectEndpoints(...).
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: publicEnv.NEXT_PUBLIC_API_URL }),
  tagTypes: [],
  endpoints: () => ({}),
});
