import { describe, expect, test } from 'vitest';
import { validarVisual } from './especificacao';

describe('validarVisual', () => {
  test('ponto aberto (furo) é preservado; sem o campo, fica fechado', () => {
    const v = validarVisual({ tipo: 'grafico', x: [0, 2], funcoes: [{ expr: 'x' }], pontos: [{ x: 1, y: 1, aberto: true }, { x: 2, y: 2 }] });
    expect(v).toMatchObject({ pontos: [{ x: 1, y: 1, aberto: true }, { x: 2, y: 2 }] });
    expect(v && v.tipo === 'grafico' && v.pontos?.[1].aberto).toBeFalsy();
  });
  test('roda: círculo de raio 1 por padrão, divisões e voltas limitadas', () => {
    expect(validarVisual({ tipo: 'roda', divisoes: 12 })).toMatchObject({ tipo: 'roda', divisoes: 12, raio: 1, centro: 0, voltas: 1 });
    expect(validarVisual({ tipo: 'roda', divisoes: 12, raio: 20, centro: 22, voltas: 2, unidade: 'm', grafico: true }))
      .toMatchObject({ raio: 20, centro: 22, voltas: 2, unidade: 'm', grafico: true });
    expect(validarVisual({ tipo: 'roda', divisoes: 3 })).toBeNull();
    expect(validarVisual({ tipo: 'roda', divisoes: 12, voltas: 9 })).toMatchObject({ voltas: 3 });
    expect(validarVisual({ tipo: 'roda', divisoes: 12, raio: -1 })).toBeNull();
  });
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
  test('cena: bola e vela andam na vertical; veículo de outra direção sai', () => {
    const v = validarVisual({
      tipo: 'cena', x: [0, 4], rastro: true,
      veiculos: [{ veiculo: 'bola', nome: 'h', expr: '20*x-5*x^2' }, { veiculo: 'carro', nome: 'f', expr: 'x' }],
    });
    expect(v).toMatchObject({ tipo: 'cena', rastro: true, veiculos: [{ veiculo: 'bola' }] });
    expect(v && v.tipo === 'cena' && v.veiculos).toHaveLength(1);
  });
  test('cena: nome que não é uma letra vira f e g', () => {
    const v = validarVisual({
      tipo: 'cena', x: [0, 3],
      veiculos: [{ veiculo: 'bola', nome: 'metal', expr: '45-5*x^2' }, { veiculo: 'bola', nome: 'pluma', expr: '45-x' }],
    });
    expect(v && v.tipo === 'cena' && v.veiculos.map((w) => w.nome)).toEqual(['f', 'g']);
  });
  test('cena: objeto que o app não desenha vira bola, e o nome fica no rótulo', () => {
    const v = validarVisual({
      tipo: 'cena', x: [0, 2],
      veiculos: [{ veiculo: 'pena', nome: 'p', expr: '10-0.5*x^2' }, { veiculo: 'pedra', nome: 's', expr: '10-2*x^2', rotulo: 'pedra' }],
    });
    expect(v).toMatchObject({ veiculos: [{ veiculo: 'bola', rotulo: 'pena' }, { veiculo: 'bola', rotulo: 'pedra' }] });
  });
  test('cena vertical: o relógio para quando todos chegaram ao chão', () => {
    const v = validarVisual({
      tipo: 'cena', x: [0, 5],
      veiculos: [{ veiculo: 'bola', nome: 'h', expr: '20-5*x^2' }, { veiculo: 'bola', nome: 'g', expr: '20-3*x^2' }],
    });
    expect(v).toMatchObject({ x: [0, 2] });
  });
  test('cena horizontal com valor negativo não é cortada', () => {
    const v = validarVisual({ tipo: 'cena', x: [0, 6], veiculos: [{ veiculo: 'moto', nome: 'g', expr: '5*(x-2)' }] });
    expect(v).toMatchObject({ x: [0, 6] });
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
