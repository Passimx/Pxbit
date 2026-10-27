'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { AUTH_PROVIDERS, type AuthProvider, RETURN_TO_PARAM } from '@/shared/config/auth';
import { hardNavigate } from '@/shared/lib/browser';

import styles from './LoginOptions.module.css';
import { useStartLoginMutation } from '../api/authApi';
import { getCallbackUrl } from '../lib/callbackPath';
import { saveReturnTo } from '../lib/returnTo';

export function LoginOptions() {
  const t = useTranslations('Login');
  const locale = useLocale();
  const [startLogin, { isError }] = useStartLoginMutation();
  const [pending, setPending] = useState<AuthProvider | null>(null);

  const login = async (provider: AuthProvider) => {
    setPending(provider);
    // returnTo читаем в момент клика, а не через useSearchParams: страница остаётся статической.
    saveReturnTo(new URLSearchParams(window.location.search).get(RETURN_TO_PARAM));

    const result = await startLogin({ provider, redirectUri: getCallbackUrl(provider, locale) });
    if (result.data) hardNavigate(result.data.authorizeUrl);
    else setPending(null);
  };

  return (
    <div className={styles.options}>
      {AUTH_PROVIDERS.map((provider) => (
        <button
          key={provider}
          type="button"
          className={styles.option}
          disabled={pending !== null}
          aria-busy={pending === provider}
          onClick={() => void login(provider)}
        >
          {pending === provider ? t('redirecting') : t(`providers.${provider}`)}
        </button>
      ))}
      {isError && (
        <p role="alert" className={styles.error}>
          {t('error')}
        </p>
      )}
    </div>
  );
}
