/* Página Estudar (Pablo, 17/11/2026): uma prova por conteúdo, agrupada por
   matéria (Física, Matemática, Português, Biologia, Química), na ordem da escada
   de data/escadas.ts. Cada prova diz o que precisa vir antes. Depois, as outras
   (Revisão de erros e provas criadas pelo aluno). */
import { ESCADAS, MATERIAS_DO_DIA, type Degrau } from '@/data/escadas';

export const TITULO_OUTRAS = 'Outras provas';
/* Cume (26/11/2026): só questão real muito difícil de ITA, IME, Fuvest e Unicamp. */
export const TITULO_CUME = 'Cume';
export const NIVEL_CUME = 'cume';

type ProvaListada = { nivel: string; nome: string };

/** Degrau da escada desta prova, pelo nome "Física 2 · Dinâmica e Leis de Newton". */
export function degrauDaProva(nome: string): { materia: string; posicao: number; degrau: Degrau } | null {
  const m = /^(.+?) (\d+) · (.+)$/.exec(nome);
  if (!m) return null;
  const escada = ESCADAS.find((e) => e.materia === m[1]);
  const degrau = escada?.degraus.find((d) => d.tema === m[3]);
  return escada && degrau ? { materia: m[1], posicao: Number(m[2]), degrau } : null;
}

export function agruparProvas<T extends ProvaListada>(exams: T[]) {
  const daEscada = exams.filter((e) => e.nivel === 'escada' && degrauDaProva(e.nome));
  const porMateria = MATERIAS_DO_DIA.map((materia) => ({
    titulo: materia,
    lista: daEscada
      .filter((e) => degrauDaProva(e.nome)!.materia === materia)
      .sort((a, b) => degrauDaProva(a.nome)!.posicao - degrauDaProva(b.nome)!.posicao),
  }));
  const cume = exams.filter((e) => e.nivel === NIVEL_CUME);
  const outras = exams.filter((e) => !daEscada.includes(e) && !cume.includes(e));
  return [...porMateria, { titulo: TITULO_CUME, lista: cume }, { titulo: TITULO_OUTRAS, lista: outras }].filter((g) => g.lista.length > 0);
}
