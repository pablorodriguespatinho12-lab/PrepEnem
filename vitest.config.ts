import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  // JSX novo (sem import React), como o Next: as aulas da aba Descobrir são .tsx.
  esbuild: { jsx: 'automatic' },
  test: { include: ['lib/**/*.test.ts', 'data/**/*.test.ts', 'tests/**/*.test.ts'] },
});
