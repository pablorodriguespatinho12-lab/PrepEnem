// Cor + sublinhado de cada função da redação pronta (--grifo-* em
// app/globals.css). Usado na versão inteira e na parte por parte.
import type { CSSProperties } from 'react';
import type { FuncaoTrecho } from '@/lib/redacao/exemplo-receita';
type Grifo = { cor: string; traco: 'solid' | 'dashed' | 'dotted' | 'double' | 'wavy' };
/* Cor + sublinhado por função. Os 5 elementos da proposta têm cor e
   sublinhado próprios: o aluno precisa achar cada um. */
const GRIFO: Record<FuncaoTrecho, Grifo> = {
  repertorio: { cor: '--grifo-repertorio', traco: 'solid' },
  ponte: { cor: '--grifo-ponte', traco: 'dashed' },
  tese: { cor: '--grifo-tese', traco: 'double' },
  topico: { cor: '--grifo-topico', traco: 'wavy' },
  explicacao: { cor: '--grifo-explicacao', traco: 'dotted' },
  fechamento: { cor: '--grifo-fechamento', traco: 'solid' },
  agente: { cor: '--grifo-agente', traco: 'solid' },
  acao: { cor: '--grifo-acao', traco: 'dashed' },
  meio: { cor: '--grifo-meio', traco: 'dotted' },
  finalidade: { cor: '--grifo-finalidade', traco: 'double' },
  detalhamento: { cor: '--grifo-detalhamento', traco: 'wavy' },
};
export const estiloGrifo = (f: FuncaoTrecho, ativo: boolean): CSSProperties => {
  const g = GRIFO[f];
  return {
    backgroundColor: `hsl(var(${g.cor}) var(${ativo ? '--grifo-luz-ativa' : '--grifo-luz'}))`,
    textDecorationLine: 'underline',
    textDecorationStyle: g.traco,
    textDecorationColor: `hsl(var(${g.cor}) var(--grifo-luz-traco))`,
    textDecorationThickness: '2px',
    textUnderlineOffset: '5px',
    /* Tocado: contorno na cor da função (a etiqueta acima cobria a linha de
       cima no celular; o nome vai na barra de baixo). */
    outline: ativo ? `2px solid hsl(var(${g.cor}) var(--grifo-luz-traco))` : undefined,
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  };
};
