import { getTranslations } from 'next-intl/server';

import { Counter } from '@/features/counter';
import { Container } from '@/shared/ui/Container';

import styles from './page.module.css';

// Серверный компонент (по умолчанию): рендерится на сервере, JS в браузер не отправляет.
// Клиентские «островки» вроде <Counter /> встраиваются внутрь.
export default async function HomePage() {
  const t = await getTranslations('HomePage');

  return (
    <Container className={styles.page}>
      <h1>{t('title')}</h1>
      <p className={styles.description}>{t('description')}</p>
      <Counter />
    </Container>
  );
}
