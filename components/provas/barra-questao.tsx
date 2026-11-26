'use client';

/* Botões fixos embaixo da prova (quadro de 26/11/2026): sempre no mesmo lugar. */
export function BarraQuestao({ podeVoltar, onAnterior, marcada, onMarcar, principal }: {
  podeVoltar: boolean;
  onAnterior: () => void;
  marcada: boolean;
  onMarcar: (() => void) | null;
  principal: { rotulo: string; onClick: () => void; desligado?: boolean };
}) {
  const neutro = 'min-h-12 px-3 md:px-5 rounded-[var(--radius-control)] border border-border type-meta font-medium t-colors disabled:opacity-40';
  return (
    <div className="sticky bottom-0 z-10 -mx-5 -mb-5 md:-mx-8 md:-mb-8 mt-6 px-5 md:px-8 py-3 flex items-center justify-between gap-2 bg-[hsl(var(--surface-1))] border-t border-border">
      <button type="button" disabled={!podeVoltar} onClick={onAnterior} className={`${neutro} text-foreground`}>
        Anterior
      </button>
      {onMarcar && (
        <button
          type="button"
          aria-pressed={marcada}
          onClick={onMarcar}
          className={`${neutro} ${marcada ? 'bg-[hsl(var(--chart-5)/.25)] text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {marcada ? 'Marcada' : 'Revisar depois'}
        </button>
      )}
      <button
        type="button"
        onClick={principal.onClick}
        disabled={principal.desligado}
        className="min-h-12 px-4 md:px-8 rounded-[var(--radius-control)] bg-primary text-primary-foreground font-medium type-meta shadow-elev-2 disabled:opacity-40"
      >
        {principal.rotulo}
      </button>
    </div>
  );
}
