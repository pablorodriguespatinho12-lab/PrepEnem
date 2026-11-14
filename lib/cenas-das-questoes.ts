import dados from '@/data/revisao-final/cenas-das-questoes.json';
import { FIGURAS_PIXEL, type NomeFigura } from '@/lib/visual/especificacao';

// Cena em pixel da SITUAÇÃO de cada questão (Pablo, 14/11/2026). Só entra nome que
// existe em FIGURAS_PIXEL: nome errado no JSON não quebra a prova, só some a cena.

export type CenaDaQuestao = { nome: NomeFigura; rotulos: string[] };
const CENAS = dados.cenas as Record<string, { nome: string; rotulos?: string[] }>;

export function cenaDaQuestao(id: string | undefined): CenaDaQuestao | null {
  const c = id ? CENAS[id] : undefined;
  const nome = c && FIGURAS_PIXEL.find((n) => n === c.nome);
  return nome ? { nome, rotulos: c.rotulos ?? [] } : null;
}

export const QUESTOES_COM_CENA = Object.keys(CENAS);
