// Resposta da IA guardada pelo prompt: mesmo prompt, mesma resposta, sem
// esperar nem gastar a cota da Groq (8 mil tokens/min). A chave é o hash do
// prompt inteiro: mudou a regra ou a questão, muda a chave. Falha da IA não
// entra no cache. Medido em 07/10/2026 (explicação do carro 72 km/h):
// 10.838 ms na primeira vez, 41 ms na segunda.

import { createHash } from 'crypto';
import { unstable_cache } from 'next/cache';
import type { ResultadoIA } from '@/lib/pedir-json';

const TRINTA_DIAS_S = 30 * 24 * 60 * 60;

class FalhaIA extends Error {
  constructor(mensagem: string, readonly status: number) { super(mensagem); }
}

export async function comCache<T>(prefixo: string, prompt: string, gerar: () => Promise<ResultadoIA<T>>): Promise<ResultadoIA<T>> {
  const chave = createHash('sha256').update(prompt).digest('hex');
  try {
    const dado = await unstable_cache(
      async () => {
        const r = await gerar();
        if (!r.ok) throw new FalhaIA(r.erro, r.status);
        return r.dado;
      },
      [prefixo, chave],
      { revalidate: TRINTA_DIAS_S },
    )();
    return { ok: true, dado };
  } catch (e) {
    if (e instanceof FalhaIA) return { ok: false, erro: e.message, status: e.status };
    throw e;
  }
}
