'use client';
import type { ReactNode } from 'react';
import { circulo, ponto, type Pincel } from '@/lib/pixel/desenho';
import { Cena, LOUSA, Ponto, TINTA, type Lugar, type PropsFigura } from './pixel-cena';

/* Figuras em pixel de Química, Biologia e Matemática para as questões de
   reforço (Pablo, 12/11/2026: "com pelo menos uma imagenzinha de pixel").
   Cada uma: cena desenhada uma vez (120 × 70) + pontos que se mexem em CSS +
   4 lugares de rótulo, na ordem combinada no briefing das questões. */

const W = 120;
const H = 70;
const fundo = (c: Pincel) => ponto(c, LOUSA, 0, 0, W, H);
function caixa(c: Pincel, x: number, y: number, w: number, h: number, cor: string) {
  ponto(c, TINTA, x, y, w, h);
  ponto(c, cor, x + 1, y + 1, w - 2, h - 2);
}
function seta(c: Pincel, x: number, y: number, comp: number, cor: string) {
  ponto(c, cor, x, y, comp, 2);
  ponto(c, cor, x + comp - 2, y - 2, 2, 6);
  ponto(c, cor, x + comp, y - 1, 2, 4);
}
const L = (left: number, top: number): Lugar => ({ left: `${left}%`, top: `${top}%` });

function fig(chave: string, desenhar: (c: Pincel) => void, lugares: Lugar[], filhos?: (p: PropsFigura) => ReactNode) {
  return function Figura(p: PropsFigura) {
    return <Cena chave={chave} w={W} h={H} desenhar={desenhar} lugares={lugares} rotulos={p.rotulos} filhos={filhos?.(p)} />;
  };
}

/* ---------------- Química ---------------- */
const MoleculaCadeia = fig('fig-molecula', (c) => {
  fundo(c);
  for (let i = 0; i < 5; i++) {
    const x = 18 + i * 15;
    if (i < 4) ponto(c, '#55615b', x + 4, 34, 11, 2);
    circulo(c, '#3b4540', x, 35, 4);
    ponto(c, '#dfe6e1', x - 1, 24, 3, 3);
    ponto(c, '#dfe6e1', x - 1, 44, 3, 3);
    ponto(c, '#8a96a0', x, 27, 1, 4);
    ponto(c, '#8a96a0', x, 40, 1, 4);
  }
  ponto(c, '#55615b', 82, 34, 8, 2);
  circulo(c, '#d64545', 94, 35, 5);
  ponto(c, '#dfe6e1', 101, 33, 4, 4);
}, [L(46, 6), L(84, 66), L(46, 86), L(14, 66)], () => <Ponto x={89} y={42} tam={10} cor="rgba(214,69,69,.35)" anim="pulso" redondo dur={1.6} />);

const FumacaChamine = fig('fig-chamine', (c) => {
  fundo(c);
  ponto(c, '#9a8a72', 0, 60, W, 10);
  caixa(c, 8, 38, 34, 22, '#c8955a');
  for (let i = 0; i < 3; i++) ponto(c, '#fff3bf', 13 + i * 10, 46, 5, 5);
  caixa(c, 30, 14, 8, 25, '#8a8f8a');
  caixa(c, 70, 6, 40, 14, '#9aa3a8');
  ponto(c, '#b9c1c6', 74, 9, 30, 3);
}, [L(30, 4), L(80, 32), L(25, 86), L(80, 86)], () => (
  <>
    {[0, 1, 2].map((i) => <Ponto key={i} x={31} y={14} tam={6} cor="#8a96a0" anim="anda" dx={4 + i * 2} dy={-14} dur={3} atraso={-i} redondo />)}
    {[0, 1, 2, 3].map((i) => <Ponto key={`g${i}`} x={64 + i * 8} y={30} tam={1.6} cor="#5aa3c0" anim="anda" dy={36} dur={1.6} atraso={-i * 0.4} />)}
  </>
));

const BequerPh = fig('fig-bequer', (c) => {
  fundo(c);
  caixa(c, 44, 18, 32, 34, '#f4f8f6');
  ponto(c, '#7cc98a', 45, 32, 30, 19);
  ponto(c, '#a6dcb0', 45, 32, 30, 2);
  caixa(c, 57, 2, 6, 12, '#dfe6e1');
  const cores = ['#d64545', '#e8783f', '#f2a33a', '#f2d24a', '#a8d84a', '#4fae6a', '#3a9ea0', '#4a6fd0', '#7a4fc0'];
  cores.forEach((cor, i) => ponto(c, cor, 14 + i * 10, 58, 10, 6));
  ponto(c, TINTA, 14, 64, 90, 1);
}, [L(16, 30), L(86, 30), L(60, 86), L(16, 10)], () => (
  <>
    <Ponto x={59} y={18} tam={2.2} cor="#4fae6a" anim="anda" dy={22} dur={1.4} />
    <Ponto x={60} y={74} tam={3} cor="#22302a" anim="vai-e-volta" dx={20} dur={3} />
  </>
));

const PilhaEletrodos = fig('fig-eletrodos', (c) => {
  fundo(c);
  caixa(c, 10, 30, 36, 30, '#d7eef6');
  caixa(c, 74, 30, 36, 30, '#d7eef6');
  ponto(c, '#9fd0e4', 11, 40, 34, 19);
  ponto(c, '#9fd0e4', 75, 40, 34, 19);
  caixa(c, 24, 16, 6, 40, '#9aa3a8');
  caixa(c, 90, 16, 6, 40, '#d08a4a');
  ponto(c, '#55615b', 26, 10, 2, 7);
  ponto(c, '#55615b', 92, 10, 2, 7);
  ponto(c, '#55615b', 26, 10, 68, 2);
  caixa(c, 50, 38, 20, 6, '#f4ead7');
}, [L(24, 86), L(80, 86), L(50, 4), L(50, 66)], () => (
  [0, 1, 2, 3].map((i) => <Ponto key={i} x={22} y={12} tam={2.5} cor="#f2c94c" anim="anda" dx={56} dur={2.4} atraso={-i * 0.6} />)
));

const BalancaReceita = fig('fig-receita', (c) => {
  fundo(c);
  circulo(c, '#d64545', 14, 34, 5);
  circulo(c, '#d64545', 26, 34, 5);
  circulo(c, '#4a6fd0', 20, 46, 5);
  seta(c, 46, 38, 22, '#55615b');
  circulo(c, '#7a4fc0', 88, 32, 5);
  circulo(c, '#7a4fc0', 100, 32, 5);
  circulo(c, '#4fae6a', 94, 46, 5);
}, [L(20, 86), L(84, 86), L(50, 10), L(50, 62)], () => <Ponto x={52} y={50} tam={3} cor="#f2c94c" anim="anda" dx={12} dur={1.2} />);

/* ---------------- Biologia ---------------- */
const CadeiaAlimentar = fig('fig-cadeia', (c) => {
  fundo(c);
  ponto(c, '#9a8a72', 0, 58, W, 12);
  for (let i = 0; i < 6; i++) ponto(c, '#4fae6a', 14 + i * 3, 46 - (i % 2) * 4, 2, 12 + (i % 2) * 4);
  caixa(c, 48, 44, 18, 10, '#7cc98a');
  ponto(c, TINTA, 62, 46, 2, 2);
  ponto(c, TINTA, 50, 54, 1, 4);
  ponto(c, TINTA, 62, 54, 1, 4);
  for (let i = 0; i < 6; i++) ponto(c, '#8a6a4a', 84 + i * 4, 50 + (i % 2 ? 2 : -2), 4, 4);
  ponto(c, TINTA, 106, 48, 2, 2);
  seta(c, 26, 42, 16, '#55615b');
  seta(c, 68, 42, 12, '#55615b');
}, [L(18, 86), L(48, 86), L(84, 86), L(50, 10)], () => (
  <>
    <Ponto x={30} y={56} tam={2} cor="#f2c94c" anim="pisca" dur={1} />
    <Ponto x={68} y={56} tam={1.4} cor="#f2c94c" anim="pisca" dur={1} atraso={0.5} />
  </>
));

const Celula = fig('fig-celula', (c) => {
  fundo(c);
  for (let y = -26; y <= 26; y++) for (let x = -44; x <= 44; x++) {
    const d = (x * x) / (44 * 44) + (y * y) / (26 * 26);
    if (d <= 1) ponto(c, d > 0.9 ? TINTA : '#e6f3d6', 50 + x, 35 + y);
  }
  circulo(c, '#7a4fc0', 40, 34, 9);
  circulo(c, '#a888e0', 38, 32, 3);
  for (let i = 0; i < 8; i++) ponto(c, '#55615b', 62 + (i % 4) * 5, 22 + Math.floor(i / 4) * 26, 2, 2);
  caixa(c, 66, 32, 16, 9, '#f2a33a');
  ponto(c, '#c2702a', 68, 36, 12, 1);
}, [L(86, 20), L(86, 84), L(14, 10), L(14, 86)], () => <Ponto x={53} y={42} tam={16} cor="rgba(242,163,58,.3)" anim="pulso" redondo dur={1.4} />);

const Cruzamento = fig('fig-cruzamento', (c) => {
  fundo(c);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) caixa(c, 40 + i * 21, 14 + j * 21, 20, 20, (i === 1 && j === 1) ? '#f2d27a' : '#dfe6e1');
  ponto(c, '#55615b', 40, 10, 41, 2);
  ponto(c, '#55615b', 36, 14, 2, 41);
}, [L(51, 4), L(18, 46), L(51, 86), L(86, 46)], () => <Ponto x={59.5} y={50} tam={14} cor="rgba(242,201,76,.45)" anim="pulso" dur={1.6} />);

const CorpoSangue = fig('fig-sangue', (c) => {
  fundo(c);
  ponto(c, '#b84a4a', 8, 15, 104, 2);
  ponto(c, '#b84a4a', 110, 15, 2, 45);
  ponto(c, '#4a6fd0', 8, 58, 104, 2);
  ponto(c, '#4a6fd0', 8, 15, 2, 45);
  circulo(c, '#d64545', 55, 14, 6);
  circulo(c, '#d64545', 65, 14, 6);
  for (let k = 0; k < 8; k++) ponto(c, '#d64545', 52 + k, 18 + k, 16 - 2 * k, 1);
  caixa(c, 48, 50, 24, 14, '#f4ead7');
}, [L(60, 40), L(86, 48), L(60, 86), L(18, 48)], () => (
  <>
    {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className="fig-carga fig-sangue" style={{ animationDelay: `${-i}s` }} aria-hidden />)}
    <Ponto x={50} y={6} tam={16} cor="rgba(214,69,69,.3)" anim="pulso" redondo dur={0.9} />
  </>
));

const SelecaoNatural = fig('fig-selecao', (c) => {
  fundo(c);
  ponto(c, '#9a8a72', 0, 62, W, 8);
  caixa(c, 50, 2, 20, 62, '#4a3a2a');
  for (let y = 6; y < 60; y += 6) ponto(c, '#3a2c20', 54, y, 3, 2);
  ponto(c, '#2c2018', 54, 24, 6, 4);
  ponto(c, '#2c2018', 60, 44, 6, 4);
}, [L(50, 86), L(84, 40), L(18, 40), L(50, 4)], () => (
  <>
    <Ponto x={44} y={52} tam={5} cor="#e8e2cf" anim="pisca" dur={1.4} />
    <Ponto x={44} y={20} tam={5} cor="#e8e2cf" anim="pisca" dur={1.4} atraso={0.7} />
  </>
));

const VirusBacteria = fig('fig-virus', (c) => {
  fundo(c);
  circulo(c, '#7a4fc0', 18, 40, 7);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    ponto(c, '#7a4fc0', 18 + Math.round(Math.cos(a) * 10), 40 + Math.round(Math.sin(a) * 10), 2, 2);
  }
  circulo(c, '#f2d7b0', 98, 26, 6);
  caixa(c, 92, 33, 13, 22, '#4a6fd0');
  ponto(c, '#3a4a8a', 93, 55, 4, 10);
  ponto(c, '#3a4a8a', 100, 55, 4, 10);
}, [L(18, 82), L(52, 8), L(84, 86), L(52, 86)], () => (
  <>
    <Ponto x={50} y={34} tam={4} cor="#3b4540" anim="vai-e-volta" dx={10} dy={-6} dur={1.2} />
    <Ponto x={16} y={36} tam={12} cor="rgba(122,79,192,.25)" anim="pulso" redondo dur={1.6} />
  </>
));

/* ---------------- Matemática ---------------- */
const PorcentagemBarra = fig('fig-cem', (c) => {
  fundo(c);
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) caixa(c, 33 + i * 5.5, 8 + j * 5.5, 5, 5, '#ffffff');
}, [L(50, 2), L(86, 50), L(50, 86), L(14, 50)], () => <div className="fig-enche-largura" aria-hidden />);

const GraficoBarras = fig('fig-barras', (c) => {
  fundo(c);
  ponto(c, TINTA, 20, 8, 2, 52);
  ponto(c, TINTA, 20, 58, 86, 2);
  [26, 38, 18, 44, 30].forEach((h, i) => caixa(c, 28 + i * 16, 58 - h, 10, h, ['#4fae6a', '#4a6fd0', '#f2a33a', '#7a4fc0', '#3a9ea0'][i]));
}, [L(50, 2), L(88, 26), L(50, 86), L(10, 30)], () => <div className="fig-linha-media" aria-hidden />);

const FuncaoReta = fig('fig-reta', (c) => {
  fundo(c);
  ponto(c, TINTA, 16, 6, 2, 56);
  ponto(c, TINTA, 16, 60, 96, 2);
  for (let k = 0; k <= 80; k++) ponto(c, '#2a7c8f', 18 + k, 52 - Math.round(k * 0.5), 2, 2);
}, [L(50, 2), L(15, 74), L(84, 26), L(84, 86)], () => <Ponto x={14} y={72} tam={3.5} cor="#d64545" anim="vai-e-volta" dx={66} dy={-57} dur={3} />);

const SolidoCaixa = fig('fig-solido', (c) => {
  fundo(c);
  ponto(c, TINTA, 34, 18, 44, 40);
  ponto(c, '#d7eef6', 35, 19, 42, 38);
  for (let k = 0; k < 10; k++) {
    ponto(c, TINTA, 34 + k, 18 - k, 44, 1);
    ponto(c, TINTA, 78 + k, 18 - k, 1, 40);
  }
  ponto(c, '#bcdde8', 45, 9, 42, 8);
}, [L(54, 86), L(90, 58), L(16, 54), L(54, 2)], () => <div className="fig-enche-altura" aria-hidden />);

const FiguraPlana = fig('fig-plana', (c) => {
  fundo(c);
  caixa(c, 12, 18, 40, 30, '#d7eef6');
  ponto(c, TINTA, 70, 14, 2, 36);
  ponto(c, TINTA, 70, 48, 38, 2);
  for (let k = 0; k <= 36; k++) ponto(c, TINTA, 70 + Math.round(k * (38 / 36)), 14 + k, 2, 1);
  ponto(c, '#d64545', 72, 42, 6, 1);
  ponto(c, '#d64545', 77, 42, 1, 6);
}, [L(32, 82), L(12, 46), L(50, 4), L(76, 82)], () => <Ponto x={10} y={24} tam={36} cor="rgba(79,174,106,.18)" anim="pulso" dur={2} />);

const EscalaRegua = fig('fig-mapa', (c) => {
  fundo(c);
  caixa(c, 10, 6, 100, 44, '#cfe6b8');
  for (let y = 7; y < 49; y++) ponto(c, '#6fb7d6', 60 + Math.round(Math.sin(y / 6) * 4), y, 3, 1);
  circulo(c, '#d64545', 26, 24, 3);
  circulo(c, '#d64545', 92, 34, 3);
  caixa(c, 10, 56, 100, 8, '#f2d27a');
  for (let x = 12; x < 110; x += 10) ponto(c, TINTA, x, 56, 1, 4);
}, [L(50, 86), L(56, 30), L(84, 4), L(14, 4)], () => <Ponto x={22} y={33} tam={2.5} cor="#22302a" anim="vai-e-volta" dx={54} dy={13} dur={2.4} />);

/* Cone (casquinha): 1/3 da base × altura; o sorvete vai enchendo de baixo para cima. */
const Cone = fig('fig-cone', (c) => {
  fundo(c);
  for (let y = 0; y <= 46; y++) {
    const meia = Math.round((46 - y) * 0.45);
    ponto(c, TINTA, 60 - meia - 1, 12 + y, 1, 1);
    ponto(c, TINTA, 60 + meia + 1, 12 + y, 1, 1);
    if (meia > 0) ponto(c, (y + Math.floor(y / 3)) % 4 === 0 ? '#c8955a' : '#e8b878', 60 - meia, 12 + y, meia * 2 + 1, 1);
  }
  for (let x = -21; x <= 21; x++) ponto(c, TINTA, 60 + x, 12 - Math.round(Math.sqrt(Math.max(0, 1 - (x * x) / 441)) * 4), 1, 1);
  for (let x = -21; x <= 21; x++) ponto(c, TINTA, 60 + x, 12 + Math.round(Math.sqrt(Math.max(0, 1 - (x * x) / 441)) * 4), 1, 1);
  ponto(c, '#d64545', 60, 12, 1, 46);
}, [L(84, 10), L(78, 50), L(30, 86), L(20, 30)], () => <Ponto x={44} y={4} tam={12} cor="rgba(242,184,198,.55)" anim="pulso" redondo dur={1.8} />);

/* Parábola com a boca para baixo: o ponto sobe até o vértice e desce. */
const Parabola = fig('fig-parabola', (c) => {
  fundo(c);
  ponto(c, TINTA, 16, 6, 2, 56);
  ponto(c, TINTA, 16, 60, 96, 2);
  for (let x = 0; x <= 90; x++) {
    const y = 58 - Math.round((x * (90 - x)) / 45);
    if (y >= 6) ponto(c, '#2a7c8f', 18 + x, y, 2, 2);
  }
  for (let y = 14; y < 60; y += 4) ponto(c, '#8a96a0', 63, y, 1, 2);
}, [L(50, 2), L(15, 74), L(76, 18), L(84, 86)], () => (
  <>
    <Ponto x={13} y={78} tam={3.5} cor="#d64545" anim="vai-e-volta" dx={38} dy={-61} dur={2} />
    <Ponto x={51} y={12} tam={6} cor="rgba(242,201,76,.5)" anim="pulso" dur={1.4} />
  </>
));

export const FIGURAS_AREAS = {
  cone: Cone,
  parabola: Parabola,
  'molecula-cadeia': MoleculaCadeia,
  'fumaca-chamine': FumacaChamine,
  'bequer-ph': BequerPh,
  'pilha-eletrodos': PilhaEletrodos,
  'balanca-receita': BalancaReceita,
  'cadeia-alimentar': CadeiaAlimentar,
  celula: Celula,
  cruzamento: Cruzamento,
  'corpo-sangue': CorpoSangue,
  'selecao-natural': SelecaoNatural,
  'virus-bacteria': VirusBacteria,
  'porcentagem-barra': PorcentagemBarra,
  'grafico-barras': GraficoBarras,
  'funcao-reta': FuncaoReta,
  'solido-caixa': SolidoCaixa,
  'figura-plana': FiguraPlana,
  'escala-regua': EscalaRegua,
} as const;
