import { Link } from '@/i18n/navigation';
import { Container } from '@/shared/ui/Container';

import styles from './Header.module.css';
import { ProfileMenu } from './ProfileMenu';

// Серверный компонент: логотип рендерится на сервере, меню профиля встраивается клиентским островком.
export function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Pxbit
        </Link>
        <ProfileMenu />
      </Container>
    </header>
  );
}
