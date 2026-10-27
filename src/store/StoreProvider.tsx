'use client';

import { setupListeners } from '@reduxjs/toolkit/query';
import { type ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { makeStore } from './store';

export function StoreProvider({ children }: { children: ReactNode }) {
  // Ленивая инициализация: store создаётся один раз на жизнь компонента.
  const [store] = useState(makeStore);

  // Включает refetchOnFocus / refetchOnReconnect в RTK Query.
  useEffect(() => setupListeners(store.dispatch), [store]);

  return <Provider store={store}>{children}</Provider>;
}
