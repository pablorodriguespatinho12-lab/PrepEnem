// Rascunho do Treino por partes guiado, salvo no navegador a cada mudança.
// Sem Neon (o "Salvas" da Redação também é localStorage). Todo acesso ao
// armazenamento tem try/catch: em aba anônima ou com o site bloqueado, a
// tela funciona e só não guarda.

import { duplaSugerida, meuMotivo, moldeTese, MOTIVOS_VAZIOS, problemaDoTema, causaPorChave, type ChaveCausa, type ChaveElemento, type ChaveParagrafo, type MeusMotivos } from './receita';

export const CHAVE_RASCUNHO = 'prepenem_receita_rascunho_v1';
export const CHAVE_SALVAS = 'redacao_saved_list';
const MAX_SALVAS = 50;

export interface Rascunho {
  passo: number;
  tema: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  /* Os motivos com as palavras dele (opcional): mandam no molde e na tese
     no lugar da frase da causa (Pablo, 02/11/2026). */
  meusMotivos: MeusMotivos;
  tese: string;
  /* A última tese que o site gerou. tese === teseGerada: o aluno não mexeu,
     e o site pode trocar sozinho quando os motivos mudam. */
  teseGerada: string;
  paragrafos: Record<ChaveParagrafo, string>;
  elementos: Record<ChaveElemento, boolean>;
  checklist: boolean[];
  /* Parágrafos cujo molde o aluno já viu: no celular, o molde abre sozinho
     só na 1ª visita de cada passo (Pablo, 29/10/2026). */
  moldesVistos: ChaveParagrafo[];
  /* A última correção do passo 8 e o texto que ela corrigiu: texto diferente
     = ele mexeu depois, e a tela oferece corrigir de novo. */
  correcao: CorrecaoDoTreino | null;
}
export interface CorrecaoDoTreino { essayId: string; texto: string }
const lerCorrecaoDoTreino = (v: unknown): CorrecaoDoTreino | null => {
  const c = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return typeof c.essayId === 'string' && typeof c.texto === 'string' ? { essayId: c.essayId, texto: c.texto } : null;
};

export const rascunhoVazio = (): Rascunho => ({
  passo: 1,
  tema: '',
  causaA: null,
  causaB: null,
  meusMotivos: MOTIVOS_VAZIOS,
  tese: '',
  teseGerada: '',
  paragrafos: { introducao: '', desenvolvimento1: '', desenvolvimento2: '', conclusao: '' },
  elementos: { agente: false, acao: false, meio: false, finalidade: false, detalhamento: false },
  checklist: [],
  moldesVistos: [],
  correcao: null,
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
      moldesVistos: Array.isArray(salvo.moldesVistos) ? salvo.moldesVistos : [],
      correcao: lerCorrecaoDoTreino(salvo.correcao),
      meusMotivos: lerMeusMotivos(salvo.meusMotivos),
    }, typeof salvo.teseGerada === 'string');
  } catch {
    return rascunhoVazio();
  }
}

/* A tese que o site gera para o tema e os motivos; sem os 2 motivos, nada
   (colchete na caixa do aluno parece texto dele). */
export function teseAutomatica(r: Pick<Rascunho, 'tema' | 'causaA' | 'causaB'> & Partial<Pick<Rascunho, 'meusMotivos'>>): string {
  const meus = r.meusMotivos ?? MOTIVOS_VAZIOS;
  return temMotivo(r.causaA, meus[0]) && temMotivo(r.causaB, meus[1]) ? moldeTese(r.causaA, r.causaB, r.tema, meus) : '';
}
/* Cada motivo vale escolhido na lista OU escrito por ele. */
export const temMotivo = (causa: ChaveCausa | null, meu: string): boolean => causa !== null || meuMotivo(meu) !== '';
const lerMeusMotivos = (v: unknown): MeusMotivos =>
  Array.isArray(v) ? [String(v[0] ?? '').slice(0, 160), String(v[1] ?? '').slice(0, 160)] : MOTIVOS_VAZIOS;
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
/* Troca de tema (Pablo, 29/10/2026): motivos que ainda são os sugeridos do
   tema antigo foram postos pelo site e viram os sugeridos do novo (tema livre
   não tem: o aluno escolhe). Motivos escolhidos à mão ficam, e o aviso
   "combina pouco" diz se servem mal ao tema novo. A tese segue sincronizarTese. */
export function trocarTema(r: Rascunho, tema: string, temasDaLista: string[]): Rascunho {
  const doSite = duplaSugerida(r.tema, temasDaLista);
  const eramDoSite = doSite !== null && r.causaA === doSite[0] && r.causaB === doSite[1];
  if (!eramDoSite) return sincronizarTese({ ...r, tema });
  const novos = duplaSugerida(tema, temasDaLista);
  return sincronizarTese({ ...r, tema, causaA: novos?.[0] ?? null, causaB: novos?.[1] ?? null });
}
export function atualizarTese(r: Rascunho): Rascunho {
  const nova = teseAutomatica(r);
  return { ...r, tese: nova, teseGerada: nova };
}
/* Rascunho de antes de 28/10/2026 não tinha teseGerada. Tese igual a um molde
   (o de antes, com o tema inteiro, ou o de agora) era automática: vira a
   de agora. Tese escrita pelo aluno fica intacta e conta como gerada para os
   motivos atuais, para o aviso não aparecer sem os motivos terem mudado. */
/* A frase do estigma de antes de 29/10/2026, para reconhecer a tese velha. */
const NA_TESE_ANTIGA: Partial<Record<ChaveCausa, string>> = { estigma: 'do estigma social que torna esse grupo invisível' };
const naTeseAntiga = (c: ChaveCausa | null, reserva: string) => (c && NA_TESE_ANTIGA[c]) ?? causaPorChave(c)?.naTese ?? reserva;
function moldeTeseAntigo(r: Rascunho): string {
  const a = naTeseAntiga(r.causaA, 'de [causa A]');
  const b = naTeseAntiga(r.causaB, 'de [causa B]');
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
