// Grava as questões reais de vestibular (data/vestibular) na tabela Question.
// Só cria ou atualiza as próprias (nivel 'vestibular' + origem + número);
// nunca apaga nada. Sem --gravar, só mostra o que faria.
//   DB_CONFIRMED=1 npx tsx --env-file=.env scripts/seed-vestibular.ts [--gravar]
import { PrismaClient } from '@prisma/client';
import { QUESTOES_VESTIBULAR } from '../data/vestibular';
import { chaveVestibular } from '../lib/vestibular/tipos';

const NIVEL = 'vestibular';
const prisma = new PrismaClient();

async function main() {
  const gravar = process.argv.includes('--gravar');
  const antes = await prisma.question.count();
  let novas = 0, atualizadas = 0;

  for (const q of QUESTOES_VESTIBULAR) {
    const origem = chaveVestibular(q);
    const [a, b, c, d, e = ''] = q.alternativas;
    const dados = {
      enunciado: q.enunciado,
      alternativaA: a, alternativaB: b, alternativaC: c, alternativaD: d, alternativaE: e,
      respostaCorreta: 'ABCDE'[q.gabarito],
      materia: q.materia, subtema: q.subtema,
      dificuldade: 'dificil', nivel: NIVEL, origem,
      // anoProva fica vazio: é o campo das provas do ENEM importadas (batch-import, isQuestaoEnem).
      numeroQuestao: q.numero, anoProva: null,
      geradaPorIA: false, dependeImagem: false,
    };
    const existente = await prisma.question.findFirst({ where: { nivel: NIVEL, origem, numeroQuestao: q.numero }, select: { id: true } });
    if (existente) atualizadas++; else novas++;
    if (!gravar) continue;
    if (existente) await prisma.question.update({ where: { id: existente.id }, data: dados });
    else await prisma.question.create({ data: dados });
  }

  const depois = await prisma.question.count();
  console.log(`${gravar ? 'Gravado' : 'Simulação'}: ${novas} novas, ${atualizadas} atualizadas. Questões no banco: ${antes} → ${depois}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
