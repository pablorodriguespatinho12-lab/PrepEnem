import { describe, expect, test } from 'vitest';
import { validarVisual } from './especificacao';

describe('validarVisual', () => {
  test('cena: aceita carro e moto, descarta veículo sem regra legível', () => {
    const v = validarVisual({
      tipo: 'cena', x: [0, 4], unidadeX: 'min', unidadeY: 'km',
      veiculos: [
        { veiculo: 'carro', nome: 'f', expr: '5*x+2', cor: 'a' },
        { veiculo: 'moto', nome: 'g', expr: '7*x', cor: 'b' },
        { veiculo: 'moto', nome: 'h', expr: 'alert(1)' },
      ],
    });
    expect(v).toMatchObject({ tipo: 'cena', x: [0, 4], veiculos: [{ veiculo: 'carro', nome: 'f' }, { veiculo: 'moto', nome: 'g' }] });
    expect(v && v.tipo === 'cena' && v.veiculos).toHaveLength(2);
  });
  test('cena: recusa relógio que não é de números inteiros', () => {
    expect(validarVisual({ tipo: 'cena', x: [0, 2.5], veiculos: [{ veiculo: 'carro', nome: 'f', expr: 'x' }] })).toBeNull();
  });
  test('aceita gráfico válido e descarta a função ilegível', () => {
    const v = validarVisual({
      tipo: 'grafico', x: [-4, 4],
      funcoes: [{ expr: 'x^2-4', cor: 'a' }, { expr: 'alert(1)' }],
      pontos: [{ x: 2, y: 0, rotulo: 'raiz' }, { x: 'dois', y: 0 }],
    });
    expect(v).toMatchObject({ tipo: 'grafico', funcoes: [{ expr: 'x^2-4', cor: 'a' }], pontos: [{ x: 2, y: 0 }] });
  });

  test('recusa gráfico sem intervalo válido ou sem nada para desenhar', () => {
    expect(validarVisual({ tipo: 'grafico', x: [4, -4], funcoes: [{ expr: 'x' }] })).toBeNull();
    expect(validarVisual({ tipo: 'grafico', x: [-1, 1], funcoes: [{ expr: '???' }] })).toBeNull();
  });

  test('recusa tipo desconhecido e lixo', () => {
    expect(validarVisual({ tipo: 'imagem', url: 'http://x' })).toBeNull();
    expect(validarVisual(null)).toBeNull();
    expect(validarVisual('grafico')).toBeNull();
  });

  test('transformação precisa de pelo menos duas linhas', () => {
    expect(validarVisual({ tipo: 'transformacao', linhas: [{ latex: 'x=1' }] })).toBeNull();
    expect(validarVisual({ tipo: 'transformacao', linhas: [{ latex: 'a' }, { latex: 'b', porque: 'c' }] })).not.toBeNull();
  });

  test('tabela descarta linha com número errado de colunas', () => {
    const v = validarVisual({ tipo: 'tabela', cabecalho: ['n', 'm'], linhas: [['1', 18], ['2']] });
    expect(v).toEqual({ tipo: 'tabela', titulo: undefined, cabecalho: ['n', 'm'], linhas: [['1', '18']] });
  });

  test('reta: trecho aberto/fechado e vetores com par de números', () => {
    const r = validarVisual({ tipo: 'reta', de: -5, ate: 5, trechos: [{ de: 2, ate: 5, fechadoAte: false }] });
    expect(r).toMatchObject({ trechos: [{ fechadoDe: true, fechadoAte: false }] });
    expect(validarVisual({ tipo: 'vetores', vetores: [{ de: [0, 0], para: [3] }] })).toBeNull();
  });
});
