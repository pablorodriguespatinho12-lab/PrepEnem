// Escada do treino: a questão do ENEM é o degrau final, não o primeiro.
// Antes dela vêm questões menores sobre o mesmo conteúdo (base → intermediária),
// para o estudante chegar à questão real já com as peças na mão.
//
// O campo `dificuldade` não serve para isso: as questões reais do ENEM estão
// cadastradas como "facil"/"medio" pela dificuldade estimada, e na prática são
// as mais difíceis da sessão. A etapa se decide pela ORIGEM primeiro.

export type Etapa = 'base' | 'intermediaria' | 'enem';

export const ETAPA_ORDEM: Etapa[] = ['base', 'intermediaria', 'enem'];

export const ETAPA_LABEL: Record<Etapa, string> = {
  base: 'Base',
  intermediaria: 'Intermediária',
  enem: 'ENEM',
};

/* Quantas questões de cada degrau numa sessão de 20. Falta num degrau é
   coberta pelo vizinho (ver montarEscada). */
export const ETAPA_COTA: Record<Etapa, number> = {
  base: 6,
  intermediaria: 8,
  enem: 6,
};

interface QuestaoClassificavel {
  origem?: string | null;
  anoProva?: number | null;
  nivel?: string | null;
  dificuldade?: string | null;
}

export function isQuestaoEnem(q: QuestaoClassificavel): boolean {
  if (q.anoProva != null) return true;
  if (/^enem/i.test(q.origem ?? '')) return true;
  return (q.nivel ?? '').toLowerCase() === 'modelo_enem';
}

export function etapaDaQuestao(q: QuestaoClassificavel): Etapa {
  if (isQuestaoEnem(q)) return 'enem';
  const grau = (q.nivel ?? q.dificuldade ?? '').toLowerCase();
  return grau === 'facil' ? 'base' : 'intermediaria';
}

/* Monta a sessão na ordem da escada. `prioritarias` são as do subtema do dia;
   `reserva` são da mesma matéria com outro subtema, usadas só se faltar.
   Dentro de cada degrau, as matérias se alternam para não virar bloco único. */
export function montarEscada<T extends QuestaoClassificavel & { id: string; materia: string }>(
  prioritarias: T[],
  reserva: T[],
  tamanho: number,
): T[] {
  const porEtapa = (lista: T[], etapa: Etapa) => lista.filter((q) => etapaDaQuestao(q) === etapa);

  const cotas = { ...ETAPA_COTA };
  const escolhidas: Record<Etapa, T[]> = { base: [], intermediaria: [], enem: [] };
  const usados = new Set<string>();

  const pegar = (etapa: Etapa, quantas: number) => {
    const fila = [...porEtapa(prioritarias, etapa), ...porEtapa(reserva, etapa)].filter((q) => !usados.has(q.id));
    const novas = fila.slice(0, quantas);
    novas.forEach((q) => usados.add(q.id));
    escolhidas[etapa] = [...escolhidas[etapa], ...novas];
    return quantas - novas.length;
  };

  // Primeira passada: cada degrau tenta a própria cota. O que faltar desce
  // para o degrau vizinho (base ↔ intermediária, enem → intermediária).
  const faltaBase = pegar('base', cotas.base);
  const faltaEnem = pegar('enem', cotas.enem);
  const faltaInter = pegar('intermediaria', cotas.intermediaria + faltaBase + faltaEnem);
  if (faltaInter > 0) pegar('base', faltaInter);
  const total = () => ETAPA_ORDEM.reduce((n, e) => n + escolhidas[e].length, 0);
  if (total() < tamanho) pegar('enem', tamanho - total());

  return ETAPA_ORDEM.flatMap((e) => alternarMaterias(escolhidas[e])).slice(0, tamanho);
}

function alternarMaterias<T extends { materia: string }>(lista: T[]): T[] {
  const grupos = new Map<string, T[]>();
  for (const q of lista) grupos.set(q.materia, [...(grupos.get(q.materia) ?? []), q]);
  const filas = Array.from(grupos.values());
  const saida: T[] = [];
  for (let i = 0; saida.length < lista.length; i++) {
    for (const f of filas) if (f[i]) saida.push(f[i]);
  }
  return saida;
}
