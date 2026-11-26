import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

// 26/11/2026: o fundo escondido para poupar quadros deixava o céu claro chapado atrás da aula.
describe('fundo atrás da aula de lousa', () => {
  it('quem esconde o mundo pixel também escurece o fundo dele', () => {
    const css = readFileSync(`${process.cwd()}/app/globals.css`, 'utf8');
    const regra = css.match(/html\[data-lousa-aberta="sim"\][^{]*\.mundo-pixel[^{]*\{([^}]*)\}/)?.[1] ?? '';
    expect(regra).toContain('content-visibility: hidden');
    expect(regra).toMatch(/background:\s*#0b1114/);
  });
});
