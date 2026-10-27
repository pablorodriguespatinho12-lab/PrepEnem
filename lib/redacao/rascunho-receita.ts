// Rascunho do Treino por partes guiado, salvo no navegador a cada mudança.
// Sem Neon (o "Salvas" da Redação também é localStorage). Todo acesso ao
// armazenamento tem try/catch: em aba anônima ou com o site bloqueado, a
// tela funciona e só não guarda.

import type { ChaveCausa, ChaveElemento, ChaveParagrafo } from './receita';

export const CHAVE_RASCUNHO = 'prepenem_receita_rascunho_v1';
export const CHAVE_SALVAS = 'redacao_saved_list';
const MAX_SALVAS = 50;

export interface Rascunho {
  passo: number;
  tema: string;
  /* true quando o tema veio da lista (pode ter dupla sugerida); digitado = livre. */
  temaDaLista: boolean;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  tese: string;
  paragrafos: Record<ChaveParagrafo, string>;
  elementos: Record<ChaveElemento, boolean>;
  checklist: boolean[];
}

export const rascunhoVazio = (): Rascunho => ({
  passo: 1,
  tema: '',
  temaDaLista: false,
  causaA: null,
  causaB: null,
  tese: '',
  paragrafos: { introducao: '', desenvolvimento1: '', desenvolvimento2: '', conclusao: '' },
  elementos: { agente: false, acao: false, meio: false, finalidade: false, detalhamento: false },
  checklist: [],
});

type Armazenamento = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const navegador = (): Armazenamento | null => (typeof window === 'undefined' ? null : window.localStorage);

/* Lê o rascunho; qualquer coisa estranha (JSON quebrado, versão velha) vira
   rascunho vazio, completando os campos que faltarem. */
export function lerRascunho(armazenamento: Armazenamento | null = navegador()): Rascunho {
  try {
    const bruto = armazenamento?.getItem(CHAVE_RASCUNHO);
    if (!bruto) return rascunhoVazio();
    const salvo = JSON.parse(bruto) as Partial<Rascunho>;
    const vazio = rascunhoVazio();
    return {
      ...vazio,
      ...salvo,
      paragrafos: { ...vazio.paragrafos, ...salvo.paragrafos },
      elementos: { ...vazio.elementos, ...salvo.elementos },
      checklist: Array.isArray(salvo.checklist) ? salvo.checklist : [],
    };
  } catch {
    return rascunhoVazio();
  }
}

/* Devolve false se não conseguiu guardar (a tela pode avisar). */
export function salvarRascunho(r: Rascunho, armazenamento: Armazenamento | null = navegador()): boolean {
  try {
    if (!armazenamento) return false;
    armazenamento.setItem(CHAVE_RASCUNHO, JSON.stringify(r));
    return true;
  } catch {
    return false;
  }
}

export function apagarRascunho(armazenamento: Armazenamento | null = navegador()): void {
  try {
    armazenamento?.removeItem(CHAVE_RASCUNHO);
  } catch {
    /* sem armazenamento: não há o que apagar */
  }
}

/* Guarda a redação montada na lista "Salvas" da tela de Redação, no mesmo
   formato que ela já usa. */
export function guardarEmSalvas(tema: string, texto: string, armazenamento: Armazenamento | null = navegador()): boolean {
  try {
    if (!armazenamento) return false;
    const lista = JSON.parse(armazenamento.getItem(CHAVE_SALVAS) || '[]');
    const nova = {
      id: `receita_${Date.now()}`,
      tema: `Receita: ${tema}`,
      theme: { tema },
      texto,
      wordCount: texto.split(/\s+/).filter(Boolean).length,
      savedAt: new Date().toISOString(),
    };
    armazenamento.setItem(CHAVE_SALVAS, JSON.stringify([nova, ...(Array.isArray(lista) ? lista : [])].slice(0, MAX_SALVAS)));
    return true;
  } catch {
    return false;
  }
}
