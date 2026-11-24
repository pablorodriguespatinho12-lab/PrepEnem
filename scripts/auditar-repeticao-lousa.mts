/* Auditoria (regra 22 do Pablo): dado do enunciado digitado UMA vez.
   Para cada questão "acima" com lousa, conta em quantas telas cada número
   do enunciado (3+ dígitos ou decimal) reaparece. Só lê o banco.
   Rodar: DB_CONFIRMED=1 npx tsx scripts/auditar-repeticao-lousa.mts */
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const { PrismaClient } = await import('@prisma/client');
const db = new PrismaClient();

const NUMERO = /\d+[.,]\d+|\d{1,3}(?:\.\d{3})+|\d{3,}/g;

/* Só texto que o aluno lê: coordenadas e tempos são número no JSON, não string. */
function textos(no: unknown): string[] {
  if (typeof no === 'string') return [no];
  if (Array.isArray(no)) return no.flatMap(textos);
  if (no && typeof no === 'object') return Object.values(no).flatMap(textos);
  return [];
}
const LIMITE_TELAS = 3;

const linhas = await db.question.findMany({
  where: { nivel: 'acima', explicacaoPronta: { isNot: null } },
  select: { id: true, enunciado: true, explicacaoPronta: { select: { conteudo: true } } },
});

const saida: string[] = ['id | escada | letras | telas | número que mais repete (telas)'];
let comLousa = 0;
let repetem = 0;
let repetemForaEscada = 0;
let foraEscada = 0;

for (const q of linhas) {
  const cenas = (q.explicacaoPronta?.conteudo as { lousa?: { cenas?: unknown[] } } | null)?.lousa?.cenas;
  if (!cenas || cenas.length === 0) continue;
  comLousa++;
  const escada = q.id.startsWith('d2-escada');
  if (!escada) foraEscada++;
  const numeros = [...new Set(q.enunciado.match(NUMERO) ?? [])];
  const porTela = cenas.map((c) => textos(c).join(' '));
  let melhor = { n: '-', telas: 0 };
  for (const n of numeros) {
    const telas = porTela.filter((t) => t.includes(n)).length;
    if (telas > melhor.telas) melhor = { n, telas };
  }
  if (melhor.telas >= LIMITE_TELAS) {
    repetem++;
    if (!escada) repetemForaEscada++;
  }
  saida.push(`${q.id} | ${escada ? 'sim' : 'não'} | ${q.enunciado.length} | ${cenas.length} | ${melhor.n} (${melhor.telas})`);
}

console.log(saida.join('\n'));
console.log(`\nTOTAL com lousa: ${comLousa} (fora de escada: ${foraEscada})`);
console.log(`Repetem em ${LIMITE_TELAS}+ telas: ${repetem} de ${comLousa}; fora de escada: ${repetemForaEscada} de ${foraEscada}`);
await db.$disconnect();
