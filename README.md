# Pxbit

Клиентское приложение на Next.js (App Router).

## Стек

| Задача          | Инструмент                                              |
| --------------- | ------------------------------------------------------- |
| Фреймворк       | Next.js 16 (App Router, Turbopack, Cache Components)    |
| Язык            | TypeScript 6 (strict)                                   |
| Состояние       | Redux Toolkit + RTK Query                               |
| Мультиязычность | next-intl, словари в `messages/*.json`                  |
| Стили           | CSS Modules + CSS-переменные в `src/app/globals.css`    |
| Валидация env   | zod                                                     |
| Качество кода   | ESLint (flat config) + Prettier                         |
| Git-хуки        | husky + lint-staged + commitlint (Conventional Commits) |
| Тесты           | Vitest + Testing Library                                |
| CI              | GitHub Actions: typecheck, lint, format, test, build    |

ESLint остаётся на 9.x, а TypeScript на 6.0: `eslint-config-next` и `typescript-eslint` пока не поддерживают ESLint 10 и TypeScript 7.

## Быстрый старт

```bash
nvm use            # Node 22 из .nvmrc
npm install        # заодно установит git-хуки husky
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

## Скрипты

| Команда             | Что делает                                   |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | dev-сервер                                   |
| `npm run build`     | production-сборка                            |
| `npm run start`     | запуск собранного приложения                 |
| `npm run lint`      | ESLint без предупреждений                    |
| `npm run format`    | форматирование Prettier                      |
| `npm run typecheck` | генерация типов роутов и проверка TypeScript |
| `npm test`          | тесты Vitest                                 |
| `npm run check`     | всё сразу, как в CI (кроме сборки)           |

## Структура

```
messages/              словари переводов: ru.json, en.json, ...
src/
  app/[locale]/        роуты; всё приложение живёт внутри сегмента локали
  i18n/                настройка next-intl: routing, request, navigation
  proxy.ts             определение локали и редиректы (бывший middleware)
  store/               Redux store, типизированные хуки, StoreProvider, baseApi
  widgets/             крупные блоки страницы из фич и сущностей (Header, BalanceCard)
  features/<name>/     действия пользователя: компоненты, стили, тесты, index.ts (display-currency)
  entities/<name>/     доменные модели: zod-схемы, API-эндпоинты, чистая логика (user, wallet)
  shared/              переиспользуемое без бизнес-логики: ui, config, lib
  mocks/               фейковый бэкенд для разработки и тестов
```

Правила импортов:

- Фичи, сущности и виджеты импортируем снаружи только через `index.ts`: `@/entities/wallet`. Глубокие импорты запрещены ESLint.
- Слои зависят только от тех, что ниже: `app → widgets → features → entities → shared`.
- `@/mocks` импортирует только `baseApi` (и тесты).

## Серверные и клиентские компоненты

По умолчанию любой компонент серверный. `'use client'` ставим только там, где действительно нужно:

| Нужно                                                        | Компонент  |
| ------------------------------------------------------------ | ---------- |
| Получить данные, читать секреты, рендерить статический текст | серверный  |
| `useState`, `useEffect`, обработчики событий, браузерные API | клиентский |
| Redux (`useAppSelector`, `useAppDispatch`), RTK Query-хуки   | клиентский |

Примеры:

- `src/app/[locale]/page.tsx` и `src/widgets/Header/Header.tsx`: серверные, переводы через `await getTranslations()`.
- `src/widgets/BalanceCard/BalanceCard.tsx`: клиентский, переводы через `useTranslations()`, данные через RTK Query.
- `src/shared/ui/Container`: без директивы, работает в обоих мирах.

Держите `'use client'` как можно ниже по дереву: серверная страница может рендерить клиентские «островки», но не наоборот (клиентский компонент может получать серверные только через `children`).

## Redux

- `makeStore()` создаёт новый store на каждый запрос, поэтому состояние пользователей не смешивается на сервере.
- `StoreProvider` подключён в `src/app/[locale]/layout.tsx`.
- Используйте `useAppSelector` / `useAppDispatch` из `@/store/hooks`, а не голые хуки react-redux.
- Новые слайсы добавляются в `combineSlices(...)` в `src/store/store.ts`.
- Запросы к API описываются через `baseApi.injectEndpoints(...)` в сущности или фиче. Базовый URL берётся из `NEXT_PUBLIC_API_URL`.
- Каждый эндпоинт проверяет ответ zod-схемой через `responseSchema`. Если ответ не совпал со схемой, запрос завершается ошибкой `CUSTOM_ERROR`.

## Моки API

С `NEXT_PUBLIC_API_MOCKS=true` запросы RTK Query обрабатывает `src/mocks` вместо сети. Тесты всегда работают на моках.

- `src/mocks/db.ts`: данные в памяти, повторяют форму ответов API.
- `src/mocks/handlers.ts`: обработчики с ключами вида `'GET /me/balance'`. Новый эндпоинт: добавить строку сюда.

Переход на настоящий бэкенд: `NEXT_PUBLIC_API_MOCKS=false`. Код эндпоинтов и компонентов менять не нужно. Контракт API описан в `PLAN.md`.

## Деньги

Баланс всегда хранится в USDT, фиат (RUB, CNY, USD) используется только для отображения. Суммы приходят и хранятся строками. Арифметика идёт на `bigint` (`@/shared/lib/decimal`), никогда во `float`. Пересчёт в фиат округляет вниз.

## Переводы

Сейчас подключён только русский. Чтобы добавить язык, например английский:

1. Скопируйте `messages/ru.json` в `messages/en.json` и переведите значения (ключи не меняйте).
2. Добавьте `'en'` в `locales` в `src/i18n/routing.ts`.

Всё. Ключи переводов типизированы по `messages/ru.json`, так что опечатка в `t('...')` станет ошибкой TypeScript. Как только языков больше одного, у неосновных появится префикс в URL (`/en/...`).

Для ссылок и навигации используйте `Link`, `useRouter`, `redirect` из `@/i18n/navigation`, а не из `next/link` / `next/navigation`: они сохраняют текущую локаль.

## Коммиты

Сообщения коммитов проверяет commitlint по [Conventional Commits](https://www.conventionalcommits.org/ru/):

```
feat: добавить страницу профиля
fix(wallet): округлять баланс вниз
chore: обновить зависимости
```

Перед коммитом lint-staged прогоняет ESLint и Prettier по изменённым файлам.
