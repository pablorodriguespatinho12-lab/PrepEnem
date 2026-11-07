'use client';
// Redações-modelo comentadas: o aluno escolhe um tema e lê a redação parte
// por parte, com cada trecho marcado pelo papel que cumpre na nota.

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, PenTool } from 'lucide-react';
import { MODELOS, ORDEM_PARTES, ROTULO_PARTE } from '@/data/redacao/modelos';
import { ModeloComentado } from '@/components/redacao/modelo-comentado';
import { AutorEmTemas } from '@/components/redacao/autor-em-temas';

export default function RedacaoModelosPage() {
  const [id, setId] = useState(MODELOS[0].id);
  const modelo = MODELOS.find((m) => m.id === id) ?? MODELOS[0];

  return (
    <div className="p-4 md:p-8 max-w-[52rem] mx-auto">
      <Link href="/redacao" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-4">
        <ChevronLeft className="w-4 h-4" /> Redação
      </Link>
      <h1 className="font-display type-headline font-bold mb-2">Redações-modelo comentadas</h1>
      <p className="type-meta text-muted-foreground mb-6 measure-reading">
        Textos escritos para estudo, sobre temas reais do ENEM. Cada número mostra o que o trecho faz na nota: repertório, tese,
        operador, elementos da proposta. São modelos de estrutura, não para decorar: o repertório que funciona é o que você consegue explicar.
      </p>

      <div role="tablist" aria-label="Temas" className="flex flex-wrap gap-2 mb-6">
        {MODELOS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === id}
            onClick={() => setId(m.id)}
            className={`px-3 py-1.5 rounded-[var(--radius-control)] border type-meta t-colors ${m.id === id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
          >
            <span data-numeric>{m.trio ? `Trio ${m.trio} · ${m.rotulo ?? m.anoEnem}` : `ENEM ${m.anoEnem}`}</span>
          </button>
        ))}
      </div>

      {modelo.trio && (
        <div className="mb-6">
          <AutorEmTemas trio={modelo.trio} modeloAtualId={modelo.id} onEscolherModelo={setId} />
        </div>
      )}

      <article className="space-y-6" aria-labelledby="tema-modelo">
        <header className="surface-1 rounded-[var(--radius-surface)] p-5">
          <p className="type-caption text-muted-foreground mb-1" data-numeric>Tema · ENEM {modelo.anoEnem}</p>
          <h2 id="tema-modelo" className="font-display type-lead font-semibold">{modelo.tema}</h2>
          <p className="type-meta text-muted-foreground mt-2 measure-reading">{modelo.contexto}</p>
        </header>
        {ORDEM_PARTES.map((parte) => (
          <section key={parte} className="surface-1 rounded-[var(--radius-surface)] p-6" aria-labelledby={`parte-${parte}`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 id={`parte-${parte}`} className="font-display type-body font-semibold">{ROTULO_PARTE[parte]}</h3>
              <Link href="/redacao/partes"
                className="inline-flex items-center gap-1.5 type-meta text-primary-text font-medium hover:underline underline-offset-4">
                <PenTool className="w-4 h-4" /> Treinar com a receita
              </Link>
            </div>
            <ModeloComentado parte={modelo.partes[parte]} />
          </section>
        ))}
      </article>
    </div>
  );
}
