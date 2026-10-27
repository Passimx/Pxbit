import { SETTLEMENT_ASSET, SETTLEMENT_SCALE, type FiatCurrency } from '@/shared/config/currencies';
import { formatDecimal, parseDecimal, rescale } from '@/shared/lib/decimal';

// Курсы приходят с точностью до 8 знаков: этого хватает с запасом для RUB, CNY, USD.
const RATE_SCALE = 8;
const FIAT_SCALE = 2;
const DISPLAY_USDT_SCALE = 2;

/** Сумма двух значений в USDT, например available + locked. */
export function addUsdt(a: string, b: string): string {
  return formatDecimal(parseDecimal(a, SETTLEMENT_SCALE) + parseDecimal(b, SETTLEMENT_SCALE), SETTLEMENT_SCALE);
}

/**
 * Пересчитывает USDT в фиат по курсу. Результат округляется вниз (к нулю),
 * чтобы пользователь никогда не видел больше, чем у него есть.
 */
export function convertUsdtToFiat(amount: string, rate: string): string {
  const product = parseDecimal(amount, SETTLEMENT_SCALE) * parseDecimal(rate, RATE_SCALE);
  return formatDecimal(rescale(product, SETTLEMENT_SCALE + RATE_SCALE, FIAT_SCALE), FIAT_SCALE);
}

// Intl принимает десятичную строку как есть, без потери точности на преобразовании в number.
type NumericString = Intl.StringNumericLiteral;

export function formatFiat(amount: string, currency: FiatCurrency, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount as NumericString);
}

export function formatUsdt(amount: string, locale: string): string {
  const truncated = formatDecimal(
    rescale(parseDecimal(amount, SETTLEMENT_SCALE), SETTLEMENT_SCALE, DISPLAY_USDT_SCALE),
    DISPLAY_USDT_SCALE,
  );
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: DISPLAY_USDT_SCALE,
    maximumFractionDigits: DISPLAY_USDT_SCALE,
  }).format(truncated as NumericString);
  return `${number} ${SETTLEMENT_ASSET}`;
}
