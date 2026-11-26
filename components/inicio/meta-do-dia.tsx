'use client';
import { useEffect, useState } from 'react';
import { OPCOES_DA_META, guardarMeta, lerMeta, META_PADRAO, progressoDaMeta } from '@/lib/meta-provas';

/* Meta de provas do dia (Pablo, 21/11/2026: "umas 2 provas por dia"). Botões 1 a 4
   trocam a meta (nunca controle deslizante). Sem contagem regressiva de prova. */
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

  const p = progressoDaMeta(feitas ?? 0, meta);
  const escolher = (valor: number) => { setMeta(valor); guardarMeta(valor); };

  return (
    <section aria-labelledby="meta-do-dia" className="m-cartao m-col5">
      <h2 id="meta-do-dia">Meta de hoje</h2>
      <div className="m-numero px" data-numeric aria-live="polite">
        {feitas === null ? '–' : p.feitas}<span style={{ color: 'var(--m-mut)' }} className="px m-numero"> / {p.meta}</span>
      </div>
      <div className="m-trilha" aria-hidden>
        <i style={{ transform: `scaleX(${feitas === null ? 0 : Math.min(1, p.feitas / p.meta)})` }} />
      </div>
      <p className="m-mut">{feitas !== null && p.bateu ? 'Meta feita' : 'provas terminadas'}</p>
      <div className="m-metas" role="group" aria-label="Meta de provas por dia">
        {OPCOES_DA_META.map((n) => (
          <button key={n} type="button" onClick={() => escolher(n)} aria-pressed={meta === n} className="m-sec">
            {n}
          </button>
        ))}
      </div>
    </section>
  );
}
