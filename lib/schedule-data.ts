import { MATERIAS_DO_DIA, escadaDa } from '@/data/escadas';

export interface StudyTopic {
  materia: string;
  subtemas: string[];
}

export interface DaySchedule {
  dayOfWeek: number; // 1=Seg, 2=Ter, 3=Qua, 4=Qui, 6=Sab, 0=Dom
  dayName: string;
  color: string;
  topics: StudyTopic[];
  isSimulado?: boolean;
}

export interface WeekSchedule {
  weekNumber: number;
  weekTitle: string;
  days: DaySchedule[];
}

/* Ciclo de 4 semanas (Pablo, 17/11/2026): as mesmas 5 matérias todo dia
   (Física, Matemática, Português, Biologia, Química), e a sexta continua sendo
   o simulado. O que muda de um dia para o outro é o degrau da escada de cada
   matéria (data/escadas.ts): o conteúdo de base primeiro. */
const SEMANAS = 4;
const DIAS_BASE: { dayOfWeek: number; dayName: string; color: string; isSimulado?: boolean }[] = [
  { dayOfWeek: 1, dayName: 'Segunda-feira', color: '#60B5FF' },
  { dayOfWeek: 2, dayName: 'Terça-feira', color: '#80D8C3' },
  { dayOfWeek: 3, dayName: 'Quarta-feira', color: '#D4A017' },
  { dayOfWeek: 4, dayName: 'Quinta-feira', color: '#FF9149' },
  { dayOfWeek: 5, dayName: 'Sexta-feira', color: '#FF6363', isSimulado: true },
  { dayOfWeek: 6, dayName: 'Sábado', color: '#A19AD3' },
  { dayOfWeek: 0, dayName: 'Domingo', color: '#FF9898' },
];
const DIAS_DE_ESTUDO = SEMANAS * DIAS_BASE.filter((d) => !d.isSimulado).length;

/** Degrau da escada no n-ésimo dia de estudo do ciclo (0 = primeiro). */
export function degrauDoDia(materia: string, diaDeEstudo: number) {
  const escada = escadaDa(materia);
  if (!escada) return null;
  const i = Math.min(Math.floor((diaDeEstudo * escada.degraus.length) / DIAS_DE_ESTUDO), escada.degraus.length - 1);
  return escada.degraus[i];
}

function montarCiclo(): WeekSchedule[] {
  let diaDeEstudo = 0;
  return Array.from({ length: SEMANAS }, (_, w) => ({
    weekNumber: w + 1,
    weekTitle: `As 5 matérias, degrau ${w + 1} de ${SEMANAS}`,
    days: DIAS_BASE.map((d) => {
      if (d.isSimulado) return { ...d, topics: [] };
      const n = diaDeEstudo++;
      const topics = MATERIAS_DO_DIA.map((materia) => {
        const degrau = degrauDoDia(materia, n);
        return { materia, subtemas: degrau ? [degrau.tema, ...degrau.palavras] : [] };
      });
      return { ...d, topics };
    }),
  }));
}

export const studyCycle: WeekSchedule[] = montarCiclo();

// dayIndex é a posição do dia DENTRO do array `days` de uma semana (0-6,
// ordem Segunda→Domingo conforme o array já está declarado acima) — não é
// o `dayOfWeek` civil (0=Dom...6=Sáb, usado só como rótulo/cor de exibição).
// Antes disso o dia/semana "atual" era calculado a partir de CYCLE_START +
// data de hoje: o ciclo girava sozinho independente do que o usuário de
// fato estudou. Ver lib/study-progress.ts pra a versão baseada em progresso
// real (StudyProgress no banco) — essas funções aqui são só leitura pura do
// conteúdo estático de studyCycle, dado um weekNumber/dayIndex explícitos.
export function getCycleInfoForDay(weekNumber: number, dayIndex: number) {
  const weekIndex = Math.min(Math.max(weekNumber - 1, 0), studyCycle.length - 1);
  const currentWeek = studyCycle[weekIndex];
  const daySchedule = currentWeek.days[Math.min(Math.max(dayIndex, 0), currentWeek.days.length - 1)] ?? null;
  return { weekIndex, weekNumber: weekIndex + 1, currentWeek, daySchedule, dayIndex };
}

// Get all topics for the current week (for simulado on Friday)
export function getWeekTopics(weekIndex: number): StudyTopic[] {
  const week = studyCycle[weekIndex];
  if (!week) return [];
  const allTopics: StudyTopic[] = [];
  const seen = new Set<string>();
  for (const day of week.days) {
    for (const topic of day.topics) {
      const key = topic.materia;
      if (!seen.has(key)) {
        seen.add(key);
        allTopics.push(topic);
      } else {
        // Merge subtemas
        const existing = allTopics.find(t => t.materia === key);
        if (existing) {
          for (const s of topic.subtemas) {
            if (!existing.subtemas.includes(s)) existing.subtemas.push(s);
          }
        }
      }
    }
  }
  return allTopics;
}

// Legacy export for backward compatibility
export interface StudyBlock {
  materia: string;
  tema: string;
  questoes: number;
}

export interface LegacyDaySchedule {
  dayOfWeek: number;
  dayName: string;
  color: string;
  manha: StudyBlock[];
  trabalho: StudyBlock[];
  revisao?: string;
  isSimulado?: boolean;
}

// Convert a specific plan day to legacy format for backward compatibility
export function getLegacyScheduleForDay(weekNumber: number, dayIndex: number): LegacyDaySchedule | null {
  const { daySchedule } = getCycleInfoForDay(weekNumber, dayIndex);
  if (!daySchedule) return null;
  return {
    dayOfWeek: daySchedule.dayOfWeek,
    dayName: daySchedule.dayName,
    color: daySchedule.color,
    manha: daySchedule.topics.map(t => ({
      materia: t.materia,
      tema: t.subtemas[0] ?? '', // o 1º é o nome do conteúdo; o resto são palavras para o Treino
      questoes: 20,
    })),
    trabalho: [], // as 5 matérias já estão em `manha` desde 17/11/2026
    isSimulado: daySchedule.isSimulado,
  };
}

// Build a weeklySchedule-like array for a given week (for dashboard weekly view)
export function getWeekScheduleByNumber(weekNumber: number): LegacyDaySchedule[] {
  const { currentWeek } = getCycleInfoForDay(weekNumber, 0);
  return currentWeek.days.map(d => ({
    dayOfWeek: d.dayOfWeek,
    dayName: d.dayName,
    color: d.color,
    manha: d.topics.map(t => ({
      materia: t.materia,
      tema: t.subtemas[0] ?? '', // o 1º é o nome do conteúdo; o resto são palavras para o Treino
      questoes: 20,
    })),
    trabalho: [],
    isSimulado: d.isSimulado,
  }));
}
