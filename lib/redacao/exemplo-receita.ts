// A redação pronta do Treino por partes: ENEM 2020, estigma das doenças
// mentais, com as causas 4 + 1 da tabela da receita (estigma e omissão do
// Estado). Escrita à mão, frase por frase no molde de PARAGRAFOS e com a ponte
// em 3 passos; sem IA e sem Neon. É exemplo de ESTRUTURA: a tela avisa para
// não copiar.
//
// Guardada como lista de trechos {texto, funcao}, não como string com
// índices: mudar uma palavra não desloca o grifo dos outros trechos. O "Ver
// exemplo" de cada passo e a "redação pronta, explicada" saem daqui.
//
// Só o repertório do Trio 1 (Pablo, 07/11/2026: "eu só sei os trios...
// nada mais"): Drummond + Pacto na introdução, Rui Barbosa no D1, Dom Hélder
// no D2. Antes eram Foucault, Barbacena, Goffman, Lei 10.216 e um dado do
// IBGE, fatos que ele não decorou. Ligação = fato do dia a dia, sem número.

import type { ChaveCausa, ChaveParagrafo } from './receita';

export const EXEMPLO_TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';
export const EXEMPLO_ANO = 2020;
export const EXEMPLO_CAUSAS: [ChaveCausa, ChaveCausa] = ['estigma', 'estado'];

export type FuncaoTrecho =
  | 'repertorio' | 'ponte' | 'tese' | 'topico' | 'explicacao' | 'fechamento'
  | 'agente' | 'acao' | 'meio' | 'finalidade' | 'detalhamento';

export interface Trecho {
  texto: string;
  /* Sem função: conectivo ou ligação, fica sem grifo. */
  funcao?: FuncaoTrecho;
  /* A linha que aparece ao tocar, quando a do grupo não basta. */
  nota?: string;
  /* Fato histórico com fonte (ver o topo do arquivo). */
  fato?: boolean;
}
export type Frase = Trecho[];

export interface FuncaoInfo {
  chave: FuncaoTrecho;
  rotulo: string;
  explica: string;
  /* Funções da proposta ficam juntas na legenda, uma a uma. */
  proposta?: boolean;
}
/* A legenda, na ordem em que as funções aparecem na redação. */
export const FUNCOES: FuncaoInfo[] = [
  { chave: 'repertorio', rotulo: 'Repertório', explica: 'Isso é o repertório: autor, obra e a ideia dele com suas palavras.' },
  { chave: 'ponte', rotulo: 'Ponte com o Brasil', explica: 'Isso é a ponte: liga o autor ao Brasil de hoje.' },
  { chave: 'tese', rotulo: 'Tese', explica: 'Isso é a tese: o problema e os 2 motivos, na ordem dos parágrafos.' },
  { chave: 'topico', rotulo: 'Tópico frasal', explica: 'Isso é o tópico frasal: diz qual motivo o parágrafo vai provar.' },
  { chave: 'explicacao', rotulo: 'Explicação e dado', explica: 'Isso é a explicação: um fato do Brasil que prova o motivo.' },
  { chave: 'fechamento', rotulo: 'Fechamento', explica: 'Isso é o fechamento: volta à tese e amarra o parágrafo.' },
  { chave: 'agente', rotulo: 'Agente', explica: 'Isso é o agente da proposta: quem faz.', proposta: true },
  { chave: 'acao', rotulo: 'Ação', explica: 'Isso é a ação: o que o agente faz.', proposta: true },
  { chave: 'meio', rotulo: 'Meio', explica: 'Isso é o meio: como a ação acontece.', proposta: true },
  { chave: 'finalidade', rotulo: 'Finalidade', explica: 'Isso é a finalidade: para que serve a ação.', proposta: true },
  { chave: 'detalhamento', rotulo: 'Detalhamento', explica: 'Isso é o detalhamento: um detalhe a mais sobre a proposta.', proposta: true },
];
export const funcaoInfo = (f: FuncaoTrecho): FuncaoInfo => FUNCOES.find((x) => x.chave === f)!;

/* Uma frase por função do molde, na ordem de PARAGRAFOS. */
export const REDACAO_GRIFADA: Record<ChaveParagrafo, Frase[]> = {
  introducao: [
    [
      { texto: 'Segundo ' },
      { texto: 'Carlos Drummond de Andrade, em "Nosso tempo"', funcao: 'repertorio', nota: 'Ponte, passo 1 (cita): autor e obra. É o Drummond do Trio 1.' },
      { texto: ', ' },
      { texto: 'as leis não bastam, pois os lírios não nascem da lei', funcao: 'repertorio', nota: 'Ponte, passo 2 (explica): a lei sozinha não muda a vida.' },
      { texto: '.' },
    ],
    [
      { texto: 'Essa reflexão se aplica ao Brasil contemporâneo, onde o estigma associado às doenças mentais ainda persiste', funcao: 'ponte', nota: 'Isso é a ponte (passo 3, amarra): liga o autor ao Brasil de hoje, com as palavras do tema.' },
      { texto: ': ' },
      { texto: 'o país assumiu o Pacto Internacional sobre Direitos Econômicos, Sociais e Culturais, mas o preconceito continua', funcao: 'explicacao', nota: 'O Pacto, a lei do Trio 1: o direito existe no papel, mas não na vida.' },
      { texto: '.' },
    ],
    [
      { texto: 'Esse estigma decorre, sobretudo, do preconceito social que esconde quem tem transtorno mental e da omissão do Estado no cuidado em saúde mental.', funcao: 'tese' },
    ],
  ],
  desenvolvimento1: [
    [
      { texto: 'Em primeiro lugar, ' },
      { texto: 'cabe destacar o preconceito social que esconde quem tem transtorno mental como fator central do estigma', funcao: 'topico' },
      { texto: '.' },
    ],
    [
      { texto: 'Nesse sentido, ' },
      { texto: 'Rui Barbosa, na "Oração aos Moços", mostra que tratar com igualdade quem está em situação desigual é desigualdade, e não igualdade real', funcao: 'repertorio', nota: 'Repertório do 1º motivo: Rui Barbosa, do Trio 1, citado como ideia.' },
      { texto: '.' },
    ],
    [
      { texto: 'Isso se verifica no país quando alguém com depressão recebe a mesma cobrança de quem está saudável e é chamado de fraco, o que o leva a esconder o sofrimento e a adiar a busca por ajuda', funcao: 'explicacao', nota: 'Ponte, passo 3 (amarra): quem está "desigual" aqui é quem está doente.' },
      { texto: '.' },
    ],
    [
      { texto: 'Assim, esse preconceito silencioso mantém o estigma vivo.', funcao: 'fechamento' },
    ],
  ],
  desenvolvimento2: [
    [
      { texto: 'Além disso, ' },
      { texto: 'a omissão do Estado no cuidado em saúde mental também contribui para o estigma', funcao: 'topico' },
      { texto: '.' },
    ],
    [
      { texto: 'Sob essa ótica, ' },
      { texto: 'Dom Hélder Câmara, chamado de santo ao dar comida aos pobres e de comunista ao perguntar por que eram pobres, evidencia que socorrer é aplaudido, mas investigar a causa incomoda', funcao: 'repertorio', nota: 'Repertório do 2º motivo: Dom Hélder, do Trio 1.' },
      { texto: '.' },
    ],
    [
      { texto: 'Na realidade brasileira, ' },
      { texto: 'campanhas de conscientização de um mês são elogiadas, mas pouco se pergunta por que é tão difícil conseguir um psicólogo de graça', funcao: 'explicacao', nota: 'Fato do dia a dia, sem número: a "comida" é a campanha; a pergunta incômoda é a falta de psicólogo.' },
      { texto: ', o que agrava o estigma.' },
    ],
    [
      { texto: 'Logo, enquanto essa omissão persistir, o estigma continuará.', funcao: 'fechamento' },
    ],
  ],
  conclusao: [
    [
      { texto: 'Portanto, é preciso enfrentar o preconceito e a omissão do Estado.', funcao: 'fechamento', nota: 'Retoma o problema e os 2 motivos, na mesma ordem.' },
    ],
    /* Uma proposta contra cada motivo (regra 3 da receita), cada uma com os 5 elementos. */
    [
      { texto: 'Para isso, ' },
      { texto: 'o Ministério da Saúde', funcao: 'agente', nota: 'Proposta 1 (contra o preconceito), agente: quem faz.' },
      { texto: ' ' },
      { texto: 'deve criar campanhas contra o estigma', funcao: 'acao' },
      { texto: ', ' },
      { texto: 'por meio das redes sociais e dos postos de saúde', funcao: 'meio' },
      { texto: ', ' },
      { texto: 'com relatos de pacientes', funcao: 'detalhamento' },
      { texto: ', ' },
      { texto: 'a fim de que quem sofre busque ajuda sem vergonha', funcao: 'finalidade' },
      { texto: '.' },
    ],
    [
      { texto: 'Já ' },
      { texto: 'o governo federal', funcao: 'agente', nota: 'Proposta 2 (contra a omissão do Estado), agente: quem faz.' },
      { texto: ' ' },
      { texto: 'deve contratar psicólogos', funcao: 'acao' },
      { texto: ', ' },
      { texto: 'por meio de verba vinculada', funcao: 'meio', nota: 'Verba vinculada: dinheiro que só pode ser gasto nisso.' },
      { texto: ', ' },
      { texto: 'nas cidades pequenas', funcao: 'detalhamento' },
      { texto: ', ' },
      { texto: 'a fim de levar tratamento ao interior', funcao: 'finalidade' },
      { texto: '.' },
    ],
    [
      { texto: 'Dessa forma, os lírios de Drummond poderão enfim nascer.', funcao: 'fechamento', nota: 'Frase final: volta ao autor da introdução.' },
    ],
  ],
};

export const textoDaFrase = (f: Frase): string => f.map((t) => t.texto).join('');

export const EXEMPLO_TESE = textoDaFrase(REDACAO_GRIFADA.introducao[2]);

export interface PassoDaPonte {
  passo: 'Cita' | 'Explica' | 'Amarra';
  trecho: string;
}
export interface ExemploParagrafo {
  /* Uma frase por função do molde, na mesma ordem. */
  frases: string[];
  ponte?: PassoDaPonte[];
}

const frasesDe = (chave: ChaveParagrafo) => REDACAO_GRIFADA[chave].map(textoDaFrase);
export const EXEMPLO_PARAGRAFOS: Record<ChaveParagrafo, ExemploParagrafo> = {
  introducao: {
    frases: frasesDe('introducao'),
    ponte: [
      { passo: 'Cita', trecho: 'Carlos Drummond de Andrade, em "Nosso tempo"' },
      { passo: 'Explica', trecho: 'a lei sozinha não muda a vida' },
      { passo: 'Amarra', trecho: 'o Brasil assumiu o Pacto, mas o preconceito continua' },
    ],
  },
  desenvolvimento1: {
    frases: frasesDe('desenvolvimento1'),
    ponte: [
      { passo: 'Cita', trecho: 'Rui Barbosa, na "Oração aos Moços"' },
      { passo: 'Explica', trecho: 'tratar igual quem está desigual não é igualdade real' },
      { passo: 'Amarra', trecho: 'quem tem depressão recebe a mesma cobrança dos saudáveis e é chamado de fraco' },
    ],
  },
  desenvolvimento2: {
    frases: frasesDe('desenvolvimento2'),
    ponte: [
      { passo: 'Cita', trecho: 'Dom Hélder Câmara' },
      { passo: 'Explica', trecho: 'socorrer é aplaudido; perguntar a causa incomoda' },
      { passo: 'Amarra', trecho: 'campanhas de um mês são elogiadas, mas falta psicólogo de graça' },
    ],
  },
  conclusao: { frases: frasesDe('conclusao') },
};

export const exemploDoParagrafo = (chave: ChaveParagrafo): string => EXEMPLO_PARAGRAFOS[chave].frases.join(' ');
