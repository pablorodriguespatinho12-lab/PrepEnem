import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO, problemasDaExplicacao } from '../lib/tutor/pronta';

const prisma = new PrismaClient();

// Aquecimento antes da prova "Revisão final" (Pablo, 04/11/2026: "como na
// piscina, primeiro aquecer o corpo"). 31 questões fáceis em
// data/revisao-final/aquecimento.json, cada uma com o conceito que uma ou mais
// das 60 reais exige ("prepara" = posição na prova). Escritas pelo Claude da
// sessão, não são reais (nível Fácil). Grava as questões com id fixo e a
// explicação pronta (sem gastar a IA do site), e cria a prova para o usuário.
// Sem --gravar só confere. Uso:
//   npx tsx scripts/criar-aquecimento-revisao-final.ts <username> [--gravar]

const MODELO = 'claude-opus-5-5 (escrita na sessão)';
const ORIGEM = 'Aquecimento da Revisão final';
const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;

interface QuestaoAquecimento {
  id: string;
  materia: string;
  tema: string;
  enunciado: string;
  A: string; B: string; C: string; D: string; E: string;
  resposta: string;
  explicacao: unknown;
}
interface Arquivo { nome: string; questoes: QuestaoAquecimento[] }

function conferir(q: QuestaoAquecimento): string[] {
  const erros: string[] = [];
  if (!LETRAS.includes(q.resposta as (typeof LETRAS)[number])) erros.push(`resposta inválida: ${q.resposta}`);
  if (new Set(LETRAS.map((l) => q[l].trim())).size !== LETRAS.length) erros.push('alternativas repetidas');
  const valida = validarExplicacao(q.explicacao, q.materia);
  if (!valida) return [...erros, 'o validador recusou a explicação'];
  const passosAntes = (q.explicacao as { passos?: unknown[] }).passos?.length ?? 0;
  if (valida.passos.length < passosAntes) erros.push(`o validador cortou ${passosAntes - valida.passos.length} passo(s)`);
  const certa = (q.explicacao as { checagem?: { certa?: string; opcoes?: string[] } }).checagem;
  if (certa && !certa.opcoes?.includes(certa.certa ?? '')) erros.push('"Sua vez" com a certa fora das opções');
  return [...erros, ...problemasDaExplicacao(valida, q.enunciado, q.materia)];
}

async function main() {
  const [username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  if (!username) throw new Error('Uso: npx tsx scripts/criar-aquecimento-revisao-final.ts <username> [--gravar]');
  const prova: Arquivo = JSON.parse(readFileSync(join(process.cwd(), 'data/revisao-final/aquecimento.json'), 'utf8'));

  const ruins = prova.questoes.map((q) => [q.id, conferir(q)] as const).filter(([, e]) => e.length > 0);
  ruins.forEach(([id, e]) => console.log(`✗ ${id}: ${e.join('; ')}`));
  if (ruins.length > 0) throw new Error(`${ruins.length} questão(ões) com problema; nada gravado.`);
  console.log(`${prova.questoes.length} questões conferidas.`);

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);
  if (!gravar) return console.log('Nada gravado (use --gravar).');

  for (const q of prova.questoes) {
    const dados = {
      enunciado: q.enunciado,
      alternativaA: q.A, alternativaB: q.B, alternativaC: q.C, alternativaD: q.D, alternativaE: q.E,
      respostaCorreta: q.resposta,
      materia: q.materia,
      subtema: q.tema,
      tema: q.tema,
      dificuldade: 'facil',
      nivel: 'facil',
      origem: ORIGEM,
    };
    await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...dados }, update: dados });
    const explicacao = { versao: VERSAO_EXPLICACAO, conteudo: validarExplicacao(q.explicacao, q.materia) as object, revisada: true, problemas: null, modelo: MODELO };
    await prisma.explicacaoPronta.upsert({ where: { questionId: q.id }, create: { questionId: q.id, ...explicacao }, update: explicacao });
  }
  console.log(`${prova.questoes.length} questões e explicações gravadas.`);

  const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome: prova.nome, status: 'pendente' } });
  if (ja) return console.log(`Prova já existe (não começada): ${ja.id}`);
  const ids = prova.questoes.map((q) => q.id);
  const exam = await prisma.customExam.create({
    data: {
      userId: user.id,
      nome: prova.nome,
      nivel: 'facil',
      materias: Array.from(new Set(prova.questoes.map((q) => q.materia))),
      totalQuestoes: ids.length,
      questions: { create: ids.map((questionId, ordem) => ({ questionId, ordem })) },
    },
  });
  console.log(`Prova criada: ${exam.id} (${ids.length} questões)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
