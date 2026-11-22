// Fichas de questões de GRANDEZAS no jeito do Pablo (22/11/2026: "já deixa ela montada direto"):
// tabela antes/agora + equação em frações. O gerador é lib/aula-lousa/regra-de-tres.ts; o modelo
// aprovado é data/lousas/costureiras.ts. Cada ficha só diz as colunas, o x e as telas de texto
// (simplificar, achar x, conferir por outro caminho, por que as outras letras erram).
// Contas conferidas em regra-de-tres.test.ts (x pela proporção) e à mão nas letras erradas.
import type { FichaRT } from '@/lib/aula-lousa/regra-de-tres';

/** 1500000 → "1 500 000". */
const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const FICHAS_REGRA_DE_TRES: readonly FichaRT[] = [
  {
    id: 'd2-dificil-mat-06',
    colunas: [
      { nome: 'costureiras', rotulo: 'as costureiras', cor: 'azul', antes: '8', agora: '10', relacao: 'inversa' },
      { nome: 'horas/dia', rotulo: 'as horas por dia', cor: 'rosa', antes: '6', agora: '8', relacao: 'inversa' },
      { nome: 'camisetas', rotulo: 'as camisetas', cor: 'vermelho', antes: '240', agora: '480', relacao: 'direta' },
      { nome: 'dias', rotulo: 'o número de dias', cor: 'verde', antes: '5', agora: 'x', relacao: 'incognita' },
    ],
    antesAgora: ['8 costureiras, 6 horas por dia, 240 camisetas, 5 dias', '10 costureiras, 8 horas por dia, 480 camisetas, x dias'],
    resposta: 6,
    telas: [
      { titulo: 'juntando as frações', itens: [['4/5 × 3/4 = 12/20', 'tinta', 26], ['12/20 = 3/5 (÷ 4)', 'tinta', 26], ['fica: 3/5 × 5/x = 1/2', 'verde', 26]], fala: ['Multiplicando as duas primeiras: 4 × 3 = 12 e 5 × 4 = 20, dá 12 sobre 20.', 'Simplificando por 4, fica 3 sobre 5, e a equação fica 3/5 × 5/x = 1/2.'] },
      { titulo: 'achando x', itens: [['3/5 × 5/x = 1/2', 'verde', 28], ['o 5 corta com o 5', 'cinza', 20], ['3/x = 1/2', 'tinta', 32], ['cruzado: 3 × 2 = 1 × x', 'tinta', 26], ['x = 6 dias', 'verde', 34]], fala: ['Cortar é dividir o de cima e o de baixo pelo mesmo número: o 5 de baixo e o 5 de cima somem, sobra 3 sobre x igual a 1 sobre 2.', 'Multiplicar cruzado é multiplicar em X: 3 × 2 = 1 × x. Então x = 6 dias.'] },
      { titulo: 'conferindo', itens: [['8 × 6 × 5 = 240 horas de trabalho', 'tinta', 22], ['240 camisetas: 1 por hora', 'tinta', 22], ['480 camisetas pedem 480 horas', 'tinta', 22], ['10 × 8 = 80 horas por dia', 'tinta', 22], ['480 ÷ 80 = 6 dias', 'verde', 28]], fala: ['Outro jeito de conferir: some as horas de trabalho.', '8 costureiras × 6 horas × 5 dias = 240 horas, e saíram 240 camisetas: 1 por hora.', 'Para 480 camisetas, 480 horas. A equipe nova faz 10 × 8 = 80 horas por dia. 480 ÷ 80 = 6 dias.'] },
      { titulo: 'por que as outras erram', itens: [['A, 6: usou as três colunas', 'verde', 22], ['B, 7,5: esqueceu as costureiras', 'tinta', 22], ['C, 8: esqueceu as horas por dia', 'tinta', 22], ['D, 10: olhou só as camisetas', 'tinta', 22], ['E, 12,5: costureiras como direta', 'tinta', 22]], fala: ['A letra A, 6, usa as três colunas.', 'B esquece as costureiras. C esquece as horas por dia. D olha só as camisetas.', 'E trata mais costureiras como mais dias e esquece as horas.'] },
    ],
  },
  {
    id: 'd2-facil-mat-07',
    colunas: [
      { nome: 'farinha kg', rotulo: 'a farinha', cor: 'azul', antes: '2', agora: '6', relacao: 'direta' },
      { nome: 'pães', rotulo: 'o número de pães', cor: 'verde', antes: '30', agora: 'x', relacao: 'incognita' },
    ],
    antesAgora: ['2 kg de farinha fazem 30 pães', '6 kg de farinha fazem x pães'],
    resposta: 90,
    telas: [
      { titulo: 'achando x', itens: [['30/x = 1/3', 'verde', 28], ['cruzado: 30 × 3 = 1 × x', 'tinta', 26], ['x = 90 pães', 'verde', 34]], fala: ['Multiplicar cruzado é multiplicar em X: o de cima de um lado vezes o de baixo do outro. Dá 30 × 3 = 1 × x.', 'Então x = 90 pães.'] },
      { titulo: 'conferindo', itens: [['2 kg fazem 30 pães', 'tinta', 24], ['1 kg faz 30 ÷ 2 = 15 pães', 'tinta', 24], ['6 kg: 6 × 15 = 90 pães', 'verde', 26]], fala: ['Outro jeito: veja quantos pães saem de 1 kg.', '30 ÷ 2 = 15 pães por quilo. Com 6 kg: 6 × 15 = 90.'] },
      { titulo: 'por que as outras erram', itens: [['E, 90: a equação certa', 'verde', 22], ['A, 34: somou 6 − 2 = 4: 30 + 4', 'tinta', 22], ['B, 10: dividiu 30 por 3', 'tinta', 22], ['C, 60: dobrou os 30 pães', 'tinta', 22], ['D, 180: multiplicou 30 por 6', 'tinta', 22]], fala: ['A letra E, 90, vem da equação.', 'A soma 30 + 4, onde 4 é 6 − 2. B divide 30 por 3. C dobra os 30. D multiplica 30 por 6.'] },
    ],
  },
  {
    id: 'd2-medio-mat-06',
    colunas: [
      { nome: 'km/h', rotulo: 'a velocidade', cor: 'azul', antes: '60', agora: '48', relacao: 'inversa' },
      { nome: 'minutos', rotulo: 'o tempo', cor: 'verde', antes: '40', agora: 'x', relacao: 'incognita' },
    ],
    antesAgora: ['a 60 km/h, 40 minutos', 'a 48 km/h (no trânsito), x minutos'],
    resposta: 50,
    telas: [
      { titulo: 'achando x', itens: [['5/4 × 40/x = 1', 'verde', 28], ['40 ÷ 4 = 10: o 4 corta', 'tinta', 24], ['5 × 10 = 50: fica 50/x = 1', 'tinta', 24], ['50 ÷ x = 1, então x = 50', 'tinta', 24], ['x = 50 minutos', 'verde', 32]], fala: ['Cortar é dividir o de cima e o de baixo pelo mesmo número: dividindo por 4, o 40 vira 10 e o 4 some.', '5 × 10 = 50, então 50 sobre x é igual a 1. Só 50 ÷ 50 dá 1: x = 50 minutos.'] },
      { titulo: 'conferindo', itens: [['60 km/h: 60 km em 60 min', 'tinta', 22], ['em 40 min: 40 km de caminho', 'tinta', 22], ['48 km/h: 1 km leva 60 ÷ 48 = 1,25 min', 'tinta', 20], ['40 × 1,25 = 50 min', 'verde', 28]], fala: ['Outro jeito: ache o tamanho do caminho.', 'A 60 km/h anda 1 km por minuto: em 40 min são 40 km.', 'A 48 km/h cada km leva 60 ÷ 48 = 1,25 min. 40 × 1,25 = 50 min.'] },
      { titulo: 'por que as outras erram', itens: [['A, 50: a equação certa', 'verde', 22], ['B, 32: como direta, 40 × 48 ÷ 60', 'tinta', 22], ['C, 28: tirou 12 (60 − 48)', 'tinta', 22], ['D, 52: somou 12 aos 40', 'tinta', 22], ['E, 48: copiou a velocidade', 'tinta', 22]], fala: ['A letra A, 50, vem da equação.', 'B trata como direta. C tira 12 e D soma 12, a diferença das velocidades. E copia os 48 km/h.'] },
    ],
  },
  ...[
    { id: 'd2-medio-mat-07', real: 50000, mapa: 6, letra: 'E', erros: ['B, 6 km: 1 cm virou 1 km', 'D, 30 km: um zero a mais', 'A, 0,3 km: um zero a menos', 'C, 0,6 km: 1 cm virou 100 m'] },
    { id: 'd2-reforco-mat-gra-01', real: 200000, mapa: 7, letra: 'D', erros: ['B, 140 km: um zero a mais', 'C, 1 400 km: dois zeros a mais', 'A, 1,4 km: um zero a menos', 'E, 0,14 km: dois zeros a menos'] },
  ].map(({ id, real, mapa, letra, erros }): FichaRT => {
    const x = real * mapa; // cm na rua
    const metrosDe1cm = real / 100;
    const metros = x / 100;
    const km = metros / 1000;
    const [R, X, M1, M, KM] = [fmt(real), fmt(x), fmt(metrosDe1cm), fmt(metros), String(km)];
    const conferindo = [`1 cm no mapa = ${R} cm`, `${R} cm ÷ 100 = ${M1} m`, `${mapa} cm: ${mapa} × ${M1} = ${M} m`, `${M} m = ${KM} km`];
    return {
      id,
      colunas: [
        { nome: 'cm no mapa', rotulo: 'o tamanho no mapa', cor: 'azul', antes: '1', agora: String(mapa), relacao: 'direta' },
        { nome: 'cm real', rotulo: 'o tamanho real', cor: 'verde', antes: R, agora: 'x', relacao: 'incognita' },
      ],
      antesAgora: [`a escala 1 : ${R}: 1 cm do mapa vale ${R} cm reais`, `${mapa} cm no mapa valem x cm reais`],
      resposta: x,
      telas: [
        { titulo: 'achando x', itens: [[`${R}/x = 1/${mapa}`, 'verde', 28], [`cruzado: ${R} × ${mapa} = 1 × x`, 'tinta', 24], [`x = ${X} cm`, 'verde', 30]], fala: [`Multiplicar cruzado é multiplicar em X: o de cima de um lado vezes o de baixo do outro. Dá ${R} × ${mapa} = 1 × x.`, `Então x = ${X} cm reais.`] },
        { titulo: 'de cm para km', itens: [[`${X} cm reais`, 'tinta', 24], [`100 cm = 1 m: ÷ 100 = ${M} m`, 'tinta', 22], [`1 000 m = 1 km: ÷ 1 000 = ${KM} km`, 'tinta', 22], [`resposta: ${KM} km (letra ${letra})`, 'verde', 26]], fala: ['A tabela está em centímetros, e a questão quer quilômetros.', `${X} cm ÷ 100 = ${M} m. E ${M} m ÷ 1 000 = ${KM} km.`] },
        { titulo: 'conferindo', itens: conferindo.map((s, i): [string, 'tinta' | 'verde', number] => [s, i === conferindo.length - 1 ? 'verde' : 'tinta', 22]), fala: ['Outro jeito: veja quanto vale 1 cm do mapa.', `1 cm do mapa são ${R} cm reais, que dão ${M1} m.`, `${mapa} cm do mapa: ${mapa} × ${M1} = ${M} m, ou seja, ${KM} km.`] },
        { titulo: 'por que as outras erram', itens: [[`${letra}, ${KM} km: a equação certa`, 'verde', 22], ...erros.map((s): [string, 'tinta', number] => [s, 'tinta', 22])], fala: [`A letra ${letra}, ${KM} km, vem da equação.`, `As outras erram a conversão: sobram ou faltam zeros${id === 'd2-medio-mat-07' ? ', ou 1 cm vira 1 km' : ''}.`] },
      ],
    };
  }),
  {
    id: 'd2-reforco-mat-gra-02',
    colunas: [
      { nome: 'torneiras', rotulo: 'o número de torneiras', cor: 'azul', antes: '4', agora: '3', relacao: 'inversa' },
      { nome: 'horas', rotulo: 'o tempo', cor: 'verde', antes: '6', agora: 'x', relacao: 'incognita' },
    ],
    antesAgora: ['4 torneiras enchem o tanque em 6 horas', '3 torneiras enchem o tanque em x horas'],
    resposta: 8,
    telas: [
      { titulo: 'achando x', itens: [['4/3 × 6/x = 1', 'verde', 28], ['6 ÷ 3 = 2: o 3 corta com o 6', 'tinta', 24], ['4 × 2 = 8: fica 8/x = 1', 'tinta', 24], ['8 ÷ x = 1, então x = 8', 'tinta', 24], ['x = 8 horas', 'verde', 32]], fala: ['Cortar é dividir o de cima e o de baixo pelo mesmo número: dividindo por 3, o 6 vira 2 e o 3 some.', '4 × 2 = 8, então 8 sobre x é igual a 1. Só 8 ÷ 8 dá 1: x = 8 horas.'] },
      { titulo: 'conferindo', itens: [['4 torneiras: 6 horas', 'tinta', 24], ['1 torneira sozinha: 4 × 6 = 24 h', 'tinta', 22], ['3 torneiras: 24 ÷ 3 = 8 h', 'verde', 26]], fala: ['Outro jeito: quanto 1 torneira sozinha levaria.', 'Cada torneira faz 1 quarto do trabalho por hora, então 1 sozinha leva 4 vezes mais: 4 × 6 = 24 horas. Com 3: 24 ÷ 3 = 8 horas.'] },
      { titulo: 'por que as outras erram', itens: [['B, 8 h: a equação certa', 'verde', 22], ['A, 4,5: como direta, 6 × 3 ÷ 4', 'tinta', 22], ['C, 5 h: tirou 1 (6 − 1)', 'tinta', 22], ['D, 7 h: somou 1 (6 + 1)', 'tinta', 22], ['E, 24 h: o tempo de 1 torneira só', 'tinta', 22]], fala: ['A letra B, 8 horas, vem da equação.', 'A trata como direta. C tira 1 e D soma 1 às 6 horas. E é o tempo de uma torneira sozinha.'] },
    ],
  },
];
