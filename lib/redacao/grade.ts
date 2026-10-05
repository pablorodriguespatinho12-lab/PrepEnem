// Regras de nota da redação do ENEM (docs/redacao-enem-correcao.md). A IA
// levanta evidência; quem transforma evidência em nota é este arquivo, para a
// nota seguir a grade oficial e não a impressão do modelo.

export type Nivel = 0 | 40 | 80 | 120 | 160 | 200;
export const NIVEIS: Nivel[] = [0, 40, 80, 120, 160, 200];

export type EstruturaSintatica = 'excelente' | 'boa' | 'regular' | 'deficitaria' | 'inexistente';

/* Faixas de "poucos/alguns/muitos" desvios: APROXIMAÇÃO do PrepEnem, o INEP
   não publica número. Só o 200 (no máximo 2) é oficial. */
const FAIXAS_DESVIOS: { max: number; nivel: Nivel }[] = [
  { max: 2, nivel: 200 },
  { max: 5, nivel: 160 },
  { max: 9, nivel: 120 },
  { max: 14, nivel: 80 },
];

const NIVEL_ESTRUTURA: Record<EstruturaSintatica, Nivel> = {
  excelente: 200, boa: 160, regular: 120, deficitaria: 80, inexistente: 0,
};

export function arredondarNivel(n: unknown): Nivel {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0;
  return NIVEIS.reduce((melhor, nivel) => (Math.abs(nivel - v) < Math.abs(melhor - v) ? nivel : melhor), 0 as Nivel);
}

/* C1: o menor entre o nível da estrutura e o dos desvios ("dois níveis → o de
   baixo"). Deficitária E muitos desvios desce para 40. */
export function notaC1(estrutura: EstruturaSintatica, desvios: number): Nivel {
  if (estrutura === 'inexistente') return 0;
  const porDesvios = FAIXAS_DESVIOS.find((f) => desvios <= f.max)?.nivel ?? 40;
  if (estrutura === 'deficitaria' && porDesvios <= 80) return 40;
  return Math.min(NIVEL_ESTRUTURA[estrutura], porDesvios) as Nivel;
}

export interface ElementosProposta {
  agente: boolean;
  acao: boolean;
  modo: boolean;
  efeito: boolean;
  detalhamento: boolean;
}

/* C5: 40 por elemento válido. Desrespeito aos direitos humanos zera; proposta
   condicional ("se...") trava em 80. */
export function notaC5(e: ElementosProposta, opcoes: { desrespeitaDH?: boolean; condicional?: boolean } = {}): Nivel {
  if (opcoes.desrespeitaDH) return 0;
  const validos = [e.agente, e.acao, e.modo, e.efeito, e.detalhamento].filter(Boolean).length;
  const nota = (validos * 40) as Nivel;
  return opcoes.condicional ? (Math.min(nota, 80) as Nivel) : nota;
}

export type Abordagem = 'completa' | 'tangencia' | 'fuga';

export interface Travas {
  abordagem: Abordagem;
  outroTipoTextual: boolean;
  copiaMotivadores: boolean;
  monobloco: boolean;
  contradicaoGrave: boolean;
  inadequacaoCoesiva: boolean;
  operadoresEntreParagrafos: number;
  todoParagrafoTemCoesivo: boolean;
}

export interface Notas { c1: Nivel; c2: Nivel; c3: Nivel; c4: Nivel; c5: Nivel }

const teto = (n: Nivel, max: Nivel): Nivel => (Math.min(n, max) as Nivel);

/* Aplica as travas da grade sobre os níveis propostos. Devolve as notas e a
   lista de travas acionadas, para o aluno ver POR QUE a nota parou ali. */
export function aplicarTravas(notas: Notas, t: Travas): { notas: Notas; motivos: string[] } {
  if (t.abordagem === 'fuga' || t.outroTipoTextual) {
    return {
      notas: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 },
      motivos: [t.abordagem === 'fuga' ? 'Fuga ao tema anula a redação.' : 'Texto não é dissertativo-argumentativo: a redação é anulada.'],
    };
  }
  const motivos: string[] = [];
  let { c2, c3, c4, c5 } = notas;
  if (t.abordagem === 'tangencia') {
    c2 = teto(c2, 40); c3 = teto(c3, 40); c5 = teto(c5, 40);
    motivos.push('Tangenciar o tema trava C2, C3 e C5 em 40.');
  }
  if (t.copiaMotivadores && c2 > 80) { c2 = 80; motivos.push('Cópia dos textos motivadores trava a C2 em 80.'); }
  if (t.contradicaoGrave && c3 > 80) { c3 = 80; motivos.push('Contradição grave trava a C3 em 80.'); }
  if (t.monobloco && c4 > 80) { c4 = 80; motivos.push('Texto em um parágrafo só trava a C4 em 80.'); }
  if (c4 === 200 && (t.inadequacaoCoesiva || t.operadoresEntreParagrafos < 2 || !t.todoParagrafoTemCoesivo)) {
    c4 = 160;
    motivos.push('C4 no 200 exige nenhuma inadequação, 2 ou mais operadores entre parágrafos e coesivo dentro de cada parágrafo.');
  }
  if (c4 === 160 && t.operadoresEntreParagrafos < 1) {
    c4 = 120;
    motivos.push('C4 no 160 exige ao menos 1 operador entre parágrafos.');
  }
  return { notas: { c1: notas.c1, c2, c3, c4, c5 }, motivos };
}

/* Linhas aproximadas num texto digitado: a folha do ENEM tem ~70 caracteres
   por linha. Serve para o aviso de "até 7 linhas = nota zero". */
const CARACTERES_POR_LINHA = 70;
export const MINIMO_LINHAS = 8;

export function linhasAproximadas(texto: string): number {
  return texto
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .reduce((total, p) => total + Math.ceil(p.length / CARACTERES_POR_LINHA), 0);
}

export const total = (n: Notas): number => n.c1 + n.c2 + n.c3 + n.c4 + n.c5;
