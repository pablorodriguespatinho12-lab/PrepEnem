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
// Fontes dos fatos (só fato com fonte):
// - Hospital Colônia de Barbacena (MG), cerca de 60 mil mortos no século XX:
//   Daniela Arbex, Holocausto Brasileiro (Geração Editorial, 2013).
// - Lei 10.216, de 6 de abril de 2001 (Reforma Psiquiátrica), art. 2º,
//   parágrafo único, IX: tratamento "preferencialmente, em serviços
//   comunitários de saúde mental". planalto.gov.br/ccivil_03/leis/leis_2001/l10216.htm
// - CAPS I (o menor CAPS) indicado para municípios com mais de 20 mil
//   habitantes: Portaria GM/MS 3.088/2011, art. 7º, § 4º, I
//   (bvsms.saude.gov.br/bvs/saudelegis/gm/2011/prt3088_23_12_2011_rep.html);
//   a regra atual fala em 15 mil. Os dois limites ficam acima de 10 mil.
// - 2.495 dos 5.570 municípios (44,8%) têm até 10 mil habitantes: IBGE,
//   Censo 2022 (noticiado pela Band, 28/06/2023).
// - Michel Foucault, História da Loucura (1961); Erving Goffman, Estigma
//   (1963): as ideias são as de lib/redacao/autores.ts.

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
      { texto: 'Michel Foucault, em História da Loucura (1961)', funcao: 'repertorio', nota: 'Ponte, passo 1 (cita): autor, obra e ano.' },
      { texto: ', ' },
      { texto: 'a sociedade aprendeu a isolar quem foge da norma', funcao: 'repertorio', nota: 'Ponte, passo 2 (explica): a ideia do autor com suas palavras.' },
      { texto: '.' },
    ],
    [
      { texto: 'Essa reflexão se aplica ao Brasil contemporâneo, onde o estigma associado às doenças mentais tem raízes antigas', funcao: 'ponte', nota: 'Isso é a ponte (passo 3, amarra): liga o autor ao Brasil de hoje, com as palavras do tema.' },
      { texto: ': ' },
      { texto: 'no Hospital Colônia de Barbacena (MG), cerca de 60 mil internos morreram ao longo do século XX', funcao: 'explicacao', fato: true, nota: 'Fato histórico com fonte (Daniela Arbex, Holocausto Brasileiro, 2013): prova que o problema é antigo.' },
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
      { texto: 'o sociólogo Erving Goffman, em Estigma (1963), mostra que a pessoa estigmatizada é reduzida a uma única marca e deixa de ser vista por inteiro', funcao: 'repertorio', nota: 'Repertório do 1º motivo: cita e explica a ideia do autor.' },
      { texto: '.' },
    ],
    [
      { texto: 'Isso se verifica no país quando alguém com depressão é chamado de fraco ou exagerado, o que o leva a esconder o sofrimento e a adiar a busca por ajuda', funcao: 'explicacao', nota: 'Ponte, passo 3 (amarra): onde a ideia de Goffman aparece no Brasil.' },
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
      { texto: 'a Lei 10.216, de 2001, conhecida como Lei da Reforma Psiquiátrica, determina que o tratamento ocorra, de preferência, em serviços comunitários, e não pelo isolamento em hospícios', funcao: 'repertorio', fato: true, nota: 'Repertório do 2º motivo e fato histórico: a lei de 2001 que fechou o caminho dos hospícios.' },
      { texto: '.' },
    ],
    [
      { texto: 'Na realidade brasileira, porém, ' },
      { texto: '44,8% dos municípios têm até 10 mil habitantes, porte menor que o indicado pelo Ministério da Saúde para abrir um CAPS', funcao: 'explicacao', fato: true, nota: 'Dado com fonte (IBGE, Censo 2022; Portaria 3.088/2011): a lei existe, mas o serviço não chega às cidades pequenas.' },
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
      { texto: 'por meio das redes sociais e das UBS', funcao: 'meio' },
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
      { texto: 'deve ampliar os CAPS', funcao: 'acao' },
      { texto: ', ' },
      { texto: 'por meio de verba vinculada', funcao: 'meio' },
      { texto: ', ' },
      { texto: 'com centros regionais para cidades vizinhas', funcao: 'detalhamento' },
      { texto: ', ' },
      { texto: 'a fim de levar tratamento ao interior', funcao: 'finalidade' },
      { texto: '.' },
    ],
    [
      { texto: 'Dessa forma, o país não repetirá o isolamento criticado por Foucault.', funcao: 'fechamento', nota: 'Frase final: volta ao autor da introdução.' },
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
      { passo: 'Cita', trecho: 'Michel Foucault, em História da Loucura (1961)' },
      { passo: 'Explica', trecho: 'a sociedade aprendeu a isolar quem foge da norma' },
      { passo: 'Amarra', trecho: 'em Barbacena (MG), cerca de 60 mil internos morreram ao longo do século XX' },
    ],
  },
  desenvolvimento1: {
    frases: frasesDe('desenvolvimento1'),
    ponte: [
      { passo: 'Cita', trecho: 'Erving Goffman, em Estigma (1963)' },
      { passo: 'Explica', trecho: 'a pessoa é reduzida a uma única marca' },
      { passo: 'Amarra', trecho: 'quem tem depressão é chamado de fraco e esconde o sofrimento' },
    ],
  },
  desenvolvimento2: {
    frases: frasesDe('desenvolvimento2'),
    ponte: [
      { passo: 'Cita', trecho: 'Lei 10.216, de 2001 (Reforma Psiquiátrica)' },
      { passo: 'Explica', trecho: 'tratar em serviços perto de casa, não isolar' },
      { passo: 'Amarra', trecho: '44,8% dos municípios têm até 10 mil habitantes, menos que o mínimo para um CAPS' },
    ],
  },
  conclusao: { frases: frasesDe('conclusao') },
};

export const exemploDoParagrafo = (chave: ChaveParagrafo): string => EXEMPLO_PARAGRAFOS[chave].frases.join(' ');
