export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pedirJson } from '@/lib/pedir-json';
import { promptResumo, validarResumos } from '@/lib/tutor/resumo';

// Resumo de revisão dos assuntos do dia, antes das questões.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const brutos: unknown[] = Array.isArray(body?.subtemas) ? body.subtemas : [];
  const assuntos = Array.from(new Map(
    brutos
      .map((s) => (s && typeof s === 'object' ? (s as Record<string, unknown>) : {}))
      .filter((s) => typeof s.materia === 'string' && typeof s.subtema === 'string')
      .map((s) => [`${s.materia}::${s.subtema}`, { materia: String(s.materia).slice(0, 40), subtema: String(s.subtema).slice(0, 120) }]),
  ).values());
  if (assuntos.length === 0) return NextResponse.json({ error: 'Subtemas não informados' }, { status: 400 });

  const r = await pedirJson(promptResumo(assuntos), validarResumos, { maxTokens: 6000, temperature: 0.3 });
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json({ resumos: r.dado });
}
