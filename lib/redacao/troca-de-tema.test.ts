// Um teste por bug que o Pablo achou trocando de tema no meio (29/10/2026).
import { describe, expect, test } from 'vitest';
import {
  CAUSAS, moldeDaFrase, moldeTese, motivoNoTema, motivosQueCombinamPouco, PARAGRAFOS, type ChaveCausa,
} from './receita';
import { CONTEUDO_TEMAS, conteudoDoTema } from './conteudo-temas';
import { lerRascunho, rascunhoVazio, teseAutomatica, teseDesatualizada, trocarTema, type Rascunho } from './rascunho-receita';

const T2023 = 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil';
const T2019 = 'Democratização do acesso ao cinema no Brasil';
const T2021 = 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil';
const LIVRE = 'A mobilidade urbana nas grandes cidades';
const LISTA = CONTEUDO_TEMAS.map((c) => c.tema);

/* Como o site deixa o rascunho depois do passo 2: motivos e tese automáticos. */
function noPasso2(tema: string, causaA: ChaveCausa, causaB: ChaveCausa): Rascunho {
  const r = { ...rascunhoVazio(), passo: 1, tema, causaA, causaB };
  const tese = teseAutomatica(r);
  return { ...r, tese, teseGerada: tese };
}

describe('bug 1: trocar de tema no passo 1', () => {
  test('motivos sugeridos do tema antigo viram os sugeridos do novo, e a tese acompanha', () => {
    const r = trocarTema(noPasso2(T2023, 'estigma', 'historia'), T2019, LISTA);
    expect([r.causaA, r.causaB]).toEqual(['acesso', 'mercado']);
    expect(r.tese).toBe(moldeTese('acesso', 'mercado', T2019));
    expect(motivosQueCombinamPouco(T2019, r.causaA, r.causaB)).toEqual([]);
  });
  test('para tema livre, os sugeridos saem (o aluno escolhe) e a tese esvazia', () => {
    const r = trocarTema(noPasso2(T2019, 'acesso', 'mercado'), LIVRE, LISTA);
    expect([r.causaA, r.causaB]).toEqual([null, null]);
    expect(r.tese).toBe('');
  });
  test('motivos escolhidos à mão ficam, e o aviso "combina pouco" aparece', () => {
    const r = trocarTema(noPasso2(T2023, 'estigma', 'mercado'), T2019, LISTA);
    expect([r.causaA, r.causaB]).toEqual(['estigma', 'mercado']);
    expect(motivosQueCombinamPouco(T2019, r.causaA, r.causaB)).toEqual(['estigma']);
    expect(r.tese).toBe(moldeTese('estigma', 'mercado', T2019));
  });
  test('tese editada pelo aluno fica, e a tela pergunta se atualiza', () => {
    const editada = { ...noPasso2(T2023, 'estigma', 'mercado'), tese: 'Minha tese.' };
    const r = trocarTema(editada, T2019, LISTA);
    expect(r.tese).toBe('Minha tese.');
    expect(teseDesatualizada(r)).toBe(true);
  });
  test('digitar o tema letra a letra não apaga motivos escolhidos à mão', () => {
    let r = noPasso2(LIVRE, 'estado', 'acesso');
    for (const tema of ['A', 'A mo', 'A mobilidade']) r = trocarTema(r, tema, LISTA);
    expect([r.causaA, r.causaB]).toEqual(['estado', 'acesso']);
  });
});

describe('bug 2: frase genérica do motivo não depende do sujeito do tema', () => {
  test('nenhuma frase de tese fala de "esse grupo"', () => {
    for (const c of CAUSAS) {
      expect(c.naTese, c.chave).not.toMatch(/\b(esse|essa|desse|dessa|deste|desta)\s+grupo/i);
      expect(c.fraseDeTese, c.chave).not.toMatch(/\b(esse|essa|desse|dessa|deste|desta)\s+grupo/i);
    }
  });
});

describe('bug 3: Brasil uma vez só na ponte', () => {
  test('tema que termina em "no Brasil" perde o "no Brasil" na frase 2', () => {
    for (const tema of [...LISTA, 'A obesidade infantil no Brasil', LIVRE]) {
      const ponte = moldeDaFrase('introducao', 1, tema, null, null);
      expect(ponte.match(/Brasil|brasileira/g)?.length, tema).toBe(1);
    }
    expect(moldeDaFrase('introducao', 1, T2019, null, null))
      .toBe('Essa reflexão se aplica ao Brasil contemporâneo, onde o acesso desigual ao cinema ainda persiste.');
  });
});

describe('bug 4: vírgula que fecha o aposto do motivo', () => {
  test('2021: "como a população de rua," quando a frase continua', () => {
    expect(moldeDaFrase('desenvolvimento2', 0, T2021, 'estado', 'estigma'))
      .toBe('Além disso, a invisibilidade social de quem vive à margem, como a população de rua, também contribui para a falta de registro civil.');
    expect(moldeTese('estigma', 'estado', T2021))
      .toBe('Essa falta de registro civil decorre, sobretudo, da invisibilidade social de quem vive à margem, como a população de rua, e da omissão do Estado em levar o cartório a quem mora longe.');
  });
  test('em todo tema, par de motivos e frase: motivo com vírgula é seguido de vírgula ou ponto', () => {
    const temas = [...LISTA, LIVRE];
    for (const tema of temas) {
      for (const a of CAUSAS) {
        for (const b of CAUSAS) {
          if (a === b) continue;
          const frases = [moldeTese(a.chave, b.chave, tema), ...PARAGRAFOS.flatMap((p) => p.frases.map((_, i) => moldeDaFrase(p.chave, i, tema, a.chave, b.chave)))];
          const motivos = conteudoDoTema(tema) ? [motivoNoTema(a.chave, tema, ''), motivoNoTema(b.chave, tema, '')] : [a.naTese, b.naTese];
          for (const frase of frases) {
            for (const m of motivos.filter((x) => x.includes(','))) {
              const resto = frase.split(m).slice(1);
              for (const depois of resto) expect(depois, `${tema} | ${frase}`).toMatch(/^[.,]/);
            }
          }
        }
      }
    }
  });
});

describe('bug 5: molde aberto na 1ª visita de cada passo', () => {
  test('rascunho começa sem nenhum molde visto, e o antigo também', () => {
    expect(rascunhoVazio().moldesVistos).toEqual([]);
    const arm = { getItem: () => JSON.stringify({ passo: 5, tema: T2019 }), setItem: () => {}, removeItem: () => {} };
    expect(lerRascunho(arm).moldesVistos).toEqual([]);
  });
});
