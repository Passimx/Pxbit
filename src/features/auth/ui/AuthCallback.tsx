'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useSyncExternalStore } from 'react';

import { Link, useRouter } from '@/i18n/navigation';
import { LOGIN_PATH, type AuthProvider } from '@/shared/config/auth';

import styles from './AuthCallback.module.css';
import { useCompleteLoginMutation } from '../api/authApi';
import { getCallbackUrl } from '../lib/callbackPath';
import { consumeReturnTo } from '../lib/returnTo';

const subscribeNoop = () => () => {};

// Query-строку читаем из window, а не через useSearchParams: так страница остаётся статической.
// На сервере (и при гидрации) её нет, поэтому сначала рендерится состояние загрузки.
function useLocationSearch() {
  return useSyncExternalStore(
    subscribeNoop,
    () => window.location.search,
    () => null,
  );
}

// Страница, на которую провайдер возвращает пользователя. Отдаёт code бэкенду и ведёт дальше.
export function AuthCallback({ provider }: { provider: AuthProvider }) {
  const t = useTranslations('AuthCallback');
  const locale = useLocale();
  const router = useRouter();
  const [completeLogin, { isError }] = useCompleteLoginMutation();
  const search = useLocationSearch();
  // code одноразовый: в StrictMode эффект запускается дважды, второй обмен провалился бы.
  const started = useRef(false);

  const params = new URLSearchParams(search ?? '');
  const code = params.get('code');
  const state = params.get('state');
  // Пользователь отказался на стороне провайдера или ссылка битая.
  const denied = search !== null && params.has('error');
  const invalid = search !== null && !denied && (!code || !state);

  useEffect(() => {
    if (!code || !state || denied || started.current) return;
    started.current = true;

    void completeLogin({ provider, code, state, redirectUri: getCallbackUrl(provider, locale) }).then((result) => {
      if (result.data) router.replace(consumeReturnTo());
    });
  }, [code, completeLogin, denied, locale, provider, router, state]);

  if (!denied && !invalid && !isError) {
    return (
      <p className={styles.status} aria-busy="true">
        {t('loading')}
      </p>
    );
  }

  return (
    <div className={styles.status} role="alert">
      <p>{t(denied ? 'denied' : 'failed')}</p>
      <Link href={LOGIN_PATH} className={styles.back}>
        {t('back')}
      </Link>
    </div>
  );
}
