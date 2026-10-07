export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
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

  // Mesma questão e mesma alternativa marcada = mesmo prompt = mesma explicação.
  // Antes refazia toda vez (3 exemplos resolvidos por matéria, todo dia): 4 a
  // 12 s de espera e o limite de 8 mil tokens/min da Groq. A chave é o prompt
  // inteiro: mudou a regra, muda a chave. Falha não entra no cache (throw).
  const prompt = promptExplicacao(questao);
  const chave = createHash('sha256').update(prompt).digest('hex');
  try {
    const explicacao = await unstable_cache(
      async () => {
        const r = await pedirJson(prompt, (bruto) => validarExplicacao(bruto, questao.materia), { maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao(), timeoutMs: 45_000 });
        if (!r.ok) throw new FalhaIA(r.erro, r.status);
        return r.dado;
      },
      ['explicacao', chave],
      { revalidate: TRINTA_DIAS_S },
    )();
    return NextResponse.json({ explicacao });
  } catch (e) {
    if (e instanceof FalhaIA) return NextResponse.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
const TRINTA_DIAS_S = 30 * 24 * 60 * 60;
class FalhaIA extends Error {
  constructor(mensagem: string, readonly status: number) { super(mensagem); }
}
