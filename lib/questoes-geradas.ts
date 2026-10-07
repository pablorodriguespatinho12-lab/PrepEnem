// Questão objetiva gerada por IA para treino, simulado ou admin: um caminho só.
// Antes cada rota fazia JSON.parse cru, trocava gabarito inválido por 'A' e
// alternativa faltando por 'N/A', e gravava sem conferir no banco que todos
// usam. Agora: validação estrita, resolução independente por outro modelo
// (lib/verificar-respostas.ts) e descarte do que não bate.

import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';
import { concorda, resolverIndependente } from '@/lib/verificar-respostas';

const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;
const DIFICULDADES = ['facil', 'medio', 'dificil'];

export interface QuestaoGerada {
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  respostaCorreta: string;
  subtema: string | null;
  dificuldade: string | null;
  explicacao: string | null;
}

const textoValido = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

function validarUma(bruto: unknown): QuestaoGerada | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const q = bruto as Record<string, unknown>;
  const campos = ['enunciado', 'alternativaA', 'alternativaB', 'alternativaC', 'alternativaD', 'alternativaE'] as const;
  if (!campos.every((k) => textoValido(q[k]))) return null;
  const resposta = String(q.respostaCorreta ?? '').trim().toUpperCase();
  if (!(LETRAS as readonly string[]).includes(resposta)) return null;
  const dificuldade = String(q.dificuldade ?? '').toLowerCase();
  return {
    enunciado: (q.enunciado as string).trim(),
    alternativaA: (q.alternativaA as string).trim(),
    alternativaB: (q.alternativaB as string).trim(),
    alternativaC: (q.alternativaC as string).trim(),
    alternativaD: (q.alternativaD as string).trim(),
    alternativaE: (q.alternativaE as string).trim(),
    respostaCorreta: resposta,
    subtema: textoValido(q.subtema) ? q.subtema.trim() : null,
    dificuldade: DIFICULDADES.includes(dificuldade) ? dificuldade : null,
    explicacao: textoValido(q.explicacao) ? q.explicacao.trim() : null,
  };
}

/* Só as questões completas e com gabarito A–E; nenhuma válida = null (a
   pedirJson tenta de novo). */
export function validarQuestoesGeradas(bruto: unknown): QuestaoGerada[] | null {
  const lista = Array.isArray((bruto as { questoes?: unknown })?.questoes) ? (bruto as { questoes: unknown[] }).questoes : [];
  const validas = lista.map(validarUma).filter((q): q is QuestaoGerada => q !== null);
  return validas.length > 0 ? validas : null;
}

/* Gera e confere. Devolve só as que o verificador resolveu igual; se a
   verificação falhar por inteiro, nenhuma (quem chama cai no banco). */
export async function gerarQuestoesConferidas(prompt: string, timeoutMs = 25_000): Promise<QuestaoGerada[]> {
  const r = await pedirJson(prompt, validarQuestoesGeradas, {
    maxTokens: 6000, temperature: 0.5, modelo: MODELO_IA.degraus(), timeoutMs, prazoMs: timeoutMs,
  });
  if (!r.ok) {
    console.error('Questões geradas: a IA falhou', r.erro);
    return [];
  }
  const verificadas = await resolverIndependente(r.dado.map((q) => ({
    enunciado: q.enunciado,
    opcoes: [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE],
  })));
  if (!verificadas) {
    console.error('Questões geradas: a verificação falhou; nenhuma salva');
    return [];
  }
  return r.dado.filter((q, i) =>
    concorda({ tipo: 'escolha', correta: LETRAS.indexOf(q.respostaCorreta as (typeof LETRAS)[number]) }, verificadas[i]));
}
