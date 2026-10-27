import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/ui/Container';

import styles from './Header.module.css';

// Асинхронный серверный компонент: переводы берутся на сервере через getTranslations.
export async function Header() {
  const t = await getTranslations('Header');

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Pxbit
        </Link>
        <nav>
          <Link href="/">{t('home')}</Link>
        </nav>
      </Container>
    </header>
  );
}
