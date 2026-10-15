// Resumo de revisão antes do treino: por assunto do cronograma, o que precisa
// saber antes, o que o assunto é (sigla por extenso), a ideia, como o
// raciocínio foi construído (com desenho) e a regra no fim, como resumo.
// Pablo, 07/10/2026: "não me falou o que é MRU" e "não consigo entender soma
// de frações se não sei soma": o pré-requisito vem primeiro, na tela.

import { FORMATO_VISUAL_PARA_IA, validarVisual, type Visual } from '@/lib/visual/especificacao';

export interface ResumoAssunto {
  materia: string;
  subtema: string;
  /* O que o assunto é, em uma frase, com a sigla por extenso. */
  oQueE: string;
  /* O que precisa saber antes (pré-requisito), 0 a 2 passos curtos. */
  antes: { titulo: string; texto: string; visual: Visual | null }[];
  ideia: string;
  construcao: { titulo: string; texto: string; visual: Visual | null }[];
  regra: string;
  dicaEnem: string;
}

const MAX_ASSUNTOS = 8;

export function promptResumo(assuntos: { materia: string; subtema: string }[]): string {
  const lista = assuntos.slice(0, MAX_ASSUNTOS).map((a, i) => `${i + 1}. ${a.materia} — ${a.subtema}`).join('\n');
  return `Você é um professor preparando um aluno para o ENEM. Antes das questões, ele revisa os assuntos abaixo. Ele tem TDAH e quer ENTENDER COMO O RACIOCÍNIO FOI CONSTRUÍDO, não decorar fórmula: se esquecer a fórmula, precisa conseguir reconstruí-la pelo raciocínio.

ASSUNTOS:
${lista}

Para CADA assunto:
- "oQueE": uma frase dizendo o que o assunto É, como para quem nunca ouviu falar. Sigla sempre por extenso ("MRU (Movimento Retilíneo Uniforme) é andar em linha reta sempre na mesma velocidade").
- "antes": 1 ou 2 conceitos ANTERIORES que o aluno precisa saber para entender este, cada um com "titulo" e "texto" de até 2 frases simples (ex.: para "massa molar", antes vem "o que é mol"; para "soma de frações", antes vem "o que é fração"). Lista vazia só se o assunto não depende de nada.
- "ideia": uma frase, a ideia central, em palavras simples.
- "construcao": de 2 a 4 passos curtos (até 3 frases cada), do concreto ao símbolo: uma situação real → o desenho → a fórmula saindo do raciocínio. O passo do desenho TEM "visual" preenchido, sempre (gráfico, reta, transformação algébrica linha a linha, tabela ou vetores); em exatas, o passo em que a fórmula aparece usa o visual "quadro" (dados de um exemplo com números redondos, a fórmula, cada letra, os números no lugar das letras e o resultado: Pablo, 15/10/2026, "o quadro branco e a fórmula"); os outros, gráfico. O texto ao lado do desenho EXPLICA o que olhar nele e por quê ("a reta sobe 2 a cada segundo: isso é a aceleração"), nunca descreve o desenho ("gráfico mostrando uma reta..."), e o título diz a ideia, nunca "Desenho". Em química com átomo, molécula ou massa, use o desenho "molecula". Em humanas e linguagens, use tabela para comparar ou organizar. A situação real é concreta e do dia a dia (uma bicicleta, uma receita, uma conta de luz), nunca uma definição.
- "regra": a fórmula ou regra no fim, como resumo, dizendo o que cada símbolo significa.
- "dicaEnem": uma frase sobre como o assunto costuma aparecer no ENEM.

Confira cada conta e cada número do desenho. Zero emoji, zero elogio, nada de "É importante notar". LaTeX para matemática ($...$).

${FORMATO_VISUAL_PARA_IA}

Devolva SOMENTE JSON: {"resumos": [{"materia": "...", "subtema": "...", "oQueE": "...", "antes": [{"titulo": "...", "texto": "...", "visual": null}], "ideia": "...", "construcao": [{"titulo": "...", "texto": "...", "visual": null}], "regra": "...", "dicaEnem": "..."}]}`;
}

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const txt = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const passos = (v: unknown, max: number) => (Array.isArray(v) ? v : []).map(obj)
  .map((p) => ({ titulo: txt(p.titulo, 80), texto: txt(p.texto, 800), visual: validarVisual(p.visual) }))
  .filter((p) => p.titulo && p.texto)
  .slice(0, max);

export function validarResumos(bruto: unknown): ResumoAssunto[] | null {
  const lista = Array.isArray(obj(bruto).resumos) ? (obj(bruto).resumos as unknown[]) : [];
  const resumos = lista.map(obj).map((r) => ({
    materia: txt(r.materia, 40),
    subtema: txt(r.subtema, 120),
    oQueE: txt(r.oQueE, 300),
    antes: passos(r.antes, 2),
    ideia: txt(r.ideia, 400),
    construcao: passos(r.construcao, 4),
    regra: txt(r.regra, 600),
    dicaEnem: txt(r.dicaEnem, 400),
  })).filter((r) => r.materia && r.subtema && r.ideia && r.construcao.length > 0);
  return resumos.length > 0 ? resumos.slice(0, MAX_ASSUNTOS) : null;
}
