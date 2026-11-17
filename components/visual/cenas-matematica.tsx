'use client';
import { circulo, ponto, type Pincel } from '@/lib/pixel/desenho';
import { Ponto, TINTA, type Lugar } from './pixel-cena';
import { cena, caixa, fundo, px, py } from './cenas-questoes';

/* Local, e não importado: cenas-questoes importa este arquivo, e o L de lá ainda não
   existe quando estas cenas são montadas (importação circular). */
const L = (left: number, top: number): Lugar => ({ left: `${left}%`, top: `${top}%` });

/* Cenas das questões de Matemática do banco ENEM (Pablo, 16/11/2026: "uma imagem
   para ter uma ideia como é essa questão", e cada questão com uma situação
   diferente: nada de "disco no alvo" repetido). Vista de cima, grade 120 × 70. */

/* Ponto se ancora pelo canto de cima; isto devolve onde pôr para o CENTRO cair em
   (cx, cy) da grade. A altura em % é maior: a cena é 120 × 70 e o ponto é redondo. */
const centro = (cx: number, cy: number, tam: number) => ({ x: (cx / 120) * 100 - tam / 2, y: (cy / 70) * 100 - (tam / 2) * (120 / 70) });

const PISO = '#e8d9b8';
const PISO_LINHA = '#d6c39a';
const SECO = '#e8c45a';
const GRAMA = '#7cc46a';
const AGUA = '#6fb7d6';

/** Piso de tacos visto de cima: quadrado de lado `l` com canto em (x, y). */
function piso(c: Pincel, x: number, y: number, l: number) {
  caixa(c, x, y, l, l, PISO);
  for (let k = 8; k < l - 1; k += 8) { ponto(c, PISO_LINHA, x + 1, y + k, l - 2, 1); ponto(c, PISO_LINHA, x + k, y + 1, 1, l - 2); }
}

// Robô aspirador redondo numa sala quadrada: os 4 cantinhos que ele não alcança.
const RoboAspirador = cena('cena-robo-aspirador', (c) => {
  fundo(c);
  piso(c, 32, 6, 58);
  const r = 7;
  // cantinhos que o robô não alcança, em vermelho claro
  for (const [cx, cy, sx, sy] of [[33, 7, 1, 1], [89, 7, -1, 1], [33, 63, 1, -1], [89, 63, -1, -1]]) {
    for (let a = 0; a < r; a++) for (let b = 0; b < r; b++) {
      const dx = r - a, dy = r - b;
      if (dx * dx + dy * dy > r * r) ponto(c, '#f2a3a3', cx + sx * a, cy + sy * b);
    }
  }
}, [L(17, 10), L(17, 50), L(83, 90), L(83, 10)], () => (
  <>
    <Ponto x={px(33)} y={py(7)} tam={11.5} cor="#55615b" anim="vai-e-volta" dx={px(44)} dur={4} redondo />
    <Ponto x={px(36)} y={py(10)} tam={3} cor="#4fae6a" anim="vai-e-volta" dx={px(44)} dur={4} redondo />
  </>
));

// Irrigação que gira no meio de um terreno quadrado: molha um círculo, os cantos secam.
const Irrigacao = cena('cena-irrigacao', (c) => {
  fundo(c);
  caixa(c, 32, 6, 58, 58, SECO);
  circulo(c, GRAMA, 61, 35, 28);
  circulo(c, TINTA, 61, 35, 2);
  ponto(c, '#55615b', 61, 34, 26, 2); // braço do irrigador
}, [L(17, 10), L(17, 50), L(83, 90), L(83, 10)], () => (
  <>
    <Ponto {...centro(61, 35, 47)} tam={47} cor="rgba(111,183,214,.22)" anim="pulso" dur={2.4} redondo />
    {Array.from({ length: 4 }, (_, i) => (
      <Ponto key={i} x={px(64 + i * 6)} y={py(34)} tam={2} cor={AGUA} anim="anda" dy={-4} dur={1.2} atraso={-i * 0.3} />
    ))}
  </>
));

// Antena de celular no meio do bairro: o sinal precisa chegar aos 4 cantos.
const AntenaBairro = cena('cena-antena-bairro', (c) => {
  fundo(c);
  caixa(c, 26, 12, 70, 46, '#d7eef6');
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
    if (i === 1 && j === 0) continue;
    caixa(c, 30 + i * 16, 16 + j * 22, 12, 16, ['#f2a33a', '#d64545', '#7a4fc0', '#4a6fd0'][(i + j) % 4]);
  }
  ponto(c, TINTA, 60, 20, 2, 18); // torre
  ponto(c, TINTA, 56, 22, 10, 1);
  ponto(c, '#d64545', 60, 18, 2, 2);
  for (const [x, y] of [[26, 12], [95, 12], [26, 57], [95, 57]]) ponto(c, '#d64545', x - 1, y - 1, 3, 3); // cantos
}, [L(17, 10), L(17, 50), L(83, 90), L(83, 10)], () => (
  <>
    <Ponto {...centro(61, 19, 18)} tam={18} cor="rgba(214,69,69,.25)" anim="pulso" dur={1.6} redondo />
    <Ponto {...centro(61, 19, 34)} tam={34} cor="rgba(214,69,69,.12)" anim="pulso" dur={1.6} atraso={-0.8} redondo />
  </>
));

// Porta de quarto vista de cima: ao abrir, ela varre 1/4 de círculo no chão.
const PortaQuarto = cena('cena-porta-quarto', (c) => {
  fundo(c);
  piso(c, 30, 8, 60);
  ponto(c, TINTA, 29, 7, 62, 2); // parede de cima
  ponto(c, TINTA, 29, 7, 2, 62); // parede da esquerda
  for (let a = 0; a < 28; a++) for (let b = 0; b < 28; b++) if (a * a + b * b <= 28 * 28) ponto(c, '#cfe8dc', 31 + a, 9 + b);
  ponto(c, '#8a6440', 31, 9, 2, 28); // a porta aberta, encostada na parede
  ponto(c, TINTA, 30, 8, 3, 3); // dobradiça
}, [L(17, 10), L(17, 50), L(83, 90), L(83, 10)], () => (
  <Ponto x={px(31)} y={py(9)} tam={3} cor="#d64545" anim="pulso" dur={1.6} />
));

// Palco de 3 pontas visto de cima, com o holofote no centro.
const PalcoHolofote = cena('cena-palco-holofote', (c) => {
  fundo(c);
  for (let y = 0; y < 52; y++) {
    const meia = Math.round((y * 30) / 52);
    ponto(c, y === 51 ? TINTA : '#c98a4a', 61 - meia, 9 + y, meia * 2 + 1, 1);
    ponto(c, TINTA, 61 - meia, 9 + y, 1, 1);
    ponto(c, TINTA, 61 + meia, 9 + y, 1, 1);
  }
  circulo(c, TINTA, 61, 44, 2); // holofote no centro (2/3 da altura)
}, [L(17, 10), L(17, 50), L(83, 90), L(83, 10)], () => (
  <>
    <Ponto {...centro(61, 44, 30)} tam={30} cor="rgba(232,196,90,.28)" anim="pulso" dur={2} redondo />
    <Ponto {...centro(61, 44, 52)} tam={52} cor="rgba(232,196,90,.14)" anim="pulso" dur={2} atraso={-1} redondo />
  </>
));

// Parque com trilhas: portaria, lago, mirante, cachoeira e saída.
const TrilhasParque = cena('cena-trilhas-parque', (c) => {
  fundo(c);
  ponto(c, GRAMA, 8, 20, 104, 32);
  caixa(c, 10, 31, 8, 8, '#d64545'); // portaria
  circulo(c, AGUA, 38, 35, 7); // lago
  ponto(c, '#8a6440', 64, 28, 4, 12); // mirante
  ponto(c, AGUA, 84, 22, 3, 18); // cachoeira
  caixa(c, 102, 31, 8, 8, '#4a6fd0'); // saída
  for (const [x1, x2, n] of [[18, 31, 4], [45, 64, 7], [68, 84, 1], [87, 102, 3]]) {
    for (let i = 0; i < n; i++) ponto(c, PISO, x1, 26 + (n === 1 ? 9 : Math.round((18 * i) / (n - 1))), x2 - x1, 1);
  }
}, [L(17, 10), L(17, 50), L(83, 90), L(83, 10)], () => (
  <Ponto x={px(18)} y={py(34)} tam={2.5} cor="#d64545" anim="anda" dx={px(84)} dur={5} />
));

export const CENAS_MATEMATICA = {
  'cena-robo-aspirador': RoboAspirador,
  'cena-irrigacao': Irrigacao,
  'cena-antena-bairro': AntenaBairro,
  'cena-porta-quarto': PortaQuarto,
  'cena-palco-holofote': PalcoHolofote,
  'cena-trilhas-parque': TrilhasParque,
} as const;
