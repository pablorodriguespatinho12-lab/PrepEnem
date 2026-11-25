// Quadro de conta (Pablo, 24/11/2026, regras 17, 18 e 24): a tela mostra a CONTA desenhada, em
// fração quando for divisão, e a explicação fica só na fala do professor. Pelo menos 80% das
// telas de uma lousa de exatas são só equação; as outras dizem o que a questão quer e quais dados pegar.
// Funções puras: texto da aula do robô entra, telas de lousa saem.
import { contaVerdadeira } from './conta-verdadeira';
import { expandirEquacao, legendasNaoCabem } from './equacao';
import type { Cena, Cor, Desenho, DesenhoEq, Fala } from './tipos';

type Peca = DesenhoEq['partes'][number];

// Regra 24: 80% é MÉDIA aproximada (Pablo: "não é exatamente 80%"); vale entre 70 e 90.
export const META_DE_CONTA = 0.8;
export const TOLERANCIA_DA_META = 0.1;
const MAX_PECAS = 12;
const DADOS_POR_TELA = 4;
const FILEIRAS_DE_DADOS = 2;
const LINHAS_POR_TELA = 3;
const Y_DAS_LINHAS = [95, 170, 245];
const Y_DE_DUAS_COM_FRACAO = [112, 215];
const LINHAS_COM_FRACAO = 2;
const LETRAS_DA_NOTA = 44;
const Y_DA_NOTA = 257;
const Y_DA_LINHA_COM_LEGENDA = 130;
const Y_DA_EQUACAO_COM_LISTA = 100;
const MAX_LEGENDAS_NA_LISTA = 6;
const TAM_UMA_LINHA = 44;
const TAM_VARIAS_LINHAS = 38;
const MAX_LEGENDA = 22;
const SEGUNDOS_POR_PECA = 0.5;
const SEGUNDOS_ENTRE_LINHAS = 0.8;
const TEMPO_INICIAL = 0.6;
const MAX_TITULO = 40;
const MAX_LETRAS_NA_PECA = 16;
// Duas contas na mesma linha: "t1 = 1 h; t2 = 2/3 h" e "S = 21, B = 10101".
const SEPARA_CONTAS = /\n|;\s*|,\s+(?=[A-Za-zπ][A-Za-z0-9]{0,2} =)/;
const PALAVRA_SOLTA = /^(?:a|o|as|os|de|da|do|das|dos|em|e|ou|para|com|que|na|no)$/i; // fim de legenda cortada não pode ser preposição
const MAX_LETRAS_DO_DADO = 24; // valor de dado pode ser "200 g a 30 °C"; a letra encolhe para caber
const FIM_DE_FRASE = /[.?!]\s+[A-ZÀ-Ú]/;
const PREPOSICAO = /(?:^| )(?:do|da|de|no|na)(?: |$|[.,;:])/;
// Conta de verdade: tem "=" e nenhuma palavra de 5 letras ou mais fora dos parênteses.
const PALAVRA_LONGA = /[a-zà-ú]{5,}/i;
const OPERADORES = new Set(['=', '+', '−', '-', '×', '÷', '·', '*']);
// "2/3", "x/2", "(a+b)/2": o termo INTEIRO tem de ser a fração; "72 km/h" é unidade e fica como está.
const FRACAO_PEQUENA = /^(\d[\d.,]*|[A-Za-z]|\([^()]{1,10}\))\/(\d[\d.,]*|[A-Za-z])$/;

const limpa = (s: string): string => s.replace(/(?<!R)\$|(?<=R)\$(?!\s?\d)/g, '').replace(/\s+/g, ' ').trim();

/** Parte a conta em termos e operadores; o operador só vale fora de parênteses ("(1 + 2/3)" é um termo só). */
function termosDaConta(l: string): string[] {
  const saida: string[] = [];
  let termo = '';
  let fundo = 0;
  const fecha = (): void => {
    if (termo) saida.push(termo);
    termo = '';
  };
  for (const t of l.split(' ')) {
    if (fundo === 0 && OPERADORES.has(t)) {
      fecha();
      saida.push(t);
      continue;
    }
    termo = termo ? `${termo} ${t}` : t;
    fundo += (t.match(/\(/g) ?? []).length - (t.match(/\)/g) ?? []).length;
  }
  fecha();
  return saida;
}

/** Um termo é fração em pé quando vem entre "÷"; "a/b" simples também. Null = divisão em cadeia, que não cabe. */
function virarFracoes(tokens: string[]): string[] | null {
  const saida: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === '÷') {
      const antes = saida[saida.length - 1];
      const depois = tokens[i + 1];
      if (antes === undefined || depois === undefined || OPERADORES.has(antes) || OPERADORES.has(depois) || antes.includes('|')) return null;
      saida[saida.length - 1] = `${antes}|${depois}`;
      i++;
      continue;
    }
    const m = FRACAO_PEQUENA.exec(t);
    saida.push(m ? `${m[1]}|${m[2]}` : t);
  }
  return saida;
}

/** "9 × 4 = 36" → peças da equação; null se não é conta, é comprida demais ou a peça não cabe.
 *  `comPalavras`: fórmula do livro ("v = distância ÷ tempo") aceita nomes; linha de explicação, não. */
export function pecasDaConta(linha: string, comPalavras = false): Peca[] | null {
  const l = limpa(linha);
  if (!l.includes('=')) return null;
  if (!comPalavras && PREPOSICAO.test(l.replace(/\([^)]*\)/g, ''))) return null;
  if (!comPalavras && FIM_DE_FRASE.test(l)) return null; // "= 32 ÷ 96. Como 96 = …" são duas frases: quem separa é contasNaFrase
  if (!comPalavras && PALAVRA_LONGA.test(l.replace(/\([^)]*\)/g, ''))) return null;
  const tokens = virarFracoes(termosDaConta(l));
  if (!tokens || tokens.length < 3 || tokens.length > MAX_PECAS) return null;
  if (tokens.some((t) => t.split('|').some((x) => x.length > MAX_LETRAS_NA_PECA))) return null;
  if (legendasNaoCabem(tokens.map((s) => ({ s })))) return null; // larga demais até sem legenda: vazaria do quadro
  return tokens.map((s) => ({ s: s.replace(/\b(\d{1,3}) (\d{3})\b/g, '$1 $2') }));
}

/** Legenda curta: tira o aparte "(o que a questão quer)" e corta em palavra inteira até 22 letras. */
export function legendaCurta(oque: string): string | undefined {
  const sem = limpa(oque.replace(/\([^)]*\)/g, ''));
  if (!sem) return undefined;
  if (sem.length <= MAX_LEGENDA) return sem;
  const corte = sem.slice(0, MAX_LEGENDA + 1).lastIndexOf(' ');
  if (corte <= 3) return sem.slice(0, MAX_LEGENDA);
  const palavras = sem.slice(0, corte).split(' ');
  while (palavras.length > 1 && PALAVRA_SOLTA.test(palavras[palavras.length - 1])) palavras.pop();
  return palavras.join(' ').replace(PONTUACAO_FINAL, '');
}

const titulo = (s: string): Desenho => {
  const t = tituloCortado(s, MAX_TITULO);
  return { k: 'tx', x: 200, y: 34, s: t, cor: 'tinta', tam: Math.min(28, Math.floor(360 / (t.length * 0.4))), t: 0.2 };
};

/** Título que não cabe perde o aparte aberto em vez de terminar em "(2 de". */
const tituloCortado = (s: string, max: number): string => s.slice(0, max).replace(/\s*\([^)]*$/, '').trimEnd();

/** "nome (2)" sem cortar o número: quem encurta é o nome. */
export function tituloNumerado(nome: string, n: number): string {
  const numero = ` (${n})`;
  return `${tituloCortado(nome, MAX_TITULO - numero.length)}${numero}`;
}

/** Frase curta no pé do quadro (a "pista"): até 2 linhas de 44 letras, centrada, em cinza. */
function notaDeRodape(nota: string, t: number): Desenho[] {
  const palavras = limpa(nota).split(' ');
  const linhas: string[] = [];
  let atual = '';
  for (const p of palavras) {
    if (atual && atual.length + 1 + p.length > LETRAS_DA_NOTA) {
      linhas.push(atual);
      atual = p;
    } else atual = atual ? `${atual} ${p}` : p;
  }
  if (atual) linhas.push(atual);
  return linhas.slice(0, 2).map((s, i): Desenho => ({ k: 'tx', x: 200, y: Y_DA_NOTA + i * 19, s: i === 1 && linhas.length > 2 ? `${s}…` : s, cor: 'cinza', tam: 17, t: t + i * 0.3, ancora: 'middle' }));
}

/** Na tela de continuação, a frase que fala dos números DAQUELA tela; sem nenhuma, a última. */
function falaDaPagina(fala: Fala[], pagina: Peca[][]): Fala[] {
  const numeros = pagina.flat().flatMap((p) => p.s.split('|')).filter((s) => /\d/.test(s));
  const pontos = fala.map(([, frase]) => numeros.filter((n) => frase.includes(n)).length);
  const melhor = pontos.lastIndexOf(Math.max(...pontos));
  return melhor < 0 ? [] : [[fala[0][0], fala[melhor][1]]];
}

/** Telas só de conta: até 3 linhas por tela, cada linha aparecendo depois da anterior. */
export function telasDeContas(nome: string, contas: Peca[][], fala: Fala[], nota?: string): Cena[] {
  const telas: Cena[] = [];
  for (let i = 0, n = 0; i < contas.length; n++) {
    // Fração ocupa 3 alturas de linha: com fração na página, só 2 linhas cabem.
    // Conta com legendas que não cabem lado a lado ganha a tela só para ela, com as legendas em lista.
    const proximas = contas.slice(i, i + LINHAS_POR_TELA);
    const primeiraLonga = proximas.findIndex((c) => legendasNaoCabem(c));
    const tres = primeiraLonga < 0 ? proximas : proximas.slice(0, Math.max(1, primeiraLonga));
    const emLista = tres.length === 1 && legendasNaoCabem(tres[0]);
    const comNota = n === 0 && !!nota;
    const pagina = comNota || tres.some((c) => c.some((p) => p.s.includes('|'))) ? tres.slice(0, LINHAS_COM_FRACAO) : tres;
    i += pagina.length;
    const tam = pagina.length === 1 ? TAM_UMA_LINHA : TAM_VARIAS_LINHAS;
    const ys = emLista ? [Y_DA_EQUACAO_COM_LISTA] : pagina.length === 1 ? [Y_DAS_LINHAS[1]] : pagina.length === 2 && pagina.some((c) => c.some((p) => p.s.includes('|'))) ? Y_DE_DUAS_COM_FRACAO : Y_DAS_LINHAS;
    let t = TEMPO_INICIAL;
    const desenho: Desenho[] = [titulo(n ? tituloNumerado(nome, n + 1) : nome)];
    pagina.forEach((partes, k) => {
      desenho.push(...expandirEquacao({ k: 'eq', y: ys[k], t, tam, partes }, { emLista }));
      t += partes.length * SEGUNDOS_POR_PECA + SEGUNDOS_ENTRE_LINHAS;
    });
    if (comNota) desenho.push(...notaDeRodape(nota!, t));
    telas.push({ tipo: 'lousa', fala: n === 0 ? fala : falaDaPagina(fala, pagina), desenho });
  }
  return telas;
}

/** A fórmula com a legenda embaixo de cada letra (regra 18). Letras que não aparecem nela vão numa 2ª linha. null = fórmula não vira conta. */
export function telaDaFormula(formula: string, letras: { letra: string; oque: string }[], fala: Fala[], cor: Cor = 'verde'): Cena | null {
  // " e " são duas contas numa linha: desenhadas juntas, uma cobre a outra.
  const base = / e /.test(formula) ? null : pecasDaConta(formula, true);
  if (!base) return null;
  const legendas = new Map(letras.map((l) => [limpa(l.letra), legendaCurta(l.oque)]));
  const usadas = new Set<string>();
  const partes: Peca[] = base.map((p) => {
    const leg = legendas.get(p.s);
    if (leg) usadas.add(p.s);
    return leg ? { s: p.s, leg, cor } : { s: p.s, cor: p.s === '=' ? ('tinta' as Cor) : cor };
  });
  const faltam = letras.filter((l) => !usadas.has(limpa(l.letra)) && legendaCurta(l.oque)).slice(0, 4);
  // Legendas compridas viram lista embaixo da equação, junto das letras que ficaram de fora.
  const extras: Peca[] = faltam.map((l) => ({ s: limpa(l.letra), leg: legendaCurta(l.oque) }));
  const emLista = (legendasNaoCabem(partes) || legendasNaoCabem(extras)) && [...partes, ...extras].filter((p) => p.leg).length <= MAX_LEGENDAS_NA_LISTA;
  if (!emLista && legendasNaoCabem(partes)) return null; // legendas demais até para a lista: vai em texto
  const principal: DesenhoEq = { k: 'eq', y: emLista ? Y_DA_EQUACAO_COM_LISTA : Y_DA_LINHA_COM_LEGENDA, t: TEMPO_INICIAL, tam: TAM_UMA_LINHA, partes };
  const desenho: Desenho[] = [titulo('a equação'), ...expandirEquacao(principal, { emLista, extras: emLista ? extras : [] })];
  if (faltam.length && !emLista) {
    const t = TEMPO_INICIAL + partes.length * SEGUNDOS_POR_PECA + SEGUNDOS_ENTRE_LINHAS;
    desenho.push(...expandirEquacao({ k: 'eq', y: Y_DAS_LINHAS[2], t, tam: TAM_VARIAS_LINHAS, partes: faltam.map((l) => ({ s: limpa(l.letra), leg: legendaCurta(l.oque), cor: 'azul' as Cor })) }));
  }
  return { tipo: 'lousa', fala, desenho };
}

/** "O que eu tenho": cada dado é um valor com o nome embaixo, numa linha de até 4. Vazio = não dá para desenhar assim. */
export function telasDosDados(linhas: [string, string][], fala: Fala[]): Cena[] {
  const dados = linhas.map(([nome, valor]) => ({ s: limpa(valor), leg: legendaCurta(nome), cor: 'azul' as Cor }));
  if (dados.length < 1 || dados.some((d) => !d.s || d.s.length > MAX_LETRAS_DO_DADO)) return [];
  // Cada linha leva os dados cujas legendas cabem lado a lado; cada tela leva até 2 linhas.
  const fileiras = dados.reduce<Peca[][]>((feitas, dado) => {
    const ultima = feitas[feitas.length - 1];
    const cabe = !!ultima && ultima.length < DADOS_POR_TELA && !legendasNaoCabem([...ultima, dado]);
    return cabe ? [...feitas.slice(0, -1), [...ultima, dado]] : [...feitas, [dado]];
  }, []);
  const telas: Cena[] = [];
  for (let i = 0; i < fileiras.length; i += FILEIRAS_DE_DADOS) {
    const pagina = fileiras.slice(i, i + FILEIRAS_DE_DADOS);
    const nome = i ? `o que eu tenho (${i / FILEIRAS_DE_DADOS + 1})` : 'o que eu tenho';
    const ys = pagina.length === 1 ? [Y_DAS_LINHAS[1]] : Y_DE_DUAS_COM_FRACAO;
    let t = TEMPO_INICIAL;
    const desenho: Desenho[] = [titulo(nome)];
    pagina.forEach((partes, k) => {
      desenho.push(...expandirEquacao({ k: 'eq', y: ys[k], t, tam: pagina.length === 1 ? TAM_UMA_LINHA : TAM_VARIAS_LINHAS, partes }));
      t += partes.length * SEGUNDOS_POR_PECA;
    });
    telas.push({ tipo: 'lousa', fala: i === 0 ? fala : fala.slice(-1), desenho });
  }
  return telas;
}

const NUMERO = /^\d[\d.,]*(?:\u00a0\d{3}(?:,\d+)?)*(?:\u00a0(?:mil|milhão|milhões|bilhão|bilhões))?[²³]?%?$/;
const SIMBOLO = /^[A-Za-zπΔ][A-Za-z0-9²³]{0,2}$/;
const UNIDADE_COMPOSTA = /^[A-Za-z]{1,3}\/[A-Za-z]{1,3}$/;
const PALAVRA_ANTES_DO_IGUAL = /^[A-Za-zÀ-ú]{2,8}$/;
const PONTUACAO_FINAL = /[.,;:]+$/;
const MIN_TOKENS_DA_CONTA = 3;
const MAX_TOKENS_DA_CONTA = 13;

const APARTE_COM_CONTA = /\(([^()]*=[^()]*)\)/g;
const INICIO_DE_MILHAR = /^\d{1,3}$/;
const RESTO_DE_MILHAR = /^\d{3}(?:,\d+)?[²³]?%?[.,;:)]*$/;
const ESCALA = /^(?:mil|milhão|milhões|bilhão|bilhões)[.,;:)]*$/;

/** "7 200" é um número só: sem juntar, a frase quebrava no espaço e a lousa mostrava "72 · 100 = 7". */
const juntaMilhar = (tokens: string[]): string[] =>
  tokens.reduce<string[]>((feitos, t) => {
    const antes = feitos[feitos.length - 1];
    // "2,4 milhões" também é um número só: sem a escala, "300 000 × 8 = 2,4" fica falso.
    const milhar = !!antes && RESTO_DE_MILHAR.test(t) && (INICIO_DE_MILHAR.test(antes) || /^\d{1,3}(?:\u00a0\d{3})+$/.test(antes));
    const cola = milhar || (!!antes && ESCALA.test(t) && NUMERO.test(antes));
    return cola ? [...feitos.slice(0, -1), `${antes}\u00a0${t}`] : [...feitos, t];
  }, []);

// "4r", "0,8h", "4/3", "12/3": número colado na letra e fração em linha também são peças da conta.
const COEFICIENTE = /^\d[\d.,]*[A-Za-zπ][²³]?$/;
// "e 15 · 15", "Com π = 3": palavra curta que abre a frase não é letra da conta.
const ABRE_FRASE = /^(?:e|E|Com|Em|No|Na|Se|Há|São|Dá|Aí|Já)$/;

const tokenDeConta = (t: string): boolean =>
  !PREPOSICAO.test(t) && (OPERADORES.has(t) || NUMERO.test(t) || SIMBOLO.test(t) || UNIDADE_COMPOSTA.test(t) || COEFICIENTE.test(t) || FRACAO_PEQUENA.test(t));

/** Conta que começa ou termina em operador é pedaço de uma maior ("= 2 ·"): não vai para o quadro. */
const contaInteira = (janela: string[]): boolean => !OPERADORES.has(janela[0]) && !OPERADORES.has(janela[janela.length - 1]);

/** Contas escritas no meio de uma frase ("Raio = 30 ÷ 2 = 15 cm."): acha a sequência de símbolos que tem "=" e a devolve como peças. */
export function contasNaFrase(frase: string): Peca[][] {
  // Aparte entre parênteses que tem conta ("(24 · 20 = 480 e 24 · 4 = 96)") é um trecho à parte.
  const semAparte = limpa(frase).replace(APARTE_COM_CONTA, '; $1; ').replace(/\s+/g, ' ').trim();
  const tokens = juntaMilhar(semAparte.split(' '));
  const achadas: Peca[][] = [];
  let janela: string[] = [];
  const fecha = (): void => {
    // "(…) = 600 − 180 = 420": sem o "=" da frente a igualdade continua verdadeira; outro operador, não.
    const inteira = janela[0] === '=' ? janela.slice(1) : janela;
    if (inteira.includes('=') && inteira.length >= MIN_TOKENS_DA_CONTA && inteira.length <= MAX_TOKENS_DA_CONTA && contaInteira(inteira)) {
      const conta = pecasDaConta(inteira.join(' '), true);
      if (conta && contaVerdadeira(conta.map((p) => p.s))) achadas.push(conta);
    }
    janela = [];
  };
  tokens.forEach((bruto, i) => {
    if (bruto === ';') return fecha();
    // "96 e 24": o "e" entre duas contas é a palavra, não uma letra da conta.
    const ligaContas = bruto === 'e' && janela.includes('=') && !OPERADORES.has(janela[janela.length - 1]) && !OPERADORES.has(tokens[i + 1] ?? '');
    if (ligaContas) return fecha();
    // ")" que sobrou de um aparte cortado ("= 3 080.)") não faz parte do número.
    const solto = bruto.includes(')') && !bruto.includes('(') ? bruto.replace(/\)/g, '') : bruto;
    const t = solto.replace(PONTUACAO_FINAL, '');
    const termina = t !== bruto;
    const palavraAntes = tokens[i + 1] === '=' && janela.length === 0 && PALAVRA_ANTES_DO_IGUAL.test(t);
    if (janela.length === 0 && ABRE_FRASE.test(t)) return;
    if (t && (tokenDeConta(t) || palavraAntes)) {
      janela.push(t);
      if (termina) fecha();
    } else {
      fecha();
    }
  });
  fecha();
  return achadas;
}

/** Separa o texto de um passo: linhas que são conta (vão para o quadro) e o resto (vira só fala). */
export function separarContas(texto: string): { contas: Peca[][]; prosa: string } {
  const contas: Peca[][] = [];
  const prosa: string[] = [];
  for (const linha of texto.split(SEPARA_CONTAS)) {
    const partes = pecasDaConta(linha);
    if (partes && contaVerdadeira(partes.map((p) => p.s))) {
      contas.push(partes);
      continue;
    }
    if (!limpa(linha)) continue;
    prosa.push(limpa(linha));
    contas.push(...contasNaFrase(linha));
  }
  return { contas, prosa: prosa.join(' ') };
}

/** Tela de conta = toda peça escrita é centrada (equação); linha de texto corrido é `start`. Usado pelo teste dos 80%. */
export function ehTelaDeConta(c: Cena): boolean {
  if (c.tipo !== 'lousa') return false;
  const corpo = c.desenho.filter((d): d is Extract<Desenho, { k: 'tx' }> => d.k === 'tx' && d.y > 60);
  return corpo.length > 0 && corpo.every((d) => d.ancora === 'middle');
}
