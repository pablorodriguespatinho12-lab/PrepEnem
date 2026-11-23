export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { escolherRevisao, venceu } from '@/lib/flashcards-revisao';
import { cartoesRespondidos } from '@/lib/flashcards-revisao-servidor';

/* Quantos cartões já estudados venceram hoje, para o botão "Revisão de hoje" do Início.
   `total` = vencidos de verdade; `nestaSessao` = o que a sessão mostra (teto por dia). */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const respondidos = await cartoesRespondidos(userId, new Date());
    return NextResponse.json({
      total: respondidos.filter(venceu).length,
      nestaSessao: escolherRevisao(respondidos).length,
    });
  } catch (error) {
    console.error('Erro ao contar revisão de hoje:', error);
    return NextResponse.json({ error: 'Erro ao contar' }, { status: 500 });
  }
}
