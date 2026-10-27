import type messages from '../messages/ru.json';
import type { routing } from './i18n/routing';

// Типизация ключей переводов: опечатка в t('...') станет ошибкой компиляции.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
