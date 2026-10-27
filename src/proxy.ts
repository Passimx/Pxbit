import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { localizePath, splitLocale } from './i18n/paths';
import { routing } from './i18n/routing';
import { isPublicPath, LOGIN_PATH, RETURN_TO_PARAM, SESSION_COOKIE } from './shared/config/auth';

const handleI18n = createMiddleware(routing);

// Оптимистичная проверка: смотрим только, есть ли cookie сессии. Валидна ли она, решает API:
// на 401 клиент сам отправит на вход (см. baseApi).
export default function proxy(request: NextRequest) {
  const { locale, pathname } = splitLocale(request.nextUrl.pathname);

  if (!isPublicPath(pathname) && !request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL(localizePath(LOGIN_PATH, locale), request.url);
    if (pathname !== '/') loginUrl.searchParams.set(RETURN_TO_PARAM, pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return handleI18n(request);
}

export const config = {
  // Пропускаем API, служебные файлы Next.js и всё, что содержит точку (статика).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
