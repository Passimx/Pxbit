import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { AuthCallback } from '@/features/auth';
import { AUTH_PROVIDERS, isAuthProvider } from '@/shared/config/auth';

// Все провайдеры известны заранее, поэтому страница пререндерится для каждого.
export function generateStaticParams() {
  return AUTH_PROVIDERS.map((provider) => ({ provider }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AuthCallback');
  return { title: t('metaTitle') };
}

export default async function AuthCallbackPage({ params }: PageProps<'/[locale]/auth/callback/[provider]'>) {
  const { provider } = await params;
  if (!isAuthProvider(provider)) notFound();

  return <AuthCallback provider={provider} />;
}
