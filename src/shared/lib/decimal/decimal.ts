// Десятичные числа как bigint + масштаб: 12.34 при scale = 2 хранится как 1234n.
// Деньги нельзя считать во float: 0.1 + 0.2 !== 0.3.

import { z } from 'zod';

const DECIMAL_RE = /^(-)?(\d+)(?:\.(\d+))?$/;

/** Сумма или курс из API: десятичное число строкой, например "1250.500000". */
export const decimalStringSchema = z.string().regex(DECIMAL_RE, 'Ожидается десятичное число строкой');

/** Разбирает строку вида "1250.5" в bigint с заданным масштабом. Лишние знаки отбрасываются. */
export function parseDecimal(value: string, scale: number): bigint {
  const match = DECIMAL_RE.exec(value.trim());
  if (!match) throw new Error(`Некорректное десятичное число: "${value}"`);

  const [, sign, int = '0', frac = ''] = match;
  const units = BigInt(int + frac.slice(0, scale).padEnd(scale, '0'));
  return sign ? -units : units;
}

/** Обратное к parseDecimal: 123450n при scale = 2 → "1234.50". */
export function formatDecimal(units: bigint, scale: number): string {
  const negative = units < 0n;
  const digits = (negative ? -units : units).toString().padStart(scale + 1, '0');
  const int = digits.slice(0, digits.length - scale);
  const frac = digits.slice(digits.length - scale);
  return `${negative ? '-' : ''}${int}${scale > 0 ? `.${frac}` : ''}`;
}

/** Переводит число из масштаба from в масштаб to с округлением к нулю. */
export function rescale(units: bigint, from: number, to: number): bigint {
  if (to >= from) return units * 10n ** BigInt(to - from);
  return units / 10n ** BigInt(from - to);
}
