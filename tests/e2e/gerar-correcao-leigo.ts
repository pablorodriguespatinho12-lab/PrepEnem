// Gera tests/e2e/correcao-leigo.json: a correção de verdade (IA da Groq, sem
// banco) da redação do leigo. O e2e do passo 8 devolve esse JSON no lugar do
// evaluate, para não gravar no Neon. Rodar de novo só se o formato mudar:
//   npx vite-node --config vitest.config.ts tests/e2e/gerar-correcao-leigo.ts

import { writeFileSync } from 'fs';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { pedirJson } = await import('@/lib/pedir-json');
  const { opcoesCorrecaoCompleta, promptRedacaoCompleta } = await import('@/lib/redacao/prompts');
  const { corrigirRedacao } = await import('@/lib/redacao/correcao');
  const { montarDevolutiva } = await import('@/lib/redacao/devolutiva');
  const { REDACAO_LEIGO, TEMA_LEIGO } = await import('./texto-leigo');
  const r = await pedirJson(promptRedacaoCompleta(TEMA_LEIGO, null, REDACAO_LEIGO), (b) => corrigirRedacao(b, REDACAO_LEIGO), opcoesCorrecaoCompleta());
  if (!r.ok) throw new Error(`${r.status} ${r.erro}`);
  writeFileSync('tests/e2e/correcao-leigo.json', `${JSON.stringify({ ...r.dado, corrigidaPor: r.modelo }, null, 1)}\n`);
  console.log(r.dado.total, JSON.stringify(r.dado.notas));
  console.log(JSON.stringify(montarDevolutiva(r.dado, REDACAO_LEIGO), null, 1));
}

main().catch((e) => { console.error(e); process.exit(1); });
