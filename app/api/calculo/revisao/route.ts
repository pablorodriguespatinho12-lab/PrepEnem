export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { lerEstados } from '@/lib/calculo/estados';
import { revisoesPendentes } from '@/lib/calculo/progresso';
import { obterLicao } from '@/lib/calculo/repositorio';
import type { Exercicio } from '@/lib/calculo/tipos';

const MAX_QUESTOES = 6;

// Revisão espaçada: um exercício de cada lição vencida, misturados
// (intercalar tipos de problema ensina a escolher a estratégia; Rohrer 2020).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const estados = await lerEstados(userId);
  const ids = revisoesPendentes(Array.from(estados.values()), new Date()).slice(0, MAX_QUESTOES);
  const questoes: { licaoId: string; titulo: string; exercicio: Exercicio }[] = [];
  for (const id of ids) {
    const r = await obterLicao(id);
    if (!r.ok) continue;
    const exercicios = r.dado.conteudo.exercicios;
    const exercicio = exercicios[Math.floor(Math.random() * exercicios.length)];
    questoes.push({ licaoId: id, titulo: r.dado.titulo, exercicio });
  }
  return NextResponse.json({ questoes });
}
