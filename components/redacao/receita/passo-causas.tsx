'use client';
// Passo 2: escolher 2 das 5 causas coringa. A 1ª vira o D1, a 2ª o D2.
// Tema da lista com dupla na receita: os 2 cartões ganham o selo "Sugerido"
// (e vêm pré-selecionados se nenhum motivo foi escolhido). Tocar de novo desmarca.

import { CAUSAS, causaPorChave, type ChaveCausa } from '@/lib/redacao/receita';
import { CabecalhoPasso } from './pecas';

const DESTAQUE = { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)' };
const SELO = { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' };

export function PassoCausas({ causaA, causaB, sugeridas, aoMudar }: {
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  sugeridas: ChaveCausa[];
  aoMudar: (a: ChaveCausa | null, b: ChaveCausa | null) => void;
}) {
  const tocar = (c: ChaveCausa) => {
    if (c === causaA) return aoMudar(causaB, null);
    if (c === causaB) return aoMudar(causaA, null);
    if (!causaA) return aoMudar(c, causaB);
    if (!causaB) return aoMudar(causaA, c);
    aoMudar(causaA, c);
  };
  return (
    <div>
      <CabecalhoPasso titulo="Por que esse problema existe?" instrucao="Escolha 2 motivos. Eles viram sua tese e os 2 parágrafos do meio." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {CAUSAS.map((c) => {
          const ordem = c.chave === causaA ? '1º motivo' : c.chave === causaB ? '2º motivo' : null;
          const sugerida = sugeridas.includes(c.chave);
          return (
            <li key={c.chave}>
              <button
                type="button"
                onClick={() => tocar(c.chave)}
                aria-pressed={ordem !== null}
                className="h-full w-full text-left rounded-[var(--radius-surface)] border p-4 t-colors hover:bg-muted"
                style={ordem ? DESTAQUE : undefined}
              >
                <span className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-display type-body font-semibold">{c.nome}</span>
                  {ordem && <span className="type-meta font-semibold rounded-[var(--radius-data)] px-2 py-0.5" style={SELO}>{ordem}</span>}
                </span>
                {sugerida && <span className="block type-caption font-semibold text-primary-text mb-2">Sugerido para este tema</span>}
                <span className="block type-caption font-semibold text-muted-foreground">Entra na tese:</span>
                <span className="block font-reading type-meta mb-2">{c.fraseDeTese}</span>
                <span className="block type-caption font-semibold text-muted-foreground">Autores para citar:</span>
                <span className="block type-meta">{c.repertorios.join(' · ')}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <MiniMapa causaA={causaA} causaB={causaB} />
    </div>
  );
}

/* Onde cada motivo vai parar na redação, preenchido ao escolher. */
function MiniMapa({ causaA, causaB }: { causaA: ChaveCausa | null; causaB: ChaveCausa | null }) {
  const linhas: [string, ChaveCausa | null, string][] = [['1º motivo', causaA, 'Desenvolvimento 1'], ['2º motivo', causaB, 'Desenvolvimento 2']];
  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-4 mt-5" aria-label="Para onde vai cada motivo">
      <ul className="space-y-1.5">
        {linhas.map(([ordem, causa, destino]) => (
          <li key={ordem} className="type-meta">
            <span className="font-semibold">{ordem}</span>
            <span className="text-muted-foreground">{causa ? ` (${causaPorChave(causa)?.nome})` : ' (escolha acima)'}</span>
            <span aria-hidden> → </span><span className="sr-only"> vai para o </span>{destino}
          </li>
        ))}
      </ul>
    </section>
  );
}
