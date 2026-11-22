import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { mkdirSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

// Só LÊ o banco. Despeja, um arquivo por questão, o que um redator precisa para reescrever a aula no molde do robô
// (dados → letras → equação montada → achando → volta): enunciado, alternativas, gabarito e a explicação antiga.
// Uso: DB_CONFIRMED=1 npx tsx scripts/dump-antigas.ts <pasta> <id> [<id> ...]
const prisma = new PrismaClient();

async function main() {
  const [pasta, ...ids] = process.argv.slice(2);
  if (!pasta || !ids.length) throw new Error('uso: dump-antigas.ts <pasta> <id>...');
  mkdirSync(pasta, { recursive: true });
  for (const id of ids) {
    const q = await prisma.question.findUnique({ where: { id } });
    const e = await prisma.explicacaoPronta.findUnique({ where: { questionId: id } });
    if (!q || !e) throw new Error(`${id}: não encontrada`);
    const { lousa: _lousa, ...antiga } = (e.conteudo ?? {}) as Record<string, unknown>;
    void _lousa;
    writeFileSync(`${pasta}/${id}.json`, JSON.stringify({
      id, materia: q.materia, tema: q.tema, enunciado: q.enunciado,
      alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
      resposta: q.respostaCorreta, explicacaoAntiga: antiga,
    }, null, 1));
    console.log(`${id}: ok`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
