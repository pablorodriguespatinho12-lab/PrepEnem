export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buscarDegrau } from '@/data/calculo/trilha';
import { lerEstados, salvarEstado } from '@/lib/calculo/estados';
import { META_ACERTO, registrarLicao, registrarRevisao } from '@/lib/calculo/progresso';

const MAX_EXERCICIOS = 20;

// Resultado de uma lição ({tipo: 'licao', acertos, total}) ou de uma questão
// de revisão ({tipo: 'revisao', acertou}).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const body = await req.json().catch(() => ({}));
  const licaoId = typeof body?.licaoId === 'string' ? body.licaoId : '';
  if (!buscarDegrau(licaoId)) return NextResponse.json({ error: 'Lição inválida' }, { status: 400 });

  const estados = await lerEstados(userId);
  const atual = estados.get(licaoId);
  const agora = new Date();

  if (body?.tipo === 'revisao') {
    if (!atual || atual.status !== 'concluida') return NextResponse.json({ error: 'Lição ainda não concluída' }, { status: 400 });
    const novo = registrarRevisao(atual, body.acertou === true, agora);
    await salvarEstado(userId, novo);
    return NextResponse.json({ estado: novo });
  }

  const total = Number(body?.total);
  const acertos = Number(body?.acertos);
  if (!Number.isInteger(total) || !Number.isInteger(acertos) || total < 1 || total > MAX_EXERCICIOS || acertos < 0 || acertos > total) {
    return NextResponse.json({ error: 'Resultado inválido' }, { status: 400 });
  }
  const novo = registrarLicao(atual, licaoId, acertos, total, agora);
  await salvarEstado(userId, novo);
  return NextResponse.json({ estado: novo, concluiu: novo.status === 'concluida', meta: META_ACERTO });
}
