// Uma chamada JSON à IA com validação e uma nova tentativa. Modelos menores às
// vezes devolvem JSON quebrado ou fora do formato; a segunda tentativa avisa
// o erro em vez de repetir o mesmo pedido.

import { chatCompletion } from '@/lib/ai-client';
import { extrairJson } from '@/lib/tutor/validar';
import { modelosEmOrdem } from '@/lib/ia-modelos';

export type ResultadoIA<T> = { ok: true; dado: T } | { ok: false; erro: string; status: number };

/* A Groq gratuita limita 8.000 tokens por minuto por modelo (429). Medido
   em 05/10/2026: 2 e 5 s de espera não bastavam, a janela é de um minuto.
   Esperar e repetir resolve; o aluno vê "Pensando..." em vez de erro. */
// Terceira espera (21/10/2026, "não pode falhar"): no teste de 9 questões, 2
// desistiram aos 16 s com 429, e a janela da cota é de um minuto. Cabe no
// prazo de 50 s; se não couber, o laço abaixo desiste antes de estourar.
const ESPERAS_429_MS = [4000, 12000, 20000];
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
  /* Prazo da chamada inteira, com tentativas e esperas de 429. A função na
     Vercel morre aos 60 s (maxDuration): antes 2 tentativas + 4 s + 12 s de
     espera + timeout passavam disso, o catch não rodava e a tela travava. */
  prazoMs?: number;
}
const PRAZO_PADRAO_MS = 50_000;
const FOLGA_MS = 3_000;

/* 429 troca de modelo antes de esperar (ver modelosEmOrdem). Devolve também
   o modelo que respondeu, para a segunda tentativa continuar nele. */
async function chamarComReserva(mensagens: Mensagem[], opcoes: OpcoesPedido, fim: number) {
  const modelos = modelosEmOrdem(opcoes.modelo);
  for (let i = 0; ; i++) {
    const modelo = modelos[i];
    const r = await chamarComEspera(mensagens, { ...opcoes, modelo }, fim, i === modelos.length - 1);
    const semCota = !r.ok && r.response.status === 429;
    if (!semCota || i === modelos.length - 1 || fim - Date.now() < FOLGA_MS) return { r, modelo };
  }
}
async function chamarComEspera(mensagens: Mensagem[], opcoes: OpcoesPedido, fim: number, esperar429 = true) {
  for (let i = 0; ; i++) {
    const resta = fim - Date.now();
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
      timeoutMs: Math.min(opcoes.timeoutMs ?? resta, resta),
    });
    // 429 = limite por minuto; 502 = conexão caiu ou erro passageiro da Groq
    // ("fetch failed" no teste de 05/10/2026). Timeout (504) não se repete:
    // dobraria a espera do aluno.
    const passageiro = r.ok ? false : r.response.status === 429 || r.response.status === 502;
    if (!passageiro || i >= ESPERAS_429_MS.length) return r;
    if (!esperar429 && !r.ok && r.response.status === 429) return r;
    if (Date.now() + ESPERAS_429_MS[i] + FOLGA_MS > fim) return r;
    await esperar(ESPERAS_429_MS[i]);
  }
}

export async function pedirJson<T>(
  prompt: string,
  validar: (bruto: unknown) => T | null,
  opcoes: OpcoesPedido = {},
): Promise<ResultadoIA<T>> {
  const mensagens: Mensagem[] = [{ role: 'user', content: prompt }];
  const fim = Date.now() + (opcoes.prazoMs ?? PRAZO_PADRAO_MS);
  let modelo = opcoes.modelo;
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    if (fim - Date.now() < FOLGA_MS) break;
    const chamada = await chamarComReserva(mensagens, { ...opcoes, modelo }, fim);
    const r = chamada.r;
    modelo = chamada.modelo;
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
  if (fim - Date.now() < FOLGA_MS) return { ok: false, erro: 'A IA demorou demais. Tente de novo.', status: 504 };
  return { ok: false, erro: 'A IA respondeu fora do formato. Tente de novo.', status: 502 };
}
