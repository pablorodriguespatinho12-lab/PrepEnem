/* Mapa da aba Descobrir: o plano cartesiano no centro e as aulas em volta, ligadas por
   caminhos. `ordem` é a escadinha: o que vem antes precisa ser visto antes. */

export interface Lugar {
  /** id da aula; 'plano' é o centro, que não é aula. */
  id: string;
  nome: string;
  x: number;
  y: number;
  ordem: number;
  /** Fórmula curta embaixo do nome. */
  formula?: string;
}

export const LUGARES: Lugar[] = [
  { id: 'plano', nome: 'Plano cartesiano', x: 320, y: 150, ordem: 0 },
  { id: 'velocidade-media', nome: 'Velocidade média', x: 115, y: 60, ordem: 1, formula: 'v = Δs ÷ Δt' },
  { id: 'funcao-afim', nome: 'Função afim', x: 525, y: 60, ordem: 2, formula: 'y = b + a · x' },
  { id: 'pa-pg', nome: 'PA × PG', x: 320, y: 40, ordem: 3, formula: 'soma ou multiplica' },
  { id: 'reta-e-distancia', nome: 'Reta e distância', x: 115, y: 240, ordem: 4, formula: 'd² = Δx² + Δy²' },
  { id: 'area-distancia', nome: 'Área = distância', x: 525, y: 240, ordem: 5, formula: 'd = (v₀ + v) ÷ 2 · t' },
  { id: 'torricelli', nome: 'Torricelli', x: 320, y: 262, ordem: 6, formula: 'v² = v₀² + 2ad' },
];

export const CAMINHOS: [string, string][] = [
  ['plano', 'velocidade-media'], ['plano', 'funcao-afim'], ['plano', 'reta-e-distancia'], ['plano', 'area-distancia'],
  ['velocidade-media', 'funcao-afim'], ['funcao-afim', 'pa-pg'], ['area-distancia', 'torricelli'],
];

/** As aulas na ordem da escadinha (sem o centro). */
export const ORDEM_DAS_AULAS = LUGARES.filter((l) => l.id !== 'plano').sort((a, b) => a.ordem - b.ordem).map((l) => l.id);
