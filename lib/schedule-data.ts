export interface StudyBlock {
  materia: string;
  tema: string;
  questoes: number;
}

export interface DaySchedule {
  dayOfWeek: number; // 0=Sun, 1=Mon...
  dayName: string;
  color: string;
  manha: StudyBlock[]; // Estudo matinal - matérias ENEM rotativas
  trabalho: StudyBlock[]; // Treino no trabalho - Português e Matemática fixos
  revisao?: string;
  isSimulado?: boolean;
}

export const weeklySchedule: DaySchedule[] = [
  {
    dayOfWeek: 1,
    dayName: 'Segunda-feira',
    color: '#60B5FF',
    manha: [
      { materia: 'Física', tema: 'Eletrodinâmica e Circuitos', questoes: 20 },
      { materia: 'Química', tema: 'Química Geral e Estequiometria', questoes: 20 },
    ],
    trabalho: [
      { materia: 'Português', tema: 'Interpretação de Textos + Gêneros Textuais', questoes: 20 },
      { materia: 'Matemática', tema: 'Álgebra: Equações 1º e 2º grau', questoes: 20 },
    ],
    revisao: 'Flashcards dos erros da semana anterior (15 min)',
  },
  {
    dayOfWeek: 2,
    dayName: 'Terça-feira',
    color: '#80D8C3',
    manha: [
      { materia: 'Biologia', tema: 'Ecologia e Meio Ambiente', questoes: 20 },
      { materia: 'Geografia', tema: 'Espaço Agrário e Urbano', questoes: 20 },
    ],
    trabalho: [
      { materia: 'Português', tema: 'Funções da Linguagem + Figuras de Linguagem', questoes: 20 },
      { materia: 'Matemática', tema: 'Geometria Plana: Áreas, Perímetros', questoes: 20 },
    ],
    revisao: 'Explicar 3 conceitos errados (Técnica Feynman)',
  },
  {
    dayOfWeek: 3,
    dayName: 'Quarta-feira',
    color: '#D4A017',
    manha: [
      { materia: 'História', tema: 'Brasil Colônia e Era Vargas', questoes: 20 },
      { materia: 'Filosofia', tema: 'Filosofia Antiga: Sócrates, Platão, Aristóteles', questoes: 20 },
    ],
    trabalho: [
      { materia: 'Português', tema: 'Gramática: Pontuação, Concordância', questoes: 20 },
      { materia: 'Matemática', tema: 'Estatística: Média, Mediana, Moda', questoes: 20 },
    ],
    revisao: 'Revisão espaçada de segunda e terça (10 questões)',
  },
  {
    dayOfWeek: 4,
    dayName: 'Quinta-feira',
    color: '#FF9149',
    manha: [
      { materia: 'Física', tema: 'Mecânica: Cinemática e Dinâmica', questoes: 20 },
      { materia: 'Sociologia', tema: 'Cultura, Sociedade e Movimentos Sociais', questoes: 20 },
    ],
    trabalho: [
      { materia: 'Português', tema: 'Literatura: Modernismo', questoes: 20 },
      { materia: 'Matemática', tema: 'Trigonometria + Geometria Espacial', questoes: 20 },
    ],
    revisao: 'Mapas mentais dos temas da semana (20 min)',
  },
  {
    dayOfWeek: 5,
    dayName: 'Sexta-feira',
    color: '#FF6363',
    manha: [],
    trabalho: [
      { materia: 'Português', tema: 'Treino diário', questoes: 20 },
      { materia: 'Matemática', tema: 'Treino diário', questoes: 20 },
    ],
    revisao: 'Correção detalhada do simulado + Caderno de erros',
    isSimulado: true,
  },
  {
    dayOfWeek: 6,
    dayName: 'Sábado',
    color: '#A19AD3',
    manha: [
      { materia: 'Química', tema: 'Química Orgânica e Reações', questoes: 20 },
      { materia: 'Biologia', tema: 'Genética e Citologia', questoes: 20 },
    ],
    trabalho: [
      { materia: 'Português', tema: 'Variação Linguística + Intertextualidade', questoes: 20 },
      { materia: 'Matemática', tema: 'Funções (1º, 2º grau, Exponencial)', questoes: 20 },
    ],
    revisao: 'Revisão espaçada dos erros da semana (10 questões)',
  },
  {
    dayOfWeek: 0,
    dayName: 'Domingo',
    color: '#FF9898',
    manha: [
      { materia: 'Geografia', tema: 'Geopolítica e Globalização', questoes: 20 },
      { materia: 'História', tema: 'Ditadura Militar e República', questoes: 20 },
    ],
    trabalho: [],
    revisao: 'Revisão geral de TODOS os erros da semana + Redação ENEM',
  },
];
