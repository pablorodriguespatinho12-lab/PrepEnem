// Escada do treino: Fácil → Médio → Difícil → ENEM (pedido do Pablo,
// 03/11/2026). A questão do ENEM é o degrau final, não o primeiro.
//   Fácil: pergunta direta e curta ("O que é X?").
//   Médio: com um texto um pouco maior.
//   Difícil: texto longo no jeito do ENEM, mas NÃO é questão real.
//   ENEM: só questão real do ENEM.
// Questão real nunca aparece como Fácil, Médio ou Difícil: o nível se decide
// pela ORIGEM primeiro. As reais estão cadastradas como "facil"/"medio" pela
// dificuldade estimada, e "modelo_enem" é questão escrita no estilo, não real.
// 'acima': um nível além do ENEM, no estilo Fuvest/Unicamp/ITA/IME, logo
// depois da questão do ENEM do mesmo conteúdo (lib/treino-degraus.ts).
export type Etapa = 'facil' | 'medio' | 'dificil' | 'enem' | 'acima' | 'vestibular';
export const ETAPA_ORDEM: Etapa[] = ['facil', 'medio', 'dificil', 'enem', 'acima', 'vestibular'];
export const ETAPA_LABEL: Record<Etapa, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
  enem: 'ENEM',
  acima: 'Nível acima',
  vestibular: 'Vestibular real',
};
/* Quantas questões de cada degrau numa sessão de 20 (em 10: 2, 3, 2, 3).
   Falta num degrau é coberta pelo vizinho (ver montarEscada). */
export const ETAPA_COTA: Record<Etapa, number> = {
  facil: 4,
  medio: 6,
  dificil: 4,
  enem: 6,
  acima: 0, // só entra no bloco da própria âncora, nunca pela cota
  vestibular: 0, // questão real de ITA/IME/Fuvest/Unicamp/Unesp: só a última do dia (data/vestibular)
};
interface QuestaoClassificavel {
  origem?: string | null;
  anoProva?: number | null;
  nivel?: string | null;
  dificuldade?: string | null;
}
/* Real = tem ano de prova ou origem "ENEM 2022 ...". "ENEM adaptado" e
   "modelo_enem" não são reais. */
export function isQuestaoEnem(q: QuestaoClassificavel): boolean {
  if ((q.nivel ?? '').toLowerCase() === 'vestibular') return false;
  if (q.anoProva != null) return true;
  return /^enem\s+\d{4}/i.test(q.origem ?? '');
}
export function etapaDaQuestao(q: QuestaoClassificavel): Etapa {
  const nivel = (q.nivel ?? '').toLowerCase();
  if (nivel === 'acima') return 'acima';
  if (nivel === 'vestibular') return 'vestibular';
  if (isQuestaoEnem(q)) return 'enem';
  if (nivel === 'modelo_enem') return 'dificil';
  const grau = (q.nivel || q.dificuldade || '').toLowerCase();
  if (grau === 'facil') return 'facil';
  if (grau === 'dificil') return 'dificil';
  return 'medio';
}
/* Fácil → Médio → Difícil → ENEM → acima, sem embaralhar dentro do degrau.
   Usado no simulado, que sorteia as questões mas não pode abrir com a mais difícil. */
export function ordenarPorEtapa<T extends QuestaoClassificavel>(lista: T[]): T[] {
  return ETAPA_ORDEM.flatMap((e) => lista.filter((q) => etapaDaQuestao(q) === e));
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
  // Cota proporcional ao tamanho: com 10 questões (matéria do cronograma)
  // fica 2 fáceis, 3 médias, 2 difíceis e 3 do ENEM.
  const escada: Etapa[] = ['facil', 'medio', 'dificil', 'enem'];
  const soma = escada.reduce((n, e) => n + ETAPA_COTA[e], 0);
  const cotas = { ...ETAPA_COTA };
  let resto = tamanho;
  for (const e of escada.slice(0, -1)) {
    cotas[e] = Math.round((ETAPA_COTA[e] * tamanho) / soma);
    resto -= cotas[e];
  }
  cotas.enem = Math.max(0, resto);
  const escolhidas: Record<Etapa, T[]> = { facil: [], medio: [], dificil: [], enem: [], acima: [], vestibular: [] };
  const usados = new Set<string>();
  const pegar = (etapa: Etapa, quantas: number) => {
    if (quantas <= 0) return 0;
    const fila = [...porEtapa(prioritarias, etapa), ...porEtapa(reserva, etapa)].filter((q) => !usados.has(q.id));
    const novas = fila.slice(0, quantas);
    novas.forEach((q) => usados.add(q.id));
    escolhidas[etapa] = [...escolhidas[etapa], ...novas];
    return quantas - novas.length;
  };
  // Cada degrau tenta a própria cota; o que faltar passa para o vizinho mais
  // perto (ENEM → Difícil → Médio → Fácil; Fácil → Médio).
  const faltaEnem = pegar('enem', cotas.enem);
  const faltaDificil = pegar('dificil', cotas.dificil + faltaEnem);
  const faltaFacil = pegar('facil', cotas.facil);
  const faltaMedio = pegar('medio', cotas.medio + faltaDificil + faltaFacil);
  const total = () => ETAPA_ORDEM.reduce((n, e) => n + escolhidas[e].length, 0);
  for (const e of ['facil', 'dificil', 'enem'] as Etapa[]) {
    if (faltaMedio > 0 && total() < tamanho) pegar(e, tamanho - total());
  }
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

/* Exemplo resolvido: as primeiras questões de cada matéria chegam com a
   resolução aberta, para o estudante ver a construção do raciocínio antes de
   tentar sozinho (efeito do exemplo resolvido, Sweller). Pedido do Pablo em
   05/10/2026; em 07/10/2026 ele baixou de 5 para 3 (3 resolvidas, 7 ele faz).
   ENEM e nível acima nunca: essas ele resolve. */
export const RESOLVIDAS_POR_MATERIA = 3;
export function ehExemploResolvido<T extends QuestaoClassificavel & { materia: string }>(
  questoes: T[],
  idx: number,
): boolean {
  const q = questoes[idx];
  if (!q) return false;
  const etapa = etapaDaQuestao(q);
  if (etapa === 'enem' || etapa === 'acima' || etapa === 'vestibular') return false;
  const anteriores = questoes.slice(0, idx).filter((o) => o.materia === q.materia).length;
  return anteriores < RESOLVIDAS_POR_MATERIA;
}
/* Treino do dia, decidido pelo Pablo em 06/10/2026: 10 questões de cada
   matéria do cronograma do dia, depois 10 de Português e 10 de Matemática
   (ele começou com 20 e baixou para 10 no mesmo dia; se der, ele pede mais).
   Uma matéria por vez, cada uma na escada Fácil → Médio → Difícil → ENEM. */
export const COTA_CRONOGRAMA = 10;
export const COTA_TREINO_DIARIO = 10;
const MATERIAS_DIARIAS = ['Português', 'Matemática'];
export function cotasDoDia(materiasDoCronograma: string[]): { materia: string; quantidade: number }[] {
  const doCronograma = Array.from(new Set(materiasDoCronograma)).filter((m) => !MATERIAS_DIARIAS.includes(m));
  return [
    ...doCronograma.map((materia) => ({ materia, quantidade: COTA_CRONOGRAMA })),
    ...MATERIAS_DIARIAS.map((materia) => ({ materia, quantidade: COTA_TREINO_DIARIO })),
  ];
}
