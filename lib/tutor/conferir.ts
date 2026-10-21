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

type Gerar = (prompt: string) => Promise<ResultadoIA<Explicacao>>;
type Conferir = (primeira: Explicacao) => Promise<ResultadoIA<ErroDeConteudo[]>>;

/* Gera, confere e, se o verificador achou erro, gera de novo com os erros no
   prompt. Nunca piora o que o aluno vê: verificador fora do ar ou correção
   que falha devolvem a primeira versão. */
export async function explicarConferido(prompt: string, gerar: Gerar, conferir: Conferir): Promise<ResultadoIA<Explicacao>> {
  const primeira = await gerar(prompt);
  if (!primeira.ok) return primeira;
  const conferencia = await conferir(primeira.dado);
  if (!conferencia.ok || conferencia.dado.length === 0) return primeira;
  const corrigida = await gerar(promptCorrecao(prompt, conferencia.dado));
  return corrigida.ok ? corrigida : primeira;
}
