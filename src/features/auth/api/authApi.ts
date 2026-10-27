import { z } from 'zod';

import { type User, userApi, userSchema } from '@/entities/user';
import type { AuthProvider } from '@/shared/config/auth';
import { baseApi } from '@/store/api/baseApi';

const startLoginSchema = z.object({ authorizeUrl: z.url() });

// Вход через OAuth одинаков для всех провайдеров:
// 1. startLogin: бэкенд готовит адрес страницы провайдера (со state против CSRF).
// 2. Провайдер возвращает пользователя на /auth/callback/<provider>?code=…&state=…
// 3. completeLogin: бэкенд меняет code на токены провайдера и ставит cookie сессии.
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    startLogin: build.mutation<z.infer<typeof startLoginSchema>, { provider: AuthProvider; redirectUri: string }>({
      query: ({ provider, redirectUri }) => ({ url: `/auth/${provider}/start`, method: 'POST', body: { redirectUri } }),
      responseSchema: startLoginSchema,
    }),
    completeLogin: build.mutation<User, { provider: AuthProvider; code: string; state: string; redirectUri: string }>({
      query: ({ provider, ...body }) => ({ url: `/auth/${provider}/callback`, method: 'POST', body }),
      responseSchema: userSchema,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userApi.util.upsertQueryData('getMe', undefined, data));
        } catch {
          // Ошибку показывает компонент через состояние мутации.
        }
      },
    }),
    logout: build.mutation<null, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useStartLoginMutation, useCompleteLoginMutation, useLogoutMutation } = authApi;
