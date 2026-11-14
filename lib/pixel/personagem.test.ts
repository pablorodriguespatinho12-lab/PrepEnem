import { describe, expect, it } from 'vitest';
import { PALETA_DIA, paisagem, retanguloDaArvore } from './desenho';
import { QUADROS, QUADRO_W, desenharPersonagem, tipoDaMateria, type Tipo } from './personagem';

const pincel = () => {
  const pintados: [number, number][] = [];
  return { pintados, c: { fillStyle: '', fillRect: (x: number, _y: number, w: number) => { pintados.push([x, w]); } } };
};

describe('personagem por matéria', () => {
  it('reconhece a matéria da questão', () => {
    expect(tipoDaMateria('Física')).toBe('fisica');
    expect(tipoDaMateria('Química')).toBe('quimica');
    expect(tipoDaMateria('Biologia')).toBe('biologia');
    expect(tipoDaMateria('Matemática')).toBe('matematica');
    expect(tipoDaMateria('Português')).toBe('leitura');
    expect(tipoDaMateria(undefined)).toBe('leitura');
  });

  it('cada matéria desenha os 4 quadros', () => {
    for (const t of ['fisica', 'quimica', 'biologia', 'matematica', 'leitura'] as Tipo[]) {
      const { c, pintados } = pincel();
      desenharPersonagem(c, t);
      for (let q = 0; q < QUADROS; q++) {
        const noQuadro = pintados.filter(([x]) => x >= q * QUADRO_W && x < (q + 1) * QUADRO_W);
        expect(noQuadro.length, `${t} quadro ${q}`).toBeGreaterThan(20);
      }
    }
  });
});

describe('árvores ao vento', () => {
  it('a paisagem sem árvores devolve as mesmas árvores que a com árvores', () => {
    const com = paisagem(pincel().c, 270, 180, PALETA_DIA).arvores;
    const sem = paisagem(pincel().c, 270, 180, PALETA_DIA, undefined, true).arvores;
    expect(sem).toEqual(com);
    expect(com.length).toBeGreaterThan(10);
  });

  it('o retângulo cobre a copa inteira, mesmo entortada', () => {
    const r = retanguloDaArvore({ x: 50, chao: 100, h: 16 });
    expect(r.x).toBeLessThan(50 - 5 - 2);
    expect(r.x + r.w).toBeGreaterThan(50 + 5 + 2);
    expect(r.y).toBeLessThan(100 - 2 - 16);
  });
});
