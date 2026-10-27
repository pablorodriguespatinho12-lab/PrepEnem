// Versões estragadas de propósito de uma redação boa. Cada uma quebra UMA
// competência por troca de texto feita pelo código (não por IA), e o golden
// set confere que a nota cai exatamente nessa competência.

import type { Competencia } from '@/lib/redacao/correcao';

export interface Degradacao {
  nome: string;
  competencia: Competencia;
  trocas: [string, string][];
}

/* Trocas sobre tests/redacao/fixtures.ts (REDACAO). Para degradar uma redação
   da cartilha, escreva as trocas dela no mesmo formato. */
export const DEGRADACOES_FIXTURE: Degradacao[] = [
  {
    nome: 'sem agente',
    competencia: 'c5',
    trocas: [['Para isso, o Ministério da Saúde deve criar', 'Para isso, deve-se criar']],
  },
  {
    nome: 'repertório trocado por bolso',
    competencia: 'c2',
    trocas: [
      ['Segundo Erving Goffman, em Estigma, a sociedade reduz a pessoa a um atributo e passa a excluí-la por ele.', 'Segundo Aristóteles, o ser humano é um animal político.'],
      ['Nesse sentido, a ideia de Goffman mostra que o rótulo de "louco" apaga a pessoa e deixa só a doença.', 'Nesse sentido, como dizia Aristóteles, o homem vive em sociedade.'],
      ['Sob essa ótica, a Lei 10.216, de 2001, trocou a internação em manicômio pelo cuidado em liberdade, na comunidade.', 'Sob essa ótica, Platão afirmava que a justiça é dar a cada um o que é seu.'],
      ['como alertava Goffman', 'como ensinava Aristóteles'],
    ],
  },
  {
    nome: 'tema tangenciado',
    competencia: 'c2',
    trocas: [
      ['o estigma associado às doenças mentais ainda afasta pacientes do cuidado', 'a saúde mental da população ainda preocupa'],
      ['fator central do estigma', 'fator central dos problemas de saúde mental'],
      ['por medo de chacota', 'por falta de tempo'],
      ['mantém o preconceito contra quem adoece', 'piora a saúde de quem adoece'],
      ['também contribui para o estigma', 'também contribui para esses problemas'],
      ['o doente continuará visto como alguém a ser isolado', 'o doente continuará sem atendimento'],
      ['campanhas permanentes contra o estigma', 'campanhas permanentes sobre saúde mental'],
      ['busquem tratamento sem vergonha', 'busquem tratamento mais cedo'],
      ['a sociedade deixará de reduzir a pessoa à doença, como alertava Goffman', 'a população terá mais saúde mental'],
      ['Segundo Erving Goffman, em Estigma, a sociedade reduz a pessoa a um atributo e passa a excluí-la por ele.', 'Segundo a OMS, saúde é bem-estar físico, mental e social.'],
      ['a ideia de Goffman mostra que o rótulo de "louco" apaga a pessoa e deixa só a doença', 'a OMS mostra que a saúde mental faz parte da saúde'],
      ['Tal cenário decorre, sobretudo, da desinformação', 'Tal cenário decorre, sobretudo, da desinformação sobre saúde'],
    ],
  },
  {
    nome: 'conectivo repetido',
    competencia: 'c4',
    trocas: [
      ['Em primeiro lugar,', 'Além disso,'],
      ['Nesse sentido,', 'Além disso,'],
      ['Sob essa ótica,', 'Além disso,'],
      ['Portanto,', 'Além disso,'],
    ],
  },
];

/* Aplica as trocas; falha alto se alguma não achou o texto (troca morta não testa nada). */
export function degradar(texto: string, d: Degradacao): string {
  return d.trocas.reduce((t, [de, para]) => {
    if (!t.includes(de)) throw new Error(`Degradação "${d.nome}": não achei "${de.slice(0, 50)}"`);
    return t.replace(de, para);
  }, texto);
}
