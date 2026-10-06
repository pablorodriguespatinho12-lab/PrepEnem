// Lições escritas à mão. As que não estão aqui são geradas pela IA a partir do
// degrau da trilha (data/calculo/trilha.ts) e salvas no banco.

import type { ConteudoLicao } from '@/lib/calculo/tipos';
import { P1_FUNCAO } from './p1-funcao';
import { P2_GRAFICO } from './p2-grafico';
import { P3_AFIM } from './p3-afim';
import { P4_QUADRATICA } from './p4-quadratica';
import { P5_TRANSFORMACOES } from './p5-transformacoes';
import { P6_POTENCIAS } from './p6-potencias';
import { P7_EXPONENCIAL } from './p7-exponencial';
import { P8_LOGARITMO } from './p8-logaritmo';
import { P9_SENO_COSSENO } from './p9-seno-cosseno';
import { P10_PERIODICAS } from './p10-periodicas';
import { P11_COMPOSICAO_INVERSA } from './p11-composicao-inversa';
import { P12_TAXA_MEDIA } from './p12-taxa-media';
import { C1_LIMITE } from './c1-limite';
import { C2_CONTINUIDADE } from './c2-continuidade';
import { C3_LIMITE_INFINITO } from './c3-limite-infinito';
import { C4_DERIVADA } from './c4-derivada';
import { C5_REGRA_POTENCIA } from './c5-regra-potencia';
import { C6_PRODUTO_QUOCIENTE } from './c6-produto-quociente';
import { C7_REGRA_CADEIA } from './c7-regra-cadeia';
import { C8_EXP_LOG_TRIG } from './c8-exp-log-trig';
import { C9_SUBIR_DESCER } from './c9-subir-descer';
import { C10_OTIMIZACAO } from './c10-otimizacao';
import { C11_INTEGRAL } from './c11-integral';
import { C12_TEOREMA_FUNDAMENTAL } from './c12-teorema-fundamental';

export const LICOES_ESCRITAS: Record<string, ConteudoLicao> = {
  p1: P1_FUNCAO,
  p2: P2_GRAFICO,
  p3: P3_AFIM,
  p4: P4_QUADRATICA,
  p5: P5_TRANSFORMACOES,
  p6: P6_POTENCIAS,
  p7: P7_EXPONENCIAL,
  p8: P8_LOGARITMO,
  p9: P9_SENO_COSSENO,
  p10: P10_PERIODICAS,
  p11: P11_COMPOSICAO_INVERSA,
  p12: P12_TAXA_MEDIA,
  c1: C1_LIMITE,
  c2: C2_CONTINUIDADE,
  c3: C3_LIMITE_INFINITO,
  c4: C4_DERIVADA,
  c5: C5_REGRA_POTENCIA,
  c6: C6_PRODUTO_QUOCIENTE,
  c7: C7_REGRA_CADEIA,
  c8: C8_EXP_LOG_TRIG,
  c9: C9_SUBIR_DESCER,
  c10: C10_OTIMIZACAO,
  c11: C11_INTEGRAL,
  c12: C12_TEOREMA_FUNDAMENTAL,
};
