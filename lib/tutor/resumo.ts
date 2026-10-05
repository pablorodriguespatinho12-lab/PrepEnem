// Resumo de revisão antes do treino: por assunto do cronograma, a ideia, como
// o raciocínio foi construído (com desenho) e a regra no fim, como resumo.

import { FORMATO_VISUAL_PARA_IA, validarVisual, type Visual } from '@/lib/visual/especificacao';

export interface ResumoAssunto {
  materia: string;
  subtema: string;
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
- "ideia": uma frase, a ideia central, em palavras simples.
- "construcao": de 2 a 4 passos curtos (até 3 frases cada), do concreto ao símbolo: uma situação real → o desenho → a fórmula saindo do raciocínio. Use "visual" sempre que um desenho ajudar (gráfico, reta, transformação algébrica linha a linha, tabela, vetores). Em humanas e linguagens, use tabela para comparar ou organizar.
- "regra": a fórmula ou regra no fim, como resumo, dizendo o que cada símbolo significa.
- "dicaEnem": uma frase sobre como o assunto costuma aparecer no ENEM.

Confira cada conta e cada número do desenho. Zero emoji, zero elogio, nada de "É importante notar". LaTeX para matemática ($...$).

${FORMATO_VISUAL_PARA_IA}

Devolva SOMENTE JSON: {"resumos": [{"materia": "...", "subtema": "...", "ideia": "...", "construcao": [{"titulo": "...", "texto": "...", "visual": null}], "regra": "...", "dicaEnem": "..."}]}`;
}

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const txt = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validarResumos(bruto: unknown): ResumoAssunto[] | null {
  const lista = Array.isArray(obj(bruto).resumos) ? (obj(bruto).resumos as unknown[]) : [];
  const resumos = lista.map(obj).map((r) => ({
    materia: txt(r.materia, 40),
    subtema: txt(r.subtema, 120),
    ideia: txt(r.ideia, 400),
    construcao: (Array.isArray(r.construcao) ? r.construcao : []).map(obj)
      .map((p) => ({ titulo: txt(p.titulo, 80), texto: txt(p.texto, 800), visual: validarVisual(p.visual) }))
      .filter((p) => p.titulo && p.texto)
      .slice(0, 4),
    regra: txt(r.regra, 600),
    dicaEnem: txt(r.dicaEnem, 400),
  })).filter((r) => r.materia && r.subtema && r.ideia && r.construcao.length > 0);
  return resumos.length > 0 ? resumos.slice(0, MAX_ASSUNTOS) : null;
}
