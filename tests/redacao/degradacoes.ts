// Versões estragadas de propósito de uma redação boa. Cada uma quebra UMA
// competência por troca de texto feita pelo código (não por IA), e o golden
// set confere que a nota cai exatamente nessa competência.

import type { Competencia } from '@/lib/redacao/correcao';

export interface Degradacao {
  nome: string;
  competencia: Competencia;
  trocas: [string, string][];
  /* true: só reporta a queda, não exige (a C2 pode ficar se sobrar repertório produtivo). */
  soReporta?: boolean;
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
/* Estragos numa redação real da Cartilha 2025 (#09, Faoro e Durkheim), fora
   do grupo separado. O bolso imita o Bauman do INEP (Cartilha 2025, p. 18):
   autor e conceito só nomeados, sem explicar. A C2 só cai se nenhum
   repertório ficar produtivo: "bolso sem explicação" mexe nos dois do
   desenvolvimento; "todo repertório só nomeado" mexe também no fato histórico
   da introdução, e nesse a C2 tem que cair. */
export const ARQUIVO_CARTILHA_ESTRAGADA = 'cartilha2025-09';
export const DEGRADACOES_CARTILHA: Degradacao[] = [
  {
    nome: 'sem agente',
    competencia: 'c5',
    trocas: [
      ['Logo, o Poder Executivo, responsável pelo bem-estar social, deve aumentar', 'Logo, deve-se aumentar'],
      ['Ademais, as escolas devem inserir', 'Ademais, devem-se inserir'],
    ],
  },
  {
    nome: 'bolso sem explicação',
    competencia: 'c2',
    soReporta: true,
    trocas: [
      ['Isso ocorre, porque, tal qual abordado pelo teórico Raymundo Faoro, o governo, muitas vezes, prioriza seus próprios interesses em detrimento das necessidades do povo. Em conformidade com Faoro, os políticos em exercício, ao se preocuparem apenas com seus proveitos pessoais, não tomam medidas', 'Isso ocorre, porque, como já dizia o teórico Raymundo Faoro, existem "os donos do poder". Assim, os políticos em exercício não tomam medidas'],
      ['Nesse sentido, o sociólogo Émile Durkheim afirma que a escola é o segundo mecanismo de socialização do indivíduo, que molda seus hábitos e seus comportamentos.', 'Nesse sentido, o sociólogo Émile Durkheim fala em "fato social".'],
    ],
  },
  {
    nome: 'todo repertório só nomeado',
    competencia: 'c2',
    trocas: [
      ['No período colonial brasileiro, a cultura dos indivíduos escravizados foi suprimida para facilitar a dominação e a exploração desse grupo pelos europeus.', 'O período colonial brasileiro é muito lembrado.'],
      ['Isso ocorre, porque, tal qual abordado pelo teórico Raymundo Faoro, o governo, muitas vezes, prioriza seus próprios interesses em detrimento das necessidades do povo. Em conformidade com Faoro, os políticos em exercício, ao se preocuparem apenas com seus proveitos pessoais, não tomam medidas', 'Isso ocorre, porque, como já dizia o teórico Raymundo Faoro, existem "os donos do poder". Assim, os políticos em exercício não tomam medidas'],
      ['Nesse sentido, o sociólogo Émile Durkheim afirma que a escola é o segundo mecanismo de socialização do indivíduo, que molda seus hábitos e seus comportamentos.', 'Nesse sentido, o sociólogo Émile Durkheim fala em "fato social".'],
    ],
  },
];
