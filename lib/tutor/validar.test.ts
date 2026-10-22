import { describe, expect, test } from 'vitest';
import { extrairJson, resumirExplicacao, semPalavraChula, temPalavrao, validarExplicacao, validarRespostaTutor } from './validar';

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
  test('no máximo 6 passos (a pergunta → o que acontece → jeito rápido → por que funciona → a resposta)', () => {
    const e = validarExplicacao({ ideia: 'Ok.', passos: Array.from({ length: 8 }, (_, i) => passo(`Passo ${i}.`)) })!;
    expect(e.passos).toHaveLength(6);
  });
  test('ideia fica nas 2 primeiras frases', () => {
    const e = validarExplicacao({ ideia: 'A planta precisa de energia. Carboidrato é energia. Sem ele, ela morre. E mais.', passos: [passo('x.')] })!;
    expect(e.ideia).toBe('A planta precisa de energia. Carboidrato é energia.');
  });
  test('decimal e fórmula não contam como fim de frase', () => {
    const e = validarExplicacao({ ideia: 'A massa é 0.5 kg e $v = 2.5$ m/s. Pronto.', passos: [passo('x.')] })!;
    expect(e.ideia).toBe('A massa é 0,5 kg e $v = 2.5$ m/s. Pronto.');
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
    // Em Física o desenho de palavra sai; sem outro desenho, entra a tabela de reserva.
    expect(validarExplicacao(bruto, 'Física')!.passos[0].visual?.tipo).toBe('tabela');
    expect(validarExplicacao(bruto, 'Português')!.passos[0].visual).not.toBeNull();
  });

  test('texto longo é cortado no fim de uma frase, nunca no meio da palavra', () => {
    const longo = 'Frase curta. ' + 'palavra '.repeat(150) + 'fim.';
    const e = validarExplicacao({ ideia: 'Ok.', passos: [passo(longo)] })!;
    expect(e.passos[0].texto).toBe('Frase curta.');
  });
});
test('explicação já validada continua igual ao ser validada de novo (cache)', () => {
  const bruto = { ideia: 'A energia depende da velocidade.', passos: [{ titulo: 'Conta', texto: 'Troca as letras.', visual: { tipo: 'quadro', dados: ['m = 2', 'v = 4'], formula: '$E_c = \\frac{1}{2}mv^2$', contas: ['E_c = \\frac{1}{2} \\cdot 2 \\cdot 4^2'], resultado: 'E_c = 16\\,\\text{J}' } }] };
  const uma = validarExplicacao(bruto, 'Física');
  expect(uma).not.toBeNull();
  expect(validarExplicacao(uma, 'Física')).toEqual(uma);
});
test('passo com integral ou derivada sai da explicação de questão do ENEM (foto de 15/10/2026)', () => {
  const r = validarExplicacao({ ideia: 'Energia cinética depende da massa e da velocidade.', passos: [
    { titulo: 'A fórmula', texto: 'A energia é $\\frac{1}{2}mv^2$.' },
    { titulo: 'De onde vem', texto: 'Integrando.', visual: { tipo: 'transformacao', linhas: [{ latex: 'W = \\int F\\,dx' }, { latex: 'a = \\frac{dv}{dt}' }] } },
    { titulo: 'Derivada', texto: 'Use $\\frac{dv}{dt}$.' },
  ] }, 'Física');
  expect(r?.passos.map((p) => p.titulo)).toEqual(['A fórmula']);
});
test('decimal com ponto vira vírgula fora da fórmula; milhar e fórmula ficam', () => {
  const r = validarExplicacao({ ideia: 'Três pilhas dão 10.8 V e custam 1.000 reais, $x = 0.5$.', passos: [{ titulo: 'Conta', texto: 'Ok.' }] });
  expect(r?.ideia).toBe('Três pilhas dão 10,8 V e custam 1.000 reais, $x = 0.5$.');
});
test('"seu erro" que chuta ou traz fórmula sem $ não vai para a tela (jornada de 18/10/2026)', () => {
  const com = (seuErro: string) => validarExplicacao({ ideia: 'Só a altura conta.', passos: [{ titulo: 'Conta', texto: 'Ok.' }], seuErro })?.seuErro;
  expect(com('Provavelmente calculou 60% de 30 como 10.')).toBeNull();
  expect(com('Deu $\\sqrt{8} \\approx 2,8$, arredondado para 2 s.')).toBeNull();
  expect(com('Assim calculou 4\\,\\text{mol H}_2\\times\\frac{1}{2}=2.')).toBeNull();
  expect(com('Você fez $20 \\div 10 = 2$: usou a velocidade para o lado como se fosse para baixo.')).toBe('Você fez $20 \\div 10 = 2$: usou a velocidade para o lado como se fosse para baixo.');
});
test('"60\\%" fora da fórmula vira "60%" (jornada de 18/10/2026)', () => {
  const r = validarExplicacao({ ideia: 'Use 60\\% de 30, e $60\\%$ fica.', passos: [{ titulo: 'Conta', texto: 'Ok.' }] });
  expect(r?.ideia).toBe('Use 60% de 30, e $60\\%$ fica.');
});
test('peça com a explicação no termo: o parêntese vai para o significado (testar-tutor, 21/10/2026)', () => {
  const r = validarExplicacao({
    ideia: 'Polímero condutor tem duplas alternadas.',
    pecas: [{
      termo: 'conjugação (alternância de ligações simples e duplas ao longo da cadeia)',
      significado: 'exemplo: cadeia C=C–C=C–C tem conjugação',
    }],
    passos: [{ titulo: 'Olhe a cadeia', texto: 'Ok.' }],
  });
  expect(r?.pecas[0]).toEqual({
    termo: 'conjugação',
    significado: 'Alternância de ligações simples e duplas ao longo da cadeia. exemplo: cadeia C=C–C=C–C tem conjugação',
  });
});
test('peça com termo normal e parêntese curto fica como está', () => {
  const r = validarExplicacao({
    ideia: 'Ideia.',
    pecas: [{ termo: 'Δv', significado: 'quanto a velocidade mudou' }, { termo: 'pH (acidez)', significado: 'mede o quão ácido é' }],
    passos: [{ titulo: 'Passo', texto: 'Ok.' }],
  });
  expect(r?.pecas.map((p) => p.termo)).toEqual(['Δv', 'pH (acidez)']);
});
test('hífen especial da IA (U+2011) vira hífen comum: a fonte não tem o desenho dele (21/10/2026)', () => {
  const r = validarExplicacao({ ideia: 'As tensões somam‑se em série.', passos: [{ titulo: 'Ponta‐a‐ponta', texto: 'Calcula‑se assim.' }] });
  expect(r?.ideia).toBe('As tensões somam-se em série.');
  expect(r?.passos[0]).toMatchObject({ titulo: 'Ponta-a-ponta', texto: 'Calcula-se assim.' });
});
test('cena e fatias saem da explicação da questão: são das lições de Cálculo (21/10/2026)', () => {
  const r = validarExplicacao({
    ideia: 'Ideia.',
    passos: [
      { titulo: 'Cena', texto: 'Ok.', visual: { tipo: 'cena', x: [0, 3], veiculos: [{ veiculo: 'bola', expr: '45-5*x^2' }] } },
      { titulo: 'Tabela', texto: 'Ok.', visual: { tipo: 'tabela', cabecalho: ['a', 'b'], linhas: [['1', '2']] } },
    ],
  }, 'Física');
  // A cena sai; o primeiro passo fica sem desenho e recebe a tabela de reserva.
  expect(r?.passos[0].visual).toMatchObject({ tipo: 'tabela', cabecalho: ['Passo', 'O que fazer'] });
  expect(r?.passos[1].visual?.tipo).toBe('tabela');
});
describe('palavra chula (testar-tutor, 21/10/2026: "passarinho come fruta e caga a semente longe")', () => {
  test('"caga" vira "solta", e a frase fica', () => {
    const r = validarExplicacao({ ideia: 'O passarinho come a fruta e caga a semente longe.', passos: [{ titulo: 'Passo', texto: 'Ele cagou ali.' }] });
    expect(r?.ideia).toBe('O passarinho come a fruta e solta a semente longe.');
    expect(r?.passos[0].texto).toBe('Ele soltou ali.');
  });
  test('frase com palavrão sai; o símbolo do cobre (Cu) fica', () => {
    const r = validarExplicacao({ ideia: 'Que merda de conta. O cobre é Cu.', passos: [{ titulo: 'Cu e Zn', texto: 'O Cu perde elétrons.' }] });
    expect(r?.ideia).toBe('O cobre é Cu.');
    expect(r?.passos[0]).toMatchObject({ titulo: 'Cu e Zn', texto: 'O Cu perde elétrons.' });
  });
  test('vale na conversa com o tutor', () => {
    expect(validarRespostaTutor({ resposta: 'O bicho caga a semente. Entendeu?' })?.resposta).toBe('O bicho solta a semente. Entendeu?');
  });
});
describe('explicação sem nenhum desenho ganha uma tabela (Pablo, 21/10/2026: "não pode falhar")', () => {
  test('com peças: tabela termo × o que é, no primeiro passo', () => {
    const r = validarExplicacao({
      ideia: 'Ideia.',
      pecas: [{ termo: 'ácido etanoico', significado: 'Ácido com dois carbonos. Dá o cheiro de vinagre.' }, { termo: 'saturada', significado: 'Só ligações simples.' }],
      passos: [{ titulo: 'Passo 1', texto: 'Ok.' }, { titulo: 'Passo 2', texto: 'Ok.' }],
    });
    expect(r?.passos[0].visual).toEqual({
      tipo: 'tabela', titulo: undefined, cabecalho: ['Termo', 'O que é'],
      linhas: [['ácido etanoico', 'Ácido com dois carbonos.'], ['saturada', 'Só ligações simples.']],
    });
    expect(r?.passos[1].visual).toBeNull();
  });
  test('sem peças: tabela com os passos', () => {
    const r = validarExplicacao({ ideia: 'Ideia.', passos: [{ titulo: 'Ache o grupo', texto: 'Procure CH3COO. Depois confira.' }] });
    expect(r?.passos[0].visual).toMatchObject({ tipo: 'tabela', cabecalho: ['Passo', 'O que fazer'], linhas: [['Ache o grupo', 'Procure CH3COO.']] });
  });
  test('primeiro passo sem desenho ganha a tabela mesmo se outro passo tiver (genética, 21/10/2026)', () => {
    const r = validarExplicacao({
      ideia: 'Ideia.',
      pecas: [{ termo: 'portador', significado: 'Tem uma cópia mutada.' }],
      passos: [{ titulo: 'P1', texto: 'Ok.' }, { titulo: 'P2', texto: 'Ok.', visual: { tipo: 'tabela', cabecalho: ['x', 'y'], linhas: [['1', '2']] } }],
    });
    expect(r?.passos[0].visual).toMatchObject({ tipo: 'tabela', cabecalho: ['Termo', 'O que é'] });
    expect(r?.passos[1].visual).toMatchObject({ cabecalho: ['x', 'y'] });
  });
  test('primeiro passo com desenho: nada muda', () => {
    const tabela = { tipo: 'tabela', cabecalho: ['x', 'y'], linhas: [['1', '2']] };
    const r = validarExplicacao({ ideia: 'Ideia.', pecas: [{ termo: 'a', significado: 'b' }], passos: [{ titulo: 'P1', texto: 'Ok.', visual: tabela }] });
    expect(r?.passos[0].visual).toMatchObject({ cabecalho: ['x', 'y'] });
  });
});

test('semPalavraChula e temPalavrao: os outros textos da IA (conceito, flashcard, lição, questão gerada)', () => {
  expect(semPalavraChula('A ave caga a semente. Ela germina.')).toBe('A ave solta a semente. Ela germina.');
  expect(semPalavraChula('Que porra é essa. O $Cu$ oxida.')).toBe('O $Cu$ oxida.');
  expect(semPalavraChula('Texto limpo, sem nada.')).toBe('Texto limpo, sem nada.');
  expect(temPalavrao('Uma merda de reação')).toBe(true);
  expect(temPalavrao('O Cu e a cachaça')).toBe(false);
});

test('termo em inglês que escapa vira português', () => {
  const r = validarExplicacao({ ideia: 'O endosperm alimenta o embrião.', passos: [{ titulo: 'Genotype', texto: 'Cada pai tem genotype Aa.' }] });
  expect(r?.ideia).toBe('O endosperma alimenta o embrião.');
  expect(r?.passos[0]).toMatchObject({ titulo: 'genótipo', texto: 'Cada pai tem genótipo Aa.' });
});

test('"sua vez" com opções guarda opções e a certa', () => {
  const r = validarExplicacao({ ideia: 'Ok.', passos: [{ titulo: 'A', texto: 'B.' }],
    checagem: { pergunta: 'Em que dia é o topo?', resposta: 'Dia 3.', opcoes: ['Dia 2', 'Dia 3', 'Dia 6'], certa: 'Dia 3' } });
  expect(r?.checagem).toMatchObject({ opcoes: ['Dia 2', 'Dia 3', 'Dia 6'], certa: 'Dia 3' });
});
test('"sua vez" com a certa fora das opções fica só com pergunta e resposta', () => {
  const r = validarExplicacao({ ideia: 'Ok.', passos: [{ titulo: 'A', texto: 'B.' }],
    checagem: { pergunta: 'Em que dia?', resposta: 'Dia 3.', opcoes: ['Dia 2', 'Dia 6'], certa: 'Dia 3' } });
  expect(r?.checagem).toEqual({ pergunta: 'Em que dia?', resposta: 'Dia 3.' });
});
