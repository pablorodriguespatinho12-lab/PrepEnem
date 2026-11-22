// Fração em pé é mais alta que texto e as lousas já gravadas têm cada linha num y fixo (44 de
// espaço). Na hora de mostrar, empurra para baixo o que bate numa fração e, se não couber na
// lousa, encolhe o texto da tela (nunca mexe nos traços). Tela sem fração em pé passa intacta.
import type { Desenho } from './tipos';
import { ALTURA } from './tipos';
import { temFracao } from './fracoes';

const TAM_PADRAO = 24;
const LARGURA_DA_LETRA = 0.4; // mesma estimativa de pincel.ts
const FOLGA = 5;
const FUNDO = ALTURA - 8;
const ESCALAS = [1, 0.92, 0.85, 0.78];

type Texto = Extract<Desenho, { k: 'tx' }>;

/** Quanto o texto ocupa acima e abaixo da linha de base (fração em pé: cima, traço e baixo). */
function altura(t: Texto, tam: number): { acima: number; abaixo: number } {
  return temFracao(t.s) ? { acima: tam * 1.35, abaixo: tam * 0.75 } : { acima: tam * 0.85, abaixo: tam * 0.25 };
}

function colunas(t: Texto, tam: number): [number, number] {
  const largura = t.s.length * tam * LARGURA_DA_LETRA;
  if (t.ancora === 'start') return [t.x, t.x + largura];
  if (t.ancora === 'end') return [t.x - largura, t.x];
  return [t.x - largura / 2, t.x + largura / 2];
}

interface Ocupado { x0: number; x1: number; topo: number; fundo: number; alta: boolean }

function tentar(desenho: readonly Desenho[], escala: number): { desenho: Desenho[]; fundo: number } {
  const novos = desenho.map((d): Desenho => (d.k === 'tx' ? { ...d, tam: Math.round((d.tam ?? TAM_PADRAO) * escala) } : d));
  const ordem = novos.map((d, i) => i).filter((i) => novos[i].k === 'tx').sort((a, b) => (novos[a] as Texto).y - (novos[b] as Texto).y);
  const ocupados: Ocupado[] = [];
  let fundo = 0;
  for (const i of ordem) {
    const t = novos[i] as Texto;
    const tam = t.tam ?? TAM_PADRAO;
    const { acima, abaixo } = altura(t, tam);
    const [x0, x1] = colunas(t, tam);
    const alta = temFracao(t.s);
    let y = t.y;
    for (let volta = 0; volta < ocupados.length + 1; volta++) {
      const bate = ocupados.find((o) => (o.alta || alta) && o.x0 < x1 && o.x1 > x0 && o.topo < y + abaixo && o.fundo > y - acima);
      if (!bate) break;
      y = bate.fundo + acima + FOLGA;
    }
    novos[i] = { ...t, y: Math.round(y) };
    ocupados.push({ x0, x1, topo: y - acima, fundo: y + abaixo, alta });
    fundo = Math.max(fundo, y + abaixo);
  }
  return { desenho: novos, fundo };
}

export function acomodarFracoes(desenho: Desenho[]): Desenho[] {
  if (!desenho.some((d) => d.k === 'tx' && temFracao(d.s))) return desenho;
  let ultimo = tentar(desenho, ESCALAS[0]);
  for (const escala of ESCALAS) {
    ultimo = tentar(desenho, escala);
    if (ultimo.fundo <= FUNDO) break;
  }
  return ultimo.desenho;
}
