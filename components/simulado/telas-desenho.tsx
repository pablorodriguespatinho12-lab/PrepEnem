import type { AulaEmDesenho, TipoProporcao } from '@/lib/aulas-desenho';
import { DesenhoPixel as Pixel } from '@/components/visual/desenho-pixel';

/* O desenho vira pixel art (Pablo, 14/11/2026); os rótulos ficam nítidos por cima. */
function DesenhoPixel({ svg }: { svg: string }) {
  return <div className="rounded-[var(--radius-control)] bg-muted/60 p-2"><Pixel svg={svg} /></div>;
}

export function TelaDesenho({ d }: { d: AulaEmDesenho }) {
  return (
    <div className="aula-desenho space-y-4">
      <DesenhoPixel svg={d.svg} />
      <ul className="space-y-2">
        {d.pecas.map(([imagem, nome], i) => (
          <li key={`${i}-${nome}`} className="grid grid-cols-[1fr_auto_1fr] gap-2 items-baseline font-reading type-body">
            <span>{imagem}</span>
            <span aria-hidden className="text-muted-foreground">→</span>
            <span className="font-semibold text-primary-text">{nome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TelaSentido({ d }: { d: AulaEmDesenho }) {
  return (
    <div className="space-y-4">
      <p className="font-reading type-body">{d.sentido}</p>
      <div
        className="rounded-[var(--radius-control)] bg-primary/10 p-4 font-reading type-body"
        dangerouslySetInnerHTML={{ __html: d.conta }}
      />
    </div>
  );
}

const SELO: Record<TipoProporcao, { rotulo: string; classe: string }> = {
  direta: { rotulo: 'Direta', classe: 'bg-primary/15 text-primary-text' },
  inversa: { rotulo: 'Inversa', classe: 'bg-[hsl(24_90%_50%/0.15)] text-[hsl(24_80%_38%)] dark:text-[hsl(24_95%_66%)]' },
  outra: { rotulo: 'Nem direta nem inversa', classe: 'bg-muted text-muted-foreground' },
};

export function TelaProporcoes({ d }: { d: AulaEmDesenho }) {
  return (
    <div className="aula-desenho space-y-4">
      {d.desenhoLogica && (
        <DesenhoPixel svg={d.desenhoLogica} />
      )}
      <ul className="space-y-3">
        {d.proporcoes.map((p) => (
          <li key={p.par} className="space-y-1">
            <span className="flex flex-wrap items-center gap-2 type-meta font-semibold">
              <span className={`type-caption uppercase tracking-wide px-2 py-0.5 rounded-full ${SELO[p.tipo].classe}`}>{SELO[p.tipo].rotulo}</span>
              {p.par}
            </span>
            <p className="font-reading type-body">{p.exemplo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
