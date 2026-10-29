// Ajuda enquanto escreve, no Treino por partes (Pablo, 29/10/2026: "quero que
// ele me mostre caminhos para eu progredir... onde eu estou, qual a minha
// próxima ação, como posso explicar isso ou aquilo"). Mudou a decisão de
// 27/10 ("treino por partes SEM IA"): a IA entra só aqui, a pedido do aluno.
//
// Regra do tutor (Bastani et al. 2025, lib/tutor/prompts.ts): IA que entrega
// a resposta piora o aprendizado. Por isso a IA dá o COMEÇO da frase e diz o
// que completar; nunca a frase inteira. O código conta as frases
// (lib/redacao/onde-estou.ts); qual FUNÇÃO do molde falta quem diz é a IA, em
// "fraseAgora", conferida aqui. Só contar dava "frase 3 de 4" para quem
// escreveu 2 frases fora do molde (aluno-do-zero, 29/10/2026).

import { autorPorNome, coringaPorNome } from './autores';
import { causaPorChave, moldeDaFrase, PARAGRAFOS, type ChaveCausa, type ChaveParagrafo } from './receita';
import { ondeEstou } from './onde-estou';
import { semPalavraChula } from '@/lib/tutor/validar';

export const LIMITE_TEXTO = 3000;
export const LIMITE_PERGUNTA = 400;
const MAX_CAMINHOS = 3;
const MAX_PALAVRAS_COMECO = 14;
/* "completar" diz o que pôr, não as palavras: comprido vira a frase pronta. */
const MAX_PALAVRAS_COMPLETAR = 16;

export interface PedidoAjuda {
  tema: string;
  paragrafo: ChaveParagrafo;
  texto: string;
  tese: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  pergunta: string;
}

export interface Caminho {
  /* O começo da frase, para ele continuar. */
  comeco: string;
  /* O que pôr depois do começo, em palavras simples. */
  completar: string;
}

export interface RespostaAjuda {
  proximaAcao: string;
  caminhos: Caminho[];
  /* Uma frase sobre o que ele já escreveu: o que falta ou o que está fora do
     molde. Vazia quando não há texto. */
  sobreOTexto: string;
  /* Resposta à pergunta livre ("como explico isso?"). Vazia sem pergunta. */
  resposta: string;
  /* Índice (0 = 1ª) da 1ª frase do molde que ainda não faz a sua função;
     igual ao total quando todas fazem. */
  fraseAgora: number;
}

const CAUSAS_VALIDAS: readonly ChaveCausa[] = ['estado', 'historia', 'acesso', 'estigma', 'mercado'];
const texto = (v: unknown, max: number): string => (typeof v === 'string' ? v.slice(0, max) : '');
const causa = (v: unknown): ChaveCausa | null => (CAUSAS_VALIDAS.includes(v as ChaveCausa) ? (v as ChaveCausa) : null);

/* Entrada do navegador: tudo conferido, nada confiado. */
export function lerPedidoAjuda(corpo: unknown): PedidoAjuda | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const c = corpo as Record<string, unknown>;
  const paragrafo = PARAGRAFOS.find((p) => p.chave === c.paragrafo)?.chave;
  const tema = texto(c.tema, 300).trim();
  if (!paragrafo || !tema) return null;
  return {
    tema,
    paragrafo,
    texto: texto(c.texto, LIMITE_TEXTO),
    tese: texto(c.tese, 600),
    causaA: causa(c.causaA),
    causaB: causa(c.causaB),
    pergunta: texto(c.pergunta, LIMITE_PERGUNTA).trim(),
  };
}

/* Autores dos motivos do parágrafo, com a ficha: a IA só sugere estes, e
   sempre com a ideia explicada (nome solto = repertório de bolso). */
function fichas(p: PedidoAjuda): string {
  const causas = p.paragrafo === 'introducao' ? [p.causaA, p.causaB] : p.paragrafo === 'desenvolvimento1' ? [p.causaA] : p.paragrafo === 'desenvolvimento2' ? [p.causaB] : [];
  /* Os coringas raros primeiro, com a frase que os liga ao motivo. */
  const raros = causas.flatMap((c) => (causaPorChave(c)?.coringas ?? []).map((nome) => {
    const k = coringaPorNome(nome);
    return k && c && k.amarra[c] ? `- [coringa, ${k.tipo}] ${k.rotulo}: "${k.texto}" (${k.fonte}, ${k.quando}). Ligação ao motivo: ${k.amarra[c]}` : null;
  })).filter((l): l is string => l !== null);
  const linhas = [...new Set([...raros, ...causas.flatMap((c) => causaPorChave(c)?.repertorios ?? []).map((nome) => {
    const a = autorPorNome(nome);
    return a ? `- ${a.nome}, "${a.obra}" (${a.ano}): ${a.ideia}` : `- ${nome}`;
  })])];
  return linhas.length > 0 ? linhas.join('\n') : '(nenhum: a conclusão não cita autor novo)';
}

export function promptAjuda(p: PedidoAjuda): string {
  const par = PARAGRAFOS.find((x) => x.chave === p.paragrafo)!;
  const onde = ondeEstou(p.texto, p.paragrafo, par.frases.length);
  const molde = par.frases.map((f, i) => `${i + 1}. ${f.funcao}: ${moldeDaFrase(p.paragrafo, i, p.tema, p.causaA, p.causaB)}`).join('\n');
  const agora = `Ele escreveu ${onde.completas} frase(s) com ponto final${onde.escrevendo ? ' e está no meio de outra (o pedaço sem ponto no fim)' : ''}. Ele escreve ${onde.total} frases neste parágrafo. Contar não basta: frase que não faz a função do molde não conta como feita.`;
  return `Você ajuda um aluno do ensino médio que está escrevendo uma redação do ENEM, parte por parte, seguindo um molde. Ele sabe pouco de redação. Fale simples, em português do Brasil, frases curtas, "você".

TEMA: ${p.tema}
PARÁGRAFO: ${par.titulo} (meta: ${par.linhasMin} a ${par.linhasMax} linhas)
MOTIVOS (causas) que ele escolheu: A = ${causaPorChave(p.causaA)?.nome ?? 'nenhum'}; B = ${causaPorChave(p.causaB)?.nome ?? 'nenhum'}
TESE DELE: ${p.tese || '(ainda sem tese)'}

MOLDE DO PARÁGRAFO (uma frase por função):
${molde}
${p.paragrafo === 'introducao' ? 'A frase 3 (tese) entra sozinha: ele escreve só as frases 1 e 2.\n' : ''}
ONDE ELE ESTÁ: ${agora}

AUTORES QUE ELE PODE USAR (só estes; ao sugerir um, diga a ideia dele; prefira os [coringa], frases e dados fáceis de decorar, e mostre como ligar ao tema; a frase do autor é exata, não mude as palavras dela):
${fichas(p)}

O QUE ELE JÁ ESCREVEU NESTE PARÁGRAFO:
"""
${p.texto.trim() || '(nada ainda)'}
"""
${p.pergunta ? `\nA PERGUNTA DELE: ${p.pergunta}\n` : ''}
REGRAS:
- "fraseAgora": o número (1 a ${onde.total}) da PRIMEIRA frase do molde que ainda não está feita do jeito certo no texto dele. Se a frase 1 dele não faz a função da frase 1, é 1, mesmo que ele tenha escrito mais. Se todas fazem a função, ${onde.total + 1}.
- "proximaAcao", "sobreOTexto" e os caminhos falam da MESMA frase de "fraseAgora". Se uma frase dele serve, diga qual ("sua 1ª frase já faz o tópico frasal"). Se precisa trocar, diga o que trocar, sem mandar apagar tudo.
- NUNCA escreva a frase inteira por ele. Dê só o COMEÇO (até ${MAX_PALAVRAS_COMECO} palavras) e diga em "completar" O QUE ele põe depois, com palavras suas de instrução (até ${MAX_PALAVRAS_COMPLETAR} palavras, ex.: "um caso de alguém chamado de fraco por ter depressão"), nunca o resto da frase escrito.
- Palavras simples: nada de "desmistificar", "incentivos fiscais", "sob essa ótica" sem explicar.
- Os caminhos são para a frase de "fraseAgora" (ou para revisar, se todas estão feitas). De 2 a ${MAX_CAMINHOS} caminhos, diferentes entre si: outro autor, outro exemplo, outro conectivo.
- Nunca invente número, data, lei ou pesquisa. Se um dado ajudaria, diga "procure um dado sobre..." em "completar", sem número.
- Use as palavras do tema e dos motivos dele. Sem elogio, sem "ótimo", sem emoji, sem "é importante notar".
- "sobreOTexto": 1 frase sobre o que ele já escreveu: o que está fora da função do molde ou o que falta. Vazio se ele não escreveu nada.
- "resposta": se ele fez uma pergunta, responda em 2 a 4 frases curtas, com um exemplo ligado ao tema. Sem pergunta, vazio.

Devolva SOMENTE este JSON:
{"fraseAgora": <número>, "proximaAcao": "<o que fazer agora>", "caminhos": [{"comeco": "<começo da frase>", "completar": "<instrução do que pôr depois>"}], "sobreOTexto": "<...>", "resposta": "<...>"}`;
}

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/gu;
const limpar = (v: unknown, max: number): string => semPalavraChula(texto(v, max).replace(EMOJI, '').replace(/\s+/g, ' ').trim());
const ELOGIO = /^(ótimo|muito bem|parabéns|excelente|boa)[,!.\s]+/i;
/* A IA às vezes copia o rótulo do formato ("1 frase: ..."). */
const ROTULO = /^\d+\s*frases?\s*:\s*/i;

const cortarPalavras = (s: string, max: number): string => {
  const p = s.split(' ').filter(Boolean);
  return p.length > max ? `${p.slice(0, max).join(' ').replace(/[,;:]$/, '')}...` : s;
};
/* A IA diz 1..total+1; fora disso (ou sem número), fica a contagem do código.
   Nunca além do que ele escreveu: quem escreveu 1 frase não está na 3ª. */
function lerFraseAgora(v: unknown, p: PedidoAjuda): number {
  const par = PARAGRAFOS.find((x) => x.chave === p.paragrafo)!;
  const onde = ondeEstou(p.texto, p.paragrafo, par.frases.length);
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > onde.total + 1) return onde.atual;
  return Math.min(n - 1, onde.atual);
}
/* O código garante o que o prompt pede: começo curto, sem número inventado
   (número só vale se já está no texto do aluno, no tema ou na ficha de um
   autor), sem elogio. */
export function validarAjuda(bruto: unknown, pedido: PedidoAjuda): RespostaAjuda | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const b = bruto as Record<string, unknown>;
  const proximaAcao = limpar(b.proximaAcao, 300).replace(ROTULO, '').replace(ELOGIO, '').replace(/^\p{Ll}/u, (l) => l.toUpperCase());
  if (!proximaAcao) return null;
  const permitidos = new Set(`${pedido.texto} ${pedido.tema} ${fichas(pedido)}`.match(/\d+/g) ?? []);
  const inventaNumero = (s: string) => (s.match(/\d+/g) ?? []).some((n) => !permitidos.has(n));
  const caminhos = (Array.isArray(b.caminhos) ? b.caminhos : [])
    .map((c): Caminho => {
      const o = (c && typeof c === 'object' ? c : {}) as Record<string, unknown>;
      const palavras = limpar(o.comeco, 200).split(' ').filter(Boolean);
      const comeco = palavras.slice(0, MAX_PALAVRAS_COMECO).join(' ');
      return { comeco: palavras.length > MAX_PALAVRAS_COMECO ? `${comeco}...` : comeco, completar: cortarPalavras(limpar(o.completar, 240), MAX_PALAVRAS_COMPLETAR) };
    })
    .filter((c) => c.comeco && c.completar && !inventaNumero(c.comeco) && !inventaNumero(c.completar))
    .slice(0, MAX_CAMINHOS);
  if (caminhos.length === 0) return null;
  return {
    fraseAgora: lerFraseAgora(b.fraseAgora, pedido),
    proximaAcao,
    caminhos,
    sobreOTexto: pedido.texto.trim() ? limpar(b.sobreOTexto, 300).replace(ELOGIO, '') : '',
    /* Na resposta livre, a frase com número inventado sai; o resto fica. */
    resposta: pedido.pergunta
      ? limpar(b.resposta, 900).split(/(?<=[.!?])\s+/).filter((f) => !inventaNumero(f)).join(' ')
      : '',
  };
}
