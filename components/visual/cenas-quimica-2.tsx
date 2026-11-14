'use client';
import { circulo, ponto, type Pincel } from '@/lib/pixel/desenho';
import { Ponto, Sprite, TINTA, type Lugar, type PropsFigura } from './pixel-cena';
import {
  Anda, Gente, bolhas, caixa, cena, chamaAmarela, chamaAzul, fogao, frasco, fundo, gotas, mesa, panela, px, py,
} from './cenas-questoes';

/* Cenas das outras 20 questões de Química (Ambiental, Estequiometria, Eletroquímica,
   Soluções), 14/11/2026. Ciclo de import: cenas-questoes importa este arquivo, então
   no TOPO daqui só se chama função declarada com `function` (cena, caixa...). As
   constantes do kit (px, fundo, chamaAzul...) só rodam dentro do desenho e do render. */

/** Chama `cena` só no 1º render: com o ciclo de import, no topo deste módulo o kit
    de cenas-questoes ainda pode não estar pronto (depende do empacotador). */
function adiada(...args: Parameters<typeof cena>) {
  let Pronta: ReturnType<typeof cena> | null = null;
  return function CenaAdiada(p: PropsFigura) {
    Pronta ??= cena(...args);
    return <Pronta {...p} />;
  };
}

const lug = (left: number, top: number): Lugar => ({ left: `${left}%`, top: `${top}%` });

/* ---------- peças paradas ---------- */

function ceu(c: Pincel, cor = '#d9eef7') { fundo(c); ponto(c, cor, 0, 0, 120, 56); }
function grama(c: Pincel) { ponto(c, '#7cc98a', 0, 56, 120, 3); ponto(c, '#4fae6a', 0, 59, 120, 11); }
function estrada(c: Pincel) {
  ponto(c, '#9aa3a8', 0, 56, 120, 8);
  for (let x = 4; x < 120; x += 14) ponto(c, '#ffffff', x, 59, 7, 1);
  ponto(c, '#7cc98a', 0, 64, 120, 6);
}
function parede(c: Pincel, cor = '#d6e4dc') { fundo(c); ponto(c, cor, 0, 0, 120, 56); }
function azulejo(c: Pincel) {
  fundo(c); ponto(c, '#dfeef0', 0, 0, 120, 56);
  for (let x = 0; x < 120; x += 10) ponto(c, '#c5dde0', x, 0, 1, 56);
  for (let y = 0; y < 56; y += 10) ponto(c, '#c5dde0', 0, y, 120, 1);
  ponto(c, '#c9d6d2', 0, 56, 120, 14);
  for (let x = 0; x < 120; x += 12) ponto(c, '#aebcb8', x, 56, 1, 14);
}
function sol(c: Pincel, x: number, y: number) { circulo(c, '#f2a33a', x, y, 7); circulo(c, '#f9d65c', x, y, 6); }
/** Linha de 1 px (fio, mangueira, haste). */
function linha(c: Pincel, cor: string, x1: number, y1: number, x2: number, y2: number, esp = 1) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let i = 0; i <= n; i++) ponto(c, cor, x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n, esp, esp);
}
/** Carro de 30 × 15: q troca o raio da roda (2 quadros). */
function carro(c: Pincel, x: number, y: number, cor: string, q = 0) {
  caixa(c, x + 6, y, 17, 7, cor); ponto(c, '#bfe6f2', x + 8, y + 2, 6, 4); ponto(c, '#bfe6f2', x + 16, y + 2, 5, 4);
  caixa(c, x, y + 6, 30, 6, cor); ponto(c, '#f9d65c', x + 28, y + 7, 2, 2);
  for (const r of [x + 7, x + 23]) {
    circulo(c, TINTA, r, y + 12, 3); circulo(c, '#9aa3a8', r, y + 12, 1);
    ponto(c, TINTA, r + (q ? 0 : -1), y + 12 + (q ? -1 : 0), 1, 1);
  }
}
/** Pilha em pé: corpo azul, faixa cobre em cima, polo + saliente. */
function pilhaEmPe(c: Pincel, x: number, y: number, w: number, h: number) {
  caixa(c, x, y, w, h, '#3a4f7a'); ponto(c, '#c9a44a', x + 1, y + 1, w - 2, Math.round(h / 4));
  caixa(c, x + w / 2 - 2, y - 3, 4, 4, '#9aa3a8');
}
/** Pilha deitada: polo + à direita. */
function pilhaDeitada(c: Pincel, x: number, y: number, w: number, h: number) {
  caixa(c, x, y, w, h, '#3a4f7a'); ponto(c, '#c9a44a', x + w - Math.round(w / 4), y + 1, Math.round(w / 4) - 1, h - 2);
  caixa(c, x + w - 1, y + h / 2 - 2, 3, 4, '#9aa3a8');
}
function copo(c: Pincel, x: number, y: number, w: number, h: number, liquido: string, nivel: number) {
  ponto(c, TINTA, x, y, 1, h); ponto(c, TINTA, x + w - 1, y, 1, h); ponto(c, TINTA, x, y + h - 1, w, 1);
  ponto(c, '#eef6f8', x + 1, y, w - 2, h - 1);
  ponto(c, liquido, x + 1, y + h - 1 - nivel, w - 2, nivel); ponto(c, '#ffffff', x + 1, y + h - 1 - nivel, w - 2, 1);
}

/* ---------- peças que se mexem (desenho fixo por módulo: a chave do Sprite guarda a imagem) ---------- */

const carroVermelho = (c: Pincel, q: number) => carro(c, 0, 0, '#d64545', q);
const carroAzul = (c: Pincel, q: number) => carro(c, 0, 0, '#4a6fd0', q);
const peixe = (c: Pincel, q: number) => {
  caixa(c, 3, 1, 8, 5, '#f2a33a'); ponto(c, TINTA, 8, 2, 1, 1);
  ponto(c, '#f2a33a', 0, q ? 1 : 2, 3, q ? 2 : 1); ponto(c, '#f2a33a', 0, q ? 4 : 4, 3, q ? 1 : 2);
};
const rotor = (c: Pincel, q: number) => {
  const pas = [0, 120, 240].map((b) => ((q * 40 + b) * Math.PI) / 180);
  for (const cor of ['#9aa3a8', '#ffffff']) for (const a of pas) for (let r = 2; r <= 12; r++) {
    const x = Math.round(13 + Math.cos(a) * r); const y = Math.round(13 + Math.sin(a) * r);
    cor === '#ffffff' ? ponto(c, cor, x, y) : ponto(c, cor, x - 1, y - 1, 3, 3);
  }
  circulo(c, TINTA, 13, 13, 2);
};
const pratoCo2 = (c: Pincel) => {
  ponto(c, TINTA, 3, 0, 1, 14); ponto(c, TINTA, 26, 0, 1, 14); caixa(c, 0, 14, 30, 3, '#9aa3a8');
  circulo(c, '#d64545', 8, 10, 3); circulo(c, '#55615b', 15, 10, 3); circulo(c, '#d64545', 22, 10, 3);
};
const pratoPeso = (c: Pincel) => {
  ponto(c, TINTA, 3, 0, 1, 14); ponto(c, TINTA, 26, 0, 1, 14); caixa(c, 0, 14, 30, 3, '#9aa3a8');
  caixa(c, 9, 6, 12, 8, '#c9a44a'); ponto(c, '#f2d27a', 11, 8, 3, 1);
};
const carrinho = (c: Pincel, q: number) => {
  for (let i = 0; i < 3; i++) { caixa(c, 6 + i * 8, 1, 7, 5, '#3a4f7a'); ponto(c, '#c9a44a', 11 + i * 8, 2, 1, 3); }
  caixa(c, 0, 6, 34, 7, '#f2a33a'); ponto(c, '#f9d65c', 31, 8, 2, 2);
  for (const r of [7, 27]) { circulo(c, TINTA, r, 13, 3); circulo(c, '#9aa3a8', r, 13, 1); ponto(c, TINTA, r + (q ? 0 : -1), 13 + (q ? -1 : 0)); }
};

const fumaca = (x: number, y: number, n: number, dx: number, dy: number, cor = 'rgba(120,130,135,.75)', dur = 2.4) =>
  Array.from({ length: n }, (_, i) => (
    <Ponto key={`f${x}-${i}`} x={px(x)} y={py(y)} tam={3} cor={cor} anim="anda" dx={dx + (i % 2 ? 2 : -2)} dy={dy} dur={dur} atraso={-i * (dur / n)} redondo />
  ));
const eletrons = (x: number, y: number, n: number, dx: number, dy = 0, dur = 2) =>
  Array.from({ length: n }, (_, i) => (
    <Ponto key={`e${x}-${y}-${i}`} x={px(x)} y={py(y)} tam={1.8} cor="#4a8fe0" anim="anda" dx={dx} dy={dy} dur={dur} atraso={-i * (dur / n)} redondo />
  ));

/* ---------- Ambiental ---------- */

// d2-facil-nat-09: gases da queima (gasolina, carvão, lenha) prendem o calor: efeito estufa.
const CarroFumaca = adiada('cena-carro-fumaca', (c) => {
  ceu(c); estrada(c); sol(c, 100, 16);
  for (let x = 0; x < 120; x += 6) ponto(c, '#b9c2c6', x, 6 + (x % 12 ? 1 : 0), 5, 3); // camada de gases
  carro(c, 42, 42, '#4a6fd0'); ponto(c, TINTA, 39, 52, 4, 2); // escapamento
}, [lug(22, 86), lug(40, 17), lug(62, 32), lug(0, 0)], () => (
  <>
    {fumaca(38, 50, 5, -px(18), -py(22))}
    {Array.from({ length: 3 }, (_, i) => <Ponto key={`r${i}`} x={px(94 - i * 4)} y={py(22)} tam={1.8} cor="#f2a33a" anim="anda" dx={-px(26)} dy={py(30)} dur={2.2} atraso={-i * 0.7} />)}
    {[30, 56, 80].map((x, i) => <Ponto key={`q${i}`} x={px(x)} y={py(14)} tam={2} cor="#d64545" anim="vai-e-volta" dy={py(36)} dur={1.6} atraso={-i * 0.5} />)}
  </>
));

// d2-medio-nat-09: esgoto e adubo no lago, algas cobrem a água e falta oxigênio.
const LagoAlgas = adiada('cena-lago-algas', (c) => {
  ceu(c); grama(c); ponto(c, '#7cc98a', 0, 30, 120, 26);
  caixa(c, 12, 32, 88, 30, '#6fb7a0'); ponto(c, '#8a6440', 13, 56, 86, 5); // lago com lodo no fundo
  for (let x = 13; x < 95; x += 5) ponto(c, x % 10 ? '#4fae6a' : '#3f8f55', x, 33, 5, 3 + (x % 3)); // tapete de algas
  ponto(c, '#9aa3a8', 0, 24, 16, 4); ponto(c, TINTA, 0, 23, 16, 1); // cano de esgoto
}, [lug(12, 4), lug(55, 12), lug(50, 90), lug(0, 0)], () => (
  <>
    {gotas(14, 29, 3, '#8a6440', 6, 1.4)}
    {[24, 46, 70, 88].map((x, i) => <Ponto key={`a${i}`} x={px(x)} y={py(34)} tam={3.4} cor="#3f8f55" anim="pulso" dur={2.4} atraso={-i * 0.6} redondo />)}
    <Anda dx={px(46)} dur={9}>
      <Sprite chave="peixe-lago" w={12} h={7} quadros={2} desenhar={peixe} x={px(26)} y={py(44)} largura={px(12)} fps={3} />
    </Anda>
  </>
));

// d2-dificil-nat-09: de carro para o trabalho (15 km) e de volta.
const CarroTrabalho = adiada('cena-carro-trabalho', (c) => {
  ceu(c); estrada(c);
  caixa(c, 4, 36, 22, 20, '#f4ead7'); for (let i = 0; i < 9; i++) ponto(c, '#d64545', 3 + i, 35 - i, 24 - i * 2, 1); // casa
  caixa(c, 12, 44, 6, 12, '#b98a5a'); ponto(c, '#bfe6f2', 20, 40, 4, 4);
  caixa(c, 82, 12, 22, 44, '#c9d6d2'); // prédio do trabalho
  for (let y = 16; y < 50; y += 7) for (let x = 85; x < 101; x += 6) ponto(c, '#bfe6f2', x, y, 4, 4);
}, [lug(13, 30), lug(77, 6), lug(48, 86), lug(48, 34)], () => (
  <Anda dx={px(28)} dur={6}>
    <Sprite chave="carro-vermelho" w={30} h={15} quadros={2} desenhar={carroVermelho} x={px(24)} y={py(42)} largura={px(30)} fps={6} />
  </Anda>
));

// cmoudnnv1002quoz9i62sjhmx (ENEM): pesticida no solo, meia-vida de 5 anos.
const Pulverizador = adiada('cena-pulverizador', (c) => {
  ceu(c); ponto(c, '#b98a5a', 0, 52, 120, 4); ponto(c, '#8a6440', 0, 56, 120, 14);
  for (let x = 2; x < 120; x += 8) ponto(c, '#6e4f33', x, 60, 5, 1);
  for (let i = 0; i < 8; i++) { const x = 46 + i * 7; ponto(c, '#4fae6a', x, 44, 2, 8); circulo(c, '#7cc98a', x + 1, 43, 3); }
  caixa(c, 20, 34, 8, 12, '#d6e4dc'); linha(c, TINTA, 26, 44, 40, 36); ponto(c, TINTA, 40, 35, 3, 3); // tanque e bico
}, [lug(36, 30), lug(55, 90), lug(74, 6), lug(0, 0)], () => (
  <>
    <Gente jeito="vovo" x={4} chao={56} />
    {gotas(43, 38, 4, '#7a4fc0', 18, 1.4)}
    {gotas(48, 37, 4, '#7a4fc0', 20, 1.6)}
    {[40, 58, 76].map((x, i) => <Ponto key={`p${i}`} x={px(x)} y={py(62)} tam={1.8} cor="#9a76d6" anim="pisca" dur={2} atraso={-i * 0.6} />)}
  </>
));

/* ---------- Energia ---------- */

// d2-facil-nat-10: fonte de energia renovável (vento e sol).
const CataVento = adiada('cena-cata-vento', (c) => {
  ceu(c); grama(c); sol(c, 16, 14);
  for (let y = 26; y < 56; y++) { const m = 1 + (y - 26) / 12; ponto(c, '#c9d0d4', 60 - m, y, m * 2 + 1, 1); }
}, [lug(34, 6), lug(82, 44), lug(0, 0), lug(0, 0)], () => (
  <>
    <Sprite chave="rotor-cata-vento" w={27} h={27} quadros={3} desenhar={rotor} x={px(47)} y={py(11)} largura={px(27)} fps={7} />
    {[18, 30, 42].map((y, i) => <Ponto key={`v${i}`} x={px(4)} y={py(y)} tam={3} cor="#9ac6e0" anim="anda" dx={px(36)} dur={2.4} atraso={-i * 0.8} />)}
    <Gente jeito="menina" x={18} chao={56} />
  </>
));

// d2-medio-nat-10: motorista compara etanol e gasolina no posto.
const PostoEtanol = adiada('cena-posto-etanol', (c) => {
  ceu(c); ponto(c, '#c9d0d4', 0, 56, 120, 14);
  caixa(c, 2, 8, 44, 5, '#d64545'); ponto(c, '#9aa3a8', 4, 13, 2, 43); ponto(c, '#9aa3a8', 42, 13, 2, 43); // cobertura
  caixa(c, 7, 30, 13, 26, '#4fae6a'); ponto(c, '#eef6f8', 9, 33, 9, 5); // bomba do etanol
  caixa(c, 25, 30, 13, 26, '#d64545'); ponto(c, '#eef6f8', 27, 33, 9, 5); // bomba da gasolina
  linha(c, TINTA, 37, 44, 40, 55); linha(c, TINTA, 40, 55, 66, 55); linha(c, TINTA, 66, 55, 68, 48);
  carro(c, 68, 42, '#7a4fc0');
}, [lug(11, 22), lug(30, 38), lug(0, 0), lug(0, 0)], () => (
  <>
    <Gente jeito="moca" x={44} chao={56} />
    {gotas(68, 47, 3, '#f2d27a', 4, 0.9)}
    <Ponto x={px(10)} y={py(34)} tam={2} cor="#4fae6a" anim="pisca" dur={1.4} />
    <Ponto x={px(28)} y={py(34)} tam={2} cor="#d64545" anim="pisca" dur={1.4} atraso={-0.7} />
  </>
));

// d2-dificil-nat-10: aquecedor a gás no banheiro fechado, chama amarela, CO.
const BanheiroAquecedor = adiada('cena-banheiro-aquecedor', (c) => {
  azulejo(c);
  caixa(c, 88, 10, 16, 16, '#bfe6f2'); ponto(c, TINTA, 95, 10, 2, 16); ponto(c, TINTA, 88, 17, 16, 2); // janela fechada
  caixa(c, 56, 14, 22, 26, '#ffffff'); caixa(c, 60, 23, 14, 15, '#3a4a44'); // aquecedor
  ponto(c, '#9aa3a8', 64, 40, 2, 16); // cano do gás
  ponto(c, '#9aa3a8', 4, 6, 2, 8); caixa(c, 2, 12, 12, 3, '#9aa3a8'); // chuveiro
}, [lug(56, 8), lug(56, 60), lug(33, 22), lug(80, 42)], () => (
  <>
    <Sprite chave="chama-amarela" w={12} h={14} quadros={3} desenhar={chamaAmarela} x={px(61)} y={py(24)} largura={px(12)} fps={8} />
    {fumaca(64, 14, 5, -px(18), -py(8), 'rgba(110,120,125,.7)', 3)}
    {gotas(5, 15, 3, '#7ab8e8', 20, 1.2)}
    {gotas(10, 15, 3, '#7ab8e8', 20, 1.4)}
    <Gente jeito="moca" x={20} chao={56} />
  </>
));

// cmouei95p0063uoz91tlsl3v2 (ENEM): água turva, coagulante, flocos descem (decantação).
const TratamentoAgua = adiada('cena-tratamento-agua', (c) => {
  fundo(c); mesa(c);
  ponto(c, TINTA, 30, 16, 1, 40); ponto(c, TINTA, 86, 16, 1, 40); ponto(c, TINTA, 30, 55, 57, 1);
  ponto(c, '#c9a46a', 31, 20, 55, 14); ponto(c, '#d6c69e', 31, 34, 55, 12); ponto(c, '#bfe0e8', 31, 46, 55, 5);
  ponto(c, '#7a5a3a', 31, 51, 55, 4); // lodo
  ponto(c, '#9aa3a8', 50, 8, 52, 3); ponto(c, '#9aa3a8', 50, 8, 3, 7); // cano do coagulante
}, [lug(80, 2), lug(87, 26), lug(87, 50), lug(48, 86)], () => (
  <>
    <Gente jeito="cientista" x={4} chao={56} />
    {gotas(51, 15, 3, '#ffffff', 7, 1.2)}
    {[36, 46, 58, 68, 78].map((x, i) => <Ponto key={`fl${i}`} x={px(x)} y={py(22)} tam={2.4} cor="#8a6440" anim="anda" dy={py(28)} dur={4.5} atraso={-i * 0.9} redondo />)}
  </>
));

/* ---------- Estequiometria ---------- */

// d2-facil-nat-13: massa de 1 mol de CO2 numa balança.
const BalancaCo2 = adiada('cena-balanca-co2', (c) => {
  fundo(c); mesa(c);
  caixa(c, 46, 51, 28, 5, '#9aa3a8'); ponto(c, '#55615b', 59, 18, 3, 33); // pé
  ponto(c, TINTA, 26, 17, 68, 2); circulo(c, '#55615b', 60, 18, 2);
}, [lug(32, 4), lug(22, 86), lug(52, 86), lug(68, 4)], () => (
  <>
    <Anda dy={2.5} dur={1.6}>
      <Sprite chave="prato-co2" w={30} h={17} quadros={1} desenhar={pratoCo2} x={px(24)} y={py(19)} largura={px(30)} />
    </Anda>
    <Anda dy={2.5} dur={1.6} atraso={-1.6}>
      <Sprite chave="prato-peso" w={30} h={17} quadros={1} desenhar={pratoPeso} x={px(66)} y={py(19)} largura={px(30)} />
    </Anda>
  </>
));

// d2-medio-nat-13: metano queimando no fogão solta CO2.
const FogaoCo2 = adiada('cena-fogao-co2', (c) => {
  fundo(c); mesa(c); fogao(c, 40); panela(c, 47, 14);
  ponto(c, '#c2702a', 80, 50, 22, 2); // cano do gás
}, [lug(86, 30), lug(50, 4), lug(0, 0), lug(0, 0)], () => (
  <>
    <Gente jeito="menino" x={10} chao={56} />
    <Sprite chave="chama-azul" w={12} h={14} quadros={3} desenhar={chamaAzul} x={px(54)} y={py(24)} largura={px(12)} fps={8} />
    {bolhas(56, 12, 6, 'rgba(110,120,125,.8)', 18, 2.8)}
  </>
));

// d2-dificil-nat-13: comprimido efervescente no copo com água.
const Comprimido = adiada('cena-comprimido', (c) => {
  fundo(c); mesa(c);
  copo(c, 48, 16, 28, 40, '#bfe6f2', 30);
  caixa(c, 55, 50, 14, 5, '#ffffff'); // comprimido no fundo
}, [lug(50, 86), lug(74, 40), lug(62, 4), lug(0, 0)], () => (
  <>
    <Gente jeito="menina" x={12} chao={56} />
    {bolhas(54, 48, 8, 'rgba(255,255,255,.95)', 34, 2)}
    {bolhas(62, 48, 7, 'rgba(255,255,255,.95)', 34, 2.4)}
    {[54, 62, 70].map((x, i) => <Ponto key={`s${i}`} x={px(x)} y={py(21)} tam={1.6} cor="#7ab8e8" anim="pisca" dur={0.8} atraso={-i * 0.3} />)}
  </>
));

// cmoudnnu2002auoz9dskgmqnx (ENEM): caldo da cana fermenta e vira etanol.
const CanaEtanol = adiada('cena-cana-etanol', (c) => {
  fundo(c); mesa(c);
  for (let i = 0; i < 4; i++) {
    const x = 6 + i * 5;
    ponto(c, '#7cc98a', x, 18, 3, 38); for (let y = 24; y < 56; y += 8) ponto(c, '#4fae6a', x, y, 3, 1);
    ponto(c, '#4fae6a', x - 3 + (i % 2) * 4, 14, 4, 4);
  }
  caixa(c, 40, 16, 32, 40, '#c9d6d2'); ponto(c, '#e8d98a', 41, 26, 30, 29); // dorna de fermentação
  ponto(c, TINTA, 26, 40, 14, 2); ponto(c, TINTA, 72, 20, 18, 2); ponto(c, TINTA, 88, 20, 2, 6);
  frasco(c, 81, 30, '#eef6f8', '#4a8fe0'); // garrafa de etanol
}, [lug(13, 4), lug(47, 4), lug(76, 4), lug(0, 0)], () => (
  <>
    {bolhas(46, 52, 8, 'rgba(255,255,255,.9)', 32, 2.4)}
    {gotas(89, 26, 3, '#bfe6f2', 8, 1.2)}
  </>
));

/* ---------- Eletroquímica ---------- */

// d2-facil-nat-12: pilha acende a lâmpada; elétrons saem do polo negativo.
const PilhaLampada = adiada('cena-pilha-lampada', (c) => {
  fundo(c); mesa(c);
  pilhaEmPe(c, 16, 26, 18, 30);
  ponto(c, '#ffffff', 24, 29, 3, 1); ponto(c, '#ffffff', 25, 28, 1, 3); // +
  ponto(c, '#ffffff', 23, 50, 5, 1); // −
  ponto(c, TINTA, 25, 10, 1, 13); ponto(c, TINTA, 25, 10, 56, 1); ponto(c, TINTA, 80, 10, 1, 4); // fio de cima
  ponto(c, TINTA, 34, 52, 47, 1); ponto(c, TINTA, 80, 36, 1, 16); // fio de baixo
  circulo(c, '#c9a44a', 80, 22, 8); circulo(c, '#fff3bf', 80, 22, 7); caixa(c, 76, 30, 9, 6, '#9aa3a8'); // lâmpada
}, [lug(7, 74), lug(7, 36), lug(46, 64), lug(90, 22)], () => (
  <>
    {eletrons(36, 52, 5, px(42), 0, 2.4)}
    {eletrons(78, 10, 6, -px(50), 0, 2.8)}
    <Ponto x={px(74)} y={py(16)} tam={px(12)} cor="rgba(249,214,92,.55)" anim="pulso" dur={1.6} redondo />
  </>
));

// d2-medio-nat-12: pilha de zinco e cobre; elétrons vão do Zn para o Cu pelo fio.
const PilhaZincoCobre = adiada('cena-pilha-zinco-cobre', (c) => {
  fundo(c); mesa(c);
  copo(c, 10, 26, 30, 30, '#d9eef7', 21); copo(c, 62, 26, 30, 30, '#7ab8e8', 21);
  caixa(c, 22, 18, 6, 32, '#9aa3a8'); caixa(c, 74, 18, 6, 32, '#d98a4a'); // placas Zn e Cu
  ponto(c, TINTA, 25, 10, 1, 8); ponto(c, TINTA, 25, 10, 53, 1); ponto(c, TINTA, 77, 10, 1, 8); // fio
  ponto(c, '#f4ead7', 34, 22, 3, 14); ponto(c, '#f4ead7', 34, 22, 34, 3); ponto(c, '#f4ead7', 66, 22, 3, 14); // ponte salina
}, [lug(21, 86), lug(64, 86), lug(43, 17), lug(0, 0)], () => (
  <>
    {eletrons(27, 10, 6, px(48), 0, 2.6)}
    {[38, 44].map((y, i) => <Ponto key={`z${i}`} x={px(28)} y={py(y)} tam={1.6} cor="#55615b" anim="anda" dx={px(8)} dur={2} atraso={-i} />)}
    {[36, 44].map((y, i) => <Ponto key={`c${i}`} x={px(72)} y={py(y)} tam={1.6} cor="#c2702a" anim="pisca" dur={1.2} atraso={-i * 0.6} />)}
  </>
));

// d2-dificil-nat-12: pilhas de Daniell em série acendem um LED.
const PilhasLed = adiada('cena-pilhas-led', (c) => {
  fundo(c); mesa(c);
  pilhaDeitada(c, 14, 42, 24, 14); pilhaDeitada(c, 41, 42, 24, 14);
  ponto(c, TINTA, 8, 48, 6, 1); ponto(c, TINTA, 8, 20, 1, 29); ponto(c, TINTA, 8, 20, 73, 1); ponto(c, TINTA, 80, 20, 1, 21); ponto(c, TINTA, 80, 40, 4, 1);
  ponto(c, TINTA, 67, 48, 22, 1); ponto(c, TINTA, 88, 40, 1, 9);
  circulo(c, '#d64545', 86, 31, 4); ponto(c, '#d64545', 82, 31, 9, 5); ponto(c, '#9aa3a8', 84, 36, 1, 5); ponto(c, '#9aa3a8', 88, 36, 1, 5);
}, [lug(22, 86), lug(44, 86), lug(92, 42), lug(36, 6)], () => (
  <>
    {eletrons(10, 20, 6, px(68), 0, 2.6)}
    <Ponto x={px(80)} y={py(25)} tam={px(13)} cor="rgba(255,120,120,.55)" anim="pisca" dur={1} redondo />
  </>
));

// cmouei97i006xuoz91gjs17c4 (ENEM): chuva no ferro; a camada protetora evita a ferrugem.
const FerrugemChuva = adiada('cena-ferrugem-chuva', (c) => {
  ceu(c, '#dde6ea'); grama(c);
  for (const [x, r] of [[30, 6], [42, 8], [56, 7], [68, 6]] as const) { circulo(c, '#c9d0d4', x, 10, r + 1); circulo(c, '#ffffff', x, 10, r); }
  caixa(c, 14, 44, 84, 10, '#9aa3a8'); ponto(c, '#c9d0d4', 15, 45, 82, 1); // chapa de ferro
  ponto(c, '#7ab8e8', 14, 41, 44, 3); // camada protetora (só na metade da esquerda)
  for (const [x, w] of [[64, 6], [76, 4], [86, 7]] as const) ponto(c, '#c2702a', x, 44, w, 3);
}, [lug(86, 8), lug(30, 84), lug(8, 66), lug(70, 84)], () => (
  <>
    {[24, 36, 48].map((x) => gotas(x, 18, 2, '#4a8fe0', py(23), 1.2))}
    {[66, 80, 92].map((x) => gotas(x, 18, 2, '#4a8fe0', py(26), 1.3))}
    {[66, 77, 88].map((x, i) => <Ponto key={`fe${i}`} x={px(x)} y={py(44)} tam={2.2} cor="#a0522d" anim="pulso" dur={2.2} atraso={-i * 0.7} />)}
  </>
));

// cmoudnnso001puoz93jgvg2as (ENEM): carrinho de controle remoto com 3 pilhas.
const CarrinhoPilhas = adiada('cena-carrinho-pilhas', (c) => {
  fundo(c); ponto(c, '#d9c49a', 0, 56, 120, 14); for (let x = 0; x < 120; x += 16) ponto(c, '#c9b07e', x, 56, 1, 14);
  caixa(c, 24, 40, 7, 9, '#55615b'); ponto(c, TINTA, 28, 32, 1, 8); ponto(c, '#d64545', 26, 43, 2, 2); // controle
}, [lug(62, 46), lug(24, 14), lug(0, 0), lug(0, 0)], () => (
  <>
    <Gente jeito="menino" x={2} chao={56} />
    <Ponto x={px(27)} y={py(28)} tam={2.2} cor="#d64545" anim="pisca" dur={0.8} redondo />
    <Anda dx={px(24)} dur={4}>
      <Sprite chave="carrinho-pilhas" w={34} h={17} quadros={2} desenhar={carrinho} x={px(42)} y={py(40)} largura={px(34)} fps={8} />
    </Anda>
  </>
));

/* ---------- Soluções ---------- */

// d2-facil-nat-11: 40 g de sal em 2 L de água.
const SalJarra = adiada('cena-sal-jarra', (c) => {
  parede(c); mesa(c);
  copo(c, 52, 20, 28, 36, '#bfe6f2', 27); ponto(c, TINTA, 80, 28, 4, 1); ponto(c, TINTA, 83, 28, 1, 16); ponto(c, TINTA, 80, 43, 4, 1); // jarra
  caixa(c, 28, 38, 14, 18, '#ffffff'); ponto(c, '#4a6fd0', 29, 44, 12, 4); // pacote de sal
  linha(c, '#9aa3a8', 44, 10, 60, 13, 2); caixa(c, 60, 11, 10, 5, '#c9d0d4'); // colher
}, [lug(29, 40), lug(55, 86), lug(0, 0), lug(0, 0)], () => (
  <>
    <Gente jeito="cozinheira" x={2} chao={56} />
    {gotas(63, 16, 3, '#ffffff', 14, 1.2)}
    {gotas(66, 16, 3, '#ffffff', 14, 1.5)}
    {[58, 66, 74].map((x, i) => <Ponto key={`d${i}`} x={px(x)} y={py(42)} tam={1.6} cor="#ffffff" anim="pisca" dur={1.4} atraso={-i * 0.4} />)}
  </>
));

// d2-medio-nat-11: suco concentrado misturado com água.
const SucoJarra = adiada('cena-suco-jarra', (c) => {
  parede(c); mesa(c);
  ponto(c, '#9aa3a8', 70, 0, 3, 8); ponto(c, '#9aa3a8', 64, 7, 9, 3); // torneira
  copo(c, 54, 22, 26, 34, '#f6c27a', 20);
  frasco(c, 30, 30, '#e0782a', '#f2a33a'); // suco concentrado
  copo(c, 86, 40, 12, 16, '#f6c27a', 11);
}, [lug(32, 34), lug(78, 10), lug(81, 46), lug(0, 0)], () => (
  <>
    <Gente jeito="menina" x={4} chao={56} />
    {gotas(65, 10, 4, '#4a8fe0', py(22), 1.3)}
    {bolhas(60, 50, 3, 'rgba(255,255,255,.85)', 14, 2)}
  </>
));

// d2-dificil-nat-11: desinfetante diluído num balde de água; a pessoa limpa com o rodo.
const DesinfetanteBalde = adiada('cena-desinfetante-balde', (c) => {
  azulejo(c);
  caixa(c, 26, 20, 18, 10, '#eef6f8'); ponto(c, '#4fae6a', 27, 25, 16, 4); caixa(c, 43, 22, 5, 5, '#dfe6e1'); ponto(c, '#3f8f55', 47, 22, 2, 5); // frasco deitado, tampa aberta
  for (let y = 36; y < 56; y++) { const m = (y - 36) / 5; ponto(c, '#4a6fd0', 46 + m, y, 24 - m * 2, 1); } // balde
  ponto(c, '#bfe6f2', 47, 37, 22, 3); ponto(c, TINTA, 46, 34, 24, 1);
  ponto(c, '#b98a5a', 99, 22, 2, 32); caixa(c, 93, 53, 12, 3, '#55615b'); // rodo
}, [lug(30, 14), lug(48, 86), lug(0, 0), lug(0, 0)], () => (
  <>
    <Gente jeito="vovo" x={74} chao={56} />
    {gotas(49, 26, 4, '#4fae6a', py(10), 1)}
    {[52, 60].map((x, i) => <Ponto key={`o${i}`} x={px(x)} y={py(37)} tam={2} cor="#7cc98a" anim="pulso" dur={1.4} atraso={-i * 0.7} redondo />)}
  </>
));

export const CENAS_QUIMICA_2 = {
  'cena-carro-fumaca': CarroFumaca,
  'cena-lago-algas': LagoAlgas,
  'cena-carro-trabalho': CarroTrabalho,
  'cena-pulverizador': Pulverizador,
  'cena-cata-vento': CataVento,
  'cena-posto-etanol': PostoEtanol,
  'cena-banheiro-aquecedor': BanheiroAquecedor,
  'cena-tratamento-agua': TratamentoAgua,
  'cena-balanca-co2': BalancaCo2,
  'cena-fogao-co2': FogaoCo2,
  'cena-comprimido': Comprimido,
  'cena-cana-etanol': CanaEtanol,
  'cena-pilha-lampada': PilhaLampada,
  'cena-pilha-zinco-cobre': PilhaZincoCobre,
  'cena-pilhas-led': PilhasLed,
  'cena-ferrugem-chuva': FerrugemChuva,
  'cena-carrinho-pilhas': CarrinhoPilhas,
  'cena-sal-jarra': SalJarra,
  'cena-suco-jarra': SucoJarra,
  'cena-desinfetante-balde': DesinfetanteBalde,
} as const;
