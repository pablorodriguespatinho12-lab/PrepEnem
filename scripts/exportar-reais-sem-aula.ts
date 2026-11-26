import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

// Só leitura: exporta as questões reais do ENEM (2019-2025) de exatas, Biologia e Química sem aula, SEM o gabarito
// (quem escreve a aula resolve às cegas; o gravador compara). Uso: DB_CONFIRMED=1 npx tsx <este> <pasta>

const LOTES_DE_BIO_E_QUIMICA = 3;
const prisma = new PrismaClient();

async function main() {
  const pasta = process.argv[2];
  if (!pasta) throw new Error('faltou a pasta');
  const questoes = await prisma.question.findMany({
    where: { anoProva: { gte: 2019, lte: 2025 }, materia: { in: ['Matemática', 'Física', 'Biologia', 'Química'] } },
    orderBy: [{ materia: 'asc' }, { tema: 'asc' }, { id: 'asc' }],
  });
  const comAula = new Set((await prisma.explicacaoPronta.findMany({ select: { questionId: true } })).map((e) => e.questionId));
  const semAula = questoes.filter((q) => !comAula.has(q.id));
  const contagem = new Map<string, number>();
  let n = 0;
  for (const q of semAula) {
    // Mat/Fís que sobraram são as sem conta: vão juntas, no molde de ideia e passos.
    const lote = q.materia === 'Física' || q.materia === 'Matemática' ? 'con' : `bq${(n++ % LOTES_DE_BIO_E_QUIMICA) + 1}`;
    const imagem = q.imagemUrl ? `${process.cwd()}/public${q.imagemUrl}` : null;
    mkdirSync(`${pasta}/${lote}`, { recursive: true });
    writeFileSync(`${pasta}/${lote}/${q.id}.json`, JSON.stringify({
      id: q.id, materia: q.materia, tema: q.tema, ano: q.anoProva, enunciado: q.enunciado,
      alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
      imagem: imagem && existsSync(imagem) ? imagem : null,
    }, null, 1));
    contagem.set(lote, (contagem.get(lote) ?? 0) + 1);
  }
  const exemplo = await prisma.explicacaoPronta.findUnique({ where: { questionId: 'd2-escada-fis-ter-04' } });
  writeFileSync(`${pasta}/exemplo-fisica.json`, JSON.stringify({ passos: (exemplo?.conteudo as { passos?: unknown }).passos, valor_final: 6000, unidade: 'cal' }, null, 1));
  console.log([...contagem], 'sem imagem:', semAula.filter((q) => !q.imagemUrl).length);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
