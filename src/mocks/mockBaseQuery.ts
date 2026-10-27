import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { handlers, MockHttpError, type MockRequest } from './handlers';

// Имитация сетевой задержки, чтобы были видны состояния загрузки. В тестах без неё.
const DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 400;

type MockResult = { data: unknown } | { error: FetchBaseQueryError };

// "POST /auth/:provider/start" + "POST /auth/google/start" → { provider: "google" }
function matchRoute(key: string, method: string, path: string): MockRequest['params'] | null {
  const [routeMethod, routePath = ''] = key.split(' ');
  if (routeMethod !== method) return null;

  const routeParts = routePath.split('/');
  const pathParts = path.split('/');
  if (routeParts.length !== pathParts.length) return null;

  const params: MockRequest['params'] = {};
  for (const [index, part] of routeParts.entries()) {
    const actual = pathParts[index]!;
    if (part.startsWith(':')) params[part.slice(1)] = decodeURIComponent(actual);
    else if (part !== actual) return null;
  }
  return params;
}

export async function mockBaseQuery(args: string | FetchArgs): Promise<MockResult> {
  const { url, method = 'GET', body } = typeof args === 'string' ? { url: args } : args;
  const path = url.split('?')[0]!;
  const upperMethod = method.toUpperCase();

  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  for (const [key, handler] of Object.entries(handlers)) {
    const params = matchRoute(key, upperMethod, path);
    if (!params) continue;
    try {
      // structuredClone: компонент не должен получить ссылку на «базу» и случайно её изменить.
      return { data: structuredClone(handler({ body, params })) };
    } catch (error) {
      if (error instanceof MockHttpError) return { error: { status: error.status, data: error.data } };
      throw error;
    }
  }

  return { error: { status: 404, data: { message: `Нет мока для ${upperMethod} ${path}` } } };
}
