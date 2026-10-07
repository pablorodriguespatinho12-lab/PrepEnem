// Resolução independente: outro modelo resolve cada questão gerada do zero,
// sem ver o gabarito; só fica a questão em que os dois concordam. Motivo
// (teste com IA real, 05/10/2026): degrau "Calcule p(3) para
// p(t) = −t² + 10t + 24" com gabarito 39 (o certo é 45), e lição com a raiz
// 2 + √10/2 escrita como 2,58. Um gabarito errado ensina errado, e o aluno
// com TDAH desiste quando "acerta e o app diz que errou".

import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';

export interface QuestaoParaVerificar {
  enunciado: string;
  /* Com opções: a resposta é o índice. Sem opções: a resposta é um número. */
  opcoes?: string[];
}

export type RespostaVerificada = { indice: number } | { valor: number } | null;

const LETRAS = 'ABCDEFGH';

function montarPrompt(questoes: QuestaoParaVerificar[]): string {
  const lista = questoes.map((q, i) => {
    const ops = q.opcoes ? '\n' + q.opcoes.map((o, j) => `   ${LETRAS[j]}) ${o}`).join('\n') : '\n   (resposta numérica)';
    return `${i + 1}. ${q.enunciado}${ops}`;
  }).join('\n\n');
  return `Resolva cada questão abaixo de forma independente e cuidadosa. Faça a conta completa de cada uma antes de responder; não chute.

${lista}

Devolva SOMENTE JSON: {"respostas": [{"n": 1, "conta": "a conta curta que leva à resposta", "letra": "B"}, {"n": 2, "conta": "...", "valor": 45}]}
Use "letra" quando a questão tem alternativas e "valor" (número) quando não tem.`;
}

function ler(bruto: unknown, questoes: QuestaoParaVerificar[]): RespostaVerificada[] | null {
  const lista = Array.isArray((bruto as { respostas?: unknown })?.respostas) ? (bruto as { respostas: unknown[] }).respostas : null;
  if (!lista) return null;
  return questoes.map((q, i) => {
    const r = lista.map((x) => (x && typeof x === 'object' ? (x as Record<string, unknown>) : {})).find((x) => Number(x.n) === i + 1);
    if (!r) return null;
    if (q.opcoes) {
      const indice = LETRAS.indexOf(String(r.letra ?? '').trim().toUpperCase().charAt(0));
      return indice >= 0 && indice < q.opcoes.length ? { indice } : null;
    }
    const valor = Number(String(r.valor ?? '').replace(',', '.'));
    return Number.isFinite(valor) ? { valor } : null;
  });
}

/* Resolve todas numa chamada só (cabe no limite por minuto). Se a
   verificação falhar por inteiro, devolve null: quem chama decide. */
export async function resolverIndependente(questoes: QuestaoParaVerificar[]): Promise<RespostaVerificada[] | null> {
  if (questoes.length === 0) return [];
  const r = await pedirJson(montarPrompt(questoes), (b) => ler(b, questoes), {
    maxTokens: 2500, temperature: 0, modelo: MODELO_IA.verificacao(), timeoutMs: 40_000, prazoMs: 40_000,
  });
  return r.ok ? r.dado : null;
}

export function concorda(
  resposta: { tipo: 'numero'; valor: number; tolerancia?: number } | { tipo: 'escolha'; correta: number },
  verificada: RespostaVerificada,
): boolean {
  if (!verificada) return false;
  if (resposta.tipo === 'escolha') return 'indice' in verificada && verificada.indice === resposta.correta;
  if (!('valor' in verificada)) return false;
  const tol = resposta.tolerancia ?? Math.max(1e-6, Math.abs(resposta.valor) * 1e-3);
  return Math.abs(verificada.valor - resposta.valor) <= tol;
}
