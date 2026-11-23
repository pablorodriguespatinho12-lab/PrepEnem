import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { QUESTOES_COM_ANTES } from '@/lib/antes-da-questao';

/* Porteiro das regras do Pablo para questão NOVA de nível acima (Matemática e Física).
   Nasceu em 23/11/2026: ele precisou lembrar de regra que eu já tinha em memória (estilo, âncora real, canal,
   "Antes", tela curta, "operários é muito fácil", "substituir as antigas"). Regra só escrita em memória não me
   obriga a olhar; teste obriga. Lista completa e fonte de cada regra: docs/nivel-acima/regras-do-pablo.md. */

const PASTA = join(process.cwd(), 'data/revisao-final/escada');
type Passo = { titulo: string; texto: string };
type Questao = {
  id: string; tema: string; nivel: string; enunciado: string; ancora?: string; canal?: string;
  explicacao: { passos: Passo[]; conferencia: string };
};
const ler = (arq: string) => JSON.parse(readFileSync(join(PASTA, arq), 'utf8')) as Questao[];

const NOVOS = ['fisica-acima-novas.json', 'matematica-aritmetica-novas.json'];
// As 28 de Matemática dos degraus 2 a 8 vêm de antes deste porteiro: valem as regras que não dependem de campo novo.
const LEGADO = ['matematica-acima-novas.json'];
const MAX_PASSO = 300; // explicacao-curta-sem-rolar (14/11/2026)
const MIN_ENEM = 600; // nivel-acima-dificil-de-verdade: texto de prova, ENEM real ~676
const PROIBIDO_NO_ENUNCIADO = /oper[aá]rios/i; // "Nove operários... 3 saem": "muito fácil" (22 e 23/11/2026)

describe.each([...NOVOS, ...LEGADO])('nível acima novo: %s', (arq) => {
  const qs = ler(arq);
  const novo = NOVOS.includes(arq);

  it('só nível acima, id no padrão e 4 candidatas por conteúdo (a ENEM, b ITA, c Fuvest, d Harvard) ou o legado', () => {
    expect(qs.filter((q) => q.nivel !== 'acima').map((q) => q.id)).toEqual([]);
    if (!novo) return;
    const porTema: Record<string, string[]> = {};
    qs.forEach((q) => (porTema[q.tema] ??= []).push(q.id.slice(-1)));
    for (const [tema, letras] of Object.entries(porTema)) expect(letras.sort().join(''), tema).toBe('abcd');
  });

  it('nenhum passo passa de 300 letras (não rolar a tela)', () => {
    const longos = qs.flatMap((q) => q.explicacao.passos.filter((p) => p.texto.length > MAX_PASSO).map((p) => `${q.id}: ${p.titulo} (${p.texto.length})`));
    expect(longos).toEqual([]);
  });

  it('sem "operários" e sem "Letra X" (o aluno confundia com letra da equação)', () => {
    expect(qs.filter((q) => PROIBIDO_NO_ENUNCIADO.test(q.enunciado)).map((q) => q.id)).toEqual([]);
    const texto = (q: Questao) => JSON.stringify(q.explicacao);
    expect(qs.filter((q) => /Letra [A-E]\b/.test(texto(q))).map((q) => q.id)).toEqual([]);
  });

  if (!novo) return;

  it('toda questão cita a âncora real (ENEM, Fuvest, ITA, IME, Unesp, Unicamp) ou diz "sem" com o motivo', () => {
    expect(qs.filter((q) => !/^(forte|parcial|sem) · .{12,}/.test(q.ancora ?? '')).map((q) => q.id)).toEqual([]);
  });

  it('toda questão diz onde o canal ensina (arquivo [h:mm:ss]) ou "fora do canal: motivo"', () => {
    const ok = (c: string) => /^fora do canal: .{8,}/.test(c) || /\.txt \[\d+:\d{2}:\d{2}\]/.test(c);
    expect(qs.filter((q) => !ok(q.canal ?? '')).map((q) => q.id)).toEqual([]);
  });

  it('a questão de estilo ENEM (a) tem texto de prova: 600 letras ou mais', () => {
    expect(qs.filter((q) => q.id.endsWith('a') && q.enunciado.length < MIN_ENEM).map((q) => `${q.id} (${q.enunciado.length})`)).toEqual([]);
  });

  it('toda questão liga a pelo menos uma aula "Antes" (conteúdo de outro tema não é ensinado na explicação)', () => {
    expect(qs.filter((q) => (QUESTOES_COM_ANTES[q.id] ?? []).length === 0).map((q) => q.id)).toEqual([]);
  });

  it('a explicação diz a alternativa certa por extenso ("Resposta: alternativa X")', () => {
    expect(qs.filter((q) => !/Resposta: alternativa [A-E]\./.test(q.explicacao.conferencia)).map((q) => q.id)).toEqual([]);
  });
});
