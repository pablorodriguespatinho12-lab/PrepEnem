import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { validarLousa } from '@/lib/aula-lousa/validar';
import { validarExplicacao } from '@/lib/tutor/validar';

// Aula de lousa das questões da escada (Pablo, 21/11/2026). O porteiro corta sem avisar
// tudo o que não cabe (texto longo, número fora da lousa, cor desconhecida): este teste
// garante que NENHUMA tela escrita à mão some no caminho até o aluno.
const PASTA = join(process.cwd(), 'data/revisao-final/escada');
type Escrita = { id: string; materia: string; explicacao: { lousa?: { cenas?: unknown[] } } & Record<string, unknown> };

const todas: Escrita[] = existsSync(PASTA)
  ? readdirSync(PASTA).filter((f) => f.endsWith('.json')).flatMap((f) => JSON.parse(readFileSync(join(PASTA, f), 'utf8')) as Escrita[])
  : [];
const comLousa = todas.filter((q) => q.explicacao?.lousa);

describe('aula de lousa das questões da escada', () => {
  it('há questões com lousa', () => {
    expect(comLousa.length).toBeGreaterThanOrEqual(3);
  });

  it('o porteiro mantém todas as telas de cada lousa', () => {
    const cortadas = comLousa.flatMap((q) => {
      const antes = q.explicacao.lousa?.cenas?.length ?? 0;
      const depois = validarLousa(q.explicacao.lousa)?.cenas.length ?? 0;
      return depois === antes ? [] : [`${q.id}: ${antes} telas, ${depois} depois do porteiro`];
    });
    expect(cortadas).toEqual([]);
  });

  it('a lousa chega inteira pela explicação pronta', () => {
    const perdidas = comLousa.filter((q) => !validarExplicacao(q.explicacao, q.materia)?.lousa).map((q) => q.id);
    expect(perdidas).toEqual([]);
  });

  it('toda lousa abre com a questão no papel na 2ª tela e termina em "Prove você"', () => {
    const fora = comLousa.filter((q) => {
      const cenas = (q.explicacao.lousa?.cenas ?? []) as { tipo: string }[];
      return cenas[1]?.tipo !== 'papel' || cenas[cenas.length - 1]?.tipo !== 'prova';
    }).map((q) => q.id);
    expect(fora).toEqual([]);
  });
});
