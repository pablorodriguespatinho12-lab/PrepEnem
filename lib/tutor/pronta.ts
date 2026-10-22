// Explicação pronta: gerada antes, guardada no banco e revisada (Pablo,
// 22/10/2026: "já deixa várias prontas e você revisa"). A revisão automática
// procura os defeitos vistos no teste dos peixes; o que ela marca, eu leio.

import type { Explicacao } from './validar';

/* Sobe quando o formato da explicação muda: as prontas de versão velha
   deixam de ser usadas e o script gera de novo. 1 = passo a passo dos peixes. */
export const VERSAO_EXPLICACAO = 1;

const COM_CONTA = /matem|físic|fisic|químic|quimic/i;
const MIN_PASSOS_COM_CONTA = 4;
const MAX_TITULO_SUA_VEZ = 140;

const MIN_LETRAS_PALAVRA = 4;
/* Fração mínima das palavras do "Sua vez" que já estão no enunciado para
   contar como a mesma pergunta com outras palavras (respiração aeróbia,
   22/10/2026: "Qual etapa da respiração aeróbia gera mais ATP?"). */
const MESMA_PERGUNTA = 0.6;
const palavras = (t: string): string[] =>
  t.toLowerCase().split(/[^a-zà-ú0-9]+/i).filter((p) => p.length >= MIN_LETRAS_PALAVRA);
export function repeteAQuestao(pergunta: string, enunciado: string): boolean {
  const daPergunta = palavras(pergunta);
  if (daPergunta.length < 3) return false;
  const doEnunciado = new Set(palavras(enunciado));
  return daPergunta.filter((p) => doEnunciado.has(p)).length / daPergunta.length >= MESMA_PERGUNTA;
}

/* Lista do que está fora do formato aprovado. Vazia = passou. */
export function problemasDaExplicacao(e: Explicacao, enunciado: string, materia: string): string[] {
  const problemas: string[] = [];
  const comConta = COM_CONTA.test(materia);
  if (comConta && e.passos.length < MIN_PASSOS_COM_CONTA) problemas.push(`só ${e.passos.length} passos numa questão com conta`);
  if (comConta && !e.passos.some((p) => p.visual?.tipo === 'quadro')) problemas.push('sem o quadro do jeito rápido');
  if (!e.passos.some((p) => /resposta/i.test(p.titulo))) problemas.push('sem o passo "A resposta"');
  if (comConta && !e.passos.some((p) => /funciona|de onde/i.test(p.titulo))) problemas.push('sem o passo "Por que funciona"');
  if (/v[ée]rtice|pico|m[áa]xim/i.test(enunciado) && e.passos.some((p) => /complet\w* (o )?quadrado/i.test(p.texto))) {
    problemas.push('vértice por completar quadrado em vez do espelho');
  }
  const c = e.checagem;
  if (!c) problemas.push('sem "Sua vez"');
  else {
    if (!c.opcoes) problemas.push('"Sua vez" sem opções para tocar');
    if (c.pergunta.length > MAX_TITULO_SUA_VEZ) problemas.push('"Sua vez" comprida demais');
    if (repeteAQuestao(c.pergunta, enunciado)) problemas.push('"Sua vez" repete a própria questão');
  }
  return problemas;
}
