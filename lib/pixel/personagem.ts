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

export type Roupa = {
  cabelo: string; pele: string; peleSombra: string; camisa: string; camisaLuz: string; calca: string; sapato: string;
  /** jeitos de mudar a pessoa (14/11/2026: "cria outros tipos de personagem") */
  cabeloLongo?: boolean; bone?: string; oculos?: boolean; saia?: boolean; barba?: string;
};
export const ROUPAS: Record<Tipo, Roupa> = {
  fisica: { cabelo: '#4a2f1d', pele: '#e8b48a', peleSombra: '#c98f66', camisa: '#e0923f', camisaLuz: '#f2b872', calca: '#3a4f7a', sapato: '#22302a' },
  // jaleco azul-claro: o branco sumia no fundo claro da cena (Pablo, 14/11/2026)
  quimica: { cabelo: '#22302a', pele: '#c98f66', peleSombra: '#a8704b', camisa: '#a9c8e8', camisaLuz: '#d6e6f5', calca: '#4f6157', sapato: '#22302a', oculos: true },
  biologia: { cabelo: '#8a5a2b', pele: '#f0c9a0', peleSombra: '#d6a678', camisa: '#4fae6a', camisaLuz: '#7cc98a', calca: '#5b3f2b', sapato: '#22302a' },
  matematica: { cabelo: '#2b1d14', pele: '#8a5a3b', peleSombra: '#6e4329', camisa: '#4a6fd0', camisaLuz: '#7a96e0', calca: '#22302a', sapato: '#3b4540' },
  leitura: { cabelo: '#c9a44a', pele: '#f0c9a0', peleSombra: '#d6a678', camisa: '#7a4fc0', camisaLuz: '#9a76d6', calca: '#3a4f7a', sapato: '#22302a' },
};
const TINTA = '#22302a';

/** Uma pessoa no quadro `q`, com o canto em (ox, 0). */
export function pessoa(c: Pincel, ox: number, q: number, r: Roupa) {
  const dy = q === 1 ? 1 : 0; // respiro: o corpo desce 1 pixel
  const x = ox + 6;
  // braço com contorno: sem ele, braço da cor da camisa sumia (14/11/2026)
  const braco = (bx: number, by: number, h: number, mao: 'cima' | 'baixo') => {
    ponto(c, TINTA, bx - 1, by - 1, 4, h + 3);
    ponto(c, r.camisa, bx, by, 2, h);
    ponto(c, r.pele, bx, mao === 'baixo' ? by + h : by - 1, 2, 1);
  };
  // pernas e sapatos (ou saia)
  if (r.saia) {
    ponto(c, TINTA, x, 15, 10, 3); ponto(c, r.calca, x + 1, 15, 8, 2);
    ponto(c, r.pele, x + 2, 18, 2, 2); ponto(c, r.pele, x + 6, 18, 2, 2);
  } else {
    ponto(c, r.calca, x + 1, 15, 3, 5);
    ponto(c, r.calca, x + 6, 15, 3, 5);
  }
  ponto(c, r.sapato, x, 20, 4, 1);
  ponto(c, r.sapato, x + 6, 20, 4, 1);
  // braços atrás do corpo (desenhados antes)
  if (q === 2) { braco(x - 2, 4, 4, 'cima'); braco(x + 10, 4, 4, 'cima'); }
  else if (q === 3) { braco(x - 2, 9, 4, 'baixo'); braco(x + 10, 3, 5, 'cima'); }
  else { braco(x - 2, 9 + dy, 4, 'baixo'); braco(x + 10, 9 + dy, 4, 'baixo'); }
  // corpo
  ponto(c, TINTA, x, 8 + dy, 10, 8 - dy);
  ponto(c, r.camisa, x + 1, 9 + dy, 8, 6 - dy);
  ponto(c, r.camisaLuz, x + 1, 9 + dy, 8, 1);
  // cabeça
  if (r.cabeloLongo) ponto(c, r.cabelo, x, 2 + dy, 10, 8);
  ponto(c, TINTA, x + 1, 1 + dy, 8, 8);
  ponto(c, r.pele, x + 2, 2 + dy, 6, 6);
  ponto(c, r.peleSombra, x + 2, 7 + dy, 6, 1);
  ponto(c, r.cabelo, x + 1, 1 + dy, 8, 2);
  ponto(c, r.cabelo, x + 1, 3 + dy, 1, 2);
  if (r.cabeloLongo) ponto(c, r.cabelo, x + 8, 3 + dy, 1, 3);
  if (r.bone) { ponto(c, r.bone, x + 1, dy, 8, 2); ponto(c, r.bone, x + 7, 1 + dy, 4, 1); }
  if (r.barba) ponto(c, r.barba, x + 2, 6 + dy, 6, 2);
  // olhos (piscando no quadro 1), boca (sorriso no pulo, reta no erro)
  if (q === 1) {
    ponto(c, TINTA, x + 3, 5 + dy, 1, 1);
    ponto(c, TINTA, x + 6, 5 + dy, 1, 1);
  } else {
    ponto(c, TINTA, x + 3, 4 + dy, 1, 2);
    ponto(c, TINTA, x + 6, 4 + dy, 1, 2);
  }
  if (r.oculos) { ponto(c, '#55615b', x + 2, 4 + dy, 6, 1); }
  if (q === 2) { ponto(c, TINTA, x + 3, 6, 4, 1); ponto(c, '#d64545', x + 4, 7, 2, 1); }
  else if (q === 3) {
    ponto(c, TINTA, x + 4, 7, 3, 1);
    ponto(c, '#f2c94c', x + 12, 0, 3, 1); ponto(c, '#f2c94c', x + 14, 1, 1, 2); ponto(c, '#f2c94c', x + 13, 3, 1, 1); ponto(c, '#f2c94c', x + 13, 5, 1, 1);
  } else if (!r.barba) ponto(c, TINTA, x + 4, 6 + dy, 2, 1);
}

/** Tipos de gente para as cenas das questões (14/11/2026). */
export const GENTE = {
  menino: { cabelo: '#4a2f1d', pele: '#e8b48a', peleSombra: '#c98f66', camisa: '#e0923f', camisaLuz: '#f2b872', calca: '#3a4f7a', sapato: '#22302a', bone: '#d64545' },
  menina: { cabelo: '#2b1d14', pele: '#8a5a3b', peleSombra: '#6e4329', camisa: '#7a4fc0', camisaLuz: '#9a76d6', calca: '#d64545', sapato: '#22302a', cabeloLongo: true, saia: true },
  cientista: { cabelo: '#22302a', pele: '#c98f66', peleSombra: '#a8704b', camisa: '#a9c8e8', camisaLuz: '#d6e6f5', calca: '#4f6157', sapato: '#22302a', oculos: true },
  cozinheira: { cabelo: '#c9a44a', pele: '#f0c9a0', peleSombra: '#d6a678', camisa: '#4fae6a', camisaLuz: '#7cc98a', calca: '#5b3f2b', sapato: '#22302a', cabeloLongo: true },
  vovo: { cabelo: '#c9c2b0', pele: '#e8b48a', peleSombra: '#c98f66', camisa: '#4a6fd0', camisaLuz: '#7a96e0', calca: '#55615b', sapato: '#22302a', barba: '#dfe6e1', oculos: true },
  moca: { cabelo: '#8a5a2b', pele: '#f0c9a0', peleSombra: '#d6a678', camisa: '#e05a7a', camisaLuz: '#f08aa0', calca: '#3a4f7a', sapato: '#22302a', cabeloLongo: true },
} satisfies Record<string, Roupa>;
export type Jeito = keyof typeof GENTE;

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
/** Mini astronauta (Pablo, 14/11/2026: "deixa um mini astronauta, que eu acho mais
    legal"), no lugar da pessoa da matéria. Mesmos 4 quadros: parado (o reflexo do visor
    anda), pulo e mão no capacete com "?". Roupa branca COM contorno: sem ele, sumia no céu. */
function astronauta(c: Pincel, ox: number, q: number) {
  const dy = q === 1 ? 1 : 0;
  const x = ox + 5;
  const branco = '#f4f4ee';
  const sombra = '#c9d0d6';
  const braco = (bx: number, by: number, h: number, mao: 'cima' | 'baixo') => {
    ponto(c, TINTA, bx - 1, by - 1, 4, h + 3);
    ponto(c, branco, bx, by, 2, h);
    ponto(c, '#9aa3a8', bx, mao === 'baixo' ? by + h : by - 1, 2, 1); // luva
  };
  // mochila de oxigênio atrás
  ponto(c, TINTA, x - 1, 9 + dy, 3, 7); ponto(c, '#9aa3a8', x, 10 + dy, 1, 5);
  // braços
  if (q === 2) { braco(x + 1, 5, 4, 'cima'); braco(x + 11, 5, 4, 'cima'); }
  else if (q === 3) { braco(x + 1, 10, 4, 'baixo'); braco(x + 11, 3, 5, 'cima'); }
  else { braco(x + 1, 10 + dy, 4, 'baixo'); braco(x + 11, 10 + dy, 4, 'baixo'); }
  // pernas e botas
  ponto(c, TINTA, x + 3, 16, 4, 5); ponto(c, branco, x + 4, 16, 2, 4); ponto(c, '#55615b', x + 3, 20, 4, 1);
  ponto(c, TINTA, x + 7, 16, 4, 5); ponto(c, branco, x + 8, 16, 2, 4); ponto(c, '#55615b', x + 7, 20, 4, 1);
  // corpo com o emblema laranja
  ponto(c, TINTA, x + 2, 9 + dy, 10, 8 - dy);
  ponto(c, branco, x + 3, 10 + dy, 8, 6 - dy);
  ponto(c, sombra, x + 3, 15, 8, 1);
  ponto(c, '#e0923f', x + 4, 11 + dy, 2, 2);
  // capacete redondo e visor escuro com reflexo
  circulo(c, TINTA, x + 7, 5 + dy, 5);
  circulo(c, branco, x + 7, 5 + dy, 4);
  ponto(c, '#2a3f6b', x + 4, 3 + dy, 6, 4);
  ponto(c, '#7ab8e8', x + (q === 1 ? 7 : 5), 3 + dy, 2, 1);
  if (q === 3) {
    ponto(c, '#f2c94c', x + 13, 0, 3, 1); ponto(c, '#f2c94c', x + 15, 1, 1, 2); ponto(c, '#f2c94c', x + 14, 3, 1, 1); ponto(c, '#f2c94c', x + 14, 5, 1, 1);
  }
}

export function desenharPersonagem(c: Pincel, _t: Tipo): void {
  for (let q = 0; q < QUADROS; q++) astronauta(c, q * QUADRO_W + 1, q);
}
