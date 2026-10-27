import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { StoreProvider } from '@/store/StoreProvider';

import { Counter } from './Counter';
import messages from '../../../messages/ru.json';

const renderCounter = () =>
  render(
    <NextIntlClientProvider locale="ru" messages={messages}>
      <StoreProvider>
        <Counter />
      </StoreProvider>
    </NextIntlClientProvider>,
  );

describe('<Counter />', () => {
  it('увеличивает и сбрасывает значение', () => {
    renderCounter();
    expect(screen.getByText('Значение: 0')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Увеличить' }));
    fireEvent.click(screen.getByRole('button', { name: 'Увеличить' }));
    expect(screen.getByText('Значение: 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));
    expect(screen.getByText('Значение: 0')).toBeInTheDocument();
  });
});
