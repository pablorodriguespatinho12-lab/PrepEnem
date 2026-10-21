// Segunda IA conferindo a explicação antes de guardar (Pablo, 21/10/2026: "não
// pode falhar"; em 11 explicações reais, 1 tinha erro de conteúdo: "núcleo
// poligênico" no lugar de núcleos polares). O código já garante a forma
// (validar.ts); erro de ciência só outra leitura pega. O verificador é um
// modelo DIFERENTE do gerador: erra em lugares diferentes (ia-modelos.ts).
// Roda dentro do cache: cada questão é conferida uma vez, depois fica guardada.
import type { ResultadoIA } from '@/lib/pedir-json';
import type { Explicacao } from './validar';

export type ErroDeConteudo = { trecho: string; correcao: string };

const MAX_ERROS = 5;
const MAX_TRECHO = 200;

const texto = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, MAX_TRECHO) : null;

/* {"erros": [...]}; lista vazia é uma resposta válida: nada a corrigir. */
export function validarConferencia(bruto: unknown): ErroDeConteudo[] | null {
  const erros = (bruto as { erros?: unknown } | null)?.erros;
  if (!Array.isArray(erros)) return null;
  return erros
    .map((e) => ({ trecho: texto(e?.trecho), correcao: texto(e?.correcao) }))
    .filter((e): e is ErroDeConteudo => e.trecho !== null && e.correcao !== null)
    .slice(0, MAX_ERROS);
}

/* Tudo o que o aluno lê, em texto corrido; o desenho vai como JSON (é onde
   fica a conta do quadro). */
export function textoParaConferir(e: Explicacao): string {
  return [
    `Ideia: ${e.ideia}`,
    ...e.pecas.map((p) => `Peça: ${p.termo}: ${p.significado}`),
    ...e.passos.map((p, i) => `Passo ${i + 1}, ${p.titulo}: ${p.texto}${p.visual ? `\nDesenho: ${JSON.stringify(p.visual)}` : ''}`),
    e.seuErro ? `Seu erro: ${e.seuErro}` : '',
    e.checagem ? `Checagem: ${e.checagem.pergunta} → ${e.checagem.resposta}` : '',
  ].filter(Boolean).join('\n');
}

export function promptConferencia(questao: string, e: Explicacao): string {
  return `Você é professor de ensino médio revisando a explicação de uma questão do ENEM antes de ela ir para um aluno.
Aponte SÓ erro de conteúdo: fato científico errado, termo técnico trocado (ex.: "núcleo poligênico" no lugar de "núcleos polares"; "espermatozoide" em planta com flor, que tem núcleo espermático), conta errada, número que não bate com o enunciado, ou algo que contradiz a alternativa correta.
NÃO aponte estilo, tamanho, escolha de palavras simples, simplificação didática correta nem o que faltou dizer.
Na dúvida, não aponte: só o que você tem certeza de que está errado.

Devolva SOMENTE JSON: {"erros": [{"trecho": "o pedaço errado, copiado da explicação", "correcao": "o certo, curto"}]}. Sem erro: {"erros": []}.

QUESTÃO
${questao}

EXPLICAÇÃO
${textoParaConferir(e)}`;
}

export function promptCorrecao(prompt: string, erros: ErroDeConteudo[]): string {
  return `${prompt}

REVISÃO: um professor achou estes erros de conteúdo numa primeira versão. Não os repita:
${erros.map((e) => `- "${e.trecho}" → ${e.correcao}`).join('\n')}`;
}

/* O verificador às vezes copia o rótulo de textoParaConferir junto do trecho
   ("Peça: estaca: Trocado de planta..."): o rótulo não está no campo. */
const ROTULO = /^(Ideia|Seu erro|Checagem|Peça: [^:]{1,60}|Passo \d+, [^:]{1,80}):\s*/;
const semRotulo = (t: string): string => t.replace(ROTULO, '');

/* "Correta: C" no trecho é sobre o gabarito da QUESTÃO (vem do enunciado
   mandado ao verificador), não da explicação: gerar de novo não conserta.
   No teste de 21/10/2026 esse alarme achou gabarito errado no banco. */
const SOBRE_O_GABARITO = /^Correta:/i;

type Campos = Pick<Explicacao, 'ideia' | 'pecas' | 'passos' | 'seuErro' | 'checagem'>;

function trocarEmTudo(e: Explicacao, de: string, para: string): Explicacao {
  const t = (s: string) => s.split(de).join(para);
  const campos: Campos = {
    ideia: t(e.ideia),
    pecas: e.pecas.map((p) => ({ termo: t(p.termo), significado: t(p.significado) })),
    passos: e.passos.map((p) => ({ ...p, titulo: t(p.titulo), texto: t(p.texto) })),
    seuErro: e.seuErro === null ? null : t(e.seuErro),
    checagem: e.checagem && { pergunta: t(e.checagem.pergunta), resposta: t(e.checagem.resposta) },
  };
  return { ...e, ...campos };
}

/* Troca cada trecho errado pelo certo, direto no texto: não gasta cota e não
   falha (no teste de 50 questões, 2 de 5 erros reais ficaram sem correção
   porque a geração nova bateu no limite da IA). O que não está no texto (ex.:
   número dentro do desenho) volta em `faltaram`. */
export function aplicarCorrecoes(e: Explicacao, erros: ErroDeConteudo[]): { explicacao: Explicacao; faltaram: ErroDeConteudo[] } {
  return erros.reduce<{ explicacao: Explicacao; faltaram: ErroDeConteudo[] }>((acc, erro) => {
    const de = semRotulo(erro.trecho);
    const para = semRotulo(erro.correcao);
    const nova = trocarEmTudo(acc.explicacao, de, para);
    const achou = JSON.stringify(nova) !== JSON.stringify(acc.explicacao);
    return achou ? { ...acc, explicacao: nova } : { ...acc, faltaram: [...acc.faltaram, erro] };
  }, { explicacao: e, faltaram: [] });
}

type Gerar = (prompt: string) => Promise<ResultadoIA<Explicacao>>;
type Conferir = (primeira: Explicacao) => Promise<ResultadoIA<ErroDeConteudo[]>>;

/* Gera e confere. Erro achado: troca o trecho direto; só gera de novo (com os
   erros no prompt) se algum trecho não estava no texto. Nunca piora o que o
   aluno vê: verificador fora do ar devolve a primeira; geração nova que falha
   devolve a versão com as trocas que deram certo. */
export async function explicarConferido(prompt: string, gerar: Gerar, conferir: Conferir): Promise<ResultadoIA<Explicacao>> {
  const primeira = await gerar(prompt);
  if (!primeira.ok) return primeira;
  const conferencia = await conferir(primeira.dado);
  if (!conferencia.ok) return primeira;
  const erros = conferencia.dado.filter((e) => !SOBRE_O_GABARITO.test(e.trecho));
  if (erros.length === 0) return primeira;
  const { explicacao: trocada, faltaram } = aplicarCorrecoes(primeira.dado, erros);
  if (faltaram.length === 0) return { ok: true, dado: trocada };
  const gerada = await gerar(promptCorrecao(prompt, erros));
  return gerada.ok ? gerada : { ok: true, dado: trocada };
}
