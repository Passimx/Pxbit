import { isAuthProvider } from '@/shared/config/auth';

import { readDb, writeDb } from './db';
import { clearMockSession, hasMockSession, setMockSession } from './session';

export interface MockRequest {
  body: unknown;
  /** Параметры из пути: для "/auth/:provider/start" это { provider }. */
  params: Record<string, string>;
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

const field = (body: unknown, name: string): unknown => (body as Record<string, unknown> | null)?.[name];

// Эндпоинт только для вошедших: без сессии отвечает 401, как настоящий API.
const authed =
  (handler: Handler): Handler =>
  (request) => {
    if (!hasMockSession()) throw new MockHttpError(401, { message: 'Требуется вход' });
    return handler(request);
  };

const provider = ({ params }: MockRequest) => {
  if (!isAuthProvider(params.provider ?? '')) throw new MockHttpError(404, { message: 'Неизвестный провайдер' });
  return params.provider!;
};

// Ключ: "МЕТОД /путь", как в контракте API; ":name" обозначает параметр пути.
// Новый эндпоинт: добавить строку сюда.
export const handlers: Record<string, Handler> = {
  // Вместо страницы провайдера сразу возвращаемся на callback, как будто пользователь согласился.
  'POST /auth/:provider/start': (request) => {
    const redirectUri = field(request.body, 'redirectUri');
    if (typeof redirectUri !== 'string') throw new MockHttpError(422, { message: 'Нужен redirectUri' });

    const db = readDb();
    const state = crypto.randomUUID();
    writeDb({ ...db, pendingLogin: { provider: provider(request), state } });

    const authorizeUrl = new URL(redirectUri);
    authorizeUrl.searchParams.set('code', `mock-code-${provider(request)}`);
    authorizeUrl.searchParams.set('state', state);
    return { authorizeUrl: authorizeUrl.toString() };
  },

  'POST /auth/:provider/callback': (request) => {
    const db = readDb();
    const { pendingLogin } = db;
    if (
      !pendingLogin ||
      pendingLogin.provider !== provider(request) ||
      pendingLogin.state !== field(request.body, 'state')
    ) {
      throw new MockHttpError(400, { message: 'Сессия входа устарела, начните заново' });
    }
    writeDb({ ...db, pendingLogin: null });
    setMockSession();
    return db.user;
  },

  'POST /auth/logout': () => {
    clearMockSession();
    return null;
  },

  'GET /me': authed(() => readDb().user),

  'PATCH /me/settings': authed(({ body }) => {
    const db = readDb();
    const displayCurrency = field(body, 'displayCurrency');
    if (typeof displayCurrency !== 'string' || !(displayCurrency in db.rates.rates)) {
      throw new MockHttpError(422, { message: 'Неизвестная валюта' });
    }
    const user = { ...db.user, displayCurrency };
    writeDb({ ...db, user });
    return user;
  }),

  'GET /me/balance': authed(() => readDb().balance),

  'GET /rates': authed(() => readDb().rates),
};
