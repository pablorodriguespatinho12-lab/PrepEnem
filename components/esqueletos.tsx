/* Esqueletos de carregamento (21/10/2026, referência de fluidez: Nubank).
   No lugar do círculo girando, o rascunho da tela que vai chegar: o olho já
   sabe onde cada coisa fica e a troca não dá salto. O Início já fazia assim.
   Pulso só com motion-safe: sob "reduzir movimento" o bloco fica parado. */

const BLOCO = 'bg-muted motion-safe:animate-pulse';

function Bloco({ className }: { className: string }) {
  return <div aria-hidden className={`${BLOCO} ${className}`} />;
}

type Props = { rotulo: string };

/* Título + grade de cartões (Flashcards, baralhos). */
export function EsqueletoGrade({ rotulo, cartoes = 10 }: Props & { cartoes?: number }) {
  return (
    <div role="status" aria-label={rotulo} className="space-y-6">
      <Bloco className="h-10 w-56 rounded-[var(--radius-control)]" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: cartoes }, (_, i) => (
          <div key={i} className="surface-1 rounded-[var(--radius-surface)] p-5 space-y-3">
            <Bloco className="h-14 w-14 rounded-[var(--radius-control)]" />
            <Bloco className="h-5 w-3/4 rounded-[var(--radius-data)]" />
            <Bloco className="h-3 w-1/2 rounded-[var(--radius-data)]" />
            <Bloco className="h-1.5 w-full rounded-[var(--radius-data)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Título + linhas (Cálculo, Caderno de erros, Redação, Progresso). */
export function EsqueletoLista({ rotulo, linhas = 6 }: Props & { linhas?: number }) {
  return (
    <div role="status" aria-label={rotulo} className="space-y-6">
      <div className="space-y-2">
        <Bloco className="h-3 w-32 rounded-[var(--radius-data)]" />
        <Bloco className="h-9 w-72 max-w-full rounded-[var(--radius-control)]" />
      </div>
      <div className="surface-1 rounded-[var(--radius-surface)] p-5 space-y-5">
        {Array.from({ length: linhas }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Bloco className="h-4 w-4 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Bloco className="h-4 w-2/5 rounded-[var(--radius-data)]" />
              <Bloco className="h-3 w-3/5 rounded-[var(--radius-data)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Cartão de questão ou de flashcard (Treino, prova, baralho). */
export function EsqueletoQuestao({ rotulo }: Props) {
  return (
    <div role="status" aria-label={rotulo} className="surface-1 rounded-[var(--radius-surface)] p-6 md:p-8 space-y-5 max-w-2xl">
      <Bloco className="h-3 w-40 rounded-[var(--radius-data)]" />
      <div className="space-y-2">
        <Bloco className="h-5 w-full rounded-[var(--radius-data)]" />
        <Bloco className="h-5 w-11/12 rounded-[var(--radius-data)]" />
        <Bloco className="h-5 w-2/3 rounded-[var(--radius-data)]" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Bloco key={i} className="h-12 w-full rounded-[var(--radius-control)]" />
        ))}
      </div>
    </div>
  );
}

/* O app inteiro enquanto a sessão chega (abrir o site): menu + conteúdo. */
export function EsqueletoApp() {
  return (
    <div role="status" aria-label="Abrindo o PrepEnem" className="min-h-screen bg-background">
      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col gap-3 border-r border-border p-4">
        <Bloco className="h-10 w-40 rounded-[var(--radius-control)] mb-6" />
        {Array.from({ length: 7 }, (_, i) => (
          <Bloco key={i} className="h-9 w-full rounded-[var(--radius-control)]" />
        ))}
      </div>
      <div className="md:ml-64 p-4 md:p-8 pt-16 md:pt-8 max-w-6xl">
        <div className="surface-1 rounded-[var(--radius-surface)] p-6 space-y-4">
          <Bloco className="h-8 w-28 rounded-[var(--radius-control)]" />
          <Bloco className="h-4 w-64 max-w-full rounded-[var(--radius-data)]" />
          <Bloco className="h-4 w-56 max-w-full rounded-[var(--radius-data)]" />
          <Bloco className="h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
