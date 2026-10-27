import { localizePath } from '@/i18n/paths';
import type { Locale } from '@/i18n/routing';
import type { AuthProvider } from '@/shared/config/auth';

/**
 * Абсолютный адрес, на который провайдер вернёт пользователя. Должен совпадать с redirect_uri,
 * зарегистрированным у провайдера, и быть одинаковым в startLogin и completeLogin.
 */
export function getCallbackUrl(provider: AuthProvider, locale: Locale): string {
  return new URL(localizePath(`/auth/callback/${provider}`, locale), window.location.origin).toString();
}
