'use client';
import type { ReactNode } from 'react';
import { circulo, ponto, type Pincel } from '@/lib/pixel/desenho';
import { Cena, LOUSA, Ponto, Sprite, TINTA, type Lugar, type PropsFigura } from './pixel-cena';
import { ROUPAS, pessoa, type Tipo } from '@/lib/pixel/personagem';

/* Cena da SITUAÇÃO de cada questão, na tela da questão (Pablo, 14/11/2026: "se a
   questão fala de um menino puxando uma corda, desenha o menino, pixelado, com uma
   animaçãozinha dele se mexendo, bem leve e fluido"). Cena parada desenhada UMA vez +
   sprites de poucos quadros + pontos que andam 1 pixel por passo (.fig-cena-fluida).
   Grade 120 × 70; x e y dos pontos em % da cena. */

const W = 120;
const H = 70;
const px = (x: number) => (x / W) * 100;
const py = (y: number) => (y / H) * 100;
const L = (left: number, top: number): Lugar => ({ left: `${left}%`, top: `${top}%` });
const fundo = (c: Pincel) => ponto(c, LOUSA, 0, 0, W, H);
function caixa(c: Pincel, x: number, y: number, w: number, h: number, cor: string) {
  ponto(c, TINTA, x, y, w, h);
  ponto(c, cor, x + 1, y + 1, w - 2, h - 2);
}
const mesa = (c: Pincel) => { ponto(c, '#b98a5a', 0, 56, W, 3); ponto(c, '#8a6440', 0, 59, W, 11); };

function cena(chave: string, desenhar: (c: Pincel) => void, lugares: Lugar[], filhos: () => ReactNode) {
  return function CenaDaQuestao(p: PropsFigura) {
    return (
      <Cena chave={chave} w={W} h={H} desenhar={desenhar} lugares={lugares} rotulos={p.rotulos}
        filhos={<div className="fig-cena-fluida" style={{ position: 'absolute', inset: 0 }}>{filhos()}</div>} />
    );
  };
}

/* ---------- peças que se mexem ---------- */

/** Chama de 3 quadros (12 × 14): tremula. `azul` = gás de fogão. */
const desenharChama = (azul: boolean) => (c: Pincel, q: number) => {
  const fora = azul ? '#4a8fe0' : '#f2a33a';
  const dentro = azul ? '#bfe0ff' : '#fff3bf';
  const topo = [2, 0, 1][q];
  const lado = [0, 1, -1][q];
  for (let y = topo; y < 14; y++) {
    const meia = Math.min(5, Math.round((y - topo) * 0.55));
    ponto(c, fora, 6 - meia + (y < 6 ? lado : 0), y, meia * 2, 1);
  }
  for (let y = topo + 6; y < 13; y++) ponto(c, dentro, 5, y, 2, 1);
};
const chamaAzul = desenharChama(true);
const chamaAmarela = desenharChama(false);

/** Mão com o dedo e a unha (para o esmalte): 3 quadros, o dedo mexe 1 pixel. */
const bolhas = (x: number, y: number, n: number, cor: string, subida = 30, dur = 2.4) =>
  Array.from({ length: n }, (_, i) => (
    <Ponto key={`b${x}-${i}`} x={px(x + (i % 3) * 3)} y={py(y)} tam={2.2} cor={cor} anim="anda" dy={-subida} dx={i % 2 ? 2 : -2} dur={dur} atraso={-i * (dur / n)} redondo />
  ));
const gotas = (x: number, y: number, n: number, cor: string, queda = 22, dur = 1.6) =>
  Array.from({ length: n }, (_, i) => (
    <Ponto key={`g${x}-${i}`} x={px(x)} y={py(y)} tam={2} cor={cor} anim="anda" dy={queda} dur={dur} atraso={-i * (dur / n)} />
  ));

/** Pessoa de 22 × 22 respirando e piscando (2 quadros), em pé com os pés em `chao`. */
const desenhosDePessoa: Partial<Record<Tipo, (c: Pincel, q: number) => void>> = {};
function Gente({ tipo, x, chao, fps = 2 }: { tipo: Tipo; x: number; chao: number; fps?: number }) {
  desenhosDePessoa[tipo] ??= (c, q) => pessoa(c, -5, q, ROUPAS[tipo]);
  return <Sprite chave={`gente-${tipo}`} w={22} h={22} quadros={2} desenhar={desenhosDePessoa[tipo]!} x={px(x)} y={py(chao - 21)} largura={px(22)} fps={fps} />;
}

/* ---------- desenhos parados ---------- */

function fogao(c: Pincel, x: number) {
  caixa(c, x, 40, 40, 18, '#dfe3e6');
  ponto(c, '#9aa3a8', x + 2, 40, 36, 2);
  ponto(c, TINTA, x + 6, 46, 4, 4); ponto(c, TINTA, x + 30, 46, 4, 4);
  ponto(c, '#55615b', x + 8, 37, 24, 3); // grade da boca
}
function panela(c: Pincel, x: number, y: number) {
  caixa(c, x, y, 26, 12, '#8a96a0');
  ponto(c, '#6fb7d6', x + 2, y + 2, 22, 3);
  ponto(c, TINTA, x - 4, y + 2, 4, 2);
}
function frasco(c: Pincel, x: number, y: number, liquido: string | null, rotulo: string) {
  caixa(c, x + 5, y, 6, 5, '#dfe6e1');
  caixa(c, x, y + 4, 16, 22, '#eef6f8');
  if (liquido) ponto(c, liquido, x + 1, y + 12, 14, 13);
  caixa(c, x + 2, y + 13, 12, 6, rotulo);
}

/* ---------- as cenas ---------- */

// d2-facil-nat-07: metano do gás natural queimando no fogão.
const FogaoMetano = cena('cena-fogao-metano', (c) => {
  fundo(c); mesa(c); fogao(c, 50); panela(c, 57, 14);
  ponto(c, '#c2702a', 92, 50, 20, 2); // cano do gás saindo da parede
}, [L(14, 4), L(80, 8), L(15, 86), L(85, 86)], () => (
  <>
    <Gente tipo="biologia" x={22} chao={56} />
    <Sprite chave="chama-azul" w={12} h={14} quadros={3} desenhar={chamaAzul} x={px(64)} y={py(24)} largura={px(12)} fps={8} />
    {bolhas(68, 12, 5, 'rgba(255,255,255,.85)', 18, 2.6)}
    {Array.from({ length: 4 }, (_, i) => <Ponto key={i} x={px(110 - i * 4)} y={py(50)} tam={1.6} cor="#4a8fe0" anim="anda" dx={-px(18)} dur={1.6} atraso={-i * 0.4} />)}
  </>
));

// d2-medio-nat-07: algodão com removedor (acetona) tirando o esmalte da unha.
const Esmalte = cena('cena-esmalte', (c) => {
  fundo(c); mesa(c);
  frasco(c, 10, 28, '#f6d0e0', '#f2a33a');
  // mão: palma e quatro dedos deitados na mesa
  caixa(c, 50, 40, 36, 16, '#f0c9a0');
  for (let i = 0; i < 4; i++) caixa(c, 86, 41 + i * 4, 18 - (i === 3 ? 6 : 0), 4, '#f0c9a0');
  ponto(c, '#d64545', 100, 42, 3, 2); ponto(c, '#d64545', 100, 46, 3, 2); // unhas ainda pintadas
  ponto(c, '#f0c9a0', 101, 50, 2, 2); // unha já limpa
}, [L(15, 4), L(78, 6), L(50, 86), L(86, 86)], () => (
  <>
    <Ponto x={px(96)} y={py(46)} tam={7} cor="#ffffff" anim="vai-e-volta" dx={4} dur={0.9} redondo />
  </>
));

// d2-dificil-nat-07: dois frascos, mesmo rótulo C2H6O; um líquido, o outro gás de spray.
const DoisFrascos = cena('cena-dois-frascos', (c) => {
  fundo(c); mesa(c);
  frasco(c, 22, 26, '#bfe6f2', '#f2d27a');
  caixa(c, 74, 30, 18, 26, '#c9d6d2'); caixa(c, 79, 24, 8, 6, '#9aa3a8'); ponto(c, TINTA, 87, 25, 4, 2); // spray
  caixa(c, 76, 39, 14, 6, '#f2d27a');
}, [L(25, 4), L(70, 4), L(25, 86), L(70, 86)], () => (
  <>
    <Gente tipo="quimica" x={46} chao={56} />
    <Ponto x={px(23)} y={py(37)} tam={px(14)} cor="rgba(255,255,255,.55)" anim="vai-e-volta" dy={2} dur={1.2} />
    {Array.from({ length: 5 }, (_, i) => <Ponto key={i} x={px(91)} y={py(25)} tam={3} cor="rgba(154,163,168,.7)" anim="anda" dx={22} dy={-8 - i * 2} dur={1.8} atraso={-i * 0.36} redondo />)}
  </>
));

// cmoudnnt2001vuoz97s5sifsi (ENEM): ésteres dão cheiro de fruta (kiwi, banana, pêssego, uva).
const AromaFrutas = cena('cena-aroma-frutas', (c) => {
  fundo(c); mesa(c);
  circulo(c, TINTA, 18, 50, 7); circulo(c, '#8a6a3a', 18, 50, 6); circulo(c, '#7cc98a', 18, 50, 4); // kiwi
  for (let k = 0; k < 18; k++) ponto(c, k % 5 ? '#f2d27a' : '#c9a44a', 34 + k, 52 - Math.round(Math.sin(k / 6) * 5), 3, 4); // banana
  circulo(c, TINTA, 70, 49, 7); circulo(c, '#f2a07a', 70, 49, 6); ponto(c, '#4fae6a', 70, 41, 3, 2); // pêssego
  [[92, 44], [98, 44], [95, 49], [89, 49], [101, 49], [95, 54]].forEach(([x, y]) => circulo(c, '#7a4fc0', x, y, 3)); // uva
}, [L(15, 4), L(40, 4), L(62, 4), L(86, 4)], () => (
  <>
    {[18, 42, 70, 95].map((x, j) => Array.from({ length: 3 }, (_, i) => (
      <Ponto key={`${j}-${i}`} x={px(x)} y={py(40)} tam={2} cor={['#7cc98a', '#f2d27a', '#f2a07a', '#9a76d6'][j]} anim="anda" dx={i % 2 ? 3 : -3} dy={-30} dur={2.6} atraso={-(i * 0.9 + j * 0.4)} />
    )))}
  </>
));

// d2-facil-nat-08: propano do botijão indo para o fogão.
const Botijao = cena('cena-botijao', (c) => {
  fundo(c); mesa(c);
  caixa(c, 8, 26, 24, 30, '#d64545'); caixa(c, 14, 20, 12, 7, '#d64545'); ponto(c, '#ffffff', 10, 34, 20, 2);
  ponto(c, TINTA, 26, 22, 22, 2); ponto(c, TINTA, 46, 22, 2, 22);
  fogao(c, 50); panela(c, 57, 14);
}, [L(16, 4), L(70, 4), L(16, 86), L(78, 86)], () => (
  <>
    <Sprite chave="chama-azul" w={12} h={14} quadros={3} desenhar={chamaAzul} x={px(64)} y={py(24)} largura={px(12)} fps={8} />
    <Gente tipo="fisica" x={92} chao={56} />
    {Array.from({ length: 5 }, (_, i) => <Ponto key={i} x={px(28)} y={py(22)} tam={1.6} cor="#4a8fe0" anim="anda" dx={px(18)} dur={1.8} atraso={-i * 0.36} />)}
  </>
));

// d2-medio-nat-08: isqueiro de butano aceso na mão.
const Isqueiro = cena('cena-isqueiro', (c) => {
  fundo(c);
  caixa(c, 44, 30, 16, 32, '#4a6fd0'); ponto(c, '#7a96e0', 46, 32, 3, 28);
  caixa(c, 44, 22, 16, 9, '#c9d6d2'); ponto(c, TINTA, 47, 24, 10, 1); // tampa de metal
  caixa(c, 36, 38, 10, 22, '#f0c9a0'); caixa(c, 58, 34, 12, 26, '#f0c9a0'); // dedos segurando
  ponto(c, '#bfe6f2', 46, 44, 12, 14); // butano líquido dentro (visto pela janela)
}, [L(18, 6), L(82, 30), L(18, 86), L(82, 86)], () => (
  <>
    <Sprite chave="chama-amarela" w={12} h={14} quadros={3} desenhar={chamaAmarela} x={px(46)} y={py(9)} largura={px(12)} fps={9} />
    {bolhas(50, 54, 3, 'rgba(255,255,255,.8)', 14, 2)}
  </>
));

// d2-dificil-nat-08: óleo vira margarina recebendo H2 (hidrogenação).
const Margarina = cena('cena-margarina', (c) => {
  fundo(c); mesa(c);
  caixa(c, 6, 22, 14, 34, '#f2d27a'); caixa(c, 9, 16, 8, 7, '#4fae6a'); // garrafa de óleo
  caixa(c, 44, 18, 30, 38, '#c9d6d2'); ponto(c, '#f2d27a', 45, 30, 28, 25); // tanque
  ponto(c, TINTA, 20, 40, 24, 2); ponto(c, TINTA, 58, 56, 2, 4);
  caixa(c, 88, 42, 24, 14, '#f4ead7'); caixa(c, 86, 38, 28, 5, '#f2a33a'); // pote de margarina
}, [L(10, 4), L(50, 4), L(84, 20), L(50, 86)], () => (
  <>
    {bolhas(52, 52, 6, 'rgba(255,255,255,.9)', 28, 2.2)}
    {Array.from({ length: 3 }, (_, i) => <Ponto key={i} x={px(74)} y={py(46)} tam={2.4} cor="#f2d27a" anim="anda" dx={px(12)} dur={1.8} atraso={-i * 0.6} />)}
  </>
));

// cmoudnnv5002suoz9ey6fzprw (ENEM): óleo usado + soda cáustica vira sabão.
const OleoSabao = cena('cena-oleo-sabao', (c) => {
  fundo(c); mesa(c);
  ponto(c, TINTA, 16, 30, 10, 2); caixa(c, 26, 27, 22, 6, '#55615b'); // frigideira na mão, cabo à esquerda
  caixa(c, 30, 40, 30, 16, '#c9d6d2'); ponto(c, '#f2d27a', 31, 46, 28, 9); // balde com óleo
  caixa(c, 66, 40, 12, 16, '#ffffff'); ponto(c, '#d64545', 68, 44, 8, 3); // soda cáustica
  caixa(c, 86, 44, 26, 12, '#bfe6f2'); ponto(c, '#ffffff', 90, 47, 6, 2); // barra de sabão
}, [L(20, 4), L(45, 86), L(72, 86), L(84, 30)], () => (
  <>
    <Gente tipo="leitura" x={-3} chao={56} />
    {gotas(42, 33, 4, '#f2d27a', 12, 1.2)}
    {bolhas(96, 42, 5, 'rgba(255,255,255,.9)', 24, 2.4)}
  </>
));

export const CENAS_QUESTOES = {
  'cena-fogao-metano': FogaoMetano,
  'cena-esmalte': Esmalte,
  'cena-dois-frascos': DoisFrascos,
  'cena-aroma-frutas': AromaFrutas,
  'cena-botijao': Botijao,
  'cena-isqueiro': Isqueiro,
  'cena-margarina': Margarina,
  'cena-oleo-sabao': OleoSabao,
} as const;
