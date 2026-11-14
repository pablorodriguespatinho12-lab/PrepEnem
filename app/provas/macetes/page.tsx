'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import aulas from '@/data/revisao-final/dia-2/aulas.json';
import type { AulaDoTema } from '@/lib/aulas-dia-2';

// Os 22 macetes curinga numa tela (Pablo, 14/11/2026). Uma matéria por vez, em abas,
// para caber sem rolar muito; cada cartão: o nome, a regra e o exemplo.
const ORDEM = ['Química', 'Física', 'Biologia', 'Matemática'] as const;
const TODAS = aulas as unknown as Record<string, AulaDoTema>;

export default function MacetesPage() {
  const [materia, setMateria] = useState<(typeof ORDEM)[number]>('Química');
  const temas = Object.entries(TODAS).filter(([, a]) => a.materia === materia && a.macete);
  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <Link href="/provas" className="inline-flex items-center gap-1 type-meta text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4" /> Estudar
      </Link>
      <h1 className="font-display type-display font-semibold text-foreground">Macetes do dia 2</h1>
      <p className="text-muted-foreground mt-2 type-lead">Um macete por conteúdo. Serve da questão fácil até a do ENEM.</p>
      <div role="tablist" aria-label="Matéria" className="flex flex-wrap gap-2 my-6">
        {ORDEM.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={m === materia}
            onClick={() => setMateria(m)}
            className={`px-4 py-2 rounded-full type-meta font-medium t-colors ${m === materia ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary-text hover:bg-primary/15'}`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {temas.map(([tema, a]) => (
          <article key={tema} className="surface-1 rounded-[var(--radius-surface)] p-5 space-y-2">
            <p className="type-caption font-semibold uppercase tracking-[0.08em] text-primary-text">{tema}</p>
            <h2 className="font-display type-title font-semibold">{a.macete!.nome}</h2>
            <p className="font-reading type-body">{a.macete!.regra}</p>
            <p className="font-reading type-body rounded-[var(--radius-control)] bg-primary/10 px-3 py-2">
              <span className="font-semibold text-primary-text">Exemplo: </span>{a.macete!.exemplo}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
