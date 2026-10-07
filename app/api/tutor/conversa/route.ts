export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { promptConversa, type ContextoAluno } from '@/lib/tutor/prompts';
import { prisma } from '@/lib/db';
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

  const aluno = await contextoDoAluno((session.user as { id?: string }).id, body?.questionId, questao.subtema);
  const r = await pedirJson(promptConversa(questao, resumo, historico, aluno), validarRespostaTutor, {
    maxTokens: 1600,
    temperature: 0.5,
    modelo: MODELO_IA.conversa(),
    pensar: 'medium',
  });
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json(r.dado);
}

const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

/* Erros recentes no assunto e a explicação Feynman que ele escreveu nesta
   questão. Falhar aqui não impede a resposta: o tutor só fica sem contexto. */
async function contextoDoAluno(userId: string | undefined, questionId: unknown, subtema: string | null | undefined): Promise<ContextoAluno | undefined> {
  if (!userId) return undefined;
  try {
    const [errosNoAssunto, feynman] = await Promise.all([
      subtema
        ? prisma.userProgress.count({ where: { userId, acertou: false, dataResposta: { gte: new Date(Date.now() - TRINTA_DIAS_MS) }, question: { subtema } } })
        : Promise.resolve(0),
      typeof questionId === 'string'
        ? prisma.userProgress.findFirst({ where: { userId, questionId, explicacaoEstudante: { not: null } }, orderBy: { dataResposta: 'desc' }, select: { explicacaoEstudante: true } })
        : Promise.resolve(null),
    ]);
    return { errosNoAssunto, suasPalavras: feynman?.explicacaoEstudante ?? null };
  } catch (e) {
    console.error('Tutor: contexto do aluno indisponível', e);
    return undefined;
  }
}
