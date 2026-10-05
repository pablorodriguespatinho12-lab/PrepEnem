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
