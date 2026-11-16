// Relógio do dia e da noite do fundo de pixel (components/pixel/mundo-pixel.tsx).

/* Quanto da noite aparece em cada ponto do ciclo (0 a 1); o dia é o resto.
   Mesmos pontos do antigo @keyframes mp-noite. */
const NOITE_NO_CICLO: [number, number][] = [[0, 0.6], [0.04, 0], [0.44, 0], [0.54, 1], [0.94, 1], [1, 0.6]];
export function quantoDeNoite(t: number): number {
  const f = ((t % 1) + 1) % 1;
  const i = NOITE_NO_CICLO.findIndex(([x]) => x >= f);
  if (i <= 0) return NOITE_NO_CICLO[0][1];
  const [x0, y0] = NOITE_NO_CICLO[i - 1];
  const [x1, y1] = NOITE_NO_CICLO[i];
  return y0 + ((f - x0) / (x1 - x0)) * (y1 - y0);
}
