// Níveis que o próprio INEP declara nos comentários das cartilhas, pela frase
// da grade oficial que o comentário usa. Só entra competência com frase clara.
//   C1 200 = "excelente domínio"     C1 160 = "bom domínio" / "estrutura sintática boa e poucos desvios"
//   C4 200 = "sem inadequações"      C4 160 = "poucas inadequações" / "impede o nível máximo"
// A chave é o nome do arquivo em tests/redacao/textos/ (sem .txt).

import type { Competencia } from '@/lib/redacao/correcao';

export interface NivelInep {
  nivel: number;
  frase: string;
}

export const NIVEIS_INEP: Record<string, Partial<Record<Competencia, NivelInep>>> = {
  'cartilha2026-01': {
    c1: { nivel: 160, frase: 'se enquadraria em estrutura sintática boa e poucos desvios' },
    c4: { nivel: 160, frase: 'o que impede o nível máximo na avaliação da coesão' },
  },
  'cartilha2026-02': {
    c1: { nivel: 160, frase: 'se aproximaria do nível correspondente a "estrutura sintática boa e poucos desvios"' },
    c4: { nivel: 160, frase: 'presença constante de elementos coesivos [...] com poucas inadequações' },
  },
  'cartilha2026-03': { c1: { nivel: 200, frase: 'excelente domínio da norma-padrão' } },
  'cartilha2026-10': { c1: { nivel: 200, frase: 'excelente domínio da norma-padrão' } },
  'cartilha2025-01': { c4: { nivel: 200, frase: 'recursos coesivos, empregados sem inadequações' } },
  'cartilha2025-02': { c4: { nivel: 200, frase: 'recursos coesivos, empregados sem inadequações' } },
  'cartilha2025-03': { c1: { nivel: 160, frase: 'bom domínio da modalidade escrita formal' } },
  'cartilha2025-05': { c1: { nivel: 160, frase: 'bom domínio da norma-padrão' } },
  'cartilha2025-07': {
    c1: { nivel: 160, frase: 'bom domínio da norma-padrão' },
    c4: { nivel: 200, frase: 'recursos coesivos, empregados sem inadequações' },
  },
  'cartilha2025-09': { c1: { nivel: 200, frase: 'excelente domínio das convenções da escrita formal' } },
  'cartilha2025-10': { c1: { nivel: 200, frase: 'excelente domínio da modalidade escrita formal' } },
};
