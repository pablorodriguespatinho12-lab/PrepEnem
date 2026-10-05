export const dynamic = 'force-dynamic';
export const maxDuration = 120;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pedirJson } from '@/lib/pedir-json';
import { promptRedacaoCompleta } from '@/lib/redacao/prompts';
import { corrigirRedacao, type CorrecaoCompleta } from '@/lib/redacao/correcao';
import { MINIMO_LINHAS, linhasAproximadas } from '@/lib/redacao/grade';

/* Até 7 linhas é nota zero pela regra do INEP: não precisa da IA para isso. */
function correcaoNotaZeroPorTamanho(): CorrecaoCompleta {
  return {
    versao: 2,
    notas: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 },
    total: 0,
    travas: [`Texto com até ${MINIMO_LINHAS - 1} linhas recebe nota zero no ENEM. Escreva pelo menos ${MINIMO_LINHAS} linhas; o ideal é entre 20 e 30.`],
    c1: { estrutura: 'inexistente', desvios: [] },
    c2: { abordagem: 'completa', partesEmbrionarias: 3, copiaMotivadores: false, repertorios: [] },
    c3: { paragrafos: [], contradicaoGrave: false },
    c4: { operadoresEntreParagrafos: [], inadequacoes: [], repeticoes: [] },
    c5: {
      agente: { trecho: null, valido: false }, acao: { trecho: null, valido: false }, modo: { trecho: null, valido: false },
      efeito: { trecho: null, valido: false }, detalhamento: { trecho: null, valido: false }, desrespeitaDH: false, condicional: false,
    },
    proximoPasso: {},
    reescritas: [],
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const userId = (session.user as { id: string }).id;

    const { essayId } = await req.json().catch(() => ({}));
    if (typeof essayId !== 'string') return NextResponse.json({ error: 'essayId obrigatório' }, { status: 400 });

    const essay = await prisma.essay.findUnique({ where: { id: essayId }, include: { theme: true } });
    if (!essay) return NextResponse.json({ error: 'Redação não encontrada' }, { status: 404 });
    if (essay.userId !== userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });

    await prisma.essay.update({ where: { id: essayId }, data: { status: 'avaliando' } });

    let correcao: CorrecaoCompleta;
    if (linhasAproximadas(essay.texto) < MINIMO_LINHAS) {
      correcao = correcaoNotaZeroPorTamanho();
    } else {
      const r = await pedirJson(
        promptRedacaoCompleta(essay.theme.tema, essay.theme.textoMotivador, essay.texto),
        (bruto) => corrigirRedacao(bruto, essay.texto),
        { maxTokens: 6000, temperature: 0.2 },
      );
      if (!r.ok) {
        await prisma.essay.update({ where: { id: essayId }, data: { status: 'pendente' } });
        return NextResponse.json({ error: r.erro }, { status: r.status });
      }
      correcao = r.dado;
    }

    await prisma.essay.update({
      where: { id: essayId },
      data: {
        status: 'avaliada',
        notaC1: correcao.notas.c1, notaC2: correcao.notas.c2, notaC3: correcao.notas.c3,
        notaC4: correcao.notas.c4, notaC5: correcao.notas.c5,
        notaTotal: correcao.total,
        avaliacao: JSON.stringify(correcao),
      },
    });
    return NextResponse.json({ success: true, notaTotal: correcao.total });
  } catch (error: unknown) {
    console.error('Evaluate error:', error);
    return NextResponse.json({ error: 'Erro ao avaliar redação' }, { status: 500 });
  }
}
