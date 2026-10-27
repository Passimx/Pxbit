import { db } from './db';

export interface MockRequest {
  body: unknown;
  params: Record<string, unknown>;
}

export class MockHttpError extends Error {
  constructor(
    readonly status: number,
    readonly data: unknown,
  ) {
    super(`Mock HTTP ${status}`);
  }
}

type Handler = (request: MockRequest) => unknown;

// Ключ: "МЕТОД /путь", как в контракте API. Новый эндпоинт: добавить строку сюда.
export const handlers: Record<string, Handler> = {
  'GET /me': () => db.user,

  'PATCH /me/settings': ({ body }) => {
    const { displayCurrency } = (body ?? {}) as { displayCurrency?: unknown };
    if (typeof displayCurrency !== 'string' || !(displayCurrency in db.rates.rates)) {
      throw new MockHttpError(422, { message: 'Неизвестная валюта' });
    }
    db.user = { ...db.user, displayCurrency };
    return db.user;
  },

  'GET /me/balance': () => db.balance,

  'GET /rates': () => db.rates,
};
