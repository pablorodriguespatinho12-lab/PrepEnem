'use client';
// Cartão de conceito antes da primeira questão de um assunto novo (ver
// lib/conceito-antes.ts). Mesmo formato da Revisão de Conceitos.

import { GraduationCap, Play } from 'lucide-react';
import { ConceitosDoDia } from './conceitos-do-dia';
import type { ResumoAssunto } from '@/lib/tutor/resumo';
import type { Assunto } from '@/lib/conceito-antes';

interface ConceitoAntesProps {
  assunto: Assunto;
  resumo: ResumoAssunto | null;
  carregando: boolean;
  cores: Record<string, string>;
  onSeguir: () => void;
}

export function ConceitoAntes({ assunto, resumo, carregando, cores, onSeguir }: ConceitoAntesProps) {
  return (
    <section aria-labelledby="conceito-antes-titulo" className="mb-8">
      <p className="type-meta text-muted-foreground mb-1">Assunto novo na próxima questão</p>
      <h2 id="conceito-antes-titulo" className="font-display type-title font-semibold flex items-center gap-2 mb-4">
        <GraduationCap className="w-6 h-6 text-primary-text" />
        {assunto.subtema}
      </h2>
      {carregando || !resumo ? (
        <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-4 animate-pulse" role="status" aria-label={`Preparando o conceito de ${assunto.subtema}`}>
          <div className="h-6 w-2/3 rounded bg-muted mb-5" />
          <div className="h-24 w-full rounded bg-muted mb-4" />
          <div className="h-3 w-5/6 rounded bg-muted" />
        </div>
      ) : (
        <ConceitosDoDia resumos={[resumo]} cores={cores} onComecar={onSeguir} rotuloFim="Ir para a questão" />
      )}
      <button type="button" onClick={onSeguir}
        className="mt-4 type-meta text-muted-foreground hover:text-foreground t-colors underline-offset-4 hover:underline inline-flex items-center gap-1.5">
        <Play className="w-3.5 h-3.5" /> Pular e ir para a questão
      </button>
    </section>
  );
}
