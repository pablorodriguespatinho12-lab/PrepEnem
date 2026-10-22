export const dynamic = 'force-dynamic';
export const maxDuration = 30;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { comCache } from '@/lib/cache-ia';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';
import { lerQuestao } from '@/lib/tutor/entrada';
import { promptSeuErro } from '@/lib/tutor/prompts';
import { validarSeuErro } from '@/lib/tutor/validar';

const PRAZO_MS = 25_000;

// "Onde você desviou" para a explicação que veio pronta do banco.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const questao = lerQuestao(await req.json().catch(() => null));
  if (!questao?.respostaDada || questao.respostaDada === questao.respostaCorreta) {
    return NextResponse.json({ error: 'Só para resposta errada' }, { status: 400 });
  }
  const prompt = promptSeuErro(questao);
  // {"seuErro": null} é resposta válida: a IA não achou um caminho certo até a
  // alternativa marcada, e o prompt manda não chutar. Aí só não há tela de erro.
  const r = await comCache('seu-erro', prompt, () => pedirJson(prompt, (b) => (
    b && typeof b === 'object' && 'seuErro' in b ? { seuErro: validarSeuErro(b) } : null
  ), { maxTokens: 1200, temperature: 0.2, modelo: MODELO_IA.explicacao(), prazoMs: PRAZO_MS }), (g) => (g && 'seuErro' in g ? g : null));
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json(r.dado);
}
