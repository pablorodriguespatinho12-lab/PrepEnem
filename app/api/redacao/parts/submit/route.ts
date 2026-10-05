export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pedirJson } from '@/lib/pedir-json';
import { promptParte } from '@/lib/redacao/prompts';
import { corrigirParte } from '@/lib/redacao/correcao';
import { MODELOS, ORDEM_PARTES, textoBaseSemParte, type TipoParte } from '@/data/redacao/modelos';

const MAX_RESPOSTA = 4000;
const MIN_RESPOSTA = 80;

/* Corrige a parte escrita pelo aluno pelos itens fixos da parte e devolve,
   junto, a mesma parte da redação-modelo comentada, para comparar. */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const userId = (session.user as { id: string }).id;

    const body = await request.json().catch(() => ({}));
    const partType = body?.partType as TipoParte;
    const resposta = typeof body?.resposta === 'string' ? body.resposta.trim().slice(0, MAX_RESPOSTA) : '';
    const modelo = MODELOS.find((m) => m.id === body?.modeloId);
    if (!ORDEM_PARTES.includes(partType) || !modelo) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    if (resposta.length < MIN_RESPOSTA) {
      return NextResponse.json({ error: 'Escreva pelo menos duas ou três frases antes de enviar.' }, { status: 400 });
    }

    const textoBase = textoBaseSemParte(modelo, partType);
    const r = await pedirJson(promptParte(partType, modelo.tema, textoBase, resposta), (b) => corrigirParte(b, partType), {
      maxTokens: 3000,
      temperature: 0.2,
    });
    if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });

    const practice = await prisma.essayPartPractice.create({
      data: {
        userId,
        partType,
        tema: modelo.tema,
        textoBase,
        resposta,
        feedback: JSON.stringify(r.dado),
        nota: r.dado.nota,
      },
    });

    return NextResponse.json({ id: practice.id, correcao: r.dado, modelo: modelo.partes[partType] });
  } catch (error: unknown) {
    console.error('Submit essay part error:', error);
    return NextResponse.json({ error: 'Erro ao avaliar' }, { status: 500 });
  }
}
