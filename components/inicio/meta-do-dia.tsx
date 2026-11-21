'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OPCOES_DA_META, guardarMeta, lerMeta, META_PADRAO, progressoDaMeta } from '@/lib/meta-provas';

/* Meta de provas do dia (Pablo, 21/11/2026: "umas 2 provas por dia"). Quadradinhos cheios
   = provas terminadas hoje; botões 1 a 4 trocam a meta (nunca controle deslizante). Sem
   contagem regressiva de prova (regra dele). */
export function MetaDoDia() {
  const [meta, setMeta] = useState(META_PADRAO);
  const [feitas, setFeitas] = useState<number | null>(null);

  useEffect(() => {
    setMeta(lerMeta());
    let ativo = true;
    fetch('/api/provas/hoje')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (ativo && typeof d?.feitas === 'number') setFeitas(d.feitas); })
      .catch(() => {});
    return () => { ativo = false; };
  }, []);

  if (feitas === null) return null;
  const p = progressoDaMeta(feitas, meta);

  const escolher = (valor: number) => { setMeta(valor); guardarMeta(valor); };

  return (
    <section aria-labelledby="meta-do-dia" className="py-5 border-t border-border">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="meta-do-dia" className="type-meta font-medium text-foreground">Provas de hoje</h2>
        <span className="type-meta text-muted-foreground" aria-live="polite">
          {p.bateu ? 'Meta feita' : `${p.feitas} de ${p.meta}`}
        </span>
      </div>

      <div className="mt-3 flex gap-2" aria-hidden="true">
        {Array.from({ length: Math.max(p.meta, p.feitas) }, (_, i) => (
          <span
            key={i}
            className={`h-3 flex-1 rounded-sm transition-colors duration-300 ${i < p.feitas ? 'bg-primary' : 'bg-primary/15'}`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2" role="group" aria-label="Meta de provas por dia">
          <span className="type-meta text-muted-foreground">Meta</span>
          {OPCOES_DA_META.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => escolher(n)}
              aria-pressed={meta === n}
              className={`h-9 w-9 rounded-full type-meta font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                meta === n ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary-text'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {!p.bateu && (
          <Link href="/provas" className="type-meta font-medium text-primary-text">
            {p.feitas === 0 ? 'Fazer a 1ª' : `Falta${p.restam > 1 ? 'm' : ''} ${p.restam}`}
          </Link>
        )}
      </div>
    </section>
  );
}
