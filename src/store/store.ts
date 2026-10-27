import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api/baseApi';

const rootReducer = combineSlices(baseApi);

export type RootState = ReturnType<typeof rootReducer>;

// Фабрика, а не синглтон: на сервере каждый запрос должен получать свой store,
// иначе состояние одного пользователя утечёт к другому.
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
