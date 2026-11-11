import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

const prisma = new PrismaClient();

// Provas do dia 2 (Pablo, 10/11/2026): Fácil, Médio e Difícil escritas à mão
// e uma de questões reais do ENEM, 40 cada, com explicação pronta (sem gastar
// a IA do site). Formato e regras: data/revisao-final/dia-2/LEIA-ME.md; a
// conferência completa é o teste data/revisao-final/provas-dia-2.test.ts.
// Também apaga as 2 provas de revisão do dia 1, a pedido dele; as QUESTÕES
// delas ficam no banco (apagar a prova só leva junto a ligação prova-questão).
// Sem --gravar só mostra o que faria. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-provas-dia-2.ts <username> [--gravar]

const MODELO = 'claude-opus-5-5 (escrita na sessão)';
const ORIGEM = 'Revisão do dia 2';
const PASTA = join(process.cwd(), 'data/revisao-final/dia-2');
const PROVAS_DO_DIA_1 = ['Aquecimento: antes da Revisão final', 'Revisão final: o que mais cai'];
const PROVAS = [
  { nivel: 'facil', nome: 'Dia 2 · 1 Fácil' },
  { nivel: 'medio', nome: 'Dia 2 · 2 Médio' },
  { nivel: 'dificil', nome: 'Dia 2 · 3 Difícil' },
  { nivel: 'enem', nome: 'Dia 2 · 4 ENEM real' },
] as const;
// Natureza antes, como no caderno de verdade (questões 91 a 135, depois 136 a 180).
const AREAS = ['natureza', 'matematica'] as const;
const INICIO_COMPARADO = 40;

interface Questao {
  id: string; materia: string; tema: string; enunciado: string; resposta: string;
  A: string; B: string; C: string; D: string; E: string;
  explicacao: unknown;
}

const lerProva = (nivel: string): Questao[] =>
  AREAS.flatMap((a) => JSON.parse(readFileSync(join(PASTA, `${nivel}-${a}.json`), 'utf8')) as Questao[]);

const normalizar = (t: string) => t.replace(/\s+/g, ' ').trim().slice(0, INICIO_COMPARADO);

/* A real do arquivo tem que ser a mesma do banco: mesmo gabarito e mesmo começo. */
async function conferirReais(reais: Questao[]): Promise<void> {
  const banco = await prisma.question.findMany({
    where: { id: { in: reais.map((q) => q.id) } },
    select: { id: true, respostaCorreta: true, enunciado: true, anoProva: true },
  });
  const erros = reais.flatMap((q) => {
    const b = banco.find((x) => x.id === q.id);
    if (!b) return [`${q.id}: não está no banco`];
    if (b.anoProva == null) return [`${q.id}: não é questão real`];
    if (b.respostaCorreta !== q.resposta) return [`${q.id}: gabarito ${b.respostaCorreta} no banco, ${q.resposta} no arquivo`];
    if (normalizar(b.enunciado) !== normalizar(q.enunciado)) return [`${q.id}: enunciado diferente do banco`];
    return [];
  });
  if (erros.length > 0) throw new Error(`Reais com problema; nada gravado:\n${erros.join('\n')}`);
}

const dadosDaQuestao = (q: Questao, nivel: string) => ({
  enunciado: q.enunciado,
  alternativaA: q.A, alternativaB: q.B, alternativaC: q.C, alternativaD: q.D, alternativaE: q.E,
  respostaCorreta: q.resposta,
  materia: q.materia, subtema: q.tema, tema: q.tema,
  dificuldade: nivel, nivel, origem: ORIGEM,
});

async function gravarQuestoes(questoes: Questao[], nivel: string): Promise<void> {
  for (const q of questoes) {
    if (nivel !== 'enem') {
      const dados = dadosDaQuestao(q, nivel);
      await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...dados }, update: dados });
    }
    const conteudo = validarExplicacao(q.explicacao, q.materia);
    if (!conteudo) throw new Error(`${q.id}: explicação recusada pelo validador`);
    const explicacao = { versao: VERSAO_EXPLICACAO, conteudo: conteudo as object, revisada: true, problemas: null, modelo: MODELO };
    await prisma.explicacaoPronta.upsert({ where: { questionId: q.id }, create: { questionId: q.id, ...explicacao }, update: explicacao });
  }
}

async function main() {
  const [username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);

  const provas = PROVAS.map((p) => ({ ...p, questoes: lerProva(p.nivel) }));
  provas.forEach((p) => console.log(`${p.nome}: ${p.questoes.length} questões`));
  await conferirReais(provas.find((p) => p.nivel === 'enem')!.questoes);
  console.log('Reais conferidas com o banco (gabarito e começo do enunciado).');

  const velhas = await prisma.customExam.findMany({
    where: { userId: user.id, nome: { in: PROVAS_DO_DIA_1 } },
    select: { id: true, nome: true, status: true, acertos: true, erros: true },
  });
  velhas.forEach((v) => console.log(`Apagar: "${v.nome}" (${v.status}, ${v.acertos} acertos, ${v.erros} erros)`));
  if (!gravar) return console.log('Nada gravado (use --gravar).');

  await prisma.customExam.deleteMany({ where: { id: { in: velhas.map((v) => v.id) } } });
  console.log(`${velhas.length} prova(s) do dia 1 apagada(s); as questões continuam no banco.`);

  for (const p of provas) {
    await gravarQuestoes(p.questoes, p.nivel);
    const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome: p.nome, status: 'pendente' } });
    if (ja) {
      console.log(`${p.nome}: questões atualizadas; a prova já existia (não começada).`);
      continue;
    }
    const ids = p.questoes.map((q) => q.id);
    await prisma.customExam.create({
      data: {
        userId: user.id, nome: p.nome, nivel: p.nivel,
        materias: Array.from(new Set(p.questoes.map((q) => q.materia))),
        totalQuestoes: ids.length,
        questions: { create: ids.map((questionId, ordem) => ({ questionId, ordem })) },
      },
    });
    console.log(`${p.nome}: criada com ${ids.length} questões.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
