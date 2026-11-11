'use client';
// "O mesmo autor em 3 temas": um autor por vez (botões), com a fala que fica
// igual, a ligação que muda em cada redação pronta do trio e o molde.
// Tocar num tema abre a redação dele embaixo.

import { useState } from 'react';
import { autoresEmTemas } from '@/lib/redacao/trio-em-temas';
import type { NumeroDoTrio } from '@/lib/redacao/cartoes-trios';

interface AutorEmTemasProps {
  trio: NumeroDoTrio;
  modeloAtualId: string;
  onEscolherModelo: (id: string) => void;
}

export function AutorEmTemas({ trio, modeloAtualId, onEscolherModelo }: AutorEmTemasProps) {
  const autores = autoresEmTemas(trio);
  const [indice, setIndice] = useState(0);
  const atual = autores[Math.min(indice, autores.length - 1)];

  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-5 space-y-4" aria-labelledby="autor-em-temas">
      <div>
        <h2 id="autor-em-temas" className="font-display type-body font-semibold">Trio {trio}: o mesmo autor em {atual.usos.length} temas</h2>
        <p className="type-meta text-muted-foreground">A fala você decora 1 vez. Só a ligação muda.</p>
      </div>

      <div role="tablist" aria-label="Autores do trio" className="flex flex-wrap gap-2">
        {autores.map((a, i) => (
          <button
            key={a.autor}
            role="tab"
            aria-selected={i === indice}
            onClick={() => setIndice(i)}
            className={`px-3 py-1.5 rounded-full border type-meta t-colors ${i === indice ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
          >
            {a.autor === 'Drummond' ? 'Drummond + Pacto' : a.autor}
          </button>
        ))}
      </div>

      <div className="space-y-4" role="tabpanel" aria-label={atual.nome}>
        <div>
          <p className="type-rotulo text-primary-text">{atual.parte}</p>
          <p className="type-rotulo text-muted-foreground mt-2">Fica igual em todo tema</p>
          <p className="font-reading type-body italic measure-reading">&ldquo;{atual.fala}&rdquo; ({atual.nome})</p>
        </div>

        <div>
          <p className="type-rotulo text-muted-foreground mb-1">Muda em cada tema</p>
          <ul className="space-y-1.5">
            {atual.usos.map((u) => (
              <li key={u.modeloId}>
                <button
                  onClick={() => onEscolherModelo(u.modeloId)}
                  aria-current={u.modeloId === modeloAtualId ? 'true' : undefined}
                  className={`w-full text-left rounded-[var(--radius-control)] px-3 py-2 t-colors ${u.modeloId === modeloAtualId ? 'bg-muted' : 'hover:bg-muted/60'}`}
                >
                  <span className="type-meta font-semibold block">{u.rotulo}</span>
                  <span className="type-meta text-muted-foreground">{u.comoUsa}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-rotulo text-muted-foreground mb-1">O molde da ligação</p>
          <p className="type-meta measure-reading">{atual.molde}</p>
        </div>
      </div>
    </section>
  );
}
