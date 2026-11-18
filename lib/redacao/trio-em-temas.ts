// "O mesmo autor em 3 temas" (Pablo, 07/11/2026: "preciso saber como você
// usa cada argumento em vários temas"). Para cada autor do trio: a fala, que
// fica IGUAL em todo tema (decorar 1 vez); a ligação, que MUDA (1 linha por
// redação pronta, de RedacaoModelo.usos); e o molde da frase de ligação.

import { MODELOS } from '@/data/redacao/modelos';
import { CORINGAS } from './autores';
import { TRIOS, type AutorDosTrios, type NumeroDoTrio } from './cartoes-trios';

export interface UsoNoTema {
  modeloId: string;
  rotulo: string;
  comoUsa: string;
}

export interface AutorEmTemas {
  autor: AutorDosTrios;
  nome: string;
  parte: string;
  fala: string;
  molde: string;
  usos: UsoNoTema[];
}

/* A frase de ligação com lacunas: o que sobra quando se tira o tema. */
/* Tema em que os juízes reprovaram o Dom Hélder, mas o D2 reescrito à mão
 * passou no agy como corretor (07/11/2026: a criança trabalha por pobreza, o
 * sentido original da fala). Imigração e diferença foram reprovadas 2 vezes e
 * ficaram sem redação pronta. */
export const DOM_HELDER_FORA_DA_PROVA = [
  'Direitos da criança e do adolescente: como enfrentar esse desafio nacional',
];

export const MOLDE_DO_AUTOR: Record<AutorDosTrios, string> = {
  Drummond: 'Pacto + o artigo do tema. Depois: o Brasil assumiu esse compromisso há mais de trinta anos, mas [o que acontece de verdade].',
  'Rui Barbosa': '[Quem está em desvantagem] recebe a mesma regra que [os outros], e esse tratamento "igual" mantém o problema.',
  'Dom Hélder': '[A ajuda de sempre] é aplaudida, mas perguntar por que [a causa do problema] incomoda.',
};

const fala = (a: AutorDosTrios): string => CORINGAS[a].curta ?? CORINGAS[a].texto;

export function autoresEmTemas(trio: NumeroDoTrio): AutorEmTemas[] {
  const modelos = MODELOS.filter((m) => m.trio === trio);
  const ordem: { autor: AutorDosTrios; parte: string }[] = [
    { autor: 'Drummond', parte: 'Introdução, com o Pacto' },
    { autor: TRIOS[trio].d1, parte: '1º desenvolvimento' },
    { autor: TRIOS[trio].d2, parte: '2º desenvolvimento' },
  ];
  return ordem.map(({ autor, parte }) => ({
    autor,
    nome: CORINGAS[autor].rotulo,
    parte,
    fala: fala(autor),
    molde: MOLDE_DO_AUTOR[autor],
    usos: modelos.flatMap((m) => {
      const comoUsa = m.usos?.[autor];
      return comoUsa ? [{ modeloId: m.id, rotulo: m.rotulo ?? m.tema, comoUsa }] : [];
    }),
  }));
}
