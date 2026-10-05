export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TRILHA } from '@/data/calculo/trilha';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
import { lerEstados } from '@/lib/calculo/estados';
import { proximoDegrau, revisoesPendentes, situacao } from '@/lib/calculo/progresso';

// A trilha inteira com a situação de cada degrau para este aluno.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const estados = await lerEstados(userId);
  const degraus = TRILHA.map((d) => {
    const e = estados.get(d.id);
    return {
      ...d,
      situacao: situacao(d, estados),
      escrita: d.id in LICOES_ESCRITAS,
      acertos: e?.acertos ?? 0,
      tentativas: e?.tentativas ?? 0,
    };
  });
  return NextResponse.json({
    degraus,
    proximo: proximoDegrau(TRILHA, estados)?.id ?? null,
    revisoesPendentes: revisoesPendentes(Array.from(estados.values()), new Date()).length,
  });
}
