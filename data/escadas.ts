/* Escadas de conteúdo (Pablo, 17/11/2026): "conteúdo de base antes, para conseguir
   entender o próximo; e os que não dependem de nada ficam soltos".
   Uma prova por conteúdo: Fácil → Médio → Difícil → ENEM → nível ITA/IME.
   `tema` é o valor de Question.tema no banco. `palavras` alimenta o Treino do dia
   (casam com subtema/enunciado em app/api/treino/generate). */

export type Degrau = {
  tema: string;
  /** Tema que precisa vir antes; null = independente. */
  precisaAntes: string | null;
  palavras: string[];
};

export type Escada = { materia: string; degraus: Degrau[] };

/** Ordem em que as matérias aparecem na página Estudar e no cronograma. */
export const MATERIAS_DO_DIA = ['Física', 'Matemática', 'Português', 'Biologia', 'Química'] as const;

export const ESCADAS: Escada[] = [
  {
    materia: 'Física',
    degraus: [
      { tema: 'Cinemática', precisaAntes: null, palavras: ['Cinemática', 'velocidade média', 'MRU', 'MRUV'] },
      { tema: 'Dinâmica e Leis de Newton', precisaAntes: 'Cinemática', palavras: ['Dinâmica', 'Newton', 'força', 'energia'] },
      { tema: 'Termodinâmica e Calor', precisaAntes: null, palavras: ['Termodinâmica', 'calor', 'temperatura'] },
      { tema: 'Ondas e Acústica', precisaAntes: null, palavras: ['Ondas', 'frequência', 'som'] },
      { tema: 'Óptica', precisaAntes: 'Ondas e Acústica', palavras: ['Óptica', 'luz', 'espelho', 'lente'] },
      { tema: 'Eletricidade e Circuitos', precisaAntes: null, palavras: ['Eletrodinâmica', 'corrente', 'resistor', 'potência'] },
    ],
  },
  {
    materia: 'Matemática',
    degraus: [
      { tema: 'Aritmética e Porcentagem', precisaAntes: null, palavras: ['porcentagem', 'razão', 'proporção', 'regra de três'] },
      { tema: 'Grandezas e Medidas', precisaAntes: 'Aritmética e Porcentagem', palavras: ['escala', 'unidade', 'medida'] },
      { tema: 'Estatística', precisaAntes: 'Aritmética e Porcentagem', palavras: ['média', 'mediana', 'moda', 'gráfico'] },
      { tema: 'Equações e Sistemas', precisaAntes: 'Aritmética e Porcentagem', palavras: ['equação', 'sistema', 'inequação'] },
      { tema: 'Funções', precisaAntes: 'Equações e Sistemas', palavras: ['função', 'gráfico', 'afim', 'quadrática'] },
      { tema: 'Geometria Plana', precisaAntes: 'Grandezas e Medidas', palavras: ['área', 'triângulo', 'círculo', 'perímetro'] },
      { tema: 'Geometria Espacial', precisaAntes: 'Geometria Plana', palavras: ['volume', 'cilindro', 'prisma', 'cubo'] },
      { tema: 'Análise Combinatória e Probabilidade', precisaAntes: 'Aritmética e Porcentagem', palavras: ['probabilidade', 'combinação', 'chance'] },
    ],
  },
  {
    materia: 'Português',
    degraus: [
      { tema: 'Interpretação de Texto', precisaAntes: null, palavras: ['interpretação', 'ideia central', 'inferência'] },
      { tema: 'Gêneros Textuais e Multimodalidade', precisaAntes: 'Interpretação de Texto', palavras: ['gênero', 'charge', 'tirinha', 'propaganda'] },
      { tema: 'Variação Linguística e Norma-Padrão', precisaAntes: 'Interpretação de Texto', palavras: ['variação', 'norma', 'regional'] },
      { tema: 'Gramática e Coesão', precisaAntes: 'Interpretação de Texto', palavras: ['concordância', 'crase', 'coesão', 'conjunção'] },
      { tema: 'Funções e Figuras de Linguagem', precisaAntes: 'Interpretação de Texto', palavras: ['função da linguagem', 'metáfora', 'ironia', 'figura'] },
      { tema: 'Literatura Brasileira', precisaAntes: 'Funções e Figuras de Linguagem', palavras: ['literatura', 'modernismo', 'romantismo', 'poema'] },
    ],
  },
  {
    materia: 'Biologia',
    degraus: [
      { tema: 'Citologia', precisaAntes: null, palavras: ['célula', 'organela', 'membrana'] },
      { tema: 'Genética', precisaAntes: 'Citologia', palavras: ['genética', 'DNA', 'herança', 'gene'] },
      { tema: 'Botânica', precisaAntes: 'Citologia', palavras: ['planta', 'fotossíntese', 'botânica'] },
      { tema: 'Evolução', precisaAntes: 'Genética', palavras: ['evolução', 'seleção natural', 'Darwin'] },
      { tema: 'Microbiologia e Doenças', precisaAntes: 'Citologia', palavras: ['vírus', 'bactéria', 'doença', 'vacina'] },
      { tema: 'Fisiologia Humana e Saúde', precisaAntes: 'Citologia', palavras: ['fisiologia', 'sistema', 'hormônio'] },
      { tema: 'Ecologia', precisaAntes: null, palavras: ['ecologia', 'cadeia alimentar', 'ecossistema'] },
    ],
  },
  {
    materia: 'Química',
    degraus: [
      { tema: 'Atomística e Ligações', precisaAntes: null, palavras: ['átomo', 'tabela periódica', 'ligação'] },
      { tema: 'Estequiometria', precisaAntes: 'Atomística e Ligações', palavras: ['mol', 'massa molar', 'estequiometria'] },
      { tema: 'Soluções, pH e Titulação', precisaAntes: 'Estequiometria', palavras: ['concentração', 'pH', 'solução', 'titulação'] },
      { tema: 'Equilíbrio, Cinética e Termoquímica', precisaAntes: 'Soluções, pH e Titulação', palavras: ['equilíbrio', 'velocidade da reação', 'entalpia'] },
      { tema: 'Eletroquímica', precisaAntes: 'Soluções, pH e Titulação', palavras: ['pilha', 'eletrólise', 'oxidação'] },
      { tema: 'Química Orgânica', precisaAntes: null, palavras: ['orgânica', 'carbono', 'função orgânica'] },
      { tema: 'Química Ambiental e Energia', precisaAntes: null, palavras: ['ambiental', 'combustível', 'efeito estufa'] },
    ],
  },
];

export function escadaDa(materia: string): Escada | undefined {
  return ESCADAS.find((e) => e.materia === materia);
}
