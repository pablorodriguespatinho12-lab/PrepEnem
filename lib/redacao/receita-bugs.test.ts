// Um teste por bug medido no preview do Treino por partes (Pablo, 28/10/2026).
import { describe, expect, test } from 'vitest';
import {
  CAUSAS, introducaoComTese, montarRedacao, moldeDaFrase, motivosQueCombinamPouco,
  PARAGRAFOS, problemaCompleto, type ChaveCausa,
} from './receita';
import { CONTEUDO_TEMAS, conteudoDoTema } from './conteudo-temas';
import { EXEMPLO_TEMA } from './exemplo-receita';
import {
  atualizarTese, CHAVE_RASCUNHO, lerRascunho, rascunhoVazio, sincronizarTese, teseDesatualizada, type Rascunho,
} from './rascunho-receita';

const comMotivos = (r: Rascunho, causaA: ChaveCausa | null, causaB: ChaveCausa | null) => sincronizarTese({ ...r, causaA, causaB });
const base = (): Rascunho => comMotivos({ ...rascunhoVazio(), tema: EXEMPLO_TEMA }, 'mercado', 'historia');

describe('bug 1: trocar motivos atualiza a tese', () => {
  test('tese ainda automática é regerada com os motivos novos', () => {
    const r = comMotivos(base(), 'estigma', 'estado');
    expect(r.tese).toContain('preconceito social que esconde quem tem transtorno mental');
    expect(r.tese).toContain('omissão do Estado');
    expect(r.tese).not.toContain('produtividade');
    expect(teseDesatualizada(r)).toBe(false);
  });
  test('tese editada pelo aluno nunca é sobrescrita: aparece o aviso, e o botão atualiza', () => {
    const editada = { ...base(), tese: 'Minha tese sobre mercado e herança.' };
    const r = comMotivos(editada, 'estigma', 'estado');
    expect(r.tese).toBe('Minha tese sobre mercado e herança.');
    expect(teseDesatualizada(r)).toBe(true);
    const atualizada = atualizarTese(r);
    expect(atualizada.tese).toContain('omissão do Estado');
    expect(teseDesatualizada(atualizada)).toBe(false);
  });
  test('editar a tese sem mudar os motivos não mostra aviso', () => {
    expect(teseDesatualizada({ ...base(), tese: 'Outra tese.' })).toBe(false);
  });
  test('rascunho antigo (sem teseGerada) é migrado sem perder texto', () => {
    const m = new Map<string, string>();
    const arm = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); }, removeItem: (k: string) => { m.delete(k); } };
    const antigo = { passo: 4, tema: EXEMPLO_TEMA, causaA: 'estigma', causaB: 'estado', tese: 'Tese que eu escrevi.', paragrafos: { introducao: 'Meu texto.' } };
    arm.setItem(CHAVE_RASCUNHO, JSON.stringify(antigo));
    const r = lerRascunho(arm);
    expect(r.tese).toBe('Tese que eu escrevi.');
    expect(r.paragrafos.introducao).toBe('Meu texto.');
    expect(teseDesatualizada(r)).toBe(false);
    /* Tese antiga que era o molde de antes (tema inteiro) vira a de agora. */
    const moldeVelho = 'O estigma associado às doenças mentais na sociedade brasileira decorre, sobretudo, do estigma social que torna esse grupo invisível e da negligência estatal na garantia de direitos já previstos em lei.';
    arm.setItem(CHAVE_RASCUNHO, JSON.stringify({ ...antigo, tese: moldeVelho }));
    expect(lerRascunho(arm).tese.startsWith('Esse estigma decorre')).toBe(true);
  });
});

describe('bug 2: motivo que combina pouco com o tema', () => {
  test('avisa só os motivos marcados como fracos para o tema', () => {
    expect(motivosQueCombinamPouco(EXEMPLO_TEMA, 'mercado', 'estado')).toEqual(['mercado']);
    expect(motivosQueCombinamPouco(EXEMPLO_TEMA, 'estigma', 'estado')).toEqual([]);
  });
  test('tema livre não tem aviso (não há como saber)', () => {
    expect(motivosQueCombinamPouco('A obesidade infantil no Brasil', 'mercado', 'historia')).toEqual([]);
  });
  test('nenhum tema marca como fraco um dos seus motivos sugeridos', () => {
    for (const c of CONTEUDO_TEMAS) for (const s of c.causas) expect(c.combinaPouco, `${c.ano}`).not.toContain(s);
  });
});

describe('bug 3: tópico frasal não é circular quando o motivo repete o tema', () => {
  test('tema estigma + motivo Estigma usa a frase escrita à mão', () => {
    const frase = moldeDaFrase('desenvolvimento1', 0, EXEMPLO_TEMA, 'estigma', 'estado');
    expect(frase).toBe('Em primeiro lugar, cabe destacar o preconceito social que esconde quem tem transtorno mental como fator central do estigma.');
    expect(frase).not.toMatch(/estigma .*fator central do estigma/);
  });
  test('todo tema da receita tem tópico escrito para os 5 motivos, sem repetir a forma curta', () => {
    for (const c of CONTEUDO_TEMAS) {
      for (const causa of CAUSAS) {
        const t = c.topico[causa.chave];
        expect(t.length, `${c.ano} ${causa.chave}`).toBeGreaterThan(15);
        expect(t.includes(c.formaCurta), `${c.ano} ${causa.chave}`).toBe(false);
      }
    }
  });
});

describe('bug 4: a frase inteira do tema só aparece uma vez', () => {
  test('nos moldes da redação inteira, o tema completo aparece só na ponte da introdução', () => {
    for (const c of CONTEUDO_TEMAS) {
      const completo = problemaCompleto(c.tema);
      const moldes = PARAGRAFOS.flatMap((p) => p.frases.map((_, i) => moldeDaFrase(p.chave, i, c.tema, c.causas[0], c.causas[1])));
      const vezes = moldes.join(' ').split(completo).length - 1;
      expect(vezes, `${c.ano}`).toBe(1);
      expect(moldes[1]).toContain(completo);
    }
  });
  test('depois da 1ª vez, vem a forma curta do tema', () => {
    expect(moldeDaFrase('desenvolvimento1', 3, EXEMPLO_TEMA, 'estigma', 'estado')).toContain('mantém o estigma.');
    expect(moldeDaFrase('introducao', 2, EXEMPLO_TEMA, 'estigma', 'estado').startsWith('Esse estigma decorre')).toBe(true);
  });
});

describe('bug 5: a tese entra sozinha como 3ª frase da introdução', () => {
  const tese = 'Esse estigma decorre, sobretudo, de A e de B.';
  test('a introdução montada termina com a tese', () => {
    expect(introducaoComTese('Frase 1. Frase 2.', tese)).toBe(`Frase 1. Frase 2. ${tese}`);
  });
  test('rascunho antigo que já tinha a tese no texto não a ganha duas vezes', () => {
    expect(introducaoComTese(`Frase 1. ${tese}`, tese)).toBe(`Frase 1. ${tese}`);
  });
  test('a redação montada traz a tese na introdução', () => {
    const texto = montarRedacao({ introducao: 'Frase 1.', desenvolvimento1: 'D1.', desenvolvimento2: '', conclusao: '' }, tese);
    expect(texto).toBe(`Frase 1. ${tese}\n\nD1.`);
  });
});

describe('bug 6: Estado com maiúscula no molde', () => {
  test('tema livre: [omissão do Estado], nunca [omissão do estado]', () => {
    const frase = moldeDaFrase('desenvolvimento2', 0, 'A obesidade infantil no Brasil', 'historia', 'estado');
    expect(frase).toContain('[omissão do Estado]');
    expect(frase).not.toContain('estado]');
  });
  test('tema da receita: o tópico escrito à mão também diz Estado', () => {
    expect(moldeDaFrase('desenvolvimento2', 0, EXEMPLO_TEMA, 'estigma', 'estado')).toContain('omissão do Estado');
  });
});

describe('conteúdo por tema', () => {
  test('acha o tema pelo texto, sem diferenciar maiúsculas e espaços', () => {
    expect(conteudoDoTema('  o ESTIGMA associado às   doenças mentais na sociedade brasileira ')?.ano).toBe(2020);
    expect(conteudoDoTema('Tema inventado')).toBeNull();
  });
  test('perguntas-guia curtas, sem emoji, para todo motivo', () => {
    for (const c of CONTEUDO_TEMAS) {
      const todas = [...Object.values(c.perguntas.motivo), ...c.perguntas.introducao, ...c.perguntas.conclusao];
      expect(Object.keys(c.perguntas.motivo).sort()).toEqual(CAUSAS.map((x) => x.chave).sort());
      for (const p of todas) {
        expect(p.endsWith('?'), p).toBe(true);
        expect(p.length, p).toBeLessThanOrEqual(80);
        expect(/\p{Extended_Pictographic}/u.test(p)).toBe(false);
      }
    }
  });
});
