export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MODELOS, ORDEM_PARTES, ROTULO_PARTE, textoBaseSemParte, type TipoParte } from '@/data/redacao/modelos';
import { CRITERIOS_PARTE } from '@/lib/redacao/criterios-parte';

const INSTRUCAO: Record<TipoParte, string> = {
  introducao: 'Escreva a INTRODUÇÃO: repertório como ponto de partida, ligação com o Brasil usando os termos do tema, tese e anúncio dos dois argumentos que já estão desenvolvidos abaixo. De 5 a 7 linhas.',
  desenvolvimento1: 'Escreva o DESENVOLVIMENTO 1: operador, tópico frasal que retome o PRIMEIRO argumento anunciado na introdução, repertório que o sustente, análise e fecho. De 7 a 10 linhas.',
  desenvolvimento2: 'Escreva o DESENVOLVIMENTO 2: operador, tópico frasal que retome o SEGUNDO argumento anunciado na introdução, repertório, análise e fecho. De 7 a 10 linhas.',
  conclusao: 'Escreva a CONCLUSÃO: retome a tese e proponha uma intervenção com os 5 elementos (agente, ação, modo/meio, efeito e detalhamento), respondendo às causas discutidas. De 5 a 7 linhas.',
};

/* Exercício do treino por partes: uma redação-modelo com a parte pedida
   retirada. Prefere um tema que o aluno ainda não treinou nessa parte. */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const userId = (session.user as { id: string }).id;

    const body = await request.json().catch(() => ({}));
    const partType = body?.partType as TipoParte;
    if (!ORDEM_PARTES.includes(partType)) return NextResponse.json({ error: 'Tipo de parte inválido' }, { status: 400 });

    const feitos = new Set((await prisma.essayPartPractice.findMany({
      where: { userId, partType }, select: { tema: true },
    })).map((p) => p.tema));
    const pedido = typeof body?.modeloId === 'string' ? MODELOS.find((m) => m.id === body.modeloId) : undefined;
    const novos = MODELOS.filter((m) => !feitos.has(m.tema));
    const opcoes = novos.length > 0 ? novos : MODELOS;
    const modelo = pedido ?? opcoes[Math.floor(Math.random() * opcoes.length)];

    return NextResponse.json({
      modeloId: modelo.id,
      tema: modelo.tema,
      textosMotivadores: modelo.contexto,
      textoBase: textoBaseSemParte(modelo, partType),
      instrucao: INSTRUCAO[partType],
      criterios: CRITERIOS_PARTE[partType],
      partType,
      partLabel: ROTULO_PARTE[partType],
      jaTreinouTodos: novos.length === 0,
    });
  } catch (error: unknown) {
    console.error('Generate part error:', error);
    return NextResponse.json({ error: 'Erro ao montar o exercício' }, { status: 500 });
  }
}
