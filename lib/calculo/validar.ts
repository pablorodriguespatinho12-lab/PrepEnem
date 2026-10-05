// Valida uma lição (escrita ou gerada pela IA). Lição gerada que não passa
// aqui não é salva nem mostrada: melhor "tente de novo" do que conteúdo torto.

import { validarVisual } from '@/lib/visual/especificacao';
import type { ConteudoLicao, Exercicio, ExemploResolvido, PassoResolvido, Resposta } from './tipos';

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const txt = (v: unknown, max = 1200): string | null => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const naoNulo = <T,>(v: T | null): v is T => v !== null;

export function validarResposta(bruto: unknown): Resposta | null {
  const r = obj(bruto);
  if (r.tipo === 'numero') {
    const valor = typeof r.valor === 'number' ? r.valor : Number(r.valor);
    if (!Number.isFinite(valor)) return null;
    const tol = typeof r.tolerancia === 'number' && r.tolerancia > 0 ? r.tolerancia : undefined;
    return tol ? { tipo: 'numero', valor, tolerancia: tol } : { tipo: 'numero', valor };
  }
  if (r.tipo === 'escolha') {
    const opcoes = lista(r.opcoes).map((o) => txt(o, 200)).filter(naoNulo);
    const correta = Number(r.correta);
    if (opcoes.length < 2 || !Number.isInteger(correta) || correta < 0 || correta >= opcoes.length) return null;
    return { tipo: 'escolha', opcoes, correta };
  }
  return null;
}

function passoResolvido(bruto: unknown): PassoResolvido | null {
  const p = obj(bruto);
  const texto = txt(p.texto);
  const porque = txt(p.porque, 600);
  if (!texto || !porque) return null;
  const l = obj(p.lacuna);
  const pergunta = txt(l.pergunta, 300);
  const resposta = validarResposta(l.resposta);
  return pergunta && resposta ? { texto, porque, lacuna: { pergunta, resposta } } : { texto, porque };
}

function exemplo(bruto: unknown): ExemploResolvido | null {
  const e = obj(bruto);
  const enunciado = txt(e.enunciado);
  const passos = lista(e.passos).map(passoResolvido).filter(naoNulo).slice(0, 8);
  return enunciado && passos.length >= 2 ? { enunciado, visual: validarVisual(e.visual), passos } : null;
}

function exercicio(bruto: unknown): Exercicio | null {
  const e = obj(bruto);
  const enunciado = txt(e.enunciado);
  const resposta = validarResposta(e.resposta);
  const resolucao = lista(e.resolucao).map(obj)
    .map((p) => ({ texto: txt(p.texto), porque: txt(p.porque, 600) }))
    .filter((p): p is { texto: string; porque: string } => p.texto !== null && p.porque !== null);
  if (!enunciado || !resposta || resolucao.length === 0) return null;
  return { enunciado, visual: validarVisual(e.visual), resposta, dica: txt(e.dica, 400) ?? 'Releia o resumo da lição.', resolucao };
}

/* Exige a estrutura da lição: construção, 3 exemplos com o fading (o 1º sem
   lacuna, os seguintes com lacunas) e pelo menos 3 exercícios. */
export function validarLicao(bruto: unknown): ConteudoLicao | null {
  const l = obj(bruto);
  const g = obj(l.gancho);
  const gancho = { pergunta: txt(g.pergunta, 600), ideia: txt(g.ideia, 800) };
  const construcao = lista(l.construcao).map(obj)
    .map((p) => ({ titulo: txt(p.titulo, 80), texto: txt(p.texto), visual: validarVisual(p.visual) }))
    .filter((p): p is { titulo: string; texto: string; visual: ReturnType<typeof validarVisual> } => p.titulo !== null && p.texto !== null)
    .slice(0, 8);
  const exemplos = lista(l.exemplos).map(exemplo).filter(naoNulo).slice(0, 3);
  const exercicios = lista(l.exercicios).map(exercicio).filter(naoNulo).slice(0, 8);
  const r = obj(l.recuperacao);
  const resumo = txt(l.resumo, 800);
  const recuperacao = { pergunta: txt(r.pergunta, 400), resposta: txt(r.resposta, 600) };

  if (!gancho.pergunta || !gancho.ideia || !resumo || !recuperacao.pergunta || !recuperacao.resposta) return null;
  if (construcao.length < 3 || exemplos.length < 3 || exercicios.length < 3) return null;
  const lacunas = exemplos.map((e) => e.passos.filter((p) => p.lacuna).length);
  if (lacunas[0] !== 0 || lacunas[1] < 1 || lacunas[2] < 1) return null;

  return {
    gancho: { pergunta: gancho.pergunta, ideia: gancho.ideia },
    construcao,
    resumo,
    exemplos,
    exercicios,
    recuperacao: { pergunta: recuperacao.pergunta, resposta: recuperacao.resposta },
  };
}
