import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Grava as questões de REFORÇO do dia 2 (Pablo, 12/11/2026): errou na prova,
// a próxima é uma parecida do mesmo conteúdo (app/api/provas/reforco). Ficam
// fora de toda prova; só aparecem pelo reforço. Estilo ENEM, nunca "ENEM real"
// (nivel dificil, sem anoProva). Cria ou atualiza a questão e a explicação
// pronta; não apaga nada. Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-reforco-dia-2.ts [--gravar]

const prisma = new PrismaClient();
const PASTA = join(process.cwd(), 'data/revisao-final/dia-2');
const ORIGEM = 'Reforço do dia 2';
const MODELO = 'claude-opus-5-5 (escrita na sessão)';

type Questao = {
  id: string; materia: string; tema: string; enunciado: string; resposta: string;
  A: string; B: string; C: string; D: string; E: string; explicacao: unknown;
};

async function main() {
  const gravar = process.argv.includes('--gravar');
  const questoes = readdirSync(PASTA)
    .filter((f) => f.startsWith('reforco-') && f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(join(PASTA, f), 'utf8')) as Questao[]);

  const porTema: Record<string, number> = {};
  for (const q of questoes) {
    if (!validarExplicacao(q.explicacao, q.materia)) throw new Error(`${q.id}: explicação recusada; nada gravado`);
    porTema[q.tema] = (porTema[q.tema] ?? 0) + 1;
  }
  console.log(`${questoes.length} questões de reforço:`, porTema);
  if (!gravar) return console.log('Nada gravado (use --gravar).');

  for (const q of questoes) {
    const dados = {
      enunciado: q.enunciado,
      alternativaA: q.A, alternativaB: q.B, alternativaC: q.C, alternativaD: q.D, alternativaE: q.E,
      respostaCorreta: q.resposta, materia: q.materia, subtema: q.tema, tema: q.tema,
      dificuldade: 'dificil', nivel: 'dificil', origem: ORIGEM,
    };
    await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...dados }, update: dados });
    const conteudo = validarExplicacao(q.explicacao, q.materia)!;
    const explicacao = { versao: VERSAO_EXPLICACAO, conteudo: conteudo as object, revisada: true, problemas: null, modelo: MODELO };
    await prisma.explicacaoPronta.upsert({ where: { questionId: q.id }, create: { questionId: q.id, ...explicacao }, update: explicacao });
  }
  console.log(`Gravadas: ${questoes.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
