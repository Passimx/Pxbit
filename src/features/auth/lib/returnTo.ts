// Куда вернуть пользователя после входа. Переживает уход на страницу провайдера,
// поэтому хранится в sessionStorage, а не в памяти.

const STORAGE_KEY = 'pxbit_return_to';

/**
 * Принимаем только относительные пути своего сайта. Иначе ссылка вида
 * /login?returnTo=https://evil.example увела бы пользователя на чужой сайт после входа.
 */
export function sanitizeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/';
  return value;
}

export function saveReturnTo(value: string | null) {
  try {
    sessionStorage.setItem(STORAGE_KEY, sanitizeReturnTo(value));
  } catch {
    // Без sessionStorage после входа просто попадём на главную.
  }
}

export function consumeReturnTo(): string {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return sanitizeReturnTo(value);
  } catch {
    return '/';
  }
}
