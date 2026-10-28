// Exemplo pronto de cada passo do Treino por partes: ENEM 2020, estigma das
// doenças mentais, com as causas 4 + 1 da tabela da receita (estigma e
// omissão do Estado). Escrito à mão, frase por frase no molde de
// PARAGRAFOS e com a ponte em 3 passos; sem IA e sem Neon. Só fato
// verificável (as ideias dos autores são as de lib/redacao/autores.ts; os
// 60 mil mortos de Barbacena são de Daniela Arbex, Holocausto Brasileiro, 2013).
// É exemplo de ESTRUTURA: a tela avisa para não copiar.

import type { ChaveCausa, ChaveParagrafo } from './receita';

export const EXEMPLO_TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';
export const EXEMPLO_ANO = 2020;
export const EXEMPLO_CAUSAS: [ChaveCausa, ChaveCausa] = ['estigma', 'estado'];

export const EXEMPLO_TESE =
  'O estigma associado às doenças mentais na sociedade brasileira decorre, sobretudo, da invisibilidade social desses pacientes e da negligência estatal na garantia de direitos já previstos em lei.';

export interface PassoDaPonte {
  passo: 'Cita' | 'Explica' | 'Amarra';
  trecho: string;
}
export interface ExemploParagrafo {
  /* Uma frase por função do molde, na mesma ordem. */
  frases: string[];
  ponte?: PassoDaPonte[];
}

export const EXEMPLO_PARAGRAFOS: Record<ChaveParagrafo, ExemploParagrafo> = {
  introducao: {
    frases: [
      'Segundo Michel Foucault, em História da Loucura (1961), a sociedade aprendeu a isolar quem foge da norma.',
      'Essa reflexão se aplica ao Brasil contemporâneo, onde o preconceito contra quem tem transtorno mental persiste: só no Hospital Colônia de Barbacena (MG), cerca de 60 mil internos morreram.',
      /* A 3ª frase é a tese do passo 3, igual: começa pelas palavras do tema. */
      EXEMPLO_TESE,
    ],
    ponte: [
      { passo: 'Cita', trecho: 'Michel Foucault, em História da Loucura (1961)' },
      { passo: 'Explica', trecho: 'a sociedade aprendeu a isolar quem foge da norma' },
      { passo: 'Amarra', trecho: 'só no Hospital Colônia de Barbacena (MG), cerca de 60 mil internos morreram' },
    ],
  },
  desenvolvimento1: {
    frases: [
      'Em primeiro lugar, cabe destacar a invisibilidade social como fator central do estigma associado às doenças mentais.',
      'Nesse sentido, o sociólogo Erving Goffman, em Estigma (1963), mostra que a pessoa estigmatizada é reduzida a uma única marca e deixa de ser vista por inteiro.',
      'Isso se verifica no país quando alguém com depressão é chamado de fraco ou exagerado, o que o leva a esconder o sofrimento e a adiar a busca por ajuda.',
      'Assim, a invisibilidade social mantém o estigma associado às doenças mentais.',
    ],
    ponte: [
      { passo: 'Cita', trecho: 'Erving Goffman, em Estigma (1963)' },
      { passo: 'Explica', trecho: 'a pessoa é reduzida a uma única marca' },
      { passo: 'Amarra', trecho: 'quem tem depressão é chamado de fraco e esconde o sofrimento' },
    ],
  },
  desenvolvimento2: {
    frases: [
      'Além disso, a omissão do Estado também contribui para o estigma associado às doenças mentais.',
      'Sob essa ótica, a Lei 10.216, de 2001, conhecida como Lei da Reforma Psiquiátrica, evidencia que o tratamento deve ocorrer de preferência perto da família, e não pelo isolamento em hospícios.',
      'Na realidade brasileira, porém, muitas cidades pequenas ainda não têm um Centro de Atenção Psicossocial (CAPS), o que agrava o estigma associado às doenças mentais.',
      'Logo, enquanto a omissão do Estado persistir, o estigma associado às doenças mentais continuará.',
    ],
    ponte: [
      { passo: 'Cita', trecho: 'Lei 10.216, de 2001 (Reforma Psiquiátrica)' },
      { passo: 'Explica', trecho: 'tratar perto da família, não isolar' },
      { passo: 'Amarra', trecho: 'muitas cidades pequenas não têm CAPS' },
    ],
  },
  conclusao: {
    frases: [
      'Portanto, é preciso enfrentar a invisibilidade social e a omissão do Estado.',
      'Para isso, o Ministério da Saúde deve criar campanhas permanentes contra o estigma, por meio de anúncios em redes sociais e nas UBS, a fim de que pessoas em sofrimento busquem tratamento sem vergonha.',
      'As campanhas devem trazer depoimentos de pacientes, e o governo federal deve abrir CAPS onde ainda faltam.',
      'Dessa forma, o país deixará de isolar quem foge da norma, como criticou Foucault.',
    ],
  },
};

export const exemploDoParagrafo = (chave: ChaveParagrafo): string => EXEMPLO_PARAGRAFOS[chave].frases.join(' ');
