import { routing, type Locale } from './routing';

// Работа с путями без хуков: нужна в proxy.ts и в baseQuery, где useRouter недоступен.

/** "/en/deals" → { locale: "en", pathname: "/deals" }; путь без префикса относится к локали по умолчанию. */
export function splitLocale(pathname: string): { locale: Locale; pathname: string } {
  const [, first, ...rest] = pathname.split('/');
  const locale = routing.locales.find((candidate) => candidate === first);
  if (!locale) return { locale: routing.defaultLocale, pathname };
  return { locale, pathname: `/${rest.join('/')}` };
}

/** Обратное к splitLocale с учётом localePrefix: 'as-needed'. */
export function localizePath(pathname: string, locale: Locale): string {
  if (locale === routing.defaultLocale) return pathname;
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}
