import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('Loading');
  return <p role="status">{t('label')}</p>;
}
