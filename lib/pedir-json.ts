// Uma chamada JSON à IA com validação e uma nova tentativa. Modelos menores às
// vezes devolvem JSON quebrado ou fora do formato; a segunda tentativa avisa
// o erro em vez de repetir o mesmo pedido.

import { chatCompletion } from '@/lib/ai-client';
import { extrairJson } from '@/lib/tutor/validar';

/* AI_MODEL_TUTOR permite um modelo mais forte só para explicar e conversar,
   sem mudar o das outras rotas. Sem ele, vale o AI_MODEL padrão. */
const modeloTutor = (): string | undefined => process.env.AI_MODEL_TUTOR || undefined;

export type ResultadoIA<T> = { ok: true; dado: T } | { ok: false; erro: string; status: number };

export async function pedirJson<T>(
  prompt: string,
  validar: (bruto: unknown) => T | null,
  opcoes: { maxTokens?: number; temperature?: number } = {},
): Promise<ResultadoIA<T>> {
  const mensagens: { role: 'user' | 'assistant'; content: string }[] = [{ role: 'user', content: prompt }];
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    const r = await chatCompletion({
      messages: mensagens,
      model: modeloTutor(),
      maxTokens: opcoes.maxTokens ?? 3000,
      temperature: opcoes.temperature ?? 0.4,
      responseFormat: { type: 'json_object' },
    });
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
