// Classifica questões existentes no campo `tema` (taxonomia enxuta de
// lib/tema-taxonomy.ts) a partir do `subtema` livre + enunciado. `subtema`
// não é alterado. Uso:
//   npx tsx scripts/classify-tema.ts sample [n]   # amostra pra revisão (default 18)
//   npx tsx scripts/classify-tema.ts all           # roda em todas as questões sem tema
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { PrismaClient } from '@prisma/client';
import { temaTaxonomy } from '../lib/tema-taxonomy';
import { getAbacusApiKey } from '../lib/ai-client';

const prisma = new PrismaClient();

interface QuestionToClassify {
  id: string;
  materia: string;
  subtema: string;
  enunciado: string;
}

// Duplicado de lib/ai-client.ts (não dá pra importar chatCompletion aqui —
// ela devolve NextResponse, pensada pra rota, não pra script standalone).
async function callAI(prompt: string): Promise<string | null> {
  const apiKey = getAbacusApiKey();
  if (!apiKey) throw new Error('ABACUSAI_API_KEY não configurada');
  const baseUrl = process.env.AI_BASE_URL || 'https://apps.abacus.ai/v1';
  const model = process.env.AI_MODEL || 'gpt-5.4-mini';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.1,
    }),
  });
  if (!res.ok) {
    console.error(`Erro na API de IA: ${res.status}`);
    return null;
  }
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? '').trim();
}

async function classifyQuestion(question: QuestionToClassify): Promise<string | null> {
  const temas = temaTaxonomy[question.materia] ?? [];
  if (temas.length === 0) {
    console.warn(`Sem taxonomia para matéria "${question.materia}" (questão ${question.id})`);
    return null;
  }

  const prompt = `Classifique a questão de ${question.materia} abaixo em UM dos temas da lista.

Temas disponíveis:
${temas.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Subtema original (pode ser impreciso, ou até um resumo do enunciado em vez de um tópico real — não confie cegamente nele): "${question.subtema}"

Enunciado:
"""
${question.enunciado.substring(0, 1500)}
"""

Responda APENAS com o nome EXATO de um dos temas da lista acima, sem numeração, sem explicação, sem aspas.`;

  const raw = await callAI(prompt);
  if (raw === null) return null;

  const match = temas.find((t) => t.toLowerCase() === raw.toLowerCase());
  if (!match) {
    console.warn(`Resposta da IA não bateu com nenhum tema (questão ${question.id}): "${raw}"`);
    return null;
  }
  return match;
}

async function pickRandomQuestion(
  where: Record<string, unknown>,
  excludeIds: string[]
): Promise<QuestionToClassify | null> {
  const fullWhere = { ...where, id: { notIn: excludeIds } };
  const count = await prisma.question.count({ where: fullWhere });
  if (count === 0) return null;
  const skip = Math.floor(Math.random() * count);
  return prisma.question.findFirst({
    where: fullWhere,
    select: { id: true, materia: true, subtema: true, enunciado: true },
    skip,
  });
}

// subtema "esquisito" = descrição de questão em vez de tópico real — tende a
// ser uma frase inteira, então usamos comprimento como proxy pra achar
// alguns de propósito na amostra (a lista exata que motivou o pedido original
// não foi preservada, então isso é uma heurística, não um lookup literal).
const WEIRD_SUBTEMA_MIN_LENGTH = 45;

async function runSample(n: number): Promise<void> {
  const materias = Object.keys(temaTaxonomy);
  const picked: QuestionToClassify[] = [];
  const seenIds = new Set<string>();

  // 1. Um par de questões com subtema "descritivo" (frase longa), de propósito.
  const weirdCandidates = await prisma.question.findMany({
    where: { subtema: { not: '' } },
    select: { id: true, materia: true, subtema: true, enunciado: true },
    take: 200,
  });
  const weird = weirdCandidates
    .filter((q) => q.subtema.length >= WEIRD_SUBTEMA_MIN_LENGTH)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  for (const q of weird) {
    picked.push(q);
    seenIds.add(q.id);
  }

  // 2. Round-robin pelas matérias até completar n, garantindo diversidade.
  let materiaIdx = 0;
  let guard = 0;
  while (picked.length < n && guard < n * 10) {
    guard++;
    const materia = materias[materiaIdx % materias.length];
    materiaIdx++;
    const q = await pickRandomQuestion({ materia }, Array.from(seenIds));
    if (q && !seenIds.has(q.id)) {
      picked.push(q);
      seenIds.add(q.id);
    }
  }

  console.log(`\nClassificando amostra de ${picked.length} questões...\n`);

  for (const q of picked) {
    const tema = await classifyQuestion(q);
    console.log(`[${q.materia}] subtema original: "${q.subtema}"`);
    console.log(`  -> tema: ${tema ?? '(falhou)'}\n`);
  }
}

async function runAll(): Promise<void> {
  const questions: QuestionToClassify[] = await prisma.question.findMany({
    where: { tema: null },
    select: { id: true, materia: true, subtema: true, enunciado: true },
  });

  console.log(`Classificando ${questions.length} questões...`);
  let done = 0;
  let failed = 0;

  for (const q of questions) {
    const tema = await classifyQuestion(q);
    if (tema) {
      await prisma.question.update({ where: { id: q.id }, data: { tema } });
      done++;
    } else {
      failed++;
    }
    if ((done + failed) % 25 === 0) {
      console.log(`Progresso: ${done + failed}/${questions.length} (${failed} falhas)`);
    }
  }

  console.log(`\nConcluído: ${done} classificadas, ${failed} falharam.`);
}

async function main() {
  const mode = process.argv[2] ?? 'sample';
  try {
    if (mode === 'sample') {
      const n = parseInt(process.argv[3] ?? '18', 10);
      await runSample(n);
    } else if (mode === 'all') {
      await runAll();
    } else {
      console.error('Uso: npx tsx scripts/classify-tema.ts [sample [n] | all]');
      process.exitCode = 1;
    }
  } catch (e) {
    console.error('Erro:', e instanceof Error ? e.message : e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
