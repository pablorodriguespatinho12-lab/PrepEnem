import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { MATERIAS_DO_DIA } from '../data/escadas';
import { provasDasEscadas } from '../lib/prova-da-escada';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Provas em escada (Pablo, 17/11/2026): uma por conteúdo, Fácil → Médio → Difícil
// → ENEM → ITA. Faz, nesta ordem:
//   1. grava as questões escritas para a escada (data/revisao-final/escada/*.json);
//   2. esconde (arquivada = true, sem apagar) as provas antigas, menos a Revisão de erros;
//   3. cria a prova que não existe; a que existe ganha as questões que faltavam
//      (sem resposta: remonta na ordem da escada; com resposta: põe as novas no fim).
// Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-provas-escada.ts <username> [--gravar]

const prisma = new PrismaClient();
const NIVEL_ESCADA = 'escada';
const PASTA_ESCADA = join(process.cwd(), 'data/revisao-final/escada');
const ORIGEM_ESCADA = 'Escada';
const MODELO = 'claude-opus-5-5 (escrita na sessão)';

interface QuestaoEscrita {
  id: string; materia: string; tema: string; nivel: string; enunciado: string; resposta: string;
  A: string; B: string; C: string; D: string; E: string; explicacao: unknown;
}

function lerQuestoesEscritas(): QuestaoEscrita[] {
  if (!existsSync(PASTA_ESCADA)) return [];
  return readdirSync(PASTA_ESCADA).filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(join(PASTA_ESCADA, f), 'utf8')) as QuestaoEscrita[]);
}

async function gravarQuestoesEscritas(questoes: QuestaoEscrita[]) {
  for (const q of questoes) {
    const dados = {
      enunciado: q.enunciado,
      alternativaA: q.A, alternativaB: q.B, alternativaC: q.C, alternativaD: q.D, alternativaE: q.E,
      respostaCorreta: q.resposta, materia: q.materia, subtema: q.tema, tema: q.tema,
      // "acima" (nível ITA) é difícil para o resto do site, como em criar-provas-dia-2.ts.
      dificuldade: q.nivel === 'acima' ? 'dificil' : q.nivel, nivel: q.nivel, origem: ORIGEM_ESCADA,
    };
    await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...dados }, update: dados });
    const conteudo = validarExplicacao(q.explicacao, q.materia)!;
    const explicacao = { versao: VERSAO_EXPLICACAO, conteudo: conteudo as object, revisada: true, problemas: null, modelo: MODELO };
    await prisma.explicacaoPronta.upsert({ where: { questionId: q.id }, create: { questionId: q.id, ...explicacao }, update: explicacao });
  }
}

type Prova = ReturnType<typeof provasDasEscadas>[number];

/* Prova que já existe: põe as questões que faltam. Sem nenhuma resposta, remonta
   tudo na ordem da escada; com resposta, só acrescenta no fim (não perde nada). */
async function atualizarProva(examId: string, p: Prova): Promise<number> {
  const ligadas = await prisma.customExamQuestion.findMany({ where: { examId }, select: { questionId: true, answered: true } });
  const ja = new Set(ligadas.map((l) => l.questionId));
  const novas = p.questoes.filter((q) => !ja.has(q.id));
  if (novas.length === 0) return 0;
  const temResposta = ligadas.some((l) => l.answered);
  await prisma.$transaction(async (tx) => {
    if (temResposta) {
      await tx.customExamQuestion.createMany({ data: novas.map((q, i) => ({ examId, questionId: q.id, ordem: ligadas.length + i })) });
    } else {
      await tx.customExamQuestion.deleteMany({ where: { examId, answered: false } });
      await tx.customExamQuestion.createMany({ data: p.questoes.map((q, ordem) => ({ examId, questionId: q.id, ordem })) });
    }
    const total = await tx.customExamQuestion.count({ where: { examId } });
    await tx.customExam.update({ where: { id: examId }, data: { totalQuestoes: total } });
  });
  return novas.length;
}

async function main() {
  const [username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);

  const escritas = lerQuestoesEscritas();
  const recusadas = escritas.filter((q) => !validarExplicacao(q.explicacao, q.materia)).map((q) => q.id);
  if (recusadas.length) throw new Error(`Explicação recusada; nada gravado: ${recusadas.join(', ')}`);
  console.log(`Questões escritas para a escada: ${escritas.length}`);
  if (gravar) await gravarQuestoesEscritas(escritas);

  const todas = await prisma.question.findMany({
    where: { materia: { in: [...MATERIAS_DO_DIA] }, tema: { not: null }, ancoraId: null },
    select: { id: true, materia: true, tema: true, nivel: true, anoProva: true, origem: true },
  });
  // Sem --gravar, as escritas ainda não estão no banco: conta como se estivessem.
  const noBanco = new Set(todas.map((q) => q.id));
  const comEscritas = [...todas, ...escritas.filter((q) => !noBanco.has(q.id))
    .map((q) => ({ id: q.id, materia: q.materia, tema: q.tema, nivel: q.nivel, anoProva: null, origem: ORIGEM_ESCADA }))];
  const provas = provasDasEscadas(comEscritas).filter((p) => p.questoes.length > 0);
  const vazias = provasDasEscadas(comEscritas).filter((p) => p.questoes.length === 0);
  for (const p of provas) {
    console.log(`${p.nome}: ${p.questoes.length} questões${p.faltam.length ? ` (falta: ${p.faltam.join(', ')})` : ''}`);
  }
  if (vazias.length) console.log(`Sem nenhuma questão (fica de fora): ${vazias.map((p) => p.nome).join('; ')}`);

  const nomes = new Set(provas.map((p) => p.nome));
  const antigas = await prisma.customExam.findMany({
    where: { userId: user.id, arquivada: false, nivel: { not: 'revisao' } },
    select: { id: true, nome: true },
  });
  const esconder = antigas.filter((e) => !nomes.has(e.nome));
  console.log(`\nEsconder (${esconder.length}): ${esconder.map((e) => e.nome).join('; ')}`);
  if (!gravar) return console.log('\nNada gravado (use --gravar).');

  const r = await prisma.customExam.updateMany({ where: { id: { in: esconder.map((e) => e.id) } }, data: { arquivada: true } });
  console.log(`Escondidas: ${r.count}`);
  let criadas = 0;
  for (const p of provas) {
    const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome: p.nome, arquivada: false } });
    if (ja) {
      const postas = await atualizarProva(ja.id, p);
      if (postas) console.log(`${p.nome}: +${postas} questões`);
      continue;
    }
    await prisma.customExam.create({
      data: {
        userId: user.id, nome: p.nome, nivel: NIVEL_ESCADA, materias: [p.materia],
        totalQuestoes: p.questoes.length,
        questions: { create: p.questoes.map((q, ordem) => ({ questionId: q.id, ordem })) },
      },
    });
    criadas++;
  }
  console.log(`Criadas: ${criadas}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
