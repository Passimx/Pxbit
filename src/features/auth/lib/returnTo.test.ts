import { describe, expect, it } from 'vitest';

import { consumeReturnTo, sanitizeReturnTo, saveReturnTo } from './returnTo';

describe('returnTo', () => {
  it('пропускает только относительные пути своего сайта', () => {
    expect(sanitizeReturnTo('/deals?tab=active')).toBe('/deals?tab=active');
    expect(sanitizeReturnTo('https://evil.example')).toBe('/');
    expect(sanitizeReturnTo('//evil.example')).toBe('/');
    expect(sanitizeReturnTo('/\\evil.example')).toBe('/');
    expect(sanitizeReturnTo(null)).toBe('/');
  });

  it('отдаёт сохранённый путь один раз', () => {
    saveReturnTo('/deals');
    expect(consumeReturnTo()).toBe('/deals');
    expect(consumeReturnTo()).toBe('/');
  });
});
