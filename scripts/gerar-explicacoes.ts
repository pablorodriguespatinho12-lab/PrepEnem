/* Deixa explicações prontas no banco (Pablo, 22/10/2026: "já deixa várias
   prontas e você revisa"). Gera com a mesma função do app (lib/tutor/gerar.ts),
   passa pela revisão automática (lib/tutor/pronta.ts) e grava em
   ExplicacaoPronta. Primeiro as questões que o Pablo já respondeu, depois as
   de conta. Para sozinho quando a cota de todos os modelos acaba; no outro
   dia, rodar de novo continua de onde parou.

   Só cria ou atualiza a própria linha de ExplicacaoPronta; não toca em Question.

   Uso: DB_CONFIRMED=1 npx tsx --env-file=.env scripts/gerar-explicacoes.ts [quantas=25] */
import { PrismaClient, type Question } from '@prisma/client';
import { gerarExplicacao } from '../lib/tutor/gerar';
import { problemasDaExplicacao, VERSAO_EXPLICACAO } from '../lib/tutor/pronta';
import type { QuestaoParaTutor } from '../lib/tutor/prompts';

const prisma = new PrismaClient();
// Questões públicas: aqui a Mistral gratuita pode entrar como reserva (lib/ia-modelos.ts).
process.env.IA_RESERVAS_QUE_TREINAM = '1';
const PRAZO_POR_QUESTAO_MS = 120_000;
/* A Groq gratuita dá 8 mil tokens por minuto por modelo e a explicação gasta
   ~6.700: uma pausa entre questões evita queimar as reservas à toa. */
const PAUSA_MS = 20_000;
const COTA_ACABOU_SEGUIDAS = 3;
const ORDEM_DAS_MATERIAS = ['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'História', 'Geografia', 'Sociologia', 'Filosofia', 'Inglês'];

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

function paraTutor(q: Question): QuestaoParaTutor {
  return {
    enunciado: q.enunciado,
    alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
    respostaCorreta: q.respostaCorreta,
    respostaDada: null,
    materia: q.materia,
    subtema: q.subtema,
  };
}

/* Sem pronta da versão atual, sem depender de imagem (a IA não vê a figura). */
async function fila(quantas: number): Promise<Question[]> {
  const semPronta = {
    dependeImagem: false,
    OR: [{ explicacaoPronta: null }, { explicacaoPronta: { versao: { lt: VERSAO_EXPLICACAO } } }],
  };
  const respondidas = await prisma.question.findMany({
    where: { ...semPronta, progress: { some: {} } },
    take: quantas,
  });
  if (respondidas.length >= quantas) return respondidas;
  const resto = await prisma.question.findMany({
    where: { ...semPronta, id: { notIn: respondidas.map((q) => q.id) } },
    take: 400,
  });
  resto.sort((a, b) => ORDEM_DAS_MATERIAS.indexOf(a.materia) - ORDEM_DAS_MATERIAS.indexOf(b.materia));
  return [...respondidas, ...resto].slice(0, quantas);
}

async function main() {
  const quantas = Number(process.argv[2]) || 25;
  const questoes = await fila(quantas);
  console.log(`${questoes.length} questões na fila (versão ${VERSAO_EXPLICACAO})\n`);
  let feitas = 0, comProblema = 0, semCota = 0;

  for (const [i, q] of questoes.entries()) {
    if (i > 0) await esperar(PAUSA_MS);
    const r = await gerarExplicacao(paraTutor(q), PRAZO_POR_QUESTAO_MS);
    if (!r.ok) {
      console.log(`✗ ${q.materia} ${q.id}: ${r.erro} (${r.status})`);
      semCota = r.status === 429 ? semCota + 1 : 0;
      if (semCota >= COTA_ACABOU_SEGUIDAS) { console.log('\nA cota de hoje acabou. Rode de novo amanhã.'); break; }
      continue;
    }
    semCota = 0;
    const problemas = problemasDaExplicacao(r.dado, q.enunciado, q.materia);
    const dados = { versao: VERSAO_EXPLICACAO, conteudo: r.dado as object, revisada: false, problemas: problemas.join('; ') || null };
    await prisma.explicacaoPronta.upsert({ where: { questionId: q.id }, create: { questionId: q.id, ...dados }, update: dados });
    feitas++;
    if (problemas.length) comProblema++;
    console.log(`${problemas.length ? '⚠' : '✓'} ${q.materia} ${q.id}${problemas.length ? `: ${problemas.join('; ')}` : ''}`);
  }
  console.log(`\nFeitas: ${feitas} · com algo para revisar: ${comProblema}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
