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
  features/<name>/     фичи: слайс, компоненты, стили, тесты, index.ts
  widgets/             крупные блоки страницы из нескольких фич (Header)
  shared/              переиспользуемое без бизнес-логики: ui, config, lib
```

Правила импортов:

- Из фичи снаружи импортируем только через её `index.ts`: `@/features/counter`. Глубокие импорты запрещены ESLint.
- `shared` ни от чего не зависит, `features` зависят от `shared`, `widgets` от `features` и `shared`, `app` от всех.

## Серверные и клиентские компоненты

По умолчанию любой компонент серверный. `'use client'` ставим только там, где действительно нужно:

| Нужно                                                        | Компонент  |
| ------------------------------------------------------------ | ---------- |
| Получить данные, читать секреты, рендерить статический текст | серверный  |
| `useState`, `useEffect`, обработчики событий, браузерные API | клиентский |
| Redux (`useAppSelector`, `useAppDispatch`), RTK Query-хуки   | клиентский |

Примеры:

- `src/app/[locale]/page.tsx` и `src/widgets/Header/Header.tsx`: серверные, переводы через `await getTranslations()`.
- `src/features/counter/Counter.tsx`: клиентский, переводы через `useTranslations()`, состояние в Redux.
- `src/shared/ui/Container`: без директивы, работает в обоих мирах.

Держите `'use client'` как можно ниже по дереву: серверная страница может рендерить клиентские «островки», но не наоборот (клиентский компонент может получать серверные только через `children`).

## Redux

- `makeStore()` создаёт новый store на каждый запрос, поэтому состояние пользователей не смешивается на сервере.
- `StoreProvider` подключён в `src/app/[locale]/layout.tsx`.
- Используйте `useAppSelector` / `useAppDispatch` из `@/store/hooks`, а не голые хуки react-redux.
- Новые слайсы добавляются в `combineSlices(...)` в `src/store/store.ts`.
- Запросы к API описываются через `baseApi.injectEndpoints(...)` внутри фичи. Базовый URL берётся из `NEXT_PUBLIC_API_URL`.

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
fix(counter): не уходить в минус
chore: обновить зависимости
```

Перед коммитом lint-staged прогоняет ESLint и Prettier по изменённым файлам.
