import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { ETAPAS, etapaDaProva, type EtapaDaProva } from '../lib/prova-da-escada';

// Pablo, 22/11/2026: depois do ENEM "voltou para difícil, era para ser um nível a mais". Junção agora vem ANTES do
// ENEM (lib/prova-da-escada.ts) e o ITA é o último degrau. As provas já criadas guardam a ordem antiga; este script
// remonta SÓ a ordem (campo `ordem`), nunca troca questão. Prova sem resposta: ordem nova inteira. Prova com resposta:
// o que já foi respondido não se mexe; o que falta responder fica na ordem nova, mas o nível acima vai ANTES da junção
// (quem já passou do ENEM não pode ver "Junção" como próximo degrau).
// Uso: DB_CONFIRMED=1 npx tsx scripts/reordenar-escada.ts            (simula)
//      DB_CONFIRMED=1 npx tsx scripts/reordenar-escada.ts --gravar   (grava, com cópia)

const prisma = new PrismaClient();
const NOME_DE_ESCADA = /^(Matemática|Física) [0-9] · /;
const DEPOIS_DO_ENEM: EtapaDaProva[] = ['ita', 'juncao'];

type Linha = { id: string; questionId: string; ordem: number; answered: boolean; etapa: EtapaDaProva | null };

/** Ordem nova das linhas de uma prova. */
export function novaOrdem(linhas: Linha[]): Linha[] {
  const rank = (e: EtapaDaProva | null, depoisDoEnem: boolean): number => {
    if (e === null) return 99;
    if (depoisDoEnem && DEPOIS_DO_ENEM.includes(e)) return ETAPAS.length + DEPOIS_DO_ENEM.indexOf(e);
    return ETAPAS.indexOf(e);
  };
  const respondidas = linhas.filter((l) => l.answered).sort((a, b) => a.ordem - b.ordem);
  const faltam = linhas.filter((l) => !l.answered);
  const jaPassouDoEnem = respondidas.some((l) => l.etapa === 'enem');
  const ordenadas = [...faltam].sort((a, b) => rank(a.etapa, jaPassouDoEnem) - rank(b.etapa, jaPassouDoEnem) || a.ordem - b.ordem);
  return [...respondidas, ...ordenadas];
}

async function main() {
  const gravar = process.argv.includes('--gravar');
  const todas = await prisma.customExam.findMany({ where: { arquivada: false }, select: { id: true, nome: true } });
  const alvo = todas.filter((e) => NOME_DE_ESCADA.test(e.nome));
  const copia: Record<string, { questionId: string; ordem: number }[]> = {};
  const mudancas: { exam: string; nome: string; linhas: Linha[]; base: number; antes: string; depois: string }[] = [];

  for (const e of alvo) {
    const cqs = await prisma.customExamQuestion.findMany({ where: { examId: e.id }, include: { question: { select: { nivel: true, anoProva: true, origem: true, materia: true, tema: true } } }, orderBy: { ordem: 'asc' } });
    const linhas: Linha[] = cqs.map((c) => ({
      id: c.id, questionId: c.questionId, ordem: c.ordem, answered: c.answered,
      etapa: etapaDaProva({ id: c.questionId, materia: c.question.materia, tema: c.question.tema, nivel: c.question.nivel, anoProva: c.question.anoProva, origem: c.question.origem }),
    }));
    const nova = novaOrdem(linhas);
    const letra = (l: Linha) => (l.etapa ?? '?').slice(0, 3);
    const antes = linhas.map(letra).join(' ');
    const depois = nova.map(letra).join(' ');
    copia[e.id] = linhas.map((l) => ({ questionId: l.questionId, ordem: l.ordem }));
    if (antes !== depois) mudancas.push({ exam: e.id, nome: e.nome, linhas: nova, base: Math.min(...linhas.map((l) => l.ordem)), antes, depois });
    console.log(`${e.nome}\n   antes : ${antes}\n   depois: ${depois}${antes === depois ? '   (igual)' : ''}`);
  }
  console.log(`\n${mudancas.length} de ${alvo.length} provas mudam.`);
  if (!gravar) { console.log('Simulação: nada gravado.'); return; }

  const arquivo = `${process.env.HOME}/backups-prepenem/ordem-escada-antes-${new Date().toISOString().slice(0, 16).replace(':', 'h')}.json`;
  writeFileSync(arquivo, JSON.stringify(copia));
  console.log(`Cópia: ${arquivo}`);
  for (const m of mudancas) {
    // 2 passos: a ordem pode ter índice único por prova; primeiro afasta, depois põe.
    await prisma.$transaction([
      ...m.linhas.map((l, i) => prisma.customExamQuestion.update({ where: { id: l.id }, data: { ordem: 1000 + m.base + i } })),
      ...m.linhas.map((l, i) => prisma.customExamQuestion.update({ where: { id: l.id }, data: { ordem: m.base + i } })),
    ]);
    console.log(`gravada: ${m.nome}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
