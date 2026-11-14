import { circulo, ponto, type Pincel } from './desenho';

/* Personagem em pixel por matéria (Pablo, 14/11/2026: "coloca até personagens
   dependendo da questão"). Folha com 4 quadros lado a lado, desenhada UMA vez:
   0 e 1 = parado (respira e pisca), 2 = pulo (acertou), 3 = coça a cabeça (errou).
   O movimento é CSS (background-position em steps), no compositor. */

export const QUADRO_W = 22;
export const QUADRO_H = 22;
export const QUADROS = 4;

export type Tipo = 'fisica' | 'quimica' | 'biologia' | 'matematica' | 'leitura';

export function tipoDaMateria(materia: string | null | undefined): Tipo {
  const m = (materia ?? '').toLowerCase();
  if (m.includes('físic') || m.includes('fisic')) return 'fisica';
  if (m.includes('quím') || m.includes('quim')) return 'quimica';
  if (m.includes('biolog')) return 'biologia';
  if (m.includes('matem')) return 'matematica';
  return 'leitura';
}

export type Roupa = { cabelo: string; pele: string; peleSombra: string; camisa: string; camisaLuz: string; calca: string; sapato: string };
export const ROUPAS: Record<Tipo, Roupa> = {
  fisica: { cabelo: '#4a2f1d', pele: '#e8b48a', peleSombra: '#c98f66', camisa: '#e0923f', camisaLuz: '#f2b872', calca: '#3a4f7a', sapato: '#22302a' },
  quimica: { cabelo: '#22302a', pele: '#c98f66', peleSombra: '#a8704b', camisa: '#f4f4ee', camisaLuz: '#ffffff', calca: '#4f6157', sapato: '#22302a' },
  biologia: { cabelo: '#8a5a2b', pele: '#f0c9a0', peleSombra: '#d6a678', camisa: '#4fae6a', camisaLuz: '#7cc98a', calca: '#5b3f2b', sapato: '#22302a' },
  matematica: { cabelo: '#2b1d14', pele: '#8a5a3b', peleSombra: '#6e4329', camisa: '#4a6fd0', camisaLuz: '#7a96e0', calca: '#22302a', sapato: '#3b4540' },
  leitura: { cabelo: '#c9a44a', pele: '#f0c9a0', peleSombra: '#d6a678', camisa: '#7a4fc0', camisaLuz: '#9a76d6', calca: '#3a4f7a', sapato: '#22302a' },
};
const TINTA = '#22302a';

/** Uma pessoa no quadro `q`, com o canto em (ox, 0). */
export function pessoa(c: Pincel, ox: number, q: number, r: Roupa) {
  const dy = q === 1 ? 1 : 0; // respiro: o corpo desce 1 pixel
  const x = ox + 6;
  // pernas e sapatos
  ponto(c, r.calca, x + 1, 15, 3, 5);
  ponto(c, r.calca, x + 6, 15, 3, 5);
  ponto(c, r.sapato, x, 20, 4, 1);
  ponto(c, r.sapato, x + 6, 20, 4, 1);
  // corpo
  ponto(c, TINTA, x, 8 + dy, 10, 8 - dy);
  ponto(c, r.camisa, x + 1, 9 + dy, 8, 6 - dy);
  ponto(c, r.camisaLuz, x + 1, 9 + dy, 8, 1);
  // cabeça
  ponto(c, TINTA, x + 1, 1 + dy, 8, 8);
  ponto(c, r.pele, x + 2, 2 + dy, 6, 6);
  ponto(c, r.peleSombra, x + 2, 7 + dy, 6, 1);
  ponto(c, r.cabelo, x + 1, 1 + dy, 8, 2);
  ponto(c, r.cabelo, x + 1, 3 + dy, 1, 2);
  // olhos (piscando no quadro 1), boca (sorriso no pulo, reta no erro)
  if (q === 1) {
    ponto(c, TINTA, x + 3, 5 + dy, 1, 1);
    ponto(c, TINTA, x + 6, 5 + dy, 1, 1);
  } else {
    ponto(c, TINTA, x + 3, 4 + dy, 1, 2);
    ponto(c, TINTA, x + 6, 4 + dy, 1, 2);
  }
  if (q === 2) { ponto(c, TINTA, x + 3, 6, 4, 1); ponto(c, TINTA, x + 3, 6, 1, 1); ponto(c, '#d64545', x + 4, 7, 2, 1); }
  else if (q === 3) ponto(c, TINTA, x + 4, 7, 3, 1);
  else ponto(c, TINTA, x + 4, 6 + dy, 2, 1);
  // braços
  if (q === 2) {
    // os dois para cima: comemorando
    ponto(c, r.camisa, x - 2, 5, 2, 4); ponto(c, r.pele, x - 2, 3, 2, 2);
    ponto(c, r.camisa, x + 10, 5, 2, 4); ponto(c, r.pele, x + 10, 3, 2, 2);
  } else if (q === 3) {
    // a mão direita coçando a cabeça; ponto de interrogação em cima
    ponto(c, r.camisa, x - 2, 9, 2, 4); ponto(c, r.pele, x - 2, 13, 2, 1);
    ponto(c, r.camisa, x + 10, 4, 2, 5); ponto(c, r.pele, x + 9, 1, 2, 3);
    ponto(c, '#f2c94c', x + 12, 0, 3, 1); ponto(c, '#f2c94c', x + 14, 1, 1, 2); ponto(c, '#f2c94c', x + 13, 3, 1, 1); ponto(c, '#f2c94c', x + 13, 5, 1, 1);
  } else {
    ponto(c, r.camisa, x - 2, 9 + dy, 2, 4); ponto(c, r.pele, x - 2, 13 + dy, 2, 1);
    ponto(c, r.camisa, x + 10, 9 + dy, 2, 4); ponto(c, r.pele, x + 10, 13 + dy, 2, 1);
  }
}

/** O objeto da matéria, na mão esquerda (lado esquerdo do quadro). */
function objeto(c: Pincel, ox: number, q: number, t: Tipo) {
  const alto = q === 2; // no pulo, a mão está em cima
  const y = alto ? 0 : q === 1 ? 11 : 10;
  const x = ox;
  if (t === 'quimica') {
    // béquer com líquido verde e bolha
    ponto(c, TINTA, x, y + 1, 5, 6); ponto(c, '#dfe6e1', x + 1, y + 1, 3, 5);
    ponto(c, '#4fae6a', x + 1, y + 4, 3, 2); ponto(c, '#a8e6b4', x + 2, y + (q % 2 ? 2 : 3), 1, 1);
  } else if (t === 'fisica') {
    circulo(c, TINTA, x + 2, y + 4, 3); circulo(c, '#e0923f', x + 2, y + 4, 2); ponto(c, '#ffffff', x + 1, y + 3, 1, 1);
  } else if (t === 'biologia') {
    // lupa
    circulo(c, TINTA, x + 2, y + 2, 3); circulo(c, '#bfe6f2', x + 2, y + 2, 2); ponto(c, '#8a5a2b', x + 4, y + 5, 2, 3);
  } else if (t === 'matematica') {
    // régua amarela com marcas
    ponto(c, TINTA, x + 1, y - 1, 3, 9); ponto(c, '#f2d27a', x + 2, y, 1, 7);
    for (let k = 0; k < 7; k += 2) ponto(c, TINTA, x + 2, y + k, 1, 1);
  } else {
    // livro aberto
    ponto(c, TINTA, x - 1, y + 2, 7, 5); ponto(c, '#ffffff', x, y + 3, 2, 3); ponto(c, '#f4ead7', x + 3, y + 3, 2, 3); ponto(c, '#d64545', x + 2, y + 2, 1, 5);
  }
}

/** Folha com os 4 quadros, de QUADRO_W × QUADRO_H cada. */
export function desenharPersonagem(c: Pincel, t: Tipo): void {
  const r = ROUPAS[t];
  for (let q = 0; q < QUADROS; q++) {
    const ox = q * QUADRO_W + 1;
    pessoa(c, ox, q, r);
    objeto(c, ox, q, t);
  }
}
