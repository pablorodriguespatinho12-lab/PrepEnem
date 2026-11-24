// Quadro de conta (Pablo, 24/11/2026, regras 17, 18 e 24): a tela mostra a CONTA desenhada, em
// fração quando for divisão, e a explicação fica só na fala do professor. Pelo menos 80% das
// telas de uma lousa de exatas são só equação; as outras dizem o que a questão quer e quais dados pegar.
// Funções puras: texto da aula do robô entra, telas de lousa saem.
import { expandirEquacao } from './equacao';
import type { Cena, Cor, Desenho, DesenhoEq, Fala } from './tipos';

type Peca = DesenhoEq['partes'][number];

// Regra 24: 80% é MÉDIA aproximada (Pablo: "não é exatamente 80%"); vale entre 70 e 90.
export const META_DE_CONTA = 0.8;
export const TOLERANCIA_DA_META = 0.1;
const MAX_PECAS = 12;
const DADOS_POR_TELA = 4;
const LINHAS_POR_TELA = 3;
const Y_DAS_LINHAS = [95, 170, 245];
const Y_DE_DUAS_COM_FRACAO = [112, 215];
const LINHAS_COM_FRACAO = 2;
const Y_DA_LINHA_COM_LEGENDA = 130;
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
// Conta de verdade: tem "=" e nenhuma palavra de 5 letras ou mais fora dos parênteses.
const PALAVRA_LONGA = /[a-zà-ú]{5,}/i;
const OPERADORES = new Set(['=', '+', '−', '-', '×', '÷', '·', '*']);
// "2/3", "x/2", "(a+b)/2": o termo INTEIRO tem de ser a fração; "72 km/h" é unidade e fica como está.
const FRACAO_PEQUENA = /^(\d[\d.,]*|[A-Za-z]|\([^()]{1,10}\))\/(\d[\d.,]*|[A-Za-z])$/;

const limpa = (s: string): string => s.replace(/\$/g, '').replace(/\s+/g, ' ').trim();

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
  if (!comPalavras && PALAVRA_LONGA.test(l.replace(/\([^)]*\)/g, ''))) return null;
  const tokens = virarFracoes(termosDaConta(l));
  if (!tokens || tokens.length < 3 || tokens.length > MAX_PECAS) return null;
  if (tokens.some((t) => t.split('|').some((x) => x.length > MAX_LETRAS_NA_PECA))) return null;
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
  const t = s.slice(0, MAX_TITULO);
  return { k: 'tx', x: 200, y: 34, s: t, cor: 'tinta', tam: Math.min(28, Math.floor(360 / (t.length * 0.4))), t: 0.2 };
};

/** Telas só de conta: até 3 linhas por tela, cada linha aparecendo depois da anterior. */
export function telasDeContas(nome: string, contas: Peca[][], fala: Fala[]): Cena[] {
  const telas: Cena[] = [];
  for (let i = 0, n = 0; i < contas.length; n++) {
    // Fração ocupa 3 alturas de linha: com fração na página, só 2 linhas cabem.
    const tres = contas.slice(i, i + LINHAS_POR_TELA);
    const pagina = tres.some((c) => c.some((p) => p.s.includes('|'))) ? tres.slice(0, LINHAS_COM_FRACAO) : tres;
    i += pagina.length;
    const tam = pagina.length === 1 ? TAM_UMA_LINHA : TAM_VARIAS_LINHAS;
    const ys = pagina.length === 1 ? [Y_DAS_LINHAS[1]] : pagina.length === 2 && pagina.some((c) => c.some((p) => p.s.includes('|'))) ? Y_DE_DUAS_COM_FRACAO : Y_DAS_LINHAS;
    let t = TEMPO_INICIAL;
    const desenho: Desenho[] = [titulo(n ? `${nome} (${n + 1})` : nome)];
    pagina.forEach((partes, k) => {
      desenho.push(...expandirEquacao({ k: 'eq', y: ys[k], t, tam, partes }));
      t += partes.length * SEGUNDOS_POR_PECA + SEGUNDOS_ENTRE_LINHAS;
    });
    telas.push({ tipo: 'lousa', fala: n === 0 ? fala : fala.slice(-1), desenho });
  }
  return telas;
}

/** A fórmula com a legenda embaixo de cada letra (regra 18). Letras que não aparecem nela vão numa 2ª linha. null = fórmula não vira conta. */
export function telaDaFormula(formula: string, letras: { letra: string; oque: string }[], fala: Fala[], cor: Cor = 'verde'): Cena | null {
  const base = pecasDaConta(formula, true);
  if (!base) return null;
  const legendas = new Map(letras.map((l) => [limpa(l.letra), legendaCurta(l.oque)]));
  const usadas = new Set<string>();
  const partes: Peca[] = base.map((p) => {
    const leg = legendas.get(p.s);
    if (leg) usadas.add(p.s);
    return leg ? { s: p.s, leg, cor } : { s: p.s, cor: p.s === '=' ? ('tinta' as Cor) : cor };
  });
  const faltam = letras.filter((l) => !usadas.has(limpa(l.letra)) && legendaCurta(l.oque)).slice(0, 4);
  const desenho: Desenho[] = [titulo('a equação'), ...expandirEquacao({ k: 'eq', y: Y_DA_LINHA_COM_LEGENDA, t: TEMPO_INICIAL, tam: TAM_UMA_LINHA, partes })];
  if (faltam.length) {
    const t = TEMPO_INICIAL + partes.length * SEGUNDOS_POR_PECA + SEGUNDOS_ENTRE_LINHAS;
    desenho.push(...expandirEquacao({ k: 'eq', y: Y_DAS_LINHAS[2], t, tam: TAM_VARIAS_LINHAS, partes: faltam.map((l) => ({ s: limpa(l.letra), leg: legendaCurta(l.oque), cor: 'azul' as Cor })) }));
  }
  return { tipo: 'lousa', fala, desenho };
}

/** "O que eu tenho": cada dado é um valor com o nome embaixo, numa linha de até 4. Vazio = não dá para desenhar assim. */
export function telasDosDados(linhas: [string, string][], fala: Fala[]): Cena[] {
  const dados = linhas.map(([nome, valor]) => ({ s: limpa(valor), leg: legendaCurta(nome), cor: 'azul' as Cor }));
  if (dados.length < 1 || dados.some((d) => !d.s || d.s.length > MAX_LETRAS_DO_DADO)) return [];
  const telas: Cena[] = [];
  for (let i = 0; i < dados.length; i += DADOS_POR_TELA) {
    const pagina = dados.slice(i, i + DADOS_POR_TELA);
    const nome = i ? `o que eu tenho (${i / DADOS_POR_TELA + 1})` : 'o que eu tenho';
    telas.push({ tipo: 'lousa', fala: i === 0 ? fala : fala.slice(-1), desenho: [titulo(nome), ...expandirEquacao({ k: 'eq', y: Y_DAS_LINHAS[1], t: TEMPO_INICIAL, tam: TAM_UMA_LINHA, partes: pagina })] });
  }
  return telas;
}

const NUMERO = /^\d[\d.,]*[²³]?%?$/;
const SIMBOLO = /^[A-Za-zπΔ][A-Za-z0-9²³]{0,2}$/;
const UNIDADE_COMPOSTA = /^[A-Za-z]{1,3}\/[A-Za-z]{1,3}$/;
const PALAVRA_ANTES_DO_IGUAL = /^[A-Za-zÀ-ú]{2,8}$/;
const PONTUACAO_FINAL = /[.,;:]+$/;
const MIN_TOKENS_DA_CONTA = 3;
const MAX_TOKENS_DA_CONTA = 13;

const tokenDeConta = (t: string): boolean => OPERADORES.has(t) || NUMERO.test(t) || SIMBOLO.test(t) || UNIDADE_COMPOSTA.test(t);

/** Contas escritas no meio de uma frase ("Raio = 30 ÷ 2 = 15 cm."): acha a sequência de símbolos que tem "=" e a devolve como peças. */
export function contasNaFrase(frase: string): Peca[][] {
  const tokens = limpa(frase).split(' ');
  const achadas: Peca[][] = [];
  let janela: string[] = [];
  const fecha = (): void => {
    if (janela.includes('=') && janela.length >= MIN_TOKENS_DA_CONTA && janela.length <= MAX_TOKENS_DA_CONTA) {
      const conta = pecasDaConta(janela.join(' '), true);
      if (conta) achadas.push(conta);
    }
    janela = [];
  };
  tokens.forEach((bruto, i) => {
    const t = bruto.replace(PONTUACAO_FINAL, '');
    const termina = t !== bruto;
    const palavraAntes = tokens[i + 1] === '=' && janela.length === 0 && PALAVRA_ANTES_DO_IGUAL.test(t);
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
    if (partes) {
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
