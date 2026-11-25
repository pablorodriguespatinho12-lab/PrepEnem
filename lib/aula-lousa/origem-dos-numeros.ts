// Regra 19 (Pablo, 24/11/2026): "todo número que entra numa conta tem a conta anterior desenhada".
// Mede, numa lousa pronta, quais números do LADO ESQUERDO de uma conta não aparecem antes em
// nenhuma tela (nem na questão em papel, nem nos dados, nem como resultado de conta anterior).
import type { Cena, Desenho } from './tipos';

const NUMERO = /\d{1,3}(?: \d{3})+(?:,\d+)?|\d[\d.,]*/g;
const SEM_PRECISAR_DE_ORIGEM = new Set(['0', '1']); // neutro: 0 e 1 não pedem "de onde vem"
const SEGUNDOS_DE_LINHA_NOVA = 1; // peças da mesma linha entram a cada 0,5 s; linha nova só depois de >= 1,3 s
const SINAIS = /^[=+×÷−]$/;

const normaliza = (n: string): string => n.replace(/ /g, '').replace(/[.,]+$/, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
const numerosDe = (s: string): string[] => (s.match(NUMERO) ?? []).map(normaliza).filter(Boolean);

export interface NumeroSemOrigem {
  cena: number;
  numero: string;
  linha: string;
}

type Texto = Extract<Desenho, { k: 'tx' }>;

/** Peças de texto da lousa em ordem de aparição, agrupadas em linhas de conta. */
function linhasDaLousa(desenho: Desenho[]): Texto[][] {
  const tx = desenho.filter((d): d is Texto => d.k === 'tx' && d.cor !== 'cinza' && d.y > 60).sort((a, b) => a.t - b.t);
  const linhas: Texto[][] = [];
  tx.forEach((d) => {
    const atual = linhas[linhas.length - 1];
    if (atual && d.t - atual[atual.length - 1].t < SEGUNDOS_DE_LINHA_NOVA) atual.push(d);
    else linhas.push([d]);
  });
  return linhas;
}

export function numerosSemOrigem(cenas: Cena[]): NumeroSemOrigem[] {
  const vistos = new Set<string>(SEM_PRECISAR_DE_ORIGEM);
  const faltas: NumeroSemOrigem[] = [];
  cenas.forEach((c, i) => {
    if (c.tipo === 'papel') {
      [c.texto, ...(c.alternativas ?? [])].forEach((t) => numerosDe(t).forEach((n) => vistos.add(n)));
      return;
    }
    if (c.tipo === 'prova') {
      [c.pergunta, ...c.opcoes].forEach((t) => numerosDe(t).forEach((n) => vistos.add(n)));
      return;
    }
    for (const linha of linhasDaLousa(c.desenho)) {
      const texto = linha.map((d) => d.s).join(' ');
      const ehConta = linha.some((d) => d.s === '=') && linha.some((d) => SINAIS.test(d.s) && d.s !== '=');
      let depoisDoIgual = false;
      for (const d of linha) {
        if (d.s === '=') depoisDoIgual = true;
        for (const n of numerosDe(d.s)) {
          if (ehConta && !depoisDoIgual && !vistos.has(n)) faltas.push({ cena: i, numero: n, linha: texto.slice(0, 80) });
          vistos.add(n);
        }
      }
    }
  });
  return faltas;
}
