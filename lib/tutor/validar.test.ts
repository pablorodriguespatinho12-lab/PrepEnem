import { describe, expect, test } from 'vitest';
import { extrairJson, resumirExplicacao, validarExplicacao, validarRespostaTutor } from './validar';

describe('extrairJson', () => {
  test('tira cerca de markdown e texto em volta', () => {
    expect(extrairJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(extrairJson('Aqui está: {"a":2} pronto')).toEqual({ a: 2 });
  });

  test('LaTeX com barra simples não vira form-feed nem tab', () => {
    const r = extrairJson(String.raw`{"t":"$\frac{1}{2} \times \theta$"}`) as { t: string };
    expect(r.t).toBe(String.raw`$\frac{1}{2} \times \theta$`);
  });

  test('LaTeX já escapado e quebra de linha continuam como estão', () => {
    expect((extrairJson(String.raw`{"t":"$\\frac{1}{2}$"}`) as { t: string }).t).toBe(String.raw`$\frac{1}{2}$`);
    expect((extrairJson(String.raw`{"t":"linha um\nlinha dois"}`) as { t: string }).t).toBe('linha um\nlinha dois');
  });

  test('barra inválida para JSON ("\\sqrt") é salva em vez de falhar', () => {
    expect((extrairJson(String.raw`{"t":"$\sqrt{4} \cdot 2$"}`) as { t: string }).t).toBe(String.raw`$\sqrt{4} \cdot 2$`);
  });

  test('devolve null para lixo', () => {
    expect(extrairJson('sem json')).toBeNull();
    expect(extrairJson('{quebrado')).toBeNull();
  });
});

describe('validarExplicacao', () => {
  const valida = {
    ideia: 'A raiz é onde f(x) = 0.',
    pecas: [{ termo: 'raiz', significado: 'valor de x que zera a função' }, { termo: '' }],
    passos: [
      { titulo: 'Veja o gráfico', texto: 'A parábola corta o eixo x em dois pontos.', visual: { tipo: 'grafico', x: [-4, 4], funcoes: [{ expr: 'x^2-4' }] } },
      { titulo: 'Sem título?' },
      { titulo: 'Conta', texto: 'x^2 = 4', visual: { tipo: 'imagem' } },
    ],
    seuErro: 'Você somou em vez de subtrair.',
    checagem: { pergunta: 'Onde fica a raiz?', resposta: 'Onde o gráfico corta o eixo x.' },
  };

  test('mantém o que é válido e descarta o resto', () => {
    const e = validarExplicacao(valida)!;
    expect(e.pecas).toHaveLength(1);
    expect(e.passos).toHaveLength(2);
    expect(e.passos[0].visual?.tipo).toBe('grafico');
    expect(e.passos[1].visual).toBeNull();
  });

  test('sem ideia ou sem passos não há explicação', () => {
    expect(validarExplicacao({ ...valida, ideia: '' })).toBeNull();
    expect(validarExplicacao({ ...valida, passos: [] })).toBeNull();
  });

  test('checagem incompleta vira null', () => {
    expect(validarExplicacao({ ...valida, checagem: { pergunta: 'x?' } })!.checagem).toBeNull();
  });

  test('resumo lista os passos para o tutor não repetir', () => {
    expect(resumirExplicacao(validarExplicacao(valida)!)).toContain('1. Veja o gráfico');
  });
});

describe('validarRespostaTutor', () => {
  test('exige resposta em texto', () => {
    expect(validarRespostaTutor({ resposta: 'Isso: x = 2.', visual: null })).toEqual({ resposta: 'Isso: x = 2.', visual: null });
    expect(validarRespostaTutor({ visual: null })).toBeNull();
  });
});
describe('validarExplicacao limpa o texto da IA', () => {
  const passo = (texto: string) => ({ titulo: 'Passo', texto, visual: null });
  test('tira emoji de todos os campos', () => {
    const e = validarExplicacao({ ideia: 'Energia 🌱 vem da luz.', passos: [passo('Olha ✅ isso.')], seuErro: 'Errou 😅 a conta.' })!;
    expect(e.ideia).toBe('Energia vem da luz.');
    expect(e.passos[0].texto).toBe('Olha isso.');
    expect(e.seuErro).toBe('Errou a conta.');
  });
  test('no máximo 4 passos', () => {
    const e = validarExplicacao({ ideia: 'Ok.', passos: Array.from({ length: 7 }, (_, i) => passo(`Passo ${i}.`)) })!;
    expect(e.passos).toHaveLength(4);
  });
  test('ideia fica nas 2 primeiras frases', () => {
    const e = validarExplicacao({ ideia: 'A planta precisa de energia. Carboidrato é energia. Sem ele, ela morre. E mais.', passos: [passo('x.')] })!;
    expect(e.ideia).toBe('A planta precisa de energia. Carboidrato é energia.');
  });
  test('decimal e fórmula não contam como fim de frase', () => {
    const e = validarExplicacao({ ideia: 'A massa é 0.5 kg e $v = 2.5$ m/s. Pronto.', passos: [passo('x.')] })!;
    expect(e.ideia).toBe('A massa é 0.5 kg e $v = 2.5$ m/s. Pronto.');
  });
  test('frase proibida sai, o resto fica', () => {
    const e = validarExplicacao({ ideia: 'Ok.', passos: [passo('Vamos analisar a questão. A raiz é 2.')] })!;
    expect(e.passos[0].texto).toBe('A raiz é 2.');
  });
  test('expoente solto vira sobrescrito fora da fórmula, dentro fica', () => {
    const e = validarExplicacao({ ideia: 'Dá 2 m/s^2, e $x^2$ fica.', passos: [passo('x.')] })!;
    expect(e.ideia).toBe('Dá 2 m/s², e $x^2$ fica.');
  });

  test('desenho de palavra só em Português (em Física virava "New·ton")', () => {
    const palavra = { tipo: 'palavra', palavra: 'Newton', silabas: ['New', 'ton'], destaque: 'ton', nota: 'Unidade.' };
    const bruto = { ideia: 'Ok.', passos: [{ titulo: 'Passo', texto: 'x.', visual: palavra }] };
    expect(validarExplicacao(bruto, 'Física')!.passos[0].visual).toBeNull();
    expect(validarExplicacao(bruto, 'Português')!.passos[0].visual).not.toBeNull();
  });

  test('texto longo é cortado no fim de uma frase, nunca no meio da palavra', () => {
    const longo = 'Frase curta. ' + 'palavra '.repeat(150) + 'fim.';
    const e = validarExplicacao({ ideia: 'Ok.', passos: [passo(longo)] })!;
    expect(e.passos[0].texto).toBe('Frase curta.');
  });
});
