import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    // Тесты всегда ходят в моки, а не в сеть.
    env: { NEXT_PUBLIC_API_MOCKS: 'true' },
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // next-intl импортирует 'next/server' без расширения: Node без бандлера такое не резолвит.
    server: { deps: { inline: ['next-intl'] } },
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
