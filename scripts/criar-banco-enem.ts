import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Grava o banco ENEM do dia 2 (Pablo, 13/11/2026: "umas 20 nível ENEM para cada
// conteúdo, guardadinho no banco"): data/revisao-final/banco-enem/<conteudo>.json.
// Estilo ENEM escrito à mão, com explicação pronta (não gasta a IA do site). Fica
// fora das provas; o Treino já sorteia questões de qualquer origem que não seja IA.
// Cria ou atualiza; não apaga nada. Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-banco-enem.ts [conteudo ...] [--gravar]

const prisma = new PrismaClient();
const PASTA = join(process.cwd(), 'data/revisao-final/banco-enem');
const ORIGEM = 'Banco ENEM do dia 2';
const MODELO = 'claude-opus-5-5 (escrita na sessão)';

type Questao = {
  id: string; materia: string; tema: string; enunciado: string; resposta: string;
  A: string; B: string; C: string; D: string; E: string; explicacao: unknown;
};

async function main() {
  const gravar = process.argv.includes('--gravar');
  if (!existsSync(PASTA)) throw new Error(`Pasta ${PASTA} não existe`);
  // Arquivos pedidos (ex.: dinamica organica): outra leva pode estar escrevendo na pasta.
  const pedidos = process.argv.slice(2).filter((a) => !a.startsWith('--')).map((a) => (a.endsWith('.json') ? a : `${a}.json`));
  const questoes = readdirSync(PASTA)
    .filter((f) => f.endsWith('.json') && (pedidos.length === 0 || pedidos.includes(f)))
    .flatMap((f) => JSON.parse(readFileSync(join(PASTA, f), 'utf8')) as Questao[]);

  const porTema: Record<string, number> = {};
  for (const q of questoes) {
    if (!validarExplicacao(q.explicacao, q.materia)) throw new Error(`${q.id}: explicação recusada; nada gravado`);
    porTema[q.tema] = (porTema[q.tema] ?? 0) + 1;
  }
  console.log(`${questoes.length} questões do banco ENEM:`, porTema);
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
