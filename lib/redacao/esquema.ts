// Formato da evidência que a IA devolve (correção v3). O zod recusa o que vier
// fora disso, e o pedirJson pede de novo. Campos de lista e booleanos têm valor
// padrão (a IA esquece); o que justifica cada nota (trecho) é obrigatório.

import { z } from 'zod';

const texto = (max: number) => z.string().trim().max(max * 2).transform((s) => s.slice(0, max));
const textoOuNulo = (max: number) => z.string().trim().nullish().transform((s) => (s ? s.slice(0, max) : null));
const sim = z.boolean().catch(false);
const lista = <T extends z.ZodTypeAny>(item: T) => z.array(z.unknown()).catch([]).transform((xs) =>
  xs.flatMap((x) => {
    const r = item.safeParse(x);
    return r.success ? [r.data as z.infer<T>] : [];
  }));

/* Trecho que justifica a nota da competência e o descritor de nível escolhido. */
const justificativa = {
  trecho: texto(400),
  descritor: texto(300).catch(''),
};

const elemento = z.object({ trecho: textoOuNulo(300), valido: sim }).catch({ trecho: null, valido: false });

export const EvidenciaSchema = z.object({
  c1: z.object({
    estrutura: z.enum(['excelente', 'boa', 'regular', 'deficitaria', 'inexistente']),
    ...justificativa,
    desvios: lista(z.object({ trecho: texto(200), tipo: texto(40).catch(''), correcao: texto(200) })),
  }),
  c2: z.object({
    abordagem: z.enum(['completa', 'tangencia', 'fuga']),
    ...justificativa,
    outroTipoTextual: sim,
    copiaMotivadores: sim,
    partesEmbrionarias: z.coerce.number().catch(0).transform((n) => Math.max(0, Math.min(3, Math.round(n)))),
    repertorios: lista(z.object({
      cita: textoOuNulo(300),
      explica: textoOuNulo(300),
      amarra: textoOuNulo(300),
      legitimado: sim,
      pertinente: sim,
      comentario: texto(300).catch(''),
    })),
  }),
  c3: z.object({
    nivel: z.coerce.number(),
    ...justificativa,
    contradicaoGrave: sim,
    paragrafos: lista(z.object({
      numero: z.coerce.number().catch(0),
      ideia: texto(300).catch(''),
      desenvolvida: sim,
      comentario: texto(300).catch(''),
    })),
  }),
  c4: z.object({
    nivel: z.coerce.number(),
    ...justificativa,
    operadoresEntreParagrafos: lista(texto(60)),
    todoParagrafoTemCoesivo: sim,
    inadequacoes: lista(z.object({ trecho: texto(200), porque: texto(300).catch('') })),
    repeticoes: lista(texto(60)),
  }),
  c5: z.object({
    agente: elemento, acao: elemento, modo: elemento, efeito: elemento, detalhamento: elemento,
    desrespeitaDH: sim,
    condicional: sim,
  }),
  proximoPasso: z.record(z.string(), z.unknown()).catch({}),
  reescritas: lista(z.object({ original: texto(400), sugestao: texto(600), porque: texto(300).catch('') })),
});

export type Evidencia = z.infer<typeof EvidenciaSchema>;
