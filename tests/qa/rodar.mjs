/* Comando único da bateria: npm run test:qa
   1) testes de unidade e de API, com cobertura; 2) build; 3) navegador.
   Roda as três etapas mesmo com falha e sai com erro se alguma falhar. */
import { spawnSync } from 'node:child_process';
import { AMBIENTE } from './ambiente.mjs';

const etapas = [
  ['Unidade e API (com cobertura)', 'npx', ['vitest', 'run', '-c', 'vitest.qa.config.ts', '--coverage']],
  ['Build isolado', 'npm', ['run', 'build']],
  ['Navegador (E2E)', 'npx', ['vitest', 'run', '-c', 'vitest.e2e.config.ts']],
];

const falhas = [];
for (const [nome, comando, args] of etapas) {
  console.log(`\n=== ${nome} ===`);
  const r = spawnSync(comando, args, { stdio: 'inherit', env: { ...process.env, ...AMBIENTE } });
  if (r.status !== 0) falhas.push(nome);
  if (r.status !== 0 && nome === 'Build isolado') break;
}
console.log(falhas.length ? `\nCom falha: ${falhas.join(', ')}. Veja QA-REPORT.md.` : '\nTudo passou.');
process.exit(falhas.length ? 1 : 0);
