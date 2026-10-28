// Rascunho do Treino por partes guiado, salvo no navegador a cada mudança.
// Sem Neon (o "Salvas" da Redação também é localStorage). Todo acesso ao
// armazenamento tem try/catch: em aba anônima ou com o site bloqueado, a
// tela funciona e só não guarda.

import { moldeTese, problemaDoTema, causaPorChave, type ChaveCausa, type ChaveElemento, type ChaveParagrafo } from './receita';

export const CHAVE_RASCUNHO = 'prepenem_receita_rascunho_v1';
export const CHAVE_SALVAS = 'redacao_saved_list';
const MAX_SALVAS = 50;

export interface Rascunho {
  passo: number;
  tema: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  tese: string;
  /* A última tese que o site gerou. tese === teseGerada: o aluno não mexeu,
     e o site pode trocar sozinho quando os motivos mudam. */
  teseGerada: string;
  paragrafos: Record<ChaveParagrafo, string>;
  elementos: Record<ChaveElemento, boolean>;
  checklist: boolean[];
}

export const rascunhoVazio = (): Rascunho => ({
  passo: 1,
  tema: '',
  causaA: null,
  causaB: null,
  tese: '',
  teseGerada: '',
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
    return migrarTese({
      ...vazio,
      ...salvo,
      paragrafos: { ...vazio.paragrafos, ...salvo.paragrafos },
      elementos: { ...vazio.elementos, ...salvo.elementos },
      checklist: Array.isArray(salvo.checklist) ? salvo.checklist : [],
    }, typeof salvo.teseGerada === 'string');
  } catch {
    return rascunhoVazio();
  }
}

/* A tese que o site gera para o tema e os motivos; sem os 2 motivos, nada
   (colchete na caixa do aluno parece texto dele). */
export function teseAutomatica(r: Pick<Rascunho, 'tema' | 'causaA' | 'causaB'>): string {
  return r.causaA && r.causaB ? moldeTese(r.causaA, r.causaB, r.tema) : '';
}
const teseFoiEditada = (r: Pick<Rascunho, 'tese' | 'teseGerada'>) => r.tese.trim() !== '' && r.tese !== r.teseGerada;
/* Depois de mudar tema ou motivos: tese ainda automática é regerada; tese que
   o aluno editou fica como está (a tela pergunta, nunca sobrescreve). */
export function sincronizarTese(r: Rascunho): Rascunho {
  if (teseFoiEditada(r)) return r;
  const nova = teseAutomatica(r);
  return r.tese === nova && r.teseGerada === nova ? r : { ...r, tese: nova, teseGerada: nova };
}
/* "Seus motivos mudaram. Atualizar a tese?": só quando o aluno editou a tese
   e a gerada para os motivos de agora é outra. */
export function teseDesatualizada(r: Rascunho): boolean {
  const nova = teseAutomatica(r);
  return teseFoiEditada(r) && nova !== '' && nova !== r.teseGerada;
}
export function atualizarTese(r: Rascunho): Rascunho {
  const nova = teseAutomatica(r);
  return { ...r, tese: nova, teseGerada: nova };
}
/* Rascunho de antes de 28/10/2026 não tinha teseGerada. Tese igual a um molde
   (o de antes, com o tema inteiro, ou o de agora) era automática: vira a
   de agora. Tese escrita pelo aluno fica intacta e conta como gerada para os
   motivos atuais, para o aviso não aparecer sem os motivos terem mudado. */
function moldeTeseAntigo(r: Rascunho): string {
  const a = causaPorChave(r.causaA)?.naTese ?? 'de [causa A]';
  const b = causaPorChave(r.causaB)?.naTese ?? 'de [causa B]';
  const p = problemaDoTema(r.tema);
  return `${p ? p.charAt(0).toUpperCase() + p.slice(1) : 'Tal cenário'} decorre, sobretudo, ${a} e ${b}.`;
}
function migrarTese(r: Rascunho, jaTemCampo: boolean): Rascunho {
  if (jaTemCampo) return r;
  const nova = teseAutomatica(r);
  const eraAutomatica = r.tese.trim() === '' || r.tese === moldeTeseAntigo(r) || r.tese === nova;
  return eraAutomatica ? { ...r, tese: nova, teseGerada: nova } : { ...r, teseGerada: nova };
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
