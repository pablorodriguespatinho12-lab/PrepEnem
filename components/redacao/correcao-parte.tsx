'use client';
// Correção de uma parte: cada item fixo cumprido ou não (com o trecho do aluno
// e o que fazer), desvios de norma, a parte reescrita mantendo as ideias dele
// e, por último, a mesma parte do modelo comentada para comparar.

import { Check, X } from 'lucide-react';
import type { CorrecaoParte } from '@/lib/redacao/correcao';
import type { ParteModelo } from '@/data/redacao/modelos';
import { ModeloComentado } from './modelo-comentado';
import { CorrigidaPor } from './correcao-completa';

export function CorrecaoParteView({ correcao, modelo }: { correcao: CorrecaoParte; modelo: ParteModelo | null }) {
  const cumpridos = correcao.itens.filter((i) => i.ok).length;
  return (
    <div className="space-y-6">
      <section className="surface-1 rounded-[var(--radius-surface)] p-6" aria-labelledby="itens-titulo">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h3 id="itens-titulo" className="font-display type-body font-semibold">O que a parte precisava ter</h3>
          <span data-numeric className="type-meta text-muted-foreground">{cumpridos} de {correcao.itens.length}</span>
        </div>
        <ul className="space-y-3">
          {correcao.itens.map((item) => (
            <li key={item.id} className="grid grid-cols-[1.5rem_1fr] gap-2">
              <span style={{ color: item.ok ? 'hsl(var(--success))' : 'hsl(var(--danger))' }} aria-label={item.ok ? 'cumprido' : 'faltou'}>
                {item.ok ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
              </span>
              <div>
                <p className="type-meta font-semibold">{item.rotulo}</p>
                {item.trecho && <p className="type-meta text-muted-foreground font-reading">&ldquo;{item.trecho}&rdquo;</p>}
                {!item.ok && item.comoMelhorar && <p className="type-meta mt-1">{item.comoMelhorar}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {correcao.desvios.length > 0 && (
        <section className="surface-1 rounded-[var(--radius-surface)] p-6" aria-labelledby="desvios-titulo">
          <h3 id="desvios-titulo" className="font-display type-body font-semibold mb-3">Desvios de norma <span data-numeric className="type-meta text-muted-foreground">({correcao.desvios.length})</span></h3>
          <ul className="space-y-2">
            {correcao.desvios.map((d, i) => (
              <li key={i} className="type-meta">
                <span className="line-through text-muted-foreground">{d.trecho}</span>{' '}
                <span className="font-semibold">{d.correcao}</span>{' '}
                <span className="text-muted-foreground">({d.tipo})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {correcao.reescrita && (
        <section className="surface-1 rounded-[var(--radius-surface)] p-6" aria-labelledby="reescrita-titulo">
          <h3 id="reescrita-titulo" className="font-display type-body font-semibold mb-1">Sua parte, ajustada</h3>
          <p className="type-meta text-muted-foreground mb-3">Mesmas ideias suas, com o que faltou.</p>
          <p className="font-reading text-body leading-[var(--lh-reading)] measure-reading whitespace-pre-wrap">{correcao.reescrita}</p>
        </section>
      )}

      {modelo && (
        <section className="surface-1 rounded-[var(--radius-surface)] p-6" aria-labelledby="modelo-titulo">
          <h3 id="modelo-titulo" className="font-display type-body font-semibold mb-1">Como o modelo fez</h3>
          <p className="type-meta text-muted-foreground mb-4">Cada número mostra o papel do trecho na nota.</p>
          <ModeloComentado parte={modelo} />
        </section>
      )}
      <CorrigidaPor modelo={correcao.corrigidaPor} />
    </div>
  );
}
