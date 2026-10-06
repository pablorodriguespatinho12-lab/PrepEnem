// Leitor de expressões matemáticas em x, sem eval. A IA descreve o gráfico
// como texto ("x^2 - 4", "2sin(x)", "sqrt(x+1)") e o app desenha: o traço é
// calculado aqui, ponto a ponto, então eixo e valores nunca saem inventados.
//
// Gramática (precedência crescente):
//   soma    := produto (('+' | '-') produto)*
//   produto := unario (('*' | '/' | implícito) unario)*
//   unario  := '-' unario | potencia
//   potencia:= atomo ('^' unario)?          -- à direita: 2^3^2 = 2^9
//   atomo   := número | x | constante | função '(' soma ')' | '(' soma ')'

export type Funcao = (x: number) => number;

const FUNCOES: Record<string, (v: number) => number> = {
  sin: Math.sin, sen: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan,
  sqrt: Math.sqrt, raiz: Math.sqrt, abs: Math.abs, exp: Math.exp,
  ln: Math.log, log: Math.log10,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
};

const CONSTANTES: Record<string, number> = { pi: Math.PI, e: Math.E };

type Token =
  | { tipo: 'num'; valor: number }
  | { tipo: 'nome'; valor: string }
  | { tipo: 'op'; valor: string };

function tokenizar(fonte: string): Token[] {
  const texto = fonte.replace(/\s+/g, '').replace(/\*\*/g, '^').replace(/π/g, 'pi').replace(/,/g, '.').toLowerCase();
  const tokens: Token[] = [];
  let i = 0;
  while (i < texto.length) {
    const c = texto[i];
    if (/[0-9.]/.test(c)) {
      const m = /^[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/.exec(texto.slice(i)) ?? /^[0-9]+\.?/.exec(texto.slice(i));
      if (!m) throw new Error(`Número inválido em "${fonte}"`);
      tokens.push({ tipo: 'num', valor: Number(m[0]) });
      i += m[0].length;
    } else if (/[a-z]/.test(c)) {
      const m = /^[a-z]+/.exec(texto.slice(i))!;
      tokens.push(...separarNomes(m[0], fonte));
      i += m[0].length;
    } else if ('+-*/^()'.includes(c)) {
      tokens.push({ tipo: 'op', valor: c });
      i += 1;
    } else {
      throw new Error(`Caractere não permitido "${c}" em "${fonte}"`);
    }
  }
  return tokens;
}

/* "xsin" ou "pix" chegam grudados; quebra em nomes conhecidos, do maior para o menor. */
function separarNomes(bloco: string, fonte: string): Token[] {
  const conhecidos = [...Object.keys(FUNCOES), ...Object.keys(CONSTANTES), 'x'].sort((a, b) => b.length - a.length);
  const saida: Token[] = [];
  let resto = bloco;
  while (resto.length > 0) {
    const nome = conhecidos.find((n) => resto.startsWith(n));
    if (!nome) throw new Error(`Nome desconhecido "${resto}" em "${fonte}"`);
    saida.push({ tipo: 'nome', valor: nome });
    resto = resto.slice(nome.length);
  }
  return saida;
}

type No = (x: number) => number;

class Leitor {
  private pos = 0;
  constructor(private readonly tokens: Token[], private readonly fonte: string) {}

  ler(): No {
    const no = this.soma();
    if (this.pos < this.tokens.length) throw new Error(`Sobrou texto em "${this.fonte}"`);
    return no;
  }

  private espiar(): Token | undefined { return this.tokens[this.pos]; }
  private ehOp(valor: string): boolean {
    const t = this.espiar();
    return t?.tipo === 'op' && t.valor === valor;
  }

  private soma(): No {
    let esq = this.produto();
    while (this.ehOp('+') || this.ehOp('-')) {
      const op = (this.tokens[this.pos++] as { valor: string }).valor;
      const a = esq, b = this.produto();
      esq = op === '+' ? (x) => a(x) + b(x) : (x) => a(x) - b(x);
    }
    return esq;
  }

  /* Multiplicação implícita: "2x", "3(x+1)", "x sin(x)", "(x+1)(x-1)". */
  private comecaAtomo(): boolean {
    const t = this.espiar();
    return !!t && (t.tipo === 'num' || t.tipo === 'nome' || (t.tipo === 'op' && t.valor === '('));
  }

  private produto(): No {
    let esq = this.unario();
    for (;;) {
      if (this.ehOp('*') || this.ehOp('/')) {
        const op = (this.tokens[this.pos++] as { valor: string }).valor;
        const a = esq, b = this.unario();
        esq = op === '*' ? (x) => a(x) * b(x) : (x) => a(x) / b(x);
      } else if (this.comecaAtomo()) {
        const a = esq, b = this.potencia();
        esq = (x) => a(x) * b(x);
      } else {
        return esq;
      }
    }
  }

  private unario(): No {
    if (this.ehOp('-')) { this.pos++; const a = this.unario(); return (x) => -a(x); }
    if (this.ehOp('+')) { this.pos++; return this.unario(); }
    return this.potencia();
  }

  private potencia(): No {
    const base = this.atomo();
    if (!this.ehOp('^')) return base;
    this.pos++;
    const exp = this.unario();
    return (x) => Math.pow(base(x), exp(x));
  }

  private atomo(): No {
    const t = this.tokens[this.pos++];
    if (!t) throw new Error(`Expressão incompleta: "${this.fonte}"`);
    if (t.tipo === 'num') { const v = t.valor; return () => v; }
    if (t.tipo === 'op' && t.valor === '(') {
      const dentro = this.soma();
      if (!this.ehOp(')')) throw new Error(`Falta ")" em "${this.fonte}"`);
      this.pos++;
      return dentro;
    }
    if (t.tipo === 'nome') {
      if (t.valor === 'x') return (x) => x;
      if (t.valor in CONSTANTES) { const v = CONSTANTES[t.valor]; return () => v; }
      const f = FUNCOES[t.valor];
      if (!this.ehOp('(')) {
        // "sin x" sem parênteses: aplica ao próximo fator.
        const arg = this.potencia();
        return (x) => f(arg(x));
      }
      this.pos++;
      const arg = this.soma();
      if (!this.ehOp(')')) throw new Error(`Falta ")" em "${this.fonte}"`);
      this.pos++;
      return (x) => f(arg(x));
    }
    throw new Error(`Símbolo inesperado "${t.valor}" em "${this.fonte}"`);
  }
}

/* Aceita "y = ...", "f(x) = ..." ou só o lado direito. Lança erro legível. */
/* Teto de tamanho: com ele, a recursão do leitor e a da função montada ficam
   rasas (sem estouro de pilha na hora de desenhar). Gráfico de aula cabe folgado. */
const MAX_CARACTERES = 200;
const MAX_TOKENS = 120;

export function compilarExpressao(fonte: string): Funcao {
  if (fonte.length > MAX_CARACTERES) throw new Error('Expressão longa demais');
  const ladoDireito = fonte.includes('=') ? fonte.slice(fonte.lastIndexOf('=') + 1) : fonte;
  if (ladoDireito.trim().length === 0) throw new Error('Expressão vazia');
  const tokens = tokenizar(ladoDireito);
  if (tokens.length > MAX_TOKENS) throw new Error('Expressão longa demais');
  return new Leitor(tokens, fonte).ler();
}

/* Versão que nunca lança: devolve null quando a IA mandou algo ilegível. */
export function tentarCompilar(fonte: string): Funcao | null {
  try {
    return compilarExpressao(fonte);
  } catch {
    return null;
  }
}
/* Regra ("10-10*0.5^x") → LaTeX para mostrar. Número vezes número mantém o
   "·": sem ele, "10*0.5" aparecia como "100,5" (c1, 06/10/2026). Número vezes
   letra ou parêntese fica colado, como se escreve à mão: "5x", "5(x-2)". */
export function exprParaLatex(expr: string): string {
  return expr
    .replace(/(\d)\.(\d)/g, '$1{,}$2')
    .replace(/(\d)\s*\*\s*(?=\d)/g, '$1\\cdot ')
    .replace(/\s*\*\s*/g, '');
}
/* Número para dentro de uma fórmula: vírgula decimal sem o espaço que o
   KaTeX põe depois de "," ("9,84" saía "9, 84"). */
export function numeroLatex(n: number): string {
  const limpo = Math.abs(n) < 1e-9 ? 0 : n;
  return limpo.toLocaleString('pt-BR', { maximumFractionDigits: 2, useGrouping: false }).replace(',', '{,}');
}
