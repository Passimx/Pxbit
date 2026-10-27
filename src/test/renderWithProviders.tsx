import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { StoreProvider } from '@/store/StoreProvider';

import messages from '../../messages/ru.json';

// Те же провайдеры, что в app/[locale]/layout.tsx: переводы и свежий Redux store.
export function renderWithProviders(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <StoreProvider>{ui}</StoreProvider>
    </NextIntlClientProvider>,
  );
}
