// Ajuda enquanto escreve: onde o aluno está (código) e o que passa da IA.
import { describe, expect, test } from 'vitest';
import { frasesDoTexto, juntarComeco, ondeEstou } from './onde-estou';
import { lerPedidoAjuda, promptAjuda, validarAjuda, type PedidoAjuda } from './ajuda';

const pedido = (parcial: Partial<PedidoAjuda> = {}): PedidoAjuda => ({
  tema: 'O estigma associado às doenças mentais na sociedade brasileira',
  paragrafo: 'desenvolvimento1',
  texto: '',
  tese: '',
  causaA: 'acesso',
  causaB: 'estigma',
  pergunta: '',
  ...parcial,
});

describe('onde o aluno está', () => {
  test('texto vazio: frase 1', () => {
    expect(ondeEstou('', 'desenvolvimento1', 4)).toEqual({ atual: 0, total: 4, completas: 0, escrevendo: false });
  });
  test('frase sem ponto é a que ele está escrevendo', () => {
    const onde = ondeEstou('Em primeiro lugar, cabe destacar. Nesse sentido, Bourdieu', 'desenvolvimento1', 4);
    expect(onde).toMatchObject({ atual: 1, completas: 1, escrevendo: true });
  });
  test('introdução: só 2 frases para escrever (a tese entra sozinha)', () => {
    expect(ondeEstou('Um. Dois. Três.', 'introducao', 3)).toMatchObject({ atual: 2, total: 2 });
  });
  test('aspas e reticências fecham a frase', () => {
    expect(frasesDoTexto('Ele disse "basta." Depois…').completas).toHaveLength(2);
  });
});

describe('usar o começo sugerido', () => {
  test('não repete o pedaço que ele já escreveu', () => {
    expect(juntarComeco('Frase um.\nNesse sentido,', 'Nesse sentido, Bourdieu mostra que')).toBe('Frase um.\nNesse sentido, Bourdieu mostra que ');
  });
  test('texto que termina em ponto: o começo vem depois', () => {
    expect(juntarComeco('Frase um.', 'Nesse sentido...')).toBe('Frase um. Nesse sentido ');
  });
  test('pedaço diferente fica e o começo vem depois', () => {
    expect(juntarComeco('Além', 'Nesse sentido,')).toBe('Além Nesse sentido, ');
  });
});
describe('pedido vindo do navegador', () => {
  test('parágrafo e tema inválidos são recusados', () => {
    expect(lerPedidoAjuda({ tema: 'x', paragrafo: 'outro' })).toBeNull();
    expect(lerPedidoAjuda({ tema: '  ', paragrafo: 'conclusao' })).toBeNull();
  });
  test('motivo desconhecido vira null e texto é cortado', () => {
    const p = lerPedidoAjuda({ tema: 'T', paragrafo: 'conclusao', causaA: 'hack', texto: 'a'.repeat(9000) });
    expect(p?.causaA).toBeNull();
    expect(p?.texto.length).toBe(3000);
  });
});

describe('prompt', () => {
  test('diz a frase em que ele está e traz a ficha dos autores do motivo', () => {
    const p = promptAjuda(pedido({ texto: 'Em primeiro lugar, cabe destacar a desigualdade.' }));
    expect(p).toContain('frase 2 de 4: "Repertório do eixo"');
    expect(p).toContain('Bourdieu');
    expect(p).not.toContain('Goffman');
  });
});

describe('validador', () => {
  const caminho = { comeco: 'Nesse sentido, Bourdieu mostra que', completar: 'a ideia dele com as suas palavras' };
  test('aceita a resposta no formato', () => {
    const r = validarAjuda({ proximaAcao: 'Escreva a frase do repertório.', caminhos: [caminho], sobreOTexto: 'x', resposta: 'y' }, pedido());
    expect(r?.caminhos).toHaveLength(1);
    expect(r?.sobreOTexto).toBe('');
    expect(r?.resposta).toBe('');
  });
  test('corta começo longo: a IA não escreve a frase inteira', () => {
    const longo = 'Nesse sentido o sociólogo Pierre Bourdieu mostra que o capital cultural separa quem pode pagar de quem não pode no Brasil';
    const r = validarAjuda({ proximaAcao: 'Faça.', caminhos: [{ comeco: longo, completar: 'x' }] }, pedido());
    expect(r!.caminhos[0].comeco.split(' ')).toHaveLength(14);
    expect(r!.caminhos[0].comeco.endsWith('...')).toBe(true);
  });
  test('descarta caminho com número inventado e tira elogio', () => {
    const r = validarAjuda({
      proximaAcao: 'Ótimo! Agora escreva o repertório.',
      caminhos: [{ comeco: 'Segundo o IBGE, 37% dos brasileiros', completar: 'x' }, caminho],
    }, pedido());
    expect(r?.proximaAcao).toBe('Agora escreva o repertório.');
    expect(r?.caminhos).toEqual([caminho]);
  });
  test('número que o aluno escreveu ou o ano da ficha vale', () => {
    const r = validarAjuda({ proximaAcao: 'Faça.', caminhos: [{ comeco: 'Como mostram os 25% citados', completar: 'Bourdieu em 1970' }] }, pedido({ texto: 'São 25% da população.' }));
    expect(r?.caminhos).toHaveLength(1);
  });
  test('sem nenhum caminho válido, recusa (pedirJson tenta de novo)', () => {
    expect(validarAjuda({ proximaAcao: 'Faça.', caminhos: [] }, pedido())).toBeNull();
  });
});
