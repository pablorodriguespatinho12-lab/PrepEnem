'use client';
// Passo 1: escolher um tema que já existe ou digitar um livre.

import { useEffect, useState } from 'react';
import { CabecalhoPasso } from './pecas';

interface Tema { id: string; tema: string; anoEnem: number | null }

export function PassoTema({ tema, aoMudar }: { tema: string; aoMudar: (t: string) => void }) {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch('/api/redacao/themes')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (vivo) setTemas(Array.isArray(d?.themes) ? d.themes : []); })
      .catch(() => { if (vivo) setErro(true); });
    return () => { vivo = false; };
  }, []);

  return (
    <div>
      <CabecalhoPasso titulo="Tema" instrucao="Escolha um tema da lista ou digite outro." />
      <label htmlFor="tema-livre" className="type-meta font-semibold block mb-2">Tema</label>
      <input
        id="tema-livre"
        value={tema}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder="Digite o tema"
        className="block w-full rounded-[var(--radius-control)] border border-muted-foreground bg-[hsl(var(--surface-2))] px-4 py-3 type-body placeholder:text-muted-foreground focus:outline-none mb-5"
      />
      {erro && <p className="type-meta text-muted-foreground">Não deu para carregar a lista. Digite o tema acima.</p>}
      {temas.length > 0 && (
        <ul className="space-y-2" aria-label="Temas de provas anteriores">
          {temas.map((t) => {
            const escolhido = t.tema === tema;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => aoMudar(t.tema)}
                  aria-pressed={escolhido}
                  className="w-full text-left rounded-[var(--radius-control)] border px-4 py-3 t-colors hover:bg-muted"
                  style={escolhido ? { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)' } : undefined}
                >
                  {t.anoEnem && <span data-numeric className="type-meta text-muted-foreground mr-2">{t.anoEnem}</span>}
                  <span className="type-meta font-medium">{t.tema}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
