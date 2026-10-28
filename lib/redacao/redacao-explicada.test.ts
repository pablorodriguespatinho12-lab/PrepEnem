// Redação pronta, explicada: conteúdo confere com a receita e cores do grifo
// legíveis (Pablo, 28/10/2026).
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, test } from 'vitest';
import { REDACAO_GRIFADA, textoDaFrase } from './exemplo-receita';

describe('conteúdo confere com a receita', () => {
  test('regra 3: uma proposta contra cada motivo, cada uma com os 5 elementos', () => {
    const propostas = REDACAO_GRIFADA.conclusao.filter((f) => f.some((t) => t.funcao === 'agente'));
    expect(propostas).toHaveLength(2);
    for (const p of propostas) {
      for (const el of ['agente', 'acao', 'meio', 'finalidade', 'detalhamento'] as const) {
        expect(p.filter((t) => t.funcao === el), el).toHaveLength(1);
      }
    }
    /* A 2ª proposta ataca a omissão do Estado: o serviço que falta. */
    expect(textoDaFrase(propostas[1])).toMatch(/CAPS/);
  });
  test('a ponte da introdução não mistura presente e passado no mesmo fato', () => {
    const ponte = textoDaFrase(REDACAO_GRIFADA.introducao[1]);
    expect(ponte).not.toMatch(/ainda persiste:.*morreram/);
    expect(ponte).toContain('tem raízes antigas: no Hospital Colônia de Barbacena (MG), cerca de 60 mil internos morreram ao longo do século XX');
  });
  test('nada vago no lugar de dado: o D2 traz número com fonte', () => {
    const d2 = REDACAO_GRIFADA.desenvolvimento2.flat();
    expect(d2.map((t) => t.texto).join('')).not.toMatch(/muitas cidades/);
    expect(d2.some((t) => t.fato && /\d/.test(t.texto))).toBe(true);
  });
});

/* Contraste calculado dos tokens de app/globals.css, nos 2 temas. */
describe('cores do grifo', () => {
  const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf8');
  const bloco = (sel: RegExp) => { const i = css.search(sel); return css.slice(i, css.indexOf('\n  }', i)); };
  const valor = (b: string, nome: string) => b.match(new RegExp(`--${nome}:\\s*([^;]+);`))?.[1].trim() ?? '';
  const raiz = bloco(/:root \{/);
  const escuro = bloco(/\.dark \{/);
  const numeros = (txt: string) => txt.replace(/%/g, '').split(/\s+/).map(Number);
  const rgb = (h: number, s: number, l: number) => {
    const k = (n: number) => (n + h / 30) % 12;
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    return [0, 8, 4].map((n) => l / 100 - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)));
  };
  const lum = (c: number[]) =>
    c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((t, v, i) => t + v * [0.2126, 0.7152, 0.0722][i], 0);
  const contraste = (a: number[], b: number[]) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const TODAS = ['repertorio', 'ponte', 'tese', 'topico', 'explicacao', 'fechamento', 'agente', 'acao', 'meio', 'finalidade', 'detalhamento'];
  const matiz = (f: string) => numeros(valor(raiz, `grifo-${f}`));
  const distancia = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
  const todasLonge = (fs: string[]) => {
    const h = fs.map((f) => matiz(f)[0]);
    return h.every((x, i) => h.every((y, j) => i === j || distancia(x, y) >= 40));
  };

  test('texto sobre todo grifo (normal e tocado) passa AA nos 2 temas', () => {
    for (const [tema, b] of [['claro', raiz], ['escuro', escuro]] as const) {
      const [fh, fs, fl] = numeros(valor(b, 'foreground'));
      const fg = rgb(fh, fs, fl);
      for (const luz of ['grifo-luz', 'grifo-luz-ativa']) {
        const l = numeros(valor(b, luz))[0];
        for (const f of TODAS) {
          const [h, s] = matiz(f);
          expect(contraste(fg, rgb(h, s, l)), `${tema} ${luz} ${f}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
  test('cada função tem cor própria; vizinhas a 40° ou mais de matiz', () => {
    expect(new Set(TODAS.map((f) => valor(raiz, `grifo-${f}`))).size).toBe(TODAS.length);
    expect(todasLonge(['repertorio', 'ponte', 'tese', 'topico', 'explicacao'])).toBe(true);
    expect(todasLonge(['agente', 'acao', 'meio', 'finalidade', 'detalhamento'])).toBe(true);
  });
});
