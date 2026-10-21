export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { comCache } from '@/lib/cache-ia';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { promptExplicacao, textoDaQuestao } from '@/lib/tutor/prompts';
import { validarExplicacao } from '@/lib/tutor/validar';
import { explicarConferido, promptConferencia, validarConferencia } from '@/lib/tutor/conferir';
import { pedirJson } from '@/lib/pedir-json';
import { lerQuestao } from '@/lib/tutor/entrada';
import { MODELO_IA } from '@/lib/ia-modelos';

/* Gerar, conferir e (se preciso) gerar de novo dividem um prazo só: a Vercel
   mata a função aos 60 s. A conferência tem teto próprio para sobrar tempo
   para a correção; se não sobrar, fica a primeira versão. */
const PRAZO_TOTAL_MS = 55_000;
const PRAZO_CONFERENCIA_MS = 15_000;
const MINIMO_PARA_TENTAR_MS = 8_000;

// Explicação visual e em passos de uma questão (components/tutor).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const questao = lerQuestao(await req.json().catch(() => null));
  if (!questao) return NextResponse.json({ error: 'Dados da questão incompletos' }, { status: 400 });

  const fim = Date.now() + PRAZO_TOTAL_MS;
  const resta = () => fim - Date.now();
  const semTempo = { ok: false as const, erro: 'Sem tempo para conferir', status: 504 };

  // Mesma questão e mesma alternativa marcada = mesmo prompt (lib/cache-ia.ts).
  // A conferência roda dentro do cache: cada questão é conferida uma vez.
  const prompt = promptExplicacao(questao);
  const r = await comCache('explicacao-conferida', prompt, () => explicarConferido(
    prompt,
    (p) => resta() < MINIMO_PARA_TENTAR_MS
      ? Promise.resolve(semTempo)
      : pedirJson(p, (bruto) => validarExplicacao(bruto, questao.materia), {
        maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao(), timeoutMs: 45_000, prazoMs: resta(),
      }),
    (primeira) => resta() < MINIMO_PARA_TENTAR_MS * 2
      ? Promise.resolve(semTempo)
      : pedirJson(promptConferencia(textoDaQuestao(questao), primeira), validarConferencia, {
        maxTokens: 1500, temperature: 0, modelo: MODELO_IA.verificacao(), prazoMs: Math.min(PRAZO_CONFERENCIA_MS, resta() - MINIMO_PARA_TENTAR_MS),
      }),
  ), (guardada) => validarExplicacao(guardada, questao.materia));
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json({ explicacao: r.dado });
}
