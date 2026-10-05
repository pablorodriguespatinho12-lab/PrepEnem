export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { promptConversa } from '@/lib/tutor/prompts';
import { validarRespostaTutor } from '@/lib/tutor/validar';
import { pedirJson } from '@/lib/pedir-json';
import { lerHistorico, lerQuestao } from '@/lib/tutor/entrada';
import { MODELO_IA } from '@/lib/ia-modelos';

// Dúvida depois da explicação: o aluno pergunta, o tutor responde um passo
// por vez. O histórico vem do navegador (a conversa não é salva no banco).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const questao = lerQuestao(body?.questao);
  const historico = lerHistorico(body?.historico);
  const resumo = typeof body?.resumoExplicacao === 'string' ? body.resumoExplicacao : '';
  if (!questao || historico.length === 0 || historico[historico.length - 1].papel !== 'aluno') {
    return NextResponse.json({ error: 'Conversa inválida' }, { status: 400 });
  }

  const r = await pedirJson(promptConversa(questao, resumo, historico), validarRespostaTutor, {
    maxTokens: 1600,
    temperature: 0.5,
    modelo: MODELO_IA.conversa(),
    pensar: 'medium',
  });
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json(r.dado);
}
