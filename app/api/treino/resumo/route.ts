export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pedirJson } from '@/lib/pedir-json';
import { comCache } from '@/lib/cache-ia';
import { promptResumo, validarResumos } from '@/lib/tutor/resumo';
import { MODELO_IA } from '@/lib/ia-modelos';

const TOKENS_BASE = 2000;
const TOKENS_POR_ASSUNTO = 850; // +150 com "antes" e "oQueE" (07/10/2026)
// Abaixo dos 8.000 tokens/min da Groq gratuita, somando o prompt (~1.000).
const TOKENS_TETO = 6800;
const LIMITE_POR_MINUTO = 7800; // os 8.000 da Groq, com folga
// Medido em 15/10/2026: a Groq contou ~3.600 tokens num prompt de ~8.000
// caracteres. Usar 3 subestimava e o pedido passava de 8.000 (413).
const CARACTERES_POR_TOKEN = 2.1;
const MAX_ASSUNTOS = 4;
// Resumo de revisão dos assuntos do dia, antes das questões.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const brutos: unknown[] = Array.isArray(body?.subtemas) ? body.subtemas : [];
  const assuntos = Array.from(new Map(
    brutos
      .map((s) => (s && typeof s === 'object' ? (s as Record<string, unknown>) : {}))
      .filter((s) => typeof s.materia === 'string' && typeof s.subtema === 'string')
      .map((s) => [`${s.materia}::${s.subtema}`, { materia: String(s.materia).slice(0, 40), subtema: String(s.subtema).slice(0, 120) }]),
  ).values());
  if (assuntos.length === 0) return NextResponse.json({ error: 'Subtemas não informados' }, { status: 400 });

  // Medido em 05/10/2026: 6 assuntos gastaram 3.712 tokens (1.481 de raciocínio).
  // Com teto fixo de 4.000, 7 ou 8 assuntos cortavam o JSON no meio, a segunda
  // tentativa estourava a cota por minuto (429) e o aluno via "Resumo indisponível".
  // 15/10/2026: o formato dos desenhos cresceu e o prompt passou de 1.000 para
  // ~2.500 tokens; com 8 assuntos o pedido foi a 10.509 e a Groq recusou (413).
  // Agora: no máximo 4 assuntos (os do dia vêm primeiro) e o teto sai do
  // tamanho real do prompt.
  const prompt = promptResumo(assuntos.slice(0, MAX_ASSUNTOS));
  const tokensDoPrompt = Math.ceil(prompt.length / CARACTERES_POR_TOKEN);
  const maxTokens = Math.min(TOKENS_BASE + TOKENS_POR_ASSUNTO * Math.min(assuntos.length, MAX_ASSUNTOS), TOKENS_TETO, LIMITE_POR_MINUTO - tokensDoPrompt);
  // Os assuntos do dia são os mesmos para todos: guardado pelo prompt.
  const r = await comCache('resumo', prompt, () => pedirJson(prompt, validarResumos, { maxTokens, temperature: 0.3, modelo: MODELO_IA.resumo() }),
    (guardados) => validarResumos({ resumos: guardados }));
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json({ resumos: r.dado });
}
