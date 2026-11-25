import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Grava SÓ as questões novas de um arquivo de data/revisao-final/escada (não mexe em prova,
// ao contrário de criar-provas-escada.ts, que esconde as provas feitas à mão). Quem já está
// no banco fica como está. Uso: DB_CONFIRMED=1 npx tsx scripts/gravar-questoes-de-arquivo.ts <arquivo.json> [--gravar]

const prisma = new PrismaClient();
const MODELO = 'claude-sonnet-5-5 (escrita na sessão)';

interface QuestaoEscrita {
  id: string; materia: string; tema: string; nivel: string; enunciado: string; resposta: string;
  A: string; B: string; C: string; D: string; E: string; explicacao: unknown;
}

async function main() {
  const [arquivo] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!arquivo) throw new Error('Uso: <arquivo.json> [--gravar]');
  const questoes = JSON.parse(readFileSync(arquivo, 'utf8')) as QuestaoEscrita[];
  const prontas = questoes.map((q) => {
    const conteudo = validarExplicacao(q.explicacao, q.materia);
    if (!conteudo) throw new Error(`Explicação recusada; nada gravado: ${q.id}`);
    return { q, conteudo };
  });
  const ja = new Set((await prisma.question.findMany({ where: { id: { in: questoes.map((q) => q.id) } }, select: { id: true } })).map((x) => x.id));
  const novas = prontas.filter(({ q }) => !ja.has(q.id));
  console.log(`No arquivo: ${questoes.length} · já no banco: ${ja.size} · novas: ${novas.length}`);
  if (!process.argv.includes('--gravar')) return console.log('Nada gravado (use --gravar).');
  // --atualizar-aula: troca SÓ a explicação das que já estão no banco (com cópia antes). A lousa
  // sai junto; rodar scripts/lousa-do-robo.ts --gravar depois para ela voltar.
  if (process.argv.includes('--atualizar-aula')) {
    const velhas = prontas.filter(({ q }) => ja.has(q.id));
    const antes = await prisma.explicacaoPronta.findMany({ where: { questionId: { in: velhas.map(({ q }) => q.id) } } });
    const copia = `${process.env.HOME}/backups-prepenem/explicacoes-antes-de-arquivo-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    writeFileSync(copia, JSON.stringify(antes));
    await prisma.$transaction(velhas.map(({ q, conteudo }) =>
      prisma.explicacaoPronta.update({ where: { questionId: q.id }, data: { conteudo: conteudo as object, modelo: MODELO } })));
    console.log(`Aulas atualizadas: ${velhas.length} · cópia: ${copia}`);
  }
  await prisma.$transaction(novas.flatMap(({ q, conteudo }) => [
    prisma.question.create({
      data: {
        id: q.id, enunciado: q.enunciado,
        alternativaA: q.A, alternativaB: q.B, alternativaC: q.C, alternativaD: q.D, alternativaE: q.E,
        respostaCorreta: q.resposta, materia: q.materia, subtema: q.tema, tema: q.tema,
        dificuldade: q.nivel, nivel: q.nivel, origem: 'Escada',
      },
    }),
    prisma.explicacaoPronta.create({
      data: { questionId: q.id, versao: VERSAO_EXPLICACAO, conteudo: conteudo as object, revisada: true, modelo: MODELO },
    }),
  ]));
  console.log(`Gravadas: ${novas.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
