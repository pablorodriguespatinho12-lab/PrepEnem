// Valida uma lição (escrita ou gerada pela IA). Lição gerada que não passa
// aqui não é salva nem mostrada: melhor "tente de novo" do que conteúdo torto.

import { validarVisual } from '@/lib/visual/especificacao';
import type { ConteudoLicao, Exercicio, ExemploResolvido, PassoResolvido, Resposta } from './tipos';
import { conferirGabarito } from './conferir';

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
  const bruta = validarResposta(l.resposta);
  // A resposta da lacuna tem de bater com o próprio passo; se não bater, o
  // passo fica sem lacuna (vira passo resolvido) em vez de cobrar errado.
  const conferida = bruta ? conferirGabarito(bruta, texto) : null;
  return pergunta && conferida ? { texto, porque, lacuna: { pergunta, resposta: conferida.resposta } } : { texto, porque };
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
  // Gabarito conferido contra o fim da resolução (lib/calculo/conferir.ts).
  // A resolução inteira: o x do vértice sai num passo e o y no seguinte.
  const fim = resolucao.map((p) => p.texto).join(' ');
  const conferida = conferirGabarito(resposta, fim);
  if (!conferida) return null;
  return { enunciado, visual: validarVisual(e.visual), resposta: conferida.resposta, dica: txt(e.dica, 400) ?? 'Releia o resumo da lição.', resolucao };
}

/* Exige a estrutura da lição: construção, 3 exemplos com o fading (o 1º sem
   lacuna, os seguintes com lacunas) e pelo menos 3 exercícios. */
/* `motivos`, se passado, recebe por que a lição foi recusada (vai para o log). */
export function validarLicao(bruto: unknown, motivos: string[] = []): ConteudoLicao | null {
  const l = obj(bruto);
  const g = obj(l.gancho);
  const gancho = { pergunta: txt(g.pergunta, 600), ideia: txt(g.ideia, 800) };
  const construcao = lista(l.construcao).map(obj)
    .map((p) => ({ titulo: txt(p.titulo, 80), texto: txt(p.texto), visual: validarVisual(p.visual) }))
    .filter((p): p is { titulo: string; texto: string; visual: ReturnType<typeof validarVisual> } => p.titulo !== null && p.texto !== null)
    .slice(0, 8);
  const exemplosBrutos = lista(l.exemplos).map(exemplo).filter(naoNulo).slice(0, 3);
  // O 1º exemplo é o resolvido inteiro: lacuna nele é descartada (a IA às
  // vezes põe uma), em vez de jogar fora a lição toda.
  const exemplos: ExemploResolvido[] = exemplosBrutos.map((e, i) =>
    i === 0 ? { ...e, passos: e.passos.map((p) => ({ texto: p.texto, porque: p.porque })) } : e);
  const exercicios = lista(l.exercicios).map(exercicio).filter(naoNulo).slice(0, 8);
  const r = obj(l.recuperacao);
  const resumo = txt(l.resumo, 800);
  const recuperacao = { pergunta: txt(r.pergunta, 400), resposta: txt(r.resposta, 600) };

  const recusar = (motivo: string) => { motivos.push(motivo); return null; };
  if (!gancho.pergunta || !gancho.ideia || !resumo || !recuperacao.pergunta || !recuperacao.resposta) return recusar('falta gancho, resumo ou recuperação');
  if (construcao.length < 3 || exemplos.length < 3 || exercicios.length < 3) {
    return recusar(`poucos itens válidos: construção ${construcao.length}, exemplos ${exemplos.length}, exercícios ${exercicios.length} (de ${lista(l.exercicios).length}; os sem gabarito conferido caem)`);
  }
  const lacunas = exemplos.map((e) => e.passos.filter((p) => p.lacuna).length);
  // Fading: o 1º sem lacuna (garantido acima) e ao menos um dos outros com
  // lacuna. A IA às vezes esquece as do 3º; perder a lição toda por isso é pior.
  if (lacunas[0] !== 0 || lacunas[1] + lacunas[2] < 1) return recusar(`exemplos sem lacuna conferida: ${lacunas.join('/')}`);

  return {
    gancho: { pergunta: gancho.pergunta, ideia: gancho.ideia },
    construcao,
    resumo,
    exemplos,
    exercicios,
    recuperacao: { pergunta: recuperacao.pergunta, resposta: recuperacao.resposta },
  };
}
