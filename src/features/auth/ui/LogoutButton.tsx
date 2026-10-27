'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { ComponentPropsWithoutRef } from 'react';

import { localizePath } from '@/i18n/paths';
import { LOGIN_PATH } from '@/shared/config/auth';
import { hardNavigate } from '@/shared/lib/browser';

import { useLogoutMutation } from '../api/authApi';

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'onClick' | 'type'>;

export function LogoutButton({ disabled, ...props }: Props) {
  const t = useTranslations('Logout');
  const locale = useLocale();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleClick = async () => {
    await logout();
    // Полная перезагрузка, а не router.push: в памяти не должно остаться данных пользователя.
    // Уходим на вход даже при ошибке запроса: локально пользователь хотел выйти.
    hardNavigate(localizePath(LOGIN_PATH, locale));
  };

  return (
    <button type="button" disabled={disabled || isLoading} onClick={() => void handleClick()} {...props}>
      {t('label')}
    </button>
  );
}
