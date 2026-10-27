import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Чтобы добавить язык: положите messages/<locale>.json и допишите локаль сюда.
  locales: ['ru'],
  defaultLocale: 'ru',
  // Префикс `/ru` в URL появится только когда языков станет больше одного.
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
