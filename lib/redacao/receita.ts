// A receita de bolso da redação, em dados, para o Treino por partes guiado.
// Fonte única: docs/redacao/receita-redacao.md (Pablo, 27/10/2026). Nada aqui
// é regra nova: cada bloco diz de qual seção do arquivo veio. Sem IA: o site
// só mostra o molde, conta linhas e monta o texto; a correção é fora do site.

export type ChaveCausa = 'estado' | 'historia' | 'acesso' | 'estigma' | 'mercado';
export type ChaveParagrafo = 'introducao' | 'desenvolvimento1' | 'desenvolvimento2' | 'conclusao';
export type ChaveElemento = 'agente' | 'acao' | 'meio' | 'finalidade' | 'detalhamento';

export interface Causa {
  chave: ChaveCausa;
  nome: string;
  /* Como a causa entra no molde "Tal cenário decorre, sobretudo, de [causa]". */
  naTese: string;
  fraseDeTese: string;
  repertorios: string[];
}

/* "Coringas de argumento (as 5 causas)". */
export const CAUSAS: Causa[] = [
  {
    chave: 'estado', nome: 'Omissão do Estado', naTese: 'da omissão do Estado',
    fraseDeTese: '...por negligência estatal na garantia de direitos já previstos em lei',
    repertorios: ['CF art. 3º e 6º', 'Amartya Sen', 'José Murilo de Carvalho', 'Lei do SUS'],
  },
  {
    chave: 'historia', nome: 'Herança histórica', naTese: 'da herança histórica',
    fraseDeTese: '...por uma herança histórica de exclusão que ainda estrutura o país',
    repertorios: ['Celso Furtado', 'Sérgio Buarque', 'Lélia Gonzalez'],
  },
  {
    chave: 'acesso', nome: 'Desigualdade de acesso', naTese: 'da desigualdade de acesso',
    fraseDeTese: '...pela desigualdade de acesso, que separa quem pode de quem não pode',
    repertorios: ['Bourdieu', 'Piketty', 'Josué de Castro', 'Anísio Teixeira'],
  },
  {
    chave: 'estigma', nome: 'Estigma e invisibilidade', naTese: 'do estigma e da invisibilidade',
    fraseDeTese: '...pelo estigma social que torna esse grupo invisível',
    repertorios: ['Goffman', 'Hannah Arendt', 'Foucault', 'Nise da Silveira'],
  },
  {
    chave: 'mercado', nome: 'Mercado acima das pessoas', naTese: 'da lógica de mercado acima das pessoas',
    fraseDeTese: '...pela lógica de lucro que se sobrepõe ao bem-estar',
    repertorios: ['Zuboff', 'Ricardo Antunes', 'Byung-Chul Han', 'Ulrich Beck'],
  },
];

export const causaPorChave = (chave: ChaveCausa | null): Causa | null =>
  CAUSAS.find((c) => c.chave === chave) ?? null;

/* Tabela "Ano | Tema | Causas" da receita: a dupla recomendada para cada tema
   do ENEM, na ordem (1º motivo, 2º motivo). A ligação com o texto do tema é
   pela palavra que o identifica, sem acento e sem caixa. */
const DUPLAS_DA_RECEITA: { ano: number; palavra: string; causas: [ChaveCausa, ChaveCausa] }[] = [
  { ano: 2025, palavra: 'envelhecimento', causas: ['estigma', 'estado'] },
  { ano: 2024, palavra: 'heranca africana', causas: ['historia', 'estigma'] },
  { ano: 2023, palavra: 'trabalho de cuidado', causas: ['estigma', 'historia'] },
  { ano: 2022, palavra: 'povos tradicionais', causas: ['historia', 'estado'] },
  { ano: 2021, palavra: 'registro civil', causas: ['estado', 'estigma'] },
  { ano: 2020, palavra: 'doencas mentais', causas: ['estigma', 'estado'] },
  { ano: 2019, palavra: 'cinema', causas: ['acesso', 'mercado'] },
];
const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* O tema é "da lista" quando o texto é igual a um tema da lista, sem
   diferenciar maiúsculas e espaços. Pelo texto, não por um marcador gravado:
   rascunho de antes da sugestão existir não tinha o marcador (27/10/2026). */
const comparavel = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
export function ehTemaDaLista(tema: string, temasDaLista: string[]): boolean {
  const t = comparavel(tema);
  return t !== '' && temasDaLista.some((x) => comparavel(x) === t);
}
/* Dupla sugerida para um tema da lista; tema livre (digitado) não tem. */
export function duplaSugerida(tema: string, temasDaLista: string[]): [ChaveCausa, ChaveCausa] | null {
  if (!ehTemaDaLista(tema, temasDaLista)) return null;
  const t = semAcento(tema);
  return DUPLAS_DA_RECEITA.find((d) => t.includes(d.palavra))?.causas ?? null;
}

/* Molde da 3ª frase da introdução ("Frases-esqueleto"). */
export function moldeTese(causaA: ChaveCausa | null, causaB: ChaveCausa | null): string {
  const a = causaPorChave(causaA)?.naTese ?? 'de [causa A]';
  const b = causaPorChave(causaB)?.naTese ?? 'de [causa B]';
  return `Tal cenário decorre, sobretudo, ${a} e ${b}.`;
}

export interface FraseEsqueleto {
  funcao: string;
  molde: string;
}
export interface Paragrafo {
  chave: ChaveParagrafo;
  titulo: string;
  linhasMin: number;
  linhasMax: number;
  frases: FraseEsqueleto[];
}

/* "A receita" (linhas e função de cada frase) + "Frases-esqueleto" (molde). */
export const PARAGRAFOS: Paragrafo[] = [
  {
    chave: 'introducao', titulo: 'Introdução', linhasMin: 6, linhasMax: 7,
    frases: [
      { funcao: 'Repertório que abre o assunto', molde: 'Segundo [autor], em [obra], [ideia em suas palavras].' },
      { funcao: 'Ponte: liga o repertório ao Brasil de hoje, com as palavras do tema', molde: 'Essa reflexão se aplica ao Brasil contemporâneo, onde [problema do tema] ainda persiste.' },
      { funcao: 'Tese: opinião + causa A + causa B', molde: 'Tal cenário decorre, sobretudo, de [causa A] e de [causa B].' },
    ],
  },
  {
    chave: 'desenvolvimento1', titulo: 'Desenvolvimento 1', linhasMin: 7, linhasMax: 8,
    frases: [
      { funcao: 'Tópico frasal: causa A', molde: 'Em primeiro lugar, cabe destacar [causa A] como fator central de [problema].' },
      { funcao: 'Repertório do eixo', molde: 'Nesse sentido, [autor/lei/dado] mostra que [ideia].' },
      { funcao: 'Explicação: o que o repertório prova sobre a causa A', molde: 'Isso se verifica no país quando [exemplo concreto], o que [consequência].' },
      { funcao: 'Fechamento: volta à tese', molde: 'Assim, [causa A] mantém [problema do tema].' },
    ],
  },
  {
    chave: 'desenvolvimento2', titulo: 'Desenvolvimento 2', linhasMin: 7, linhasMax: 8,
    frases: [
      { funcao: 'Tópico frasal: causa B', molde: 'Além disso, [causa B] também contribui para [problema].' },
      { funcao: 'Repertório de outro autor/área', molde: 'Sob essa ótica, [repertório 2] evidencia que [ideia].' },
      { funcao: 'Explicação com exemplo brasileiro ou dado', molde: 'Na realidade brasileira, [exemplo ou dado], o que agrava [problema].' },
      { funcao: 'Fechamento: volta à tese', molde: 'Logo, enquanto [causa B] persistir, [problema] continuará.' },
    ],
  },
  {
    chave: 'conclusao', titulo: 'Conclusão', linhasMin: 6, linhasMax: 7,
    frases: [
      { funcao: 'Retoma o problema', molde: 'Portanto, é preciso enfrentar [causa A] e [causa B].' },
      { funcao: 'Proposta 1 contra causa A, 5 elementos', molde: 'Para isso, o [agente] deve [ação], por meio de [meio], a fim de [finalidade].' },
      /* A tabela da receita diz "Proposta 2 contra causa B (opcional)"; o esqueleto, "[Detalhamento]". */
      { funcao: 'Detalhamento, ou proposta 2 contra causa B (opcional)', molde: '[Detalhamento: como funciona, para quem, com quem.]' },
      { funcao: 'Frase final que retoma a abertura', molde: 'Dessa forma, [retoma a ideia do repertório da introdução].' },
    ],
  },
];

/* "A ponte em 3 passos (repertório produtivo)". */
export const PONTE = [
  { passo: 'Cita', o_que: 'autor + obra + ideia, em uma linha.' },
  { passo: 'Explica', o_que: 'o que a ideia diz, com suas palavras.' },
  { passo: 'Amarra', o_que: 'onde a ideia aparece no problema do tema, com um fato brasileiro.' },
];
export const PONTE_AVISO = 'Se não sai o passo 3 em 1 minuto, troque de repertório.';

/* "Proposta de intervenção (C5)". */
export const ELEMENTOS: { chave: ChaveElemento; nome: string; pergunta: string }[] = [
  { chave: 'agente', nome: 'Agente', pergunta: 'Quem faz?' },
  { chave: 'acao', nome: 'Ação', pergunta: 'Faz o quê?' },
  { chave: 'meio', nome: 'Meio', pergunta: 'Como?' },
  { chave: 'finalidade', nome: 'Finalidade', pergunta: 'Para quê?' },
  { chave: 'detalhamento', nome: 'Detalhamento', pergunta: 'Mais um detalhe' },
];
export const ERROS_PROPOSTA = '"é preciso que se faça" (sem agente); "conscientizar" sem dizer como; desrespeito a direitos humanos.';

export const CONECTIVOS = ['Em primeiro lugar', 'Além disso', 'Nesse sentido', 'Sob essa ótica', 'Diante disso', 'Portanto', 'Dessa forma'];

/* "Checklist antes de passar a limpo". */
export const CHECKLIST_FINAL = [
  'Palavras-chave do tema na introdução, tese e início de cada desenvolvimento',
  'Tese anuncia causa A e B, desenvolvimentos na mesma ordem',
  'Cada repertório com cita, explica, amarra',
  'Exemplo ou dado brasileiro em cada desenvolvimento',
  'Proposta com agente, ação, meio, finalidade, detalhamento',
  'Proposta ataca as causas discutidas',
  'Nenhum conectivo repetido em sequência',
  '25 a 30 linhas, sem identificação',
];
export const LINHAS_TOTAL = { min: 25, max: 30 };

/* ~70 caracteres por linha da folha (pedido do Pablo, 27/10/2026). Cada
   parágrafo começa numa linha nova, então a conta é por parágrafo. */
export const CARACTERES_POR_LINHA = 70;
export function contarLinhas(texto: string): number {
  return texto
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .reduce((soma, p) => soma + Math.ceil(p.length / CARACTERES_POR_LINHA), 0);
}

export type SituacaoLinhas = 'vazio' | 'curto' | 'na-meta' | 'longo';
export function situacaoLinhas(linhas: number, min: number, max: number): SituacaoLinhas {
  if (linhas === 0) return 'vazio';
  if (linhas < min) return 'curto';
  return linhas > max ? 'longo' : 'na-meta';
}

export function montarRedacao(paragrafos: Record<ChaveParagrafo, string>): string {
  return PARAGRAFOS.map((p) => paragrafos[p.chave].trim()).filter(Boolean).join('\n\n');
}
