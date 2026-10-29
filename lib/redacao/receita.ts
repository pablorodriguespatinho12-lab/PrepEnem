// A receita de bolso da redação, em dados, para o Treino por partes guiado.
// Fonte única: docs/redacao/receita-redacao.md (Pablo, 27/10/2026). Nada aqui
// é regra nova: cada bloco diz de qual seção do arquivo veio. Estes dados são
// sem IA: o site mostra o molde, conta linhas e monta o texto; a correção é
// fora do site. A IA só aparece no "Me ajuda" (lib/redacao/ajuda.ts).

import { conteudoDoTema } from './conteudo-temas';
export type ChaveCausa = 'estado' | 'historia' | 'acesso' | 'estigma' | 'mercado';
export type ChaveParagrafo = 'introducao' | 'desenvolvimento1' | 'desenvolvimento2' | 'conclusao';
export type ChaveElemento = 'agente' | 'acao' | 'meio' | 'finalidade' | 'detalhamento';

export interface Causa {
  chave: ChaveCausa;
  nome: string;
  /* O nome no meio da frase: só a 1ª letra muda, "Estado" fica maiúsculo. */
  nomeNaFrase: string;
  /* A frase de tese da receita no molde "decorre, sobretudo, de [causa]". */
  naTese: string;
  fraseDeTese: string;
  repertorios: string[];
}

/* "Coringas de argumento (as 5 causas)". */
export const CAUSAS: Causa[] = [
  {
    chave: 'estado', nomeNaFrase: 'omissão do Estado', nome: 'Omissão do Estado', naTese: 'da negligência estatal na garantia de direitos já previstos em lei',
    fraseDeTese: '...por negligência estatal na garantia de direitos já previstos em lei',
    repertorios: ['CF art. 3º e 6º', 'Amartya Sen', 'José Murilo de Carvalho', 'Lei do SUS'],
  },
  {
    chave: 'historia', nomeNaFrase: 'herança histórica', nome: 'Herança histórica', naTese: 'de uma herança histórica de exclusão que ainda estrutura o país',
    fraseDeTese: '...por uma herança histórica de exclusão que ainda estrutura o país',
    repertorios: ['Celso Furtado', 'Sérgio Buarque', 'Lélia Gonzalez'],
  },
  {
    chave: 'acesso', nomeNaFrase: 'desigualdade de acesso', nome: 'Desigualdade de acesso', naTese: 'da desigualdade de acesso, que separa quem pode de quem não pode',
    fraseDeTese: '...pela desigualdade de acesso, que separa quem pode de quem não pode',
    repertorios: ['Bourdieu', 'Piketty', 'Josué de Castro', 'Anísio Teixeira'],
  },
  {
    chave: 'estigma', nomeNaFrase: 'estigma e invisibilidade', nome: 'Estigma e invisibilidade', /* Sem "esse grupo": a frase serve a tema livre, que pode não ter grupo
       nenhum ("mobilidade urbana"; Pablo, 29/10/2026). */
    naTese: 'do estigma social, que torna invisível quem sofre com o problema',
    fraseDeTese: '...pelo estigma social, que torna invisível quem sofre com o problema',
    repertorios: ['Goffman', 'Hannah Arendt', 'Foucault', 'Nise da Silveira'],
  },
  {
    chave: 'mercado', nomeNaFrase: 'mercado acima das pessoas', nome: 'Mercado acima das pessoas', naTese: 'da lógica de lucro que se sobrepõe ao bem-estar',
    fraseDeTese: '...pela lógica de lucro que se sobrepõe ao bem-estar',
    repertorios: ['Zuboff', 'Ricardo Antunes', 'Byung-Chul Han', 'Ulrich Beck'],
  },
];

export const causaPorChave = (chave: ChaveCausa | null): Causa | null =>
  CAUSAS.find((c) => c.chave === chave) ?? null;

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* O tema é "da lista" quando o texto é igual a um tema da lista, sem
   diferenciar maiúsculas e espaços. Pelo texto, não por um marcador gravado:
   rascunho de antes da sugestão existir não tinha o marcador (27/10/2026). */
const comparavel = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
export function ehTemaDaLista(tema: string, temasDaLista: string[]): boolean {
  const t = comparavel(tema);
  return t !== '' && temasDaLista.some((x) => comparavel(x) === t);
}
/* Dupla sugerida para um tema da lista: a tabela "Ano | Tema | Causas" da
   receita, em lib/redacao/conteudo-temas.ts. Tema livre (digitado) não tem. */
export function duplaSugerida(tema: string, temasDaLista: string[]): [ChaveCausa, ChaveCausa] | null {
  if (!ehTemaDaLista(tema, temasDaLista)) return null;
  return conteudoDoTema(tema)?.causas ?? null;
}
/* Motivos escolhidos que servem mal ao tema (só temas da receita). Avisa,
   não bloqueia: o aluno pode ter um bom argumento. */
export function motivosQueCombinamPouco(tema: string, causaA: ChaveCausa | null, causaB: ChaveCausa | null): ChaveCausa[] {
  const c = conteudoDoTema(tema);
  if (!c) return [];
  return [causaA, causaB].filter((x): x is ChaveCausa => x !== null && c.combinaPouco.includes(x));
}

/* O tema virado em "problema" para entrar nos moldes ("fator central de
   [problema]"). Só os começos que não são problema mudam: "Desafios para a
   valorização..." vira "a falta de valorização...", "Perspectivas acerca do
   envelhecimento..." vira "o desafio do envelhecimento...". Depois de ":" sai
   ("causas e soluções"). O resto fica como o aluno escreveu. */
export function problemaDoTema(tema: string): string {
  let p = tema.trim().replace(/\s+/g, ' ').split(':')[0].trim().replace(/[.!?]+$/, '');
  if (!p) return '';
  p = p.replace(/^(os\s+)?desafios\s+(para|de|da|do|das|dos)\s+((a|o|as|os)\s+)?/i, 'a falta de ');
  p = p.replace(/^perspectivas\s+acerca\s+d(o|a|os|as)\s+/i, 'o desafio d$1 ');
  /* Artigo no começo fica minúsculo; nome próprio ("Brasil") não muda. */
  return p.replace(/^(O|A|Os|As)\s/, (m) => m.toLowerCase());
}
const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/* Contração do português nos moldes: "de a falta" vira "da falta". */
const contrair = (s: string) =>
  s.replace(/\b(de|em) (o|a|os|as) /g, (_, prep: string, art: string) => `${prep === 'de' ? 'd' : 'n'}${art} `);
/* O tema escrito por inteiro (1ª vez na redação) e a forma curta (todas as
   outras). Tema da receita tem as duas escritas à mão; tema livre usa o
   problema inteiro sempre, para não perder as palavras-chave (regra 1). */
export function problemaCompleto(tema: string): string {
  return conteudoDoTema(tema)?.problema ?? problemaDoTema(tema);
}
export function problemaCurto(tema: string): string {
  return conteudoDoTema(tema)?.formaCurta ?? problemaCompleto(tema);
}
/* Na ponte ("se aplica ao Brasil contemporâneo, onde [problema]"), o "no
   Brasil" do fim do tema sai: senão a frase diz Brasil duas vezes (Pablo,
   29/10/2026). "Na sociedade brasileira" também, pelo mesmo motivo. */
export function problemaNaPonte(tema: string): string {
  return problemaCompleto(tema).replace(/\s+(no Brasil|na sociedade brasileira)$/i, '');
}
/* Troca o marcador pelo motivo. Motivo com vírgula no meio ("a herança da
   escravidão, que pôs...") abre um aposto: se a frase continua depois dele,
   fecha com outra vírgula ("..., que pôs a cultura à margem, mantém..."). */
function encaixar(molde: string, marcador: string, motivo: string): string {
  const partes = molde.split(marcador);
  if (!motivo.includes(',')) return partes.join(motivo);
  return partes.reduce((feito, resto) => `${feito}${motivo}${/^[.,;:!?]/.test(resto) ? '' : ','}${resto}`);
}
/* "o estigma" vira "Esse estigma": a tese vem logo depois da ponte, que já
   disse o tema inteiro. */
const comEsse = (s: string) => s.replace(/^(o|a|os|as)\s/i, (m) => ({ o: 'Esse ', a: 'Essa ', os: 'Esses ', as: 'Essas ' } as Record<string, string>)[m.trim().toLowerCase()]);
/* O motivo com as palavras do tema (tema da receita) ou o nome entre
   colchetes (tema livre: o aluno completa). */
export function motivoNoTema(causa: ChaveCausa | null, tema: string, reserva: string): string {
  const c = causaPorChave(causa);
  if (!c) return `[${reserva}]`;
  return conteudoDoTema(tema)?.topico[c.chave] ?? `[${c.nomeNaFrase}]`;
}
/* Molde da tese ("Frases-esqueleto"). Tema da receita: "Esse estigma decorre,
   sobretudo, do [motivo 1 no tema] e da [motivo 2 no tema]". Tema livre: o
   problema inteiro no lugar de "Tal cenário" (Pablo, 27/10/2026). */
export function moldeTese(causaA: ChaveCausa | null, causaB: ChaveCausa | null, tema = ''): string {
  const conteudo = conteudoDoTema(tema);
  if (conteudo && causaA && causaB) {
    const molde = `${comEsse(conteudo.formaCurta)} decorre, sobretudo, de [A] e de [B].`;
    return contrair(encaixar(encaixar(molde, '[A]', conteudo.topico[causaA]), '[B]', conteudo.topico[causaB]));
  }
  const a = causaPorChave(causaA)?.naTese ?? 'de [causa A]';
  const b = causaPorChave(causaB)?.naTese ?? 'de [causa B]';
  const problema = problemaDoTema(tema);
  return encaixar(encaixar(`${problema ? maiuscula(problema) : 'Tal cenário'} decorre, sobretudo, [A] e [B].`, '[A]', a), '[B]', b);
}
/* Troca [problema do tema] e [problema] do molde pelo problema do tema, com a
   contração do português ("de a falta" vira "da falta"). Sem tema, o molde
   fica como está. A forma inteira só vai no 1º lugar onde o tema aparece. */
export function preencherProblema(molde: string, tema: string, forma: 'completa' | 'curta' | 'ponte' = 'completa'): string {
  const problema = { completa: problemaCompleto, curta: problemaCurto, ponte: problemaNaPonte }[forma](tema);
  if (!problema) return molde;
  return contrair(molde.split('[problema do tema]').join(problema).split('[problema]').join(problema));
}
/* Palavras que dizem do que o tema trata: sem as que servem para qualquer
   tema ("desafios", "sociedade", "brasileira"). Regra 1 da receita: elas
   aparecem na tese. A comparação é pelo começo da palavra (5 letras), para
   "mentais" achar "mental". */
const PALAVRAS_DE_TODO_TEMA = new Set([
  'desafios', 'desafio', 'perspectivas', 'acerca', 'sociedade', 'brasileira', 'brasileiro', 'brasileiros',
  'brasileiras', 'brasil', 'contemporaneo', 'caminhos', 'para', 'como', 'entre', 'frente', 'seus', 'suas',
  'causas', 'solucoes', 'superacao', 'importancia', 'impactos', 'combate', 'questao',
]);
const raiz = (p: string) => p.slice(0, 5);
const palavrasDe = (s: string) => semAcento(s).split(/[^a-z]+/).filter((p) => p.length >= 4);
export function palavrasChaveDoTema(tema: string): string[] {
  return Array.from(new Set(palavrasDe(tema.split(':')[0]).filter((p) => !PALAVRAS_DE_TODO_TEMA.has(p))));
}
/* true também sem tema ou sem tese: só avisa quando há o que comparar. */
export function teseTemPalavraDoTema(tese: string, tema: string): boolean {
  const chaves = palavrasChaveDoTema(tema);
  if (!tese.trim() || chaves.length === 0) return true;
  const naTese = new Set(palavrasDe(tese).map(raiz));
  return chaves.some((c) => naTese.has(raiz(c)));
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
      { funcao: 'Tese: opinião + motivo 1 + motivo 2', molde: 'Tal cenário decorre, sobretudo, de [causa A] e de [causa B].' },
    ],
  },
  {
    chave: 'desenvolvimento1', titulo: 'Desenvolvimento 1', linhasMin: 7, linhasMax: 8,
    frases: [
      { funcao: 'Tópico frasal: motivo 1', molde: 'Em primeiro lugar, cabe destacar [causa A] como fator central de [problema].' },
      { funcao: 'Repertório que prova o motivo 1', molde: 'Nesse sentido, [autor/lei/dado] mostra que [ideia].' },
      { funcao: 'Explicação: o que o repertório prova sobre o motivo 1', molde: 'Isso se verifica no país quando [exemplo concreto], o que [consequência].' },
      { funcao: 'Fechamento: volta à tese', molde: 'Assim, [causa A] mantém [problema do tema].' },
    ],
  },
  {
    chave: 'desenvolvimento2', titulo: 'Desenvolvimento 2', linhasMin: 7, linhasMax: 8,
    frases: [
      { funcao: 'Tópico frasal: motivo 2', molde: 'Além disso, [causa B] também contribui para [problema].' },
      { funcao: 'Repertório de outro autor, que prova o motivo 2', molde: 'Sob essa ótica, [repertório 2] evidencia que [ideia].' },
      { funcao: 'Explicação com exemplo brasileiro ou dado', molde: 'Na realidade brasileira, [exemplo ou dado], o que agrava [problema].' },
      { funcao: 'Fechamento: volta à tese', molde: 'Logo, enquanto [causa B] persistir, [problema] continuará.' },
    ],
  },
  {
    chave: 'conclusao', titulo: 'Conclusão', linhasMin: 6, linhasMax: 7,
    frases: [
      { funcao: 'Retoma o problema', molde: 'Portanto, é preciso enfrentar [causa A] e [causa B].' },
      { funcao: 'Proposta 1 contra o motivo 1, 5 elementos', molde: 'Para isso, o [agente] deve [ação contra a causa A], por meio de [meio], com [detalhamento], a fim de [finalidade].' },
      /* Regra 3 da receita: a proposta resolve as causas discutidas, as 2
         (Pablo, 28/10/2026). O detalhamento vai dentro de cada proposta. */
      { funcao: 'Proposta 2 contra o motivo 2, 5 elementos', molde: 'Já o [agente] deve [ação contra a causa B], por meio de [meio], com [detalhamento], a fim de [finalidade].' },
      { funcao: 'Frase final que retoma a abertura', molde: 'Dessa forma, [retoma a ideia do repertório da introdução].' },
    ],
  },
];

/* O tema aparece por inteiro na ponte da introdução (1º lugar onde é usado);
   daí em diante, na forma curta. */
const ehPrimeiroUsoDoTema = (chave: ChaveParagrafo, i: number) => chave === 'introducao' && i === 1;
/* O molde de uma frase pronto para a tela: motivos e problema trocados. A tese
   (3ª frase da introdução) vem de moldeTese. */
export function moldeDaFrase(chave: ChaveParagrafo, i: number, tema: string, causaA: ChaveCausa | null, causaB: ChaveCausa | null): string {
  if (chave === 'introducao' && i === 2) return moldeTese(causaA, causaB, tema);
  const molde = PARAGRAFOS.find((p) => p.chave === chave)?.frases[i]?.molde ?? '';
  const comMotivos = encaixar(encaixar(molde, '[causa A]', motivoNoTema(causaA, tema, 'causa A')), '[causa B]', motivoNoTema(causaB, tema, 'causa B'));
  return preencherProblema(comMotivos, tema, ehPrimeiroUsoDoTema(chave, i) ? 'ponte' : 'curta');
}
/* A tese do passo 3 entra sozinha como 3ª frase da introdução: o aluno não a
   reescreve. Rascunho antigo que já tinha a tese no texto não a ganha duas vezes. */
export function introducaoComTese(introducao: string, tese: string): string {
  const t = tese.trim();
  if (!t || introducao.includes(t)) return introducao.trim();
  return [introducao.trim(), t].filter(Boolean).join(' ');
}
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
  'Tese anuncia os 2 motivos, desenvolvimentos na mesma ordem',
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

export function montarRedacao(paragrafos: Record<ChaveParagrafo, string>, tese = ''): string {
  const comTese = { ...paragrafos, introducao: introducaoComTese(paragrafos.introducao, tese) };
  return PARAGRAFOS.map((p) => comTese[p.chave].trim()).filter(Boolean).join('\n\n');
}
