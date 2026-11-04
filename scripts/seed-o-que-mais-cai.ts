import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { CARTOES_O_QUE_MAIS_CAI, type CartaoRevisao } from './data/flashcards-o-que-mais-cai';

const prisma = new PrismaClient();

// Baralho "O que mais cai", um por matéria (Pablo, 03/11/2026). Cartões em
// scripts/data/flashcards-o-que-mais-cai.ts, na ordem do ranking de
// data/revisao-final/o-que-mais-cai.json (o tema que mais cai primeiro).
// Só cria ou atualiza os próprios decks, pela ordem, sem perder o progresso
// de cada cartão; não toca em outros. Rodar de novo quando os cartões mudarem.
const NOME = 'O que mais cai';
const SUBTEMA = 'O que mais cai no ENEM';

interface TemaRanking { materia: string; tema: string; pct: number }
interface Ranking { areas: Record<string, { temas: TemaRanking[] }> }

function posicoes(): Map<string, number> {
  const ranking: Ranking = JSON.parse(readFileSync(join(process.cwd(), 'data/revisao-final/o-que-mais-cai.json'), 'utf8'));
  const mapa = new Map<string, number>();
  for (const area of Object.values(ranking.areas)) {
    area.temas.forEach((t, i) => mapa.set(`${t.materia}|${t.tema}`, i));
  }
  return mapa;
}

function porMateria(): Map<string, CartaoRevisao[]> {
  const pos = posicoes();
  const semRanking = CARTOES_O_QUE_MAIS_CAI.filter((c) => !pos.has(c.tema)).map((c) => c.tema);
  if (semRanking.length > 0) throw new Error(`Tema sem ranking: ${Array.from(new Set(semRanking)).join(', ')}`);
  const grupos = new Map<string, CartaoRevisao[]>();
  for (const c of CARTOES_O_QUE_MAIS_CAI) grupos.set(c.materia, [...(grupos.get(c.materia) ?? []), c]);
  // sort é estável: dentro do mesmo tema, fica a ordem do arquivo.
  return new Map(Array.from(grupos, ([m, cs]) => [m, [...cs].sort((a, b) => pos.get(a.tema)! - pos.get(b.tema)!)]));
}

async function gravar(materia: string, cartoes: CartaoRevisao[]) {
  const temas = new Set(cartoes.map((c) => c.tema)).size;
  const descricao = `Os ${temas} temas de ${materia} que mais caíram no ENEM de 2009 a 2023, do mais cobrado para o menos. Um fato por cartão.`;
  const dados = cartoes.map((c) => ({ frente: c.frente, verso: c.verso, dica: c.dica ?? null }));
  const existente = await prisma.flashcardDeck.findFirst({
    where: { nome: NOME, materia, isDefault: true },
    include: { cards: true },
  });
  if (!existente) {
    await prisma.flashcardDeck.create({
      data: { nome: NOME, materia, subtema: SUBTEMA, descricao, isDefault: true, cards: { create: dados.map((c, ordem) => ({ ...c, ordem })) } },
    });
    console.log(`Criado: ${materia} (${dados.length} cartões)`);
    return;
  }
  await prisma.flashcardDeck.update({ where: { id: existente.id }, data: { subtema: SUBTEMA, descricao } });
  for (const [ordem, c] of dados.entries()) {
    const card = existente.cards.find((x) => x.ordem === ordem);
    if (card) await prisma.flashcard.update({ where: { id: card.id }, data: c });
    else await prisma.flashcard.create({ data: { ...c, ordem, deckId: existente.id } });
  }
  const sobrando = existente.cards.filter((x) => x.ordem >= dados.length).map((x) => x.id);
  if (sobrando.length > 0) await prisma.flashcard.deleteMany({ where: { id: { in: sobrando }, deckId: existente.id } });
  console.log(`Atualizado: ${materia} (${dados.length} cartões${sobrando.length ? `, ${sobrando.length} removidos` : ''})`);
}

async function main() {
  const grupos = porMateria();
  if (process.argv.includes('--conferir')) {
    for (const [m, cs] of grupos) console.log(m, cs.length, '·', cs[0].frente);
    return;
  }
  for (const [materia, cartoes] of grupos) await gravar(materia, cartoes);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
