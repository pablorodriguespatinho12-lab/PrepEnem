import { NextResponse } from 'next/server';

// Centraliza toda chamada de chat completion do app (12 rotas chamavam
// fetch('https://apps.abacus.ai/...') direto, cada uma com sua própria
// checagem de chave e tratamento de erro inconsistente — um 500 genérico
// quando a chave faltava foi o que atrasou achar a causa raiz de vários
// bugs "aleatórios" numa sessão real).
//
// ── TROCAR DE PROVEDOR (ex: Groq) ────────────────────────────────────────
// O formato de request/response usado aqui (messages, response_format,
// choices[0].message.content) é o padrão de chat completions da OpenAI, que
// a Groq também expõe em /openai/v1/chat/completions. Pra trocar:
//   1. Env var AI_BASE_URL=https://api.groq.com/openai/v1
//   2. Env var AI_MODEL=<modelo na Groq, ex: llama-3.3-70b-versatile>
//   3. ABACUSAI_API_KEY passa a guardar a chave do novo provedor — o nome
//      da variável ficou por herança histórica, mas o conteúdo dela é só
//      "o Bearer token do provedor de chat", não precisa ser da Abacus.
// Nenhum dos 12 arquivos de rota precisa mudar — só as 3 env vars acima.
//
// Aviso à parte: pdf-process/route.ts e batch-import/route.ts mandam PDF
// como anexo multimodal (`content: [{ type: 'file', ... }]`) — isso É
// centralizado aqui (o tipo de `content` aceita array), mas o formato exato
// de anexo de arquivo não é garantidamente igual entre provedores (a Abacus
// usa `type: 'file'`; outros podem esperar outro formato) — ao trocar de
// provedor, testar essas duas rotas especificamente. Na prática elas hoje
// dependem de AWS_* (upload do PDF pro S3) que não está configurado, então
// ficam bloqueadas por isS3Configured() antes de chegar aqui mesmo.

const DEFAULT_BASE_URL = 'https://apps.abacus.ai/v1';
const DEFAULT_MODEL = 'gpt-5.4-mini';
const DEFAULT_TIMEOUT_MS = 30_000;
// Chamadas em streaming ficam recebendo tokens aos
// poucos por mais tempo que uma chamada JSON normal — timeout maior evita
// cortar uma explicação longa no meio só porque demorou mais que 30s.
const DEFAULT_STREAM_TIMEOUT_MS = 60_000;

function getBaseUrl(): string {
  return process.env.AI_BASE_URL || DEFAULT_BASE_URL;
}

function getModel(): string {
  return process.env.AI_MODEL || DEFAULT_MODEL;
}

export const AI_UNAVAILABLE_MESSAGE = 'Serviço de IA não configurado no momento.';

export function getAbacusApiKey(): string | null {
  return process.env.ABACUSAI_API_KEY || null;
}

export function aiUnavailableResponse() {
  return NextResponse.json({ error: AI_UNAVAILABLE_MESSAGE }, { status: 503 });
}

// content aceita string OU array multimodal (texto + anexo de arquivo, usado
// em pdf-process/batch-import pra mandar o PDF junto do prompt) — o shape
// exato do array é o que a API de destino espera, repassado sem validação.
type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string | unknown[] };

type ChatCompletionParams = {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: { type: 'json_object' };
  timeoutMs?: number;
  /* Só modelos de raciocínio (gpt-oss na Groq): quanto pensar antes de responder. */
  reasoningEffort?: 'low' | 'medium' | 'high';
};

type ErrorResult = { ok: false; response: NextResponse };

function classifyErrorResponse(status: number, bodyText: string): NextResponse {
  if (status === 429) {
    return NextResponse.json(
      { error: 'Serviço de IA temporariamente sobrecarregado. Tente novamente em instantes.' },
      { status: 429 }
    );
  }
  if (status === 401 || status === 403) {
    console.error('AI client auth error:', status, bodyText.slice(0, 300));
    return NextResponse.json({ error: 'Falha de autenticação com o serviço de IA.' }, { status: 502 });
  }
  console.error('AI client upstream error:', status, bodyText.slice(0, 300));
  return NextResponse.json({ error: 'Erro no serviço de IA. Tente novamente.' }, { status: 502 });
}

async function fetchChatCompletion(
  params: ChatCompletionParams & { stream?: boolean },
  apiKey: string
): Promise<{ ok: true; res: Response } | ErrorResult> {
  const timeoutMs = params.timeoutMs ?? (params.stream ? DEFAULT_STREAM_TIMEOUT_MS : DEFAULT_TIMEOUT_MS);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${getBaseUrl()}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: params.model ?? getModel(),
        messages: params.messages,
        ...(params.maxTokens ? { max_tokens: params.maxTokens } : {}),
        ...(params.temperature !== undefined ? { temperature: params.temperature } : {}),
        ...(params.responseFormat ? { response_format: params.responseFormat } : {}),
        ...(params.stream ? { stream: true } : {}),
        ...(params.reasoningEffort ? { reasoning_effort: params.reasoningEffort } : {}),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      return { ok: false, response: classifyErrorResponse(res.status, bodyText) };
    }
    return { ok: true, res };
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Tempo esgotado ao consultar o serviço de IA.' }, { status: 504 }),
      };
    }
    console.error('AI client fetch error:', error?.message || error);
    return { ok: false, response: NextResponse.json({ error: 'Erro ao conectar com o serviço de IA.' }, { status: 502 }) };
  } finally {
    clearTimeout(timeout);
  }
}

// Chamada normal (não-streaming): já devolve o JSON parseado.
// Uso: const result = await chatCompletion({ messages: [...] });
//      if (!result.ok) return result.response;
//      const content = result.data?.choices?.[0]?.message?.content;
export async function chatCompletion(
  params: ChatCompletionParams
): Promise<{ ok: true; data: any } | ErrorResult> {
  const apiKey = getAbacusApiKey();
  if (!apiKey) return { ok: false, response: aiUnavailableResponse() };

  const result = await fetchChatCompletion(params, apiKey);
  if (!result.ok) return result;

  try {
    const data = await result.res.json();
    return { ok: true, data };
  } catch (e) {
    console.error('AI client JSON parse error:', e);
    return { ok: false, response: NextResponse.json({ error: 'Resposta inválida do serviço de IA.' }, { status: 502 }) };
  }
}

// Chamada em streaming: devolve o Response bruto pro caller repassar
// res.body direto pro cliente.
export async function chatCompletionStream(
  params: ChatCompletionParams
): Promise<{ ok: true; res: Response } | ErrorResult> {
  const apiKey = getAbacusApiKey();
  if (!apiKey) return { ok: false, response: aiUnavailableResponse() };

  return fetchChatCompletion({ ...params, stream: true }, apiKey);
}
