import { screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetMockDb } from '@/mocks/db';
import { mockBaseQuery } from '@/mocks/mockBaseQuery';
import { hasMockSession } from '@/mocks/session';
import { renderWithProviders } from '@/test/renderWithProviders';

import { AuthCallback } from './AuthCallback';
import { saveReturnTo } from '../lib/returnTo';

const replace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace }),
  Link: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

// Начинаем вход так же, как LoginOptions, и «возвращаемся» от провайдера на callback.
async function arriveFromProvider() {
  const result = await mockBaseQuery({
    url: '/auth/google/start',
    method: 'POST',
    body: { redirectUri: 'http://localhost:3000/auth/callback/google' },
  });
  const { authorizeUrl } = (result as { data: { authorizeUrl: string } }).data;
  const url = new URL(authorizeUrl);
  window.history.replaceState(null, '', url.pathname + url.search);
}

describe('<AuthCallback />', () => {
  beforeEach(() => {
    resetMockDb({ signedIn: false });
    replace.mockClear();
  });

  it('завершает вход и возвращает туда, куда шёл пользователь', async () => {
    saveReturnTo('/deals');
    await arriveFromProvider();

    renderWithProviders(<AuthCallback provider="google" />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/deals'));
    expect(hasMockSession()).toBe(true);
  });

  it('не пускает с чужим state', async () => {
    await arriveFromProvider();
    window.history.replaceState(null, '', '/auth/callback/google?code=x&state=forged');

    renderWithProviders(<AuthCallback provider="google" />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось войти');
    expect(replace).not.toHaveBeenCalled();
    expect(hasMockSession()).toBe(false);
  });

  it('сообщает, что пользователь отменил вход у провайдера', async () => {
    window.history.replaceState(null, '', '/auth/callback/sber?error=access_denied');

    renderWithProviders(<AuthCallback provider="sber" />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Вход отменён');
  });
});
