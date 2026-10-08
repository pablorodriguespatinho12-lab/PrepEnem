import { expect, test } from 'vitest';
import { texParaSvg } from './tex-para-svg';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
test('toda conta de quadro das lições escritas vira traço', () => {
  const ruins: string[] = [];
  for (const [id, l] of Object.entries(LICOES_ESCRITAS)) {
    const visuais = [...l.construcao.map((p) => p.visual), ...l.exemplos.map((e) => e.visual), ...l.exercicios.map((e) => e.visual)];
    for (const v of visuais) if (v?.tipo === 'transformacao') for (const t of [...v.linhas.map((x) => x.latex), ...(v.ajuda ?? []), ...v.linhas.map((x) => x.lado).filter(Boolean) as string[]]) if (!texParaSvg(t)) ruins.push(`${id}: ${t}`);
  }
  expect(ruins).toEqual([]);
});
test('a caneta escreve o exemplo do quadro de escola', () => {
  for (const t of ['v = 72\\,\\text{km/h} = 20\\,\\text{m/s}', 'a = \\dfrac{\\Delta v}{\\Delta t}', 'a = 2\\,\\text{m/s}^2']) expect(texParaSvg(t)).toBeTruthy();
});
