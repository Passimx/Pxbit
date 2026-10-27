import { baseApi } from '@/store/api/baseApi';

import { type User, userSchema, type UserSettings } from '../model';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => '/me',
      responseSchema: userSchema,
      providesTags: ['User'],
    }),
    updateSettings: build.mutation<User, UserSettings>({
      query: (body) => ({ url: '/me/settings', method: 'PATCH', body }),
      responseSchema: userSchema,
      // Оптимистично: интерфейс меняется сразу, при ошибке откатываемся.
      async onQueryStarted(settings, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          userApi.util.updateQueryData('getMe', undefined, (user) => {
            Object.assign(user, settings);
          }),
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(userApi.util.upsertQueryData('getMe', undefined, data));
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useGetMeQuery, useUpdateSettingsMutation } = userApi;
