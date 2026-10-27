import { describe, expect, it } from 'vitest';

import { formatDecimal, parseDecimal, rescale } from './decimal';

describe('decimal', () => {
  it('разбирает строки с разным числом знаков', () => {
    expect(parseDecimal('1250.5', 6)).toBe(1_250_500_000n);
    expect(parseDecimal('200', 2)).toBe(20_000n);
    expect(parseDecimal('0.123456789', 6)).toBe(123_456n);
    expect(parseDecimal('-1.5', 1)).toBe(-15n);
  });

  it('отклоняет мусор', () => {
    expect(() => parseDecimal('1e5', 2)).toThrow();
    expect(() => parseDecimal('abc', 2)).toThrow();
    expect(() => parseDecimal('1.', 2)).toThrow();
  });

  it('форматирует обратно в строку', () => {
    expect(formatDecimal(123_450n, 2)).toBe('1234.50');
    expect(formatDecimal(5n, 3)).toBe('0.005');
    expect(formatDecimal(-15n, 1)).toBe('-1.5');
    expect(formatDecimal(42n, 0)).toBe('42');
  });

  it('меняет масштаб, округляя к нулю', () => {
    expect(rescale(12_345n, 3, 1)).toBe(123n);
    expect(rescale(-12_345n, 3, 1)).toBe(-123n);
    expect(rescale(12n, 0, 2)).toBe(1_200n);
  });
});
