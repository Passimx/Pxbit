import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { localizePath, splitLocale } from '@/i18n/paths';
import { isPublicPath, LOGIN_PATH, RETURN_TO_PARAM } from '@/shared/config/auth';
import { publicEnv } from '@/shared/config/env';
import { hardNavigate } from '@/shared/lib/browser';

// credentials: 'include': cookie сессии уходит на API, даже если он на другом поддомене.
const httpBaseQuery = fetchBaseQuery({ baseUrl: publicEnv.NEXT_PUBLIC_API_URL, credentials: 'include' });

// Эндпоинты не знают, откуда приходят данные. С NEXT_PUBLIC_API_MOCKS=true запросы уходят
// в src/mocks (отдельный чанк, грузится только в этом режиме), иначе на настоящий API.
const transportBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  if (publicEnv.NEXT_PUBLIC_API_MOCKS) {
    const { mockBaseQuery } = await import('@/mocks/mockBaseQuery');
    return mockBaseQuery(args);
  }
  return httpBaseQuery(args, api, extraOptions);
};

// Сессия истекла или отозвана: уходим на вход с полной перезагрузкой, чтобы сбросить
// данные прошлого пользователя. После входа вернёмся туда, где были.
function redirectToLogin() {
  const { locale, pathname } = splitLocale(window.location.pathname);
  if (isPublicPath(pathname)) return;

  const returnTo = pathname + window.location.search;
  const query = pathname === '/' ? '' : `?${new URLSearchParams({ [RETURN_TO_PARAM]: returnTo })}`;
  hardNavigate(localizePath(LOGIN_PATH, locale) + query);
}

const baseQuery: typeof transportBaseQuery = async (args, api, extraOptions) => {
  const result = await transportBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && typeof window !== 'undefined') redirectToLogin();
  return result;
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
