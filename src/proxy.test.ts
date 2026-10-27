// @vitest-environment node
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import proxy from './proxy';

const request = (path: string, cookie?: string) =>
  new NextRequest(new URL(path, 'http://localhost:3000'), { headers: cookie ? { cookie } : {} });

describe('proxy', () => {
  it('без сессии отправляет на вход и запоминает, куда шли', () => {
    const response = proxy(request('/deals?tab=active'));
    expect(response.status).toBe(307);
    const location = new URL(response.headers.get('location')!);
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('returnTo')).toBe('/deals?tab=active');
  });

  it('с главной отправляет на вход без returnTo', () => {
    const location = new URL(proxy(request('/')).headers.get('location')!);
    expect(location.pathname).toBe('/login');
    expect(location.search).toBe('');
  });

  it('пускает на публичные страницы без сессии', () => {
    expect(proxy(request('/login')).headers.get('location')).toBeNull();
    expect(proxy(request('/auth/callback/google?code=1')).headers.get('location')).toBeNull();
  });

  it('пускает на приватные страницы с сессией', () => {
    expect(proxy(request('/', 'pxbit_session=abc')).headers.get('location')).toBeNull();
  });
});
