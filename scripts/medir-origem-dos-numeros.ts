// Mede quantas lousas têm número de conta sem origem (regra 19). Uso: npx tsx scripts/medir-origem-dos-numeros.mts <backup.json> [--lista]
import { readFileSync } from 'node:fs';
import { numerosSemOrigem } from '../lib/aula-lousa/origem-dos-numeros';

const [arquivo, ...flags] = process.argv.slice(2);
const dados = JSON.parse(readFileSync(arquivo, 'utf8')) as Record<string, { lousa: { cenas: never[] } }>;
const ids = Object.keys(dados);
let comFalta = 0;
let totalFaltas = 0;
for (const id of ids) {
  const f = numerosSemOrigem(dados[id].lousa.cenas);
  if (!f.length) continue;
  comFalta++;
  totalFaltas += f.length;
  if (flags.includes('--lista')) console.log(id, f.slice(0, 4).map((x) => `${x.numero} em "${x.linha}"`).join(' | '));
}
console.log(`lousas: ${ids.length}; com número sem origem: ${comFalta}; números sem origem: ${totalFaltas}`);
