import { getTranslations } from 'next-intl/server';

import { Container } from '@/shared/ui/Container';
import { BalanceCard } from '@/widgets/BalanceCard';

import styles from './page.module.css';

// Главная профиля. Сама страница серверная, данные баланса грузит клиентский <BalanceCard />.
export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <Container className={styles.page}>
      <div className={styles.intro}>
        <h1>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>
      </div>
      <BalanceCard />
    </Container>
  );
}
