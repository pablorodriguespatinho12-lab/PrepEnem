import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import { lousaDoRobo } from '../lib/aula-lousa/do-robo';
import { letrasPelaInicial } from '../lib/aula-lousa/letras';
import { validarLousa } from '../lib/aula-lousa/validar';
import { NIVEL_CUME } from '../lib/provas-grupos';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Prova Cume (26/11/2026): questões REAIS de ITA/IME/Fuvest/Unicamp. O repositório é público,
// então o arquivo das questões fica FORA dele e o enunciado só vai para o banco (atrás do login).
// Só cria ou atualiza questão com id "cume-"; não apaga nada. Sem --gravar só mostra. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-prova-cume.ts <username> <arquivo.json> "Cume · Matemática 1" [--gravar]

const prisma = new PrismaClient();
const PREFIXO = 'cume-';
const MODELO = 'claude-opus-5-5 (escrita na sessão)';

interface QuestaoCume {
  id: string; materia: string; tema: string; origem: string; enunciado: string; resposta: string;
  /* Enunciado com fórmula em LaTeX para a tela da questão; a lousa usa o texto simples. */
  enunciadoTela?: string;
  A: string; B: string; C: string; D: string; E: string;
  explicacao: { passos: { titulo?: unknown; texto?: unknown; visual?: unknown }[] };
}

function montar(q: QuestaoCume) {
  if (!q.id.startsWith(PREFIXO)) throw new Error(`${q.id}: id precisa começar com "${PREFIXO}"`);
  if (!/^[A-E]$/.test(q.resposta)) throw new Error(`${q.id}: resposta inválida`);
  const passos = q.materia === 'Matemática'
    ? letrasPelaInicial(q.explicacao.passos, q.enunciado).passos
    : q.explicacao.passos;
  const r = lousaDoRobo({ enunciado: q.enunciado, alternativas: [q.A, q.B, q.C, q.D, q.E], tema: q.tema, passos });
  if (!r.ok) throw new Error(`${q.id}: sem lousa (${r.motivo})`);
  const aula = validarLousa(r.aula);
  if (!aula || aula.cenas.length !== r.aula.cenas.length) throw new Error(`${q.id}: o porteiro cortou telas`);
  const conteudo = validarExplicacao({ ...q.explicacao, passos, lousa: aula }, q.materia);
  if (!conteudo?.lousa) throw new Error(`${q.id}: explicação recusada`);
  return { q, conteudo };
}

async function gravarQuestao({ q, conteudo }: ReturnType<typeof montar>) {
  const dados = {
    enunciado: q.enunciadoTela ?? q.enunciado,
    alternativaA: q.A, alternativaB: q.B, alternativaC: q.C, alternativaD: q.D, alternativaE: q.E,
    respostaCorreta: q.resposta, materia: q.materia, subtema: q.tema, tema: q.tema,
    dificuldade: 'dificil', nivel: NIVEL_CUME, origem: q.origem,
  };
  await prisma.question.upsert({ where: { id: q.id }, create: { id: q.id, ...dados }, update: dados });
  const explicacao = { versao: VERSAO_EXPLICACAO, conteudo: conteudo as object, revisada: true, problemas: null, modelo: MODELO };
  await prisma.explicacaoPronta.upsert({ where: { questionId: q.id }, create: { questionId: q.id, ...explicacao }, update: explicacao });
}

async function main() {
  const [username, arquivo, nome] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!username || !arquivo || !nome) throw new Error('Uso: <username> <arquivo.json> "<nome da prova>" [--gravar]');
  if (resolve(arquivo).startsWith(process.cwd())) throw new Error('O arquivo de questão real fica fora do repositório.');
  const prontas = (JSON.parse(readFileSync(arquivo, 'utf8')) as QuestaoCume[]).map(montar);
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);
  const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome, arquivada: false }, select: { id: true } });
  console.log(`${nome}: ${prontas.length} questões, ${ja ? 'prova já existe (só atualiza o texto)' : 'prova nova'}`);
  for (const { q, conteudo } of prontas) console.log(`  ${q.id} · ${q.origem} · ${conteudo.lousa!.cenas.length} telas`);
  if (!process.argv.includes('--gravar')) return console.log('Nada gravado (use --gravar).');

  for (const p of prontas) await gravarQuestao(p);
  if (!ja) {
    await prisma.customExam.create({
      data: {
        userId: user.id, nome, nivel: NIVEL_CUME, materias: [...new Set(prontas.map((p) => p.q.materia))],
        totalQuestoes: prontas.length,
        questions: { create: prontas.map((p, ordem) => ({ questionId: p.q.id, ordem })) },
      },
    });
  }
  console.log('Gravado.');
}

main().catch((e) => { console.error(e.message ?? e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
