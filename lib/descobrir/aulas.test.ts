import { describe, expect, it } from 'vitest';
import { AULAS } from '@/data/descobrir/aulas';
import { CAMINHOS, LUGARES, ORDEM_DAS_AULAS } from '@/data/descobrir/mapa';
import { ESCADAS } from '@/data/escadas';
import { nomeDaProva } from '@/lib/prova-da-escada';
import { conferirEscolha, problemasDaEtapa } from './conferir-prova';

const MAX_FRASE = 110; // 1 frase por tela, sem rolar

describe('conferirEscolha', () => {
  const etapa = { certa: 1, erros: ['Ficou pior.', ''] };
  it('a certa anda uma linha', () => expect(conferirEscolha(etapa, 1)).toEqual({ andou: true }));
  it('a errada fica e diz o que aconteceu', () => expect(conferirEscolha(etapa, 0)).toEqual({ andou: false, aviso: 'Ficou pior.' }));
  it('aviso vazio vira um aviso padrão', () => expect(conferirEscolha({ certa: 0, erros: ['', ''] }, 1)).toMatchObject({ andou: false }));
});

describe('aulas da aba Descobrir', () => {
  const provasDaEscada = new Set(ESCADAS.flatMap((e) => e.degraus.map((d, i) => nomeDaProva(e.materia, i + 1, d.tema))));

  it('toda aula está no mapa, e todo lugar do mapa tem aula', () => {
    expect([...ORDEM_DAS_AULAS].sort()).toEqual(AULAS.map((a) => a.id).sort());
    const ids = new Set(LUGARES.map((l) => l.id));
    expect(CAMINHOS.flat().filter((id) => !ids.has(id))).toEqual([]);
  });

  for (const aula of AULAS) {
    describe(aula.titulo, () => {
      it('frases curtas e nomes de passo únicos', () => {
        expect(aula.passos.filter((p) => p.frase.length > MAX_FRASE).map((p) => p.nome)).toEqual([]);
        const nomes = aula.passos.map((p) => p.nome);
        expect(nomes.filter((n, i) => nomes.indexOf(n) !== i)).toEqual([]);
      });
      it('Prove você com etapas bem montadas', () => {
        expect(aula.prova.etapas.length).toBeGreaterThanOrEqual(2);
        const ruins = aula.prova.etapas.map((e, i) => [i + 1, problemasDaEtapa(e)] as const).filter(([, p]) => p.length);
        expect(ruins).toEqual([]);
      });
      it('treina numa prova da escada que existe', () => {
        expect(aula.treino.filter((t) => !provasDaEscada.has(t))).toEqual([]);
      });
    });
  }
});
