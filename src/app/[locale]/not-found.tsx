import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/ui/Container';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <main>
      <Container>
        <h1>{t('title')}</h1>
        <Link href="/">{t('backHome')}</Link>
      </Container>
    </main>
  );
}
