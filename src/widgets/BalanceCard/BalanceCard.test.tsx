import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it } from 'vitest';

import { resetMockDb } from '@/mocks/db';
import { StoreProvider } from '@/store/StoreProvider';

import { BalanceCard } from './BalanceCard';
import messages from '../../../messages/ru.json';

const renderCard = () =>
  render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <StoreProvider>
        <BalanceCard />
      </StoreProvider>
    </NextIntlClientProvider>,
  );

describe('<BalanceCard />', () => {
  beforeEach(resetMockDb);

  it('показывает баланс в валюте из профиля', async () => {
    renderCard();
    expect(screen.getByText('Загружаем баланс…')).toBeInTheDocument();

    // В моках 1250.5 + 200 USDT по курсу 81.2345 ₽
    expect(await screen.findByTestId('balance-total')).toHaveTextContent('117 830,64 ₽');
    expect(screen.getByText('≈ 1 450,50 USDT')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'RUB' })).toHaveAttribute('aria-checked', 'true');
  });

  it('пересчитывает баланс при смене валюты', async () => {
    renderCard();
    await screen.findByTestId('balance-total');

    fireEvent.click(screen.getByRole('radio', { name: 'CNY' }));

    // 1450.5 × 7.1234 = 10 332.4917 → округление вниз
    await waitFor(() => expect(screen.getByTestId('balance-total')).toHaveTextContent('10 332,49 CN¥'));
    expect(screen.getByRole('radio', { name: 'CNY' })).toHaveAttribute('aria-checked', 'true');
  });
});
