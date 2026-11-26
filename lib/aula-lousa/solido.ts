// Regra 21 (Pablo, 24/11/2026): questão de geometria sem figura no enunciado → a solução DESENHA o sólido
// (prisma, cilindro, cone, pirâmide) com as medidas nomeadas por letra, antes de qualquer conta.
// Função pura: o enunciado entra, a tela de lousa (ou null) sai. Só traços de `caminho`/`linha`/`tx`.
import type { AulaLousa, Cena, Cor, Desenho } from './tipos';
import { fala, titulo, tx } from './pincel';

export type Solido = 'cilindro' | 'cone' | 'piramide' | 'esfera' | 'cubo' | 'caixa';

// Cada sólido: palavras que o enunciado usa. `cone` e `esfera` com \b: "silicone" e "esférica" não contam.
const PALAVRAS: readonly [Solido, RegExp][] = [
  ['piramide', /pir[âa]mide/i],
  ['cone', /\bcone\b/i],
  ['cilindro', /cilindr/i],
  ['esfera', /\besfera\b/i],
  ['cubo', /\bcubo\b|caixa c[úu]bica/i],
  ['caixa', /paralelep[íi]pedo|\bprisma\b|\bcaixa\b(?! c[úu]bica)/i],
];

/** O primeiro sólido que o enunciado cita (o que aparece antes no texto). null se nenhum. */
export function solidoDoEnunciado(enunciado: string): Solido | null {
  let melhor: { s: Solido; i: number } | null = null;
  for (const [s, re] of PALAVRAS) {
    const i = enunciado.search(re);
    if (i >= 0 && (!melhor || i < melhor.i)) melhor = { s, i };
  }
  return melhor?.s ?? null;
}

const traco = (d: string, t: number, cor: Cor = 'tinta', dur = 0.8): Desenho => ({ k: 'caminho', d, cor, t, dur, larg: 3 });
const reta = (x1: number, y1: number, x2: number, y2: number, cor: Cor, t: number): Desenho => ({ k: 'linha', x1, y1, x2, y2, cor, t, dur: 0.6 });
const nome = (x: number, y: number, s: string, cor: Cor, t: number): Desenho => tx(x, y, s, cor, 20, t);

const elipse = (cx: number, cy: number, rx: number, ry: number): string => `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy}`;
const meia = (cx: number, cy: number, rx: number, ry: number, frente: boolean): string => `M${cx - rx},${cy} A${rx},${ry} 0 0,${frente ? 0 : 1} ${cx + rx},${cy}`;

function desenhoDo(s: Solido): { d: Desenho[]; medidas: string; fala: string } {
  switch (s) {
    case 'cilindro':
      return {
        d: [
          traco(elipse(200, 90, 60, 18), 0.8), traco('M140,90 L140,210', 1.4), traco('M260,90 L260,210', 1.4), traco(meia(200, 210, 60, 18, true), 1.8),
          reta(200, 90, 260, 90, 'azul', 2.6), nome(232, 128, 'r', 'azul', 2.8),
          reta(290, 90, 290, 210, 'vermelho', 3.2), nome(306, 154, 'h', 'vermelho', 3.4),
        ],
        medidas: 'r = raio da base, h = altura',
        fala: 'Um cilindro: duas bases redondas iguais e uma lateral. O raio r mede da ponta ao meio da base. A altura h liga uma base à outra.',
      };
    case 'cone':
      return {
        d: [
          traco('M200,60 L130,210 M200,60 L270,210', 0.8), traco(meia(200, 210, 70, 20, true), 1.6), traco(meia(200, 210, 70, 20, false), 1.9, 'cinza'),
          reta(200, 60, 200, 210, 'vermelho', 2.6), nome(216, 136, 'h', 'vermelho', 2.8),
          reta(200, 210, 270, 210, 'azul', 3.2), nome(236, 202, 'r', 'azul', 3.4),
        ],
        medidas: 'r = raio da base, h = altura',
        fala: 'Um cone: uma base redonda e uma ponta em cima. A altura h desce da ponta até o meio da base. O raio r é metade da largura da base.',
      };
    case 'piramide':
      return {
        d: [
          traco('M120,205 L250,205 L290,170 L160,170 Z', 0.8), traco('M200,55 L120,205 M200,55 L250,205 M200,55 L290,170', 1.6), traco('M200,55 L160,170', 2.2, 'cinza'),
          reta(200, 55, 205, 188, 'vermelho', 3.0), nome(190, 125, 'h', 'vermelho', 3.2),
          reta(120, 222, 250, 222, 'azul', 3.6), nome(185, 246, 'l', 'azul', 3.8),
        ],
        medidas: 'l = lado da base, h = altura',
        fala: 'Uma pirâmide: a base é um quadrado de lado l. A altura h desce da ponta até o meio da base, em linha reta.',
      };
    case 'esfera':
      return {
        d: [traco('M130,140 A70,70 0 1,0 270,140 A70,70 0 1,0 130,140', 0.8), traco(meia(200, 140, 70, 20, true), 1.6), traco(meia(200, 140, 70, 20, false), 1.9, 'cinza'), reta(200, 140, 270, 140, 'azul', 2.6), nome(236, 114, 'r', 'azul', 2.8)],
        medidas: 'r = raio',
        fala: 'Uma esfera: uma bola. O raio r vai do centro até a superfície, e é o único número que ela precisa.',
      };
    case 'cubo':
      return {
        d: [
          traco('M110,110 L230,110 L230,220 L110,220 Z', 0.8), traco('M150,70 L270,70 L270,180 L230,220', 1.5), traco('M110,110 L150,70 L270,70 M230,110 L270,70', 1.8), traco('M150,70 L150,180 L110,220 M150,180 L270,180', 2.2, 'cinza'),
          nome(170, 244, 'a', 'azul', 3.0), nome(86, 170, 'a', 'azul', 3.2), nome(262, 214, 'a', 'azul', 3.4),
        ],
        medidas: 'a = aresta (todas iguais)',
        fala: 'Um cubo: todas as arestas medem o mesmo, a. Cada face é um quadrado de lado a.',
      };
    case 'caixa':
      return {
        d: [
          traco('M110,110 L250,110 L250,220 L110,220 Z', 0.8), traco('M150,70 L290,70 L290,180 L250,220', 1.5), traco('M110,110 L150,70 L290,70 M250,110 L290,70', 1.8), traco('M150,70 L150,180 L110,220 M150,180 L290,180', 2.2, 'cinza'),
          nome(180, 244, 'c', 'azul', 3.0), nome(86, 170, 'a', 'vermelho', 3.2), nome(286, 214, 'l', 'verde', 3.4),
        ],
        medidas: 'c = comprimento, l = largura, a = altura',
        fala: 'Uma caixa (paralelepípedo): três medidas. c é o comprimento, l a largura e a a altura. As faces opostas são iguais.',
      };
  }
}

/** Tela "a figura": título, o sólido desenhado e as letras das medidas. */
export function telaDoSolido(s: Solido): Cena {
  const { d, medidas, fala: dita } = desenhoDo(s);
  return {
    tipo: 'lousa',
    fala: fala(`A questão não traz figura. Vamos desenhar.`, dita),
    desenho: [titulo('a figura'), ...d, tx(200, 268, medidas, 'cinza', 16, 4.2)],
  };
}

const XYZ: Record<string, string> = { c: 'x', l: 'y', a: 'z' };

/** A conta da aula chama as medidas de x, y e z: a figura usa as mesmas letras. */
function comLetrasXyz(cena: Cena): Cena {
  if (cena.tipo !== 'lousa') return cena;
  return {
    ...cena,
    fala: fala('A questão não traz figura. Vamos desenhar.', 'Uma caixa (paralelepípedo): três medidas, x, y e z. As faces opostas são iguais.'),
    desenho: cena.desenho.map((d) => {
      if (d.k !== 'tx') return d;
      if (XYZ[d.s]) return { ...d, s: XYZ[d.s] };
      return d.s.startsWith('c = ') ? { ...d, s: 'x, y, z = as três medidas' } : d;
    }),
  };
}

/** Põe a tela do sólido logo depois do papel da questão, só se a questão não tem imagem. */
export function comFiguraDoSolido(aula: AulaLousa, enunciado: string, temImagem: boolean): AulaLousa {
  // A aula já traz o desenho da própria questão: o sólido genérico (cone de ponta para cima) só atrapalha.
  if (temImagem || aula.cenas.some((c) => c.tipo === 'figura')) return aula;
  const s = solidoDoEnunciado(enunciado);
  if (!s) return aula;
  const ultimoPapel = aula.cenas.reduce((i, c, k) => (c.tipo === 'papel' ? k : i), -1);
  if (ultimoPapel < 0) return aula;
  const usaXyz = s === 'caixa' && JSON.stringify(aula.cenas).includes('x + y + z');
  const figura = usaXyz ? comLetrasXyz(telaDoSolido(s)) : telaDoSolido(s);
  const cenas = [...aula.cenas.slice(0, ultimoPapel + 1), figura, ...aula.cenas.slice(ultimoPapel + 1)];
  return { cenas };
}
