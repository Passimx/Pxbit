import { clearMockSession, setMockSession } from './session';

// Состояние фейкового бэкенда. Хранится в localStorage, потому что вход через OAuth
// перезагружает страницу, а in-memory состояние при этом пропало бы.
// Форма данных повторяет ответы настоящего API (см. docs/openapi.yaml).

const STORAGE_KEY = 'pxbit_mock_db';

const createInitialDb = () => ({
  user: {
    id: 'PX-104582',
    nickname: 'Тестовый пользователь',
    avatarUrl: null as string | null,
    displayCurrency: 'RUB',
  },
  balance: {
    asset: 'USDT',
    available: '1250.500000',
    locked: '200.000000',
  },
  rates: {
    base: 'USDT',
    rates: { RUB: '81.2345', CNY: '7.1234', USD: '0.9998' },
    updatedAt: '2026-10-27T09:00:00.000Z',
  },
  /** Начатый, но не завершённый вход: state из OAuth защищает от CSRF. */
  pendingLogin: null as { provider: string; state: string } | null,
});

export type MockDb = ReturnType<typeof createInitialDb>;

let memoryDb: MockDb | null = null;

export function readDb(): MockDb {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as MockDb;
  } catch {
    // localStorage недоступен (приватный режим, SSR): живём в памяти.
  }
  return (memoryDb ??= createInitialDb());
}

export function writeDb(db: MockDb) {
  memoryDb = db;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // см. readDb
  }
}

/** Для тестов: вернуть данные к исходным и сразу войти или выйти. */
export function resetMockDb({ signedIn = true }: { signedIn?: boolean } = {}) {
  writeDb(createInitialDb());
  if (signedIn) setMockSession();
  else clearMockSession();
}
