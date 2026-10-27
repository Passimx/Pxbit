import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LoginOptions } from '@/features/auth';

import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Login');
  return { title: t('metaTitle') };
}

export default async function LoginPage() {
  const t = await getTranslations('Login');

  return (
    <>
      <div className={styles.intro}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>
      </div>
      <LoginOptions />
    </>
  );
}
