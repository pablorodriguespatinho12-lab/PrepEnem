import { describe, expect, test } from 'vitest';
import { conferirGabarito, resultadosDe } from './conferir';

describe('resultadosDe', () => {
  test('pega o número que fecha a conta, não os do meio', () => {
    expect(resultadosDe('$x_1 = \\frac{4+2}{2}=3$, $x_2 = \\frac{4-2}{2}=1$')).toEqual(new Set(['3', '1']));
    expect(resultadosDe('$f(4) = 16 - 16 + 3 = 3$')).toEqual(new Set(['3']));
    expect(resultadosDe('$y = 2x + 1$')).toEqual(new Set());
  });
});

describe('conferirGabarito', () => {
  test('corrige o gabarito trocado do teste real (resolução dá 3 e 1, marcada "2 e 1")', () => {
    const r = conferirGabarito(
      { tipo: 'escolha', opcoes: ['1 e 3', '2 e 1', '-1 e -3', '0 e 3'], correta: 1 },
      '$x_1 = \\frac{4+2}{2}=3$, $x_2 = \\frac{4-2}{2}=1$',
    );
    expect(r).toEqual({ resposta: { tipo: 'escolha', opcoes: ['1 e 3', '2 e 1', '-1 e -3', '0 e 3'], correta: 0 } });
  });

  test('mantém gabarito certo de ponto e de número', () => {
    const ponto = { tipo: 'escolha' as const, opcoes: ['(3,4)', '(3, -4)', '(2,5)', '(2,-5)'], correta: 0 };
    expect(conferirGabarito(ponto, '$y_v = -9 + 18 - 5 = 4$ e $x_v = 3$')).toEqual({ resposta: ponto });
    expect(conferirGabarito({ tipo: 'numero', valor: 3 }, '$= 16 - 16 + 3 = 3$')).not.toBeNull();
  });

  test('descarta número que a resolução não confirma', () => {
    expect(conferirGabarito({ tipo: 'numero', valor: 5 }, '$f(2) = 4 + 3 = 7$')).toBeNull();
  });

  test('opções sem número (concavidade) passam como vieram', () => {
    const r = { tipo: 'escolha' as const, opcoes: ['para cima', 'para baixo'], correta: 1 };
    expect(conferirGabarito(r, 'Como $a < 0$, abre para baixo')).toEqual({ resposta: r });
  });

  test('quando a palavra decide (mesmos números nas opções), o gabarito fica como veio', () => {
    const sinal = { tipo: 'escolha' as const, opcoes: ['Aumenta 7', 'Diminui 2', 'Aumenta 2', 'Fica igual'], correta: 1 };
    expect(conferirGabarito(sinal, 'então $a = -2$')).toEqual({ resposta: sinal });
    const desigualdade = { tipo: 'escolha' as const, opcoes: ['Para todo x', 'Para x > 0', 'Para x < 0', 'Nunca'], correta: 1 };
    expect(conferirGabarito(desigualdade, 'À esquerda do 0 desce; à direita, sobe.')).toEqual({ resposta: desigualdade });
  });

  test('vírgula decimal e sinal negativo', () => {
    expect(conferirGabarito({ tipo: 'numero', valor: -2.5 }, '$x = -5/2 = -2,5$')).not.toBeNull();
  });
});
