import { AULAS, PROPORCOES, DESENHO_LOGICA } from '@/lib/aulas-desenho-dados.js';

// Tipos e busca das aulas em desenho (dados em lib/aulas-desenho-dados.js).
// O SVG e a conta são texto escrito à mão neste repositório (nunca vem de usuário ou IA),
// por isso podem ir para a tela como HTML.

export type TipoProporcao = 'direta' | 'inversa' | 'outra';
export type Proporcao = { tipo: TipoProporcao; par: string; exemplo: string };
export type AulaEmDesenho = {
  svg: string;
  pecas: [string, string][];
  sentido: string;
  conta: string;
  proporcoes: Proporcao[];
  desenhoLogica: string | null;
};

type Bruta = { t: string; svg: string; pecas: [string, string][]; sentido: string; conta: string };

// O JS não guarda tupla nem tipo literal; o formato é conferido em data/revisao-final/aulas-desenho.test.ts.
const POR_TEMA = new Map((AULAS as unknown as Bruta[]).map((a) => [a.t, a]));
const PROP = PROPORCOES as unknown as Record<string, [TipoProporcao, string, string][]>;
const LOGICA = DESENHO_LOGICA as Record<string, string>;

export const TEMAS_COM_DESENHO = [...POR_TEMA.keys()];

export function desenhoDoTema(tema: string | null | undefined): AulaEmDesenho | null {
  const a = tema ? POR_TEMA.get(tema) : undefined;
  if (!a || !tema) return null;
  return {
    svg: a.svg,
    pecas: a.pecas,
    sentido: a.sentido,
    conta: a.conta,
    proporcoes: (PROP[tema] ?? []).map(([tipo, par, exemplo]) => ({ tipo, par, exemplo })),
    desenhoLogica: LOGICA[tema] ?? null,
  };
}
