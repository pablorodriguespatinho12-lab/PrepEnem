import { describe, expect, test } from 'vitest';
import { validarVisual } from './especificacao';

describe('validarVisual', () => {
  test('processo: etapas com o que entra e sai, e ligação entre elas', () => {
    const v = validarVisual({
      tipo: 'processo', titulo: 'Fotossíntese',
      etapas: [
        { nome: 'Fase clara', entra: ['luz', 'H₂O'], sai: ['O₂'] },
        { nome: 'Fase escura', entra: ['CO₂'], sai: ['glicose'] },
      ],
      ligacoes: [{ de: 0, para: 1, leva: 'ATP e NADPH' }, { de: 0, para: 9, leva: 'x' }],
    });
    expect(v).toMatchObject({ tipo: 'processo', etapas: [{ nome: 'Fase clara', entra: ['luz', 'H₂O'], sai: ['O₂'] }, { nome: 'Fase escura' }], ligacoes: [{ de: 0, para: 1, leva: 'ATP e NADPH' }] });
    expect(v && v.tipo === 'processo' && v.ligacoes).toHaveLength(1);
    expect(validarVisual({ tipo: 'processo', etapas: [] })).toBeNull();
  });
  test('processo forçado (etapa vazia, teste de 06/10/2026) é descartado', () => {
    expect(validarVisual({ tipo: 'processo', etapas: [{ nome: 'Troca gasosa', entra: ['O₂'], sai: ['CO₂'] }, { nome: 'Sustentação', entra: [], sai: [] }] })).toBeNull();
    expect(validarVisual({ tipo: 'processo', etapas: [{ nome: 'Só nome', entra: ['A'], sai: [] }] })).toBeNull();
    expect(validarVisual({ tipo: 'processo', etapas: [{ nome: 'Respiração', entra: ['glicose', 'O₂'], sai: ['CO₂', 'ATP'] }] })).not.toBeNull();
  });
  test('fatias: função legível, intervalo e no máximo 50 fatias', () => {
    expect(validarVisual({ tipo: 'fatias', expr: 'x^2', x: [0, 3], maxFatias: 30 })).toMatchObject({ tipo: 'fatias', expr: 'x^2', x: [0, 3], maxFatias: 30 });
    expect(validarVisual({ tipo: 'fatias', expr: 'x^2', x: [0, 3], maxFatias: 500 })).toMatchObject({ maxFatias: 50 });
    expect(validarVisual({ tipo: 'fatias', expr: 'alert(1)', x: [0, 3], maxFatias: 10 })).toBeNull();
  });
  test('retângulo: base e altura por regra, relógio inteiro, nada negativo', () => {
    expect(validarVisual({ tipo: 'retangulo', x: [0, 4], base: '10+x', altura: '5+2*x' }))
      .toMatchObject({ tipo: 'retangulo', x: [0, 4], base: '10+x', altura: '5+2*x' });
    expect(validarVisual({ tipo: 'retangulo', x: [0, 4], base: '2-x', altura: '1' })).toBeNull();
    expect(validarVisual({ tipo: 'retangulo', x: [0, 10], base: 'x', altura: '10-x', faixas: false })).toMatchObject({ faixas: false });
    expect(validarVisual({ tipo: 'retangulo', x: [0, 4], base: 'x', altura: '1' })).toMatchObject({ faixas: true });
    expect(validarVisual({ tipo: 'retangulo', x: [0, 4], base: 'alert(1)', altura: '1' })).toBeNull();
  });
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
  test('cena: legenda fica com até 4 linhas e descarta linha sem termo ou sem texto', () => {
    const v = validarVisual({
      tipo: 'cena', x: [0, 4],
      legenda: [{ termo: 'x', diz: 'os minutos' }, { termo: '5' }, { diz: 'solto' }, ...Array(5).fill({ termo: '2', diz: 'onde começa' })],
      veiculos: [{ veiculo: 'carro', expr: '5*x+2' }],
    });
    expect(v && v.tipo === 'cena' && v.legenda).toEqual([
      { termo: 'x', diz: 'os minutos' }, { termo: '2', diz: 'onde começa' }, { termo: '2', diz: 'onde começa' }, { termo: '2', diz: 'onde começa' },
    ]);
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
  test('cena: velocímetro só liga quando pedido', () => {
    const base = { tipo: 'cena', x: [0, 3], veiculos: [{ veiculo: 'carro', nome: 'f', expr: 'x^3' }] };
    expect(validarVisual({ ...base, velocimetro: true })).toMatchObject({ velocimetro: true });
    expect(validarVisual(base)).toMatchObject({ velocimetro: false });
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
  test('molécula: guarda de 2 a 6 átomos com símbolo válido; soma só se todos têm massa', () => {
    const agua = validarVisual({ tipo: 'molecula', nome: 'H₂O', atomos: [{ simbolo: 'O', massa: 16 }, { simbolo: 'H', massa: 1 }, { simbolo: 'H', massa: 1 }, { simbolo: 'água' }], soma: true });
    expect(agua).toMatchObject({ tipo: 'molecula', soma: true, atomos: [{ simbolo: 'O' }, { simbolo: 'H' }, { simbolo: 'H' }] });
    const semMassa = validarVisual({ tipo: 'molecula', atomos: [{ simbolo: 'C', massa: 12 }, { simbolo: 'Xe' }], soma: true });
    expect(semMassa && semMassa.tipo === 'molecula' && semMassa.soma).toBe(false);
    expect(validarVisual({ tipo: 'molecula', atomos: [{ simbolo: 'H' }] })).toBeNull();
  });
  test('gráfico: "raiz" fora da curva sai; ponto certo e furo ficam', () => {
    const g = validarVisual({ tipo: 'grafico', x: [-4, 4], funcoes: [{ expr: 'x^2-4' }], pontos: [
      { x: 2, y: 0, rotulo: 'raiz' }, { x: 3, y: 0, rotulo: 'raiz' }, { x: 1, y: 9, rotulo: 'furo', aberto: true }, { x: 1, y: 9, rotulo: 'dado' },
    ] });
    expect(g && g.tipo === 'grafico' && g.pontos!.map((p) => `${p.x},${p.rotulo}`)).toEqual(['2,raiz', '1,furo', '1,dado']);
  });
  test('molécula: massa de átomo comum vem da tabela, não da IA (a soma aparece na tela)', () => {
    const v = validarVisual({ tipo: 'molecula', atomos: [{ simbolo: 'C', massa: 14 }, { simbolo: 'O' }, { simbolo: 'O', massa: 16 }], soma: true });
    expect(v).toMatchObject({ soma: true, atomos: [{ simbolo: 'C', massa: 12 }, { simbolo: 'O', massa: 16 }, { simbolo: 'O', massa: 16 }] });
  });
  test('palavra: sílabas só se juntas dão a palavra; destaque só se está nela', () => {
    expect(validarVisual({ tipo: 'palavra', palavra: 'baú', silabas: ['ba', 'ú'], destaque: 'ú', nota: 'hiato' }))
      .toEqual({ tipo: 'palavra', titulo: undefined, palavra: 'baú', silabas: ['ba', 'ú'], destaque: 'ú', nota: 'hiato' });
    expect(validarVisual({ tipo: 'palavra', palavra: 'baú', silabas: ['bau'], destaque: 'x' }))
      .toMatchObject({ silabas: undefined, destaque: undefined });
    expect(validarVisual({ tipo: 'palavra' })).toBeNull();
  });
});
describe('quadro de escola', () => {
  const quadro = {
    tipo: 'quadro',
    dados: ['v_0 = 0', 'v = 72\\,\\text{km/h} = 20\\,\\text{m/s}', '\\Delta t = 10\\,\\text{s}'],
    formula: 'a = \\dfrac{\\Delta v}{\\Delta t}',
    legenda: ['$\\Delta v$: quanto a velocidade mudou'],
    contas: ['a = \\dfrac{20 - 0}{10}', 'a = \\dfrac{20}{10}'],
    resultado: 'a = 2\\,\\text{m/s}^2',
    nota: 'A cada segundo, a velocidade sobe 2 m/s.',
  };
  test('dados, fórmula, contas e resultado passam inteiros', () => {
    expect(validarVisual(quadro)).toMatchObject({ tipo: 'quadro', dados: quadro.dados, formula: quadro.formula, contas: quadro.contas, resultado: quadro.resultado });
  });
  test('sem dados, fórmula ou resultado não é quadro', () => {
    expect(validarVisual({ ...quadro, dados: [] })).toBeNull();
    expect(validarVisual({ ...quadro, formula: '' })).toBeNull();
    expect(validarVisual({ ...quadro, resultado: undefined })).toBeNull();
  });
});
describe('condição no canto da transformação', () => {
  const linhas = [{ latex: 'ax^2+bx+c=0' }, { latex: 'x^2+\\frac{b}{a}x=-\\frac{c}{a}' }];
  test('"true" não vira condição escrita no quadro', () => {
    const v = validarVisual({ tipo: 'transformacao', condicao: 'true', linhas });
    expect(v && v.tipo === 'transformacao' && v.condicao).toBeUndefined();
  });
  test('condição com sinal de comparação fica', () => {
    const v = validarVisual({ tipo: 'transformacao', condicao: 'a \\neq 0', linhas });
    expect(v && v.tipo === 'transformacao' && v.condicao).toBe('a \\neq 0');
  });
});
test('quadro: vírgula decimal sem espaço no LaTeX', () => {
  const v = validarVisual({ tipo: 'quadro', dados: ['E = 0,54\\,\\text{V}'], formula: 'E = a - b', contas: ['E = 0,54 - (-3,05)'], resultado: 'E = 3,59' });
  expect(v).toMatchObject({ dados: ['E = 0{,}54\\,\\text{V}'], contas: ['E = 0{,}54 - (-3{,}05)'], resultado: 'E = 3{,}59' });
});
test('quadro: palavra solta na fórmula vira texto, com espaço', () => {
  const v = validarVisual({ tipo: 'quadro', dados: ['m = massa do corpo', 'v = 4\\,\\text{m/s}', 'N = 100 habitantes'], formula: 'E_c = \\frac{1}{2} m v^2', contas: ['E_c = \\frac{1}{2} \\cdot 2 \\cdot 4^2'], resultado: 'E_c = 16\\,\\text{J}' });
  expect(v).toMatchObject({ dados: ['m = \\,\\text{massa do corpo}', 'v = 4\\,\\text{m/s}', 'N = 100 \\,\\text{habitantes}'], resultado: 'E_c = 16\\,\\text{J}' });
});
test('quadro sem nenhum número não é quadro (a fórmula escrita três vezes)', () => {
  expect(validarVisual({ tipo: 'quadro', dados: ['m = massa do corpo', 'v = velocidade'], formula: 'E_c = \\frac{1}{2}mv^2', contas: ['E_c = \\frac{1}{2}mv^2'], resultado: 'E_c = \\frac{1}{2}mv^2' })).toBeNull();
});
