// Bateria de QA: os testes que já existiam + os de tests/qa, com cobertura.
// Separada do `npm test` de propósito: teste que acusa bug fica vermelho aqui.
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['lib/**/*.test.ts', 'data/**/*.test.ts', 'tests/**/*.test.ts', 'tests/qa/**/*.qa.ts'],
    // Endereço de banco inválido: se algum teste escapar do banco falso, falha em vez de tocar o real.
    env: { DATABASE_URL: 'postgresql://qa:qa@127.0.0.1:1/qa', GROQ_API_KEY: '', GEMINI_API_KEY: '', MISTRAL_API_KEY: '', ABACUSAI_API_KEY: '' },
    coverage: {
      provider: 'v8',
      include: ['app/**', 'lib/**', 'components/**', 'middleware.ts'],
      exclude: ['**/*.test.*', '**/*.qa.ts'],
      reporter: ['text-summary', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
});
