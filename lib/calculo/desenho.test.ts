import { describe, expect, test } from 'vitest';
import { ajustarTraco, conferirDesenho, type Ponto } from './desenho';

// Traço à mão: pontos ao longo de um segmento com tremida determinística.
function traco(de: Ponto, ate: Ponto, tremida = 0.08, n = 40): Ponto[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const ruido = Math.sin(i * 1.7) * tremida;
    const dx = ate.x - de.x, dy = ate.y - de.y, len = Math.hypot(dx, dy);
    return { x: de.x + dx * t - (dy / len) * ruido, y: de.y + dy * t + (dx / len) * ruido };
  });
}

const eixoX = ajustarTraco(traco({ x: -4.6, y: 0.2 }, { x: 4.7, y: -0.15 }))!;
const eixoY = ajustarTraco(traco({ x: 0.15, y: -4.5 }, { x: -0.1, y: 4.6 }))!;

describe('ajustarTraco', () => {
  test('traço tremido quase horizontal perto de y = 0 vira o eixo x, exato', () => {
    expect(eixoX.tipo).toBe('eixoX');
    expect(eixoX.de.y).toBe(0);
    expect(eixoX.ate.y).toBe(0);
  });

  test('traço vertical perto de x = 0 vira o eixo y', () => {
    expect(eixoY.tipo).toBe('eixoY');
    expect(eixoY.de.x).toBe(0);
  });

  test('traço reto inclinado vira reta pelos mesmos pontos', () => {
    const r = ajustarTraco(traco({ x: -2, y: -3 }, { x: 2, y: 5 }))!;
    expect(r.tipo).toBe('reta');
    expect(r.de.x).toBeCloseTo(-2, 0);
    expect(r.ate.y).toBeCloseTo(5, 0);
  });

  test('rabisco curvo não é aceito como reta', () => {
    const curva = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 39) * Math.PI;
      return { x: 3 * Math.cos(a), y: 3 * Math.sin(a) };
    });
    expect(ajustarTraco(curva)!.tipo).toBe('rabisco');
  });

  test('toque curto (um ponto) é ignorado', () => {
    expect(ajustarTraco([{ x: 1, y: 1 }, { x: 1.05, y: 1 }])).toBeNull();
  });
});

describe('conferirDesenho: f(x) = 2x + 1', () => {
  const alvo = { a: 2, b: 1 };
  const certa = ajustarTraco(traco({ x: -2.5, y: -4 }, { x: 1.5, y: 4 }))!;

  test('eixos e reta certos: certo, nada falta', () => {
    expect(conferirDesenho([eixoX, eixoY, certa], alvo)).toEqual({ certo: true, falta: [] });
  });

  test('sem os eixos: diz quais faltam', () => {
    const r = conferirDesenho([certa], alvo);
    expect(r.certo).toBe(false);
    expect(r.falta.join(' ')).toMatch(/eixo x/);
    expect(r.falta.join(' ')).toMatch(/eixo y/);
  });

  test('sem a reta: diz que falta a reta', () => {
    const r = conferirDesenho([eixoX, eixoY], alvo);
    expect(r.falta.join(' ')).toMatch(/reta/);
  });

  test('reta descendo quando devia subir', () => {
    const errada = ajustarTraco(traco({ x: -2, y: 5 }, { x: 2, y: -3 }))!;
    expect(conferirDesenho([eixoX, eixoY, errada], alvo).falta.join(' ')).toMatch(/subir/);
  });

  test('inclinação certa mas cortando o eixo y no lugar errado', () => {
    const deslocada = ajustarTraco(traco({ x: -2.5, y: -2 }, { x: 1.5, y: 6 }))!; // 2x + 3
    expect(conferirDesenho([eixoX, eixoY, deslocada], alvo).falta.join(' ')).toMatch(/y = 1|em 1/);
  });

  test('erro pequeno de mão (0,2 de quadradinho) ainda é certo', () => {
    const quase = ajustarTraco(traco({ x: -2.5, y: -3.8 }, { x: 1.5, y: 4.2 }))!;
    expect(conferirDesenho([eixoX, eixoY, quase], alvo).certo).toBe(true);
  });

  test('reta curtinha demais não dá para conferir', () => {
    const curta = ajustarTraco(traco({ x: 0, y: 1 }, { x: 0.4, y: 1.8 }))!;
    expect(conferirDesenho([eixoX, eixoY, curta], alvo).falta.join(' ')).toMatch(/maior|comprida/);
  });
});

describe('gabarito do desenho', () => {
  test('ponto citado na resolução fora da reta derruba o exercício', async () => {
    const { conferirGabarito } = await import('./conferir');
    const resposta = { tipo: 'desenho', reta: { a: 1, b: 2 } } as const;
    expect(conferirGabarito(resposta, 'passa por (0, 2) e (1, 3)')).not.toBeNull();
    expect(conferirGabarito(resposta, 'passa por (0, 2) e (1, 4)')).toBeNull();
  });
});
