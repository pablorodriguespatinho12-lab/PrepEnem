// Fichas de questões de GEOMETRIA PLANA no jeito do Pablo (22/11/2026): desenhar a figura, marcar
// lados e diagonal, equação a partir dos lados. Gerador: lib/aula-lousa/geometria.ts.
// canal: mat-20-poligonos-notaveis-geometria-plana.txt [11:12:00] (diagonal do quadrado, d = a√2).
import type { FichaGeometria } from '@/lib/aula-lousa/geometria';

export const FICHAS_GEOMETRIA: readonly FichaGeometria[] = [
  {
    id: 'd2-banco-mat-p26-07',
    lado: 20,
    raiz2: 1.4,
    certa: 'letra B, 14 m: a conta certa',
    erros: ['letra A, 10 m: metade do lado', 'letra C, 20 m: o próprio lado', 'letra D, 28 m: a diagonal inteira', 'letra E, 7 m: metade do raio'],
    prova: {
      lado: 10,
      opcoes: ['14 m', '10 m', '20 m', '7 m'],
      certa: 0,
      porque: [
        'Certo: 10 × 1,4 = 14 m. A diagonal é o lado vezes √2.',
        'Esse é o próprio lado. A diagonal, de canto a canto, é maior que o lado.',
        'É o dobro do lado. A diagonal é o lado vezes 1,4, não vezes 2.',
        'É metade da diagonal. Aqui se pede a diagonal inteira.',
      ],
    },
  },
];
