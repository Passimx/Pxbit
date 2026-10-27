'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Container } from '@/shared/ui/Container';

// error.tsx обязан быть клиентским компонентом: он получает reset() для повторной попытки.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Error');

  useEffect(() => {
    // Место для отправки ошибки в Sentry или другой мониторинг.
    console.error(error);
  }, [error]);

  return (
    <Container>
      <h1>{t('title')}</h1>
      <button type="button" onClick={reset}>
        {t('retry')}
      </button>
    </Container>
  );
}
