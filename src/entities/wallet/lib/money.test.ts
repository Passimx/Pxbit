import { describe, expect, it } from 'vitest';

import { addUsdt, convertUsdtToFiat, formatFiat, formatUsdt } from './money';

// Intl разделяет разряды неразрывными пробелами: для сравнения приводим их к обычным.
const plain = (value: string) => value.replace(/\s/g, ' ');

describe('money', () => {
  it('складывает суммы USDT без потери точности', () => {
    expect(addUsdt('0.1', '0.2')).toBe('0.300000');
    expect(addUsdt('1250.500000', '200')).toBe('1450.500000');
  });

  it('пересчитывает в фиат с округлением вниз', () => {
    // 1450.5 × 81.2345 = 117 830.64225
    expect(convertUsdtToFiat('1450.5', '81.2345')).toBe('117830.64');
    // 0.009999 × 1 = 0.009999: копейки не «дорисовываются»
    expect(convertUsdtToFiat('0.009999', '1')).toBe('0.00');
  });

  it('форматирует по локали', () => {
    expect(plain(formatFiat('117830.64', 'RUB', 'ru'))).toBe('117 830,64 ₽');
    expect(plain(formatFiat('12.5', 'USD', 'ru'))).toBe('12,50 $');
    expect(plain(formatUsdt('1450.509999', 'ru'))).toBe('1 450,50 USDT');
  });
});
