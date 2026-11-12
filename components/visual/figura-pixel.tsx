'use client';
import { useEffect, useState } from 'react';
import { circulo, ponto, type Pincel } from '@/lib/pixel/desenho';
import { imagemPixel } from '@/components/pixel/imagem-pixel';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import type { NomeFigura } from '@/lib/visual/especificacao';

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

function PilhasLanterna() {
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
      <ol className="fig-contas">
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
      </ol>
    </div>
  );
}

const FIGURAS: Record<NomeFigura, () => JSX.Element> = {
  'pilhas-lanterna': PilhasLanterna,
};

export function FiguraPixel({ nome }: { nome: NomeFigura }) {
  const { animado } = useMundoAnimado();
  const Figura = FIGURAS[nome];
  return (
    <div className="figura-pixel" data-animado={animado ? 'sim' : 'nao'}>
      <Figura />
    </div>
  );
}
