// Состояние фейкового бэкенда в памяти. Живёт до перезагрузки страницы.
// Форма данных повторяет ответы настоящего API (см. «Контракт API» в PLAN.md).

const createInitialDb = () => ({
  user: {
    id: 'u_1',
    nickname: 'ramil',
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
});

export let db = createInitialDb();

/** Для тестов: вернуть данные к исходным. */
export function resetMockDb() {
  db = createInitialDb();
}
