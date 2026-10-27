// Cookie сессии ставит и снимает бэкенд (httpOnly). Фронт только проверяет её наличие в proxy.ts,
// поэтому бэкенд должен ставить её на общий с фронтом домен.
export const SESSION_COOKIE = 'pxbit_session';

export const LOGIN_PATH = '/login';
export const RETURN_TO_PARAM = 'returnTo';

/** Пути, доступные без входа. Всё остальное приватное. */
export const PUBLIC_PATHS = [LOGIN_PATH, '/auth/callback'];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export const AUTH_PROVIDERS = ['google', 'sber', 'tbank'] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export function isAuthProvider(value: string): value is AuthProvider {
  return (AUTH_PROVIDERS as readonly string[]).includes(value);
}
