import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/qa/e2e/**/*.e2e.ts'],
    globalSetup: ['tests/qa/e2e/servidor.ts'],
    testTimeout: 45_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
