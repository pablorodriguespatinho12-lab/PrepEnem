// Ordem de aprendizado progressiva para Física e Química
// Do básico ao avançado - cada nível depende dos anteriores

export interface TopicLevel {
  nivel: number; // 1 = básico, 2 = intermediário, 3 = avançado
  subtemas: string[]; // subtemas que pertencem a esse nível
  titulo: string;
  descricao: string;
}

export const fisicaOrder: TopicLevel[] = [
  {
    nivel: 1,
    titulo: 'Fundamentos',
    descricao: 'Grandezas, unidades e conceitos básicos de mecânica',
    subtemas: [
      'Grandezas físicas e unidades derivadas',
      'Grandezas físicas',
      'Unidades de medida',
      'Cinemática',
      'cinemática vetorial e velocidade relativa',
      'movimento retilíneo e tempo de travessia de feixe',
      'Movimento Retilíneo',
      'MRU e MRUV',
    ],
  },
  {
    nivel: 2,
    titulo: 'Mecânica e Energia',
    descricao: 'Forças, leis de Newton, energia e trabalho',
    subtemas: [
      'Dinâmica',
      'Leis de Newton',
      'Atrito cinético em plano inclinado',
      'Energia',
      'Trabalho e Potência',
      'pressão hidrostática e empilhamento de material',
      'Hidrostática',
      'Gravitação',
    ],
  },
  {
    nivel: 3,
    titulo: 'Termologia e Ondas',
    descricao: 'Calor, temperatura, ondas sonoras e luminosas',
    subtemas: [
      'Termologia',
      'Calorimetria',
      'termometria e resistência elétrica',
      'Transferência de calor por radiação',
      'Ondas',
      'Ondas sonoras e ressonância',
      'nível sonoro e adição de intensidades',
      'Fotoluminescência e relação frequência-comprimento de onda',
      'Óptica',
    ],
  },
  {
    nivel: 4,
    titulo: 'Eletricidade e Magnetismo',
    descricao: 'Circuitos, resistência, campo elétrico, indução',
    subtemas: [
      'Eletrostática',
      'Força elétrica sobre carga em campo elétrico',
      'circuitos elétricos e lei de Ohm',
      'associação de resistores em série e divisão de tensão',
      'Eletrodinâmica',
      'geradores elétricos não ideais em série',
      'indução eletromagnética e efeito Joule',
      'Magnetismo',
      'Eletromagnetismo',
    ],
  },
  {
    nivel: 5,
    titulo: 'Física Moderna',
    descricao: 'Radioatividade, física quântica e relatividade',
    subtemas: [
      'Física Moderna',
      'Radioatividade',
      'Física Quântica',
      'Relatividade',
    ],
  },
];

export const quimicaOrder: TopicLevel[] = [
  {
    nivel: 1,
    titulo: 'Química Geral',
    descricao: 'Tabela periódica, ligações, notação e propriedades',
    subtemas: [
      'Tabela Periódica',
      'Ligações Químicas',
      'notação química histórica e fórmulas de substâncias',
      'polaridade e solubilidade em água',
      'Propriedades da Matéria',
      'Purificação de água e destilação',
      'Separação de Misturas',
    ],
  },
  {
    nivel: 2,
    titulo: 'Reações e Estequiometria',
    descricao: 'Balançeamento, cálculos estequiométricos, gases',
    subtemas: [
      'Reações Químicas',
      'estequiometria e excesso de reagente',
      'gases ideais e estequiometria',
      'Estequiometria',
      'Gases',
    ],
  },
  {
    nivel: 3,
    titulo: 'Soluções e Equilíbrio',
    descricao: 'pH, soluções, equilíbrio químico e cinética',
    subtemas: [
      'pH e Soluções',
      'ácido-base e volatilização de aminas',
      'equilíbrio químico e deslocamento do equilíbrio',
      'cinética química e catálise enzimática',
      'Soluções',
      'Cinética Química',
      'Equilíbrio Químico',
    ],
  },
  {
    nivel: 4,
    titulo: 'Eletroquímica e Radioatividade',
    descricao: 'Pilhas, eletrólise, radioatividade',
    subtemas: [
      'eletroquímica e potenciais-padrão',
      'Eletroquímica',
      'meia-vida e decaimento radioativo',
      'Radioatividade',
    ],
  },
  {
    nivel: 5,
    titulo: 'Química Orgânica',
    descricao: 'Compostos orgânicos, reações orgânicas',
    subtemas: [
      'Química Orgânica',
      'Oxidação de álcool secundário e fórmula molecular',
      'reações orgânicas de descarboxilação',
      'superfícies, surfactantes e separação óleo-água',
      'adsorção e carvão ativado',
      'Logaritmo em modelo físico e restrição de domínio',
    ],
  },
];

// Helper: get level for a subtema
export function getSubtemaLevel(materia: string, subtema: string): number {
  const order = materia === 'Física' ? fisicaOrder : materia === 'Química' ? quimicaOrder : null;
  if (!order) return 0;
  const lower = subtema.toLowerCase();
  for (const level of order) {
    if (level.subtemas.some(s => lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower))) {
      return level.nivel;
    }
  }
  return 3; // default to intermediate if not found
}

// Get all subtemas up to and including the given level
export function getSubtemasUpToLevel(materia: string, nivel: number): string[] {
  const order = materia === 'Física' ? fisicaOrder : materia === 'Química' ? quimicaOrder : null;
  if (!order) return [];
  return order.filter(l => l.nivel <= nivel).flatMap(l => l.subtemas);
}

// Get the recommended next level for a user based on what they've mastered
export function getTopicLevels(materia: string): TopicLevel[] {
  if (materia === 'Física') return fisicaOrder;
  if (materia === 'Química') return quimicaOrder;
  return [];
}
