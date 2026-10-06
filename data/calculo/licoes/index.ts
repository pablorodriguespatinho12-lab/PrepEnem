// Lições escritas à mão. As que não estão aqui são geradas pela IA a partir do
// degrau da trilha (data/calculo/trilha.ts) e salvas no banco.

import type { ConteudoLicao } from '@/lib/calculo/tipos';
import { P1_FUNCAO } from './p1-funcao';
import { P2_GRAFICO } from './p2-grafico';
import { P3_AFIM } from './p3-afim';
import { P4_QUADRATICA } from './p4-quadratica';
import { P5_TRANSFORMACOES } from './p5-transformacoes';

export const LICOES_ESCRITAS: Record<string, ConteudoLicao> = {
  p1: P1_FUNCAO,
  p2: P2_GRAFICO,
  p3: P3_AFIM,
  p4: P4_QUADRATICA,
  p5: P5_TRANSFORMACOES,
};
