import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { handlers, MockHttpError } from './handlers';

// Имитация сетевой задержки, чтобы были видны состояния загрузки. В тестах без неё.
const DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 400;

type MockResult = { data: unknown } | { error: FetchBaseQueryError };

export async function mockBaseQuery(args: string | FetchArgs): Promise<MockResult> {
  const { url, method = 'GET', body, params = {} } = typeof args === 'string' ? { url: args } : args;
  const path = url.split('?')[0];
  const handler = handlers[`${method.toUpperCase()} ${path}`];

  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  if (!handler) {
    return { error: { status: 404, data: { message: `Нет мока для ${method} ${path}` } } };
  }

  try {
    // structuredClone: компонент не должен получить ссылку на «базу» и случайно её изменить.
    return { data: structuredClone(handler({ body, params })) };
  } catch (error) {
    if (error instanceof MockHttpError) return { error: { status: error.status, data: error.data } };
    throw error;
  }
}
