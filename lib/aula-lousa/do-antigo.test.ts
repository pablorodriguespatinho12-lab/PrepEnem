import { describe, expect, it } from 'vitest';
import { latexParaTexto, lousaDoAntigo } from './do-antigo';
import { validarLousa } from './validar';

const PASSOS = [
  { titulo: 'A pergunta', texto: 'O cliente pagou R$ 840,00 com 30% de desconto.', visual: null },
  { titulo: 'O que acontece', texto: 'Tirando 30%, sobram 70%. Esses 70% valem 840.', visual: null },
  {
    titulo: 'Jeito rápido',
    texto: 'Voltar é dividir por 0,70.',
    visual: { tipo: 'quadro', titulo: 'Voltando', dados: ['\\text{pago} = 840'], contas: ['\\text{preço} = \\dfrac{840}{0{,}70}'], formula: '\\text{preço} = \\dfrac{\\text{pago}}{0{,}70}', resultado: '\\text{preço} = 1\\,200', nota: 'Sem desconto custava R$ 1 200.' },
  },
  { titulo: 'A resposta', texto: 'Letra A, R$ 1 200.', visual: null },
];
const ENTRADA = { enunciado: 'Um celular custa com 30% de desconto R$ 840. Preço original?', alternativas: ['1 200', '1 092', '588', '1 000', '840'], tema: 'Porcentagem', ideia: 'O preço é 840 ÷ 0,70.', passos: PASSOS };

describe('latexParaTexto', () => {
  it('converte o que é comum', () => {
    expect(latexParaTexto('\\text{preço} = \\dfrac{840}{0{,}70}')).toBe('preço = 840/0,70');
    expect(latexParaTexto('E = 60 \\times 150')).toBe('E = 60 × 150');
    expect(latexParaTexto('x^{2} + 1')).toBe('x² + 1');
  });
  it('recusa comando desconhecido', () => {
    expect(latexParaTexto('\\sum_{i} x')).toBeNull();
  });
});

describe('lousa a partir da aula antiga', () => {
  it('gera telas que o porteiro aceita sem cortar nenhuma, sem LaTeX cru', () => {
    const r = lousaDoAntigo(ENTRADA);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const aula = validarLousa(r.aula);
    expect(aula).not.toBeNull();
    expect(aula!.cenas).toHaveLength(r.aula.cenas.length);
    expect(JSON.stringify(r.aula)).not.toMatch(/\\[a-z]/);
  });

  it('alternativa longa: o papel leva só o enunciado, sem cortar a aula', () => {
    const r = lousaDoAntigo({ ...ENTRADA, alternativas: ['a'.repeat(90), 'b'] });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const papel = r.aula.cenas[1];
    expect(papel.tipo === 'papel' && papel.alternativas).toBeFalsy();
    expect(validarLousa(r.aula)!.cenas).toHaveLength(r.aula.cenas.length);
  });

  it('recusa o molde do robô', () => {
    const r = lousaDoAntigo({ ...ENTRADA, passos: [{ titulo: 'As fórmulas desta questão', texto: 'x' }] });
    expect(r.ok).toBe(false);
  });

  it('recusa LaTeX que não sabe escrever', () => {
    const quadro = { ...PASSOS[2], visual: { tipo: 'quadro', contas: ['\\sum_{i} x'] } };
    expect(lousaDoAntigo({ ...ENTRADA, passos: [PASSOS[1], quadro] }).ok).toBe(false);
  });
});
