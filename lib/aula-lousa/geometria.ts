// Lousa de questão de GEOMETRIA no jeito do Pablo (22/11/2026, caderno dele: quadrado de lado l,
// diagonal desenhada, l√2): ler o que a questão pede, DESENHAR a figura, marcar lado e diagonal com
// nome ou valor, montar a equação a partir dos lados, e deixar a figura pequena no canto enquanto a
// conta roda. Base no canal: mat-20 [11:12:00] (diagonal do quadrado por Pitágoras, d = a√2).
// Função pura: a ficha entra, a AulaLousa sai. Primeira ficha: aspersor no jardim quadrado.
import type { AulaLousa, Cena, Cor, Desenho } from './tipos';
import { capaEPapel } from './regra-de-tres';
import { fala, linhas, titulo, tx } from './pincel';

export interface FichaGeometria {
  id: string;
  /** Lado do quadrado, em metros. */
  lado: number;
  /** Valor de √2 que a questão manda usar. */
  raiz2: number;
  /** Letra certa e os motivos das outras, já escritos ("A, 10 m: metade do lado"). */
  certa: string;
  erros: readonly string[];
  /** "Prove você": quadrado menor, mesma ideia. */
  prova: { lado: number; opcoes: readonly string[]; certa: number; porque: readonly string[] };
}

const RAIO_DO_CIRCULO = Math.SQRT2 / 2; // raio do círculo que passa pelos 4 cantos, por lado

/** 14 → "14"; 1.4 → "1,4"; 28.000000000000004 → "28". */
export const br = (n: number): string => String(Math.round(n * 1000) / 1000).replace('.', ',');

/** Diagonal e alcance (raio) com o √2 da questão. */
export function contas(f: FichaGeometria): { diagonal: number; alcance: number } {
  const diagonal = Math.round(f.lado * f.raiz2 * 1000) / 1000;
  return { diagonal, alcance: Math.round((diagonal / 2) * 1000) / 1000 };
}

interface Moldura { cx: number; cy: number; lado: number }

/** Quadrado; `t` é o segundo em que ele começa a ser traçado. */
function quadrado(m: Moldura, t: number, cor: Cor = 'tinta'): Desenho {
  return { k: 'caixa', x: m.cx - m.lado / 2, y: m.cy - m.lado / 2, w: m.lado, h: m.lado, cor, t, dur: 1.2 };
}

/** Círculo que passa pelos 4 cantos do quadrado. */
function circuloDosCantos(m: Moldura, t: number, cor: Cor = 'azul'): Desenho {
  return { k: 'circ', cx: m.cx, cy: m.cy, r: Math.round(m.lado * RAIO_DO_CIRCULO), cor, t };
}

/** Diagonal do canto de baixo à esquerda ao de cima à direita. */
function diagonal(m: Moldura, t: number, cor: Cor = 'vermelho'): Desenho {
  const meio = m.lado / 2;
  return { k: 'linha', x1: m.cx - meio, y1: m.cy + meio, x2: m.cx + meio, y2: m.cy - meio, cor, t, dur: 1.2 };
}

/** Do centro ao canto de cima à direita (o alcance do aspersor). */
function alcance(m: Moldura, t: number, cor: Cor = 'verde'): Desenho {
  const meio = m.lado / 2;
  return { k: 'linha', x1: m.cx, y1: m.cy, x2: m.cx + meio, y2: m.cy - meio, cor, t, dur: 0.8 };
}

const ponto = (m: Moldura, t: number): Desenho => ({ k: 'circ', cx: m.cx, cy: m.cy, r: 3, cor: 'verde', t });

const GRANDE: Moldura = { cx: 130, cy: 164, lado: 120 };
const PEQUENA: Moldura = { cx: 356, cy: 80, lado: 48 };
const X_TEXTO = 232;

/** Figura pequena no canto, já inteira, para a conta rodar com ela à vista. */
function figuraNoCanto(): Desenho[] {
  return [quadrado(PEQUENA, 0.2), circuloDosCantos(PEQUENA, 0.2), diagonal(PEQUENA, 0.2), ponto(PEQUENA, 0.2)];
}

function oQuePede(f: FichaGeometria): Cena {
  return {
    tipo: 'lousa',
    fala: fala(
      `O jardim é um quadrado de ${f.lado} m de lado. Desenhe ele.`,
      'O aspersor, que é o esguicho que gira molhando o jardim, fica no centro. Marque um ponto.',
      'Ele molha um círculo que passa pelos 4 cantos. Desenhe o círculo.',
      'A questão quer o alcance: a distância do centro até um canto.',
    ),
    desenho: [
      titulo('desenhando a questão'),
      quadrado(GRANDE, 0.6),
      tx(GRANDE.cx, GRANDE.cy - 36, `lado ${f.lado} m`, 'tinta', 18, 1.8),
      ponto(GRANDE, 3.4),
      circuloDosCantos(GRANDE, 5.0),
      tx(X_TEXTO, 96, 'jardim quadrado', 'tinta', 20, 0.8, 'start'),
      tx(X_TEXTO, 128, 'aspersor no centro', 'verde', 20, 3.4, 'start'),
      tx(X_TEXTO, 160, 'círculo pelos cantos', 'azul', 20, 5.0, 'start'),
      tx(X_TEXTO, 208, 'alcance = ?', 'tinta', 26, 7.0, 'start'),
    ],
  };
}

function marcandoADiagonal(): Cena {
  return {
    tipo: 'lousa',
    fala: fala(
      'Ligue dois cantos de frente um para o outro: essa linha é a diagonal, que chamamos de D.',
      'O centro do jardim fica no meio dela, então ela passa pelo centro do círculo.',
      'Linha de ponta a ponta do círculo, pelo centro, é o diâmetro. Então D é a diagonal e o diâmetro.',
    ),
    desenho: [
      titulo('marcando a diagonal'),
      quadrado(GRANDE, 0.2),
      circuloDosCantos(GRANDE, 0.2),
      ponto(GRANDE, 0.2),
      diagonal(GRANDE, 0.8),
      tx(GRANDE.cx - 28, GRANDE.cy - 18, 'D', 'vermelho', 22, 3.0),
      tx(X_TEXTO, 108, 'de canto a canto', 'vermelho', 20, 1.6, 'start'),
      tx(X_TEXTO, 148, 'passa pelo centro', 'tinta', 20, 3.4, 'start'),
      tx(X_TEXTO, 196, 'D = diâmetro', 'vermelho', 28, 5.6, 'start'),
    ],
  };
}

function oRaio(): Cena {
  return {
    tipo: 'lousa',
    fala: fala(
      'O alcance do aspersor é do centro até um canto. Essa distância se chama raio, e vamos chamar de R.',
      'O raio é metade do diâmetro. Se o diâmetro fosse 10 m, o raio seria 5 m.',
      'Em letras: R = D ÷ 2.',
    ),
    desenho: [
      titulo('o alcance é o raio'),
      quadrado(GRANDE, 0.2),
      circuloDosCantos(GRANDE, 0.2),
      ponto(GRANDE, 0.2),
      diagonal(GRANDE, 0.2),
      alcance(GRANDE, 0.8),
      tx(GRANDE.cx + 26, GRANDE.cy - 4, 'R', 'verde', 22, 1.8),
      tx(GRANDE.cx - 28, GRANDE.cy - 18, 'D', 'vermelho', 22, 0.4),
      tx(X_TEXTO, 100, 'R = do centro ao canto', 'verde', 19, 1.8, 'start'),
      tx(X_TEXTO, 136, 'D = 10 m → R = 5 m', 'tinta', 20, 4.0, 'start'),
      tx(X_TEXTO, 196, 'R = D ÷ 2', 'verde', 32, 6.4, 'start'),
    ],
  };
}

/** Quadrado de lado 1 ou L com o triângulo do canto reto marcado: dois lados azuis e a diagonal D. */
function triangulo(m: Moldura, ladoRotulo: string, t: number): Desenho[] {
  const meio = m.lado / 2;
  const [e, d, b, c] = [m.cx - meio, m.cx + meio, m.cy + meio, m.cy - meio];
  return [
    quadrado(m, t, 'cinza'),
    { k: 'linha', x1: e, y1: b, x2: d, y2: b, cor: 'azul', t: t + 1.0, dur: 0.6 },
    { k: 'linha', x1: e, y1: b, x2: e, y2: c, cor: 'azul', t: t + 1.6, dur: 0.6 },
    diagonal({ ...m }, t + 2.4),
    tx(m.cx, b + 20, ladoRotulo, 'azul', 20, t + 1.2),
    tx(e - 14, m.cy + 6, ladoRotulo, 'azul', 20, t + 1.8),
    tx(m.cx - 16, m.cy - 12, 'D', 'vermelho', 22, t + 2.6),
  ];
}

/** Antes da letra, o caso de número: lado 1. "Ao quadrado" é dito como "vezes ele mesmo". */
function diagonalComNumero(): Cena {
  return {
    tipo: 'lousa',
    fala: fala(
      'Veja o quadrado de lado 1. Os dois lados azuis e a diagonal D formam um triângulo com canto reto.',
      'Pitágoras: o lado grande (da frente do canto reto) vezes ele mesmo é a soma dos outros dois, cada um vezes ele mesmo.',
      'Teste com 3, 4 e 5: 5 × 5 = 25 e 3 × 3 + 4 × 4 = 25. Aqui: D × D = 1 × 1 + 1 × 1 = 2.',
    ),
    desenho: [
      titulo('diagonal do quadrado de lado 1'),
      ...triangulo(GRANDE, '1', 0.4),
      tx(X_TEXTO, 108, 'D × D = 1 × 1 + 1 × 1', 'tinta', 19, 3.6, 'start'),
      tx(X_TEXTO, 156, 'D × D = 2', 'verde', 28, 5.6, 'start'),
    ],
  };
}

/** De onde vem o 1,4: a raiz de 2 e o porquê de ser aproximado. */
function raizDeDois(f: FichaGeometria): Cena {
  const q = Math.round(f.raiz2 * f.raiz2 * 1000) / 1000;
  return linhas('o que é √2', [
    ['√2 é o número que vezes ele mesmo dá 2', 'tinta', 20],
    ['esse número é a diagonal do lado 1', 'vermelho', 20],
    [`${Math.round(f.raiz2 * 10)} × ${Math.round(f.raiz2 * 10)} = ${Math.round(q * 100)}, então ${br(f.raiz2)} × ${br(f.raiz2)} = ${br(q)}`, 'tinta', 21],
    [`${br(q)} é quase 2: √2 ≈ ${br(f.raiz2)}`, 'verde', 24],
  ], fala(
    'D × D = 2 quer dizer que D é o número que vezes ele mesmo dá 2. Esse número se escreve √2, a raiz de 2.',
    `Nenhum número com vírgula dá 2 certinho. A questão manda usar ${br(f.raiz2)}: sem a vírgula, ${Math.round(f.raiz2 * 10)} × ${Math.round(f.raiz2 * 10)} = ${Math.round(q * 100)}; com duas casas, ${br(q)}.`,
    `${br(q)} é quase 2. O símbolo ≈ se lê "quase igual a": √2 ≈ ${br(f.raiz2)}.`,
  ));
}

/** Com a letra L: vale para qualquer lado. Antes, um caso de número (lado 3). */
function diagonalComLetra(): Cena {
  return {
    tipo: 'lousa',
    fala: fala(
      'Agora um lado qualquer, L. Com lado 3: 3 × 3 + 3 × 3 = 18, que é 2 × 3 × 3.',
      'Com L é igual: D × D = L × L + L × L = 2 × L × L.',
      'Confira: L × √2 vezes L × √2 = L × L × (√2 × √2) = L × L × 2. Então D = L × √2.',
    ),
    desenho: [
      titulo('diagonal do quadrado de lado L'),
      ...triangulo(GRANDE, 'L', 0.4),
      tx(X_TEXTO, 108, 'D × D = L × L + L × L', 'tinta', 19, 3.6, 'start'),
      tx(X_TEXTO, 148, 'D × D = 2 × L × L', 'tinta', 20, 5.2, 'start'),
      tx(X_TEXTO, 196, 'D = L × √2', 'verde', 30, 7.0, 'start'),
    ],
  };
}

function montandoAConta(f: FichaGeometria): Cena {
  const { diagonal: d, alcance: r } = contas(f);
  const itens: readonly (readonly [string, Cor, number])[] = [
    ['R = D ÷ 2', 'verde', 30],
    ['D = lado × √2', 'vermelho', 28],
    [`D = ${f.lado} × ${br(f.raiz2)} = ${br(d)} m`, 'vermelho', 26],
    [`R = ${br(d)} ÷ 2 = ${br(r)} m`, 'verde', 32],
  ];
  const base = linhas('montando a conta', itens, fala(
    'O alcance R é metade da diagonal D. E a diagonal do quadrado é o lado vezes √2.',
    `${f.lado} × ${br(f.raiz2)}: ${f.lado} × ${Math.floor(f.raiz2)} = ${f.lado * Math.floor(f.raiz2)} e ${f.lado} × ${br(Math.round((f.raiz2 - Math.floor(f.raiz2)) * 10) / 10)} = ${br(f.lado * (Math.round((f.raiz2 - Math.floor(f.raiz2)) * 10) / 10))}. Somando: ${br(d)} m.`,
    `Então R = ${br(d)} ÷ 2 = ${br(r)} m.`,
  ));
  return base.tipo === 'lousa' ? { ...base, desenho: [...base.desenho, ...figuraNoCanto()] } : base;
}

function conferindo(f: FichaGeometria): Cena {
  const meio = f.lado / 2;
  const soma = meio * meio * 2;
  const { alcance: r } = contas(f);
  return linhas('conferindo', [
    [`metade do lado: ${f.lado} ÷ 2 = ${br(meio)} m`, 'tinta', 21],
    [`centro ao canto: ${br(meio)} m para o lado, ${br(meio)} m para cima`, 'tinta', 19],
    [`Pitágoras: R × R = ${br(meio)} × ${br(meio)} + ${br(meio)} × ${br(meio)} = ${br(soma)}`, 'tinta', 19],
    [`${br(r)} × ${br(r)} = ${br(r * r)}`, 'tinta', 24],
    [`${br(r * r)} é quase ${br(soma)}: o ${br(f.raiz2)} é aproximado`, 'verde', 21],
  ], fala(
    `Outro jeito: do centro até o meio da parede são ${br(meio)} m, metade do lado.`,
    `Até o canto: ${br(meio)} m para o lado e ${br(meio)} m para cima. Triângulo de canto reto: vale o Pitágoras.`,
    `R × R = ${br(meio)} × ${br(meio)} + ${br(meio)} × ${br(meio)} = ${br(soma)}.`,
    `${br(r)} × ${br(r)} = ${br(r * r)}, quase ${br(soma)}. Com ${br(r + 1)} daria ${br((r + 1) * (r + 1))}, longe.`,
  ));
}

function porQueErram(f: FichaGeometria): Cena {
  return linhas('por que as outras erram', [
    [f.certa, 'verde', 21],
    ...f.erros.map((s): readonly [string, Cor, number] => [s, 'tinta', 21]),
  ], fala(
    `A conta deu ${br(contas(f).alcance)} m, então ${f.certa.split(':')[0]}.`,
    'As outras: o lado, metade do lado, a diagonal inteira, ou a metade do alcance.',
  ));
}

function proveVoce(f: FichaGeometria): Cena {
  const { prova } = f;
  return {
    tipo: 'prova',
    fala: fala('Agora você, numa conta parecida. Escolha a resposta.'),
    pergunta: `Um quadrado tem ${prova.lado} m de lado. Use √2 = ${br(f.raiz2)}. Quanto mede a diagonal?`,
    opcoes: [...prova.opcoes],
    certa: prova.certa,
    porque: [...prova.porque],
  };
}

function receita(): Cena {
  return linhas('serve para outras', [
    ['1. Desenhe a figura da questão', 'tinta', 21],
    ['2. Marque as medidas na figura', 'azul', 21],
    ['3. Diagonal do quadrado = lado × √2', 'vermelho', 20],
    ['4. Círculo pelos cantos: diagonal = diâmetro', 'verde', 20],
    ['5. Monte a conta e ache o que pede', 'tinta', 20],
  ], fala(
    'Para uma questão de figura: desenhe, marque as medidas e só depois monte a conta.',
    'A diagonal do quadrado é o lado vezes √2. Se o círculo passa pelos cantos, essa diagonal é o diâmetro dele.',
  ));
}

/** Capa e papel: o papel é o de sempre; a capa diz o que esta aula faz (desenhar), não "tabela". */
export function capaEPapelGeometria(tema: string, enunciado: string, alternativas: readonly string[]): [Cena, Cena] {
  const [, papel] = capaEPapel(tema, enunciado, alternativas);
  const nome = tema.slice(0, 30);
  const capa: Cena = {
    tipo: 'lousa',
    fala: [[0.3, `Questão de ${nome}. Vamos desenhar a figura e montar a conta com as medidas dela.`]],
    desenho: [
      tx(200, 120, nome, 'tinta', nome.length > 20 ? 32 : 40, 0.2),
      { k: 'linha', x1: 90, y1: 142, x2: 310, y2: 142, cor: 'verde', t: 1.0, dur: 0.8 },
      tx(200, 196, 'desenhando passo a passo', 'cinza', 26, 2.0),
    ],
  };
  return [capa, { ...papel, fala: [[0.3, 'Esta é a questão. Aspersor, √2 e alcance a gente explica nas próximas telas.']] } as Cena];
}

export function lousaGeometria(f: FichaGeometria, capa: Cena, papel: Cena): AulaLousa {
  return {
    cenas: [capa, papel, oQuePede(f), marcandoADiagonal(), oRaio(), diagonalComNumero(), raizDeDois(f), diagonalComLetra(), montandoAConta(f), conferindo(f), porQueErram(f), proveVoce(f), receita()],
  };
}
