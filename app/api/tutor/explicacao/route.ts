export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { comCache } from '@/lib/cache-ia';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { promptExplicacao } from '@/lib/tutor/prompts';
import { validarExplicacao } from '@/lib/tutor/validar';
import { gerarExplicacao } from '@/lib/tutor/gerar';
import { VERSAO_EXPLICACAO } from '@/lib/tutor/pronta';
import { lerQuestao } from '@/lib/tutor/entrada';

const PRAZO_TOTAL_MS = 55_000;

// Explicação visual e em passos de uma questão (components/tutor).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const corpo = await req.json().catch(() => null);
  const questao = lerQuestao(corpo);
  if (!questao) return NextResponse.json({ error: 'Dados da questão incompletos' }, { status: 400 });

  // Questão do banco com explicação pronta: sai na hora. O "onde você desviou"
  // o navegador pede à parte (api/tutor/seu-erro), se ele errou.
  const questionId = typeof corpo?.questionId === 'string' ? corpo.questionId : null;
  if (questionId) {
    const pronta = await prisma.explicacaoPronta.findUnique({ where: { questionId } }).catch(() => null);
    const valida = pronta?.versao === VERSAO_EXPLICACAO ? validarExplicacao(pronta.conteudo, questao.materia) : null;
    if (valida) return NextResponse.json({ explicacao: { ...valida, seuErro: null }, pronta: true });
  }
  // A aula antes de responder ("Não sei isso") só usa a pronta: nunca gasta a IA.
  if (corpo?.soPronta === true) return NextResponse.json({ error: 'Esta questão ainda não tem aula pronta.' }, { status: 404 });

  // Mesma questão e mesma alternativa marcada = mesmo prompt (lib/cache-ia.ts).
  // A conferência roda dentro do cache: cada questão é conferida uma vez.
  const r = await comCache('explicacao-conferida', promptExplicacao(questao),
    () => gerarExplicacao(questao, PRAZO_TOTAL_MS),
    (guardada) => validarExplicacao(guardada, questao.materia));
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json({ explicacao: r.dado });
}
