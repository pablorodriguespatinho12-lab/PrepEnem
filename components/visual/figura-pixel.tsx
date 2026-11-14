'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { circulo, ponto, type Pincel } from '@/lib/pixel/desenho';
import { imagemPixel } from '@/components/pixel/imagem-pixel';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import type { NomeFigura } from '@/lib/visual/especificacao';
import { FIGURAS_AREAS } from './figuras-areas';
import { CENAS_QUESTOES } from './cenas-questoes';

/* Figuras em pixel art animada, feitas à mão (Pablo, 12/11/2026: "a imagem
   realmente de uma bateria, e a solução do cálculo em imagem, em pixel").
   O desenho parado sai do canvas UMA vez; o que se mexe (cargas no fio, luz
   da lâmpada, contas aparecendo) é CSS com steps(), em globals.css (.fig-*).
   Animação segue a chave "Mundo pixel animado" do Perfil. */

const W = 120;
const H = 70;
const CONTORNO = '#22302a';
const FIO = '#55615b';

/** Pilha deitada de 18 × 10; `virada` põe o polo + do lado esquerdo. */
function pilha(c: Pincel, x: number, y: number, virada: boolean, corpo: string, luz: string) {
  ponto(c, CONTORNO, x, y, 18, 10);
  ponto(c, corpo, x + 1, y + 1, 16, 8);
  ponto(c, luz, x + 1, y + 1, 16, 2);
  const capX = virada ? x - 2 : x + 18;
  ponto(c, CONTORNO, capX, y + 3, 2, 4);
  ponto(c, '#c9c2b0', capX + (virada ? 1 : 0), y + 4, 1, 2);
  // sinal de + perto do polo
  const mx = virada ? x + 3 : x + 12;
  ponto(c, '#fffaf0', mx + 1, y + 3, 1, 3);
  ponto(c, '#fffaf0', mx, y + 4, 3, 1);
}

/** Seta de pixel de 9 de largura; `esquerda` vira a ponta. */
function seta(c: Pincel, x: number, y: number, esquerda: boolean, cor: string) {
  ponto(c, cor, x + 1, y + 2, 7, 1);
  const p = esquerda ? x : x + 8;
  const d = esquerda ? 1 : -1;
  ponto(c, cor, p, y + 2);
  ponto(c, cor, p + d, y + 1, 1, 3);
  ponto(c, cor, p + 2 * d, y, 1, 5);
}

function cenaPilhas(c: Pincel) {
  // fundo claro de lousa também no tema escuro (como o quadro branco)
  ponto(c, '#eef4ea', 0, 0, W, H);
  // fio em volta
  ponto(c, FIO, 8, 15, 104, 2);
  ponto(c, FIO, 110, 15, 2, 45);
  ponto(c, FIO, 8, 58, 104, 2);
  ponto(c, FIO, 8, 15, 2, 45);
  // 3 pilhas no fio de cima (2 certas, 1 virada)
  pilha(c, 16, 11, false, '#4fae6a', '#7cc98a');
  pilha(c, 46, 11, false, '#4fae6a', '#7cc98a');
  pilha(c, 78, 11, true, '#e0923f', '#f2b872');
  seta(c, 20, 3, false, '#3d8a52');
  seta(c, 50, 3, false, '#3d8a52');
  seta(c, 82, 3, true, '#c2702a');
  // lâmpada no fio de baixo
  ponto(c, '#d9dcd6', 54, 52, 12, 8);
  circulo(c, CONTORNO, 60, 48, 6);
  circulo(c, '#fff3bf', 60, 48, 5);
  ponto(c, '#c9a44a', 58, 46, 4, 1);
  ponto(c, '#c9a44a', 59, 47, 2, 3);
  ponto(c, '#8a8f8a', 56, 54, 8, 4);
  ponto(c, '#6b706b', 56, 55, 8, 1);
}

const CARGAS = [0, 1, 2, 3, 4, 5, 6, 7];

function PilhasLanterna({ semConta = false }: { semConta?: boolean }) {
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(imagemPixel('fig-pilhas-lanterna', W, H, cenaPilhas)), []);
  return (
    <div className="fig-pilhas">
      <div className="fig-cena" style={{ aspectRatio: `${W} / ${H}` }}>
        {url && <div className="fig-imagem" style={{ backgroundImage: `url(${url})` }} />}
        <span className="fig-luz" style={{ left: `${(60 / W) * 100}%`, top: `${(48 / H) * 100}%` }} aria-hidden />
        {CARGAS.map((i) => (
          <span key={i} className="fig-carga" style={{ animationDelay: `${-i * 0.75}s` }} aria-hidden />
        ))}
        <span className="fig-rotulo" style={{ left: '21%', top: '33%' }}>+1,5 V</span>
        <span className="fig-rotulo" style={{ left: '46%', top: '33%' }}>+1,5 V</span>
        <span className="fig-rotulo fig-contra" style={{ left: '72%', top: '33%' }}>−1,5 V</span>
        <span className="fig-rotulo fig-fraco" style={{ left: '21%', top: '45%' }}>0,5 Ω</span>
        <span className="fig-rotulo fig-fraco" style={{ left: '46%', top: '45%' }}>0,5 Ω</span>
        <span className="fig-rotulo fig-fraco" style={{ left: '72%', top: '45%' }}>0,5 Ω</span>
        <span className="fig-rotulo" style={{ left: '74%', top: '66%' }}>lâmpada 4,5 Ω</span>
      </div>
      {!semConta && <ol className="fig-contas">
        <li style={{ ['--i' as string]: 0 }}>
          <span className="fig-passo">1 · O empurrão que sobra</span>
          <strong>1,5 + 1,5 − 1,5 = 1,5 V</strong>
          <small>A pilha virada empurra contra e anula uma das outras.</small>
        </li>
        <li style={{ ['--i' as string]: 1 }}>
          <span className="fig-passo">2 · Tudo que atrapalha</span>
          <strong>4,5 + 3 × 0,5 = 6 Ω</strong>
          <small>Lâmpada: 4,5 V ÷ 1 A = 4,5 Ω. Cada pilha atrapalha 0,5 Ω, até a virada.</small>
        </li>
        <li style={{ ['--i' as string]: 2 }}>
          <span className="fig-passo">3 · A corrente</span>
          <strong>1,5 ÷ 6 = 0,25 A</strong>
          <small>Empurrão que sobra ÷ tudo que atrapalha.</small>
        </li>
      </ol>}
    </div>
  );
}

/* ---------- figuras com lugares de rótulo (os números de cada questão) ---------- */
type Props = { rotulos?: string[]; semConta?: boolean };
type Lugar = { left: string; top: string };

/** Cena desenhada uma vez + rótulos nos lugares; `filhos` é o que se mexe. */
function Cena({ chave, w, h, desenhar, lugares, rotulos, filhos }: {
  chave: string; w: number; h: number; desenhar: (c: Pincel) => void;
  lugares: Lugar[]; rotulos?: string[]; filhos?: ReactNode;
}) {
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(imagemPixel(chave, w, h, desenhar)), [chave, w, h, desenhar]);
  return (
    <div className="fig-cena" style={{ aspectRatio: `${w} / ${h}` }}>
      {url && <div className="fig-imagem" style={{ backgroundImage: `url(${url})` }} />}
      {filhos}
      {(rotulos ?? []).map((r, i) => (r && lugares[i] ? <span key={i} className="fig-rotulo" style={lugares[i]}>{r}</span> : null))}
    </div>
  );
}

const LOUSA = '#eef4ea';

/* Circuito com 1 fonte (em cima) e 1 aparelho (embaixo); cargas no fio. */
function desenharCircuito(c: Pincel) {
  ponto(c, LOUSA, 0, 0, W, H);
  ponto(c, FIO, 8, 15, 104, 2);
  ponto(c, FIO, 110, 15, 2, 45);
  ponto(c, FIO, 8, 58, 104, 2);
  ponto(c, FIO, 8, 15, 2, 45);
  pilha(c, 50, 11, false, '#4fae6a', '#7cc98a');
  // aparelho: resistência em zigue-zague numa caixa
  ponto(c, CONTORNO, 46, 52, 28, 14);
  ponto(c, '#f4ead7', 47, 53, 26, 12);
  for (let k = 0; k < 6; k++) ponto(c, '#c2702a', 50 + k * 4, k % 2 ? 56 : 60, 3, 2);
}
const CircuitoSimples = ({ rotulos }: Props) => (
  <Cena chave="fig-circuito" w={W} h={H} desenhar={desenharCircuito} rotulos={rotulos}
    lugares={[{ left: '50%', top: '33%' }, { left: '78%', top: '84%' }, { left: '84%', top: '48%' }, { left: '24%', top: '48%' }]}
    filhos={CARGAS.map((i) => <span key={i} className="fig-carga" style={{ animationDelay: `${-i * 0.75}s` }} aria-hidden />)} />
);

/* Caixa no chão: força para a direita (verde), atrito para a esquerda (laranja). */
const BW = 120;
const BH = 60;
function desenharBloco(c: Pincel) {
  ponto(c, LOUSA, 0, 0, BW, BH);
  ponto(c, '#9a8a72', 0, 48, BW, 3);
  for (let x = 2; x < BW; x += 6) ponto(c, '#b9ab92', x, 51, 3, 1);
  ponto(c, CONTORNO, 48, 29, 24, 19);
  ponto(c, '#c8955a', 49, 30, 22, 17);
  ponto(c, '#a8743f', 49, 38, 22, 1);
  ponto(c, '#a8743f', 59, 30, 1, 17);
  ponto(c, '#3d8a52', 73, 37, 18, 2);
  ponto(c, '#3d8a52', 89, 35, 2, 6);
  ponto(c, '#3d8a52', 91, 36, 2, 4);
  ponto(c, '#3d8a52', 93, 37, 1, 2);
  ponto(c, '#c2702a', 30, 44, 17, 2);
  ponto(c, '#c2702a', 28, 42, 2, 6);
  ponto(c, '#c2702a', 26, 43, 2, 4);
  ponto(c, '#c2702a', 25, 44, 1, 2);
}
const BlocoForca = ({ rotulos }: Props) => (
  <Cena chave="fig-bloco" w={BW} h={BH} desenhar={desenharBloco} rotulos={rotulos}
    lugares={[{ left: '78%', top: '50%' }, { left: '24%', top: '62%' }, { left: '50%', top: '38%' }, { left: '50%', top: '10%' }]}
    filhos={[0, 1, 2].map((i) => <span key={i} className="fig-rastro" style={{ top: `${58 + i * 8}%`, animationDelay: `${i * 0.2}s` }} aria-hidden />)} />
);

/* Panela no fogão com termômetro; a chama tremula. */
function desenharPanela(c: Pincel) {
  ponto(c, LOUSA, 0, 0, W, H);
  ponto(c, '#5b5f5c', 30, 56, 56, 6);
  ponto(c, '#3f4340', 30, 62, 56, 2);
  ponto(c, CONTORNO, 34, 30, 48, 20);
  ponto(c, '#8a96a0', 35, 31, 46, 18);
  ponto(c, '#6fb7d6', 36, 33, 44, 8);
  ponto(c, '#bfe6f2', 38, 34, 10, 1);
  ponto(c, CONTORNO, 26, 33, 9, 3);
  ponto(c, '#8a6a4a', 26, 34, 8, 1);
  ponto(c, CONTORNO, 96, 10, 5, 40);
  ponto(c, '#ffffff', 97, 11, 3, 34);
  ponto(c, '#d64545', 98, 26, 1, 20);
  circulo(c, '#d64545', 98, 48, 3);
}
const CalorPanela = ({ rotulos }: Props) => (
  <Cena chave="fig-panela" w={W} h={H} desenhar={desenharPanela} rotulos={rotulos}
    lugares={[{ left: '48%', top: '20%' }, { left: '84%', top: '78%' }, { left: '48%', top: '92%' }, { left: '14%', top: '20%' }]}
    filhos={[0, 1, 2, 3].map((i) => <span key={i} className="fig-chama" style={{ left: `${36 + i * 11}%`, animationDelay: `${i * 0.15}s` }} aria-hidden />)} />
);

/* Onda que anda (faixa com o dobro da largura, rolando de 1 em 1 pixel). */
const OW = 120;
const OH = 50;
function desenharOnda(c: Pincel) {
  for (let x = 0; x < OW * 2; x++) {
    const y = Math.round(26 + Math.sin((x / 40) * Math.PI * 2) * 10);
    ponto(c, '#2a7c8f', x, y, 1, 2);
  }
}
function desenharOndaFundo(c: Pincel) {
  ponto(c, LOUSA, 0, 0, OW, OH);
  ponto(c, '#c9d6d2', 0, 27, OW, 1);
  // colchete de um comprimento de onda (40 px)
  ponto(c, '#c2702a', 20, 6, 40, 1);
  ponto(c, '#c2702a', 20, 4, 1, 5);
  ponto(c, '#c2702a', 59, 4, 1, 5);
}
function Onda({ rotulos }: Props) {
  const [faixa, setFaixa] = useState('');
  useEffect(() => setFaixa(imagemPixel('fig-onda-faixa', OW * 2, OH, desenharOnda)), []);
  return (
    <Cena chave="fig-onda" w={OW} h={OH} desenhar={desenharOndaFundo} rotulos={rotulos}
      lugares={[{ left: '33%', top: '4%' }, { left: '82%', top: '6%' }, { left: '50%', top: '90%' }]}
      filhos={faixa ? <div className="fig-onda-janela" aria-hidden><div className="fig-onda-faixa" style={{ backgroundImage: `url(${faixa})` }} /></div> : null} />
  );
}

/* Raio de luz que bate na água: reflete um pouco e entra desviando. */
function desenharLuz(c: Pincel) {
  ponto(c, '#e6f5ef', 0, 0, W, 35);
  ponto(c, '#7fbfd6', 0, 35, W, 35);
  ponto(c, '#5aa3c0', 0, 35, W, 1);
  for (let y = 2; y < 68; y += 4) ponto(c, '#8a96a0', 60, y, 1, 2);
  for (let k = 0; k <= 30; k++) ponto(c, '#e0a020', 30 + k, 5 + k, 2, 1);
  for (let k = 0; k <= 30; k++) ponto(c, '#f2d27a', 60 + k, 34 - k, 1, 1);
  for (let k = 0; k <= 30; k++) ponto(c, '#e0a020', 60 + Math.round(k * 0.55), 35 + k, 2, 1);
}
const LuzRaio = ({ rotulos }: Props) => (
  <Cena chave="fig-luz" w={W} h={H} desenhar={desenharLuz} rotulos={rotulos}
    lugares={[{ left: '12%', top: '22%' }, { left: '12%', top: '78%' }, { left: '74%', top: '14%' }, { left: '82%', top: '84%' }]}
    filhos={<span className="fig-foton" aria-hidden />} />
);

const FIGURAS: Record<NomeFigura, (p: Props) => JSX.Element> = {
  'pilhas-lanterna': ({ semConta }) => <PilhasLanterna semConta={semConta} />,
  'circuito-simples': CircuitoSimples,
  'bloco-forca': BlocoForca,
  'calor-panela': CalorPanela,
  onda: Onda,
  'luz-raio': LuzRaio,
  ...FIGURAS_AREAS,
  ...CENAS_QUESTOES,
};

/** semConta: na tela da questão a figura ajuda a entender sem entregar a conta. */
export function FiguraPixel({ nome, rotulos, semConta = false }: { nome: NomeFigura; rotulos?: string[]; semConta?: boolean }) {
  const { animado } = useMundoAnimado();
  const Figura = FIGURAS[nome];
  return (
    <div className="figura-pixel" data-animado={animado ? 'sim' : 'nao'}>
      <Figura rotulos={rotulos} semConta={semConta} />
    </div>
  );
}
