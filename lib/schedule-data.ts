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

// 4-week study cycle based on the ENEM master plan
export const studyCycle: WeekSchedule[] = [
  {
    weekNumber: 1,
    weekTitle: 'Fundamentos Mais Importantes',
    days: [
      {
        dayOfWeek: 1, dayName: 'Segunda-feira', color: '#60B5FF',
        topics: [
          { materia: 'Física', subtemas: ['Cinemática', 'velocidade média', 'deslocamento', 'MRU'] },
          { materia: 'Química', subtemas: ['Mol', 'Massa molar', 'Conceito de átomo e molécula'] },
        ],
      },
      {
        dayOfWeek: 2, dayName: 'Terça-feira', color: '#80D8C3',
        topics: [
          { materia: 'Biologia', subtemas: ['Ecologia', 'cadeia alimentar', 'teia alimentar', 'fluxo de energia'] },
          { materia: 'Geografia', subtemas: ['Globalização', 'Geopolítica básica', 'Ordem mundial'] },
        ],
      },
      {
        dayOfWeek: 3, dayName: 'Quarta-feira', color: '#D4A017',
        topics: [
          { materia: 'História', subtemas: ['Brasil Colônia', 'açúcar', 'escravidão', 'sociedade colonial'] },
          { materia: 'Filosofia', subtemas: ['Sócrates', 'Platão', 'Aristóteles'] },
        ],
      },
      {
        dayOfWeek: 4, dayName: 'Quinta-feira', color: '#FF9149',
        topics: [
          { materia: 'Física', subtemas: ['MRUV', 'gráficos do movimento'] },
          { materia: 'Sociologia', subtemas: ['Durkheim', 'fato social', 'coesão social'] },
        ],
      },
      {
        dayOfWeek: 5, dayName: 'Sexta-feira', color: '#FF6363',
        topics: [],
        isSimulado: true,
      },
      {
        dayOfWeek: 6, dayName: 'Sábado', color: '#A19AD3',
        topics: [
          { materia: 'Química', subtemas: ['Balanceamento químico', 'Estequiometria básica'] },
        ],
      },
      {
        dayOfWeek: 0, dayName: 'Domingo', color: '#FF9898',
        topics: [
          { materia: 'Biologia', subtemas: ['Citologia', 'organelas', 'membrana plasmática', 'transporte celular'] },
          { materia: 'História', subtemas: ['Iluminismo', 'Revolução Francesa'] },
        ],
      },
    ],
  },
  {
    weekNumber: 2,
    weekTitle: 'Base Forte ENEM',
    days: [
      {
        dayOfWeek: 1, dayName: 'Segunda-feira', color: '#60B5FF',
        topics: [
          { materia: 'Física', subtemas: ['Leis de Newton', 'força resultante'] },
          { materia: 'Química', subtemas: ['Reagente limitante', 'rendimento da reação'] },
        ],
      },
      {
        dayOfWeek: 2, dayName: 'Terça-feira', color: '#80D8C3',
        topics: [
          { materia: 'Biologia', subtemas: ['Ecologia', 'relações ecológicas', 'sucessão ecológica'] },
          { materia: 'Geografia', subtemas: ['Urbanização', 'êxodo rural', 'segregação urbana'] },
        ],
      },
      {
        dayOfWeek: 3, dayName: 'Quarta-feira', color: '#D4A017',
        topics: [
          { materia: 'História', subtemas: ['Revolução Industrial'] },
          { materia: 'Filosofia', subtemas: ['Maquiavel', 'Hobbes', 'Locke'] },
        ],
      },
      {
        dayOfWeek: 4, dayName: 'Quinta-feira', color: '#FF9149',
        topics: [
          { materia: 'Física', subtemas: ['Atrito', 'plano inclinado'] },
          { materia: 'Sociologia', subtemas: ['Karl Marx', 'luta de classes', 'alienação'] },
        ],
      },
      {
        dayOfWeek: 5, dayName: 'Sexta-feira', color: '#FF6363',
        topics: [],
        isSimulado: true,
      },
      {
        dayOfWeek: 6, dayName: 'Sábado', color: '#A19AD3',
        topics: [
          { materia: 'Química', subtemas: ['Soluções', 'concentração', 'diluição'] },
        ],
      },
      {
        dayOfWeek: 0, dayName: 'Domingo', color: '#FF9898',
        topics: [
          { materia: 'Biologia', subtemas: ['Respiração celular', 'Fotossíntese'] },
          { materia: 'História', subtemas: ['Independência do Brasil', 'Primeiro Reinado'] },
        ],
      },
    ],
  },
  {
    weekNumber: 3,
    weekTitle: 'Conteúdos Muito Cobrados',
    days: [
      {
        dayOfWeek: 1, dayName: 'Segunda-feira', color: '#60B5FF',
        topics: [
          { materia: 'Física', subtemas: ['Trabalho', 'energia cinética', 'energia potencial'] },
          { materia: 'Química', subtemas: ['Ligações químicas', 'iônica', 'covalente', 'metálica'] },
        ],
      },
      {
        dayOfWeek: 2, dayName: 'Terça-feira', color: '#80D8C3',
        topics: [
          { materia: 'Biologia', subtemas: ['Genética', 'DNA', 'RNA', 'cromossomos'] },
          { materia: 'Geografia', subtemas: ['Agropecuária', 'agronegócio', 'reforma agrária'] },
        ],
      },
      {
        dayOfWeek: 3, dayName: 'Quarta-feira', color: '#D4A017',
        topics: [
          { materia: 'História', subtemas: ['Era Vargas'] },
          { materia: 'Filosofia', subtemas: ['Rousseau', 'contrato social'] },
        ],
      },
      {
        dayOfWeek: 4, dayName: 'Quinta-feira', color: '#FF9149',
        topics: [
          { materia: 'Física', subtemas: ['Conservação da energia', 'potência', 'rendimento'] },
          { materia: 'Sociologia', subtemas: ['Max Weber', 'ação social'] },
        ],
      },
      {
        dayOfWeek: 5, dayName: 'Sexta-feira', color: '#FF6363',
        topics: [],
        isSimulado: true,
      },
      {
        dayOfWeek: 6, dayName: 'Sábado', color: '#A19AD3',
        topics: [
          { materia: 'Química', subtemas: ['Termoquímica', 'endotérmica', 'exotérmica', 'entalpia'] },
        ],
      },
      {
        dayOfWeek: 0, dayName: 'Domingo', color: '#FF9898',
        topics: [
          { materia: 'Biologia', subtemas: ['1ª Lei de Mendel', 'heredogramas'] },
          { materia: 'História', subtemas: ['República Velha'] },
        ],
      },
    ],
  },
  {
    weekNumber: 4,
    weekTitle: 'ENEM Moderno',
    days: [
      {
        dayOfWeek: 1, dayName: 'Segunda-feira', color: '#60B5FF',
        topics: [
          { materia: 'Física', subtemas: ['Corrente elétrica', 'tensão', 'resistência'] },
          { materia: 'Química', subtemas: ['Funções orgânicas'] },
        ],
      },
      {
        dayOfWeek: 2, dayName: 'Terça-feira', color: '#80D8C3',
        topics: [
          { materia: 'Biologia', subtemas: ['Sistemas humanos', 'digestório', 'respiratório'] },
          { materia: 'Geografia', subtemas: ['Meio ambiente', 'aquecimento global', 'sustentabilidade'] },
        ],
      },
      {
        dayOfWeek: 3, dayName: 'Quarta-feira', color: '#D4A017',
        topics: [
          { materia: 'História', subtemas: ['Ditadura Militar'] },
          { materia: 'Filosofia', subtemas: ['Ética', 'cidadania'] },
        ],
      },
      {
        dayOfWeek: 4, dayName: 'Quinta-feira', color: '#FF9149',
        topics: [
          { materia: 'Física', subtemas: ['Potência elétrica', 'consumo de energia', 'circuitos'] },
          { materia: 'Sociologia', subtemas: ['Cultura', 'indústria cultural', 'relativismo cultural'] },
        ],
      },
      {
        dayOfWeek: 5, dayName: 'Sexta-feira', color: '#FF6363',
        topics: [],
        isSimulado: true,
      },
      {
        dayOfWeek: 6, dayName: 'Sábado', color: '#A19AD3',
        topics: [
          { materia: 'Química', subtemas: ['Eletroquímica', 'oxidação', 'redução', 'pilhas'] },
        ],
      },
      {
        dayOfWeek: 0, dayName: 'Domingo', color: '#FF9898',
        topics: [
          { materia: 'Biologia', subtemas: ['Imunologia', 'vacinas', 'doenças virais'] },
          { materia: 'História', subtemas: ['Guerra Fria'] },
        ],
      },
    ],
  },
];

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
      tema: t.subtemas.join(', '),
      questoes: 20,
    })),
    trabalho: [
      { materia: 'Português', tema: 'Treino diário', questoes: 20 },
      { materia: 'Matemática', tema: 'Treino diário', questoes: 20 },
    ],
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
      tema: t.subtemas.join(', '),
      questoes: 20,
    })),
    trabalho: d.dayOfWeek !== 5 ? [
      { materia: 'Português', tema: 'Treino diário', questoes: 20 },
      { materia: 'Matemática', tema: 'Treino diário', questoes: 20 },
    ] : [],
    isSimulado: d.isSimulado,
  }));
}
