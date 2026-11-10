import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { PrismaClient } from '@prisma/client';

// Baralho "Dia 2: o que mais cai", um por matéria (Pablo, 09/11/2026): os mesmos
// 110 cartões da página docs/revisao-final/revisao-dia-2.html, 5 por conteúdo.
// Fonte única: docs/revisao-final/dia-2/*.js (o teste data/revisao-final/
// cartoes-dia-2.test.ts confere a forma).
//
// É um baralho NOVO de propósito: o seed de "O que mais cai" casa cartão por
// posição, então pôr estes lá dentro passaria o progresso antigo para outro texto.
// Aqui só se cria ou atualiza o próprio baralho; nada de outro é tocado.
//
// Uso (Neon = produção):
//   DB_CONFIRMED=1 npx tsx --env-file=.env scripts/seed-dia-2.ts --conferir   só mostra
//   DB_CONFIRMED=1 npx tsx --env-file=.env scripts/seed-dia-2.ts              grava
const NOME = 'Dia 2: o que mais cai';
const SUBTEMA = 'Revisão do 2º dia do ENEM';
const PASTA = join(process.cwd(), 'docs/revisao-final/dia-2');

interface Cartao { f: string; v: string }
interface Conteudo { m: string; t: string }
interface CartaoDoBanco { frente: string; verso: string; dica: null }

function carregar(): Map<string, CartaoDoBanco[]> {
  const janela: { DIA2?: Conteudo[]; DIA2_CARTOES?: Record<string, Cartao[]> } = {};
  for (const arquivo of ['matematica', 'biologia', 'quimica', 'fisica', 'cartoes']) {
    runInNewContext(readFileSync(join(PASTA, `${arquivo}.js`), 'utf8'), { window: janela });
  }
  const conteudos = janela.DIA2 ?? [];
  const cartoes = janela.DIA2_CARTOES ?? {};
  const semCartao = conteudos.filter((c) => !cartoes[c.t]?.length).map((c) => c.t);
  if (semCartao.length > 0) throw new Error(`Conteúdo sem cartão: ${semCartao.join(', ')}`);
  // Ordem do baralho = ordem dos conteúdos na página (o que mais cai primeiro).
  const grupos = new Map<string, CartaoDoBanco[]>();
  for (const c of conteudos) {
    const doConteudo = cartoes[c.t].map((x) => ({ frente: x.f, verso: x.v, dica: null }));
    grupos.set(c.m, [...(grupos.get(c.m) ?? []), ...doConteudo]);
  }
  return grupos;
}

async function gravar(prisma: PrismaClient, materia: string, dados: CartaoDoBanco[]): Promise<void> {
  const descricao = `Os conteúdos de ${materia} que mais caem no 2º dia do ENEM, 5 cartões por conteúdo. Um fato por cartão.`;
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

async function main(): Promise<void> {
  const grupos = carregar();
  if (process.argv.includes('--conferir')) {
    for (const [materia, cartoes] of grupos) console.log(materia, cartoes.length, '·', cartoes[0].frente);
    console.log('Nada gravado. Rode sem --conferir para gravar.');
    return;
  }
  const prisma = new PrismaClient();
  try {
    for (const [materia, cartoes] of grupos) await gravar(prisma, materia, cartoes);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
