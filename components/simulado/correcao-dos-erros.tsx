'use client';
// Correção no fim do simulado: uma questão errada por vez, a explicação em passos
// já aberta ao lado. Antes o resultado só mandava para o Caderno de Erros, e o
// Pablo quer ver ali mesmo, logo que termina a prova (23/10/2026).

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { materiaColors } from '@/lib/theme-colors';
import { PaginaDaProva } from '@/components/pagina-da-prova';
import { ExplicacaoTutor, type QuestaoTutor } from '@/components/tutor/explicacao-tutor';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;

type QuestaoDoSimulado = QuestaoTutor & {
  id: string;
  pdfFileUrl?: string | null;
  paginaPdf?: number | null;
  imagemUrl?: string | null;
  imagemUrlExpandida?: string | null;
  dependeImagem?: boolean | null;
};

interface Props {
  questoes: QuestaoDoSimulado[];
  respostas: Record<string, string>;
}

function Alternativa({ letra, texto, certa, marcada }: { letra: string; texto: string; certa: boolean; marcada: boolean }) {
  const cor = certa ? 'success' : marcada ? 'danger' : null;
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-[var(--radius-control)] border"
      style={cor
        ? { backgroundColor: `hsl(var(--${cor}-surface))`, borderColor: `hsl(var(--${cor}-border))` }
        : { backgroundColor: 'hsl(var(--surface-2))', borderColor: 'hsl(var(--border))' }}
    >
      <span
        className="w-7 h-7 shrink-0 grid place-items-center rounded-[var(--radius-control)] type-meta font-semibold"
        style={cor ? { backgroundColor: `hsl(var(--${cor}))`, color: 'white' } : undefined}
      >
        {certa ? <Check className="w-4 h-4" aria-label="certa" /> : marcada ? <X className="w-4 h-4" aria-label="sua resposta" /> : letra}
      </span>
      <span className="font-reading type-body pt-0.5 flex-1"><MathText text={texto} /></span>
    </div>
  );
}

export function CorrecaoDosErros({ questoes, respostas }: Props) {
  const erradas = questoes.filter((q) => respostas[q.id] !== q.respostaCorreta);
  const [atual, setAtual] = useState(0);
  if (erradas.length === 0) return null;

  const q = erradas[atual];
  const dada = respostas[q.id] || null;
  const textos: Record<string, string> = {
    A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE,
  };

  return (
    <section aria-labelledby="correcao-titulo" className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id="correcao-titulo" className="font-display type-title font-semibold">
          Correção <span data-numeric className="type-meta text-muted-foreground font-sans font-normal">· errada {atual + 1} de {erradas.length}</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setAtual((i) => i - 1)}
            disabled={atual === 0}
            aria-label="Questão errada anterior"
            className="w-11 h-11 grid place-items-center rounded-[var(--radius-control)] bg-primary/10 text-primary-text t-colors hover:bg-primary/15 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setAtual((i) => i + 1)}
            disabled={atual === erradas.length - 1}
            aria-label="Próxima questão errada"
            className="w-11 h-11 grid place-items-center rounded-[var(--radius-control)] bg-primary text-primary-foreground t-colors hover:bg-[hsl(var(--primary-hover))] disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-start">
        {/* Chaves diferentes: irmãos com a mesma chave trocavam de coluna ao avançar. */}
        <div key={`questao-${q.id}`} className="surface-1 rounded-[var(--radius-surface)] p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 type-meta text-muted-foreground">
            <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: (materiaColors as Record<string, string>)[q.materia] ?? 'hsl(var(--muted-foreground))' }} />
            <span className="font-medium text-foreground">{q.materia}</span>
            {q.subtema && <><span aria-hidden className="text-border">/</span><span className="truncate">{q.subtema}</span></>}
          </div>
          <div className="prose-reading"><MathText text={q.enunciado} /></div>
          {q.pdfFileUrl && q.paginaPdf && (
            <PaginaDaProva
              pdfUrl={q.pdfFileUrl}
              pagina={q.paginaPdf}
              imagemUrl={q.imagemUrl}
              imagemUrlExpandida={q.imagemUrlExpandida}
              precisaDaImagem={Boolean(q.dependeImagem)}
            />
          )}
          {!dada && <p className="type-meta font-medium" style={{ color: 'hsl(var(--danger))' }}>Você deixou em branco.</p>}
          <div className="space-y-2">
            {LETRAS.map((l) => (
              <Alternativa key={l} letra={l} texto={textos[l] ?? ''} certa={l === q.respostaCorreta} marcada={l === dada} />
            ))}
          </div>
        </div>

        <ExplicacaoTutor key={`explicacao-${q.id}`} questao={q} respostaDada={dada} iniciarSozinha />
      </div>
    </section>
  );
}
