import { z } from 'zod';

// Валюта, в которой реально лежат деньги, и сколько у неё знаков после запятой.
export const SETTLEMENT_ASSET = 'USDT';
export const SETTLEMENT_SCALE = 6;

// Фиатные валюты, в которых можно показывать баланс. Новая валюта: добавить код ISO 4217 сюда
// и курс к USDT на бэкенде.
export const FIAT_CURRENCIES = ['RUB', 'CNY', 'USD'] as const;
export type FiatCurrency = (typeof FIAT_CURRENCIES)[number];
export const fiatCurrencySchema = z.enum(FIAT_CURRENCIES);
