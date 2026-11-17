/* Uma prova por conteúdo (Pablo, 17/11/2026): Fácil → Médio → Difícil → ENEM →
   nível ITA/IME, nessa ordem, com POR_ETAPA de cada (ITA: até 2). */
import { ESCADAS, type Degrau } from '@/data/escadas';

export const ETAPAS = ['facil', 'medio', 'dificil', 'enem', 'ita'] as const;
export type EtapaDaProva = (typeof ETAPAS)[number];
export const POR_ETAPA: Record<EtapaDaProva, number> = { facil: 2, medio: 2, dificil: 2, enem: 2, ita: 2 };

export type QuestaoDaEscada = {
  id: string;
  materia: string;
  tema: string | null;
  nivel: string | null;
  anoProva: number | null;
  origem: string | null;
};

export function etapaDaProva(q: QuestaoDaEscada): EtapaDaProva | null {
  const nivel = (q.nivel ?? '').toLowerCase();
  if (nivel === 'vestibular' || nivel === 'acima') return 'ita';
  if (q.anoProva != null || /^enem\s+\d{4}/i.test(q.origem ?? '') || nivel === 'modelo_enem') return 'enem';
  if (nivel === 'facil' || nivel === 'medio' || nivel === 'dificil') return nivel;
  return null;
}

/* Ordem de preferência dentro da etapa: ENEM real antes do modelo; as do dia 2
   (d2-, com aula do robô) antes das antigas; depois pelo id, para sair igual sempre. */
function prioridade(q: QuestaoDaEscada): string {
  const real = q.anoProva != null || /^enem\s+\d{4}/i.test(q.origem ?? '') ? '0' : '1';
  const dia2 = q.id.startsWith('d2-') ? '0' : '1';
  return `${real}${dia2}${q.id}`;
}

export function questoesDoDegrau(materia: string, degrau: Degrau, todas: QuestaoDaEscada[]) {
  const doTema = todas.filter((q) => q.materia === materia && q.tema === degrau.tema);
  const porEtapa = ETAPAS.map((etapa) =>
    doTema
      .filter((q) => etapaDaProva(q) === etapa)
      .sort((a, b) => prioridade(a).localeCompare(prioridade(b)))
      .slice(0, POR_ETAPA[etapa]),
  );
  const faltam = ETAPAS.filter((_, i) => porEtapa[i].length < POR_ETAPA[ETAPAS[i]]);
  return { questoes: porEtapa.flat(), faltam };
}

export function nomeDaProva(materia: string, posicao: number, tema: string) {
  return `${materia} ${posicao} · ${tema}`;
}

/** Todas as provas de escada, na ordem da página. */
export function provasDasEscadas(todas: QuestaoDaEscada[]) {
  return ESCADAS.flatMap(({ materia, degraus }) =>
    degraus.map((degrau, i) => ({
      materia,
      tema: degrau.tema,
      nome: nomeDaProva(materia, i + 1, degrau.tema),
      ...questoesDoDegrau(materia, degrau, todas),
    })),
  );
}
