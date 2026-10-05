// Uma chamada JSON à IA com validação e uma nova tentativa. Modelos menores às
// vezes devolvem JSON quebrado ou fora do formato; a segunda tentativa avisa
// o erro em vez de repetir o mesmo pedido.

import { chatCompletion } from '@/lib/ai-client';
import { extrairJson } from '@/lib/tutor/validar';

export type ResultadoIA<T> = { ok: true; dado: T } | { ok: false; erro: string; status: number };

/* A Groq gratuita limita 8.000 tokens por minuto por modelo (429). Medido
   em 05/10/2026: 2 e 5 s de espera não bastavam, a janela é de um minuto.
   Esperar e repetir resolve; o aluno vê "Pensando..." em vez de erro. */
const ESPERAS_429_MS = [4000, 12000];
const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Mensagem = { role: 'user' | 'assistant'; content: string };
/* modelo: ver lib/ia-modelos.ts. Sem ele, vale o AI_MODEL do .env. */
export interface OpcoesPedido {
  maxTokens?: number;
  temperature?: number;
  modelo?: string;
  /* 'high' onde conta errada não pode passar (ver lib/ia-modelos.ts). */
  pensar?: 'low' | 'medium' | 'high';
  timeoutMs?: number;
}

async function chamarComEspera(mensagens: Mensagem[], opcoes: OpcoesPedido) {
  for (let i = 0; ; i++) {
    const r = await chatCompletion({
      messages: mensagens,
      model: opcoes.modelo,
      maxTokens: opcoes.maxTokens ?? 3000,
      temperature: opcoes.temperature ?? 0.4,
      // Sem o modo JSON da Groq, de propósito: ele valida no servidor e recusa
      // (400 json_validate_failed) todo LaTeX com barra simples ("\Delta"),
      // que é o normal em fórmula. extrairJson trata essas barras do nosso lado.
      // Medido em 05/10/2026: a maioria das recusas de lição vinha daqui.
      ...(opcoes.pensar && opcoes.modelo?.includes('gpt-oss') ? { reasoningEffort: opcoes.pensar } : {}),
      ...(opcoes.timeoutMs ? { timeoutMs: opcoes.timeoutMs } : {}),
    });
    // 429 = limite por minuto; 502 = conexão caiu ou erro passageiro da Groq
    // ("fetch failed" no teste de 05/10/2026). Timeout (504) não se repete:
    // dobraria a espera do aluno.
    const passageiro = r.ok ? false : r.response.status === 429 || r.response.status === 502;
    if (!passageiro || i >= ESPERAS_429_MS.length) return r;
    await esperar(ESPERAS_429_MS[i]);
  }
}

export async function pedirJson<T>(
  prompt: string,
  validar: (bruto: unknown) => T | null,
  opcoes: OpcoesPedido = {},
): Promise<ResultadoIA<T>> {
  const mensagens: Mensagem[] = [{ role: 'user', content: prompt }];
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    const r = await chamarComEspera(mensagens, opcoes);
    if (!r.ok) {
      const corpo = await r.response.json().catch(() => ({}));
      return { ok: false, erro: corpo?.error ?? 'Erro no serviço de IA.', status: r.response.status };
    }
    const conteudo: string = r.data?.choices?.[0]?.message?.content ?? '';
    const dado = validar(extrairJson(conteudo));
    if (dado) return { ok: true, dado };
    console.error('Tutor: resposta fora do formato, tentativa', tentativa + 1, conteudo.slice(0, 300));
    mensagens.push(
      { role: 'assistant', content: conteudo.slice(0, 4000) },
      { role: 'user', content: 'Essa resposta não seguiu o formato JSON pedido. Devolva SOMENTE o JSON, completo, no formato exato.' },
    );
  }
  return { ok: false, erro: 'A IA respondeu fora do formato. Tente de novo.', status: 502 };
}
