import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetMockDb } from '@/mocks/db';
import { hasMockSession } from '@/mocks/session';
import { hardNavigate } from '@/shared/lib/browser';
import { renderWithProviders } from '@/test/renderWithProviders';

import { ProfileMenu } from './ProfileMenu';

vi.mock('@/shared/lib/browser', () => ({ hardNavigate: vi.fn() }));

const openMenu = async () => {
  renderWithProviders(<ProfileMenu />);
  fireEvent.click(await screen.findByRole('button', { name: 'Меню профиля' }));
  return screen.getByRole('dialog', { name: 'Профиль' });
};

describe('<ProfileMenu />', () => {
  beforeEach(() => {
    resetMockDb();
    vi.mocked(hardNavigate).mockClear();
  });

  it('показывает ID аккаунта и инициалы вместо аватара', async () => {
    const panel = await openMenu();
    expect(panel).toHaveTextContent('PX-104582');
    expect(panel).toHaveTextContent('ТП');
    expect(screen.getByRole('button', { name: 'Меню профиля' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('закрывается по Escape и возвращает фокус на кнопку', async () => {
    await openMenu();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Меню профиля' })).toHaveFocus();
  });

  it('выходит из аккаунта и уходит на страницу входа', async () => {
    await openMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Выйти' }));

    await waitFor(() => expect(hardNavigate).toHaveBeenCalledWith('/login'));
    expect(hasMockSession()).toBe(false);
  });
});
