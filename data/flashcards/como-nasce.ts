// Cartões "Como nasce a fórmula" (Pablo, 22/11/2026: "relembrar como é que foi a construção
// da fórmula"). Frente: monte do zero no papel; verso: o caso com números ANTES da letra
// (decisão "Número antes de letra"), uma ideia por linha. PILOTO de 10; o resto só depois do ok dele.
// Fonte única: o seed (scripts/seed-como-nasce.ts) e o teste (como-nasce.test.ts) leem daqui.

export interface CartaoComoNasce {
  /** Matéria do baralho. */
  materia: 'Física' | 'Matemática';
  frente: string;
  verso: string;
  dica?: string;
}

const NO_PAPEL = 'Escreva no papel e depois vire.';

export const CARTOES_COMO_NASCE: readonly CartaoComoNasce[] = [
  {
    materia: 'Física',
    frente: `De onde vem Vm = Δs ÷ Δt (velocidade média)? ${NO_PAPEL}`,
    verso: [
      'Um carro anda 120 km em 2 horas.',
      'Em 1 hora ele andou 120 ÷ 2 = 60 km.',
      'Quanto anda em cada 1 hora é a velocidade: 60 km/h.',
      'Em letras: distância ÷ tempo, Vm = Δs ÷ Δt.',
    ].join('\n'),
    dica: 'Δ quer dizer "variação" (quanto mudou).',
  },
  {
    materia: 'Física',
    frente: `Por que km/h vira m/s dividindo por 3,6? ${NO_PAPEL}`,
    verso: [
      '1 km/h = 1 000 m em 3 600 s.',
      '1 000 ÷ 3 600 = 1 ÷ 3,6.',
      'Então 1 km/h vale 1 ÷ 3,6 m/s.',
      'Exemplo: 72 km/h ÷ 3,6 = 20 m/s.',
    ].join('\n'),
  },
  {
    materia: 'Física',
    frente: `De onde vem v = v₀ + a·t (MUV)? ${NO_PAPEL}`,
    verso: [
      'Aceleração é quanto a velocidade muda a cada 1 segundo.',
      'Começa em 5 m/s e ganha 3 m/s a cada segundo.',
      '1 s: 8. 2 s: 11. 4 s: 5 + 3 × 4 = 17 m/s.',
      'Em letras: v = v₀ + a·t.',
    ].join('\n'),
  },
  {
    materia: 'Física',
    frente: `De onde vem s = a·t² ÷ 2 (parte do repouso)? ${NO_PAPEL}`,
    verso: [
      'Parte parado e acelera a 2 m/s², durante 3 s.',
      'Velocidade final: 2 × 3 = 6 m/s.',
      'A velocidade média é a metade: (0 + 6) ÷ 2 = 3 m/s.',
      'Distância = média × tempo = 3 × 3 = 9 m.',
      'Em letras: (a·t ÷ 2) × t = a·t² ÷ 2.',
    ].join('\n'),
  },
  {
    materia: 'Física',
    frente: `De onde vem Q = m · c · ΔT (calor que muda a temperatura)? ${NO_PAPEL}`,
    verso: [
      '1 g de água precisa de 1 cal para subir 1 °C.',
      '200 g, subindo 10 °C: 200 × 10 = 2 000 cal.',
      'Cada substância tem o seu c (quanto calor 1 g precisa para subir 1 °C). Para a água, c = 1.',
      'Em letras: Q = m · c · ΔT.',
    ].join('\n'),
  },
  {
    materia: 'Matemática',
    frente: `De onde vem a fórmula de Bhaskara? Comece por x² + 6x + 5 = 0. ${NO_PAPEL}`,
    verso: [
      'x² + 6x = −5.',
      'Some 9 dos dois lados (a metade de 6 é 3, e 3 × 3 = 9): x² + 6x + 9 = 4.',
      'O lado esquerdo vira (x + 3)², então (x + 3)² = 4.',
      'x + 3 = 2 ou x + 3 = −2, e x = −1 ou x = −5.',
      'Bhaskara faz esse mesmo "completar o quadrado" com letras.',
    ].join('\n'),
  },
  {
    materia: 'Matemática',
    frente: `De onde vem a soma da PA: S = n·(a₁ + aₙ) ÷ 2? ${NO_PAPEL}`,
    verso: [
      'Some 1 + 2 + ... + 10.',
      'Junte as pontas: 1 + 10 = 11, 2 + 9 = 11, 3 + 8 = 11...',
      'São 5 pares de 11: 5 × 11 = 55.',
      'Em letras: n termos formam n ÷ 2 pares de (a₁ + aₙ).',
    ].join('\n'),
  },
  {
    materia: 'Matemática',
    frente: `De onde vem M = C·(1 + i)ᵗ (juros compostos)? ${NO_PAPEL}`,
    verso: [
      'R$ 100 a 10% ao ano. 10% a mais é vezes 1,10.',
      'Ano 1: 100 × 1,10 = 110.',
      'Ano 2: 110 × 1,10 = 121 (o juro agora rende juro).',
      'Ano 2 é 100 × 1,10 × 1,10, uma multiplicação por ano.',
      'Em letras: M = C·(1 + i)ᵗ.',
    ].join('\n'),
  },
  {
    materia: 'Matemática',
    frente: `Por que aumento de 20% é multiplicar por 1,20? ${NO_PAPEL}`,
    verso: [
      'Preço 50 com aumento de 20%.',
      '20% de 50 = 10, então fica 50 + 10 = 60.',
      'O mesmo: 50 × 1 + 50 × 0,20 = 50 × 1,20 = 60.',
      'Desconto de 30% é o contrário: 100% − 30% = 70%, vezes 0,70.',
    ].join('\n'),
  },
  {
    materia: 'Matemática',
    frente: `De onde vem a combinação C(n, p) = arranjo ÷ p!? ${NO_PAPEL}`,
    verso: [
      'Escolher 2 de 4 pessoas (A, B, C, D), sem importar a ordem.',
      'Com ordem: 4 × 3 = 12 (AB e BA contam separados).',
      'Cada par aparece 2 vezes (AB e BA), 2 × 1 = 2!.',
      '12 ÷ 2 = 6 duplas.',
      'Em letras: C(n, p) = arranjo(n, p) ÷ p!.',
    ].join('\n'),
  },
];
