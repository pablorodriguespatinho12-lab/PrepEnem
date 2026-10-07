export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { promptExplicacao } from '@/lib/tutor/prompts';
import { validarExplicacao } from '@/lib/tutor/validar';
import { pedirJson } from '@/lib/pedir-json';
import { lerQuestao } from '@/lib/tutor/entrada';
import { MODELO_IA } from '@/lib/ia-modelos';

// Explicação visual e em passos de uma questão (components/tutor).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const questao = lerQuestao(await req.json().catch(() => null));
  if (!questao) return NextResponse.json({ error: 'Dados da questão incompletos' }, { status: 400 });

  const r = await pedirJson(promptExplicacao(questao), (bruto) => validarExplicacao(bruto, questao.materia), { maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao(), timeoutMs: 45_000 });
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json({ explicacao: r.dado });
}
