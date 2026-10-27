'use client';
// Passo 3: a tese já vem no molde com as causas escolhidas; o aluno edita.

import { causaPorChave, moldeTese, type ChaveCausa } from '@/lib/redacao/receita';
import { CabecalhoPasso, CaixaTexto } from './pecas';

export function PassoTese({ tese, causaA, causaB, aoMudar }: {
  tese: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  aoMudar: (t: string) => void;
}) {
  const molde = moldeTese(causaA, causaB);
  return (
    <div>
      <CabecalhoPasso titulo="Tese" instrucao="Ajuste a frase com as palavras do seu tema." />
      <div className="surface-1 rounded-[var(--radius-surface)] p-4 mb-5">
        <p className="type-caption font-semibold text-primary-text mb-1">Molde</p>
        <p className="font-reading type-body">Tal cenário decorre, sobretudo, de [causa A] e de [causa B].</p>
        <p className="type-meta text-muted-foreground mt-2">
          Causa A: {causaPorChave(causaA)?.nome ?? 'não escolhida'} · Causa B: {causaPorChave(causaB)?.nome ?? 'não escolhida'}
        </p>
      </div>
      <CaixaTexto id="tese" rotulo="Sua tese" valor={tese} aoMudar={aoMudar} placeholder={molde} />
    </div>
  );
}
