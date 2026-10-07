export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buscarDegrau } from '@/data/calculo/trilha';
import { lerEstados } from '@/lib/calculo/estados';
import { situacao } from '@/lib/calculo/progresso';
import { obterLicao } from '@/lib/calculo/repositorio';

// Conteúdo de uma lição. Toda lição abre (sem tranca desde 07/10/2026).
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const degrau = buscarDegrau(params.id);
  if (!degrau) return NextResponse.json({ error: 'Lição não encontrada' }, { status: 404 });
  const estados = await lerEstados(userId);

  const r = await obterLicao(params.id);
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json({ licao: r.dado, situacao: situacao(degrau, estados) });
}
