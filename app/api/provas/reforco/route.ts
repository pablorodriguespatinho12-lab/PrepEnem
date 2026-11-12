export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validarVisual } from '@/lib/visual/especificacao';

/* Questão de reforço (Pablo, 12/11/2026): errou na prova, a próxima é uma
   parecida do mesmo conteúdo, guardada para isso (origem "Reforço do dia 2",
   data/revisao-final/dia-2/reforco-*.json). Pula as que ele já viu (?usadas=)
   e, se todas já foram, recomeça. Manda junto a figura em pixel do 1º passo
   da explicação, para a tela da questão (sem a conta). */

const ORIGEM_REFORCO = 'Reforço do dia 2';
const MAX_USADAS = 200;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const url = new URL(request.url);
  const tema = url.searchParams.get('tema')?.trim();
  if (!tema) return NextResponse.json({ error: 'Falta o tema' }, { status: 400 });
  const usadas = (url.searchParams.get('usadas') ?? '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, MAX_USADAS);

  try {
    const doTema = await prisma.question.findMany({
      where: { origem: ORIGEM_REFORCO, tema },
      orderBy: { id: 'asc' },
    });
    if (doTema.length === 0) return NextResponse.json({ questao: null });
    const questao = doTema.find((q) => !usadas.includes(q.id)) ?? doTema[0];

    const pronta = await prisma.explicacaoPronta.findUnique({ where: { questionId: questao.id }, select: { conteudo: true } });
    const primeiro = (pronta?.conteudo as { passos?: { visual?: unknown }[] } | null)?.passos?.[0]?.visual;
    const visual = validarVisual(primeiro);
    const figura = visual?.tipo === 'figura' ? { nome: visual.nome, rotulos: visual.rotulos } : null;

    return NextResponse.json({ questao, figura });
  } catch (erro) {
    console.error('[reforco] falhou:', erro instanceof Error ? erro.message : erro);
    return NextResponse.json({ questao: null });
  }
}
