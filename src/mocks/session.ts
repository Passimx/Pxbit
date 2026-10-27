import { SESSION_COOKIE } from '@/shared/config/auth';

// Настоящий бэкенд ставит httpOnly-cookie сам. Мок ставит обычную cookie с тем же именем,
// чтобы proxy.ts видел вход так же, как в проде.

export function hasMockSession(): boolean {
  return typeof document !== 'undefined' && document.cookie.split('; ').some((c) => c.startsWith(`${SESSION_COOKIE}=`));
}

export function setMockSession() {
  document.cookie = `${SESSION_COOKIE}=mock; path=/; SameSite=Lax`;
}

export function clearMockSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}
